import { Storage } from './storage.js';
import { WeatherAPI } from './weather-api.js';
import { WeatherAnimations } from './animations.js';

// Simple SVG Icon map for weather
const IconMap = {
  'fa-sun': '<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>',
  'fa-moon': '<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>',
  'fa-cloud-sun': '<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="M20 12h2"></path><path d="m19.07 4.93-1.41 1.41"></path><path d="M15.947 12.65a4 4 0 0 0-5.925-4.128"></path><path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"></path></svg>',
  'fa-cloud-moon': '<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"></path><path d="M10.083 9A6.002 6.002 0 0 1 16 4a4.243 4.243 0 0 0 6 6c0 3.314-2.686 6-6 6"></path></svg>',
  'fa-cloud': '<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>',
  'fa-smog': '<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none"><path d="M4 14h16"></path><path d="M4 18h16"></path><path d="M8 22h8"></path><path d="M12 10a8 8 0 0 1-8-8h16a8 8 0 0 1-8 8z"></path></svg>',
  'fa-cloud-rain': '<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none"><line x1="16" y1="13" x2="16" y2="21"></line><line x1="8" y1="13" x2="8" y2="21"></line><line x1="12" y1="15" x2="12" y2="23"></line><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path></svg>',
  'fa-cloud-showers-heavy': '<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none"><line x1="16" y1="13" x2="16" y2="21"></line><line x1="8" y1="13" x2="8" y2="21"></line><line x1="12" y1="15" x2="12" y2="23"></line><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path></svg>',
  'fa-snowflake': '<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none"><line x1="12" y1="2" x2="12" y2="22"></line><line x1="12" y1="2" x2="15" y2="5"></line><line x1="12" y1="2" x2="9" y2="5"></line><line x1="12" y1="22" x2="15" y2="19"></line><line x1="12" y1="22" x2="9" y2="19"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="12" x2="5" y2="9"></line><line x1="2" y1="12" x2="5" y2="15"></line><line x1="22" y1="12" x2="19" y2="9"></line><line x1="22" y1="12" x2="19" y2="15"></line><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line><line x1="4.93" y1="4.93" x2="7.76" y2="4.93"></line><line x1="4.93" y1="4.93" x2="4.93" y2="7.76"></line><line x1="19.07" y1="19.07" x2="16.24" y2="19.07"></line><line x1="19.07" y1="19.07" x2="19.07" y2="16.24"></line><line x1="4.93" y1="19.07" x2="19.07" y2="4.93"></line><line x1="4.93" y1="19.07" x2="4.93" y2="16.24"></line><line x1="4.93" y1="19.07" x2="7.76" y2="19.07"></line><line x1="19.07" y1="4.93" x2="19.07" y2="7.76"></line><line x1="19.07" y1="4.93" x2="16.24" y2="4.93"></line></svg>',
  'fa-bolt': '<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>',
  'fa-cloud-meatball': '<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path><circle cx="9" cy="15" r="1.5"></circle><circle cx="13" cy="18" r="1.5"></circle><circle cx="15" cy="14" r="1.5"></circle></svg>'
};

function getIconSvg(iconName) {
  return IconMap[iconName] || IconMap['fa-cloud'];
}

// DOM Elements
const els = {
  loadingState: document.getElementById('loading-state'),
  weatherContent: document.getElementById('weather-content'),
  errorState: document.getElementById('error-state'),
  searchInput: document.getElementById('search-input'),
  autocompleteResults: document.getElementById('autocomplete-results'),
  settingsBtn: document.getElementById('settings-btn'),
  locationBtn: document.getElementById('location-btn'),
  settingsModal: document.getElementById('settings-modal'),
  closeSettings: document.getElementById('close-settings'),
  unitSelect: document.getElementById('unit-select'),
  langSelect: document.getElementById('lang-select'),
  autoLocation: document.getElementById('auto-location'),
  retryBtn: document.getElementById('retry-btn'),
  cityName: document.getElementById('city-name'),
  smartSummary: document.getElementById('smart-summary'),
  smartSummaryText: document.getElementById('smart-summary-text'),
  favoriteBtn: document.getElementById('favorite-btn'),
  currentTemp: document.getElementById('current-temp'),
  weatherIconMain: document.getElementById('weather-icon-main'),
  weatherDesc: document.getElementById('weather-desc'),
  feelsLike: document.getElementById('feels-like'),
  humidity: document.getElementById('humidity'),
  windSpeed: document.getElementById('wind-speed'),
  sunriseTime: document.getElementById('sunrise-time'),
  sunsetTime: document.getElementById('sunset-time'),
  hourlyList: document.getElementById('hourly-list'),
  hourlyCurve: document.getElementById('hourly-curve'),
  forecastList: document.getElementById('forecast-list'),
  favoritesSection: document.getElementById('favorites-section'),
  favoritesList: document.getElementById('favorites-list'),
};

