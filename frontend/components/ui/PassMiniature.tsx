import type { PassType } from "@/lib/pass";

const passTypeAccent: Record<PassType, string> = {
  generic: "#0066cc",
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
          <div className="h-3 w-24 rounded-full bg-neutral-900" />
          <div className="h-7 w-7 rounded-md bg-neutral-100" />
        </div>
        <div className="space-y-2">
          <div className="h-8 w-32 rounded-md bg-neutral-950" />
          <div className="h-2 w-44 rounded-full bg-neutral-200" />
        </div>
        <div className="grid grid-cols-3 gap-2 pt-2">
          <div className="h-8 rounded-md bg-neutral-100" />
          <div className="h-8 rounded-md bg-neutral-100" />
          <div className="h-8 rounded-md bg-neutral-100" />
        </div>
      </div>
    </div>
  );
}
