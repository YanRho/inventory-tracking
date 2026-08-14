import type { BarcodeScannerEngine } from "./types";
import { BarcodeDetectorEngine, isBarcodeDetectorSupported } from "./BarcodeDetectorEngine";
import { ZXingEngine } from "./ZXingEngine";

export function createScannerEngine(): BarcodeScannerEngine {
  return isBarcodeDetectorSupported() ? new BarcodeDetectorEngine() : new ZXingEngine();
}
