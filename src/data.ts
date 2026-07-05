import { UserProfile, PersonaType, LanguageType } from './types';

export const LOCALIZATION: Record<string, Record<LanguageType, string>> = {
  welcome: {
    en: "Welcome",
    hi: "नमस्ते",
    ta: "வரவேற்கிறோம்",
    te: "స్వాగతం"
  },
  balance: {
    en: "Available Balance",
    hi: "उपलब्ध शेष राशि",
    ta: "கிடைக்கக்கூடிய இருப்பு",
    te: "అందుబాటులో ఉన్న బ్యాలెన్స్"
  },
  financialScore: {
    en: "Financial Health",
    hi: "वित्तीय स्वास्थ्य",
    ta: "நிதி ஆரோக்கியம்",
    te: "ఆర్థిక ఆరోగ్యం"
  },
  nextBestAction: {
    en: "Saarthi Smart Recommendation",
    hi: "सारथी स्मार्ट अनुशंसा",
    ta: "சாரதி ஸ்மார்ட் பரிந்துரை",
    te: "సారథి స్మార్ట్ సిఫార్సు"
  },
  voiceAssistant: {
    en: "Talk to Saarthi",
    hi: "सारथी से बात करें",
    ta: "சாரதியுடன் பேசுங்கள்",
    te: "సారథితో మాట్లాడండి"
  },
  explainWhy: {
    en: "Why am I seeing this?",
    hi: "मुझे यह क्यों दिख रहा है?",
    ta: "நான் ஏன் இதை பார்க்கிறேன்?",
    te: "నేను దీన్ని ఎందుకు చూస్తున్నాను?"
  },
  humanHandoff: {
    en: "Call Branch RM",
    hi: "शाखा प्रबंधक को कॉल करें",
    ta: "கிளை மேலாளரை அழைக்கவும்",
    te: "శాఖ నిర్వాహకుడికి కాల్ చేయండి"
  },
  quickPay: {
    en: "Quick Payments",
    hi: "त्वरित भुगतान",
    ta: "விரைவு கட்டணம்",
    te: "త్వరిత చెల్లింపులు"
  },
  savingsPlanner: {
    en: "Goal Planner",
    hi: "लक्ष्य योजनाकार",
    ta: "இலக்கு திட்டமிடுபவர்",
    te: "లక్ష్య ప్రణాళిక"
  },
  relationshipSummary: {
    en: "One-View Relationship",
    hi: "समग्र संबंध सारांश",
    ta: "ஒரே பார்வை உறவு சுருக்கம்",
    te: "మొత్తం ఖాతా సారాంశం"
  },
  privacyDashboard: {
    en: "Saarthi Consent Hub",
    hi: "सहमति और गोपनीयता",
    ta: "ஒப்புதல் மற்றும் தனியுரிமை",
    te: "సమ్మతి మరియు గోప్యత"
  },
  achievements: {
    en: "Badges & Milestones",
    hi: "बैज और उपलब्धियां",
    ta: "பேட்ஜ்கள் & மைல்கற்கள்",
    te: "బ్యాడ్జ్‌లు మరియు మైలురాళ్లు"
  },
  insuranceHub: {
    en: "My Insurance",
    hi: "मेरा बीमा",
    ta: "என் காப்பீடு",
    te: "నా భీమా"
  },
  sendMoney: {
    en: "Send Money",
    hi: "पैसे भेजें",
    ta: "பணம் அனுப்ப",
    te: "డబ్బు పంపండి"
  },
  payBill: {
    en: "Pay Bills",
    hi: "बिल भुगतान",
    ta: "பில்களை செலுத்துங்கள்",
    te: "బిల్లులు చెల్లించండి"
  },
  autopay: {
    en: "AutoPay Setup",
    hi: "ऑटो-पे सेटअप",
    ta: "ஆட்டோபே அமைப்பு",
    te: "ఆటోపే సెటప్"
  },
  pensionStatus: {
    en: "Pension Credited • Fully Secure",
    hi: "पेंशन जमा हो चुकी है • पूर्णतः सुरक्षित",
    ta: "ஓய்வூதியம் வரவு வைக்கப்பட்டது • முற்றிலும் பாதுகாப்பானது",
    te: "పెన్షన్ జమ చేయబడింది • పూర్తి సురక్షితం"
  },
  voiceTalk: {
    en: "Talk to Saarthi (Speak)",
    hi: "सारथी से बात करें (बोलें)",
    ta: "சாரதியுடன் பேசுங்கள் (பேசவும்)",
    te: "సారథితో మాట్లాడండి (మాట్లాడండి)"
  },
  voicePrompts: {
    en: '"What is my balance?" or "Call branch"',
    hi: '"बैलेंस कितना है" या "शाखा बुलाएं"',
    ta: '"இருப்பு எவ்வளவு" அல்லது "கிளையை அழைக்கவும்"',
    te: '"నా బ్యాలెన్స్ ఎంత" లేదా "శాఖను పిలవండి"'
  },
  suggestionLabel: {
    en: "Recommendation",
    hi: "सुझाव",
    ta: "பரிந்துரை",
    te: "సిఫార్సు"
  },
  callOfficer: {
    en: "Call Branch Officer",
    hi: "शाखा अधिकारी को बुलाएं",
    ta: "கிளை அதிகாரியை அழைக்கவும்",
    te: "శాఖ అధికారిని పిలవండి"
  }
};

