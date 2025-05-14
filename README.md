# VeriPlay CAPTCHA System

A modern, user-friendly CAPTCHA system that uses behavioral analysis and interactive games to verify human users. The system is designed to be both secure and user-friendly, with multiple verification methods and real-time behavioral tracking.

## Features

- **Multiple Verification Games**:
  - Mouse Click Game: Click moving targets
  - Typing Game: Type sentences with accuracy
  - Scroll Game: Scroll to bottom and back
  - Drag & Drop Game: Match shapes by color

- **Behavioral Analysis**:
  - Mouse movement tracking
  - Keyboard pattern analysis
  - Scroll behavior monitoring
  - Drag & drop interaction analysis

- **Security Features**:
  - Encrypted data storage
  - Session management
  - Attempt limiting
  - Real-time verification

## Quick Start

1. **Include Required Files**:
```html
<!-- Add to your HTML head -->
<link rel="stylesheet" href="path/to/captcha-lib/styles/captcha.css">

<!-- Add before closing body tag -->
<div id="captcha-root"></div>
<div id="real-root">
  <!-- Your actual content goes here -->
</div>
<script type="module" src="path/to/captcha-lib/captcha.js"></script>
```

2. **Initialize the System**:
```javascript
// The system will automatically initialize when the page loads
// To manually reset the CAPTCHA:
import { resetCaptcha } from 'path/to/captcha-lib/captcha.js';
resetCaptcha();
```

## Integration Methods

### 1. Basic Integration

```html
<!DOCTYPE html>
<html>
<head>
    <title>Your Page</title>
    <link rel="stylesheet" href="path/to/captcha-lib/styles/captcha.css">
</head>
<body>
    <!-- CAPTCHA container -->
    <div id="captcha-root"></div>
    
    <!-- Your content container -->
    <div id="real-root">
        <h1>Your Protected Content</h1>
        <!-- Your content here -->
    </div>

    <script type="module" src="path/to/captcha-lib/captcha.js"></script>
</body>
</html>
```

### 2. Framework Integration

#### React
```jsx
import { useEffect } from 'react';
import 'path/to/captcha-lib/styles/captcha.css';

function App() {
  useEffect(() => {
    // Import and initialize CAPTCHA
    import('path/to/captcha-lib/captcha.js');
  }, []);

  return (
    <div>
      <div id="captcha-root"></div>
      <div id="real-root">
        <h1>Your Protected Content</h1>
      </div>
    </div>
  );
}
```

#### Vue
```vue
<template>
  <div>
    <div id="captcha-root"></div>
    <div id="real-root">
      <h1>Your Protected Content</h1>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    import('path/to/captcha-lib/captcha.js');
  }
}
</script>
```

### 3. Custom Configuration

```javascript
// Create a config file (e.g., captcha-config.js)
export const captchaConfig = {
  // Game settings
  games: {
    mouseGame: {
      requiredClicks: 5,
      targetSpeed: 'medium'
    },
    typingGame: {
      maxErrorRate: 5,
      minCompletion: 0.9
    },
    scrollGame: {
      requiredDepth: 0.95,
      returnThreshold: 0.05
    },
    dragDropGame: {
      maxAttempts: 3,
      shapes: ['circle', 'square', 'triangle']
    }
  },
  
  // Tracking settings
  tracking: {
    mouseTracking: true,
    keyboardTracking: true,
    scrollTracking: true,
    dataSendInterval: 5000
  },
  
  // UI settings
  ui: {
    theme: 'light',
    language: 'en',
    customStyles: {
      // Your custom CSS variables
    }
  }
};

// Import and use in your main file
import { captchaConfig } from './captcha-config.js';
```

## Data Collection

The system collects the following behavioral data:

```javascript
{
  mouseMovements: [
    {
      x: number,
      y: number,
      time: timestamp
    }
  ],
  keyTimings: [
    {
      key: string,
      dwellTime: number,
      flightTime: number,
      timestamp: number
    }
  ],
  scrollData: [
    {
      scrollTop: number,
      speed: number,
      direction: string,
      depth: number,
      time: number
    }
  ]
}
```

## Security Considerations

1. **Data Storage**:
   - All behavioral data is encrypted before storage
   - Data is stored locally with session management
   - Automatic cleanup of old data

2. **Verification Process**:
   - Multiple verification methods
   - Real-time behavioral analysis
   - Attempt limiting
   - Session-based verification

3. **Best Practices**:
   - Always use HTTPS
   - Implement rate limiting
   - Monitor for suspicious patterns
   - Regular updates and maintenance

## Customization

### Styling
```css
/* Override default styles */
:root {
  --captcha-primary-color: #your-color;
  --captcha-secondary-color: #your-color;
  --captcha-background: #your-color;
  --captcha-text-color: #your-color;
}
```

### Game Selection
```javascript
// Modify game selection in captcha.js
const games = [
  startMouseGame,
  startTypingGame,
  startScrollGame,
  startDragDropGame,
  startPatternGame
  // Add or remove games as needed
];
```

## Support

For issues, feature requests, or contributions:
1. Open an issue on GitHub
2. Submit a pull request
3. Contact the development team

## License

MIT License - See LICENSE file for details
