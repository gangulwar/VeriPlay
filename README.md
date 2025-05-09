# HumanPlay CAPTCHA Integration Guide

## Overview

HumanPlay CAPTCHA is an advanced human verification system that uses behavioral biometrics to distinguish humans from bots. It tracks mouse movements, keystroke dynamics, and scroll patterns to create a unique behavioral profile.

## Features

- 🖱️ Mouse movement tracking
- ⌨️ Keystroke dynamics analysis
- 📜 Scroll behavior monitoring
- 🔒 Data encryption and secure storage
- ⏱️ Realistic verification delay
- ⛔ Copy-paste prevention

## Quick Start

1. Include the required files in your project:
   ```html
   <link rel="stylesheet" href="captcha.css">
   <script src="captcha.js"></script>
   ```

2. Add the CAPTCHA overlay structure to your HTML:
   ```html
   <div id="captcha-overlay">
       <div class="captcha-container">
           <h2>Human Verification</h2>
           <p class="challenge-text">Please type the following sentence to verify you are human:</p>
           <p id="challenge-text" class="challenge-text">Your custom challenge text here</p>
           <input type="text" id="user-input" class="input-field" placeholder="Type the sentence here...">
           <button id="submit-btn" class="submit-btn">Verify</button>
           <div id="error-message" class="error-message"></div>
           <div id="loading" class="loading">
               <div class="spinner"></div>
               <p>Verifying...</p>
           </div>
       </div>
   </div>

   <div id="real-root" style="display:none">
       <!-- Your main website content -->
   </div>
   ```

## Data Collection

The system collects the following behavioral data:

### Mouse Movements
- X and Y coordinates
- Timestamp of each movement

### Keystroke Dynamics
- Dwell time (how long a key is held)
- Flight time (time between key presses)
- Key sequence and timing

### Scroll Behavior
- Scroll speed
- Direction changes
- Scroll depth
- Acceleration patterns

## Data Storage

Data is stored in two ways:

1. **IndexedDB Storage**
   - Encrypted behavioral data
   - Timestamp of collection
   - Session-specific storage

2. **Console Logging**
   - Raw data for debugging
   - Real-time monitoring
   - Development assistance

## Security Features

1. **Copy-Paste Prevention**
   - Disabled paste events on input fields
   - Manual typing required
   - Prevents automated form filling

2. **Data Encryption**
   - Base64 encoding (for demonstration)
   - Ready for production encryption
   - Secure storage implementation

3. **Verification Delay**
   - Simulated backend processing
   - Realistic user experience
   - Configurable delay time

## Customization

### Challenge Text
```html
<p id="challenge-text" class="challenge-text">Your custom challenge text here</p>
```

### Verification Delay
```javascript
// In captcha.js
await new Promise(resolve => setTimeout(resolve, 2000)); // 2 seconds delay
```

### Styling
The CAPTCHA interface can be customized using CSS:
```css
.captcha-container {
    /* Your custom styles */
}
```

## Development

### Debugging
1. Open browser console to view raw data
2. Use `atob()` to decode stored data
3. Monitor IndexedDB storage

### Testing
1. Verify mouse tracking
2. Test keyboard input
3. Check scroll behavior
4. Validate data storage

## Production Considerations

1. **Security**
   - Implement proper encryption
   - Add rate limiting
   - Set up proper backend validation

2. **Performance**
   - Optimize data collection
   - Implement data batching
   - Add cleanup routines

3. **User Experience**
   - Add error handling
   - Implement retry mechanisms
   - Provide clear feedback

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - See LICENSE file for details

## Support

For support, please open an issue in the repository or contact the development team.
