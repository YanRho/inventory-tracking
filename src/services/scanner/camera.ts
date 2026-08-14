import { ScannerError } from "./types";

export async function requestBackCameraStream(): Promise<MediaStream> {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new ScannerError("unsupported", "Camera access is not supported in this browser.");
  }

  try {
    return await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: "environment" },
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: false,
    });
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

export function stopStream(stream: MediaStream | null): void {
  stream?.getTracks().forEach((track) => track.stop());
}
