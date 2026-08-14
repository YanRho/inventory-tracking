export interface ScanResult {
  rawValue: string;
}

export type ScannerErrorReason =
  | "permission-denied"
  | "no-camera"
  | "unsupported"
  | "unknown";

export class ScannerError extends Error {
  reason: ScannerErrorReason;

  constructor(reason: ScannerErrorReason, message: string) {
    super(message);
    this.reason = reason;
    this.name = "ScannerError";
  }
}

export interface BarcodeScannerEngine {
  /** Starts decoding frames from the given video element and invokes onDetect for each result. */
  start(
    videoElement: HTMLVideoElement,
    onDetect: (result: ScanResult) => void
  ): Promise<void>;
  /** Stops decoding and releases the camera stream. */
  stop(): void;
}
