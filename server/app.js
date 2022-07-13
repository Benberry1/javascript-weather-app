if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const express = require('express');
const app = express();
const fetch = require('node-fetch');

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

app.use(express.json());
app.use(express.static('../public'));

app.post('/api/weather/current', async (req, res) => {
  try {
    const url = `http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${req.body.latitude},${req.body.longitude}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    if (response.ok) {
      const data = await response.json();
      return res.status(200).send(data);
    } else {
      throw new Error('Something went wrong!');
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send('Something went wrong! Please try again');
  }
});

module.exports = app;
