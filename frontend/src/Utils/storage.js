/**
 * SSR-safe localStorage and sessionStorage utilities
 * These functions check for window availability before accessing storage
 */

// localStorage helpers
export const getLocalStorage = (key) => {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error(`Error getting localStorage ${key}:`, error);
    return null;
  }
};

export const setLocalStorage = (key, value) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error(`Error setting localStorage ${key}:`, error);
  }
};

export const removeLocalStorage = (key) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing localStorage ${key}:`, error);
  }
};

export const getLocalStorageJSON = (key) => {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error parsing localStorage ${key}:`, error);
    return null;
  }
};

export const setLocalStorageJSON = (key, value) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting localStorage ${key}:`, error);
  }
};

// sessionStorage helpers
export const getSessionStorage = (key) => {
  if (typeof window === 'undefined') return null;
  try {
    return sessionStorage.getItem(key);
  } catch (error) {
    console.error(`Error getting sessionStorage ${key}:`, error);
    return null;
  }
};

export const setSessionStorage = (key, value) => {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(key, value);
  } catch (error) {
    console.error(`Error setting sessionStorage ${key}:`, error);
  }
};

export const removeSessionStorage = (key) => {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing sessionStorage ${key}:`, error);
  }
};

export const getSessionStorageJSON = (key) => {
  if (typeof window === 'undefined') return null;
  try {
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error parsing sessionStorage ${key}:`, error);
    return null;
  }
};

export const setSessionStorageJSON = (key, value) => {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting sessionStorage ${key}:`, error);
  }
};
