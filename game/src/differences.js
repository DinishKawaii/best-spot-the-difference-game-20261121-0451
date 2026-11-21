// Daftar perbedaan tiap level. Satu perbedaan = satu titik (x, y) dalam koordinat
// panel (0..560 lebar, 0..430 tinggi), jari-jari klik, dan nama yang ramah dibaca.
// scenes.js memakai `id` yang sama untuk menggambar versi "berbeda" di panel kanan.

export const DIFFERENCES = {
  taman: [
    { id: 'kacamata-matahari', x: 82, y: 66, r: 42, name: 'Matahari pakai kacamata' },
    { id: 'bunga-hilang', x: 300, y: 388, r: 24, name: 'Satu bunga hilang' },
    { id: 'burung-warna', x: 438, y: 74, r: 28, name: 'Warna burung berubah' },
    { id: 'awan-tambah', x: 486, y: 52, r: 32, name: 'Awan tambahan' },
    { id: 'kupu-hilang', x: 196, y: 296, r: 26, name: 'Kupu-kupu hilang' },
    { id: 'jendela-bulat', x: 392, y: 252, r: 26, name: 'Jendela jadi bulat' },
    { id: 'apel-tambah', x: 118, y: 208, r: 22, name: 'Apel tambahan di pohon' },
  ],
  pantai: [
    { id: 'bintang-hilang', x: 148, y: 386, r: 24, name: 'Bintang laut hilang' },
    { id: 'payung-warna', x: 386, y: 196, r: 34, name: 'Warna payung berubah' },
    { id: 'kelapa-hilang', x: 108, y: 148, r: 22, name: 'Kelapa hilang' },
    { id: 'ember-hilang', x: 472, y: 366, r: 26, name: 'Ember hilang' },
    { id: 'burung-tambah', x: 306, y: 66, r: 28, name: 'Burung camar tambahan' },
    { id: 'bendera-warna', x: 252, y: 296, r: 22, name: 'Warna bendera berubah' },
    { id: 'layar-perahu', x: 482, y: 176, r: 30, name: 'Layar perahu berubah' },
  ],
  kamar: [
    { id: 'jam-waktu', x: 472, y: 88, r: 30, name: 'Jarum jam berubah' },
    { id: 'ikan-hilang', x: 148, y: 252, r: 28, name: 'Ikan di akuarium hilang' },
    { id: 'daun-tambah', x: 88, y: 332, r: 24, name: 'Daun tanaman tambahan' },
    { id: 'buku-warna', x: 352, y: 178, r: 22, name: 'Warna buku berubah' },
    { id: 'kalung-warna', x: 282, y: 362, r: 26, name: 'Warna kalung Mochi berubah' },
    { id: 'lampu-mati', x: 484, y: 222, r: 28, name: 'Lampu padam' },
    { id: 'lukisan-beda', x: 202, y: 108, r: 30, name: 'Isi lukisan berubah' },
  ],
};

export function diffsFor(levelId) {
  return DIFFERENCES[levelId] ?? [];
}
