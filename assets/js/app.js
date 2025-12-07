/* --- Configuration --- */
        const DISCORD_ID = "1066445133916164146";

        /* --- Elements --- */
        const statusDot = document.getElementById('discord-status-dot');
        const glowEffect = document.getElementById('discord-glow');
        const mainPfp = document.getElementById('discord-pfp');

        // Card 1: Status Elements
        const statusCard = document.getElementById('card-status');
        const statusImageSmall = document.getElementById('status-image-small');
        const statusImageLarge = document.getElementById('status-image-large');
        const statusDisplayName = document.getElementById('status-displayname');
        const statusText = document.getElementById('status-text');
        const statusCardDot = document.getElementById('status-card-dot');

        // Card 2: Game Elements
        const gameCard = document.getElementById('card-game');
        const gameName = document.getElementById('game-name');
        const gameImage = document.getElementById('game-image');
        const gameTime = document.getElementById('game-time');

        // Card 3: Spotify Elements
        const spotifyCard = document.getElementById('card-spotify');
        const spotifySong = document.getElementById('spotify-song');
        const spotifyArtist = document.getElementById('spotify-artist');
        const spotifyArt = document.getElementById('spotify-art');
        const spotifyProgressBar = document.getElementById('spotify-progress-bar');
        const spotifyCurrTime = document.getElementById('spotify-curr-time');
        const spotifyTotalTime = document.getElementById('spotify-total-time');


        // Status Colors
        const STATUS_COLORS = {
            online: { color: '#23a559', glow: 'from-green-600 to-green-400' },
            idle:   { color: '#f0b232', glow: 'from-yellow-600 to-yellow-400' },
            dnd:    { color: '#f23f43', glow: 'from-red-600 to-red-400' },
            offline:{ color: '#80848e', glow: 'from-gray-600 to-gray-400' }
        };

        let gameStartTimestamp = null;
        let spotifyStartTimestamp = null;
        let spotifyEndTimestamp = null;
        let activityInterval = null;


        /* --- Main Connection Logic --- */
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
                    updateData(d);
                }
            });

            socket.addEventListener('close', () => {
                setTimeout(connectLanyard, 5000);
            });
        }

        /* --- Data Processing --- */
        function updateData(data) {
            const status = data.discord_status;
            const styles = STATUS_COLORS[status] || STATUS_COLORS.offline;
            const discordUser = data.discord_user;

            // 1. Update Profile Visuals
            if (statusDot) {
                statusDot.style.backgroundColor = styles.color;
                statusDot.title = status.toUpperCase();
            }
            if (glowEffect) {
                glowEffect.className = `absolute inset-0 bg-gradient-to-tr ${styles.glow} rounded-full blur opacity-40 group-hover:opacity-75 transition-all duration-500`;
            }

            // 2. Extract Data
            const currentSpotify = data.listening_to_spotify ? data.spotify : null;
            const currentGame = (data.activities && data.activities.length > 0) 
                ? data.activities.find(a => a.type === 0) 
                : null;
            
            const customStatus = (data.activities && data.activities.length > 0)
                ? data.activities.find(a => a.type === 4)
                : null;


            // 3. Render Individual Cards
            renderStatus(status, styles.color, discordUser, customStatus);
            renderGame(currentGame);
            renderSpotify(currentSpotify);

            // Start timer interval if needed
            if ((currentGame || currentSpotify) && !activityInterval) {
                activityInterval = setInterval(updateActivityTimes, 1000);
            } else if (!currentGame && !currentSpotify && activityInterval) {
                clearInterval(activityInterval);
                activityInterval = null;
            }
            updateActivityTimes();
        }

        /* --- Render Functions --- */

        function renderStatus(status, colorHex, user, customStatus) {
            if (statusCardDot) statusCardDot.style.backgroundColor = colorHex;

            if (user) {
                const displayName = user.global_name || user.username;
                if (statusDisplayName) statusDisplayName.innerHTML = displayName;
                
                const avatarUrl = user.avatar 
                    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128` 
                    : `https://cdn.discordapp.com/embed/avatars/0.png`;

                if (statusImageSmall) statusImageSmall.src = avatarUrl;
                if (statusImageLarge) statusImageLarge.src = avatarUrl;
                if (mainPfp) mainPfp.src = avatarUrl; 
            }
            
            if (statusText) {
                statusText.innerHTML = customStatus && customStatus.state ? customStatus.state : status.charAt(0).toUpperCase() + status.slice(1);
            }
        }

        function renderGame(game) {
            if (!gameCard) return;

            if (game) {
                gameCard.classList.remove('hidden');
                gameCard.classList.add('flex');
                
                if (gameName) gameName.innerHTML = game.name;
                
                gameStartTimestamp = game.timestamps ? game.timestamps.start : null;

                let iconUrl = "https://cdn.discordapp.com/embed/avatars/0.png";
                if (game.assets) {
                    if (game.assets.large_image) {
                        if (game.assets.large_image.startsWith("mp:")) {
                            iconUrl = game.assets.large_image.replace(/^mp:/, "https://media.discordapp.net/");
                        } else {
                            iconUrl = `https://cdn.discordapp.com/app-assets/${game.application_id}/${game.assets.large_image}.png`;
                        }
                    }
                }
                
                if (gameImage) {
                    gameImage.src = iconUrl;
                    gameImage.style.display = 'block';
                }

            } else {
                gameCard.classList.add('hidden');
                gameCard.classList.remove('flex');
                gameStartTimestamp = null;
            }
        }

        function renderSpotify(spotify) {
            if (!spotifyCard) return;

            if (spotify) {
                spotifyCard.classList.remove('hidden');
                spotifyCard.classList.add('flex');

                if (spotifySong) spotifySong.innerHTML = spotify.song;
                if (spotifyArtist) spotifyArtist.innerHTML = spotify.artist;
                if (spotifyArt) {
                        spotifyArt.src = spotify.album_art_url;
                        spotifyArt.style.display = 'block';
                }
                
                spotifyStartTimestamp = spotify.timestamps.start;
                spotifyEndTimestamp = spotify.timestamps.end;

            } else {
                spotifyCard.classList.add('hidden');
                spotifyCard.classList.remove('flex');
                spotifyStartTimestamp = null;
                spotifyEndTimestamp = null;
            }
        }

        /* --- Time Formatting Helpers --- */
        function formatElapsedTime(startTime) {
            const now = Date.now();
            const elapsed = now - startTime;
            
            const seconds = Math.floor((elapsed / 1000) % 60);
            const minutes = Math.floor((elapsed / (1000 * 60)) % 60);
            const hours = Math.floor((elapsed / (1000 * 60 * 60)));

            const pad = (num) => num.toString().padStart(2, '0');

            if (hours > 0) {
                return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
            } else {
                return `${pad(minutes)}:${pad(seconds)}`;
            }
        }

        function formatSpotifyTime(ms) {
            const seconds = Math.floor((ms / 1000) % 60);
            const minutes = Math.floor((ms / (1000 * 60)));
            const pad = (num) => num.toString().padStart(2, '0');
            return `${minutes}:${pad(seconds)}`;
        }

        function updateActivityTimes() {
            // Update Game Time
            if (gameStartTimestamp && gameTime) {
                gameTime.innerHTML = formatElapsedTime(gameStartTimestamp);
            }

            // Update Spotify Progress
            if (spotifyStartTimestamp && spotifyEndTimestamp) {
                const now = Date.now();
                const totalDuration = spotifyEndTimestamp - spotifyStartTimestamp;
                const currentProgress = now - spotifyStartTimestamp;
                const progressPercentage = (currentProgress / totalDuration) * 100;

                if (spotifyProgressBar) spotifyProgressBar.style.width = `${Math.min(progressPercentage, 100)}%`;
                if (spotifyCurrTime) spotifyCurrTime.innerHTML = formatSpotifyTime(currentProgress);
                if (spotifyTotalTime) spotifyTotalTime.innerHTML = formatSpotifyTime(totalDuration);
            }
        }

        // Start Connection
        connectLanyard();
    </script>
</body>
</html>
