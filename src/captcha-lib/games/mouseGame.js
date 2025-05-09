/**
 * Mouse-based verification game
 * Player must click the moving target 5 times to complete
 */
import { mouseData } from '../trackers/mouseTracker.js';

export const startGame = (onComplete) => {
  const gameContainer = document.getElementById('captcha-game-container');
  
  if (!gameContainer) {
    console.error('Game container not found');
    return;
  }
  
  gameContainer.innerHTML = '';
  
  const gameTitle = document.createElement('h3');
  gameTitle.textContent = 'Click the Target';
  
  const instructions = document.createElement('p');
  instructions.textContent = 'Click the moving circle 5 times to verify';
  
  const gameArea = document.createElement('div');
  gameArea.className = 'mouse-game-area';
  
  const target = document.createElement('div');
  target.className = 'mouse-game-target';
  
  const counter = document.createElement('div');
  counter.className = 'mouse-game-counter';
  counter.textContent = '0/5';
  
  gameArea.appendChild(target);
  gameContainer.appendChild(gameTitle);
  gameContainer.appendChild(instructions);
  gameContainer.appendChild(gameArea);
  gameContainer.appendChild(counter);
  
  let clickCount = 0;
  const requiredClicks = 5;
  
  const gameData = {
    targetPositions: [],
    clickPositions: [],
    timings: []
  };
  
  const moveTarget = () => {
    const maxX = gameArea.clientWidth - target.clientWidth;
    const maxY = gameArea.clientHeight - target.clientHeight;
    
    const newX = Math.floor(Math.random() * maxX);
    const newY = Math.floor(Math.random() * maxY);
    
    target.style.left = `${newX}px`;
    target.style.top = `${newY}px`;
    
    gameData.targetPositions.push({
      x: newX,
      y: newY,
      time: Date.now()
    });
  };
  
  target.addEventListener('click', (e) => {
    e.stopPropagation();
    
    clickCount++;
    counter.textContent = `${clickCount}/${requiredClicks}`;
    
    gameData.clickPositions.push({
      x: e.clientX,
      y: e.clientY,
      time: Date.now()
    });
    
    target.classList.add('clicked');
    setTimeout(() => {
      target.classList.remove('clicked');
    }, 200);
    
    if (clickCount >= requiredClicks) {
      mouseData.push({
        type: 'game-data',
        game: 'mouse',
        data: gameData,
        timestamp: Date.now()
      });
      
      gameContainer.innerHTML = '<div class="success-message"><h3>Verification Successful!</h3><p>Thank you for verifying.</p></div>';
      
      onComplete(true);
    } else {
      moveTarget();
    }
  });
  
  moveTarget();
};
