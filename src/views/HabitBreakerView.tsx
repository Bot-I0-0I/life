import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, BadHabit, HabitUrgeLog, addXp, logSystemEvent, seedDefaultHabitsIfEmpty } from '../db/db';
import { useStore } from '../store/useStore';
import { getRank, cn } from '../lib/utils';
import { 
  ShieldAlert, ShieldCheck, Flame, Zap, AlertTriangle, Plus, Clock, 
  DollarSign, RefreshCw, HeartPulse, Brain, Crosshair, Check, X, 
  Play, Pause, Award, Sparkles, BookOpen, ChevronRight, Activity, 
  Lock, Eye, Trash2, Edit3, MessageSquare, Compass, ShieldOff, Wind,
  Archive, RotateCcw, BarChart2, CheckCircle2, AlertOctagon,
  Thermometer, Droplets, Dumbbell, Copy, Share2, Target, ThumbsUp,
  TrendingUp, Layers, HelpCircle, PenTool, Filter, Search, Calendar,
  Footprints, CheckSquare, Phone
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  CartesianGrid, LineChart, Line, Cell, AreaChart, Area, Legend 
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

// Proven Cognitive Science Power Mantras for Urge Surfing
const POWER_MANTRAS = [
  "An urge is an ocean wave: it rises, peaks, and inevitably crashes into calm water. I surf the wave.",
  "Giving in yields 5 minutes of cheap pleasure; resisting yields months of supreme confidence and freedom.",
  "My prefrontal cortex is the executive master of this vessel. Dopamine spikes do not dictate my actions.",
  "Every time I say NO to a craving, I physically weaken that neural pathway and strengthen my self-mastery.",
  "Discipline is choosing between what you want right now and what you want most in life.",
  "A craving lasts an average of 7 to 10 minutes. My dignity and goals last a lifetime.",
  "I am not giving up anything; I am freeing myself from an artificial chemical leash.",
  "Urge surfing is not fighting—it is observing without reacting until the energy dissolves.",
  "Relapse resets the clock; restraint builds an unshakeable identity of absolute power.",
  "The pain of discipline weighs ounces; the pain of regret weighs tons."
];

// Biological Neuro-Recovery Milestones (Dopamine Baseline & Brain Plasticity Timeline)
const NEURO_STAGES = [
  {
    stage: 1,
    name: "Acute Spike & Dopamine Dip",
    dayRange: "Day 0 - 1",
    minDays: 0,
    maxDays: 1,
    desc: "Brain experiences physical craving spikes as dopamine baseline temporarily drops. High temptation window.",
    action: "Deploy physical cold-water shock, physiological sighing, and 10-minute urge surfing.",
    badgeColor: "border-red-600 text-red-400 bg-red-950/40"
  },
  {
    stage: 2,
    name: "Physical Detox Reset",
    dayRange: "Day 2 - 3",
    minDays: 2,
    maxDays: 3,
    desc: "Acute withdrawal symptoms subside. Adenosine & cortisol stress hormones begin stabilizing.",
    action: "Focus on sleep quality, hydration, and removing all physical environment triggers.",
    badgeColor: "border-amber-600 text-amber-400 bg-amber-950/40"
  },
  {
    stage: 3,
    name: "Dopamine Receptor Upregulation (+40%)",
    dayRange: "Day 4 - 7",
    minDays: 4,
    maxDays: 7,
    desc: "Dopamine D2 receptor sensitivity rises by up to 40%. Natural rewards (food, sunshine, fitness) feel richer.",
    action: "Engage replacement routines (exercise, cold showers, creative hobbies) to lock in natural dopamine.",
    badgeColor: "border-yellow-600 text-yellow-400 bg-yellow-950/40"
  },
  {
    stage: 4,
    name: "Neural Circuit Hardening",
    dayRange: "Day 8 - 21",
    minDays: 8,
    maxDays: 21,
    desc: "Old vice neural pathways begin shrinking from disuse. New healthy habit pathways undergo myelination.",
    action: "Maintain strict friction barriers and celebrate weekly milestones.",
    badgeColor: "border-cyan-600 text-cyan-400 bg-cyan-950/40"
  },
  {
    stage: 5,
    name: "Executive Prefrontal Restoration",
    dayRange: "Day 22 - 30",
    minDays: 22,
    maxDays: 30,
    desc: "Prefrontal cortex regains full top-down executive control over impulse centers. Focus & clarity surge.",
    action: "Channel restored willpower into high-level strategic projects and long-term goals.",
    badgeColor: "border-indigo-600 text-indigo-400 bg-indigo-950/40"
  },
  {
    stage: 6,
    name: "Synaptic Pruning & Vice Freedom",
    dayRange: "Day 31 - 90+",
    minDays: 31,
    maxDays: 9999,
    desc: "Complete synaptic pruning of old vice circuits. You have successfully rewired your neuro-plastic baseline!",
    action: "Protocol Mastered! Mentor others or maintain lifelong vigilance.",
    badgeColor: "border-emerald-600 text-emerald-400 bg-emerald-950/40"
  }
];

// Physical Intercept Techniques (Cold Shock & Autonomic Reset)
const COLD_TECHNIQUES = [
  {
    id: 'sigh',
    title: 'PHYSIOLOGICAL DOUBLE-SIGH',
    subtitle: 'Vagus Nerve Reset (Fast Heart-Rate Drop)',
    duration: 30,
    icon: Wind,
    steps: [
      'Take 2 sharp, consecutive inhales through your nose (Inhale... Inhale deeper!).',
      'Hold at the top for 1 second.',
      'Exhale slowly and completely through mouth with a quiet sighing sound.',
      'Repeat 3 to 5 times to immediately activate parasympathetic calm.'
    ],
    color: 'text-cyan-400 border-cyan-800 bg-cyan-950/40'
  },
  {
    id: 'cold_water',
    title: 'COLD WATER SHOCK PROTOCOL',
    subtitle: 'Mammalian Dive Reflex (Immediate Urge Neutralization)',
    duration: 30,
    icon: Droplets,
    steps: [
      'Splash ice-cold water directly onto your face, eyes, and neck for 20-30 seconds.',
      'Or place an ice cube in your mouth or apply an ice pack to your forehead.',
      'This activates the Mammalian Dive Reflex, dropping heart rate by 15-25 bpm instantly.',
      'Dopamine spike redirected into physical shock response.'
    ],
    color: 'text-indigo-400 border-indigo-800 bg-indigo-950/40'
  },
  {
    id: 'isometric',
    title: 'ISOMETRIC TENSION & RELEASE',
    subtitle: 'Motor Cortex Overdrive Intercept',
    duration: 30,
    icon: Dumbbell,
    steps: [
      'Clench both fists, squeeze quads, and contract core muscles at maximum 100% force.',
      'Hold this extreme tension for 10 seconds while breathing through nose.',
      'Release all muscle tension completely on a long exhale.',
      'Notice the wave of physical relaxation flushing out craving energy.'
    ],
    color: 'text-amber-400 border-amber-800 bg-amber-950/40'
  },
  {
    id: 'burst',
    title: '20-REP ADRENALINE BURST',
    subtitle: 'Cortisol & Excess Energy Burner',
    duration: 30,
    icon: Zap,
    steps: [
      'Drop and perform 20 explosive push-ups, squats, or jumping jacks right now.',
      'Force your body to expend accumulated nervous tension physically.',
      'Follow immediately with 500ml of cold water.',
      'Your brain replaces mental restlessness with physical muscle fatigue.'
    ],
    color: 'text-emerald-400 border-emerald-800 bg-emerald-950/40'
  }
];

// Proven Habit Breaker Presets for Fast Blueprinting
const HABIT_PRESETS = [
  {
    title: 'Late Night Doomscrolling & Screen Binging',
    category: 'digital' as const,
    severity: 'high' as const,
    cueTriggers: ['In bed alone past 11 PM', 'Brain fatigue / tiredness', 'Anxiety about tomorrow'],
    substituteBehavior: 'Place phone in kitchen/living room at 10 PM. Do 4-7-8 breathing or read 10 pages of a physical book.',
    frictionBarrier: 'Digital app timer lock + physical charging station outside bedroom',
    nonNegotiableContract: 'I solemnly vow to protect my dopamine, focus, and sleep quality by cutting off screens 1 hour before sleep.',
    financialCostPerDay: 0,
    timeCostMinutesPerDay: 90,
  },
  {
    title: 'Vaping / Smoking Addiction',
    category: 'substance' as const,
    severity: 'extreme' as const,
    cueTriggers: ['After meals', 'Work stress / deadlines', 'Social drinking / parties'],
    substituteBehavior: 'Inhale 3 deep breaths through a metal straw or chew mint gum. Do 15 explosive squats.',
    frictionBarrier: 'Throw away all devices/lighters. Inform close friends not to loan or sell vape/cigarettes.',
    nonNegotiableContract: 'My lungs and heart belong to a high-performance vessel. Poison has no entry.',
    financialCostPerDay: 10,
    timeCostMinutesPerDay: 45,
  },
  {
    title: 'Alcohol & Binge Drinking',
    category: 'substance' as const,
    severity: 'extreme' as const,
    cueTriggers: ['Friday evening stress', 'Social gatherings', 'Emotional overwhelm'],
    substituteBehavior: 'Order a zero-alcohol sparkling tonic with lime or do 20 minutes of intense cardio.',
    frictionBarrier: 'Remove all alcohol from residence. Avoid venues where drinking is the sole focus.',
    nonNegotiableContract: 'I choose clarity, emotional mastery, and physical strength over temporary numbness.',
    financialCostPerDay: 15,
    timeCostMinutesPerDay: 120,
  },
  {
    title: 'Unplanned Junk Food & Binge Eating',
    category: 'substance' as const,
    severity: 'moderate' as const,
    cueTriggers: ['Work stress at 3 PM', 'Boredom while watching TV', 'Low sugar energy dip'],
    substituteBehavior: 'Drink 500ml ice cold lemon water + eat 1 handful of almonds or whey protein shake.',
    frictionBarrier: 'Never purchase or store junk food at home. Delete food delivery apps.',
    nonNegotiableContract: 'Food is fuel for power, not an emotional tranquilizer.',
    financialCostPerDay: 8,
    timeCostMinutesPerDay: 30,
  },
  {
    title: 'Compulsive Gambling & High-Risk Betting',
    category: 'financial' as const,
    severity: 'extreme' as const,
    cueTriggers: ['Financial anxiety', 'Boredom', 'Chasing previous losses'],
    substituteBehavior: 'Open Treasury Ledger app and record total saved money or deposit $20 into high-yield savings.',
    frictionBarrier: 'Self-exclude from betting platforms. Enable bank gambling blocks on credit cards.',
    nonNegotiableContract: 'I build real wealth through discipline and tactical strategy, not predatory odds.',
    financialCostPerDay: 25,
    timeCostMinutesPerDay: 60,
  },
  {
    title: 'Pornography & Compulsive Sexual Binging',
    category: 'digital' as const,
    severity: 'extreme' as const,
    cueTriggers: ['Solitude late at night', 'Boredom / loneliness', 'High stress after conflict'],
    substituteBehavior: 'Do a cold shower immediately + 30 pushups + exit the private room.',
    frictionBarrier: 'Install DNS porn blocker (NextDNS/Cloudflare 1.1.1.3). Never bring laptop into bedroom.',
    nonNegotiableContract: 'I reclaim my sexual energy and neuro-plasticity for real life mastery.',
    financialCostPerDay: 0,
    timeCostMinutesPerDay: 60,
  }
];

// Actionable Distraction Tasks & Urge Intercept Techniques
const DEFAULT_DISTRACTION_TECHNIQUES = [
  {
    id: 'walk',
    title: 'Go for a 5-Minute Walk',
    category: 'physical',
    duration: '5 min',
    mechanism: 'Changes environmental context and stimulates endorphin release to interrupt dopamine fixation.',
    xpReward: 35,
    iconName: 'Footprints',
    steps: [
      'Stand up immediately and exit your current room/building',
      'Walk at a steady pace for at least 5 minutes',
      'Notice 3 distinct physical objects around you to ground your focus'
    ]
  },
  {
    id: 'water',
    title: 'Drink 500ml Cold Ice Water',
    category: 'sensory',
    duration: '1 min',
    mechanism: 'Cold liquid activates temperature receptors in throat and stomach, stimulating vagus nerve reset.',
    xpReward: 25,
    iconName: 'Droplets',
    steps: [
      'Fill a large glass with ice-cold water',
      'Drink at least half in slow, deliberate gulps',
      'Pause and notice the refreshing cooling sensation in your core'
    ]
  },
  {
    id: 'pushups',
    title: '20 Explosive Pushups / Squats',
    category: 'physical',
    duration: '2 min',
    mechanism: 'Forces nervous system from mental restlessness into muscle fatigue and adrenaline consumption.',
    xpReward: 40,
    iconName: 'Dumbbell',
    steps: [
      'Drop down immediately without debating or overthinking',
      'Complete 20 repetitions with strict form',
      'Feel muscle burn replacing the craving energy'
    ]
  },
  {
    id: 'breathing',
    title: '4-7-8 Deep Breathing Reset',
    category: 'mental',
    duration: '3 min',
    mechanism: 'Extended exhales engage parasympathetic nervous system, lowering heart rate and cortisol.',
    xpReward: 30,
    iconName: 'Wind',
    steps: [
      'Inhale quietly through nose for 4 seconds',
      'Hold breath for 7 seconds',
      'Exhale completely through mouth for 8 seconds',
      'Repeat 4 full cycles'
    ]
  },
  {
    id: 'cold_splash',
    title: 'Splash Ice-Cold Water on Face',
    category: 'sensory',
    duration: '1 min',
    mechanism: 'Triggers Mammalian Dive Reflex to instantly reduce heart rate and reset hyper-arousal.',
    xpReward: 30,
    iconName: 'Flame',
    steps: [
      'Turn tap to coldest setting',
      'Cupped hands full of cold water splashed 5-10 times on face',
      'Pat dry and take a slow deep breath'
    ]
  },
  {
    id: 'clean_space',
    title: '3-Minute Space Cleanup',
    category: 'environmental',
    duration: '3 min',
    mechanism: 'Provides immediate tangible control and visual order, redirecting seeking behavior.',
    xpReward: 30,
    iconName: 'Sparkles',
    steps: [
      'Pick up 5 items out of place on your desk or room',
      'Wipe down surface or dispose of trash',
      'Take 1 step back and appreciate the clear environment'
    ]
  },
  {
    id: 'gratitude',
    title: 'Write 3 Non-Negotiable Oath Reasons',
    category: 'mental',
    duration: '2 min',
    mechanism: 'Reactivates prefrontal cortex reasoning to override short-term limbic impulse.',
    xpReward: 35,
    iconName: 'CheckSquare',
    steps: [
      'Grab paper or phone notes app',
      'Write 3 core reasons why quitting this vice is non-negotiable for your future',
      'Read them out loud with conviction'
    ]
  },
  {
    id: 'call_friend',
    title: 'Call / Text Accountability Partner',
    category: 'social',
    duration: '5 min',
    mechanism: 'Social connection releases oxytocin and breaks isolation, neutralizing secret urge loops.',
    xpReward: 45,
    iconName: 'Phone',
    steps: [
      'Open messaging app or phone dialer',
      'Send text: "Fighting an urge right now, checking in!"',
      'Engage in a brief conversation or listen to an inspiring podcast'
    ]
  }
];

// Preset Contexts & Triggers for Fast Pattern Journaling
const COMMON_CONTEXTS = [
  'Home Alone / Bedroom',
  'At Work Desk / Deadline Stress',
  'Late Night Past 10 PM',
  'Boredom / Resting on Couch',
  'Social Event / Party',
  'Driving / Commute Traffic',
  'Post-Argument / Emotional Overwhelm',
  'Scrolling Social Media / Phone'
];

const COMMON_TRIGGERS = [
  'Boredom',
  'Stress / Deadline',
  'Fatigue / Lack of Sleep',
  'Solitude / Isolation',
  'Anxiety / Overwhelm',
  'Phone Notification',
  'Hunger / Sugar Craving',
  'Social Pressure'
];

export function HabitBreakerView() {
  const userStats = useLiveQuery(() => db.userStats.get(1));
  const badHabits = useLiveQuery(() => db.badHabits.toArray()) || [];
  const urgeLogs = useLiveQuery(() => db.habitUrgeLogs.toArray()) || [];

  const level = Math.floor((userStats?.xp || 0) / 1000) + 1;
  const { color: rankColor } = getRank(level);
  const themeColor = userStats?.selectedColor || rankColor;

  // Auto-seed default habits on initial load if database is empty
  useEffect(() => {
    seedDefaultHabitsIfEmpty();
  }, []);

  // Main Feature Tab Navigation
  const [mainNavTab, setMainNavTab] = useState<'protocols' | 'urge_journal' | 'neuro_recovery' | 'cold_shock' | 'urge_analytics' | 'vision_vault' | 'archived' | 'techniques'>('protocols');

  // Distraction Techniques State
  const [techniqueCategoryFilter, setTechniqueCategoryFilter] = useState<'all' | 'physical' | 'sensory' | 'mental' | 'environmental' | 'social'>('all');
  const [completedTechCount, setCompletedTechCount] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('habit_completed_tech_count') || '0', 10);
    } catch {
      return 0;
    }
  });
  const [customTechniques, setCustomTechniques] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('habit_custom_techniques');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isAddTechniqueModalOpen, setIsAddTechniqueModalOpen] = useState(false);
  const [newTechTitle, setNewTechTitle] = useState('');
  const [newTechCategory, setNewTechCategory] = useState<'physical' | 'sensory' | 'mental' | 'environmental' | 'social'>('physical');
  const [newTechDuration, setNewTechDuration] = useState('3 min');
  const [newTechMechanism, setNewTechMechanism] = useState('');
  const [newTechStep1, setNewTechStep1] = useState('');
  const [newTechStep2, setNewTechStep2] = useState('');

  // Urge Journal Form State
  const [journalHabitId, setJournalHabitId] = useState<number>(0);
  const [journalContext, setJournalContext] = useState<string>('Home Alone / Bedroom');
  const [journalCustomContext, setJournalCustomContext] = useState<string>('');
  const [journalIntensity, setJournalIntensity] = useState<number>(7);
  const [journalTriggers, setJournalTriggers] = useState<string[]>(['Boredom', 'Late Night']);
  const [journalNewTrigger, setJournalNewTrigger] = useState<string>('');
  const [journalActionTaken, setJournalActionTaken] = useState<'surfed_urge' | 'used_substitute' | 'relapsed' | 'emergency_sos'>('surfed_urge');
  const [journalNotes, setJournalNotes] = useState<string>('');

  // Journal Feed Filter State
  const [journalFilterHabitId, setJournalFilterHabitId] = useState<number | 'all'>('all');
  const [journalFilterSearch, setJournalFilterSearch] = useState<string>('');
  const [journalFilterMinIntensity, setJournalFilterMinIntensity] = useState<number>(1);

  // Active State Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<BadHabit | null>(null);
  const [deletingHabit, setDeletingHabit] = useState<BadHabit | null>(null);
  const [sosActiveHabit, setSosActiveHabit] = useState<BadHabit | null>(null);
  const [relapseHabit, setRelapseHabit] = useState<BadHabit | null>(null);
  const [quickLogHabit, setQuickLogHabit] = useState<BadHabit | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [shareOathHabit, setShareOathHabit] = useState<BadHabit | null>(null);

  // Cold Shock Intercept State
  const [activeColdTechId, setActiveColdTechId] = useState<string>('sigh');
  const [coldTimerLeft, setColdTimerLeft] = useState<number>(30);
  const [coldTimerRunning, setColdTimerRunning] = useState<boolean>(false);

  // Power Mantra Wheel State
  const [mantraIndex, setMantraIndex] = useState<number>(0);

  // Daily Restraint Victory State
  const [lastVictoryDate, setLastVictoryDate] = useState<string>(() => localStorage.getItem('lastHabitVictoryDate') || '');

  // Time Ticker State for Live Precision Clocks
  const [nowTimestamp, setNowTimestamp] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNowTimestamp(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Cold Shock Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (coldTimerRunning && coldTimerLeft > 0) {
      interval = setInterval(() => {
        setColdTimerLeft((prev) => prev - 1);
      }, 1000);
    } else if (coldTimerLeft === 0 && coldTimerRunning) {
      setColdTimerRunning(false);
      toast.success('COLD-SHOCK INTERCEPT COMPLETED! Vagus nerve reset achieved.');
    }
    return () => clearInterval(interval);
  }, [coldTimerRunning, coldTimerLeft]);

  // Form State for Adding / Editing Protocol
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<'substance' | 'digital' | 'financial' | 'behavioral' | 'mental' | 'other'>('digital');
  const [formSeverity, setFormSeverity] = useState<'extreme' | 'high' | 'moderate'>('high');
  const [formStartDate, setFormStartDate] = useState<string>('');
  const [formCueTriggers, setFormCueTriggers] = useState<string[]>(['Boredom', 'Stress']);
  const [newTriggerInput, setNewTriggerInput] = useState('');
  const [formSubstitute, setFormSubstitute] = useState('');
  const [formFriction, setFormFriction] = useState('');
  const [formContract, setFormContract] = useState('');
  const [formFinancialCost, setFormFinancialCost] = useState<number>(0);
  const [formTimeCost, setFormTimeCost] = useState<number>(30);
  const [formNotes, setFormNotes] = useState('');

  // Quick Urge Log Form State
  const [urgeIntensity, setUrgeIntensity] = useState<number>(7);
  const [urgeTrigger, setUrgeTrigger] = useState('');
  const [urgeAction, setUrgeAction] = useState<'surfed_urge' | 'used_substitute' | 'relapsed' | 'emergency_sos'>('surfed_urge');
  const [urgeNotes, setUrgeNotes] = useState('');

  // Relapse Post-Mortem Form State
  const [relapseTrigger, setRelapseTrigger] = useState('');
  const [relapseNewFriction, setRelapseNewFriction] = useState('');

  // SOS Urge Surfing State
  const [sosPhase, setSosPhase] = useState<'grounding' | 'surfing' | 'action' | 'complete'>('grounding');
  const [groundingStep, setGroundingStep] = useState(0);
  const groundingChecklist = [
    'Acknowledge the urge without judgment. It is just a neuro-chemical dopamine spike.',
    'Identify 5 physical objects you can see right now.',
    'Identify 4 textures or physical sensations you can feel.',
    'Identify 3 distinct sounds in your environment.',
    'Take 1 deep diaphragmatic breath in through your nose, out through your mouth.'
  ];
  const [surfSecondsLeft, setSurfSecondsLeft] = useState(600); // 10 minutes default
  const [surfTimerRunning, setSurfTimerRunning] = useState(false);
  const [breathState, setBreathState] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');

  // Urge Surfing Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (surfTimerRunning && surfSecondsLeft > 0) {
      interval = setInterval(() => {
        setSurfSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (surfSecondsLeft === 0 && surfTimerRunning) {
      setSurfTimerRunning(false);
      setSosPhase('action');
      toast.success('VICTORY! 10-Minute Urge Surfing Wave Completed! Dopamine spike neutralized!');
    }
    return () => clearInterval(interval);
  }, [surfTimerRunning, surfSecondsLeft]);

  // Breathing Cycle Animation Effect
  useEffect(() => {
    if (!surfTimerRunning) return;
    const cycle = setInterval(() => {
      setBreathState((prev) => {
        if (prev === 'Inhale') return 'Hold';
        if (prev === 'Hold') return 'Exhale';
        if (prev === 'Exhale') return 'Rest';
        return 'Inhale';
      });
    }, 4000);
    return () => clearInterval(cycle);
  }, [surfTimerRunning]);

  // Handle Preset Select
  const applyPreset = (preset: typeof HABIT_PRESETS[0]) => {
    setFormTitle(preset.title);
    setFormCategory(preset.category);
    setFormSeverity(preset.severity);
    setFormCueTriggers([...preset.cueTriggers]);
    setFormSubstitute(preset.substituteBehavior);
    setFormFriction(preset.frictionBarrier);
    setFormContract(preset.nonNegotiableContract);
    setFormFinancialCost(preset.financialCostPerDay);
    setFormTimeCost(preset.timeCostMinutesPerDay);
  };

  const openAddModal = (habitToEdit?: BadHabit) => {
    if (habitToEdit) {
      setEditingHabit(habitToEdit);
      setFormTitle(habitToEdit.title);
      setFormCategory(habitToEdit.category);
      setFormSeverity(habitToEdit.severity);
      setFormStartDate(habitToEdit.startDate ? new Date(habitToEdit.startDate).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16));
      setFormCueTriggers(habitToEdit.cueTriggers || []);
      setFormSubstitute(habitToEdit.substituteBehavior || '');
      setFormFriction(habitToEdit.frictionBarrier || '');
      setFormContract(habitToEdit.nonNegotiableContract || '');
      setFormFinancialCost(habitToEdit.financialCostPerDay || 0);
      setFormTimeCost(habitToEdit.timeCostMinutesPerDay || 0);
      setFormNotes(habitToEdit.notes || '');
    } else {
      setEditingHabit(null);
      setFormTitle('');
      setFormCategory('digital');
      setFormSeverity('high');
      setFormStartDate(new Date().toISOString().slice(0, 16));
      setFormCueTriggers(['Late Night', 'High Stress']);
      setFormSubstitute('');
      setFormFriction('');
      setFormContract('');
      setFormFinancialCost(0);
      setFormTimeCost(30);
      setFormNotes('');
    }
    setIsAddModalOpen(true);
  };

  const handleSaveHabit = async () => {
    if (!formTitle.trim()) {
      toast.error('Protocol title is required');
      return;
    }

    const startDateIso = formStartDate ? new Date(formStartDate).toISOString() : new Date().toISOString();

    try {
      if (editingHabit && editingHabit.id) {
        await db.badHabits.update(editingHabit.id, {
          title: formTitle,
          category: formCategory,
          severity: formSeverity,
          startDate: startDateIso,
          cueTriggers: formCueTriggers,
          substituteBehavior: formSubstitute,
          frictionBarrier: formFriction,
          nonNegotiableContract: formContract,
          financialCostPerDay: Number(formFinancialCost) || 0,
          timeCostMinutesPerDay: Number(formTimeCost) || 0,
          notes: formNotes
        });
        toast.success(`Protocol "${formTitle}" updated!`);
      } else {
        await db.badHabits.add({
          title: formTitle,
          category: formCategory,
          severity: formSeverity,
          startDate: startDateIso,
          cleanDays: 0,
          longestCleanDays: 0,
          cueTriggers: formCueTriggers,
          substituteBehavior: formSubstitute,
          frictionBarrier: formFriction,
          nonNegotiableContract: formContract,
          financialCostPerDay: Number(formFinancialCost) || 0,
          timeCostMinutesPerDay: Number(formTimeCost) || 0,
          relapsesCount: 0,
          notes: formNotes,
          active: true
        });
        await addXp(50, 'INT');
        logSystemEvent('QUEST', 'SUCCESS', `Created Habit Eradication Protocol: ${formTitle}`);
        toast.success(`Protocol "${formTitle}" activated! +50 XP awarded`);
      }
      setIsAddModalOpen(false);
    } catch (err: any) {
      console.error('Save habit failed:', err);
      toast.error('Failed to save habit protocol');
    }
  };

  // Custom Unblockable Delete Protocol Handler
  const confirmDeleteHabit = async () => {
    if (!deletingHabit || !deletingHabit.id) return;
    try {
      await db.badHabits.delete(deletingHabit.id);
      // Clean up urge logs associated with this habit
      await db.habitUrgeLogs.where('habitId').equals(deletingHabit.id).delete();
      toast.info(`Habit protocol "${deletingHabit.title}" permanently erased.`);
      logSystemEvent('QUEST', 'WARN', `Deleted habit protocol: ${deletingHabit.title}`);
      setDeletingHabit(null);
    } catch (err) {
      console.error('Delete habit failed:', err);
      toast.error('Failed to delete protocol');
    }
  };

  // Toggle Archive / Mastered State
  const handleToggleArchive = async (habit: BadHabit) => {
    if (!habit.id) return;
    try {
      const nextActiveState = !habit.active;
      await db.badHabits.update(habit.id, { active: nextActiveState });
      toast.success(
        nextActiveState 
          ? `Protocol "${habit.title}" reactivated!` 
          : `Protocol "${habit.title}" archived as Mastered!`
      );
    } catch (err) {
      console.error('Archive habit failed:', err);
    }
  };

  // Launch Emergency SOS Urge Surfing
  const launchSOS = (habit: BadHabit) => {
    setSosActiveHabit(habit);
    setSosPhase('grounding');
    setGroundingStep(0);
    setSurfSecondsLeft(600);
    setSurfTimerRunning(false);
  };

  // Complete Urge Surfing SOS
  const completeSOS = async (outcome: 'surfed_urge' | 'used_substitute') => {
    if (!sosActiveHabit || !sosActiveHabit.id) return;
    
    await db.habitUrgeLogs.add({
      habitId: sosActiveHabit.id,
      timestamp: new Date().toISOString(),
      intensity: 8,
      trigger: sosActiveHabit.cueTriggers?.[0] || 'Urge Spike',
      context: 'SOS Emergency Intercept',
      actionTaken: outcome,
      notes: `Neutralized urge via SOS Urge Surfing protocol`
    });

    await addXp(100, 'SEN');
    logSystemEvent('QUEST', 'SUCCESS', `Successfully surfed urge for ${sosActiveHabit.title}`);
    toast.success(`VICTORY! Urge neutralized for "${sosActiveHabit.title}"! +100 XP & SEN Boost!`, {
      style: { background: '#022c22', border: '1px solid #10b981', color: '#6ee7b7' }
    });

    setSosActiveHabit(null);
  };

  // Save Quick Urge Log
  const handleSaveUrgeLog = async () => {
    if (!quickLogHabit || !quickLogHabit.id) return;

    await db.habitUrgeLogs.add({
      habitId: quickLogHabit.id,
      timestamp: new Date().toISOString(),
      intensity: urgeIntensity,
      trigger: urgeTrigger || 'General Craving',
      context: journalContext || 'Home Alone / Bedroom',
      actionTaken: urgeAction,
      notes: urgeNotes
    });

    if (urgeAction === 'relapsed') {
      // Trigger relapse protocol
      setRelapseHabit(quickLogHabit);
      setQuickLogHabit(null);
      setUrgeNotes('');
      return;
    }

    await addXp(50, 'INT');
    toast.success(`Urge log saved (+50 XP)! Action: ${urgeAction.replace('_', ' ').toUpperCase()}`);
    setQuickLogHabit(null);
    setUrgeTrigger('');
    setUrgeNotes('');
  };

  // Delete Individual Urge Log Entry
  const handleDeleteUrgeLog = async (logId: number) => {
    try {
      await db.habitUrgeLogs.delete(logId);
      toast.info('Urge log removed.');
    } catch (err) {
      toast.error('Failed to delete urge log.');
    }
  };

  // Handle Relapse Post-Mortem Reset
  const handleConfirmRelapse = async () => {
    if (!relapseHabit || !relapseHabit.id) return;

    const currentMetrics = calculateHabitMetrics(relapseHabit);
    const updatedLongest = Math.max(relapseHabit.longestCleanDays || 0, currentMetrics.days);

    const newFrictionCombined = relapseNewFriction 
      ? `${relapseHabit.frictionBarrier || ''} | Updated: ${relapseNewFriction}`
      : relapseHabit.frictionBarrier;

    await db.badHabits.update(relapseHabit.id, {
      startDate: new Date().toISOString(),
      cleanDays: 0,
      longestCleanDays: updatedLongest,
      relapsesCount: (relapseHabit.relapsesCount || 0) + 1,
      frictionBarrier: newFrictionCombined,
      lastRelapseDate: new Date().toISOString()
    });

    await db.habitUrgeLogs.add({
      habitId: relapseHabit.id,
      timestamp: new Date().toISOString(),
      intensity: 10,
      trigger: relapseTrigger || 'Relapse Event',
      actionTaken: 'relapsed',
      notes: `Relapse Post-Mortem: ${relapseTrigger}. Updated friction: ${relapseNewFriction}`
    });

    logSystemEvent('QUEST', 'WARN', `Relapse logged for ${relapseHabit.title}. Streak reset to Day 0.`);
    toast.info(`Streak reset for "${relapseHabit.title}". Relapse is a lesson, not a defeat. New friction protocol deployed!`);
    
    setRelapseHabit(null);
    setRelapseTrigger('');
    setRelapseNewFriction('');
  };

  // Helper calculation for clean duration text & savings
  const calculateHabitMetrics = (h: BadHabit) => {
    const startMs = new Date(h.startDate).getTime();
    const diffMs = Math.max(0, nowTimestamp - startMs);
    const totalDays = diffMs / (1000 * 60 * 60 * 24);
    
    const days = Math.floor(totalDays);
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

    const moneySaved = Math.round(totalDays * (h.financialCostPerDay || 0));
    const hoursSaved = Math.round((totalDays * (h.timeCostMinutesPerDay || 0)) / 60);

    return { days, hours, minutes, seconds, totalDays, moneySaved, hoursSaved };
  };

  // Sync cleanDays and longestCleanDays in database safely via effect
  useEffect(() => {
    if (!badHabits || badHabits.length === 0) return;
    badHabits.forEach((h) => {
      if (!h.id) return;
      const startMs = new Date(h.startDate).getTime();
      const diffMs = Math.max(0, nowTimestamp - startMs);
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      if (days > (h.longestCleanDays || 0) || days !== h.cleanDays) {
        db.badHabits.update(h.id, { cleanDays: days, longestCleanDays: Math.max(days, h.longestCleanDays || 0) });
      }
    });
  }, [badHabits, nowTimestamp]);

  // Aggregated Totals
  const activeHabitsList = badHabits.filter(h => h.active);
  const archivedHabitsList = badHabits.filter(h => !h.active);
  const currentList = mainNavTab === 'archived' ? archivedHabitsList : activeHabitsList;

  const totalMoneySaved = activeHabitsList.reduce((acc, h) => acc + calculateHabitMetrics(h).moneySaved, 0);
  const totalHoursSaved = activeHabitsList.reduce((acc, h) => acc + calculateHabitMetrics(h).hoursSaved, 0);
  const totalCleanDaysSum = activeHabitsList.reduce((acc, h) => acc + calculateHabitMetrics(h).days, 0);

  // Urge Analytics Insights
  const totalUrgesLogged = urgeLogs.length;
  const resistedUrges = urgeLogs.filter(l => l.actionTaken === 'surfed_urge' || l.actionTaken === 'used_substitute' || l.actionTaken === 'emergency_sos').length;
  const successRate = totalUrgesLogged > 0 ? Math.round((resistedUrges / totalUrgesLogged) * 100) : 100;

  // Time-of-day urge heatmap calculation
  const timeSlotCounts = { morning: 0, afternoon: 0, evening: 0, lateNight: 0 };
  let peakTimeSlot = 'Late Night';
  let maxTimeCount = 0;

  urgeLogs.forEach((log) => {
    const hour = new Date(log.timestamp).getHours();
    if (hour >= 6 && hour < 12) timeSlotCounts.morning++;
    else if (hour >= 12 && hour < 18) timeSlotCounts.afternoon++;
    else if (hour >= 18 && hour < 22) timeSlotCounts.evening++;
    else timeSlotCounts.lateNight++;
  });

  if (timeSlotCounts.morning > maxTimeCount) { maxTimeCount = timeSlotCounts.morning; peakTimeSlot = 'Morning (6 AM - 12 PM)'; }
  if (timeSlotCounts.afternoon > maxTimeCount) { maxTimeCount = timeSlotCounts.afternoon; peakTimeSlot = 'Afternoon (12 PM - 6 PM)'; }
  if (timeSlotCounts.evening > maxTimeCount) { maxTimeCount = timeSlotCounts.evening; peakTimeSlot = 'Evening (6 PM - 10 PM)'; }
  if (timeSlotCounts.lateNight > maxTimeCount) { maxTimeCount = timeSlotCounts.lateNight; peakTimeSlot = 'Late Night (10 PM - 6 AM)'; }

  // --- RECHARTS & PATTERN FINDER DATA PROCESSING ---

  // 1. Recharts 24-Hour Binned Time-of-Day Data (12 Bins of 2 Hours Each)
  const timeOfDayBins = [
    { slot: '12AM-2AM', label: '12 AM - 2 AM', startHour: 0, endHour: 2, urges: 0, resisted: 0, relapsed: 0, totalIntensity: 0 },
    { slot: '2AM-4AM', label: '2 AM - 4 AM', startHour: 2, endHour: 4, urges: 0, resisted: 0, relapsed: 0, totalIntensity: 0 },
    { slot: '4AM-6AM', label: '4 AM - 6 AM', startHour: 4, endHour: 6, urges: 0, resisted: 0, relapsed: 0, totalIntensity: 0 },
    { slot: '6AM-8AM', label: '6 AM - 8 AM', startHour: 6, endHour: 8, urges: 0, resisted: 0, relapsed: 0, totalIntensity: 0 },
    { slot: '8AM-10AM', label: '8 AM - 10 AM', startHour: 8, endHour: 10, urges: 0, resisted: 0, relapsed: 0, totalIntensity: 0 },
    { slot: '10AM-12PM', label: '10 AM - 12 PM', startHour: 10, endHour: 12, urges: 0, resisted: 0, relapsed: 0, totalIntensity: 0 },
    { slot: '12PM-2PM', label: '12 PM - 2 PM', startHour: 12, endHour: 14, urges: 0, resisted: 0, relapsed: 0, totalIntensity: 0 },
    { slot: '2PM-4PM', label: '2 PM - 4 PM', startHour: 14, endHour: 16, urges: 0, resisted: 0, relapsed: 0, totalIntensity: 0 },
    { slot: '4PM-6PM', label: '4 PM - 6 PM', startHour: 16, endHour: 18, urges: 0, resisted: 0, relapsed: 0, totalIntensity: 0 },
    { slot: '6PM-8PM', label: '6 PM - 8 PM', startHour: 18, endHour: 20, urges: 0, resisted: 0, relapsed: 0, totalIntensity: 0 },
    { slot: '8PM-10PM', label: '8 PM - 10 PM', startHour: 20, endHour: 22, urges: 0, resisted: 0, relapsed: 0, totalIntensity: 0 },
    { slot: '10PM-12AM', label: '10 PM - 12 AM', startHour: 22, endHour: 24, urges: 0, resisted: 0, relapsed: 0, totalIntensity: 0 },
  ];

  urgeLogs.forEach((log) => {
    const logDate = new Date(log.timestamp);
    const hour = logDate.getHours();
    const bin = timeOfDayBins.find(b => hour >= b.startHour && hour < b.endHour);
    if (bin) {
      bin.urges += 1;
      bin.totalIntensity += log.intensity || 5;
      if (log.actionTaken === 'relapsed') bin.relapsed += 1;
      else bin.resisted += 1;
    }
  });

  const timeOfDayChartData = timeOfDayBins.map(b => ({
    ...b,
    avgIntensity: b.urges > 0 ? parseFloat((b.totalIntensity / b.urges).toFixed(1)) : 0
  }));

  // 2. Recharts 14-Day Daily Urge Volume & Intensity Trend Line
  const dailyTrendMap: Record<string, { date: string; displayDate: string; urges: number; totalIntensity: number; resisted: number; relapsed: number }> = {};
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateKey = d.toISOString().slice(0, 10);
    const displayDate = `${d.getMonth() + 1}/${d.getDate()}`;
    dailyTrendMap[dateKey] = {
      date: dateKey,
      displayDate,
      urges: 0,
      totalIntensity: 0,
      resisted: 0,
      relapsed: 0
    };
  }

  urgeLogs.forEach((log) => {
    const dateKey = new Date(log.timestamp).toISOString().slice(0, 10);
    if (dailyTrendMap[dateKey]) {
      dailyTrendMap[dateKey].urges += 1;
      dailyTrendMap[dateKey].totalIntensity += log.intensity || 5;
      if (log.actionTaken === 'relapsed') dailyTrendMap[dateKey].relapsed += 1;
      else dailyTrendMap[dateKey].resisted += 1;
    }
  });

  const dailyTrendChartData = Object.values(dailyTrendMap).map(item => ({
    ...item,
    avgIntensity: item.urges > 0 ? parseFloat((item.totalIntensity / item.urges).toFixed(1)) : 0
  }));

  // 3. Top Context Environments Breakdown Data
  const contextCountsMap: Record<string, { contextName: string; count: number; totalIntensity: number }> = {};
  urgeLogs.forEach(log => {
    const ctx = log.context || log.trigger || 'General Craving';
    if (!contextCountsMap[ctx]) {
      contextCountsMap[ctx] = { contextName: ctx, count: 0, totalIntensity: 0 };
    }
    contextCountsMap[ctx].count += 1;
    contextCountsMap[ctx].totalIntensity += log.intensity || 5;
  });

  const topContextChartData = Object.values(contextCountsMap)
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)
    .map(c => ({
      ...c,
      avgIntensity: parseFloat((c.totalIntensity / c.count).toFixed(1))
    }));

  // Pattern Insights Generator
  const dominantContext = topContextChartData[0]?.contextName || 'Home Alone / Bedroom';
  const peakTimeSlotObj = [...timeOfDayChartData].sort((a, b) => b.urges - a.urges)[0];
  const peakSlotLabel = peakTimeSlotObj && peakTimeSlotObj.urges > 0 ? peakTimeSlotObj.label : '10 PM - 12 AM';

  // Urge Journal Save Handler
  const executeDistractionTechnique = async (tech: { title: string; category: string; xpReward: number }) => {
    await addXp(tech.xpReward, 'SEN');
    const newCount = completedTechCount + 1;
    setCompletedTechCount(newCount);
    localStorage.setItem('habit_completed_tech_count', newCount.toString());

    const primaryHabit = activeHabitsList[0];
    await db.habitUrgeLogs.add({
      habitId: primaryHabit?.id || 0,
      timestamp: new Date().toISOString(),
      intensity: 4,
      trigger: `Distraction Task: ${tech.title}`,
      actionTaken: 'used_substitute',
      notes: `Successfully fought urge using technique: ${tech.title} (+${tech.xpReward} XP)`
    });

    await logSystemEvent('SYSTEM', 'SUCCESS', `Completed distraction task: ${tech.title}`);
    toast.success(`URGE INTERCEPTED! Completed "${tech.title}" (+${tech.xpReward} XP & SEN Boost!)`, {
      style: { background: '#022c22', border: '1px solid #10b981', color: '#6ee7b7' }
    });
  };

  const handleAddCustomTechnique = () => {
    if (!newTechTitle.trim()) {
      toast.error('Please enter a technique title');
      return;
    }
    const newTech = {
      id: `custom_${Date.now()}`,
      title: newTechTitle.trim(),
      category: newTechCategory,
      duration: newTechDuration || '3 min',
      mechanism: newTechMechanism.trim() || 'Custom user-defined distraction routine.',
      xpReward: 30,
      iconName: 'Sparkles',
      steps: [
        newTechStep1.trim() || 'Execute task with immediate focus',
        newTechStep2.trim() || 'Take a deep breath and acknowledge victory'
      ].filter(Boolean)
    };
    const updated = [newTech, ...customTechniques];
    setCustomTechniques(updated);
    localStorage.setItem('habit_custom_techniques', JSON.stringify(updated));
    setIsAddTechniqueModalOpen(false);
    setNewTechTitle('');
    setNewTechMechanism('');
    setNewTechStep1('');
    setNewTechStep2('');
    toast.success('Custom distraction technique saved!');
  };

  const handleSaveJournalEntry = async () => {
    const targetHabitId = journalHabitId || (activeHabitsList[0]?.id || badHabits[0]?.id || 0);
    if (!targetHabitId) {
      toast.error('Please create or activate a habit protocol first.');
      return;
    }

    const finalContext = journalCustomContext.trim() ? journalCustomContext.trim() : journalContext;
    const finalTriggerStr = journalTriggers.length > 0 ? journalTriggers.join(', ') : 'General Craving';

    try {
      await db.habitUrgeLogs.add({
        habitId: targetHabitId,
        timestamp: new Date().toISOString(),
        intensity: journalIntensity,
        trigger: finalTriggerStr,
        context: finalContext,
        actionTaken: journalActionTaken,
        notes: journalNotes
      });

      if (journalActionTaken === 'relapsed') {
        const h = badHabits.find(b => b.id === targetHabitId);
        if (h) setRelapseHabit(h);
        toast.error('Relapse logged. Conducting post-mortem analysis to fortify your protocol.');
      } else {
        await addXp(60, 'INT');
        logSystemEvent('QUEST', 'SUCCESS', `Logged Urge Journal entry for habit #${targetHabitId}`);
        toast.success(`URGE JOURNAL ENTRY LOGGED! +60 XP & INT Boost! Action: ${journalActionTaken.replace('_', ' ').toUpperCase()}`, {
          style: { background: '#022c22', border: '1px solid #10b981', color: '#6ee7b7' }
        });
      }

      setJournalNotes('');
      setJournalCustomContext('');
    } catch (err) {
      console.error('Failed to log urge journal:', err);
      toast.error('Failed to save urge journal entry.');
    }
  };

  // Filtered Journal Logs Feed
  const filteredJournalLogs = urgeLogs.filter((log) => {
    if (journalFilterHabitId !== 'all' && log.habitId !== journalFilterHabitId) return false;
    if (log.intensity < journalFilterMinIntensity) return false;
    if (journalFilterSearch.trim()) {
      const q = journalFilterSearch.toLowerCase();
      const h = badHabits.find(b => b.id === log.habitId);
      const matchTitle = h?.title.toLowerCase().includes(q) || false;
      const matchTrigger = log.trigger?.toLowerCase().includes(q) || false;
      const matchContext = log.context?.toLowerCase().includes(q) || false;
      const matchNotes = log.notes?.toLowerCase().includes(q) || false;
      if (!matchTitle && !matchTrigger && !matchContext && !matchNotes) return false;
    }
    return true;
  }).reverse();

  // Daily Restraint Check-In Handler
  const handleClaimDailyVictory = async () => {
    const todayStr = new Date().toISOString().slice(0, 10);
    if (lastVictoryDate === todayStr) {
      toast.info('Daily Restraint Victory already claimed today! Return tomorrow to extend your streak.');
      return;
    }

    setLastVictoryDate(todayStr);
    localStorage.setItem('lastHabitVictoryDate', todayStr);

    await addXp(75, 'WIS');
    logSystemEvent('QUEST', 'SUCCESS', 'Claimed Daily Habit Restraint Victory');
    toast.success('DAILY RESTRAINT VICTORY CLAIMED! +75 XP & WISDOM BOOST!', {
      style: { background: '#022c22', border: '1px solid #10b981', color: '#6ee7b7' }
    });
  };

  const isTodayVictoryClaimed = lastVictoryDate === new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-6 pb-24 animate-fadeIn">
      
      {/* HERO / AGGREGATED METRICS & EMERGENCY SOS BANNER */}
      <div className="relative bg-[#0D0D0D] border-2 border-[#262626] rounded-xl p-5 md:p-6 overflow-hidden shadow-2xl">
        <div 
          className="absolute top-0 right-0 w-96 h-96 bg-radial from-red-600/10 via-transparent to-transparent pointer-events-none"
        />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-red-950 text-red-400 border border-red-800 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" /> HABIT ERADICATION & RESTRAINT
              </span>
              <span className="text-[10px] font-mono text-[#888]">CBT & DR. MARLATT NEURO-RESET</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-mono font-black text-white uppercase tracking-wider flex items-center gap-2">
              RECLAIM YOUR DOPA-NEURAL FREEDOM
            </h1>
            <p className="text-xs font-mono text-[#A3A3A3] max-w-2xl mt-1">
              Deconstruct vice loops, amplify friction barriers, surf acute cravings, and track your total reclaimed financial & temporal capital.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {/* EMERGENCY SOS BUTTON */}
            {activeHabitsList.length > 0 && (
              <button
                onClick={() => launchSOS(activeHabitsList[0])}
                className="flex-1 lg:flex-initial px-5 py-3.5 bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-black uppercase tracking-widest rounded-lg shadow-[0_0_25px_rgba(239,68,68,0.4)] transition-all flex items-center justify-center gap-2 group animate-pulse"
              >
                <HeartPulse className="w-5 h-5 text-white group-hover:scale-125 transition-transform" />
                <span>URGE SOS / PANIC INTERCEPT</span>
              </button>
            )}

            <button
              onClick={() => openAddModal()}
              className="px-4 py-3.5 bg-[#181818] hover:bg-[#222] border border-[#333] hover:border-cyan-500/50 text-white font-mono text-xs font-bold uppercase rounded-lg transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4 text-cyan-400" />
              <span>NEW PROTOCOL</span>
            </button>
          </div>
        </div>

        {/* METRICS STRIP */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-5 border-t border-[#222]">
          <div className="bg-[#121212] border border-[#222] p-3 rounded-lg">
            <span className="text-[10px] font-mono text-[#888] uppercase block">ACTIVE PROTOCOLS</span>
            <span className="text-xl font-mono font-bold text-white flex items-center gap-1.5 mt-0.5">
              <ShieldCheck className="w-5 h-5 text-cyan-400" /> {activeHabitsList.length}
            </span>
          </div>

          <div className="bg-[#121212] border border-[#222] p-3 rounded-lg">
            <span className="text-[10px] font-mono text-[#888] uppercase block">CUMULATIVE CLEAN DAYS</span>
            <span className="text-xl font-mono font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
              <Flame className="w-5 h-5 text-emerald-400" /> {totalCleanDaysSum} DAYS
            </span>
          </div>

          <div className="bg-[#121212] border border-[#222] p-3 rounded-lg">
            <span className="text-[10px] font-mono text-[#888] uppercase block">MONEY SAVED</span>
            <span className="text-xl font-mono font-bold text-amber-400 flex items-center gap-1.5 mt-0.5">
              <DollarSign className="w-5 h-5 text-amber-400" /> ${totalMoneySaved}
            </span>
          </div>

          <div className="bg-[#121212] border border-[#222] p-3 rounded-lg">
            <span className="text-[10px] font-mono text-[#888] uppercase block">TIME RECLAIMED</span>
            <span className="text-xl font-mono font-bold text-indigo-400 flex items-center gap-1.5 mt-0.5">
              <Clock className="w-5 h-5 text-indigo-400" /> {totalHoursSaved} HRS
            </span>
          </div>

          <div className="bg-[#121212] border border-[#222] p-3 rounded-lg col-span-2 sm:col-span-1">
            <span className="text-[10px] font-mono text-[#888] uppercase block">URGE SUCCESS RATE</span>
            <span className="text-xl font-mono font-bold text-cyan-400 flex items-center gap-1.5 mt-0.5">
              <Activity className="w-5 h-5 text-cyan-400" /> {successRate}%
            </span>
          </div>
        </div>
      </div>

      {/* DAILY RESTRAINT VICTORY CHECK-IN BANNER */}
      <div className="bg-[#111] border border-emerald-900/40 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-950/80 rounded-xl border border-emerald-800 text-emerald-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                DAILY RESTRAINT VICTORY CHECK-IN
              </span>
              {isTodayVictoryClaimed && (
                <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                  CLAIMED TODAY
                </span>
              )}
            </div>
            <p className="text-xs font-mono text-[#888] mt-0.5">
              Lock in your restraint streak for today to claim +75 XP and reinforce executive prefrontal control.
            </p>
          </div>
        </div>

        <button
          onClick={handleClaimDailyVictory}
          disabled={isTodayVictoryClaimed}
          className={cn(
            "w-full sm:w-auto px-5 py-3 rounded-lg font-mono text-xs font-bold uppercase transition-all flex items-center justify-center gap-2",
            isTodayVictoryClaimed
              ? "bg-[#1C1C1C] text-[#666] border border-[#333] cursor-not-allowed"
              : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30"
          )}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{isTodayVictoryClaimed ? 'VICTORY SECURED (+75 XP)' : 'CLAIM TODAY\'S VICTORY (+75 XP)'}</span>
        </button>
      </div>

      {/* QUICK PRESETS BANNER IF FEW HABITS */}
      {badHabits.length <= 1 && (
        <div className="bg-[#111] border border-[#262626] rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                RAPID PROTOCOL TEMPLATES (ONE-CLICK DEPLOYMENT)
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#777]">SELECT ANY PRESET TO INSTANTLY LOAD BLUEPRINT</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {HABIT_PRESETS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  applyPreset(p);
                  setIsAddModalOpen(true);
                }}
                className="bg-[#181818] hover:bg-[#222] border border-[#333] hover:border-cyan-500/50 p-2.5 rounded-lg text-left transition-all group"
              >
                <div className="text-[9px] font-mono font-bold text-cyan-400 uppercase mb-1">{p.category}</div>
                <div className="text-xs font-mono font-bold text-white group-hover:text-cyan-300 line-clamp-2 leading-tight">
                  {p.title}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* FEATURE SUB-NAV TAB BAR */}
      <div className="flex items-center justify-between border-b border-[#262626] pb-2 overflow-x-auto gap-2 scrollbar-none">
        <div className="flex items-center gap-2 font-mono text-xs font-bold min-w-max">
          <button
            onClick={() => setMainNavTab('protocols')}
            className={cn(
              "px-3.5 py-2 rounded-lg border transition-all flex items-center gap-1.5",
              mainNavTab === 'protocols'
                ? "bg-cyan-950/80 text-cyan-400 border-cyan-800"
                : "bg-[#141414] text-[#888] border-[#262626] hover:text-white"
            )}
          >
            <ShieldCheck className="w-4 h-4" /> ACTIVE PROTOCOLS ({activeHabitsList.length})
          </button>

          <button
            onClick={() => setMainNavTab('urge_journal')}
            className={cn(
              "px-3.5 py-2 rounded-lg border transition-all flex items-center gap-1.5",
              mainNavTab === 'urge_journal'
                ? "bg-cyan-950/80 text-cyan-400 border-cyan-800"
                : "bg-[#141414] text-[#888] border-[#262626] hover:text-white"
            )}
          >
            <PenTool className="w-4 h-4 text-cyan-400" /> URGE JOURNAL & PATTERNS ({urgeLogs.length})
          </button>

          <button
            onClick={() => setMainNavTab('neuro_recovery')}
            className={cn(
              "px-3.5 py-2 rounded-lg border transition-all flex items-center gap-1.5",
              mainNavTab === 'neuro_recovery'
                ? "bg-indigo-950/80 text-indigo-400 border-indigo-800"
                : "bg-[#141414] text-[#888] border-[#262626] hover:text-white"
            )}
          >
            <Brain className="w-4 h-4" /> NEURO-RECOVERY MILESTONES
          </button>

          <button
            onClick={() => setMainNavTab('cold_shock')}
            className={cn(
              "px-3.5 py-2 rounded-lg border transition-all flex items-center gap-1.5",
              mainNavTab === 'cold_shock'
                ? "bg-amber-950/80 text-amber-400 border-amber-800"
                : "bg-[#141414] text-[#888] border-[#262626] hover:text-white"
            )}
          >
            <Thermometer className="w-4 h-4" /> COLD-SHOCK INTERCEPT
          </button>

          <button
            onClick={() => setMainNavTab('techniques')}
            className={cn(
              "px-3.5 py-2 rounded-lg border transition-all flex items-center gap-1.5",
              mainNavTab === 'techniques'
                ? "bg-teal-950/80 text-teal-400 border-teal-800"
                : "bg-[#141414] text-[#888] border-[#262626] hover:text-white"
            )}
          >
            <Zap className="w-4 h-4 text-teal-400" /> TECHNIQUES & DISTRACTIONS
          </button>

          <button
            onClick={() => setMainNavTab('urge_analytics')}
            className={cn(
              "px-3.5 py-2 rounded-lg border transition-all flex items-center gap-1.5",
              mainNavTab === 'urge_analytics'
                ? "bg-emerald-950/80 text-emerald-400 border-emerald-800"
                : "bg-[#141414] text-[#888] border-[#262626] hover:text-white"
            )}
          >
            <BarChart2 className="w-4 h-4" /> URGE HEATMAP & RADAR
          </button>

          <button
            onClick={() => setMainNavTab('vision_vault')}
            className={cn(
              "px-3.5 py-2 rounded-lg border transition-all flex items-center gap-1.5",
              mainNavTab === 'vision_vault'
                ? "bg-yellow-950/80 text-yellow-400 border-yellow-800"
                : "bg-[#141414] text-[#888] border-[#262626] hover:text-white"
            )}
          >
            <BookOpen className="w-4 h-4" /> WHY-I-QUIT VAULT & OATHS
          </button>

          <button
            onClick={() => setMainNavTab('archived')}
            className={cn(
              "px-3.5 py-2 rounded-lg border transition-all flex items-center gap-1.5",
              mainNavTab === 'archived'
                ? "bg-purple-950/80 text-purple-400 border-purple-800"
                : "bg-[#141414] text-[#888] border-[#262626] hover:text-white"
            )}
          >
            <Archive className="w-4 h-4" /> MASTERED ({archivedHabitsList.length})
          </button>
        </div>

        {urgeLogs.length > 0 && (
          <button
            onClick={() => setShowHistoryModal(true)}
            className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1 flex-shrink-0"
          >
            <Activity className="w-3.5 h-3.5" /> URGE LOGS ({urgeLogs.length})
          </button>
        )}
      </div>

      {/* TAB 1: ACTIVE PROTOCOLS & MASTERED ARCHIVE LIST */}
      {(mainNavTab === 'protocols' || mainNavTab === 'archived') && (
        <div className="space-y-4">
          {currentList.length === 0 ? (
            <div className="bg-[#121212] border-2 border-dashed border-[#262626] rounded-xl p-10 text-center space-y-4">
              <ShieldOff className="w-12 h-12 text-[#555] mx-auto" />
              <div>
                <h3 className="text-lg font-mono font-bold text-white uppercase">
                  {mainNavTab === 'protocols' ? 'NO ACTIVE PROTOCOLS DEPLOYED' : 'NO ARCHIVED / MASTERED PROTOCOLS'}
                </h3>
                <p className="text-xs font-mono text-[#888] max-w-md mx-auto mt-1">
                  {mainNavTab === 'protocols'
                    ? 'Take command of your worst habits. Click below to initialize a scientifically engineered habit destruction protocol.'
                    : 'Mastered habits that you have successfully neutralized will appear here.'}
                </p>
              </div>
              {mainNavTab === 'protocols' && (
                <button
                  onClick={() => openAddModal()}
                  className="px-6 py-3 bg-cyan-500 text-black font-mono text-xs font-bold uppercase rounded-lg hover:bg-cyan-400 transition-all shadow-lg"
                >
                  DEPLOY FIRST PROTOCOL
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {currentList.map((habit) => {
                const metrics = calculateHabitMetrics(habit);
                
                const severityColor = 
                  habit.severity === 'extreme' ? 'text-red-400 bg-red-950/60 border-red-800' :
                  habit.severity === 'high' ? 'text-amber-400 bg-amber-950/60 border-amber-800' :
                  'text-yellow-400 bg-yellow-950/60 border-yellow-800';

                return (
                  <div 
                    key={habit.id}
                    className="bg-[#111] border-2 border-[#262626] hover:border-[#333] rounded-xl p-5 transition-all relative overflow-hidden space-y-4 shadow-lg"
                  >
                    {/* Top Bar: Title, Category, Severity & Controls */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222] pb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className={cn("text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase", severityColor)}>
                            {habit.severity} SEVERITY
                          </span>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#1C1C1C] text-[#AAA] border border-[#333] uppercase">
                            {habit.category}
                          </span>
                          {habit.relapsesCount > 0 && (
                            <span className="text-[10px] font-mono text-red-400 bg-red-950/40 px-2 py-0.5 rounded border border-red-900/50">
                              {habit.relapsesCount} RELAPSE{habit.relapsesCount > 1 ? 'S' : ''} LOGGED
                            </span>
                          )}
                          {!habit.active && (
                            <span className="text-[10px] font-mono text-purple-400 bg-purple-950/50 px-2 py-0.5 rounded border border-purple-800">
                              MASTERED / ARCHIVED
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg md:text-xl font-mono font-bold text-white uppercase tracking-wider">
                          {habit.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
                        {habit.active && (
                          <button
                            onClick={() => launchSOS(habit)}
                            className="px-3.5 py-2 bg-red-950/80 hover:bg-red-900 border border-red-600 text-red-300 font-mono text-xs font-bold uppercase rounded-lg transition-all flex items-center gap-1.5 shadow-md group"
                            title="Launch Urge Surfing Emergency Intercept"
                          >
                            <HeartPulse className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" />
                            <span>URGE SOS</span>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setQuickLogHabit(habit);
                            setUrgeIntensity(7);
                            setUrgeTrigger(habit.cueTriggers?.[0] || '');
                          }}
                          className="px-3 py-2 bg-[#1A1A1A] hover:bg-[#262626] border border-[#333] text-white font-mono text-xs font-bold uppercase rounded-lg transition-all flex items-center gap-1"
                          title="Log a craving or urge"
                        >
                          <Activity className="w-4 h-4 text-cyan-400" /> LOG URGE
                        </button>

                        <button
                          onClick={() => setShareOathHabit(habit)}
                          className="px-3 py-2 bg-[#1A1A1A] hover:bg-[#262626] border border-[#333] text-amber-300 font-mono text-xs font-bold uppercase rounded-lg transition-all flex items-center gap-1"
                          title="View shareable Non-Negotiable Oath Certificate"
                        >
                          <Share2 className="w-4 h-4 text-amber-400" /> OATH CERT
                        </button>

                        <button
                          onClick={() => setRelapseHabit(habit)}
                          className="px-3 py-2 bg-[#1A1A1A] hover:bg-red-950/50 border border-[#333] hover:border-red-800 text-red-400 font-mono text-xs font-bold uppercase rounded-lg transition-all flex items-center gap-1"
                          title="Log a relapse event to conduct post-mortem"
                        >
                          <RefreshCw className="w-4 h-4" /> RESET
                        </button>

                        <button
                          onClick={() => handleToggleArchive(habit)}
                          className="p-2 bg-[#1A1A1A] hover:bg-[#262626] border border-[#333] text-[#888] hover:text-purple-400 rounded-lg transition-all"
                          title={habit.active ? "Archive as Mastered" : "Reactivate Protocol"}
                        >
                          {habit.active ? <Archive className="w-4 h-4" /> : <RotateCcw className="w-4 h-4 text-purple-400" />}
                        </button>

                        <button
                          onClick={() => openAddModal(habit)}
                          className="p-2 bg-[#1A1A1A] hover:bg-[#262626] border border-[#333] text-[#888] hover:text-white rounded-lg transition-all"
                          title="Edit Protocol"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setDeletingHabit(habit)}
                          className="p-2 bg-[#1A1A1A] hover:bg-red-950/50 border border-[#333] hover:border-red-900 text-[#888] hover:text-red-400 rounded-lg transition-all"
                          title="Delete Protocol"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* LIVE PRECISION TICKER GRID */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 bg-[#0A0A0A] p-3 border border-[#222] rounded-lg font-mono">
                      <div className="bg-[#141414] p-2 rounded border border-[#222]">
                        <span className="text-[9px] text-[#888] uppercase block">CLEAN DAYS</span>
                        <span className="text-xl font-bold text-emerald-400">{metrics.days}d</span>
                      </div>

                      <div className="bg-[#141414] p-2 rounded border border-[#222]">
                        <span className="text-[9px] text-[#888] uppercase block">PRECISION TICKER</span>
                        <span className="text-sm font-bold text-cyan-400">
                          {String(metrics.hours).padStart(2, '0')}:{String(metrics.minutes).padStart(2, '0')}:{String(metrics.seconds).padStart(2, '0')}
                        </span>
                      </div>

                      <div className="bg-[#141414] p-2 rounded border border-[#222]">
                        <span className="text-[9px] text-[#888] uppercase block">LONGEST RECORD</span>
                        <span className="text-sm font-bold text-white">{habit.longestCleanDays || 0} DAYS</span>
                      </div>

                      <div className="bg-[#141414] p-2 rounded border border-[#222]">
                        <span className="text-[9px] text-[#888] uppercase block">MONEY SAVED</span>
                        <span className="text-sm font-bold text-amber-400">${metrics.moneySaved}</span>
                      </div>

                      <div className="bg-[#141414] p-2 rounded border border-[#222]">
                        <span className="text-[9px] text-[#888] uppercase block">TIME RECLAIMED</span>
                        <span className="text-sm font-bold text-indigo-400">{metrics.hoursSaved} HOURS</span>
                      </div>

                      <div className="bg-[#141414] p-2 rounded border border-[#222]">
                        <span className="text-[9px] text-[#888] uppercase block">START DATE</span>
                        <span className="text-[10px] font-bold text-[#AAA] truncate block">
                          {new Date(habit.startDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* DECONSTRUCTION BLUEPRINT DETAILS */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
                      {/* Cue Triggers */}
                      <div className="bg-[#141414] p-3 rounded-lg border border-[#222] space-y-1.5">
                        <div className="text-[10px] text-[#888] uppercase font-bold flex items-center gap-1">
                          <Crosshair className="w-3.5 h-3.5 text-red-400" /> CUE TRIGGERS
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {habit.cueTriggers?.map((trig, i) => (
                            <span key={i} className="bg-[#1F1F1F] text-[#DDD] px-2 py-0.5 rounded text-[10px]">
                              #{trig}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Replacement Routine */}
                      <div className="bg-[#141414] p-3 rounded-lg border border-[#222] space-y-1.5">
                        <div className="text-[10px] text-cyan-400 uppercase font-bold flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5" /> REPLACEMENT ROUTINE ("IF-THEN")
                        </div>
                        <p className="text-[#CCC] text-[11px] leading-relaxed">
                          {habit.substituteBehavior || 'No substitute routine defined.'}
                        </p>
                      </div>

                      {/* Friction Barrier */}
                      <div className="bg-[#141414] p-3 rounded-lg border border-[#222] space-y-1.5">
                        <div className="text-[10px] text-emerald-400 uppercase font-bold flex items-center gap-1">
                          <Lock className="w-3.5 h-3.5" /> FRICTION AMPLIFICATION
                        </div>
                        <p className="text-[#CCC] text-[11px] leading-relaxed">
                          {habit.frictionBarrier || 'No physical/digital friction barrier set.'}
                        </p>
                      </div>
                    </div>

                    {/* SIGNED CONTRACT OATH */}
                    {habit.nonNegotiableContract && (
                      <div className="bg-[#121212] p-3 rounded-lg border border-amber-900/30 flex items-start gap-2.5 text-xs font-mono text-amber-200/90">
                        <BookOpen className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-amber-500 font-bold block">
                            SIGNED NON-NEGOTIABLE CONTRACT
                          </span>
                          <span className="italic">"{habit.nonNegotiableContract}"</span>
                        </div>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB: URGE JOURNAL & PATTERN IDENTIFICATION ENGINE */}
      {mainNavTab === 'urge_journal' && (
        <div className="space-y-6 animate-fadeIn">
          {/* HEADER BANNER */}
          <div className="bg-[#111] border border-[#262626] rounded-xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase">
              <PenTool className="w-5 h-5 text-cyan-400" /> URGE JOURNAL & PATTERN IDENTIFICATION ENGINE
            </div>
            <p className="text-xs font-mono text-[#AAA]">
              Log the exact context, craving intensity, and environmental triggers whenever an urge strikes. Uncover unconscious relapse windows and high-risk triggers before they break your streak.
            </p>
          </div>

          {/* TWO COLUMN GRID: LOGGING FORM + PATTERN INSIGHTS & MINI RECHARTS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LEFT COLUMN: INTERACTIVE URGE JOURNAL LOGGING FORM (7 COLS) */}
            <div className="lg:col-span-7 bg-[#111] border-2 border-cyan-900/60 rounded-xl p-5 space-y-5 shadow-xl font-mono text-xs">
              <div className="flex items-center justify-between border-b border-[#222] pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    NEW URGE JOURNAL ENTRY
                  </h3>
                </div>
                <span className="text-[10px] text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800 font-bold">
                  +60 XP REWARD
                </span>
              </div>

              {/* 1. HABIT SELECTION */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-[#AAA] uppercase font-bold block">
                  TARGET HABIT PROTOCOL
                </label>
                <select
                  value={journalHabitId}
                  onChange={(e) => setJournalHabitId(Number(e.target.value))}
                  className="w-full bg-[#181818] border border-[#333] rounded-lg p-2.5 text-white font-bold"
                >
                  <option value={0}>-- Select Active Habit Protocol --</option>
                  {badHabits.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.title} ({h.cleanDays}d clean)
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. CONTEXT SELECTION (QUICK TAGS + CUSTOM INPUT) */}
              <div className="space-y-2">
                <label className="text-[10px] text-[#AAA] uppercase font-bold block">
                  ENVIRONMENTAL CONTEXT / SITUATION
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_CONTEXTS.map((ctx) => (
                    <button
                      key={ctx}
                      type="button"
                      onClick={() => {
                        setJournalContext(ctx);
                        setJournalCustomContext('');
                      }}
                      className={cn(
                        "px-2.5 py-1 rounded text-[10px] border transition-all",
                        journalContext === ctx && !journalCustomContext
                          ? "bg-cyan-950 text-cyan-300 border-cyan-700 font-bold shadow"
                          : "bg-[#181818] text-[#888] border-[#2B2B2B] hover:text-white"
                      )}
                    >
                      {ctx}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={journalCustomContext}
                  onChange={(e) => setJournalCustomContext(e.target.value)}
                  placeholder="Or enter custom context (e.g., 'At coffee shop studying', 'Lying in bed scrolling')..."
                  className="w-full bg-[#181818] border border-[#333] rounded-lg p-2.5 text-white placeholder-[#666]"
                />
              </div>

              {/* 3. CRAVING INTENSITY SLIDER (1 TO 10) */}
              <div className="space-y-2 bg-[#0A0A0A] p-3.5 rounded-xl border border-[#222]">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] text-[#AAA] uppercase font-bold flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-amber-400" /> CRAVING INTENSITY LEVEL
                  </label>
                  <span className={cn(
                    "text-xs font-bold px-2.5 py-0.5 rounded border",
                    journalIntensity >= 8 ? "bg-red-950 text-red-400 border-red-800" :
                    journalIntensity >= 5 ? "bg-amber-950 text-amber-400 border-amber-800" :
                    "bg-cyan-950 text-cyan-400 border-cyan-800"
                  )}>
                    LEVEL {journalIntensity} / 10 • {
                      journalIntensity >= 9 ? 'OVERWHELMING SPIKE' :
                      journalIntensity >= 7 ? 'INTENSE CRAVING' :
                      journalIntensity >= 5 ? 'MODERATE PRESSURE' : 'MILD NUDGE'
                    }
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={journalIntensity}
                  onChange={(e) => setJournalIntensity(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-[#666]">
                  <span>1 - Mild Nudge</span>
                  <span>5 - Moderate Craving</span>
                  <span>10 - Critical Emergency</span>
                </div>
              </div>

              {/* 4. POTENTIAL TRIGGERS TAG PICKER */}
              <div className="space-y-2">
                <label className="text-[10px] text-[#AAA] uppercase font-bold block">
                  POTENTIAL TRIGGERS / CUES
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_TRIGGERS.map((trig) => {
                    const isSelected = journalTriggers.includes(trig);
                    return (
                      <button
                        key={trig}
                        type="button"
                        onClick={() => {
                          if (isSelected) setJournalTriggers(journalTriggers.filter(t => t !== trig));
                          else setJournalTriggers([...journalTriggers, trig]);
                        }}
                        className={cn(
                          "px-2.5 py-1 rounded text-[10px] border transition-all flex items-center gap-1",
                          isSelected
                            ? "bg-amber-950 text-amber-300 border-amber-700 font-bold"
                            : "bg-[#181818] text-[#888] border-[#2B2B2B] hover:text-white"
                        )}
                      >
                        {isSelected && <Check className="w-3 h-3 text-amber-400" />} #{trig}
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={journalNewTrigger}
                    onChange={(e) => setJournalNewTrigger(e.target.value)}
                    placeholder="Add custom trigger cue..."
                    className="flex-1 bg-[#181818] border border-[#333] rounded-lg p-2 text-white placeholder-[#666]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (journalNewTrigger.trim()) {
                        setJournalTriggers([...journalTriggers, journalNewTrigger.trim()]);
                        setJournalNewTrigger('');
                      }
                    }}
                    className="px-3 py-2 bg-[#222] hover:bg-[#333] text-white rounded-lg text-xs font-bold"
                  >
                    ADD
                  </button>
                </div>
              </div>

              {/* 5. ACTION TAKEN SELECTOR */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-[#AAA] uppercase font-bold block">
                  ACTION TAKEN IN RESPONSE
                </label>
                <select
                  value={journalActionTaken}
                  onChange={(e) => setJournalActionTaken(e.target.value as any)}
                  className="w-full bg-[#181818] border border-[#333] rounded-lg p-2.5 text-white font-bold uppercase"
                >
                  <option value="surfed_urge">SURFED THE URGE (OBSERVED & RESISTED)</option>
                  <option value="used_substitute">USED REPLACEMENT ROUTINE ("IF-THEN")</option>
                  <option value="emergency_sos">LAUNCHED SOS COLD-SHOCK / BREATHING</option>
                  <option value="relapsed">RELAPSED / GAVE IN (RESET STREAK)</option>
                </select>
              </div>

              {/* 6. JOURNAL REFLECTION NOTES */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-[#AAA] uppercase font-bold block">
                  JOURNAL REFLECTION & THOUGHT PROCESS
                </label>
                <textarea
                  value={journalNotes}
                  onChange={(e) => setJournalNotes(e.target.value)}
                  placeholder="What thoughts or emotions were present? What reframing statement or action helped you master this moment?"
                  rows={3}
                  className="w-full bg-[#181818] border border-[#333] rounded-lg p-2.5 text-white placeholder-[#666] leading-relaxed"
                />
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="button"
                onClick={handleSaveJournalEntry}
                className="w-full py-3.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold uppercase rounded-lg shadow-lg shadow-cyan-950/50 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <PenTool className="w-4 h-4" /> LOG URGE TO JOURNAL (+60 XP)
              </button>
            </div>

            {/* RIGHT COLUMN: PATTERN DETECTOR & RECHARTS MINI TIME-OF-DAY CHART (5 COLS) */}
            <div className="lg:col-span-5 space-y-5 font-mono text-xs">
              
              {/* PATTERN DETECTOR INSIGHT CARDS */}
              <div className="bg-[#111] border-2 border-indigo-900/60 rounded-xl p-5 space-y-4 shadow-xl">
                <div className="flex items-center gap-2 text-indigo-400 border-b border-[#222] pb-3">
                  <Brain className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    AUTOMATED PATTERN DETECTOR
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="bg-[#181818] p-3 rounded-lg border border-[#262626]">
                    <span className="text-[10px] text-[#888] uppercase block">DOMINANT CONTEXT ENVIRONMENT:</span>
                    <span className="text-sm font-bold text-cyan-300 block mt-0.5">{dominantContext}</span>
                  </div>

                  <div className="bg-[#181818] p-3 rounded-lg border border-[#262626]">
                    <span className="text-[10px] text-[#888] uppercase block">PEAK RISK TIME SLOT:</span>
                    <span className="text-sm font-bold text-amber-400 block mt-0.5">{peakSlotLabel}</span>
                  </div>

                  <div className="bg-[#181818] p-3 rounded-lg border border-[#262626]">
                    <span className="text-[10px] text-[#888] uppercase block">RESISTANCE SUCCESS RATE:</span>
                    <span className="text-sm font-bold text-emerald-400 block mt-0.5">{successRate}% ({resistedUrges} Resisted / {totalUrgesLogged} Total)</span>
                  </div>

                  <div className="bg-[#0A0A0A] p-3.5 rounded-lg border border-indigo-900/40 text-[11px] text-indigo-200 leading-relaxed">
                    <span className="text-[9px] font-bold text-indigo-400 uppercase block mb-1">COGNITIVE SCIENCE RECOMMENDATION:</span>
                    Urges spike predominantly in <strong className="text-white">{dominantContext}</strong> around <strong className="text-white">{peakSlotLabel}</strong>. Place your physical friction barriers (app lockouts, phone in other room) 30 minutes before this window opens.
                  </div>
                </div>
              </div>

              {/* RECHARTS MINI TIME-OF-DAY RELAPSE WINDOWS BAR CHART */}
              <div className="bg-[#111] border border-[#262626] rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-[#222] pb-2">
                  <span className="text-xs font-bold text-white uppercase flex items-center gap-1.5">
                    <BarChart2 className="w-4 h-4 text-emerald-400" /> TIME-OF-DAY CRAVING WINDOWS
                  </span>
                  <span className="text-[9px] text-[#888]">24-HOUR BINS</span>
                </div>

                <div className="h-44 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={timeOfDayChartData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                      <XAxis dataKey="slot" stroke="#666" fontSize={8} tickLine={false} interval={1} />
                      <YAxis stroke="#666" fontSize={9} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#141414', borderColor: '#333', borderRadius: '8px', fontSize: '11px', color: '#fff' }}
                        formatter={(val: any, name: any) => [val, name === 'urges' ? 'Total Urges' : name]}
                      />
                      <Bar dataKey="urges" radius={[4, 4, 0, 0]}>
                        {timeOfDayChartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.urges >= 4 ? '#ef4444' : entry.urges >= 2 ? '#f59e0b' : '#06b6d4'}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

          </div>

          {/* SECTION 2: FILTERABLE URGE JOURNAL FEED & HISTORICAL ENTRIES */}
          <div className="bg-[#111] border border-[#262626] rounded-xl p-5 space-y-4 font-mono">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#222] pb-4">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-cyan-400" /> HISTORICAL URGE JOURNAL LOGS ({filteredJournalLogs.length})
                </h3>
                <span className="text-[10px] text-[#888]">Filter entries to trace triggers and review reflections over time</span>
              </div>

              {/* SEARCH & FILTERS */}
              <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
                <div className="relative flex-1 sm:w-48">
                  <Search className="w-3.5 h-3.5 text-[#666] absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={journalFilterSearch}
                    onChange={(e) => setJournalFilterSearch(e.target.value)}
                    placeholder="Search journal..."
                    className="w-full bg-[#181818] border border-[#333] rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-white placeholder-[#666]"
                  />
                </div>

                <select
                  value={journalFilterHabitId}
                  onChange={(e) => setJournalFilterHabitId(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                  className="bg-[#181818] border border-[#333] rounded-lg px-2.5 py-1.5 text-xs text-white"
                >
                  <option value="all">All Habits</option>
                  {badHabits.map((h) => (
                    <option key={h.id} value={h.id}>{h.title}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* JOURNAL ENTRIES FEED */}
            <div className="space-y-3">
              {filteredJournalLogs.length === 0 ? (
                <div className="text-center py-10 bg-[#0A0A0A] border border-[#222] rounded-xl space-y-2">
                  <PenTool className="w-8 h-8 text-[#444] mx-auto" />
                  <p className="text-xs text-[#888]">No urge journal logs match your filter criteria.</p>
                  <p className="text-[10px] text-[#666]">Log a new urge above to start generating pattern insights!</p>
                </div>
              ) : (
                filteredJournalLogs.map((log) => {
                  const habitObj = badHabits.find(h => h.id === log.habitId);
                  return (
                    <div key={log.id} className="bg-[#141414] border border-[#262626] hover:border-cyan-900/50 p-4 rounded-xl space-y-3 transition-all">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#222] pb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-cyan-300 uppercase">
                            {habitObj?.title || 'Habit Protocol'}
                          </span>
                          <span className="text-[10px] text-[#666] flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-bold border uppercase",
                            log.intensity >= 8 ? "bg-red-950 text-red-400 border-red-800" :
                            log.intensity >= 5 ? "bg-amber-950 text-amber-400 border-amber-800" :
                            "bg-cyan-950 text-cyan-400 border-cyan-800"
                          )}>
                            INTENSITY {log.intensity}/10
                          </span>

                          <span className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-bold border uppercase",
                            log.actionTaken === 'relapsed' ? "bg-red-950 text-red-400 border-red-900" : "bg-emerald-950 text-emerald-400 border-emerald-900"
                          )}>
                            {log.actionTaken.replace('_', ' ')}
                          </span>

                          {log.id && (
                            <button
                              type="button"
                              onClick={() => handleDeleteUrgeLog(log.id!)}
                              className="p-1 text-[#666] hover:text-red-400 transition-colors"
                              title="Delete journal entry"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        {/* Context Tag */}
                        <div className="bg-[#0D0D0D] p-2.5 rounded border border-[#222]">
                          <span className="text-[9px] text-[#888] uppercase block font-bold">CONTEXT / ENVIRONMENT:</span>
                          <span className="text-cyan-200 font-bold text-[11px] block mt-0.5">{log.context || 'Not specified'}</span>
                        </div>

                        {/* Triggers */}
                        <div className="bg-[#0D0D0D] p-2.5 rounded border border-[#222]">
                          <span className="text-[9px] text-[#888] uppercase block font-bold">TRIGGER CUES:</span>
                          <span className="text-amber-200 font-bold text-[11px] block mt-0.5">#{log.trigger}</span>
                        </div>
                      </div>

                      {/* Reflection Notes */}
                      {log.notes && (
                        <div className="bg-[#0A0A0A] p-3 rounded border border-[#222] text-xs text-[#CCC] italic leading-relaxed">
                          "{log.notes}"
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: NEURO-RECOVERY MILESTONES & BRAIN REWIRING TIMELINE */}
      {mainNavTab === 'neuro_recovery' && (
        <div className="space-y-6">
          <div className="bg-[#111] border border-[#262626] rounded-xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-bold uppercase">
              <Brain className="w-5 h-5" /> BIOLOGICAL DOPAMINE & NEURO-PLASTICITY STAGES
            </div>
            <p className="text-xs font-mono text-[#AAA]">
              Breaking a bad habit is a physical neurological process. As clean time accumulates, dopamine D2 receptors upregulate, prefrontal executive control restores, and old vice pathways undergo synaptic pruning.
            </p>
          </div>

          {/* ACTIVE HABITS NEURO-PROGRESS BARS */}
          {activeHabitsList.map((habit) => {
            const metrics = calculateHabitMetrics(habit);
            const days = metrics.days;

            // Determine current neuro stage
            const currentStageObj = NEURO_STAGES.find(s => days >= s.minDays && days <= s.maxDays) || NEURO_STAGES[NEURO_STAGES.length - 1];
            const nextStageObj = NEURO_STAGES.find(s => s.stage === currentStageObj.stage + 1);

            let stageProgress = 100;
            if (nextStageObj) {
              const range = currentStageObj.maxDays - currentStageObj.minDays + 1;
              const elapsed = days - currentStageObj.minDays;
              stageProgress = Math.min(100, Math.max(10, Math.round((elapsed / range) * 100)));
            }

            return (
              <div key={habit.id} className="bg-[#111] border-2 border-indigo-900/50 rounded-xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#222] pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase">PROTOCOL REWIRING TRACKER</span>
                    <h3 className="text-lg font-mono font-bold text-white uppercase">{habit.title}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded border border-emerald-800">
                      {days} CLEAN DAYS
                    </span>
                    <span className={cn("text-xs font-mono font-bold px-3 py-1 rounded border uppercase", currentStageObj.badgeColor)}>
                      STAGE {currentStageObj.stage}: {currentStageObj.name}
                    </span>
                  </div>
                </div>

                {/* Progress bar to next neuro stage */}
                <div className="space-y-1.5 font-mono">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#888]">NEURO-PLASTIC PROGRESS (STAGE {currentStageObj.stage})</span>
                    <span className="text-indigo-400 font-bold">{stageProgress}% TO NEXT MILESTONE</span>
                  </div>
                  <div className="w-full bg-[#1A1A1A] h-2.5 rounded-full overflow-hidden border border-[#333]">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${stageProgress}%` }}
                    />
                  </div>
                </div>

                {/* Stage Biological Actionable Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono bg-[#0A0A0A] p-3.5 rounded-lg border border-[#222]">
                  <div>
                    <span className="text-[10px] text-[#888] uppercase font-bold block mb-1">BIOLOGICAL STATUS IN BRAIN:</span>
                    <p className="text-[#DDD] text-[11px]">{currentStageObj.desc}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-cyan-400 uppercase font-bold block mb-1">TACTICAL PRIORITY ACTION:</span>
                    <p className="text-cyan-200 text-[11px]">{currentStageObj.action}</p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* FULL NEURO-STAGES TIMELINE REFERENCE */}
          <div className="space-y-3 pt-4">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-cyan-400" /> THE 6 BIOLOGICAL STAGES OF ADDICTION RE-WIRING
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {NEURO_STAGES.map((s) => (
                <div key={s.stage} className="bg-[#111] border border-[#222] p-4 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase">STAGE 0{s.stage}</span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                      {s.dayRange}
                    </span>
                  </div>
                  <h4 className="text-xs font-mono font-bold text-white uppercase">{s.name}</h4>
                  <p className="text-[11px] font-mono text-[#AAA] leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: COLD-SHOCK INTERCEPT & AUTONOMIC RESET */}
      {mainNavTab === 'cold_shock' && (
        <div className="space-y-6">
          <div className="bg-[#111] border border-[#262626] rounded-xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase">
              <Thermometer className="w-5 h-5" /> TACTILE COLD-SHOCK & AUTONOMIC INTERCEPT ENGINE
            </div>
            <p className="text-xs font-mono text-[#AAA]">
              Cravings and urge spikes are intense autonomic nervous system events. Use physical shock interventions (mammalian dive reflex, double-sighing, isometric tension) to drop your heart rate by 15-25 bpm in under 30 seconds and dissolve craving energy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* TECHNIQUE SELECTOR LIST */}
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold text-[#888] uppercase block">
                SELECT TACTICAL INTERCEPT METHOD:
              </span>
              {COLD_TECHNIQUES.map((tech) => {
                const IconComp = tech.icon;
                const isSelected = activeColdTechId === tech.id;
                return (
                  <button
                    key={tech.id}
                    onClick={() => {
                      setActiveColdTechId(tech.id);
                      setColdTimerLeft(tech.duration);
                      setColdTimerRunning(false);
                    }}
                    className={cn(
                      "w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 group",
                      isSelected
                        ? "bg-[#161616] border-cyan-500 shadow-lg"
                        : "bg-[#111] border-[#222] hover:border-[#333]"
                    )}
                  >
                    <div className={cn("p-2.5 rounded-lg border flex-shrink-0", tech.color)}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-mono font-bold text-white uppercase">{tech.title}</h4>
                      <p className="text-[11px] font-mono text-[#AAA] mt-0.5">{tech.subtitle}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* ACTIVE TECHNIQUE GUIDANCE & TIMER */}
            {(() => {
              const activeTech = COLD_TECHNIQUES.find(t => t.id === activeColdTechId) || COLD_TECHNIQUES[0];
              const IconComp = activeTech.icon;

              return (
                <div className="bg-[#0D0D0D] border-2 border-cyan-900/60 rounded-xl p-5 space-y-5 flex flex-col justify-between shadow-2xl">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-[#222] pb-3">
                      <div className="flex items-center gap-2">
                        <IconComp className="w-5 h-5 text-cyan-400" />
                        <h3 className="text-sm font-mono font-bold text-white uppercase">{activeTech.title}</h3>
                      </div>
                      <span className="text-xs font-mono text-cyan-400 font-bold bg-cyan-950 px-2.5 py-1 rounded border border-cyan-800">
                        {activeTech.duration}s PROTOCOL
                      </span>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] font-mono font-bold text-[#888] uppercase block">STEP-BY-STEP GUIDANCE:</span>
                      <ol className="space-y-2 text-xs font-mono text-[#DDD]">
                        {activeTech.steps.map((step, idx) => (
                          <li key={idx} className="flex items-start gap-2 bg-[#141414] p-2.5 rounded border border-[#222]">
                            <span className="text-cyan-400 font-bold flex-shrink-0">{idx + 1}.</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  {/* INTERCEPT TIMER DISPLAY */}
                  <div className="pt-3 border-t border-[#222] space-y-3 text-center">
                    <div className="text-4xl font-mono font-black text-cyan-400 tracking-wider">
                      {coldTimerLeft}s
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => setColdTimerRunning(!coldTimerRunning)}
                        className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-bold uppercase rounded-lg shadow-lg flex items-center gap-2"
                      >
                        {coldTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        <span>{coldTimerRunning ? 'PAUSE INTERCEPT' : 'START 30s TIMER'}</span>
                      </button>

                      <button
                        onClick={() => {
                          setColdTimerLeft(activeTech.duration);
                          setColdTimerRunning(false);
                        }}
                        className="px-4 py-3 bg-[#1A1A1A] hover:bg-[#262626] text-[#AAA] font-mono text-xs font-bold uppercase rounded-lg border border-[#333]"
                      >
                        RESET
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* TAB 4: URGE HEATMAP & DANGER ZONE RADAR */}
      {mainNavTab === 'urge_analytics' && (
        <div className="space-y-6">
          <div className="bg-[#111] border border-[#262626] rounded-xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase">
              <BarChart2 className="w-5 h-5" /> URGE HEATMAP & PEAK DANGER ZONE RADAR
            </div>
            <p className="text-xs font-mono text-[#AAA]">
              Analyze when cravings strike most frequently to build advance defense shields and eliminate surprise temptation windows.
            </p>
          </div>

          {/* DANGER ZONE HIGHLIGHT CARD */}
          <div className="bg-[#121212] border-2 border-amber-600/60 rounded-xl p-5 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" /> PEAK CRAVING DANGER ZONE DETECTED
              </span>
              <span className="text-[10px] font-mono text-[#888]">BASED ON {totalUrgesLogged} URGE LOGS</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs pt-1">
              <div className="bg-[#181818] p-3 rounded-lg border border-[#262626]">
                <span className="text-[10px] text-[#888] block">HIGHEST RISK TIME SLOT:</span>
                <span className="text-sm font-bold text-amber-300 mt-0.5 block">{peakTimeSlot}</span>
              </div>

              <div className="bg-[#181818] p-3 rounded-lg border border-[#262626]">
                <span className="text-[10px] text-[#888] block">TOTAL URGES RESISTED:</span>
                <span className="text-sm font-bold text-emerald-400 mt-0.5 block">{resistedUrges} / {totalUrgesLogged} ({successRate}%)</span>
              </div>

              <div className="bg-[#181818] p-3 rounded-lg border border-[#262626]">
                <span className="text-[10px] text-[#888] block">RECOMMENDED DEFENSE:</span>
                <span className="text-xs text-cyan-300 font-bold mt-0.5 block">Enable digital lockouts 30 mins before peak slot</span>
              </div>
            </div>
          </div>

          {/* RECHARTS VISUALIZATION 1: 24-HOUR BINNED TIME OF DAY RELAPSE WINDOWS */}
          <div className="bg-[#111] border border-[#262626] rounded-xl p-5 space-y-4 font-mono">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#222] pb-3">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-cyan-400" /> TIME-OF-DAY CRAVING FREQUENCY & RELAPSE WINDOWS
                </h3>
                <span className="text-[10px] text-[#888]">Visualizes when cravings strike across 24 hours to pinpoint vulnerable windows</span>
              </div>
              <div className="flex items-center gap-3 text-[10px]">
                <span className="flex items-center gap-1 text-cyan-400 font-bold"><span className="w-2.5 h-2.5 rounded bg-cyan-400 inline-block"></span> Normal Urges</span>
                <span className="flex items-center gap-1 text-amber-400 font-bold"><span className="w-2.5 h-2.5 rounded bg-amber-400 inline-block"></span> Moderate Spikes</span>
                <span className="flex items-center gap-1 text-red-400 font-bold"><span className="w-2.5 h-2.5 rounded bg-red-400 inline-block"></span> High Relapse Risk</span>
              </div>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeOfDayChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                  <XAxis dataKey="slot" stroke="#888" fontSize={9} tickLine={false} angle={-25} textAnchor="end" />
                  <YAxis stroke="#888" fontSize={10} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#141414', borderColor: '#333', borderRadius: '8px', fontSize: '11px', color: '#fff' }}
                    formatter={(val: any, name: any) => [
                      val, 
                      name === 'urges' ? 'Total Urges' : name === 'avgIntensity' ? 'Avg Intensity' : name
                    ]}
                  />
                  <Bar dataKey="urges" name="Total Urges" radius={[4, 4, 0, 0]}>
                    {timeOfDayChartData.map((entry, index) => (
                      <Cell
                        key={`analytics-cell-${index}`}
                        fill={entry.urges >= 4 ? '#ef4444' : entry.urges >= 2 ? '#f59e0b' : '#06b6d4'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* RECHARTS VISUALIZATION 2 & 3: 14-DAY TREND LINE + CONTEXT BREAKDOWN */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono">
            
            {/* 14-DAY URGE VOLUME & INTENSITY TREND LINE CHART (7 COLS) */}
            <div className="lg:col-span-7 bg-[#111] border border-[#262626] rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#222] pb-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" /> 14-DAY URGE FREQUENCY & INTENSITY TREND
                </h3>
                <span className="text-[10px] text-[#888]">14-DAY ROLLING HISTORY</span>
              </div>

              <div className="h-60 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyTrendChartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorUrges" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                    <XAxis dataKey="displayDate" stroke="#888" fontSize={9} />
                    <YAxis stroke="#888" fontSize={10} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#141414', borderColor: '#333', borderRadius: '8px', fontSize: '11px', color: '#fff' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                    <Area type="monotone" dataKey="urges" name="Urges Logged" stroke="#10b981" fillOpacity={1} fill="url(#colorUrges)" strokeWidth={2} />
                    <Line type="monotone" dataKey="avgIntensity" name="Avg Intensity (1-10)" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* TOP ENVIRONMENTAL CONTEXT BREAKDOWN (5 COLS) */}
            <div className="lg:col-span-5 bg-[#111] border border-[#262626] rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#222] pb-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Target className="w-4 h-4 text-amber-400" /> TOP CONTEXT ENVIRONMENTS
                </h3>
                <span className="text-[10px] text-[#888]">BY FREQUENCY</span>
              </div>

              {topContextChartData.length === 0 ? (
                <div className="text-center py-12 text-[#666] text-xs">
                  No context data logged yet. Log urges in the Urge Journal to populate!
                </div>
              ) : (
                <div className="h-60 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topContextChartData} layout="vertical" margin={{ top: 5, right: 10, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                      <XAxis type="number" stroke="#888" fontSize={9} allowDecimals={false} />
                      <YAxis dataKey="contextName" type="category" stroke="#888" fontSize={8} width={110} tickLine={false} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#141414', borderColor: '#333', borderRadius: '8px', fontSize: '11px', color: '#fff' }}
                      />
                      <Bar dataKey="count" name="Urge Count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* TAB 5: WHY-I-QUIT VISION VAULT & POWER MANTRAS */}
      {mainNavTab === 'vision_vault' && (
        <div className="space-y-6">
          <div className="bg-[#111] border border-[#262626] rounded-xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-yellow-400 font-mono text-xs font-bold uppercase">
              <BookOpen className="w-5 h-5" /> WHY-I-QUIT VISION VAULT & POWER MANTRAS
            </div>
            <p className="text-xs font-mono text-[#AAA]">
              Deep motivation and cognitive reframing statements to ground your mind in why you started. Review these vision cards whenever temptation speaks.
            </p>
          </div>

          {/* POWER MANTRA WHEEL */}
          <div className="bg-[#0A0A0A] border-2 border-yellow-800/60 rounded-xl p-6 space-y-4 text-center relative overflow-hidden shadow-2xl">
            <span className="text-[10px] font-mono font-bold text-yellow-400 uppercase tracking-widest block">
              COGNITIVE REFRAMING MANTRA #{mantraIndex + 1} / {POWER_MANTRAS.length}
            </span>

            <blockquote className="text-base sm:text-xl font-mono italic font-bold text-yellow-100 max-w-2xl mx-auto leading-relaxed">
              "{POWER_MANTRAS[mantraIndex]}"
            </blockquote>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setMantraIndex((prev) => (prev + 1) % POWER_MANTRAS.length)}
                className="px-5 py-2.5 bg-yellow-600 hover:bg-yellow-500 text-black font-mono text-xs font-bold uppercase rounded-lg shadow-md flex items-center gap-1.5"
              >
                <RefreshCw className="w-4 h-4" /> NEXT POWER MANTRA
              </button>
            </div>
          </div>

          {/* HABIT VISION CARDS & CONTRACT OATHS */}
          <div className="space-y-4">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              SIGNED NON-NEGOTIABLE CONTRACTS
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeHabitsList.map((h) => (
                <div key={h.id} className="bg-[#111] border border-[#262626] rounded-xl p-5 space-y-3 font-mono">
                  <div className="flex items-center justify-between border-b border-[#222] pb-2">
                    <h4 className="text-sm font-bold text-white uppercase">{h.title}</h4>
                    <span className="text-[10px] text-cyan-400 font-bold bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                      {h.cleanDays} DAYS CLEAN
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-[#AAA]">
                    <div>
                      <span className="text-[10px] text-amber-400 font-bold uppercase block">NON-NEGOTIABLE OATH:</span>
                      <p className="italic text-amber-100 mt-0.5">"{h.nonNegotiableContract || 'I solemnly swear to maintain restraint.'}"</p>
                    </div>

                    <div>
                      <span className="text-[10px] text-cyan-400 font-bold uppercase block">REPLACEMENT ROUTINE:</span>
                      <p className="text-[#CCC] mt-0.5">{h.substituteBehavior}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShareOathHabit(h)}
                    className="w-full py-2 bg-[#1A1A1A] hover:bg-[#262626] text-amber-300 font-mono text-xs font-bold uppercase rounded-lg border border-[#333] flex items-center justify-center gap-1.5"
                  >
                    <Share2 className="w-3.5 h-3.5" /> GENERATE SHAREABLE OATH CERTIFICATE
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FEATURE TAB 7: TECHNIQUES & ACTIONABLE DISTRACTION TASKS */}
      {mainNavTab === 'techniques' && (
        <div className="space-y-6 font-mono animate-fadeIn">
          {/* HEADER STATS BANNER */}
          <div className="bg-[#111] border border-teal-900/40 rounded-xl p-5 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#222] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-teal-400" />
                  <h2 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                    ACTIONABLE DISTRACTION TASKS & URGE INTERCEPTORS
                  </h2>
                </div>
                <p className="text-xs text-[#888] mt-1">
                  When a craving strikes, choose a quick 1-to-5 minute task below. Completing a task interrupts dopamine fixation, activates executive prefrontal control, and grants instant SEN XP!
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-[#181818] border border-[#262626] rounded-lg px-3 py-2 text-right">
                  <span className="text-[10px] text-[#888] uppercase block">TASKS COMPLETED</span>
                  <span className="text-lg font-bold text-teal-400">{completedTechCount} VICTORIES</span>
                </div>
                <button
                  onClick={() => setIsAddTechniqueModalOpen(true)}
                  className="px-3.5 py-2.5 bg-teal-600 hover:bg-teal-500 text-black font-bold text-xs uppercase rounded-lg flex items-center gap-1.5 transition-all shadow-md"
                >
                  <Plus className="w-4 h-4" /> CREATE CUSTOM TASK
                </button>
              </div>
            </div>

            {/* CATEGORY FILTER BUTTONS */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[10px] text-[#888] uppercase flex items-center gap-1 mr-1">
                <Filter className="w-3 h-3 text-teal-400" /> FILTER:
              </span>
              {[
                { id: 'all', label: 'ALL TECHNIQUES' },
                { id: 'physical', label: 'PHYSICAL (WALK/EXERCISE)' },
                { id: 'sensory', label: 'SENSORY (COLD/WATER)' },
                { id: 'mental', label: 'MENTAL (BREATHING/OATHS)' },
                { id: 'environmental', label: 'ENVIRONMENTAL (CLEANUP)' },
                { id: 'social', label: 'SOCIAL (ACCOUNTABILITY)' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setTechniqueCategoryFilter(cat.id as any)}
                  className={cn(
                    "text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all uppercase",
                    techniqueCategoryFilter === cat.id
                      ? "bg-teal-950 text-teal-300 border-teal-700 shadow"
                      : "bg-[#141414] text-[#888] border-[#262626] hover:text-white"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* TECHNIQUES GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...DEFAULT_DISTRACTION_TECHNIQUES, ...customTechniques]
              .filter((t) => techniqueCategoryFilter === 'all' || t.category === techniqueCategoryFilter)
              .map((tech) => {
                let TechIcon = Zap;
                if (tech.category === 'physical') TechIcon = Footprints;
                if (tech.category === 'sensory') TechIcon = Droplets;
                if (tech.category === 'mental') TechIcon = Brain;
                if (tech.category === 'environmental') TechIcon = Sparkles;
                if (tech.category === 'social') TechIcon = Phone;

                return (
                  <div
                    key={tech.id}
                    className="bg-[#111] border border-[#262626] hover:border-teal-900/80 rounded-xl p-4 flex flex-col justify-between space-y-4 transition-all group relative overflow-hidden"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2 border-b border-[#222] pb-2.5">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-lg bg-teal-950/80 border border-teal-800 text-teal-400">
                            <TechIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="text-xs font-bold text-white uppercase group-hover:text-teal-300 transition-colors">
                              {tech.title}
                            </h3>
                            <span className="text-[9px] text-[#888] uppercase font-bold">
                              {tech.category} PROTOCOL
                            </span>
                          </div>
                        </div>

                        <span className="text-[10px] font-bold text-teal-400 bg-teal-950/80 border border-teal-800/80 px-2 py-0.5 rounded">
                          {tech.duration}
                        </span>
                      </div>

                      {/* Mechanism Explanation */}
                      <p className="text-[11px] text-[#AAA] leading-relaxed bg-[#161616] border border-[#222] p-2.5 rounded-lg italic">
                        "{tech.mechanism}"
                      </p>

                      {/* Steps Checklist */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] text-[#888] font-bold uppercase block">ACTIONABLE STEPS:</span>
                        <ul className="space-y-1 text-[11px] text-[#CCC]">
                          {tech.steps.map((step: string, sIdx: number) => (
                            <li key={sIdx} className="flex items-start gap-1.5">
                              <span className="text-teal-400 font-bold text-[10px]">{sIdx + 1}.</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Completion Action Button */}
                    <button
                      onClick={() => executeDistractionTechnique(tech)}
                      className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-black font-bold text-xs uppercase tracking-wider rounded-lg border border-teal-400 flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
                    >
                      <CheckCircle2 className="w-4 h-4" /> MARK COMPLETED (+{tech.xpReward} XP)
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* MODAL: CREATE CUSTOM DISTRACTION TECHNIQUE */}
      {isAddTechniqueModalOpen && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn font-mono">
          <div className="bg-[#0A0A0A] border-2 border-[#333] rounded-xl max-w-lg w-full p-5 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#262626] pb-3">
              <div className="flex items-center gap-2 text-teal-400 font-bold text-sm uppercase">
                <Plus className="w-4 h-4" /> CREATE CUSTOM DISTRACTION TASK
              </div>
              <button onClick={() => setIsAddTechniqueModalOpen(false)} className="text-[#888] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] text-[#888] uppercase block mb-1">TASK TITLE *</label>
                <input
                  type="text"
                  value={newTechTitle}
                  onChange={(e) => setNewTechTitle(e.target.value)}
                  placeholder="e.g. Play 1 Fast Blitz Chess Game, Do 15 Jumping Jacks..."
                  className="w-full bg-[#141414] border border-[#262626] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-[#888] uppercase block mb-1">CATEGORY</label>
                  <select
                    value={newTechCategory}
                    onChange={(e) => setNewTechCategory(e.target.value as any)}
                    className="w-full bg-[#141414] border border-[#262626] rounded-lg px-3 py-2 text-white uppercase focus:outline-none focus:border-teal-500"
                  >
                    <option value="physical">PHYSICAL</option>
                    <option value="sensory">SENSORY</option>
                    <option value="mental">MENTAL</option>
                    <option value="environmental">ENVIRONMENTAL</option>
                    <option value="social">SOCIAL</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-[#888] uppercase block mb-1">DURATION</label>
                  <input
                    type="text"
                    value={newTechDuration}
                    onChange={(e) => setNewTechDuration(e.target.value)}
                    placeholder="e.g. 3 min"
                    className="w-full bg-[#141414] border border-[#262626] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-[#888] uppercase block mb-1">WHY IT WORKS (MECHANISM)</label>
                <textarea
                  value={newTechMechanism}
                  onChange={(e) => setNewTechMechanism(e.target.value)}
                  placeholder="e.g. Redirects cognitive focus away from trigger..."
                  rows={2}
                  className="w-full bg-[#141414] border border-[#262626] rounded-lg p-2.5 text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#888] uppercase block mb-1">ACTION STEP 1</label>
                <input
                  type="text"
                  value={newTechStep1}
                  onChange={(e) => setNewTechStep1(e.target.value)}
                  placeholder="e.g. Stop current activity immediately"
                  className="w-full bg-[#141414] border border-[#262626] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#888] uppercase block mb-1">ACTION STEP 2</label>
                <input
                  type="text"
                  value={newTechStep2}
                  onChange={(e) => setNewTechStep2(e.target.value)}
                  placeholder="e.g. Take 3 deep breaths and celebrate"
                  className="w-full bg-[#141414] border border-[#262626] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#262626]">
              <button
                onClick={() => setIsAddTechniqueModalOpen(false)}
                className="px-4 py-2 bg-[#1A1A1A] text-[#888] hover:text-white rounded-lg text-xs font-bold uppercase"
              >
                CANCEL
              </button>
              <button
                onClick={handleAddCustomTechnique}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-black rounded-lg text-xs font-bold uppercase"
              >
                SAVE TASK
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL 1: ADD / EDIT HABIT PROTOCOL MODAL */}
      {isAddModalOpen && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0A0A0A] border-2 border-[#333] rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
            
            <div className="p-4 sm:p-5 border-b border-[#262626] bg-[#111] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-6 h-6 text-cyan-400" />
                <h2 className="text-base sm:text-lg font-mono font-bold text-white uppercase tracking-wider">
                  {editingHabit ? 'EDIT HABIT PROTOCOL' : 'DEPLOY HABIT DESTRUCTION BLUEPRINT'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-[#888] hover:text-white bg-[#1A1A1A] rounded-lg border border-[#333]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4">
              
              {/* Preset Shortcuts */}
              {!editingHabit && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-[#888] uppercase block">CHOOSE PRESET TEMPLATE (OPTIONAL)</label>
                  <div className="flex flex-wrap gap-1.5">
                    {HABIT_PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => applyPreset(p)}
                        className="text-[10px] font-mono bg-[#181818] hover:bg-[#262626] text-cyan-400 border border-[#333] px-2.5 py-1 rounded transition-colors"
                      >
                        + {p.title.split(' ')[0]} {p.title.split(' ')[1]}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Title & Category & Severity & Costs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-3">
                  <label className="text-[10px] font-mono text-[#A3A3A3] mb-1 block uppercase">HABIT / VICE TITLE *</label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Late Night Doomscrolling, Vaping, Binge Drinking..."
                    className="w-full bg-[#141414] border border-[#262626] rounded-lg px-3.5 py-2.5 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-[#A3A3A3] mb-1 block uppercase">CATEGORY</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full bg-[#141414] border border-[#262626] rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-cyan-500 uppercase"
                  >
                    <option value="digital">DIGITAL / SCREEN</option>
                    <option value="substance">SUBSTANCE / FOOD</option>
                    <option value="financial">FINANCIAL / GAMBLING</option>
                    <option value="behavioral">BEHAVIORAL</option>
                    <option value="mental">MENTAL / THOUGHTS</option>
                    <option value="other">OTHER VICE</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-[#A3A3A3] mb-1 block uppercase">SEVERITY LEVEL</label>
                  <select
                    value={formSeverity}
                    onChange={(e) => setFormSeverity(e.target.value as any)}
                    className="w-full bg-[#141414] border border-[#262626] rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-cyan-500 uppercase"
                  >
                    <option value="extreme">EXTREME (DESTRUCTIVE)</option>
                    <option value="high">HIGH (MAJOR DRAIN)</option>
                    <option value="moderate">MODERATE (IMPEDIMENT)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-[#A3A3A3] mb-1 block uppercase">STREAK START DATE & TIME</label>
                  <input
                    type="datetime-local"
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    className="w-full bg-[#141414] border border-[#262626] rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-[#A3A3A3] mb-1 block uppercase">DAILY COST ($)</label>
                  <input
                    type="number"
                    value={formFinancialCost}
                    onChange={(e) => setFormFinancialCost(Number(e.target.value))}
                    placeholder="0"
                    className="w-full bg-[#141414] border border-[#262626] rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-[#A3A3A3] mb-1 block uppercase">DAILY TIME WASTED (MINS)</label>
                  <input
                    type="number"
                    value={formTimeCost}
                    onChange={(e) => setFormTimeCost(Number(e.target.value))}
                    placeholder="30"
                    className="w-full bg-[#141414] border border-[#262626] rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Cue Triggers Input */}
              <div>
                <label className="text-[10px] font-mono text-[#A3A3A3] mb-1 block uppercase">CUE TRIGGERS (WHEN DOES IT STRIKE?)</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newTriggerInput}
                    onChange={(e) => setNewTriggerInput(e.target.value)}
                    placeholder="Add trigger e.g. Late night stress, Boredom, Friday night"
                    className="flex-1 bg-[#141414] border border-[#262626] rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newTriggerInput.trim()) {
                          setFormCueTriggers([...formCueTriggers, newTriggerInput.trim()]);
                          setNewTriggerInput('');
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newTriggerInput.trim()) {
                        setFormCueTriggers([...formCueTriggers, newTriggerInput.trim()]);
                        setNewTriggerInput('');
                      }
                    }}
                    className="px-3 py-2 bg-[#1C1C1C] text-white border border-[#333] rounded-lg text-xs font-mono uppercase font-bold"
                  >
                    ADD
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {formCueTriggers.map((t, idx) => (
                    <span key={idx} className="bg-[#1C1C1C] border border-[#333] text-cyan-300 text-[11px] font-mono px-2 py-0.5 rounded flex items-center gap-1">
                      #{t}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-red-400"
                        onClick={() => setFormCueTriggers(formCueTriggers.filter((_, i) => i !== idx))}
                      />
                    </span>
                  ))}
                </div>
              </div>

              {/* Substitute Routine */}
              <div>
                <label className="text-[10px] font-mono text-[#A3A3A3] mb-1 block uppercase">
                  REPLACEMENT ROUTINE ("IF CUE STRIKES, THEN I WILL IMMEDIATELY...")
                </label>
                <textarea
                  value={formSubstitute}
                  onChange={(e) => setFormSubstitute(e.target.value)}
                  placeholder="e.g. Do 20 pushups + drink 500ml ice cold water + do 10 deep breaths"
                  rows={2}
                  className="w-full bg-[#141414] border border-[#262626] rounded-lg p-3 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Friction Barrier */}
              <div>
                <label className="text-[10px] font-mono text-[#A3A3A3] mb-1 block uppercase">
                  FRICTION AMPLIFICATION (HOW WILL YOU MAKE EXECUTING IT NEARLY IMPOSSIBLE?)
                </label>
                <textarea
                  value={formFriction}
                  onChange={(e) => setFormFriction(e.target.value)}
                  placeholder="e.g. Delete apps, lock wallet with partner, place phone in kitchen at 10 PM"
                  rows={2}
                  className="w-full bg-[#141414] border border-[#262626] rounded-lg p-3 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Non-Negotiable Contract */}
              <div>
                <label className="text-[10px] font-mono text-amber-400 mb-1 block uppercase">
                  SIGNED NON-NEGOTIABLE CONTRACT / DECLARATION OF IDENTITY
                </label>
                <input
                  type="text"
                  value={formContract}
                  onChange={(e) => setFormContract(e.target.value)}
                  placeholder="I solemnly vow to protect my physical vessel and neuro-focus..."
                  className="w-full bg-[#141414] border border-amber-900/50 rounded-lg p-3 text-amber-200 font-mono text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

            </div>

            <div className="p-4 border-t border-[#262626] bg-[#0E0E0E] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2.5 bg-[#1A1A1A] hover:bg-[#262626] text-[#A3A3A3] font-mono text-xs uppercase font-bold rounded-lg"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleSaveHabit}
                className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-bold uppercase rounded-lg shadow-md transition-all"
              >
                {editingHabit ? 'SAVE CHANGES' : 'ACTIVATE PROTOCOL'}
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

      {/* MODAL: UNBLOCKABLE CUSTOM DELETE CONFIRMATION MODAL */}
      {deletingHabit && createPortal(
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0A0A0A] border-2 border-red-600 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center gap-3 border-b border-red-900/50 pb-3">
              <AlertTriangle className="w-6 h-6 text-red-500 animate-bounce" />
              <h3 className="text-base font-mono font-bold text-white uppercase tracking-wider">
                ERASE PROTOCOL CONFIRMATION
              </h3>
            </div>

            <div className="space-y-2 font-mono text-xs text-[#AAA]">
              <p>
                Are you sure you want to permanently delete the habit eradication protocol:
              </p>
              <p className="font-bold text-white bg-[#141414] p-3 rounded border border-[#333] text-sm text-cyan-400">
                "{deletingHabit.title}"
              </p>
              <p className="text-[11px] text-red-400">
                This will delete all associated clean streak records and urge logs. This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#222]">
              <button
                type="button"
                onClick={() => setDeletingHabit(null)}
                className="px-4 py-2.5 bg-[#1A1A1A] hover:bg-[#262626] text-[#AAA] font-mono text-xs uppercase font-bold rounded-lg"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={confirmDeleteHabit}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase rounded-lg shadow-lg flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" /> ERASE PERMANENTLY
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL 2: URGE SOS / URGE SURFING EMERGENCY OVERLAY */}
      {sosActiveHabit && createPortal(
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-6 bg-black/95 backdrop-blur-xl animate-fadeIn">
          <div className="bg-[#0A0A0A] border-2 border-red-600/80 rounded-xl max-w-2xl w-full max-h-[95vh] flex flex-col shadow-[0_0_50px_rgba(239,68,68,0.3)] overflow-hidden relative">
            
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-red-900/50 bg-red-950/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <HeartPulse className="w-6 h-6 text-red-500 animate-pulse" />
                <div>
                  <h2 className="text-base sm:text-lg font-mono font-black text-white uppercase tracking-wider">
                    URGE SURFING EMERGENCY INTERCEPT
                  </h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-mono text-red-300 uppercase">
                      ACTIVE HABIT:
                    </span>
                    {activeHabitsList.length > 1 ? (
                      <select
                        value={sosActiveHabit.id}
                        onChange={(e) => {
                          const found = activeHabitsList.find(h => h.id === Number(e.target.value));
                          if (found) launchSOS(found);
                        }}
                        className="bg-[#1C1C1C] text-cyan-300 font-mono text-xs border border-red-800 rounded px-2 py-0.5"
                      >
                        {activeHabitsList.map(h => (
                          <option key={h.id} value={h.id}>{h.title}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-xs font-mono font-bold text-cyan-300 uppercase">
                        {sosActiveHabit.title}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSosActiveHabit(null)}
                className="p-1.5 text-[#888] hover:text-white bg-[#1A1A1A] rounded-lg border border-[#333]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
              
              {/* Phase Tabs */}
              <div className="flex border-b border-[#222]">
                <button
                  type="button"
                  onClick={() => setSosPhase('grounding')}
                  className={cn(
                    "flex-1 py-2 text-xs font-mono font-bold uppercase border-b-2 transition-all",
                    sosPhase === 'grounding' ? "border-red-500 text-red-400" : "border-transparent text-[#666]"
                  )}
                >
                  1. GROUNDING
                </button>
                <button
                  type="button"
                  onClick={() => setSosPhase('surfing')}
                  className={cn(
                    "flex-1 py-2 text-xs font-mono font-bold uppercase border-b-2 transition-all",
                    sosPhase === 'surfing' ? "border-cyan-500 text-cyan-400" : "border-transparent text-[#666]"
                  )}
                >
                  2. URGE SURFING WAVE
                </button>
                <button
                  type="button"
                  onClick={() => setSosPhase('action')}
                  className={cn(
                    "flex-1 py-2 text-xs font-mono font-bold uppercase border-b-2 transition-all",
                    sosPhase === 'action' ? "border-emerald-500 text-emerald-400" : "border-transparent text-[#666]"
                  )}
                >
                  3. SUBSTITUTE ACTION
                </button>
              </div>

              {/* PHASE 1: GROUNDING CHECKLIST */}
              {sosPhase === 'grounding' && (
                <div className="space-y-4">
                  <div className="bg-[#141414] border border-[#222] p-4 rounded-lg space-y-2">
                    <span className="text-[10px] font-mono text-red-400 uppercase font-bold block">SENSORY GROUNDING STEP {groundingStep + 1} OF 5</span>
                    <p className="text-sm font-mono text-white leading-relaxed font-bold">
                      {groundingChecklist[groundingStep]}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-2">
                    <button
                      type="button"
                      disabled={groundingStep === 0}
                      onClick={() => setGroundingStep(prev => prev - 1)}
                      className="px-4 py-2 bg-[#1A1A1A] disabled:opacity-30 text-white font-mono text-xs uppercase font-bold rounded-lg"
                    >
                      PREVIOUS
                    </button>
                    {groundingStep < 4 ? (
                      <button
                        type="button"
                        onClick={() => setGroundingStep(prev => prev + 1)}
                        className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase rounded-lg shadow-md"
                      >
                        NEXT GROUNDING STEP →
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setSosPhase('surfing');
                          setSurfTimerRunning(true);
                        }}
                        className="px-6 py-2.5 bg-cyan-500 text-black font-mono text-xs font-bold uppercase rounded-lg shadow-md"
                      >
                        START 10-MIN URGE SURFING WAVE →
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* PHASE 2: URGE SURFING TIMER & BOX BREATHING */}
              {sosPhase === 'surfing' && (
                <div className="space-y-6 text-center">
                  <div>
                    <span className="text-xs font-mono text-cyan-400 uppercase font-bold tracking-widest block mb-1">
                      10-MINUTE WAVE DECAY TIMER
                    </span>
                    <div className="text-4xl md:text-5xl font-mono font-black text-white tracking-widest my-2">
                      {Math.floor(surfSecondsLeft / 60)}:{String(surfSecondsLeft % 60).padStart(2, '0')}
                    </div>
                    <p className="text-[11px] font-mono text-[#888]">
                      Cravings are dopamine waves that peak within 3-5 minutes and decay naturally. Surf the wave without reacting.
                    </p>
                  </div>

                  {/* Breathing Circle Indicator */}
                  <div className="py-4">
                    <div className={cn(
                      "w-32 h-32 rounded-full mx-auto border-4 flex flex-col items-center justify-center transition-all duration-1000",
                      breathState === 'Inhale' ? "scale-110 border-cyan-400 bg-cyan-950/40" :
                      breathState === 'Hold' ? "scale-110 border-amber-400 bg-amber-950/40" :
                      breathState === 'Exhale' ? "scale-95 border-indigo-400 bg-indigo-950/40" :
                      "scale-90 border-emerald-400 bg-emerald-950/40"
                    )}>
                      <Wind className="w-8 h-8 text-white mb-1 animate-pulse" />
                      <span className="text-xs font-mono font-black text-white uppercase">{breathState}</span>
                      <span className="text-[9px] font-mono text-[#AAA]">4 SECONDS</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSurfTimerRunning(!surfTimerRunning)}
                      className="px-5 py-2.5 bg-[#1C1C1C] border border-[#333] hover:border-cyan-400 text-white font-mono text-xs uppercase font-bold rounded-lg flex items-center gap-1.5"
                    >
                      {surfTimerRunning ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-cyan-400" />}
                      {surfTimerRunning ? 'PAUSE TIMER' : 'START WAVE TIMER'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSosPhase('action')}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs uppercase font-bold rounded-lg"
                    >
                      EXECUTE SUBSTITUTE ACTION →
                    </button>
                  </div>
                </div>
              )}

              {/* PHASE 3: SUBSTITUTE ACTION & OATH */}
              {sosPhase === 'action' && (
                <div className="space-y-4">
                  <div className="bg-[#141414] border border-cyan-500/40 p-4 rounded-lg space-y-2">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase block">
                      YOUR PRE-PROGRAMMED REPLACEMENT ROUTINE
                    </span>
                    <p className="text-sm font-mono font-bold text-white leading-relaxed">
                      {sosActiveHabit.substituteBehavior || 'Execute 20 pushups and drink 500ml ice cold water immediately.'}
                    </p>
                  </div>

                  {sosActiveHabit.nonNegotiableContract && (
                    <div className="bg-[#141414] border border-amber-900/50 p-4 rounded-lg space-y-1 text-xs font-mono text-amber-200">
                      <span className="text-[10px] uppercase font-bold text-amber-400 block">YOUR SIGNED CONTRACT</span>
                      <p className="italic">"{sosActiveHabit.nonNegotiableContract}"</p>
                    </div>
                  )}

                  <div className="pt-4 border-t border-[#222] flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => completeSOS('surfed_urge')}
                      className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold uppercase rounded-lg shadow-lg flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4 stroke-[3]" /> I SURFED THE URGE (+100 XP)
                    </button>
                    <button
                      type="button"
                      onClick={() => completeSOS('used_substitute')}
                      className="flex-1 py-3 bg-cyan-600 hover:bg-cyan-500 text-black font-mono text-xs font-bold uppercase rounded-lg shadow-lg flex items-center justify-center gap-2"
                    >
                      <Zap className="w-4 h-4 fill-black" /> EXECUTED SUBSTITUTE (+75 XP)
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>,
        document.body
      )}

      {/* MODAL 3: QUICK LOG URGE MODAL */}
      {quickLogHabit && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0A0A0A] border-2 border-[#333] rounded-xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#262626] pb-3">
              <h3 className="text-base font-mono font-bold text-white uppercase flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400" /> LOG URGE / CRAVING
              </h3>
              <button type="button" onClick={() => setQuickLogHabit(null)} className="text-[#888] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-[10px] text-[#A3A3A3] uppercase block mb-1">CRAVING INTENSITY (1 TO 10): {urgeIntensity}</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={urgeIntensity}
                  onChange={(e) => setUrgeIntensity(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#A3A3A3] uppercase block mb-1">SPECIFIC TRIGGER / CUE</label>
                <input
                  type="text"
                  value={urgeTrigger}
                  onChange={(e) => setUrgeTrigger(e.target.value)}
                  placeholder="e.g. Work deadline stress, saw advertisement, late night boredom"
                  className="w-full bg-[#141414] border border-[#262626] rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#A3A3A3] uppercase block mb-1">ACTION TAKEN</label>
                <select
                  value={urgeAction}
                  onChange={(e) => setUrgeAction(e.target.value as any)}
                  className="w-full bg-[#141414] border border-[#262626] rounded-lg p-2.5 text-white uppercase"
                >
                  <option value="surfed_urge">SURFED THE URGE (RESISTED SUCCESSFULLY)</option>
                  <option value="used_substitute">USED REPLACEMENT ROUTINE</option>
                  <option value="relapsed">RELAPSED / GAVE IN (TRIGGER RESET)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-[#A3A3A3] uppercase block mb-1">NOTES / REFLECTION (OPTIONAL)</label>
                <textarea
                  value={urgeNotes}
                  onChange={(e) => setUrgeNotes(e.target.value)}
                  placeholder="How are you feeling? What helped you overcome it?"
                  rows={2}
                  className="w-full bg-[#141414] border border-[#262626] rounded-lg p-2.5 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#222]">
              <button
                type="button"
                onClick={() => setQuickLogHabit(null)}
                className="px-4 py-2 bg-[#1A1A1A] text-[#888] font-mono text-xs uppercase rounded-lg"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleSaveUrgeLog}
                className="px-5 py-2 bg-cyan-500 text-black font-mono text-xs font-bold uppercase rounded-lg"
              >
                SAVE LOG
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL 4: RELAPSE POST-MORTEM RESET MODAL */}
      {relapseHabit && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0A0A0A] border-2 border-red-800 rounded-xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-red-900/50 pb-3">
              <h3 className="text-base font-mono font-bold text-red-400 uppercase flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-red-500" /> RELAPSE POST-MORTEM ANALYSIS
              </h3>
              <button type="button" onClick={() => setRelapseHabit(null)} className="text-[#888] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs font-mono text-[#AAA] leading-relaxed">
              A relapse is data, not a failure. Identify what broke through your friction barrier so you can adapt your protocol and emerge stronger.
            </p>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-[10px] text-red-400 uppercase block mb-1">WHAT EXACT TRIGGER BROKE YOUR BARRIER?</label>
                <input
                  type="text"
                  value={relapseTrigger}
                  onChange={(e) => setRelapseTrigger(e.target.value)}
                  placeholder="e.g. Alcohol at party lowered inhibitions, kept vape in car"
                  className="w-full bg-[#141414] border border-[#262626] rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-[10px] text-emerald-400 uppercase block mb-1">WHAT NEW FRICTION WILL YOU ADD TO PREVENT THIS?</label>
                <input
                  type="text"
                  value={relapseNewFriction}
                  onChange={(e) => setRelapseNewFriction(e.target.value)}
                  placeholder="e.g. Block credit card for late night delivery, throw out backup device"
                  className="w-full bg-[#141414] border border-[#262626] rounded-lg p-2.5 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#222]">
              <button
                type="button"
                onClick={() => setRelapseHabit(null)}
                className="px-4 py-2 bg-[#1A1A1A] text-[#888] font-mono text-xs uppercase rounded-lg"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleConfirmRelapse}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase rounded-lg shadow-md"
              >
                RESET STREAK & DEPLOY NEW FRICTION
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL 5: URGE HISTORY MODAL */}
      {showHistoryModal && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0A0A0A] border-2 border-[#333] rounded-xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden relative">
            <div className="p-4 border-b border-[#262626] bg-[#111] flex items-center justify-between">
              <h3 className="text-base font-mono font-bold text-white uppercase flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400" /> HISTORICAL URGE LOGS ({urgeLogs.length})
              </h3>
              <button type="button" onClick={() => setShowHistoryModal(false)} className="text-[#888] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto custom-scrollbar flex-1 space-y-2 font-mono text-xs">
              {urgeLogs.length === 0 ? (
                <div className="text-center py-8 text-[#666]">No urge logs recorded yet.</div>
              ) : (
                [...urgeLogs].reverse().map((log) => {
                  const habitObj = badHabits.find(h => h.id === log.habitId);
                  return (
                    <div key={log.id} className="bg-[#141414] border border-[#222] p-3 rounded-lg flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] text-cyan-400 font-bold uppercase">{habitObj?.title || 'Habit Protocol'}</span>
                          <span className="text-[10px] text-[#666]">{new Date(log.timestamp).toLocaleString()}</span>
                        </div>
                        <p className="text-white">Trigger: <span className="text-cyan-300">{log.trigger}</span></p>
                        {log.notes && <p className="text-[11px] text-[#888] mt-0.5">{log.notes}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-bold uppercase whitespace-nowrap",
                          log.actionTaken === 'relapsed' ? "bg-red-950 text-red-400 border border-red-900" : "bg-emerald-950 text-emerald-400 border border-emerald-900"
                        )}>
                          INTENSITY {log.intensity}/10 • {log.actionTaken.replace('_', ' ')}
                        </span>
                        {log.id && (
                          <button
                            type="button"
                            onClick={() => handleDeleteUrgeLog(log.id!)}
                            className="p-1 text-[#666] hover:text-red-400 transition-colors"
                            title="Delete log entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-3 border-t border-[#262626] bg-[#0E0E0E] flex justify-end">
              <button type="button" onClick={() => setShowHistoryModal(false)} className="px-4 py-2 bg-[#1A1A1A] text-[#AAA] font-mono text-xs uppercase rounded-lg">
                CLOSE
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL 6: SHAREABLE OATH CERTIFICATE MODAL */}
      {shareOathHabit && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0A0A0A] border-2 border-amber-600/70 rounded-xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-amber-900/40 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6 text-amber-400" />
                <h3 className="text-base font-mono font-bold text-amber-300 uppercase tracking-wider">
                  NON-NEGOTIABLE OATH CERTIFICATE
                </h3>
              </div>
              <button type="button" onClick={() => setShareOathHabit(null)} className="text-[#888] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#121212] border border-amber-900/50 p-5 rounded-xl space-y-4 font-mono text-xs text-amber-100/90 text-center relative">
              <span className="text-[9px] text-amber-500 font-bold uppercase tracking-widest block">
                OFFICIAL RESTRAINT COVENANT
              </span>

              <h2 className="text-xl font-black text-white uppercase tracking-wide">
                {shareOathHabit.title}
              </h2>

              <blockquote className="text-sm italic font-bold text-amber-200 bg-[#0A0A0A] p-3 rounded-lg border border-amber-900/30">
                "{shareOathHabit.nonNegotiableContract || 'I solemnly swear to maintain total restraint and master this vice.'}"
              </blockquote>

              <div className="grid grid-cols-2 gap-2 text-left text-[10px] pt-2 border-t border-[#222]">
                <div>
                  <span className="text-[#888] block uppercase">CLEAN RECORD:</span>
                  <span className="text-emerald-400 font-bold text-xs">{shareOathHabit.cleanDays} CLEAN DAYS</span>
                </div>
                <div>
                  <span className="text-[#888] block uppercase">REPLACEMENT ROUTINE:</span>
                  <span className="text-cyan-300 font-bold">{shareOathHabit.substituteBehavior || 'IF-THEN Protocol Active'}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#222]">
              <button
                type="button"
                onClick={() => {
                  const certText = `NON-NEGOTIABLE OATH: I am ${shareOathHabit.cleanDays} days clean from "${shareOathHabit.title}". Oath: "${shareOathHabit.nonNegotiableContract || 'Restraint maintained.'}"`;
                  navigator.clipboard.writeText(certText);
                  toast.success('OATH CERTIFICATE COPIED TO CLIPBOARD!');
                }}
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-black font-mono text-xs font-bold uppercase rounded-lg shadow-lg flex items-center justify-center gap-2"
              >
                <Copy className="w-4 h-4" /> COPY SHAREABLE OATH CERTIFICATE
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
