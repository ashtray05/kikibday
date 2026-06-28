const loader = document.getElementById("loader");
const loaderProgress = document.getElementById("loaderProgress");

const introGate = document.getElementById("introGate");
const passInput = document.getElementById("passInput");
const enterBtn = document.getElementById("enterBtn");
const introError = document.getElementById("introError");
const siteShell = document.getElementById("siteShell");

const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const yesReveal = document.getElementById("yesReveal");
const mainTitle = document.getElementById("mainTitle");

const playBtn = document.getElementById("playBtn");
const pauseBtn = document.getElementById("pauseBtn");
const restartBtn = document.getElementById("restartBtn");
const letterBtn = document.getElementById("letterBtn");
const secretLetterChip = document.getElementById("secretLetterChip");
const song = document.getElementById("song");
const spinSfx = document.getElementById("spinSfx");
const progressFill = document.getElementById("progressFill");

const lyricMain = document.getElementById("lyricMain");
const lyricSub = document.getElementById("lyricSub");

const cursorHearts = document.getElementById("cursorHearts");
const stars = document.getElementById("stars");
const floatingHearts = document.getElementById("floatingHearts");

const prevSlide = document.getElementById("prevSlide");
const nextSlide = document.getElementById("nextSlide");
const carouselTrack = document.getElementById("carouselTrack");
const carouselDots = document.getElementById("carouselDots");
const carouselWrap = document.getElementById("carouselWrap");
const slides = Array.from(document.querySelectorAll(".slide"));

const surpriseBoxes = document.querySelectorAll(".surprise-box");
const openedTotal = document.getElementById("openedTotal");

const reasonBox = document.getElementById("reasonBox");
const newReasonBtn = document.getElementById("newReasonBtn");

const gameStartBtn = document.getElementById("gameStartBtn");
const gameScore = document.getElementById("gameScore");
const moodWheel = document.getElementById("moodWheel");
const moodResult = document.getElementById("moodResult");

const letterModal = document.getElementById("letterModal");
const closeModal = document.getElementById("closeModal");
const modalOverlay = document.getElementById("modalOverlay");

const easterEgg = document.getElementById("easterEgg");

const SECRET_PASSWORD = "kikimango";

let noClicks = 0;
let openedCount = 0;
let currentSlide = 0;
let autoSlideInterval = null;
let touchStartX = 0;
let typedKeys = "";
let moodSpinning = false;

const noTexts = [
  "no",
  "be serious",
  "wrong answer",
  "nah try again",
  "click yes pls",
  "pls leh my love",
  "still no??",
  "babe pls",
  "just press yes babyyy pls♡"
];

const lyricMoments = [
  { time: 0,  main: "she look just like a dream",                      sub: "hehe it already says so much about you" },
  { time: 4,  main: "you make everything feel softer",                  sub: "even normal moments feel unreal with you" },
  { time: 8,  main: "you are the kind of pretty that stays in my head", sub: "the sweet kind, the calm kind, the impossible kind" },
  { time: 12, main: "there is just something about you",                sub: "and i don't think i will ever get over it" },
  { time: 16, main: "birthday girl and dream girl",                     sub: "literally you all the time" }
];

const reasons = [
  "your smile and texts change the entire mood of my day",
  "you make everything feel softer and safer",
  "you are so pretty without even trying",
  "your laugh is one of my favorite sounds ever",
  "you make ordinary moments feel special",
  "being around you feels so calm and like home",
  "you are literally so pretty it is unfair grr",
  "you have the sweetest energy",
  "you make life feel warmer",
  "i could never get tired of you"
];

const moods = [
  "today's vibe: unlimited mala without laosai and weight gain pass for 1 year",
  "today's vibe: free popcorn kisses pass from ash",
  "today's vibe: we own 67 ferraris and porsches",
  "today's vibe: penthouse at district 9",
  "today's vibe: 1 year supply of brandy and subdued",
  "today's vibe: one wish willow to use on ash",
  "today's vibe: your personal chef and baker for 1 year",
  "today's vibe: popcorn kisses, shopping at orchard, and compliments"
];

/* ─── EMOJI BURST SET ─────────────────────── */
const burstEmojis = ["♡", "♥", "💋", "😘", "🌸", "✨", "💕", "🫶", "💗", "🎀"];

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

