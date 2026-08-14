import { v4 as uuidv4 } from "uuid";
import type { Device } from "./types";

export function createDevice(params: {
  serialNumber: string;
  batchId: string;
  assetTag?: string;
  model?: string;
}): Device {
  const now = new Date().toISOString();
  return {
    id: uuidv4(),
    serialNumber: normalizeSerialNumber(params.serialNumber),
    assetTag: params.assetTag?.trim() || undefined,
    model: params.model?.trim() || undefined,
    batchId: params.batchId,
    status: "scanned",
    createdAt: now,
    updatedAt: now,
  };
}

export function normalizeSerialNumber(serial: string): string {
  return serial.trim().toUpperCase();
}
