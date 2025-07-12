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
        img : 'Music/b2b.jpg',
        name : 'B2b',
        artist : 'Charli XCX',
        music : 'Music/B2b.mp3'
    },
    {
        img : 'Music/dirtycash.jpg',
        name : 'Dirty Cash (Money Talks)',
        artist : 'PAWSA, The Adventures Of Stevie V',
        music : 'Music/dirty cash.mp3'
    },
    {
        img : 'Music/goodpuss.jpg',
        name : 'GOOD  PUSS',
        artist : 'Cobrah',
        music : 'Music/GOOD PUSS.mp3'
    },
    {
        img : 'Music/headlock.jpg',
        name : 'Headlock',
        artist : 'Imogen Heap',
        music : 'Music/Headlock.mp3'
    },
    {
        img : 'Music/newbootega.jpg',
        name : 'New Bottega',
        artist : 'Toren Foot, Azealia Banks',
        music : 'Music/new bootega.mp3'
    },
    {
        img : 'Music/saopaulo.jpg',
        name : 'São Paulo',
        artist : 'The Weekend, Anitta',
        music : 'Music/São Paulo.mp3'
    }
];

loadTrack(track_index);

function loadTrack(track_index){
    clearInterval(updateTimer);
    reset();

    curr_track.src = music_list[track_index].music;
    curr_track.load();

    track_art.style.backgroundImage = "url(" + music_list[track_index].img + ")";
    player_bg.style.backgroundImage = "url(" + music_list[track_index].img + ")";
    track_name.textContent = music_list[track_index].name;
    track_artist.textContent = music_list[track_index].artist;

    updateTimer = setInterval(setUpdate, 1000);

    curr_track.addEventListener('ended', nextTrack);
}

function reset(){
    curr_time.textContent = "00:00";
}

function playpauseTrack(){
    isPlaying ? pauseTrack() : playTrack();
}
function playTrack(){
    curr_track.play();
    isPlaying = true;
    player_bg.style.opacity = '.2';
    track_art.style.transform = 'scale(1)';
}
function pauseTrack(){
    curr_track.pause();
    isPlaying = false;
    player_bg.style.opacity = '.1';
    track_art.style.transform = 'scale(.8)';
}
function nextTrack(){
    if(track_index < music_list.length - 1 && isRandom === false){
        track_index += 1;
    }else if(track_index < music_list.length - 1 && isRandom === true){
        let random_index = Number.parseInt(Math.random() * music_list.length);
        track_index = random_index;
    }else{
        track_index = 0;
    }
    loadTrack(track_index);
    playTrack();
    player_bg.style.opacity = '0';
    setTimeout(animBg, 1000);
}
function prevTrack(){
    if(track_index > 0){
        track_index -= 1;
    }else{
        track_index = music_list.length -1;
    }
    loadTrack(track_index);
    playTrack();
}

function nextTrackSwipe(){
    if(track_index < music_list.length - 1 && isRandom === false){
        track_index += 1;
    }else if(track_index < music_list.length - 1 && isRandom === true){
        let random_index = Number.parseInt(Math.random() * music_list.length);
        track_index = random_index;
    }else{
        track_index = 0;
    }
    loadTrack(track_index);
    if (isPlaying == false) {
        pauseTrack();
        player_bg.style.opacity = '.1';
    } else {
       playTrack();
       player_bg.style.opacity = '.3';
    }
    player_bg.style.opacity = '0';
    setTimeout(animBg, 1000);
}
function prevTrackSwipe(){
    if(track_index > 0){
        track_index -= 1;
    }else{
        track_index = music_list.length -1;
    }
    loadTrack(track_index);
    if (isPlaying == false) {
        pauseTrack();
        player_bg.style.opacity = '.1';
    } else {
       playTrack();
        player_bg.style.opacity = '.3';
    }
}

function animBg() {
    player_bg.style.opacity = '.3';
}

function setUpdate(){
    if(!isNaN(curr_track.duration)){

        let currentMinutes = Math.floor(curr_track.currentTime / 60);
        let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60);

        if(currentSeconds < 10) {currentSeconds = "0" + currentSeconds; }
        if(currentMinutes < 10) {currentMinutes = "0" + currentMinutes; }

        curr_time.textContent = currentMinutes + ":" + currentSeconds;
    }
}

document.querySelector('.player').addEventListener('touchstart', handleTouchStart, false);
document.querySelector('.player').addEventListener('touchmove', handleTouchMove, false);
document.querySelector('.player').addEventListener('touchend', handleTouchEnd, false);

let x1 = null;
let y1 = null;

function handleTouchStart(event) {
    const firstTouch = event.touches[0];
    x1 = firstTouch.clientX;
    y1 = firstTouch.clientY;
    document.querySelector('.player').style.transform = 'scale(.98)';
}

function handleTouchEnd(event) {
    const touch = event.touches[0];
    document.querySelector('.player').style.transform = 'scale(1)';
}

function handleTouchMove(event) {
    if(!x1 || !y1) {
        return false;
    }
    
    let x2 = event.touches[0].clientX;
    let y2 = event.touches[0].clientY;
    
    let xDiff = x2 - x1;
    let yDiff = y2 - y1;
    
    if(Math.abs(xDiff) > Math.abs(yDiff)) {
        if(xDiff > 0) {
            prevTrackSwipe();
            player_bg.style.opacity = '0';
            document.querySelector('.player').style.transform = 'scaleX(1.03) scaleY(.9) translateX(50px)';
            setTimeout(animBg, 1000);
            document.querySelector('.player').classList.add('right');
            setTimeout(swipeR, 300);
        }
        else {
            nextTrackSwipe();
            document.querySelector('.player').style.transform = 'scaleX(1.03) scaleY(.9) translateX(-50px)';
            player_bg.style.opacity = '0';
            setTimeout(animBg, 1000);
            document.querySelector('.player').classList.add('left');
            setTimeout(swipeL, 300);
        }
    } else {
        
    }
    
    x1 = null;
    y1 = null;
}

function swipeR() {
    document.querySelector('.player').classList.remove('right');
}

function swipeL() {
    document.querySelector('.player').classList.remove('left');
}
