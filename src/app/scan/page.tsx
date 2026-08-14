"use client";

import { useState } from "react";
import Link from "next/link";
import { useBatches } from "@/hooks/useBatches";
import { useDevices } from "@/hooks/useDevices";
import { useBarcodeScanner } from "@/hooks/useBarcodeScanner";
import { useScanSession } from "@/hooks/useScanSession";
import { ScannerView } from "@/components/scanner/ScannerView";
import { ScanFeedbackOverlay } from "@/components/scanner/ScanFeedbackOverlay";
import { ManualEntryModal } from "@/components/scanner/ManualEntryModal";
import { BatchSwitcherModal } from "@/components/batches/BatchSwitcherModal";

export default function ScanPage() {
  const { batches, activeBatch, activeBatchId, loading: batchesLoading, createBatch, setActiveBatch } =
    useBatches();
  const { devices } = useDevices();
  const [manualEntryOpen, setManualEntryOpen] = useState(false);
  const [batchModalOpen, setBatchModalOpen] = useState(false);

  const batchDeviceCount = activeBatchId
    ? devices.filter((d) => d.batchId === activeBatchId).length
    : 0;

  const { feedback, dismissFeedback, handleDetected } = useScanSession(
    activeBatchId,
    batchDeviceCount
  );
  const { videoRef, status, error } = useBarcodeScanner(handleDetected);

  if (batchesLoading) {
    return <div className="scanner-screen" />;
  }

  if (!activeBatch) {
    return (
      <div className="scanner-screen">
        <div className="scanner-screen__top">
          <Link href="/" className="btn btn--ghost" style={{ color: "#fff" }}>
            ✕
          </Link>
        </div>
        <div className="scanner-permission">
          <div className="stack">
            <p>Create or select a batch to start scanning.</p>
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => setBatchModalOpen(true)}
            >
              Choose Batch
            </button>
          </div>
        </div>
        {batchModalOpen && (
          <BatchSwitcherModal
            batches={batches}
            activeBatchId={activeBatchId}
            onSelect={setActiveBatch}
            onCreate={createBatch}
            onClose={() => setBatchModalOpen(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="scanner-screen">
      <ScannerView videoRef={videoRef} status={status} error={error} />

      <div className="scanner-screen__top">
        <Link href="/" className="btn btn--ghost" style={{ color: "#fff" }}>
          ✕
        </Link>
        <button
          type="button"
          className="batch-pill"
          onClick={() => setBatchModalOpen(true)}
        >
          <span className="batch-pill__label">Batch</span>
          <span className="batch-pill__name">{activeBatch.name}</span>
        </button>
      </div>

      <div className="scanner-screen__bottom">
        <span className="scanner-screen__count">
          ✓ {batchDeviceCount}
          {activeBatch.expectedCount ? ` / ${activeBatch.expectedCount}` : ""}{" "}
          {batchDeviceCount === 1 ? "product" : "products"} scanned
        </span>
        <button
          type="button"
          className="btn btn--secondary btn--block"
          onClick={() => setManualEntryOpen(true)}
        >
          Enter Serial Manually
        </button>
      </div>

      {feedback && <ScanFeedbackOverlay feedback={feedback} onDismiss={dismissFeedback} />}

      {manualEntryOpen && (
        <ManualEntryModal
          onSubmit={handleDetected}
          onClose={() => setManualEntryOpen(false)}
        />
      )}

      {batchModalOpen && (
        <BatchSwitcherModal
          batches={batches}
          activeBatchId={activeBatchId}
          onSelect={setActiveBatch}
          onCreate={createBatch}
          onClose={() => setBatchModalOpen(false)}
        />
      )}
    </div>
  );
}
