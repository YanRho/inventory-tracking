export type DeviceStatus = "scanned" | "configuring" | "packed" | "finished";

export interface Device {
  id: string;
  serialNumber: string;
  assetTag?: string;
  model?: string;
  batchId: string;
  status: DeviceStatus;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export const DEVICE_STATUSES: DeviceStatus[] = ["scanned", "configuring", "packed", "finished"];

export const DEVICE_STATUS_LABELS: Record<DeviceStatus, string> = {
  scanned: "Scanned",
  configuring: "Configuring",
  packed: "Packed",
  finished: "Finished",
};
