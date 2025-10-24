// This code runs after the page is loaded
document.addEventListener('DOMContentLoaded', () => {

    // Get Intro Screen elements
    const introOverlay = document.getElementById('intro-overlay');
    const mainContent = document.getElementById('main-content');
    const music = document.getElementById('background-music');
    
    // NEW: Flag to make sure intro runs only once
    let introHasPlayed = false;

    // Add click listener for the intro screen
    if (introOverlay) {
        introOverlay.addEventListener('click', () => {
            // NEW: Check if it has already run
            if (introHasPlayed) {
                return; 
            }
            // NEW: Set the flag to true
            introHasPlayed = true;

            // MODIFIED: Use fade-out class instead of hidden
            introOverlay.classList.add('fade-out');
            
            // Show the main content
            mainContent.classList.remove('hidden');

            // Play the music
            music.volume = 0.3; 
            music.play().catch(error => {
                console.warn("Music playback failed:", error);
            });
        }); 
    }
    
    // Find all the tab buttons
    const tabs = document.querySelectorAll('.tab-btn');
    
    // ... rest of your existing app.js code ...
});
