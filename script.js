// =========================
// Fully Updated Audio Player Script
// =========================

const player = document.getElementById("player");
const audio = document.getElementById("audio");
const rewindProgress = document.getElementById("rewindProgress");
const rewindTime = document.getElementById("rewindTime");

let isDragging = false;
let isRewinding = false;
let rewindStartX = 0;
let currentOffset = 0;
let seekDelta = 0;

// Utility
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

// Handle touch events
player.addEventListener("touchstart", (e) => {
  isDragging = true;
  rewindStartX = e.touches[0].clientX;
  currentOffset = 0;

  // Long tap = enable rewind mode
  player.longPressTimeout = setTimeout(() => {
    isRewinding = true;
    player.classList.add("rewinding");
    rewindProgress.style.display = "block";
    rewindTime.style.display = "block";
    rewindTime.textContent = formatTime(audio.currentTime);
  }, 500);
});

player.addEventListener("touchmove", (e) => {
  if (!isDragging) return;

  const deltaX = e.touches[0].clientX - rewindStartX;
  currentOffset = deltaX;

  if (isRewinding) {
    seekDelta = clamp(deltaX / 10, -30, 30); // max ±30 секунд
    const previewTime = clamp(audio.currentTime + seekDelta, 0, audio.duration);
    rewindTime.textContent = formatTime(previewTime);
    rewindProgress.value = (previewTime / audio.duration) * 100;
  } else {
    player.style.transform = `translateX(${deltaX}px)`;
    player.style.opacity = `${1 - Math.abs(deltaX) / 200}`;
  }
});

player.addEventListener("touchend", () => {
  isDragging = false;
  clearTimeout(player.longPressTimeout);

  if (isRewinding) {
    // Реальна перемотка
    audio.currentTime = clamp(audio.currentTime + seekDelta, 0, audio.duration);
    rewindProgress.style.display = "none";
    rewindTime.style.display = "none";
    player.classList.remove("rewinding");
    isRewinding = false;
    seekDelta = 0;
    return;
  }

  // Swipe для переходу між треками (не активується при rewind)
  if (Math.abs(currentOffset) > 100) {
    if (currentOffset > 0) {
      console.log("← Prev track");
      // prevTrack();
    } else {
      console.log("→ Next track");
      // nextTrack();
    }
  }

  player.style.transition = "transform 0.3s, opacity 0.3s";
  player.style.transform = "translateX(0)";
  player.style.opacity = "1";

  setTimeout(() => {
    player.style.transition = "";
  }, 300);
});

// Optionally: update progress bar in normal mode
audio.addEventListener("timeupdate", () => {
  if (!isRewinding) {
    rewindProgress.value = (audio.currentTime / audio.duration) * 100;
  }
});
