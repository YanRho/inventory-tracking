import { formatDateForFilename, slugifyForFilename } from "@/lib/formatting";

export function buildExportFilename(params: {
  scope: "all" | string;
  extension: "xlsx" | "csv";
  date?: Date;
}): string {
  const scopePart = params.scope === "all" ? "all" : slugifyForFilename(params.scope);
  const datePart = formatDateForFilename(params.date);
  return `product-inventory-${scopePart}-${datePart}.${params.extension}`;
}
