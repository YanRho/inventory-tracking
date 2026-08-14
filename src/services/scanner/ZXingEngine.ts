import { BrowserMultiFormatReader } from "@zxing/browser";
import type { IScannerControls } from "@zxing/browser";
import type { BarcodeScannerEngine, ScanResult } from "./types";
import { ScannerError } from "./types";

/** Fallback engine for browsers without the native BarcodeDetector API. */
export class ZXingEngine implements BarcodeScannerEngine {
  private reader = new BrowserMultiFormatReader();
  private controls: IScannerControls | null = null;

  async start(
    videoElement: HTMLVideoElement,
    onDetect: (result: ScanResult) => void
  ): Promise<void> {
    const constraints: MediaStreamConstraints = {
      video: {
        facingMode: { ideal: "environment" },
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: false,
    };

    try {
      this.controls = await this.reader.decodeFromConstraints(
        constraints,
        videoElement,
        (result) => {
          if (result) {
            onDetect({ rawValue: result.getText() });
          }
        }
      );
    } catch (err) {
      if (err instanceof DOMException && err.name === "NotAllowedError") {
        throw new ScannerError("permission-denied", "Camera permission was denied.");
      }
      if (err instanceof DOMException && err.name === "NotFoundError") {
        throw new ScannerError("no-camera", "No camera was found on this device.");
      }
      throw new ScannerError("unknown", "Unable to access the camera.");
    }
  }

  stop(): void {
    this.controls?.stop();
    this.controls = null;
  }
}
