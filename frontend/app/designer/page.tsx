import { DesignerWorkspace } from "@/components/designer/DesignerWorkspace";
import { AppHeader } from "@/components/ui/AppHeader";

export default function DesignerPage() {
  return (
    <div className="min-h-screen">
      <AppHeader />
      <DesignerWorkspace />
    </div>
  );
}
