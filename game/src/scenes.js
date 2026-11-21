// Pelukis adegan: setiap level digambar dari nol dengan primitif canvas 2D
// (gradasi, lingkaran, persegi, segitiga) — tanpa gambar dari internet.
// drawScene(ctx, ox, oy, levelId, applied) menggambar satu panel di posisi (ox, oy).
// `applied` adalah Set berisi id perbedaan yang AKTIF di panel itu: panel kiri
// selalu digambar tanpa perbedaan, panel kanan dengan ketujuh perbedaan aktif.

import { circlePath, ellipsePath, roundedRectPath } from './util.js';

function sky(ctx, top, bottom) {
  const g = ctx.createLinearGradient(0, 0, 0, 430);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 560, 430);
}

function cloud(ctx, x, y, s) {
  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  circlePath(ctx, x, y, 20 * s); ctx.fill();
  circlePath(ctx, x + 22 * s, y + 4 * s, 15 * s); ctx.fill();
  circlePath(ctx, x - 22 * s, y + 5 * s, 14 * s); ctx.fill();
  ctx.fillRect(x - 30 * s, y, 60 * s, 14 * s);
}

function sunFace(ctx, x, y, r, withGlasses) {
  ctx.fillStyle = '#ffd94d';
  ctx.strokeStyle = '#f5a623';
  ctx.lineWidth = 4;
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(a) * (r + 6), y + Math.sin(a) * (r + 6));
    ctx.lineTo(x + Math.cos(a) * (r + 18), y + Math.sin(a) * (r + 18));
    ctx.stroke();
  }
  circlePath(ctx, x, y, r); ctx.fill(); ctx.stroke();
  if (withGlasses) {
    ctx.fillStyle = '#222';
    roundedRectPath(ctx, x - 24, y - 8, 20, 13, 5); ctx.fill();
    roundedRectPath(ctx, x + 4, y - 8, 20, 13, 5); ctx.fill();
    ctx.strokeStyle = '#222'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(x - 4, y - 2); ctx.lineTo(x + 4, y - 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x - 24, y - 2); ctx.lineTo(x - 30, y - 6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x + 24, y - 2); ctx.lineTo(x + 30, y - 6); ctx.stroke();
    ctx.strokeStyle = '#7a4d00'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(x, y + 14, 8, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
  } else {
    ctx.fillStyle = '#7a4d00';
    circlePath(ctx, x - 11, y - 6, 3.5); ctx.fill();
    circlePath(ctx, x + 11, y - 6, 3.5); ctx.fill();
    ctx.strokeStyle = '#7a4d00'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(x, y + 8, 11, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
  }
}

function bird(ctx, x, y, color) {
  ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x - 14, y); ctx.quadraticCurveTo(x - 6, y - 10, x, y); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 6, y - 10, x + 14, y); ctx.stroke();
}

function flower(ctx, x, y, petal, center) {
  ctx.fillStyle = petal;
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    circlePath(ctx, x + Math.cos(a) * 9, y + Math.sin(a) * 9, 7); ctx.fill();
  }
  ctx.fillStyle = center;
  circlePath(ctx, x, y, 6); ctx.fill();
  ctx.strokeStyle = '#2e7d32'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(x, y + 10); ctx.lineTo(x, y + 26); ctx.stroke();
}

function butterfly(ctx, x, y) {
  ctx.fillStyle = '#b388ff';
  ellipsePath(ctx, x - 9, y - 6, 10, 13); ctx.fill();
  ellipsePath(ctx, x + 9, y - 6, 10, 13); ctx.fill();
  ctx.fillStyle = '#7c4dff';
  ellipsePath(ctx, x - 8, y + 10, 7, 9); ctx.fill();
  ellipsePath(ctx, x + 8, y + 10, 7, 9); ctx.fill();
  ctx.fillStyle = '#333';
  ellipsePath(ctx, x, y, 3, 10); ctx.fill();
}

