/**
 * Scroll behavior tracker
 * Records scroll patterns, speed, and behavior
 */

// Store collected scroll data
let scrollData = [];

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
  lastScrollPosition = window.scrollY || document.documentElement.scrollTop;
  
  window.addEventListener('scroll', handleScroll);
};

/**
 * Stop tracking scroll behavior
 */
export const stopScrollTracking = () => {
  if (!isTracking) return;
  
  window.removeEventListener('scroll', handleScroll);
  isTracking = false;
};

/**
 * Handler for scroll events
 */
const handleScroll = () => {
  const currentTime = Date.now();
  const currentScrollPosition = window.scrollY || document.documentElement.scrollTop;
  
  const deltaY = currentScrollPosition - lastScrollPosition;
  const deltaTime = currentTime - lastSampleTime;
  const scrollSpeed = Math.abs(deltaY / deltaTime);
  const direction = deltaY > 0 ? 'down' : deltaY < 0 ? 'up' : 'none';
  
  const scrollHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight
  );
  
  const viewportHeight = window.innerHeight;
  const maxScrollPosition = scrollHeight - viewportHeight;
  const depth = maxScrollPosition > 0 
    ? currentScrollPosition / maxScrollPosition
    : 0;
  
  scrollData.push({
    scrollTop: currentScrollPosition,
    speed: scrollSpeed,
    direction: direction,
    depth: depth,
    time: currentTime
  });
  
  lastScrollPosition = currentScrollPosition;
  lastSampleTime = currentTime;
};

export { scrollData };
