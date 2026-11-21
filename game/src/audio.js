// Suara game dari WebAudio (osilator), tanpa file audio sama sekali.
// Semua bunyi dibuat di sini: ketemu, salah klik, petunjuk, menang, dan klik tombol.

export class SoundBoard {
  constructor() {
    this.context = null;
    this.muted = false;
  }

  ensure() {
    if (!this.context) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      this.context = new AC();
    }
    if (this.context.state === 'suspended') this.context.resume();
  }

  tone(freq, startAt, dur, type, vol) {
    if (this.muted || !this.context) return;
    const t0 = this.context.currentTime + startAt;
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain);
    gain.connect(this.context.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  click() { this.ensure(); this.tone(660, 0, 0.07, 'sine', 0.12); }

  found() {
    this.ensure();
    this.tone(523, 0, 0.12, 'triangle', 0.2);
    this.tone(659, 0.09, 0.12, 'triangle', 0.2);
    this.tone(784, 0.18, 0.22, 'triangle', 0.22);
  }

  wrong() {
    this.ensure();
    this.tone(160, 0, 0.18, 'sawtooth', 0.12);
    this.tone(120, 0.1, 0.2, 'sawtooth', 0.1);
  }

  hint() {
    this.ensure();
    this.tone(880, 0, 0.1, 'sine', 0.15);
    this.tone(1174, 0.1, 0.18, 'sine', 0.15);
  }

  levelClear() {
    this.ensure();
    [523, 659, 784, 1046].forEach((f, i) => this.tone(f, i * 0.12, 0.22, 'triangle', 0.2));
  }

  gameClear() {
    this.ensure();
    [523, 659, 784, 1046, 784, 1046, 1318].forEach((f, i) => this.tone(f, i * 0.13, 0.25, 'triangle', 0.2));
  }
}