function drawTaman(ctx, applied) {
  sky(ctx, '#8ec9ee', '#e8f7ff');
  sunFace(ctx, 82, 66, 32, applied.has('kacamata-matahari'));
  cloud(ctx, 150, 58, 1);
  cloud(ctx, 320, 40, 0.85);
  cloud(ctx, 428, 96, 0.7);
  if (applied.has('awan-tambah')) cloud(ctx, 486, 52, 0.8);
  bird(ctx, 438, 74, applied.has('burung-warna') ? '#e8590c' : '#1c6dd9');
  bird(ctx, 250, 60, '#1c6dd9');

  // Bukit dan tanah
  ctx.fillStyle = '#7cc46a';
  ellipsePath(ctx, 140, 470, 260, 90); ctx.fill();
  ctx.fillStyle = '#5da84f';
  ellipsePath(ctx, 460, 480, 280, 100); ctx.fill();

  // Rumah
  ctx.fillStyle = '#fff3e0';
  ctx.fillRect(330, 210, 140, 120);
  ctx.fillStyle = '#e2574c';
  ctx.beginPath(); ctx.moveTo(318, 212); ctx.lineTo(400, 150); ctx.lineTo(482, 212); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#8d5a2b';
  ctx.fillRect(388, 272, 30, 58);
  ctx.fillStyle = '#ffd94d';
  ctx.fillRect(344, 240, 26, 26);
  ctx.strokeStyle = '#8d5a2b'; ctx.lineWidth = 2;
  ctx.strokeRect(344, 240, 26, 26);
  if (applied.has('jendela-bulat')) {
    ctx.fillStyle = '#bfe8ff';
    circlePath(ctx, 405, 253, 14); ctx.fill();
    ctx.strokeStyle = '#8d5a2b'; ctx.stroke();
  } else {
    ctx.fillStyle = '#bfe8ff';
    ctx.fillRect(392, 240, 26, 26);
    ctx.strokeRect(392, 240, 26, 26);
  }
  ctx.strokeStyle = '#8d5a2b';
  ctx.beginPath(); ctx.moveTo(405, 240); ctx.lineTo(405, 266); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(392, 253); ctx.lineTo(418, 253); ctx.stroke();

  // Pohon
  ctx.fillStyle = '#7a4a21';
  ctx.fillRect(104, 220, 18, 110);
  ctx.fillStyle = '#3e9b4f';
  circlePath(ctx, 80, 190, 42); ctx.fill();
  circlePath(ctx, 140, 185, 46); ctx.fill();
  circlePath(ctx, 112, 150, 44); ctx.fill();
  ctx.fillStyle = '#e63946';
  circlePath(ctx, 92, 196, 7); ctx.fill();
  circlePath(ctx, 138, 202, 7); ctx.fill();
  circlePath(ctx, 110, 168, 7); ctx.fill();
  if (applied.has('apel-tambah')) { circlePath(ctx, 118, 208, 7); ctx.fill(); }

  // Pagar putih
  ctx.fillStyle = '#ffffff';
  for (let x = 30; x <= 530; x += 26) {
    ctx.fillRect(x, 330, 12, 34);
    ctx.beginPath(); ctx.moveTo(x, 330); ctx.lineTo(x + 6, 320); ctx.lineTo(x + 12, 330); ctx.closePath(); ctx.fill();
  }
  ctx.fillRect(20, 342, 520, 5);

  // Kolam dan bebek
  ctx.fillStyle = '#4db2e8';
  ellipsePath(ctx, 472, 392, 62, 20); ctx.fill();
  ctx.fillStyle = '#fff';
  ellipsePath(ctx, 462, 388, 14, 9); ctx.fill();
  circlePath(ctx, 474, 380, 8); ctx.fill();
  ctx.fillStyle = '#ff9f1c';
  ctx.beginPath(); ctx.moveTo(481, 379); ctx.lineTo(490, 382); ctx.lineTo(481, 385); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#222';
  circlePath(ctx, 476, 378, 1.8); ctx.fill();

  // Bunga-bunga
  const petals = ['#ff6b9d', '#ffd94d', '#c084fc', '#ff8a5c', '#7dd3fc', '#f472b6'];
  const flowerX = [60, 140, 220, 300, 380, 460];
  flowerX.forEach((x, i) => {
    if (applied.has('bunga-hilang') && x === 300) return;
    flower(ctx, x, 388, petals[i % petals.length], '#fff7cc');
  });

  if (!applied.has('kupu-hilang')) butterfly(ctx, 196, 296);
}

