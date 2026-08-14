"use client";

import { useState } from "react";
import type { Batch } from "@/domain/batch/types";
import { Modal } from "@/components/ui/Modal";

interface BatchSwitcherModalProps {
  batches: Batch[];
  activeBatchId: string | null;
  onSelect: (id: string) => void | Promise<void>;
  onCreate: (name: string) => Promise<Batch>;
  onClose: () => void;
}

export function BatchSwitcherModal({
  batches,
  activeBatchId,
  onSelect,
  onCreate,
  onClose,
}: BatchSwitcherModalProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setCreating(true);
    setError(null);
    try {
      await onCreate(name.trim());
      setName("");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create batch.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <Modal title="Batches" onClose={onClose}>
      <div className="stack">
        {batches.length === 0 && (
          <p className="text-muted">No batches yet. Create your first one below.</p>
        )}
        {batches.map((batch) => (
          <button
            key={batch.id}
            type="button"
            className={`batch-option ${batch.id === activeBatchId ? "is-active" : ""}`}
            onClick={async () => {
              await onSelect(batch.id);
              onClose();
            }}
          >
            <span>{batch.name}</span>
            {batch.id === activeBatchId && <span>✓</span>}
          </button>
        ))}
      </div>

      <div className="stack">
        <div className="field">
          <label className="field__label" htmlFor="new-batch-name">
            New batch name
          </label>
          <input
            id="new-batch-name"
            className="input"
            placeholder="e.g. AUG13-01"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") void handleCreate();
            }}
          />
        </div>
        {error && <span className="text-error">{error}</span>}
        <button
          type="button"
          className="btn btn--primary btn--block"
          disabled={!name.trim() || creating}
          onClick={handleCreate}
        >
          Create &amp; Switch
        </button>
      </div>
    </Modal>
  );
}
