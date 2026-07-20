import React, { useState } from 'react';
import { Sparkles, TrendingUp, TrendingDown, CheckCircle, ChevronRight, Activity, Moon, Droplets, Target, Award, HeartHandshake, Zap, Clock, Flame } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { cn } from '../lib/utils';
import { db, addXp } from '../db/db';
import { toast } from 'sonner';

interface GrowthSectionProps {
  vesselLogs: any[];
  nutritionLogs: any[];
  todayLog?: any;
  themeColor: string;
  targetCalories: number;
  consumedWater: number;
  consumedProtein: number;
  targetProtein: number;
  consumedCalories: number;
  burnedCalories: number;
}

const PAKISTANI_GROWTH_WISDOM = [
  {
    title: "CARB BALANCE SECRETS",
    tip: "Roti is an excellent whole-wheat complex carb, but portion control is vital. Limit to 1 medium chapati (40g dry flour) per meal during cut phases, and pair with salads or raita to increase meal volume and fiber."
  },
  {
    title: "MAXIMIZE BIRYANI EFFICIENCY",
    tip: "When eating Chicken Biryani, prioritize chicken breast pieces for high-quality protein and consume only 1/2 of the rice. Always pair with a large plate of sliced cucumbers and tomatoes to keep insulin spikes low."
  },
  {
    title: "KARAK CHAI ADAPTATIONS",
    tip: "Pakistani Karak Chai often contains full-cream milk and heavy refined sugar, adding hidden liquid fats and carbs. Switch to low-fat milk (Skimmed) and replace white sugar with Stevia or drop it completely."
  },
  {
    title: "INCREASE SHAMI KABAB PROTEIN",
    tip: "Traditional Shami Kabab is made with minced beef/chicken and split chickpeas (chana dal). It is highly anabolic! Bake or pan-fry with minimal olive oil instead of deep frying to save 120+ kcal per piece."
  },
  {
    title: "DAHI (YOGURT) METABOLIC SHIELD",
    tip: "Dahi (plain low-fat yogurt) provides invaluable gut probiotics and casein protein. Consuming 1 cup of plain dahi with dinner assists in sustained muscle synthesis throughout your sleep cycle."
  }
];

