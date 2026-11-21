// Masukan pemain: klik mouse (atau sentuhan) pada salah satu panel, dan tombol
// keyboard. Klik dipetakan ke koordinat panel, lalu dicocokkan dengan perbedaan
// yang belum ditemukan. Klik yang tepat menandai kedua panel sekaligus.

import { PANEL_W, PANEL_H, PANEL_X_LEFT, PANEL_X_RIGHT, PANEL_Y } from './config.js';
import { distance } from './util.js';

export function panelHit(canvasX, canvasY) {
  // Mengembalikan { panel: 'kiri'|'kanan', x, y } dalam koordinat panel, atau null.
  const scaleX = canvasX;
  const scaleY = canvasY;
  if (scaleY < PANEL_Y || scaleY > PANEL_Y + PANEL_H) return null;
  const y = scaleY - PANEL_Y;
  if (scaleX >= PANEL_X_LEFT && scaleX <= PANEL_X_LEFT + PANEL_W) {
    return { panel: 'kiri', x: scaleX - PANEL_X_LEFT, y };
  }
  if (scaleX >= PANEL_X_RIGHT && scaleX <= PANEL_X_RIGHT + PANEL_W) {
    return { panel: 'kanan', x: scaleX - PANEL_X_RIGHT, y };
  }
  return null;
}

export function findDiffAt(diffs, found, x, y) {
  let best = null;
  let bestDist = Infinity;
  for (const diff of diffs) {
    if (found.has(diff.id)) continue;
    const d = distance(x, y, diff.x, diff.y);
    if (d <= diff.r + 14 && d < bestDist) {
      best = diff;
      bestDist = d;
    }
  }
  return best;
}

export function canvasPoint(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) * (canvas.width / rect.width),
    y: (event.clientY - rect.top) * (canvas.height / rect.height),
  };
}
