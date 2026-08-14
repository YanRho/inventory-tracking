"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createScannerEngine } from "@/services/scanner/createScannerEngine";
import { ScanDebouncer } from "@/services/scanner/ScanDebouncer";
import { ScannerError } from "@/services/scanner/types";

export type ScannerStatus = "starting" | "running" | "error";

export function useBarcodeScanner(onScan: (value: string) => void) {
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
  const videoRef = useCallback((node: HTMLVideoElement | null) => {
    setVideoElement(node);
  }, []);

  const debouncerRef = useRef(new ScanDebouncer());
  const [status, setStatus] = useState<ScannerStatus>("starting");
  const [error, setError] = useState<ScannerError | null>(null);

  const onScanRef = useRef(onScan);
  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  useEffect(() => {
    if (!videoElement) return;

    let cancelled = false;
    const engine = createScannerEngine();

    (async () => {
      try {
        await engine.start(videoElement, (result) => {
          if (debouncerRef.current.shouldProcess(result.rawValue)) {
            onScanRef.current(result.rawValue);
          }
        });
        if (!cancelled) setStatus("running");
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ScannerError
              ? err
              : new ScannerError("unknown", "Unable to start the camera.")
          );
          setStatus("error");
        }
      }
    })();

    return () => {
      cancelled = true;
      engine.stop();
    };
  }, [videoElement]);

  return { videoRef, status, error };
}
