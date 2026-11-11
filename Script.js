
const songs = [
    {
        title: "Dreams",
        artist: "SoundHelix",
        cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    },
    {
        title: "Midnight",
        artist: "SoundHelix",
        cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
    },
    {
        title: "Feel The Beat",
        artist: "SoundHelix",
        cover: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=500",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
    },
    {
        title: "Night Vibes",
        artist: "SoundHelix",
        cover: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=500",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
    },
    {
        title: "Lost In Music",
        artist: "SoundHelix",
        cover: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=500",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
    },
    {
        title: "Good Vibes",
        artist: "SoundHelix",
        cover: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"
    }
];

const audio = document.getElementById("audio");
const trackList = document.getElementById("trackList");
const playBtn = document.getElementById("play");

let currentIndex = 0;
let isPlaying = false;
let shuffle = false;
let repeat = false;

// Display songs
songs.forEach((song, index) => {
    const card = document.createElement("div");
    card.className = "track";

    card.innerHTML = `
        <img src="${song.cover}" alt="Album cover">
        <h3>${song.title}</h3>
        <p>${song.artist}</p>
    `;

    card.addEventListener("click", () => {
        loadSong(index);
        playSong();
    });

    trackList.appendChild(card);
});

// Load song
function loadSong(index) {
    currentIndex = index;

    const song = songs[currentIndex];

    audio.src = song.src;

    document.getElementById("cover").src = song.cover;
    document.getElementById("songTitle").textContent = song.title;
    document.getElementById("artist").textContent = song.artist;

    document.querySelectorAll(".track").forEach((card, i) => {
        card.classList.toggle("selected", i === index);
    });
}

// Play
function playSong() {
    audio.play().then(() => {
        isPlaying = true;
        playBtn.textContent = "Ⅱ";
    }).catch(() => {
        isPlaying = false;
        playBtn.textContent = "▶";
    });
}

// Pause
function pauseSong() {
    audio.pause();
    isPlaying = false;
    playBtn.textContent = "▶";
}

// Play / Pause
playBtn.addEventListener("click", () => {
    if (isPlaying) {
        pauseSong();
    } else {
        if (!audio.src) loadSong(currentIndex);
        playSong();
    }
});

// Next song
function nextSong() {
    if (shuffle && songs.length > 1) {
        let next;
        do {
            next = Math.floor(Math.random() * songs.length);
        } while (next === currentIndex);

        loadSong(next);
    } else {
        currentIndex = (currentIndex + 1) % songs.length;
        loadSong(currentIndex);
    }

    playSong();
}

// Previous song
function previousSong() {
    if (audio.currentTime > 3) {
        audio.currentTime = 0;
        return;
    }

    currentIndex = (currentIndex - 1 + songs.length) % songs.length;
    loadSong(currentIndex);
    playSong();
}

document.getElementById("next").addEventListener("click", nextSong);
document.getElementById("prev").addEventListener("click", previousSong);

// Banner play
document.getElementById("bannerPlay").addEventListener("click", () => {
    if (!audio.src) loadSong(currentIndex);
    playSong();
});

// Progress bar
audio.addEventListener("timeupdate", () => {
    if (audio.duration) {
        const progress = (audio.currentTime / audio.duration) * 100;

        document.getElementById("progress").value = progress;
        document.getElementById("currentTime").textContent =
            formatTime(audio.currentTime);

        document.getElementById("duration").textContent =
            formatTime(audio.duration);
    }
});

// Seek song
document.getElementById("progress").addEventListener("input", (e) => {
    if (audio.duration) {
        audio.currentTime = (e.target.value / 100) * audio.duration;
    }
});

// Volume
document.getElementById("volume").addEventListener("input", (e) => {
    audio.volume = Number(e.target.value);
});

audio.volume = 0.7;

// Shuffle
document.getElementById("shuffle").addEventListener("click", (e) => {
    shuffle = !shuffle;
    e.currentTarget.style.color = shuffle ? "#00ff99" : "#aaa";
});

// Repeat
document.getElementById("repeat").addEventListener("click", (e) => {
    repeat = !repeat;
    audio.loop = repeat;
    e.currentTarget.style.color = repeat ? "#00ff99" : "#aaa";
});

// Auto next song
audio.addEventListener("ended", () => {
    if (!repeat) nextSong();
});

// Time format
function formatTime(time) {
    if (!Number.isFinite(time)) return "0:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

// Initial song
loadSong(0);
