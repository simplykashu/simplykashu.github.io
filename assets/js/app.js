/* --- Configuration --- */
const SONG_START_TIME = 0; 

/* --- 3D Tilt Logic (Desktop Only) --- */
const card = document.getElementById('tilt-card');
const container = document.getElementById('main-content');

if (card && container && window.innerWidth > 768) {
    container.addEventListener('mousemove', (e) => {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
        
        const clampX = Math.max(-10, Math.min(10, yAxis));
        const clampY = Math.max(-10, Math.min(10, xAxis));

        card.style.transform = `rotateY(${clampY * -1}deg) rotateX(${clampX}deg) scale(1.01)`;
    });

    container.addEventListener('mouseleave', () => {
        card.style.transform = 'rotateY(0deg) rotateX(0deg) scale(1)';
    });
}

/* --- Click Sparkle Effect --- */
document.addEventListener('click', (e) => {
    createSparkle(e.clientX, e.clientY);
});

function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.classList.add('sparkle');
    document.body.appendChild(sparkle);
    
    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;
    
    const randomX = (Math.random() - 0.5) * 50;
    const randomY = (Math.random() - 0.5) * 50;
    
    sparkle.style.setProperty('--tx', `${randomX}px`);
    sparkle.style.setProperty('--ty', `${randomY}px`);

    setTimeout(() => {
        sparkle.remove();
    }, 600);
}

/* --- Custom Context Menu --- */
const contextMenu = document.getElementById('context-menu');

document.addEventListener('contextmenu', (e) => {
    // Allow context menu on inputs (like slider)
    if (e.target.tagName === 'INPUT') return;
    
    e.preventDefault();
    if (contextMenu && window.innerWidth > 768) {
        contextMenu.style.top = `${e.clientY}px`;
        contextMenu.style.left = `${e.clientX}px`;
        contextMenu.classList.remove('hidden');
    }
});

document.addEventListener('click', () => {
    if (contextMenu) contextMenu.classList.add('hidden');
});

/* --- Clock Logic (SAST) --- */
function updateClock() {
    const clockElement = document.getElementById('sast-clock');
    if (clockElement) {
        const options = { 
            timeZone: 'Africa/Johannesburg', 
            hour: '2-digit', 
            minute: '2-digit',
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

// Volume Control
if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
        music.volume = e.target.value;
    });
}

// Format Time
function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
}

// Update Progress
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

window.toggleMusic = function() {
    if (isPlaying) {
        music.pause();
        if (playIcon) {
            playIcon.classList.remove('fa-pause');
            playIcon.classList.add('fa-play');
            playIcon.classList.add('ml-0.5');
        }
        const musicIcon = document.querySelector('.fa-music');
        if (musicIcon) musicIcon.classList.remove('text-purple-400', 'animate-bounce');
    } else {
        music.play().catch(e => console.log("Audio play failed:", e));
        if (playIcon) {
            playIcon.classList.remove('fa-play');
            playIcon.classList.remove('ml-0.5');
            playIcon.classList.add('fa-pause');
        }
        const musicIcon = document.querySelector('.fa-music');
        if (musicIcon) musicIcon.classList.add('text-purple-400', 'animate-bounce');
    }
    isPlaying = !isPlaying;
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
