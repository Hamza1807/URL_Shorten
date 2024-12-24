const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const redisClient = require('./utils/redisClient');
const shortenRoutes = require('./routes/shorten');
const redirectRoutes = require('./routes/redirect');

dotenv.config();
const app = express();
app.use(express.json());

// Default route for root path
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the URL Shortener Service!',
    endpoints: {
      shorten: {
        method: 'POST',
        path: '/shorten',
        description: 'Shortens a long URL.',
        example_request: {
          long_url: 'https://example.com',
        },
        example_response: {
          short_url: 'http://short.ly/abc123',
        },
      },
      redirect: {
        method: 'GET',
        path: '/:short_url',
        description: 'Redirects to the original URL.',
      },
    },
  });
});

// Routes
app.use('/shorten', shortenRoutes);
app.use('/', redirectRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Handle errors for unknown routes
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
