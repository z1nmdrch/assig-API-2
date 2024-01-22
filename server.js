const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static('public'));

const apiKey = '589d2cbac6dfd0560ddb2e0489b00664';


app.get('/weather/:lat/:lon', async (req, res) => {
  try {
    const { lat, lon } = req.params;
    const weatherResponse = await axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`);
    res.json(weatherResponse.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/air-pollution/:lat/:lon', async (req, res) => {

  try {
    const { lat, lon } = req.params;
    const airPollutionResponse = await axios.get(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`);
    res.json(airPollutionResponse.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/maps/:op/:z/:x/:y', async (req, res) => {
  try {
    const { op, z, x, y } = req.params;
    const mapsResponse = await axios.get(`http://maps.openweathermap.org/maps/2.0/weather/${op}/${z}/${x}/${y}?appid=${apiKey}`);

    res.json(mapsResponse.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

async function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}