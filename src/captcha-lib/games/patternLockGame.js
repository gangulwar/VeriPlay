/**
 * Pattern Lock Game
 * Players must connect dots in a specific pattern using mouse movements
 */
import { mouseData, startMouseTracking, stopMouseTracking } from '../trackers/mouseTracker.js';

// Predefined patterns - each array represents dot indices to connect
const PATTERNS = [
  // Letter patterns
  [0, 3, 6, 7, 8], // L shape
  [0, 1, 2, 5, 8, 7, 6], // U shape
  [0, 4, 8, 5, 2], // X shape
  [1, 4, 7, 3, 5, 8], // N shape
  [0, 1, 2, 5, 8, 7, 6, 3], // Square shape
  // Arrow patterns
  [3, 4, 5, 8], // Down arrow
  [1, 4, 7, 3, 5], // Diamond
  [0, 4, 8, 5, 2, 1], // House shape
];

// Constants
const GRID_SIZE = 3;
const DOT_SIZE = 20;
const SPACING = 80;
const OFFSET = 60;
const GAME_AREA_SIZE = 300;
const PREVIEW_SIZE = 120;
const SUCCESS_DELAY = 500;

// Cache DOM queries and calculations
const createDomElement = (tag, className, styles = {}) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  Object.assign(element.style, styles);
  return element;
};

// Memoized distance calculation
const distanceCache = new Map();
const calculateDistance = (x1, y1, x2, y2) => {
  const key = `${x1},${y1},${x2},${y2}`;
  if (!distanceCache.has(key)) {
    distanceCache.set(key, Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)));
  }
  return distanceCache.get(key);
};

