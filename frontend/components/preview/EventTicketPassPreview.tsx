import type { PassDesign } from "@/lib/pass";
import { WalletPassCard } from "./WalletPassCard";

type EventTicketPassPreviewProps = {
  passData: PassDesign;
};

export function EventTicketPassPreview({
  passData,
}: EventTicketPassPreviewProps) {
  return <WalletPassCard passData={passData} variant="eventTicket" />;
}
