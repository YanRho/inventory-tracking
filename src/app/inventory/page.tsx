"use client";

import { useInventoryView } from "@/hooks/useInventoryView";
import { useBatches } from "@/hooks/useBatches";
import { InventoryFiltersBar } from "@/components/inventory/InventoryFiltersBar";
import { DeviceListItem } from "@/components/inventory/DeviceListItem";
import { ExportButtons } from "@/components/inventory/ExportButtons";

export default function InventoryPage() {
  const { devices, filteredDevices, filters, updateFilters, isFiltered, loading } =
    useInventoryView();
  const { batches } = useBatches();

  const batchNameById = new Map(batches.map((b) => [b.id, b.name]));

  const filteredScopeLabel =
    filters.batchId !== "all"
      ? batchNameById.get(filters.batchId) ?? "filtered"
      : isFiltered
        ? "filtered"
        : "all";

  return (
    <div className="page">
      <InventoryFiltersBar filters={filters} batches={batches} onChange={updateFilters} />

      <ExportButtons
        filteredDevices={filteredDevices}
        allDevices={devices}
        batches={batches}
        isFiltered={isFiltered}
        filteredScopeLabel={filteredScopeLabel}
      />

      {loading ? null : filteredDevices.length === 0 ? (
        <div className="empty-state">
          <p>No devices found.</p>
          <p className="text-muted">Try adjusting your filters, or scan some Chromebooks.</p>
        </div>
      ) : (
        <div className="device-list">
          {filteredDevices.map((device) => (
            <DeviceListItem
              key={device.id}
              device={device}
              batchName={batchNameById.get(device.batchId) ?? "Unknown"}
            />
          ))}
        </div>
      )}
    </div>
  );
}
