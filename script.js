// DOM-елементи
const player = document.querySelector('.player');
let track_art = document.querySelector('.player .track__info .cover');
let player_bg = document.querySelector('.player .bg__img');
let track_name = document.querySelector('.player .track__info .details .track__name');
let track_artist = document.querySelector('.player .track__info .details .artist__name');
let curr_time = document.querySelector('.player .track__controlls .time .curr__time');
let duration = document.querySelector('.player .track__controlls .time .duration');
let curr_track = document.createElement('audio');

let track_index = 0;
let isPlaying = false;
let isRandom = false;
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
        name: 'GOOD  PUSS',
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

// Завантаження треку
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
    if (track_index < music_list.length - 1 && !isRandom) {
        track_index++;
    } else if (isRandom) {
        track_index = Math.floor(Math.random() * music_list.length);
    } else {
        track_index = 0;
    }
    loadTrack(track_index);
    playTrack();
    animBg();
}

function prevTrack() {
    if (track_index > 0) {
        track_index--;
    } else {
        track_index = music_list.length - 1;
    }
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

// ==== Новый touch-свайп с растягиванием ====

let x1 = null;
let currentTranslateX = 0;
let isSwiping = false;

const maxDrag = 80;
const swipeThreshold = 50;

function applySwipeStyle(x) {
    player.style.transform = `translateX(${x}px) scaleY(${1 - Math.abs(x) / 400})`;
    //player.style.boxShadow = `0 5px 20px rgba(0,0,0,${Math.abs(x) / 150})`;
    // player.style.backdropFilter = `blur(${Math.abs(x) / 15}px)`;
    player.style.transition = 'none';
}

function resetPlayerStyle() {
    player.style.transition = 'all .6s cubic-bezier(.47,1.64,.41,.8)';
    player.style.transform = 'translateX(0) scaleY(1)';
    //player.style.boxShadow = '0 0 0 rgba(0,0,0,0)';
    // player.style.backdropFilter = 'blur(0px)';
    setTimeout(() => {
        player.style.transition = '';
    }, 600);
}

function handleTouchStart(e) {
    x1 = e.touches[0].clientX;
    isSwiping = true;
    document.querySelector('.player').style.transform = 'scale(.98)';
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
    document.querySelector('.player').style.transform = 'scale(1)';

    resetPlayerStyle();
    x1 = null;
    currentTranslateX = 0;
    isSwiping = false;
}

// Подключаем слушатели
player.addEventListener('touchstart', handleTouchStart, false);
player.addEventListener('touchmove', handleTouchMove, false);
player.addEventListener('touchend', handleTouchEnd, false);

// Запуск
loadTrack(track_index);
