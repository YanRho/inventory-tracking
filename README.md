# Chromebook Inventory Scanner

A mobile-first PWA for scanning and tracking Chromebook inventory during device deployment. Point your phone's camera at a serial-number barcode and it's saved instantly — no backend, no login, fully offline-capable via IndexedDB.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). For camera scanning, open the app on a phone (or use Chrome DevTools device emulation with a webcam) over HTTPS or `localhost`.

To build for production and install as a PWA:

```bash
npm run build
npm start
```

## Core Workflow

1. Create a deployment batch (e.g. `AUG13-01`) from the dashboard.
2. Tap **Scan Devices** and point the camera at a Chromebook's serial barcode.
3. Each unique serial is saved automatically — no save button, no form. Duplicate scans are detected and shown instead of creating a second record.
4. Track status per device (Received → Updating → Enrolling → Enrolled → Verified → Complete, or Failed) from the device detail screen.
5. Search/filter/sort the inventory, then export to `.xlsx` or `.csv`.

## Architecture

- `src/domain/` — plain business types and factories (`Device`, `Batch`), no framework or storage dependencies.
- `src/repositories/` — `InventoryRepository` / `BatchRepository` interfaces plus their IndexedDB implementations (via [`idb`](https://github.com/jakearchibald/idb)). UI code depends only on the interfaces.
- `src/services/scanner/` — camera + barcode decoding, isolated behind a `BarcodeScannerEngine` interface with a native `BarcodeDetector` implementation and a ZXing fallback for unsupported browsers.
- `src/services/export/` — `ExcelExportService` (ExcelJS) and `CsvExportService`, both behind a shared `ExportService` interface.
- `src/services/inventory/` — pure filtering/sorting logic for the inventory list.
- `src/hooks/` — React hooks wiring repositories/services to UI state.
- `src/components/`, `src/app/` — UI, organized by feature (scanner, inventory, batches, dashboard).

## Tech Stack

Next.js (App Router) + TypeScript, IndexedDB for local persistence, `BarcodeDetector` API with a ZXing fallback, ExcelJS for `.xlsx` export, and a PWA manifest + service worker for offline/installable use. No backend.
