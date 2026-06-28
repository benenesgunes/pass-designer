import type { PassDesign } from "@/lib/pass";
import { WalletPassCard } from "./WalletPassCard";

type PosterGenericPassPreviewProps = {
  passData: PassDesign;
};

export function PosterGenericPassPreview({
  passData,
}: PosterGenericPassPreviewProps) {
  return <WalletPassCard passData={passData} variant="posterGeneric" />;
}
