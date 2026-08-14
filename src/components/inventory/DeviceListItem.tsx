import Link from "next/link";
import type { Device } from "@/domain/device/types";
import { formatRelativeTime } from "@/lib/formatting";
import { StatusBadge } from "./StatusBadge";

interface DeviceListItemProps {
  device: Device;
  batchName: string;
  selectionMode?: boolean;
  selected?: boolean;
  onToggleSelect?: (id: string) => void;
}

export function DeviceListItem({
  device,
  batchName,
  selectionMode = false,
  selected = false,
  onToggleSelect,
}: DeviceListItemProps) {
  const content = (
    <>
      <div className="device-row__top">
        {selectionMode && (
          <input
            type="checkbox"
            className="device-row__checkbox"
            checked={selected}
            readOnly
            aria-hidden="true"
            tabIndex={-1}
          />
        )}
        <span className="device-row__serial">{device.serialNumber}</span>
        <StatusBadge status={device.status} />
      </div>
      <div className="device-row__meta">
        {device.itemName && <span>{device.itemName}</span>}
        <span>{batchName}</span>
      </div>
      <div className="device-row__meta">
        <span>Scanned {formatRelativeTime(device.createdAt)}</span>
        <span>Updated {formatRelativeTime(device.updatedAt)}</span>
      </div>
    </>
  );

  if (selectionMode) {
    return (
      <button
        type="button"
        className={`device-row ${selected ? "is-selected" : ""}`}
        onClick={() => onToggleSelect?.(device.id)}
        aria-pressed={selected}
      >
        {content}
      </button>
    );
  }

  return (
    <Link href={`/devices/${device.id}`} className="device-row">
      {content}
    </Link>
  );
}
