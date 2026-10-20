import type { ReactNode } from "react";
import { PhoneFrame } from "./marketing/components/ui/PhoneFrame";
import { ShowcaseArt, type ShowcaseVariant } from "./marketing/components/ui/ShowcaseArt";
import { LedgerCard } from "./marketing/components/ui/LedgerCard";
import { ConstellationArt } from "./marketing/components/ui/ConstellationArt";
import { MiniOrbit } from "./marketing/components/ui/MiniOrbit";
import { ProductShowcase } from "./marketing/components/sections/ProductShowcase";
import { HowItWorks } from "./marketing/components/sections/HowItWorks";
import { Begin } from "./marketing/components/sections/Begin";
import { Mechanism } from "./marketing/components/sections/Mechanism";

/**
 * A gallery of every code-built mockup on the Bestday marketing page, plus the image assets it
 * uses. The components under ./marketing are verbatim copies of the source repo, so what renders
 * here is what renders on /marketing.
 */

const PHONES: { variant: ShowcaseVariant; label: string }[] = [
  { variant: "goals", label: "Goal view" },
  { variant: "checkin", label: "Weekly check-in" },
  { variant: "circle", label: "Your Circle" },
  { variant: "companion", label: "The Companion" },
];

const IMAGES: { src: string; label: string; size: string }[] = [
  { src: "/marketing/goals-screen.webp", label: "goals-screen.webp", size: "940×1672" },
  { src: "/marketing/checkin-screen.webp", label: "checkin-screen.webp", size: "1024×1536" },
  { src: "/marketing/community-reference.webp", label: "community-reference.webp", size: "1179×2556" },
  { src: "/marketing/hero-handshake-hanging.webp", label: "hero-handshake-hanging.webp", size: "1024×1536" },
  { src: "/marketing/alone.webp", label: "alone.webp", size: "1448×1086" },
  { src: "/marketing/witnessed.webp", label: "witnessed.webp", size: "1448×1086" },
];

const NAV = [
  ["phones", "Phone screens"],
  ["showcase", "Carousel"],
  ["how-it-works", "How it works"],
  ["begin", "Welcome thread"],
  ["mechanism", "Circle + ledger"],
  ["constellation", "Constellation"],
  ["orbit", "Mini orbit"],
  ["images", "Image assets"],
] as const;

function DemoHeader({ index, title, source }: { index: string; title: string; source: string }) {
  return (
    <div className="mx-auto mb-bd-32 flex max-w-[1280px] flex-col gap-bd-6 px-bd-24 min-[834px]:px-bd-large">
      <span className="font-bd-mono text-bd-micro uppercase tracking-[0.14em] text-bd-yellow">{index}</span>
      <h2 className="m-0 text-bd-h1 font-bold tracking-tight text-bd-text-primary">{title}</h2>
      <code className="font-bd-mono text-bd-caption text-bd-text-tertiary">{source}</code>
    </div>
  );
}

function Demo({ id, children }: { id: string; children: ReactNode }) {
  return (
    <div id={id} className="border-t border-white/10 pt-bd-64">
      {children}
    </div>
  );
}

