const express = require('express');
const { nanoid } = require('nanoid');
const Url = require('../models/url');
const redisClient = require('../utils/redisClient');

const router = express.Router();

router.post('/', async (req, res) => {
  const { long_url } = req.body;

  if (!long_url || !/^https?:\/\/[^\s/$.?#].[^\s]*$/.test(long_url)) {
    return res.status(400).send({ error: 'Invalid URL format' });
  }

  try {
    // Check if URL already exists
    const existing = await Url.findOne({ long_url });
    if (existing) {
      return res.json({ short_url: `http://short.ly/${existing.short_url}` });
    }

    // Generate short URL
    const short_url = nanoid(6);
    const newUrl = new Url({ short_url, long_url });
    await newUrl.save();
    await redisClient.set(short_url, long_url);

    res.json({ short_url: `http://short.ly/${short_url}` });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

module.exports = router;
