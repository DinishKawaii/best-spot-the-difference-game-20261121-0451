// Titik masuk game: merangkai keadaan, gambar, suara, dan masukan; menjalankan
// loop animasi; mengurus layar menu / jeda / selesai; dan mode ?shot= untuk
// mengambil screenshot (start, play, play2, end).

import { LEVEL_TIME_SECONDS } from './config.js';
import { GameState, SCREENS } from './state.js';
import { Renderer } from './render.js';
import { SoundBoard } from './audio.js';
import { panelHit, findDiffAt, canvasPoint } from './input.js';
import { formatTime } from './util.js';

const canvas = document.getElementById('game');
const overlay = document.getElementById('overlay');
const overlayCard = document.getElementById('overlayCard');
const statusEl = document.getElementById('status');
const levelPill = document.getElementById('levelPill');
const foundPill = document.getElementById('foundPill');
const timePill = document.getElementById('timePill');
const scorePill = document.getElementById('scorePill');
const hintBtn = document.getElementById('hintBtn');
const muteBtn = document.getElementById('muteBtn');
const pauseBtn = document.getElementById('pauseBtn');

const state = new GameState();
const renderer = new Renderer(canvas);
const sound = new SoundBoard();
let lastFrame = performance.now();
let pendingLevelClearAt = 0;

function announce(text) {
  statusEl.textContent = text;
}

function showOverlay(html) {
  overlayCard.innerHTML = html;
  overlay.classList.add('show');
}

function hideOverlay() {
  overlay.classList.remove('show');
  overlayCard.innerHTML = '';
}

function showMenu() {
  state.screen = SCREENS.MENU;
  showOverlay(
    '<h2>🔍 CARI BEDANYA</h2>' +
    '<p>Tiga gambar, dua sisi, <b>7 perbedaan</b> di tiap level. Klik perbedaan ' +
    'di gambar kiri <b>atau</b> kanan — lingkaran hijau menandai temuanmu di kedua gambar.</p>' +
    '<p class="big">Level 1: Taman Pagi &nbsp;•&nbsp; Level 2: Pantai Senja &nbsp;•&nbsp; Level 3: Kamar Mochi</p>' +
    '<p>Skor terbaikmu: <b>' + state.best + '</b>. Waktu tiap level 2 menit 30 detik. ' +
    'Klik salah mengurangi waktu 5 detik.</p>' +
    '<button type="button" data-action="start">▶ MULAI MAIN</button>' +
    '<p>Atau tekan <b>Enter</b>. Petunjuk: <b>H</b> &nbsp;•&nbsp; Jeda: <b>P</b> &nbsp;•&nbsp; Suara: <b>M</b></p>'
  );
  announce('Menu utama Cari Bedanya. Tekan Enter untuk mulai.');
}

function showPaused() {
  showOverlay(
    '<h2>⏸ JEDA</h2>' +
    '<p>Istirahat sebentar, gambarnya tidak ke mana-mana.</p>' +
    '<button type="button" data-action="resume">▶ LANJUTKAN</button> ' +
    '<button type="button" data-action="restart-level" class="secondary">↻ Ulang level</button>'
  );
}

function showLevelDone() {
  const last = state.levelIndex === 2;
  showOverlay(
    '<h2>🎉 LEVEL SELESAI!</h2>' +
    '<p class="big">Semua ' + state.diffs.length + ' perbedaan ketemu!</p>' +
    '<p>Bonus waktu: <b>+' + state.levelBonus + '</b> &nbsp;•&nbsp; Skor: <b>' + state.score + '</b></p>' +
    (last
      ? '<button type="button" data-action="finish">🏆 LIHAT HASIL AKHIR</button>'
      : '<button type="button" data-action="next">➡ LEVEL BERIKUTNYA</button>') +
    '<p>Atau tekan <b>Enter</b>.</p>'
  );
  announce('Level selesai. Semua perbedaan ditemukan.');
}

