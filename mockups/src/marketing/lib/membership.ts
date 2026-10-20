/**
 * What a member gets, stated once.
 *
 * Pricing and the membership section both present the offer. Keeping the copy and the prices here
 * means they can never disagree, and a price change is one edit.
 *
 * Every line here is backed by the product as it ships today. No stats, no testimonials.
 */

import { formatAmount, publicPlans, type PublicPlan } from "@/config/publicPricing";

export type Billing = "monthly" | "yearly";

export interface Price {
  amount: string;
  period: string;
  /** The price put another way, under the amount on the pricing page. */
  note: string;
}

export interface Tier {
  label: string;
  badge?: string;
  prices: Record<Billing, Price>;
  body: string;
  features: string[];
}

/** Both prices come from src/config/publicPricing.ts, so a price change is one edit and no page disagrees. */
const pricesOf = (plan: PublicPlan): Record<Billing, Price> => {
  const perMonth = (plan.prices.year / 12).toLocaleString("en-US", { maximumFractionDigits: 2 });
  return {
    yearly: { amount: `$${formatAmount(plan.prices.year)}`, period: "/year", note: `About $${perMonth} a month, billed once a year.` },
    monthly: { amount: `$${formatAmount(plan.prices.month)}`, period: "/month", note: `Or $${formatAmount(plan.prices.year)} a year.` },
  };
};

/* Feature lines are deliberately terse. Each one names a capability and stops. */
export const TIERS: Tier[] = [
  {
    label: "Premium",
    prices: pricesOf(publicPlans.premium),
    body: "Your goals, your Circle, and a Companion that watches for drift.",
    features: [
      "Unlimited goals, by category",
      "A Circle of up to 5",
      "Weekly check-ins and Monday messages",
      "Three AI companions",
      "Progress your Circle can see",
    ],
  },
  {
    label: "Premium Plus",
    badge: "Most committed",
    prices: pricesOf(publicPlans.plus),
    body: "A Circle ten times the size, and a specialist Companion for every part of your life.",
    features: [
      "Everything in Premium",
      "A Circle of up to 50",
      "Ten specialist AI companions",
      "Anti-Drift: a weekly check that catches the slip",
    ],
  },
];

export type PromiseKey = "companion" | "coaches" | "community" | "founder";

export interface MemberPromise {
  key: PromiseKey;
  /** The benefit, in the member's terms. */
  title: string;
  /** How Bestday delivers it, in one sentence. */
  body: string;
}

/**
 * What membership adds beyond the three steps in How it works. The Circle and the Monday check-in are
 * deliberately not here: How it works already explains them, and saying them twice made the reader skim.
 */
export const PROMISES: MemberPromise[] = [
  {
    key: "companion",
    title: "An AI Companion that catches drift.",
    body: "It reads your check-ins, spots the slip early, and nudges you back before a missed week becomes a quit.",
  },
  {
    key: "coaches",
    title: "A specialist coach for each part of your life.",
    body: "AI coaches for fitness, money, relationships, career, business, faith and wellbeing, each with its own style. Included in Premium Plus.",
  },
  {
    key: "community",
    title: "Share your progress with your community.",
    body: "Turn any goal into a progress card and share it to Instagram, WhatsApp and more, so the people around you can cheer you on.",
  },
  {
    key: "founder",
    title: "Help getting started.",
    body: "Kay, our founder, holds one welcome call per cohort each month, to help you pick the right people or make the first ask.",
  },
];
