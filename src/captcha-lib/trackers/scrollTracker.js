/**
 * Scroll behavior tracker
 * Records scroll patterns, speed, and behavior
 */

// Store collected scroll data
export const scrollData = [];

// Configuration
const sampleRate = 100; // ms between samples
let lastSampleTime = 0;
let lastScrollPosition = 0;
let isTracking = false;

/**
 * Start tracking scroll behavior
 */
export const startScrollTracking = () => {
  if (isTracking) return;
  
  isTracking = true;
  lastSampleTime = Date.now();
  
  // Get initial scroll position
  lastScrollPosition = window.scrollY || document.documentElement.scrollTop;
  
  // Add scroll event listener
  window.addEventListener('scroll', handleScroll);
  
  console.log('Scroll tracking started');
};

/**
 * Stop tracking scroll behavior
 */
export const stopScrollTracking = () => {
  if (!isTracking) return;
  
  window.removeEventListener('scroll', handleScroll);
  isTracking = false;
  
  console.log('Scroll tracking stopped');
};

/**
 * Handler for scroll events
 */
const handleScroll = () => {
  const currentTime = Date.now();
  
  // Only sample at specified rate to avoid excessive data
  if (currentTime - lastSampleTime < sampleRate) {
    return;
  }
  
  // Get current scroll position
  const currentScrollPosition = window.scrollY || document.documentElement.scrollTop;
  
  // Calculate scroll speed and direction
  const deltaY = currentScrollPosition - lastScrollPosition;
  const deltaTime = currentTime - lastSampleTime;
  const scrollSpeed = Math.abs(deltaY / deltaTime); // Pixels per millisecond
  const direction = deltaY > 0 ? 'down' : deltaY < 0 ? 'up' : 'none';
  
  // Calculate scroll depth as percentage
  const scrollHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight
  );
  
  const viewportHeight = window.innerHeight;
  const maxScrollPosition = scrollHeight - viewportHeight;
  const scrollDepth = maxScrollPosition > 0 
    ? currentScrollPosition / maxScrollPosition
    : 0;
  
  // Store the scroll data in the exact format requested
  scrollData.push({
    scrollTop: currentScrollPosition,
    speed: scrollSpeed,
    direction: direction,
    depth: scrollDepth,
    time: currentTime
  });
  
  // Update last values
  lastScrollPosition = currentScrollPosition;
  lastSampleTime = currentTime;
};
