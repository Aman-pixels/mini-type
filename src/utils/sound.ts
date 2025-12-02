// Simple sound effects using Web Audio API
class SoundManager {
    private audioContext: AudioContext | null = null;
    private enabled: boolean = false;

    constructor() {
        const saved = localStorage.getItem('minitype-sound');
        this.enabled = saved === 'true';
    }

    private getAudioContext(): AudioContext {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        return this.audioContext;
    }

    playKeyPress() {
        if (!this.enabled) return;

        const ctx = this.getAudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.05);
    }

    playError() {
        if (!this.enabled) return;

        const ctx = this.getAudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.value = 200;
        oscillator.type = 'square';

        gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.1);
    }

    playComplete() {
        if (!this.enabled) return;

        const ctx = this.getAudioContext();

        // Play a pleasant chord
        [523.25, 659.25, 783.99].forEach((freq, i) => {
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.frequency.value = freq;
            oscillator.type = 'sine';

            const startTime = ctx.currentTime + (i * 0.05);
            gainNode.gain.setValueAtTime(0.1, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

            oscillator.start(startTime);
            oscillator.stop(startTime + 0.3);
        });
    }

    setEnabled(enabled: boolean) {
        this.enabled = enabled;
        localStorage.setItem('minitype-sound', enabled.toString());
    }

    isEnabled(): boolean {
        return this.enabled;
    }
}

export const soundManager = new SoundManager();
