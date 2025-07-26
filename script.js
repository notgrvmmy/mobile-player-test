
// DOM elements
const player = document.querySelector('.player');
let track_art = document.querySelector('.player .track__info .cover');
let player_bg = document.querySelector('.player .bg__img');
let track_name = document.querySelector('.player .track__info .details .track__name');
let track_artist = document.querySelector('.player .track__info .details .artist__name');
let curr_time = document.querySelector('.player .track__controlls .time .curr__time');
let curr_track = document.createElement('audio');

let track_index = 0;
let isPlaying = false;
let updateTimer;

const music_list = [
    {
        img: 'Music/b2b.jpg',
        name: 'B2b',
        artist: 'Charli XCX',
        music: 'Music/B2b.mp3'
    },
    {
        img: 'Music/dirtycash.jpg',
        name: 'Dirty Cash (Money Talks)',
        artist: 'PAWSA, The Adventures Of Stevie V',
        music: 'Music/dirty cash.mp3'
    },
    {
        img: 'Music/goodpuss.jpg',
        name: 'GOOD PUSS',
        artist: 'Cobrah',
        music: 'Music/GOOD PUSS.mp3'
    },
    {
        img: 'Music/headlock.jpg',
        name: 'Headlock',
        artist: 'Imogen Heap',
        music: 'Music/Headlock.mp3'
    },
    {
        img: 'Music/newbootega.jpg',
        name: 'New Bottega',
        artist: 'Toren Foot, Azealia Banks',
        music: 'Music/new bootega.mp3'
    },
    {
        img: 'Music/saopaulo.jpg',
        name: 'São Paulo',
        artist: 'The Weekend, Anitta',
        music: 'Music/São Paulo.mp3'
    }
];

function loadTrack(index) {
    clearInterval(updateTimer);
    reset();

    curr_track.src = music_list[index].music;
    curr_track.load();

    track_art.style.backgroundImage = "url(" + music_list[index].img + ")";
    player_bg.style.backgroundImage = "url(" + music_list[index].img + ")";
    track_name.textContent = music_list[index].name;
    track_artist.textContent = music_list[index].artist;

    updateTimer = setInterval(setUpdate, 1000);
    curr_track.addEventListener('ended', nextTrack);
}

function reset() {
    curr_time.textContent = "00:00";
}

function playpauseTrack() {
    isPlaying ? pauseTrack() : playTrack();
}

function playTrack() {
    curr_track.play();
    isPlaying = true;
    player_bg.style.opacity = '.2';
    track_art.style.transform = 'scale(1)';
}

function pauseTrack() {
    curr_track.pause();
    isPlaying = false;
    player_bg.style.opacity = '.1';
    track_art.style.transform = 'scale(.8)';
}

function nextTrack() {
    track_index = (track_index + 1) % music_list.length;
    loadTrack(track_index);
    playTrack();
    animBg();
}

function prevTrack() {
    track_index = (track_index - 1 + music_list.length) % music_list.length;
    loadTrack(track_index);
    playTrack();
}

function nextTrackSwipe() {
    nextTrack();
    if (!isPlaying) pauseTrack();
}

function prevTrackSwipe() {
    prevTrack();
    if (!isPlaying) pauseTrack();
}

function animBg() {
    player_bg.style.opacity = '.3';
}

function setUpdate() {
    if (!isNaN(curr_track.duration)) {
        let currentMinutes = Math.floor(curr_track.currentTime / 60);
        let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60);
        if (currentSeconds < 10) currentSeconds = "0" + currentSeconds;
        if (currentMinutes < 10) currentMinutes = "0" + currentMinutes;
        curr_time.textContent = `${currentMinutes}:${currentSeconds}`;
    }
}

// ==== Swipe to switch track ====
let x1 = null;
let currentTranslateX = 0;
let isSwiping = false;
let isSeeking = false;
const maxDrag = 80;
const swipeThreshold = 50;

function applySwipeStyle(x) {
    player.style.transform = `translateX(${x}px) scaleY(${1 - Math.abs(x) / 400})`;
    player.style.transition = 'none';
}

function resetPlayerStyle() {
    player.style.transition = 'all .6s cubic-bezier(.47,1.64,.41,.8)';
    player.style.transform = 'translateX(0) scaleY(1)';
    setTimeout(() => {
        player.style.transition = '';
    }, 600);
}

function handleTouchStart(e) {
    if (e.touches.length > 1) return;
    x1 = e.touches[0].clientX;
    isSwiping = !isSeeking;
    if (isSwiping) player.style.transform = 'scale(.98)';
}

function handleTouchMove(e) {
    if (!x1 || !isSwiping) return;
    let x2 = e.touches[0].clientX;
    let xDiff = x2 - x1;
    currentTranslateX = Math.max(-maxDrag, Math.min(xDiff, maxDrag));
    applySwipeStyle(currentTranslateX);
}

function handleTouchEnd() {
    if (!isSwiping) return;
    if (currentTranslateX > swipeThreshold) {
        prevTrackSwipe();
        navigator.vibrate?.(50);
    } else if (currentTranslateX < -swipeThreshold) {
        nextTrackSwipe();
        navigator.vibrate?.(50);
    }
    player.style.transform = 'scale(1)';
    resetPlayerStyle();
    x1 = null;
    currentTranslateX = 0;
    isSwiping = false;
}

// ==== Long Press Seek Feature ====
let seekTimer = null;
let seekStartX = 0;

player.addEventListener('touchstart', (e) => {
    if (e.touches.length > 1) return;
    seekStartX = e.touches[0].clientX;
    seekTimer = setTimeout(() => {
        isSeeking = true;
        player.classList.add('seeking');
        curr_track.pause();
    }, 600);
});

player.addEventListener('touchmove', (e) => {
    if (isSeeking) {
        const deltaX = e.touches[0].clientX - seekStartX;
        const seekAmount = deltaX / 5;
        curr_track.currentTime = Math.min(Math.max(curr_track.currentTime + seekAmount, 0), curr_track.duration);
        seekStartX = e.touches[0].clientX;
    }
});

player.addEventListener('touchend', () => {
    clearTimeout(seekTimer);
    if (isSeeking) {
        player.classList.remove('seeking');
        if (isPlaying) curr_track.play();
        isSeeking = false;
    }
});

// Start everything
player.addEventListener('touchstart', handleTouchStart, false);
player.addEventListener('touchmove', handleTouchMove, false);
player.addEventListener('touchend', handleTouchEnd, false);

loadTrack(track_index);
