import { useState, useRef, useEffect } from 'react';
import { PersonaType, LanguageType, ChatMessage, UserProfile } from '../types';
import { Send, Mic, Volume2, VolumeX, User, Sparkles, PhoneCall, Languages } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AssistantChatProps {
  persona: PersonaType;
  language: LanguageType;
  profile: UserProfile;
  onLaunchGoalPlanner?: () => void;
  onCallBranch?: () => void;
}

// Localized welcome text based on persona and language
const LOCALIZED_WELCOME = {
  student: {
    en: `Hey Kabir! 👋 I'm Saarthi, your financial buddy. Looking to save for your new Laptop, or want to check out some cool cashback rewards? Just ask!`,
    hi: `हे कबीर! 👋 मैं सारथी हूँ, आपका वित्तीय साथी। क्या आप नए लैपटॉप के लिए बचत करना चाहते हैं, या कुछ बढ़िया कैशबैक रिवॉर्ड देखना चाहते हैं? बस पूछें!`,
    ta: `ஹே கபீர்! 👋 நான் சாரதி, உங்கள் நிதி நண்பன். உங்கள் புதிய லேப்டாப்பிற்காக சேமிக்க விரும்புகிறீர்களா, அல்லது அருமையான கேஷ்பேக் ரிவார்டுகளைப் பார்க்க விரும்புகிறீர்களா? உடனே கேளுங்கள்!`,
    te: `ஹே கபீர்! 👋 నేను సారథి, మీ ఆర్థిక స్నేహితుడిని. మీ కొత్త ల్యాప్‌టాప్ కోసం డబ్బు దాచుకోవాలనుకుంటున్నారా, లేదా క్యాష్‌బ్యాక్ రివార్డులను చూడాలనుకుంటున్నారా? నన్ను అడగండి!`
  },
  professional: {
    en: `Hello Priyanka. 💼 Welcome back to your Premium Copilot Dashboard. I have optimized your tax-saving recommendations for Section 80C. How can I assist your wealth-building journey today?`,
    hi: `नमस्कार प्रियंका जी। 💼 आपके प्रीमियम कोपायलट डैशबोर्ड पर आपका स्वागत है। मैंने धारा 80C के लिए आपके टैक्स-बचत सुझावों को अनुकूलित किया है। आज आपकी संपत्ति निर्माण यात्रा में मैं क्या सहायता कर सकता हूँ?`,
    ta: `வணக்கம் பிரியங்கா. 💼 உங்கள் பிரீமியம் கோபைலட் டாஷ்போர்டிற்கு மீண்டும் வரவேற்கிறோம். பிரிவு 80C க்கான உங்கள் வரி சேமிப்பு பரிந்துரைகளை நான் மேம்படுத்தியுள்ளேன். இன்று உங்கள் செல்வத்தை உருவாக்கும் பயணத்திற்கு நான் எவ்வாறு உதவ முடியும்?`,
    te: `నమస్కారం ప్రియాంక. 💼 మీ ప్రీమియం కోపైలట్ డ్యాష్‌బోర్డ్‌కు స్వాగతం. సెక్షన్ 80C కింద పన్ను పొదుపు సిఫార్సులను నేను సిద్ధం చేశాను. ఈ రోజు మీ సంపద సృష్టి ప్రయాణంలో నేను ఏ విధంగా సహాయపడగలను?`
  },
  senior: {
    en: `Pranam Ramesh ji. 🙏 I'm Saarthi, your helpful banking assistant. Your pension is safely credited. Do you need help with anything, like home branch cash delivery or avoiding spam calls?`,
    hi: `प्रणाम रमेश जी। 🙏 मैं सारथी हूँ, आपका मददगार बैंकिंग सहायक। आपकी पेंशन सुरक्षित रूप से जमा हो गई है। क्या आपको किसी सहायता की आवश्यकता है, जैसे घर पर नकद डिलीवरी या स्पैम कॉल से बचना?`,
    ta: `வணக்கம் ரமேஷ் ஜி. 🙏 நான் சாரதி, உங்கள் வங்கி உதவியாளர். உங்கள் ஓய்வூதியம் பாதுகாப்பாக வரவு வைக்கப்பட்டுள்ளது. உங்களுக்கு ஏதேனும் உதவி தேவையா?`,
    te: `నమస్కారం రమేష్ గారు. 🙏 నేను సారథి, మీ బ్యాంకింగ్ సహాయకుడిని. మీ పెన్షన్ సురక్షితంగా జమ చేయబడింది. మీకు ఏవైనా సహాయం కావాలా?`
  }
};