let currentSettings = {
  unit: 'celsius',
  lang: 'tr',
  autoLocation: true,
  theme: 'auto',
  lastLat: null,
  lastLon: null,
  lastName: null,
  gpsLat: null,
  gpsLon: null,
  gpsName: null,
  viewingGps: true
};

let favorites = [];
let searchTimeout = null;
let currentCityName = '';
let currentLat = null;
let currentLon = null;
let animator = new WeatherAnimations('weather-canvas');
let currentActionId = 0;

const i18n = {
  tr: {
    searchPlaceholder: 'Şehir veya ilçe ara...',
    feelsLike: 'Hissedilen',
    humidity: 'Nem',
    wind: 'Rüzgar',
    forecastTitle: '5 Günlük Tahmin',
    hourlyTitle: 'Saatlik Tahmin',
    favoritesTitle: 'Favori Şehirler',
    settingsTitle: 'Ayarlar',
    locationTitle: 'Konumumu Bul',
    addFavorite: 'Favorilere Ekle',
    unitLabel: 'Sıcaklık Birimi',
    langLabel: 'Dil (Language)',
    autoLocLabel: 'Otomatik Konum (GPS)',
    retryBtn: 'Tekrar Dene'
  },
  en: {
    searchPlaceholder: 'Search city...',
    feelsLike: 'Feels Like',
    humidity: 'Humidity',
    wind: 'Wind',
    forecastTitle: '5-Day Forecast',
    hourlyTitle: 'Hourly Forecast',
    favoritesTitle: 'Favorite Cities',
    settingsTitle: 'Settings',
    locationTitle: 'Find My Location',
    addFavorite: 'Add to Favorites',
    unitLabel: 'Temperature Unit',
    langLabel: 'Language',
    autoLocLabel: 'Auto Location (GPS)',
    retryBtn: 'Retry'
  }
};

function applyLanguage(lang) {
  const t = i18n[lang] || i18n['en'];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) el.textContent = t[key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (i18n[lang][key]) el.placeholder = i18n[lang][key];
  });
  
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    if (i18n[lang][key]) el.title = i18n[lang][key];
  });
}

// Initialize
async function init() {
  await loadSettings();
  await loadFavorites();
  setupEventListeners();
  applyTheme(currentSettings.theme);
  applyLanguage(currentSettings.lang);
  
  if (currentSettings.autoLocation && currentSettings.viewingGps !== false) {
    const hasGpsLoc = currentSettings.gpsLat && currentSettings.gpsLon;
    if (hasGpsLoc) {
      loadWeatherData(currentSettings.gpsLat, currentSettings.gpsLon, currentSettings.gpsName, false, true);
      getLocation(false, false); // Update in background quietly
    } else {
      getLocation(true);
    }
  } else {
    const hasLastLoc = currentSettings.lastLat && currentSettings.lastLon;
    if (hasLastLoc) {
      loadWeatherData(currentSettings.lastLat, currentSettings.lastLon, currentSettings.lastName, false, false);
      if (currentSettings.autoLocation) getLocation(false, false); // Update GPS in background quietly
    } else if (currentSettings.autoLocation) {
      getLocation(true);
    } else {
      showError(currentSettings.lang === 'tr' ? 'Lütfen bir konum arayın veya GPS açın.' : 'Please search a location or enable GPS.');
    }
  }
}

async function loadSettings() {
  const stored = await Storage.getMultiple(['unit', 'lang', 'autoLocation', 'theme', 'lastLat', 'lastLon', 'lastName', 'gpsLat', 'gpsLon', 'gpsName', 'viewingGps']);
  currentSettings = { ...currentSettings, ...stored };
  els.unitSelect.value = currentSettings.unit;
  els.langSelect.value = currentSettings.lang;
  els.autoLocation.checked = currentSettings.autoLocation;
}

