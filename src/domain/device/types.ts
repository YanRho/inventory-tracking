export type DeviceStatus =
  | "received"
  | "updating"
  | "enrolling"
  | "enrolled"
  | "verified"
  | "complete"
  | "failed";

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

export const DEVICE_STATUSES: DeviceStatus[] = [
  "received",
  "updating",
  "enrolling",
  "enrolled",
  "verified",
  "complete",
  "failed",
];

export const DEVICE_STATUS_LABELS: Record<DeviceStatus, string> = {
  received: "Received",
  updating: "Updating",
  enrolling: "Enrolling",
  enrolled: "Enrolled",
  verified: "Verified",
  complete: "Complete",
  failed: "Failed",
};
