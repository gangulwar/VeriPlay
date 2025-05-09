import { initCaptcha } from './gameManager.js';
import { startMouseTracking } from './trackers/mouseTracker.js';
import { startKeyboardTracking } from './trackers/keyboardTracker.js';
import { startScrollTracking } from './trackers/scrollTracker.js';
import { send, setCaptchaPassed } from './apiSimulator.js';

const initializeVeriPlay = () => {
  console.log('Initializing VeriPlay...');
  
  const captchaRoot = document.getElementById('captcha-root');
  const realRoot = document.getElementById('real-root');
  
  if (!captchaRoot || !realRoot) {
    console.error('CAPTCHA containers not found. Make sure to add #captcha-root and #real-root elements to your page.');
    return;
  }
  
  console.log('Starting trackers...');
  startMouseTracking();
  startKeyboardTracking();
  startScrollTracking();
  
  console.log('Setting up periodic data sending...');
  setInterval(() => {
    send().then(data => {
      if (data) {
        console.log('Data sent successfully');
      }
    }).catch(error => {
      console.error('Error sending data:', error);
    });
  }, 5000);
  
  const overlay = document.createElement('div');
  overlay.className = 'captcha-overlay';
  
  const contentContainer = document.createElement('div');
  contentContainer.className = 'captcha-content';
  
  const header = document.createElement('div');
  header.className = 'captcha-header';
  header.innerHTML = `
    <h2>Human Verification</h2>
    <p>Complete the challenge to continue</p>
  `;
  
  const gameContainer = document.createElement('div');
  gameContainer.className = 'captcha-game-container';
  gameContainer.id = 'captcha-game-container';
  
  contentContainer.appendChild(header);
  contentContainer.appendChild(gameContainer);
  overlay.appendChild(contentContainer);
  captchaRoot.appendChild(overlay);
  
  if (realRoot) {
    realRoot.style.display = 'none';
  }
  
  console.log('Initializing CAPTCHA game...');
  initCaptcha((success) => {
    if (success) {
      console.log('CAPTCHA passed, starting verification...');
      setCaptchaPassed();
      
      const checkVerification = setInterval(() => {
        const loader = document.getElementById('captcha-loader');
        if (!loader) {
          clearInterval(checkVerification);
          
          overlay.classList.add('fade-out');
          
          setTimeout(() => {
            captchaRoot.style.display = 'none';
            if (realRoot) {
              realRoot.style.display = 'block';
            }
          }, 500);
        }
      }, 100);
    }
  });
};

console.log('Loading VeriPlay...');
initializeVeriPlay();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing VeriPlay...');
    initializeVeriPlay();
  });
}

export const resetCaptcha = () => {
  const captchaRoot = document.getElementById('captcha-root');
  const realRoot = document.getElementById('real-root');
  
  if (captchaRoot && realRoot) {
    captchaRoot.style.display = 'block';
    realRoot.style.display = 'none';
    initCaptcha();
  }
};
