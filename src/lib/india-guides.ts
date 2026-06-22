/**
 * India-focused long-form educational guides.
 *
 * Each guide has 3-4 sections of genuinely useful, accurate copy aimed at
 * Indian home-loan borrowers. Content reflects 2024-2025 RBI guidelines
 * (zero prepayment penalty on floating-rate individual home loans),
 * Section 80C / 24(b) / 80EE tax provisions, and post-July 2024 LTCG
 * rules (10% on equity gains above ₹1.25 lakh).
 */

export interface Guide {
  id: string;
  title: string;
  excerpt: string;
  readTime: string;
  sections: { heading: string; body: string }[];
}

export const GUIDES: Guide[] = [
  {
    id: "save-lakhs-on-interest",
    title: "How to save lakhs on your home loan interest",
    excerpt:
      "A practical playbook for Indian home loan borrowers — why prepayment timing matters more than amount, and the three highest-leverage moves you can make this year.",
    readTime: "6 min read",
    sections: [
      {
        heading: "Why early prepayments dominate",
        body: "Indian home loans use reducing-balance amortisation — every month, interest is charged on the outstanding principal. In the first year of a 20-year ₹50 lakh loan at 8.50%, around 80% of each EMI is interest and only 20% reduces principal. A prepayment in year 1 lowers the principal for the remaining 19 years, saving interest every single month. A prepayment in year 18 saves interest for only 2 years. This is why even a small ₹2,000 monthly prepayment started in month 1 can save more total interest than a ₹5 lakh lump sum applied in year 15.",
      },
      {
        heading: "The three highest-leverage moves",
        body: "First, start a small monthly prepayment in the first year of the loan — even ₹2,000-3,000 a month compounds dramatically. Second, route your annual performance bonus (typically 1-2 months' salary) into the loan every year as a prepayment rather than spending it. Third, when interest rates peak (typically during RBI tightening cycles), consider a larger lump sum from savings — this locks in savings at the highest possible ROI before rates fall. None of these moves carry any cost on floating-rate individual home loans, since RBI prohibits prepayment charges.",
      },
      {
        heading: "Reduce tenure, not EMI",
        body: "When you prepay, your bank offers two choices: keep EMI the same and shorten the tenure, or keep tenure the same and lower the EMI. Always choose tenure reduction unless your monthly cash flow is constrained. On a ₹50 lakh loan at 8.50% with a ₹5 lakh prepayment in year 3, choosing tenure reduction typically saves ₹14-16 lakh in interest, while choosing EMI reduction saves only ₹4-5 lakh. The interest saving from tenure reduction is often 3-5x larger than from EMI reduction for the same prepayment.",
      },
      {
        heading: "Watch the tax angle",
        body: "Section 24(b) allows a deduction of up to ₹2 lakh per year on home loan interest for a self-occupied property. If your annual interest is already below ₹2 lakh (typically in the later years of a loan), prepayment reduces your taxable interest further and you lose the unused deduction — so the effective benefit of prepaying is reduced by the marginal tax rate you would have saved. For a 30% slab borrower, this means prepaying in the last few years is slightly less attractive than the headline ROI suggests. In early years when interest is well above ₹2 lakh, prepayment is fully as attractive as it appears.",
      },
    ],
  },
  {
    id: "prepayment-vs-investment",
    title: "Prepayment vs investment: which is better in India?",
    excerpt:
      "A framework for deciding whether to prepay your home loan or invest the surplus — comparing guaranteed tax-free returns against market-linked growth.",
    readTime: "7 min read",
    sections: [
      {
        heading: "The guaranteed return of prepayment",
        body: "Every rupee you prepay on your home loan reduces the outstanding principal, which reduces the interest charged on it for the remaining tenure. The return is guaranteed, equal to your home loan ROI, and tax-free — there is no income tax on the interest you avoid paying. So prepaying an 8.50% home loan is equivalent to a fixed-income investment earning 8.50% post-tax. For a borrower in the 30% slab, a bank FD earning 8.50% pre-tax would yield only about 5.95% post-tax — making prepayment clearly superior to FDs at the same headline rate.",
      },
      {
        heading: "The expected return of equity",
        body: "Indian equity mutual funds (especially Nifty 50 index funds and large-cap funds) have historically delivered 11-13% long-term returns over 10-15 year horizons, though past performance is not a guarantee of future returns. Gains above ₹1.25 lakh per year are taxed at 10% LTCG (post July 2024). For a 30% slab investor, a 12% pre-tax equity return becomes about 11.1% post-tax (12% minus 0.9% tax on gains above ₹1.25 lakh). Compared to an 8.50% post-tax prepayment return, equity offers a 2-3 percentage point expected premium — but with significant volatility and risk of loss in any given year.",
      },
      {
        heading: "A practical hybrid approach",
        body: "Most financially literate Indian borrowers do both: prepay enough to feel secure and reduce risk, and invest the rest for long-term growth. A common rule is to first build a 6-month emergency fund, then maximise Section 80C (₹1.5 lakh ELSS / PPF / EPF), then split the surplus 60:40 between equity SIPs and home loan prepayment. As you approach retirement or as interest rates peak, you can tilt more heavily towards prepayment to be debt-free before income drops.",
      },
      {
        heading: "When prepayment clearly wins",
        body: "Prepayment is unambiguously better in three scenarios: (1) you have low risk tolerance and would otherwise keep the money in FDs or savings accounts; (2) your home loan ROI is above 10% (e.g. older MCLR loans or loans on tier-2/3 properties) and refinancing is not feasible; (3) you are within 5-7 years of retirement and want to be debt-free. In each of these cases, the guaranteed tax-free return of prepayment outweighs the uncertain premium from equity.",
      },
    ],
  },
  {
    id: "emi-calculation-formula",
    title: "Understanding the EMI calculation formula",
    excerpt:
      "A clear walkthrough of how Indian banks compute your home loan EMI — the annuity formula, why interest is front-loaded, and how prepayment changes the math.",
    readTime: "5 min read",
    sections: [
      {
        heading: "The annuity formula",
        body: "Every Indian bank uses the same standard reducing-balance formula: EMI = P x r x (1+r)^n / ((1+r)^n - 1), where P is the loan principal, r is the monthly interest rate (annual rate divided by 12 and by 100), and n is the tenure in months. For a ₹50 lakh loan at 8.50% p.a. for 20 years, r = 0.007083 and n = 240, giving an EMI of approximately ₹43,391. The formula ensures the EMI stays constant even as the interest-to-principal ratio shifts each month — which is the defining feature of an amortising loan.",
      },
      {
        heading: "Why interest is front-loaded",
        body: "In month 1, interest is charged on the full ₹50 lakh principal — about ₹35,417 — and only ₹7,974 of the EMI goes to principal. In month 120 (halfway through the tenure), interest has dropped to about ₹24,000 and principal has risen to about ₹19,000. The 50/50 crossover point on a 20-year loan at 8.50% is around month 130 — meaning more than half the tenure is dominated by interest payments. This is why prepayments in the first 5-7 years are dramatically more impactful than the same prepayments in the last 5 years.",
      },
      {
        heading: "How prepayment changes the math",
        body: "When you prepay, the amount goes directly to reducing the principal — it does not pay future interest. So a ₹1 lakh prepayment in year 1 reduces the principal from ₹49.2 lakh to ₹49.1 lakh, and every subsequent month's interest is calculated on the lower figure. Over 19 remaining years, that ₹1 lakh saves roughly ₹1.85 lakh of interest at 8.50% — a near-doubling of the original prepayment. The same ₹1 lakh applied in year 15 saves only about ₹25,000 of interest over the remaining 5 years.",
      },
      {
        heading: "Why ROI changes shift your tenure, not EMI",
        body: "When RBI changes the repo rate, your floating-rate home loan ROI changes within days to a quarter. Banks typically keep the EMI constant and adjust the tenure — so a 50 bps cut on a ₹50 lakh 20-year loan with 15 years left might extend the tenure by 12-18 months (or shorten it, depending on direction) while keeping the EMI at ₹43,391. You can request the bank to revise the EMI instead if you prefer — useful if the EMI was a stretch at the original rate, or if you want to lock in a lower EMI after a rate cut.",
      },
    ],
  },
  {
    id: "emi-reduction-vs-tenure-reduction",
    title: "When to choose EMI reduction vs tenure reduction",
    excerpt:
      "A decision framework for what to do after a prepayment — keep the EMI and finish early, or lower the EMI and free up monthly cash flow.",
    readTime: "5 min read",
    sections: [
      {
        heading: "The two options after a prepayment",
        body: "When you prepay part of your outstanding principal, your bank offers two choices. Option 1 (tenure reduction): keep the EMI unchanged and shorten the remaining tenure — the loan ends sooner. Option 2 (EMI reduction): keep the original tenure unchanged and lower the EMI — your monthly outflow drops. Both are free of charge on floating-rate individual home loans under RBI guidelines. The choice is made at the time of prepayment and applies to that prepayment; future prepayments can use a different choice.",
      },
      {
        heading: "Why tenure reduction saves more interest",
        body: "Tenure reduction repays the principal faster, so the loan ends sooner and stops accruing interest earlier. On a ₹50 lakh loan at 8.50% with a ₹5 lakh prepayment in year 3, choosing tenure reduction typically saves ₹14-16 lakh in interest and clears the loan 4-5 years early. Choosing EMI reduction on the same prepayment saves only ₹4-5 lakh over the original tenure, because the loan continues accruing interest for the full 20 years. The interest-saving gap is typically 3-5x in favour of tenure reduction.",
      },
      {
        heading: "When EMI reduction makes sense",
        body: "Choose EMI reduction when your monthly cash flow is constrained — for example after a job change, a salary cut, a medical expense, or a child's education loan. It also makes sense if you intend to redirect the freed-up EMI amount into higher-yielding investments (equity mutual funds) and you are confident of earning more than your home loan ROI after tax. A third scenario is when your existing EMI was a stretch on your FOIR at sanction, and reducing it gives you headroom to take another loan (e.g. a car or education loan) without breaching the 50-55% FOIR cap.",
      },
      {
        heading: "The middle-path strategy",
        body: "A common disciplined strategy is: choose EMI reduction to formally lower your contractual EMI (giving cash-flow safety), then continue paying the original higher EMI as a monthly prepayment whenever you have the surplus. This way you get the safety of a lower committed EMI while still capturing most of the interest saving of tenure reduction. If your income drops, you simply stop the prepayment and pay only the reduced EMI — no renegotiation needed.",
      },
    ],
  },
  {
    id: "cibil-score-and-roi",
    title: "How CIBIL score affects your home loan ROI",
    excerpt:
      "Why a 50-point CIBIL improvement can save you lakhs — the tiered ROI structure at Indian banks, and what to do before applying for a home loan.",
    readTime: "6 min read",
    sections: [
      {
        heading: "What CIBIL score is and why banks care",
        body: "CIBIL score is a 3-digit number between 300 and 900 that summarises your credit history based on past loan and credit card repayment behaviour, reported by banks to credit bureaus (CIBIL, Equifax, Experian, CRIF). Banks use it as the single biggest signal of your repayment risk. Most Indian banks prefer 750+ for the best home loan ROI; 700-749 may be approved at a higher rate; below 700 is often declined or sanctioned only with a co-applicant and collateral. CIBIL score is updated monthly and reflects the last 24-36 months of your repayment behaviour.",
      },
      {
        heading: "Tiered ROI at Indian banks",
        body: "Most Indian banks (SBI, HDFC, ICICI, Axis) use tiered ROI bands based on CIBIL score. As of 2024, a salaried borrower with CIBIL 800+ might get a home loan at 8.40-8.50%, while the same borrower with CIBIL 750-799 might be offered 8.65-8.75%, and CIBIL 700-749 might be offered 8.90-9.10%. A 50 bps ROI difference on a ₹50 lakh 20-year loan costs roughly ₹3,300 extra interest per year — about ₹65,000 over the tenure. A 100 bps difference costs about ₹1.3 lakh over the tenure. Improving your CIBIL before applying is one of the highest-leverage financial moves available.",
      },
      {
        heading: "How to improve CIBIL score before applying",
        body: "First, never miss an EMI or credit card payment — payment history is the single biggest factor (35% weight). Second, keep credit card utilisation below 30% of your limit — high utilisation signals over-leverage. Third, avoid applying for multiple loans or credit cards within 6 months of your home loan application — each hard enquiry lowers your score by 5-10 points for a few months. Fourth, check your CIBIL report (one free report per bureau per year at cibil.com) and dispute any errors. Fifth, keep old credit cards open even if unused — long credit history helps. Most borrowers can move from 720 to 780 in 6-9 months with disciplined behaviour.",
      },
      {
        heading: "What if your CIBIL is below 700",
        body: "If your CIBIL is below 700, consider delaying your home loan application by 6-12 months while you rebuild the score. If you must borrow now, options include: (1) adding a co-applicant with a stronger CIBIL (typically a spouse or parent); (2) applying through a bank where you have a long salary-account relationship, which can override a borderline score; (3) accepting a higher ROI for the first 2-3 years and then requesting a re-pricing once your CIBIL has improved. Note that taking a higher-ROI loan now and then doing a balance transfer after CIBIL improves is a viable strategy — most balance transfers happen at 12-24 months post disbursal.",
      },
    ],
  },
];
