import { DesignerWorkspace } from "@/components/designer/DesignerWorkspace";
import { AppHeader } from "@/components/ui/AppHeader";

export default function DesignerPage() {
  return (
    <div className="designer-page">
      <AppHeader />
      <DesignerWorkspace />
    </div>
  );
}
