import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { Device } from "@/domain/device/types";
import type { Batch } from "@/domain/batch/types";

const DB_NAME = "chromebook-inventory";
const DB_VERSION = 1;

export const DEVICES_STORE = "devices";
export const BATCHES_STORE = "batches";
export const META_STORE = "meta";

export interface MetaRecord {
  key: string;
  value: string;
}

interface InventoryDbSchema extends DBSchema {
  [DEVICES_STORE]: {
    key: string;
    value: Device;
    indexes: {
      serialNumber: string;
      batchId: string;
      status: string;
      createdAt: string;
    };
  };
  [BATCHES_STORE]: {
    key: string;
    value: Batch;
    indexes: {
      name: string;
      createdAt: string;
    };
  };
  [META_STORE]: {
    key: string;
    value: MetaRecord;
  };
}

let dbPromise: Promise<IDBPDatabase<InventoryDbSchema>> | null = null;

export function getDb(): Promise<IDBPDatabase<InventoryDbSchema>> {
  if (typeof indexedDB === "undefined") {
    throw new Error("IndexedDB is not available in this environment.");
  }

  if (!dbPromise) {
    dbPromise = openDB<InventoryDbSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(DEVICES_STORE)) {
          const devices = db.createObjectStore(DEVICES_STORE, { keyPath: "id" });
          devices.createIndex("serialNumber", "serialNumber", { unique: true });
          devices.createIndex("batchId", "batchId");
          devices.createIndex("status", "status");
          devices.createIndex("createdAt", "createdAt");
        }

        if (!db.objectStoreNames.contains(BATCHES_STORE)) {
          const batches = db.createObjectStore(BATCHES_STORE, { keyPath: "id" });
          batches.createIndex("name", "name", { unique: true });
          batches.createIndex("createdAt", "createdAt");
        }

        if (!db.objectStoreNames.contains(META_STORE)) {
          db.createObjectStore(META_STORE, { keyPath: "key" });
        }
      },
    });
  }

  return dbPromise;
}