export const INITIAL_PROFILES: Record<PersonaType, UserProfile> = {
  student: {
    name: "Kabir Mehta",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80",
    accountNo: "SBI-******2940",
    balance: 12450,
    branch: "IIT Delhi Campus Branch",
    financialScore: 65,
    scoreExplanation: "You have a decent savings rate but limited investments and no emergency fund.",
    healthBreakdown: {
      income: 15000,
      expenses: 9500,
      savings: 3000,
      debt: 2500
    },
    goals: [
      {
        id: "goal-1",
        name: "Buy New Laptop",
        target: 45000,
        current: 18000,
        deadline: "Dec 2026",
        category: "education"
      },
      {
        id: "goal-2",
        name: "Weekend College Trip",
        target: 8000,
        current: 6500,
        deadline: "Aug 2026",
        category: "bike"
      }
    ],
    badges: [
      {
        id: "badge-1",
        name: "UPI Rookie",
        description: "Complete your first scan & pay transaction",
        iconName: "Zap",
        completed: true
      },
      {
        id: "badge-2",
        name: "Habit Builder",
        description: "Save ₹500 consecutively for 3 months",
        iconName: "TrendingUp",
        completed: false
      },
      {
        id: "badge-3",
        name: "Bill Buster",
        description: "Complete your first digital bill payment",
        iconName: "FileText",
        completed: false
      }
    ],
    actions: [
      {
        id: "act-stud-1",
        title: "Setup Micro-SIP for ₹500",
        description: "Start small, build huge. Invest in SBI Bluechip Fund directly from your pocket money.",
        actionText: "Start Micro-SIP",
        category: "investment",
        whyReason: "You spent ₹2,400 on food delivery this month. Redirecting just ₹500 into an SIP grows to over ₹35,000 in 5 years at 12% expected returns.",
        triggerType: "pocket_money"
      },
      {
        id: "act-stud-2",
        title: "Activate 'Spare Change' Savings",
        description: "Round up your transactions to the nearest ₹10 and save the change automatically.",
        actionText: "Enable Round-up",
        category: "upi",
        whyReason: "Based on your high frequency of small UPI transactions (avg. 18 per month), roundups can save you ~₹320 monthly with zero effort.",
        triggerType: "low_savings"
      }
    ],
    transactions: [
      { id: "tx-s-1", date: "2026-06-29", description: "Zomato Food Delivery", amount: 350, type: "debit", category: "dining" },
      { id: "tx-s-2", date: "2026-06-28", description: "Pocket Money Credited", amount: 10000, type: "credit", category: "salary" },
      { id: "tx-s-3", date: "2026-06-25", description: "College Stationery Store", amount: 480, type: "debit", category: "fees" },
      { id: "tx-s-4", date: "2026-06-24", description: "Sent to Friend - Chai", amount: 40, type: "debit", category: "upi" },
      { id: "tx-s-5", date: "2026-06-20", description: "Netflix Subscription", amount: 199, type: "debit", category: "dining" }
    ],
    policies: []
  },
  professional: {
    name: "Priyanka Iyer",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
    accountNo: "SBI-******8154",
    balance: 185200,
    branch: "Bengaluru Whitefield Branch",
    financialScore: 84,
    scoreExplanation: "Excellent savings and active SIPs! You can optimize by shifting excess cash into high-yield FDs.",
    healthBreakdown: {
      income: 120000,
      expenses: 45000,
      savings: 55000,
      debt: 20000
    },
    goals: [
      {
        id: "goal-p-1",
        name: "Emergency Fund (6 Months)",
        target: 250000,
        current: 185000,
        deadline: "Oct 2026",
        category: "emergency"
      },
      {
        id: "goal-p-2",
        name: "Europe Vacation Fund",
        target: 300000,
        current: 120000,
        deadline: "May 2027",
        category: "general"
      }
    ],
    badges: [
      {
        id: "badge-p-1",
        name: "SIP Centurion",
        description: "Maintain SIP active for 6 months continuously",
        iconName: "ShieldCheck",
        completed: true
      },
      {
        id: "badge-p-2",
        name: "Tax Saver Champion",
        description: "Invest in tax-saving ELSS schemes under Sec 80C",
        iconName: "Award",
        completed: false
      },
      {
        id: "badge-p-3",
        name: "Debt Free Runner",
        description: "Keep credit card utilization below 20%",
        iconName: "HeartHandshake",
        completed: true
      }
    ],
    actions: [
      {
        id: "act-prof-1",
        title: "Deploy Excess ₹1.2L Cash into FD",
        description: "Earn 7.1% interest on your idle savings. Instantly book a flexi-FD with one-click sweep out.",
        actionText: "Book Flexi-FD",
        category: "investment",
        whyReason: "Your savings balance is ₹1.85L, which is ₹85,000 above your recommended threshold. Moving it to an FD generates an extra ₹6,035 yearly compared to standard savings rate.",
        triggerType: "idle_balance"
      },
      {
        id: "act-prof-2",
        title: "Secure Travel Cover for Upcoming Trip",
        description: "Your recent airline ticket purchase was detected. Get ₹10 Lakh medical & flight delay insurance for just ₹290.",
        actionText: "Add Travel Cover",
        category: "insurance",
        whyReason: "You purchased Indigo Airlines tickets worth ₹14,500 on 28th June. Flight delay and baggage loss insurance is highly recommended.",
        triggerType: "travel_booking"
      }
    ],
    transactions: [
      { id: "tx-p-1", date: "2026-06-28", description: "Indigo Airlines Booking", amount: 14500, type: "debit", category: "travel" },
      { id: "tx-p-2", date: "2026-06-25", description: "Monthly Salary Credited", amount: 120000, type: "credit", category: "salary" },
      { id: "tx-p-3", date: "2026-06-24", description: "SIP Auto-Debit - SBI Nifty 50 Index", amount: 15000, type: "debit", category: "investment" },
      { id: "tx-p-4", date: "2026-06-20", description: "Bescom Electricity Bill", amount: 2450, type: "debit", category: "rent" },
      { id: "tx-p-5", date: "2026-06-15", description: "Nature's Basket Grocery", amount: 4800, type: "debit", category: "groceries" }
    ],
    policies: [
      { id: "pol-1", name: "SBI Life eShield Plus", type: "life", coverage: 15000000, premium: 1250, expiry: "2045-12-31", status: "active" },
      { id: "pol-2", name: "SBI General Health Guard", type: "health", coverage: 500000, premium: 450, expiry: "2027-03-15", status: "active" }
    ]
  },
  senior: {
    name: "Ramesh Kumar Prasad",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    accountNo: "SBI-******4932",
    balance: 74300,
    branch: "Patna Main Kacheri Branch",
    financialScore: 92,
    scoreExplanation: "Very disciplined spending! Your pension provides steady income. Consider securing a Senior Citizen Care Plan.",
    healthBreakdown: {
      income: 35000,
      expenses: 12000,
      savings: 23000,
      debt: 0
    },
    goals: [
      {
        id: "goal-s-1",
        name: "Granddaughter's Wedding Gift",
        target: 100000,
        current: 74000,
        deadline: "Jan 2027",
        category: "general"
      }
    ],
    badges: [
      {
        id: "badge-s-1",
        name: "Pension Regular",
        description: "Pension credited continuously for 12 months",
        iconName: "CheckCircle2",
        completed: true
      },
      {
        id: "badge-s-2",
        name: "Security Shield",
        description: "Completed biometrics and safe UPI setup",
        iconName: "ShieldAlert",
        completed: true
      }
    ],
    actions: [
      {
        id: "act-sen-1",
        title: "Generate Digital Life Certificate",
        description: "Submit your annual Jeevan Pramaan online with one-tap face recognition. No need to visit the branch.",
        actionText: "Submit Online",
        category: "security",
        whyReason: "Your pension account requires life certificate renewal by November. Submitting digitally takes 2 minutes and prevents any pension payout delays.",
        triggerType: "life_certificate"
      },
      {
        id: "act-sen-2",
        title: "Safe Banking Checkup",
        description: "Review devices connected to your SBI account and verify security codes.",
        actionText: "Verify Security",
        category: "security",
        whyReason: "You logged in from a new mobile device yesterday. Standard security hygiene recommends a quick 3-step verification.",
        triggerType: "security_alert"
      }
    ],
    transactions: [
      { id: "tx-sen-1", date: "2026-06-30", description: "Govt Pension Credited", amount: 35000, type: "credit", category: "salary" },
      { id: "tx-sen-2", date: "2026-06-25", description: "Apollo Pharmacy Medicals", amount: 1850, type: "debit", category: "groceries" },
      { id: "tx-sen-3", date: "2026-06-18", description: "Cash Withdrawal - Branch ATM", amount: 5000, type: "debit", category: "upi" },
      { id: "tx-sen-4", date: "2026-06-10", description: "Post Office FD Interest Recd", amount: 4500, type: "credit", category: "salary" }
    ],
    policies: [
      { id: "pol-s-1", name: "SBI Arogya Premier Guard", type: "health", coverage: 300000, premium: 12000, expiry: "2027-02-18", status: "active" }
    ]
  }
};

