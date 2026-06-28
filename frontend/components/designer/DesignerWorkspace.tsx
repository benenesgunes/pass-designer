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
  getDefaultFieldsForPassType,
  getPassFieldLimits,
  type PassDesign,
  type PassType,
} from "@/lib/pass";

export function DesignerWorkspace() {
  const [passData, setPassData] = useState<PassDesign>(DEFAULT_PASS_DESIGN);
  const fieldLimits = getPassFieldLimits(passData.passType);

  function updatePassData<K extends keyof PassDesign>(
    key: K,
    value: PassDesign[K],
  ) {
    setPassData((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function updatePassType(passType: PassType) {
    setPassData((prev) => ({
      ...prev,
      passType,
      ...getDefaultFieldsForPassType(passType),
    }));
  }

  return (
    <div className="designer-grid">
      <aside className="designer-sidebar-left">
        <PanelSection title="Pass Type">
          <PassTypeSelector
            onChange={updatePassType}
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
          <div className="field-stack">
            <FieldEditor
              fields={passData.primaryFields}
              maxFields={fieldLimits.primaryFields}
              onChange={(fields) => updatePassData("primaryFields", fields)}
              title="Primary Fields"
            />
            <FieldEditor
              fields={passData.secondaryFields}
              maxFields={fieldLimits.secondaryFields}
              onChange={(fields) => updatePassData("secondaryFields", fields)}
              title="Secondary Fields"
            />
            <FieldEditor
              fields={passData.auxiliaryFields}
              maxFields={fieldLimits.auxiliaryFields}
              onChange={(fields) => updatePassData("auxiliaryFields", fields)}
              title="Auxiliary Fields"
            />
            <FieldEditor
              fields={passData.backFields}
              maxFields={fieldLimits.backFields}
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
