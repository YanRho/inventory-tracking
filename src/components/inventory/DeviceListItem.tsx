import Link from "next/link";
import type { Device } from "@/domain/device/types";
import { formatRelativeTime } from "@/lib/formatting";
import { StatusBadge } from "./StatusBadge";

interface DeviceListItemProps {
  device: Device;
  batchName: string;
}

export function DeviceListItem({ device, batchName }: DeviceListItemProps) {
  return (
    <Link href={`/devices/${device.id}`} className="device-row">
      <div className="device-row__top">
        <span className="device-row__serial">{device.serialNumber}</span>
        <StatusBadge status={device.status} />
      </div>
      <div className="device-row__meta">
        {device.assetTag && <span>Tag: {device.assetTag}</span>}
        {device.model && <span>{device.model}</span>}
        <span>{batchName}</span>
      </div>
      <div className="device-row__meta">
        <span>Scanned {formatRelativeTime(device.createdAt)}</span>
        <span>Updated {formatRelativeTime(device.updatedAt)}</span>
      </div>
    </Link>
  );
}
