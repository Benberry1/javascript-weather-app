const notificationElement = document.querySelector('.notification-div');
const messageElement = document.querySelector('.error-message');
const closeElement = document.querySelector('.fa-xmark');

const closeError = () => {
  notificationElement.style.display = 'none';
};

closeElement.addEventListener('click', closeError);

// fetch weather data from our own nodejs post route.
const fetchData = async (lat, long) => {
  try {
    const response = await fetch('/api/weather/current', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        latitude: lat,
        longitude: long,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    }
    if (!response.ok) {
      throw new Error(response.statusText);
    }
  } catch (error) {
    messageElement.textContent = 'Something went wrong! Please try again';
    notificationElement.style.display = 'flex';
    return;
  }
};

// geolocation
const setPosition = (position) => {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  fetchData(latitude, longitude).then((data) => {
    setWeatherData(data);
  });
};

const showError = (error) => {
  messageElement.textContent = `${error.message}`;
  notificationElement.style.display = 'flex';
};

if ('geolocation' in navigator) {
  navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
  messageElement.textContent = `Browser does not support geolocation`;
  notificationElement.style.display = 'block';
}

const searchElement = document.querySelector('.city-search');

// google api attaching searchBox to our searchElement
const searchBox = new google.maps.places.SearchBox(searchElement);

searchBox.addListener('places_changed', () => {
  const place = searchBox.getPlaces()[0];
  if (place == null) return;
  const latitude = place.geometry.location.lat();
  const longitude = place.geometry.location.lng();

  fetchData(latitude, longitude).then((data) => {
    setWeatherData(data, place.formatted_address);
  });

  notificationElement.style.display = 'none';
});

// elements needing to be changed
const bgDivOne = document.querySelector('.bg-div-one');
const bgDivTwo = document.querySelector('.bg-div-two');
const sectionOne = document.querySelector('.section-one');
const currentWeatherIcon = document.querySelector('.current-weather-icon');
const timeElement = document.querySelector('.time');
const dateElement = document.querySelector('.day');
const cityElement = document.querySelector('.city-suburb');
const countryElement = document.querySelector('.country');
const tempElement = document.querySelector('[data-current-temperature]');
const descElement = document.querySelector('[data-weather-desc]');
const rainElement = document.querySelector('[data-rain-percent]');
const cloudElement = document.querySelector('[data-cloud-percent]');
const windElement = document.querySelector('[data-wind-speed]');

const setDate = () => {
  var today = new Date();
  const options = {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  timeElement.textContent = today.toLocaleString('en-GB', {
    hour: 'numeric',
    minute: 'numeric',
  });
  dateElement.textContent = today.toLocaleDateString('en-GB', options);
};

setInterval(setDate, 1000);
// use obtained weather data and add to index.html
function setWeatherData(data, place) {
  let cityName;
  let countryName;
  if (place) {
    const placeName = place.split(',');
    cityName = placeName[0];
    countryName = placeName[placeName.length - 1].trim();
  } else {
    cityName = data.location.name;
    countryName = data.location.country;
  }

  tempElement.textContent = `${Math.floor(data.current.temp_c)}\u00B0c`;
  cityElement.textContent = cityName;
  countryElement.textContent = countryName;
  cloudElement.textContent = `${data.current.cloud}%`;
  windElement.textContent = `${data.current.wind_kph} km/h`;
  descElement.textContent = data.current.condition.text;
  currentWeatherIcon.src = data.current.condition.icon;
  rainElement.textContent = `${data.current.precip_mm} mm`;

  const sunnyCode = 1000;
  const partCloudyCode = 1003;
  const cloudyCodes = [1006, 1009];
  const mistCodes = [1030, 1135, 1147];
  const snowCodes = [
    1066, 1069, 1114, 1117, 1204, 1207, 1210, 1213, 1216, 1219, 1222, 1225,
    1237, 1249, 1252, 1255, 1258,
  ];
  const rainCodes = [
    1063, 1072, 1150, 1153, 1168, 1171, 1180, 1183, 1186, 1189, 1192, 1195,
    1198, 1201, 1240, 1243, 1246, 1261, 1264,
  ];
  const stormCodes = [1087, 1273, 1276, 1279, 1282];

  const changeBackground = () => {
    if (data.current.condition.code === sunnyCode) {
      sectionOne.className = 'section-one bg-image bg-image-sunny';
      bgDivOne.className = 'bg-div-one bg-image bg-image-sunny';
      bgDivTwo.className = 'bg-div-two bg-image bg-image-sunny';
    }
    if (data.current.condition.code === partCloudyCode) {
      sectionOne.className = 'section-one bg-image bg-image-partly-cloudy';
      bgDivOne.className = 'bg-div-one bg-image bg-image-partly-cloudy';
      bgDivTwo.className = 'bg-div-two bg-image bg-image-partly-cloudy';
    }
    if (cloudyCodes.includes(data.current.condition.code)) {
      sectionOne.className = 'section-one bg-image bg-image-cloudy';
      bgDivOne.className = 'bg-div-one bg-image bg-image-cloudy';
      bgDivTwo.className = 'bg-div-two bg-image bg-image-cloudy';
    }
    if (mistCodes.includes(data.current.condition.code)) {
      sectionOne.className = 'section-one bg-image bg-image-mist';
      bgDivOne.className = 'bg-div-one bg-image bg-image-mist';
      bgDivTwo.className = 'bg-div-two bg-image bg-image-mist';
    }
    if (snowCodes.includes(data.current.condition.code)) {
      sectionOne.className = 'section-one bg-image bg-image-snowy';
      bgDivOne.className = 'bg-div-one bg-image bg-image-snowy';
      bgDivTwo.className = 'bg-div-two bg-image bg-image-snowy';
    }
    if (rainCodes.includes(data.current.condition.code)) {
      sectionOne.className = 'section-one bg-image bg-image-rain';
      bgDivOne.className = 'bg-div-one bg-image bg-image-rain';
      bgDivTwo.className = 'bg-div-two bg-image bg-image-rain';
    }
    if (stormCodes.includes(data.current.condition.code)) {
      sectionOne.className = 'section-one bg-image bg-image-stormy';
      bgDivOne.className = 'bg-div-one bg-image bg-image-stormy';
      bgDivTwo.className = 'bg-div-two bg-image bg-image-stormy';
    }
  };
  changeBackground();
}
