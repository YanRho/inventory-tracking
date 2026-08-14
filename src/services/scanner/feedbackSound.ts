let sharedContext: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioCtx = window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return null;
  if (!sharedContext) sharedContext = new AudioCtx();
  return sharedContext;
}

function playTone(frequency: number, durationMs: number, volume: number): void {
  const ctx = getContext();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = "sine";
  oscillator.frequency.value = frequency;
  gain.gain.value = volume;

  oscillator.connect(gain);
  gain.connect(ctx.destination);

  const now = ctx.currentTime;
  gain.gain.setValueAtTime(volume, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + durationMs / 1000);

  oscillator.start(now);
  oscillator.stop(now + durationMs / 1000);
}

export function playScanSuccessTone(): void {
  playTone(880, 120, 0.15);
}

export function playDuplicateTone(): void {
  playTone(440, 200, 0.12);
}
