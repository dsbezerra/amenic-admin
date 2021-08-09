const apiKeysV1 = require('./v1/api-keys');
// const theatersApiV1 = require('./v1/theaters');
const citiesApiV1 = require('./v1/cities');
const commandsApiV1 = require('./v1/commands');
const imagesApiV1 = require('./v1/images');
const genresApiV1 = require('./v1/genres');
// const moviesApiV1 = require('./v1/movies');
const notificationsApiV1 = require('./v1/notifications');
const scoresApiV1 = require('./v1/scores');
const servicesApiV1 = require('./v1/services');
const statesApiV1 = require('./v1/states');
const tasksApiV1 = require('./v1/tasks');
const logsApiV1 = require('./v1/logs');

module.exports = (server) => {
  /**
     * NOTE(diego): Added only to make dev tests simpler.
     */
  if (process.env.AUTH_STATE !== 'disabled') {
    server.use('/api', (req, res, next) => {
      if (!req.session.user || !req.session.user.isAdmin) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      next();
    });
  }
  /** Registers v1 apikeys middleware */
  server.use('/api/v1/apikeys', apiKeysV1);

  /** Registers v1 cities middleware */
  server.use('/api/v1/cities', citiesApiV1);

  /** Registers v1 commands middleware */
  server.use('/api/v1/commands', commandsApiV1);

  /** Register v1 images middleware */
  server.use('/api/v1/images', imagesApiV1);

  /** Registers v1 genres middleware */
  server.use('/api/v1/genres', genresApiV1);

  /** Register v1 movies middleware */
  // server.use('/api/v1/movies', moviesApiV1);

  /** Register v1 notifications middleware */
  server.use('/api/v1/notifications', notificationsApiV1);

  /** Registers v1 scores middleware */
  server.use('/api/v1/scores', scoresApiV1);

  /** Registers v1 services middleware */
  server.use('/api/v1/services', servicesApiV1);

  /** Registers v1 states middleware */
  server.use('/api/v1/states', statesApiV1);

  /** Registers v1 tasks middleware */
  server.use('/api/v1/tasks', tasksApiV1);

  /** Registers v1 theaters middleware */
  // server.use('/api/v1/theaters', theatersApiV1);

  /** Registers v1 ;logs middleware */
  server.use('/api/v1/logs', logsApiV1);
};