export const CHAT_TEMPLATES: Record<PersonaType, { question: string; answer: string }[]> = {
  student: [
    { question: "What is an SIP?", answer: "An SIP (Systematic Investment Plan) is a way to invest a small, fixed amount of money regularly (e.g. ₹500/month) in mutual funds. It's like a piggy bank that grows and earns compound interest!" },
    { question: "How can I save for my laptop?", answer: "We can set up a Goal Tracker for your laptop! I recommend rounding up your daily UPI coffee/snacks expenses. The difference goes straight into a liquid fund earning 6% interest." },
    { question: "What are my cashback badges?", answer: "You've earned the 'UPI Rookie' badge! Next up: Complete your first digital bill payment to unlock 'Bill Buster' and earn ₹50 scratch card cashback!" }
  ],
  professional: [
    { question: "How can I reduce my income tax?", answer: "Under Section 80C, you can invest up to ₹1.5 Lakhs in SBI Equity Hybrid ELSS mutual funds to save up to ₹46,800 in taxes annually. Would you like to view our top-performing tax savers?" },
    { question: "What is my Emergency Fund status?", answer: "Your current Emergency Fund goal is at ₹1,85,000 of your ₹2,500,000 target. At your current auto-save rate of ₹15,000/month, you will hit this goal in 5 months (Nov 2026)." },
    { question: "How does AutoPay work?", answer: "AutoPay safely registers your standing instructions with NPCI. On bill generation (like electricity/WiFi), the exact amount is auto-debited. You get notified 24 hours in advance and can cancel or pause anytime." }
  ],
  senior: [
    { question: "Is my pension credited?", answer: "Yes, Ramesh ji! Your Pension of ₹35,000 was credited safely today, 30th June, at 10:15 AM. You have also received an SMS confirmation." },
    { question: "How to avoid phone call frauds?", answer: "Remember: SBI will NEVER ask for your OTP, CVV, or NetBanking password on call. If someone asks, hang up immediately! Your Saarthi assistant is always here to help you verify transactions." },
    { question: "Can I renew my Life Certificate at home?", answer: "Yes! You don't need to walk to the branch. I can guide you through the 'Jeevan Pramaan' face-scanning app right from your sofa. Click the recommendation card on your home screen to start!" }
  ]
};
