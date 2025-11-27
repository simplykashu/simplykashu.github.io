/* --- Configuration --- */
const SONG_START_TIME = 0; 
const DISCORD_ID = "1066445133916164146";

/* --- Lanyard / Discord Status Logic --- */
const statusDot = document.getElementById('discord-status-dot');
const glowEffect = document.getElementById('discord-glow');

// RPC Card Elements
const activityBox = document.getElementById('discord-activity');
const rpcStatusDot = document.getElementById('rpc-status-dot');
const activityIcon = document.getElementById('activity-icon');
const activityHeader = document.getElementById('activity-header'); 
const activityName = document.getElementById('activity-name');      

// Status Colors
const STATUS_COLORS = {
    online: { color: '#22c55e', glow: 'from-green-600 to-green-400' },
    idle:   { color: '#f59e0b', glow: 'from-yellow-600 to-yellow-400' },
    dnd:    { color: '#ef4444', glow: 'from-red-600 to-red-400' },
    offline:{ color: '#6b7280', glow: 'from-gray-600 to-gray-400' }
};

function connectLanyard() {
    const socket = new WebSocket('wss://api.lanyard.rest/socket');

    socket.addEventListener('open', () => {
        socket.send(JSON.stringify({
            op: 2,
            d: { subscribe_to_id: DISCORD_ID }
        }));
    });

    socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        const { t, d } = data;

        if (t === 'INIT_STATE' || t === 'PRESENCE_UPDATE') {
            updateStatus(d);
        }
    });

    socket.addEventListener('close', () => {
        setTimeout(connectLanyard, 5000);
    });
}

function updateStatus(data) {
    const status = data.discord_status;
    const styles = STATUS_COLORS[status] || STATUS_COLORS.offline;

    // 1. Update Main Avatar & Glow
    if (statusDot) {
        statusDot.className = `absolute bottom-2 right-2 w-5 h-5 rounded-full border-4 border-black z-20 ${status !== 'offline' ? 'animate-pulse' : ''}`;
        statusDot.style.backgroundColor = styles.color;
        statusDot.title = status.toUpperCase();
    }
    if (glowEffect) {
        glowEffect.className = `absolute inset-0 bg-gradient-to-tr ${styles.glow} rounded-full blur opacity-40 group-hover:opacity-75 transition-all duration-500`;
    }

    // 2. Update RPC Card Status Dot
    if (rpcStatusDot) {
        rpcStatusDot.style.backgroundColor = styles.color;
    }

    // 3. Handle Activities (Spotify > Game > Status Check)
    if (data.listening_to_spotify) {
        // --- SPOTIFY ---
        const spotify = data.spotify;
        const song = spotify.song;
        const artist = "by " + spotify.artist;
        renderRPC(true, `Listening to <span class="text-white font-bold">${song}</span>`, artist, spotify.album_art_url);
    } else if (data.activities && data.activities.length > 0) {
        // --- GAME / ACTIVITY ---
        const activity = data.activities.find(a => a.type === 0);
        
        if (activity) {
            let iconUrl = "";
            
            // Image Logic (Fixed mp: slash issue)
            if (activity.assets && activity.assets.large_image) {
                if (activity.assets.large_image.startsWith("mp:")) {
                    iconUrl = activity.assets.large_image.replace(/^mp:/, "https://media.discordapp.net/");
                } else {
                    iconUrl = `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.png`;
                }
            } 
            else if (activity.assets && activity.assets.small_image) {
                 if (activity.assets.small_image.startsWith("mp:")) {
                    iconUrl = activity.assets.small_image.replace(/^mp:/, "https://media.discordapp.net/");
                } else {
                    iconUrl = `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.small_image}.png`;
                }
            }

            // Text Layout: "Playing Roblox" on one line
            const header = `Playing <span class="text-white font-bold">${activity.name}</span>`;
            
            // Second line: State/Details (e.g. "In Game")
            const details = activity.details || activity.state || "";
            const subtext = details ? `<span class="text-gray-400">${details}</span>` : "";

            renderRPC(true, header, subtext, iconUrl);
        } else {
            displayStatusText(status);
        }
    } else {
        // --- NO ACTIVITY ---
        displayStatusText(status);
    }
}

function displayStatusText(status) {
    let statusText = "Offline";
    switch (status) {
        case 'online': statusText = "Online"; break;
        case 'idle': statusText = "Idle"; break;
        case 'dnd': statusText = "Do Not Disturb"; break;
        default: statusText = "Offline";
    }
    
    // Combined line: "Status Online"
    const headerHtml = `Status <span class="text-white font-bold ml-1">${statusText}</span>`;
    renderRPC(true, headerHtml, "", "");
}

function renderRPC(show, line1Html, line2Html, iconUrl) {
    if (!activityBox) return;

    if (show) {
        activityBox.classList.remove('hidden');
        activityBox.classList.add('flex');
        
        if (activityHeader) activityHeader.innerHTML = line1Html;
        if (activityName) activityName.innerHTML = line2Html;
        
        // Hide second line if empty to keep alignment tight
        if (!line2Html && activityName) {
             activityName.style.display = 'none';
        } else if (activityName) {
             activityName.style.display = 'block';
        }
        
        if (activityIcon) {
            if (iconUrl) {
                activityIcon.src = iconUrl;
                activityIcon.classList.remove('hidden');
                activityIcon.style.display = 'block'; 
            } else {
                activityIcon.classList.add('hidden');
                activityIcon.style.display = 'none';
            }
        }
    } else {
        activityBox.classList.add('hidden');
        activityBox.classList.remove('flex');
    }
}

