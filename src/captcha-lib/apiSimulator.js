/**
 * API Simulator for HumanPlay CAPTCHA
 * Collects and sends tracking data to endpoint (or console)
 */
import { mouseData } from './trackers/mouseTracker.js';
import { keyTimings } from './trackers/keyboardTracker.js';
import { scrollData } from './trackers/scrollTracker.js';

// Track whether CAPTCHA has been passed
let captchaPassed = false;
let isVerifying = false;

const encryptData = (data) => {
  const jsonString = JSON.stringify(data);
  const encoded = btoa(jsonString);
  return encoded;
};

const decryptData = (encrypted) => {
  try {
    const decoded = atob(encrypted);
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Error decrypting data:', error);
    return null;
  }
};

const storeBehavioralData = (data) => {
  try {
    const encrypted = encryptData(data);
    const timestamp = Date.now();
    const key = `vp_behavior_${timestamp}`;
    
    localStorage.setItem(key, encrypted);
    
    // Keep only last 10 entries
    const keys = Object.keys(localStorage)
      .filter(k => k.startsWith('vp_behavior_'))
      .sort()
      .reverse();
    
    if (keys.length > 10) {
      keys.slice(10).forEach(k => localStorage.removeItem(k));
    }
    
    console.log('Behavioral data stored with key:', key);
  } catch (error) {
    console.error('Error storing behavioral data:', error);
  }
};

// Set CAPTCHA status to passed
export const setCaptchaPassed = () => {
  if (isVerifying) return;
  isVerifying = true;
  
  // Show loader
  const loader = document.createElement('div');
  loader.id = 'captcha-loader';
  loader.className = 'captcha-loader';
  
  const spinner = document.createElement('div');
  spinner.className = 'captcha-spinner';
  
  const text = document.createElement('div');
  text.className = 'captcha-loader-text';
  text.textContent = 'Verifying...';
  
  loader.appendChild(spinner);
  loader.appendChild(text);
  
  const style = document.createElement('style');
  style.textContent = `
    .captcha-loader {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }
    .captcha-spinner {
      width: 50px;
      height: 50px;
      border: 5px solid #f3f3f3;
      border-top: 5px solid #3498db;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    .captcha-loader-text {
      color: white;
      margin-top: 20px;
      font-size: 18px;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(loader);
  
  setTimeout(() => {
    captchaPassed = true;
    isVerifying = false;
    
    const loader = document.getElementById('captcha-loader');
    if (loader) {
      loader.remove();
    }
  }, 3000);
};

/**
 * Send collected data to API endpoint or console
 */
export const send = async () => {
  if (mouseData.length === 0 && keyTimings.length === 0 && scrollData.length === 0) {
    return;
  }

  const payload = {
    keyTimings: [...keyTimings],
    mouseMovements: [...mouseData],
    scrollData: [...scrollData]
  };

  keyTimings.length = 0;
  mouseData.length = 0;
  scrollData.length = 0;

  await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 300));

  console.log('Raw Behavioral Data:', JSON.stringify(payload, null, 2));
  
  // Store the data in localStorage
  storeBehavioralData(payload);

  return payload;
};

/**
 * Send data to the backend endpoint
 * Currently simulated with console.log
 */
export const verifyCaptcha = async (data) => {
  const formattedData = {
    keyTimings: data.keyboard.map(k => ({
      key: k.key,
      dwellTime: k.dwellTime,
      flightTime: k.flightTime,
      timestamp: k.timestamp
    })),
    mouseMovements: data.mouse.map(m => ({
      x: m.x,
      y: m.y,
      time: m.time
    })),
    scrollData: data.scroll.map(s => ({
      scrollTop: s.scrollTop,
      speed: s.speed,
      direction: s.direction,
      depth: s.depth,
      time: s.time
    }))
  };
  
  await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 100));
  
  console.log('Verification Data:', JSON.stringify(formattedData, null, 2));
  
  // Store the verification data
  storeBehavioralData(formattedData);

  return true;
};

/**
 * Generate or retrieve a session ID
 */
export const getSessionId = () => {
  // Check if we already have a session ID in localStorage
  let sessionId = localStorage.getItem('veriplay_session_id');
  
  // If not, create a new one
  if (!sessionId) {
    sessionId = 'vp_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('veriplay_session_id', sessionId);
  }
  
  return sessionId;
};

export const resetSession = () => {
  localStorage.removeItem('veriplay_session_id');
};

export const getStoredBehavioralData = () => {
  const keys = Object.keys(localStorage)
    .filter(k => k.startsWith('vp_behavior_'))
    .sort()
    .reverse();
  
  return keys.map(key => {
    const encrypted = localStorage.getItem(key);
    return {
      timestamp: parseInt(key.split('_')[2]),
      data: decryptData(encrypted)
    };
  });
};
