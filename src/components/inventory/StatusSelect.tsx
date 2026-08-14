import type { DeviceStatus } from "@/domain/device/types";
import { DEVICE_STATUSES, DEVICE_STATUS_LABELS } from "@/domain/device/types";

interface StatusSelectProps {
  value: DeviceStatus;
  onChange: (status: DeviceStatus) => void;
  id?: string;
}

export function StatusSelect({ value, onChange, id }: StatusSelectProps) {
  return (
    <select
      id={id}
      className="select"
      value={value}
      onChange={(e) => onChange(e.target.value as DeviceStatus)}
    >
      {DEVICE_STATUSES.map((status) => (
        <option key={status} value={status}>
          {DEVICE_STATUS_LABELS[status]}
        </option>
      ))}
    </select>
  );
}
