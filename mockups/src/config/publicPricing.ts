/**
 * Public prices for the landing page and /marketing.
 *
 * Premium is $10/month or $99/year.
 * Premium Plus is $100/month or $1,000/year.
 * Change the numbers here only. The quiz offer line in public/quiz/index.html
 * is static HTML and must be updated by hand if the starting price changes.
 */
export type BillingPeriod = "month" | "year";

export interface PublicPlan {
  name: string;
  prices: Record<BillingPeriod, number>;
}

export const publicPlans = {
  premium: {
    name: "Premium",
    prices: { month: 10, year: 99 },
  },
  plus: {
    name: "Premium Plus",
    prices: { month: 100, year: 1000 },
  },
} as const satisfies Record<string, PublicPlan>;

export const billingChoices: { period: BillingPeriod; label: string }[] = [
  { period: "month", label: "Monthly" },
  { period: "year", label: "Yearly" },
];

/** Yearly is the default on every plan toggle. */
export const defaultBillingPeriod: BillingPeriod = "year";

export const formatAmount = (amount: number): string =>
  amount.toLocaleString("en-US");

export const periodSuffix = (period: BillingPeriod): string =>
  period === "year" ? "/year" : "/month";

export const perPeriodPhrase = (period: BillingPeriod): string =>
  period === "year" ? "a year" : "a month";

export const billedPhrase = (period: BillingPeriod): string =>
  period === "year" ? "billed annually" : "billed monthly";

export const planAmount = (plan: PublicPlan, period: BillingPeriod): string =>
  formatAmount(plan.prices[period]);

/** "Premium $10/month or $99/year" */
export const planMetaLabel = (plan: PublicPlan): string =>
  `${plan.name} $${formatAmount(plan.prices.month)}/month or $${formatAmount(plan.prices.year)}/year`;

/** "Premium is $10 a month or $99 a year. Premium Plus is $100 a month or $1,000 a year." */
export const publicPriceSummary = (): string => {
  const line = (plan: PublicPlan) =>
    `${plan.name} is $${formatAmount(plan.prices.month)} a month or $${formatAmount(plan.prices.year)} a year`;
  return `${line(publicPlans.premium)}. ${line(publicPlans.plus)}.`;
};
