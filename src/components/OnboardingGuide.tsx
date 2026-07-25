import React, { useState } from 'react';
import { HelpCircle, ChevronRight, ChevronLeft, X, Shield, Flame, Wallet, Swords, Award, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OnboardingGuideProps {
  themeColor: string;
  onClose?: () => void;
}

export function OnboardingGuide({ themeColor, onClose }: OnboardingGuideProps) {
  const [step, setStep] = useState(0);
  const [isDismissed, setIsDismissed] = useState(() => {
    return localStorage.getItem('system_onboarding_dismissed') === 'true';
  });

  const tutorialSteps = [
    {
      title: "SYSTEM INGRESS // INTRO PROTOCOL",
      icon: Sparkles,
      desc: "WELCOME TO THE S-CLASS LIFE CONTROL SYSTEM. This tactical HUD bridges your physical performance, dietary compliance, financial health, and personal goals into an integrated RPG-style command interface. Complete tasks to level up your attributes and earn credits.",
      details: [
        "Earn XP to level up your status ranks (from unranked up to S-CLASS).",
        "Earn Credits by completing Daily Quests and Clearing Instances.",
        "System Cloak keeps your sensitive biometric and ledger details hidden when needed."
      ]
    },
    {
      title: "METABOLISM & PAKISTANI DIETS",
      icon: Flame,
      desc: "Your physical vessel requires clean fueling and optimal recovery. Under the 'Metabolism' tab, you can track daily calories, water, and protein consumption.",
      details: [
        "Choose traditional PAKISTANI DIET PLANS (e.g. Keto Shred, Lean Gains) or create multi-meal custom templates.",
        "Quickly log whole meals or log custom food items from the Pakistani food database.",
        "Track hydration in milliliters and active workout burns."
      ]
    },
    {
      title: "DAILY QUESTS & INSTANCES",
      icon: Swords,
      desc: "Habits are converted into Daily Quests. Harder goals are converted into boss-fight Instances (Dungeons) that require consistent execution over multiple days to clear.",
      details: [
        "Select recurring quests or create custom daily challenges.",
        "Attack Instance Bosses by completing physical workouts or cognitive tasks.",
        "Claim rich XP and Credit rewards upon successful clears."
      ]
    },
    {
      title: "TREASURY & THE SYSTEM STORE",
      icon: Wallet,
      desc: "Financial consistency is survival. Manage expenditures using the double-entry Treasury ledger, and spend your hard-earned credits on real-life reward upgrades.",
      details: [
        "Enter incoming revenue or outgoing purchases inside the Ledger.",
        "Spend credits inside the Reward Shop on lifestyle items (or custom rewards).",
        "Equip items in your Inventory to gain passive attribute multipliers."
      ]
    },
    {
      title: "METABOLIC & GROWTH INTEGRITY",
      icon: Award,
      desc: "Achieve optimal hormonal and physical output by maintaining your daily directives. Track progress curves over a rolling 7-day vessel log.",
      details: [
        "Log weight trends, sleep hours, and stress regression factors daily.",
        "Fulfill the 4 Directives (Protein, Water, Sleep, Exertion) to maintain S-Class recovery status.",
        "Review Pakistani Nutritional Wisdom tips for local metabolic adjustments."
      ]
    }
  ];

  const handleNext = () => {
    if (step < tutorialSteps.length - 1) {
      setStep(prev => prev + 1);
    } else {
      handleDismiss();
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(prev => prev - 1);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('system_onboarding_dismissed', 'true');
    if (onClose) onClose();
  };

  const handleResetTutorial = () => {
    setIsDismissed(false);
    setStep(0);
    localStorage.removeItem('system_onboarding_dismissed');
  };

  if (isDismissed) {
    return (
      <button
        onClick={handleResetTutorial}
        className="fixed bottom-16 md:bottom-6 right-6 z-50 p-3 rounded-full bg-[#141414] border border-[#262626] hover:border-gray-500 transition-all text-white shadow-xl flex items-center space-x-2 font-mono text-[10px] tracking-widest uppercase"
        style={{ borderColor: `${themeColor}60` }}
      >
        <HelpCircle className="w-4 h-4" style={{ color: themeColor }} />
        <span className="hidden sm:inline">SYSTEM MANUAL</span>
      </button>
    );
  }

  const currentTutorial = tutorialSteps[step];
  const CurrentIcon = currentTutorial.icon;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#0A0A0A] border-2 rounded-sm p-6 max-w-lg w-full relative overflow-hidden font-mono text-left"
        style={{ borderColor: themeColor }}
      >
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2" style={{ borderColor: themeColor }}></div>
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2" style={{ borderColor: themeColor }}></div>
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-[#262626] pb-3 mb-4">
          <span className="text-[10px] text-[#A3A3A3] tracking-widest uppercase flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" style={{ color: themeColor }} />
            SYSTEM GUIDANCE PROTOCOL // {step + 1} OF {tutorialSteps.length}
          </span>
          <button onClick={handleDismiss} className="text-[#A3A3A3] hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#141414] border rounded-sm" style={{ borderColor: `${themeColor}40` }}>
              <CurrentIcon className="w-6 h-6" style={{ color: themeColor }} />
            </div>
            <h3 className="text-sm font-bold text-white tracking-widest uppercase">{currentTutorial.title}</h3>
          </div>

          <p className="text-[11px] text-[#E5E5E5] leading-relaxed uppercase tracking-wide bg-[#141414] p-3 border border-[#262626] rounded-sm">
            {currentTutorial.desc}
          </p>

          <div className="space-y-2">
            <span className="text-[9px] text-[#555] tracking-widest uppercase block font-bold">OPERATIONAL DIRECTIVES:</span>
            <ul className="space-y-2 text-[10px] text-[#A3A3A3] list-none">
              {currentTutorial.details.map((detail, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-500 font-bold mt-0.5">//</span>
                  <span className="uppercase tracking-wide leading-relaxed">{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center pt-4 mt-6 border-t border-[#262626]">
          <button
            onClick={handlePrev}
            disabled={step === 0}
            className="flex items-center space-x-1 text-[10px] text-[#A3A3A3] hover:text-white disabled:opacity-30 disabled:hover:text-[#A3A3A3] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> PREV
          </button>

          <div className="flex gap-1">
            {tutorialSteps.map((_, idx) => (
              <div
                key={idx}
                className="w-1.5 h-1.5 rounded-full transition-colors"
                style={{ backgroundColor: idx === step ? themeColor : '#262626' }}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="flex items-center space-x-1 text-[10px] font-bold transition-all px-3 py-1.5 border rounded-sm"
            style={{ color: themeColor, borderColor: `${themeColor}60`, backgroundColor: `${themeColor}10` }}
          >
            {step === tutorialSteps.length - 1 ? "FINISH" : "NEXT"} <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
