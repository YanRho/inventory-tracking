"use client";

import { useMemo, useState } from "react";
import { useDevices } from "./useDevices";
import {
  DEFAULT_INVENTORY_FILTERS,
  filterDevices,
  type InventoryFilters,
} from "@/services/inventory/filterDevices";

export function useInventoryView() {
  const { devices, loading, error, refresh } = useDevices();
  const [filters, setFilters] = useState<InventoryFilters>(DEFAULT_INVENTORY_FILTERS);

  const filteredDevices = useMemo(() => filterDevices(devices, filters), [devices, filters]);

  const updateFilters = (partial: Partial<InventoryFilters>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  };

  const isFiltered =
    filters.search.trim() !== "" || filters.batchId !== "all" || filters.status !== "all";

  return {
    devices,
    filteredDevices,
    filters,
    updateFilters,
    isFiltered,
    loading,
    error,
    refresh,
  };
}
