/**
 * Keyboard event tracker
 * Records key press patterns, timing, and behavior
 */

// Store collected keyboard data
export const keyTimings = [];

// Track key states
const keyStates = {};
let isTracking = false;
let lastKeyTime = Date.now();

/**
 * Start tracking keyboard events
 */
export const startKeyboardTracking = () => {
  if (isTracking) return;
  
  isTracking = true;
  
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
  const { key } = event;
  const currentTime = Date.now();
  
  // Skip modifier keys when alone
  if (['Control', 'Shift', 'Alt', 'Meta'].includes(key)) {
    return;
  }
  
  // Record the key press with timing data
  keyTimings.push({
    key: key,
    dwellTime: 0, // Will be updated on keyup
    flightTime: currentTime - lastKeyTime,
    timestamp: currentTime
  });
  
  lastKeyTime = currentTime;
};

/**
 * Handler for keyup events
 */
const handleKeyUp = (event) => {
  const { key } = event;
  const currentTime = Date.now();
  
  // Skip modifier keys when alone
  if (['Control', 'Shift', 'Alt', 'Meta'].includes(key)) {
    return;
  }
  
  // Find the last keydown event for this key
  const lastKeyEvent = keyTimings.findLast(event => event.key === key);
  if (lastKeyEvent) {
    lastKeyEvent.dwellTime = currentTime - lastKeyEvent.timestamp;
  }
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
