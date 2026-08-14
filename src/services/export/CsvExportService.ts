import type { Device } from "@/domain/device/types";
import type { Batch } from "@/domain/batch/types";
import type { ExportService } from "./ExportService";
import { EXPORT_COLUMNS, buildExportRows, type ExportRow } from "./exportRows";
import { buildExportFilename } from "./filenames";
import { triggerDownload } from "./download";

function escapeCsvField(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function rowsToCsv(rows: ExportRow[]): string {
  const header = EXPORT_COLUMNS.map(escapeCsvField).join(",");
  const lines = rows.map((row) =>
    EXPORT_COLUMNS.map((column) => escapeCsvField(row[column])).join(",")
  );
  return [header, ...lines].join("\r\n");
}

export class CsvExportService implements ExportService {
  async exportDevices(
    devices: Device[],
    batches: Batch[],
    scope: "all" | string
  ): Promise<void> {
    const batchNameById = new Map(batches.map((batch) => [batch.id, batch.name]));
    const rows = buildExportRows(devices, batchNameById);
    const csv = rowsToCsv(rows);
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    triggerDownload(blob, buildExportFilename({ scope, extension: "csv" }));
  }
}
