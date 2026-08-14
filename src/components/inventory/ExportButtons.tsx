"use client";

import { useState } from "react";
import type { Device } from "@/domain/device/types";
import type { Batch } from "@/domain/batch/types";
import { ExcelExportService } from "@/services/export/ExcelExportService";
import { CsvExportService } from "@/services/export/CsvExportService";

const excelExportService = new ExcelExportService();
const csvExportService = new CsvExportService();

interface ExportButtonsProps {
  filteredDevices: Device[];
  allDevices: Device[];
  batches: Batch[];
  isFiltered: boolean;
  filteredScopeLabel: string;
}

export function ExportButtons({
  filteredDevices,
  allDevices,
  batches,
  isFiltered,
  filteredScopeLabel,
}: ExportButtonsProps) {
  const [exporting, setExporting] = useState(false);

  const runExport = async (service: { exportDevices: (d: Device[], b: Batch[], s: string) => Promise<void> }, devices: Device[], scope: string) => {
    setExporting(true);
    try {
      await service.exportDevices(devices, batches, scope);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="card stack">
      <div className="card-title">Export</div>

      <div className="stack">
        <span className="text-muted">
          {isFiltered ? `Filtered (${filteredDevices.length})` : `All Inventory (${allDevices.length})`}
        </span>
        <div className="filters-row">
          <button
            type="button"
            className="btn btn--primary"
            disabled={exporting || filteredDevices.length === 0}
            onClick={() => void runExport(excelExportService, filteredDevices, filteredScopeLabel)}
          >
            Export Excel (.xlsx)
          </button>
          <button
            type="button"
            className="btn btn--secondary"
            disabled={exporting || filteredDevices.length === 0}
            onClick={() => void runExport(csvExportService, filteredDevices, filteredScopeLabel)}
          >
            Export CSV (.csv)
          </button>
        </div>
      </div>

      {isFiltered && (
        <div className="stack">
          <span className="text-muted">All Inventory ({allDevices.length})</span>
          <div className="filters-row">
            <button
              type="button"
              className="btn btn--secondary"
              disabled={exporting || allDevices.length === 0}
              onClick={() => void runExport(excelExportService, allDevices, "all")}
            >
              Export Excel (.xlsx)
            </button>
            <button
              type="button"
              className="btn btn--secondary"
              disabled={exporting || allDevices.length === 0}
              onClick={() => void runExport(csvExportService, allDevices, "all")}
            >
              Export CSV (.csv)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
