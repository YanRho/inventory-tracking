"use client";

import { useState } from "react";
import Link from "next/link";
import { useBatches } from "@/hooks/useBatches";
import { useDevices } from "@/hooks/useDevices";
import { StatusBreakdown } from "@/components/dashboard/StatusBreakdown";
import { BatchSwitcherModal } from "@/components/batches/BatchSwitcherModal";

export default function DashboardPage() {
  const { batches, activeBatch, activeBatchId, loading: batchesLoading, createBatch, setActiveBatch } =
    useBatches();
  const { devices, loading: devicesLoading } = useDevices();
  const [modalOpen, setModalOpen] = useState(false);

  const batchDevices = activeBatchId
    ? devices.filter((d) => d.batchId === activeBatchId)
    : [];

  if (batchesLoading || devicesLoading) {
    return <div className="page" />;
  }

  if (!activeBatch) {
    return (
      <div className="page">
        <div className="empty-state">
          <p>No batch selected yet.</p>
          <p className="text-muted">Create a batch to start scanning Chromebooks.</p>
          <button type="button" className="btn btn--primary" onClick={() => setModalOpen(true)}>
            Create Batch
          </button>
        </div>
        {modalOpen && (
          <BatchSwitcherModal
            batches={batches}
            activeBatchId={activeBatchId}
            onSelect={setActiveBatch}
            onCreate={createBatch}
            onClose={() => setModalOpen(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="page">
      <div className="dashboard-hero">
        <span className="text-muted">Current Batch: {activeBatch.name}</span>
        <span className="dashboard-hero__count">{batchDevices.length} Devices</span>
      </div>

      <Link href="/scan" className="btn btn--primary btn--lg btn--block">
        Scan Devices
      </Link>

      <StatusBreakdown devices={batchDevices} />

      <Link href="/inventory" className="btn btn--secondary btn--block">
        View Inventory
      </Link>
    </div>
  );
}
