// Menggambar ke layar: bingkai dua panel, judul level, penanda perbedaan yang
// ditemukan, petunjuk yang berdenyut, dan kilatan klik yang salah.
// Panel kiri digambar tanpa perbedaan, panel kanan dengan ketujuh perbedaan.

import {
  CANVAS_W, CANVAS_H, PANEL_W, PANEL_H, PANEL_X_LEFT, PANEL_X_RIGHT, PANEL_Y,
} from './config.js';
import { drawScene } from './scenes.js';
import { circlePath, roundedRectPath } from './util.js';

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  }

  draw(state, now) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    // Latar belakang panggung
    const bg = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
    bg.addColorStop(0, '#22355a');
    bg.addColorStop(1, '#16233d');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Judul level di atas panel
    ctx.fillStyle = '#ffd94d';
    ctx.font = 'bold 26px "Trebuchet MS", Verdana, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('Level ' + (state.levelIndex + 1) + ': ' + state.level.name, 24, 42);
    ctx.fillStyle = '#cfe6ff';
    ctx.font = '17px "Trebuchet MS", Verdana, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(state.level.blurb, CANVAS_W - 24, 42);
    ctx.textAlign = 'left';

    this.drawPanelFrame(ctx, PANEL_X_LEFT, 'Gambar A');
    this.drawPanelFrame(ctx, PANEL_X_RIGHT, 'Gambar B');

    const rightDiffs = new Set(state.diffs.map((d) => d.id));
    drawScene(ctx, PANEL_X_LEFT, PANEL_Y, state.level.id, new Set());
    drawScene(ctx, PANEL_X_RIGHT, PANEL_Y, state.level.id, rightDiffs);

    this.drawFoundMarkers(ctx, state);
    this.drawHint(ctx, state, now);
    this.drawWrongFlash(ctx, state, now);

    // Penghitung sisa di bawah panel
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px "Trebuchet MS", Verdana, sans-serif';
    ctx.textAlign = 'center';
    const foundText = state.foundCount + ' / ' + state.diffs.length + ' ditemukan  •  ' +
      state.remaining + ' lagi yang belum ketemu';
    ctx.fillText(foundText, CANVAS_W / 2, PANEL_Y + PANEL_H + 36);
    ctx.textAlign = 'left';
  }

  drawPanelFrame(ctx, x, label) {
    ctx.fillStyle = '#0f1a2e';
    roundedRectPath(ctx, x - 8, PANEL_Y - 8, PANEL_W + 16, PANEL_H + 16, 14);
    ctx.fill();
    ctx.strokeStyle = '#3d5a80';
    ctx.lineWidth = 3;
    roundedRectPath(ctx, x - 8, PANEL_Y - 8, PANEL_W + 16, PANEL_H + 16, 14);
    ctx.stroke();
    ctx.fillStyle = '#9db8d9';
    ctx.font = 'bold 15px "Trebuchet MS", Verdana, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(label, x, PANEL_Y - 22);
  }

  drawFoundMarkers(ctx, state) {
    for (const diff of state.diffs) {
      if (!state.found.has(diff.id)) continue;
      for (const px of [PANEL_X_LEFT, PANEL_X_RIGHT]) {
        const cx = px + diff.x;
        const cy = PANEL_Y + diff.y;
        ctx.strokeStyle = '#2f9e44';
        ctx.lineWidth = 5;
        circlePath(ctx, cx, cy, diff.r + 4);
        ctx.stroke();
        ctx.strokeStyle = 'rgba(255,255,255,0.9)';
        ctx.lineWidth = 2;
        circlePath(ctx, cx, cy, diff.r + 9);
        ctx.stroke();
        // Tanda centang di tengah lingkaran
        ctx.strokeStyle = '#2f9e44';
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(cx - 9, cy);
        ctx.lineTo(cx - 2, cy + 7);
        ctx.lineTo(cx + 10, cy - 7);
        ctx.stroke();
      }
    }
  }

  drawHint(ctx, state, now) {
    if (!state.hintTarget || now > state.hintUntil) return;
    const pulse = 1 + 0.18 * Math.sin(now / 130);
    const diff = state.hintTarget;
    for (const px of [PANEL_X_LEFT, PANEL_X_RIGHT]) {
      const cx = px + diff.x;
      const cy = PANEL_Y + diff.y;
      ctx.strokeStyle = '#ffd94d';
      ctx.lineWidth = 5;
      circlePath(ctx, cx, cy, (diff.r + 8) * pulse);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(255,217,77,0.4)';
      ctx.lineWidth = 10;
      circlePath(ctx, cx, cy, (diff.r + 16) * pulse);
      ctx.stroke();
    }
  }

  drawWrongFlash(ctx, state, now) {
    const flash = state.wrongFlash;
    if (!flash || now - flash.at > 450) return;
    const alpha = 1 - (now - flash.at) / 450;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = '#ff5d5d';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    const { x, y } = flash;
    ctx.beginPath();
    ctx.moveTo(x - 12, y - 12); ctx.lineTo(x + 12, y + 12);
    ctx.moveTo(x + 12, y - 12); ctx.lineTo(x - 12, y + 12);
    ctx.stroke();
    ctx.restore();
  }
}
