// Cari Bedanya — program penyerahan entri (main.ts).
//
// Tugas program ini: menyalin game/ dan screenshots/ dari repo ke direktori
// keluaran, lalu menulis dossier.json memakai buildDossier dari
// vendor/makefun-game.ts (salinan kit yang tidak diubah).
//
// Dijalankan dua kali oleh penilai dan harus menulis byte yang sama persis:
// tidak ada stempel waktu, tidak ada angka acak, tidak ada urutan direktori
// yang bergantung pada mesin. Direktori keluaran diambil dari
// MAKEFUN_OUTPUT_DIR, atau /output bila variabel itu tidak ada.

import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

// Batas yang dipakai penilai untuk lomba ini (lihat RULES.txt: game_files,
// screenshots, dan dossier_matches).
const DOSSIER_CAPS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 48 * 1024 * 1024,
  game_path_max_bytes: 1000,
};

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)));
const outDir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? '/output');

function copyTree(name) {
  const from = join(repoRoot, name);
  if (!existsSync(from) || !statSync(from).isDirectory()) {
    throw new Error('folder ' + name + '/ tidak ditemukan di repo — batal menulis keluaran');
  }
  const to = join(outDir, name);
  cpSync(from, to, { recursive: true, dereference: true });
  return countFiles(to);
}

function countFiles(dir) {
  let n = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    n += entry.isDirectory() ? countFiles(join(dir, entry.name)) : 1;
  }
  return n;
}

function main() {
  // Mulai dari direktori keluaran yang bersih supaya tidak ada sisa run lama.
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });

  const gameFiles = copyTree('game');
  const shotFiles = copyTree('screenshots');

  // Dossier ditulis dari isi direktori keluaran itu sendiri, jadi isinya
  // selalu cocok dengan file yang diserahkan.
  const dossierBytes = buildDossier(outDir, DOSSIER_CAPS);
  writeFileSync(join(outDir, 'dossier.json'), dossierBytes);

  // Baca kembali dan pastikan dossier yang tertulis bisa dibaca dan utuh.
  const written = JSON.parse(new TextDecoder('utf-8').decode(dossierBytes));
  if (typeof written !== 'object' || written === null) {
    throw new Error('dossier.json tidak bisa dibaca kembali');
  }
  const gameBlock = written.game ?? {};
  console.log('cari-bedanya: wrote ' + outDir);
  console.log('  game/: ' + gameFiles + ' file, screenshots/: ' + shotFiles + ' file');
  console.log('  images di dossier: ' + (written.images ?? []).length +
    ', teks dossier: ' + new TextEncoder().encode(written.text ?? '').length + ' byte');
  console.log('  dossier.json: ' + dossierBytes.length + ' bytes');
}

main();
