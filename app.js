// This code runs after the page is loaded
document.addEventListener('DOMContentLoaded', () => {

    // Get Intro Screen elements
    const introOverlay = document.getElementById('intro-overlay');
    const mainContent = document.getElementById('main-content');
    const music = document.getElementById('background-music');
    
    // Flag to make sure intro runs only once
    let introHasPlayed = false;

    // Add click listener for the intro screen
    if (introOverlay) {
        introOverlay.addEventListener('click', () => {
            // Check if it has already run
            if (introHasPlayed) {
                return; 
            }
            introHasPlayed = true;

            // 1. Play the music
            music.volume = 0.3; 
            music.play().catch(error => {
                console.warn("Music playback failed:", error);
            });

            // 2. MODIFIED: Start the fade-out effect immediately
            introOverlay.classList.add('fade-out');
            
            // 3. Show the main content (so it can fade in/show under the overlay)
            mainContent.classList.remove('hidden');

            // 4. NEW: Wait 500ms (the duration of the CSS transition) before removing the overlay entirely
            setTimeout(() => {
                // We use display:none here as a final step to ensure it doesn't interfere
                introOverlay.style.display = 'none'; 
            }, 500); // 500 milliseconds = 0.5 seconds

        }); 
    }
    
    // Find all the tab buttons
    const tabs = document.querySelectorAll('.tab-btn');
    
    // ... rest of your existing app.js code ...
});