/* ─── BUTTON CLICK ANIMATION ──────────────── */
function triggerButtonAnim(btn, x, y) {
  // remove existing anim class so it can re-trigger
  btn.classList.remove("btn-click-anim");
  // force reflow
  void btn.offsetWidth;
  btn.classList.add("btn-click-anim");

  // remove class after animation ends
  btn.addEventListener("animationend", () => {
    btn.classList.remove("btn-click-anim");
  }, { once: true });

  // spawn emoji burst around the click point
  const count = Math.floor(randomBetween(4, 8));
  const cx = x ?? (btn.getBoundingClientRect().left + btn.offsetWidth / 2);
  const cy = y ?? (btn.getBoundingClientRect().top + btn.offsetHeight / 2);

  for (let i = 0; i < count; i++) {
    spawnEmoji(cx + randomBetween(-30, 30), cy, burstEmojis[Math.floor(Math.random() * burstEmojis.length)]);
  }
}

function spawnEmoji(x, y, emoji) {
  const el = document.createElement("div");
  el.className = "emoji-burst";
  el.textContent = emoji;
  el.style.left = x + "px";
  el.style.top  = y + "px";
  el.style.fontSize = `${randomBetween(14, 24)}px`;
  el.style.animationDuration = `${randomBetween(0.6, 1.0)}s`;
  el.style.animationDelay = `${randomBetween(0, 0.15)}s`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1200);
}

/* patch all pill/soft/game/carousel/close buttons to fire the animation */
function attachButtonAnimations() {
  const targets = document.querySelectorAll(
    ".pill-btn, .soft-btn, .game-start, .carousel-nav, .modal-close, .ghost-chip, .dot, .surprise-box, .flip-card"
  );
  targets.forEach((btn) => {
    btn.addEventListener("pointerup", (e) => {
      triggerButtonAnim(btn, e.clientX, e.clientY);
    });
  });
}

/* ─── LOADER ──────────────────────────────── */
function runLoader() {
  let progress = 0;
  const interval = setInterval(() => {
    progress += randomBetween(8, 18);
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add("hidden-loader");
      }, 250);
    }
    loaderProgress.style.width = `${progress}%`;
  }, 180);
}

/* ─── PASSWORD ────────────────────────────── */
function unlockSite() {
  introGate.classList.add("hidden");
  siteShell.classList.remove("hidden-site");
}

function tryPassword() {
  const value = passInput.value.trim().toLowerCase();
  if (value === SECRET_PASSWORD.toLowerCase()) {
    unlockSite();
  } else {
    introError.classList.remove("hidden");
    passInput.value = "";
    // shake animation on error
    passInput.style.animation = "none";
    void passInput.offsetWidth;
    passInput.style.animation = "";
  }
}

/* ─── AMBIENT BACKGROUND ──────────────────── */
function createAmbientBackground() {
  for (let i = 0; i < 36; i++) {
    const star = document.createElement("div");
    star.className = "star";
    star.style.left = `${randomBetween(0, 100)}vw`;
    star.style.top  = `${randomBetween(0, 100)}vh`;
    star.style.animationDuration = `${randomBetween(1.4, 3)}s`;
    star.style.animationDelay   = `${randomBetween(0, 2)}s`;
    stars.appendChild(star);
  }

  for (let i = 0; i < 24; i++) {
    const heart = document.createElement("div");
    heart.className = "float-heart";
    heart.textContent = Math.random() > 0.5 ? "♡" : "♥";
    heart.style.left = `${randomBetween(0, 100)}vw`;
    heart.style.fontSize = `${randomBetween(14, 28)}px`;
    heart.style.animationDuration = `${randomBetween(8, 14)}s`;
    heart.style.animationDelay   = `${randomBetween(0, 6)}s`;
    floatingHearts.appendChild(heart);
  }
}

/* ─── CURSOR HEARTS (desktop only) ──────── */
function createCursorHeart(x, y) {
  if (window.innerWidth <= 760) return;
  const heart = document.createElement("div");
  heart.className = "cursor-heart";
  heart.textContent = Math.random() > 0.5 ? "♡" : "♥";
  heart.style.left  = `${x}px`;
  heart.style.top   = `${y}px`;
  heart.style.color = Math.random() > 0.5 ? "#ffffff" : "#ffd1e3";
  cursorHearts.appendChild(heart);
  setTimeout(() => heart.remove(), 900);
}

/* ─── CONFETTI ────────────────────────────── */
function createConfettiBurst() {
  const colors = ["#ffffff", "#ffd8e8", "#ff9fc4", "#ffc5db", "#ffeaf2"];
  for (let i = 0; i < 110; i++) {
    const piece = document.createElement("div");
    piece.style.cssText = `
      position:fixed; top:-20px;
      left:${randomBetween(0, 100)}vw;
      width:${randomBetween(6, 12)}px;
      height:${randomBetween(10, 18)}px;
      border-radius:999px;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      opacity:0.95; pointer-events:none; z-index:140;
      transition:transform 3s linear, top 3s linear, opacity 3s linear;
      transform:rotate(${randomBetween(0, 360)}deg);
    `;
    document.body.appendChild(piece);
    requestAnimationFrame(() => {
      piece.style.top       = "110vh";
      piece.style.transform = `translateX(${randomBetween(-160, 160)}px) rotate(${randomBetween(240, 780)}deg)`;
      piece.style.opacity   = "0";
    });
    setTimeout(() => piece.remove(), 3200);
  }
}

