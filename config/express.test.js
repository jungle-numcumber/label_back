const request = require('supertest');
const express = require('./express');

let app = express();

describe('Start Test', () => {
    describe('GET /test', () => {
      test('responds with json', async () => {
        await request(app)
          .get('/test')
          .expect(200)
      });
    });
});