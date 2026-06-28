import type { PassDesign } from "@/lib/pass";
import { WalletPassCard } from "./WalletPassCard";

type GenericPassPreviewProps = {
  passData: PassDesign;
};

export function GenericPassPreview({ passData }: GenericPassPreviewProps) {
  return <WalletPassCard passData={passData} variant="generic" />;
}
