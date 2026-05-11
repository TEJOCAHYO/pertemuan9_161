// 1. Loader Handler
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader-wrapper');
    setTimeout(() => {
        loader.style.transform = 'translateY(-100%)';
    }, 1800);
});

// 2. Mouse Parallax Effect
const bg = document.getElementById('bgLayer');
const avatar = document.getElementById('avatarBox');

document.addEventListener('mousemove', (e) => {
    let x = (e.clientX / window.innerWidth) - 0.5;
    let y = (e.clientY / window.innerHeight) - 0.5;

    bg.style.transform = `translateX(${x * 20}px) translateY(${y * 20}px)`;
    avatar.style.transform = `
        translateX(${x * -40}px) 
        translateY(${y * -40}px) 
        rotateX(${y * -15}deg) 
        rotateY(${x * 15}deg)
    `;
});

// 3. Modal Logic (Contact & Media)
const openBtn = document.getElementById('openContact');
const overlay = document.getElementById('contactOverlay');
const closeBtn = document.getElementById('closeContact');

function openMedia(type) { document.getElementById('modal-' + type).classList.add('active'); }
function closeMedia(type) { document.getElementById('modal-' + type).classList.remove('active'); }

openBtn.addEventListener('click', () => overlay.classList.add('active'));
closeBtn.addEventListener('click', () => overlay.classList.remove('active'));

overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('active');
});

document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") {
        overlay.classList.remove('active');
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    }
});

// 4. Music Logic with Duration
const tracks = [];
let currentTrackIdx = null;
const audioPlayer = new Audio();

document.getElementById('musicUpload').addEventListener('change', function() {
    Array.from(this.files).forEach(file => {
        const url = URL.createObjectURL(file);
        const tempAudio = new Audio(url);
        
        tempAudio.addEventListener('loadedmetadata', () => {
            const min = Math.floor(tempAudio.duration / 60);
            const sec = Math.floor(tempAudio.duration % 60);
            const durationLabel = `${min}:${sec.toString().padStart(2, '0')}`;
            
            tracks.push({
                name: file.name.replace(/\.[^.]+$/, ''),
                url: url,
                duration: durationLabel
            });
            renderTracks();
        });
    });
});

function renderTracks() {
    const list = document.getElementById('trackList');
    list.innerHTML = tracks.map((t, i) => `
        <div class="track-item" onclick="playTrack(${i})">
            <div class="track-icon">🎵</div>
            <div style="margin-left:10px">
                <div style="font-size:12px; font-weight:bold;">${t.name}</div>
            </div>
            <div class="track-duration">${t.duration}</div>
            <div style="font-size:12px;">${currentTrackIdx === i ? '⏸' : '▶'}</div>
        </div>
    `).join('');
}

function playTrack(i) {
    if (currentTrackIdx === i) {
        if (audioPlayer.paused) audioPlayer.play();
        else audioPlayer.pause();
    } else {
        currentTrackIdx = i;
        audioPlayer.src = tracks[i].url;
        audioPlayer.play();
    }
    renderTracks();
}