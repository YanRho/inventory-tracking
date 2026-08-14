"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ScanFeedback } from "@/hooks/useScanSession";
import { DEVICE_STATUS_LABELS } from "@/domain/device/types";
import { formatRelativeTime } from "@/lib/formatting";

const SUCCESS_DISMISS_MS = 1300;

interface ScanFeedbackOverlayProps {
  feedback: ScanFeedback;
  onDismiss: () => void;
}

export function ScanFeedbackOverlay({ feedback, onDismiss }: ScanFeedbackOverlayProps) {
  const router = useRouter();

  useEffect(() => {
    if (feedback.type !== "success") return;
    const timer = setTimeout(onDismiss, SUCCESS_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [feedback, onDismiss]);

  if (feedback.type === "success") {
    return (
      <div className="scanner-feedback">
        <div className="scanner-feedback__card">
          <span className="scanner-feedback__icon">✓</span>
          <span>SCANNED</span>
          <span className="scanner-feedback__serial">{feedback.device.serialNumber}</span>
          <span className="scanner-feedback__meta">Product #{feedback.deviceNumber}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="scanner-feedback">
      <div className="scanner-feedback__card">
        <span>Already Scanned</span>
        <span className="scanner-feedback__serial">{feedback.device.serialNumber}</span>
        <span className="scanner-feedback__meta">
          Status: {DEVICE_STATUS_LABELS[feedback.device.status]}
        </span>
        <span className="scanner-feedback__meta">
          Originally scanned {formatRelativeTime(feedback.device.createdAt)}.
        </span>
        <div className="scanner-feedback__actions">
          <button
            type="button"
            className="btn btn--secondary"
            style={{ flex: 1 }}
            onClick={() => router.push(`/devices/${feedback.device.id}`)}
          >
            View Product
          </button>
          <button
            type="button"
            className="btn btn--primary"
            style={{ flex: 1 }}
            onClick={onDismiss}
          >
            Continue Scanning
          </button>
        </div>
      </div>
    </div>
  );
}
