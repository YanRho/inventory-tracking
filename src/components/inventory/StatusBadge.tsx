import type { DeviceStatus } from "@/domain/device/types";
import { DEVICE_STATUS_LABELS } from "@/domain/device/types";

export function StatusBadge({ status }: { status: DeviceStatus }) {
  return <span className={`status-badge status-badge--${status}`}>{DEVICE_STATUS_LABELS[status]}</span>;
}
