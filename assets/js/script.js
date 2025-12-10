/* --- CONFIGURATION --- */
const DISCORD_ID = "1066445133916164146"; 

/* --- MANUAL ASSET OVERRIDES (Roblox Only) --- */
const GAME_OVERRIDES = {
    "Roblox": {
        image: "data:image/png;base64,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",
        text: "Roaming the Metaverse"
    }
};

/* --- 1. ENTER LOGIC --- */
const enterScreen = document.getElementById('enter-overlay');
const audio = document.getElementById('audio-source');

enterScreen.addEventListener('click', () => {
    enterScreen.style.opacity = '0';
    audio.volume = 0.4; 
    audio.play().catch(e => console.log("Audio needs interaction"));
    setTimeout(() => { enterScreen.style.display = 'none'; }, 800);
});

/* --- 2. MATRIX RAIN EFFECT --- */
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";
const fontSize = 14;
const columns = canvas.width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);

function drawMatrix() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "#ff003c"; 
    ctx.font = fontSize + "px monospace";

    for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}
setInterval(drawMatrix, 50);

/* --- 3. LANYARD STATUS LOGIC --- */
async function updateLanyard() {
    try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
        const json = await res.json();
        const data = json.data;
        
        if (!data) return;

        /* -- A. Profile Picture -- */
        if (data.discord_user.avatar) {
            document.getElementById('pfp').src = `https://cdn.discordapp.com/avatars/${DISCORD_ID}/${data.discord_user.avatar}.png`;
        }

        /* -- B. Status Grid Logic -- */
        document.querySelectorAll('.status-module').forEach(el => el.className = 'status-module');
        const statusDot = document.getElementById('status-dot');
        const statusColors = { online: '#27c93f', idle: '#ffbd2e', dnd: '#ff5f56', offline: '#747f8d' };
        
        const currentStatus = data.discord_status; 
        statusDot.style.backgroundColor = statusColors[currentStatus];
        
        if (currentStatus === 'dnd') {
            document.getElementById('mod-dnd').classList.add('active-dnd');
        } 
        else if (currentStatus === 'idle') {
            document.getElementById('mod-idle').classList.add('active-idle');
        } 
        else if (currentStatus === 'online' && (data.listening_to_spotify || data.activities.length > 0)) {
            document.getElementById('mod-online').classList.add('active-online');
        } 
        else if (currentStatus === 'online') {
            document.getElementById('mod-chilling').classList.add('active-chilling');
        } 
        else {
            document.getElementById('mod-chilling').classList.add('active-chilling');
        }

        /* -- C. CARD 1: PLAYSTATION STREAM (Game / Chilling ONLY) -- */
        const mainTerminal = document.getElementById('rpc-terminal');
        const mainIcon = document.getElementById('activity-icon');
        const mainHeader = document.getElementById('activity-header');
        const mainDetail = document.getElementById('activity-detail');
        const mainTitle = document.querySelector('#rpc-terminal .title');

        // Look for a GAME (ignore custom status type 4, ignore spotify)
        const game = data.activities.find(x => x.type === 0);

        if (game) {
            // GAME DETECTED: ACTIVATE PLAYSTATION THEME
            mainTerminal.classList.add('playstation-theme');
            mainTitle.innerText = "PLAYSTATION_STREAM.exe"; // THE REQUESTED CHANGE
            mainHeader.innerText = game.name;

            // ROBLOX OVERRIDE FIX
            if (game.name === "Roblox") {
                mainIcon.src = GAME_OVERRIDES["Roblox"].image;
                mainDetail.innerText = game.details || game.state || GAME_OVERRIDES["Roblox"].text;
            } else {
                // Standard Logic for other games
                mainDetail.innerText = game.details || game.state || "Playing";
                
                if (game.assets && game.assets.large_image) {
                    let imgId = game.assets.large_image;
                    if (imgId.startsWith("mp:")) {
                        mainIcon.src = `https://media.discordapp.net/${imgId.replace("mp:", "")}`;
                    } else {
                        mainIcon.src = `https://cdn.discordapp.com/app-assets/${game.application_id}/${imgId}.png`;
                    }
                } else {
                    mainIcon.src = "https://cdn.discordapp.com/embed/avatars/0.png";
                }
            }
        } else {
            // NO GAME: REVERT TO SYSTEM CHILLING (DARK THEME)
            mainTerminal.classList.remove('playstation-theme');
            mainTitle.innerText = "ACTIVE_PROTOCOL.exe";
            mainHeader.innerText = "SYSTEM CHILLING";
            mainDetail.innerText = "No active processes running.";
            mainIcon.src = "https://cdn.discordapp.com/embed/avatars/0.png";
        }

        /* -- D. CARD 2: SPOTIFY STREAM (Shows only if playing) -- */
        const spotifyCard = document.getElementById('spotify-terminal');
        const spotifyIcon = document.getElementById('spotify-icon');
        const spotifyHeader = document.getElementById('spotify-header');
        const spotifyDetail = document.getElementById('spotify-detail');

        if (data.listening_to_spotify && data.spotify) {
            const spotify = data.spotify;
            spotifyCard.style.display = 'block'; // SHOW CARD

            spotifyHeader.innerText = spotify.song || "Unknown Song";
            spotifyDetail.innerText = spotify.artist || "Unknown Artist";
            
            if (spotify.album_art_url) {
                spotifyIcon.src = spotify.album_art_url;
            } else {
                spotifyIcon.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/2048px-Spotify_logo_without_text.svg.png";
            }
        } else {
            spotifyCard.style.display = 'none'; // HIDE CARD
        }

    } catch (e) {
        console.error("Lanyard Connect Error", e);
    }
}

updateLanyard();
setInterval(updateLanyard, 5000);

/* --- 4. SCROLL REVEAL --- */
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('show-el');
    });
});
document.querySelectorAll('.hidden-el').forEach(el => observer.observe(el));