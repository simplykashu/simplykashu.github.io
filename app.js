document.addEventListener('DOMContentLoaded', () => {
    const introOverlay = document.getElementById('intro-overlay');
    const mainContent = document.getElementById('main-content');
    const backgroundVideo = document.getElementById('background-video');
    const floatingElement = document.getElementById('floating-element');
    const toggleBtn = document.getElementById('toggle-content-btn');
    let introHasPlayed = false;

    if (introOverlay && mainContent && backgroundVideo && toggleBtn) {
        introOverlay.addEventListener('click', () => {
            if (introHasPlayed) return;
            introHasPlayed = true;
            backgroundVideo.volume = 1.0;
            backgroundVideo.play().catch(error => {
                console.warn("Music playback failed:", error);
            });
            introOverlay.classList.add('fade-out');
            mainContent.classList.remove('hidden');
            floatingElement.classList.remove('hidden');
            toggleBtn.classList.remove('hidden');
            setTimeout(() => {
                introOverlay.style.display = 'none';
            }, 500);
        });
    }

    const tabs = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const tabTriggers = document.querySelectorAll('[data-tab-trigger]');

    const deactivateAllTabs = () => {
        tabs.forEach(t => {
            t.classList.remove('text-zinc-50', 'border-b-zinc-50');
            t.classList.add('text-zinc-400', 'border-b-transparent');
            t.setAttribute('aria-selected', 'false');
        });
        tabContents.forEach(c => c.classList.add('hidden'));
    };

    const activateTab = (targetId) => {
        const targetButton = document.querySelector(`.tab-btn[data-tab="${targetId}"]`);
        const targetContent = document.getElementById(targetId);
        if (targetButton && targetContent) {
            targetButton.classList.remove('text-zinc-400', 'border-b-transparent');
            targetButton.classList.add('text-zinc-50', 'border-b-zinc-50');
            targetButton.setAttribute('aria-selected', 'true');
            targetContent.classList.remove('hidden');
        }
    };

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');
            deactivateAllTabs();
            activateTab(target);
        });
    });

    tabTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const target = trigger.getAttribute('data-tab-trigger');
            deactivateAllTabs();
            activateTab(target);
        });
    });

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

    activateTab('bio');

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
            if (!response.ok) throw new Error('Lanyard API request failed');
            const { data } = await response.json();
            let status = data.discord_status;
            let iconPath = 'assets/images/discord/';
            let iconAlt = '';
            switch (status) {
                case 'online':
                    discordStatusEl.textContent = data.discord_user.username;
                    discordStatusEl.classList.add('text-green-400');
                    iconPath += 'online.png';
                    iconAlt = 'Online';
                    break;
                case 'idle':
                    discordStatusEl.textContent = data.discord_user.username;
                    discordStatusEl.classList.add('text-yellow-500');
                    iconPath += 'idle.png';
                    iconAlt = 'Idle';
                    break;
                case 'dnd':
                    discordStatusEl.textContent = data.discord_user.username;
                    discordStatusEl.classList.add('text-red-500');
                    iconPath += 'dnd.png';
                    iconAlt = 'Do Not Disturb';
                    break;
                default:
                    discordStatusEl.textContent = data.discord_user?.username || 'simplykashu';
                    discordStatusEl.classList.add('text-zinc-500');
                    iconPath += 'offline.png';
                    iconAlt = `${data.discord_user?.username || 'simplykashu'} (Offline)`;
                    break;
            }
            discordStatusIconEl.src = iconPath;
            discordStatusIconEl.alt = iconAlt + ' status icon';
        } catch (error) {
            console.error('Error fetching Discord status:', error);
            discordStatusEl.textContent = 'simplykashu';
            discordStatusEl.classList.add('text-zinc-500');
            discordStatusIconEl.src = 'assets/images/discord/offline.png';
            discordStatusIconEl.alt = 'simplykashu (Offline)';
        }
    }

    getDiscordStatus();
    setInterval(getDiscordStatus, 60000);

    const iconHide = document.getElementById('toggle-icon-hide');
    const iconShow = document.getElementById('toggle-icon-show');
    if (toggleBtn && mainContent && floatingElement && iconHide && iconShow) {
        let isContentVisible = true;
        toggleBtn.addEventListener('click', () => {
            isContentVisible = !isContentVisible;
            mainContent.classList.toggle('content-hidden');
            floatingElement.classList.toggle('content-hidden');
            iconHide.classList.toggle('hidden');
            iconShow.classList.toggle('hidden');
            toggleBtn.setAttribute('aria-expanded', isContentVisible);
            mainContent.setAttribute('aria-hidden', !isContentVisible);
        });
        mainContent.setAttribute('aria-hidden', 'false');
    } else {
        console.warn('Main content toggle elements not found. Button will not work.');
    }

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

    const closeModal = () => {
        modal.classList.remove('scale-100', 'opacity-100');
        modal.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            modalOverlay.classList.add('hidden');
        }, 300);
    };

    const openModal = (artistKey) => {
        const artist = ARTIST_DATA[artistKey];
        if (!artist) return;
        modalArtistName.textContent = artist.name;
        modalArtistIcon.src = artist.icon;
        modalArtistIcon.alt = artist.name + ' icon';
        modalLinksContainer.innerHTML = '';
        for (const [platform, url] of Object.entries(artist.links)) {
            const platformName = platform === 'youtube' ? 'YouTube Music' : platform.charAt(0).toUpperCase() + platform.slice(1);
            let iconSrc;
            if (platform === 'youtube') {
                iconSrc = 'assets/images/icons/youtube_music.png';
            } else if (platform === 'spotify') {
                iconSrc = 'assets/images/icons/spotify.png';
            } else {
                continue;
            }
            const linkHTML = `
                <a href="${url}" target="_blank" rel="noopener noreferrer" 
                    class="flex items-center space-x-3 p-3 bg-zinc-700 rounded-lg text-zinc-100 font-semibold hover:bg-zinc-600 transition-colors duration-200 border border-zinc-700 hover:border-zinc-500">
                    <img src="${iconSrc}" alt="${platformName} icon" class="w-5 h-5 object-contain">
                    <span>Go to ${platformName}</span>
                </a>
            `;
            modalLinksContainer.insertAdjacentHTML('beforeend', linkHTML);
        }
        modalOverlay.classList.remove('hidden');
        setTimeout(() => {
            modal.classList.remove('scale-95', 'opacity-0');
            modal.classList.add('scale-100', 'opacity-100');
        }, 10);
    };

    artistButtons.forEach(button => {
        button.addEventListener('click', () => {
            const artistKey = button.getAttribute('data-artist');
            openModal(artistKey);
        });
    });

    closeModalBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modalOverlay.classList.contains('hidden')) closeModal();
    });
});