export const startGame = (onComplete) => {
  const gameContainer = document.getElementById('captcha-game-container');
  if (!gameContainer) {
    console.error('Game container not found');
    return;
  }

  startMouseTracking();
  gameContainer.innerHTML = '';

  // Create game elements using optimized DOM creation
  const gameElements = {
    title: createDomElement('h3', 'pattern-title', { textContent: 'Pattern Verification' }),
    instructions: createDomElement('p', 'pattern-instructions', { textContent: 'Connect the dots following the highlighted pattern' }),
    gameArea: createDomElement('div', 'pattern-game-area'),
    patternPreview: createDomElement('div', 'pattern-preview'),
    canvas: createDomElement('canvas', 'pattern-canvas'),
    previewCanvas: createDomElement('canvas', 'pattern-preview-canvas')
  };

  // Initialize game state
  const gameState = {
    dots: [],
    pattern: PATTERNS[Math.floor(Math.random() * PATTERNS.length)],
    currentPath: [],
    isDrawing: false,
    startTime: null,
    endTime: null,
    completed: false,
    rect: null // Cache for getBoundingClientRect
  };

  // Setup canvases
  const setupCanvas = (canvas, size) => {
    Object.assign(canvas.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      pointerEvents: 'none'
    });
    canvas.width = size;
    canvas.height = size;
    return canvas.getContext('2d');
  };

  const ctx = setupCanvas(gameElements.canvas, GAME_AREA_SIZE);
  const previewCtx = setupCanvas(gameElements.previewCanvas, PREVIEW_SIZE);

  // Optimized dot creation with DocumentFragment
  const createDots = (container, dotScale = 1, isPreview = false) => {
    const fragment = document.createDocumentFragment();
    const dots = [];
    const dotSizeScaled = DOT_SIZE * dotScale;
    const spacingScaled = SPACING * dotScale;
    const offsetScaled = OFFSET * dotScale;

    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
      const row = Math.floor(i / GRID_SIZE);
      const col = i % GRID_SIZE;
      const dot = createDomElement('div', `pattern-dot${isPreview ? ' preview' : ''}`);
      
      const x = offsetScaled + col * spacingScaled + dotSizeScaled / 2;
      const y = offsetScaled + row * spacingScaled + dotSizeScaled / 2;
      
      Object.assign(dot.style, {
        width: `${dotSizeScaled}px`,
        height: `${dotSizeScaled}px`,
        left: `${x - dotSizeScaled / 2}px`,
        top: `${y - dotSizeScaled / 2}px`
      });

      dots.push({ element: dot, index: i, x, y, connected: false });
      fragment.appendChild(dot);
    }
    
    container.appendChild(fragment);
    return dots;
  };

  // Create game and preview dots
  gameState.dots = createDots(gameElements.gameArea);
  const previewDots = createDots(gameElements.patternPreview, 0.4, true);

  // Optimized preview pattern drawing
  const drawPreviewPattern = () => {
    const fragment = document.createDocumentFragment();
    previewCtx.strokeStyle = '#4CAF50';
    previewCtx.lineWidth = 2;
    previewCtx.beginPath();

    gameState.pattern.forEach((dotIndex, index) => {
      const dot = previewDots[dotIndex];
      const numberDiv = createDomElement('div', 'pattern-number');
      
      Object.assign(numberDiv.style, {
        left: `${dot.x}px`,
        top: `${dot.y}px`
      });
      
      numberDiv.textContent = (index + 1).toString();
      dot.element.classList.add('highlighted');
      fragment.appendChild(numberDiv);

      if (index === 0) {
        previewCtx.moveTo(dot.x, dot.y);
      } else {
        previewCtx.lineTo(dot.x, dot.y);
      }
    });

    previewCtx.stroke();
    gameElements.patternPreview.appendChild(fragment);
  };

  // Optimized line drawing with requestAnimationFrame
  const drawLine = (() => {
    let rafId = null;
    
    return (x1, y1, x2, y2, color = '#4CAF50') => {
      if (rafId) cancelAnimationFrame(rafId);
      
      rafId = requestAnimationFrame(() => {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.stroke();
      });
    };
  })();

  const clearCanvas = () => {
    ctx.clearRect(0, 0, GAME_AREA_SIZE, GAME_AREA_SIZE);
  };

  // Throttled mouse event handlers
  const throttle = (fn, delay) => {
    let lastCall = 0;
    return (...args) => {
      const now = Date.now();
      if (now - lastCall >= delay) {
        fn(...args);
        lastCall = now;
      }
    };
  };

  const handleMouseDown = (e) => {
    if (gameState.completed) return;

    if (!gameState.rect) {
      gameState.rect = gameElements.gameArea.getBoundingClientRect();
    }

    const x = e.clientX - gameState.rect.left;
    const y = e.clientY - gameState.rect.top;
    const startDot = gameState.dots[gameState.pattern[0]];
    
    if (calculateDistance(x, y, startDot.x, startDot.y) < DOT_SIZE) {
      gameState.isDrawing = true;
      gameState.currentPath = [gameState.pattern[0]];
      gameState.startTime = Date.now();
      startDot.element.classList.add('connected');
      startDot.connected = true;
    }
  };

  const handleMouseMove = throttle((e) => {
    if (!gameState.isDrawing || gameState.completed) return;

    const x = e.clientX - gameState.rect.left;
    const y = e.clientY - gameState.rect.top;

    clearCanvas();
    
    // Draw connected lines
    for (let i = 1; i < gameState.currentPath.length; i++) {
      const prevDot = gameState.dots[gameState.currentPath[i-1]];
      const currentDot = gameState.dots[gameState.currentPath[i]];
      drawLine(prevDot.x, prevDot.y, currentDot.x, currentDot.y);
    }

    // Draw line to cursor
    const lastDot = gameState.dots[gameState.currentPath[gameState.currentPath.length - 1]];
    drawLine(lastDot.x, lastDot.y, x, y);

    // Check next dot
    const nextPatternIndex = gameState.currentPath.length;
    if (nextPatternIndex < gameState.pattern.length) {
      const nextDot = gameState.dots[gameState.pattern[nextPatternIndex]];
      
      if (!nextDot.connected && calculateDistance(x, y, nextDot.x, nextDot.y) < DOT_SIZE) {
        nextDot.element.classList.add('connected');
        nextDot.connected = true;
        gameState.currentPath.push(gameState.pattern[nextPatternIndex]);

        if (gameState.currentPath.length === gameState.pattern.length) {
          gameState.completed = true;
          gameState.endTime = Date.now();
          stopMouseTracking();
          
          setTimeout(() => {
            gameContainer.innerHTML = '<div class="success-message"><h3>Pattern Verified!</h3><p>Thank you for verifying.</p></div>';
            onComplete(true);
          }, SUCCESS_DELAY);
        }
      }
    }
  }, 16); // ~60fps

  const handleMouseUp = () => {
    if (!gameState.isDrawing) return;
    
    gameState.isDrawing = false;
    
    if (!gameState.completed) {
      clearCanvas();
      gameState.currentPath = [];
      gameState.dots.forEach(dot => {
        dot.element.classList.remove('connected');
        dot.connected = false;
      });
    }
  };

  // Event listeners
  gameElements.gameArea.addEventListener('mousedown', handleMouseDown);
  gameElements.gameArea.addEventListener('mousemove', handleMouseMove);
  gameElements.gameArea.addEventListener('mouseup', handleMouseUp);
  gameElements.gameArea.addEventListener('mouseleave', handleMouseUp);

  // Add elements to DOM
  gameElements.patternPreview.appendChild(gameElements.previewCanvas);
  gameElements.gameArea.appendChild(gameElements.canvas);
  
  const fragment = document.createDocumentFragment();
  fragment.appendChild(gameElements.title);
  fragment.appendChild(gameElements.instructions);
  fragment.appendChild(gameElements.patternPreview);
  fragment.appendChild(gameElements.gameArea);
  gameContainer.appendChild(fragment);

  // Draw preview pattern
  drawPreviewPattern();
}; 