/**
 * Mouse movement tracker
 * Records mouse movement patterns, speed, and behavior
 */

// Store collected mouse data
export const mouseData = [];

// Configuration
const sampleRate = 50; // ms between samples (lower = more data)
let lastSampleTime = 0;
let isTracking = false;

/**
 * Start tracking mouse movements
 */
export const startMouseTracking = () => {
  if (isTracking) return;
  
  isTracking = true;
  lastSampleTime = Date.now();
  
  // Mousemove event listener
  document.addEventListener('mousemove', handleMouseMove);
  
  console.log('Mouse tracking started');
};

/**
 * Stop tracking mouse movements
 */
export const stopMouseTracking = () => {
  if (!isTracking) return;
  
  document.removeEventListener('mousemove', handleMouseMove);
  isTracking = false;
  
  console.log('Mouse tracking stopped');
};

/**
 * Handler for mouse movement events
 */
const handleMouseMove = (event) => {
  const currentTime = Date.now();
  
  // Only sample at the specified rate to avoid excessive data
  if (currentTime - lastSampleTime < sampleRate) {
    return;
  }
  
  const { clientX, clientY } = event;
  
  // Store the data in the exact format requested
  mouseData.push({
    x: clientX,
    y: clientY,
    time: currentTime
  });
  
  lastSampleTime = currentTime;
};
