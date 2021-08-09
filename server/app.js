const compression = require('compression');
const express = require('express');
const session = require('express-session');
const enforce = require('express-sslify');
const mongoSessionStore = require('connect-mongo');
const busboy = require('connect-busboy');
const bodyParser = require('body-parser');
const next = require('next');
const bcrypt = require('bcrypt');

require('dotenv').config();

const db = require('./db');
const api = require('./api');
const runTasks = require('./task');

const Admin = require('./db/api/Admin');


const dev = process.env.NODE_ENV !== 'production';

const port = process.env.PORT || 9000;
const ROOT_URL = process.env.ROOT_URL || `http://localhost:${port}`;

const app = next({ dev });
const handle = app.getRequestHandler();

const config = {
  ENFORCE_SSL: true,
  TRUST_PROXY: true,
  SECURE_COOKIES: true,
  INIT_DATABASES: false,
  RUN_TASKS: true,
};

// Nextjs's server prepared
app.prepare().then(() => {
  const server = express();

  process.env.CONFIG_FLAGS.split(';')
    .forEach((f) => {
      const parts = f.split('=');
      config[parts[0].toUpperCase()] = parts[1] === 'true';
    });

  if (config.ENFORCE_SSL) {
    server.use(enforce.HTTPS({ trustProtoHeader: true }));
  }

  server.use(busboy());
  server.use(compression());
  server.use(bodyParser.urlencoded({ extended: true }));
  server.use(bodyParser.json());

  // confuring MongoDB session store
  const MongoStore = mongoSessionStore(session);
  const sess = {
    name: 'amenic-admin.sid',
    secret: 'HD2w.)q*VqRT4/#NK2M/,E^B)}FED5fWU!dKe[wc',
    store: new MongoStore({
      mongooseConnection: db.api,
      collection: 'admin-sessions',
      ttl: 14 * 24 * 60 * 60, // save session 14 days
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 14 * 24 * 60 * 60 * 1000,
    },
  };

  if (config.TRUST_PROXY) {
    server.set('trust proxy', 1); // trust first proxy
  }
  if (config.SECURE_COOKIES) {
    sess.cookie.secure = true; // serve secure cookies
  }

  server.use(session(sess));

  // Login and logout endpoints
  server.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      res.send({
        error: 'Invalid username or password',
      });
    } else {
      try {
        const admin = await Admin.getByUsername(username);
        bcrypt.compare(password, admin.password, (err, match) => {
          if (err) res.json({ error: err.message || err.toString() });

          if (match) {
            const { _id } = admin;
            req.session.user = { _id, username, isAdmin: true };
            req.session.save((error) => {
              if (error) res.json({ error: error.message || error.toString() });
              else res.json({ success: true, user: req.session.user });
            });
          } else {
            res.send({
              error: 'Invalid username or password',
            });
          }
        });
      } catch (err) {
        if (err.message === 'Admin not found') {
          res.json({ error: 'Invalid username or password' });
        } else {
          res.json({ error: err.message || err.toString() });
        }
      }
    }
  });

  server.get('/logout', (req, res) => {
    req.session.destroy(() => {
      res.redirect('/login');
    });
  });

  api(server);

  if (config.RUN_TASKS) {
    runTasks();
  }

  if (config.INIT_DATABASES) {
    // eslint-disable-next-line global-require
    const initApiDatabase = require('./db/api/_init');
    initApiDatabase();
  }


  server.get('*', (req, res) => handle(req, res));

  // starting express server
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on ${ROOT_URL}`); // eslint-disable-line no-console
  });
}).catch(err => console.log(err));
