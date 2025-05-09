/**
 * Main controller for the HumanPlay CAPTCHA system
 * Initializes the CAPTCHA, manages the overlay, and coordinates trackers
 */
import { initCaptcha } from './gameManager.js';
import { startMouseTracking } from './trackers/mouseTracker.js';
import { startKeyboardTracking } from './trackers/keyboardTracker.js';
import { startScrollTracking } from './trackers/scrollTracker.js';
import { send, setCaptchaPassed } from './apiSimulator.js';

// Initialize CAPTCHA system
const initializeVeriPlay = () => {
  // Get references to the DOM elements
  const captchaRoot = document.getElementById('captcha-root');
  const realRoot = document.getElementById('real-root');
  
  // Safety check - make sure elements exist
  if (!captchaRoot || !realRoot) {
    console.error('CAPTCHA containers not found. Make sure to add #captcha-root and #real-root elements to your page.');
    return;
  }
  
  // Create overlay container
  const overlay = document.createElement('div');
  overlay.className = 'captcha-overlay';
  
  // Create content container
  const contentContainer = document.createElement('div');
  contentContainer.className = 'captcha-content';
  
  // Create header
  const header = document.createElement('div');
  header.className = 'captcha-header';
  header.innerHTML = `
    <h2>Human Verification</h2>
    <p>Complete the challenge to continue</p>
  `;
  
  // Create game container
  const gameContainer = document.createElement('div');
  gameContainer.className = 'captcha-game-container';
  gameContainer.id = 'captcha-game-container';
  
  // Assemble the DOM structure
  contentContainer.appendChild(header);
  contentContainer.appendChild(gameContainer);
  overlay.appendChild(contentContainer);
  captchaRoot.appendChild(overlay);
  
  // Ensure real content is hidden
  if (realRoot) {
    realRoot.style.display = 'none';
  }
  
  // Start all trackers
  startMouseTracking();
  startKeyboardTracking();
  startScrollTracking();
  
  // Initialize the CAPTCHA game
  initCaptcha((success) => {
    if (success) {
      // Start verification process
      setCaptchaPassed();
      
      // Wait for verification to complete before showing real content
      const checkVerification = setInterval(() => {
        const loader = document.getElementById('captcha-loader');
        if (!loader) {
          clearInterval(checkVerification);
          
          // Hide the CAPTCHA overlay with a fade effect
          overlay.classList.add('fade-out');
          
          // After animation completes, hide captcha and show real content
          setTimeout(() => {
            captchaRoot.style.display = 'none';
            if (realRoot) {
              realRoot.style.display = 'block';
            }
          }, 500); // Match this with CSS transition time
        }
      }, 100);
    }
  });
  
  // Schedule periodic data sending
  setInterval(() => {
    send();
  }, 15000); // Send data every 15 seconds
};

// Wait for DOM to be fully loaded before initializing
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeVeriPlay);
} else {
  // DOM already loaded, initialize now
  initializeVeriPlay();
}

// Export for potential external control
export const resetCaptcha = () => {
  const captchaRoot = document.getElementById('captcha-root');
  const realRoot = document.getElementById('real-root');
  
  if (captchaRoot && realRoot) {
    captchaRoot.style.display = 'block';
    realRoot.style.display = 'none';
    initCaptcha();
  }
};
