/**
 * FAQ content for the SEO section. Targeted at search intent around
 * "mortgage overpayment calculator" and related queries.
 */
export interface FAQ {
  question: string;
  answer: string;
}

export const FAQS: FAQ[] = [
  {
    question: "How does a mortgage overpayment calculator work?",
    answer:
      "It runs two amortization schedules in parallel: one with your regular monthly payment only, and one with your overpayments applied on top. Each month, your payment first covers the interest charged on the remaining balance, and the rest reduces the principal. Overpayments go straight to principal, which lowers next month's interest, so more of your regular payment chips away at the loan — a compounding effect that speeds up payoff and cuts total interest.",
  },
  {
    question: "How much interest can I save by overpaying my mortgage?",
    answer:
      "It depends on your rate, balance, and how early you start. On a $320,000 loan at 6.5% over 30 years, overpaying just $50 a month from day one typically saves tens of thousands in interest and clears the mortgage over two years early. Use the calculator above to get an exact figure for your situation — the 'Total interest saved' card shows your net saving.",
  },
  {
    question: "Is it better to overpay monthly or as a lump sum?",
    answer:
      "Both work, but the timing matters. A lump sum applied earlier almost always saves more interest than the same amount spread over time, because it reduces the principal — and therefore the interest charged on it — for more months. Monthly overpayments are easier to sustain as a habit. The best strategy for many borrowers is a combination: a steady monthly overpayment plus occasional lump sums from bonuses or tax refunds.",
  },
  {
    question: "When should I start overpaying my mortgage?",
    answer:
      "As early as possible. Because interest is charged on the outstanding balance every month, every dollar you overpay in year one saves interest for the entire remaining term. Overpaying in the first few years of a mortgage is dramatically more powerful than the same overpayment made in the final years, when most of the interest has already been paid.",
  },
  {
    question: "Are mortgage overpayments applied at the start or end of the month?",
    answer:
      "It depends on your lender, but most treat an overpayment as reducing the principal after that month's regular payment has been processed (end of month). Some lenders apply it before interest is calculated (start of month), which saves a little more interest. This calculator lets you toggle between the two so you can model your lender's behaviour precisely.",
  },
  {
    question: "What happens if I overpay more than my remaining balance?",
    answer:
      "The calculator clamps the overpayment to your remaining balance — you only pay what's needed to clear the loan, and the mortgage is marked as paid off that month. You won't be charged for more than you owe.",
  },
  {
    question: "Will overpaying my mortgage reduce my monthly payment?",
    answer:
      "Usually no — unless you formally recast (re-amortize) the loan with your lender, your contractual monthly payment stays the same. Instead, overpayments shorten your term: you finish paying earlier, which is where the interest savings come from. If you want lower payments rather than a shorter term, ask your lender about a mortgage recast.",
  },
  {
    question: "Is overpaying better than investing the same money?",
    answer:
      "There's no universal answer. Overpaying a mortgage gives a guaranteed, tax-free return equal to your mortgage rate. Investing the same money could earn more, but with market risk and tax on gains. Many financially literate borrowers do both: overpay enough to feel secure, and invest the rest for growth. The calculator helps you see exactly what the 'guaranteed' side is worth.",
  },
];