// Start Connection
connectLanyard();


/* --- 3D Tilt Logic (Desktop Only) --- */
const card = document.getElementById('tilt-card');
const container = document.getElementById('main-content');

if (card && container && window.innerWidth > 768) {
    container.addEventListener('mousemove', (e) => {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
        
        const clampX = Math.max(-8, Math.min(8, yAxis));
        const clampY = Math.max(-8, Math.min(8, xAxis));

        card.style.transform = `rotateY(${clampY * -1}deg) rotateX(${clampX}deg) scale(1.01)`;
    });

    container.addEventListener('mouseleave', () => {
        card.style.transform = 'rotateY(0deg) rotateX(0deg) scale(1)';
    });
}

/* --- Click Sparkle Effect --- */
document.addEventListener('click', (e) => {
    if(document.querySelectorAll('.sparkle').length > 15) return;
    createSparkle(e.clientX, e.clientY);
});

function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.classList.add('sparkle');
    document.body.appendChild(sparkle);
    
    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;
    
    const randomX = (Math.random() - 0.5) * 60;
    const randomY = (Math.random() - 0.5) * 60;
    
    sparkle.style.setProperty('--tx', `${randomX}px`);
    sparkle.style.setProperty('--ty', `${randomY}px`);

    setTimeout(() => {
        sparkle.remove();
    }, 600);
}

/* --- Clock Logic (SAST) --- */
function updateClock() {
    const clockElement = document.getElementById('sast-clock');
    if (clockElement) {
        const options = { 
            timeZone: 'Africa/Johannesburg', 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit',
            hour12: false 
        };
        const timeString = new Date().toLocaleTimeString('en-US', options);
        clockElement.textContent = timeString;
    }
}
setInterval(updateClock, 1000);
updateClock(); 

/* --- Music Player Logic --- */
const music = document.getElementById('bg-music');
const playBtn = document.getElementById('play-btn');
const playIcon = document.getElementById('play-icon');
const progressBar = document.getElementById('progress-bar');
const currTimeDisplay = document.getElementById('current-time');
const totalDurationDisplay = document.getElementById('total-duration');
const volumeSlider = document.getElementById('volume-slider');
let isPlaying = false;

if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
        music.volume = e.target.value;
    });
}

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
}

music.addEventListener('timeupdate', () => {
    if (music.duration) {
        const progressPercent = (music.currentTime / music.duration) * 100;
        if (progressBar) progressBar.style.width = `${progressPercent}%`;
        if (currTimeDisplay) currTimeDisplay.textContent = formatTime(music.currentTime);
    }
});

music.addEventListener('loadedmetadata', () => {
    if (totalDurationDisplay) totalDurationDisplay.textContent = formatTime(music.duration);
});

window.seekAudio = function(e) {
    if (music.duration) {
        const container = document.getElementById('progress-container');
        const width = container.clientWidth;
        const clickX = e.offsetX;
        const duration = music.duration;
        music.currentTime = (clickX / width) * duration;
    }
}

window.toggleMusic = function() {
    if (isPlaying) {
        music.pause();
        if (playIcon) {
            playIcon.classList.remove('fa-pause');
            playIcon.classList.add('fa-play');
            playIcon.classList.add('ml-0.5');
        }
    } else {
        music.play().catch(e => console.log("Audio play failed:", e));
        if (playIcon) {
            playIcon.classList.remove('fa-play');
            playIcon.classList.remove('ml-0.5');
            playIcon.classList.add('fa-pause');
        }
    }
    isPlaying = !isPlaying;
}

/* --- Typewriter Logic (Looping) --- */
const typePhrases = ["Welcome to the void.", "Chill vibes only."];
const typeElement = document.getElementById('typewriter-text');
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function typeWriter() {
    const currentPhrase = typePhrases[phraseIndex];
    
    if (isDeleting) {
        typeElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50; // Faster deletion
    } else {
        typeElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 100; // Normal typing
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
        // Finished typing phrase, pause before deleting
        isDeleting = true;
        typeSpeed = 2000; 
    } else if (isDeleting && charIndex === 0) {
        // Finished deleting, switch to next phrase
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % typePhrases.length;
        typeSpeed = 500;
    }

    setTimeout(typeWriter, typeSpeed);
}

/* --- Enter Site Logic --- */
const overlay = document.getElementById('overlay');
const mainContent = document.getElementById('main-content');

overlay.addEventListener('click', () => {
    overlay.style.opacity = '0';
    
    // Start music
    music.currentTime = SONG_START_TIME;
    music.volume = 0.3;
    
    setTimeout(() => {
        overlay.classList.add('hidden');
        mainContent.classList.remove('hidden');
        setTimeout(() => {
            mainContent.style.opacity = '1';
            // Start typewriter after entry
            typeWriter();
        }, 50);
        
        toggleMusic(); 
    }, 500);
});

/* --- Tab Logic --- */
window.switchTab = function(tabName) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(el => {
        el.classList.remove('active');
        el.classList.remove('text-white');
        el.classList.add('text-gray-400');
    });

    const content = document.getElementById(`content-${tabName}`);
    if (content) content.classList.add('active');
    
    const btn = document.getElementById(`tab-${tabName}`);
    if (btn) {
        btn.classList.add('active');
        btn.classList.remove('text-gray-400');
    }
}

/* --- Particles Logic --- */
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }
    draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}
function initParticles() {
    for (let i = 0; i < 80; i++) particles.push(new Particle());
}
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
}
initParticles();
animateParticles();

