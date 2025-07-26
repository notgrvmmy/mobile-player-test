// =========================
// Fully Updated Audio Player Script with Real Tracks & Rewind
// =========================

// DOM elements
const player = document.querySelector(".player");
let track_art = document.querySelector(".player .track__info .cover");
let player_bg = document.querySelector(".player .bg__img");
let track_name = document.querySelector(".player .track__info .details .track__name");
let track_artist = document.querySelector(".player .track__info .details .artist__name");
let curr_time = document.querySelector(".player .track__controlls .time .curr__time");
let duration = document.querySelector(".player .track__controlls .time .duration");
let curr_track = document.createElement("audio");
const rewindProgress = document.getElementById("rewindProgress");
const rewindTime = document.getElementById("rewindTime");

let track_index = 0;
let isPlaying = false;
let isRandom = false;
let updateTimer;

const music_list = [
  {
    img: "Music/b2b.jpg",
    name: "B2b",
    artist: "Charli XCX",
    music: "Music/B2b.mp3",
  },
  {
    img: "Music/dirtycash.jpg",
    name: "Dirty Cash (Money Talks)",
    artist: "PAWSA, The Adventures Of Stevie V",
    music: "Music/dirty cash.mp3",
  },
  {
    img: "Music/goodpuss.jpg",
    name: "GOOD  PUSS",
    artist: "Cobrah",
    music: "Music/GOOD PUSS.mp3",
  },
  {
    img: "Music/headlock.jpg",
    name: "Headlock",
    artist: "Imogen Heap",
    music: "Music/Headlock.mp3",
  },
  {
    img: "Music/newbootega.jpg",
    name: "New Bottega",
    artist: "Toren Foot, Azealia Banks",
    music: "Music/new bootega.mp3",
  },
  {
    img: "Music/saopaulo.jpg",
    name: "São Paulo",
    artist: "The Weekend, Anitta",
    music: "Music/São Paulo.mp3",
  },
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
  curr_track.addEventListener("ended", nextTrack);
}

function reset() {
  curr_time.textContent = "00:00";
  rewindProgress.value = 0;
}

function playpauseTrack() {
  isPlaying ? pauseTrack() : playTrack();
}

function playTrack() {
  curr_track.play();
  isPlaying = true;
  player_bg.style.opacity = ".2";
  track_art.style.transform = "scale(1)";
}

function pauseTrack() {
  curr_track.pause();
  isPlaying = false;
  player_bg.style.opacity = ".1";
  track_art.style.transform = "scale(.8)";
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
  player_bg.style.opacity = ".3";
}

function setUpdate() {
  if (!isNaN(curr_track.duration)) {
    let currentMinutes = Math.floor(curr_track.currentTime / 60);
    let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60);
    if (currentSeconds < 10) currentSeconds = "0" + currentSeconds;
    if (currentMinutes < 10) currentMinutes = "0" + currentMinutes;
    curr_time.textContent = `${currentMinutes}:${currentSeconds}`;
    if (!isRewinding) {
      rewindProgress.value = (curr_track.currentTime / curr_track.duration) * 100;
    }
  }
}

// Swipe + Rewind Touch Logic
let isDragging = false;
let isRewinding = false;
let rewindStartX = 0;
let currentOffset = 0;
let seekDelta = 0;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

player.addEventListener("touchstart", (e) => {
  isDragging = true;
  rewindStartX = e.touches[0].clientX;
  currentOffset = 0;

  player.longPressTimeout = setTimeout(() => {
    isRewinding = true;
    player.classList.add("rewinding");
    rewindProgress.style.display = "block";
    rewindTime.style.display = "block";
    rewindTime.textContent = formatTime(curr_track.currentTime);
  }, 500);
});

player.addEventListener("touchmove", (e) => {
  if (!isDragging) return;

  const deltaX = e.touches[0].clientX - rewindStartX;
  currentOffset = deltaX;

  if (isRewinding) {
    seekDelta = clamp(deltaX / 10, -30, 30);
    const previewTime = clamp(curr_track.currentTime + seekDelta, 0, curr_track.duration);
    rewindTime.textContent = formatTime(previewTime);
    rewindProgress.value = (previewTime / curr_track.duration) * 100;
  } else {
    player.style.transform = `translateX(${deltaX}px)`;
    player.style.opacity = `${1 - Math.abs(deltaX) / 200}`;
  }
});

player.addEventListener("touchend", () => {
  isDragging = false;
  clearTimeout(player.longPressTimeout);

  if (isRewinding) {
    curr_track.currentTime = clamp(curr_track.currentTime + seekDelta, 0, curr_track.duration);
    rewindProgress.style.display = "none";
    rewindTime.style.display = "none";
    player.classList.remove("rewinding");
    isRewinding = false;
    seekDelta = 0;
    return;
  }

  if (Math.abs(currentOffset) > 100) {
    if (currentOffset > 0) {
      prevTrackSwipe();
    } else {
      nextTrackSwipe();
    }
  }

  player.style.transition = "transform 0.3s, opacity 0.3s";
  player.style.transform = "translateX(0)";
  player.style.opacity = "1";

  setTimeout(() => {
    player.style.transition = "";
  }, 300);
});

loadTrack(track_index);
