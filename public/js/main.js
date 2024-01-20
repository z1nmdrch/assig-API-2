document.addEventListener('DOMContentLoaded', () => {
  fetchWeatherData();
});

async function fetchWeatherData() {
  try {
    const { coords } = await getCurrentLocation();
    const { latitude, longitude } = coords;

    const response = await fetch(`/weather/${latitude}/${longitude}`);
    const data = await response.json();

    displayWeatherData(data);
  } catch (error) {
    console.error(error);
    displayError('Failed to fetch weather data.');
  }
}

function kelvinToCelsius(kelvin) {
  return kelvin - 273.15;
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
