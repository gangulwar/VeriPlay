/**
 * Typing-based verification game
 * Player must type the displayed text with less than 5% error rate
 */
import { keyTimings } from '../trackers/keyboardTracker.js';

export const startGame = (onComplete) => {
  const gameContainer = document.getElementById('captcha-game-container');
  
  if (!gameContainer) {
    console.error('Game container not found');
    return;
  }
  
  gameContainer.innerHTML = '';
  
  const sentences = [
    "The quick brown fox jumps over the lazy dog.",
    "A journey of a thousand miles begins with a single step.",
    "All that glitters is not gold.",
    "The early bird catches the worm.",
    "Actions speak louder than words."
  ];
  
  const targetSentence = sentences[Math.floor(Math.random() * sentences.length)];
  
  const gameTitle = document.createElement('h3');
  gameTitle.textContent = 'Type the Sentence';
  
  const instructions = document.createElement('p');
  instructions.textContent = 'Type the text below with less than 5% errors';
  
  const displayText = document.createElement('div');
  displayText.className = 'typing-game-text';
  displayText.textContent = targetSentence;
  
  const inputContainer = document.createElement('div');
  inputContainer.className = 'typing-game-input-container';
  
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'typing-game-input';
  input.placeholder = 'Type here...';
  
  // Prevent paste functionality
  input.addEventListener('paste', (e) => {
    e.preventDefault();
  });
  
  // Prevent context menu (right-click paste)
  input.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });
  
  const feedbackElement = document.createElement('div');
  feedbackElement.className = 'typing-game-feedback';
  
  inputContainer.appendChild(input);
  gameContainer.appendChild(gameTitle);
  gameContainer.appendChild(instructions);
  gameContainer.appendChild(displayText);
  gameContainer.appendChild(inputContainer);
  gameContainer.appendChild(feedbackElement);
  
  const gameData = {
    targetText: targetSentence,
    typingData: [],
    startTime: Date.now(),
    endTime: null
  };
  
  input.focus();
  
  const calculateErrorRate = (typed, target) => {
    if (!typed) return 100;
    
    const m = typed.length;
    const n = target.length;
    const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
    
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (typed[i - 1] === target[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        }
      }
    }
    
    return (dp[m][n] / Math.max(m, n)) * 100;
  };
  
  input.addEventListener('input', () => {
    const currentText = input.value;
    const errorRate = calculateErrorRate(currentText, targetSentence);
    
    gameData.typingData.push({
      typed: currentText,
      time: Date.now(),
      errorRate: errorRate
    });
    
    if (errorRate <= 5) {
      feedbackElement.textContent = `Error rate: ${errorRate.toFixed(1)}% - Good!`;
      feedbackElement.style.color = '#4CAF50';
      
      if (currentText.length >= targetSentence.length * 0.9) {
        gameData.endTime = Date.now();
        
        keyTimings.push({
          type: 'game-data',
          game: 'typing',
          data: gameData,
          timestamp: Date.now()
        });
        
        gameContainer.innerHTML = '<div class="success-message"><h3>Verification Successful!</h3><p>Thank you for verifying.</p></div>';
        
        onComplete(true);
      }
    } else {
      feedbackElement.textContent = `Error rate: ${errorRate.toFixed(1)}% - Keep trying`;
      feedbackElement.style.color = errorRate > 20 ? '#F44336' : '#FF9800';
    }
  });
};
