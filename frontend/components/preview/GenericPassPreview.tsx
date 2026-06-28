import type { PassDesign } from "@/lib/pass";
import { PreviewPlaceholder } from "./PreviewPlaceholder";

type GenericPassPreviewProps = {
  passData: PassDesign;
};

export function GenericPassPreview({ passData }: GenericPassPreviewProps) {
  return <PreviewPlaceholder passData={passData} title="Generic Pass" />;
}