/* ─── NO BUTTON ───────────────────────────── */
function moveNoButton() {
  noClicks += 1;
  noBtn.textContent = noTexts[noClicks % noTexts.length];
  yesBtn.classList.add("yes-pulse");

  const maxX = window.innerWidth  - noBtn.offsetWidth  - 16;
  const maxY = window.innerHeight - noBtn.offsetHeight - 16;

  noBtn.style.position = "fixed";
  noBtn.style.left     = `${randomBetween(8, Math.max(8, maxX))}px`;
  noBtn.style.top      = `${randomBetween(8, Math.max(8, maxY))}px`;
  noBtn.style.zIndex   = "90";

  const scaleAmount = Math.min(1 + noClicks * 0.08, 1.6);
  yesBtn.style.transform = `scale(${scaleAmount})`;
}

/* ─── YES REVEAL ──────────────────────────── */
function revealLove() {
  yesReveal.classList.remove("hidden");
  createConfettiBurst();
  mainTitle.innerHTML = "yayyyyy<br />happy birthday kiki ♡";
  song.play().catch(() => {});
}

/* ─── LYRICS SYNC ─────────────────────────── */
function updateLyrics() {
  const current = song.currentTime;
  for (let i = lyricMoments.length - 1; i >= 0; i--) {
    if (current >= lyricMoments[i].time) {
      lyricMain.textContent = lyricMoments[i].main;
      lyricSub.textContent  = lyricMoments[i].sub;
      break;
    }
  }
  if (song.duration) {
    const progress = (song.currentTime / song.duration) * 100;
    progressFill.style.width = `${progress}%`;
  }
}

/* ─── CAROUSEL ────────────────────────────── */
function updateCarousel() {
  carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
  document.querySelectorAll(".dot").forEach((dot, index) => {
    dot.classList.toggle("active", index === currentSlide);
  });
}

function goToSlide(index) {
  currentSlide = (index + slides.length) % slides.length;
  updateCarousel();
}

function buildDots() {
  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.className = "dot";
    dot.setAttribute("aria-label", `go to slide ${index + 1}`);
    dot.addEventListener("click", (e) => {
      triggerButtonAnim(dot, e.clientX, e.clientY);
      goToSlide(index);
      restartAutoSlide();
    });
    carouselDots.appendChild(dot);
  });
  updateCarousel();
}

function startAutoSlide() {
  autoSlideInterval = setInterval(() => {
    goToSlide(currentSlide + 1);
  }, 3500);
}

function restartAutoSlide() {
  clearInterval(autoSlideInterval);
  startAutoSlide();
}

/* ─── SURPRISE BOXES ──────────────────────── */
function openSurprise(box, x, y) {
  if (!box.dataset.opened) {
    box.dataset.opened = "true";
    openedCount += 1;
    openedTotal.textContent = `cute surprises opened: ${openedCount}`;
    box.classList.add("opened");
  }
  box.textContent = box.dataset.message;
  triggerButtonAnim(box, x, y);
}

/* ─── REASON BOX ──────────────────────────── */
function randomReason() {
  const next = reasons[Math.floor(Math.random() * reasons.length)];
  reasonBox.textContent = next;
}

