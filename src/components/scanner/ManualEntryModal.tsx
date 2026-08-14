"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";

interface ManualEntryModalProps {
  onSubmit: (serialNumber: string) => void;
  onClose: () => void;
}

export function ManualEntryModal({ onSubmit, onClose }: ManualEntryModalProps) {
  const [value, setValue] = useState("");

  const submit = () => {
    if (!value.trim()) return;
    onSubmit(value.trim());
    onClose();
  };

  return (
    <Modal title="Enter Serial Manually" onClose={onClose}>
      <div className="field">
        <label className="field__label" htmlFor="manual-serial">
          Serial Number
        </label>
        <input
          id="manual-serial"
          className="input"
          autoFocus
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck={false}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
        />
      </div>
      <button
        type="button"
        className="btn btn--primary btn--block"
        disabled={!value.trim()}
        onClick={submit}
      >
        Save
      </button>
    </Modal>
  );
}
