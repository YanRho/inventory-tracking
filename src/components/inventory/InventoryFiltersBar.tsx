import type { Batch } from "@/domain/batch/types";
import { DEVICE_STATUSES, DEVICE_STATUS_LABELS } from "@/domain/device/types";
import type { InventoryFilters } from "@/services/inventory/filterDevices";

interface InventoryFiltersBarProps {
  filters: InventoryFilters;
  batches: Batch[];
  onChange: (partial: Partial<InventoryFilters>) => void;
}

export function InventoryFiltersBar({ filters, batches, onChange }: InventoryFiltersBarProps) {
  return (
    <div className="filters-bar">
      <input
        className="input"
        placeholder="Search serial or asset tag"
        value={filters.search}
        onChange={(e) => onChange({ search: e.target.value })}
      />

      <div className="filters-row">
        <select
          className="select"
          value={filters.batchId}
          onChange={(e) => onChange({ batchId: e.target.value })}
          aria-label="Filter by batch"
        >
          <option value="all">All Batches</option>
          {batches.map((batch) => (
            <option key={batch.id} value={batch.id}>
              {batch.name}
            </option>
          ))}
        </select>

        <select
          className="select"
          value={filters.status}
          onChange={(e) => onChange({ status: e.target.value as InventoryFilters["status"] })}
          aria-label="Filter by status"
        >
          <option value="all">All Statuses</option>
          {DEVICE_STATUSES.map((status) => (
            <option key={status} value={status}>
              {DEVICE_STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </div>

      <div className="filters-row">
        <select
          className="select"
          value={filters.sortOrder}
          onChange={(e) => onChange({ sortOrder: e.target.value as InventoryFilters["sortOrder"] })}
          aria-label="Sort order"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>
    </div>
  );
}