/* ─── MODAL ───────────────────────────────── */
function openModal() {
  letterModal.classList.remove("hidden");
  letterModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLetterModal() {
  letterModal.classList.add("hidden");
  letterModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

/* ─── GAME ────────────────────────────────── */
function startGame() {
  if (moodSpinning) return;
  moodSpinning = true;
  gameStartBtn.textContent = "spinning...";
  moodWheel.style.transform = "rotate(1080deg)";

  spinSfx.currentTime = 0;
  spinSfx.play().catch(() => {});

  setTimeout(() => {
    const pickedMood = moods[Math.floor(Math.random() * moods.length)];
    moodResult.textContent = pickedMood;
    gameScore.textContent = "mood: selected";
    moodWheel.style.transform = "rotate(0deg)";
    moodSpinning = false;
    gameStartBtn.textContent = "spin again";

    // burst around the result text
    const rect = moodResult.getBoundingClientRect();
    for (let i = 0; i < 10; i++) {
      spawnEmoji(
        rect.left + randomBetween(0, rect.width),
        rect.top,
        burstEmojis[Math.floor(Math.random() * burstEmojis.length)]
      );
    }
  }, 1100);
}

/* ─── FLIP CARDS ──────────────────────────── */
function setupFlipCards() {
  const cards = document.querySelectorAll(".flip-card");
  cards.forEach((card) => {
    card.addEventListener("click", (e) => {
      card.classList.toggle("flipped");
      // small emoji burst on flip
      triggerButtonAnim(card, e.clientX, e.clientY);
    });
  });
}

/* ─── EASTER EGG ──────────────────────────── */
function handleSecretKeys(key) {
  typedKeys += key.toLowerCase();
  typedKeys = typedKeys.slice(-4);
  if (typedKeys === "kiki") {
    easterEgg.classList.remove("hidden");
    createConfettiBurst();
    setTimeout(() => {
      easterEgg.classList.add("hidden");
    }, 2600);
  }
}

/* ─── TOUCH / SWIPE ───────────────────────── */
function handleTouchStart(event) {
  touchStartX = event.changedTouches[0].clientX;
}

function handleTouchEnd(event) {
  const endX = event.changedTouches[0].clientX;
  const diff = touchStartX - endX;
  if (Math.abs(diff) > 40) {
    if (diff > 0) {
      goToSlide(currentSlide + 1);
    } else {
      goToSlide(currentSlide - 1);
    }
    restartAutoSlide();
  }
}

/* ─── EVENT LISTENERS ─────────────────────── */
document.addEventListener("mousemove", (event) => {
  createCursorHeart(event.clientX, event.clientY);
});

enterBtn.addEventListener("click", (e) => {
  triggerButtonAnim(enterBtn, e.clientX, e.clientY);
  tryPassword();
});

passInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") tryPassword();
});

yesBtn.addEventListener("click", (e) => {
  triggerButtonAnim(yesBtn, e.clientX, e.clientY);
  revealLove();
});

noBtn.addEventListener("click", (e) => {
  triggerButtonAnim(noBtn, e.clientX, e.clientY);
  moveNoButton();
});

playBtn.addEventListener("click", (e) => {
  triggerButtonAnim(playBtn, e.clientX, e.clientY);
  song.play().catch(() => {});
});

pauseBtn.addEventListener("click", (e) => {
  triggerButtonAnim(pauseBtn, e.clientX, e.clientY);
  song.pause();
});

restartBtn.addEventListener("click", (e) => {
  triggerButtonAnim(restartBtn, e.clientX, e.clientY);
  song.currentTime = 0;
  song.play().catch(() => {});
});

letterBtn.addEventListener("click", (e) => {
  triggerButtonAnim(letterBtn, e.clientX, e.clientY);
  openModal();
});

secretLetterChip.addEventListener("click", (e) => {
  triggerButtonAnim(secretLetterChip, e.clientX, e.clientY);
  openModal();
});

closeModal.addEventListener("click", (e) => {
  triggerButtonAnim(closeModal, e.clientX, e.clientY);
  closeLetterModal();
});

modalOverlay.addEventListener("click", closeLetterModal);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeLetterModal();
  if (/^[a-zA-Z]$/.test(event.key)) handleSecretKeys(event.key);
});

song.addEventListener("timeupdate", updateLyrics);

prevSlide.addEventListener("click", (e) => {
  triggerButtonAnim(prevSlide, e.clientX, e.clientY);
  goToSlide(currentSlide - 1);
  restartAutoSlide();
});

nextSlide.addEventListener("click", (e) => {
  triggerButtonAnim(nextSlide, e.clientX, e.clientY);
  goToSlide(currentSlide + 1);
  restartAutoSlide();
});

carouselWrap.addEventListener("touchstart", handleTouchStart, { passive: true });
carouselWrap.addEventListener("touchend",   handleTouchEnd,   { passive: true });

surpriseBoxes.forEach((box) => {
  box.addEventListener("click", (e) => {
    openSurprise(box, e.clientX, e.clientY);
  });
});

newReasonBtn.addEventListener("click", (e) => {
  triggerButtonAnim(newReasonBtn, e.clientX, e.clientY);
  randomReason();
});

gameStartBtn.addEventListener("click", (e) => {
  triggerButtonAnim(gameStartBtn, e.clientX, e.clientY);
  startGame();
});

/* ─── INIT ────────────────────────────────── */
window.addEventListener("load", () => {
  runLoader();
});

createAmbientBackground();
buildDots();
startAutoSlide();
setupFlipCards();
randomReason();
attachButtonAnimations();
