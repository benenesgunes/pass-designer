import type { PassDesign } from "@/lib/pass";
import { CouponPassPreview } from "./CouponPassPreview";
import { EventTicketPassPreview } from "./EventTicketPassPreview";
import { GenericPassPreview } from "./GenericPassPreview";
import { StoreCardPassPreview } from "./StoreCardPassPreview";

type PassPreviewProps = {
  passData: PassDesign;
};

export function PassPreview({ passData }: PassPreviewProps) {
  if (passData.passType === "coupon") {
    return <CouponPassPreview passData={passData} />;
  }

  if (passData.passType === "eventTicket") {
    return <EventTicketPassPreview passData={passData} />;
  }

  if (passData.passType === "storeCard") {
    return <StoreCardPassPreview passData={passData} />;
  }

  return <GenericPassPreview passData={passData} />;
}
