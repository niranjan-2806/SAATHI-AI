import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, ShieldCheck, ShieldAlert, Smartphone, Fingerprint, MapPin, Sparkles, Check, ChevronDown, Lock, Key } from 'lucide-react';
import { PersonaType, LanguageType } from '../types';

interface SecurityScoreProps {
  persona: PersonaType;
  language: LanguageType;
}

const LOCAL_SEC = {
  title: {
    en: "Security Score",
    hi: "सुरक्षा स्कोर",
    ta: "பாதுகாப்பு மதிப்பெண்",
    te: "భద్రతా స్కోరు"
  },
  subtitle: {
    en: "Real-time Threat Safeguard",
    hi: "रीयल-टाइम सुरक्षा रेटिंग",
    ta: "நிகழ்நேர அச்சுறுத்தல் பாதுகாப்பு",
    te: "రియల్ టైమ్ థ్రెట్ సేఫ్‌గార్డ్"
  },
  deviceBinding: {
    title: {
      en: "SIM Device Binding",
      hi: "सिम डिवाइस बाइंडिंग",
      ta: "சிம் சாதனப் பிணைப்பு",
      te: "సిమ్ పరికర బైండింగ్"
    },
    desc: {
      en: "Secure access exclusively to this physical SIM slot",
      hi: "सुरक्षित पहुँच केवल इस भौतिक सिम स्लॉट तक",
      ta: "இந்த சிம்முடன் மட்டும் கணக்கு அணுகலைப் பூட்டு",
      te: "ఈ భౌతిక సిమ్ స్లాట్‌కు మాత్రమే సురక్షిత ప్రవేశం"
    }
  },
  biometrics: {
    title: {
      en: "Biometric Authentication",
      hi: "बायोमेट्रिक प्रमाणीकरण",
      ta: "உயிரியளவுக் கட்டுப்பாடு",
      te: "బయోమెట్రిక్ ప్రమాణీకరణ"
    },
    desc: {
      en: "Enforce Fingerprint or Face ID login checks",
      hi: "फ़िंगरप्रिंट या फेस आईडी लॉगिन लागू करें",
      ta: "கைரேகை அல்லது முக அங்கீகாரத்தை இயக்கு",
      te: "వేలిముద్ర లేదా ఫేస్ ఐడి లాగిన్ అమలు చేయండి"
    }
  },
  aiShield: {
    title: {
      en: "AI FraudShield Radar",
      hi: "एआई फ्रॉडशील्ड रडार",
      ta: "AI ஃபிராட்ஷீல்ட் ரேடார்",
      te: "AI ఫ్రాడ్ షీల్డ్ రాడార్"
    },
    desc: {
      en: "Set active anomaly alert radar to Maximum",
      hi: "सक्रिय धोखाधड़ी अलर्ट रडार को अधिकतम पर सेट करें",
      ta: "சந்தேகத்திற்குரிய செயல்பாட்டு ரேடாரை அதிகப்படுத்து",
      te: "క్రియాశీల వైరుధ్య హెచ్చరిక రాడార్‌ను గరిష్టంగా సెట్ చేయండి"
    }
  },
  gpsSafeguard: {
    title: {
      en: "GPS Location Safeguard",
      hi: "जीपीएस स्थान सुरक्षा",
      ta: "ஜிபிஎஸ் இருப்பிட பாதுகாப்பு",
      te: "జీపీఎస్ స్థాన రక్షణ"
    },
    desc: {
      en: "Match transactions with device coordinates",
      hi: "डिवाइस निर्देशांक के साथ लेनदेन का मिलान करें",
      ta: "இருப்பிடத்துடன் பரிவர்த்தனைகளைப் பொருத்து",
      te: "పరికర కోఆర్డినేట్‌లతో లావాదేవీలను సరిపోల్చండి"
    }
  },
  twoFactorAuth: {
    title: {
      en: "2-Factor Authentication (2FA)",
      hi: "टू-फैक्टर ऑथेंटिकेशन (2FA)",
      ta: "இரு-காரணி அங்கீகாரம் (2FA)",
      te: "ద్వి-కారక ప్రామాణీకరణ (2FA)"
    },
    desc: {
      en: "Require a secure OTP via SMS before paying or executing transactions",
      hi: "लेनदेन या भुगतान करने से पहले एसएमएस के माध्यम से सुरक्षित ओटीपी आवश्यक करें",
      ta: "பரிவர்த்தனைகள் அல்லது பணம் செலுத்துவதற்கு முன் பாதுகாப்பான OTP-ஐக் கேள்",
      te: "లావాదేవీలు లేదా చెల్లింపులకు ముందు సురక్షితమైన OTPని తప్పనిసరి చేయండి"
    }
  },
  scoreFeedback: {
    excellent: {
      title: { en: "Shield Fortified! 🛡️", hi: "कवच पूर्णतः सुरक्षित! 🛡️", ta: "கவசம் பலப்படுத்தப்பட்டது! 🛡️", te: "కవచం పటిష్టమైంది! 🛡️" },
      msg: { 
        en: "Your account is fully armored against UPI scams and cyber threats.", 
        hi: "आपका खाता यूपीआई घोटालों और साइबर खतरों से पूरी तरह सुरक्षित है।", 
        ta: "UPI மோசடிகள் மற்றும் சைபர் அச்சுறுத்தல்களுக்கு எதிராக கணக்கு பாதுகாப்பானது.", 
        te: "UPI మోసాలు మరియు సైబర్ ముప్పుల నుండి మీ ఖాతా పూర్తిగా రక్షించబడింది." 
      }
    },
    good: {
      title: { en: "Moderate Security ⚡", hi: "मध्यम सुरक्षा ⚡", ta: "மிதமான பாதுகாப்பு ⚡", te: "మితమైన భద్రత ⚡" },
      msg: { 
        en: "Enable all safeguards to bulletproof your financial ledger.", 
        hi: "अपने वित्तीय बहीखाते को बुलेटप्रूफ बनाने के लिए सभी सुरक्षा उपाय सक्षम करें।", 
        ta: "உங்கள் நிதியை முழுமையாகப் பாதுகாக்க அனைத்து அமைப்புகளையும் இயக்கவும்.", 
        te: "మీ ఆర్థిక లెడ్జర్‌ను మరింత సురక్షితం చేయడానికి అన్ని రక్షణలను ప్రారంభించండి." 
      }
    },
    warning: {
      title: { en: "Guard Down! ⚠️", hi: "सुरक्षा कम है! ⚠️", ta: "பாதுகாப்பு குறைவு! ⚠️", te: "భద్రత తక్కువగా ఉంది! ⚠️" },
      msg: { 
        en: "Critical items disabled! Enable SIM binding and GPS now.", 
        hi: "महत्वपूर्ण सुरक्षा बंद है! तुरंत सिम बाइंडिंग और जीपीएस चालू करें।", 
        ta: "முக்கிய அமைப்புகள் முடக்கப்பட்டன! சாதனப் பிணைப்பை இயக்கவும்.", 
        te: "కీలక అంశాలు నిలిపివేయబడ్డాయి! వెంటనే సిమ్ బైండింగ్ మరియు జీపీఎస్ ప్రారంభించండి." 
      }
    }
  },
  interactiveLabel: {
    en: "Customize Protection",
    hi: "सुरक्षा अनुकूलित करें",
    ta: "பாதுகாப்பைத் தனிப்பயனாக்கு",
    te: "రక్షణను అనుకూలీకరించండి"
  }
};

