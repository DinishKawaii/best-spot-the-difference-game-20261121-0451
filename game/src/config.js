// Pengaturan dasar game Cari Bedanya: ukuran panel, waktu, skor, dan daftar level.
// Semua angka di sini dipakai bersama oleh state, render, dan input.

export const PANEL_W = 560;
export const PANEL_H = 430;
export const PANEL_GAP = 40;
export const PANEL_X_LEFT = 20;
export const PANEL_X_RIGHT = PANEL_X_LEFT + PANEL_W + PANEL_GAP;
export const PANEL_Y = 80;
export const CANVAS_W = 1240;
export const CANVAS_H = 560;

export const LEVEL_TIME_SECONDS = 150;
export const HINTS_PER_LEVEL = 3;
export const WRONG_CLICK_PENALTY_SECONDS = 5;
export const POINTS_PER_FIND = 100;
export const POINTS_PER_COMBO = 10;
export const LEVEL_CLEAR_TIME_BONUS_PER_SECOND = 2;

export const LEVELS = [
  { id: 'taman', name: 'Taman Pagi', diffs: 7, blurb: 'Pagi yang cerah di taman. Ada 7 perbedaan tersembunyi!' },
  { id: 'pantai', name: 'Pantai Senja', diffs: 7, blurb: 'Senja di pantai. Ombak tenang, tapi ada 7 yang berubah!' },
  { id: 'kamar', name: 'Kamar Mochi', diffs: 7, blurb: 'Mochi si kucing sedang tidur. Ada 7 perbedaan di kamarnya!' },
];

export const STORAGE_KEY = 'cari-bedanya-best';
