// This code runs after the page is loaded
document.addEventListener('DOMContentLoaded', () => {

    // ------------------------------------------------
    // 1. Intro Screen and Music Logic
    // ------------------------------------------------
    const introOverlay = document.getElementById('intro-overlay');
    const mainContent = document.getElementById('main-content');
    const backgroundVideo = document.getElementById('background-video');
    const floatingElement = document.getElementById('floating-element');
    
    // NEW: Get the master toggle button
    const toggleBtn = document.getElementById('toggle-content-btn');
    
    // Flag to ensure the intro runs only once
    let introHasPlayed = false;

    // This is the "click and enter" logic. It checks if the elements exist first.
    if (introOverlay && mainContent && backgroundVideo && toggleBtn) {
        introOverlay.addEventListener('click', () => {
            if (introHasPlayed) {
                return; // Don't run twice
            }
            introHasPlayed = true;

            // 1. Play the video's audio/music
            // VOLUME BOOST IMPLEMENTED: Set to maximum volume (1.0)
            backgroundVideo.volume = 1.0; 
            backgroundVideo.play().catch(error => { 
                console.warn("Music playback failed:", error);
            });
            
            // 2. Start the fade-out effect on the intro screen
            introOverlay.classList.add('fade-out');
            
            // 3. Show the main content, floating animation, AND the toggle button
            mainContent.classList.remove('hidden');
            floatingElement.classList.remove('hidden'); 
            toggleBtn.classList.remove('hidden'); // <-- NEW: Show the button

            // 4. Wait 500ms (the duration of the CSS transition) then remove the overlay entirely
            setTimeout(() => {
                introOverlay.style.display = 'none'; 
            }, 500); 
        }); 
    }
    // ------------------------------------------------
    // END: Intro Screen and Music Logic
    // ------------------------------------------------


    // ------------------------------------------------
    // 2. Tab Switching Logic
    // ------------------------------------------------

    const tabs = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const tabTriggers = document.querySelectorAll('[data-tab-trigger]');


    /**
     * Resets all tabs to inactive state and hides all content.
     */
    const deactivateAllTabs = () => {
        tabs.forEach(t => {
            t.classList.remove('text-zinc-50', 'border-b-zinc-50');
            t.classList.add('text-zinc-400', 'border-b-transparent');
            t.setAttribute('aria-selected', 'false');
        });
        
        tabContents.forEach(c => {
            c.classList.add('hidden');
        });
    }

    /**
     * Activates a specific tab and shows its content.
     */
    const activateTab = (targetId) => {
        const targetButton = document.querySelector(`.tab-btn[data-tab="${targetId}"]`);
        const targetContent = document.getElementById(targetId);

        if (targetButton && targetContent) {
            targetButton.classList.remove('text-zinc-400', 'border-b-transparent');
            targetButton.classList.add('text-zinc-50', 'border-b-zinc-50');
            targetButton.setAttribute('aria-selected', 'true');
            
            targetContent.classList.remove('hidden');
        }
    }


    // 1. Setup click listeners for the main tab buttons
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');

            deactivateAllTabs(); 
            activateTab(target);
        });
    });

    // 2. Setup click listeners for social links that trigger a tab
    tabTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const target = trigger.getAttribute('data-tab-trigger');
            
            deactivateAllTabs(); 
            activateTab(target); 
        });
    });

    // 3. NEW: Keyboard Navigation for Tabs (Accessibility)
    const tabList = document.querySelector('nav[role="tablist"]');

    if (tabList) {
        tabList.addEventListener('keydown', (e) => {
            const currentTab = document.querySelector('.tab-btn.text-zinc-50');
            if (!currentTab) return;
            
            let nextTab = null;

            const visibleTabs = Array.from(tabs).filter(t => !t.classList.contains('hidden'));
            const currentIndex = visibleTabs.indexOf(currentTab);
            
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                const nextIndex = (currentIndex + 1) % visibleTabs.length;
                nextTab = visibleTabs[nextIndex];
                e.preventDefault(); 
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                const prevIndex = (currentIndex - 1 + visibleTabs.length) % visibleTabs.length;
                nextTab = visibleTabs[prevIndex];
                e.preventDefault(); 
            }

            if (nextTab) {
                nextTab.click(); 
                nextTab.focus(); 
            }
        });
    }
    
    // Initial activation
    activateTab('bio');

    // ------------------------------------------------
    // END: Tab Switching Logic
    // ------------------------------------------------


    // ------------------------------------------------
    // 3. Dynamic Discord Status
    // ------------------------------------------------

    // 🔴 IMPORTANT: REPLACE THE ID BELOW WITH YOUR ACTUAL DISCORD USER ID 
    const DISCORD_USER_ID = '1066445133916164146'; 

    const discordStatusEl = document.getElementById('discord-status-name');
    const discordStatusIconEl = document.getElementById('discord-status-icon');


    async function getDiscordStatus() {
        if (!discordStatusEl || !discordStatusIconEl) { 
            console.warn('Discord status element or icon not found.');
            return;
        }
        
        discordStatusEl.classList.remove('text-green-400', 'text-yellow-500', 'text-red-500', 'text-zinc-500');
        discordStatusEl.textContent = 'Updating...'; 

        try {
            const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`);
            if (!response.ok) {
                throw new Error('Lanyard API request failed');
            }
            
            const { data } = await response.json();
            
            let status = data.discord_status;
            let iconPath = 'assets/images/discord/';
            let iconAlt = '';

            // Determine status, set BOTH text and visual cues.
            switch (status) {
                case 'online':
                    // Display username when active
                    discordStatusEl.textContent = data.discord_user.username; 
                    discordStatusEl.classList.add('text-green-400');
                    iconPath += 'online.png';
                    iconAlt = 'Online';
                    break;
                case 'idle':
                    // Display username when active
                    discordStatusEl.textContent = data.discord_user.username; 
                    discordStatusEl.classList.add('text-yellow-500');
                    iconPath += 'idle.png';
                    iconAlt = 'Idle';
                    break;
                case 'dnd':
                    // Display username when active
                    discordStatusEl.textContent = data.discord_user.username; 
                    discordStatusEl.classList.add('text-red-500');
                    iconPath += 'dnd.png';
                    iconAlt = 'Do Not Disturb';
                    break;
                case 'offline': // Handle offline explicitly
                default:        // Handle unknown statuses as offline
                    // Show "Offline" text when inactive
                    discordStatusEl.textContent = data.discord_user?.username || 'simplykashu'; 
                    discordStatusEl.classList.add('text-zinc-500');
                    iconPath += 'offline.png';
                    iconAlt = `${data.discord_user?.username || 'simplykashu'} (Offline)`;
                    break;
            }
            
            // Update the icon element
            discordStatusIconEl.src = iconPath;
            discordStatusIconEl.alt = iconAlt + ' status icon';

        } catch (error) {
            console.error('Error fetching Discord status:', error);
            // Fallback on error
            discordStatusEl.textContent = 'simplykashu'; 
            discordStatusEl.classList.add('text-zinc-500'); 
            discordStatusIconEl.src = 'assets/images/discord/offline.png';
            discordStatusIconEl.alt = 'simplykashu (Offline)';
        }
    }

    // Call the function when the page loads
    getDiscordStatus();
    
    // Refresh the status every 60 seconds (60000 milliseconds)
    setInterval(getDiscordStatus, 60000);

    // ------------------------------------------------
    // END: Dynamic Discord Status
    // ------------------------------------------------


    // ------------------------------------------------
    // 4. Main Content Toggle 
    // ------------------------------------------------
    
    // We already defined 'toggleBtn', 'mainContent', and 'floatingElement' in Section 1
    const iconHide = document.getElementById('toggle-icon-hide');
    const iconShow = document.getElementById('toggle-icon-show');

    if (toggleBtn && mainContent && floatingElement && iconHide && iconShow) {
        
        let isContentVisible = true; // Tracks the state

        toggleBtn.addEventListener('click', () => {
            isContentVisible = !isContentVisible; // Flip the state
            
            // Toggle the custom fade class
            mainContent.classList.toggle('content-hidden');
            floatingElement.classList.toggle('content-hidden');
            
            // Toggle the icons
            iconHide.classList.toggle('hidden');
            iconShow.classList.toggle('hidden');
            
            // Update ARIA attributes
            toggleBtn.setAttribute('aria-expanded', isContentVisible);
            mainContent.setAttribute('aria-hidden', !isContentVisible);
        });
        
        // Set initial ARIA state
        mainContent.setAttribute('aria-hidden', 'false');

    } else {
        console.warn('Main content toggle elements not found. Button will not work.');
    }

    // ------------------------------------------------
    // END: Main Content Toggle
    // ------------------------------------------------


    // ------------------------------------------------
    // 5. UPDATED: Artist Link Modal Logic
    // ------------------------------------------------

    // Data structure for the music artists and their links
    const ARTIST_DATA = {
        "diggy_graves": {
            name: "Diggy Graves",
            icon: "assets/images/artists/diggy_graves.png",
            links: {
                spotify: "https://open.spotify.com/artist/1TpOqFPZPxxeuLHL3oSl2t",
                youtube: "https://music.youtube.com/channel/UCrnvtdLN6AHgQ8SdFGLalfw"
            }
        },
        "skitz_kraven": {
            name: "sKitz Kraven",
            icon: "assets/images/artists/skitz_kraven.png",
            links: {
                spotify: "https://open.spotify.com/artist/6aIak8mWVfNefWFAnAxKPQ",
                youtube: "https://music.youtube.com/channel/UCSwNbrYaFgFq6Q42TtVbxLg"
            }
        },
        "djsm": {
            name: "DJSM",
            icon: "assets/images/artists/djsm.png",
            links: {
                spotify: "https://open.spotify.com/artist/13qjHQyFpjR48hBIbPrwMx",
                youtube: "https://music.youtube.com/channel/UCP1TzVHk-L2YTUZfgvjeEsA"
            }
        },
        "snotkop": {
            name: "Snotkop",
            icon: "assets/images/artists/snotkop.png",
            links: {
                spotify: "https://open.spotify.com/artist/0F0l2JFPA3u6cBpaqKCm6J",
                youtube: "https://music.youtube.com/channel/UCIal7Ew8eoeWvXMBPkrPVRQ"
            }
        }
    };

    const artistButtons = document.querySelectorAll('.artist-btn');
    const modalOverlay = document.getElementById('artist-modal-overlay');
    const modal = document.getElementById('artist-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalArtistName = document.getElementById('modal-artist-name');
    const modalArtistIcon = document.getElementById('modal-artist-icon');
    const modalLinksContainer = document.getElementById('modal-links');


    // Function to close the modal
    const closeModal = () => {
        // Start exit animation
        modal.classList.remove('scale-100', 'opacity-100');
        modal.classList.add('scale-95', 'opacity-0');
        
        // Hide the overlay after the animation
        setTimeout(() => {
            modalOverlay.classList.add('hidden');
        }, 300); 
    };

    // Function to open the modal
    const openModal = (artistKey) => {
        const artist = ARTIST_DATA[artistKey];
        if (!artist) return;

        // 1. Populate Modal Content
        modalArtistName.textContent = artist.name;
        modalArtistIcon.src = artist.icon;
        modalArtistIcon.alt = artist.name + ' icon';
        modalLinksContainer.innerHTML = ''; // Clear previous links

        // 2. Generate new link buttons
        for (const [platform, url] of Object.entries(artist.links)) {
            const platformName = platform === 'youtube' ? 'YouTube Music' : platform.charAt(0).toUpperCase() + platform.slice(1);
            
            // 💡 UPDATED: Logic to use custom image paths
            let iconSrc;
            if (platform === 'youtube') {
                iconSrc = 'assets/images/icons/youtube.png'; // Path to your custom YouTube icon
            } else if (platform === 'spotify') {
                iconSrc = 'assets/images/icons/spotify.png'; // Path to your custom Spotify icon
            } else {
                continue; 
            }
            
            const linkHTML = `
                <a href="${url}" target="_blank" rel="noopener noreferrer" 
                   class="flex items-center space-x-3 p-3 bg-zinc-700 rounded-lg text-zinc-100 font-semibold hover:bg-zinc-600 transition-colors duration-200">
                    
                    <img src="${iconSrc}" alt="${platformName} icon" class="w-5 h-5 object-contain">
                    
                    <span>Go to ${platformName}</span>
                </a>
            `;
            modalLinksContainer.insertAdjacentHTML('beforeend', linkHTML);
        }
        
        // 3. We NO LONGER call lucide.createIcons() here since we are using custom images
        // lucide.createIcons(); // <--- REMOVED
        

        // 4. Show the modal and run enter animation
        modalOverlay.classList.remove('hidden');
        setTimeout(() => {
            modal.classList.remove('scale-95', 'opacity-0');
            modal.classList.add('scale-100', 'opacity-100');
        }, 10);
    };

    // Add click listeners to artist buttons
    artistButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const artistKey = button.getAttribute('data-artist');
            openModal(artistKey);
        });
    });

    // Add listeners to close the modal
    closeModalBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        // Close if click is outside the modal content
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modalOverlay.classList.contains('hidden')) {
            closeModal();
        }
    });
    // ------------------------------------------------
    // END: Artist Link Modal Logic
    // ------------------------------------------------
});
