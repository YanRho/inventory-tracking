"use client";

import { useState } from "react";
import type { Batch } from "@/domain/batch/types";
import { Modal } from "@/components/ui/Modal";

interface BatchSwitcherModalProps {
  batches: Batch[];
  activeBatchId: string | null;
  onSelect: (id: string) => void | Promise<void>;
  onCreate: (name: string, expectedCount?: number) => Promise<Batch>;
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
  const [expectedCount, setExpectedCount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setCreating(true);
    setError(null);
    try {
      const parsedExpectedCount = expectedCount.trim() ? Number(expectedCount) : undefined;
      await onCreate(name.trim(), parsedExpectedCount);
      setName("");
      setExpectedCount("");
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
            <span>
              {batch.name}
              {batch.expectedCount ? ` (expecting ${batch.expectedCount})` : ""}
            </span>
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
        <div className="field">
          <label className="field__label" htmlFor="new-batch-expected">
            Expected products (optional)
          </label>
          <input
            id="new-batch-expected"
            className="input"
            type="number"
            inputMode="numeric"
            min={1}
            placeholder="e.g. 50"
            value={expectedCount}
            onChange={(e) => setExpectedCount(e.target.value)}
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