const LOCALIZED_CHAT_TEMPLATES: Record<PersonaType, Record<LanguageType, { question: string; answer: string }[]>> = {
  student: {
    en: [
      { question: "What is an SIP?", answer: "An SIP (Systematic Investment Plan) is a way to invest a small, fixed amount of money regularly (e.g. ₹500/month) in mutual funds. It's like a piggy bank that grows and earns compound interest!" },
      { question: "How can I save for my laptop?", answer: "We can set up a Goal Tracker for your laptop! I recommend rounding up your daily UPI coffee/snacks expenses. The difference goes straight into a liquid fund earning 6% interest." },
      { question: "What are my cashback badges?", answer: "You've earned the 'UPI Rookie' badge! Next up: Complete your first digital bill payment to unlock 'Bill Buster' and earn ₹50 scratch card cashback!" }
    ],
    hi: [
      { question: "SIP क्या है?", answer: "एसआईपी (सिस्टमैटिक इन्वेस्टमेंट प्लान) म्यूचुअल फंड में नियमित रूप से एक छोटी, निश्चित राशि (जैसे ₹500/माह) निवेश करने का एक तरीका है। यह एक गुल्लक की तरह है जो बढ़ती है और चक्रवृद्धि ब्याज कमाती है!" },
      { question: "लैपटॉप के लिए कैसे बचाएं?", answer: "हम आपके लैपटॉप के लिए एक लक्ष्य ट्रैकर सेट कर सकते हैं! मैं आपके दैनिक यूपीआई खर्चों को निकटतम ₹10 तक राउंड अप करने की सलाह देता हूँ। यह अंतर सीधे 6% ब्याज वाले लिक्विड फंड में जाता है।" },
      { question: "मेरे कैशबैक बैज क्या हैं?", answer: "आपने 'यूपीआई रूकी' बैज अर्जित किया है! अगला कदम: 'बिल बस्टर' को अनलॉक करने और ₹50 स्क्रैच कार्ड कैशबैक प्राप्त करने के लिए अपना पहला डिजिटल बिल भुगतान पूरा करें!" }
    ],
    ta: [
      { question: "SIP என்றால் என்ன?", answer: "SIP (முறையான முதலீட்டுத் திட்டம்) என்பது மியூச்சுவல் ஃபண்டுகளில் தொடர்ந்து ஒரு சிறிய, நிலையான தொகையை (எ.கா. ₹500/மாதம்) முதலீடு செய்வதற்கான ஒரு வழியாகும். இது கூட்டு வட்டி ஈட்டும் ஒரு உண்டி போன்றது!" },
      { question: "எனது லேப்டாப்பிற்கு எவ்வாறு சேமிப்பது?", answer: "உங்கள் லேப்டாப்பிற்கான இலக்கு டிராக்கரை நாங்கள் அமைக்கலாம்! உங்களின் தினசரி யுபிஐ செலவுகளை ₹10க்கு ரவுண்ட் அப் செய்ய பரிந்துரைக்கிறேன். மீதித் தொகை நேரடியாக 6% வட்டி தரும் லிக்விட் ஃபண்டிற்குச் செல்லும்." },
      { question: "எனது கேஷ்பேக் பேட்ஜ்கள் என்ன?", answer: "நீங்கள் 'UPI Rookie' பேட்ஜைப் பெற்றுள்ளீர்கள்! அடுத்து: 'பில் பஸ்டர்' ஐ அன்லாக் செய்து ₹50 கேஷ்பேக் பெற உங்களது முதல் டிஜிட்டல் பில் கட்டணத்தைச் செலுத்துங்கள்!" }
    ],
    te: [
      { question: "SIP అంటే ఏమిటి?", answer: "SIP (సిస్టమాటిక్ ఇన్వెస్ట్‌మెంట్ ప్లాన్) అనేది మ్యూచువల్ ఫండ్స్‌లో ప్రతి నెలా కొంత స్థిరమైన మొత్తాన్ని (ఉదా. ₹500) క్రమబద్ధంగా పెట్టుబడి పెట్టే విధానం. ఇది మీ పొదుపును చక్రవడ్డీతో పెంచుతుంది!" },
      { question: "నా ల్యాప్‌టాప్ కోసం ఎలా పొదుపు చేయాలి?", answer: "మీ ల్యాప్‌టాప్ కోసం ఒక గోల్ ట్రాకర్‌ను సెట్ చేయవచ్చు! మీ రోజువారీ UPI ఖర్చులను రౌండ్ అప్ చేసి, మిగిలిన మొత్తాన్ని 6% వడ్డీ వచ్చే లిక్విడ్ ఫండ్‌లో దాచుకోవచ్చు." },
      { question: "నా క్యాష్‌బ్యాక్ బ్యాడ్జ్‌లు ఏమిటి?", answer: "మీరు 'UPI Rookie' బ్యాడ్జ్ గెలుచుకున్నారు! మీ తదుపరి బిల్లు చెల్లింపుతో 'Bill Buster' ని అన్‌లాక్ చేసి ₹50 క్యాష్‌బ్యాక్ పొందండి." }
    ]
  },
  professional: {
    en: [
      { question: "How can I maximize tax savings?", answer: "Under Section 80C, you can save tax up to ₹1.5 Lakhs by investing in ELSS Tax Saver Mutual Funds, PPF, or NPS. I can assist you in setting up auto-invest into top ELSS funds!" },
      { question: "What are my premium credit card benefits?", answer: "Your Signature Card offers unlimited airport lounge access, 5x reward points on online travel, and zero fuel surcharge. Let me know if you want to redeem points today!" },
      { question: "How is my portfolio asset allocation?", answer: "Your current asset allocation is 65% Equity, 20% Debt, and 15% Gold/Liquid. This is highly optimized for your 'Moderate-Aggressive' wealth-building profile." }
    ],
    hi: [
      { question: "टैक्स बचत को कैसे अधिकतम करें?", answer: "धारा 80C के तहत, आप ELSS टैक्स सेवर म्यूचुअल फंड, PPF या NPS में निवेश करके ₹1.5 लाख तक टैक्स बचा सकते हैं। मैं आपको सर्वश्रेष्ठ ELSS फंड में निवेश करने में मदद कर सकता हूँ!" },
      { question: "मेरे प्रीमियम क्रेडिट कार्ड के क्या लाभ हैं?", answer: "आपके सिग्नेचर कार्ड पर असीमित एयरपोर्ट लाउंज एक्सेस, ऑनलाइन यात्रा पर 5 गुना रिवॉर्ड पॉइंट और जीरो फ्यूल सरचार्ज मिलता है।" },
      { question: "मेरा पोर्टफोलियो आवंटन कैसा है?", answer: "आपका पोर्टफोलियो 65% इक्विटी, 20% डेट और 15% गोल्ड/लिक्विड में विभाजित है। यह 'मध्यम-आक्रामक' धन-निर्माण के लिए अत्यधिक अनुकूलित है।" }
    ],
    ta: [
      { question: "வரி சேமிப்பை எவ்வாறு அதிகரிப்பது?", answer: "பிரிவு 80C இன் கீழ், நீங்கள் ELSS வரி சேமிப்பு மியூச்சுவல் ஃபண்டுகள், PPF அல்லது NPS ஆகியவற்றில் முதலீடு செய்வதன் மூலம் ₹1.5 லட்சம் வரை வரி சேமிக்கலாம். நான் உங்களுக்கு உதவ முடியும்!" },
      { question: "எனது பிரீமியம் கிரெடிட் கார்டு நன்மைகள் என்ன?", answer: "உங்கள் சிக்னேச்சர் கார்டு வரம்பற்ற விமான நிலைய லவுஞ்ச் அணுகல், ஆன்லைன் பயணத்தில் 5 மடங்கு வெகுமதி புள்ளிகள் மற்றும் பூஜ்ஜிய எரிபொருள் கூடுதல் கட்டணத்தை வழங்குகிறது." },
      { question: "எனது போர்ட்ஃபோலியோ சொத்து ஒதுக்கீடு எவ்வாறு உள்ளது?", answer: "உங்கள் தற்போதைய சொத்து ஒதுக்கீடு 65% ஈக்விட்டி, 20% கடன் மற்றும் 15% தங்கம்/திரவம் ஆகும். ఇది మీ 'நடுத்தర-ஆக்கிரமிப்பு' స్వల్పకాలిక ప్రొఫైల్‌కు ఉత్తమంగా సరిపోతుంది." }
    ],
    te: [
      { question: "పన్ను పొదుపును ఎలా గరిష్టం చేయాలి?", answer: "సెక్షన్ 80C కింద, ELSS ట్యాక్స్ సేవర్ ఫండ్స్, PPF లేదా NPS లో పెట్టుబడి పెట్టడం ద్వారా ₹1.5 లక్షల వరకు పన్ను ఆదా చేయవచ్చు. ఉత్తమ ELSS ఫండ్స్‌లో ఆటో-ఇన్వెస్ట్ చేయడానికి నేను సహాయం చేస్తాను!" },
      { question: "నా ప్రీమియం క్రెడిట్ కార్డ్ ప్రయోజనాలు ఏమిటి?", answer: "మీ సిగ్నేచర్ కార్డ్ అపరిమిత ఎయిర్‌పోర్ట్ లాంజ్ యాక్సెస్, ఆన్‌లైన్ ట్రావెల్‌పై 5 రెట్లు రివార్డ్ పాయింట్లు మరియు జీరో ఫ్యూయల్ సర్‌చార్జ్‌ను అందిస్తుంది." },
      { question: "నా పోర్ట్‌ఫోలియో అసెట్ అలోకేషన్ ఎలా ఉంది?", answer: "మీ ప్రస్తుత పోర్ట్‌ఫోలియో 65% ఈక్విటీ, 20% డెట్ మరియు 15% గోల్డ్/లిక్విడ్ కలిగి ఉంది. ఇది మీ సంపద సృష్టి ప్రొఫైల్‌కు ఉత్తమంగా సరిపోతుంది." }
    ]
  },
  senior: {
    en: [
      { question: "Is my pension credited?", answer: "Yes, Ramesh ji! Your Pension of ₹35,000 has been safely credited today morning at 10:15 AM. You should have received an SMS confirmation as well." },
      { question: "How to avoid call fraud?", answer: "Important safety rule: SBI will NEVER call and ask for your OTP, ATM PIN, or CVV. If anyone asks for these, hang up immediately!" },
      { question: "Can I submit life certificate from home?", answer: "Yes, you can! You don't need to visit the branch. You can submit it from home using the facial recognition option. Just tap the Life Certificate card on the Home screen." }
    ],
    hi: [
      { question: "क्या मेरी पेंशन जमा हो गई?", answer: "हाँ, रमेश जी! आपकी ₹35,000 की पेंशन आज सुबह 10:15 बजे आपके खाते में सुरक्षित जमा हो चुकी है। आपको बैंक से पुष्टि का संदेश (SMS) भी मिल गया है।" },
      { question: "कॉल धोखाधड़ी से कैसे बचें?", answer: "याद रखें: एसबीआई कॉल पर कभी भी आपका ओटीपी या सीवीवी नहीं मांगेगा। यदि कोई पूछता है, तो तुरंत फोन काट दें!" },
      { question: "घर बैठे जीवन प्रमाण पत्र कैसे जमा करें?", answer: "हाँ, आप बिना शाखा जाए चेहरा स्कैन करके जीवन प्रमाण पत्र जमा कर सकते हैं। गृह स्क्रीन पर सुझाव कार्ड दबाएं।" }
    ],
    ta: [
      { question: "எனது ஓய்வூதியம் வந்துவிட்டதா?", answer: "ஆம், ரமேஷ் ஜி! உங்கள் ஓய்வூதியம் ₹35,000 இன்று காலை 10:15 மணிக்கு பாதுகாப்பாக வரவு வைக்கப்பட்டுள்ளது." },
      { question: "அழைப்பு மோசடிகளை தவிர்ப்பது எப்படி?", answer: "நினைவில் கொள்க: எஸ்பிஐ ஒருபோதும் உங்கள் ஓடிபி அல்லது சிவிவி-ஐ கேட்காது. யாராவது கேட்டால், உடனே அழைப்பை துண்டிக்கவும்!" },
      { question: "வீட்டிலிருந்தே ஆயுள் சான்றிதழ் சமர்ப்பிக்கலாமா?", answer: "ஆம்! நீங்கள் கிளைக்கு செல்ல தேவையில்லை. முக அங்கீகாரம் மூலம் வீட்டிலிருந்தே சமர்ப்பிக்கலாம்." }
    ],
    te: [
      { question: "నా పెన్షన్ జమ అయిందా?", answer: "అవును, రమేష్ గారు! మీ పెన్షన్ ₹35,000 ఈ రోజు ఉదయం 10:15 కు సురక్షితంగా జమ చేయబడింది." },
      { question: "ఆటోపే ఎలా పనిచేస్తుంది?", answer: "ఆటోపే మీ స్టాండింగ్ ఇన్‌స్ట్రక్షన్స్‌ను NPCI వద్ద సురక్షితంగా నమోదు చేస్తుంది. కరెంట్/వైఫై వంటి బిల్లులు జనరేట్ అయినప్పుడు, ఖచ్చితమైన మొత్తం ఆటోమేటిక్‌గా కట్ అవుతుంది." },
      { question: "ఇంటి నుండే లైఫ్ సర్టిఫికేట్ సమర్పించవచ్చా?", answer: "అవును! మీరు బ్రాంచ్‌కు వెళ్ళనవసరం లేదు. ఫేస్ స్కాన్ ద్వారా ఇంటి నుండే సమర్పించవచ్చు." }
    ]
  }
};



