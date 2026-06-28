import type { PassDesign } from "@/lib/pass";
import { PreviewPlaceholder } from "./PreviewPlaceholder";

type StoreCardPassPreviewProps = {
  passData: PassDesign;
};

export function StoreCardPassPreview({ passData }: StoreCardPassPreviewProps) {
  return <PreviewPlaceholder passData={passData} title="Store Card" />;
}
