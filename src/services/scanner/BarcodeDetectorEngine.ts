import type { BarcodeScannerEngine, ScanResult } from "./types";
import { requestBackCameraStream, stopStream } from "./camera";

export function isBarcodeDetectorSupported(): boolean {
  return typeof window !== "undefined" && "BarcodeDetector" in window;
}

/** Scans video frames with the native BarcodeDetector API via requestAnimationFrame. */
export class BarcodeDetectorEngine implements BarcodeScannerEngine {
  private detector: BarcodeDetector | null = null;
  private stream: MediaStream | null = null;
  private rafId: number | null = null;
  private running = false;

  async start(
    videoElement: HTMLVideoElement,
    onDetect: (result: ScanResult) => void
  ): Promise<void> {
    this.detector = new window.BarcodeDetector!({
      formats: [
        "code_128",
        "code_39",
        "code_93",
        "ean_13",
        "ean_8",
        "upc_a",
        "upc_e",
        "qr_code",
        "itf",
      ],
    });

    this.stream = await requestBackCameraStream();
    videoElement.srcObject = this.stream;
    await videoElement.play();

    this.running = true;
    const tick = async () => {
      if (!this.running || !this.detector) return;
      try {
        const barcodes = await this.detector.detect(videoElement);
        if (barcodes.length > 0) {
          onDetect({ rawValue: barcodes[0].rawValue });
        }
      } catch {
        // Ignore transient detection errors and keep scanning.
      }
      if (this.running) {
        this.rafId = requestAnimationFrame(() => void tick());
      }
    };
    this.rafId = requestAnimationFrame(() => void tick());
  }

  stop(): void {
    this.running = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    stopStream(this.stream);
    this.stream = null;
    this.detector = null;
  }
}
