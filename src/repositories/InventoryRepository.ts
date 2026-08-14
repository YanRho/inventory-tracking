import type { Device, DeviceStatus } from "@/domain/device/types";

export interface InventoryRepository {
  getDevices(): Promise<Device[]>;
  getDevice(id: string): Promise<Device | null>;
  findBySerial(serialNumber: string): Promise<Device | null>;
  createDevice(device: Device): Promise<void>;
  updateDevice(device: Device): Promise<void>;
  updateDevicesStatus(ids: string[], status: DeviceStatus): Promise<void>;
  deleteDevice(id: string): Promise<void>;
}
