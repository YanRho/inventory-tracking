import type { Device, DeviceStatus } from "@/domain/device/types";

export type SortOrder = "newest" | "oldest";

export interface InventoryFilters {
  search: string;
  batchId: string | "all";
  status: DeviceStatus | "all";
  sortOrder: SortOrder;
}

export const DEFAULT_INVENTORY_FILTERS: InventoryFilters = {
  search: "",
  batchId: "all",
  status: "all",
  sortOrder: "newest",
};

export function filterDevices(devices: Device[], filters: InventoryFilters): Device[] {
  const search = filters.search.trim().toLowerCase();

  const filtered = devices.filter((device) => {
    if (filters.batchId !== "all" && device.batchId !== filters.batchId) return false;
    if (filters.status !== "all" && device.status !== filters.status) return false;
    if (search) {
      const matchesSerial = device.serialNumber.toLowerCase().includes(search);
      const matchesAssetTag = (device.assetTag ?? "").toLowerCase().includes(search);
      if (!matchesSerial && !matchesAssetTag) return false;
    }
    return true;
  });

  return filtered.sort((a, b) => {
    const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    return filters.sortOrder === "newest" ? -diff : diff;
  });
}
