"use client";

import { useState } from "react";
import { BarcodeControls } from "@/components/designer/BarcodeControls";
import { ColorControls } from "@/components/designer/ColorControls";
import { EmailSubmitPanel } from "@/components/designer/EmailSubmitPanel";
import { FieldEditor } from "@/components/designer/FieldEditor";
import { GeneralInfoControls } from "@/components/designer/GeneralInfoControls";
import { PanelSection } from "@/components/designer/PanelSection";
import { PassTypeSelector } from "@/components/designer/PassTypeSelector";
import { PassPreview } from "@/components/preview/PassPreview";
import {
  DEFAULT_PASS_DESIGN,
  PASS_FIELD_LIMITS,
  type PassDesign,
} from "@/lib/pass";

export function DesignerWorkspace() {
  const [passData, setPassData] = useState<PassDesign>(DEFAULT_PASS_DESIGN);

  function updatePassData<K extends keyof PassDesign>(
    key: K,
    value: PassDesign[K],
  ) {
    setPassData((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  return (
    <div className="designer-grid">
      <aside className="designer-sidebar-left">
        <PanelSection title="Pass Type">
          <PassTypeSelector
            onChange={(passType) => updatePassData("passType", passType)}
            value={passData.passType}
          />
        </PanelSection>
        <PanelSection title="General">
          <GeneralInfoControls
            design={passData}
            onChange={(key, value) => updatePassData(key, value)}
          />
        </PanelSection>
        <PanelSection title="Colors">
          <ColorControls
            design={passData}
            onChange={(key, value) => updatePassData(key, value)}
          />
        </PanelSection>
      </aside>

      <main className="preview-stage">
        <PassPreview passData={passData} />
      </main>

      <aside className="designer-sidebar-right">
        <PanelSection title="Fields">
          <div className="grid gap-5">
            <FieldEditor
              fields={passData.primaryFields}
              maxFields={PASS_FIELD_LIMITS.primaryFields}
              onChange={(fields) => updatePassData("primaryFields", fields)}
              title="Primary Fields"
            />
            <FieldEditor
              fields={passData.secondaryFields}
              maxFields={PASS_FIELD_LIMITS.secondaryFields}
              onChange={(fields) => updatePassData("secondaryFields", fields)}
              title="Secondary Fields"
            />
            <FieldEditor
              fields={passData.auxiliaryFields}
              maxFields={PASS_FIELD_LIMITS.auxiliaryFields}
              onChange={(fields) => updatePassData("auxiliaryFields", fields)}
              title="Auxiliary Fields"
            />
            <FieldEditor
              fields={passData.backFields}
              maxFields={PASS_FIELD_LIMITS.backFields}
              onChange={(fields) => updatePassData("backFields", fields)}
              title="Back Fields"
            />
          </div>
        </PanelSection>
        <PanelSection title="Barcode">
          <BarcodeControls
            barcode={passData.barcode}
            onChange={(barcode) => updatePassData("barcode", barcode)}
          />
        </PanelSection>
        <PanelSection title="Delivery">
          <EmailSubmitPanel />
        </PanelSection>
      </aside>
    </div>
  );
}