function starfish(ctx, x, y, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + (i / 5) * Math.PI * 2;
    const a2 = a + Math.PI / 5;
    ctx.lineTo(x + Math.cos(a) * 20, y + Math.sin(a) * 20);
    ctx.lineTo(x + Math.cos(a2) * 8, y + Math.sin(a2) * 8);
  }
  ctx.closePath(); ctx.fill();
}

function seagull(ctx, x, y) {
  ctx.strokeStyle = '#334155'; ctx.lineWidth = 3; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x - 12, y); ctx.quadraticCurveTo(x - 5, y - 9, x, y); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 5, y - 9, x + 12, y); ctx.stroke();
}

function drawPantai(ctx, applied) {
  sky(ctx, '#ffb347', '#ff8fa3');
  ctx.fillStyle = '#ffdf6b';
  circlePath(ctx, 92, 92, 30); ctx.fill();
  ctx.fillStyle = 'rgba(255,223,107,0.35)';
  circlePath(ctx, 92, 92, 44); ctx.fill();
  seagull(ctx, 200, 70);
  seagull(ctx, 262, 92);
  if (applied.has('burung-tambah')) seagull(ctx, 306, 66);

  // Laut
  const sea = ctx.createLinearGradient(0, 180, 0, 300);
  sea.addColorStop(0, '#2aa5c4'); sea.addColorStop(1, '#177a9e');
  ctx.fillStyle = sea;
  ctx.fillRect(0, 180, 560, 120);
  ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 3;
  [210, 240, 272].forEach((y, i) => {
    ctx.beginPath();
    for (let x = 0; x <= 560; x += 20) ctx.lineTo(x, y + Math.sin((x + i * 40) / 40) * 4);
    ctx.stroke();
  });

  // Perahu
  ctx.fillStyle = '#8d5a2b';
  ctx.beginPath(); ctx.moveTo(448, 196); ctx.lineTo(516, 196); ctx.lineTo(500, 212); ctx.lineTo(462, 212); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#5d3a17'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(482, 196); ctx.lineTo(482, 150); ctx.stroke();
  ctx.fillStyle = applied.has('layar-perahu') ? '#ffd94d' : '#ffffff';
  ctx.beginPath(); ctx.moveTo(482, 152); ctx.lineTo(482, 192); ctx.lineTo(508, 192); ctx.closePath(); ctx.fill();

  // Pasir
  ctx.fillStyle = '#f7dc9a';
  ctx.fillRect(0, 300, 560, 130);
  ctx.fillStyle = '#efd48a';
  ellipsePath(ctx, 120, 420, 130, 16); ctx.fill();
  ellipsePath(ctx, 430, 415, 150, 18); ctx.fill();

  // Pohon palem
  ctx.strokeStyle = '#8d5a2b'; ctx.lineWidth = 12; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(96, 300); ctx.quadraticCurveTo(84, 220, 108, 150); ctx.stroke();
  ctx.strokeStyle = '#2f9e44'; ctx.lineWidth = 7;
  [[108, 148, 60, 120], [108, 148, 156, 118], [108, 148, 76, 104], [108, 148, 140, 100]].forEach(([x, y, tx, ty]) => {
    ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo((x + tx) / 2, y - 18, tx, ty); ctx.stroke();
  });
  ctx.fillStyle = '#6b4f1d';
  circlePath(ctx, 96, 156, 8); ctx.fill();
  if (!applied.has('kelapa-hilang')) { circlePath(ctx, 108, 148, 8); ctx.fill(); }

  // Payung pantai
  ctx.strokeStyle = '#8d5a2b'; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(386, 300); ctx.lineTo(386, 170); ctx.stroke();
  const stripe = applied.has('payung-warna') ? '#2ec4b6' : '#e63946';
  ctx.fillStyle = stripe;
  ctx.beginPath(); ctx.moveTo(386, 168); ctx.arc(386, 168, 62, Math.PI, 0); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.moveTo(386, 168); ctx.arc(386, 168, 62, Math.PI * 1.25, Math.PI * 1.5); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(386, 168); ctx.arc(386, 168, 62, Math.PI * 1.5, Math.PI * 1.75); ctx.closePath(); ctx.fill();

  // Istana pasir
  ctx.fillStyle = '#e8c97a';
  ctx.fillRect(222, 320, 60, 46);
  ctx.fillRect(232, 300, 40, 22);
  ctx.strokeStyle = '#8d5a2b'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(252, 300); ctx.lineTo(252, 272); ctx.stroke();
  ctx.fillStyle = applied.has('bendera-warna') ? '#2f9e44' : '#e63946';
  ctx.beginPath(); ctx.moveTo(252, 272); ctx.lineTo(276, 278); ctx.lineTo(252, 286); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#d9b45f';
  circlePath(ctx, 232, 318, 6); ctx.fill();
  circlePath(ctx, 272, 318, 6); ctx.fill();

  // Kepiting
  ctx.fillStyle = '#ff6b4a';
  ellipsePath(ctx, 330, 392, 18, 13); ctx.fill();
  ctx.fillStyle = '#222';
  circlePath(ctx, 324, 388, 2); ctx.fill();
  circlePath(ctx, 336, 388, 2); ctx.fill();
  ctx.strokeStyle = '#ff6b4a'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(314, 396); ctx.lineTo(302, 402); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(346, 396); ctx.lineTo(358, 402); ctx.stroke();

  // Kerang
  ctx.fillStyle = '#f8c8d8';
  ellipsePath(ctx, 420, 402, 12, 9); ctx.fill();
  ctx.strokeStyle = '#e89bb4'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(420, 394); ctx.lineTo(420, 410); ctx.stroke();

  if (!applied.has('bintang-hilang')) starfish(ctx, 148, 386, '#ff9f1c');
  if (!applied.has('ember-hilang')) {
    ctx.fillStyle = '#4d96ff';
    ctx.beginPath(); ctx.moveTo(456, 350); ctx.lineTo(488, 350); ctx.lineTo(484, 384); ctx.lineTo(460, 384); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ffd94d';
    ctx.fillRect(454, 346, 36, 6);
    ctx.strokeStyle = '#2f6fb2'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(458, 352); ctx.arc(472, 352, 12, Math.PI, 0); ctx.stroke();
  }
}

