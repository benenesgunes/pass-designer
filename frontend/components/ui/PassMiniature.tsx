import type { PassType } from "@/lib/pass";

const passTypeAccent: Record<PassType, string> = {
  boardingPass: "#007aff",
  generic: "#0066cc",
  posterGeneric: "#ff375f",
  coupon: "#34c759",
  eventTicket: "#ff9f0a",
  storeCard: "#af52de",
};

type PassMiniatureProps = {
  passType: PassType;
};

export function PassMiniature({ passType }: PassMiniatureProps) {
  return (
    <div className="pass-miniature">
      <div
        className="h-3"
        style={{ backgroundColor: passTypeAccent[passType] }}
      />
      <div className="pass-miniature-body">
        <div className="flex items-center justify-between">
          <div className="pass-miniature-mark h-3 w-24 rounded-full" />
          <div className="pass-miniature-mark-soft h-7 w-7 rounded-md" />
        </div>
        <div className="space-y-2">
          <div className="pass-miniature-mark h-8 w-32 rounded-md" />
          <div className="pass-miniature-mark-soft h-2 w-44 rounded-full" />
        </div>
        <div className="grid grid-cols-3 gap-2 pt-2">
          <div className="pass-miniature-mark-soft h-8 rounded-md" />
          <div className="pass-miniature-mark-soft h-8 rounded-md" />
          <div className="pass-miniature-mark-soft h-8 rounded-md" />
        </div>
      </div>
    </div>
  );
}
