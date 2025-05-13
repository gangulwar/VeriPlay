/**
 * Scroll-based verification game
 * Player must scroll to the bottom and back to top to complete
 */
import { scrollData } from '../trackers/scrollTracker.js';

export const startGame = (onComplete) => {
  // Get the game container
  const gameContainer = document.getElementById('captcha-game-container');
  
  if (!gameContainer) {
    console.error('Game container not found');
    return;
  }
  
  // Clear any existing content
  gameContainer.innerHTML = '';
  
  // Create game elements
  const gameTitle = document.createElement('h3');
  gameTitle.textContent = 'Scroll Verification';
  
  const instructions = document.createElement('p');
  instructions.textContent = 'Scroll to the bottom and back to the top to verify';
  
  const scrollArea = document.createElement('div');
  scrollArea.className = 'scroll-game-area';
  
  // Create content for scrolling
  const contentHeight = 1500; // Tall enough to require scrolling
  const contentElement = document.createElement('div');
  contentElement.className = 'scroll-game-content';
  contentElement.style.height = `${contentHeight}px`;
  
  // Add some visual markers at top, middle, and bottom
  const topMarker = document.createElement('div');
  topMarker.className = 'scroll-marker top-marker';
  topMarker.textContent = 'START';
  
  const middleMarker = document.createElement('div');
  middleMarker.className = 'scroll-marker middle-marker';
  middleMarker.textContent = 'HALFWAY';
  middleMarker.style.top = `${contentHeight / 2}px`;
  
  const bottomMarker = document.createElement('div');
  bottomMarker.className = 'scroll-marker bottom-marker';
  bottomMarker.textContent = 'BOTTOM - Now scroll back up!';
  bottomMarker.style.top = `${contentHeight - 50}px`;
  
  // Add progress indicator
  const progressIndicator = document.createElement('div');
  progressIndicator.className = 'scroll-progress-indicator';
  progressIndicator.innerHTML = '<span>0%</span>';
  
  // Append elements to the DOM
  contentElement.appendChild(topMarker);
  contentElement.appendChild(middleMarker);
  contentElement.appendChild(bottomMarker);
  scrollArea.appendChild(contentElement);
  gameContainer.appendChild(gameTitle);
  gameContainer.appendChild(instructions);
  gameContainer.appendChild(progressIndicator);
  gameContainer.appendChild(scrollArea);
  
  // Game state
  let reachedBottom = false;
  let reachedTopAfterBottom = false;
  let gameCompleted = false;
  
  // Game data
  const gameData = {
    scrollPatterns: [],
    reachedBottom: false,
    reachedTopAfterBottom: false,
    startTime: Date.now(),
    endTime: null
  };
  
  // Scroll event handler
  scrollArea.addEventListener('scroll', () => {
    const scrollPosition = scrollArea.scrollTop;
    const maxScroll = contentElement.clientHeight - scrollArea.clientHeight;
    let progressPercentage = 0;

    // Calculate progress percentage based on game state
    if (!reachedBottom) {
      // First phase: scrolling down (0% to 50%)
      progressPercentage = Math.round((scrollPosition / maxScroll) * 50);
    } else {
      // Second phase: scrolling up (50% to 100%)
      progressPercentage = 50 + Math.round(((maxScroll - scrollPosition) / maxScroll) * 50);
    }
    
    // Update progress indicator
    progressIndicator.innerHTML = `<span>${Math.min(progressPercentage, 100)}%</span>`;
    
    // Record scroll data for this game
    gameData.scrollPatterns.push({
      position: scrollPosition,
      maxScroll: maxScroll,
      time: Date.now()
    });
    
    // Check if user reached bottom (95% of scroll or more)
    if (!reachedBottom && scrollPosition >= maxScroll * 0.95) {
      reachedBottom = true;
      gameData.reachedBottom = true;
      bottomMarker.textContent = '✓ REACHED! Now go back to top!';
      bottomMarker.classList.add('reached');
    }
    
    // Check if user returned to top after reaching bottom
    if (reachedBottom && !reachedTopAfterBottom && scrollPosition <= maxScroll * 0.05) {
      reachedTopAfterBottom = true;
      gameData.reachedTopAfterBottom = true;
      gameData.endTime = Date.now();
      
      if (!gameCompleted) {
        gameCompleted = true;
        
        // Add game data to scroll data
        scrollData.push({
          type: 'game-data',
          game: 'scroll',
          data: gameData,
          timestamp: Date.now()
        });
        
        // Show success message
        gameContainer.innerHTML = '<div class="success-message"><h3>Verification Successful!</h3><p>Thank you for verifying.</p></div>';
        
        // Call completion callback after a short delay
        setTimeout(() => {
          onComplete(true);
        }, 1000);
      }
    }
  });
};
