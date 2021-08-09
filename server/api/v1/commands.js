const express = require('express');
const fetch = require('isomorphic-unfetch');

// Scores main router.
const router = express.Router();

// NOTE: Wrapper to amenic-api command routes.
const BASE_PATH = 'http://amenic-1330023954.sa-east-1.elb.amazonaws.com';
const COMMANDS_PATH = `${BASE_PATH}/admin/commands`;
const COMMAND_PATH = `${BASE_PATH}/admin/command`;

function getAuthPath(path) {
  return `${path}?api_key=${process.env.ADMIN_KEY}`;
}

/**
 * Return all commands.
 *
 * @GET /api/v1/commands
 */
router.get('/', async (req, res) => {
  try {
    fetch(getAuthPath(COMMANDS_PATH))
      .then((r) => {
        if (r.ok) {
          return r.json();
        }
        throw new Error('something went wrong');
      })
      .then(({ data }) => res.send(data));
  } catch (err) {
    res.json({ error: err.message || err.toString() });
  }
});

/**
 * Starts a command
 *
 * @POST /api/v1/commands
 */
router.post('/', async (req, res) => {
  try {
    fetch(getAuthPath(COMMAND_PATH), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    })
      .then((r) => {
        if (r.ok) {
          return r.json();
        }
        throw new Error('something went wrong');
      })
      .then(data => res.send(data));
  } catch (err) {
    res.json({ error: err.message || err.toString() });
  }
});

module.exports = router;
