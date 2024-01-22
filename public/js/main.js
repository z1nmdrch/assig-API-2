document.addEventListener('DOMContentLoaded', async () => {
  try {
    const { coords } = await getCurrentLocation();
    const { latitude, longitude } = coords;
    

    
    const airPollutionResponse = await fetch(`/air-pollution/${latitude}/${longitude}`);
    const airPollutionData = await airPollutionResponse.json();

    const weatherResponse = await fetch(`/weather/${latitude}/${longitude}`);
    const weatherData = await weatherResponse.json();

    displayAirPollutionData(airPollutionData);
    displayWeatherData(weatherData);
    
    const map = L.map('map').setView([latitude, longitude], 10);

    const apiKey = '589d2cbac6dfd0560ddb2e0489b00664';

    L.tileLayer(`http://maps.openweathermap.org/maps/2.0/weather/{op}/{z}/{x}/{y}?appid=${apiKey}`, {
      attribution: '© OpenWeatherMap',
      op: 'clouds_new',
    }).addTo(map);
  } catch (error) {
    console.error(error);
    displayError('Failed to fetch weather data.');
  }
});



function kelvinToCelsius(kelvin) {
  return kelvin - 273.15;
}

function displayAirPollutionData(data) {
  const airPollutionContainer = document.getElementById('airPollutionData');
  const airQualityIndex = data.list[0].main.aqi;
  const pollutants = data.list[0].components;

  const html = `
    <div class="row">
      <div class="col-md-12">
        <p><strong>Air Quality Index (AQI):</strong> ${airQualityIndex}</p>
        <p><strong>CO:</strong> ${pollutants.co} µg/m³</p>
        <p><strong>NO:</strong> ${pollutants.no} µg/m³</p>
        <p><strong>NO2:</strong> ${pollutants.no2} µg/m³</p>
        <p><strong>O3:</strong> ${pollutants.o3} µg/m³</p>
        <p><strong>SO2:</strong> ${pollutants.so2} µg/m³</p>
        <p><strong>PM2.5:</strong> ${pollutants.pm2_5} µg/m³</p>
        <p><strong>PM10:</strong> ${pollutants.pm10} µg/m³</p>
      </div>
    </div>
  `;

  airPollutionContainer.innerHTML = html;
}

function displayWeatherData(data) {
  const weatherDataContainer = document.getElementById('weatherData');
  const temperatureKelvin = data.main.temp;
  const temperatureCelsius = kelvinToCelsius(temperatureKelvin);
  const description = data.weather[0].description;
  const feelsLikeKelvin = data.main.feels_like;
  const feelsLikeCelsius = kelvinToCelsius(feelsLikeKelvin);
  const humidity = data.main.humidity;
  const pressure = data.main.pressure;
  const windSpeed = data.wind.speed;
  const country = data.sys.country;
  const rainVolume = data.rain ? data.rain['1h'] || 0 : 0;
  
  const html = `
    <div class="row">
      <div class="col-md-6">
        <p><strong>Temperature:</strong> ${temperatureCelsius.toFixed(2)} °C</p>
        <p><strong>Description:</strong> ${description}</p>
        <p><strong>Feels Like:</strong> ${feelsLikeCelsius.toFixed(2)} °C</p>
      </div>
      <div class="col-md-6">
        <p><strong>Humidity:</strong> ${humidity}%</p>
        <p><strong>Pressure:</strong> ${pressure} hPa</p>
        <p><strong>Wind Speed:</strong> ${windSpeed} m/s</p>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-md-12">
        <p><strong>Country:</strong> ${country}</p>
        <p><strong>Rain Volume (last 1h):</strong> ${rainVolume} mm</p>
      </div>
    </div>
  `;

  weatherDataContainer.innerHTML = html;
}


function displayError(message) {
  const weatherDataContainer = document.getElementById('weatherData');
  weatherDataContainer.innerHTML = `<p class="text-danger">${message}</p>`;
}

async function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}
