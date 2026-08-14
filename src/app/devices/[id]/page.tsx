import { DeviceDetailView } from "@/components/inventory/DeviceDetailView";

export default async function DeviceDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <DeviceDetailView id={id} />;
}
