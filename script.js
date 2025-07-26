// === Переменные ===
let isDragging = false;
let startX = 0;
let currentX = 0;
let dragOffset = 0;
let currentTrackIndex = 0;
const threshold = 50;
const rewindThreshold = 10;

const audio = document.getElementById("audio");
const player = document.getElementById("player");
const rewindProgress = document.getElementById("rewindProgress");
const rewindTime = document.getElementById("rewindTime");

const tracks = [
  "track1.mp3",
  "track2.mp3",
  "track3.mp3"
];

function loadTrack(index) {
  if (index >= 0 && index < tracks.length) {
    audio.src = tracks[index];
    audio.play();
  }
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

player.addEventListener("touchstart", (e) => {
  isDragging = true;
  startX = e.touches[0].clientX;
  player.style.transition = "none";
  rewindProgress.style.display = "none";
  rewindTime.style.display = "none";
});

player.addEventListener("touchmove", (e) => {
  if (!isDragging) return;

  currentX = e.touches[0].clientX;
  dragOffset = currentX - startX;

  // === ЭФФЕКТЫ при свайпе ===
  const opacity = 1 - Math.min(Math.abs(dragOffset) / 200, 1);
  const scale = 1 - Math.min(Math.abs(dragOffset) / 1000, 0.05);
  const blur = Math.min(Math.abs(dragOffset) / 20, 10);

  player.style.transform = `translateX(${dragOffset}px) scale(${scale})`;
  player.style.opacity = opacity;
  player.style.filter = `blur(${blur}px)`;

  // === Если свайп медленный (перемотка) ===
  if (Math.abs(dragOffset) < threshold) {
    const rewindPercent = Math.min(Math.abs(dragOffset) / rewindThreshold, 100);
    const newTime = audio.currentTime + (dragOffset / 10);
    const clampedTime = Math.max(0, Math.min(audio.duration, newTime));

    rewindProgress.value = (clampedTime / audio.duration) * 100;
    rewindTime.innerText = formatTime(clampedTime);

    rewindProgress.style.display = "block";
    rewindTime.style.display = "block";
  }
});

player.addEventListener("touchend", () => {
  player.style.transition = "transform 0.3s ease, opacity 0.3s ease, filter 0.3s ease";

  // === Если сильный свайп — переключаем трек ===
  if (dragOffset > threshold) {
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    loadTrack(currentTrackIndex);
  } else if (dragOffset < -threshold) {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    loadTrack(currentTrackIndex);
  }
  // === Если слабый свайп — перемотка ===
  else if (Math.abs(dragOffset) < threshold) {
    const newTime = audio.currentTime + (dragOffset / 10);
    const clampedTime = Math.max(0, Math.min(audio.duration, newTime));
    audio.currentTime = clampedTime;
  }

  // Сброс стилей
  player.style.transform = "translateX(0) scale(1)";
  player.style.opacity = 1;
  player.style.filter = "blur(0)";

  rewindProgress.style.display = "none";
  rewindTime.style.display = "none";

  isDragging = false;
  dragOffset = 0;
});

// Автоматическое обновление прогресс-бара во время воспроизведения
setInterval(() => {
  if (!isDragging && audio.duration) {
    rewindProgress.value = (audio.currentTime / audio.duration) * 100;
  }
}, 500);

// Загрузка первого трека при старте
loadTrack(currentTrackIndex);
