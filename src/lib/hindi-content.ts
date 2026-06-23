/**
 * Hindi content library for the India Home Loan Prepayment Calculator.
 *
 * Exports:
 *  - Lang / TranslationKey types + TRANSLATIONS dictionary (English + Hindi)
 *  - HindiLandingPage interface + HINDI_LANDING_PAGES array (50+ SEO pages)
 *  - HindiFaq interface + HINDI_FAQ_LIBRARY (15-20 reusable FAQs)
 *  - HindiGuide interface + HINDI_GUIDES (5 in-depth guides)
 *  - HindiScenario interface + HINDI_SCENARIOS (6 prepayment scenarios)
 *  - HINDI_CONTENT_BLOCKS (4 educational cards)
 *  - Helper functions: getHindiFaqsForType, getHindiLandingPage,
 *    getHindiLandingPagesByType
 *
 * All Devanagari content uses Indian home-loan terminology — होम लोन, EMI,
 * प्रीपेमेंट, अवधि, ब्याज, बकाया, मूलधन, ऋण समाप्ति, फोरक्लोज़र. The English
 * acronym "EMI" is retained in Hindi copy since it is universally used in
 * Indian financial parlance. Hinglish landing pages use Roman-script Hindi.
 *
 * Content reflects 2024-2025 RBI guidelines: zero prepayment / foreclosure
 * charges on floating-rate individual home loans regardless of amount,
 * Section 80C / 24(b) / 80EE tax provisions, CIBIL-tiered ROI bands, and
 * post-July 2024 LTCG rules (10% on equity gains above ₹1.25 lakh).
 */

// ---------------------------------------------------------------------------
// 1. UI string translations
// ---------------------------------------------------------------------------

export type Lang = "en" | "hi";

export interface TranslationKey {
  [key: string]: string;
}

export const TRANSLATIONS: Record<Lang, TranslationKey> = {
  en: {
    "app.name": "Home Loan Calculator",
    "app.tagline": "India Home Loan Calculator",
    "nav.calculator": "Calculator",
    "nav.scenarios": "Scenarios",
    "nav.howItWorks": "How it works",
    "nav.faq": "FAQ",
    "nav.guides": "Guides",
    "form.loanAmount": "Loan amount",
    "form.interestRate": "Annual interest rate",
    "form.loanTenure": "Loan tenure",
    "form.monthlyEMI": "Monthly EMI",
    "form.calculatedEMI": "Calculated EMI",
    "form.auto": "Auto",
    "form.useCalculated": "Use calculated",
    "form.prepaymentStrategy": "Prepayment strategy",
    "form.prepaymentMode": "Prepayment mode",
    "form.monthlyExtraEMI": "Extra monthly EMI",
    "form.lumpSum": "Lump sum prepayment",
    "form.both": "Both",
    "form.extraAmount": "Extra amount (monthly)",
    "form.effectiveEMI": "Effective EMI",
    "form.lumpSumAmount": "Lump sum amount",
    "form.applyAfter": "Apply after X months",
    "form.startFrom": "Start from",
    "form.applyAtStart": "Apply at the start of the month",
    "form.loanStartDate": "Loan start date",
    "form.reset": "Reset",
    "form.copyResults": "Copy results",
    "form.shareLink": "Share link",
    "form.outstandingMode": "Outstanding principal mode",
    "form.yourHomeLoan": "Your home loan",
    "form.prepaymentType": "Prepayment type",
    "results.title": "Your results",
    "results.comparedToOriginal": "Compared to your original home loan schedule.",
    "results.interestSaved": "Interest saved",
    "results.debtFreeSooner": "Debt-free sooner",
    "results.emiReducedBy": "EMI reduced by",
    "results.effectiveSavings": "Effective savings",
    "results.lessInterest": "less interest",
    "results.whatThisMeans": "What this means",
    "results.worthIt": "Is it worth it?",
    "results.worthItYes": "Yes",
    "results.originalPayoff": "Original payoff date",
    "results.newPayoff": "New payoff date",
    "results.originalTenure": "Original tenure",
    "results.newTenure": "New tenure",
    "results.totalInterest": "Total interest paid",
    "results.totalAmount": "Total amount paid",
    "results.amortizationPreview": "Amortization preview",
    "results.month": "Month",
    "results.openingBalance": "Opening balance",
    "results.emi": "EMI",
    "results.interest": "Interest",
    "results.principal": "Principal",
    "results.prepayment": "Prepayment",
    "results.closingBalance": "Closing balance",
    "lead.heading": "Get your full prepayment report",
    "lead.description":
      "We'll email you a detailed PDF/CSV report and share options to reduce your home-loan tenure and interest.",
    "lead.name": "Name",
    "lead.emailOrPhone": "Email or phone",
    "lead.city": "City",
    "lead.cityOptional": "City (optional)",
    "lead.loanBalance": "Current loan balance",
    "lead.loanBalanceOptional": "Current loan balance (optional)",
    "lead.cta": "Get my full prepayment report",
    "lead.sending": "Sending...",
    "affiliate.title": "Next steps for more savings",
    "affiliate.subtitle":
      "Prepayment is powerful — but a lower interest rate or professional advice can save you even more. These partners can help.",
    "affiliate.compareRates": "Compare home loan rates",
    "affiliate.balanceTransfer": "Explore balance transfer offers",
    "affiliate.talkExpert": "Talk to a loan expert",
    "affiliate.refinanceSavings": "Check refinancing savings",
    "affiliate.disclaimer":
      "Affiliate link — we may earn a commission if you take an offer, at no extra cost to you.",
    "scenarios.title": "Example prepayment scenarios",
    "scenarios.subtitle":
      "Real strategies on Indian home loans (₹35L–₹1Cr). Tap any scenario to load it into the calculator.",
    "scenarios.loadIntoCalc": "Load into calculator",
    "scenarios.interestSaved": "Interest saved",
    "scenarios.timeSaved": "Time saved",
    "scenarios.paysOff": "Pays off",
    "scenarios.insteadOf": "instead of",
    "faq.title": "Frequently asked questions",
    "faq.subtitle": "Everything you want to know about home loan prepayment and EMI.",
    "guides.title": "Interest-saving guides",
    "guides.subtitle": "India-specific guides to help you save on your home loan.",
    "content.title": "How home loan prepayment works",
    "content.subtitle": "A short primer on the mechanics behind the numbers above.",
    "lang.switchToHi": "हिन्दी",
    "lang.switchToEn": "English",
    "footer.disclaimer":
      "This calculator is for informational purposes only and is not financial advice.",
    "footer.rights": "All rights reserved.",
  },
  hi: {
    "app.name": "होम लोन कैलकुलेटर",
    "app.tagline": "भारत होम लोन कैलक्युलेटर",
    "nav.calculator": "कैलकुलेटर",
    "nav.scenarios": "उदाहरण",
    "nav.howItWorks": "कैसे काम करता है",
    "nav.faq": "सामान्य प्रश्न",
    "nav.guides": "गाइड",
    "form.loanAmount": "ऋण राशि",
    "form.interestRate": "वार्षिक ब्याज दर",
    "form.loanTenure": "ऋण अवधि",
    "form.monthlyEMI": "मासिक EMI",
    "form.calculatedEMI": "गणना की गई EMI",
    "form.auto": "स्वचालित",
    "form.useCalculated": "गणना की गई का उपयोग करें",
    "form.prepaymentStrategy": "प्रीपेमेंट रणनीति",
    "form.prepaymentMode": "प्रीपेमेंट मोड",
    "form.monthlyExtraEMI": "अतिरिक्त मासिक EMI",
    "form.lumpSum": "एकमुश्त प्रीपेमेंट",
    "form.both": "दोनों",
    "form.extraAmount": "अतिरिक्त राशि (मासिक)",
    "form.effectiveEMI": "प्रभावी EMI",
    "form.lumpSumAmount": "एकमुश्त राशि",
    "form.applyAfter": "X महीने बाद लागू करें",
    "form.startFrom": "शुरू करें",
    "form.applyAtStart": "महीने की शुरुआत में लागू करें",
    "form.loanStartDate": "ऋण शुरू तिथि",
    "form.reset": "रीसेट",
    "form.copyResults": "परिणाम कॉपी करें",
    "form.shareLink": "शेयर लिंक",
    "form.outstandingMode": "बकाया मूलधन मोड",
    "form.yourHomeLoan": "आपका होम लोन",
    "form.prepaymentType": "प्रीपेमेंट प्रकार",
    "results.title": "आपके परिणाम",
    "results.comparedToOriginal": "आपके मूल होम लोन शेड्यूल की तुलना में।",
    "results.interestSaved": "बचाया गया ब्याज",
    "results.debtFreeSooner": "जल्दी ऋण मुक्त",
    "results.emiReducedBy": "EMI में कमी",
    "results.effectiveSavings": "प्रभावी बचत",
    "results.lessInterest": "कम ब्याज",
    "results.whatThisMeans": "इसका क्या अर्थ है",
    "results.worthIt": "क्या यह फायदेमंद है?",
    "results.worthItYes": "हाँ",
    "results.originalPayoff": "मूल ऋण समाप्ति तिथि",
    "results.newPayoff": "नई ऋण समाप्ति तिथि",
    "results.originalTenure": "मूल अवधि",
    "results.newTenure": "नई अवधि",
    "results.totalInterest": "कुल ब्याज भुगतान",
    "results.totalAmount": "कुल भुगतान राशि",
    "results.amortizationPreview": "अमोर्टाइजेशन पूर्वावलोकन",
    "results.month": "महीना",
    "results.openingBalance": "शुरुआती शेष",
    "results.emi": "EMI",
    "results.interest": "ब्याज",
    "results.principal": "मूलधन",
    "results.prepayment": "प्रीपेमेंट",
    "results.closingBalance": "अंतिम शेष",
    "lead.heading": "अपनी पूरी प्रीपेमेंट रिपोर्ट प्राप्त करें",
    "lead.description":
      "हम आपको विस्तृत PDF/CSV रिपोर्ट ईमेल करेंगे और अपने होम लोन की अवधि और ब्याज कम करने के विकल्प शेयर करेंगे।",
    "lead.name": "नाम",
    "lead.emailOrPhone": "ईमेल या फोन",
    "lead.city": "शहर",
    "lead.cityOptional": "शहर (वैकल्पिक)",
    "lead.loanBalance": "वर्तमान ऋण शेष",
    "lead.loanBalanceOptional": "वर्तमान ऋण शेष (वैकल्पिक)",
    "lead.cta": "मेरी पूरी प्रीपेमेंट रिपोर्ट प्राप्त करें",
    "lead.sending": "भेजा जा रहा है…",
    "affiliate.title": "और बचत के लिए अगले कदम",
    "affiliate.subtitle":
      "प्रीपेमेंट शक्तिशाली है — लेकिन कम ब्याज दर या पेशेवर सलाह से और बचत संभव है। ये पार्टनर मदद कर सकते हैं।",
    "affiliate.compareRates": "होम लोन दरों की तुलना करें",
    "affiliate.balanceTransfer": "बैलेंस ट्रांसफर विकल्प देखें",
    "affiliate.talkExpert": "विशेषज्ञ से बात करें",
    "affiliate.refinanceSavings": "रिफाइनेंस बचत जांचें",
    "affiliate.disclaimer":
      "एफिलिएट लिंक — यदि आप कोई ऑफर लेते हैं तो हमें कमीशन मिल सकता है, आपको कोई अतिरिक्त लागत नहीं।",
    "scenarios.title": "उदाहरण प्रीपेमेंट परिदृश्य",
    "scenarios.subtitle":
      "भारतीय होम लोन पर वास्तविक रणनीतियाँ (₹35L–₹1Cr)। किसी भी परिदृश्य को कैलकुलेटर में लोड करने के लिए टैप करें।",
    "scenarios.loadIntoCalc": "कैलकुलेटर में लोड करें",
    "scenarios.interestSaved": "ब्याज बचत",
    "scenarios.timeSaved": "समय बचत",
    "scenarios.paysOff": "ऋण समाप्त",
    "scenarios.insteadOf": "के बजाय",
    "faq.title": "सामान्य प्रश्न",
    "faq.subtitle":
      "होम लोन प्रीपेमेंट और EMI के बारे में सब कुछ जो आप जानना चाहते हैं।",
    "guides.title": "ब्याज बचत गाइड",
    "guides.subtitle":
      "अपने होम लोन पर बचत करने में मदद के लिए भारत-विशिष्ट गाइड।",
    "content.title": "होम लोन प्रीपेमेंट कैसे काम करता है",
    "content.subtitle":
      "ऊपर दिए गए आंकड़ों के पीछे की यांत्रिकी पर एक संक्षिप्त प्राइमर।",
    "lang.switchToHi": "हिन्दी",
    "lang.switchToEn": "English",
    "footer.disclaimer":
      "यह कैलक्युलेटर केवल सूचना के उद्देश्य से है और वित्तीय सलाह नहीं है।",
    "footer.rights": "सर्वाधिकार सुरक्षित।",
  },
};

// ---------------------------------------------------------------------------
// 2. Hindi landing pages (50+)
// ---------------------------------------------------------------------------

export interface HindiLandingPage {
  id: string;
  type: "calculator" | "guide" | "scenario" | "hinglish" | "bank";
  title: string;
  h1: string;
  intro: string;
  metaTitle: string;
  metaDescription: string;
  canonical: string;
  faqs?: { question: string; answer: string }[];
}

