const express = require('express');
const Movie = require('../../db/api/Movie');

const router = express.Router();

// TODO: Refactor.
//
// This returns a list of genres by combining all genres of movies.
//
// Create a collection of genres later!!!!.
router.get('/', async (req, res) => {
  try {
    res.json(await Movie.listGenres());
  } catch (err) {
    res.json({ error: err.message || err.toString() });
  }
});

module.exports = router;
