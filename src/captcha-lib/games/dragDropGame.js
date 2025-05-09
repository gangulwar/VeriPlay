/**
 * Drag & Drop verification game
 * Player must match items to their correct drop zones
 */
import { mouseData } from '../trackers/mouseTracker.js';

export const startGame = (onComplete) => {
  const gameContainer = document.getElementById('captcha-game-container');
  
  if (!gameContainer) {
    console.error('Game container not found');
    return;
  }
  
  gameContainer.innerHTML = '';
  
  // Game configuration
  const items = [
    { id: 'circle', type: 'shape', color: '#FF6B6B' },
    { id: 'square', type: 'shape', color: '#4ECDC4' },
    { id: 'triangle', type: 'shape', color: '#45B7D1' }
  ];
  
  const dropZones = [
    { id: 'shape1', type: 'shape', accepts: 'circle', color: '#FF6B6B' },
    { id: 'shape2', type: 'shape', accepts: 'square', color: '#4ECDC4' },
    { id: 'shape3', type: 'shape', accepts: 'triangle', color: '#45B7D1' }
  ];
  
  // Game state
  let attempts = 0;
  const maxAttempts = 3;
  let correctMatches = 0;
  let currentDragItem = null;
  
  // Game data tracking
  const gameData = {
    dragEvents: [],
    attempts: [],
    startTime: Date.now(),
    endTime: null
  };
  
  // Create game elements
  const gameTitle = document.createElement('h3');
  gameTitle.textContent = 'Match the Colors';
  
  const instructions = document.createElement('p');
  instructions.textContent = 'Drag each shape to its matching colored zone';
  
  const attemptsCounter = document.createElement('div');
  attemptsCounter.className = 'drag-game-attempts';
  attemptsCounter.textContent = `Attempts: ${attempts}/${maxAttempts}`;
  
  const itemsContainer = document.createElement('div');
  itemsContainer.className = 'drag-game-items';
  
  const dropZonesContainer = document.createElement('div');
  dropZonesContainer.className = 'drag-game-dropzones';
  
  // Create draggable items
  items.forEach(item => {
    const itemElement = document.createElement('div');
    itemElement.className = 'drag-game-item';
    itemElement.id = item.id;
    itemElement.draggable = true;
    itemElement.style.backgroundColor = item.color;
    
    // Add shape based on type
    if (item.id === 'circle') {
      itemElement.style.borderRadius = '50%';
    } else if (item.id === 'triangle') {
      itemElement.style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
    }
    
    // Drag event handlers
    itemElement.addEventListener('dragstart', (e) => {
      currentDragItem = item;
      e.dataTransfer.setData('text/plain', item.id);
      itemElement.classList.add('dragging');
      
      // Highlight matching drop zone
      const matchingZone = document.querySelector(`[data-accepts="${item.id}"]`);
      if (matchingZone) {
        matchingZone.style.borderColor = item.color;
        matchingZone.style.backgroundColor = `${item.color}20`;
      }
      
      // Record drag start
      gameData.dragEvents.push({
        type: 'start',
        itemId: item.id,
        position: { x: e.clientX, y: e.clientY },
        time: Date.now()
      });
    });
    
    itemElement.addEventListener('dragend', (e) => {
      itemElement.classList.remove('dragging');
      
      // Reset all drop zones
      document.querySelectorAll('.drag-game-dropzone').forEach(zone => {
        zone.style.borderColor = '#ccc';
        zone.style.backgroundColor = 'transparent';
      });
      
      // Record drag end
      gameData.dragEvents.push({
        type: 'end',
        itemId: item.id,
        position: { x: e.clientX, y: e.clientY },
        time: Date.now()
      });
    });
    
    itemsContainer.appendChild(itemElement);
  });
  
  // Create drop zones
  dropZones.forEach(zone => {
    const zoneElement = document.createElement('div');
    zoneElement.className = 'drag-game-dropzone';
    zoneElement.id = zone.id;
    zoneElement.dataset.accepts = zone.accepts;
    
    // Add a small colored dot to indicate the target color
    const colorIndicator = document.createElement('div');
    colorIndicator.className = 'color-indicator';
    colorIndicator.style.backgroundColor = zone.color;
    zoneElement.appendChild(colorIndicator);
    
    // Drop zone event handlers
    zoneElement.addEventListener('dragover', (e) => {
      e.preventDefault();
      if (currentDragItem && currentDragItem.id === zone.accepts) {
        zoneElement.style.borderColor = zone.color;
        zoneElement.style.backgroundColor = `${zone.color}20`;
      }
    });
    
    zoneElement.addEventListener('dragleave', () => {
      if (currentDragItem && currentDragItem.id === zone.accepts) {
        zoneElement.style.borderColor = zone.color;
        zoneElement.style.backgroundColor = `${zone.color}20`;
      }
    });
    
    zoneElement.addEventListener('drop', (e) => {
      e.preventDefault();
      
      const itemId = e.dataTransfer.getData('text/plain');
      const isCorrect = zone.accepts === itemId;
      
      // Record attempt
      attempts++;
      attemptsCounter.textContent = `Attempts: ${attempts}/${maxAttempts}`;
      
      gameData.attempts.push({
        itemId,
        zoneId: zone.id,
        isCorrect,
        time: Date.now()
      });
      
      if (isCorrect) {
        zoneElement.classList.add('correct');
        const item = document.getElementById(itemId);
        item.style.display = 'none';
        correctMatches++;
        
        if (correctMatches === items.length) {
          gameData.endTime = Date.now();
          
          // Add game data to mouse data
          mouseData.push({
            type: 'game-data',
            game: 'drag-drop',
            data: gameData,
            timestamp: Date.now()
          });
          
          gameContainer.innerHTML = '<div class="success-message"><h3>Verification Successful!</h3><p>Thank you for verifying.</p></div>';
          onComplete(true);
        }
      } else {
        zoneElement.classList.add('incorrect');
        setTimeout(() => {
          zoneElement.classList.remove('incorrect');
        }, 1000);
        
        if (attempts >= maxAttempts) {
          gameData.endTime = Date.now();
          gameContainer.innerHTML = '<div class="error-message"><h3>Verification Failed</h3><p>Too many incorrect attempts.</p></div>';
          onComplete(false);
        }
      }
    });
    
    dropZonesContainer.appendChild(zoneElement);
  });
  
  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    .drag-game-items {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
      justify-content: center;
    }
    
    .drag-game-item {
      width: 60px;
      height: 60px;
      cursor: move;
      transition: transform 0.2s;
    }
    
    .drag-game-item.dragging {
      opacity: 0.5;
      transform: scale(1.1);
    }
    
    .drag-game-dropzones {
      display: flex;
      gap: 20px;
      justify-content: center;
    }
    
    .drag-game-dropzone {
      width: 80px;
      height: 80px;
      border: 2px dashed #ccc;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
      position: relative;
    }
    
    .color-indicator {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      position: absolute;
      top: 10px;
      left: 10px;
    }
    
    .drag-game-dropzone.correct {
      border-color: #4CAF50;
      background-color: rgba(76,175,80,0.1);
    }
    
    .drag-game-dropzone.incorrect {
      border-color: #F44336;
      background-color: rgba(244,67,54,0.1);
      animation: shake 0.5s;
    }
    
    .drag-game-attempts {
      margin: 10px 0;
      font-weight: bold;
    }
    
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
  `;
  
  // Append all elements
  document.head.appendChild(style);
  gameContainer.appendChild(gameTitle);
  gameContainer.appendChild(instructions);
  gameContainer.appendChild(attemptsCounter);
  gameContainer.appendChild(itemsContainer);
  gameContainer.appendChild(dropZonesContainer);
}; 