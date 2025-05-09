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

// Set CAPTCHA status to passed
export const setCaptchaPassed = () => {
  if (isVerifying) return;
  isVerifying = true;
  
  // Show loader
  const loader = document.createElement('div');
  loader.id = 'captcha-loader';
  loader.innerHTML = `
    <div class="loader-content">
      <div class="spinner"></div>
      <p>Verifying human behavior...</p>
    </div>
  `;
  document.body.appendChild(loader);
  
  // Add loader styles
  const style = document.createElement('style');
  style.textContent = `
    #captcha-loader {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }
    .loader-content {
      text-align: center;
      color: white;
    }
    .spinner {
      width: 50px;
      height: 50px;
      border: 5px solid #f3f3f3;
      border-top: 5px solid #3498db;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
  
  console.log('Verifying CAPTCHA...');
  
  // Fixed 3 second delay for verification
  setTimeout(() => {
    captchaPassed = true;
    isVerifying = false;
    
    // Remove loader
    const loader = document.getElementById('captcha-loader');
    if (loader) {
      loader.remove();
    }
    
    console.log('CAPTCHA verification complete');
  }, 3000);
};

/**
 * Send collected data to API endpoint or console
 */
export const send = () => {
  // Copy current data into payload
  const payload = {
    mouseData: [...mouseData],
    keyboardData: [...keyTimings],
    scrollData: [...scrollData],
    captchaPassed,
    timestamp: Date.now(),
    sessionId: getSessionId()
  };
  
  // Clear the arrays for next batch
  mouseData.splice(0, mouseData.length);
  keyTimings.splice(0, keyTimings.length);
  scrollData.splice(0, scrollData.length);
  
  // Simulate network delay (300-800ms)
  const delay = 300 + Math.random() * 500;
  
  setTimeout(() => {
    sendDataToEndpoint(payload);
  }, delay);
};

/**
 * Send data to the backend endpoint
 * Currently simulated with console.log
 */
const sendDataToEndpoint = (payload) => {
  // Format the data in the requested structure
  const formattedData = {
    keyTimings: payload.keyboardData.map(event => ({
      key: event.key,
      dwellTime: event.dwellTime,
      flightTime: event.flightTime,
      timestamp: event.timestamp
    })),
    mouseMovements: payload.mouseData.map(event => ({
      x: event.x,
      y: event.y,
      time: event.time
    })),
    scrollData: payload.scrollData.map(event => ({
      scrollTop: event.scrollTop,
      speed: event.speed,
      direction: event.direction,
      depth: event.depth,
      time: event.time
    }))
  };

  // Simulate API response time (100-300ms)
  const responseDelay = 100 + Math.random() * 200;
  
  setTimeout(() => {
    // Log the formatted data
    console.log('Raw Behavioral Data:', formattedData);
    
    // Also log the summary for quick reference
    console.log('Summary:', {
      timestamp: new Date(payload.timestamp).toISOString(),
      mouseEvents: payload.mouseData.length,
      keyboardEvents: payload.keyboardData.length,
      scrollEvents: payload.scrollData.length,
      captchaPassed: payload.captchaPassed,
      sessionId: payload.sessionId
    });
  }, responseDelay);
};

/**
 * Generate or retrieve a session ID
 */
const getSessionId = () => {
  // Check if we already have a session ID in localStorage
  let sessionId = localStorage.getItem('veriplay_session_id');
  
  // If not, create a new one
  if (!sessionId) {
    sessionId = generateUniqueId();
    localStorage.setItem('veriplay_session_id', sessionId);
  }
  
  return sessionId;
};

/**
 * Generate a unique ID for session tracking
 */
const generateUniqueId = () => {
  return 'vpxxxxxxxx'.replace(/x/g, () => {
    return Math.floor(Math.random() * 16).toString(16);
  });
};