function bookRow(ctx, x, y, w, colors) {
  let bx = x;
  colors.forEach((c) => {
    ctx.fillStyle = c;
    ctx.fillRect(bx, y, 14, 34);
    bx += 16;
  });
}

function drawKamar(ctx, applied) {
  // Dinding dan lantai
  ctx.fillStyle = '#fdf0d5';
  ctx.fillRect(0, 0, 560, 340);
  ctx.fillStyle = '#d9a066';
  ctx.fillRect(0, 340, 560, 90);
  ctx.fillStyle = '#c98d54';
  for (let y = 362; y < 430; y += 22) ctx.fillRect(0, y, 560, 2);

  // Jendela
  ctx.fillStyle = '#fff';
  ctx.fillRect(112, 52, 136, 132);
  ctx.fillStyle = '#bfe8ff';
  ctx.fillRect(120, 60, 120, 116);
  ctx.fillStyle = '#ffd94d';
  circlePath(ctx, 212, 84, 16); ctx.fill();
  cloud(ctx, 150, 96, 0.55);
  ctx.fillStyle = '#7cc46a';
  ctx.fillRect(120, 156, 120, 20);
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.moveTo(180, 60); ctx.lineTo(180, 176); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(120, 118); ctx.lineTo(240, 118); ctx.stroke();
  ctx.fillStyle = '#ff8fa3';
  ctx.fillRect(100, 44, 22, 148);
  ctx.fillRect(238, 44, 22, 148);

  // Lukisan
  ctx.fillStyle = '#8d5a2b';
  ctx.fillRect(168, 76, 68, 64);
  ctx.fillStyle = '#eaf6ff';
  ctx.fillRect(174, 82, 56, 52);
  if (applied.has('lukisan-beda')) {
    ctx.fillStyle = '#ff9f1c';
    ellipsePath(ctx, 202, 112, 18, 9); ctx.fill();
    ctx.beginPath(); ctx.moveTo(220, 112); ctx.lineTo(230, 106); ctx.lineTo(230, 118); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#222';
    circlePath(ctx, 190, 109, 2); ctx.fill();
  } else {
    ctx.fillStyle = '#5da84f';
    ctx.beginPath(); ctx.moveTo(178, 134); ctx.lineTo(196, 100); ctx.lineTo(212, 134); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(196, 134); ctx.lineTo(214, 104); ctx.lineTo(228, 134); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#fff';
    circlePath(ctx, 222, 94, 6); ctx.fill();
  }

  // Rak buku
  ctx.fillStyle = '#a4713a';
  ctx.fillRect(316, 140, 120, 160);
  ctx.fillStyle = '#fdf0d5';
  ctx.fillRect(324, 148, 104, 60);
  ctx.fillRect(324, 222, 104, 60);
  const bookColors = applied.has('buku-warna')
    ? ['#e63946', '#2f9e44', '#9b5de5', '#4d96ff']
    : ['#e63946', '#2f9e44', '#ff9f1c', '#4d96ff'];
  bookRow(ctx, 330, 172, 0, bookColors);
  bookRow(ctx, 330, 246, 0, ['#7c4dff', '#ff6b9d', '#2ec4b6', '#ffd94d']);
  ctx.fillStyle = '#ff8fa3';
  circlePath(ctx, 408, 268, 12); ctx.fill();

  // Jam dinding
  ctx.fillStyle = '#fff';
  circlePath(ctx, 472, 88, 28); ctx.fill();
  ctx.strokeStyle = '#333'; ctx.lineWidth = 3;
  circlePath(ctx, 472, 88, 28); ctx.stroke();
  ctx.strokeStyle = '#333'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(472, 88);
  if (applied.has('jam-waktu')) { ctx.lineTo(472, 68); } else { ctx.lineTo(458, 74); }
  ctx.stroke();
  ctx.beginPath(); ctx.moveTo(472, 88);
  if (applied.has('jam-waktu')) { ctx.lineTo(490, 88); } else { ctx.lineTo(484, 100); }
  ctx.stroke();
  ctx.fillStyle = '#333';
  circlePath(ctx, 472, 88, 3); ctx.fill();

  // Meja dan akuarium
  ctx.fillStyle = '#a4713a';
  ctx.fillRect(112, 288, 120, 12);
  ctx.fillRect(122, 300, 10, 44);
  ctx.fillRect(212, 300, 10, 44);
  ctx.fillStyle = 'rgba(127,211,252,0.85)';
  roundedRectPath(ctx, 128, 232, 88, 56, 12); ctx.fill();
  ctx.strokeStyle = '#3d6fb8'; ctx.lineWidth = 3;
  roundedRectPath(ctx, 128, 232, 88, 56, 12); ctx.stroke();
  if (!applied.has('ikan-hilang')) {
    ctx.fillStyle = '#ff9f1c';
    ellipsePath(ctx, 168, 258, 14, 8); ctx.fill();
    ctx.beginPath(); ctx.moveTo(181, 258); ctx.lineTo(192, 250); ctx.lineTo(192, 266); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#222';
    circlePath(ctx, 158, 256, 2); ctx.fill();
  }
  ctx.fillStyle = '#2f9e44';
  ctx.beginPath(); ctx.moveTo(140, 288); ctx.lineTo(146, 268); ctx.lineTo(152, 288); ctx.closePath(); ctx.fill();

  // Lampu
  ctx.fillStyle = '#555';
  ctx.fillRect(480, 280, 8, 60);
  ellipsePath(ctx, 484, 342, 18, 5); ctx.fill();
  if (applied.has('lampu-mati')) {
    ctx.fillStyle = '#9aa5b1';
    ctx.beginPath(); ctx.moveTo(462, 236); ctx.lineTo(506, 236); ctx.lineTo(498, 280); ctx.lineTo(470, 280); ctx.closePath(); ctx.fill();
  } else {
    ctx.fillStyle = 'rgba(255,217,77,0.25)';
    ctx.beginPath(); ctx.moveTo(462, 236); ctx.lineTo(506, 236); ctx.lineTo(530, 340); ctx.lineTo(438, 340); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ffd94d';
    ctx.beginPath(); ctx.moveTo(462, 236); ctx.lineTo(506, 236); ctx.lineTo(498, 280); ctx.lineTo(470, 280); ctx.closePath(); ctx.fill();
  }

  // Tanaman
  ctx.fillStyle = '#e2574c';
  ctx.beginPath(); ctx.moveTo(66, 348); ctx.lineTo(110, 348); ctx.lineTo(104, 384); ctx.lineTo(72, 384); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#2f9e44'; ctx.lineWidth = 5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(88, 348); ctx.quadraticCurveTo(70, 310, 64, 292); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(88, 348); ctx.quadraticCurveTo(100, 306, 112, 288); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(88, 348); ctx.lineTo(88, 300); ctx.stroke();
  if (applied.has('daun-tambah')) {
    ctx.beginPath(); ctx.moveTo(88, 348); ctx.quadraticCurveTo(120, 320, 128, 296); ctx.stroke();
  }

  // Karpet dan Mochi si kucing
  ctx.fillStyle = '#ff8fa3';
  ellipsePath(ctx, 290, 380, 130, 34); ctx.fill();
  ctx.fillStyle = '#ffd94d';
  ellipsePath(ctx, 290, 380, 104, 24); ctx.fill();
  // Badan kucing (tidur melingkar)
  ctx.fillStyle = '#ff9f1c';
  ellipsePath(ctx, 282, 372, 52, 22); ctx.fill();
  circlePath(ctx, 238, 358, 20); ctx.fill();
  ctx.beginPath(); ctx.moveTo(224, 344); ctx.lineTo(220, 326); ctx.lineTo(232, 338); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(244, 342); ctx.lineTo(248, 324); ctx.lineTo(254, 340); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#ff6b9d';
  ctx.beginPath(); ctx.moveTo(225, 341); ctx.lineTo(222, 331); ctx.lineTo(230, 337); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(244, 339); ctx.lineTo(247, 329); ctx.lineTo(252, 338); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#7a4d00'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(232, 360, 5, 0.2 * Math.PI, 0.8 * Math.PI); ctx.stroke();
  ctx.fillStyle = '#7a4d00';
  circlePath(ctx, 228, 354, 1.8); ctx.fill();
  circlePath(ctx, 238, 354, 1.8); ctx.fill();
  // Ekor melingkar
  ctx.strokeStyle = '#ff9f1c'; ctx.lineWidth = 10; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(322, 372, 18, -0.4, 1.8); ctx.stroke();
  // Kalung
  ctx.strokeStyle = applied.has('kalung-warna') ? '#4d96ff' : '#e63946';
  ctx.lineWidth = 5;
  ctx.beginPath(); ctx.arc(256, 366, 14, 0.2, Math.PI - 0.2); ctx.stroke();
  ctx.fillStyle = '#ffd94d';
  circlePath(ctx, 256, 380, 5); ctx.fill();
}

export function drawScene(ctx, ox, oy, levelId, applied) {
  ctx.save();
  ctx.translate(ox, oy);
  ctx.beginPath();
  ctx.rect(0, 0, 560, 430);
  ctx.clip();
  if (levelId === 'taman') drawTaman(ctx, applied);
  else if (levelId === 'pantai') drawPantai(ctx, applied);
  else drawKamar(ctx, applied);
  ctx.restore();
}
