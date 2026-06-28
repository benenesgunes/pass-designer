import type { PassDesign } from "@/lib/pass";
import { PreviewPlaceholder } from "./PreviewPlaceholder";

type EventTicketPassPreviewProps = {
  passData: PassDesign;
};

export function EventTicketPassPreview({
  passData,
}: EventTicketPassPreviewProps) {
  return <PreviewPlaceholder passData={passData} title="Event Ticket" />;
}
