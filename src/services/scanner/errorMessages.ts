import { ScannerError } from "./types";

export function describeScannerError(error: ScannerError): string {
  switch (error.reason) {
    case "permission-denied":
      return "Camera access was denied. Enable camera permission in your browser settings, or enter serials manually below.";
    case "no-camera":
      return "No camera was found on this device. Enter serials manually below.";
    case "unsupported":
      return "This browser doesn't support camera scanning. Enter serials manually below.";
    default:
      return "Couldn't start the camera. Enter serials manually below.";
  }
}