function showGameDone() {
  showOverlay(
    '<h2>🏆 KAMU MENANG!</h2>' +
    '<p class="big">21 perbedaan ditemukan di 3 level!</p>' +
    '<p>Skor akhir: <b>' + state.score + '</b> &nbsp;•&nbsp; Skor terbaik: <b>' + state.best + '</b></p>' +
    '<p>Terima kasih sudah main Cari Bedanya — Taman, Pantai &amp; Kamar Mochi.</p>' +
    '<button type="button" data-action="start">↻ MAIN LAGI</button>'
  );
  announce('Permainan selesai. Skor akhir ' + state.score + '.');
}

function showTimeUp() {
  showOverlay(
    '<h2>⏱ WAKTU HABIS</h2>' +
    '<p>Kamu menemukan <b>' + state.foundCount + ' / ' + state.diffs.length + '</b> perbedaan di level ini.</p>' +
    '<p>Yang belum ketemu: ' + state.diffs.filter((d) => !state.found.has(d.id)).map((d) => d.name).join(', ') + '.</p>' +
    '<button type="button" data-action="retry">↻ COBA LAGI</button>'
  );
  announce('Waktu habis. Coba lagi level ini.');
}

function refreshHud() {
  levelPill.textContent = 'Level ' + (state.levelIndex + 1) + ' / 3 · ' + state.level.name;
  foundPill.textContent = 'Ditemukan ' + state.foundCount + ' / ' + state.diffs.length +
    ' · Sisa ' + state.remaining;
  foundPill.classList.toggle('good', state.foundCount > 0);
  timePill.textContent = '⏱ ' + formatTime(state.timeLeft);
  timePill.classList.toggle('warn', state.timeLeft <= 30 && state.screen === SCREENS.PLAYING);
  scorePill.textContent = 'Skor ' + state.score;
  hintBtn.textContent = '💡 Petunjuk (H) · ' + state.hintsLeft;
  hintBtn.disabled = state.hintsLeft <= 0 || state.screen !== SCREENS.PLAYING;
  pauseBtn.disabled = state.screen !== SCREENS.PLAYING && state.screen !== SCREENS.PAUSED;
  muteBtn.textContent = sound.muted ? '🔇 Suara mati' : '🔊 Suara';
}

function startGame() {
  sound.ensure();
  sound.click();
  state.startGame();
  hideOverlay();
  announce('Level 1: Taman Pagi. Cari 7 perbedaan.');
}

function useHint() {
  if (state.screen !== SCREENS.PLAYING) return;
  const target = state.useHint(performance.now());
  if (!target) return;
  sound.hint();
  announce('Petunjuk: cari di sekitar ' + target.name + '.');
  refreshHud();
}

function togglePause() {
  if (state.screen === SCREENS.PLAYING) {
    state.screen = SCREENS.PAUSED;
    showPaused();
    announce('Jeda.');
  } else if (state.screen === SCREENS.PAUSED) {
    state.screen = SCREENS.PLAYING;
    hideOverlay();
    announce('Lanjut main.');
  }
  refreshHud();
}

function toggleMute() {
  sound.ensure();
  sound.muted = !sound.muted;
  if (!sound.muted) sound.click();
  refreshHud();
}

function onCanvasClick(event) {
  if (state.screen !== SCREENS.PLAYING) return;
  sound.ensure();
  const point = canvasPoint(canvas, event);
  const hit = panelHit(point.x, point.y);
  if (!hit) return;
  const diff = findDiffAt(state.diffs, state.found, hit.x, hit.y);
  if (diff) {
    const gained = state.markFound(diff.id);
    sound.found();
    announce('Ketemu! ' + diff.name + '. +' + gained + ' poin. Sisa ' + state.remaining + '.');
    if (state.levelComplete) {
      pendingLevelClearAt = performance.now() + 900;
    }
  } else {
    state.markWrong();
    state.wrongFlash = { x: point.x, y: point.y, at: performance.now() };
    sound.wrong();
    announce('Bukan di situ. Waktu berkurang 5 detik.');
  }
  refreshHud();
}