export default function AssistantChat({
  persona,
  language,
  profile,
  onLaunchGoalPlanner,
  onCallBranch,
}: AssistantChatProps) {
  const accountBalance = profile.balance;
  const [chatLang, setChatLang] = useState<LanguageType>(language);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceWaveform, setVoiceWaveform] = useState<number[]>([20, 25, 20, 30, 20, 25, 20]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Handle welcome messages on mount or language change
  useEffect(() => {
    const welcome = LOCALIZED_WELCOME[persona][chatLang] || LOCALIZED_WELCOME[persona]['en'];
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'saarthi',
        text: welcome,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  }, [persona, chatLang]);

  // Simulate glowing voice wave when in Voice Mode
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isVoiceMode) {
      interval = setInterval(() => {
        setVoiceWaveform(Array.from({ length: 7 }, () => Math.floor(Math.random() * 40) + 10));
      }, 150);
    }
    return () => clearInterval(interval);
  }, [isVoiceMode]);

  // Text-to-speech engine
  const speakMessage = (messageId: string, text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (currentlySpeakingId === messageId) {
      window.speechSynthesis.cancel();
      setCurrentlySpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();

    // Strip markdown formatting characters and emojis for clean speech synthesis
    const cleanText = text
      .replace(/\*\*?/g, '')
      .replace(/__?/g, '')
      .replace(/#+/g, '')
      .replace(/\p{Extended_Pictographic}/gu, '')
      .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
      .replace(/[\u{1F600}-\u{1F64F}]/gu, '')
      .replace(/[\u{1F680}-\u{1F6FF}]/gu, '')
      .replace(/[\u{2600}-\u{27BF}]/gu, '')
      .trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);

    if (chatLang === 'hi') {
      utterance.lang = 'hi-IN';
    } else if (chatLang === 'ta') {
      utterance.lang = 'ta-IN';
    } else if (chatLang === 'te') {
      utterance.lang = 'te-IN';
    } else {
      utterance.lang = 'en-IN';
    }

    // Set high quality speech attributes for a natural human talking pace
    utterance.rate = 0.96;  // Slightly relaxed rate is significantly more legible and human-like
    utterance.pitch = 1.02; // Friendly and natural warm tone
    utterance.volume = 1.0;

    const voices = window.speechSynthesis.getVoices();
    
    // Normalize language string comparison (e.g. en-in / en_in / en)
    const targetLangLower = utterance.lang.toLowerCase().replace('_', '-');
    const langPrefix = chatLang.toLowerCase();

    // Find all voices matching the current conversational language
    const matchingLangVoices = voices.filter(v => {
      const voiceLangLower = v.lang.toLowerCase().replace('_', '-');
      return voiceLangLower.startsWith(targetLangLower) || 
             voiceLangLower.startsWith(langPrefix) ||
             voiceLangLower.includes(langPrefix);
    });

    let selectedVoice = null;
    if (matchingLangVoices.length > 0) {
      // 1. Prioritize Premium, Neural, or Natural high-fidelity voices
      selectedVoice = matchingLangVoices.find(v => {
        const name = v.name.toLowerCase();
        return name.includes('natural') || name.includes('premium') || name.includes('neural') || name.includes('finespeech');
      });

      // 2. Fallback to Google speech voices (very fluent and human-like on Android & Chrome)
      if (!selectedVoice) {
        selectedVoice = matchingLangVoices.find(v => v.name.toLowerCase().includes('google'));
      }

      // 3. Fallback to high-quality Apple (Siri/Lekha/Rishi) or Microsoft local voices
      if (!selectedVoice) {
        selectedVoice = matchingLangVoices.find(v => {
          const name = v.name.toLowerCase();
          return name.includes('apple') || name.includes('siri') || name.includes('microsoft') || name.includes('lekha') || name.includes('rishi');
        });
      }

      // 4. Default to first available matching language voice
      if (!selectedVoice) {
        selectedVoice = matchingLangVoices[0];
      }
    } else if (voices.length > 0) {
      // absolute fallback to system default
      selectedVoice = voices.find(v => v.default) || voices[0];
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onend = () => {
      setCurrentlySpeakingId(null);
    };

    utterance.onerror = () => {
      setCurrentlySpeakingId(null);
    };

    setCurrentlySpeakingId(messageId);
    window.speechSynthesis.speak(utterance);
  };

  // Simulate Voice timeline
  const triggerVoiceMode = () => {
    setIsVoiceMode(true);
    
    const listenPrompt = {
      en: 'Listening... Say "Check my balance" or "Call Branch"',
      hi: 'सुन रहा हूँ... बोलें "मेरा बैलेंस बताओ" या "मैनेजर को बुलाओ"',
      ta: 'கேட்கிறது... "இருப்பு நிலை" அல்லது "மேலாளரை அழைக்கவும்" என்று சொல்லுங்கள்',
      te: 'వింటున్నాను... "నా బ్యాలెన్స్ ఎంత" లేదా "మేనేజర్‌కు కాల్ చేయి" అని చెప్పండి'
    }[chatLang] || 'Listening...';

    setVoiceTranscript(listenPrompt);

    setTimeout(() => {
      const recPrompt = {
        en: 'Recognized: "Is my pension/salary credited?"',
        hi: 'पहचाना गया: "क्या मेरी पेंशन/सैलरी जमा हो गई है?"',
        ta: 'கண்டறியப்பட்டது: "எனது பென்ஷன்/சம்பளம் வந்துவிட்டதா?"',
        te: 'గుర్తించబడింది: "నా పెన్షన్/జీతం జమ అయిందా?"'
      }[chatLang] || 'Recognized...';
      
      setVoiceTranscript(recPrompt);
    }, 2500);

    setTimeout(() => {
      setVoiceTranscript(chatLang === 'hi' ? 'सारथी बोल रहा है... 🔊' : chatLang === 'ta' ? 'சாரதி பேசுகிறார்... 🔊' : chatLang === 'te' ? 'సారథి మాట్లాడుతున్నారు... 🔊' : 'Saarthi Speaking... 🔊');
      
      const voiceReply = {
        student: {
          en: `Hey Kabir! Your pocket money is currently ₹12,450. You also have a ₹500 SIP ready to execute.`,
          hi: `हे कबीर! आपकी पॉकेट मनी वर्तमान में ₹12,450 है। आपकी ₹500 की एसआईपी भी निष्पादित होने के लिए तैयार है।`,
          ta: `ஹே கபீர்! உங்கள் பாக்கெட் பணம் தற்போது ₹12,450 ஆக உள்ளது. மேலும் உங்களிடம் ₹500 SIP செயல்படுத்த தயாராக உள்ளது.`,
          te: `హే కబీర్! మీ పాకెట్ మనీ ప్రస్తుతం ₹12,450 గా ఉంది. మీ వద్ద ₹500 ఎస్ఐపి కూడా సిద్ధంగా ఉంది.`
        },
        professional: {
          en: `Hi Priyanka, yes, your monthly salary of ₹1,20,000 has been successfully credited on 25th June. Your overall balance is ₹1,85,200.`,
          hi: `नमस्ते प्रियंका, हाँ, आपकी ₹1,20,000 की मासिक सैलरी 25 जून को सफलतापूर्वक जमा हो गई है। आपका कुल बैलेंस ₹1,85,200 है।`,
          ta: `ஹாய் பிரியங்கா, ஆம், உங்கள் மாதாந்திர சம்பளம் ₹1,20,000 ஜூன் 25 அன்று வெற்றிகரமாக வரவு வைக்கப்பட்டுள்ளது. உங்கள் ஒட்டுமொத்த இருப்பு ₹1,85,200 ஆகும்.`,
          te: `హాయ్ ప్రియాంక, అవును, మీ నెలవారీ జీతం ₹1,20,000 జూన్ 25న విజయవంతంగా జమ చేయబడింది. మీ మొత్తం బ్యాలెన్స్ ₹1,85,200.`
        },
        senior: {
          en: `Hello Ramesh ji! Your Govt Pension of ₹35,000 was successfully credited today at 10:15 AM. Your total safe balance is ₹74,300.`,
          hi: `नमस्ते रमेश जी! आपकी ₹35,000 की सरकारी पेंशन आज सुबह 10:15 बजे सफलतापूर्वक जमा हो गई है। आपका कुल सुरक्षित बैलेंस ₹74,300 है।`,
          ta: `வணக்கம் ரமேஷ் ஜி! உங்களின் ₹35,000 அரசு ஓய்வூதியம் இன்று காலை 10:15 மணிக்கு வெற்றிகரமாக வரவு வைக்கப்பட்டுள்ளது. உங்களது மொத்த இருப்பு ₹74,300 ஆகும்.`,
          te: `నమస్కారం రమేష్ గారు! మీ ప్రభుత్వ పెన్షన్ ₹35,000 ఈ రోజు ఉదయం 10:15 గంటలకు విజయవంతంగా జమ చేయబడింది. మీ మొత్తం సురక్షిత బ్యాలెన్స్ ₹74,300.`
        }
      }[persona][chatLang] || `Account details are secure.`;

      setMessages(prev => [
        ...prev,
        {
          id: `voice-req-${Date.now()}`,
          sender: 'user',
          text: `[Voice Mode] "${chatLang === 'hi' ? 'क्या मेरे पैसे सुरक्षित हैं?' : chatLang === 'ta' ? 'எனது கணக்கு பாதுகாப்பானதா?' : chatLang === 'te' ? 'నా డబ్బు సురక్షితంగా ఉందా?' : 'Is my account balance safe?'}"`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
        {
          id: `voice-res-${Date.now()}`,
          sender: 'saarthi',
          text: voiceReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
      setIsVoiceMode(false);
    }, 5000);
  };

  // Multilingual dynamic responses (client-side fallback)
  const getSmartResponse = (query: string): string => {
    const q = query.toLowerCase().trim();
    const balanceStr = profile.balance.toLocaleString('en-IN');

    // 1. Greetings (extremely concise, as requested)
    const greetings = ['hi', 'hello', 'hey', 'namaste', 'வணக்கம்', 'नमस्ते', 'నమస్కారం', 'pranam', 'hola', 'hlo', 'helo'];
    const isGreeting = greetings.some(g => q === g || q.startsWith(g + ' ') || q.endsWith(' ' + g));
    if (isGreeting) {
      switch (chatLang) {
        case 'hi':
          return `नमस्ते ${profile.name}! मैं आपका एसबीआई सारथी कोपायलट हूँ। आज मैं आपकी क्या सहायता कर सकता हूँ?`;
        case 'ta':
          return `வணக்கம் ${profile.name}! நான் உங்கள் எஸ்பிஐ சாரதி கோபைலட். இன்று நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?`;
        case 'te':
          return `నమస్కారం ${profile.name}! నేను మీ ఎస్బిఐ సారథి కోపైలట్. ఈ రోజు నేను మీకు ఎలా సహాయపడగలను?`;
        default:
          return `Hello ${profile.name}! I am your SBI Saarthi copilot. How can I assist you with your SBI profile today?`;
      }
    }

    // 2. Affirmation / "yes" query
    if (q === 'yes' || q === 'हाँ' || q === 'ஆம்' || q === 'అవును') {
      switch (chatLang) {
        case 'hi':
          return `जी हाँ! मैं आपकी सहायता के लिए तैयार हूँ। क्या आप अपने बैलेंस, खाते या किसी विशिष्ट लक्ष्य के बारे में जानना चाहते हैं?`;
        case 'ta':
          return `ஆம்! உங்களுக்கு உதவ நான் தயாராக இருக்கிறேன். உங்கள் இருப்பு, கணக்கு அல்லது குறிப்பிட்ட இலக்கு பற்றி அறிய விரும்புகிறீர்களா?`;
        case 'te':
          return `అవును! మీకు సహాయం చేయడానికి నేను సిద్ధంగా ఉన్నాను. మీ బ్యాలెన్స్, ఖాతా లేదా నిర్దిష్ట లక్ష్యం గురించి తెలుసుకోవాలనుకుంటున్నారా?`;
        default:
          return `Yes! I am here to help. Would you like to know about your balance, account details, or specific financial goals?`;
      }
    }

    // 3. Name / identity Queries
    if (q.includes('name') || q.includes('who am i') || q.includes('naam') || q.includes('नाम') || q.includes('பெயர்') || q.includes('పేరు')) {
      switch (chatLang) {
        case 'hi':
          return `आपका नाम **${profile.name}** है।`;
        case 'ta':
          return `உங்களுடைய பெயர் **${profile.name}** ஆகும்.`;
        case 'te':
          return `మీ ప్రొఫైల్ ప్రకారం మీ పేరు **${profile.name}**.`;
        default:
          return `According to your profile, your name is **${profile.name}**.`;
      }
    }

    // 4. Account Number Queries
    if (q.includes('account number') || q.includes('account no') || q.includes('खाता संख्या') || q.includes('கணக்கு எண்') || q.includes('ఖాతా సంఖ్య') || q.includes('खाता नंबर')) {
      switch (chatLang) {
        case 'hi':
          return `आपका एसबीआई खाता नंबर **${profile.accountNo}** है।`;
        case 'ta':
          return `உங்களது கணக்கு எண் **${profile.accountNo}** ஆகும்.`;
        case 'te':
          return `మీ ఖాతా సంఖ్య **${profile.accountNo}**.`;
        default:
          return `Your SBI account number is **${profile.accountNo}**.`;
      }
    }

    // 5. Branch Queries
    if (q.includes('branch') || q.includes('शाखा') || q.includes('கிளை') || q.includes('బ్రాంచ్') || q.includes('శాఖ')) {
      switch (chatLang) {
        case 'hi':
          return `आपकी होम शाखा **${profile.branch}** है।`;
        case 'ta':
          return `உங்களது ஹோம் கிளை **${profile.branch}** ஆகும்.`;
        case 'te':
          return `మీ హోమ్ బ్రాంచ్ **${profile.branch}**.`;
        default:
          return `Your home branch is **${profile.branch}**.`;
      }
    }

    // 6. Score / Financial Health Queries
    if (q.includes('score') || q.includes('health') || q.includes('स्वास्थ्य') || q.includes('மதிப்பெண்') || q.includes('స్కోరు')) {
      switch (chatLang) {
        case 'hi':
          return `आपका वित्तीय स्वास्थ्य स्कोर **${profile.financialScore}/100** है। ${profile.scoreExplanation}`;
        case 'ta':
          return `உங்களது நிதி ஆரோக்கிய மதிப்பெண் **${profile.financialScore}/100** ஆகும். ${profile.scoreExplanation}`;
        case 'te':
          return `మీ ఆర్థిక ఆరోగ్య స్కోరు **${profile.financialScore}/100**. ${profile.scoreExplanation}`;
        default:
          return `Your financial health score is **${profile.financialScore}/100**. ${profile.scoreExplanation}`;
      }
    }

    // 7. Balance / Money Queries
    const isBalanceQuery = q.includes('balance') || q.includes('பணம்') || q.includes('பயலன்ஸ்') || q.includes('बैलेंस') || q.includes('पैसे') || q.includes('खाते') || q.includes('సొమ్ము') || q.includes('డబ్బు') || q.includes('బ్యాలెన్స్') || q.includes('amount') || q.includes('funds');
    if (isBalanceQuery) {
      switch (chatLang) {
        case 'hi':
          return `आपकी वर्तमान उपलब्ध शेष राशि **₹${balanceStr}** है। यह पूरी तरह से YONO FraudShield द्वारा सुरक्षित है।`;
        case 'ta':
          return `உங்களின் தற்போதைய இருப்பு **₹${balanceStr}** ஆகும். இது YONO FraudShield மூலம் முழுமையாகப் பாதுகாக்கப்படுகிறது.`;
        case 'te':
          return `మీ ప్రస్తుత అందుబాటులో ఉన్న బ్యాలెన్స్ **₹${balanceStr}**. ఇది YONO ఫ్రాడ్ షీల్డ్ ద్వారా పూర్తిగా రక్షించబడుతుంది.`;
        default:
          return `Your current available balance is **₹${balanceStr}**. It is fully protected by YONO FraudShield.`;
      }
    }

    // 8. SIP / Investment / Savings
    const isSipQuery = q.includes('sip') || q.includes('invest') || q.includes('saving') || q.includes('बचत') || q.includes('निवेश') || q.includes('म्यूचुअल') || q.includes('சேமிப்பு') || q.includes('முதலீடு') || q.includes('పొదుపు') || q.includes('పెట్టుబడి') || q.includes('ఇన్వెస్ట్');
    if (isSipQuery) {
      switch (chatLang) {
        case 'hi':
          return `एक व्यवस्थित निवेश योजना (SIP) आपको छोटी बचत को चक्रवृद्धित करने की अनुमति देती है। हम एसबीआई ब्लूचिप फंड में ₹500 का मासिक एसआईपी शुरू करने की सलाह देते हैं।`;
        case 'ta':
          return `ஒரு முறையான முதலீட்டுத் திட்டம் (SIP) உங்கள் சேமிப்பை பெருக்க உதவுகிறது. எஸ்பிஐ புளூசிப் நிதியில் ₹500 மாதாந்திர SIP ஐத் தொடங்க பரிந்துரைக்கிறோம்.`;
        case 'te':
          return `సిస్టమాటిక్ ఇన్వెస్ట్‌మెంట్ ప్లాన్ (SIP) మీ పొదుపులను చక్రవడ్డీతో పెంచుతుంది. మేము SBI బ్లూచిప్ ఫండ్ లో నెలకు ₹500 SIP ప్రారంభించాల్సిందిగా సిఫార్సు చేస్తున్నాము.`;
        default:
          return `A Systematic Investment Plan (SIP) allows you to compound small savings. We recommend starting a monthly SIP of ₹500 in the SBI Bluechip Fund.`;
      }
    }

    // 9. Fraud / Safety / Security
    const isFraudQuery = q.includes('fraud') || q.includes('scam') || q.includes('safe') || q.includes('security') || q.includes('धोखाधड़ी') || q.includes('सुरक्षा') || q.includes('ओटीपी') || q.includes('மோசடி') || q.includes('பாதுகாப்பு') || q.includes('మోసం') || q.includes('భద్రత');
    if (isFraudQuery) {
      switch (chatLang) {
        case 'hi':
          return `एसबीआई सारथी लगातार निगरानी कर रहा है। याद रखें: योनो कभी भी आपसे पिन या ओटीपी नहीं मांगेगा। आपके कनेक्टेड डिवाइस 100% सत्यापित हैं।`;
        case 'ta':
          return `எஸ்பிஐ சாரதி உங்களை எப்போதும் கண்காணித்து வருகிறது. நினைவில் கொள்க: யொனொ ஒருபோதும் உங்கள் பின் (PIN) அல்லது ஓடிபி (OTP) கேட்காது.`;
        case 'te':
          return `SBI సారథి నిరంతరం పర్యవేక్షిస్తుంది. గుర్తుంచుకోండి: YONO మీ పిన్ లేదా SMS OTP ని ఎప్పటికీ అడగదు.`;
        default:
          return `SBI Saarthi is constantly monitoring. Remember: YONO will never request your PIN or SMS OTP. Your connected devices are 100% verified.`;
      }
    }

    // 10. Loan / Debt
    const isLoanQuery = q.includes('loan') || q.includes('debt') || q.includes('कर्ज') || q.includes('ऋण') || q.includes('கடன்') || q.includes('అప్పు') || q.includes('రుణం');
    if (isLoanQuery) {
      const activeDebt = persona === 'professional' ? '20,000' : '0';
      switch (chatLang) {
        case 'hi':
          return `वर्तमान में आपके पास ₹${activeDebt} का सक्रिय ऋण (कर्ज) है। आपका पुनर्भुगतान इतिहास शानदार है!`;
        case 'ta':
          return `உங்களுக்கு தற்போது ₹${activeDebt} செயலில் உள்ள கடன் உள்ளது. உங்களின் திருப்பிச் செலுத்தும் வரலாறு சிறப்பாக உள்ளது!`;
        case 'te':
          return `ప్రస్తుతం మీకు ₹${activeDebt} క్రియాశీల అప్పు ఉంది. మీ చెల్లింపుల చరిత్ర చాలా బాగుంది!`;
        default:
          return `You currently have ₹${activeDebt} of active debt. Your repayment history is stellar!`;
      }
    }

    // 11. Support / Relationship Manager
    const isSupportQuery = q.includes('manager') || q.includes('call') || q.includes('कॉल') || q.includes('मैनेजर') || q.includes('மேலாளர்') || q.includes('మేనేజర్');
    if (isSupportQuery) {
      switch (chatLang) {
        case 'hi':
          return `मैं आपके नियुक्त संबंध प्रबंधक (Relationship Manager) से तुरंत कॉल बैक शेड्यूल कर सकता हूँ। कनेक्ट करने के लिए 'शाखा अधिकारी को कॉल करें' बटन दबाएं!`;
        case 'ta':
          return `உங்களுக்கு நியமிக்கப்பட்ட உறவு மேலாளரிடமிருந்து (Relationship Manager) உடனடி அழைப்பை நான் ஏற்பாடு செய்ய முடியும். தொடர்பு கொள்ள 'கிளையை அழைக்கவும்' பட்டனைக் கிளிக் செய்யவும்!`;
        case 'te':
          return `మీకు కేటాయించిన రిలేషన్షిప్ మేనేజర్ నుండి తక్షణ కాల్ బ్యాక్ ను నేను షెడ్యూల్ చేయగలను. కనెక్ట్ కావడానికి 'శాఖ నిర్వాహకుడికి కాల్ చేయండి' బటన్ క్లిక్ చేయండి!`;
        default:
          return `I can schedule an immediate call back from your assigned Relationship Manager. Click the 'Call Branch' button to connect!`;
      }
    }

    // 12. Insurance Policy queries
    if (q.includes('insurance') || q.includes('policy') || q.includes('बीमा') || q.includes('காப்பீடு') || q.includes('భీమా')) {
      const policyNames = profile.policies?.map(p => p.name).join(', ') || 'None';
      switch (chatLang) {
        case 'hi':
          return `आपकी सक्रिय बीमा पॉलिसियाँ हैं: **${policyNames}**। अधिक जानकारी के लिए 'बीमा सुरक्षा' टैब पर जाएं।`;
        case 'ta':
          return `உங்களின் செயலில் உள்ள காப்பீட்டுத் திட்டங்கள்: **${policyNames}** ஆகும். கூடுதல் விவரங்களுக்கு 'காப்பீடு' பகுதிக்குச் செல்லவும்.`;
        case 'te':
          return `మీ సక్రియ భీమా పాలసీలు: **${policyNames}**. మరిన్ని వివరాల కోసం 'భీమా రక్షణ' ట్యాబ్‌ను సందర్శించండి.`;
        default:
          return `Your active insurance policies are: **${policyNames}**. Visit the "Insurance Shield" tab for details.`;
      }
    }

    // 13. Goals / savings targets queries
    if (q.includes('goal') || q.includes('saving target') || q.includes('लक्ष्य') || q.includes('இலக்கு') || q.includes('లక్ష్యం') || q.includes('లక్ష్యాలు')) {
      const goalNames = profile.goals?.map(g => `${g.name} (Target: ₹${g.target.toLocaleString('en-IN')})`).join(', ') || 'None';
      switch (chatLang) {
        case 'hi':
          return `आपके सक्रिय वित्तीय लक्ष्य हैं: **${goalNames}**। प्रगति देखने के लिए 'लक्ष्य योजनाकार' पर जाएं।`;
        case 'ta':
          return `உங்களின் செயலில் உள்ள நிதி இலக்குகள்: **${goalNames}** ஆகும். நிலையை அறிய 'இலக்கு திட்டமிடுபவர்' பகுதிக்குச் செல்லவும்.`;
        case 'te':
          return `మీ సక్రియ ఆర్థిక లక్ష్యాలు: **${goalNames}**. పురోగతిని చూడటానికి 'లక్ష్య ప్రణాళిక' కు వెళ్ళండి.`;
        default:
          return `Your active financial goals are: **${goalNames}**. Visit the "Goal Planner" tab to track progress.`;
      }
    }

    // 14. Transactions / spends queries
    if (q.includes('transaction') || q.includes('spend') || q.includes('statement') || q.includes('लेनदेन') || q.includes('பரிவர்த்தனை') || q.includes('లావాదేవీ') || q.includes('ఖర్చు')) {
      const lastTx = profile.transactions?.[0];
      const txSummary = lastTx ? `${lastTx.date}: ${lastTx.description} (₹${lastTx.amount})` : 'None';
      switch (chatLang) {
        case 'hi':
          return `आपका नवीनतम लेनदेन है: **${txSummary}**। सभी लेनदेन देखने के लिए 'लेनदेन इतिहास' देखें।`;
        case 'ta':
          return `உங்களின் சமீபத்திய பரிவர்த்தனை: **${txSummary}** ஆகும். முழு பட்டியலை பார்க்க 'பரிவர்த்தனைகள்' பகுதிக்குச் செல்லவும்.`;
        case 'te':
          return `మీ ఇటీవలి లావాదేవీ: **${txSummary}**. అన్ని లావాదేవీల కోసం 'లావాదేవీల చరిత్ర' ను చూడండి.`;
        default:
          return `Your latest transaction is: **${txSummary}**. View the "Transactions" tab for the full history.`;
      }
    }

    // Dynamic fallback checking exact matches in localized QA lists
    const matches = LOCALIZED_CHAT_TEMPLATES[persona][chatLang]?.find(
      t => t.question.toLowerCase().includes(q) || q.includes(t.question.toLowerCase())
    );
    if (matches) return matches.answer;

    // Standard fallback response using actual profile details
    switch (chatLang) {
      case 'hi':
        return `आपके एसबीआई सारथी कोपायलट के रूप में, मैं आपकी प्रोफाइल से संबंधित जानकारी जैसे कि आपका बैलेंस (₹${balanceStr}), खाता संख्या (${profile.accountNo}), और होम शाखा (${profile.branch}) बता सकता हूँ। कृपया अपनी विशिष्ट क्वेरी पूछें!`;
      case 'ta':
        return `உங்கள் எஸ்பிஐ சாரதி கோபைலட்டாக, உங்கள் இருப்பு (₹${balanceStr}), கணக்கு எண் (${profile.accountNo}), மற்றும் கிளை (${profile.branch}) போன்ற உங்கள் சுயவிவரம் தொடர்பான தகவல்களை என்னால் வழங்க முடியும். உங்களின் குறிப்பிட்ட கேள்வியைக் கேளுங்கள்!`;
      case 'te':
        return `మీ SBI సారథి కోపైలట్‌గా, మీ బ్యాలెన్స్ (₹${balanceStr}), ఖాతా సంఖ్య (${profile.accountNo}), మరియు బ్రాంచ్ (${profile.branch}) వంటి మీ ప్రొఫైల్‌కు సంబంధించిన సమాచారాన్ని నేను అందించగలను. దయచేసి మీ నిర్దిష్ట ప్రశ్నను అడగండి!`;
      default:
        return `As your SBI Saarthi copilot, I can assist you with your profile details such as your current balance (₹${balanceStr}), account number (${profile.accountNo}), and branch (${profile.branch}). Please let me know what specific information you need!`;
    }
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-msg-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);

    // Cancel active TTS speaking
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setCurrentlySpeakingId(null);
    }

    let replyText = '';
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          profile,
          chatLang,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.reply) {
          replyText = data.reply;
        } else {
          replyText = getSmartResponse(text);
        }
      } else {
        replyText = getSmartResponse(text);
      }
    } catch (error) {
      console.error('Error fetching chat response:', error);
      replyText = getSmartResponse(text);
    }

    setIsThinking(false);

    const saarthiMsg: ChatMessage = {
      id: `saarthi-msg-${Date.now()}`,
      sender: 'saarthi',
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, saarthiMsg]);
  };

  return (
    <div className="flex flex-col h-[520px] bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 shadow-sm relative">
      {/* Mini Top Banner */}
      <div className="bg-[#5C2D91] text-white py-3 px-4 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center border border-indigo-400">
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-black tracking-tight flex items-center gap-1">
              Saarthi AI Assistant
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </h3>
            <p className="text-[10px] text-blue-200">Adaptive Banking Copilot</p>
          </div>
        </div>
        <button
          onClick={onCallBranch}
          className="text-[10px] bg-blue-800 hover:bg-blue-700 text-white font-bold py-1 px-2.5 rounded-lg transition flex items-center gap-1 border border-blue-600 cursor-pointer"
        >
          <PhoneCall className="w-3 h-3 text-emerald-400" />
          Support
        </button>
      </div>

      {/* Internal Chatbot Language Quick Select Bar */}
      <div className="bg-slate-100 border-b border-slate-200/50 px-3 py-1.5 flex items-center justify-between gap-1 shrink-0">
        <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
          <Languages className="w-3 h-3 text-slate-400" /> Language:
        </span>
        <div className="flex items-center gap-1">
          {([
            { code: 'en', label: 'English' },
            { code: 'hi', label: 'हिंदी' },
            { code: 'ta', label: 'தமிழ்' },
            { code: 'te', label: 'తెలుగు' }
          ] as const).map(l => (
            <button
              key={l.code}
              onClick={() => setChatLang(l.code)}
              className={`text-[9px] px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                chatLang === l.code
                  ? 'bg-sbi-blue text-white shadow-sm'
                  : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-3">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex flex-col max-w-[85%] ${isUser ? 'self-end items-end' : 'self-start items-start'}`}
            >
              {/* Metadata Row with Name & Read Aloud Action */}
              <div className="flex items-center gap-1 text-[9px] text-slate-400 mb-0.5 w-full">
                {isUser ? (
                  <>
                    <span>You</span>
                    <User className="w-2.5 h-2.5" />
                    <span className="mx-1">•</span>
                    <span>{m.timestamp}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-2.5 h-2.5 text-blue-600" />
                    <span>Saarthi Copilot</span>
                    <span className="mx-1">•</span>
                    <span>{m.timestamp}</span>
                    
                    {/* Read Aloud / Stop Text-To-Speech Button */}
                    <button
                      id={`speak-btn-${m.id}`}
                      onClick={() => speakMessage(m.id, m.text)}
                      className={`ml-2 flex items-center gap-1 px-1.5 py-0.5 rounded border transition-all duration-200 cursor-pointer text-[8px] font-bold uppercase tracking-wider ${
                        currentlySpeakingId === m.id
                          ? 'bg-red-50 text-red-600 border-red-200 animate-pulse'
                          : 'bg-slate-150 hover:bg-slate-200 text-sbi-blue border-slate-250 hover:border-slate-350'
                      }`}
                      title="Read Aloud / Text-to-Speech"
                    >
                      {currentlySpeakingId === m.id ? (
                        <>
                          <VolumeX className="w-2.5 h-2.5 text-red-500" />
                          <span>Stop</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-2.5 h-2.5 text-sbi-blue" />
                          <span>Read Aloud</span>
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>

              {/* Chat Message Text Balloon */}
              <div
                className={`p-3 rounded-2xl text-xs font-medium leading-relaxed shadow-sm ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                }`}
              >
                {m.text}
              </div>
            </div>
          );
        })}
        {isThinking && (
          <div className="flex flex-col max-w-[85%] self-start items-start animate-pulse">
            <div className="flex items-center gap-1 text-[9px] text-slate-400 mb-0.5">
              <Sparkles className="w-2.5 h-2.5 text-blue-600 animate-spin" />
              <span>Saarthi is thinking...</span>
            </div>
            <div className="p-3 rounded-2xl text-xs font-semibold bg-white text-slate-400 border border-slate-100 rounded-tl-none shadow-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggested Template Questions */}
      <div className="px-3 pb-2 flex gap-1.5 overflow-x-auto shrink-0 scrollbar-none scroll-smooth">
        {(LOCALIZED_CHAT_TEMPLATES[persona][chatLang] || LOCALIZED_CHAT_TEMPLATES[persona]['en']).map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(item.question)}
            className="text-[11px] bg-white text-slate-600 border border-slate-200 hover:bg-blue-50 hover:text-blue-700 font-semibold px-3 py-1.5 rounded-full whitespace-nowrap shadow-sm shrink-0 transition-all cursor-pointer"
          >
            {item.question}
          </button>
        ))}
      </div>

      {/* Chat input box */}
      <div className="p-2.5 bg-white border-t border-slate-100 flex items-center gap-2 shrink-0">
        <button
          onClick={triggerVoiceMode}
          className="w-10 h-10 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center transition shrink-0 cursor-pointer"
          title="Voice Command Mode"
        >
          <Mic className="w-5 h-5 text-indigo-600 animate-pulse" />
        </button>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputText);
          }}
          className="flex-1 flex gap-1.5"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              chatLang === 'hi'
                ? 'यहाँ लिखें (जैसे: बैलेंस कितना है?)...'
                : chatLang === 'ta'
                ? 'கேள்விகளைக் கேளுங்கள் (எ.கா. இருப்பு நிலை)...'
                : chatLang === 'te'
                ? 'ఇక్కడ అడగండి (ఉదా: నా బ్యాలెన్స్ ఎంత?)...'
                : 'Ask Saarthi anything...'
            }
            className="flex-1 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white text-xs rounded-xl px-3 py-2.5 outline-none font-medium text-slate-800 transition"
          />
          <button
            type="submit"
            className="w-10 h-10 bg-[#5C2D91] hover:bg-[#4A1E7A] text-white rounded-xl flex items-center justify-center transition shrink-0 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Animated Overlay for Voice Mode */}
      <AnimatePresence>
        {isVoiceMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#0a0f24]/95 text-white flex flex-col items-center justify-between p-6 z-30"
          >
            {/* Waveform Header */}
            <div className="text-center mt-6 flex flex-col items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping mb-2" />
              <h4 className="text-sm font-extrabold tracking-tight">
                {chatLang === 'hi' ? 'आपकी आवाज सुनी जा रही है...' : chatLang === 'ta' ? 'குரலைக் கேட்கிறது...' : chatLang === 'te' ? 'మీ స్వరాన్ని వింటోంది...' : 'Listening to your Voice...'}
              </h4>
              <p className="text-xs text-slate-400">SBI Safe Voice ID Active</p>
            </div>

            {/* Glowing wave form */}
            <div className="flex items-center justify-center gap-1.5 h-24">
              {voiceWaveform.map((height, idx) => (
                <motion.div
                  key={idx}
                  className="w-2 bg-indigo-500 rounded-full"
                  animate={{ height: `${height}px` }}
                  transition={{ duration: 0.15 }}
                />
              ))}
            </div>

            {/* Live Transcript Box */}
            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 w-full text-center text-xs">
              <p className="italic text-slate-300 font-medium">
                "{voiceTranscript}"
              </p>
            </div>

            {/* Cancel Button */}
            <button
              onClick={() => setIsVoiceMode(false)}
              className="mb-4 bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-500/20 py-2 px-6 rounded-full text-xs font-bold transition cursor-pointer"
            >
              Cancel
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
