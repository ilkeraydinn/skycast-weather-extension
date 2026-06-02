import { Storage } from './storage.js';

const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

export const WeatherAPI = {
  getWeather: async (lat, lon, unit = 'celsius') => {
    const cacheKey = `weather_${lat}_${lon}_${unit}`;
    const cacheTimeKey = `${cacheKey}_time`;

    const cachedData = await Storage.get(cacheKey);
    const cachedTime = await Storage.get(cacheTimeKey);
    
    // Yalnızca hourly verisi olan yeni formatlı önbelleği kabul et
    if (cachedData && cachedTime && (Date.now() - cachedTime < CACHE_DURATION) && cachedData.hourly) {
      return cachedData;
    }

    const tempUnit = unit === 'fahrenheit' ? '&temperature_unit=fahrenheit' : '';
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max&timezone=auto${tempUnit}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      
      await Storage.set(cacheKey, data);
      await Storage.set(cacheTimeKey, Date.now());
      
      return data;
    } catch (error) {
      console.error('Weather API Error:', error);
      if (cachedData) return cachedData; // Fallback to stale cache
      throw error;
    }
  },

  searchCity: async (query, lang = 'tr') => {
    if (!query || query.length < 2) return [];
    
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=${lang}&format=json`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Geocoding API Error:', error);
      return [];
    }
  },

  getWeatherCodeDescription: (code, isDay = 1, lang = 'tr') => {
    const weatherCodes = {
      0: { tr: 'Açık', en: 'Clear sky', iconDay: 'fa-sun', iconNight: 'fa-moon' },
      1: { tr: 'Çoğunlukla Açık', en: 'Mainly clear', iconDay: 'fa-cloud-sun', iconNight: 'fa-cloud-moon' },
      2: { tr: 'Parçalı Bulutlu', en: 'Partly cloudy', iconDay: 'fa-cloud-sun', iconNight: 'fa-cloud-moon' },
      3: { tr: 'Çok Bulutlu', en: 'Overcast', iconDay: 'fa-cloud', iconNight: 'fa-cloud' },
      45: { tr: 'Sisli', en: 'Fog', iconDay: 'fa-smog', iconNight: 'fa-smog' },
      48: { tr: 'Kırağılı Sis', en: 'Depositing rime fog', iconDay: 'fa-smog', iconNight: 'fa-smog' },
      51: { tr: 'Hafif Çisenti', en: 'Light drizzle', iconDay: 'fa-cloud-rain', iconNight: 'fa-cloud-rain' },
      53: { tr: 'Orta Çisenti', en: 'Moderate drizzle', iconDay: 'fa-cloud-rain', iconNight: 'fa-cloud-rain' },
      55: { tr: 'Yoğun Çisenti', en: 'Dense drizzle', iconDay: 'fa-cloud-rain', iconNight: 'fa-cloud-rain' },
      56: { tr: 'Hafif Dondurucu Çisenti', en: 'Light freezing drizzle', iconDay: 'fa-cloud-meatball', iconNight: 'fa-cloud-meatball' },
      57: { tr: 'Yoğun Dondurucu Çisenti', en: 'Dense freezing drizzle', iconDay: 'fa-cloud-meatball', iconNight: 'fa-cloud-meatball' },
      61: { tr: 'Hafif Yağmur', en: 'Slight rain', iconDay: 'fa-cloud-showers-heavy', iconNight: 'fa-cloud-showers-heavy' },
      63: { tr: 'Orta Şiddetli Yağmur', en: 'Moderate rain', iconDay: 'fa-cloud-showers-heavy', iconNight: 'fa-cloud-showers-heavy' },
      65: { tr: 'Şiddetli Yağmur', en: 'Heavy rain', iconDay: 'fa-cloud-showers-heavy', iconNight: 'fa-cloud-showers-heavy' },
      66: { tr: 'Hafif Dondurucu Yağmur', en: 'Light freezing rain', iconDay: 'fa-cloud-meatball', iconNight: 'fa-cloud-meatball' },
      67: { tr: 'Şiddetli Dondurucu Yağmur', en: 'Heavy freezing rain', iconDay: 'fa-cloud-meatball', iconNight: 'fa-cloud-meatball' },
      71: { tr: 'Hafif Kar', en: 'Slight snow fall', iconDay: 'fa-snowflake', iconNight: 'fa-snowflake' },
      73: { tr: 'Orta Şiddetli Kar', en: 'Moderate snow fall', iconDay: 'fa-snowflake', iconNight: 'fa-snowflake' },
      75: { tr: 'Yoğun Kar', en: 'Heavy snow fall', iconDay: 'fa-snowflake', iconNight: 'fa-snowflake' },
      77: { tr: 'Kar Taneleri', en: 'Snow grains', iconDay: 'fa-snowflake', iconNight: 'fa-snowflake' },
      80: { tr: 'Hafif Sağanak', en: 'Slight rain showers', iconDay: 'fa-cloud-showers-heavy', iconNight: 'fa-cloud-showers-heavy' },
      81: { tr: 'Orta Şiddetli Sağanak', en: 'Moderate rain showers', iconDay: 'fa-cloud-showers-heavy', iconNight: 'fa-cloud-showers-heavy' },
      82: { tr: 'Şiddetli Sağanak', en: 'Violent rain showers', iconDay: 'fa-cloud-showers-heavy', iconNight: 'fa-cloud-showers-heavy' },
      85: { tr: 'Hafif Kar Sağanağı', en: 'Slight snow showers', iconDay: 'fa-snowflake', iconNight: 'fa-snowflake' },
      86: { tr: 'Şiddetli Kar Sağanağı', en: 'Heavy snow showers', iconDay: 'fa-snowflake', iconNight: 'fa-snowflake' },
      95: { tr: 'Gök Gürültülü Fırtına', en: 'Thunderstorm', iconDay: 'fa-bolt', iconNight: 'fa-bolt' },
      96: { tr: 'Hafif Dolulu Fırtına', en: 'Thunderstorm with slight hail', iconDay: 'fa-bolt', iconNight: 'fa-bolt' },
      99: { tr: 'Şiddetli Dolulu Fırtına', en: 'Thunderstorm with heavy hail', iconDay: 'fa-bolt', iconNight: 'fa-bolt' }
    };
    
    const info = weatherCodes[code] || { tr: 'Bilinmiyor', en: 'Unknown', iconDay: 'fa-cloud', iconNight: 'fa-cloud' };
    
    // Determine generic condition type for background animations
    let conditionType = 'clear'; // default
    if (code >= 2 && code <= 3) conditionType = 'clouds';
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) conditionType = 'rain';
    if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) conditionType = 'snow';
    if (code >= 95 && code <= 99) conditionType = 'thunderstorm';
    
    return {
      description: info[lang] || info.en,
      icon: isDay ? info.iconDay : info.iconNight,
      type: conditionType
    };
  }
};
