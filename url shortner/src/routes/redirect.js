const express = require('express');
const Url = require('../models/url');
const redisClient = require('../utils/redisClient');

const router = express.Router();

router.get('/:short_url', async (req, res) => {
  const { short_url } = req.params;

  try {
    // Check in Redis
    const cachedUrl = await redisClient.get(short_url);
    if (cachedUrl) {
      return res.redirect(cachedUrl);
    }

    // Check in MongoDB
    const url = await Url.findOne({ short_url });
    if (url) {
      await redisClient.set(short_url, url.long_url);
      return res.redirect(url.long_url);
    }

    res.status(404).send({ error: 'URL not found' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

module.exports = router;
