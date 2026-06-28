import { BarcodeControls } from "@/components/designer/BarcodeControls";
import { ColorControls } from "@/components/designer/ColorControls";
import { EmailSubmitPanel } from "@/components/designer/EmailSubmitPanel";
import { FieldEditor } from "@/components/designer/FieldEditor";
import { GeneralInfoControls } from "@/components/designer/GeneralInfoControls";
import { ImageControls } from "@/components/designer/ImageControls";
import { PassTypeSelector } from "@/components/designer/PassTypeSelector";
import { BoardingPassPreview } from "@/components/preview/BoardingPassPreview";
import { CouponPassPreview } from "@/components/preview/CouponPassPreview";
import { EventTicketPassPreview } from "@/components/preview/EventTicketPassPreview";
import { GenericPassPreview } from "@/components/preview/GenericPassPreview";
import { PosterGenericPassPreview } from "@/components/preview/PosterGenericPassPreview";
import { StoreCardPassPreview } from "@/components/preview/StoreCardPassPreview";
import { AppHeader } from "@/components/ui/AppHeader";
import { PassMiniature } from "@/components/ui/PassMiniature";
import {
  DEFAULT_PASS_DESIGN,
  PASS_FIELD_LIMITS,
  PASS_TYPES,
  getDefaultFieldsForPassType,
  type PassType,
} from "@/lib/pass";

const previewByType = {
  boardingPass: BoardingPassPreview,
  generic: GenericPassPreview,
  posterGeneric: PosterGenericPassPreview,
  coupon: CouponPassPreview,
  eventTicketStrip: EventTicketPassPreview,
  eventTicketBackground: EventTicketPassPreview,
  storeCard: StoreCardPassPreview,
} satisfies Record<PassType, typeof GenericPassPreview>;

export default function ComponentsPage() {
  const design = DEFAULT_PASS_DESIGN;

  return (
    <>
      <AppHeader />
      <main className="page-container py-12">
        <header className="page-intro">
          <p className="eyebrow mb-3">Interface reference</p>
          <h1 className="page-title">Components</h1>
          <p className="mt-5 text-lg leading-8 text-muted">
            The shared visual pieces for the pass designer, grouped with the
            typography and controls used across Phase 3.
          </p>
        </header>

        <section className="section-block">
          <h2 className="section-title">Typography</h2>
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
            <div>
              <p className="eyebrow">Display</p>
              <p className="display-title mt-2">Wallet Pass Designer</p>
            </div>
            <div className="grid content-start gap-4">
              <div>
                <p className="eyebrow">Heading</p>
                <p className="mt-1 text-3xl font-semibold">
                  Clean controls, clear preview
                </p>
              </div>
              <div>
                <p className="eyebrow">Body</p>
                <p className="body-copy mt-1 max-w-xl">
                  Minimal, spacious, and built around the shared pass data
                  model.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="section-block">
          <h2 className="section-title">Pass Cards</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PASS_TYPES.map((passType) => (
              <div
                className="reference-card-white p-4"
                key={passType}
              >
                <PassMiniature passType={passType} />
                <p className="small-title mt-4">{passType}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section-block">
          <h2 className="section-title">Designer Controls</h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <div className="reference-card">
              <div className="reference-card-header">Pass Type</div>
              <div className="reference-card-body">
                <PassTypeSelector value={design.passType} />
              </div>
            </div>
            <div className="reference-card">
              <div className="reference-card-header">General Info</div>
              <div className="reference-card-body">
                <GeneralInfoControls design={design} />
              </div>
            </div>
            <div className="reference-card">
              <div className="reference-card-header">Colors</div>
              <div className="reference-card-body">
                <ColorControls design={design} />
              </div>
            </div>
            <div className="reference-card">
              <div className="reference-card-header">Images</div>
              <div className="reference-card-body">
                <ImageControls
                  images={design.images}
                  passType={design.passType}
                />
              </div>
            </div>
            <div className="reference-card lg:col-span-2">
              <div className="reference-card-header">Fields</div>
              <div className="grid gap-5 p-5">
                <FieldEditor
                  fields={design.headerFields}
                  maxFields={PASS_FIELD_LIMITS.headerFields}
                  title="Header Fields"
                />
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
              </div>
            </div>
            <div className="grid gap-4">
              <div className="reference-card">
                <div className="reference-card-header">Barcode</div>
                <div className="reference-card-body">
                  <BarcodeControls barcode={design.barcode} />
                </div>
              </div>
              <div className="reference-card">
                <div className="reference-card-header">Delivery</div>
                <div className="reference-card-body">
                  <EmailSubmitPanel />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-block">
          <h2 className="section-title">Pass Previews</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {PASS_TYPES.map((passType) => {
              const Preview = previewByType[passType];
              const passData = {
                ...design,
                passType,
                ...getDefaultFieldsForPassType(passType),
              };

              return (
                <div className="flex justify-center" key={passType}>
                  <Preview passData={passData} />
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
}
