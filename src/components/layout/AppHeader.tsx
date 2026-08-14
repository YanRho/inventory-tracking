"use client";

import { useState } from "react";
import { useBatches } from "@/hooks/useBatches";
import { BatchSwitcherModal } from "@/components/batches/BatchSwitcherModal";
import { ThemeToggle } from "./ThemeToggle";

export function AppHeader() {
  const { batches, activeBatch, activeBatchId, createBatch, setActiveBatch } = useBatches();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <header className="app-header">
      <span className="app-header__title">Scan Inventory</span>
      <div className="app-header__actions">
        <ThemeToggle />
        <button
          type="button"
          className="batch-pill"
          onClick={() => setModalOpen(true)}
        >
          <span className="batch-pill__label">Batch</span>
          <span className="batch-pill__name">{activeBatch?.name ?? "None"}</span>
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
    </header>
  );
}
