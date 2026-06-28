import type { PassDesign } from "@/lib/pass";
import { WalletPassCard } from "./WalletPassCard";

type CouponPassPreviewProps = {
  passData: PassDesign;
};

export function CouponPassPreview({ passData }: CouponPassPreviewProps) {
  return <WalletPassCard passData={passData} variant="coupon" />;
}
