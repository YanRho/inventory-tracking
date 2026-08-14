import ExcelJS from "exceljs";
import type { Device } from "@/domain/device/types";
import type { Batch } from "@/domain/batch/types";
import type { ExportService } from "./ExportService";
import { EXPORT_COLUMNS, buildExportRows } from "./exportRows";
import { buildExportFilename } from "./filenames";
import { triggerDownload } from "./download";

const MIN_COLUMN_WIDTH = 12;
const MAX_COLUMN_WIDTH = 40;

export class ExcelExportService implements ExportService {
  async exportDevices(
    devices: Device[],
    batches: Batch[],
    scope: "all" | string
  ): Promise<void> {
    const batchNameById = new Map(batches.map((batch) => [batch.id, batch.name]));
    const rows = buildExportRows(devices, batchNameById);

    const workbook = new ExcelJS.Workbook();
    workbook.created = new Date();
    const worksheet = workbook.addWorksheet("Inventory", {
      views: [{ state: "frozen", ySplit: 1 }],
    });

    worksheet.columns = EXPORT_COLUMNS.map((header) => ({ header, key: header }));

    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.alignment = { vertical: "middle" };

    rows.forEach((row) => worksheet.addRow(row));

    worksheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: 1, column: EXPORT_COLUMNS.length },
    };

    worksheet.columns.forEach((column) => {
      const header = String(column.header ?? "");
      let maxLength = header.length;
      column.eachCell?.({ includeEmpty: false }, (cell) => {
        const length = String(cell.value ?? "").length;
        if (length > maxLength) maxLength = length;
      });
      column.width = Math.min(MAX_COLUMN_WIDTH, Math.max(MIN_COLUMN_WIDTH, maxLength + 2));
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    triggerDownload(blob, buildExportFilename({ scope, extension: "xlsx" }));
  }
}