export const HINDI_LANDING_PAGES: HindiLandingPage[] = [
  // ---- 10 calculator pages ----
  {
    id: "home-loan-prepayment-calculator",
    type: "calculator",
    title: "होम लोन प्रीपेमेंट कैलक्युलेटर",
    h1: "होम लोन प्रीपेमेंट कैलक्युलेटर — ब्याज और अवधि बचाएं",
    intro:
      "होम लोन प्रीपेमेंट कैलक्युलेटर से जानें कि मासिक अतिरिक्त EMI या एकमुश्त प्रीपेमेंट से आप कितना ब्याज बचा सकते हैं और कितनी जल्दी ऋण मुक्त हो सकते हैं। अपनी ऋण राशि, ब्याज दर और अवधि दर्ज करें और तुरंत परिणाम पाएं।",
    metaTitle:
      "होम लोन प्रीपेमेंट कैलक्युलेटर | ब्याज बचत जानें - Hindi",
    metaDescription:
      "मुफ्त होम लोन प्रीपेमेंट कैलक्युलेटर। मासिक अतिरिक्त EMI या एकमुश्त प्रीपेमेंट से कितना ब्याज और समय बचेगा, तुरंत गणना करें। भारतीय बैंक दरों के अनुसार।",
    canonical: "/hi/home-loan-prepayment-calculator",
    faqs: [
      {
        question: "प्रीपेमेंट से कितना ब्याज बचेगा?",
        answer:
          "यह आपकी ऋण राशि, ब्याज दर, अवधि और प्रीपेमेंट राशि पर निर्भर करता है। ₹50 लाख के होम लोन पर 8.5% दर और 20 वर्ष की अवधि में मात्र ₹10,000 मासिक प्रीपेमेंट से लगभग ₹21 लाख तक ब्याज बच सकता है और ऋण 7 वर्ष जल्दी समाप्त हो सकता है।",
      },
      {
        question: "क्या प्रीपेमेंट पर कोई शुल्क लगता है?",
        answer:
          "फ्लोटिंग दर वाले व्यक्तिगत होम लोन पर RBI के अनुसार कोई प्रीपेमेंट या फोरक्लोज़र शुल्क नहीं लगता, चाहे ऋण राशि कुछ भी हो। फिक्स्ड दर वाले लोन पर 2% तक शुल्क लग सकता है।",
      },
      {
        question: "कैलक्युलेटर के परिणाम कितने सटीक हैं?",
        answer:
          "यह कैलक्युलेटर मानक amortization सूत्र का उपयोग करता है और बैंक की गणना से मेल खाता है। वास्तविक संख्याएं आपकी बैंक की दर संशोधन और दैनिक ब्याज गणना पद्धति के आधार पर मामूली भिन्नता ले सकती हैं।",
      },
    ],
  },
  {
    id: "home-loan-emi-calculator",
    type: "calculator",
    title: "होम लोन EMI कैलक्युलेटर",
    h1: "होम लोन EMI कैलक्युलेटर — मासिक किस्त की गणना",
    intro:
      "होम लोन EMI कैलक्युलेटर से अपनी मासिक EMI तुरंत जानें। ऋण राशि, ब्याज दर और अवधि दर्ज करें और देखें कि आपकी मासिक किस्त कितनी होगी।",
    metaTitle: "होम लोन EMI कैलक्युलेटर | मासिक किस्त जानें - Hindi",
    metaDescription:
      "होम लोन EMI कैलक्युलेटर। ऋण राशि, ब्याज दर और अवधि दर्ज करके अपनी मासिक EMI तुरंत गणना करें। भारतीय बैंक दरों के अनुसार।",
    canonical: "/hi/home-loan-emi-calculator",
    faqs: [
      {
        question: "EMI की गणना कैसे होती है?",
        answer:
          "EMI = P × r × (1+r)^n / ((1+r)^n - 1), जहाँ P ऋण राशि, r मासिक ब्याज दर (वार्षिक दर / 12 / 100) और n महीनों में अवधि है। उदाहरण के लिए ₹50 लाख का लोन 8.5% दर पर 20 वर्ष के लिए लगभग ₹43,391 की मासिक EMI देता है।",
      },
      {
        question: "क्या EMI पूरे ऋण अवधि में समान रहती है?",
        answer:
          "फिक्स्ड दर वाले लोन में EMI समान रहती है। फ्लोटिंग दर वाले लोन में बैंक आमतौर पर EMI समान रखता है और अवधि समायोजित करता है — हालाँकि आप EMI संशोधन का अनुरोध भी कर सकते हैं।",
      },
    ],
  },
  {
    id: "home-loan-interest-saving-calculator",
    type: "calculator",
    title: "होम लोन ब्याज बचत कैलक्युलेटर",
    h1: "होम लोन ब्याज बचत कैलक्युलेटर",
    intro:
      "जानें कि प्रीपेमेंट, बैलेंस ट्रांसफर या रिफाइनेंस से आप अपने होम लोन पर कितना ब्याज बचा सकते हैं। यह कैलक्युलेटर आपको सबसे अच्छी रणनीति चुनने में मदद करता है।",
    metaTitle: "होम लोन ब्याज बचत कैलक्युलेटर | लाखों बचाएं - Hindi",
    metaDescription:
      "प्रीपेमेंट, बैलेंस ट्रांसफर और रिफाइनेंस से होम लोन पर कितना ब्याज बचेगा, जानें। तुलना करें और सबसे अच्छी रणनीति चुनें।",
    canonical: "/hi/home-loan-interest-saving-calculator",
    faqs: [
      {
        question: "सबसे ज्यादा ब्याज कैसे बचाया जा सकता है?",
        answer:
          "तीन सबसे असरदार तरीके हैं — ऋण के पहले वर्ष में छोटा मासिक प्रीपेमेंट शुरू करना, सालाना बोनस से एकमुश्त प्रीपेमेंट करना, और जब दरें ऊँची हों तब बचत से बड़ा प्रीपेमेंट करना। अवधि घटाना EMI घटाने से 3-5 गुना ज्यादा ब्याज बचाता है।",
      },
      {
        question: "क्या बैलेंस ट्रांसफर से ब्याज बचत होती है?",
        answer:
          "हाँ, यदि आपको 0.5% कम दर मिले तो ₹50 लाख के लोन पर 20 वर्ष में लगभग ₹4-6 लाख ब्याज बच सकता है। ट्रांसफर का प्रोसेसिंग शुल्क (आमतौर पर 0.5%) भी इसमें शामिल कर लें।",
      },
    ],
  },
  {
    id: "home-loan-part-payment-calculator",
    type: "calculator",
    title: "होम लोन पार्ट पेमेंट कैलक्युलेटर",
    h1: "होम लोन पार्ट पेमेंट कैलक्युलेटर",
    intro:
      "पार्ट पेमेंट कैलक्युलेटर से जानें कि आंशिक प्रीपेमेंट से आपकी अवधि और ब्याज पर क्या असर पड़ेगा। मूलधन घटने से हर महीने कम ब्याज लगेगा।",
    metaTitle: "होम लोन पार्ट पेमेंट कैलक्युलेटर | अवधि कम करें - Hindi",
    metaDescription:
      "होम लोन पार्ट पेमेंट कैलक्युलेटर। आंशिक प्रीपेमेंट से कितनी अवधि और ब्याज बचेगा, तुरंत गणना करें।",
    canonical: "/hi/home-loan-part-payment-calculator",
    faqs: [
      {
        question: "पार्ट पेमेंट और प्रीपेमेंट में क्या अंतर है?",
        answer:
          "दोनों एक ही हैं — जब आप EMI के अतिरिक्त कुछ राशि जमा करके मूलधन घटाते हैं तो उसे पार्ट पेमेंट या प्रीपेमेंट कहते हैं। फोरक्लोज़र तब होता है जब पूरा बकाया एक ही बार में चुकाकर लोन बंद कर देते हैं।",
      },
      {
        question: "पार्ट पेमेंट के बाद EMI कम होगी या अवधि?",
        answer:
          "दोनों में से एक चुन सकते हैं। अवधि घटाने से ज्यादा ब्याज बचता है, EMI घटाने से मासिक बोझ कम होता है। बैंक आमतौर पर अवधि ही घटाते हैं; EMI घटाने के लिए अलग से अनुरोध करना पड़ता है।",
      },
    ],
  },
  {
    id: "home-loan-lump-sum-prepayment-calculator",
    type: "calculator",
    title: "एकमुश्त प्रीपेमेंट कैलक्युलेटर",
    h1: "एकमुश्त प्रीपेमेंट कैलक्युलेटर — बोनस या बिक्री से बचत",
    intro:
      "एकमुश्त प्रीपेमेंट कैलक्युलेटर से जानें कि सालाना बोनस, निवेश की वसूली या संपत्ति बिक्री से मिली राशि को एक बार में जमा करने पर आपकी अवधि कितनी कम होगी और कितना ब्याज बचेगा।",
    metaTitle:
      "एकमुश्त प्रीपेमेंट कैलक्युलेटर | Lump Sum Prepayment - Hindi",
    metaDescription:
      "एकमुश्त प्रीपेमेंट से कितना ब्याज और समय बचेगा, जानें। बोनस, निवेश या संपत्ति बिक्री की राशि के लिए उपयोग करें।",
    canonical: "/hi/home-loan-lump-sum-prepayment-calculator",
    faqs: [
      {
        question: "एकमुश्त प्रीपेमेंट कब सबसे असरदार है?",
        answer:
          "ऋण के पहले 5-7 वर्षों में किया गया एकमुश्त प्रीपेमेंट सबसे ज्यादा ब्याज बचाता है, क्योंकि शुरुआती वर्षों में EMI का बड़ा हिस्सा ब्याज में जाता है। ₹1 लाख का प्रीपेमेंट पहले वर्ष में करीब ₹1.85 लाख ब्याज बचा सकता है।",
      },
      {
        question: "क्या कोई न्यूनतम एकमुश्त प्रीपेमेंट राशि होती है?",
        answer:
          "अधिकतर बैंकों में कोई न्यूनतम राशि नहीं है, लेकिन कुछ बैंक ₹10,000 या एक EMI के बराबर न्यूनतम राशि मान सकते हैं। नेटबैंकिंग या शाखा में प्रीपेमेंट रिक्वेस्ट जमा करें।",
      },
    ],
  },
  {
    id: "home-loan-tenure-reduction-calculator",
    type: "calculator",
    title: "होम लोन अवधि कम करने का कैलक्युलेटर",
    h1: "होम लोन अवधि कम करने का कैलक्युलेटर",
    intro:
      "अवधि घटाने वाला कैलक्युलेटर बताता है कि प्रीपेमेंट करने पर आपका होम लोन कितने वर्ष जल्दी खत्म होगा। EMI समान रखते हुए अवधि घटाना सबसे ज्यादा ब्याज बचाता है।",
    metaTitle:
      "होम लोन अवधि कम करने का कैलक्युलेटर | Tenure Reduction - Hindi",
    metaDescription:
      "प्रीपेमेंट से होम लोन की अवधि कितनी कम होगी, जानें। EMI समान रखते हुए सबसे ज्यादा ब्याज बचाने का तरीका।",
    canonical: "/hi/home-loan-tenure-reduction-calculator",
    faqs: [
      {
        question: "अवधि घटाना बेहतर है या EMI घटाना?",
        answer:
          "अवधि घटाना लगभग हमेशा बेहतर है — इससे 3-5 गुना ज्यादा ब्याज बचता है। ₹50 लाख के लोन पर ₹5 लाख के प्रीपेमेंट से अवधि घटाने पर ₹14-16 लाख ब्याज बचता है, जबकि EMI घटाने पर केवल ₹4-5 लाख।",
      },
      {
        question: "अवधि कम करने के लिए बैंक को कैसे बताएं?",
        answer:
          "प्रीपेमेंट करते समय बैंक को लिखित रूप से बताएं कि आप EMI समान रखना चाहते हैं और अवधि घटाना चाहते हैं। अधिकतर बैंक नेटबैंकिंग में यह विकल्प देते हैं।",
      },
    ],
  },
  {
    id: "home-loan-emi-reduction-calculator",
    type: "calculator",
    title: "होम लोन EMI कम करने का कैलक्युलेटर",
    h1: "होम लोन EMI कम करने का कैलक्युलेटर",
    intro:
      "EMI घटाने वाला कैलक्युलेटर बताता है कि प्रीपेमेंट के बाद अवधि समान रखते हुए आपकी मासिक EMI कितनी कम होगी। यह तब उपयोगी है जब मासिक नकदी बोझ कम करना हो।",
    metaTitle:
      "होम लोन EMI कम करने का कैलक्युलेटर | EMI Reduction - Hindi",
    metaDescription:
      "प्रीपेमेंट के बाद EMI कितनी कम होगी, जानें। मासिक नकदी बोझ कम करने के लिए अवधि समान रखें।",
    canonical: "/hi/home-loan-emi-reduction-calculator",
    faqs: [
      {
        question: "EMI घटाने का फायदा क्या है?",
        answer:
          "EMI घटाने से मासिक नकदी बोझ कम होता है, जो नौकरी परिवर्तन, वेतन कटौती या बड़े खर्च के बाद उपयोगी है। इससे FOIR भी सुधरता है, जिससे दूसरा लोन लेने में आसानी होती है।",
      },
      {
        question: "EMI घटाने का नुकसान क्या है?",
        answer:
          "अवधि समान रहने से लोन ज्यादा दिनों तक चलता है और कुल ब्याज ज्यादा लगता है। इसीलिए वित्तीय सलाहकार अक्सर अवधि घटाने की सलाह देते हैं, जब तक कि नकदी बोझ न हो।",
      },
    ],
  },
  {
    id: "home-loan-foreclosure-calculator",
    type: "calculator",
    title: "होम लोन फोरक्लोज़र कैलक्युलेटर",
    h1: "होम लोन फोरक्लोज़र कैलक्युलेटर",
    intro:
      "फोरक्लोज़र कैलक्युलेटर से जानें कि पूरा बकाया चुकाकर लोन कब और कैसे बंद किया जा सकता है। फ्लोटिंग दर वाले व्यक्तिगत लोन पर फोरक्लोज़र शुल्क मुक्त है।",
    metaTitle: "होम लोन फोरक्लोज़र कैलक्युलेटर | Foreclosure - Hindi",
    metaDescription:
      "होम लोन फोरक्लोज़र कैलक्युलेटर। पूरा बकाया चुकाकर लोन कैसे बंद करें, जानें। फ्लोटिंग दर पर शुल्क मुक्त।",
    canonical: "/hi/home-loan-foreclosure-calculator",
    faqs: [
      {
        question: "फोरक्लोज़र पर क्या शुल्क लगता है?",
        answer:
          "फ्लोटिंग दर वाले व्यक्तिगत होम लोन पर शून्य शुल्क (RBI नियम)। फिक्स्ड दर वाले लोन पर 2% तक प्रीपेमेंट शुल्क लग सकता है, साथ ही GST। गैर-व्यक्तिगत उधारकर्ताओं (कंपनी, LLP) पर भी शुल्क लग सकता है।",
      },
      {
        question: "फोरक्लोज़र के लिए क्या प्रक्रिया है?",
        answer:
          "बैंक की वेबसाइट या शाखा से फोरक्लोज़र रिक्वेस्ट फॉर्म भरें, बकाया राशि का ब्यौरा लें, राशि जमा करें, और फिर NOC और मूल दस्तावेज़ वापस लें। प्रक्रिया 7-15 कार्यदिवसों में पूरी हो जाती है।",
      },
    ],
  },
  {
    id: "home-loan-balance-transfer-calculator",
    type: "calculator",
    title: "होम लोन बैलेंस ट्रांसफर कैलक्युलेटर",
    h1: "होम लोन बैलेंस ट्रांसफर कैलक्युलेटर",
    intro:
      "बैलेंस ट्रांसफर कैलक्युलेटर से जानें कि किसी दूसरे बैंक में लोन ट्रांसफर करके आप कितना ब्याज बचा सकते हैं। अपनी वर्तमान दर और नई पेशकश दर की तुलना करें।",
    metaTitle: "होम लोन बैलेंस ट्रांसफर कैलक्युलेटर | Balance Transfer - Hindi",
    metaDescription:
      "होम लोन बैलेंस ट्रांसफर से कितना ब्याज बचेगा, जानें। वर्तमान दर और नई दर की तुलना करें।",
    canonical: "/hi/home-loan-balance-transfer-calculator",
    faqs: [
      {
        question: "बैलेंस ट्रांसफर कब फायदेमंद है?",
        answer:
          "जब आपको वर्तमान दर से कम से कम 0.5% कम दर मिले और बकाया अवधि 10 वर्ष से ज्यादा हो। ₹50 लाख के लोन पर 0.5% कम दर से 20 वर्ष में लगभग ₹4-6 लाख ब्याज बचता है।",
      },
      {
        question: "बैलेंस ट्रांसफर में क्या खर्च आते हैं?",
        answer:
          "नए बैंक का प्रोसेसिंग शुल्क (आमतौर पर लोन राशि का 0.25-0.50%), मूल्यांकन शुल्क, कानूनी शुल्क और मोहर शुल्क। पुराने बैंक से फोरक्लोज़र पर फ्लोटिंग दर में कोई शुल्क नहीं।",
      },
    ],
  },
  {
    id: "home-loan-refinance-calculator",
    type: "calculator",
    title: "होम लोन रिफाइनेंस कैलक्युलेटर",
    h1: "होम लोन रिफाइनेंस कैलक्युलेटर",
    intro:
      "रिफाइनेंस कैलक्युलेटर से जानें कि कम दर पर नया लोन लेकर पुराना लोन चुकाने से कितनी बचत होगी। ब्याज दर, अवधि और शुल्क की तुलना करें।",
    metaTitle: "होम लोन रिफाइनेंस कैलक्युलेटर | Refinance Savings - Hindi",
    metaDescription:
      "होम लोन रिफाइनेंस से कितनी बचत होगी, जानें। दर, अवधि और शुल्क की तुलना करें।",
    canonical: "/hi/home-loan-refinance-calculator",
    faqs: [
      {
        question: "रिफाइनेंस और बैलेंस ट्रांसफर में अंतर है?",
        answer:
          "दोनों एक ही हैं — पुराना लोन चुकाकर नया लोन लेना। 'बैलेंस ट्रांसफर' शब्द अक्सर उसी बकाया को नए बैंक में ले जाने के लिए प्रयोग होता है, जबकि 'रिफाइनेंस' में आप अवधि या राशि भी बदल सकते हैं या अतिरिक्त राशि (टॉप-अप) ले सकते हैं।",
      },
      {
        question: "रिफाइनेंस के लिए CIBIL स्कोर क्या चाहिए?",
        answer:
          "अधिकतर बैंक 750+ CIBIL स्कोर पर सर्वोत्तम दर देते हैं। 700-749 पर थोड़ी ज्यादा दर मिल सकती है, 700 से कम पर अनुमोदन मुश्किल हो सकता है। आवेदन से पहले अपनी CIBIL रिपोर्ट जांच लें।",
      },
    ],
  },

  // ---- 4 bank pages ----
  {
    id: "sbi-home-loan-prepayment-calculator",
    type: "bank",
    title: "SBI होम लोन प्रीपेमेंट कैलक्युलेटर",
    h1: "SBI होम लोन प्रीपेमेंट कैलक्युलेटर",
    intro:
      "SBI होम लोन पर प्रीपेमेंट का असर जानें। SBI फ्लोटिंग दर (RLLR आधारित) पर व्यक्तिगत उधारकर्ताओं से कोई प्रीपेमेंट या फोरक्लोज़र शुल्क नहीं लेता। अपनी EMI और बचत गणना करें।",
    metaTitle: "SBI होम लोन प्रीपेमेंट कैलक्युलेटर | SBI Prepayment - Hindi",
    metaDescription:
      "SBI होम लोन पर प्रीपेमेंट से कितना ब्याज और समय बचेगा, जानें। RLLR दर, फोरक्लोज़र शुल्क और प्रीपेमेंट नियम।",
    canonical: "/hi/sbi-home-loan-prepayment-calculator",
    faqs: [
      {
        question: "SBI होम लोन पर प्रीपेमेंट शुल्क क्या है?",
        answer:
          "SBI फ्लोटिंग दर (RLLR आधारित) वाले व्यक्तिगत होम लोन पर शून्य प्रीपेमेंट और फोरक्लोज़र शुल्क लेता है, चाहे राशि कुछ भी हो। फिक्स्ड दर पर 2% शुल्क लागू हो सकता है।",
      },
      {
        question: "SBI होम लोन पर प्रीपेमेंट कैसे करें?",
        answer:
          "SBI YONO ऐप या नेटबैंकिंग में लॉगिन करें, लोन खाता चुनें, 'Prepayment' विकल्प से राशि दर्ज करें और भुगतान करें। वैकल्पिक रूप से शाखा में चेक जमा कर प्रीपेमेंट रिक्वेस्ट दे सकते हैं।",
      },
      {
        question: "SBI की वर्तमान होम लोन दर क्या है?",
        answer:
          "2024-2025 में SBI की फ्लोटिंग होम लोन दर लगभग 8.40% से 9.30% वार्षिक के बीच है, CIBIL स्कोर और उधारकर्ता श्रेणी के आधार पर। सैलरी खाता वाले ग्राहकों को कुछ छूट मिल सकती है।",
      },
    ],
  },
  {
    id: "hdfc-home-loan-prepayment-calculator",
    type: "bank",
    title: "HDFC होम लोन प्रीपेमेंट कैलक्युलेटर",
    h1: "HDFC होम लोन प्रीपेमेंट कैलक्युलेटर",
    intro:
      "HDFC (अब HDFC Bank) होम लोन पर प्रीपेमेंट और बचत गणना करें। HDFC फ्लोटिंग दर वाले व्यक्तिगत लोन पर कोई प्रीपेमेंट शुल्क नहीं लेता। अपनी EMI और बचत देखें।",
    metaTitle: "HDFC होम लोन प्रीपेमेंट कैलक्युलेटर | HDFC Prepayment - Hindi",
    metaDescription:
      "HDFC होम लोन पर प्रीपेमेंट से कितना ब्याज और समय बचेगा, जानें। दर, फोरक्लोज़र शुल्क और प्रीपेमेंट नियम।",
    canonical: "/hi/hdfc-home-loan-prepayment-calculator",
    faqs: [
      {
        question: "HDFC होम लोन पर प्रीपेमेंट शुल्क क्या है?",
        answer:
          "HDFC फ्लोटिंग दर वाले व्यक्तिगत होम लोन पर शून्य प्रीपेमेंट और फोरक्लोज़र शुल्क लेता है। HDFC और HDFC Bank के विलय के बाद भी यह नीति जारी है। फिक्स्ड दर पर 2% शुल्क लागू हो सकता है।",
      },
      {
        question: "HDFC की वर्तमान होम लोन दर क्या है?",
        answer:
          "2024-2025 में HDFC की फ्लोटिंग होम लोन दर लगभग 8.50% से 9.40% वार्षिक के बीच है, CIBIL स्कोर और उधारकर्ता श्रेणी के आधार पर। महिला उधारकर्ताओं को कुछ खास योजनाओं में छूट मिल सकती है।",
      },
      {
        question: "HDFC में प्रीपेमेंट कैसे करें?",
        answer:
          "HDFC नेटबैंकिंग या मोबाइल ऐप में लॉगिन करें, लोन खाता चुनें, 'Prepayment' विकल्प से राशि दर्ज करें। वैकल्पिक रूप से किसी भी HDFC शाखा में चेक या DD जमा कर सकते हैं।",
      },
    ],
  },
  {
    id: "icici-home-loan-prepayment-calculator",
    type: "bank",
    title: "ICICI होम लोन प्रीपेमेंट कैलक्युलेटर",
    h1: "ICICI होम लोन प्रीपेमेंट कैलक्युलेटर",
    intro:
      "ICICI Bank होम लोन पर प्रीपेमेंट का असर जानें। ICICI फ्लोटिंग दर (I-BCLR आधारित) पर व्यक्तिगत उधारकर्ताओं से कोई प्रीपेमेंट या फोरक्लोज़र शुल्क नहीं लेता।",
    metaTitle:
      "ICICI होम लोन प्रीपेमेंट कैलक्युलेटर | ICICI Prepayment - Hindi",
    metaDescription:
      "ICICI होम लोन पर प्रीपेमेंट से कितना ब्याज और समय बचेगा, जानें। I-BCLR दर, फोरक्लोज़र शुल्क और नियम।",
    canonical: "/hi/icici-home-loan-prepayment-calculator",
    faqs: [
      {
        question: "ICICI होम लोन पर प्रीपेमेंट शुल्क क्या है?",
        answer:
          "ICICI Bank फ्लोटिंग दर (I-BCLR आधारित) वाले व्यक्तिगत होम लोन पर शून्य प्रीपेमेंट और फोरक्लोज़र शुल्क लेता है। फिक्स्ड दर पर 2% शुल्क लागू हो सकता है।",
      },
      {
        question: "ICICI की वर्तमान होम लोन दर क्या है?",
        answer:
          "2024-2025 में ICICI Bank की फ्लोटिंग होम लोन दर लगभग 8.50% से 9.60% वार्षिक के बीच है, CIBIL स्कोर और उधारकर्ता श्रेणी के आधार पर। वेतन खाता वाले ग्राहकों को 'Instabizz' या खास योजनाओं में छूट मिल सकती है।",
      },
    ],
  },
  {
    id: "axis-home-loan-prepayment-calculator",
    type: "bank",
    title: "Axis होम लोन प्रीपेमेंट कैलक्युलेटर",
    h1: "Axis होम लोन प्रीपेमेंट कैलक्युलेटर",
    intro:
      "Axis Bank होम लोन पर प्रीपेमेंट और बचत गणना करें। Axis फ्लोटिंग दर (BRLLR आधारित) पर व्यक्तिगत उधारकर्ताओं से कोई प्रीपेमेंट या फोरक्लोज़र शुल्क नहीं लेता।",
    metaTitle:
      "Axis होम लोन प्रीपेमेंट कैलक्युलेटर | Axis Prepayment - Hindi",
    metaDescription:
      "Axis Bank होम लोन पर प्रीपेमेंट से कितना ब्याज और समय बचेगा, जानें। BRLLR दर, फोरक्लोज़र शुल्क और नियम।",
    canonical: "/hi/axis-home-loan-prepayment-calculator",
    faqs: [
      {
        question: "Axis होम लोन पर प्रीपेमेंट शुल्क क्या है?",
        answer:
          "Axis Bank फ्लोटिंग दर (BRLLR आधारित) वाले व्यक्तिगत होम लोन पर शून्य प्रीपेमेंट और फोरक्लोज़र शुल्क लेता है। फिक्स्ड दर पर 2% शुल्क लागू हो सकता है।",
      },
      {
        question: "Axis की वर्तमान होम लोन दर क्या है?",
        answer:
          "2024-2025 में Axis Bank की फ्लोटिंग होम लोन दर लगभग 8.75% से 9.65% वार्षिक के बीच है, CIBIL स्कोर और उधारकर्ता श्रेणी के आधार पर। वेतन खाता वाले ग्राहकों को विशेष छूट मिल सकती है।",
      },
    ],
  },

  // ---- 10 Hinglish (Roman script) pages ----
  {
    id: "home-loan-jaldi-kaise-khatam-kare",
    type: "hinglish",
    title: "Home Loan Jaldi Kaise Khatam Kare - 7 Tarike",
    h1: "Home Loan Jaldi Kaise Khatam Kare? 7 Asaan Tarike",
    intro:
      "Home loan jaldi khatam karne ke 7 asaan tarike jaaniye - monthly extra EMI, lump sum prepayment, annual bonus se payment, EMI badhana, tenure kam karna, balance transfer aur foreclosure. Har tarike ka fayda aur nuksaan samjho.",
    metaTitle: "Home Loan Jaldi Kaise Khatam Kare? 7 Asaan Tarike",
    metaDescription:
      "Home loan jaldi khatam karne ke 7 tarike - extra EMI, lump sum prepayment, bonus se payment, balance transfer, foreclosure. Step-by-step guide.",
    canonical: "/hi/home-loan-jaldi-kaise-khatam-kare",
    faqs: [
      {
        question: "Home loan jaldi khatam karne ka sabse best tarika kya hai?",
        answer:
          "Sabse best tarika hai pehle saal se hi chhota monthly prepayment shuru karna, aur saal mein kam se kam ek lump sum prepayment karna. EMI same rakhein aur tenure kam karein - isse 3-5 guna zyada byaaj bachta hai.",
      },
      {
        question: "Kya prepayment karne se CIBIL score kharab hota hai?",
        answer:
          "Nahi, bilkul nahi. Prepayment karne se CIBIL score achha hota hai kyunki aapka outstanding principal kam hota hai aur aap debt-free ho jaate hain. Foreclosure bhi CIBIL score ko improve karta hai.",
      },
    ],
  },
  {
    id: "emi-reduce-kare-ya-tenure",
    type: "hinglish",
    title: "EMI Reduce Kare Ya Tenure? Kya Behtar Hai",
    h1: "EMI Reduce Kare Ya Tenure - Kya Behtar Hai?",
    intro:
      "Prepayment ke baad EMI reduce karein ya tenure reduce karein? Dono ke fayde aur nuksaan samjho. Zyada tar cases mein tenure kam karna behtar hota hai kyunki isse 3-5 guna zyada byaaj bachta hai.",
    metaTitle: "EMI Reduce Kare Ya Tenure? Kya Behtar Hai - Guide",
    metaDescription:
      "Prepayment ke baad EMI kam karein ya tenure kam karein? Dono ke fayde aur nuksaan. Kaunsa behtar hai aur kab, jaaniye.",
    canonical: "/hi/emi-reduce-kare-ya-tenure",
    faqs: [
      {
        question: "Tenure kam karne se kitna byaaj bachta hai?",
        answer:
          "₹50 lakh ke loan par 8.5% dhar aur 20 saal ki avadhi mein ₹5 lakh ke prepayment se tenure kam karne par lagbhag ₹14-16 lakh byaaj bachta hai, jabki EMI kam karne par sirf ₹4-5 lakh bachta hai. Tenure kam karna 3-5 guna behtar hai.",
      },
      {
        question: "Kab EMI reduce karna chahiye?",
        answer:
          "EMI reduce karein jab monthly cash flow mein dikkat ho - job change, salary cut, medical expense ya bachhe ki education ke baad. Isse FOIR bhi sudharta hai jisse doosra loan lene mein aasani hoti hai.",
      },
    ],
  },
  {
    id: "home-loan-prepayment-kaise-kare",
    type: "hinglish",
    title: "Home Loan Prepayment Kaise Kare - Step by Step",
    h1: "Home Loan Prepayment Kaise Kare? Step by Step Guide",
    intro:
      "Home loan prepayment kaise karein - online aur offline dono tarike jaaniye. NetBanking, mobile app, branch visit - sabhi options. Prepayment se pehle dhyan rakhne wali baatein aur documents.",
    metaTitle: "Home Loan Prepayment Kaise Kare? Step by Step Guide",
    metaDescription:
      "Home loan prepayment karne ka step-by-step tarika - NetBanking, mobile app, branch. Documents, charges aur process jaaniye.",
    canonical: "/hi/home-loan-prepayment-kaise-kare",
    faqs: [
      {
        question: "Prepayment karne ke liye kya documents chahiye?",
        answer:
          "Online prepayment ke liye sirf NetBanking login chahiye. Branch mein prepayment ke liye loan account number, PAN card, aur cheque ya DD chahiye. Kuch banks mein prepayment request form bharna padta hai.",
      },
      {
        question: "Prepayment karne ke baad kya NOC milta hai?",
        answer:
          "Nahi, prepayment (part payment) par NOC nahi milta. NOC sirf foreclosure par milta hai jab aap poora loan band karte hain. Prepayment par bank updated amortization schedule de sakta hai.",
      },
    ],
  },
  {
    id: "lump-sum-prepayment-fayde",
    type: "hinglish",
    title: "Lump Sum Prepayment Ke Fayde - Kab Karein",
    h1: "Lump Sum Prepayment Ke Fayde Aur Kab Karein",
    intro:
      "Lump sum prepayment ke fayde jaaniye - bonus, investment maturity, property sale ya inheritance se mila paisa loan mein lagana. Kab karein aur kitna karein, iski puri guide.",
    metaTitle: "Lump Sum Prepayment Ke Fayde | Kab Karein - Guide",
    metaDescription:
      "Lump sum prepayment ke fayde aur kab karna chahiye. Bonus, property sale, inheritance ya investment se paisa lagane ka tarika.",
    canonical: "/hi/lump-sum-prepayment-fayde",
    faqs: [
      {
        question: "Lump sum prepayment kab sabse faydemand hota hai?",
        answer:
          "Loan ke pehle 5-7 saal mein kiya gaya lump sum prepayment sabse zyada byaaj bachata hai kyunki shuruati saalon mein EMI ka bada hissa byaaj mein jata hai. ₹1 lakh ka prepayment pehle saal mein karib ₹1.85 lakh byaaj bacha sakta hai.",
      },
      {
        question: "Lump sum prepayment kitna karein?",
        answer:
          "Koi fix rule nahi hai, lekin ideal tarika hai saal mein kam se kam ek EMI ke barabar lump sum prepayment karna. Agar bonus ya maturity se ₹1-3 lakh milte hain, to poora amount prepayment mein laga dein.",
      },
    ],
  },
  {
    id: "part-payment-kaise-kare",
    type: "hinglish",
    title: "Part Payment Kaise Kare - Home Loan",
    h1: "Part Payment Kaise Kare? Home Loan Ke Liye Guide",
    intro:
      "Part payment yaani EMI ke alawa kuch extra paisa jama karke principal kam karna. Kaise karein, kitna karein, kab karein - sab kuch is guide mein. Part payment se byaaj aur tenure dono kam hote hain.",
    metaTitle: "Part Payment Kaise Kare? Home Loan Guide - Hindi/Hinglish",
    metaDescription:
      "Home loan part payment kaise karein - process, charges, best time. Step-by-step guide NetBanking aur branch ke liye.",
    canonical: "/hi/part-payment-kaise-kare",
    faqs: [
      {
        question: "Part payment aur prepayment mein kya antar hai?",
        answer:
          "Dono same hain - jab aap EMI ke alawa kuch extra paisa jama karke principal kam karte hain use part payment ya prepayment kehte hain. Foreclosure tab hota hai jab poora bakiya ek hi baar mein chuka kar loan band kar dete hain.",
      },
      {
        question: "Part payment ka minimum amount kya hai?",
        answer:
          "Zyada tar banks mein koi minimum amount nahi hai, lekin kuch banks ₹10,000 ya ek EMI ke barabar minimum maan sakte hain. NetBanking ya branch mein prepayment request jama karein.",
      },
    ],
  },
  {
    id: "foreclosure-charges-kya-hai",
    type: "hinglish",
    title: "Foreclosure Charges Kya Hai? RBI Rules",
    h1: "Foreclosure Charges Kya Hai? RBI Ke Niyam Jaaniye",
    intro:
      "Foreclosure charges kya hai aur RBI ke rules kya kehte hain - jaaniye. Floating rate par individual home loan mein zero charges, fixed rate par 2% tak. Sabhi banks ke rules aur process.",
    metaTitle: "Foreclosure Charges Kya Hai? RBI Rules 2024 - Hindi/Hinglish",
    metaDescription:
      "Foreclosure charges kya hai, RBI ke niyam, kitne percent lagte hain, kab nahi lagte - sab kuch jaaniye.",
    canonical: "/hi/foreclosure-charges-kya-hai",
    faqs: [
      {
        question: "Foreclosure charges kab nahi lagte?",
        answer:
          "RBI ke June 2024 ke niyam ke anusar, floating rate wale individual home loans par koi foreclosure charges nahi lagte, chahe loan amount kuch bhi ho. Ye sabhi banks aur NBFCs par lagu hota hai. Fixed rate ya non-individual loans par 2% tak lag sakte hain.",
      },
      {
        question: "Foreclosure process kitne din mein complete hoti hai?",
        answer:
          "Bank mein foreclosure request dene ke baad 7-15 working days mein process complete ho jati hai. NOC aur original documents 15-30 days mein mil jaate hain. Agar bank der kare to RBI Ombudsman se shikayat kar sakte hain.",
      },
    ],
  },
  {
    id: "emi-calculate-kaise-kare",
    type: "hinglish",
    title: "EMI Calculate Kaise Kare - Formula Aur Tarika",
    h1: "EMI Calculate Kaise Kare? Formula Aur Asaan Tarika",
    intro:
      "EMI calculate kaise karein - formula samjho aur apni EMI nikalo. Loan amount, interest rate aur tenure se EMI kaise nikalti hai, puri samajh. Online calculator se turant result.",
    metaTitle: "EMI Calculate Kaise Kare? Formula Aur Asaan Tarika",
    metaDescription:
      "EMI calculate karne ka formula aur tarika. Loan amount, rate aur tenure se monthly EMI kaise nikalein, jaaniye.",
    canonical: "/hi/emi-calculate-kaise-kare",
    faqs: [
      {
        question: "EMI ka formula kya hai?",
        answer:
          "EMI = P × r × (1+r)^n / ((1+r)^n - 1), jahan P loan amount, r monthly interest rate (annual rate / 12 / 100) aur n months mein tenure. Example: ₹50 lakh ka loan 8.5% par 20 saal ke liye lagbhag ₹43,391 monthly EMI deta hai.",
      },
      {
        question: "EMI change kar sakte hain?",
        answer:
          "Floating rate loan mein EMI change karne ka request bank se kar sakte hain. Aksar banks rate badhane par tenure badhate hain EMI same rakh ke. Aap EMI badhane ya ghatane ka request kar sakte hain, lekin tenure adjust hoga.",
      },
    ],
  },
  {
    id: "balance-transfer-fayde",
    type: "hinglish",
    title: "Balance Transfer Ke Fayde Aur Nuksaan",
    h1: "Home Loan Balance Transfer - Fayde Aur Nuksaan",
    intro:
      "Balance transfer ke fayde aur nuksaan dono samjho. Kab karna chahiye, kab nahi. Naya bank, kam dhar, kya documents chahiye - sab kuch is detailed guide mein.",
    metaTitle: "Balance Transfer Ke Fayde | Kab Karein - Guide",
    metaDescription:
      "Home loan balance transfer ke fayde, nuksaan, charges, kab karna chahiye. SBI, HDFC, ICICI, Axis me transfer karne ki guide.",
    canonical: "/hi/balance-transfer-fayde",
    faqs: [
      {
        question: "Balance transfer kab faydemand hota hai?",
        answer:
          "Jab aapko current rate se kam se kam 0.5% kam rate mile aur bakiya tenure 10 saal se zyada ho. ₹50 lakh ke loan par 0.5% kam rate se 20 saal mein lagbhag ₹4-6 lakh byaaj bachta hai.",
      },
      {
        question: "Balance transfer mein kya kharch aate hain?",
        answer:
          "Naye bank ka processing fee (loan amount ka 0.25-0.50%), valuation fee, legal fee aur stamp duty. Purane bank se floating rate par koi foreclosure charge nahi. Saare kharch ko bachat se compare kar lein.",
      },
    ],
  },
  {
    id: "house-loan-quickly-pay-off",
    type: "hinglish",
    title: "House Loan Quickly Pay Off - 5 Strategies",
    h1: "House Loan Quickly Pay Off - 5 Proven Strategies",
    intro:
      "House loan quickly pay off karne ke 5 proven strategies jaaniye. Step-up prepayment, EMI rounding, annual bonus se payment, bi-annual lump sum, aur aggressive early payment. Har strategy ke numbers samet.",
    metaTitle: "House Loan Quickly Pay Off - 5 Proven Strategies",
    metaDescription:
      "Apne house loan ko jaldi pay off karne ke 5 strategies. Numbers samet, real examples. Extra EMI, lump sum, step-up prepayment.",
    canonical: "/hi/house-loan-quickly-pay-off",
    faqs: [
      {
        question: "House loan jaldi khatam karne ka sabse fast tarika kya hai?",
        answer:
          "Sabse fast tarika hai monthly EMI ko 1.5-2 guna badhana. ₹50 lakh ke 20-saal loan ko 10 saal mein khatam karne ke liye lagbhag ₹18,605/month extra pay karna padega. Aur bhi fast karne ke liye saal mein 1-2 lakh lump sum bhi add karein.",
      },
      {
        question: "Kya prepayment karke tax benefit kho jaata hai?",
        answer:
          "Section 24(b) ke under ₹2 lakh/year tak interest deduction milta hai. Agar aapka annual interest already ₹2 lakh se kam hai (last years mein), to prepayment se unused deduction kho jaata hai. Isliye early years mein prepayment fully faydemand hai.",
      },
    ],
  },
  {
    id: "prepayment-or-investment",
    type: "hinglish",
    title: "Prepayment Karein Ya Investment - Kya Behtar",
    h1: "Prepayment Karein Ya Investment? Kya Behtar Hai",
    intro:
      "Extra paisa home loan prepayment mein lagayein ya equity mutual funds mein invest karein? Dono ke returns compare karein - 8.5% guaranteed tax-free vs 11-13% expected equity returns.",
    metaTitle: "Prepayment Karein Ya Investment? Kya Behtar - Guide",
    metaDescription:
      "Home loan prepayment vs investment - kya behtar hai. Returns comparison, tax impact, risk analysis. Decision framework.",
    canonical: "/hi/prepayment-or-investment",
    faqs: [
      {
        question: "Prepayment ka return kitna hota hai?",
        answer:
          "Prepayment ka return guaranteed hota hai aur aapke home loan ROI ke barabar hota hai - jo ki post-tax hai. 8.5% ke loan par prepayment karne se 8.5% post-tax guaranteed return milta hai, jo FD se behtar hai (FD par tax lagta hai).",
      },
      {
        question: "Equity mutual funds mein invest karein ya prepayment?",
        answer:
          "30% tax slab wale ke liye: 12% pre-tax equity return = 11.1% post-tax (₹1.25 lakh ke baad 10% LTCG). 8.5% post-tax prepayment se 2-3% zyada, lekin volatility aur risk ke saath. Hybrid approach best hai - 60:40 equity aur prepayment mein split.",
      },
    ],
  },

  // ---- 10 scenario pages (loan sizes) ----
  {
    id: "50-lakh-home-loan-prepayment",
    type: "scenario",
    title: "₹50 लाख होम लोन प्रीपेमेंट कैलक्युलेटर",
    h1: "₹50 लाख होम लोन प्रीपेमेंट — ब्याज और अवधि बचत",
    intro:
      "₹50 लाख का होम लोन भारत में सबसे आम है। 8.5% दर पर 20 वर्ष की अवधि में मात्र ₹10,000 मासिक प्रीपेमेंट से लगभग ₹21 लाख ब्याज बच सकता है और ऋण 7 वर्ष जल्दी समाप्त हो सकता है।",
    metaTitle: "₹50 लाख होम लोन प्रीपेमेंट कैलक्युलेटर | Byaaj Bachat",
    metaDescription:
      "₹50 लाख होम लोन पर prepayment se kitna byaaj aur samay bachega. Real examples with monthly extra EMI aur lump sum.",
    canonical: "/hi/50-lakh-home-loan-prepayment",
    faqs: [
      {
        question: "₹50 लाख के लोन की EMI कितनी होगी?",
        answer:
          "8.5% दर पर 20 वर्ष की अवधि में ₹50 लाख के लोन की मासिक EMI लगभग ₹43,391 होगी। 25 वर्ष के लिए ₹40,261 और 30 वर्ष के लिए ₹38,446 होगी।",
      },
      {
        question: "₹50 लाख के लोन पर कितना प्रीपेमेंट करना चाहिए?",
        answer:
          "आय के अनुसार, सालाना आय का 10-20% प्रीपेमेंट में लगाना एक अच्छा लक्ष्य है। ₹1 लाख मासिक आय पर ₹10,000-20,000 प्रीपेमेंट करें। साथ ही सालाना बोनस का पूरा हिस्सा भी जमा करें।",
      },
    ],
  },
  {
    id: "75-lakh-home-loan-prepayment",
    type: "scenario",
    title: "₹75 लाख होम लोन प्रीपेमेंट कैलक्युलेटर",
    h1: "₹75 लाख होम लोन प्रीपेमेंट — बचत गणना",
    intro:
      "₹75 लाख का होम लोन मेट्रो शहरों की टियर-2 संपत्तियों के लिए आम है। 8.6% दर पर 20 वर्ष की अवधि में ₹15,000 मासिक प्रीपेमेंट से लगभग ₹33 लाख ब्याज बच सकता है।",
    metaTitle: "₹75 लाख होम लोन प्रीपेमेंट कैलक्युलेटर | Byaaj Bachat",
    metaDescription:
      "₹75 लाख होम लोन पर prepayment se kitna byaaj aur samay bachega. Monthly extra EMI aur lump sum ke examples.",
    canonical: "/hi/75-lakh-home-loan-prepayment",
    faqs: [
      {
        question: "₹75 लाख के लोन की EMI कितनी होगी?",
        answer:
          "8.6% दर पर 20 वर्ष की अवधि में ₹75 लाख के लोन की मासिक EMI लगभग ₹65,617 होगी। 25 वर्ष के लिए लगभग ₹60,723 और 30 वर्ष के लिए लगभग ₹58,073 होगी।",
      },
      {
        question: "₹75 लाख के लोन पर ₹10 लाख का प्रीपेमेंट क्या करेगा?",
        answer:
          "तीसरे वर्ष में ₹10 लाख का एकमुश्त प्रीपेमेंट आपकी अवधि लगभग 5-6 वर्ष घटा सकता है और ₹25-30 लाख तक ब्याज बचा सकता है। यह संपत्ति बिक्री या बड़े बोनस के लिए आदर्श है।",
      },
    ],
  },
  {
    id: "1-crore-home-loan-prepayment",
    type: "scenario",
    title: "₹1 करोड़ होम लोन प्रीपेमेंट कैलक्युलेटर",
    h1: "₹1 करोड़ होम लोन प्रीपेमेंट — बड़ी बचत",
    intro:
      "₹1 करोड़ का होम लोन मेट्रो शहरों की प्रीमियम संपत्तियों के लिए आम है। 8.5% दर पर 25 वर्ष की अवधि में ₹25,000 मासिक प्रीपेमेंट से लगभग ₹65 लाख तक ब्याज बच सकता है और ऋण 8 वर्ष जल्दी समाप्त हो सकता है।",
    metaTitle: "₹1 करोड़ होम लोन प्रीपेमेंट कैलक्युलेटर | 1 Crore Loan",
    metaDescription:
      "₹1 करोड़ होम लोन पर prepayment se kitna byaaj aur samay bachega. Large metro loans ke liye examples.",
    canonical: "/hi/1-crore-home-loan-prepayment",
    faqs: [
      {
        question: "₹1 करोड़ के लोन की EMI कितनी होगी?",
        answer:
          "8.5% दर पर 25 वर्ष की अवधि में ₹1 करोड़ के लोन की मासिक EMI लगभग ₹80,523 होगी। 20 वर्ष के लिए लगभग ₹86,782 और 30 वर्ष के लिए लगभग ₹76,891 होगी।",
      },
      {
        question: "₹1 करोड़ के लोन पर कर क्या लाभ मिलेगा?",
        answer:
          "Section 24(b) के तहत ₹2 लाख तक ब्याज पर कर कटौती मिलती है, और Section 80C के तहत मूलधन चुकौती पर ₹1.5 लाख तक। पहले वर्ष की कर बचत ₹60,000-70,000 तक हो सकती है, खासकर 30% स्लैब में।",
      },
    ],
  },
  {
    id: "35-lakh-home-loan-prepayment",
    type: "scenario",
    title: "₹35 लाख होम लोन प्रीपेमेंट कैलक्युलेटर",
    h1: "₹35 लाख होम लोन प्रीपेमेंट — टियर-2 शहर",
    intro:
      "₹35 लाख का होम लोन टियर-2 शहरों और छोटे मेट्रो में आम है। 8.4% दर पर 20 वर्ष की अवधि में ₹5,000 मासिक प्रीपेमेंट से लगभग ₹10 लाख ब्याज बच सकता है और ऋण 5 वर्ष जल्दी समाप्त हो सकता है।",
    metaTitle: "₹35 लाख होम लोन प्रीपेमेंट कैलक्युलेटर | Small Loans",
    metaDescription:
      "₹35 लाख होम लोन पर prepayment se kitna byaaj bachega. Tier-2 cities ke liye real examples.",
    canonical: "/hi/35-lakh-home-loan-prepayment",
    faqs: [
      {
        question: "₹35 लाख के लोन की EMI कितनी होगी?",
        answer:
          "8.4% दर पर 20 वर्ष की अवधि में ₹35 लाख के लोन की मासिक EMI लगभग ₹30,133 होगी। 25 वर्ष के लिए लगभग ₹27,882 और 30 वर्ष के लिए लगभग ₹26,639 होगी।",
      },
      {
        question: "₹35 लाख के लोन को जल्दी कैसे चुकाएं?",
        answer:
          "EMI को ₹32,000 तक बढ़ा दें (₹2,000 अतिरिक्त), और सालाना बोनस का एक हिस्सा (₹50,000-1 लाख) प्रीपेमेंट में लगाएं। इससे 20 वर्ष का लोन 13-14 वर्ष में चुक सकता है।",
      },
    ],
  },
  {
    id: "60-lakh-home-loan-prepayment",
    type: "scenario",
    title: "₹60 लाख होम लोन प्रीपेमेंट कैलक्युलेटर",
    h1: "₹60 लाख होम लोन प्रीपेमेंट — बचत गणना",
    intro:
      "₹60 लाख का होम लोन मेट्रो शहरों में 2BHK संपत्तियों के लिए आम है। 8.5% दर पर 20 वर्ष की अवधि में ₹12,000 मासिक प्रीपेमेंट से लगभग ₹26 लाख ब्याज बच सकता है।",
    metaTitle: "₹60 लाख होम लोन प्रीपेमेंट कैलक्युलेटर | Byaaj Bachat",
    metaDescription:
      "₹60 लाख होम लोन पर prepayment se kitna byaaj aur samay bachega. 2BHK property ke liye real examples.",
    canonical: "/hi/60-lakh-home-loan-prepayment",
    faqs: [
      {
        question: "₹60 लाख के लोन की EMI कितनी होगी?",
        answer:
          "8.5% दर पर 20 वर्ष की अवधि में ₹60 लाख के लोन की मासिक EMI लगभग ₹52,069 होगी। 25 वर्ष के लिए लगभग ₹48,313 और 30 वर्ष के लिए लगभग ₹46,135 होगी।",
      },
    ],
  },
  {
    id: "40-lakh-home-loan-prepayment",
    type: "scenario",
    title: "₹40 लाख होम लोन प्रीपेमेंट कैलक्युलेटर",
    h1: "₹40 लाख होम लोन प्रीपेमेंट — गणना",
    intro:
      "₹40 लाख का होम लोन टियर-2 शहरों में 2BHK संपत्तियों के लिए आम है। 8.5% दर पर 20 वर्ष की अवधि में ₹8,000 मासिक प्रीपेमेंट से लगभग ₹17 लाख ब्याज बच सकता है।",
    metaTitle: "₹40 लाख होम लोन प्रीपेमेंट कैलक्युलेटर | Byaaj Bachat",
    metaDescription:
      "₹40 लाख होम लोन पर prepayment se kitna byaaj aur samay bachega. Real examples with monthly extra EMI.",
    canonical: "/hi/40-lakh-home-loan-prepayment",
    faqs: [
      {
        question: "₹40 लाख के लोन की EMI कितनी होगी?",
        answer:
          "8.5% दर पर 20 वर्ष की अवधि में ₹40 लाख के लोन की मासिक EMI लगभग ₹34,713 होगी। 25 वर्ष के लिए लगभग ₹32,209 और 30 वर्ष के लिए लगभग ₹30,757 होगी।",
      },
    ],
  },
  {
    id: "80-lakh-home-loan-prepayment",
    type: "scenario",
    title: "₹80 लाख होम लोन प्रीपेमेंट कैलक्युलेटर",
    h1: "₹80 लाख होम लोन प्रीपेमेंट — बचत गणना",
    intro:
      "₹80 लाख का होम लोन मेट्रो शहरों की टियर-2 संपत्तियों के लिए आम है। 8.6% दर पर 20 वर्ष की अवधि में ₹15,000 मासिक प्रीपेमेंट से लगभग ₹35 लाख ब्याज बच सकता है।",
    metaTitle: "₹80 लाख होम लोन प्रीपेमेंट कैलक्युलेटर | Byaaj Bachat",
    metaDescription:
      "₹80 लाख होम लोन पर prepayment se kitna byaaj aur samay bachega. Metro tier-2 properties ke liye.",
    canonical: "/hi/80-lakh-home-loan-prepayment",
    faqs: [
      {
        question: "₹80 लाख के लोन की EMI कितनी होगी?",
        answer:
          "8.6% दर पर 20 वर्ष की अवधि में ₹80 लाख के लोन की मासिक EMI लगभग ₹69,991 होगी। 25 वर्ष के लिए लगभग ₹64,775 और 30 वर्ष के लिए लगभग ₹61,945 होगी।",
      },
    ],
  },
  {
    id: "30-lakh-home-loan-prepayment",
    type: "scenario",
    title: "₹30 लाख होम लोन प्रीपेमेंट कैलक्युलेटर",
    h1: "₹30 लाख होम लोन प्रीपेमेंट — छोटे लोन",
    intro:
      "₹30 लाख का होम लोन छोटे शहरों और कस्बों में आम है। 8.4% दर पर 20 वर्ष की अवधि में ₹5,000 मासिक प्रीपेमेंट से लगभग ₹9 लाख ब्याज बच सकता है।",
    metaTitle: "₹30 लाख होम लोन प्रीपेमेंट कैलक्युलेटर | Small Loan",
    metaDescription:
      "₹30 लाख होम लोन पर prepayment se kitna byaaj aur samay bachega. Small cities ke liye real examples.",
    canonical: "/hi/30-lakh-home-loan-prepayment",
    faqs: [
      {
        question: "₹30 लाख के लोन की EMI कितनी होगी?",
        answer:
          "8.4% दर पर 20 वर्ष की अवधि में ₹30 लाख के लोन की मासिक EMI लगभग ₹25,829 होगी। 25 वर्ष के लिए लगभग ₹23,899 और 30 वर्ष के लिए लगभग ₹22,833 होगी।",
      },
    ],
  },
  {
    id: "90-lakh-home-loan-prepayment",
    type: "scenario",
    title: "₹90 लाख होम लोन प्रीपेमेंट कैलक्युलेटर",
    h1: "₹90 लाख होम लोन प्रीपेमेंट — बचत गणना",
    intro:
      "₹90 लाख का होम लोन मेट्रो शहरों की बड़ी संपत्तियों के लिए आम है। 8.6% दर पर 20 वर्ष की अवधि में ₹18,000 मासिक प्रीपेमेंट से लगभग ₹40 लाख ब्याज बच सकता है।",
    metaTitle: "₹90 लाख होम लोन प्रीपेमेंट कैलक्युलेटर | Byaaj Bachat",
    metaDescription:
      "₹90 लाख होम लोन पर prepayment se kitna byaaj aur samay bachega. Large metro properties ke liye.",
    canonical: "/hi/90-lakh-home-loan-prepayment",
    faqs: [
      {
        question: "₹90 लाख के लोन की EMI कितनी होगी?",
        answer:
          "8.6% दर पर 20 वर्ष की अवधि में ₹90 लाख के लोन की मासिक EMI लगभग ₹78,740 होगी। 25 वर्ष के लिए लगभग ₹72,871 और 30 वर्ष के लिए लगभग ₹69,688 होगी।",
      },
    ],
  },
  {
    id: "2-crore-home-loan-prepayment",
    type: "scenario",
    title: "₹2 करोड़ होम लोन प्रीपेमेंट कैलक्युलेटर",
    h1: "₹2 करोड़ होम लोन प्रीपेमेंट — बड़ी बचत",
    intro:
      "₹2 करोड़ का होम लोन प्रीमियम मेट्रो संपत्तियों के लिए आम है। 8.5% दर पर 25 वर्ष की अवधि में ₹50,000 मासिक प्रीपेमेंट से लगभग ₹1.3 करोड़ तक ब्याज बच सकता है।",
    metaTitle: "₹2 करोड़ होम लोन प्रीपेमेंट कैलक्युलेटर | Large Loan",
    metaDescription:
      "₹2 करोड़ होम लोन पर prepayment se kitna byaaj aur samay bachega. Premium metro properties ke liye.",
    canonical: "/hi/2-crore-home-loan-prepayment",
    faqs: [
      {
        question: "₹2 करोड़ के लोन की EMI कितनी होगी?",
        answer:
          "8.5% दर पर 25 वर्ष की अवधि में ₹2 करोड़ के लोन की मासिक EMI लगभग ₹1,61,046 होगी। 20 वर्ष के लिए लगभग ₹1,73,564 और 30 वर्ष के लिए लगभग ₹1,53,783 होगी।",
      },
      {
        question: "₹2 करोड़ के लोन पर प्रीपेमेंट का कर असर क्या है?",
        answer:
          "Section 24(b) के तहत केवल ₹2 लाख तक ब्याज पर कर कटौती मिलती है। ₹2 करोड़ के लोन पर पहले वर्ष का ब्याज ही ₹16-17 लाख होता है, इसलिए अधिकांश ब्याज पर कोई कर लाभ नहीं मिलता। इसलिए प्रीपेमेंट और भी ज्यादा फायदेमंद है।",
      },
    ],
  },

  // ---- 10 guide pages ----
  {
    id: "home-loan-jaldi-chukaye",
    type: "guide",
    title: "होम लोन जल्दी कैसे चुकाएं — 7 तरीके",
    h1: "होम लोन जल्दी कैसे चुकाएं? 7 आसान तरीके",
    intro:
      "होम लोन जल्दी चुकाने के 7 आसान तरीके जानें — मासिक अतिरिक्त EMI, एकमुश्त प्रीपेमेंट, सालाना बोनस से भुगतान, EMI बढ़ाना, अवधि घटाना, बैलेंस ट्रांसफर और फोरक्लोज़र।",
    metaTitle: "होम लोन जल्दी कैसे चुकाएं? 7 Asaan Tarike - Hindi",
    metaDescription:
      "होम लोन जल्दी चुकाने के 7 तरीके। प्रीपेमेंट, EMI बढ़ाना, बैलेंस ट्रांसफर और फोरक्लोज़र की पूरी गाइड।",
    canonical: "/hi/home-loan-jaldi-chukaye",
    faqs: [
      {
        question: "होम लोन जल्दी चुकाने का सबसे असरदार तरीका क्या है?",
        answer:
          "पहले वर्ष से ही छोटा मासिक प्रीपेमेंट शुरू करना सबसे असरदार तरीका है। ₹50 लाख के लोन पर मात्र ₹5,000/माह से 20 वर्ष का लोन 15-16 वर्ष में चुक सकता है।",
      },
    ],
  },
  {
    id: "byaj-kaise-bachaye",
    type: "guide",
    title: "होम लोन ब्याज कैसे बचाएं — गाइड",
    h1: "होम लोन ब्याज कैसे बचाएं? पूरी गाइड",
    intro:
      "होम लोन ब्याज बचाने के सभी तरीके जानें — प्रीपेमेंट, बैलेंस ट्रांसफर, अवधि घटाना, और अधिक अवधि कम राशि की रणनीति। लाखों बचाने का तरीका।",
    metaTitle: "होम लोन ब्याज कैसे बचाएं? Lakho Bachaye - Hindi",
    metaDescription:
      "होम लोन ब्याज बचाने के तरीके — प्रीपेमेंट, बैलेंस ट्रांसफर, अवधि घटाना। लाखों बचाने की गाइड।",
    canonical: "/hi/byaj-kaise-bachaye",
    faqs: [
      {
        question: "ब्याज बचाने का सबसे बड़ा फायदा कौन सा तरीका देता है?",
        answer:
          "अवधि घटाने वाला प्रीपेमेंट सबसे ज्यादा ब्याज बचाता है। ₹50 लाख के लोन पर ₹5 लाख के प्रीपेमेंट से अवधि घटाने पर ₹14-16 लाख ब्याज बचता है, जबकि EMI घटाने पर केवल ₹4-5 लाख।",
      },
    ],
  },
  {
    id: "prepayment-vs-investment-guide",
    type: "guide",
    title: "प्रीपेमेंट vs निवेश — क्या बेहतर है",
    h1: "प्रीपेमेंट vs निवेश — क्या बेहतर है?",
    intro:
      "अतिरिक्त राशि को होम लोन प्रीपेमेंट में लगाएं या निवेश में? दोनों के रिटर्न तुलना करें — 8.5% गारंटीड टैक्स-फ्री बनाम 11-13% एक्सपेक्टेड इक्विटी रिटर्न।",
    metaTitle: "प्रीपेमेंट vs निवेश | Kya Behtar Hai - Hindi Guide",
    metaDescription:
      "प्रीपेमेंट या निवेश — क्या बेहतर है? Returns comparison, tax impact, risk analysis. Decision framework.",
    canonical: "/hi/prepayment-vs-investment-guide",
    faqs: [
      {
        question: "क्या प्रीपेमेंट निवेश से बेहतर है?",
        answer:
          "निर्भर करता है। कम जोखिम सहनशीलता वालों के लिए प्रीपेमेंट बेहतर है (FD से बेहतर गारंटीड टैक्स-फ्री रिटर्न)। ज्यादा जोखिम सहनशीलता और लंबी अवधि के लिए इक्विटी बेहतर हो सकता है। सबसे अच्छा हाइब्रिड दृष्टिकोण है — 60:40 इक्विटी और प्रीपेमेंट में बांटना।",
      },
    ],
  },
  {
    id: "emi-ganan-sutra",
    type: "guide",
    title: "EMI गणना सूत्र — गाइड",
    h1: "EMI गणना सूत्र — कैसे निकालें",
    intro:
      "EMI गणना का सूत्र समझें — P × r × (1+r)^n / ((1+r)^n - 1)। भारतीय बैंक EMI कैसे निकालते हैं, ब्याज और मूलधन का अनुपात कैसे बदलता है, और प्रीपेमेंट से गणित कैसे बदलता है।",
    metaTitle: "EMI गणना सूत्र | EMI Calculation Formula - Hindi",
    metaDescription:
      "EMI गणना सूत्र समझें। भारतीय बैंक EMI कैसे निकालते हैं, byaaj और mool dhan का अनुपात, prepayment ka asar.",
    canonical: "/hi/emi-ganan-sutra",
    faqs: [
      {
        question: "EMI का सूत्र क्या है?",
        answer:
          "EMI = P × r × (1+r)^n / ((1+r)^n - 1), जहाँ P ऋण राशि, r मासिक ब्याज दर (वार्षिक दर / 12 / 100), और n महीनों में अवधि है। उदाहरण: ₹50 लाख का लोन 8.5% पर 20 वर्ष के लिए लगभग ₹43,391 की मासिक EMI देता है।",
      },
    ],
  },
  {
    id: "cibil-score-impact",
    type: "guide",
    title: "CIBIL स्कोर का होम लोन पर प्रभाव",
    h1: "CIBIL स्कोर का होम लोन दर पर प्रभाव",
    intro:
      "CIBIL स्कोर आपकी होम लोन दर को कैसे प्रभावित करता है — जानें। 750+ स्कोर पर सर्वोत्तम दर, 700-749 पर थोड़ी ज्यादा, 700 से कम पर अस्वीकृति। अपना CIBIL कैसे सुधारें।",
    metaTitle: "CIBIL Score Ka Home Loan Par Asar - Hindi Guide",
    metaDescription:
      "CIBIL स्कोर का होम लोन दर पर प्रभाव जानें। 750+ score par best rate, sudhar ke tarike.",
    canonical: "/hi/cibil-score-impact",
    faqs: [
      {
        question: "CIBIL स्कोर कितना होना चाहिए?",
        answer:
          "सर्वोत्तम होम लोन दर के लिए 750+ CIBIL स्कोर चाहिए। 700-749 पर थोड़ी ज्यादा दर मिलती है, 700 से कम पर अनुमोदन मुश्किल हो सकता है। अधिकतर बैंक 750-900 स्कोर को सर्वोत्तम मानते हैं।",
      },
    ],
  },
  {
    id: "emi-ya-avadhi-ghatao",
    type: "guide",
    title: "EMI कम या अवधि कम — क्या करें",
    h1: "EMI कम करें या अवधि कम — क्या बेहतर है?",
    intro:
      "प्रीपेमेंट के बाद EMI कम करें या अवधि कम करें — दोनों के फायदे और नुकसान समझें। अधिकतर मामलों में अवधि घटाना बेहतर है क्योंकि इससे 3-5 गुना ज्यादा ब्याज बचता है।",
    metaTitle: "EMI Kam Ya Avadhi Kam - Kya Behtar Hai - Hindi",
    metaDescription:
      "प्रीपेमेंट के बाद EMI कम करें या अवधि कम करें? दोनों ke fayde aur nuksaan. Kaunsa behtar hai.",
    canonical: "/hi/emi-ya-avadhi-ghatao",
    faqs: [
      {
        question: "अवधि घटाने से कितना ब्याज बचता है?",
        answer:
          "₹50 लाख के लोन पर ₹5 लाख के प्रीपेमेंट से अवधि घटाने पर ₹14-16 लाख ब्याज बचता है, जबकि EMI घटाने पर केवल ₹4-5 लाख। अवधि घटाना 3-5 गुना बेहतर है।",
      },
    ],
  },
  {
    id: "foreclosure-process",
    type: "guide",
    title: "होम लोन फोरक्लोज़र प्रक्रिया — गाइड",
    h1: "होम लोन फोरक्लोज़र प्रक्रिया — पूरी गाइड",
    intro:
      "होम लोन फोरक्लोज़र की पूरी प्रक्रिया जानें — आवेदन, ब्यौरा, भुगतान, NOC, और दस्तावेज़ वापसी। RBI के नियम और शुल्क की जानकारी।",
    metaTitle: "होम लोन फोरक्लोज़र प्रक्रिया | Foreclosure Process - Hindi",
    metaDescription:
      "होम लोन फोरक्लोज़र की पूरी प्रक्रिया - आवेदन, भुगतान, NOC. RBI ke niyam aur charges ki jankari.",
    canonical: "/hi/foreclosure-process",
    faqs: [
      {
        question: "फोरक्लोज़र में कितना समय लगता है?",
        answer:
          "बैंक में फोरक्लोज़र रिक्वेस्ट देने के बाद 7-15 कार्यदिवसों में प्रक्रिया पूरी हो जाती है। NOC और मूल दस्तावेज़ 15-30 दिनों में वापस मिल जाते हैं। यदि बैंक देरी करे तो RBI लोकपाल से शिकायत कर सकते हैं।",
      },
    ],
  },
  {
    id: "balance-transfer-guide",
    type: "guide",
    title: "होम लोन बैलेंस ट्रांसफर गाइड",
    h1: "होम लोन बैलेंस ट्रांसफर — पूरी गाइड",
    intro:
      "होम लोन बैलेंस ट्रांसफर की पूरी गाइड जानें — कब करें, कैसे करें, क्या दस्तावेज़ चाहिए, खर्च क्या होंगे, और कितनी बचत होगी। SBI, HDFC, ICICI, Axis की तुलना।",
    metaTitle: "होम लोन बैलेंस ट्रांसफर गाइड | Balance Transfer - Hindi",
    metaDescription:
      "होम लोन बैलेंस ट्रांसफर की पूरी गाइड - kab karein, kaise karein, kharch aur bachat. SBI, HDFC, ICICI, Axis ki tulna.",
    canonical: "/hi/balance-transfer-guide",
    faqs: [
      {
        question: "बैलेंस ट्रांसफर कब फायदेमंद है?",
        answer:
          "जब आपको वर्तमान दर से कम से कम 0.5% कम दर मिले और बकाया अवधि 10 वर्ष से ज्यादा हो। ₹50 लाख के लोन पर 0.5% कम दर से 20 वर्ष में लगभग ₹4-6 लाख ब्याज बचता है।",
      },
    ],
  },
  {
    id: "tax-benefits-home-loan",
    type: "guide",
    title: "होम लोन टैक्स लाभ — गाइड",
    h1: "होम लोन टैक्स लाभ — Section 80C, 24(b), 80EE",
    intro:
      "होम लोन पर मिलने वाले सभी टैक्स लाभ जानें — Section 80C पर मूलधन चुकौती पर ₹1.5 लाख, Section 24(b) पर ब्याज पर ₹2 लाख, और Section 80EE पर अतिरिक्त ₹50,000।",
    metaTitle: "होम लोन टैक्स लाभ | Tax Benefits - Hindi Guide",
    metaDescription:
      "होम लोन पर मिलने वाले टैक्स लाभ - Section 80C, 24(b), 80EE. Kitna deduction milega aur kaise.",
    canonical: "/hi/tax-benefits-home-loan",
    faqs: [
      {
        question: "होम लोन पर कितना टैक्स लाभ मिलता है?",
        answer:
          "Section 80C के तहत मूलधन चुकौती पर ₹1.5 लाख, Section 24(b) के तहत ब्याज पर ₹2 लाख (स्व-कब्ज़ित संपत्ति के लिए), और पहली बार खरीदने वालों के लिए Section 80EE में अतिरिक्त ₹50,000 (₹35 लाख तक के लोन पर)। 30% स्लैब में कुल वार्षिक बचत ₹1.2 लाख तक हो सकती है।",
      },
    ],
  },
  {
    id: "refinance-guide",
    type: "guide",
    title: "होम लोन रिफाइनेंस गाइड",
    h1: "होम लोन रिफाइनेंस — पूरी गाइड",
    intro:
      "होम लोन रिफाइनेंस की पूरी गाइड — कब करें, कैसे करें, खर्च और बचत की गणना। कम दर पर नया लोन लेकर पुराना लोन चुकाकर लाखों बचाएं।",
    metaTitle: "होम लोन रिफाइनेंस गाइड | Refinance - Hindi",
    metaDescription:
      "होम लोन रिफाइनेंस की पूरी गाइड - kab karein, kaise karein, kharch aur bachat. Lakho bachayein.",
    canonical: "/hi/refinance-guide",
    faqs: [
      {
        question: "रिफाइनेंस से कितनी बचत होती है?",
        answer:
          "₹50 लाख के लोन पर 0.5% कम दर मिलने से 20 वर्ष में लगभग ₹4-6 लाख ब्याज बचता है। यदि 1% कम दर मिले तो बचत ₹8-10 लाख तक हो सकती है। प्रोसेसिंग शुल्क और अन्य खर्च भी जोड़कर देखें।",
      },
    ],
  },

  // ---- 6+ general info pages ----
  {
    id: "prepayment-kya-hai",
    type: "guide",
    title: "प्रीपेमेंट क्या है — पूरी जानकारी",
    h1: "होम लोन प्रीपेमेंट क्या है?",
    intro:
      "प्रीपेमेंट का अर्थ, प्रकार (आंशिक प्रीपेमेंट, एकमुश्त प्रीपेमेंट, फोरक्लोज़र), शुल्क नियम, और फायदे जानें। भारत में प्रीपेमेंट से जुड़े सभी नियम और प्रक्रिया।",
    metaTitle: "प्रीपेमेंट क्या है? | What is Prepayment - Hindi",
    metaDescription:
      "होम लोन प्रीपेमेंट क्या है, types, charges, fayde. RBI ke niyam aur process ki jankari.",
    canonical: "/hi/prepayment-kya-hai",
    faqs: [
      {
        question: "प्रीपेमेंट का अर्थ क्या है?",
        answer:
          "प्रीपेमेंट यानी अपनी निर्धारित EMI के अतिरिक्त कुछ राशि जमा करके बकाया मूलधन कम करना। इससे आपकी अवधि या EMI कम हो सकती है। फ्लोटिंग दर वाले व्यक्तिगत होम लोन पर यह शुल्क मुक्त है।",
      },
      {
        question: "प्रीपेमेंट के कितने प्रकार हैं?",
        answer:
          "तीन मुख्य प्रकार हैं: (1) आंशिक प्रीपेमेंट - EMI के अतिरिक्त कुछ राशि जमा करना, (2) एकमुश्त प्रीपेमेंट - बड़ी राशि एक बार में जमा करना, (3) फोरक्लोज़र - पूरा बकाया चुकाकर लोन बंद करना।",
      },
    ],
  },
  {
    id: "foreclosure-charges",
    type: "guide",
    title: "होम लोन फोरक्लोज़र शुल्क — RBI नियम",
    h1: "होम लोन फोरक्लोज़र शुल्क — RBI नियम 2024",
    intro:
      "होम लोन फोरक्लोज़र पर लगने वाले शुल्क और RBI के नियम जानें। फ्लोटिंग दर पर व्यक्तिगत लोन में शून्य शुल्क, फिक्स्ड दर पर 2% तक। सभी बैंकों के नियम।",
    metaTitle: "होम लोन फोरक्लोज़र शुल्क | Foreclosure Charges - Hindi",
    metaDescription:
      "होम लोन फोरक्लोज़र शुल्क और RBI नियम जानें। Floating rate par zero, fixed par 2% tak. Sabhi banks ke niyam.",
    canonical: "/hi/foreclosure-charges",
    faqs: [
      {
        question: "फोरक्लोज़र पर RBI का नियम क्या है?",
        answer:
          "RBI के जून 2024 के अद्यतन नियम के अनुसार, फ्लोटिंग दर वाले व्यक्तिगत होम लोन पर कोई प्रीपेमेंट या फोरक्लोज़र शुल्क नहीं लगता, चाहे ऋण राशि कुछ भी हो। यह सभी बैंकों और NBFCs पर लागू है। फिक्स्ड दर या गैर-व्यक्तिगत लोन पर 2% तक शुल्क लग सकता है।",
      },
    ],
  },
  {
    id: "cibil-score-info",
    type: "guide",
    title: "CIBIL स्कोर क्या है — पूरी जानकारी",
    h1: "CIBIL स्कोर क्या है और कैसे काम करता है?",
    intro:
      "CIBIL स्कोर का अर्थ, गणना विधि, और होम लोन पर इसका प्रभाव जानें। 300-900 की सीमा में 750+ स्कोर सर्वोत्तम माना जाता है। अपना स्कोर कैसे जांचें और सुधारें।",
    metaTitle: "CIBIL स्कोर क्या है? | What is CIBIL Score - Hindi",
    metaDescription:
      "CIBIL स्कोर क्या है, calculation, home loan par asar. Score kaise check karein aur sudharein.",
    canonical: "/hi/cibil-score-info",
    faqs: [
      {
        question: "CIBIL स्कोर कैसे चेक करें?",
        answer:
          "CIBIL की वेबसाइट (cibil.com) पर जाकर मुफ्त वार्षिक रिपोर्ट डाउनलोड कर सकते हैं। चार ब्यूरो (CIBIL, Equifax, Experian, CRIF) से साल में एक मुफ्त रिपोर्ट मिलती है। क्रेडिट कार्ड या लोन आवेदन के समय भी स्कोर प्रभावित होता है।",
      },
    ],
  },
  {
    id: "tax-benefits-info",
    type: "guide",
    title: "होम लोन टैक्स लाभ — पूरी जानकारी",
    h1: "होम लोन टैक्स लाभ — Section 80C, 24(b), 80EE",
    intro:
      "होम लोन पर मिलने वाले सभी टैक्स लाभ जानें — Section 80C पर मूलधन चुकौती पर ₹1.5 लाख, Section 24(b) पर ब्याज पर ₹2 लाख, Section 80EE पर अतिरिक्त ₹50,000।",
    metaTitle: "होम लोन टैक्स लाभ | Tax Benefits 80C 24(b) 80EE - Hindi",
    metaDescription:
      "होम लोन पर मिलने वाले टैक्स लाभ - Section 80C, 24(b), 80EE. Kitna deduction, kaise claim karein.",
    canonical: "/hi/tax-benefits-info",
    faqs: [
      {
        question: "होम लोन ब्याज पर कितना टैक्स लाभ मिलता है?",
        answer:
          "Section 24(b) के तहत स्व-कब्ज़ित संपत्ति के लिए ₹2 लाख तक ब्याज पर कर कटौती मिलती है। किराये पर दी गई संपत्ति के लिए पूरे ब्याज की कटौती मिलती है (कोई सीमा नहीं)।",
      },
      {
        question: "Section 80EE का लाभ कौन ले सकता है?",
        answer:
          "Section 80EE का लाभ केवल पहली बार घर खरीदने वालों को मिलता है, जिनका लोन ₹35 लाख से कम हो और संपत्ति का मूल्य ₹50 लाख से कम हो। अतिरिक्त ₹50,000 ब्याज कटौती मिलती है।",
      },
    ],
  },
  {
    id: "floating-vs-fixed-rate",
    type: "guide",
    title: "फ्लोटिंग vs फिक्स्ड दर — क्या चुनें",
    h1: "फ्लोटिंग vs फिक्स्ड होम लोन दर — क्या चुनें?",
    intro:
      "फ्लोटिंग और फिक्स्ड होम लोन दर में अंतर और कौन सा बेहतर है जानें। फ्लोटिंग में RBI रेपो रेट का असर, फिक्स्ड में स्थिरता। फ्लोटिंग पर प्रीपेमेंट शुल्क मुक्त।",
    metaTitle: "फ्लोटिंग vs फिक्स्ड होम लोन दर | Kya Chunein - Hindi",
    metaDescription:
      "फ्लोटिंग और फिक्स्ड होम लोन दर में antar. Kaunsa behtar hai, prepayment shulak par asar.",
    canonical: "/hi/floating-vs-fixed-rate",
    faqs: [
      {
        question: "फ्लोटिंग और फिक्स्ड दर में क्या अंतर है?",
        answer:
          "फ्लोटिंग दर RBI रेपो रेट के साथ बदलती है — रेपो बढ़ने पर बढ़ती है, घटने पर घटती है। फिक्स्ड दर पूरी अवधि में समान रहती है, लेकिन आमतौर पर फ्लोटिंग से 0.5-1% ज्यादा होती है। फ्लोटिंग पर प्रीपेमेंट शुल्क मुक्त, फिक्स्ड पर 2% तक।",
      },
      {
        question: "कौन सी दर बेहतर है?",
        answer:
          "अधिकतर उधारकर्ताओं के लिए फ्लोटिंग दर बेहतर होती है क्योंकि लंबी अवधि में यह फिक्स्ड से सस्ती होती है और प्रीपेमेंट शुल्क मुक्त है। फिक्स्ड तब चुनें जब आपको EMI में स्थिरता चाहिए और दरें बहुत नीची हों।",
      },
    ],
  },
  {
    id: "home-loan-emi-formula",
    type: "guide",
    title: "होम लोन EMI सूत्र — गणना विधि",
    h1: "होम लोन EMI सूत्र — गणना विधि",
    intro:
      "होम लोन EMI गणना का सूत्र और विधि जानें। उदाहरण से समझें कि ऋण राशि, ब्याज दर और अवधि से EMI कैसे निकाली जाती है। ऑनलाइन कैलक्युलेटर से तुरंत परिणाम।",
    metaTitle: "होम लोन EMI सूत्र | EMI Formula - Hindi Guide",
    metaDescription:
      "होम लोन EMI गणना का सूत्र और विधि. Example se samjhein - loan amount, byaaj dar aur avadhi se EMI kaise nikalein.",
    canonical: "/hi/home-loan-emi-formula",
    faqs: [
      {
        question: "EMI कैसे निकाली जाती है?",
        answer:
          "EMI = P × r × (1+r)^n / ((1+r)^n - 1) सूत्र से। P ऋण राशि, r मासिक दर (वार्षिक दर / 12 / 100), n महीनों में अवधि। उदाहरण: ₹50 लाख, 8.5%, 20 वर्ष → EMI ₹43,391।",
      },
    ],
  },
  {
    id: "prepayment-charges-rules",
    type: "guide",
    title: "प्रीपेमेंट शुल्क नियम — RBI 2024",
    h1: "प्रीपेमेंट शुल्क नियम — RBI के नवीनतम नियम",
    intro:
      "होम लोन प्रीपेमेंट शुल्क पर RBI के नवीनतम 2024 नियम जानें। फ्लोटिंग दर पर शून्य शुल्क, फिक्स्ड दर पर 2% तक, गैर-व्यक्तिगत लोन पर अलग नियम।",
    metaTitle: "प्रीपेमेंट शुल्क नियम | RBI Rules 2024 - Hindi",
    metaDescription:
      "होम लोन प्रीपेमेंट शुल्क पर RBI के 2024 नियम. Floating rate par zero, fixed par 2% tak, non-individual par alag.",
    canonical: "/hi/prepayment-charges-rules",
    faqs: [
      {
        question: "RBI के अनुसार प्रीपेमेंट शुल्क कब नहीं लगता?",
        answer:
          "RBI के जून 2024 के नियम के अनुसार, फ्लोटिंग दर वाले व्यक्तिगत होम लोन पर कोई प्रीपेमेंट या फोरक्लोज़र शुल्क नहीं लगता, चाहे राशि कुछ भी हो या उद्देश्य कुछ भी हो। यह सभी बैंकों और NBFCs पर लागू है।",
      },
      {
        question: "फिक्स्ड दर वाले लोन पर प्रीपेमेंट शुल्क कितना है?",
        answer:
          "फिक्स्ड दर वाले होम लोन पर प्रीपेमेंट शुल्क 2% तक लग सकता है, साथ ही GST। गैर-व्यक्तिगत उधारकर्ताओं (कंपनी, LLP, ट्रस्ट) पर भी प्रीपेमेंट शुल्क लग सकता है, चाहे दर फ्लोटिंग हो या फिक्स्ड।",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// 3. Hindi FAQ library (reusable)
// ---------------------------------------------------------------------------

export interface HindiFaq {
  question: string;
  answer: string;
}

export const HINDI_FAQ_LIBRARY: HindiFaq[] = [
  {
    question: "होम लोन प्रीपेमेंट क्या है?",
    answer:
      "प्रीपेमेंट यानी अपनी निर्धारित मासिक EMI के अतिरिक्त कुछ राशि जमा करके बकाया मूलधन कम करना। इससे आपकी अवधि या EMI कम हो सकती है और कुल ब्याज बचता है। फ्लोटिंग दर वाले व्यक्तिगत होम लोन पर यह पूरी तरह शुल्क मुक्त है।",
  },
  {
    question: "प्रीपेमेंट से कितना ब्याज बचेगा?",
    answer:
      "यह आपकी ऋण राशि, ब्याज दर, अवधि और प्रीपेमेंट राशि पर निर्भर करता है। ₹50 लाख के होम लोन पर 8.5% दर और 20 वर्ष की अवधि में मात्र ₹10,000 मासिक प्रीपेमेंट से लगभग ₹21 लाख तक ब्याज बच सकता है और ऋण 7 वर्ष जल्दी समाप्त हो सकता है।",
  },
  {
    question: "क्या होम लोन जल्दी चुकाना सही है?",
    answer:
      "हाँ, जल्दी चुकाना लगभग हमेशा फायदेमंद है, खासकर ऋण के पहले 5-7 वर्षों में। शुरुआती वर्षों में EMI का बड़ा हिस्सा ब्याज में जाता है, इसलिए तब किया गया प्रीपेमेंट सबसे ज्यादा ब्याज बचाता है। हालाँकि, यदि आपके पास एमरजेंसी फंड नहीं है, तो पहले वह बनाएं।",
  },
  {
    question: "प्रीपेमेंट के बाद EMI कम करें या अवधि?",
    answer:
      "अवधि घटाना लगभग हमेशा बेहतर है। ₹50 लाख के लोन पर ₹5 लाख के प्रीपेमेंट से अवधि घटाने पर ₹14-16 लाख ब्याज बचता है, जबकि EMI घटाने पर केवल ₹4-5 लाख। EMI घटाएं केवल तब जब मासिक नकदी बोझ कम करना हो।",
  },
  {
    question: "SBI होम लोन पर प्रीपेमेंट शुल्क क्या है?",
    answer:
      "SBI फ्लोटिंग दर (RLLR आधारित) वाले व्यक्तिगत होम लोन पर शून्य प्रीपेमेंट और फोरक्लोज़र शुल्क लेता है, चाहे राशि कुछ भी हो। फिक्स्ड दर पर 2% शुल्क लागू हो सकता है। यह RBI के जून 2024 नियम के अनुसार है।",
  },
  {
    question: "HDFC होम लोन पर प्रीपेमेंट शुल्क क्या है?",
    answer:
      "HDFC (अब HDFC Bank) फ्लोटिंग दर वाले व्यक्तिगत होम लोन पर शून्य प्रीपेमेंट और फोरक्लोज़र शुल्क लेता है। HDFC और HDFC Bank के विलय के बाद भी यह नीति जारी है। फिक्स्ड दर पर 2% शुल्क लागू हो सकता है।",
  },
  {
    question: "ICICI होम लोन पर प्रीपेमेंट शुल्क क्या है?",
    answer:
      "ICICI Bank फ्लोटिंग दर (I-BCLR आधारित) वाले व्यक्तिगत होम लोन पर शून्य प्रीपेमेंट और फोरक्लोज़र शुल्क लेता है, चाहे राशि कुछ भी हो। फिक्स्ड दर पर 2% शुल्क लागू हो सकता है।",
  },
  {
    question: "Axis होम लोन पर प्रीपेमेंट शुल्क क्या है?",
    answer:
      "Axis Bank फ्लोटिंग दर (BRLLR आधारित) वाले व्यक्तिगत होम लोन पर शून्य प्रीपेमेंट और फोरक्लोज़र शुल्क लेता है, चाहे राशि कुछ भी हो। फिक्स्ड दर पर 2% शुल्क लागू हो सकता है।",
  },
  {
    question: "फ्लोटिंग और फिक्स्ड दर में क्या अंतर है?",
    answer:
      "फ्लोटिंग दर RBI रेपो रेट के साथ बदलती है — रेपो बढ़ने पर बढ़ती है, घटने पर घटती है। फिक्स्ड दर पूरी अवधि में समान रहती है, लेकिन आमतौर पर फ्लोटिंग से 0.5-1% ज्यादा होती है। फ्लोटिंग पर प्रीपेमेंट शुल्क मुक्त, फिक्स्ड पर 2% तक।",
  },
  {
    question: "होम लोन पर कौन सा टैक्स लाभ मिलता है?",
    answer:
      "Section 80C के तहत मूलधन चुकौती पर ₹1.5 लाख तक, Section 24(b) के तहत स्व-कब्ज़ित संपत्ति के ब्याज पर ₹2 लाख तक, और Section 80EE के तहत पहली बार खरीदारों को अतिरिक्त ₹50,000 (₹35 लाख तक के लोन पर) कटौती मिलती है। 30% स्लैब में कुल वार्षिक बचत ₹1.2 लाख तक हो सकती है।",
  },
  {
    question: "CIBIL स्कोर कितना होना चाहिए?",
    answer:
      "सर्वोत्तम होम लोन दर के लिए 750+ CIBIL स्कोर चाहिए। 700-749 पर थोड़ी ज्यादा दर मिलती है, 700 से कम पर अनुमोदन मुश्किल हो सकता है। CIBIL स्कोर 300-900 की सीमा में होता है और पिछले 24-36 महीनों के पुनर्भुगतान व्यवहार पर आधारित होता है।",
  },
  {
    question: "क्या बैलेंस ट्रांसफर से ब्याज बचत होती है?",
    answer:
      "हाँ, यदि आपको 0.5% या ज्यादा कम दर मिले और बकाया अवधि 10 वर्ष से ज्यादा हो। ₹50 लाख के लोन पर 0.5% कम दर से 20 वर्ष में लगभग ₹4-6 लाख ब्याज बच सकता है। नए बैंक का प्रोसेसिंग शुल्क (0.25-0.50%) और अन्य खर्च भी जोड़कर देखें।",
  },
  {
    question: "प्रीपेमेंट का रिटर्न कितना होता है?",
    answer:
      "प्रीपेमेंट का रिटर्न गारंटीड होता है और आपके होम लोन ROI के बराबर होता है, जो पोस्ट-टैक्स है। 8.5% के लोन पर प्रीपेमेंट करने से 8.5% पोस्ट-टैक्स गारंटीड रिटर्न मिलता है, जो FD से बेहतर है (FD पर टैक्स लगता है)। 30% स्लैब में 8.5% FD का पोस्ट-टैक्स रिटर्न सिर्फ 5.95% होता है।",
  },
  {
    question: "क्या प्रीपेमेंट से CIBIL स्कोर प्रभावित होता है?",
    answer:
      "नहीं, प्रीपेमेंट से CIBIL स्कोर खराब नहीं होता — वास्तव में सुधरता है, क्योंकि आपका बकाया मूलधन घटता है और आप ऋण मुक्त होने की ओर बढ़ते हैं। फोरक्लोज़र भी CIBIL स्कोर को सुधारता है। क्रेडिट स्कोर में भुगतान इतिहास का सबसे बड़ा वजन (35%) होता है।",
  },
  {
    question: "होम लोन EMI का सूत्र क्या है?",
    answer:
      "EMI = P × r × (1+r)^n / ((1+r)^n - 1), जहाँ P ऋण राशि, r मासिक ब्याज दर (वार्षिक दर / 12 / 100), और n महीनों में अवधि है। उदाहरण: ₹50 लाख का लोन 8.5% पर 20 वर्ष के लिए लगभग ₹43,391 की मासिक EMI देता है।",
  },
  {
    question: "फोरक्लोज़र और प्रीपेमेंट में क्या अंतर है?",
    answer:
      "प्रीपेमेंट (पार्ट पेमेंट) यानी EMI के अतिरिक्त कुछ राशि जमा करके मूलधन घटाना — लोन जारी रहता है। फोरक्लोज़र यानी पूरा बकाया एक ही बार में चुकाकर लोन पूरी तरह बंद करना। दोनों ही फ्लोटिंग दर वाले व्यक्तिगत होम लोन पर शुल्क मुक्त हैं।",
  },
  {
    question: "होम लोन प्रीपेमेंट कैसे करें?",
    answer:
      "अपने बैंक की नेटबैंकिंग या मोबाइल ऐप में लॉगिन करें, लोन खाता चुनें, 'Prepayment' विकल्प पर जाएं और राशि दर्ज करके भुगतान करें। वैकल्पिक रूप से किसी भी शाखा में चेक या DD जमा कर प्रीपेमेंट रिक्वेस्ट दे सकते हैं। ऑनलाइन प्रीपेमेंट तुरंत अपडेट हो जाता है।",
  },
  {
    question: "क्या प्रीपेमेंट से टैक्स लाभ कम होता है?",
    answer:
      "हाँ, आंशिक रूप से। Section 24(b) के तहत ₹2 लाख तक ब्याज पर कर कटौती मिलती है। यदि आपका वार्षिक ब्याज पहले से ₹2 लाख से कम है (लोन के अंतिम वर्षों में), तो प्रीपेमेंट से अप्रयुक्त कटौती खो जाती है। इसलिए प्रारंभिक वर्षों में प्रीपेमेंट पूरी तरह फायदेमंद है।",
  },
  {
    question: "होम लोन जल्दी चुकाने का सबसे असरदार तरीका क्या है?",
    answer:
      "ऋण के पहले वर्ष से ही छोटा मासिक प्रीपेमेंट शुरू करना सबसे असरदार तरीका है। ₹50 लाख के लोन पर मात्र ₹5,000/माह से 20 वर्ष का लोन 15-16 वर्ष में चुक सकता है। साथ ही सालाना बोनस का पूरा हिस्सा एकमुश्त प्रीपेमेंट में लगाएं।",
  },
];

// ---------------------------------------------------------------------------
// 4. Hindi guides
// ---------------------------------------------------------------------------

export interface HindiGuide {
  id: string;
  title: string;
  excerpt: string;
  readTime: string;
  sections: { heading: string; body: string }[];
}

export const HINDI_GUIDES: HindiGuide[] = [
  {
    id: "save-lakhs-on-interest",
    title: "होम लोन ब्याज में लाखों कैसे बचाएं",
    excerpt:
      "भारतीय होम लोन उधारकर्ताओं के लिए व्यावहारिक गाइड — क्यों प्रीपेमेंट का समय राशि से ज्यादा मायने रखता है, और इस वर्ष आप तीन सबसे असरदार कदम उठा सकते हैं।",
    readTime: "6 मिनट पठन",
    sections: [
      {
        heading: "क्यों शुरुआती प्रीपेमेंट सबसे असरदार होते हैं",
        body: "भारतीय होम लोन घटते शेष (reducing-balance) आधार पर चलते हैं — हर महीने ब्याज बकाया मूलधन पर लगता है। 20 वर्ष के ₹50 लाख के लोन पर 8.50% दर में पहले वर्ष में EMI का लगभग 80% ब्याज में और केवल 20% मूलधन घटाने में जाता है। पहले वर्ष का प्रीपेमेंट शेष 19 वर्षों के लिए मूलधन घटाता है, हर महीने ब्याज बचाता है। 18वें वर्ष का प्रीपेमेंट केवल 2 वर्ष के लिए ब्याज बचाता है। इसीलिए महीने 1 में शुरू की गई मात्र ₹2,000 मासिक प्रीपेमेंट वर्ष 15 में लगाई गई ₹5 लाख की एकमुश्त राशि से ज्यादा कुल ब्याज बचा सकती है।",
      },
      {
        heading: "तीन सबसे असरदार कदम",
        body: "पहला, लोन के पहले वर्ष में छोटा मासिक प्रीपेमेंट शुरू करें — मात्र ₹2,000-3,000 महीना भी नाटकीय रूप से असर डालता है। दूसरा, अपनी सालाना परफॉरमेंस बोनस (आमतौर पर 1-2 महीने का वेतन) को खर्च करने के बजाय हर साल लोन में प्रीपेमेंट के रूप में जमा करें। तीसरा, जब ब्याज दरें ऊंची हों (आमतौर पर RBI के टाइटनिंग साइकिल के दौरान), बचत से बड़ा एकमुश्त प्रीपेमेंट करने पर विचार करें — इससे दरें गिरने से पहले सबसे ऊंची ROI पर बचत हो जाती है। फ्लोटिंग दर वाले व्यक्तिगत होम लोन पर इनमें से किसी भी कदम पर कोई शुल्क नहीं लगता, क्योंकि RBI प्रीपेमेंट शुल्क प्रतिबंधित करता है।",
      },
      {
        heading: "अवधि घटाएं, EMI नहीं",
        body: "जब आप प्रीपेमेंट करते हैं, तो बैंक दो विकल्प देता है: EMI समान रखें और अवधि घटाएं, या अवधि समान रखें और EMI घटाएं। मासिक नकदी बोझ न हो तो हमेशा अवधि घटाना चुनें। ₹50 लाख के लोन पर 8.50% दर में तीसरे वर्ष में ₹5 लाख के प्रीपेमेंट से अवधि घटाने पर आमतौर पर ₹14-16 लाख ब्याज बचता है, जबकि EMI घटाने पर केवल ₹4-5 लाख। अवधि घटाने से ब्याज बचत EMI घटाने से 3-5 गुना ज्यादा होती है।",
      },
      {
        heading: "टैक्स का पहलू देखें",
        body: "Section 24(b) स्व-कब्ज़ित संपत्ति के होम लोन ब्याज पर सालाना ₹2 लाख तक कटौती देती है। यदि आपका वार्षिक ब्याज पहले से ₹2 लाख से कम है (आमतौर पर लोन के अंतिम वर्षों में), तो प्रीपेमेंट से अप्रयुक्त कटौती खो जाती है — इसलिए प्रीपेमेंट का वास्तविक फायदा आपकी मार्जिनल टैक्स रेट से घट जाता है। 30% स्लैब वाले उधारकर्ता के लिए, अंतिम कुछ वर्षों में प्रीपेमेंट हेडलाइन ROI से कुछ कम आकर्षक होता है। शुरुआती वर्षों में जब ब्याज ₹2 लाख से कहीं ज्यादा होता है, प्रीपेमेंट पूरी तरह उतना ही आकर्षक होता है जितना दिखता है।",
      },
    ],
  },
  {
    id: "prepayment-vs-investment",
    title: "प्रीपेमेंट vs निवेश: भारत में क्या बेहतर है?",
    excerpt:
      "यह तय करने के लिए ढांचा कि अपने होम लोन का प्रीपेमेंट करें या अधिशेष का निवेश करें — गारंटीड टैक्स-फ्री रिटर्न की तुलना बाजार-लिंक्ड वृद्धि से।",
    readTime: "7 मिनट पठन",
    sections: [
      {
        heading: "प्रीपेमेंट का गारंटीड रिटर्न",
        body: "होम लोन पर जितना भी प्रीपेमेंट करते हैं, वह बकाया मूलधन घटाता है, जिससे शेष अवधि के लिए लगने वाला ब्याज कम होता है। यह रिटर्न गारंटीड है, आपके होम लोन ROI के बराबर है, और टैक्स-फ्री है — बचाए गए ब्याज पर कोई इनकम टैक्स नहीं लगता। इसलिए 8.50% होम लोन पर प्रीपेमेंट करना एक फिक्स्ड-इनकम निवेश के बराबर है जो 8.50% पोस्ट-टैक्स कमाता है। 30% स्लैब वाले उधारकर्ता के लिए, 8.50% प्री-टैक्स कमाने वाला बैंक FD केवल 5.95% पोस्ट-टैक्स देगा — जिससे प्रीपेमेंट स्पष्ट रूप से बेहतर है।",
      },
      {
        heading: "इक्विटी का एक्सपेक्टेड रिटर्न",
        body: "भारतीय इक्विटी म्यूचुअल फंड (विशेषकर निफ्टी 50 इंडेक्स फंड और लार्ज-कैप फंड) ने ऐतिहासिक रूप से 10-15 वर्ष की अवधि में 11-13% लंबी अवधि का रिटर्न दिया है, हालांकि पिछला प्रदर्शन भविष्य का वादा नहीं है। ₹1.25 लाख से ऊपर के लाभ पर 10% LTCG टैक्स लगता है (जुलाई 2024 के बाद)। 30% स्लैब निवेशक के लिए, 12% प्री-टैक्स इक्विटी रिटर्न लगभग 11.1% पोस्ट-टैक्स हो जाता है (12% माइनस ₹1.25 लाख से ऊपर के लाभ पर 0.9% टैक्स)। 8.50% पोस्ट-टैक्स प्रीपेमेंट रिटर्न से तुलना पर, इक्विटी 2-3 प्रतिशत बिंदु एक्सपेक्टेड प्रीमियम देती है — लेकिन महत्वपूर्ण अस्थिरता और किसी भी वर्ष नुकसान के जोखिम के साथ।",
      },
      {
        heading: "एक व्यावहारिक हाइब्रिड दृष्टिकोण",
        body: "अधिकतर वित्तीय रूप से साक्षर भारतीय उधारकर्ता दोनों करते हैं: जितना प्रीपेमेंट जरूरी लगे वह सुरक्षा और जोखिम घटाने के लिए, और बाकी का लंबी अवधि वृद्धि के लिए निवेश। एक सामान्य नियम है पहले 6 महीने का एमरजेंसी फंड बनाना, फिर Section 80C (₹1.5 लाख ELSS / PPF / EPF) मैक्सिमाइज़ करना, फिर अधिशेष को 60:40 में इक्विटी SIP और होम लोन प्रीपेमेंट के बीच बांटना। जैसे-जैसे रिटायरमेंट निकट आता है या ब्याज दरें चरम पर होती हैं, आप ऋण मुक्त होने के लिए प्रीपेमेंट की ओर अधिक झुकाव रख सकते हैं।",
      },
      {
        heading: "जब प्रीपेमेंट स्पष्ट रूप से जीतता है",
        body: "तीन परिदृश्यों में प्रीपेमेंट स्पष्ट रूप से बेहतर है: (1) आपकी जोखिम सहनशीलता कम है और अन्यथा आप पैसा FD या बचत खाते में रखेंगे; (2) आपकी होम लोन ROI 10% से ऊपर है (जैसे पुराने MCLR लोन या टियर-2/3 संपत्तियों के लोन) और रिफाइनेंस संभव नहीं; (3) आप रिटायरमेंट के 5-7 वर्ष के भीतर हैं और ऋण मुक्त होना चाहते हैं। इनमें से प्रत्येक मामले में, प्रीपेमेंट का गारंटीड टैक्स-फ्री रिटर्न इक्विटी से मिलने वाले अनिश्चित प्रीमियम से बड़ा होता है।",
      },
    ],
  },
  {
    id: "emi-calculation-formula",
    title: "EMI गणना सूत्र समझें",
    excerpt:
      "भारतीय बैंक आपकी होम लोन EMI कैसे निकालते हैं — एन्युइटी सूत्र, क्यों ब्याज फ्रंट-लोडेड होता है, और प्रीपेमेंट गणित को कैसे बदलता है।",
    readTime: "5 मिनट पठन",
    sections: [
      {
        heading: "एन्युइटी सूत्र",
        body: "हर भारतीय बैंक एक ही मानक घटते शेष सूत्र का उपयोग करता है: EMI = P × r × (1+r)^n / ((1+r)^n - 1), जहाँ P ऋण मूलधन, r मासिक ब्याज दर (वार्षिक दर को 12 और 100 से विभाजित), और n महीनों में अवधि है। ₹50 लाख के लोन पर 8.50% वार्षिक दर से 20 वर्ष के लिए, r = 0.007083 और n = 240, जिससे EMI लगभग ₹43,391 मिलती है। यह सूत्र सुनिश्चित करता है कि EMI समान रहे भले ही ब्याज-से-मूलधन अनुपात हर महीने बदले — यह अमोर्टाइजिंग लोन की परिभाषिक विशेषता है।",
      },
      {
        heading: "क्यों ब्याज फ्रंट-लोडेड होता है",
        body: "महीना 1 में, ब्याज पूरे ₹50 लाख मूलधन पर लगता है — लगभग ₹35,417 — और EMI का केवल ₹7,974 मूलधन पर जाता है। महीना 120 (अवधि के आधे रास्ते) में, ब्याज लगभग ₹24,000 तक गिर जाता है और मूलधन लगभग ₹19,000 तक बढ़ जाता है। 20 वर्ष के 8.50% लोन पर 50/50 क्रॉसओवर बिंदु महीना 130 के आसपास है — यानी अवधि का आधे से ज्यादा हिस्सा ब्याज भुगतान हावी रहता है। इसीलिए पहले 5-7 वर्षों के प्रीपेमेंट अंतिम 5 वर्षों के समान प्रीपेमेंट से नाटकीय रूप से ज्यादा असरदार होते हैं।",
      },
      {
        heading: "प्रीपेमेंट गणित को कैसे बदलता है",
        body: "जब आप प्रीपेमेंट करते हैं, तो वह राशि सीधे मूलधन घटाने में जाती है — वह भविष्य का ब्याज नहीं चुकाती। इसलिए पहले वर्ष में ₹1 लाख का प्रीपेमेंट मूलधन को ₹49.2 लाख से घटाकर ₹49.1 लाख कर देता है, और हर अगले महीने का ब्याज इस कम राशि पर गणना होता है। शेष 19 वर्षों में, वह ₹1 लाख 8.50% पर लगभग ₹1.85 लाख ब्याज बचाता है — मूल प्रीपेमेंट के लगभग दोगुना। वही ₹1 लाख वर्ष 15 में लगाया जाए तो शेष 5 वर्षों में केवल ₹25,000 ब्याज बचाता है।",
      },
      {
        heading: "ROI परिवर्तन EMI नहीं, अवधि बदलता है",
        body: "जब RBI रेपो रेट बदलता है, तो आपकी फ्लोटिंग दर वाले होम लोन की ROI कुछ दिनों से एक तिमाही के भीतर बदल जाती है। बैंक आमतौर पर EMI समान रखते हैं और अवधि समायोजित करते हैं — इसलिए ₹50 लाख के 20 वर्ष के लोन पर 15 वर्ष शेष रहने पर 50 bps की कटौती अवधि को 12-18 महीने बढ़ा सकती है (या दिशा के अनुसार घटा सकती है) जबकि EMI ₹43,391 पर समान रहती है। आप पसंद करें तो बैंक से EMI संशोधन का अनुरोध कर सकते हैं — उपयोगी जब EMI मूल दर पर तंग थी, या दर कटौती के बाद कम EMI पर लॉक करना चाहते हैं।",
      },
    ],
  },
  {
    id: "emi-reduction-vs-tenure-reduction",
    title: "EMI कम या अवधि कम: क्या चुनें",
    excerpt:
      "प्रीपेमेंट के बाद क्या करें — EMI समान रखकर जल्दी समाप्त करें, या EMI घटाकर मासिक नकदी आज़ाद करें, इसका निर्णय ढांचा।",
    readTime: "5 मिनट पठन",
    sections: [
      {
        heading: "प्रीपेमेंट के बाद दो विकल्प",
        body: "जब आप बकाया मूलधन का कुछ हिस्सा प्रीपेमेंट करते हैं, तो बैंक दो विकल्प देता है। विकल्प 1 (अवधि कम): EMI समान रखें और शेष अवधि घटाएं — लोन जल्दी खत्म हो जाता है। विकल्प 2 (EMI कम): मूल अवधि समान रखें और EMI घटाएं — मासिक बहिर्प्रवाह कम हो जाता है। दोनों RBI दिशानिर्देशों के तहत फ्लोटिंग दर वाले व्यक्तिगत होम लोन पर शुल्क मुक्त हैं। चयन प्रीपेमेंट के समय किया जाता है और उस प्रीपेमेंट पर लागू होता है; भविष्य के प्रीपेमेंट अलग चयन कर सकते हैं।",
      },
      {
        heading: "क्यों अवधि घटाने से ज्यादा ब्याज बचता है",
        body: "अवधि घटाने से मूलधन तेज़ी से चुकता होता है, इसलिए लोन जल्दी खत्म होता है और ब्याज जमा होना जल्दी बंद हो जाता है। ₹50 लाख के लोन पर 8.50% दर में तीसरे वर्ष में ₹5 लाख के प्रीपेमेंट से अवधि घटाने पर आमतौर पर ₹14-16 लाख ब्याज बचता है और लोन 4-5 वर्ष जल्दी चुक जाता है। उसी प्रीपेमेंट पर EMI घटाने से मूल अवधि में केवल ₹4-5 लाख बचता है, क्योंकि लोन पूरे 20 वर्ष ब्याज जमा करता रहता है। ब्याज बचत का अंतर आमतौर पर अवधि घटाने के पक्ष में 3-5 गुना होता है।",
      },
      {
        heading: "जब EMI घटाना उचित हो",
        body: "EMI घटाना चुनें जब आपका मासिक नकदी प्रवाह सीमित हो — उदाहरण के लिए नौकरी परिवर्तन, वेतन कटौती, चिकित्सा खर्च, या बच्चे के शिक्षा लोन के बाद। यह तब भी उपयोगी है जब आप खाली हुई EMI राशि को उच्च-रिटर्न वाले निवेशों (इक्विटी म्यूचुअल फंड) में निवेश करने का इरादा रखते हैं और आपको टैक्स के बाद अपने होम लोन ROI से ज्यादा कमाने का विश्वास है। तीसरा परिदृश्य यह है जब आपकी मौजूदा EMI स्वीकृति समय पर FOIR पर तंग थी, और इसे घटाने से आपको बिना 50-55% FOIR सीमा तोड़े दूसरा लोन (जैसे कार या शिक्षा लोन) लेने की गुंजाइश मिलती है।",
      },
      {
        heading: "मध्य-मार्ग रणनीति",
        body: "एक सामान्य अनुशासित रणनीति है: EMI घटाना चुनें ताकि औपचारिक रूप से आपकी अनुबंधित EMI कम हो जाए (नकदी-प्रवाह सुरक्षा मिलती है), फिर जब भी अधिशेष हो मूल उच्च EMI को मासिक प्रीपेमेंट के रूप में जारी रखें। इस तरह आपको कम निबद्ध EMI की सुरक्षा मिलती है साथ ही अवधि घटाने की अधिकांश ब्याज बचत भी मिल जाती है। यदि आपकी आय घटती है, तो आप केवल प्रीपेमेंट बंद कर दें और केवल घटी हुई EMI चुकाएं — कोई पुनर्वापसी आवश्यक नहीं।",
      },
    ],
  },
  {
    id: "cibil-score-impact",
    title: "CIBIL स्कोर का होम लोन ROI पर प्रभाव",
    excerpt:
      "50 अंक का CIBIL सुधार आपके लाखों बचा सकता है — भारतीय बैंकों में टियर्ड ROI संरचना, और होम लोन आवेदन से पहले क्या करें।",
    readTime: "6 मिनट पठन",
    sections: [
      {
        heading: "CIBIL स्कोर क्या है और बैंक क्यों ध्यान देते हैं",
        body: "CIBIL स्कोर 300 और 900 के बीच की एक 3-अंकीय संख्या है जो आपके पिछले लोन और क्रेडिट कार्ड पुनर्भुगतान व्यवहार के आधार पर आपकी क्रेडिट इतिहास को संक्षिप्त करती है, जिसे बैंक क्रेडिट ब्यूरो (CIBIL, Equifax, Experian, CRIF) को रिपोर्ट करते हैं। बैंक इसे आपके पुनर्भुगतान जोखिम का सबसे बड़ा संकेत मानते हैं। अधिकतर भारतीय बैंक सर्वोत्तम होम लोन ROI के लिए 750+ पसंद करते हैं; 700-749 को उच्च दर पर अनुमोदित किया जा सकता है; 700 से कम अक्सर अस्वीकृत होते हैं या केवल सह-आवेदक और सुरक्षा के साथ स्वीकृत होते हैं। CIBIL स्कोर मासिक अपडेट होता है और पिछले 24-36 महीनों के पुनर्भुगतान व्यवहार को दर्शाता है।",
      },
      {
        heading: "भारतीय बैंकों में टियर्ड ROI",
        body: "अधिकतर भारतीय बैंक (SBI, HDFC, ICICI, Axis) CIBIL स्कोर के आधार पर टियर्ड ROI बैंड का उपयोग करते हैं। 2024 तक, CIBIL 800+ वाले सैलरीड उधारकर्ता को 8.40-8.50% पर होम लोन मिल सकता है, जबकि वही उधारकर्ता CIBIL 750-799 के साथ 8.65-8.75% पाएगा, और CIBIL 700-749 को 8.90-9.10% पाएगा। ₹50 लाख के 20 वर्ष के लोन पर 50 bps ROI अंतर लगभग ₹3,300 अतिरिक्त वार्षिक ब्याज डालता है — अवधि पर लगभग ₹65,000। 100 bps अंतर अवधि पर लगभग ₹1.3 लाख डालता है। आवेदन से पहले अपना CIBIL सुधारना उपलब्ध सबसे असरदार वित्तीय कदमों में से एक है।",
      },
      {
        heading: "आवेदन से पहले CIBIL स्कोर कैसे सुधारें",
        body: "पहला, कभी EMI या क्रेडिट कार्ड भुगतान मत भूलें — भुगतान इतिहास सबसे बड़ा कारक है (35% वजन)। दूसरा, क्रेडिट कार्ड उपयोग अपनी सीमा के 30% से नीचे रखें — उच्च उपयोग ओवर-लेवरेज दर्शाता है। तीसरा, होम लोन आवेदन से 6 महीने के भीतर कई लोन या क्रेडिट कार्ड के लिए आवेदन से बचें — हर हार्ड जांच कुछ महीनों के लिए आपका स्कोर 5-10 अंक घटाती है। चौथा, अपनी CIBIL रिपोर्ट जांचें (साल में एक मुफ्त रिपोर्ट cibil.com पर) और किसी भी त्रुटि को विवादित करें। पांचवा, पुराने क्रेडिट कार्ड खुले रखें भले ही अप्रयुक्त हों — लंबा क्रेडिट इतिहास मदद करता है। अधिकतर उधारकर्ता 6-9 महीनों में अनुशासित व्यवहार से 720 से 780 तक जा सकते हैं।",
      },
      {
        heading: "यदि आपका CIBIL 700 से कम है",
        body: "यदि आपका CIBIL 700 से कम है, तो स्कोर पुनर्निर्माण के लिए होम लोन आवेदन 6-12 महीने टालने पर विचार करें। यदि अभी उधार लेना ही पड़े, तो विकल्प हैं: (1) मजबूत CIBIL वाले सह-आवेदक (आमतौर पर जीवनसाथी या अभिभावक) जोड़ना; (2) ऐसे बैंक से आवेदन जहाँ आपका लंबा वेतन-खाता संबंध है, जो सीमांत स्कोर को ओवरराइड कर सकता है; (3) पहले 2-3 वर्षों के लिए उच्च ROI स्वीकार करना और फिर CIBIL सुधरने पर पुनर्मूल्यांकन का अनुरोध करना। ध्यान दें कि अब उच्च ROI लोन लेकर CIBIL सुधरने के बाद बैलेंस ट्रांसफर करना एक व्यवहार्य रणनीति है — अधिकतर बैलेंस ट्रांसफर डिस्बर्सल के 12-24 महीने बाद होते हैं।",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// 5. Hindi scenarios
// ---------------------------------------------------------------------------

export interface HindiScenario {
  id: string;
  title: string;
  tag: string;
  strategy: string;
  input: {
    loanAmount: number;
    annualRate: number;
    termMonths: number;
    overpaymentMonthly: number;
    overpaymentLumpSum: number;
    overpaymentAnnual: number;
    overpaymentStartMonth: number;
    overpaymentTiming: "start" | "end";
  };
}

export const HINDI_SCENARIOS: HindiScenario[] = [
  {
    id: "50l-monthly-extra",
    title: "₹50 लाख लोन पर ₹10,000 मासिक प्रीपेमेंट",
    tag: "मासिक",
    strategy:
      "₹50 लाख के लोन पर 8.5% दर और 20 वर्ष की अवधि में मात्र ₹10,000 मासिक अतिरिक्त EMI से लगभग ₹21 लाख ब्याज बचता है और ऋण 7 वर्ष जल्दी समाप्त होता है। दोहरी आय वाले परिवारों के लिए आदर्श।",
    input: {
      loanAmount: 50_00_000,
      annualRate: 8.5,
      termMonths: 240,
      overpaymentMonthly: 10_000,
      overpaymentLumpSum: 0,
      overpaymentAnnual: 0,
      overpaymentStartMonth: 1,
      overpaymentTiming: "end",
    },
  },
  {
    id: "1cr-lump-at-24",
    title: "₹1 करोड़ लोन पर 24वें महीने में ₹10 लाख एकमुश्त",
    tag: "एकमुश्त",
    strategy:
      "₹1 करोड़ के मेट्रो लोन पर 8.5% दर और 25 वर्ष की अवधि में दूसरे वर्ष में ₹10 लाख का एकमुश्त प्रीपेमेंट — बोनस, निवेश वसूली या पुरानी संपत्ति बिक्री से मिली राशि एक बार में लगाना।",
    input: {
      loanAmount: 1_00_00_000,
      annualRate: 8.5,
      termMonths: 300,
      overpaymentMonthly: 0,
      overpaymentLumpSum: 10_00_000,
      overpaymentAnnual: 0,
      overpaymentStartMonth: 24,
      overpaymentTiming: "end",
    },
  },
  {
    id: "75l-emi-vs-tenure",
    title: "₹75 लाख लोन पर EMI vs अवधि तुलना",
    tag: "EMI vs अवधि",
    strategy:
      "₹75 लाख के लोन पर 8.6% दर और 20 वर्ष की अवधि में ₹15,000 मासिक प्रीपेमेंट। अवधि घटाने पर लगभग ₹33 लाख ब्याज बचता है; EMI घटाने पर मासिक EMI में लगभग ₹4,000 की कमी आती है। दोनों की तुलना करें।",
    input: {
      loanAmount: 75_00_000,
      annualRate: 8.6,
      termMonths: 240,
      overpaymentMonthly: 15_000,
      overpaymentLumpSum: 0,
      overpaymentAnnual: 0,
      overpaymentStartMonth: 1,
      overpaymentTiming: "end",
    },
  },
  {
    id: "35l-round-up-emi",
    title: "₹35 लाख लोन — EMI को राउंड अप करें",
    tag: "मासिक",
    strategy:
      "₹35 लाख के लोन पर 8.4% दर में ₹30,133 EMI को ₹32,000 तक राउंड अप करें — मात्र ₹1,867 अतिरिक्त मासिक। याद रखने में आसान और ऑटोमेट करने में आसान।",
    input: {
      loanAmount: 35_00_000,
      annualRate: 8.4,
      termMonths: 240,
      overpaymentMonthly: 1_867,
      overpaymentLumpSum: 0,
      overpaymentAnnual: 0,
      overpaymentStartMonth: 1,
      overpaymentTiming: "end",
    },
  },
  {
    id: "50l-monthly-plus-annual",
    title: "₹50 लाख लोन — मासिक + सालाना बोनस",
    tag: "मिश्रित",
    strategy:
      "₹50 लाख के लोन पर ₹5,000 मासिक अतिरिक्त EMI और ₹2 लाख सालाना बोनस प्रीपेमेंट — अनुशासित दो-ट्रैक रणनीति जो तेज़ी से संचित होती है।",
    input: {
      loanAmount: 50_00_000,
      annualRate: 8.5,
      termMonths: 240,
      overpaymentMonthly: 5_000,
      overpaymentLumpSum: 0,
      overpaymentAnnual: 2_00_000,
      overpaymentStartMonth: 1,
      overpaymentTiming: "end",
    },
  },
  {
    id: "1cr-aggressive-pre-retirement",
    title: "₹1 करोड़ लोन — रिटायरमेंट से पहले ऋण मुक्त",
    tag: "आक्रामक",
    strategy:
      "₹1 करोड़ का लोन 8.5% दर पर 25 वर्ष की अवधि में, ₹25,000 मासिक अतिरिक्त EMI से — रिटायरमेंट से पहले ऋण मुक्त होना चाहने वाले दोहरी आय वाले उधारकर्ताओं के लिए आदर्श।",
    input: {
      loanAmount: 1_00_00_000,
      annualRate: 8.5,
      termMonths: 300,
      overpaymentMonthly: 25_000,
      overpaymentLumpSum: 0,
      overpaymentAnnual: 0,
      overpaymentStartMonth: 1,
      overpaymentTiming: "end",
    },
  },
];

// ---------------------------------------------------------------------------
// 6. Hindi content blocks (educational)
// ---------------------------------------------------------------------------

export const HINDI_CONTENT_BLOCKS: { icon: string; title: string; body: string }[] = [
  {
    icon: "TrendingDown",
    title: "प्रीपेमेंट से ब्याज कम",
    body: "हर रुपये का प्रीपेमेंट सीधे आपके बकाया मूलधन को घटाता है, जिससे शेष अवधि पर लगने वाला ब्याज कम हो जाता है। ₹50 लाख के लोन पर 8.5% दर में मात्र ₹5,000/माह से 20 वर्ष के लोन में लगभग ₹12-14 लाख ब्याज बचता है। यह रिटर्न गारंटीड है और टैक्स-फ्री है — FD से बेहतर।",
  },
  {
    icon: "CalendarClock",
    title: "अवधि घटना",
    body: "प्रीपेमेंट के बाद EMI समान रखते हुए अवधि घटाने से ऋण जल्दी खत्म होता है। ₹50 लाख के 20 वर्ष के लोन पर ₹10,000/माह से ऋण लगभग 7 वर्ष जल्दी चुक जाता है — यानी रिटायरमेंट से पहले ऋण मुक्त। अवधि घटाना EMI घटाने से 3-5 गुना ज्यादा ब्याज बचाता है।",
  },
  {
    icon: "Scale",
    title: "EMI vs अवधि — क्या चुनें",
    body: "प्रीपेमेंट के बाद आपके पास दो विकल्प हैं: EMI समान रखें और अवधि घटाएं (अधिक ब्याज बचत), या अवधि समान रखें और EMI घटाएं (मासिक नकदी राहत)। अधिकतर मामलों में अवधि घटाना बेहतर है। EMI घटाएं केवल तब जब नौकरी परिवर्तन, वेतन कटौती, या बड़े खर्च के बाद मासिक बोझ कम करना हो।",
  },
  {
    icon: "ShieldCheck",
    title: "प्रीपेमेंट से पहले जांच",
    body: "प्रीपेमेंट से पहले तीन बातें जांचें: (1) फ्लोटिंग दर वाले व्यक्तिगत लोन पर शून्य शुल्क, फिक्स्ड पर 2% तक; (2) Section 24(b) टैक्स लाभ — यदि ब्याज ₹2 लाख से कम है तो अंतिम वर्षों में प्रीपेमेंट का फायदा थोड़ा कम; (3) एमरजेंसी फंड — कम से कम 6 महीने का खर्च अलग रखें, फिर ही प्रीपेमेंट करें।",
  },
];

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

/**
 * Returns the FAQs registered against a logical content type (e.g. "prepayment",
 * "emi", "sbi", "hdfc"). Falls back to the general prepayment FAQ set when the
 * requested type is not recognised so callers always get something to render.
 */
export function getHindiFaqsForType(type: string): HindiFaq[] {
  const t = type.toLowerCase();

  const filterBy = (predicate: (q: string) => boolean): HindiFaq[] =>
    HINDI_FAQ_LIBRARY.filter((f) => predicate(f.question.toLowerCase()));

  if (t === "prepayment" || t === "general" || t === "") {
    return filterBy(
      (q) =>
        q.includes("प्रीपेमेंट") ||
        q.includes("पार्ट पेमेंट") ||
        q.includes("जल्दी") ||
        q.includes("फोरक्लोज़र"),
    );
  }

  if (t === "emi" || t === "interest-saving" || t === "interest") {
    return filterBy(
      (q) =>
        q.includes("emi") ||
        q.includes("ब्याज") ||
        q.includes("रिटर्न") ||
        q.includes("अवधि"),
    );
  }

  if (t === "reduce-emi-vs-tenure" || t === "emi-vs-tenure") {
    return filterBy(
      (q) =>
        q.includes("emi") ||
        q.includes("अवधि") ||
        q.includes("रिटर्न"),
    );
  }

  if (t === "sbi") {
    return filterBy((q) => q.includes("sbi"));
  }
  if (t === "hdfc") {
    return filterBy((q) => q.includes("hdfc"));
  }
  if (t === "icici") {
    return filterBy((q) => q.includes("icici"));
  }
  if (t === "axis") {
    return filterBy((q) => q.includes("axis"));
  }
  if (t === "bank") {
    return filterBy((q) =>
      ["sbi", "hdfc", "icici", "axis"].some((b) => q.includes(b)),
    );
  }

  if (t === "balance-transfer" || t === "refinance") {
    return filterBy(
      (q) =>
        q.includes("बैलेंस ट्रांसफर") ||
        q.includes("रिफाइनेंस") ||
        q.includes("फ्लोटिंग") ||
        q.includes("फिक्स्ड"),
    );
  }

  if (t === "cibil") {
    return filterBy((q) => q.includes("cibil"));
  }

  if (t === "tax") {
    return filterBy((q) => q.includes("टैक्स") || q.includes("कर"));
  }

  if (t === "foreclosure") {
    return filterBy((q) => q.includes("फोरक्लोज़र") || q.includes("शुल्क"));
  }

  // Default: full library so callers always get usable FAQ content.
  return HINDI_FAQ_LIBRARY;
}

/** Look up a single Hindi landing page by its id (e.g. "50-lakh-home-loan-prepayment"). */
export function getHindiLandingPage(id: string): HindiLandingPage | undefined {
  return HINDI_LANDING_PAGES.find((p) => p.id === id);
}

/** Return all Hindi landing pages matching a given type. */
export function getHindiLandingPagesByType(
  type: HindiLandingPage["type"],
): HindiLandingPage[] {
  return HINDI_LANDING_PAGES.filter((p) => p.type === type);
}