export function App() {
  return (
    <div className="bd-marketing min-h-screen">
      <main>
        <header className="mx-auto max-w-[1280px] px-bd-24 pb-bd-48 pt-bd-64 min-[834px]:px-bd-large">
          <img src="/bestday-wordmark-white.png" alt="Bestday" className="mb-bd-32 h-auto w-[140px]" />
          <h1 className="m-0 text-bd-display font-bold tracking-tight text-bd-text-primary">Mockup demos</h1>
          <p className="m-0 mt-bd-12 max-w-[60ch] text-bd-body text-bd-text-secondary">
            Every mockup on the marketing page that is drawn in code, rendered from the real components, plus the
            image assets the page loads.
          </p>
          <nav className="mt-bd-24 flex flex-wrap gap-bd-8">
            {NAV.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                className="rounded-bd-pill border border-white/15 px-bd-12 py-bd-6 text-bd-caption text-bd-text-secondary no-underline transition-colors hover:border-bd-yellow/60 hover:text-bd-yellow"
              >
                {label}
              </a>
            ))}
          </nav>
        </header>

        <Demo id="phones">
          <DemoHeader index="01" title="Phone screens" source="ui/PhoneFrame.tsx + ui/ShowcaseArt.tsx" />
          <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-bd-32 px-bd-24 pb-bd-64 min-[834px]:grid-cols-4 min-[834px]:px-bd-large">
            {PHONES.map(({ variant, label }) => (
              <figure key={variant} className="m-0">
                <div className="mx-auto w-full max-w-[220px]">
                  <PhoneFrame>
                    <ShowcaseArt variant={variant} />
                  </PhoneFrame>
                </div>
                <figcaption className="mt-bd-12 text-center font-bd-mono text-bd-micro uppercase tracking-[0.12em] text-bd-text-tertiary">
                  {label} · variant="{variant}"
                </figcaption>
              </figure>
            ))}
          </div>
        </Demo>

        <Demo id="showcase-demo">
          <DemoHeader index="02" title="Product carousel" source="sections/ProductShowcase.tsx" />
          <ProductShowcase />
        </Demo>

        <Demo id="how-it-works-demo">
          <DemoHeader index="03" title="How it works accordion" source="sections/HowItWorks.tsx" />
          <HowItWorks />
        </Demo>

        <Demo id="begin-demo">
          <DemoHeader index="04" title="Welcome thread" source="sections/Begin.tsx → WelcomeThread" />
          <Begin />
        </Demo>

        <Demo id="mechanism-demo">
          <DemoHeader
            index="05"
            title="Circle glyph + ledger card"
            source="sections/Mechanism.tsx → CircleGlyph, ui/LedgerCard.tsx (hover the left card)"
          />
          <Mechanism />
        </Demo>

        <Demo id="constellation">
          <DemoHeader index="06" title="Constellation" source='ui/ConstellationArt.tsx — variant="open" and "filled"' />
          <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-bd-32 px-bd-24 pb-bd-64 min-[834px]:grid-cols-2 min-[834px]:px-bd-large">
            {(["open", "filled"] as const).map((variant) => (
              <figure key={variant} className="m-0 rounded-bd-2xl bg-bd-surface-1 p-bd-24 bd-bevel">
                <ConstellationArt letters={["R", "M", "T", "J", "S"]} variant={variant} label={`Constellation, ${variant}`} />
                <figcaption className="mt-bd-12 text-center font-bd-mono text-bd-micro uppercase tracking-[0.12em] text-bd-text-tertiary">
                  variant="{variant}"
                </figcaption>
              </figure>
            ))}
          </div>
        </Demo>

        <Demo id="orbit">
          <DemoHeader index="07" title="Mini orbit" source="ui/MiniOrbit.tsx — in the codebase, not currently on the page" />
          <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-bd-32 px-bd-24 pb-bd-64 min-[834px]:max-w-[720px] min-[834px]:px-bd-large">
            {[0, 5].map((count) => (
              <figure key={count} className="m-0 rounded-bd-2xl bg-bd-surface-1 p-bd-24 bd-bevel">
                <MiniOrbit count={count} />
                <figcaption className="mt-bd-12 text-center font-bd-mono text-bd-micro uppercase tracking-[0.12em] text-bd-text-tertiary">
                  count={count} {count === 0 ? "· alone" : "· witnessed"}
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="mx-auto max-w-[720px] px-bd-24 pb-bd-64 min-[834px]:px-bd-large">
            <LedgerCard label="a goal, entered" tallyLabel="noticed this week" marks={["— R.", "— M.", "— T."]} />
          </div>
        </Demo>

        <Demo id="images">
          <DemoHeader index="08" title="Image assets" source="public/marketing/*.webp, public/members/*.jpg, public/bestday-wordmark-white.png" />
          <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-bd-24 px-bd-24 pb-bd-64 min-[834px]:grid-cols-3 min-[834px]:px-bd-large">
            {IMAGES.map((image) => (
              <figure key={image.src} className="m-0">
                <div className="flex aspect-[4/5] items-center justify-center overflow-hidden rounded-bd-xl bg-bd-surface-1 bd-bevel">
                  <img src={image.src} alt={image.label} loading="lazy" className="h-full w-full object-contain" />
                </div>
                <figcaption className="mt-bd-8 font-bd-mono text-bd-micro text-bd-text-secondary">{image.label}</figcaption>
                <p className="m-0 font-bd-mono text-bd-micro text-bd-text-tertiary">{image.size}</p>
              </figure>
            ))}
          </div>
          <div className="mx-auto flex max-w-[1280px] flex-wrap gap-bd-16 px-bd-24 pb-bd-section min-[834px]:px-bd-large">
            {["r", "m", "t", "j", "s"].map((m) => (
              <figure key={m} className="m-0">
                <img src={`/members/${m}.jpg`} alt={`placeholder portrait ${m}`} className="h-bd-64 w-bd-64 rounded-full object-cover" />
                <p className="m-0 mt-bd-4 text-center font-bd-mono text-bd-micro text-bd-text-tertiary">{m}.jpg</p>
              </figure>
            ))}
          </div>
        </Demo>
      </main>
    </div>
  );
}
