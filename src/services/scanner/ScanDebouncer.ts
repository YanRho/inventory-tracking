/** Suppresses repeated detections of the same raw value within a cooldown window. */
export class ScanDebouncer {
  private lastValue: string | null = null;
  private lastTimestamp = 0;

  constructor(private readonly cooldownMs = 2500) {}

  /** Returns true if this value should be processed, false if it's a rapid repeat. */
  shouldProcess(value: string): boolean {
    const now = Date.now();
    if (value === this.lastValue && now - this.lastTimestamp < this.cooldownMs) {
      return false;
    }
    this.lastValue = value;
    this.lastTimestamp = now;
    return true;
  }

  reset(): void {
    this.lastValue = null;
    this.lastTimestamp = 0;
  }
}
