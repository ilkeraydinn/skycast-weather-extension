import { Storage } from './storage.js';
import { WeatherAPI } from './weather-api.js';

chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create('updateWeather', { periodInMinutes: 30 });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'updateWeather') {
    updateBadge();
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateBadge') {
    if (request.temp !== undefined) {
      chrome.action.setBadgeText({ text: `${request.temp}°` });
      chrome.action.setBadgeBackgroundColor({ color: '#4facfe' });
    } else {
      updateBadge();
    }
    sendResponse({ success: true });
  }
  return true;
});

async function updateBadge() {
  try {
    const settings = await Storage.getMultiple(['lastLat', 'lastLon', 'gpsLat', 'gpsLon', 'autoLocation', 'unit', 'viewingGps']);
    
    let lat = settings.lastLat;
    let lon = settings.lastLon;
    
    if (settings.autoLocation && settings.viewingGps !== false && settings.gpsLat && settings.gpsLon) {
      lat = settings.gpsLat;
      lon = settings.gpsLon;
    }
    
    if (!lat || !lon) return;
    
    const unit = settings.unit || 'celsius';
    const data = await WeatherAPI.getWeather(lat, lon, unit);
    
    if (data && data.current) {
      const temp = Math.round(data.current.temperature_2m);
      chrome.action.setBadgeText({ text: `${temp}°` });
      chrome.action.setBadgeBackgroundColor({ color: '#4facfe' });
    }
  } catch (error) {
    console.error('Background badge update error:', error);
  }
}

updateBadge();
