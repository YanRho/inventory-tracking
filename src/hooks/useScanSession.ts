"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Device } from "@/domain/device/types";
import { createDevice } from "@/domain/device/deviceFactory";
import { getInventoryRepository } from "@/repositories/IndexedDbInventoryRepository";
import { playDuplicateTone, playScanSuccessTone } from "@/services/scanner/feedbackSound";

export type ScanFeedback =
  | { type: "success"; device: Device; deviceNumber: number }
  | { type: "duplicate"; device: Device };

export function useScanSession(activeBatchId: string | null, batchDeviceCount: number) {
  const [feedback, setFeedback] = useState<ScanFeedback | null>(null);
  const countRef = useRef(batchDeviceCount);
  useEffect(() => {
    countRef.current = batchDeviceCount;
  }, [batchDeviceCount]);
  const busyRef = useRef(false);

  const dismissFeedback = useCallback(() => setFeedback(null), []);

  const handleDetected = useCallback(
    async (rawValue: string) => {
      if (!activeBatchId || busyRef.current) return;
      busyRef.current = true;
      try {
        const repo = getInventoryRepository();
        const existing = await repo.findBySerial(rawValue);
        if (existing) {
          playDuplicateTone();
          setFeedback({ type: "duplicate", device: existing });
          return;
        }

        const device = createDevice({ serialNumber: rawValue, batchId: activeBatchId });
        await repo.createDevice(device);
        countRef.current += 1;
        playScanSuccessTone();
        setFeedback({ type: "success", device, deviceNumber: countRef.current });
      } catch {
        // Swallow transient errors (e.g. race on unique constraint); user can rescan.
      } finally {
        busyRef.current = false;
      }
    },
    [activeBatchId]
  );

  return { feedback, dismissFeedback, handleDetected };
}
