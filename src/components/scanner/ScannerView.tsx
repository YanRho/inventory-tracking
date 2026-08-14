import type { Ref } from "react";
import type { ScannerStatus } from "@/hooks/useBarcodeScanner";
import type { ScannerError } from "@/services/scanner/types";
import { describeScannerError } from "@/services/scanner/errorMessages";

interface ScannerViewProps {
  videoRef: Ref<HTMLVideoElement>;
  status: ScannerStatus;
  error: ScannerError | null;
}

export function ScannerView({ videoRef, status, error }: ScannerViewProps) {
  return (
    <div className="scanner-screen__video-wrap">
      <video ref={videoRef} className="scanner-screen__video" muted playsInline autoPlay />

      {status === "running" && (
        <div className="scanner-screen__viewfinder">
          <div className="scanner-screen__frame" />
          <div className="scanner-screen__hint">Point camera at serial barcode</div>
        </div>
      )}

      {status === "error" && error && (
        <div className="scanner-permission">
          <p>{describeScannerError(error)}</p>
        </div>
      )}
    </div>
  );
}
