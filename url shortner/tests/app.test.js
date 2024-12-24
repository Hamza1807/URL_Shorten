const request = require('supertest');
const express = require('express');
const shortenRoutes = require('../src/routes/shorten');
const redirectRoutes = require('../src/routes/redirect');

const app = express();
app.use(express.json());
app.use('/shorten', shortenRoutes);
app.use('/', redirectRoutes);

describe('URL Shortener', () => {
  it('should shorten a valid URL', async () => {
    const response = await request(app)
      .post('/shorten')
      .send({ long_url: 'https://example.com' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('short_url');
  });

  it('should return 400 for an invalid URL', async () => {
    const response = await request(app)
      .post('/shorten')
      .send({ long_url: 'invalid-url' });
    expect(response.statusCode).toBe(400);
  });

  it('should redirect to the original URL', async () => {
    const shortenResponse = await request(app)
      .post('/shorten')
      .send({ long_url: 'https://example.com' });
    const shortUrl = shortenResponse.body.short_url.split('/').pop();

    const redirectResponse = await request(app).get(`/${shortUrl}`);
    expect(redirectResponse.statusCode).toBe(302);
    expect(redirectResponse.headers.location).toBe('https://example.com');
  });
});
