import type { Device } from "@/domain/device/types";
import type { Batch } from "@/domain/batch/types";

export interface ExportService {
  exportDevices(devices: Device[], batches: Batch[], scope: "all" | string): Promise<void>;
}
