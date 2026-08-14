"use client";

import { useState } from "react";
import { useInventoryView } from "@/hooks/useInventoryView";
import { useBatches } from "@/hooks/useBatches";
import { InventoryFiltersBar } from "@/components/inventory/InventoryFiltersBar";
import { DeviceListItem } from "@/components/inventory/DeviceListItem";
import { ExportButtons } from "@/components/inventory/ExportButtons";
import { BulkSelectionBar } from "@/components/inventory/BulkSelectionBar";

export default function InventoryPage() {
  const { devices, filteredDevices, filters, updateFilters, isFiltered, loading } =
    useInventoryView();
  const { batches } = useBatches();

  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const batchNameById = new Map(batches.map((b) => [b.id, b.name]));

  const filteredScopeLabel =
    filters.batchId !== "all"
      ? batchNameById.get(filters.batchId) ?? "filtered"
      : isFiltered
        ? "filtered"
        : "all";

  const allFilteredSelected =
    filteredDevices.length > 0 && filteredDevices.every((d) => selectedIds.has(d.id));

  const exitSelectionMode = () => {
    setSelectionMode(false);
    setSelectedIds(new Set());
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelectedIds(allFilteredSelected ? new Set() : new Set(filteredDevices.map((d) => d.id)));
  };

  return (
    <div className="page">
      <InventoryFiltersBar filters={filters} batches={batches} onChange={updateFilters} />

      <div className="row-between">
        <button
          type="button"
          className="btn btn--secondary"
          onClick={() => (selectionMode ? exitSelectionMode() : setSelectionMode(true))}
          disabled={filteredDevices.length === 0}
        >
          {selectionMode ? "Cancel" : "Select"}
        </button>
        {selectionMode && (
          <button type="button" className="btn btn--secondary" onClick={toggleSelectAll}>
            {allFilteredSelected ? "Deselect All" : "Select All"}
          </button>
        )}
      </div>

      {!selectionMode && (
        <ExportButtons
          filteredDevices={filteredDevices}
          allDevices={devices}
          batches={batches}
          isFiltered={isFiltered}
          filteredScopeLabel={filteredScopeLabel}
        />
      )}

      {loading ? null : filteredDevices.length === 0 ? (
        <div className="empty-state">
          <p>No products found.</p>
          <p className="text-muted">Try adjusting your filters, or scan some products.</p>
        </div>
      ) : (
        <div className="device-list">
          {filteredDevices.map((device) => (
            <DeviceListItem
              key={device.id}
              device={device}
              batchName={batchNameById.get(device.batchId) ?? "Unknown"}
              selectionMode={selectionMode}
              selected={selectedIds.has(device.id)}
              onToggleSelect={toggleSelect}
            />
          ))}
        </div>
      )}

      {selectionMode && selectedIds.size > 0 && (
        <BulkSelectionBar
          selectedCount={selectedIds.size}
          onApplied={exitSelectionMode}
          selectedIds={[...selectedIds]}
        />
      )}
    </div>
  );
}
