import type { PassDesign } from "@/lib/pass";
import { WalletPassCard } from "./WalletPassCard";

type StoreCardPassPreviewProps = {
  passData: PassDesign;
};

export function StoreCardPassPreview({ passData }: StoreCardPassPreviewProps) {
  return <WalletPassCard passData={passData} variant="storeCard" />;
}
