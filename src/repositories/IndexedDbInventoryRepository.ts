import type { Device, DeviceStatus } from "@/domain/device/types";
import { normalizeSerialNumber } from "@/domain/device/deviceFactory";
import type { InventoryRepository } from "./InventoryRepository";
import { DEVICES_STORE, getDb } from "./db";
import { deviceEvents } from "./events";

export class IndexedDbInventoryRepository implements InventoryRepository {
  async getDevices(): Promise<Device[]> {
    const db = await getDb();
    return db.getAll(DEVICES_STORE);
  }

  async getDevice(id: string): Promise<Device | null> {
    const db = await getDb();
    const device = await db.get(DEVICES_STORE, id);
    return device ?? null;
  }

  async findBySerial(serialNumber: string): Promise<Device | null> {
    const db = await getDb();
    const device = await db.getFromIndex(
      DEVICES_STORE,
      "serialNumber",
      normalizeSerialNumber(serialNumber)
    );
    return device ?? null;
  }

  async createDevice(device: Device): Promise<void> {
    const db = await getDb();
    const existing = await db.getFromIndex(
      DEVICES_STORE,
      "serialNumber",
      device.serialNumber
    );
    if (existing) {
      throw new Error(`Serial number "${device.serialNumber}" already exists.`);
    }
    await db.add(DEVICES_STORE, device);
    deviceEvents.emit();
  }

  async updateDevice(device: Device): Promise<void> {
    const db = await getDb();
    const existing = await db.getFromIndex(
      DEVICES_STORE,
      "serialNumber",
      device.serialNumber
    );
    if (existing && existing.id !== device.id) {
      throw new Error(`Serial number "${device.serialNumber}" already exists.`);
    }
    await db.put(DEVICES_STORE, device);
    deviceEvents.emit();
  }

  async updateDevicesStatus(ids: string[], status: DeviceStatus): Promise<void> {
    if (ids.length === 0) return;
    const db = await getDb();
    const tx = db.transaction(DEVICES_STORE, "readwrite");
    const now = new Date().toISOString();
    await Promise.all(
      ids.map(async (id) => {
        const device = await tx.store.get(id);
        if (!device) return;
        await tx.store.put({ ...device, status, updatedAt: now });
      })
    );
    await tx.done;
    deviceEvents.emit();
  }

  async deleteDevice(id: string): Promise<void> {
    const db = await getDb();
    await db.delete(DEVICES_STORE, id);
    deviceEvents.emit();
  }
}

let singleton: IndexedDbInventoryRepository | null = null;

export function getInventoryRepository(): InventoryRepository {
  if (!singleton) {
    singleton = new IndexedDbInventoryRepository();
  }
  return singleton;
}
