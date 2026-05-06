const weatherStatus = document.getElementById('weather-status');
const weatherTemp = document.getElementById('weather-temp');
const weatherFallbackMessage = "Looks like there's a bit of rain on this parade. Try again later or refresh your page.";

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
  weatherStatus.textContent = message || weatherFallbackMessage;
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
        handleError(weatherFallbackMessage);
      }
    })
    .catch(() => {
      handleError(weatherFallbackMessage);
    });
}

function requestLocationAndWeather() {
  weatherStatus.textContent = 'Please allow location access to load your weather';

  navigator.geolocation.getCurrentPosition(
    (position) => {
      fetchWeather(position.coords.latitude, position.coords.longitude);
    },
    (error) => {
      if (error.code === error.PERMISSION_DENIED) {
        handleError(weatherFallbackMessage);
        return;
      }

      if (error.code === error.TIMEOUT) {
        handleError(weatherFallbackMessage);
        return;
      }

      handleError(weatherFallbackMessage);
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
  );
}

if (weatherStatus && weatherTemp) {
  if (!window.isSecureContext) {
    handleError(weatherFallbackMessage);
  } else if (!('geolocation' in navigator)) {
    handleError(weatherFallbackMessage);
  } else if ('permissions' in navigator && navigator.permissions.query) {
    navigator.permissions
      .query({ name: 'geolocation' })
      .then((permissionStatus) => {
        if (permissionStatus.state === 'denied') {
          handleError(weatherFallbackMessage);
          return;
        }

        requestLocationAndWeather();
      })
      .catch(() => {
        requestLocationAndWeather();
      });
  } else {
    requestLocationAndWeather();
  }
}