async function loadFavorites() {
  favorites = (await Storage.get('favorites')) || [];
  renderFavorites();
}

function setupEventListeners() {
  els.settingsBtn.addEventListener('click', () => els.settingsModal.classList.remove('hidden'));
  els.closeSettings.addEventListener('click', () => els.settingsModal.classList.add('hidden'));
  
  els.locationBtn.addEventListener('click', () => {
    els.searchInput.value = '';
    currentActionId++;
    els.locationBtn.classList.add('loading');
    getLocation(false, true); // Do not show full-screen skeleton, but it IS explicit
  });

  document.addEventListener('click', (e) => {
    if (!els.searchInput.contains(e.target) && !els.autocompleteResults.contains(e.target)) {
      els.autocompleteResults.classList.add('hidden');
    }
  });

  els.unitSelect.addEventListener('change', (e) => saveSetting('unit', e.target.value, true));
  els.langSelect.addEventListener('change', (e) => saveSetting('lang', e.target.value, true));
  els.autoLocation.addEventListener('change', (e) => {
    saveSetting('autoLocation', e.target.checked);
    if (e.target.checked) getLocation();
  });
  
  els.searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    const val = e.target.value.trim();
    if (val.length < 2) {
      els.autocompleteResults.classList.add('hidden');
      return;
    }
    searchTimeout = setTimeout(() => performSearch(val), 500);
  });
  
  // Hide autocomplete on click outside
  document.addEventListener('click', (e) => {
    if (!els.searchInput.contains(e.target) && !els.autocompleteResults.contains(e.target)) {
      els.autocompleteResults.classList.add('hidden');
    }
  });

  els.retryBtn.addEventListener('click', () => {
    currentActionId++;
    if (currentSettings.autoLocation) getLocation();
    else if (currentLat && currentLon) loadWeatherData(currentLat, currentLon, currentCityName);
  });

  els.favoriteBtn.addEventListener('click', toggleFavorite);
}

async function saveSetting(key, value, reload = false) {
  currentSettings[key] = value;
  await Storage.set(key, value);
  if (key === 'lang') {
    applyLanguage(value);
  }
  if (reload && currentLat && currentLon) {
    loadWeatherData(currentLat, currentLon, currentCityName);
  }
}

function getLocation(showSpinner = true, isExplicit = true) {
  const actionId = ++currentActionId;
  if (showSpinner) showLoading();
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        reverseGeocode(latitude, longitude).then(name => {
          let skipUI = (actionId !== currentActionId);
          if (!isExplicit && currentSettings.viewingGps === false) skipUI = true;
          loadWeatherData(latitude, longitude, name, !showSpinner || skipUI, true, skipUI);
        });
      },
      (err) => {
        els.locationBtn.classList.remove('loading');
        console.warn('GPS failed, falling back to IP location', err);
        getLocationFromIP(showSpinner, actionId, isExplicit);
      },
      { timeout: 5000, maximumAge: 600000 }
    );
  } else {
    getLocationFromIP(showSpinner, actionId, isExplicit);
  }
}

async function getLocationFromIP(showSpinner, originalActionId, isExplicit = true) {
  const actionId = originalActionId !== undefined ? originalActionId : currentActionId;
  try {
    const res = await fetch('https://get.geojs.io/v1/ip/geo.json');
    const data = await res.json();
    let skipUI = (actionId !== currentActionId);
    if (!isExplicit && currentSettings.viewingGps === false) skipUI = true;
    loadWeatherData(data.latitude, data.longitude, data.city || 'Konum', !showSpinner || skipUI, true, skipUI);
  } catch (e) {
    els.locationBtn.classList.remove('loading');
    if (showSpinner && actionId === currentActionId) {
      showError(currentSettings.lang === 'tr' ? 'Konum bulunamadı. Lütfen arama yapın.' : 'Location not found. Please search.');
    }
  }
}

