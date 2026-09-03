/**
 * Web Audio API synth for focus timer and notification sound effects
 */
class AudioService {
  private ctx: AudioContext | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playChime(type: 'success' | 'alert' | 'tick' | 'completion') {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.15); // E5
        osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.3); // G5
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.start(now);
        osc.stop(now + 0.6);
      } else if (type === 'completion') {
        // Multi-note fan-fare
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const o = this.ctx!.createOscillator();
          const g = this.ctx!.createGain();
          o.connect(g);
          g.connect(this.ctx!.destination);
          o.type = 'triangle';
          o.frequency.setValueAtTime(freq, now + idx * 0.12);
          g.gain.setValueAtTime(0.2, now + idx * 0.12);
          g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.4);
          o.start(now + idx * 0.12);
          o.stop(now + idx * 0.12 + 0.4);
        });
      } else if (type === 'alert') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.setValueAtTime(440, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'tick') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1000, now);
        gain.gain.setValueAtTime(0.02, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        osc.start(now);
        osc.stop(now + 0.03);
      }
    } catch {
      // Ignore audio context errors if user hasn't interacted
    }
  }
}

export const audioService = new AudioService();