export function GrowthSection({
  vesselLogs,
  nutritionLogs,
  todayLog,
  themeColor,
  targetCalories,
  consumedWater,
  consumedProtein,
  targetProtein,
  consumedCalories,
  burnedCalories
}: GrowthSectionProps) {
  const [wisdomIndex, setWisdomIndex] = useState(0);

  // Weight & Body Fat deltas
  const weightLogs = vesselLogs?.filter(l => l.weight !== undefined) || [];
  let currentWeight = weightLogs.length > 0 ? weightLogs[weightLogs.length - 1].weight : null;
  let weightDelta = 0;
  let bodyFatDelta = 0;
  
  if (weightLogs.length >= 2) {
    const latest = weightLogs[weightLogs.length - 1].weight || 0;
    const earliest = weightLogs[0].weight || 0;
    weightDelta = latest - earliest;
    
    const fatLogs = weightLogs.filter(l => l.bodyFat !== undefined);
    if (fatLogs.length >= 2) {
      bodyFatDelta = (fatLogs[fatLogs.length - 1].bodyFat || 0) - (fatLogs[0].bodyFat || 0);
    }
  }

  // Daily checklists calculations
  const isHydrationMet = consumedWater >= 2000;
  const isSleepMet = (todayLog?.sleepHours || 0) >= 7.0;
  const isProteinMet = consumedProtein >= (targetProtein > 0 ? targetProtein - 15 : 80);
  const isExertionMet = burnedCalories >= 150;

  const metQuestsCount = (isHydrationMet ? 1 : 0) + (isSleepMet ? 1 : 0) + (isProteinMet ? 1 : 0) + (isExertionMet ? 1 : 0);

  // Quick-Log handlers
  const handleQuickLogWater = async (amount: number) => {
    const today = new Date().toISOString().split('T')[0];
    await db.nutritionLogs.add({
      date: today,
      type: 'water',
      name: 'Quick Hydration Boost',
      calories: 0,
      amount: amount
    });
    await addXp(amount >= 500 ? 15 : 5, 'VIT');
    toast.success(`LOGGED +${amount}ml WATER // SYSTEM REHYDRATED`, {
      style: { background: '#141414', border: `1px solid ${themeColor}`, color: themeColor, fontFamily: 'monospace' }
    });
  };

  const handleQuickLogProtein = async (amount: number, label: string) => {
    const today = new Date().toISOString().split('T')[0];
    await db.nutritionLogs.add({
      date: today,
      type: 'food',
      name: label,
      calories: amount * 4,
      protein: amount,
      carbs: 0,
      fat: 1
    });
    await addXp(25, 'STR');
    toast.success(`LOGGED ${label} (+${amount}g Protein) // AMINO POOL OPTIMIZED`, {
      style: { background: '#141414', border: `1px solid ${themeColor}`, color: themeColor, fontFamily: 'monospace' }
    });
  };

  const handleQuickLogSleep = async () => {
    const today = new Date().toISOString().split('T')[0];
    const existing = await db.vesselLogs.where('date').equals(today).first();
    if (existing) {
      await db.vesselLogs.update(existing.id!, { sleepHours: 8 });
    } else {
      await db.vesselLogs.add({
        date: today,
        sleepHours: 8,
        stressLevel: 3
      });
    }
    await addXp(50, 'SEN');
    toast.success(`8.0H REGENERATIVE SLEEP PROTOCOL RECORDED`, {
      style: { background: '#141414', border: `1px solid ${themeColor}`, color: themeColor, fontFamily: 'monospace' }
    });
  };

  const handleQuickLogWorkout = async () => {
    const today = new Date().toISOString().split('T')[0];
    await db.nutritionLogs.add({
      date: today,
      type: 'exercise',
      name: 'Anabolic Conditioning Protocol',
      calories: 300,
      duration: 45,
      muscleGroup: 'cardio'
    });
    await addXp(75, 'VIT');
    toast.success(`ACTIVE EXERTION (300KCAL CARDIO) REGISTERED`, {
      style: { background: '#141414', border: `1px solid ${themeColor}`, color: themeColor, fontFamily: 'monospace' }
    });
  };

  const getMetabolicPhase = () => {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 6) {
      return {
        phase: "CELLULAR RECONSTRUCTION & SLEEP SYNTHESIS",
        desc: "DEEP TISSUE REMODELING AND GROWTH HORMONE EXCRETION ACTIVE.",
        action: "PRIORITIZE HIGH-CASEIN RECIPES BEFORE THIS WINDOW",
        icon: Moon,
        color: "text-purple-400",
        borderColor: "border-purple-500/30",
        bg: "bg-purple-500/5"
      };
    } else if (hour >= 6 && hour < 12) {
      return {
        phase: "FASTED METABOLIC RESET / GLYCOGEN FAT BURNING",
        desc: "BLOOD INSULIN AT BASELINE. IDEAL FOR FASTER CARDIO & ACTIVE FAT OXIDATION.",
        action: "RECOMMENDED: CARDIO + SUGAR-FREE GREEN TEA",
        icon: Zap,
        color: "text-amber-400",
        borderColor: "border-amber-500/30",
        bg: "bg-amber-500/5"
      };
    } else if (hour >= 12 && hour < 18) {
      return {
        phase: "PEAK ANABOLIC INTEGRITY WINDOW",
        desc: "ENZYMATIC ACTIVITY MAXIMIZED. IDEAL FUEL ABSORPTION AND HEAVY MUSCULAR EXERTION.",
        action: "RECOMMENDED: BULK PROTEIN MEAL + STRENGTH TRAINING",
        icon: Flame,
        color: "text-red-400",
        borderColor: "border-red-500/30",
        bg: "bg-red-500/5"
      };
    } else {
      return {
        phase: "GLUCOSE CLEARANCE & STRESS REDUCTION",
        desc: "AMINO ACID RETENTION PRESERVED. INHIBIT HEAVY REFINED CARBS TO DECREASE INSULIN SPURTS.",
        action: "RECOMMENDED: COMPACT PROTEIN (SHAMI KABAB OR DAHI)",
        icon: Clock,
        color: "text-indigo-400",
        borderColor: "border-indigo-500/30",
        bg: "bg-indigo-500/5"
      };
    }
  };

  const currentPhase = getMetabolicPhase();
  const PhaseIcon = currentPhase.icon;

  // Generate 7-day caloric balance & weight progress data
  const chartData = vesselLogs?.slice(-7).map(log => {
    return {
      date: log.date.substring(5),
      weight: log.weight || currentWeight,
      stress: log.stressLevel ? log.stressLevel * 20 : 40,
      sleep: log.sleepHours ? log.sleepHours * 10 : 0
    };
  }) || [];

  const handleNextWisdom = () => {
    setWisdomIndex((prev) => (prev + 1) % PAKISTANI_GROWTH_WISDOM.length);
  };

  return (
    <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-4 md:p-6 relative overflow-hidden space-y-6">
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#262626]"></div>
      
      {/* Header */}
      <div>
        <h3 className="text-lg font-mono text-white flex items-center font-bold tracking-widest uppercase">
          <Sparkles className="w-5 h-5 mr-2" style={{ color: themeColor }} />
          GROWTH & METABOLIC INTEGRITY
        </h3>
        <p className="text-[10px] text-[#A3A3A3] font-mono tracking-widest uppercase mt-1">Real-time circadian tracking, fast micro-actions, and localized metabolic parameters.</p>
      </div>

      {/* Dynamic Circadian Metabolic Phase Widget */}
      <div className={cn("border rounded-sm p-4 relative overflow-hidden", currentPhase.borderColor, currentPhase.bg)}>
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r" style={{ borderColor: themeColor }}></div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <PhaseIcon className={cn("w-8 h-8 flex-shrink-0 animate-pulse mt-0.5", currentPhase.color)} />
            <div>
              <span className="text-[8px] font-mono text-[#A3A3A3] tracking-widest uppercase block font-bold">CURRENT CIRCADIAN METABOLIC STATUS</span>
              <h4 className={cn("text-xs sm:text-sm font-mono font-bold uppercase tracking-wider mt-0.5", currentPhase.color)}>
                {currentPhase.phase}
              </h4>
              <p className="text-[10px] font-mono text-[#A3A3A3] uppercase mt-1 leading-normal tracking-wide">
                {currentPhase.desc}
              </p>
            </div>
          </div>
          <div className="bg-[#0A0A0A] border border-[#262626] px-3 py-2 rounded-sm text-center self-start sm:self-auto min-w-[150px]">
            <span className="text-[8px] font-mono text-[#555] block uppercase">ACTIVE PROTOCOL</span>
            <span className="text-[9px] font-mono font-bold text-white uppercase tracking-wider">{currentPhase.action}</span>
          </div>
        </div>
      </div>

      {/* Grid: Deltas & checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left column: deltas & progress card */}
        <div className="space-y-4">
          <div className="bg-[#141414] border border-[#262626] rounded-sm p-4 relative overflow-hidden">
            <span className="text-[9px] font-mono text-[#A3A3A3] tracking-widest uppercase block">VESSEL METRICS TREND</span>
            
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div>
                <span className="text-[10px] font-mono text-[#555] block uppercase">Weight Trend</span>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-xl font-mono font-bold text-white">
                    {currentWeight ? `${currentWeight.toFixed(1)} kg` : '--'}
                  </span>
                  {weightDelta !== 0 && (
                    <span className={cn(
                      "text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-sm flex items-center gap-0.5",
                      weightDelta < 0 ? "bg-green-900/20 text-green-400 border border-green-950" : "bg-blue-900/20 text-blue-400 border border-blue-950"
                    )}>
                      {weightDelta < 0 ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                      {weightDelta > 0 ? `+${weightDelta.toFixed(1)}` : weightDelta.toFixed(1)}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono text-[#555] block uppercase">Body Fat Delta</span>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-xl font-mono font-bold text-white">
                    {todayLog?.bodyFat ? `${todayLog.bodyFat.toFixed(1)}%` : '--'}
                  </span>
                  {bodyFatDelta !== 0 && (
                    <span className={cn(
                      "text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-sm flex items-center gap-0.5",
                      bodyFatDelta < 0 ? "bg-green-900/20 text-green-400 border border-green-950" : "bg-red-900/20 text-red-400 border border-red-950"
                    )}>
                      {bodyFatDelta < 0 ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                      {bodyFatDelta > 0 ? `+${bodyFatDelta.toFixed(1)}%` : `${bodyFatDelta.toFixed(1)}%`}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[#262626]/60 flex items-center justify-between text-[10px] font-mono">
              <span className="text-[#A3A3A3] uppercase">Metabolic Compliance:</span>
              <span className="font-bold text-white px-2 py-0.5 bg-[#262626] border border-[#333] rounded-sm">
                {metQuestsCount}/4 DIRECTIVES MET
              </span>
            </div>
          </div>

          {/* Pakistan Diet Wisdom */}
          <div className="bg-[#141414] border border-[#262626] rounded-sm p-4 relative overflow-hidden flex flex-col justify-between min-h-[160px]">
            <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: themeColor }} />
            <div>
              <div className="flex justify-between items-center mb-1.5 pl-2">
                <span className="text-[9px] font-mono text-indigo-400 tracking-widest uppercase font-bold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> PAKISTANI NUTRITIONAL WISDOM
                </span>
                <button 
                  onClick={handleNextWisdom}
                  className="text-[9px] font-mono text-[#A3A3A3] hover:text-white transition-colors flex items-center uppercase"
                >
                  NEXT <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <h4 className="text-xs font-mono font-bold text-white pl-2 uppercase tracking-wide">{PAKISTANI_GROWTH_WISDOM[wisdomIndex].title}</h4>
              <p className="text-[10px] font-mono text-[#A3A3A3] leading-relaxed mt-2 pl-2 uppercase tracking-wide">
                {PAKISTANI_GROWTH_WISDOM[wisdomIndex].tip}
              </p>
            </div>
            <div className="text-[8px] font-mono text-[#555] text-right mt-2 uppercase">
              Advice {wisdomIndex + 1} of {PAKISTANI_GROWTH_WISDOM.length}
            </div>
          </div>
        </div>

        {/* Right column: daily metabolic directives check with Quick-Action triggers! */}
        <div className="bg-[#141414] border border-[#262626] rounded-sm p-4 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-[9px] font-mono text-[#A3A3A3] tracking-widest uppercase block">DAILY OPERATIONS & TACTICAL LOGGING</span>
            
            <div className="space-y-3">
              {/* Protein Directive */}
              <div className="p-2.5 bg-[#0A0A0A] border border-[#262626] rounded-sm space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className={cn("w-4 h-4", isProteinMet ? "text-green-400" : "text-[#333]")} />
                    <span className="text-[10px] font-mono text-white uppercase font-bold tracking-wide">Protein Threshold</span>
                  </div>
                  <span className="text-[9px] font-mono text-[#A3A3A3]">{consumedProtein} / {targetProtein > 0 ? targetProtein : 80}g</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleQuickLogProtein(25, 'Whey Protein Shake')}
                    className="flex-1 text-[8px] font-mono text-[#A3A3A3] hover:text-white bg-[#141414] hover:bg-[#222] border border-[#262626] py-1 rounded-sm uppercase tracking-wider"
                  >
                    +25G SHAKE
                  </button>
                  <button
                    onClick={() => handleQuickLogProtein(40, 'Chicken Tikka Breast (150g)')}
                    className="flex-1 text-[8px] font-mono text-[#A3A3A3] hover:text-white bg-[#141414] hover:bg-[#222] border border-[#262626] py-1 rounded-sm uppercase tracking-wider"
                  >
                    +40G TIKKA
                  </button>
                </div>
              </div>

              {/* Water Directive */}
              <div className="p-2.5 bg-[#0A0A0A] border border-[#262626] rounded-sm space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className={cn("w-4 h-4", isHydrationMet ? "text-green-400" : "text-[#333]")} />
                    <span className="text-[10px] font-mono text-white uppercase font-bold tracking-wide">Hydration (2.0L+)</span>
                  </div>
                  <span className="text-[9px] font-mono text-[#A3A3A3]">{consumedWater} / 2000ml</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleQuickLogWater(250)}
                    className="flex-1 text-[8px] font-mono text-[#A3A3A3] hover:text-white bg-[#141414] hover:bg-[#222] border border-[#262626] py-1 rounded-sm uppercase tracking-wider"
                  >
                    +250ML GLASS
                  </button>
                  <button
                    onClick={() => handleQuickLogWater(500)}
                    className="flex-1 text-[8px] font-mono text-[#A3A3A3] hover:text-white bg-[#141414] hover:bg-[#222] border border-[#262626] py-1 rounded-sm uppercase tracking-wider"
                  >
                    +500ML BOTTLE
                  </button>
                  <button
                    onClick={() => handleQuickLogWater(1000)}
                    className="flex-1 text-[8px] font-mono text-[#A3A3A3] hover:text-white bg-[#141414] hover:bg-[#222] border border-[#262626] py-1 rounded-sm uppercase tracking-wider"
                  >
                    +1.0L MULTI
                  </button>
                </div>
              </div>

              {/* Sleep Directive */}
              <div className="p-2.5 bg-[#0A0A0A] border border-[#262626] rounded-sm space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className={cn("w-4 h-4", isSleepMet ? "text-green-400" : "text-[#333]")} />
                    <span className="text-[10px] font-mono text-white uppercase font-bold tracking-wide">Regeneration Sleep (7h+)</span>
                  </div>
                  <span className="text-[9px] font-mono text-[#A3A3A3]">{todayLog?.sleepHours || 0} / 7h</span>
                </div>
                {!isSleepMet && (
                  <button
                    onClick={handleQuickLogSleep}
                    className="w-full text-[8px] font-mono text-[#A3A3A3] hover:text-white bg-[#141414] hover:bg-[#222] border border-[#262626] py-1 rounded-sm uppercase tracking-wider"
                  >
                    LOG OPTIMAL 8.0H SLEEP
                  </button>
                )}
              </div>

              {/* Workout Directive */}
              <div className="p-2.5 bg-[#0A0A0A] border border-[#262626] rounded-sm space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className={cn("w-4 h-4", isExertionMet ? "text-green-400" : "text-[#333]")} />
                    <span className="text-[10px] font-mono text-white uppercase font-bold tracking-wide">Workout / Exertion</span>
                  </div>
                  <span className="text-[9px] font-mono text-[#A3A3A3]">{burnedCalories} KCAL</span>
                </div>
                {!isExertionMet && (
                  <button
                    onClick={handleQuickLogWorkout}
                    className="w-full text-[8px] font-mono text-[#A3A3A3] hover:text-white bg-[#141414] hover:bg-[#222] border border-[#262626] py-1 rounded-sm uppercase tracking-wider"
                  >
                    QUICK LOG 45M CONDITIONING (300 KCAL)
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 bg-[#0A0A0A] border border-[#262626] p-2.5 rounded-sm flex items-center gap-2">
            <HeartHandshake className="w-5 h-5" style={{ color: themeColor }} />
            <div className="text-[9px] font-mono text-[#A3A3A3] uppercase tracking-wider leading-snug">
              {metQuestsCount === 4 ? (
                <span className="text-green-400 font-bold">100% SUCCESS // ANABOLIC REINFORCEMENT MAXIMIZED TODAY!</span>
              ) : (
                <span>Complete all 4 directives to optimize hormone balance, tissue growth, and lipid-profile reduction.</span>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Section: Weight & Stress Progress Chart */}
      {chartData.length > 0 && (
        <div className="border-t border-[#262626] pt-5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[9px] font-mono text-[#A3A3A3] tracking-widest uppercase font-bold">7-LOG VESSEL PROGRESSION</span>
            <span className="text-[9px] font-mono text-[#555] uppercase">Solid: Weight (kg) | Shaded: Sleep Regeneration</span>
          </div>
          
          <div className="h-[180px] w-full bg-[#141414] border border-[#262626] rounded-sm p-3">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="date" stroke="#666" fontSize={8} tickLine={false} />
                <YAxis yAxisId="weight" stroke="#888" fontSize={8} domain={['dataMin - 1', 'dataMax + 1']} tickLine={false} />
                <YAxis yAxisId="sleep" orientation="right" stroke="#444" fontSize={8} domain={[0, 100]} hide />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0A0A0A', borderColor: '#262626', color: '#fff', fontSize: '10px', fontFamily: 'monospace' }}
                  itemStyle={{ color: themeColor }}
                />
                <Area yAxisId="sleep" type="monotone" dataKey="sleep" stroke="transparent" fill={themeColor} fillOpacity={0.06} name="Sleep Quota %" />
                <Area yAxisId="weight" type="monotone" dataKey="weight" stroke={themeColor} strokeWidth={2} fill="transparent" name="Weight (kg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
