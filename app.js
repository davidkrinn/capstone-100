const weatherStatus = document.getElementById('weather-status');
const weatherTemp = document.getElementById('weather-temp');

const weatherConditions = {
  0: ['Clear', '☀️'],
  1: ['Mainly clear', '🌤️'],
  2: ['Partly cloudy', '⛅'],
  3: ['Overcast', '☁️'],
  45: ['Fog', '🌫️'],
  48: ['Fog', '🌫️'],
  51: ['Light drizzle', '🌦️'],
  53: ['Moderate drizzle', '🌧️'],
  55: ['Dense drizzle', '🌧️'],
  56: ['Freezing drizzle', '🌧️'],
  57: ['Freezing drizzle', '🌧️'],
  61: ['Light rain', '🌧️'],
  63: ['Moderate rain', '🌧️'],
  65: ['Heavy rain', '🌧️'],
  66: ['Freezing rain', '🌧️'],
  67: ['Freezing rain', '🌧️'],
  71: ['Light snow', '🌨️'],
  73: ['Moderate snow', '🌨️'],
  75: ['Heavy snow', '🌨️'],
  77: ['Snow grains', '❄️'],
  80: ['Rain showers', '🌧️'],
  81: ['Rain showers', '🌧️'],
  82: ['Rain showers', '🌧️'],
  85: ['Snow showers', '🌨️'],
  86: ['Snow showers', '🌨️'],
  95: ['Thunderstorm', '⛈️'],
  96: ['Thunderstorm', '⛈️'],
  99: ['Thunderstorm', '⛈️']
};

function updateWeatherCard(weather) {
  const [description, emoji] = weatherConditions[weather.weathercode] || ['Unknown', '❓'];
  weatherStatus.textContent = `${emoji} ${description}`;
  weatherTemp.textContent = `${Math.round(weather.temperature)}°F`;
}

function handleError(message) {
  weatherStatus.textContent = message;
  weatherTemp.textContent = '—';
}

function fetchWeather(lat, lon) {
  fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=fahrenheit`)
    .then((response) => {
      if (!response.ok) throw new Error('Weather data unavailable');
      return response.json();
    })
    .then((data) => {
      if (data.current_weather) {
        updateWeatherCard(data.current_weather);
      } else {
        handleError('Weather data unavailable');
      }
    })
    .catch(() => {
      handleError('Unable to load weather');
    });
}

if ('geolocation' in navigator) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      fetchWeather(position.coords.latitude, position.coords.longitude);
    },
    () => {
      handleError('Enable locations to see your weather');
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
  );
} else {
  handleError('Geolocation not supported');
}
