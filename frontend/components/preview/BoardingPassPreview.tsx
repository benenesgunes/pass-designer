import type { PassDesign } from "@/lib/pass";
import { WalletPassCard } from "./WalletPassCard";

type BoardingPassPreviewProps = {
  passData: PassDesign;
};

export function BoardingPassPreview({ passData }: BoardingPassPreviewProps) {
  return <WalletPassCard passData={passData} variant="boardingPass" />;
}
