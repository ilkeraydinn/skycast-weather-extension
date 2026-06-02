export const Storage = {
  get: async (key, defaultValue = null) => {
    return new Promise((resolve) => {
      chrome.storage.local.get([key], (result) => {
        resolve(result[key] !== undefined ? result[key] : defaultValue);
      });
    });
  },
  
  set: async (key, value) => {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [key]: value }, () => {
        resolve();
      });
    });
  },
  
  getMultiple: async (keys) => {
    return new Promise((resolve) => {
      chrome.storage.local.get(keys, (result) => {
        resolve(result);
      });
    });
  },
  
  setMultiple: async (obj) => {
    return new Promise((resolve) => {
      chrome.storage.local.set(obj, () => {
        resolve();
      });
    });
  }
};