export default function SecurityScore({ persona, language }: SecurityScoreProps) {
  // Setup personalized baseline settings based on persona
  const [deviceBinding, setDeviceBinding] = useState(true);
  const [biometrics, setBiometrics] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [aiShield, setAiShield] = useState(true);
  const [gpsSafeguard, setGpsSafeguard] = useState(true);
  const [showConfig, setShowConfig] = useState(false);

  useEffect(() => {
    if (persona === 'student') {
      // Students have lax security initially
      setDeviceBinding(false);
      setBiometrics(true);
      setTwoFactorAuth(false);
      setAiShield(false);
      setGpsSafeguard(false);
    } else if (persona === 'professional') {
      // Professionals have everything fully configured
      setDeviceBinding(true);
      setBiometrics(true);
      setTwoFactorAuth(true);
      setAiShield(true);
      setGpsSafeguard(true);
    } else if (persona === 'senior') {
      // Seniors have device & biometric but usually missed GPS location matching
      setDeviceBinding(true);
      setBiometrics(true);
      setTwoFactorAuth(true);
      setAiShield(true);
      setGpsSafeguard(false);
    }
  }, [persona]);

  // Calculate score based on active security settings
  const points = {
    deviceBinding: 25,
    biometrics: 20,
    twoFactorAuth: 25,
    aiShield: 15,
    gpsSafeguard: 15
  };

  const calculatedScore = 
    (deviceBinding ? points.deviceBinding : 0) +
    (biometrics ? points.biometrics : 0) +
    (twoFactorAuth ? points.twoFactorAuth : 0) +
    (aiShield ? points.aiShield : 0) +
    (gpsSafeguard ? points.gpsSafeguard : 0);

  // SVG circular dial parameters
  const radius = 38;
  const strokeWidth = 7;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (calculatedScore / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'stroke-emerald-500 text-emerald-600 dark:text-emerald-400';
    if (score >= 60) return 'stroke-amber-500 text-amber-600 dark:text-amber-400';
    return 'stroke-red-500 text-red-600 dark:text-red-400';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 85) return 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 border-emerald-100 dark:border-emerald-900/20';
    if (score >= 60) return 'bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 border-amber-100 dark:border-amber-900/20';
    return 'bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-300 border-red-100 dark:border-red-900/20';
  };

  const getScoreText = (score: number) => {
    if (score >= 85) return LOCAL_SEC.scoreFeedback.excellent;
    if (score >= 60) return LOCAL_SEC.scoreFeedback.good;
    return LOCAL_SEC.scoreFeedback.warning;
  };

  const feedback = getScoreText(calculatedScore);

  return (
    <div 
      id="security-score-widget" 
      className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800/80 shadow-sm flex flex-col gap-4 transition-all duration-300 relative overflow-hidden"
    >
      {/* Background soft glowing badge */}
      <div className="absolute -top-6 -right-6 w-20 h-20 bg-indigo-50 dark:bg-indigo-950/10 rounded-full blur-xl pointer-events-none" />

      {/* Title block */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-[#5C2D91] dark:text-[#8d54d9] animate-pulse" />
          {LOCAL_SEC.title[language]}
        </span>
        <button
          onClick={() => setShowConfig(!showConfig)}
          className="text-[11px] text-[#5C2D91] dark:text-indigo-400 hover:underline flex items-center gap-0.5 font-bold cursor-pointer"
        >
          {LOCAL_SEC.interactiveLabel[language]}
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${showConfig ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Score and Info Area */}
      <div className="flex items-center gap-4.5">
        {/* Circle SVG Gauge */}
        <div className="relative flex items-center justify-center w-20 h-20 shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="stroke-slate-100 dark:stroke-slate-800 fill-none"
              strokeWidth={strokeWidth}
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              className={`fill-none transition-all duration-700 ease-out ${getScoreColor(calculatedScore).split(' ')[0]}`}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-xl font-black font-mono tracking-tight text-slate-800 dark:text-slate-100">
              {calculatedScore}
            </span>
            <span className="text-[8px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-extrabold">/100</span>
          </div>
        </div>

        {/* Dynamic status card */}
        <div className="flex flex-col gap-1 flex-1">
          <div className={`px-2.5 py-0.5 rounded-full border text-[10px] font-black uppercase tracking-wider w-fit flex items-center gap-1.5 ${getScoreBgColor(calculatedScore)}`}>
            {calculatedScore === 100 && <Sparkles className="w-3 h-3 text-amber-500 shrink-0 animate-bounce" />}
            {feedback.title[language]}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-350 font-semibold leading-relaxed">
            {feedback.msg[language]}
          </p>
        </div>
      </div>

      {/* Interactive configurations details */}
      <AnimatePresence>
        {(showConfig || calculatedScore < 85) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex flex-col gap-2 mt-1">
              {/* 1. Device Binding */}
              <button
                onClick={() => setDeviceBinding(!deviceBinding)}
                className={`p-3 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                  deviceBinding
                    ? 'border-indigo-100 bg-indigo-50/20 dark:bg-indigo-950/5 text-[#5C2D91] dark:text-indigo-300'
                    : 'border-slate-150 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${deviceBinding ? 'bg-indigo-100/60 dark:bg-indigo-900/30 text-[#5C2D91]' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-[11px] font-black">{LOCAL_SEC.deviceBinding.title[language]}</h5>
                    <p className="text-[9px] text-slate-450 dark:text-slate-500 font-semibold leading-normal">{LOCAL_SEC.deviceBinding.desc[language]}</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                  deviceBinding ? 'bg-[#5C2D91] border-transparent text-white' : 'border-slate-300 bg-transparent'
                }`}>
                  {deviceBinding && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>

              {/* 2. Biometrics */}
              <button
                onClick={() => setBiometrics(!biometrics)}
                className={`p-3 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                  biometrics
                    ? 'border-indigo-100 bg-indigo-50/20 dark:bg-indigo-950/5 text-[#5C2D91] dark:text-indigo-300'
                    : 'border-slate-150 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${biometrics ? 'bg-indigo-100/60 dark:bg-indigo-900/30 text-[#5C2D91]' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                    <Fingerprint className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-[11px] font-black">{LOCAL_SEC.biometrics.title[language]}</h5>
                    <p className="text-[9px] text-slate-450 dark:text-slate-500 font-semibold leading-normal">{LOCAL_SEC.biometrics.desc[language]}</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                  biometrics ? 'bg-[#5C2D91] border-transparent text-white' : 'border-slate-300 bg-transparent'
                }`}>
                  {biometrics && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>

              {/* 2.5. Two-Factor Authentication (2FA) */}
              <button
                onClick={() => setTwoFactorAuth(!twoFactorAuth)}
                className={`p-3 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                  twoFactorAuth
                    ? 'border-indigo-100 bg-indigo-50/20 dark:bg-indigo-950/5 text-[#5C2D91] dark:text-indigo-300'
                    : 'border-slate-150 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${twoFactorAuth ? 'bg-indigo-100/60 dark:bg-indigo-900/30 text-[#5C2D91]' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                    <Key className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-[11px] font-black">{LOCAL_SEC.twoFactorAuth.title[language]}</h5>
                    <p className="text-[9px] text-slate-450 dark:text-slate-500 font-semibold leading-normal">{LOCAL_SEC.twoFactorAuth.desc[language]}</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                  twoFactorAuth ? 'bg-[#5C2D91] border-transparent text-white' : 'border-slate-300 bg-transparent'
                }`}>
                  {twoFactorAuth && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>

              {/* 3. AI FraudShield Radar */}
              <button
                onClick={() => setAiShield(!aiShield)}
                className={`p-3 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                  aiShield
                    ? 'border-indigo-100 bg-indigo-50/20 dark:bg-indigo-950/5 text-[#5C2D91] dark:text-indigo-300'
                    : 'border-slate-150 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${aiShield ? 'bg-indigo-100/60 dark:bg-indigo-900/30 text-[#5C2D91]' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-[11px] font-black">{LOCAL_SEC.aiShield.title[language]}</h5>
                    <p className="text-[9px] text-slate-450 dark:text-slate-500 font-semibold leading-normal">{LOCAL_SEC.aiShield.desc[language]}</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                  aiShield ? 'bg-[#5C2D91] border-transparent text-white' : 'border-slate-300 bg-transparent'
                }`}>
                  {aiShield && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>

              {/* 4. GPS location safeguard */}
              <button
                onClick={() => setGpsSafeguard(!gpsSafeguard)}
                className={`p-3 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                  gpsSafeguard
                    ? 'border-indigo-100 bg-indigo-50/20 dark:bg-indigo-950/5 text-[#5C2D91] dark:text-indigo-300'
                    : 'border-slate-150 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${gpsSafeguard ? 'bg-indigo-100/60 dark:bg-indigo-900/30 text-[#5C2D91]' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-[11px] font-black">{LOCAL_SEC.gpsSafeguard.title[language]}</h5>
                    <p className="text-[9px] text-slate-450 dark:text-slate-500 font-semibold leading-normal">{LOCAL_SEC.gpsSafeguard.desc[language]}</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                  gpsSafeguard ? 'bg-[#5C2D91] border-transparent text-white' : 'border-slate-300 bg-transparent'
                }`}>
                  {gpsSafeguard && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
