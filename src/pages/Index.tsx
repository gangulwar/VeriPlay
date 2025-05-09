import React, { useEffect, useState } from 'react';

const Index = () => {
  const [captchaLoaded, setCaptchaLoaded] = useState(false);

  useEffect(() => {
    // Import the CAPTCHA library dynamically and ensure DOM elements exist
    const loadCaptcha = async () => {
      try {
        // First, make sure the container elements exist
        const captchaRoot = document.getElementById('captcha-root');
        const realRoot = document.getElementById('real-root');
        
        if (!captchaRoot || !realRoot) {
          console.error('CAPTCHA containers not found in the DOM');
          return;
        }

        // In a real implementation, we would load from external path
        // For now, use direct import since we're including the files in the project
        await import('../captcha-lib/captcha.js');
        setCaptchaLoaded(true);
      } catch (error) {
        console.error('Failed to load CAPTCHA library:', error);
      }
    };
    
    // Add a small delay to ensure the DOM is ready
    setTimeout(() => {
      loadCaptcha();
    }, 100);
  }, []);

  return (
    <>
      {/* CAPTCHA container */}
      <div id="captcha-root" className="w-full h-screen"></div>
      
      {/* Real content (hidden until CAPTCHA is solved) */}
      <div id="real-root" style={{ display: 'none' }} className="min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <header className="mb-16 text-center">
            <h1 className="text-4xl font-bold mb-6">VeriPlay CAPTCHA System</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              This is a demonstration of the VeriPlay CAPTCHA system that uses gamification and behavioral tracking to verify human users.
            </p>
          </header>
          
          <section className="mb-16">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">About This System</h2>
              <p className="mb-4">
                The VeriPlay CAPTCHA is a modern approach to human verification that replaces traditional image-recognition challenges with interactive mini-games.
              </p>
              <p className="mb-4">
                This system not only verifies users through game interaction but also continues to monitor behavioral patterns to maintain security.
              </p>
              <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mt-6">
                <h3 className="font-bold text-blue-800 mb-2">Implementation Details</h3>
                <p className="text-blue-800">
                  This demonstration includes three types of games (mouse click, typing, and scrolling), as well as comprehensive behavioral tracking that continues even after verification.
                </p>
              </div>
            </div>
          </section>
          
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-3">Mouse Game</h3>
              <p>Click on the moving target multiple times to prove you're human. Tests coordination and reaction time.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-3">Typing Game</h3>
              <p>Type the displayed sentence with minimal errors. Tests language comprehension and typing patterns.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-3">Scroll Game</h3>
              <p>Scroll to the bottom of the container and back to the top. Tests scrolling behavior and attention.</p>
            </div>
          </section>
          
          <section className="bg-white p-8 rounded-lg shadow-md mb-16">
            <h2 className="text-2xl font-bold mb-4">How It Works</h2>
            <ol className="list-decimal pl-5 space-y-4">
              <li>
                <strong>Initial Challenge:</strong> When a user visits the site, the CAPTCHA overlay appears with a randomly selected game.
              </li>
              <li>
                <strong>Game Completion:</strong> The user completes the mini-game challenge to verify they are human.
              </li>
              <li>
                <strong>Behavioral Analysis:</strong> Throughout the process, the system collects mouse movements, keyboard patterns, and scrolling behavior.
              </li>
              <li>
                <strong>Continuous Monitoring:</strong> Even after verification, the system continues to collect data to ensure consistent human-like behavior.
              </li>
              <li>
                <strong>Data Collection:</strong> Behavior data is sent to the server every 15 seconds for analysis.
              </li>
            </ol>
          </section>
          
          <footer className="text-center text-gray-500 py-8">
            <p>VeriPlay CAPTCHA System - A Modern Approach to Human Verification</p>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Index;
