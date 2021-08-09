const express = require('express');
const search = require('youtube-search');

const API_KEY = 'AIzaSyDjKKsSw6AdlWrEtEyLdR18IKzVL25QEzg';

const router = express.Router();

router.post('/youtube/search', async (req, res) => {
  try {
    const opts = {
      maxResults: parseInt(req.body.maxResults, 10) || 10,
      key: API_KEY,
    };
    res.json(await search(req.body.query, opts));
  } catch (err) {
    res.json({ error: err.message || err.toString() });
  }
});

module.exports = router;
