// Keadaan permainan: level mana, apa yang sudah ditemukan, skor, waktu, petunjuk.
// File ini tidak menggambar apa-apa; ia hanya menyimpan dan mengubah keadaan.

import {
  LEVELS, LEVEL_TIME_SECONDS, HINTS_PER_LEVEL,
  WRONG_CLICK_PENALTY_SECONDS, POINTS_PER_FIND, POINTS_PER_COMBO,
  LEVEL_CLEAR_TIME_BONUS_PER_SECOND,
} from './config.js';
import { diffsFor } from './differences.js';

export const SCREENS = {
  MENU: 'menu',
  PLAYING: 'playing',
  PAUSED: 'paused',
  LEVEL_DONE: 'levelDone',
  GAME_DONE: 'gameDone',
  TIME_UP: 'timeUp',
};

export class GameState {
  constructor() {
    this.screen = SCREENS.MENU;
    this.levelIndex = 0;
    this.found = new Set();
    this.score = 0;
    this.combo = 0;
    this.best = 0;
    this.timeLeft = LEVEL_TIME_SECONDS;
    this.hintsLeft = HINTS_PER_LEVEL;
    this.hintTarget = null;
    this.hintUntil = 0;
    this.wrongFlash = null;
    this.levelBonus = 0;
    this.totalFound = 0;
    try {
      this.best = Number(localStorage.getItem('cari-bedanya-best') || 0) || 0;
    } catch {
      this.best = 0;
    }
  }

  get level() { return LEVELS[this.levelIndex]; }
  get diffs() { return diffsFor(this.level.id); }
  get foundCount() { return this.found.size; }
  get remaining() { return this.diffs.length - this.found.size; }
  get levelComplete() { return this.found.size >= this.diffs.length; }

  startGame() {
    this.levelIndex = 0;
    this.score = 0;
    this.totalFound = 0;
    this.startLevel();
  }

  startLevel() {
    this.found = new Set();
    this.combo = 0;
    this.timeLeft = LEVEL_TIME_SECONDS;
    this.hintsLeft = HINTS_PER_LEVEL;
    this.hintTarget = null;
    this.hintUntil = 0;
    this.wrongFlash = null;
    this.levelBonus = 0;
    this.screen = SCREENS.PLAYING;
  }

  markFound(diffId) {
    if (this.found.has(diffId)) return 0;
    this.found.add(diffId);
    this.combo += 1;
    const gained = POINTS_PER_FIND + (this.combo - 1) * POINTS_PER_COMBO;
    this.score += gained;
    this.totalFound += 1;
    return gained;
  }

  markWrong() {
    this.combo = 0;
    this.timeLeft = Math.max(0, this.timeLeft - WRONG_CLICK_PENALTY_SECONDS);
  }

  useHint(now) {
    if (this.hintsLeft <= 0 || this.screen !== SCREENS.PLAYING) return null;
    const unfound = this.diffs.filter((d) => !this.found.has(d.id));
    if (unfound.length === 0) return null;
    this.hintsLeft -= 1;
    this.hintTarget = unfound[0];
    this.hintUntil = now + 2500;
    return this.hintTarget;
  }

  finishLevel() {
    this.levelBonus = Math.round(this.timeLeft) * LEVEL_CLEAR_TIME_BONUS_PER_SECOND;
    this.score += this.levelBonus;
    this.screen = SCREENS.LEVEL_DONE;
  }

  finishGame() {
    this.screen = SCREENS.GAME_DONE;
    if (this.score > this.best) {
      this.best = this.score;
      try { localStorage.setItem('cari-bedanya-best', String(this.best)); } catch { /* abaikan */ }
    }
  }

  nextLevel() {
    if (this.levelIndex + 1 < LEVELS.length) {
      this.levelIndex += 1;
      this.startLevel();
      return true;
    }
    return false;
  }

  tick(dtSeconds) {
    if (this.screen !== SCREENS.PLAYING) return;
    this.timeLeft -= dtSeconds;
    if (this.timeLeft <= 0) {
      this.timeLeft = 0;
      this.screen = SCREENS.TIME_UP;
    }
  }
}
