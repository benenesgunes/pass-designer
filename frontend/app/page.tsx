import Link from "next/link";
import { AppHeader } from "@/components/ui/AppHeader";
import { PassMiniature } from "@/components/ui/PassMiniature";
import { PASS_TYPES, type PassType } from "@/lib/pass";

const passTypeContent: Record<PassType, { title: string; copy: string }> = {
  generic: {
    title: "Generic",
    copy: "Simple records, confirmations, and lightweight identity passes.",
  },
  coupon: {
    title: "Coupon",
    copy: "Offer-led passes with compact redemption details.",
  },
  eventTicket: {
    title: "Event Ticket",
    copy: "Admission passes for dates, venues, and attendee details.",
  },
  storeCard: {
    title: "Store Card",
    copy: "Membership, loyalty, and customer account passes.",
  },
};

export default function Home() {
  return (
    <>
      <AppHeader />
      <main>
        <section className="page-container grid gap-12 pb-16 pt-20 md:grid-cols-[1fr_420px] md:items-center md:pt-24">
          <div className="page-intro">
            <p className="eyebrow mb-4">
              Pass data design for Apple Wallet
            </p>
            <h1 className="hero-title">Wallet Pass Designer</h1>
            <p className="body-lede mt-6 max-w-2xl">
              Create the shared pass shape first, then preview, generate, and
              deliver passes as the backend comes online.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                className="btn-primary"
                href="/designer"
              >
                Open Designer
              </Link>
              <Link
                className="btn-secondary"
                href="/components"
              >
                View Components
              </Link>
            </div>
          </div>

          <div className="grid gap-3">
            <PassMiniature passType="generic" />
            <div className="grid grid-cols-3 gap-3">
              <div className="h-24 rounded-lg border border-line bg-white" />
              <div className="h-24 rounded-lg border border-line bg-white" />
              <div className="h-24 rounded-lg border border-line bg-white" />
            </div>
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-7xl gap-4 px-5 pb-20 sm:grid-cols-2 lg:grid-cols-4">
          {PASS_TYPES.map((passType) => (
            <Link
              className="pass-card-link group"
              href="/designer"
              key={passType}
            >
              <PassMiniature passType={passType} />
              <h2 className="subsection-title mt-5">
                {passTypeContent[passType].title}
              </h2>
              <p className="card-copy mt-2">
                {passTypeContent[passType].copy}
              </p>
              <p className="pass-card-action">
                Start with {passTypeContent[passType].title}
              </p>
            </Link>
          ))}
        </section>
      </main>
    </>
  );
}
