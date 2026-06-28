import type { PassDesign } from "@/lib/pass";

type PreviewPlaceholderProps = {
  passData: PassDesign;
  title: string;
};

export function PreviewPlaceholder({
  passData,
  title,
}: PreviewPlaceholderProps) {
  return (
    <div className="preview-card">
      <div className="preview-card-header">
        <span className="small-title">{title}</span>
        <span className="muted-caption">{passData.passType}</span>
      </div>
      <div className="preview-card-body">
        <div>
          <div className="preview-icon-placeholder" />
          <p className="small-title">Preview canvas</p>
        </div>
      </div>
    </div>
  );
}
