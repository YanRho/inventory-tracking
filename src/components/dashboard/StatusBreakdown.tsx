import type { Device } from "@/domain/device/types";
import { DEVICE_STATUSES, DEVICE_STATUS_LABELS } from "@/domain/device/types";

export function StatusBreakdown({ devices }: { devices: Device[] }) {
  const counts = DEVICE_STATUSES.map((status) => ({
    status,
    count: devices.filter((d) => d.status === status).length,
  }));

  return (
    <div className="card">
      <div className="card-title">Status Breakdown</div>
      <div>
        {counts.map(({ status, count }) => (
          <div className="status-row" key={status}>
            <span>{DEVICE_STATUS_LABELS[status]}</span>
            <span className="status-row__count">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
