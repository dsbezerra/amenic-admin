const express = require('express');
const winston = require('winston');
const os = require('os');
const { spawn } = require('child_process');
const {
  sendTimeout,
  sendMovieNotFound,
  sendUnknown,
} = require('./helpers/response');

const stringUtils = require('../../../utils/string');

const Score = require('../../db/api/Score');
const scoreQuery = require('./builders/score-query');

// Binaries base path.
const BIN_PATH = `${process.cwd()}/bin`;

// Movie score finder application filename.
const MOVIE_SCORE_NAME = 'movie-score-v1';

// Full file path for movie score finder application.
const MOVIE_SCORE_PATH = `${BIN_PATH}/${MOVIE_SCORE_NAME}`;

/**
* Rotten Tomatoes or IMDb can be down so we use this to return
* as soon as this amount of time is passed.
*/
const MAX_RESPONSE_TIMEOUT = 1000 * 10;

// Scores main router.
const router = express.Router();

/**
 * Return all scores with optional filtering.
 *
 * @GET /api/v1/scores
 */
router.get('/', async (req, res) => {
  try {
    const opts = scoreQuery(req);
    const { scores } = await Score.list(opts);
    res.json({ scores });
  } catch (err) {
    res.json({ error: err.message || err.toString() });
  }
});

/**
 * Return scores doc matching id.
 *
 * @GET /api/v1/scores/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const { scores } = await Score.getById(req.params.id);
    res.json({ scores });
  } catch (err) {
    res.json({ error: err.message || err.toString() });
  }
});

/**
 * Creates a score doc.
 *
 * @POST /api/v1/scores
 */
router.post('/', async (req, res) => {
  try {
    await Score.add(req.body);
    res.json({ success: true });
  } catch (err) {
    res.json({ error: err.message || err.toString() });
  }
});

/**
 * Update a score doc.
 *
 * @PUT /api/v1/scores
 */
router.put('/', async (req, res) => {
  try {
    await Score.edit(req.body);
    res.json({ success: true });
  } catch (err) {
    res.json({ error: err.message || err.toString() });
  }
});

/**
 * Synchronizes IMDb and Rotten Tomatoes scores.
 *
 * @POST /api/v1/scores/:id/sync
 */
router.post('/:id/sync', async (req, res) => {
  // TODO(diego): Implement.
  res.json({ message: 'to be implemented' });
});

/**
 * Synchronizes IMDb and Rotten Tomatoes scores of marked to keep synced documents.
 *
 * @POST /api/v1/scores/sync
 */
router.post('/sync', async (req, res) => {
  // TODO(diego): Implement.
  res.json({ message: 'to be implemented' });
});

const getServiceInfo = (s) => {
  const result = {
    id: null,
    name: null,
    baseUrl: null,
  };

  if (s === 'imdb') {
    result.id = 'imdb';
    result.name = 'Internet Movie Database';
    result.baseUrl = 'https://imdb.com/';
  } else {
    result.id = 'rotten';
    result.name = 'Rotten Tomatoes';
    result.baseUrl = 'https://rottentomatoes.com/';
  }

  return result;
};

/**
 * Search for movie score on one of the two services (imdb, rotten)
 *
 * @POST /api/v1/scores/search
 */
router.post('/search', async (req, res) => {
  const { q, s } = req.query;

  const { info, error } = winston;
  info('[/api/v1/scores/search] Incoming request with query', req.query);

  if (!q) {
    res.json({ error: 'missing query' });

    info('Ignored. Reason: missing query');
  } else if (!s) {
    res.json({ error: 'missing service (imdb or rotten)' });

    info('Ignored. Reason: missing service');
  } else {
    // TODO(diego): Add imdb here.
    // Perform search and send back results.
    const args = ['-o', 'search', '-p', s, '-q', q];
    info('Starting %s with args', MOVIE_SCORE_NAME, args);

    const start = process.hrtime();
    const osType = os.type();

    let filePath = MOVIE_SCORE_PATH;
    if (stringUtils.containsIgnoreCase(osType, 'Darwin')) filePath += '-osx';
    if (stringUtils.containsIgnoreCase(osType, 'Linux')) filePath += '-linux';
    if (stringUtils.containsIgnoreCase(osType, 'Windows')) filePath += '.exe';

    try {
      let shouldClearTimeout = false;
      let alreadySent = false;
      const child = spawn(filePath, args);
      const timeout = setTimeout(() => {
        if (shouldClearTimeout) {
          clearTimeout(timeout);
          return;
        }

        info('search operation timeout');

        if (!child.killed) {
          info('killing %s process', MOVIE_SCORE_NAME);
          child.kill();
        }

        if (!alreadySent) {
          sendTimeout(res, 'search operation timeout');
        }
      }, MAX_RESPONSE_TIMEOUT);

      child.stdout.on('data', (data) => {
        // Converts buffer to string so we can easily use built-in methods.
        const outputString = data.toString();

        // NOTE(diego, 18 mar 2018): Sometimes this single data buffer contains
        // bytes of more than one print calls of the main program.
        //
        // Because of this (and the fact the our program prints a
        // line break at the end of each print call) we can use this
        // line break solution to get the bytes before the possible
        // next command.
        //
        // If the command give us want we want we ignore the rest.
        const firstLineBreak = outputString.indexOf('\n');
        if (stringUtils.contains(outputString, 'JSON_RESULT=')) {
          shouldClearTimeout = true;

          const end = process.hrtime(start);

          const jsonResultIndex = outputString.indexOf('JSON_RESULT=');
          const jsonStartIndex = jsonResultIndex + 'JSON_RESULT='.length;
          const {
            movies,
            movieCount,
          } = JSON.parse(outputString.slice(jsonStartIndex, firstLineBreak));

          info('%s found %d movie(s) with query "%s"', MOVIE_SCORE_NAME, movieCount, q);
          info('%s search operation took %ds"', MOVIE_SCORE_NAME, end[0]);

          alreadySent = true;
          res.json({ service: getServiceInfo(s), movies, movieCount });
        } else if (outputString.startsWith('EXIT=')) {
          shouldClearTimeout = true;

          const message = outputString.slice('EXIT='.length, firstLineBreak);

          alreadySent = true;
          if (stringUtils.containsIgnoreCase(message, 'no movies found')) {
            sendMovieNotFound(res, message);
          } else {
            sendUnknown(res, message);
          }
        }
      });

      child.on('close', (code, signal) => {
        shouldClearTimeout = true;
        info(
          '%s terminated with code %d due to process signal %s.',
          MOVIE_SCORE_NAME, code, signal,
        );
      });

      child.on('exit', (code) => {
        shouldClearTimeout = true;
        info('%s exited with code %d', MOVIE_SCORE_NAME, code);
      });
    } catch (err) {
      error(error.message || err.toString());
      res.json({ error: err.message || err.toString() });
    }
  }
});

module.exports = router;
