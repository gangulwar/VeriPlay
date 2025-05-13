/**
 * Game Manager responsible for selecting and initializing random games
 */
import { startGame as startMouseGame } from './games/mouseGame.js';
import { startGame as startTypingGame } from './games/typingGame.js';
import { startGame as startScrollGame } from './games/scrollGame.js';
import { startGame as startPatternGame } from './games/patternLockGame.js';

// List of available games
const gameList = [
  { name: 'mouse', start: startMouseGame },
  { name: 'typing', start: startTypingGame },
  { name: 'scroll', start: startScrollGame },
  { name: 'pattern', start: startPatternGame }
];

/**
 * Initializes a random CAPTCHA game
 * @param {Function} callback - Function to call when game is completed
 */
export const initCaptcha = (callback) => {
  // Select a random game from the list
  const randomIndex = Math.floor(Math.random() * gameList.length);
  const selectedGame = gameList[randomIndex];
  
  console.log(`Starting ${selectedGame.name} game...`);
  
  // Start the selected game
  selectedGame.start((success) => {
    if (success) {
      console.log(`${selectedGame.name} game completed successfully`);
      if (callback) {
        callback(true);
      }
    } else {
      console.log(`${selectedGame.name} game failed`);
      if (callback) {
        callback(false);
      }
    }
  });
};
