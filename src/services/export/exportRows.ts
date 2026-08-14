import type { Device } from "@/domain/device/types";
import { DEVICE_STATUS_LABELS } from "@/domain/device/types";
import { formatDateTime } from "@/lib/formatting";

export const EXPORT_COLUMNS = [
  "Serial Number",
  "Model",
  "Batch",
  "Status",
  "Created At",
  "Updated At",
  "Notes",
] as const;

export interface ExportRow {
  "Serial Number": string;
  Model: string;
  Batch: string;
  Status: string;
  "Created At": string;
  "Updated At": string;
  Notes: string;
}

export function buildExportRows(
  devices: Device[],
  batchNameById: Map<string, string>
): ExportRow[] {
  return devices.map((device) => ({
    "Serial Number": device.serialNumber,
    Model: device.model ?? "",
    Batch: batchNameById.get(device.batchId) ?? device.batchId,
    Status: DEVICE_STATUS_LABELS[device.status],
    "Created At": formatDateTime(device.createdAt),
    "Updated At": formatDateTime(device.updatedAt),
    Notes: device.notes ?? "",
  }));
}
