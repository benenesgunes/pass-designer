import type { PassDesign } from "@/lib/pass";
import { PreviewPlaceholder } from "./PreviewPlaceholder";

type CouponPassPreviewProps = {
  passData: PassDesign;
};

export function CouponPassPreview({ passData }: CouponPassPreviewProps) {
  return <PreviewPlaceholder passData={passData} title="Coupon Pass" />;
}
