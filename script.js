document.addEventListener('DOMContentLoaded', () => {
    const audioPlayer = document.getElementById('audio-player');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.getElementById('progress-bar');
    const currentTimeDisplay = document.getElementById('current-time');
    const durationDisplay = document.getElementById('duration');
    const songListContainer = document.getElementById('song-list');

    const currentTitle = document.getElementById('current-title');
    const currentArtist = document.getElementById('current-artist');
    const currentCover = document.getElementById('current-cover');

    // --- SONG DATA ---
    // IMPORTANT: Replace these with your actual song file paths and cover image paths.
    // Ensure these files are in the correct 'assets' folder or adjust paths accordingly.
    const songs = [
        {
            title: "Sunrise Serenade",
            artist: "Your Name",
            src: "assets/song1.mp3",
            cover: "assets/cover1.jpg"
        },
        {
            title: "Midnight Echoes",
            artist: "Your Name",
            src: "assets/song2.mp3",
            cover: "assets/cover2.jpg"
        },
        {
            title: "City Lights",
            artist: "Your Name",
            src: "assets/song3.mp3",
            cover: "assets/cover3.jpg"
        },
        {
            title: "Forest Whispers",
            artist: "Your Name",
            src: "assets/song4.mp3",
            cover: "assets/cover4.jpg"
        }
        // Add more songs here
    ];
    // ------------------

    let currentSongIndex = 0;
    let isPlaying = false;
    let isSeeking = false; // Flag to prevent seeking during drag

    // --- Initialization ---
    function loadSong(index) {
        const song = songs[index];
        audioPlayer.src = song.src;
        currentTitle.textContent = song.title;
        currentArtist.textContent = `Artist: ${song.artist}`;
        currentCover.src = song.cover;

        // Highlight the current song in the playlist
        document.querySelectorAll('.song-item').forEach((item, idx) => {
            if (idx === index) {
                item.classList.add('playing');
            } else {
                item.classList.remove('playing');
            }
        });
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // --- Event Listeners ---

    // Play/Pause Button
    playPauseBtn.addEventListener('click', () => {
        if (isPlaying) {
            audioPlayer.pause();
            playPauseBtn.classList.remove('play');
            playPauseBtn.innerHTML = '&#9658;'; // Play icon
        } else {
            audioPlayer.play();
            playPauseBtn.classList.add('play');
            playPauseBtn.innerHTML = '&#9208;'; // Pause icon
        }
        isPlaying = !isPlaying;
    });

    // Load Song when clicking on playlist item
    songListContainer.addEventListener('click', (e) => {
        const clickedItem = e.target.closest('.song-item');
        if (!clickedItem) return;

        const index = parseInt(clickedItem.dataset.index, 10);
        if (!isNaN(index) && index >= 0 && index < songs.length) {
            currentSongIndex = index;
            loadSong(currentSongIndex);
            audioPlayer.play();
            isPlaying = true;
            playPauseBtn.classList.add('play');
            playPauseBtn.innerHTML = '&#9208;'; // Pause icon
        }
    });

    // Next Song Button
    nextBtn.addEventListener('click', () => {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        loadSong(currentSongIndex);
        if (isPlaying) { // If it was playing, continue playing
            audioPlayer.play();
        }
    });

    // Previous Song Button
    prevBtn.addEventListener('click', () => {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        loadSong(currentSongIndex);
        if (isPlaying) { // If it was playing, continue playing
            audioPlayer.play();
        }
    });

    // Time Update for Progress Bar
    audioPlayer.addEventListener('timeupdate', () => {
        if (!isSeeking) {
            const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            progressBar.style.width = `${progressPercent}%`;
            currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime);
        }
    });

    // Duration Load
    audioPlayer.addEventListener('loadedmetadata', () => {
        durationDisplay.textContent = formatTime(audioPlayer.duration);
    });

    // Autoplay Next Song
    audioPlayer.addEventListener('ended', () => {
        // Optional: Autoplay next song
        nextBtn.click(); // Programmatically click the next button
    });

    // Progress Bar Seeking (Drag and Click)
    let isDragging = false;
    let progressBarRect = progressBar.getBoundingClientRect();

    const updateSeek = (e) => {
        if (!isDragging && e.type !== 'click') return;

        const rect = progressBar.parentElement.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const seekWidth = Math.min(Math.max(0, offsetX), rect.width);
        const seekPercent = (seekWidth / rect.width);

        progressBar.style.width = `${seekPercent * 100}%`;
        audioPlayer.currentTime = seekPercent * audioPlayer.duration;
        currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime);
    };

    progressBar.parentElement.addEventListener('mousedown', (e) => {
        isDragging = true;
        isSeeking = true; // Enter seeking mode
        document.addEventListener('mousemove', updateSeek);
        document.addEventListener('mouseup', () => {
            isDragging = false;
            isSeeking = false; // Exit seeking mode
            document.removeEventListener('mousemove', updateSeek);
        });
        updateSeek(e); // Update on initial click
    });

    // Handle click directly on progress bar track
    progressBar.parentElement.addEventListener('click', (e) => {
         // Only process if not currently being dragged
        if (!isDragging) {
            isSeeking = true; // Enter seeking mode
            updateSeek(e);
            isSeeking = false; // Exit seeking mode
        }
    });


    // --- Populate Playlist UI ---
    function populatePlaylist() {
        songListContainer.innerHTML = ''; // Clear existing content
        songs.forEach((song, index) => {
            const songItem = document.createElement('div');
            songItem.classList.add('song-item');
            songItem.dataset.index = index; // Store index for easy access

            songItem.innerHTML = `
                <img src="${song.cover}" alt="Cover" class="song-cover">
                <div class="song-details">
                    <div class="song-title">${song.title}</div>
                    <div class="song-artist">${song.artist}</div>
                </div>
                <div class="play-indicator"></div> <!-- Animated play indicator -->
            `;
            songListContainer.appendChild(songItem);
        });
    }

    // --- Initial Load ---
    populatePlaylist();
    loadSong(currentSongIndex); // Load the first song's info initially
});
