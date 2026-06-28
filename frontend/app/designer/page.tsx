import { BarcodeControls } from "@/components/designer/BarcodeControls";
import { ColorControls } from "@/components/designer/ColorControls";
import { EmailSubmitPanel } from "@/components/designer/EmailSubmitPanel";
import { FieldEditor } from "@/components/designer/FieldEditor";
import { GeneralInfoControls } from "@/components/designer/GeneralInfoControls";
import { PanelSection } from "@/components/designer/PanelSection";
import { PassTypeSelector } from "@/components/designer/PassTypeSelector";
import { PassPreview } from "@/components/preview/PassPreview";
import { AppHeader } from "@/components/ui/AppHeader";
import { DEFAULT_PASS_DESIGN, PASS_FIELD_LIMITS } from "@/lib/pass";

export default function DesignerPage() {
  const design = DEFAULT_PASS_DESIGN;

  return (
    <div className="min-h-screen">
      <AppHeader />
      <div className="designer-grid">
        <aside className="designer-sidebar-left">
          <PanelSection title="Pass Type">
            <PassTypeSelector value={design.passType} />
          </PanelSection>
          <PanelSection title="General">
            <GeneralInfoControls design={design} />
          </PanelSection>
          <PanelSection title="Colors">
            <ColorControls design={design} />
          </PanelSection>
        </aside>

        <main className="preview-stage">
          <PassPreview passData={design} />
        </main>

        <aside className="designer-sidebar-right">
          <PanelSection title="Fields">
            <div className="grid gap-5">
              <FieldEditor
                fields={design.primaryFields}
                maxFields={PASS_FIELD_LIMITS.primaryFields}
                title="Primary Fields"
              />
              <FieldEditor
                fields={design.secondaryFields}
                maxFields={PASS_FIELD_LIMITS.secondaryFields}
                title="Secondary Fields"
              />
              <FieldEditor
                fields={design.auxiliaryFields}
                maxFields={PASS_FIELD_LIMITS.auxiliaryFields}
                title="Auxiliary Fields"
              />
              <FieldEditor
                fields={design.backFields}
                maxFields={PASS_FIELD_LIMITS.backFields}
                title="Back Fields"
              />
            </div>
          </PanelSection>
          <PanelSection title="Barcode">
            <BarcodeControls barcode={design.barcode} />
          </PanelSection>
          <PanelSection title="Delivery">
            <EmailSubmitPanel />
          </PanelSection>
        </aside>
      </div>
    </div>
  );
}
