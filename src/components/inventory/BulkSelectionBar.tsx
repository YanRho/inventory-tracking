"use client";

import { useState } from "react";
import type { DeviceStatus } from "@/domain/device/types";
import { getInventoryRepository } from "@/repositories/IndexedDbInventoryRepository";
import { StatusSelect } from "./StatusSelect";

interface BulkSelectionBarProps {
  selectedCount: number;
  selectedIds: string[];
  onApplied: () => void;
}

export function BulkSelectionBar({ selectedCount, selectedIds, onApplied }: BulkSelectionBarProps) {
  const [status, setStatus] = useState<DeviceStatus>("scanned");
  const [applying, setApplying] = useState(false);

  const handleApply = async () => {
    setApplying(true);
    try {
      await getInventoryRepository().updateDevicesStatus(selectedIds, status);
      onApplied();
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="selection-bar">
      <span className="selection-bar__count">{selectedCount} selected</span>
      <div className="selection-bar__actions">
        <StatusSelect value={status} onChange={setStatus} />
        <button
          type="button"
          className="btn btn--primary"
          disabled={applying}
          onClick={handleApply}
        >
          Apply
        </button>
      </div>
    </div>
  );
}