function onOverlayClick(event) {
  const action = event.target && event.target.dataset ? event.target.dataset.action : null;
  if (!action) return;
  if (action === 'start') startGame();
  else if (action === 'resume') togglePause();
  else if (action === 'restart-level' || action === 'retry') {
    sound.click();
    state.startLevel();
    hideOverlay();
    announce('Level diulang. Cari 7 perbedaan.');
  } else if (action === 'next') {
    sound.click();
    state.nextLevel();
    hideOverlay();
    announce('Level ' + (state.levelIndex + 1) + ': ' + state.level.name + '.');
  } else if (action === 'finish') {
    state.finishGame();
    showGameDone();
    sound.gameClear();
  }
  refreshHud();
}

function onKeyDown(event) {
  const key = event.key.toLowerCase();
  if (key === 'enter') {
    if (state.screen === SCREENS.MENU) startGame();
    else if (state.screen === SCREENS.LEVEL_DONE) {
      if (state.levelIndex === 2) { state.finishGame(); showGameDone(); sound.gameClear(); }
      else { state.nextLevel(); hideOverlay(); }
    } else if (state.screen === SCREENS.TIME_UP) { state.startLevel(); hideOverlay(); }
    else if (state.screen === SCREENS.GAME_DONE) startGame();
    refreshHud();
  } else if (key === 'h') useHint();
  else if (key === 'p') togglePause();
  else if (key === 'm') toggleMute();
  else if (key === 'r' && (state.screen === SCREENS.PLAYING || state.screen === SCREENS.PAUSED)) {
    state.startLevel();
    hideOverlay();
    announce('Level diulang.');
    refreshHud();
  }
}

function frame(now) {
  const dt = Math.min(0.1, (now - lastFrame) / 1000);
  lastFrame = now;
  state.tick(dt);
  if (state.screen === SCREENS.TIME_UP && overlayCard.innerHTML === '') showTimeUp();
  if (pendingLevelClearAt && now >= pendingLevelClearAt) {
    pendingLevelClearAt = 0;
    state.finishLevel();
    showLevelDone();
    sound.levelClear();
  }
  renderer.draw(state, now);
  refreshHud();
  requestAnimationFrame(frame);
}

// Mode screenshot (?shot=...): dipakai untuk mengambil gambar contoh game.
function applyShotMode() {
  const shot = new URLSearchParams(window.location.search).get('shot');
  if (!shot) return;
  if (shot === 'start') {
    showMenu();
  } else if (shot === 'play') {
    state.startGame();
    state.diffs.slice(0, 3).forEach((d) => state.markFound(d.id));
    state.timeLeft = 98;
    state.score = 320;
    hideOverlay();
  } else if (shot === 'play2') {
    state.startGame();
    state.nextLevel();
    state.diffs.slice(0, 2).forEach((d) => state.markFound(d.id));
    state.timeLeft = 110;
    state.score = 740;
    hideOverlay();
  } else if (shot === 'play3') {
    state.startGame();
    state.nextLevel();
    state.nextLevel();
    state.diffs.slice(0, 2).forEach((d) => state.markFound(d.id));
    state.timeLeft = 121;
    state.score = 1520;
    hideOverlay();
  } else if (shot === 'end') {
    state.startGame();
    state.diffs.forEach((d) => state.markFound(d.id));
    state.timeLeft = 64;
    state.finishLevel();
    showLevelDone();
  }
}

canvas.addEventListener('click', onCanvasClick);
overlay.addEventListener('click', onOverlayClick);
hintBtn.addEventListener('click', useHint);
muteBtn.addEventListener('click', toggleMute);
pauseBtn.addEventListener('click', togglePause);
document.addEventListener('keydown', onKeyDown);
document.addEventListener('visibilitychange', () => {
  if (document.hidden && state.screen === SCREENS.PLAYING) togglePause();
});

applyShotMode();
if (!new URLSearchParams(window.location.search).get('shot')) showMenu();
refreshHud();
requestAnimationFrame(frame);
