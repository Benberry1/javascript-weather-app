if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const app = express();
const axios = require('axios');

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

app.use(express.json());
app.use(express.static('../public'));

app.post('/weather/api', (req, res, error) => {});

module.exports = app;
