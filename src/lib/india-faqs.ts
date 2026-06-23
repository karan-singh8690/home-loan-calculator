/**
 * India-focused FAQ content, grouped by calculator view so the UI can
 * surface the most relevant Q&As alongside each section.
 *
 * All answers use Indian home-loan terminology (EMI, principal, tenure,
 * prepayment, foreclosure, outstanding principal, ROI, CIBIL, RBI, lakh,
 * crore) and reflect 2024-2025 RBI guidelines — in particular the rule
 * that floating-rate home loans to individual borrowers carry zero
 * prepayment / foreclosure charges regardless of loan amount.
 */

export interface FaqGroup {
  view: string;
  faqs: { question: string; answer: string }[];
}

export const INDIA_FAQS: FaqGroup[] = [
  {
    view: "prepayment",
    faqs: [
      {
        question: "Are there any prepayment charges on Indian home loans?",
        answer:
          "No. As per RBI guidelines updated in June 2024, floating-rate home loans availed by individual borrowers — for any purpose and of any amount — cannot attract prepayment or foreclosure charges. This applies to all banks and NBFCs. The rule does not apply to fixed-rate home loans or to loans availed by non-individuals (companies, LLPs, trusts), which may carry up to 2% charges plus taxes.",
      },
      {
        question: "What is the difference between partial prepayment and foreclosure?",
        answer:
          "A partial prepayment is when you pay a part of the outstanding principal in addition to your regular EMI — the loan continues with a reduced principal. Foreclosure is when you pay the entire outstanding principal in one go and close the loan fully. Both are free of charge on floating-rate individual home loans; you typically initiate either through NetBanking or by submitting a prepayment request at your branch.",
      },
      {
        question: "Should I reduce my EMI or reduce my tenure when I prepay?",
        answer:
          "Reducing tenure almost always saves more total interest because the principal is repaid faster and the loan closes sooner. Reducing EMI improves monthly cash flow but extends the original tenure, so the loan accrues interest for longer. As a rule of thumb, choose tenure reduction if you can comfortably continue the existing EMI, and choose EMI reduction only if your income has dropped or you need monthly headroom.",
      },
      {
        question: "How much can I save by prepaying ₹1 lakh every year?",
        answer:
          "On a ₹50 lakh home loan at 8.50% for 20 years, prepaying ₹1 lakh every year from year 1 typically saves ₹18-22 lakh in total interest and shortens the tenure by around 5-6 years. The earlier you start, the larger the saving — the same ₹1 lakh applied in year 1 saves roughly 4-5x as much interest as the same amount applied in year 15.",
      },
      {
        question: "Is there a minimum amount I need to prepay?",
        answer:
          "Most banks do not impose a statutory minimum for partial prepayment, but they may set a practical minimum (often ₹10,000 or one EMI) to avoid processing very small transactions. Some banks cap the number of free prepayments per year on legacy products — check your sanction letter. On repo-linked floating-rate individual loans, RBI's zero-charge rule applies regardless of frequency.",
      },
      {
        question: "Does prepayment affect my CIBIL score?",
        answer:
          "No — a prepayment itself does not negatively affect your CIBIL score. In fact, lowering your outstanding principal can improve your credit utilisation ratio and may have a small positive effect over time. What matters for CIBIL is that you continue to pay your regular EMI on time. Prepayments are reported to bureaus as normal account updates, not as separate events.",
      },
    ],
  },
  {
    view: "emi",
    faqs: [
      {
        question: "How is home loan EMI calculated in India?",
        answer:
          "Indian banks use the standard reducing-balance annuity formula: EMI = P x r x (1+r)^n / ((1+r)^n - 1), where P is the principal, r is the monthly interest rate (annual rate divided by 12 and by 100), and n is the tenure in months. For a ₹50 lakh loan at 8.50% p.a. for 20 years (240 months), this works out to an EMI of approximately ₹43,391. The EMI stays fixed for the tenure unless ROI changes or you prepay.",
      },
      {
        question: "What is the EMI for a ₹50 lakh home loan for 20 years?",
        answer:
          "At an indicative 8.50% p.a. ROI, the EMI is about ₹43,391 per month. At 8.40% (SBI's starting rate) it is around ₹43,088; at 9.00% it is around ₹44,986. Even a 50 bps difference moves the EMI by ₹800-900 per month and the total interest by ₹2 lakh over the tenure — which is why even small ROI negotiations matter.",
      },
      {
        question: "Does my EMI change when RBI changes the repo rate?",
        answer:
          "For repo-linked home loans (RLLR / BRLLR), the effective rate resets within days to a quarter of an RBI repo change. Banks typically keep the EMI constant and instead adjust the tenure — so a rate cut shortens your tenure and a rate hike extends it. You can request the bank to revise the EMI instead if you prefer — useful if your EMI was a stretch at the original rate.",
      },
      {
        question: "What happens to EMI if I prepay part of the principal?",
        answer:
          "By default most banks keep your EMI unchanged and shorten your remaining tenure — this is what the calculator on this page models. If you prefer, you can submit a written request asking the bank to reduce the EMI instead and keep the tenure the same. Reducing EMI improves cash flow but saves less interest than reducing tenure.",
      },
      {
        question: "Can I increase my EMI midway through the loan?",
        answer:
          "Yes. Most banks allow you to increase the EMI — typically via a step-up instruction or by setting up a standing instruction for the additional amount as a prepayment. Increasing your EMI is functionally identical to a monthly prepayment: the excess over the contractual EMI goes directly to principal and shortens the tenure, saving interest.",
      },
      {
        question: "What is a step-up EMI home loan?",
        answer:
          "A step-up EMI loan starts with a lower EMI that increases by a fixed percentage (typically 5-8%) every few years, matching expected salary growth. This helps young salaried borrowers qualify for a larger loan today because the initial EMI is lower. The trade-off is higher total interest — early EMIs cover mostly interest, so prepayments in the early years are especially powerful on a step-up loan.",
      },
    ],
  },
  {
    view: "reduce-emi-vs-tenure",
    faqs: [
      {
        question: "What is the difference between reducing EMI and reducing tenure?",
        answer:
          "When you prepay, your bank offers two choices: (1) keep the EMI the same and shorten the tenure, or (2) keep the tenure the same and lower the EMI. Reducing tenure maximises interest saving because the loan ends sooner. Reducing EMI lowers your monthly outflow but extends the original tenure, so the loan accrues interest for longer.",
      },
      {
        question: "Which option saves more interest?",
        answer:
          "Reducing tenure always saves more interest, sometimes 3-5x more than reducing EMI for the same prepayment. On a ₹50 lakh loan at 8.50% with a ₹5 lakh prepayment in year 3, choosing tenure reduction typically saves around ₹14-16 lakh in interest, while choosing EMI reduction saves only ₹4-5 lakh over the original tenure.",
      },
      {
        question: "When does reducing EMI make sense?",
        answer:
          "Reducing EMI is sensible when your monthly cash flow is constrained — for example after a job change, a salary cut, or a large unexpected expense. It can also make sense if you intend to redirect the freed-up EMI amount into higher-yielding investments (equity mutual funds, etc.) and you are confident of earning more than your home loan ROI after tax.",
      },
      {
        question: "Can I switch between EMI reduction and tenure reduction later?",
        answer:
          "In practice, each prepayment locks in your choice for that prepayment. Future prepayments can use a different choice. Some banks also allow you to re-amortise the loan once a year (often called a recast) by paying a small fee. Check your bank's specific policy — most PSU banks (SBI, PNB, BoB) are flexible, while some private banks limit free recasts.",
      },
      {
        question: "If I reduce EMI, can I later increase it again?",
        answer:
          "Yes. Reducing the EMI after a prepayment doesn't prevent you from overpaying later — you can always pay more than the reduced EMI as a fresh monthly prepayment. So a common middle-path strategy is: reduce EMI for cash flow safety, then continue overpaying the original (higher) EMI as a monthly prepayment whenever you have the surplus.",
      },
      {
        question: "How does this calculator model the choice?",
        answer:
          "By default, the calculator models the tenure-reduction case — your contractual EMI stays the same and overpayments shorten the term. This produces the larger interest saving and is what most disciplined borrowers choose. If you want to see the EMI-reduction case, set the overpayment to zero and note that the prepayment has already been applied to reduce the principal — you would then recompute the EMI on the reduced principal for the original tenure.",
      },
    ],
  },
  {
    view: "interest-saving",
    faqs: [
      {
        question: "How much interest can I save by prepaying my home loan?",
        answer:
          "It depends on your ROI, outstanding principal and how early you start. On a ₹50 lakh loan at 8.50% for 20 years, prepaying just ₹2,000 a month from month 1 typically saves ₹6-8 lakh in interest and clears the loan about 2-3 years earlier. Prepaying ₹10,000 a month can save ₹25-30 lakh and clear it 7-8 years earlier. Use the calculator above for an exact figure for your loan.",
      },
      {
        question: "Why do early prepayments save so much more interest?",
        answer:
          "Indian home loans use reducing-balance amortisation — interest is charged each month on the outstanding principal. In the first year of a 20-year loan, around 80% of each EMI is interest and only 20% is principal. A prepayment in year 1 reduces the principal for the entire remaining 19 years, so it saves interest every single month. A prepayment in year 18 only saves interest for the last 2 years.",
      },
      {
        question: "Is the interest saving from prepayment tax-free?",
        answer:
          "Yes — the interest you avoid paying by prepaying is functionally equivalent to a guaranteed, tax-free return equal to your home loan ROI. There is no tax on the saving itself. This is why prepaying a 9% home loan is often compared to a fixed-income investment earning 9% post-tax, which would require roughly 12-13% pre-tax for a 30% slab investor.",
      },
      {
        question: "Is prepayment better than investing the same money?",
        answer:
          "There is no universal answer. Prepaying gives a guaranteed, tax-free return equal to your home loan ROI. Equity mutual funds have historically delivered 11-13% long-term returns in India but with market risk and 10% LTCG tax on gains over ₹1.25 lakh (post July 2024). Many borrowers do both: overpay enough to feel secure, and invest the rest for growth.",
      },
      {
        question: "Does prepayment reduce my Section 24(b) tax deduction?",
        answer:
          "Section 24(b) allows a deduction of up to ₹2 lakh per year on home loan interest for a self-occupied property. If prepayment lowers your annual interest below ₹2 lakh, you lose the unused portion of the deduction — so for high-income borrowers in the 30% slab, the effective benefit of prepaying is reduced by the tax saving forgone. This is most relevant in the later years of a loan when interest is already low.",
      },
      {
        question: "How is total interest calculated in this calculator?",
        answer:
          "The calculator runs two parallel amortization schedules: one with no overpayments (original) and one with your prepayments applied. Total interest saved is the difference between the sum of interest across all months in the original schedule and the same sum in the overpayment schedule. This is the true net saving — not the sum of prepayment amounts, which can be much smaller than the interest avoided.",
      },
    ],
  },
  {
    view: "sbi",
    faqs: [
      {
        question: "What is the current SBI home loan interest rate?",
        answer:
          "As of 2024-2025, SBI's home loan rates start around 8.40% p.a. for salaried borrowers with strong CIBIL under the repo-linked (RLLR) product, and go up to around 9.30% for higher-risk or fixed-rate variants. The exact ROI depends on your CIBIL score, loan amount, LTV and gender — women borrowers typically get a 5 bps concession under the Her Ghar scheme.",
      },
      {
        question: "Does SBI charge any prepayment penalty?",
        answer:
          "No. Floating-rate home loans to individual borrowers at SBI carry zero prepayment and foreclosure charges, in line with RBI guidelines. You can prepay any amount, any number of times, through Yono or at a branch. Fixed-rate SBI home loans may attract 2% charges on the outstanding principal prepaid.",
      },
      {
        question: "How does SBI's repo-linked home loan work?",
        answer:
          "SBI's Regular Home Loan is linked to RLLR (SBI Repo Linked Lending Rate), which is the RBI repo rate plus a bank-set spread. The effective ROI resets within five working days of an RBI repo change — so rate cuts reach you quickly. The spread is fixed at sanction based on your CIBIL and LTV, and remains constant for the loan's life unless you formally request a re-pricing.",
      },
      {
        question: "What is the maximum tenure and loan amount for SBI home loans?",
        answer:
          "SBI offers a maximum tenure of 30 years — among the longest in the Indian market, which helps lower EMI and improve eligibility. Loan amounts go up to ₹15 crore under the SBI Privilege and Shaurya schemes for select borrowers. For most salaried applicants the practical limit is determined by FOIR (typically capped at 50-55%) and LTV (90% for loans up to ₹30 lakh).",
      },
      {
        question: "Can I transfer my existing home loan to SBI?",
        answer:
          "Yes — SBI offers a balance transfer (also called takeover) facility where it pays off your existing lender and reissues the loan at SBI's ROI. This is worthwhile if your current ROI is more than 50 bps above what SBI would offer based on your CIBIL. SBI may also offer a top-up loan at the same ROI during the transfer, which can be used for any purpose.",
      },
      {
        question: "How do I make a prepayment on my SBI home loan?",
        answer:
          "You can prepay through Yono (the SBI mobile app), SBI NetBanking, or by visiting your home branch with a prepayment request and cheque / demand draft. Online prepayments are typically credited to principal within one business day. There is no statutory minimum or maximum on floating-rate individual loans, though very small amounts (under one EMI) may not be accepted at the branch counter.",
      },
    ],
  },
  {
    view: "hdfc",
    faqs: [
      {
        question: "What is the current HDFC Bank home loan interest rate?",
        answer:
          "Post the July 2023 merger of HDFC Limited into HDFC Bank, all new home loans are originated by HDFC Bank. As of 2024-2025, indicative rates start around 8.50% p.a. for salaried borrowers with CIBIL 800+, going up to around 9.40% for lower CIBIL or fixed-rate variants. Women applicants may get a 5 bps concession on the ROI.",
      },
      {
        question: "Does HDFC Bank charge prepayment or foreclosure charges?",
        answer:
          "No. Floating-rate home loans availed by individual borrowers carry zero prepayment and foreclosure charges at HDFC Bank, consistent with RBI's June 2024 clarification extending the no-penalty rule to loans of all amounts. Fixed-rate home loans may attract 2% charges plus taxes on the prepaid principal during the fixed-rate period.",
      },
      {
        question: "What happened to my old HDFC Limited home loan after the merger?",
        answer:
          "All existing HDFC Limited home loans were transferred to HDFC Bank on 1 July 2023 as part of the merger. Your ROI, EMI, tenure and terms remain unchanged — the loan continues on the same conditions, only the lender's name has changed. You can now service the loan through HDFC Bank NetBanking or the mobile app; prepayment and foreclosure policies remain as per your original sanction.",
      },
      {
        question: "How fast can HDFC Bank disburse a home loan?",
        answer:
          "For salaried borrowers with complete documentation, HDFC Bank offers digital in-principle sanction in as little as 10 minutes through the HDFC Bank mobile app, with final disbursal typically in 3-7 working days after property and legal verification. Self-employed applicants usually take 7-10 working days due to additional income documentation and ITR verification.",
      },
      {
        question: "Does HDFC Bank offer a top-up loan with a home loan?",
        answer:
          "Yes. After 12 months of regular repayment on your HDFC Bank home loan, you can apply for a top-up loan of up to ₹50 lakh (subject to LTV and income eligibility) at the same ROI as your home loan. The top-up has no end-use restriction and can be used for renovation, education, business, medical or any personal purpose.",
      },
      {
        question: "Can I do a balance transfer to HDFC Bank?",
        answer:
          "Yes. HDFC Bank's balance transfer facility pays off your existing home loan and reissues it at HDFC's ROI. This is worthwhile if your current ROI is meaningfully higher than HDFC's offer for your CIBIL profile. HDFC Bank often bundles a top-up loan with the transfer at the same ROI, which is attractive if you also need additional funds.",
      },
    ],
  },
  {
    view: "icici",
    faqs: [
      {
        question: "What is the current ICICI Bank home loan interest rate?",
        answer:
          "As of 2024-2025, ICICI Bank home loan rates start around 8.50% p.a. for salaried borrowers with strong CIBIL, going up to around 9.60% for lower CIBIL profiles or specific loan structures. Women applicants (first applicant) typically get a 5-10 bps ROI concession under the ICICI Bank Women's Home Loan.",
      },
      {
        question: "Does ICICI Bank charge prepayment penalty?",
        answer:
          "No. Floating-rate home loans for individual borrowers at ICICI Bank carry zero prepayment and foreclosure charges, per RBI guidelines. You can make partial prepayments through iMobile Pay or NetBanking with no paperwork for amounts up to a threshold; larger prepayments may require a written request. Fixed-rate loans may attract up to 2% charges plus taxes.",
      },
      {
        question: "What is the ICICI Insta Home Loan?",
        answer:
          "Insta Home Loan is ICICI Bank's digital in-principle sanction facility — existing ICICI customers can get an instant sanction in seconds through iMobile Pay or NetBanking based on their banking relationship and CIBIL, without submitting income documents. The sanction is valid for 6 months and can be converted to a final disbursal after property verification.",
      },
      {
        question: "Does ICICI Bank offer a step-up EMI option?",
        answer:
          "Yes. ICICI Bank's step-up EMI home loan starts with a lower EMI that increases by a fixed percentage (typically 5-8%) every few years, matching expected salary growth. This is suited for young salaried borrowers in their 20s and early 30s who want a larger loan today than their current income would qualify for at a level EMI.",
      },
      {
        question: "What is the maximum tenure for an ICICI home loan?",
        answer:
          "ICICI Bank offers home loan tenure up to 30 years for salaried borrowers, which helps lower the EMI and improve loan eligibility. Self-employed borrowers are typically capped at 20-25 years. Longer tenure means lower EMI but higher total interest — so longer-tenure borrowers benefit most from periodic prepayments.",
      },
      {
        question: "Can I prepay my ICICI home loan online?",
        answer:
          "Yes. ICICI Bank allows partial prepayments through iMobile Pay or Internet Banking for floating-rate individual home loans. The prepaid amount is adjusted against outstanding principal typically within one business day. There is no charge for online prepayments and no minimum amount beyond the bank's practical threshold (usually ₹10,000 or one EMI).",
      },
    ],
  },
  {
    view: "axis",
    faqs: [
      {
        question: "What is the current Axis Bank home loan interest rate?",
        answer:
          "As of 2024-2025, Axis Bank home loan rates start around 8.75% p.a. for salaried borrowers with strong CIBIL, going up to around 9.65% for higher-risk or specific loan structures. The bank offers repo-linked (BRLLR) pricing with quarterly reset on the outstanding principal, ensuring rate changes transmit within at most three months.",
      },
      {
        question: "Does Axis Bank charge prepayment or foreclosure penalty?",
        answer:
          "No. Floating-rate home loans for individual borrowers at Axis Bank carry zero prepayment and foreclosure charges per RBI guidelines. You can prepay any amount, any number of times, through Axis Mobile, Internet Banking or a branch. Fixed-rate home loans may attract 2% charges plus taxes on the prepaid principal during the fixed-rate period.",
      },
      {
        question: "What is Axis Bank's BRLLR and how does it differ from MCLR?",
        answer:
          "BRLLR (Benchmark Repo Linked Lending Rate) is the repo rate plus a bank-set spread, and is reset quarterly on the outstanding principal. MCLR (Marginal Cost of Funds Based Lending Rate) is based on the bank's cost of funds and resets at longer intervals (6 months or 1 year). BRLLR transmits RBI rate changes faster, so most new Axis home loans are now BRLLR-linked.",
      },
      {
        question: "What is the maximum LTV Axis Bank offers?",
        answer:
          "Axis Bank offers LTV up to 90% for home loans up to ₹30 lakh, 80% for loans between ₹30 lakh and ₹75 lakh, and 75% for loans above ₹75 lakh — in line with RBI norms. The actual LTV also depends on the property's appraised value and your income eligibility. A higher LTV reduces your down-payment burden but increases total interest paid over the tenure.",
      },
      {
        question: "What is Axis Bank's FOIR cap for home loans?",
        answer:
          "Axis Bank typically applies a FOIR (Fixed Obligations to Income Ratio) cap of 50-55% — meaning all your EMIs including the proposed home loan EMI should not exceed 50-55% of your net monthly income. For a ₹1,00,000 net monthly income, this caps the proposed home loan EMI at around ₹40,000 after accounting for existing EMIs, translating to an eligible loan of roughly ₹48 lakh at 8.75% for 20 years.",
      },
      {
        question: "Can I get a top-up loan from Axis Bank?",
        answer:
          "Yes. After 12 months of regular repayment, Axis Bank offers a top-up loan of up to ₹50 lakh at the same ROI as your home loan, with no end-use restriction. The top-up is typically disbursed within 3-5 working days and is useful for renovation, education, business expansion or any other personal purpose. Interest on a top-up used for home renovation may be eligible for Section 24(b) deduction up to ₹30,000 per year.",
      },
    ],
  },
  {
    view: "general",
    faqs: [
      {
        question: "What is a home loan EMI?",
        answer:
          "EMI (Equated Monthly Instalment) is the fixed monthly payment you make to repay your home loan. Each EMI has two components — interest on the outstanding principal for that month, and a principal repayment that reduces the outstanding balance. The EMI stays fixed for the tenure unless ROI changes or you prepay, but the interest-to-principal ratio shifts every month: interest is high in early years and falls over time.",
      },
      {
        question: "What is the difference between ROI and EMI?",
        answer:
          "ROI (Rate of Interest) is the annual percentage your bank charges on the outstanding principal — for example 8.50% p.a. EMI is the fixed monthly payment you make, calculated from the principal, ROI and tenure. A lower ROI reduces your EMI for the same tenure; a longer tenure reduces your EMI for the same ROI but increases total interest paid.",
      },
      {
        question: "How does CIBIL score affect my home loan?",
        answer:
          "CIBIL score is a 3-digit number (300-900) reflecting your credit history. Most Indian banks prefer 750+ for the best ROI; 700-749 may still be approved but at a higher rate. A 50 bps ROI difference on a ₹50 lakh 20-year loan costs roughly ₹6,500 extra interest per year — about ₹1.3 lakh over the tenure. Improving CIBIL before applying (pay EMIs on time, keep credit utilisation below 30%, avoid multiple loan enquiries) is one of the highest-leverage financial moves available.",
      },
      {
        question: "What is LTV (Loan-to-Value) and why does it matter?",
        answer:
          "LTV is the loan amount expressed as a percentage of the property's appraised value. RBI caps LTV at 90% for loans up to ₹30 lakh, 80% for ₹30-75 lakh, and 75% above ₹75 lakh. A higher LTV reduces your down-payment burden but increases total interest paid and may attract a higher ROI. Bringing a larger down-payment improves your LTV, often unlocks a lower ROI, and reduces the absolute interest you pay over the tenure.",
      },
      {
        question: "What is the difference between fixed and floating ROI?",
        answer:
          "A fixed-rate home loan keeps the same ROI for the entire (or a specified) tenure, giving EMI certainty but typically at a 50-100 bps premium to floating. A floating-rate loan moves with a benchmark (repo, MCLR, T-Bill) — so your ROI rises and falls with market rates. Floating loans to individuals also carry zero prepayment penalty under RBI guidelines, while fixed loans may attract 2% charges. Most Indian borrowers choose floating.",
      },
      {
        question: "Can I claim income tax benefits on a home loan?",
        answer:
          "Yes. Under Section 80C, principal repayment (including down-payment in some cases) is deductible up to ₹1.5 lakh per year. Under Section 24(b), interest paid is deductible up to ₹2 lakh per year for a self-occupied property (unlimited for let-out property, subject to conditions). For first-time buyers, Section 80EE offers an additional ₹50,000 interest deduction if the loan was sanctioned in the relevant financial year and meets value/income criteria. Note that prepayment reduces future interest, which may reduce your Section 24(b) deduction.",
      },
    ],
  },
];

/**
 * Return the FAQ list for a given view, falling back to the "general" group
 * if the requested view has no matching FAQ group.
 */
export function getFaqsForView(view: string): { question: string; answer: string }[] {
  const match = INDIA_FAQS.find((g) => g.view === view);
  if (match) return match.faqs;
  const general = INDIA_FAQS.find((g) => g.view === "general");
  return general ? general.faqs : [];
}
