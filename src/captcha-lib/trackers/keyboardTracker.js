/**
 * Keyboard event tracker
 * Records key press patterns, timing, and behavior
 */

// Store collected keyboard data
let keyTimings = [];

// Track key states
const keyStates = {};
let isTracking = false;
let lastKeyTime = 0;

/**
 * Start tracking keyboard events
 */
export const startKeyboardTracking = () => {
  if (isTracking) return;
  
  isTracking = true;
  lastKeyTime = Date.now();
  
  // Add event listeners
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);
  
  console.log('Keyboard tracking started');
};

/**
 * Stop tracking keyboard events
 */
export const stopKeyboardTracking = () => {
  if (!isTracking) return;
  
  document.removeEventListener('keydown', handleKeyDown);
  document.removeEventListener('keyup', handleKeyUp);
  isTracking = false;
  
  console.log('Keyboard tracking stopped');
};

/**
 * Handler for keydown events
 */
const handleKeyDown = (event) => {
  const currentTime = Date.now();
  const key = event.key;
  
  if (keyStates[key]) return;
  
  keyStates[key] = {
    downTime: currentTime,
    flightTime: currentTime - lastKeyTime
  };
  
  lastKeyTime = currentTime;
};

/**
 * Handler for keyup events
 */
const handleKeyUp = (event) => {
  const currentTime = Date.now();
  const key = event.key;
  
  if (!keyStates[key]) return;
  
  const dwellTime = currentTime - keyStates[key].downTime;
  
  keyTimings.push({
    key: key,
    dwellTime: dwellTime,
    flightTime: keyStates[key].flightTime,
    timestamp: keyStates[key].downTime
  });
  
  delete keyStates[key];
};

/**
 * Get active modifier keys during an event
 */
const getModifiers = (event) => {
  return {
    ctrl: event.ctrlKey,
    alt: event.altKey,
    shift: event.shiftKey,
    meta: event.metaKey
  };
};

/**
 * Anonymize sensitive keys for privacy
 * Returns category of key instead of actual character for some keys
 */
const anonymizeKey = (key) => {
  // Single character keys might be part of passwords, anonymize them
  if (key.length === 1) {
    if (/[a-z]/i.test(key)) {
      return '[LETTER]';
    } else if (/[0-9]/.test(key)) {
      return '[NUMBER]';
    } else {
      return '[SYMBOL]';
    }
  }
  
  // Special keys can be recorded as-is
  return key;
};

export { keyTimings };
