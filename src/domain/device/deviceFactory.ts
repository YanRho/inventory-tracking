import { v4 as uuidv4 } from "uuid";
import type { Device } from "./types";

export function createDevice(params: {
  serialNumber: string;
  batchId: string;
  itemName?: string;
}): Device {
  const now = new Date().toISOString();
  return {
    id: uuidv4(),
    serialNumber: normalizeSerialNumber(params.serialNumber),
    itemName: params.itemName?.trim() || undefined,
    batchId: params.batchId,
    status: "scanned",
    createdAt: now,
    updatedAt: now,
  };
}

export function normalizeSerialNumber(serial: string): string {
  return serial.trim().toUpperCase();
}