async function reverseGeocode(lat, lon) {
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=a&count=1&language=${currentSettings.lang}&format=json&latitude=${lat}&longitude=${lon}`;
    // Unfortunately, Open-Meteo doesn't have a direct reverse geocoding API. 
    // We'll use a generic name or "Mevcut Konum" if not found.
    return currentSettings.lang === 'tr' ? 'Mevcut Konum' : 'Current Location';
  } catch(e) {
    return 'Konum';
  }
}

let currentSearchQuery = '';

async function performSearch(query) {
  currentSearchQuery = query;
  const results = await WeatherAPI.searchCity(query, currentSettings.lang);
  if (currentSearchQuery !== query) return;
  
  els.autocompleteResults.innerHTML = '';
  if (results.length > 0) {
    results.forEach(city => {
      const div = document.createElement('div');
      div.className = 'autocomplete-item';
      div.textContent = `${city.name}${city.admin1 ? ', ' + city.admin1 : ''}, ${city.country}`;
      div.addEventListener('click', () => {
        els.searchInput.value = '';
        els.autocompleteResults.classList.add('hidden');
        currentActionId++;
        loadWeatherData(city.latitude, city.longitude, city.name);
      });
      els.autocompleteResults.appendChild(div);
    });
    els.autocompleteResults.classList.remove('hidden');
  } else {
    els.autocompleteResults.classList.add('hidden');
  }
}

async function loadWeatherData(lat, lon, name, quiet = false, isGpsUpdate = false, skipUI = false) {
  if (!quiet) showLoading();
  try {
    const data = await WeatherAPI.getWeather(lat, lon, currentSettings.unit);
    currentLat = lat;
    currentLon = lon;
    currentCityName = name;
    
    // Save as last location depending on update source
    if (isGpsUpdate) {
      const updates = { gpsLat: lat, gpsLon: lon, gpsName: name };
      if (!skipUI) updates.viewingGps = true;
      await Storage.setMultiple(updates);
    } else {
      await Storage.setMultiple({ lastLat: lat, lastLon: lon, lastName: name, viewingGps: false });
    }
    
    // Update badge directly
    if (!skipUI) {
      if (chrome.action && chrome.action.setBadgeText) {
        chrome.action.setBadgeText({ text: `${Math.round(data.current.temperature_2m)}°` });
        chrome.action.setBadgeBackgroundColor({ color: '#4facfe' });
      } else {
        chrome.runtime.sendMessage({ action: 'updateBadge', temp: Math.round(data.current.temperature_2m) });
      }
    }
    
    if (skipUI) return;
    
    renderUI(data, name);
    checkFavoriteStatus();
    els.loadingState.classList.add('hidden');
    els.errorState.classList.add('hidden');
    els.weatherContent.classList.remove('hidden');
    els.locationBtn.classList.remove('loading');
  } catch (err) {
    els.locationBtn.classList.remove('loading');
    if (!skipUI) showError(currentSettings.lang === 'tr' ? 'Hava durumu verisi alınamadı.' : 'Failed to fetch weather data.');
  }
}

function generateSmartSummary(data, lang) {
  const current = data.current;
  const daily = data.daily;
  
  const rainProb = daily.precipitation_probability_max[0] || 0;
  const maxTemp = daily.temperature_2m_max[0];
  const minTemp = daily.temperature_2m_min[0];
  const windSpeed = current.wind_speed_10m;
  const code = current.weather_code;
  
  if (rainProb > 60 || [61, 63, 65, 80, 81, 82, 95, 96, 99].includes(code)) {
    return lang === 'tr' ? 'Bugün yağmur bekleniyor, şemsiyenizi almayı unutmayın.' : 'Rain expected today, don\'t forget your umbrella.';
  }
  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return lang === 'tr' ? 'Kar yağışı var, kalın giyinin ve dikkatli olun.' : 'Snowing outside, dress warmly and be careful.';
  }
  if (windSpeed > 40) {
    return lang === 'tr' ? 'Dışarıda oldukça kuvvetli rüzgar var, dikkatli olun.' : 'Strong winds outside, be cautious.';
  }
  if (maxTemp >= 32) {
    return lang === 'tr' ? 'Hava bugün oldukça sıcak geçecek, bol sıvı tüketin.' : 'It will be quite hot today, stay hydrated.';
  }
  if (maxTemp <= 5) {
    return lang === 'tr' ? 'Bugün hava dondurucu derecede soğuk, sıkı giyinin.' : 'It is freezing cold today, bundle up.';
  }
  if ([0, 1].includes(code) && maxTemp > 18 && maxTemp < 28) {
    return lang === 'tr' ? 'Harika güneşli ve açık bir gün sizi bekliyor.' : 'A wonderful sunny and clear day awaits you.';
  }
  
  const tempDiff = Math.abs(maxTemp - minTemp);
  if (tempDiff > 12) {
    return lang === 'tr' ? `Sıcaklık farkı yüksek. Bugün en düşük ${Math.round(minTemp)}°, en yüksek ${Math.round(maxTemp)}° olacak.` : `High temperature variance. Expect a low of ${Math.round(minTemp)}° and high of ${Math.round(maxTemp)}° today.`;
  }
  
  return lang === 'tr' ? `Bugün sıcaklık ${Math.round(minTemp)}° ile ${Math.round(maxTemp)}° arasında seyredecek.` : `Temperatures will range between ${Math.round(minTemp)}° and ${Math.round(maxTemp)}° today.`;
}

function renderUI(data, name) {
  const current = data.current;
  const daily = data.daily;
  const isDay = current.is_day === 1;
  const weatherInfo = WeatherAPI.getWeatherCodeDescription(current.weather_code, isDay, currentSettings.lang);
  
  // Set animations based on weather code and day/night
  animator.setCondition(weatherInfo.type, isDay);
  
  els.cityName.textContent = name;
  
  // Smart Summary
  els.smartSummaryText.textContent = generateSmartSummary(data, currentSettings.lang);
  els.smartSummary.classList.remove('hidden');
  
  els.currentTemp.textContent = Math.round(current.temperature_2m);
  els.weatherDesc.textContent = weatherInfo.description;
  els.weatherIconMain.innerHTML = getIconSvg(weatherInfo.icon);
  
  els.feelsLike.textContent = `${Math.round(current.apparent_temperature)}°`;
  els.humidity.textContent = `${current.relative_humidity_2m}%`;
  els.windSpeed.textContent = `${Math.round(current.wind_speed_10m)} km/h`;
  
  // Sun times
  const sunrise = new Date(daily.sunrise[0]).toLocaleTimeString(currentSettings.lang === 'tr' ? 'tr-TR' : 'en-US', { hour: '2-digit', minute: '2-digit' });
  const sunset = new Date(daily.sunset[0]).toLocaleTimeString(currentSettings.lang === 'tr' ? 'tr-TR' : 'en-US', { hour: '2-digit', minute: '2-digit' });
  els.sunriseTime.textContent = sunrise;
  els.sunsetTime.textContent = sunset;
  
  // Hourly Forecast
  if (data.hourly && data.hourly.time && current.time) {
    const hourly = data.hourly;
    // Fix timezone issues by comparing local time strings instead of parsed dates
    const currentHourStr = current.time.substring(0, 13) + ":00"; 
    let startIndex = hourly.time.findIndex(t => t >= currentHourStr);
    if (startIndex === -1) startIndex = 0;
    const endIndex = Math.min(startIndex + 24, hourly.time.length);
    
    els.hourlyList.innerHTML = '';
    const temps = [];
    
    for (let i = startIndex; i < endIndex; i++) {
      const time = new Date(hourly.time[i]);
      const isDay = hourly.is_day[i] === 1;
      const code = hourly.weather_code[i];
      const temp = Math.round(hourly.temperature_2m[i]);
      temps.push(temp);
      
      const hInfo = WeatherAPI.getWeatherCodeDescription(code, isDay, currentSettings.lang);
      const div = document.createElement('div');
      div.className = 'hourly-item';
      const timeStr = i === startIndex ? (currentSettings.lang === 'tr' ? 'Şimdi' : 'Now') : 
                      time.toLocaleTimeString(currentSettings.lang === 'tr' ? 'tr-TR' : 'en-US', { hour: '2-digit', minute: '2-digit' });
      
      div.innerHTML = `
        <div class="hourly-time">${timeStr}</div>
        <div class="hourly-icon" title="${hInfo.description}">${getIconSvg(hInfo.icon)}</div>
        <div class="hourly-temp">${temp}°</div>
      `;
      els.hourlyList.appendChild(div);
    }
    drawHourlyCurve(temps);
  }
  
  // Forecast
  els.forecastList.innerHTML = '';
  for (let i = 0; i < 5; i++) {
    const date = new Date(daily.time[i]);
    const dayName = date.toLocaleDateString(currentSettings.lang === 'tr' ? 'tr-TR' : 'en-US', { weekday: 'short' });
    const code = daily.weather_code[i];
    const max = Math.round(daily.temperature_2m_max[i]);
    const min = Math.round(daily.temperature_2m_min[i]);
    const precip = daily.precipitation_probability_max[i] || 0;
    const fInfo = WeatherAPI.getWeatherCodeDescription(code, 1, currentSettings.lang); // Force day icon for forecast
    
    const div = document.createElement('div');
    div.className = 'forecast-item';
    div.innerHTML = `
      <div class="forecast-day">${i === 0 ? (currentSettings.lang === 'tr' ? 'Bugün' : 'Today') : dayName}</div>
      <div class="forecast-icon" title="${fInfo.description}">${getIconSvg(fInfo.icon)}</div>
      <div class="forecast-precip">
        <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2" fill="none"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>
        ${precip}%
      </div>
      <div class="forecast-temps">
        <span class="forecast-temp-min">${min}°</span>
        <span class="forecast-temp-max">${max}°</span>
      </div>
    `;
    els.forecastList.appendChild(div);
  }
}

function drawHourlyCurve(temps) {
  if (!els.hourlyCurve || temps.length === 0) return;
  
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const range = maxTemp - minTemp || 1;
  
  const itemWidth = 60;
  const svgWidth = temps.length * itemWidth;
  
  const minY = 90;
  const maxY = 55;
  
  let d = '';
  const points = [];
  
  for (let i = 0; i < temps.length; i++) {
    const x = (i * itemWidth) + (itemWidth / 2);
    const norm = (temps[i] - minTemp) / range; 
    const y = minY - (norm * (minY - maxY));
    points.push({x, y});
    
    if (i === 0) d += `M ${x} ${y} `;
    else {
      const prev = points[i-1];
      const cx1 = prev.x + (itemWidth / 2);
      const cy1 = prev.y;
      const cx2 = x - (itemWidth / 2);
      const cy2 = y;
      d += `C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x} ${y} `;
    }
  }
  
  els.hourlyCurve.setAttribute('width', svgWidth);
  els.hourlyCurve.innerHTML = `
    <path d="${d}" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="3" stroke-linecap="round" />
    ${points.map(p => `<circle cx="${p.x}" cy="${p.y}" r="4" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.9)" stroke-width="2" />`).join('')}
  `;
}

function showLoading() {
  els.loadingState.classList.remove('hidden');
  els.weatherContent.classList.add('hidden');
  els.errorState.classList.add('hidden');
}

function showError(msg) {
  els.loadingState.classList.add('hidden');
  els.weatherContent.classList.add('hidden');
  document.getElementById('error-message').textContent = msg;
  els.errorState.classList.remove('hidden');
}

function applyTheme(theme) {
  const isDark = theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
}

// Favorites Logic
function toggleFavorite() {
  if (!currentCityName) return;
  const index = favorites.findIndex(f => f.name === currentCityName);
  if (index > -1) {
    favorites.splice(index, 1);
  } else {
    favorites.push({
      name: currentCityName,
      lat: currentLat,
      lon: currentLon
    });
  }
  Storage.set('favorites', favorites);
  checkFavoriteStatus();
  renderFavorites();
}

function checkFavoriteStatus() {
  if (!currentCityName) return;
  const isFav = favorites.some(f => f.name === currentCityName);
  els.favoriteBtn.classList.toggle('active', isFav);
  els.favoriteBtn.style.color = isFav ? '#ffd700' : 'var(--text-color)';
}

function renderFavorites() {
  if (favorites.length === 0) {
    els.favoritesSection.classList.add('hidden');
    return;
  }
  
  els.favoritesList.innerHTML = '';
  favorites.forEach(fav => {
    const div = document.createElement('div');
    div.className = 'favorite-item';
    div.innerHTML = `
      <div class="fav-city" title="${fav.name}">${fav.name}</div>
    `;
    div.addEventListener('click', () => {
      currentActionId++;
      loadWeatherData(fav.lat, fav.lon, fav.name);
    });
    els.favoritesList.appendChild(div);
  });
  els.favoritesSection.classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', init);
