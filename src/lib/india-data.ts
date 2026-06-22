/**
 * India-focused bank data for the home loan platform.
 *
 * Covers the four largest Indian home-loan lenders as of 2024-2025:
 * SBI, HDFC Bank (post merger with HDFC Ltd), ICICI Bank and Axis Bank.
 *
 * Rates, fees and policies are realistic 2024-2025 figures sourced from
 * publicly available bank pages and RBI guidelines. They are indicative
 * marketing/educational copy and should be confirmed with the bank before
 * taking a loan — actual ROI depends on CIBIL, income, loan-to-value and
 * whether the rate is linked to a benchmark (repo, T-Bill, OIS).
 */

export interface BankInfo {
  id: "sbi" | "hdfc" | "icici" | "axis";
  name: string;
  shortName: string;
  tagline: string;
  /** Indicative annual interest rate (percent) used as a default in the calculator. */
  defaultRate: number;
  /** Human-readable rate range, e.g. "8.40% – 9.30% p.a." */
  rateRange: string;
  maxTenureYears: number;
  maxLoanAmount: string;
  processingFee: string;
  prepaymentPolicy: string;
  features: string[];
  eligibility: string[];
  about: string;
  contentBlocks: { heading: string; body: string }[];
}

export const BANKS: BankInfo[] = [
  {
    id: "sbi",
    name: "SBI Home Loan",
    shortName: "SBI",
    tagline: "India's largest lender, repo-linked transparency",
    defaultRate: 8.4,
    rateRange: "8.40% – 9.30% p.a.",
    maxTenureYears: 30,
    maxLoanAmount: "Up to ₹15 Crore",
    processingFee: "0.35% of loan amount (GST extra)",
    prepaymentPolicy:
      "No prepayment or foreclosure charges on floating-rate home loans for individual borrowers, as per RBI guidelines. Fixed-rate loans may attract 2% charges on the outstanding principal.",
    features: [
      "Repo Rate Linked Home Loan (RLLR) — rate resets automatically when RBI changes repo",
      "No prepayment penalty on floating rate loans for individuals",
      "Longest tenure in the market — up to 30 years, lowering your EMI",
      "Top-up loan available alongside the home loan for renovation or furniture",
      "Heritage (Yono) digital application with e-KYC and instant in-principle approval",
      "Concession of 5 bps for women borrowers (subject to scheme)",
    ],
    eligibility: [
      "Salaried individuals aged 18-70 with minimum net monthly income of ₹25,000",
      "Self-employed professionals and businessmen with 2+ years of continuous income",
      "CIBIL score of 700+ preferred; lower scores may be considered with higher ROI",
      "Loan-to-Value (LTV) up to 90% for loans up to ₹30 lakh",
    ],
    about:
      "State Bank of India is the country's largest home loan lender by book size, with a network of more than 22,000 branches. Its repo-linked product passes on RBI rate cuts quickly, and the absence of prepayment penalty on floating-rate loans makes it ideal for borrowers who plan to prepay and foreclose early.",
    contentBlocks: [
      {
        heading: "How an SBI home loan EMI is calculated",
        body: "SBI calculates EMI using the standard reducing-balance method: EMI = P x r x (1+r)^n / ((1+r)^n - 1), where P is the principal, r is the monthly interest rate (annual rate divided by 12 and by 100), and n is the tenure in months. A ₹50 lakh loan at 8.40% p.a. for 20 years works out to an EMI of about ₹43,088. The interest portion is front-loaded — in the first year nearly 80% of each EMI is interest, which is why early prepayments save the most.",
      },
      {
        heading: "SBI prepayment and foreclosure rules",
        body: "Floating-rate SBI home loans for individuals carry zero prepayment and foreclosure charges — you can pay any amount, any time, without penalty. Partial prepayments are adjusted against the outstanding principal, which reduces the interest on the remaining balance. You can choose to either reduce your EMI or reduce your remaining tenure; reducing tenure maximises interest savings while reducing EMI improves monthly cash flow.",
      },
      {
        heading: "How SBI's repo-linked rate moves",
        body: "SBI Home Loan linked to RLLR (Repo Linked Lending Rate) resets within five working days of an RBI repo change, ensuring transparent and quick transmission of monetary policy. The effective rate is RLLR plus a spread decided at sanction based on your CIBIL score and loan-to-value. Existing borrowers on older base rate or MCLR benchmarks can switch to RLLR by paying a one-time conversion fee, which often pays back within a year when rates fall.",
      },
      {
        heading: "When to choose SBI over other banks",
        body: "SBI is best suited for borrowers who value transparency, want the longest possible tenure to keep EMIs low, and plan to make prepayments periodically. The lack of prepayment penalty, combined with repo-linked transmission, makes it a strong default choice. However, private banks like HDFC, ICICI or Axis may offer slightly lower spreads for salaried borrowers with CIBIL 800+ or for loans backed by approved builder projects.",
      },
    ],
  },
  {
    id: "hdfc",
    name: "HDFC Bank Home Loan",
    shortName: "HDFC",
    tagline: "The housing finance specialist, now merged into HDFC Bank",
    defaultRate: 8.5,
    rateRange: "8.50% – 9.40% p.a.",
    maxTenureYears: 30,
    maxLoanAmount: "Up to ₹15 Crore",
    processingFee: "Up to 0.50% of loan amount (GST extra)",
    prepaymentPolicy:
      "No prepayment or foreclosure charges on floating-rate home loans for individual borrowers, per RBI guidelines. Housing loans on fixed rate may attract 2% prepayment charges on outstanding principal plus applicable taxes.",
    features: [
      "Decades of specialised housing-finance experience (post HDFC Ltd merger)",
      "Instant digital sanction via HDFC Bank app in under 10 minutes for salaried applicants",
      "No prepayment charges on floating rate home loans for individuals",
      "Special ROI bands for women borrowers and CIBIL 800+ applicants",
      "Top-up loan up to ₹50 lakh for any personal purpose after 12 months of repayment",
      "Balance transfer facility with top-up to consolidate higher-rate loans",
    ],
    eligibility: [
      "Salaried Indian residents aged 21-65 with minimum monthly income of ₹25,000",
      "Self-employed professionals (CAs, doctors, architects) and businessmen with 3+ years in business",
      "CIBIL score of 750+ for the best ROI; minimum 700 considered",
      "LTV up to 90% for loans up to ₹30 lakh, 80% for ₹30-75 lakh, 75% above ₹75 lakh",
    ],
    about:
      "Following the July 2023 merger of HDFC Limited into HDFC Bank, all home loans are now originated and serviced by HDFC Bank. It remains the largest private-sector home loan provider in India, known for digital-first processing, fast disbursal and competitive spreads for high-CIBIL salaried borrowers.",
    contentBlocks: [
      {
        heading: "How HDFC Bank structures your home loan EMI",
        body: "HDFC Bank uses the standard reducing-balance amortisation method, identical to other Indian lenders. The EMI for a ₹50 lakh loan at 8.50% for 20 years is approximately ₹43,391, of which the first month's interest is ₹35,417 and the principal portion is just ₹7,974. Because interest is calculated on the outstanding principal, every prepayment — even a small one — reduces the interest portion of every subsequent EMI for the rest of the tenure.",
      },
      {
        heading: "HDFC prepayment and foreclosure policy",
        body: "For floating-rate home loans taken by individual borrowers, HDFC Bank levies no prepayment or foreclosure charges — consistent with RBI's June 2024 clarification that extended the no-penalty rule to all individual borrowers regardless of loan amount. Partial prepayments can be made through NetBanking or the mobile app and are typically reflected in the principal within one business day. Borrowers can choose between reducing the EMI or reducing the tenure at the time of prepayment.",
      },
      {
        heading: "Why CIBIL score matters for HDFC ROI",
        body: "HDFC Bank offers tiered ROI based on CIBIL score and gender. As of 2024, salaried men with CIBIL 800+ may get rates from 8.50%, while the same borrower with CIBIL 750-799 may be offered 8.65-8.75%. A 25 bps difference on a ₹50 lakh 20-year loan works out to roughly ₹3,300 of extra interest every year — over ₹65,000 across the tenure. Improving your CIBIL score before applying is one of the highest-leverage financial moves available.",
      },
      {
        heading: "HDFC balance transfer with top-up",
        body: "If you have an existing home loan at a higher ROI, HDFC Bank allows you to transfer the outstanding principal to HDFC and take an additional top-up loan at the same rate. The top-up can be used for any purpose — business expansion, education, medical expenses — and interest on a top-up used for home renovation may be eligible for Section 24(b) income tax deduction up to ₹30,000 per year, subject to conditions.",
      },
    ],
  },
  {
    id: "icici",
    name: "ICICI Bank Home Loan",
    shortName: "ICICI",
    tagline: "Instant digital sanction, special rates for women borrowers",
    defaultRate: 8.5,
    rateRange: "8.50% – 9.60% p.a.",
    maxTenureYears: 30,
    maxLoanAmount: "Up to ₹15 Crore",
    processingFee: "0.50% – 1.00% of loan amount (GST extra)",
    prepaymentPolicy:
      "No prepayment or foreclosure charges on floating-rate home loans for individual borrowers. Fixed-rate loans may attract 2% charges plus taxes on outstanding principal prepaid.",
    features: [
      "Insta Home Loan: in-principle sanction in seconds via iMobile Pay for existing customers",
      "Special 5-10 bps ROI concession for women borrowers (first applicant)",
      "Pre-approved home loan offer with validity of up to 6 months for select customers",
      "Zero prepayment and foreclosure charges on floating rate individual loans",
      "Top-up loan at the same ROI as the home loan, with no end-use restriction",
      "STEP-UP EMI option for young salaried borrowers expecting income growth",
    ],
    eligibility: [
      "Salaried Indian residents aged 21-65 with minimum income of ₹25,000 per month",
      "Self-employed with minimum 3 years of business continuity and ITR filed",
      "CIBIL score of 750+ preferred; rates improve sharply above 800",
      "LTV up to 90% for loans up to ₹30 lakh as per RBI norms",
    ],
    about:
      "ICICI Bank is the third-largest private-sector home loan lender in India, known for its digital-first Insta Home Loan sanction, women-borrower concessions and step-up EMI structures tailored to young salaried professionals whose income is expected to grow.",
    contentBlocks: [
      {
        heading: "How ICICI Bank calculates your EMI",
        body: "ICICI uses the standard reducing-balance amortisation formula identical to the rest of the Indian market. For a ₹50 lakh loan at 8.50% p.a. and a 20-year tenure, the EMI is ₹43,391, with interest in the first month of ₹35,417 and principal of just ₹7,974. The interest-to-principal ratio inverts only after the 13th year — which is why prepayments made in the first 5-7 years deliver outsized interest savings.",
      },
      {
        heading: "ICICI prepayment and foreclosure rules",
        body: "Floating-rate home loans for individual borrowers carry no prepayment or foreclosure charges — confirmed by RBI's June 2024 directive extending the rule to loans of all ticket sizes. Prepayments can be initiated online through iMobile Pay or NetBanking with no paperwork for amounts up to a threshold. Borrowers must explicitly choose whether each prepayment reduces EMI or tenure; choosing tenure reduction maximises interest savings.",
      },
      {
        heading: "ICICI women-borrower ROI concession",
        body: "When a woman is the first or sole applicant, ICICI offers a 5-10 bps concession on the ROI. On a ₹50 lakh 20-year loan, a 10 bps saving is roughly ₹340 per month — about ₹81,000 over the full tenure. Even if a woman is a co-applicant and not a financial contributor, listing her as first applicant can unlock this concession while also allowing her to claim Section 24(b) interest deduction up to ₹2 lakh per year on a self-occupied property.",
      },
      {
        heading: "Step-up EMI for young borrowers",
        body: "ICICI's step-up EMI option starts the loan with a lower EMI that increases by a fixed percentage (typically 5-8%) every few years, matching expected salary growth. This is useful for borrowers in their 20s and early 30s who expect income to rise sharply. The trade-off is that more interest accrues in the early years, so total interest paid is higher than a level EMI loan of the same tenure — making prepayments in later years especially valuable.",
      },
    ],
  },
  {
    id: "axis",
    name: "Axis Bank Home Loan",
    shortName: "Axis",
    tagline: "Competitive spreads, fast digital processing for salaried",
    defaultRate: 8.75,
    rateRange: "8.75% – 9.65% p.a.",
    maxTenureYears: 30,
    maxLoanAmount: "Up to ₹10 Crore",
    processingFee: "Up to 1.00% of loan amount (GST extra)",
    prepaymentPolicy:
      "No prepayment or foreclosure charges on floating-rate home loans for individual borrowers per RBI guidelines. Loans on fixed rate may attract 2% charges plus taxes on amounts prepaid during the fixed-rate period.",
    features: [
      "Repo-linked (BRLLR) interest rate with quarterly reset on the outstanding principal",
      "Instant digital sanction for salaried borrowers via Axis Mobile or open.ai platform",
      "No prepayment charges on floating-rate individual home loans",
      "Higher LTV of up to 90% for loans up to ₹30 lakh",
      "Top-up loan of up to ₹50 lakh at home loan ROI, no end-use restriction",
      "Dedicated relationship manager for loans above ₹1 crore",
    ],
    eligibility: [
      "Salaried Indian residents aged 21-65 with minimum monthly income of ₹30,000",
      "Self-employed professionals and businesses with 3+ years of operations and ITR filed",
      "CIBIL score of 750+ for the best ROI; 700-749 may be considered with pricing impact",
      "Maximum FOIR (fixed obligations to income ratio) of 50-55%",
    ],
    about:
      "Axis Bank is the fourth-largest private-sector bank in India and offers home loans with repo-linked transparency, fast digital sanction for salaried borrowers and competitive spreads for high-CIBIL applicants. It is popular among salaried professionals in metros and tier-1 cities.",
    contentBlocks: [
      {
        heading: "How Axis Bank calculates EMI",
        body: "Axis Bank uses the standard reducing-balance amortisation method. A ₹50 lakh loan at 8.75% p.a. for 20 years results in an EMI of approximately ₹44,186, with the first month's interest at ₹36,458 and principal at ₹7,728. The EMI stays fixed for the duration of the loan unless the borrower prepays, but the proportion of interest-to-principal shifts each month — by year 10, roughly half of every EMI goes to principal.",
      },
      {
        heading: "Axis Bank prepayment and foreclosure",
        body: "Floating-rate home loans for individual borrowers carry zero prepayment and foreclosure charges per RBI guidelines, regardless of loan amount. Borrowers can make partial prepayments through Axis Mobile or Internet Banking, and the prepaid amount is adjusted against outstanding principal typically within one working day. Axis Bank allows the borrower to choose whether each prepayment reduces EMI or tenure — reducing tenure always produces the larger interest saving.",
      },
      {
        heading: "Axis repo-linked rate and reset",
        body: "Axis Bank home loans are linked to BRLLR (Benchmark Repo Linked Lending Rate), which is the repo rate plus a bank-set spread. The rate is reset quarterly on the outstanding principal, meaning any RBI repo change reflects on your EMI within at most three months. Borrowers on legacy MCLR or base rate benchmarks can switch to BRLLR by paying a small conversion fee — typically worthwhile when the rate gap exceeds 25-50 bps.",
      },
      {
        heading: "Axis FOIR and how much loan you qualify for",
        body: "Axis Bank, like most Indian lenders, applies a FOIR (Fixed Obligations to Income Ratio) cap of around 50-55%. This means all your existing EMIs (including the proposed home loan EMI) should not exceed 50-55% of your net monthly income. For a salaried borrower earning ₹1,00,000 net per month, this caps the home loan EMI at around ₹40,000 after accounting for any existing EMIs — translating to a maximum eligible loan of roughly ₹48 lakh at 8.75% for 20 years. Increasing tenure or prepaying existing EMIs can unlock a higher eligibility.",
      },
    ],
  },
];

/**
 * Look up a bank by its id. Returns undefined if not found.
 */
export function getBank(id: string): BankInfo | undefined {
  return BANKS.find((b) => b.id === id);
}
