import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, addXp, logSystemEvent } from '../db/db';
import { cn, getRank } from '../lib/utils';
import { 
  Dumbbell, Play, CheckCircle, Clock, Flame, Plus, Trash2, Award, 
  Sparkles, RotateCcw, BarChart3, ChevronRight, ChevronLeft, Save, 
  Layers, Search, Filter, Calendar, Zap, Check, ArrowRight, Activity, ShieldAlert, HeartPulse, Scale, UserCheck,
  BookOpen, Info, X, Target, ShieldCheck, CheckSquare, Dumbbell as GymIcon, Cpu, RefreshCw, HelpCircle, Sliders
} from 'lucide-react';
import { format, subDays } from 'date-fns';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { 
  BUILT_IN_WORKOUT_PROGRAMS, 
  ExerciseItem, 
  WorkoutDayItem, 
  WorkoutPlanItem,
  enrichExercise,
  scaleExerciseForWeek,
  MASTER_EXERCISE_GUIDES,
  ExerciseOverloadRecord
} from '../data/workoutPrograms';

export type { ExerciseItem, WorkoutDayItem, WorkoutPlanItem };

export function TrainingView() {
  const userStats = useLiveQuery(() => db.userStats.get(1));
  const latestVessel = useLiveQuery(() => db.vesselLogs.orderBy('id').last());

  const today = React.useMemo(() => format(new Date(), 'yyyy-MM-dd'), []);

  const last7Days = React.useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => format(subDays(new Date(), i), 'yyyy-MM-dd')).reverse();
  }, []);

  const recentExerciseLogs = useLiveQuery(
    () => db.nutritionLogs
      .where('date').anyOf(last7Days)
      .filter(log => log.type === 'exercise')
      .toArray(),
    [last7Days]
  );

  // User Weight & Height State
  const [userWeightKg, setUserWeightKg] = useState<number>(75);
  const [userHeightCm, setUserHeightCm] = useState<number>(175);
  const [isSyncedWithProfile, setIsSyncedWithProfile] = useState<boolean>(true);

  // Exercise Execution Guide Modal State
  const [guideExercise, setGuideExercise] = useState<ExerciseItem | null>(null);

  // Smart AI Trainer Interactive Topics State
  const [smartCoachTopic, setSmartCoachTopic] = useState<'scaling' | 'knee_safety' | 'progression' | 'breathing' | null>(null);

  // Week Selector State for Long-Term Programs (1 to 2 Months)
  const [selectedWeek, setSelectedWeek] = useState<number>(() => {
    const saved = localStorage.getItem('user_training_selected_week');
    return saved ? Math.max(1, Math.min(8, Number(saved))) : 1;
  });

  // Fitness Experience Level State for Progressive Load Customization
  const [experienceLevel, setExperienceLevel] = useState<'beginner' | 'intermediate' | 'advanced'>(() => {
    const saved = localStorage.getItem('user_experience_level');
    if (saved === 'intermediate' || saved === 'advanced') return saved;
    return 'beginner';
  });

  // Progressive Overload Completion History & Editable Difficulty State
  const [exerciseOverloadMap, setExerciseOverloadMap] = useState<Record<string, ExerciseOverloadRecord>>(() => {
    try {
      const saved = localStorage.getItem('user_exercise_overload_tracker');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const [globalDifficultyMultiplier, setGlobalDifficultyMultiplier] = useState<number>(() => {
    const saved = localStorage.getItem('user_global_difficulty_multiplier');
    return saved ? Math.max(0.4, Math.min(3.0, Number(saved))) : 1.0;
  });

  const [editingExerciseName, setEditingExerciseName] = useState<string | null>(null);

  const handleSetGlobalDifficultyMultiplier = (val: number) => {
    const clean = Math.max(0.4, Math.min(3.0, Number(val.toFixed(2))));
    setGlobalDifficultyMultiplier(clean);
    localStorage.setItem('user_global_difficulty_multiplier', String(clean));
  };

  const handleUpdateExerciseOverload = (exName: string, updates: Partial<ExerciseOverloadRecord>) => {
    const key = exName.toUpperCase();
    setExerciseOverloadMap(prev => {
      const current = prev[key] || { completionsCount: 0, userMultiplier: 1.0, userExtraSets: 0, userExtraReps: 0 };
      const updated = { ...current, ...updates };
      const newMap = { ...prev, [key]: updated };
      localStorage.setItem('user_exercise_overload_tracker', JSON.stringify(newMap));
      return newMap;
    });
  };

  const handleResetAllOverload = () => {
    if (confirm("Reset all progressive overload completion history and custom exercise difficulty settings?")) {
      setExerciseOverloadMap({});
      setGlobalDifficultyMultiplier(1.0);
      localStorage.removeItem('user_exercise_overload_tracker');
      localStorage.removeItem('user_global_difficulty_multiplier');
    }
  };

  const getScaledExercise = React.useCallback((exRaw: ExerciseItem) => {
    const overloadRecord = exerciseOverloadMap[exRaw.name.toUpperCase()];
    return scaleExerciseForWeek(
      exRaw,
      selectedWeek,
      experienceLevel,
      overloadRecord,
      globalDifficultyMultiplier
    );
  }, [exerciseOverloadMap, selectedWeek, experienceLevel, globalDifficultyMultiplier]);

  const handleSetExperienceLevel = (lvl: 'beginner' | 'intermediate' | 'advanced') => {
    setExperienceLevel(lvl);
    localStorage.setItem('user_experience_level', lvl);
  };

  const handleSetSelectedWeek = (w: number) => {
    setSelectedWeek(w);
    localStorage.setItem('user_training_selected_week', String(w));
  };

  // Sync state automatically when userStats or latestVessel changes
  useEffect(() => {
    let weightVal = 75;
    let heightVal = 175;

    if (latestVessel?.weight) {
      weightVal = latestVessel.weight;
    } else if (userStats?.weight) {
      weightVal = userStats.weight;
    } else {
      const saved = localStorage.getItem('user_body_weight_kg');
      if (saved) weightVal = Number(saved);
    }

    if (userStats?.height) {
      heightVal = userStats.height;
    } else {
      const saved = localStorage.getItem('user_body_height_cm');
      if (saved) heightVal = Number(saved);
    }

    setUserWeightKg(weightVal);
    setUserHeightCm(heightVal);
  }, [userStats?.height, userStats?.weight, latestVessel?.weight]);

  const [userPrimaryGoal, setUserPrimaryGoal] = useState<'all' | 'fat_loss' | 'muscle_gain' | 'strength' | 'calisthenics' | 'joint_care'>(() => {
    const saved = localStorage.getItem('user_primary_training_goal');
    return (saved as any) || 'all';
  });

  // Equipment Filter State
  const [equipmentFilter, setEquipmentFilter] = useState<'all' | 'no_equipment' | 'home_gym' | 'full_gym'>('all');

  // Calculate BMI
  const bmi = React.useMemo(() => {
    const hM = userHeightCm / 100;
    if (hM <= 0) return 22;
    return Number((userWeightKg / (hM * hM)).toFixed(1));
  }, [userWeightKg, userHeightCm]);

  // Determine Body Compatibility Category
  const bodyTypeCategory = React.useMemo(() => {
    if (bmi < 19) return { label: 'Slim Build / Skinny', recommendGoal: 'muscle_gain', desc: 'Higher calorie hypertrophy and mass-gainer compounds recommended.' };
    if (bmi >= 19 && bmi < 25) return { label: 'Athletic / Normal Weight', recommendGoal: 'strength', desc: 'Ideal for strength, calisthenics, or muscle hypertrophy.' };
    if (bmi >= 25 && bmi < 30) return { label: 'Overweight / Metabolic Shred', recommendGoal: 'fat_loss', desc: 'High-density metabolic conditioning & fat burn recommended.' };
    return { label: 'Dense Body Weight / Heavy', recommendGoal: 'joint_care', desc: 'Low-impact joint protective conditioning & calorie shred recommended.' };
  }, [bmi]);

  // Handle Weight & Height Updates
  const handleUpdateWeight = async (val: number) => {
    setUserWeightKg(val);
    localStorage.setItem('user_body_weight_kg', String(val));
    try {
      await db.userStats.update(1, { weight: val });
      await db.vesselLogs.add({
        date: today,
        weight: val,
        energyLevel: 8,
        sleepHours: 8,
        notes: 'Updated via Training View metrics sync'
      });
      setIsSyncedWithProfile(true);
      logSystemEvent('VESSEL', 'INFO', `Auto-synced body weight to ${val}kg`);
    } catch (e) {
      console.error('Failed to sync weight to userStats:', e);
    }
  };

  const handleUpdateHeight = async (val: number) => {
    setUserHeightCm(val);
    localStorage.setItem('user_body_height_cm', String(val));
    try {
      await db.userStats.update(1, { height: val });
      setIsSyncedWithProfile(true);
      logSystemEvent('VESSEL', 'INFO', `Auto-synced height to ${val}cm`);
    } catch (e) {
      console.error('Failed to sync height to userStats:', e);
    }
  };

  const handleUpdateGoal = (goal: 'all' | 'fat_loss' | 'muscle_gain' | 'strength' | 'calisthenics' | 'joint_care') => {
    setUserPrimaryGoal(goal);
    localStorage.setItem('user_primary_training_goal', goal);
  };

  // LAYERS SYSTEM
  const [activeLayer, setActiveLayer] = useState<'programs' | 'schedule' | 'execute' | 'builder' | 'analytics'>('programs');

  // Saved Custom Workout Plans
  const [customPlans, setCustomPlans] = useState<any[]>(() => {
    const saved = localStorage.getItem('custom_workout_plans');
    return saved ? JSON.parse(saved) : [];
  });

  const allPlans: WorkoutPlanItem[] = [
    ...BUILT_IN_WORKOUT_PROGRAMS,
    ...customPlans.map(cp => ({
      ...cp,
      targetGoal: cp.targetGoal || 'fat_loss',
      recommendedBodyType: cp.recommendedBodyType || 'Custom Plan',
      compatibilityNote: cp.compatibilityNote || 'Personalized custom workout',
      days: cp.days || [{ dayNumber: 1, title: 'DAY 1 ROUTINE', muscleFocus: cp.area || 'Custom', exercises: cp.exercises || [] }]
    }))
  ];

  const [selectedPlanId, setSelectedPlanId] = useState<string>(allPlans[0].id);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);

  // Search Filter
  const [searchQuery, setSearchQuery] = useState('');

  // Filter plans by Goal, Search, and Equipment
  const filteredPlans = allPlans.filter(plan => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = plan.name.toLowerCase().includes(q) ||
                          plan.area.toLowerCase().includes(q) ||
                          plan.equipment.toLowerCase().includes(q) ||
                          plan.description.toLowerCase().includes(q);

    const matchesGoal = userPrimaryGoal === 'all' || plan.targetGoal === userPrimaryGoal;

    let matchesEquipment = true;
    if (equipmentFilter === 'no_equipment') {
      matchesEquipment = plan.equipment === 'No Equipment';
    } else if (equipmentFilter === 'home_gym') {
      matchesEquipment = plan.equipment.includes('Dumbbell') || plan.equipment.includes('Band') || plan.equipment.includes('Home');
    } else if (equipmentFilter === 'full_gym') {
      matchesEquipment = plan.equipment.includes('Barbell') || plan.equipment.includes('Gym') || plan.equipment.includes('Cable') || plan.equipment.includes('Machine');
    }

    return matchesSearch && matchesGoal && matchesEquipment;
  });

  // Active Workout Session State
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [activePlan, setActivePlan] = useState<WorkoutPlanItem | null>(null);
  const [activeDay, setActiveDay] = useState<WorkoutDayItem | null>(null);
  const [workoutSeconds, setWorkoutSeconds] = useState(0);

  // Set Tracking State
  const [completedSets, setCompletedSets] = useState<Record<number, Array<{ weight: number; reps: number; completed: boolean }>>>({});

  // Rest Timer State
  const [restSeconds, setRestSeconds] = useState(0);
  const [isResting, setIsResting] = useState(false);

  // Completion Modal State
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [summaryData, setSummaryData] = useState<{ totalVolume: number; totalCalories: number; totalXp: number; duration: number } | null>(null);

  // Custom Plan Builder State
  const [newPlanName, setNewPlanName] = useState('');
  const [newPlanArea, setNewPlanArea] = useState('');
  const [newPlanDesc, setNewPlanDesc] = useState('');
  const [newPlanGoal, setNewPlanGoal] = useState<'fat_loss' | 'muscle_gain' | 'strength' | 'calisthenics' | 'joint_care'>('fat_loss');
  const [builderExercises, setBuilderExercises] = useState<ExerciseItem[]>([]);
  const [exName, setExName] = useState('');
  const [exCals, setExCals] = useState('');
  const [exDur, setExDur] = useState('');
  const [exMuscle, setExMuscle] = useState<'chest' | 'back' | 'legs' | 'arms' | 'shoulders' | 'core' | 'cardio'>('chest');
  const [exSets, setExSets] = useState('3');
  const [exReps, setExReps] = useState('10');

  // Workout Timer Effect
  useEffect(() => {
    let timer: any = null;
    if (isWorkoutActive) {
      timer = setInterval(() => {
        setWorkoutSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isWorkoutActive]);

  // Rest Timer Effect
  useEffect(() => {
    let restTimer: any = null;
    if (isResting && restSeconds > 0) {
      restTimer = setInterval(() => {
        setRestSeconds(prev => {
          if (prev <= 1) {
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(restTimer);
  }, [isResting, restSeconds]);

  if (!userStats) return <div className="p-6 font-mono text-[#A3A3A3] uppercase">Loading Training Engine...</div>;

  const level = Math.floor((userStats.xp || 0) / 1000) + 1;
  const rankColor = getRank(level).color;
  const themeColor = userStats?.selectedColor || rankColor;

  const currentSelectedPlan = allPlans.find(p => p.id === selectedPlanId) || allPlans[0];
  const safeSelectedDayIndex = selectedDayIndex >= (currentSelectedPlan?.days?.length || 0) ? 0 : selectedDayIndex;
  const currentSelectedDay = currentSelectedPlan?.days[safeSelectedDayIndex] || currentSelectedPlan?.days[0];

  // Calculate Compatibility Match Score for a plan
  const getCompatibilityMatch = (plan: WorkoutPlanItem) => {
    const isBodyMatch = plan.targetGoal === bodyTypeCategory.recommendGoal;
    const profileGoal = userStats?.fitnessGoal || 'maintain';
    const isUserGoalMatch = (profileGoal === 'lose' && plan.targetGoal === 'fat_loss') ||
                            (profileGoal === 'build' && plan.targetGoal === 'muscle_gain') ||
                            (profileGoal === 'maintain' && (plan.targetGoal === 'strength' || plan.targetGoal === 'calisthenics'));

    if (isBodyMatch && isUserGoalMatch) {
      return { score: 99, badge: '🔥 PERFECT MATCH', color: 'text-emerald-400 bg-emerald-950 border-emerald-500' };
    }
    if (isBodyMatch) {
      return { score: 95, badge: '💪 BODY RECOMMENDED', color: 'text-cyan-400 bg-cyan-950 border-cyan-500' };
    }
    if (isUserGoalMatch) {
      return { score: 90, badge: '🎯 TARGET MATCH', color: 'text-indigo-400 bg-indigo-950 border-indigo-500' };
    }
    return { score: 80, badge: '⚡ SUITABLE', color: 'text-amber-400 bg-amber-950 border-amber-600' };
  };

  // Start Workout Day
  const handleStartWorkoutDay = (plan: WorkoutPlanItem, dayIdx: number) => {
    const dayToRun = plan.days[dayIdx] || plan.days[0];
    setActivePlan(plan);
    setActiveDay(dayToRun);
    setWorkoutSeconds(0);
    setIsWorkoutActive(true);
    setIsResting(false);

    // Initialize set tracker with progressive week, completion history, and experience level scaling
    const initialSets: Record<number, Array<{ weight: number; reps: number; completed: boolean }>> = {};
    dayToRun.exercises.forEach((ex, idx) => {
      const scaledEx = getScaledExercise(ex);
      const numSets = scaledEx.scaledSets || 3;
      initialSets[idx] = Array.from({ length: numSets }, () => ({
        weight: 0,
        reps: scaledEx.scaledReps || 10,
        completed: false
      }));
    });

    setCompletedSets(initialSets);
    setActiveLayer('execute');
    logSystemEvent('WORKOUT', 'INFO', `Started: ${plan.name} - ${dayToRun.title}`);
  };

  const handleToggleSetComplete = (exIdx: number, setIdx: number) => {
    setCompletedSets(prev => {
      const updatedEx = [...(prev[exIdx] || [])];
      const isNowCompleted = !updatedEx[setIdx].completed;
      updatedEx[setIdx] = { ...updatedEx[setIdx], completed: isNowCompleted };

      if (isNowCompleted) {
        setRestSeconds(60);
        setIsResting(true);
      }

      return { ...prev, [exIdx]: updatedEx };
    });
  };

  const handleUpdateSetInput = (exIdx: number, setIdx: number, field: 'weight' | 'reps', value: number) => {
    setCompletedSets(prev => {
      const updatedEx = [...(prev[exIdx] || [])];
      updatedEx[setIdx] = { ...updatedEx[setIdx], [field]: value };
      return { ...prev, [exIdx]: updatedEx };
    });
  };

  const handleAddSet = (exIdx: number) => {
    setCompletedSets(prev => {
      const sets = prev[exIdx] || [];
      const lastWeight = sets.length > 0 ? sets[sets.length - 1].weight : 0;
      const targetReps = activeDay?.exercises[exIdx]?.targetReps || 10;
      const updated = [...sets, { weight: lastWeight, reps: targetReps, completed: false }];
      return { ...prev, [exIdx]: updated };
    });
  };

  const handleFinishWorkout = async () => {
    if (!activePlan || !activeDay) return;

    setIsWorkoutActive(false);

    let totalVolume = 0;
    let totalCalories = 0;

    activeDay.exercises.forEach((ex, exIdx) => {
      const sets = completedSets[exIdx] || [];
      const completedCount = sets.filter(s => s.completed).length;

      if (completedCount > 0) {
        const exVolume = sets.reduce((sum, s) => s.completed ? sum + (s.weight * s.reps) : sum, 0);
        totalVolume += exVolume;
        totalCalories += (ex.calories || 100) * (completedCount / sets.length);
      }
    });

    totalCalories = Math.round(totalCalories || 200);
    const totalXp = Math.round(totalCalories * 2 + 300);

    // Progressive Overload Completion Engine: Automatically increase difficulty by +5% per completed session for completed exercises
    setExerciseOverloadMap(prev => {
      const updated = { ...prev };
      let hasChanges = false;

      activeDay.exercises.forEach((ex, exIdx) => {
        const sets = completedSets[exIdx] || [];
        const completedCount = sets.filter(s => s.completed).length;

        if (completedCount > 0) {
          const key = ex.name.toUpperCase();
          const currentRec = updated[key] || { completionsCount: 0, userMultiplier: 1.0, userExtraSets: 0, userExtraReps: 0 };
          updated[key] = {
            ...currentRec,
            completionsCount: (currentRec.completionsCount || 0) + 1
          };
          hasChanges = true;
        }
      });

      if (hasChanges) {
        localStorage.setItem('user_exercise_overload_tracker', JSON.stringify(updated));
      }
      return updated;
    });

    // Save logs to Dexie DB
    for (const ex of activeDay.exercises) {
      await db.nutritionLogs.add({
        date: today,
        type: 'exercise',
        name: `${ex.name} (${activePlan.name} - ${activeDay.title})`,
        calories: Math.round(ex.calories || 100),
        duration: ex.duration || 10,
        muscleGroup: ex.muscleGroup || 'legs'
      });
    }

    await addXp(totalXp, 'STR');
    await logSystemEvent('WORKOUT', 'SUCCESS', `Finished Workout: ${activeDay.title}`, `Volume: ${totalVolume}kg, Cals: ${totalCalories}, XP: +${totalXp}`);

    setSummaryData({
      totalVolume,
      totalCalories,
      totalXp,
      duration: workoutSeconds
    });
    setShowSummaryModal(true);
  };

  // Custom Plan Builder Functions
  const handleAddExerciseToBuilder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exName) return;

    const baseEx: ExerciseItem = {
      name: exName.toUpperCase(),
      calories: exCals ? Number(exCals) : 120,
      duration: exDur ? Number(exDur) : 10,
      muscleGroup: exMuscle,
      defaultSets: Number(exSets),
      targetReps: Number(exReps)
    };

    setBuilderExercises([...builderExercises, enrichExercise(baseEx)]);
    setExName('');
    setExCals('');
    setExDur('');
  };

  const handleSaveCustomPlan = () => {
    if (!newPlanName || builderExercises.length === 0) {
      alert("Please provide a plan name and at least 1 exercise.");
      return;
    }

    const createdPlan: WorkoutPlanItem = {
      id: `custom_${Date.now()}`,
      name: newPlanName.toUpperCase(),
      area: newPlanArea || 'Custom Routine',
      tag: 'Custom',
      equipment: 'Custom',
      targetGoal: newPlanGoal,
      recommendedBodyType: 'Personalized Custom Build',
      compatibilityNote: 'Tailored specifically by user.',
      description: newPlanDesc || 'Personalized custom workout program.',
      days: [
        {
          dayNumber: 1,
          title: 'DAY 1 ROUTINE',
          muscleFocus: newPlanArea || 'Custom Focus',
          exercises: builderExercises
        }
      ]
    };

    const updated = [...customPlans, createdPlan];
    setCustomPlans(updated);
    localStorage.setItem('custom_workout_plans', JSON.stringify(updated));

    setNewPlanName('');
    setNewPlanArea('');
    setNewPlanDesc('');
    setBuilderExercises([]);
    setSelectedPlanId(createdPlan.id);
    setSelectedDayIndex(0);
    setActiveLayer('programs');
  };

  const handleDeleteCustomPlan = (planId: string) => {
    const updated = customPlans.filter(p => p.id !== planId);
    setCustomPlans(updated);
    localStorage.setItem('custom_workout_plans', JSON.stringify(updated));
    setSelectedPlanId(BUILT_IN_WORKOUT_PROGRAMS[0].id);
    setSelectedDayIndex(0);
  };

  // Analytics Chart Data
  const muscleLoad: Record<string, number> = {
    chest: 0, back: 0, legs: 0, arms: 0, shoulders: 0, core: 0, cardio: 0
  };
  
  if (recentExerciseLogs) {
    recentExerciseLogs.forEach(log => {
      if (log.muscleGroup && muscleLoad[log.muscleGroup] !== undefined) {
        muscleLoad[log.muscleGroup] += log.duration ? log.duration : (log.calories / 10);
      }
    });
  }

  const chartData = Object.entries(muscleLoad).map(([muscle, load]) => ({
    name: muscle.toUpperCase(),
    load: Math.round(load)
  }));

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-12 px-2 sm:px-4">
      {/* Header & Training Hub Title */}
      <header className="border-b border-[#262626] pb-4 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-mono font-bold tracking-tight text-white flex items-center uppercase" style={{ color: themeColor }}>
              <Dumbbell className="w-6 h-6 mr-2.5 flex-shrink-0" />
              TRAINING & BODY COMPATIBILITY HUB
            </h2>
            <p className="text-[#A3A3A3] text-xs mt-1 font-mono uppercase tracking-wide truncate">
              Step-by-Step Training Layers • Tailored to Weight, BMI & Body Goals
            </p>
          </div>

          {/* Quick Layer Jump Buttons */}
          <div className="flex flex-wrap items-center bg-[#0A0A0A] p-1 border border-[#262626] rounded-md gap-1 max-w-full">
            <button
              onClick={() => setActiveLayer('programs')}
              className={cn(
                "px-2.5 py-1 text-xs font-mono font-bold uppercase tracking-wider rounded transition-all flex items-center gap-1.5 whitespace-nowrap",
                activeLayer === 'programs' ? "bg-[#1A1A1A] text-white border border-[#333]" : "text-[#A3A3A3] hover:text-white"
              )}
              style={activeLayer === 'programs' ? { color: themeColor } : {}}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>CATALOG</span>
            </button>

            <button
              onClick={() => setActiveLayer('schedule')}
              className={cn(
                "px-2.5 py-1 text-xs font-mono font-bold uppercase tracking-wider rounded transition-all flex items-center gap-1.5 whitespace-nowrap",
                activeLayer === 'schedule' ? "bg-[#1A1A1A] text-white border border-[#333]" : "text-[#A3A3A3] hover:text-white"
              )}
              style={activeLayer === 'schedule' ? { color: themeColor } : {}}
            >
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>ROUTINE</span>
            </button>

            <button
              onClick={() => setActiveLayer('execute')}
              className={cn(
                "px-2.5 py-1 text-xs font-mono font-bold uppercase tracking-wider rounded transition-all flex items-center gap-1.5 whitespace-nowrap relative",
                activeLayer === 'execute' ? "bg-[#1A1A1A] text-white border border-[#333]" : "text-[#A3A3A3] hover:text-white"
              )}
              style={activeLayer === 'execute' ? { color: themeColor } : {}}
            >
              <Play className="w-3.5 h-3.5 text-emerald-400" />
              <span>PLAYER</span>
              {isWorkoutActive && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              )}
            </button>

            <div className="w-[1px] h-3.5 bg-[#262626] mx-0.5 hidden sm:block" />

            <button
              onClick={() => setActiveLayer('builder')}
              className={cn(
                "px-2.5 py-1 text-xs font-mono font-bold uppercase tracking-wider rounded transition-all flex items-center gap-1.5 whitespace-nowrap",
                activeLayer === 'builder' ? "bg-[#1A1A1A] text-white border border-[#333]" : "text-[#A3A3A3] hover:text-white"
              )}
              style={activeLayer === 'builder' ? { color: themeColor } : {}}
            >
              <Plus className="w-3.5 h-3.5 text-cyan-400" />
              <span>BUILD</span>
            </button>

            <button
              onClick={() => setActiveLayer('analytics')}
              className={cn(
                "px-2.5 py-1 text-xs font-mono font-bold uppercase tracking-wider rounded transition-all flex items-center gap-1.5 whitespace-nowrap",
                activeLayer === 'analytics' ? "bg-[#1A1A1A] text-white border border-[#333]" : "text-[#A3A3A3] hover:text-white"
              )}
              style={activeLayer === 'analytics' ? { color: themeColor } : {}}
            >
              <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
              <span>STATS</span>
            </button>
          </div>
        </div>

        {/* STEPPER BREADCRUMB NAVIGATOR */}
        <div className="bg-[#0A0A0A] border border-[#262626] rounded-md p-1.5 sm:p-2 flex items-center justify-between flex-wrap gap-2 text-xs font-mono">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-0.5 max-w-full">
            <button
              onClick={() => setActiveLayer('programs')}
              className={cn(
                "px-2.5 py-1 rounded border flex items-center gap-1.5 transition-all whitespace-nowrap text-xs font-bold",
                activeLayer === 'programs' ? "bg-cyan-950/80 border-cyan-500 text-cyan-300" : "bg-[#141414] border-[#262626] text-[#A3A3A3] hover:text-white"
              )}
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>1. CATALOG</span>
            </button>

            <ChevronRight className="w-3.5 h-3.5 text-[#555] flex-shrink-0" />

            <button
              onClick={() => setActiveLayer('schedule')}
              className={cn(
                "px-2.5 py-1 rounded border flex items-center gap-1.5 transition-all whitespace-nowrap text-xs font-bold",
                activeLayer === 'schedule' ? "bg-cyan-950/80 border-cyan-500 text-cyan-300" : "bg-[#141414] border-[#262626] text-[#A3A3A3] hover:text-white"
              )}
            >
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>2. DAY ROUTINE</span>
            </button>

            <ChevronRight className="w-3.5 h-3.5 text-[#555] flex-shrink-0" />

            <button
              onClick={() => setActiveLayer('execute')}
              className={cn(
                "px-2.5 py-1 rounded border flex items-center gap-1.5 transition-all whitespace-nowrap text-xs font-bold",
                activeLayer === 'execute' ? "bg-emerald-950/80 border-emerald-500 text-emerald-300" : "bg-[#141414] border-[#262626] text-[#A3A3A3] hover:text-white"
              )}
            >
              <Play className="w-3.5 h-3.5 text-emerald-400" />
              <span>3. WORKOUT PLAYER</span>
            </button>
          </div>
        </div>
      </header>

      {/* SMART AI TRAINER & BIOMECHANICS COACH HUD BANNER */}
      <div className="bg-[#0B1520] border border-cyan-500/50 rounded-sm p-4 font-mono text-xs space-y-3 relative overflow-hidden shadow-lg shadow-cyan-950/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-cyan-900/60 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-sm bg-cyan-950 border border-cyan-500 flex items-center justify-center flex-shrink-0">
              <Cpu className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm tracking-wide uppercase">SMART AI TRAINER & BIOMECHANICS COACH</span>
                <span className="px-1.5 py-0.5 bg-emerald-950 border border-emerald-700 text-emerald-300 text-[10px] rounded-sm font-bold uppercase">LIVE</span>
              </div>
              <p className="text-cyan-200 text-[11px] mt-0.5">
                Real-Time Adaptation • Profile BMI: <strong className="text-white">{bmi}</strong> ({bodyTypeCategory.label})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSmartCoachTopic(smartCoachTopic ? null : 'scaling')}
              className="px-2.5 py-1 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-700 text-[11px] font-bold uppercase rounded-sm flex items-center gap-1 transition-all"
            >
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" /> ASK TRAINER
            </button>
          </div>
        </div>

        {/* Quick Coach Prompt Buttons */}
        <div className="space-y-2">
          <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">INSTANT COACHING & FORM ADVICE TOPICS:</span>
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'scaling', label: '⚡ HOW TO SCALE WITHOUT EQUIPMENT' },
              { id: 'knee_safety', label: '🛡️ PREVENT KNEE & JOINT PAIN' },
              { id: 'progression', label: '📈 2-MONTH PROGRESSIVE OVERLOAD' },
              { id: 'breathing', label: '🫁 BREATHING & CORE BRACING' }
            ].map(topic => (
              <button
                key={topic.id}
                onClick={() => setSmartCoachTopic(smartCoachTopic === topic.id ? null : topic.id as any)}
                className={cn(
                  "px-2.5 py-1 rounded-sm border font-bold uppercase transition-all text-[11px] flex items-center gap-1",
                  smartCoachTopic === topic.id
                    ? "bg-cyan-500 text-black border-cyan-400 shadow-md shadow-cyan-950"
                    : "bg-[#101F2E] text-cyan-200 border-cyan-900/80 hover:border-cyan-500"
                )}
              >
                {topic.label}
              </button>
            ))}
          </div>
        </div>

        {/* Smart Coach Interactive Advice Card */}
        {smartCoachTopic && (
          <div className="bg-[#08121C] border border-cyan-500/80 p-3.5 rounded-sm space-y-2 text-cyan-100 leading-relaxed text-xs animate-fadeIn">
            {smartCoachTopic === 'scaling' && (
              <div className="space-y-1.5">
                <span className="text-cyan-300 font-bold uppercase flex items-center gap-1.5 text-xs">
                  <Sparkles className="w-4 h-4 text-cyan-400" /> COACH GUIDANCE: CALISTHENICS SCALING WITHOUT GEAR
                </span>
                <p>
                  In bodyweight training, intensity is adjusted through <strong>biomechanical leverage, tempo, range of motion, and unilateral loading</strong>.
                </p>
                <ul className="list-disc list-inside space-y-1 text-cyan-200 text-[11px]">
                  <li><strong>For Pushups:</strong> Wall Pushups → Knee Pushups → Floor Pushups → Decline Chair Pushups → Archer Pushups.</li>
                  <li><strong>For Squats:</strong> Sit-to-Stand Squats → Air Squats → Bulgarian Split Squats → Assisted Pistol Squats.</li>
                  <li><strong>For Pulls:</strong> Gentle Doorway Rows → Deep Angle Doorway Rows → Inverted Table Rows → Pullups.</li>
                </ul>
              </div>
            )}

            {smartCoachTopic === 'knee_safety' && (
              <div className="space-y-1.5">
                <span className="text-emerald-300 font-bold uppercase flex items-center gap-1.5 text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> COACH GUIDANCE: KNEE & JOINT PROTECTION
                </span>
                <p>
                  To protect your knees during bodyweight squats, lunges, and jump landings:
                </p>
                <ul className="list-disc list-inside space-y-1 text-emerald-200 text-[11px]">
                  <li>Ensure knees track in line with 2nd & 3rd toes (never let knees cave inward).</li>
                  <li>Land softly on mid-foot during plyometrics, immediately bending knees to absorb impact.</li>
                  <li>Strengthen glutes with Glute Bridges & Isometric Wall Sits to stabilize patellar tendons.</li>
                </ul>
              </div>
            )}

            {smartCoachTopic === 'progression' && (
              <div className="space-y-1.5">
                <span className="text-amber-300 font-bold uppercase flex items-center gap-1.5 text-xs">
                  <Zap className="w-4 h-4 text-amber-400" /> COACH GUIDANCE: 2-MONTH PROGRESSIVE OVERLOAD
                </span>
                <p>
                  Sustained 8-week progress requires incremental difficulty shifts:
                </p>
                <ul className="list-disc list-inside space-y-1 text-amber-200 text-[11px]">
                  <li><strong>Weeks 1-2:</strong> Focus on strict form execution and completing all default reps.</li>
                  <li><strong>Weeks 3-4:</strong> Increase target reps by +2 per set or decrease rest times by 15 seconds.</li>
                  <li><strong>Weeks 5-6:</strong> Slow down the descent (3-second eccentric lower phase).</li>
                  <li><strong>Weeks 7-8:</strong> Add a 2-second isometric peak squeeze on every single rep.</li>
                </ul>
              </div>
            )}

            {smartCoachTopic === 'breathing' && (
              <div className="space-y-1.5">
                <span className="text-purple-300 font-bold uppercase flex items-center gap-1.5 text-xs">
                  <HeartPulse className="w-4 h-4 text-purple-400" /> COACH GUIDANCE: CORE BRACING & BREATH CUES
                </span>
                <p>
                  Proper spinal bracing protects your lower back and enhances power transfer:
                </p>
                <ul className="list-disc list-inside space-y-1 text-purple-200 text-[11px]">
                  <li><strong>Inhale:</strong> Deeply through nose into belly during the lowering (stretch) phase.</li>
                  <li><strong>Exhale:</strong> Sharply through mouth during the press/drive phase.</li>
                  <li><strong>Core Lock:</strong> Imagine bracing your stomach for a punch before starting every rep.</li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* LAYER 1: PROGRAM CATALOG & COMPATIBILITY SEARCH */}
      {activeLayer === 'programs' && (
        <div className="space-y-6">
          {/* USER BODY PROFILE & BMI METRIC BAR */}
          <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#262626] pb-3 gap-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-cyan-400" />
                <div>
                  <h3 className="text-sm sm:text-base font-mono font-bold text-white uppercase">YOUR BODY COMPATIBILITY PROFILE</h3>
                  <p className="text-[11px] font-mono text-[#A3A3A3]">Auto-calculates matching workout intensity based on weight & BMI</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="px-2.5 py-1 bg-[#141414] border border-[#333] text-cyan-300 font-bold rounded-sm">
                  BMI: {bmi} ({bodyTypeCategory.label})
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="bg-[#121212] p-3 rounded-sm border border-[#222]">
                <span className="text-[#A3A3A3] text-[10px] block uppercase">BODY WEIGHT</span>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="number"
                    value={userWeightKg}
                    onChange={(e) => handleUpdateWeight(Number(e.target.value))}
                    className="bg-[#0A0A0A] border border-[#333] px-2 py-1 text-white text-sm font-bold rounded-sm w-20 focus:outline-none focus:border-cyan-500"
                  />
                  <span className="text-white font-bold">KG</span>
                </div>
              </div>

              <div className="bg-[#121212] p-3 rounded-sm border border-[#222]">
                <span className="text-[#A3A3A3] text-[10px] block uppercase">BODY HEIGHT</span>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="number"
                    value={userHeightCm}
                    onChange={(e) => handleUpdateHeight(Number(e.target.value))}
                    className="bg-[#0A0A0A] border border-[#333] px-2 py-1 text-white text-sm font-bold rounded-sm w-20 focus:outline-none focus:border-cyan-500"
                  />
                  <span className="text-white font-bold">CM</span>
                </div>
              </div>

              <div className="bg-[#121212] p-3 rounded-sm border border-[#222]">
                <span className="text-[#A3A3A3] text-[10px] block uppercase">RECOMMENDED GOAL</span>
                <div className="text-emerald-400 font-bold mt-1 text-xs truncate">
                  {bodyTypeCategory.recommendGoal.toUpperCase()}
                </div>
                <p className="text-[10px] text-[#888] truncate">{bodyTypeCategory.desc}</p>
              </div>
            </div>

            {/* DIFFICULTY & EXPERIENCE LEVEL SELECTOR */}
            <div className="space-y-2 pt-2 border-t border-[#1F1F1F]">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-cyan-400" />
                  FITNESS EXPERIENCE LEVEL (EXERCISE HARDNESS & VARIANT):
                </span>
                <span className="text-[10px] font-mono text-[#888] uppercase">
                  ACTIVE: <strong className="text-emerald-400">{experienceLevel.toUpperCase()}</strong>
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 text-xs font-mono">
                {(['beginner', 'intermediate', 'advanced'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => handleSetExperienceLevel(lvl)}
                    className={cn(
                      "px-3.5 py-1.5 rounded-sm border font-bold uppercase transition-all text-xs flex items-center gap-1.5",
                      experienceLevel === lvl
                        ? lvl === 'beginner'
                          ? "bg-emerald-500 text-black border-emerald-400 shadow-sm"
                          : lvl === 'intermediate'
                          ? "bg-cyan-500 text-black border-cyan-400 shadow-sm"
                          : "bg-amber-500 text-black border-amber-400 shadow-sm"
                        : "bg-[#141414] text-[#A3A3A3] border-[#262626] hover:text-white"
                    )}
                  >
                    {lvl === 'beginner' && '🌱 BEGINNER (WALL/KNEE ASSISTED & EASY REPS)'}
                    {lvl === 'intermediate' && '⚡ INTERMEDIATE (STANDARD FLOOR FORM)'}
                    {lvl === 'advanced' && '🔥 ADVANCED (EXPLOSIVE / ATHLETIC OVERLOAD)'}
                  </button>
                ))}
              </div>
            </div>

            {/* GOAL FILTER PILLS */}
            <div className="space-y-2 pt-2 border-t border-[#1F1F1F]">
              <span className="text-xs font-mono text-[#A3A3A3] uppercase block">FILTER BY FITNESS GOAL:</span>
              <div className="flex flex-wrap gap-1.5 text-xs font-mono">
                {[
                  { id: 'all', label: 'ALL GOALS' },
                  { id: 'calisthenics', label: 'BODYWEIGHT / CALISTHENICS' },
                  { id: 'muscle_gain', label: 'MUSCLE GAIN' },
                  { id: 'fat_loss', label: 'FAT LOSS' },
                  { id: 'strength', label: 'STRENGTH' },
                  { id: 'joint_care', label: 'JOINT CARE' }
                ].map(g => (
                  <button
                    key={g.id}
                    onClick={() => handleUpdateGoal(g.id as any)}
                    className={cn(
                      "px-3 py-1.5 rounded-sm border font-bold uppercase transition-all text-xs",
                      userPrimaryGoal === g.id
                        ? "bg-cyan-500 text-black border-cyan-400"
                        : "bg-[#141414] text-[#A3A3A3] border-[#262626] hover:text-white"
                    )}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* STRICT EQUIPMENT FILTER PILLS */}
            <div className="space-y-2 pt-2 border-t border-[#1F1F1F]">
              <span className="text-xs font-mono text-[#A3A3A3] uppercase block">FILTER BY EQUIPMENT REQUIRED:</span>
              <div className="flex flex-wrap gap-1.5 text-xs font-mono">
                {[
                  { id: 'all', label: 'ALL EQUIPMENT TYPES' },
                  { id: 'no_equipment', label: '🚫 PURE BODYWEIGHT (NO GEAR GUARANTEED)' },
                  { id: 'home_gym', label: '🏋️ DUMBBELLS & HOME GYM' },
                  { id: 'full_gym', label: '🏛️ FULL GYM (BARBELL/CABLES)' }
                ].map(eq => (
                  <button
                    key={eq.id}
                    onClick={() => setEquipmentFilter(eq.id as any)}
                    className={cn(
                      "px-3 py-1.5 rounded-sm border font-bold uppercase transition-all text-xs",
                      equipmentFilter === eq.id
                        ? "bg-emerald-500 text-black border-emerald-400"
                        : "bg-[#141414] text-[#A3A3A3] border-[#262626] hover:text-white"
                    )}
                  >
                    {eq.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Program Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPlans.map(plan => {
              const isSelected = plan.id === selectedPlanId;
              const daysCount = plan.days?.length || 1;
              const match = getCompatibilityMatch(plan);

              return (
                <div
                  key={plan.id}
                  className={cn(
                    "p-4 rounded-sm border transition-all space-y-3 flex flex-col justify-between min-w-0 relative",
                    isSelected
                      ? "bg-[#0E1B26] border-cyan-500 shadow-md shadow-cyan-950/40"
                      : "bg-[#0A0A0A] border-[#262626] hover:border-[#444]"
                  )}
                >
                  <div className="space-y-2 min-w-0">
                    <div className="flex items-center justify-between text-[10px] font-mono uppercase gap-2">
                      <span className={cn("px-2 py-0.5 rounded-sm border font-bold truncate", match.color)}>
                        {match.badge}
                      </span>
                      <span className="text-cyan-300 font-bold">{plan.durationWeeks || 8} WEEKS • {daysCount} DAYS/WK</span>
                    </div>

                    <h4 className="text-sm font-mono font-bold text-white uppercase truncate mt-1">{plan.name}</h4>
                    <p className="text-[11px] font-mono text-[#A3A3A3] line-clamp-2 leading-tight">{plan.description}</p>

                    <div className="bg-[#121212] p-2 rounded-sm border border-[#222] text-[10px] font-mono text-cyan-200 space-y-1">
                      <div><strong className="text-cyan-400">EQUIPMENT:</strong> {plan.equipment}</div>
                      <div><strong className="text-cyan-400">BODY SUITABILITY:</strong> {plan.recommendedBodyType}</div>
                      <p className="text-[10px] text-[#888] italic truncate">{plan.compatibilityNote}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#1F1F1F] flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        setSelectedPlanId(plan.id);
                        setSelectedDayIndex(0);
                        setActiveLayer('schedule');
                      }}
                      className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-bold uppercase rounded-sm transition-all flex items-center justify-center gap-1.5"
                    >
                      CHOOSE PROGRAM & VIEW SCHEDULE <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* LAYER 2: SELECTED PROGRAM DAY SCHEDULE & MULTI-WEEK PROGRESSION */}
      {activeLayer === 'schedule' && currentSelectedPlan && (
        <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-4 sm:p-5 space-y-5">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#262626] pb-3 gap-3">
            <div className="min-w-0">
              <button
                onClick={() => setActiveLayer('programs')}
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300 uppercase flex items-center gap-1 mb-1 font-bold"
              >
                <ChevronLeft className="w-4 h-4" /> BACK TO CATALOG
              </button>
              <h3 className="text-base sm:text-xl font-mono text-white font-bold uppercase truncate">
                {currentSelectedPlan.name}
              </h3>
              <p className="text-xs font-mono text-[#A3A3A3] uppercase mt-0.5">
                {currentSelectedPlan.equipment} • {currentSelectedPlan.recommendedBodyType}
              </p>
            </div>

            {currentSelectedPlan.id.startsWith('custom_') && (
              <button
                onClick={() => handleDeleteCustomPlan(currentSelectedPlan.id)}
                className="px-2.5 py-1 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800 text-rose-400 font-mono text-xs uppercase rounded-sm flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> DELETE PLAN
              </button>
            )}
          </div>

          {/* WEEK SELECTOR & EXPERIENCE LEVEL BAR FOR PROGRESSIVE LONG-TERM SCALING */}
          <div className="space-y-3 bg-[#121212] p-3.5 rounded-sm border border-[#262626]">
            {/* Experience Level Selector */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#222] pb-2.5">
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-4 h-4 text-cyan-400" />
                STARTING FITNESS DIFFICULTY:
              </span>
              <div className="flex items-center gap-1.5 w-full sm:w-auto">
                {(['beginner', 'intermediate', 'advanced'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => handleSetExperienceLevel(lvl)}
                    className={cn(
                      "flex-1 sm:flex-initial px-3 py-1 text-xs font-mono font-bold uppercase rounded-sm border transition-all",
                      experienceLevel === lvl
                        ? lvl === 'beginner' 
                          ? "bg-emerald-500 text-black border-emerald-400"
                          : lvl === 'intermediate'
                          ? "bg-cyan-500 text-black border-cyan-400"
                          : "bg-amber-500 text-black border-amber-400"
                        : "bg-[#1A1A1A] border-[#333] text-[#A3A3A3] hover:text-white"
                    )}
                  >
                    {lvl === 'beginner' && '🌱 BEGINNER (ACCESSIBLE START)'}
                    {lvl === 'intermediate' && '⚡ INTERMEDIATE'}
                    {lvl === 'advanced' && '🔥 ADVANCED'}
                  </button>
                ))}
              </div>
            </div>

            {/* WEEK STEPPER BAR */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 pt-1">
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-400" />
                PROGRESSIVE OVERLOAD WEEK:
              </span>
              <span className="text-[11px] font-mono text-[#A3A3A3] uppercase">
                WEEK {selectedWeek} OF {currentSelectedPlan.durationWeeks || 8}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: currentSelectedPlan.durationWeeks || 8 }, (_, i) => i + 1).map(w => (
                <button
                  key={w}
                  onClick={() => handleSetSelectedWeek(w)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-mono font-bold uppercase rounded-sm border transition-all flex items-center gap-1",
                    selectedWeek === w
                      ? "bg-emerald-500 text-black border-emerald-400"
                      : "bg-[#1A1A1A] border-[#333] text-[#A3A3A3] hover:text-white"
                  )}
                >
                  <span>WK {w}</span>
                  {w === 1 && <span className="text-[9px] opacity-80">(Entry)</span>}
                  {w === 8 && <span className="text-[9px] opacity-80">(Peak)</span>}
                </button>
              ))}
            </div>
          </div>

          {/* AUTOMATED PROGRESSIVE OVERLOAD & EDITABLE DIFFICULTY ENGINE PANEL */}
          <div className="bg-[#0E1520] border border-cyan-500/50 rounded-sm p-4 space-y-3 font-mono">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-cyan-900/60 pb-2.5">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                    AUTOMATED PROGRESSIVE OVERLOAD ENGINE (+5% PER LOGGED COMPLETION)
                  </span>
                </div>
                <p className="text-[11px] text-[#A3A3A3]">
                  Monitors workout completion history. Completing exercises automatically increases target reps, sets & duration by +5% for future sessions. Fully editable below.
                </p>
              </div>

              <button
                onClick={handleResetAllOverload}
                className="px-2.5 py-1 bg-[#1A1A1A] hover:bg-rose-950 border border-[#333] hover:border-rose-800 text-rose-300 text-[10px] uppercase font-bold rounded-sm transition-all flex items-center gap-1 flex-shrink-0"
              >
                <RotateCcw className="w-3 h-3 text-rose-400" /> RESET OVERLOAD HISTORY
              </button>
            </div>

            {/* Global Difficulty Control Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1.5 bg-[#121212] p-2.5 rounded-sm border border-[#262626]">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-cyan-400 font-bold uppercase flex items-center gap-1">
                    <Scale className="w-3.5 h-3.5 text-cyan-400" /> GLOBAL DIFFICULTY MULTIPLIER:
                  </span>
                  <span className="text-emerald-400 font-bold text-sm font-mono">
                    {globalDifficultyMultiplier.toFixed(2)}x
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSetGlobalDifficultyMultiplier(globalDifficultyMultiplier - 0.05)}
                    className="px-2 py-1 bg-[#1A1A1A] hover:bg-[#262626] text-white border border-[#333] rounded-sm font-bold text-xs"
                  >
                    -0.05
                  </button>

                  <input
                    type="range"
                    min="0.5"
                    max="2.5"
                    step="0.05"
                    value={globalDifficultyMultiplier}
                    onChange={(e) => handleSetGlobalDifficultyMultiplier(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-[#262626] rounded-lg"
                  />

                  <button
                    onClick={() => handleSetGlobalDifficultyMultiplier(globalDifficultyMultiplier + 0.05)}
                    className="px-2 py-1 bg-[#1A1A1A] hover:bg-[#262626] text-white border border-[#333] rounded-sm font-bold text-xs"
                  >
                    +0.05
                  </button>
                </div>

                <div className="flex flex-wrap gap-1 text-[10px] pt-1">
                  {[
                    { label: '0.80x (Light)', val: 0.8 },
                    { label: '1.00x (Normal)', val: 1.0 },
                    { label: '1.25x (Intense)', val: 1.25 },
                    { label: '1.50x (Beast)', val: 1.5 }
                  ].map(p => (
                    <button
                      key={p.val}
                      onClick={() => handleSetGlobalDifficultyMultiplier(p.val)}
                      className={cn(
                        "px-2 py-0.5 rounded-sm border uppercase transition-all font-bold",
                        Math.abs(globalDifficultyMultiplier - p.val) < 0.02
                          ? "bg-cyan-500 text-black border-cyan-400"
                          : "bg-[#1A1A1A] text-[#A3A3A3] border-[#333] hover:text-white"
                      )}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5 bg-[#121212] p-2.5 rounded-sm border border-[#262626] text-xs">
                <span className="text-emerald-400 font-bold uppercase flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" /> ACTIVE OVERLOAD STATUS:
                </span>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div className="bg-[#181818] p-1.5 rounded-sm border border-[#222]">
                    <span className="text-[#888] block text-[9px] uppercase">TRACKED EXERCISES</span>
                    <span className="text-white font-bold">{Object.keys(exerciseOverloadMap).length} Logged</span>
                  </div>
                  <div className="bg-[#181818] p-1.5 rounded-sm border border-[#222]">
                    <span className="text-[#888] block text-[9px] uppercase">AUTO-SCALE STEP</span>
                    <span className="text-emerald-400 font-bold">+5% Per Completed Workout</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Day Selector Tabs */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 bg-cyan-950 border border-cyan-700 rounded-sm text-[10px]">STEP 2</span>
              SELECT A DAY ROUTINE TO PERFORM:
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {currentSelectedPlan.days.map((day, idx) => {
                const isDaySelected = idx === safeSelectedDayIndex;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedDayIndex(idx)}
                    className={cn(
                      "p-2.5 rounded-sm border font-mono text-left transition-all space-y-1 min-w-0",
                      isDaySelected
                        ? "bg-emerald-950/60 border-emerald-500 text-white"
                        : "bg-[#141414] border-[#262626] text-[#A3A3A3] hover:text-white"
                    )}
                  >
                    <span className="text-[10px] uppercase block font-bold text-emerald-400">
                      DAY {day.dayNumber}
                    </span>
                    <span className="text-xs font-bold uppercase block truncate">
                      {day.muscleFocus || 'Workout'}
                    </span>
                    <span className="text-[10px] text-[#A3A3A3] block">
                      {day.exercises.length} Exercises
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Day Exercise Preview */}
          {currentSelectedDay && (
            <div className="bg-[#121212] border border-[#262626] rounded-sm p-4 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#262626] pb-3 gap-3">
                <div className="min-w-0">
                  <span className="text-[10px] font-mono text-[#A3A3A3] uppercase block">WEEK {selectedWeek} • DAY {currentSelectedDay.dayNumber} SCHEDULE</span>
                  <h4 className="text-base sm:text-lg font-mono font-bold text-white uppercase truncate">{currentSelectedDay.title}</h4>
                  <p className="text-xs font-mono text-emerald-400 uppercase mt-0.5 truncate">
                    TARGET FOCUS: {currentSelectedDay.muscleFocus || 'FULL BODY'}
                  </p>
                </div>

                <button
                  onClick={() => handleStartWorkoutDay(currentSelectedPlan, safeSelectedDayIndex)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold uppercase rounded-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 flex-shrink-0"
                >
                  <Play className="w-4 h-4 fill-black" /> START DAY {currentSelectedDay.dayNumber} WORKOUT
                </button>
              </div>

              {/* Exercise Cards List with Progressive Overload Details */}
              <div className="space-y-3">
                <span className="text-xs font-mono text-[#A3A3A3] uppercase block">
                  EXERCISES IN THIS SESSION ({currentSelectedDay.exercises.length} EXERCISES • WEEK {selectedWeek} SCALED):
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentSelectedDay.exercises.map((exRaw, exIdx) => {
                    const ex = getScaledExercise(exRaw);
                    return (
                      <div key={exIdx} className="bg-[#181818] border border-[#262626] p-3.5 rounded-sm space-y-2 min-w-0 flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-start gap-2">
                            <span className="text-xs font-mono font-bold text-white uppercase truncate">{ex.name}</span>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              {ex.autoOverloadPercent && ex.autoOverloadPercent > 0 ? (
                                <span className="px-1.5 py-0.5 bg-emerald-950 text-emerald-400 text-[9px] font-mono font-bold rounded-sm border border-emerald-800 uppercase">
                                  📈 +{ex.autoOverloadPercent}% OVERLOAD ({ex.completionsCount}x)
                                </span>
                              ) : null}
                              <span className="px-2 py-0.5 bg-cyan-950/60 text-cyan-300 text-[10px] font-mono rounded-sm border border-cyan-900/50 uppercase">
                                {ex.muscleGroup}
                              </span>
                            </div>
                          </div>

                          <div className="text-[11px] font-mono text-[#A3A3A3] flex items-center justify-between pt-1">
                            <span className="text-emerald-400 font-bold">SETS: {ex.scaledSets} × {ex.scaledReps} REPS</span>
                            <span className="text-cyan-400 font-bold">⚡ {ex.totalDifficultyMultiplier}x DIFF</span>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            <span className="px-1.5 py-0.5 bg-emerald-950/80 text-emerald-300 border border-emerald-800 text-[9px] font-mono uppercase rounded-sm">
                              {ex.weekPhaseLabel}
                            </span>
                            {ex.category && (
                              <span className="px-1.5 py-0.5 bg-[#222] text-[#AAA] text-[9px] font-mono uppercase rounded-sm">
                                {ex.category}
                              </span>
                            )}
                          </div>

                          {ex.regressionTip && (
                            <div className="p-2 bg-[#121212] border border-[#222] rounded-sm text-[10px] font-mono text-amber-300/90 leading-relaxed">
                              🌱 <strong>Beginner Alternative:</strong> {ex.regressionTip}
                            </div>
                          )}
                        </div>

                        {/* Interactive Form Guide & Difficulty Tuner Action Bar */}
                        <div className="grid grid-cols-2 gap-2 pt-2">
                          <button
                            onClick={() => setGuideExercise(ex)}
                            className="w-full py-1.5 bg-[#222] hover:bg-cyan-950 border border-[#333] hover:border-cyan-500 text-cyan-300 text-[10px] font-mono font-bold uppercase rounded-sm transition-all flex items-center justify-center gap-1"
                          >
                            <BookOpen className="w-3 h-3 text-cyan-400" /> FORM GUIDE
                          </button>
                          <button
                            onClick={() => setEditingExerciseName(exRaw.name)}
                            className="w-full py-1.5 bg-[#1E1B0E] hover:bg-amber-950 border border-amber-800/80 text-amber-300 text-[10px] font-mono font-bold uppercase rounded-sm transition-all flex items-center justify-center gap-1"
                          >
                            <Sliders className="w-3 h-3 text-amber-400" /> TWEAK DIFFICULTY
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* LAYER 3: ACTIVE WORKOUT EXECUTION PLAYER */}
      {activeLayer === 'execute' && (
        <div className="space-y-6">
          {!isWorkoutActive ? (
            <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-8 text-center max-w-lg mx-auto space-y-4">
              <Dumbbell className="w-12 h-12 text-cyan-400 mx-auto" />
              <h3 className="text-lg font-mono text-white font-bold uppercase">NO WORKOUT SESSION ACTIVE</h3>
              <p className="text-xs font-mono text-[#A3A3A3] uppercase">
                Choose a program and day routine under "LAYER 1: CATALOG", then click "START WORKOUT".
              </p>
              <button
                onClick={() => setActiveLayer('programs')}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold uppercase rounded-sm inline-flex items-center gap-2"
              >
                SELECT WORKOUT PROGRAM <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Active Session Header Bar */}
              <div className="bg-[#0E1824] border border-cyan-500/50 rounded-sm p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping flex-shrink-0"></span>
                    <span className="text-xs font-mono text-cyan-400 font-bold uppercase truncate">{activePlan?.name}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-mono text-white font-bold uppercase mt-0.5 truncate">{activeDay?.title}</h3>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-0 border-[#262626] pt-2 sm:pt-0">
                  <div className="flex items-center gap-1.5 font-mono text-base sm:text-lg text-white font-bold bg-[#0A0A0A] px-3 py-1.5 border border-[#262626] rounded-sm">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    {formatTimer(workoutSeconds)}
                  </div>

                  <button
                    onClick={handleFinishWorkout}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold uppercase rounded-sm transition-all flex-shrink-0 font-bold"
                  >
                    FINISH WORKOUT
                  </button>
                </div>
              </div>

              {/* Rest Countdown Bar */}
              {isResting && (
                <div className="bg-purple-950/80 border border-purple-500/60 rounded-sm p-3.5 flex flex-col sm:flex-row items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-purple-300 font-mono text-xs font-bold uppercase">
                    <Zap className="w-4 h-4 text-amber-400 animate-bounce" />
                    <span>REST INTERVAL: <strong className="text-white text-sm">{restSeconds}S</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setRestSeconds(prev => prev + 30)}
                      className="px-2.5 py-1 bg-[#1A1A1A] hover:bg-[#262626] border border-[#333] text-purple-300 font-mono text-[11px] uppercase rounded-sm"
                    >
                      +30S
                    </button>
                    <button
                      onClick={() => setIsResting(false)}
                      className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white font-mono text-[11px] uppercase font-bold rounded-sm"
                    >
                      SKIP REST
                    </button>
                  </div>
                </div>
              )}

              {/* List of Exercises for the Day */}
              <div className="space-y-4">
                {activeDay?.exercises.map((exRaw, exIdx) => {
                  const ex = getScaledExercise(exRaw);
                  const sets = completedSets[exIdx] || [];

                  return (
                    <div key={exIdx} className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-4 space-y-3">
                      <div className="flex justify-between items-start border-b border-[#262626] pb-3 gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
                              EXERCISE {exIdx + 1} OF {activeDay.exercises.length}
                            </span>
                            <span className="px-1.5 py-0.5 bg-[#141414] border border-[#262626] text-[10px] font-mono text-[#A3A3A3] uppercase rounded-sm truncate">
                              {ex.muscleGroup}
                            </span>
                            {ex.autoOverloadPercent && ex.autoOverloadPercent > 0 ? (
                              <span className="px-1.5 py-0.5 bg-emerald-950 text-emerald-400 text-[9px] font-mono font-bold rounded-sm border border-emerald-800 uppercase">
                                📈 +{ex.autoOverloadPercent}% OVERLOAD ({ex.completionsCount}x)
                              </span>
                            ) : null}
                          </div>
                          <h4 className="text-base sm:text-lg font-mono text-white font-bold uppercase mt-0.5 truncate">{ex.name}</h4>
                          {ex.details && <p className="text-xs font-mono text-amber-400 mt-0.5 truncate">{ex.details}</p>}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingExerciseName(exRaw.name)}
                            className="px-2 py-1 bg-[#1E1B0E] hover:bg-amber-950 border border-amber-800 text-amber-300 text-xs font-mono font-bold uppercase rounded-sm flex items-center gap-1"
                          >
                            <Sliders className="w-3.5 h-3.5" /> TWEAK DIFF
                          </button>

                          <button
                            onClick={() => setGuideExercise(ex)}
                            className="px-2.5 py-1 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700 text-cyan-300 text-xs font-mono font-bold uppercase rounded-sm flex items-center gap-1"
                          >
                            <BookOpen className="w-3.5 h-3.5" /> FORM GUIDE
                          </button>

                          <button
                            onClick={() => handleAddSet(exIdx)}
                            className="px-2.5 py-1 bg-[#1A1A1A] hover:bg-[#262626] border border-[#333] text-emerald-400 text-xs font-mono uppercase rounded-sm flex-shrink-0"
                          >
                            + ADD SET
                          </button>
                        </div>
                      </div>

                      {/* Clean Grid Set Table */}
                      <div className="space-y-2">
                        <div className="grid grid-cols-12 gap-2 text-[10px] font-mono text-[#A3A3A3] uppercase px-1">
                          <span className="col-span-3 sm:col-span-2">SET</span>
                          <span className="col-span-3 sm:col-span-3">KG</span>
                          <span className="col-span-3 sm:col-span-3">REPS</span>
                          <span className="col-span-3 sm:col-span-4 text-right">STATUS</span>
                        </div>

                        {sets.map((set, setIdx) => (
                          <div
                            key={setIdx}
                            className={cn(
                              "grid grid-cols-12 gap-2 items-center p-2 rounded-sm border font-mono text-xs transition-colors",
                              set.completed
                                ? "bg-emerald-950/30 border-emerald-500/50 text-white"
                                : "bg-[#121212] border-[#262626] text-[#CCCCCC]"
                            )}
                          >
                            <span className="col-span-3 sm:col-span-2 font-bold text-white text-xs">SET {setIdx + 1}</span>

                            <div className="col-span-3 sm:col-span-3">
                              <input
                                type="number"
                                value={set.weight || ''}
                                onChange={e => handleUpdateSetInput(exIdx, setIdx, 'weight', Number(e.target.value))}
                                placeholder="0"
                                className="bg-[#0A0A0A] border border-[#262626] rounded-sm px-2 py-1 text-white text-xs w-full focus:outline-none focus:border-cyan-500 font-mono"
                              />
                            </div>

                            <div className="col-span-3 sm:col-span-3">
                              <input
                                type="number"
                                value={set.reps || ''}
                                onChange={e => handleUpdateSetInput(exIdx, setIdx, 'reps', Number(e.target.value))}
                                placeholder="10"
                                className="bg-[#0A0A0A] border border-[#262626] rounded-sm px-2 py-1 text-white text-xs w-full focus:outline-none focus:border-cyan-500 font-mono"
                              />
                            </div>

                            <div className="col-span-3 sm:col-span-4 flex justify-end">
                              <button
                                onClick={() => handleToggleSetComplete(exIdx, setIdx)}
                                className={cn(
                                  "px-3 py-1 text-[11px] font-mono font-bold uppercase rounded-sm transition-all flex items-center gap-1",
                                  set.completed
                                    ? "bg-emerald-500 text-black border border-emerald-400"
                                    : "bg-[#1A1A1A] hover:bg-[#262626] border border-[#333] text-[#A3A3A3] hover:text-white"
                                )}
                              >
                                {set.completed ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : 'COMPLETE'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* LAYER 4: CUSTOM ROUTINE BUILDER */}
      {activeLayer === 'builder' && (
        <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-5 space-y-6 max-w-2xl mx-auto">
          <div className="border-b border-[#262626] pb-3">
            <h3 className="text-lg font-mono text-white font-bold uppercase">CREATE CUSTOM ROUTINE</h3>
            <p className="text-xs font-mono text-[#A3A3A3] uppercase">Build a personalized multi-exercise workout routine</p>
          </div>

          <div className="space-y-4 font-mono text-xs">
            <div>
              <label className="text-[#A3A3A3] block uppercase mb-1">ROUTINE NAME</label>
              <input
                type="text"
                value={newPlanName}
                onChange={e => setNewPlanName(e.target.value)}
                placeholder="e.g. 6-DAY HYBRID POWER SPLIT"
                className="bg-[#121212] border border-[#262626] rounded-sm px-3 py-2 text-white w-full focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-[#A3A3A3] block uppercase mb-1">TARGET FOCUS / AREA</label>
              <input
                type="text"
                value={newPlanArea}
                onChange={e => setNewPlanArea(e.target.value)}
                placeholder="e.g. Chest & Triceps"
                className="bg-[#121212] border border-[#262626] rounded-sm px-3 py-2 text-white w-full focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-[#A3A3A3] block uppercase mb-1">DESCRIPTION</label>
              <textarea
                value={newPlanDesc}
                onChange={e => setNewPlanDesc(e.target.value)}
                placeholder="Describe training protocol..."
                className="bg-[#121212] border border-[#262626] rounded-sm px-3 py-2 text-white w-full h-20 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Add Exercise Form */}
            <div className="bg-[#121212] p-4 rounded-sm border border-[#262626] space-y-3">
              <span className="text-cyan-400 font-bold block uppercase">ADD EXERCISES TO ROUTINE</span>

              <form onSubmit={handleAddExerciseToBuilder} className="space-y-3">
                <input
                  type="text"
                  value={exName}
                  onChange={e => setExName(e.target.value)}
                  placeholder="EXERCISE NAME (e.g. DUMBBELL PRESS)"
                  className="bg-[#0A0A0A] border border-[#262626] rounded-sm px-3 py-2 text-white w-full focus:outline-none focus:border-cyan-500"
                />

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <label className="text-[10px] text-[#A3A3A3] block uppercase">MUSCLE</label>
                    <select
                      value={exMuscle}
                      onChange={e => setExMuscle(e.target.value as any)}
                      className="bg-[#0A0A0A] border border-[#262626] rounded-sm px-2 py-1.5 text-white w-full"
                    >
                      <option value="chest">CHEST</option>
                      <option value="back">BACK</option>
                      <option value="legs">LEGS</option>
                      <option value="arms">ARMS</option>
                      <option value="shoulders">SHOULDERS</option>
                      <option value="core">CORE</option>
                      <option value="cardio">CARDIO</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-[#A3A3A3] block uppercase">SETS</label>
                    <input
                      type="number"
                      value={exSets}
                      onChange={e => setExSets(e.target.value)}
                      className="bg-[#0A0A0A] border border-[#262626] rounded-sm px-2 py-1.5 text-white w-full"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-[#A3A3A3] block uppercase">REPS</label>
                    <input
                      type="number"
                      value={exReps}
                      onChange={e => setExReps(e.target.value)}
                      className="bg-[#0A0A0A] border border-[#262626] rounded-sm px-2 py-1.5 text-white w-full"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-[#A3A3A3] block uppercase">CALORIES</label>
                    <input
                      type="number"
                      value={exCals}
                      onChange={e => setExCals(e.target.value)}
                      placeholder="120"
                      className="bg-[#0A0A0A] border border-[#262626] rounded-sm px-2 py-1.5 text-white w-full"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-cyan-950 hover:bg-cyan-900 border border-cyan-700 text-cyan-300 font-bold uppercase rounded-sm"
                >
                  + ADD EXERCISE
                </button>
              </form>
            </div>

            {/* Added Exercises List */}
            {builderExercises.length > 0 && (
              <div className="space-y-2">
                <span className="text-[#A3A3A3] block uppercase">ADDED EXERCISES ({builderExercises.length}):</span>
                {builderExercises.map((ex, idx) => (
                  <div key={idx} className="bg-[#121212] p-2.5 rounded-sm border border-[#262626] flex justify-between items-center">
                    <div>
                      <span className="font-bold text-white uppercase block">{ex.name}</span>
                      <span className="text-[10px] text-[#A3A3A3]">{ex.defaultSets} sets × {ex.targetReps} reps • {ex.muscleGroup}</span>
                    </div>
                    <button
                      onClick={() => setBuilderExercises(builderExercises.filter((_, i) => i !== idx))}
                      className="text-rose-400 text-xs hover:text-rose-300 uppercase"
                    >
                      REMOVE
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={handleSaveCustomPlan}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase rounded-sm text-sm tracking-wider"
            >
              SAVE ROUTINE TO CATALOG
            </button>
          </div>
        </div>
      )}

      {/* LAYER 5: ANALYTICS & MUSCLE LOAD */}
      {activeLayer === 'analytics' && (
        <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-5 space-y-6">
          <div className="border-b border-[#262626] pb-3">
            <h3 className="text-lg font-mono text-white font-bold uppercase">7-DAY MUSCLE GROUP LOAD ANALYTICS</h3>
            <p className="text-xs font-mono text-[#A3A3A3] uppercase">Tracks training distribution to ensure balanced fatigue recovery</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="name" stroke="#666" fontSize={10} fontFamily="monospace" />
                <YAxis stroke="#666" fontSize={10} fontFamily="monospace" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0A0A0A', borderColor: '#333', color: '#FFF', fontFamily: 'monospace' }}
                />
                <Bar dataKey="load" fill="#06B6D4">
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#06B6D4' : '#10B981'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* STEP-BY-STEP EXERCISE EXECUTION & FORM GUIDE MODAL */}
      {guideExercise && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#0D0D0D] border border-cyan-500/60 rounded-sm w-full max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 space-y-5 font-mono text-xs shadow-2xl shadow-cyan-950/80 relative">
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-[#262626] pb-3 gap-2">
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 bg-cyan-950 text-cyan-300 font-bold border border-cyan-800 rounded-sm uppercase text-[10px]">
                    {guideExercise.muscleGroup}
                  </span>
                  {guideExercise.category && (
                    <span className="px-2 py-0.5 bg-[#222] text-amber-300 font-bold border border-[#444] rounded-sm uppercase text-[10px]">
                      {guideExercise.category}
                    </span>
                  )}
                  <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 font-bold border border-emerald-800 rounded-sm uppercase text-[10px]">
                    {guideExercise.equipment || 'No Equipment'}
                  </span>
                </div>
                <h3 className="text-base sm:text-xl font-mono font-bold text-white uppercase mt-1 leading-snug">
                  {guideExercise.name}
                </h3>
              </div>

              <button
                onClick={() => setGuideExercise(null)}
                className="p-1.5 bg-[#1A1A1A] hover:bg-[#262626] text-[#A3A3A3] hover:text-white rounded-sm border border-[#333] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* TARGET MUSCLES */}
            {guideExercise.targetMuscles && guideExercise.targetMuscles.length > 0 && (
              <div className="space-y-1.5 bg-[#141414] p-3 rounded-sm border border-[#262626]">
                <span className="text-cyan-400 font-bold uppercase text-[11px] flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-cyan-400" /> TARGET MUSCLE GROUPS:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {guideExercise.targetMuscles.map((m, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-cyan-950/60 text-cyan-200 border border-cyan-900 rounded-sm text-[10px] font-bold">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* STEP-BY-STEP EXECUTION STEPS */}
            {guideExercise.executionSteps && guideExercise.executionSteps.length > 0 && (
              <div className="space-y-2">
                <span className="text-emerald-400 font-bold uppercase text-xs flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4 text-emerald-400" /> STEP-BY-STEP FORM & EXECUTION:
                </span>
                <div className="space-y-2">
                  {guideExercise.executionSteps.map((step, idx) => (
                    <div key={idx} className="bg-[#121212] p-3 rounded-sm border border-[#222] text-white leading-relaxed text-xs">
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PRO FORM TIPS */}
            {guideExercise.formTips && guideExercise.formTips.length > 0 && (
              <div className="space-y-2 bg-[#0E1A16] p-3 rounded-sm border border-emerald-900/60">
                <span className="text-emerald-300 font-bold uppercase text-[11px] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-400" /> PRO POSTURE & BREATHING CUES:
                </span>
                <ul className="list-disc list-inside space-y-1 text-[#D0F2E2]">
                  {guideExercise.formTips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* COMMON MISTAKES TO AVOID */}
            {guideExercise.commonMistakes && guideExercise.commonMistakes.length > 0 && (
              <div className="space-y-2 bg-[#1A0E0E] p-3 rounded-sm border border-rose-900/60">
                <span className="text-rose-400 font-bold uppercase text-[11px] flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-400" /> COMMON MISTAKES TO AVOID:
                </span>
                <ul className="list-disc list-inside space-y-1 text-rose-200">
                  {guideExercise.commonMistakes.map((m, idx) => (
                    <li key={idx}>{m}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* SMART AI TRAINER SCALING TIPS (REGRESSION & PROGRESSION) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#0B1520] p-3.5 rounded-sm border border-cyan-800/80">
              <div className="space-y-1">
                <span className="text-cyan-300 font-bold text-[11px] uppercase flex items-center gap-1">
                  <ChevronLeft className="w-3.5 h-3.5 text-cyan-400" /> REGRESSION (MAKE EASIER):
                </span>
                <p className="text-[#B0E0FA] text-xs leading-relaxed">
                  {guideExercise.regressionTip || 'Drop knees to floor or shorten depth range.'}
                </p>
              </div>

              <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-cyan-900/60 pt-2 sm:pt-0 sm:pl-3">
                <span className="text-emerald-300 font-bold text-[11px] uppercase flex items-center gap-1">
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-400" /> PROGRESSION (MAKE HARDER):
                </span>
                <p className="text-[#C0F2D8] text-xs leading-relaxed">
                  {guideExercise.progressionTip || 'Add a 2s isometric pause or elevate feet/hands.'}
                </p>
              </div>
            </div>

            {/* TEMPO & REST TIME */}
            <div className="grid grid-cols-2 gap-3 bg-[#141414] p-3 rounded-sm border border-[#262626]">
              <div>
                <span className="text-[#888] text-[10px] block uppercase">RECOMMENDED TEMPO</span>
                <span className="text-amber-300 font-bold text-xs">{guideExercise.tempo || '2s down - 1s pause - 1s up'}</span>
              </div>
              <div>
                <span className="text-[#888] text-[10px] block uppercase">REST BETWEEN SETS</span>
                <span className="text-amber-300 font-bold text-xs">{guideExercise.restTime || '60 seconds'}</span>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setGuideExercise(null)}
              className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold uppercase rounded-sm transition-all"
            >
              GOT IT • CLOSE GUIDE
            </button>
          </div>
        </div>
      )}

      {/* WORKOUT SUMMARY COMPLETION MODAL */}
      {showSummaryModal && summaryData && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0A0A0A] border border-emerald-500/50 rounded-sm p-6 max-w-md w-full space-y-5 text-center font-mono">
            <div className="w-16 h-16 bg-emerald-950 rounded-full flex items-center justify-center mx-auto border border-emerald-500">
              <Award className="w-8 h-8 text-emerald-400" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white uppercase">WORKOUT COMPLETED!</h3>
              <p className="text-xs text-emerald-400 uppercase font-bold">{activeDay?.title}</p>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-[#141414] p-3 rounded-sm border border-[#262626] text-xs">
              <div>
                <span className="text-[#A3A3A3] text-[10px] block uppercase">TIME</span>
                <span className="text-white font-bold">{formatTimer(summaryData.duration)}</span>
              </div>
              <div>
                <span className="text-[#A3A3A3] text-[10px] block uppercase">CALORIES</span>
                <span className="text-emerald-400 font-bold">{summaryData.totalCalories} KCAL</span>
              </div>
              <div>
                <span className="text-[#A3A3A3] text-[10px] block uppercase">XP GAINED</span>
                <span className="text-cyan-400 font-bold">+{summaryData.totalXp} XP</span>
              </div>
            </div>

            <button
              onClick={() => {
                setShowSummaryModal(false);
                setActiveLayer('programs');
              }}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase rounded-sm text-xs tracking-wider"
            >
              RETURN TO TRAINING CATALOG
            </button>
          </div>
        </div>
      )}

      {/* EXERCISE DIFFICULTY CUSTOMIZATION TUNER MODAL */}
      {editingExerciseName && (() => {
        const key = editingExerciseName.toUpperCase();
        const currentRec = exerciseOverloadMap[key] || { completionsCount: 0, userMultiplier: 1.0, userExtraSets: 0, userExtraReps: 0 };
        const baseEx: ExerciseItem = enrichExercise({ name: editingExerciseName, muscleGroup: 'core', calories: 20, duration: 30 });
        const scaledPreview = scaleExerciseForWeek(baseEx, selectedWeek, experienceLevel, currentRec, globalDifficultyMultiplier);

        return (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0D0D0D] border border-amber-500/70 rounded-sm w-full max-w-lg p-5 space-y-5 font-mono text-xs shadow-2xl relative">
              <div className="flex justify-between items-start border-b border-[#262626] pb-3 gap-2">
                <div>
                  <span className="text-[10px] text-amber-400 font-bold uppercase block">EXERCISE DIFFICULTY TUNER</span>
                  <h3 className="text-base font-bold text-white uppercase">{editingExerciseName}</h3>
                </div>
                <button
                  onClick={() => setEditingExerciseName(null)}
                  className="p-1 bg-[#1A1A1A] hover:bg-[#262626] text-[#A3A3A3] hover:text-white rounded-sm border border-[#333]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scaled Result Live Preview Box */}
              <div className="bg-[#141B15] border border-emerald-500/40 p-3 rounded-sm space-y-1">
                <span className="text-[10px] text-emerald-300 font-bold uppercase block">SCALED RESULT PREVIEW FOR WEEK {selectedWeek}:</span>
                <div className="flex items-center justify-between text-sm text-white font-bold">
                  <span>{scaledPreview.scaledSets} SETS × {scaledPreview.scaledReps} REPS</span>
                  <span className="text-amber-400">MULTIPLIER: {scaledPreview.totalDifficultyMultiplier}x</span>
                </div>
                <div className="text-[10px] text-[#A3A3A3]">
                  Auto-Overload Boost: +{scaledPreview.autoOverloadPercent}% ({scaledPreview.completionsCount} Completed Sessions)
                </div>
              </div>

              {/* Editable Controls */}
              <div className="space-y-4">
                {/* 1. Completion History Stepper (+5% per completion) */}
                <div className="space-y-1.5 bg-[#141414] p-3 rounded-sm border border-[#262626]">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-bold uppercase">COMPLETION HISTORY (+5% PER COUNT):</span>
                    <span className="text-emerald-400 font-bold">{currentRec.completionsCount || 0} COMPLETED</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateExerciseOverload(editingExerciseName, { completionsCount: Math.max(0, (currentRec.completionsCount || 0) - 1) })}
                      className="px-3 py-1 bg-[#222] hover:bg-[#333] text-white border border-[#444] rounded-sm font-bold"
                    >
                      -1 WORKOUT (-5%)
                    </button>
                    <input
                      type="number"
                      min="0"
                      value={currentRec.completionsCount || 0}
                      onChange={(e) => handleUpdateExerciseOverload(editingExerciseName, { completionsCount: Math.max(0, Number(e.target.value)) })}
                      className="w-full bg-[#0A0A0A] border border-[#333] text-center font-bold text-white py-1 rounded-sm"
                    />
                    <button
                      onClick={() => handleUpdateExerciseOverload(editingExerciseName, { completionsCount: (currentRec.completionsCount || 0) + 1 })}
                      className="px-3 py-1 bg-[#222] hover:bg-[#333] text-white border border-[#444] rounded-sm font-bold"
                    >
                      +1 WORKOUT (+5%)
                    </button>
                  </div>
                </div>

                {/* 2. Custom Exercise Difficulty Multiplier */}
                <div className="space-y-1.5 bg-[#141414] p-3 rounded-sm border border-[#262626]">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-bold uppercase">CUSTOM EXERCISE MULTIPLIER:</span>
                    <span className="text-amber-400 font-bold">{(currentRec.userMultiplier ?? 1.0).toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2.5"
                    step="0.05"
                    value={currentRec.userMultiplier ?? 1.0}
                    onChange={(e) => handleUpdateExerciseOverload(editingExerciseName, { userMultiplier: Number(e.target.value) })}
                    className="w-full accent-amber-400 cursor-pointer h-1.5 bg-[#262626] rounded-lg"
                  />
                  <div className="flex gap-1.5 pt-1">
                    {[0.8, 1.0, 1.25, 1.5, 2.0].map(m => (
                      <button
                        key={m}
                        onClick={() => handleUpdateExerciseOverload(editingExerciseName, { userMultiplier: m })}
                        className={cn(
                          "flex-1 py-1 text-[10px] font-bold uppercase rounded-sm border",
                          Math.abs((currentRec.userMultiplier ?? 1.0) - m) < 0.02
                            ? "bg-amber-500 text-black border-amber-400"
                            : "bg-[#222] text-[#AAA] border-[#333]"
                        )}
                      >
                        {m}x
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Sets & Reps Direct Offsets */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#141414] p-3 rounded-sm border border-[#262626] space-y-1">
                    <span className="text-[#AAA] text-[10px] block uppercase font-bold">TARGET SETS OFFSET</span>
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleUpdateExerciseOverload(editingExerciseName, { userExtraSets: (currentRec.userExtraSets || 0) - 1 })}
                        className="px-2.5 py-1 bg-[#222] text-white rounded-sm font-bold border border-[#333]"
                      >
                        -1
                      </button>
                      <span className="text-white font-bold text-sm">
                        {currentRec.userExtraSets ? (currentRec.userExtraSets > 0 ? `+${currentRec.userExtraSets}` : currentRec.userExtraSets) : '0'}
                      </span>
                      <button
                        onClick={() => handleUpdateExerciseOverload(editingExerciseName, { userExtraSets: (currentRec.userExtraSets || 0) + 1 })}
                        className="px-2.5 py-1 bg-[#222] text-white rounded-sm font-bold border border-[#333]"
                      >
                        +1
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#141414] p-3 rounded-sm border border-[#262626] space-y-1">
                    <span className="text-[#AAA] text-[10px] block uppercase font-bold">TARGET REPS OFFSET</span>
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleUpdateExerciseOverload(editingExerciseName, { userExtraReps: (currentRec.userExtraReps || 0) - 1 })}
                        className="px-2.5 py-1 bg-[#222] text-white rounded-sm font-bold border border-[#333]"
                      >
                        -1
                      </button>
                      <span className="text-white font-bold text-sm">
                        {currentRec.userExtraReps ? (currentRec.userExtraReps > 0 ? `+${currentRec.userExtraReps}` : currentRec.userExtraReps) : '0'}
                      </span>
                      <button
                        onClick={() => handleUpdateExerciseOverload(editingExerciseName, { userExtraReps: (currentRec.userExtraReps || 0) + 1 })}
                        className="px-2.5 py-1 bg-[#222] text-white rounded-sm font-bold border border-[#333]"
                      >
                        +1
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-[#262626]">
                <button
                  onClick={() => {
                    handleUpdateExerciseOverload(editingExerciseName, { completionsCount: 0, userMultiplier: 1.0, userExtraSets: 0, userExtraReps: 0 });
                  }}
                  className="w-1/3 py-2 bg-[#1A1A1A] hover:bg-rose-950 text-rose-300 font-bold uppercase rounded-sm border border-[#333] hover:border-rose-800 text-[10px]"
                >
                  RESET EXERCISE
                </button>
                <button
                  onClick={() => setEditingExerciseName(null)}
                  className="w-2/3 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase rounded-sm transition-all"
                >
                  SAVE & APPLY TUNING
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
