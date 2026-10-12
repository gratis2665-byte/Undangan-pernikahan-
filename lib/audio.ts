// High-fidelity Web Audio synthesis for romantic wedding background music
// Generates a soft, ethereal piano and harp harmonic progression (Pachelbel Canon / Wedding Fantasy)
// Guaranteed to work across all browsers without broken external media files or CORS issues!

class WeddingAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private timerId: number | null = null;
  private volumeGain: GainNode | null = null;
  private currentStep = 0;
  private tempo = 72; // BPM
  private volume = 0.35;

  private chords = [
    // D major, A major, B minor, F# minor, G major, D major, G major, A major
    [146.83, 220.00, 293.66, 369.99, 440.00], // D3, A3, D4, F#4, A4
    [110.00, 220.00, 277.18, 329.63, 440.00], // A2, A3, C#4, E4, A4
    [123.47, 185.00, 246.94, 293.66, 369.99], // B2, F#3, B3, D4, F#4
    [92.50, 185.00, 220.00, 277.18, 369.99],  // F#2, F#3, A3, C#4, F#4
    [98.00, 196.00, 246.94, 293.66, 392.00],  // G2, G3, B3, D4, G4
    [146.83, 220.00, 293.66, 369.99, 440.00], // D3, A3, D4, F#4, A4
    [98.00, 196.00, 246.94, 293.66, 392.00],  // G2, G3, B3, D4, G4
    [110.00, 220.00, 277.18, 329.63, 440.00], // A2, A3, C#4, E4, A4
  ];

  private melodyNotes = [
    // Gentle romantic melody overlay
    587.33, 554.37, 493.88, 440.00, 392.00, 369.99, 392.00, 440.00,
    587.33, 659.25, 739.99, 659.25, 587.33, 493.88, 440.00, 369.99,
  ];

  public init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.volumeGain = this.ctx.createGain();
        this.volumeGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        this.volumeGain.connect(this.ctx.destination);
      }
    }
  }

  public play() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.stepMusic();
  }

  public pause() {
    this.isPlaying = false;
    if (this.timerId) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.pause();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.volumeGain && this.ctx) {
      this.volumeGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  // Soft harp/piano synth tone with gentle envelope & harmonic overtones
  private playPluckNote(freq: number, time: number, duration: number, isBass = false) {
    if (!this.ctx || !this.volumeGain) return;

    const osc = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    // Gentle soft sine & triangle blend for warm music box / acoustic harp tone
    osc.type = isBass ? 'triangle' : 'sine';
    osc2.type = 'triangle';

    osc.frequency.setValueAtTime(freq, time);
    osc2.frequency.setValueAtTime(freq * 2.002, time); // slight harmonic shimmer

    // ADSR Envelope
    const attack = isBass ? 0.05 : 0.02;
    const decay = duration * 0.9;
    noteGain.gain.setValueAtTime(0, time);
    noteGain.gain.linearRampToValueAtTime(isBass ? 0.35 : 0.22, time + attack);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, time + attack + decay);

    // Subtle low-pass filtering to soften the sound
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(isBass ? 800 : 2400, time);

    osc.connect(noteGain);
    osc2.connect(noteGain);
    noteGain.connect(filter);
    filter.connect(this.volumeGain);

    osc.start(time);
    osc2.start(time);
    osc.stop(time + attack + decay + 0.1);
    osc2.stop(time + attack + decay + 0.1);
  }

  // Play gentle celebratory chime when invitation envelope opens
  public playChime() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    const now = this.ctx.currentTime;
    const arpeggio = [587.33, 739.99, 880.00, 1174.66, 1479.98]; // D5, F#5, A5, D6, F#6
    arpeggio.forEach((note, idx) => {
      this.playPluckNote(note, now + idx * 0.08, 1.4, false);
    });
  }

  private stepMusic = () => {
    if (!this.isPlaying || !this.ctx) return;

    const now = this.ctx.currentTime;
    const chordIndex = Math.floor(this.currentStep / 4) % this.chords.length;
    const chord = this.chords[chordIndex];
    const subStep = this.currentStep % 4;

    // Bass root note on beat 1
    if (subStep === 0) {
      this.playPluckNote(chord[0], now, 2.6, true);
    }

    // Arpeggiated chord notes
    const noteToPlay = chord[(subStep % (chord.length - 1)) + 1];
    this.playPluckNote(noteToPlay, now, 1.8, false);

    // Occasional gentle high melody note
    if (subStep === 2 || subStep === 3) {
      const melody = this.melodyNotes[(this.currentStep) % this.melodyNotes.length];
      this.playPluckNote(melody, now + 0.1, 1.2, false);
    }

    this.currentStep = (this.currentStep + 1) % (this.chords.length * 4);

    const stepInterval = (60 / this.tempo) * 1000 * 0.5; // sixteenth-to-eighth timing
    this.timerId = window.setTimeout(this.stepMusic, stepInterval);
  };
}

export const weddingAudio = new WeddingAudioEngine();
