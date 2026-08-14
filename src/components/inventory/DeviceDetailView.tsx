"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDevice } from "@/hooks/useDevice";
import { useBatches } from "@/hooks/useBatches";
import { getInventoryRepository } from "@/repositories/IndexedDbInventoryRepository";
import { formatDateTime } from "@/lib/formatting";
import type { DeviceStatus } from "@/domain/device/types";
import { StatusSelect } from "./StatusSelect";

export function DeviceDetailView({ id }: { id: string }) {
  const { device, loading, notFound } = useDevice(id);
  const { batches } = useBatches();
  const router = useRouter();

  const [loadedDeviceId, setLoadedDeviceId] = useState<string | null>(null);
  const [assetTag, setAssetTag] = useState("");
  const [model, setModel] = useState("");
  const [batchId, setBatchId] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (device && device.id !== loadedDeviceId) {
    setLoadedDeviceId(device.id);
    setAssetTag(device.assetTag ?? "");
    setModel(device.model ?? "");
    setBatchId(device.batchId);
    setNotes(device.notes ?? "");
  }

  if (loading) return <div className="page" />;

  if (notFound || !device) {
    return (
      <div className="page">
        <div className="empty-state">
          <p>Product not found.</p>
          <button type="button" className="btn btn--secondary" onClick={() => router.push("/inventory")}>
            Back to Inventory
          </button>
        </div>
      </div>
    );
  }

  const handleStatusChange = async (status: DeviceStatus) => {
    const repo = getInventoryRepository();
    await repo.updateDevice({ ...device, status, updatedAt: new Date().toISOString() });
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const repo = getInventoryRepository();
      await repo.updateDevice({
        ...device,
        assetTag: assetTag.trim() || undefined,
        model: model.trim() || undefined,
        batchId,
        notes: notes.trim() || undefined,
        updatedAt: new Date().toISOString(),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <div className="stack">
        <span className="text-faint">Serial Number</span>
        <span style={{ fontSize: 22, fontWeight: 800 }}>{device.serialNumber}</span>
      </div>

      <div className="card stack">
        <div className="field">
          <label className="field__label" htmlFor="status">
            Status
          </label>
          <StatusSelect id="status" value={device.status} onChange={handleStatusChange} />
        </div>
      </div>

      <div className="card stack">
        <div className="field">
          <label className="field__label" htmlFor="assetTag">
            Asset Tag
          </label>
          <input
            id="assetTag"
            className="input"
            value={assetTag}
            onChange={(e) => setAssetTag(e.target.value)}
          />
        </div>
        <div className="field">
          <label className="field__label" htmlFor="model">
            Model
          </label>
          <input
            id="model"
            className="input"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />
        </div>
        <div className="field">
          <label className="field__label" htmlFor="batch">
            Batch
          </label>
          <select
            id="batch"
            className="select"
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
          >
            {batches.map((batch) => (
              <option key={batch.id} value={batch.id}>
                {batch.name}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label className="field__label" htmlFor="notes">
            Notes
          </label>
          <textarea
            id="notes"
            className="textarea"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        {error && <span className="text-error">{error}</span>}
        <button type="button" className="btn btn--primary btn--block" disabled={saving} onClick={handleSave}>
          {saved ? "Saved ✓" : "Save Changes"}
        </button>
      </div>

      <div className="card stack">
        <div className="row-between">
          <span className="text-muted">Created</span>
          <span>{formatDateTime(device.createdAt)}</span>
        </div>
        <div className="row-between">
          <span className="text-muted">Last Updated</span>
          <span>{formatDateTime(device.updatedAt)}</span>
        </div>
      </div>
    </div>
  );
}
