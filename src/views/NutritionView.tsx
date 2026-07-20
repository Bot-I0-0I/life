import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, addXp, FoodTemplate } from '../db/db';
import { Flame, Utensils, Activity, Plus, Trash2, Target, Dumbbell, Droplets, Beef, Wheat, Moon, Save, Download, BarChart3, Shield, TrendingUp, TrendingDown, Clock, Sparkles, CheckCircle } from 'lucide-react';
import { cn, getRank } from '../lib/utils';
import { format, subDays, startOfDay, parseISO } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { PakistaniFoodsSection } from '../components/PakistaniFoodsSection';
import { GrowthSection } from '../components/GrowthSection';

const PAKISTANI_FOOD_ITEMS = [
  { name: 'Roti (Whole Wheat Chapati)', calories: 120, protein: 4, carbs: 24, fat: 1, portion: '1 Medium (40g)' },
  { name: 'Dal Chawal (Lentils & Rice)', calories: 450, protein: 12, carbs: 85, fat: 6, portion: '1 Plate (350g)' },
  { name: 'Chicken Biryani', calories: 550, protein: 28, carbs: 75, fat: 15, portion: '1 Plate (300g)' },
  { name: 'Egg Shami Kabab', calories: 150, protein: 10, carbs: 6, fat: 9, portion: '1 Piece (60g)' },
  { name: 'Chicken Karahi', calories: 380, protein: 32, carbs: 6, fat: 24, portion: '1 Portion (200g)' },
  { name: 'Beef Seekh Kabab', calories: 160, protein: 18, carbs: 2, fat: 9, portion: '1 Skewer (60g)' },
  { name: 'Boiled White Rice', calories: 200, protein: 4, carbs: 44, fat: 0.5, portion: '1 Cup (150g)' },
  { name: 'Chana Chaat (Chickpeas)', calories: 180, protein: 7, carbs: 32, fat: 3, portion: '1 Cup (150g)' },
  { name: 'Mixed Vegetable Curry (Sabzi)', calories: 150, protein: 3, carbs: 18, fat: 8, portion: '1 Cup (150g)' },
  { name: 'Sweet Lassi', calories: 220, protein: 6, carbs: 28, fat: 9, portion: '1 Glass (250ml)' },
  { name: 'Plain Yogurt (Dahi)', calories: 100, protein: 6, carbs: 7, fat: 5, portion: '1 Cup (150g)' },
  { name: 'Omelette (2 Eggs with Onions)', calories: 180, protein: 13, carbs: 2, fat: 14, portion: '1 Plate' },
  { name: 'Paratha (Whole Wheat / Ghee)', calories: 290, protein: 5, carbs: 38, fat: 13, portion: '1 Piece' },
  { name: 'Chai (Traditional Karak Tea)', calories: 90, protein: 2, carbs: 14, fat: 3, portion: '1 Cup' }
];

const PAKISTANI_DIET_PLANS = [
  {
    id: 'pk_weight_loss',
    name: 'LOW-CALORIE SHRED (PAKISTANI)',
    type: 'Weight Loss / Cut',
    description: 'High-protein, moderate-carb traditional diet plan designed to maximize caloric deficit while maintaining lean muscle tissue.',
    totalCalories: 1160,
    totalProtein: 66,
    totalCarbs: 112,
    totalFat: 41,
    meals: [
      { name: 'Roti (1 Medium) + Egg Shami Kabab + Plain Dahi', calories: 370, protein: 20, carbs: 37, fat: 15, time: 'Breakfast' },
      { name: 'Chana Chaat (1 Cup) + Cucumber Green Salad', calories: 200, protein: 7, carbs: 32, fat: 3, time: 'Lunch' },
      { name: 'Seekh Kabab (2 Skewers) + Mixed Sabzi Curry (1 Cup) + Roti (1 Medium)', calories: 590, protein: 39, carbs: 43, fat: 23, time: 'Dinner' }
    ]
  },
  {
    id: 'pk_muscle_gain',
    name: 'POWER BULKING (PAKISTANI)',
    type: 'Muscle Building / Bulk',
    description: 'Traditional calorie-dense, high-protein protocol optimized for massive strength, tissue synthesis, and energy output.',
    totalCalories: 2120,
    totalProtein: 112,
    totalCarbs: 227,
    totalFat: 90,
    meals: [
      { name: 'Omelette (2 Eggs) + Whole Wheat Paratha (1) + Sweet Lassi', calories: 690, protein: 24, carbs: 68, fat: 36, time: 'Breakfast' },
      { name: 'Chicken Biryani (1 Plate) + Plain Yogurt (1 Cup)', calories: 650, protein: 34, carbs: 82, fat: 20, time: 'Lunch' },
      { name: 'Chicken Karahi (1 Portion) + Seekh Kabab (1) + Roti (2 Medium)', calories: 780, protein: 54, carbs: 77, fat: 34, time: 'Dinner' }
    ]
  },
  {
    id: 'pk_balanced',
    name: 'CLEAN HOME BALANCED DIET',
    type: 'Maintenance',
    description: 'A classic, clean home diet providing optimal macro balance, digestive health, and standard maintenance energy.',
    totalCalories: 1355,
    totalProtein: 62,
    totalCarbs: 173,
    totalFat: 44,
    meals: [
      { name: 'Boiled Egg (1) + Roti (1 Medium) + Sweet Chai (1 Cup)', calories: 290, protein: 11, carbs: 38, fat: 7, time: 'Breakfast' },
      { name: 'Dal Chawal (1 Plate) + Cucumber Salad', calories: 465, protein: 13, carbs: 85, fat: 6, time: 'Lunch' },
      { name: 'Chicken Karahi (1 Portion) + Roti (1 Medium) + Plain Yogurt (1 Cup)', calories: 600, protein: 38, carbs: 50, fat: 31, time: 'Dinner' }
    ]
  },
  {
    id: 'pk_keto_shred',
    name: 'KETO SHRED MATRIX (LOW CARB)',
    type: 'Ketogenic / Shred',
    description: 'Low-carb, high-fat metabolic transition protocol to accelerate fat oxidation while using traditional proteins.',
    totalCalories: 1520,
    totalProtein: 95,
    totalCarbs: 15,
    totalFat: 120,
    meals: [
      { name: 'Scrambled Eggs (3) cooked in Desi Ghee + Butter Chai (No Sugar)', calories: 450, protein: 21, carbs: 2, fat: 41, time: 'Breakfast' },
      { name: 'Beef Seekh Kabab (3 Skewers) + Garden Cucumber Mint Salad', calories: 480, protein: 54, carbs: 5, fat: 28, time: 'Lunch' },
      { name: 'Chicken Karahi (1.5 Portion) in Coconut Oil + Plain Full-Fat Dahi', calories: 590, protein: 20, carbs: 8, fat: 51, time: 'Dinner' }
    ]
  },
  {
    id: 'pk_lean_gains',
    name: 'LEAN GAINS (FITNESS PROTOCOL)',
    type: 'Lean Bulk / Athletic',
    description: 'High-protein athletic protocol with clean complex carbs to fuel optimal workout performance and lean muscle growth.',
    totalCalories: 1850,
    totalProtein: 145,
    totalCarbs: 180,
    totalFat: 45,
    meals: [
      { name: 'Egg White Omelette (5 Whites, 1 Whole) + Whole Wheat Roti (1 Medium) + Black Coffee', calories: 340, protein: 28, carbs: 26, fat: 8, time: 'Breakfast' },
      { name: 'Grilled Chicken Tikka (250g) + Boiled White Rice (1.5 Cup) + Fresh Salad', calories: 780, protein: 65, carbs: 72, fat: 14, time: 'Lunch' },
      { name: 'Fish Tikka (200g) + Yellow Dal Tadka (1 Cup) + Roti (1 Medium)', calories: 730, protein: 52, carbs: 82, fat: 23, time: 'Dinner' }
    ]
  },
  {
    id: 'pk_vegetarian',
    name: 'HIGH-FIBER VEGETARIAN PROTOCOL',
    type: 'Plant Based / Maintenance',
    description: 'Nutrient-rich meat-free regimen utilizing traditional whole grains, lentils, and fresh vegetable curries.',
    totalCalories: 1420,
    totalProtein: 55,
    totalCarbs: 210,
    totalFat: 38,
    meals: [
      { name: 'Oatmeal with Bananas, Chia Seeds & Soy/Almond Milk', calories: 380, protein: 10, carbs: 65, fat: 10, time: 'Breakfast' },
      { name: 'Chana Masala Curry (1.5 Cup) + Boiled White Rice (1 Cup) + Plain Dahi', calories: 580, protein: 20, carbs: 95, fat: 12, time: 'Lunch' },
      { name: 'Mixed Sabzi Curry (1.5 Cup) + Yellow Dal (1 Cup) + Roti (1.5 Medium)', calories: 460, protein: 25, carbs: 50, fat: 16, time: 'Dinner' }
    ]
  }
];

const BUILT_IN_WORKOUT_PLANS = [
  {
    id: 's_class_athlete',
    name: 'S-CLASS ATHLETE CONDITIONING',
    area: 'Full Body Performance',
    description: 'Elite conditioning circuit combining heavy resistance and high-intensity power.',
    exercises: [
      { name: 'BARBELL POWER CLEANS', calories: 250, duration: 15, muscleGroup: 'legs', details: '5 sets of 5 reps (Focus on hip drive & clean catch)' },
      { name: 'PLYOMETRIC BOX JUMPS', calories: 150, duration: 10, muscleGroup: 'legs', details: '4 sets of 10 jumps (Step down safely)' },
      { name: 'KETTLEBELL SWINGS', calories: 180, duration: 12, muscleGroup: 'back', details: '4 sets of 15 swings (Snap hips at top)' },
      { name: 'EXPLOSIVE MEDICINE BALL SLAMS', calories: 120, duration: 8, muscleGroup: 'core', details: '3 sets of 15 slams (Engage abs fully)' },
    ]
  },
  {
    id: 'strength_core_matrix',
    name: 'STRENGTH CORE MATRIX',
    area: 'Posterior Chain & Core Stability',
    description: 'Heavy strength matrix to construct high-density muscle mass and ironclad stability.',
    exercises: [
      { name: 'DEADLIFTS (HEAVY SESSIONS)', calories: 300, duration: 20, muscleGroup: 'back', details: '5 sets of 5 reps (Keep spine neutral)' },
      { name: 'BARBELL STANDING OVERHEAD PRESS', calories: 160, duration: 12, muscleGroup: 'shoulders', details: '4 sets of 8 reps (No leg drive)' },
      { name: 'HANGING LEG RAISES', calories: 90, duration: 10, muscleGroup: 'core', details: '3 sets of 12 reps (Squeeze abs, slow lowering)' },
      { name: 'PLANK WITH WEIGHTED ACCENT', calories: 80, duration: 8, muscleGroup: 'core', details: '3 sets of 60 seconds (Hollow body style)' },
    ]
  },
  {
    id: 'no_equipment_day1',
    name: 'DAY 1: UPPER BODY PUSH SHRED (NO EQUIPMENT)',
    area: 'Chest, Shoulders & Triceps Focus',
    description: 'Day 1 of the 7-day home bodyweight cycle. High intensity pressing to shape the chest and arms.',
    exercises: [
      { name: 'STANDARD FLOOR PUSHUPS', calories: 125, duration: 12, muscleGroup: 'chest', details: '4 sets of 15-20 reps (Chest to floor, elbows tucked at 45°)' },
      { name: 'PIKE PUSHUPS (VERTICAL DECAY)', calories: 110, duration: 10, muscleGroup: 'shoulders', details: '3 sets of 8-12 reps (Hips high, nose dives forward)' },
      { name: 'DIAMOND CLOSE-GRIP PUSHUPS', calories: 130, duration: 10, muscleGroup: 'arms', details: '3 sets of 10-15 reps (Isolates triceps & inner chest)' },
      { name: 'FLOOR CHAIR DIPS', calories: 90, duration: 8, muscleGroup: 'arms', details: '3 sets of 15-20 reps (Keep back close to the bench/chair)' },
      { name: 'TEMPO PLANK TO PUSHUP', calories: 95, duration: 8, muscleGroup: 'core', details: '3 sets of 10 reps (Slow, controlled elevation changes)' },
    ]
  },
  {
    id: 'no_equipment_day2',
    name: 'DAY 2: ANABOLIC LOWER MATRIX (NO EQUIPMENT)',
    area: 'Quads, Hamstrings & Glutes Focus',
    description: 'Day 2 of the 7-day home bodyweight cycle. High volume lower body protocol for athletic power and endurance.',
    exercises: [
      { name: 'BODYWEIGHT AIR SQUATS', calories: 150, duration: 15, muscleGroup: 'legs', details: '4 sets of 25 reps (Break parallel depth, squeeze glutes at top)' },
      { name: 'EXPLOSIVE JUMP SQUATS', calories: 160, duration: 10, muscleGroup: 'legs', details: '3 sets of 12-15 reps (Absorb landing softly on midfoot)' },
      { name: 'REVERSE LUNGES (STRENGTH)', calories: 120, duration: 10, muscleGroup: 'legs', details: '3 sets of 15 reps per leg (Upright torso, knee kisses floor)' },
      { name: 'SINGLE-LEG GLUTE BRIDGES', calories: 100, duration: 10, muscleGroup: 'legs', details: '3 sets of 15 reps per side (Drive through heel, hold 1s at top)' },
      { name: 'WALL SIT ENDURANCE HOLD', calories: 80, duration: 8, muscleGroup: 'legs', details: '3 sets of 45-60 seconds (90° knee angle, back flat to wall)' },
    ]
  },
  {
    id: 'no_equipment_day3',
    name: 'DAY 3: METABOLIC SHADOW ENGINE (NO EQUIPMENT)',
    area: 'Cardio, Stamina & Active Lung Capacity',
    description: 'Day 3 of the 7-day home bodyweight cycle. High-intensity aerobic conditioning loops to skyrocket stamina and shred fat.',
    exercises: [
      { name: 'EXPLOSIVE BURPEES', calories: 210, duration: 12, muscleGroup: 'cardio', details: '4 sets of 12-15 reps (Jump high, chest touches floor)' },
      { name: 'HIGH-KNEE RUN DRILLS', calories: 140, duration: 10, muscleGroup: 'cardio', details: '4 sets of 45 seconds (Pump arms, raise knees past hips)' },
      { name: 'MOUNTAIN CLIMBERS (SPRINT)', calories: 130, duration: 8, muscleGroup: 'core', details: '3 sets of 45 seconds (Fast legs, stable core platform)' },
      { name: 'JUMPING JACKS (TEMPO)', calories: 105, duration: 8, muscleGroup: 'cardio', details: '3 sets of 60 seconds (Steady cadence, full arm sweep)' },
      { name: 'SHADOW BOXING LOOPS', calories: 115, duration: 10, muscleGroup: 'cardio', details: '3 rounds of 2 minutes (Punch combinations + head movement)' },
    ]
  },
  {
    id: 'no_equipment_day4',
    name: 'DAY 4: CORE COMMAND STABILITY (NO EQUIPMENT)',
    area: 'Abs, Obliques & Lower Back Core Strength',
    description: 'Day 4 of the 7-day home bodyweight cycle. Hardcore abdominal structural stability matrix.',
    exercises: [
      { name: 'TEMPO FOREARM PLANK', calories: 85, duration: 10, muscleGroup: 'core', details: '3 sets of 60 seconds (Squeeze glutes and protract shoulders)' },
      { name: 'RUSSIAN TWISTS (OBLIQUES)', calories: 95, duration: 8, muscleGroup: 'core', details: '3 sets of 20 reps per side (Slow control, touch floor each side)' },
      { name: 'BICYCLE CRUNCH FLOW', calories: 110, duration: 10, muscleGroup: 'core', details: '3 sets of 20 reps (Touch shoulder to opposite knee)' },
      { name: 'LIE-DOWN ELEVATED LEG RAISES', calories: 90, duration: 10, muscleGroup: 'core', details: '3 sets of 15 reps (Do not let lower back arch off the floor)' },
      { name: 'SUPERMAN EXPANSION HOLD', calories: 75, duration: 8, muscleGroup: 'core', details: '3 sets of 30-45 seconds (Lift chest & knees, squeeze lower back)' },
    ]
  },
  {
    id: 'no_equipment_day5',
    name: 'DAY 5: POSTERIOR BODYWEIGHT FLOW (NO EQUIPMENT)',
    area: 'Back, Rear Deltoids & Hamstrings Focus',
    description: 'Day 5 of the 7-day home bodyweight cycle. Target the pull muscles and posterior chain using zero gear.',
    exercises: [
      { name: 'PRONE T-Y-I STRENGTH FLOW', calories: 100, duration: 12, muscleGroup: 'back', details: '3 sets of 12 reps per position (Keep chest lifted off floor)' },
      { name: 'PRONE SNOW ANGELS', calories: 115, duration: 10, muscleGroup: 'back', details: '3 sets of 15 reps (Sweep arms overhead without touching floor)' },
      { name: 'GOOD MORNINGS (HIP HINGE)', calories: 105, duration: 10, muscleGroup: 'back', details: '3 sets of 20 reps (Hands behind head, push hips back, feel hamstrings)' },
      { name: 'REAR DELT TOWEL PULLS', calories: 95, duration: 8, muscleGroup: 'shoulders', details: '3 sets of 12 reps (Pull towel apart tightly to activate rear delts)' },
      { name: 'TEMPO GLUTE BRIDGES', calories: 90, duration: 10, muscleGroup: 'legs', details: '3 sets of 20 reps (Pause 2s at peak contraction)' },
    ]
  },
  {
    id: 'no_equipment_day6',
    name: 'DAY 6: EXPLOSIVE AGILITY POWER (NO EQUIPMENT)',
    area: 'Plyometrics, Speed & Power Output',
    description: 'Day 6 of the 7-day home bodyweight cycle. High velocity muscle recruitment for speed development.',
    exercises: [
      { name: 'SQUAT THRUST CIRCUITS', calories: 165, duration: 12, muscleGroup: 'legs', details: '4 sets of 15 reps (Kick legs back to plank, snap back and stand)' },
      { name: 'LATERAL BOUNDS (SKATERS)', calories: 140, duration: 10, muscleGroup: 'legs', details: '3 sets of 12 reps per side (Explode laterally, land single-legged)' },
      { name: 'PLYOMETRIC CLAP PUSHUPS', calories: 150, duration: 8, muscleGroup: 'chest', details: '3 sets of 8-10 reps (Explode off floor, land with soft elbows)' },
      { name: 'TUCK JUMPS (EXPLOSIVE)', calories: 170, duration: 8, muscleGroup: 'legs', details: '3 sets of 8 reps (Pull knees high to chest, land softly)' },
      { name: 'TEMPO BEAR CRAWLS', calories: 110, duration: 10, muscleGroup: 'core', details: '3 sets of 30 seconds (Keep back perfectly flat, knees 2 inches off floor)' },
    ]
  },
  {
    id: 'no_equipment_day7',
    name: 'DAY 7: REGULATIVE STRETCH & REST (NO EQUIPMENT)',
    area: 'Mobility, Flexibility & Muscle Recovery',
    description: 'Day 7 of the 7-day home bodyweight cycle. Active recovery to flush waste products and increase range of motion.',
    exercises: [
      { name: 'DEEP COBRA ABDOMINAL STRETCH', calories: 45, duration: 10, muscleGroup: 'core', details: '3 sets of 30s holds (Keep shoulders away from ears, breathe deeply)' },
      { name: 'CHILD\'S POSE ACTIVE RECOVERY', calories: 35, duration: 8, muscleGroup: 'back', details: '3 sets of 45s holds (Sit deep into heels, walk fingers forward)' },
      { name: 'CAT-COW SPINAL LUBRICATION', calories: 40, duration: 8, muscleGroup: 'core', details: '3 sets of 12 cycles (Slow spinal articulation matching breath)' },
      { name: 'PIGEON POSE HIP OPENER', calories: 30, duration: 10, muscleGroup: 'legs', details: '2 sets of 45s per side (Sink weight into glutes, release hip tension)' },
      { name: 'DOWNWARD DOG DECOMPRESSION', calories: 50, duration: 10, muscleGroup: 'back', details: '3 sets of 30s holds (Drive heels down, push floor away with hands)' },
    ]
  },
  {
    id: 'chest_arms_hypertrophy',
    name: 'CHEST & ARMS HYPERTROPHY',
    area: 'Upper Body Expansion',
    description: 'Maximum blood flow volume protocol for intense chest and arm muscle development.',
    exercises: [
      { name: 'INCLINE DUMBBELL PRESS', calories: 200, duration: 15, muscleGroup: 'chest', details: '4 sets of 10-12 reps (Focus on upper chest squeeze)' },
      { name: 'DUMBBELL BICEP CURL MATRIX', calories: 120, duration: 12, muscleGroup: 'arms', details: '3 sets of 12 reps (Supinated squeeze at top)' },
      { name: 'DIPS (WEIGHTED ACCENT)', calories: 140, duration: 10, muscleGroup: 'chest', details: '3 sets of 10 reps (Lean forward for chest engagement)' },
      { name: 'CABLE TRICEP PUSHDOWNS', calories: 110, duration: 10, muscleGroup: 'arms', details: '3 sets of 15 reps (Keep elbows locked in place)' },
    ]
  },
  {
    id: 'cardio_shred_matrix',
    name: 'ATHLETIC SPEED & CARDIO SHRED',
    area: 'Cardiovascular Optimization',
    description: 'High-intensity athletic speed drills designed to maximize calorie burn and endurance.',
    exercises: [
      { name: 'HIIT SPRINT INTERVALS', calories: 350, duration: 20, muscleGroup: 'cardio', details: '10 rounds: 30s sprint / 90s slow jog walk' },
      { name: 'ROWING MACHINE DRILLS', calories: 220, duration: 15, muscleGroup: 'cardio', details: 'Maintain 500m split times, focus on leg drive' },
      { name: 'SHUTTLE RUN DRILLS', calories: 180, duration: 12, muscleGroup: 'cardio', details: '4 sets of 6 shuttle runs (Change direction explosively)' },
    ]
  }
];

export function NutritionView() {
  const userStats = useLiveQuery(() => db.userStats.get(1));
  const vesselLogs = useLiveQuery(() => db.vesselLogs.orderBy('date').toArray());
  const foodTemplates = useLiveQuery(() => db.foodTemplates.toArray());
  const today = React.useMemo(() => format(new Date(), 'yyyy-MM-dd'), []);
  
  const nutritionLogs = useLiveQuery(
    () => db.nutritionLogs.where('date').equals(today).toArray(),
    [today]
  );

  const last7Days = React.useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => format(subDays(new Date(), i), 'yyyy-MM-dd')).reverse();
  }, []);
  
  const weeklyLogs = useLiveQuery(
    () => db.nutritionLogs.where('date').anyOf(last7Days).toArray(),
    [last7Days]
  );

  const recentExerciseLogs = useLiveQuery(
    () => db.nutritionLogs
      .where('date').anyOf(last7Days)
      .filter(log => log.type === 'exercise' && !!log.muscleGroup)
      .toArray(),
    [last7Days]
  );

  const [activeTab, setActiveTab] = useState<'food' | 'exercise' | 'water'>('food');
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [duration, setDuration] = useState('');
  const [amount, setAmount] = useState('');
  const [muscleGroup, setMuscleGroup] = useState<'chest' | 'back' | 'legs' | 'arms' | 'shoulders' | 'core' | 'cardio' | ''>('');
  const [sleepHours, setSleepHours] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [stressLevel, setStressLevel] = useState('');

  // Pakistani diets and foods state
  const [foodMode, setFoodMode] = useState<'manual' | 'pakistan_diets'>('manual');
  const [selectedDietPlanId, setSelectedDietPlanId] = useState('pk_balanced');

  const handleLogDietPlan = async (plan: typeof PAKISTANI_DIET_PLANS[0]) => {
    if (!plan || !plan.meals || plan.meals.length === 0) return;
    
    for (const meal of plan.meals) {
      await db.nutritionLogs.add({
        date: today,
        type: 'food' as const,
        name: `${meal.name} (${meal.time})`,
        calories: Number(meal.calories),
        protein: meal.protein ? Number(meal.protein) : undefined,
        carbs: meal.carbs ? Number(meal.carbs) : undefined,
        fat: meal.fat ? Number(meal.fat) : undefined
      });
    }
    
    // XP gain for logs
    const xpGained = Number(plan.totalCalories) / 2 + 300;
    await addXp(xpGained);
    alert(`Logged entire diet plan: ${plan.name} for today! Gained ${Math.floor(xpGained)} XP.`);
  };

  const handleLogDietMeal = async (meal: any) => {
    await db.nutritionLogs.add({
      date: today,
      type: 'food' as const,
      name: `${meal.name} (${meal.time})`,
      calories: Number(meal.calories),
      protein: meal.protein ? Number(meal.protein) : undefined,
      carbs: meal.carbs ? Number(meal.carbs) : undefined,
      fat: meal.fat ? Number(meal.fat) : undefined
    });
    const xpGained = Number(meal.calories) / 2 + 100;
    await addXp(xpGained);
    alert(`Logged meal: ${meal.name}! Gained ${Math.floor(xpGained)} XP.`);
  };

  const handleLogPakistaniFoodItem = async (item: typeof PAKISTANI_FOOD_ITEMS[0]) => {
    await db.nutritionLogs.add({
      date: today,
      type: 'food' as const,
      name: `${item.name} (${item.portion})`,
      calories: Number(item.calories),
      protein: item.protein ? Number(item.protein) : undefined,
      carbs: item.carbs ? Number(item.carbs) : undefined,
      fat: item.fat ? Number(item.fat) : undefined
    });
    const xpGained = Number(item.calories) / 2 + 50;
    await addXp(xpGained);
    alert(`Logged ${item.name}! Gained ${Math.floor(xpGained)} XP.`);
  };

  // Workout plans state & handlers
  const [exerciseMode, setExerciseMode] = useState<'manual' | 'plans'>('manual');
  const [selectedPlanId, setSelectedPlanId] = useState('s_class_athlete');
  const [customPlans, setCustomPlans] = useState<any[]>(() => {
    const saved = localStorage.getItem('custom_workout_plans');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCreatingCustomPlan, setIsCreatingCustomPlan] = useState(false);
  const [newPlanName, setNewPlanName] = useState('');
  const [newPlanArea, setNewPlanArea] = useState('');
  const [newPlanDesc, setNewPlanDesc] = useState('');
  
  // Custom Plan Creator: List of exercises being added
  const [planExercises, setPlanExercises] = useState<any[]>([]);
  const [newExName, setNewExName] = useState('');
  const [newExCals, setNewExCals] = useState('');
  const [newExDur, setNewExDur] = useState('');
  const [newExMuscle, setNewExMuscle] = useState<'chest' | 'back' | 'legs' | 'arms' | 'shoulders' | 'core' | 'cardio' | ''>('');
  const [newExDetails, setNewExDetails] = useState('');

  const handleLogPlan = async (plan: any) => {
    if (!plan || !plan.exercises || plan.exercises.length === 0) return;
    
    for (const ex of plan.exercises) {
      const logData = {
        date: today,
        type: 'exercise' as const,
        name: ex.name,
        calories: Number(ex.calories),
        duration: Number(ex.duration),
        muscleGroup: ex.muscleGroup || ''
      };
      await db.nutritionLogs.add(logData);
      
      // Calculate XP Gain
      const xpGained = Number(ex.calories) * 2 + 500;
      await addXp(xpGained);
      if (ex.muscleGroup) {
        const stats = await db.userStats.get(1);
        if (stats) {
          const xpField = `${ex.muscleGroup}Xp` as keyof typeof stats;
          await db.userStats.update(1, {
            [xpField]: ((stats[xpField] as number) || 0) + xpGained
          });
        }
      }
    }
    alert(`Logged entire workout plan: ${plan.name}! Gained experience and attribute points.`);
  };

  const handleAddExerciseToPlanBuilder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExName || !newExCals) {
      alert("Please enter at least a name and calories.");
      return;
    }
    const newEx = {
      name: newExName.toUpperCase(),
      calories: Number(newExCals),
      duration: newExDur ? Number(newExDur) : 10,
      muscleGroup: newExMuscle || '',
      details: newExDetails || undefined
    };
    setPlanExercises([...planExercises, newEx]);
    setNewExName('');
    setNewExCals('');
    setNewExDur('');
    setNewExMuscle('');
    setNewExDetails('');
  };

  const handleSaveCustomPlan = () => {
    if (!newPlanName) {
      alert("Please enter a name for your custom workout plan.");
      return;
    }
    if (planExercises.length === 0) {
      alert("Please add at least one exercise to your plan.");
      return;
    }
    const newPlan = {
      id: `custom_${Date.now()}`,
      name: newPlanName.toUpperCase(),
      area: newPlanArea || 'Custom Area',
      description: newPlanDesc || 'Custom athlete workout plan.',
      exercises: planExercises
    };
    const updated = [...customPlans, newPlan];
    setCustomPlans(updated);
    localStorage.setItem('custom_workout_plans', JSON.stringify(updated));
    
    // Reset form states
    setNewPlanName('');
    setNewPlanArea('');
    setNewPlanDesc('');
    setPlanExercises([]);
    setSelectedPlanId(newPlan.id);
    setIsCreatingCustomPlan(false);
    alert(`Custom plan "${newPlan.name}" saved successfully!`);
  };

  const handleDeleteCustomPlan = (planId: string) => {
    const updated = customPlans.filter(p => p.id !== planId);
    setCustomPlans(updated);
    localStorage.setItem('custom_workout_plans', JSON.stringify(updated));
    setSelectedPlanId('s_class_athlete');
    alert("Custom plan deleted!");
  };

  if (!userStats || !nutritionLogs) return <div className="opacity-80 p-4 font-mono uppercase">Loading Metabolism...</div>;

  const level = Math.floor((userStats.xp || 0) / 1000) + 1;
  const rankColor = getRank(level).color;
  const themeColor = userStats?.selectedColor || rankColor;

  // Calculate BMR, TDEE, and BMI with fallback parameters so engine never breaks
  const latestWeightLog = vesselLogs?.slice().reverse().find(log => log.weight !== undefined);
  const currentWeight = latestWeightLog?.weight;
  const todayLog = vesselLogs?.find(l => l.date === today);
  
  let bmr = 0;
  let bmi = null;
  let bmiCategory = '';
  let idealWeightMin = 0;
  let idealWeightMax = 0;

  const isUsingFallbackBiometrics = !(currentWeight && userStats.height && userStats.age && userStats.gender);
  
  const calcWeight = currentWeight || 70; // 70 kg fallback
  const calcHeight = userStats.height || 175; // 175 cm fallback
  const calcAge = userStats.age || 25; // 25 years fallback
  const calcGender = userStats.gender || 'male'; // male fallback
  
  if (calcGender === 'male') {
    bmr = (10 * calcWeight) + (6.25 * calcHeight) - (5 * calcAge) + 5;
  } else if (calcGender === 'female') {
    bmr = (10 * calcWeight) + (6.25 * calcHeight) - (5 * calcAge) - 161;
  } else {
    bmr = (10 * calcWeight) + (6.25 * calcHeight) - (5 * calcAge) - 78; // average
  }

  const heightM = calcHeight / 100;
  bmi = calcWeight / (heightM * heightM);
  
  if (bmi < 18.5) bmiCategory = 'Underweight';
  else if (bmi < 25) bmiCategory = 'Optimal';
  else if (bmi < 30) bmiCategory = 'Overweight';
  else bmiCategory = 'Obese';

  idealWeightMin = 18.5 * (heightM * heightM);
  idealWeightMax = 24.9 * (heightM * heightM);

  // Activity Multiplier
  let activityMultiplier = 1.2; // sedentary
  switch (userStats.activityLevel) {
    case 'light': activityMultiplier = 1.375; break;
    case 'moderate': activityMultiplier = 1.55; break;
    case 'active': activityMultiplier = 1.725; break;
    case 'very_active': activityMultiplier = 1.9; break;
  }

  const tdee = bmr * activityMultiplier;

  // Goal Modifier
  let goalModifier = 0;
  let goalLabel = 'MAINTAIN WEIGHT';

  if (userStats.fitnessGoal === 'lose') {
    goalModifier = -500;
    goalLabel = 'LOSE WEIGHT / CUT';
  } else if (userStats.fitnessGoal === 'build') {
    goalModifier = 500;
    goalLabel = 'BUILD MUSCLE / BULK';
  }

  const targetCalories = Math.round(tdee + goalModifier);
  
  // Weekly Chart Data
  const weeklyChartData = last7Days.map(date => {
    const dayLogs = weeklyLogs?.filter(log => log.date === date && log.type === 'food') || [];
    const protein = dayLogs.reduce((sum, log) => sum + (log.protein || 0), 0);
    const carbs = dayLogs.reduce((sum, log) => sum + (log.carbs || 0), 0);
    const fat = dayLogs.reduce((sum, log) => sum + (log.fat || 0), 0);
    
    return {
      date: format(parseISO(date), 'EEE'),
      fullDate: date,
      calories: dayLogs.reduce((sum, log) => sum + (log.calories || 0), 0),
      protein: protein,
      carbs: carbs,
      fat: fat,
      proteinCals: protein * 4,
      carbsCals: carbs * 4,
      fatCals: fat * 9,
    };
  });

  const totalWeeklyCalories = weeklyChartData.reduce((sum, day) => sum + day.calories, 0);
  const avgWeeklyCalories = Math.round(totalWeeklyCalories / 7);

  // Target Macros calculated based on settings (Balanced, Keto, High Protein, Custom)
  const macroGoalRatio = (userStats as any).macroGoalRatio || 'balanced';
  let targetProtein = 0;
  let targetFat = 0;
  let targetCarbs = 0;

  if (macroGoalRatio === 'keto') {
    // Keto: 25% Protein, 70% Fat, 5% Carbs
    targetProtein = Math.round((targetCalories * 0.25) / 4);
    targetFat = Math.round((targetCalories * 0.70) / 9);
    targetCarbs = Math.round((targetCalories * 0.05) / 4);
  } else if (macroGoalRatio === 'high_protein') {
    // High Protein: 40% Protein, 30% Carbs, 30% Fat
    targetProtein = Math.round((targetCalories * 0.40) / 4);
    targetCarbs = Math.round((targetCalories * 0.30) / 4);
    targetFat = Math.round((targetCalories * 0.30) / 9);
  } else if (macroGoalRatio === 'custom' && (userStats as any).customProtein && (userStats as any).customCarbs && (userStats as any).customFat) {
    // Custom ratios percentages
    const pPct = ((userStats as any).customProtein || 30) / 100;
    const cPct = ((userStats as any).customCarbs || 40) / 100;
    const fPct = ((userStats as any).customFat || 30) / 100;
    targetProtein = Math.round((targetCalories * pPct) / 4);
    targetCarbs = Math.round((targetCalories * cPct) / 4);
    targetFat = Math.round((targetCalories * fPct) / 9);
  } else {
    // Balanced default: 30% Protein, 40% Carbs, 30% Fat
    targetProtein = Math.round((targetCalories * 0.30) / 4);
    targetCarbs = Math.round((targetCalories * 0.40) / 4);
    targetFat = Math.round((targetCalories * 0.30) / 9);
  }

  const consumedCalories = nutritionLogs.filter(log => log.type === 'food').reduce((acc, log) => acc + log.calories, 0);
  const burnedCalories = nutritionLogs.filter(log => log.type === 'exercise').reduce((acc, log) => acc + log.calories, 0);
  const consumedProtein = nutritionLogs.filter(log => log.type === 'food').reduce((acc, log) => acc + (log.protein || 0), 0);
  const consumedCarbs = nutritionLogs.filter(log => log.type === 'food').reduce((acc, log) => acc + (log.carbs || 0), 0);
  const consumedFat = nutritionLogs.filter(log => log.type === 'food').reduce((acc, log) => acc + (log.fat || 0), 0);
  const consumedWater = nutritionLogs.filter(log => log.type === 'water').reduce((acc, log) => acc + (log.amount || 0), 0);
  
  const netCalories = consumedCalories - burnedCalories;
  const remainingCalories = targetCalories - netCalories;

  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'water') {
      if (!amount) return;
      await db.nutritionLogs.add({
        date: today,
        type: 'water',
        name: 'Water',
        calories: 0,
        amount: parseInt(amount)
      });
      setAmount('');
      return;
    }

    if (!name || !calories) return;

    const logData: any = {
      date: today,
      type: activeTab,
      name,
      calories: parseInt(calories),
    };

    if (protein) logData.protein = parseInt(protein);
    if (carbs) logData.carbs = parseInt(carbs);
    if (fat) logData.fat = parseInt(fat);
    if (duration) logData.duration = parseInt(duration);
    if (activeTab === 'exercise' && muscleGroup) logData.muscleGroup = muscleGroup;

    await db.nutritionLogs.add(logData);

    if (activeTab === 'exercise') {
      const xpGained = parseInt(calories) * 2 + 500; // Generous XP to make leveling easy
      await addXp(xpGained);
      if (muscleGroup) {
        const stats = await db.userStats.get(1);
        if (stats) {
          const xpField = `${muscleGroup}Xp` as keyof typeof stats;
          await db.userStats.update(1, {
            [xpField]: ((stats[xpField] as number) || 0) + xpGained
          });
        }
      }
    }

    setName('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
    setDuration('');
    setMuscleGroup('');
    setSelectedTemplateId('');
  };

  const handleSaveTemplate = async () => {
    if (!name || !calories) {
      alert("Please enter at least a name and calories to save a template.");
      return;
    }

    await db.foodTemplates.add({
      name: name,
      calories: Number(calories),
      protein: protein ? Number(protein) : undefined,
      carbs: carbs ? Number(carbs) : undefined,
      fat: fat ? Number(fat) : undefined,
    });
    
    alert("Food template saved!");
  };

  const handleLoadTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    if (!templateId) {
      setName('');
      setCalories('');
      setProtein('');
      setCarbs('');
      setFat('');
      return;
    }

    const template = foodTemplates?.find(t => t.id === Number(templateId));
    if (template) {
      setName(template.name);
      setCalories(template.calories.toString());
      setProtein(template.protein?.toString() || '');
      setCarbs(template.carbs?.toString() || '');
      setFat(template.fat?.toString() || '');
    }
  };

  const handleDelete = async (id: number) => {
    const log = await db.nutritionLogs.get(id);
    if (log && log.type === 'exercise' && log.calories) {
      const xpToRemove = Math.floor(log.calories / 10);
      if (userStats) {
        await db.userStats.update(1, {
          xp: Math.max(0, userStats.xp - xpToRemove)
        });
      }
    }
    await db.nutritionLogs.delete(id);
  };

  const handleLogSleep = async () => {
    if (!sleepHours) return;
    const existing = vesselLogs?.find(l => l.date === today);
    if (existing) {
      await db.vesselLogs.update(existing.id!, { sleepHours: parseFloat(sleepHours) });
    } else {
      await db.vesselLogs.add({ date: today, sleepHours: parseFloat(sleepHours) });
    }
    setSleepHours('');
  };

  const handleLogVessel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight) return;

    const existing = await db.vesselLogs.where('date').equals(today).first();

    const logData = {
      weight: parseFloat(weight),
      bodyFat: bodyFat ? parseFloat(bodyFat) : undefined,
      stressLevel: stressLevel ? parseInt(stressLevel) as 1|2|3|4|5 : undefined
    };

    if (existing) {
      await db.vesselLogs.update(existing.id!, logData);
    } else {
      await db.vesselLogs.add({
        date: today,
        ...logData
      });
    }

    setWeight('');
    setBodyFat('');
    setStressLevel('');
  };

  // Calculate Muscle Load
  const muscleLoad: Record<string, number> = {
    chest: 0, back: 0, legs: 0, arms: 0, shoulders: 0, core: 0, cardio: 0
  };
  
  if (recentExerciseLogs) {
    recentExerciseLogs.forEach(log => {
      if (log.muscleGroup) {
        // Use duration as primary load metric, fallback to calories / 10 if no duration
        const load = log.duration ? log.duration : (log.calories / 10);
        muscleLoad[log.muscleGroup] += load;
      }
    });
  }

  const muscleChartData = Object.entries(muscleLoad).map(([muscle, load]) => ({
    name: muscle.toUpperCase(),
    load: Math.round(load)
  }));

  // Recovery Status Calculation
  const last7DaysLogs = vesselLogs?.filter(log => {
    const logDate = new Date(log.date);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return logDate >= sevenDaysAgo;
  }) || [];

  const sleepLogs = last7DaysLogs.filter(l => l.sleepHours !== undefined);
  const avgSleep = sleepLogs.length > 0 
    ? sleepLogs.reduce((sum, l) => sum + (l.sleepHours || 0), 0) / sleepLogs.length 
    : 0;

  let recoveryStatus = 'Unknown';
  if (avgSleep > 0) {
    if (avgSleep >= 7 && avgSleep <= 9) {
      recoveryStatus = 'Optimal';
    } else if (avgSleep >= 6) {
      recoveryStatus = 'Fair';
    } else {
      recoveryStatus = 'Poor';
    }
  }

  return (
    <div className="space-y-6 md:space-y-8 pb-10">
      <header className="hidden md:block border-b border-[#262626] pb-4 md:pb-6">
        <h2 className="text-2xl md:text-3xl font-mono font-bold tracking-tight text-white flex items-center uppercase" style={{ color: themeColor }}>
          METABOLIC ENGINE
        </h2>
        <p className="text-[#A3A3A3] text-xs md:text-sm mt-1 font-mono uppercase">Advanced tracking for caloric intake, macros, and physical exertion.</p>
      </header>

      {isUsingFallbackBiometrics && (
        <div className="bg-amber-950/20 border border-amber-800/40 text-amber-300 rounded-sm p-4 text-xs font-mono uppercase tracking-widest leading-relaxed relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-amber-800/20 text-[9px] px-2 py-0.5 rounded-bl-sm font-bold text-amber-400">DEMO MODE</div>
          ⚠️ STANDARD BASELINE BIOMETRICS ACTIVE (70KG, 175CM, 25Y). UPDATE IDENTITY IN THE SETTINGS TAB TO CUSTOMIZE YOUR METABOLIC PROFILE.
        </div>
      )}

      {/* Metabolic Profile */}
      {bmr > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-4 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#262626]"></div>
            <div className="text-[#A3A3A3] text-[10px] font-mono tracking-widest mb-1 flex items-center uppercase">
              <Activity className="w-3 h-3 mr-1" />
              BASAL METABOLIC RATE
            </div>
            <div className="text-2xl font-mono font-bold text-white">{Math.round(bmr)} <span className="text-sm text-[#A3A3A3]">KCAL</span></div>
            <div className="text-[10px] font-mono text-[#A3A3A3] mt-1 uppercase tracking-widest">Calories burned at rest</div>
          </div>
          
          <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#262626]"></div>
            <div className="text-[#A3A3A3] text-[10px] font-mono tracking-widest mb-1 flex items-center uppercase">
              <Flame className="w-3 h-3 mr-1" />
              TOTAL DAILY ENERGY (TDEE)
            </div>
            <div className="text-2xl font-mono font-bold text-orange-400">{Math.round(tdee)} <span className="text-sm text-orange-400/50">KCAL</span></div>
            <div className="text-[10px] font-mono text-[#A3A3A3] mt-1 uppercase tracking-widest">Maintenance calories</div>
          </div>

          <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-4 relative overflow-hidden group">
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#262626]"></div>
            <div className="text-[#A3A3A3] text-[10px] font-mono tracking-widest mb-1 flex items-center uppercase">
              <Activity className="w-3 h-3 mr-1" />
              BMI INDEX
            </div>
            <div className="text-2xl font-mono font-bold text-white">{bmi?.toFixed(1)}</div>
            <div className={cn(
              "text-[10px] font-mono mt-1 uppercase tracking-widest",
              bmiCategory === 'Optimal' ? "text-green-400" :
              bmiCategory === 'Underweight' ? "text-blue-400" :
              "text-red-400"
            )}>
              {bmiCategory.toUpperCase()}
            </div>
          </div>

          <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-4 relative overflow-hidden group">
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#262626]"></div>
            <div className="text-[#A3A3A3] text-[10px] font-mono tracking-widest mb-1 flex items-center uppercase">
              <Target className="w-3 h-3 mr-1" />
              OPTIMAL CAPACITY
            </div>
            <div className="text-2xl font-mono font-bold text-white">
              {idealWeightMin.toFixed(1)}<span className="text-sm text-[#A3A3A3]">-</span>{idealWeightMax.toFixed(1)} <span className="text-sm text-[#A3A3A3]">KG</span>
            </div>
            <div className="text-[10px] font-mono text-[#A3A3A3] mt-1 uppercase tracking-widest">Target weight range</div>
          </div>
        </div>
      ) : (
        <div className="bg-[#0A0A0A] border border-dashed border-[#262626] rounded-sm p-6 text-center">
          <p className="text-[#A3A3A3] font-mono text-xs tracking-widest uppercase">Please update your profile (height, age, gender) and log your weight to calculate your metabolic profile.</p>
        </div>
      )}

      {/* Professional Dashboard */}
      {bmr > 0 && (
        <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-5 md:p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2" style={{ borderColor: themeColor }}></div>
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2" style={{ borderColor: themeColor }}></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h3 className="text-lg font-mono text-white flex items-center font-bold tracking-widest uppercase">
                <Target className="w-5 h-5 mr-2" style={{ color: themeColor }} />
                DAILY TARGET: {goalLabel}
              </h3>
            </div>
            <div className="text-left md:text-right">
              <div className="text-3xl font-mono text-white font-black">
                {netCalories} <span className="text-sm text-[#A3A3A3]">/ {targetCalories} KCAL</span>
              </div>
              <div className={cn("text-[10px] font-mono mt-1 tracking-widest uppercase", remainingCalories >= 0 ? "text-green-400" : "text-red-400")}>
                {remainingCalories >= 0 ? `${remainingCalories} REMAINING` : `${Math.abs(remainingCalories)} OVER LIMIT`}
              </div>
            </div>
          </div>

          {/* Calorie Progress Bar */}
          <div className="w-full bg-[#141414] rounded-sm h-2 mb-8 border border-[#262626] overflow-hidden">
            <div 
              className="h-full transition-all duration-500"
              style={{ 
                width: `${targetCalories > 0 ? Math.min((netCalories / targetCalories) * 100, 100) : 0}%`,
                backgroundColor: netCalories > targetCalories ? '#ef4444' : themeColor 
              }}
            />
          </div>

          {/* Macros Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
            {/* Protein */}
            <div className="bg-[#141414] border border-[#262626] rounded-sm p-3 md:p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-mono text-[#A3A3A3] flex items-center tracking-widest uppercase">
                  <Beef className="w-3 h-3 mr-1 text-red-400" /> PROTEIN
                </span>
                <span className="text-[10px] font-mono text-white tracking-widest">{consumedProtein} / {targetProtein}G</span>
              </div>
              <div className="w-full bg-[#0A0A0A] rounded-sm h-1 overflow-hidden">
                <div 
                  className="h-full bg-red-400 transition-all duration-500"
                  style={{ width: `${targetProtein > 0 ? Math.min((consumedProtein / targetProtein) * 100, 100) : 0}%` }}
                />
              </div>
            </div>

            {/* Carbs */}
            <div className="bg-[#141414] border border-[#262626] rounded-sm p-3 md:p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-mono text-[#A3A3A3] flex items-center tracking-widest uppercase">
                  <Wheat className="w-3 h-3 mr-1 text-yellow-400" /> CARBS
                </span>
                <span className="text-[10px] font-mono text-white tracking-widest">{consumedCarbs} / {targetCarbs}G</span>
              </div>
              <div className="w-full bg-[#0A0A0A] rounded-sm h-1 overflow-hidden">
                <div 
                  className="h-full bg-yellow-400 transition-all duration-500"
                  style={{ width: `${targetCarbs > 0 ? Math.min((consumedCarbs / targetCarbs) * 100, 100) : 0}%` }}
                />
              </div>
            </div>

            {/* Fat */}
            <div className="bg-[#141414] border border-[#262626] rounded-sm p-3 md:p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-mono text-[#A3A3A3] flex items-center tracking-widest uppercase">
                  <Droplets className="w-3 h-3 mr-1 text-blue-400" /> FAT
                </span>
                <span className="text-[10px] font-mono text-white tracking-widest">{consumedFat} / {targetFat}G</span>
              </div>
              <div className="w-full bg-[#0A0A0A] rounded-sm h-1 overflow-hidden">
                <div 
                  className="h-full bg-blue-400 transition-all duration-500"
                  style={{ width: `${targetFat > 0 ? Math.min((consumedFat / targetFat) * 100, 100) : 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* Weekly Chart */}
          <div className="mt-8 pt-8 border-t border-[#262626]">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
              <div>
                <h3 className="text-lg font-mono text-white flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" style={{ color: themeColor }} />
                  WEEKLY NUTRITION ANALYSIS
                </h3>
                <p className="text-[10px] font-mono text-[#A3A3A3] mt-1">
                  Total: {totalWeeklyCalories} kcal | Avg: {avgWeeklyCalories} kcal/day
                </p>
              </div>
              <div className="flex flex-wrap gap-4 text-[10px] font-mono">
                <div className="flex items-center gap-1"><div className="w-2 h-2 bg-[#3B82F6] rounded-full"></div> PROTEIN</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 bg-[#10B981] rounded-full"></div> CARBS</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 bg-[#F59E0B] rounded-full"></div> FAT</div>
              </div>
            </div>
            <div className="h-[250px] w-full min-h-[250px] mt-4">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <BarChart data={weeklyChartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#A3A3A3', fontSize: 10, fontFamily: 'monospace' }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#A3A3A3', fontSize: 10, fontFamily: 'monospace' }} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#141414', border: '1px solid #262626', borderRadius: '8px', fontFamily: 'monospace' }}
                    itemStyle={{ fontSize: '12px' }}
                    cursor={{ fill: '#262626', opacity: 0.4 }}
                    formatter={(value: number, name: string) => {
                      if (name === 'proteinCals') return [`${value} kcal`, 'Protein'];
                      if (name === 'carbsCals') return [`${value} kcal`, 'Carbs'];
                      if (name === 'fatCals') return [`${value} kcal`, 'Fat'];
                      return [value, name];
                    }}
                  />
                  <Bar dataKey="proteinCals" name="Protein" stackId="a" fill="#3B82F6" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="carbsCals" name="Carbs" stackId="a" fill="#10B981" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="fatCals" name="Fat" stackId="a" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards (Consumed vs Burned vs Water) */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-4 md:p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-green-400"></div>
          <div className="flex justify-between items-center mb-2 pl-2">
            <span className="text-[10px] md:text-xs font-mono text-[#A3A3A3] tracking-widest uppercase">CONSUMED</span>
            <Utensils className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-xl md:text-3xl font-black font-mono text-white pl-2">{consumedCalories} <span className="text-[10px] md:text-sm text-[#A3A3A3]">KCAL</span></div>
        </div>
        <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-4 md:p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-400"></div>
          <div className="flex justify-between items-center mb-2 pl-2">
            <span className="text-[10px] md:text-xs font-mono text-[#A3A3A3] tracking-widest uppercase">BURNED</span>
            <Activity className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-xl md:text-3xl font-black font-mono text-white pl-2">{burnedCalories} <span className="text-[10px] md:text-sm text-[#A3A3A3]">KCAL</span></div>
        </div>
        <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-4 md:p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-400"></div>
          <div className="flex justify-between items-center mb-2 pl-2">
            <span className="text-[10px] md:text-xs font-mono text-[#A3A3A3] tracking-widest uppercase">HYDRATION</span>
            <Droplets className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl md:text-3xl font-black font-mono text-white pl-2">{consumedWater} <span className="text-[10px] md:text-sm text-[#A3A3A3]">ML</span></div>
        </div>
      </div>

      {/* Muscle Load Visualization */}
      <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-4 md:p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#262626]"></div>
        <h3 className="text-lg font-mono text-white mb-4 flex items-center font-bold tracking-widest uppercase">
          <Dumbbell className="w-5 h-5 mr-2" style={{ color: themeColor }} />
          MUSCLE LOAD (7-DAY ESTIMATION)
        </h3>
        <div className="h-[250px] w-full min-h-[250px] mt-4">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <BarChart data={muscleChartData} layout="vertical" margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" horizontal={false} />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#A3A3A3', fontSize: 10, fontFamily: 'monospace' }} />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#A3A3A3', fontSize: 10, fontFamily: 'monospace' }} width={80} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#141414', border: '1px solid #262626', borderRadius: '8px', fontFamily: 'monospace' }}
                itemStyle={{ fontSize: '12px', color: '#fff' }}
                cursor={{ fill: '#262626', opacity: 0.4 }}
                formatter={(value: number) => [`${value} Load`, 'Strain']}
              />
              <Bar dataKey="load" radius={[0, 4, 4, 0]}>
                {muscleChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.load > 75 ? '#ef4444' : entry.load > 40 ? '#eab308' : themeColor} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sleep & Recovery Card */}
      <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-4 md:p-6 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#262626]"></div>
        <h3 className="text-lg font-mono text-white mb-4 flex items-center font-bold tracking-widest uppercase">
          <Moon className="w-5 h-5 mr-2 text-indigo-400" />
          SLEEP & RECOVERY
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <div className="text-3xl font-black font-mono text-white mb-2">
              {todayLog?.sleepHours || 0} <span className="text-sm font-normal text-[#A3A3A3] tracking-widest uppercase">HRS LOGGED TODAY</span>
            </div>
            <p className="text-xs text-[#A3A3A3] font-mono leading-relaxed uppercase tracking-wider">
              Optimal sleep (7-9 hours) is critical for metabolic health, muscle recovery, and cognitive function. Lack of sleep increases cortisol and decreases insulin sensitivity, hindering fat loss and muscle growth.
            </p>
          </div>
          <div className="flex items-end">
            <div className="w-full">
              <label className="block text-[10px] font-mono text-[#A3A3A3] mb-1 tracking-widest uppercase">LOG SLEEP (HOURS)</label>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  step="0.5"
                  value={sleepHours}
                  onChange={(e) => setSleepHours(e.target.value)}
                  className="w-full bg-[#141414] border border-[#262626] rounded-sm px-4 py-2 text-white font-mono text-sm focus:outline-none focus:border-indigo-400"
                  placeholder="E.G., 7.5"
                />
                <button 
                  onClick={handleLogSleep}
                  className="bg-[#262626] hover:bg-[#333] text-white px-6 py-2 rounded-sm font-mono text-xs font-bold tracking-widest transition-colors border border-[#262626] hover:border-indigo-400"
                >
                  LOG
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RECOVERY STATUS */}
        <div className="pt-6 border-t border-[#262626]">
          <div className="flex items-center space-x-2 mb-4">
            <Activity className="w-4 h-4 text-[#A3A3A3]" />
            <span className="text-xs font-mono font-bold tracking-widest text-[#A3A3A3]">RECOVERY STATUS</span>
          </div>
          
          <div className="flex items-baseline space-x-2 mb-2">
            <h3 className="text-2xl font-black font-mono text-white tracking-widest uppercase">{recoveryStatus}</h3>
            <span className="text-xs font-mono text-[#A3A3A3]">({avgSleep > 0 ? avgSleep.toFixed(1) : '--'} HRS AVG)</span>
          </div>
          
          <p className="text-xs font-mono text-[#A3A3A3] mb-6 leading-relaxed">
            {recoveryStatus === 'Optimal' && "Your vessel is in an optimal state for muscle synthesis and cognitive recovery. Maintain current sleep patterns."}
            {recoveryStatus === 'Fair' && "Recovery is adequate but could be improved. Aim for 7-9 hours of sleep to maximize growth and performance."}
            {recoveryStatus === 'Poor' && "Warning: Insufficient recovery detected. Cortisol levels may be elevated, hindering muscle growth and fat loss. Prioritize rest."}
            {recoveryStatus === 'Unknown' && "Insufficient data to determine recovery status. Log your sleep in the Metabolism tab."}
          </p>
          
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-2 h-6" style={{ backgroundColor: i <= (recoveryStatus === 'Optimal' ? 5 : recoveryStatus === 'Fair' ? 3 : recoveryStatus === 'Poor' ? 1 : 0) ? themeColor : '#262626' }}></div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Input Form */}
        <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-4 md:p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2" style={{ borderColor: themeColor }}></div>
          <div className="flex flex-wrap gap-4 mb-6 border-b border-[#262626]">
            <button
              onClick={() => setActiveTab('food')}
              className={cn(
                "pb-2 text-xs font-mono font-bold tracking-widest transition-colors relative uppercase",
                activeTab === 'food' ? "text-white" : "text-[#A3A3A3] hover:text-white"
              )}
            >
              LOG NUTRITION
              {activeTab === 'food' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5" style={{ backgroundColor: themeColor }}></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('exercise')}
              className={cn(
                "pb-2 text-xs font-mono font-bold tracking-widest transition-colors relative uppercase",
                activeTab === 'exercise' ? "text-white" : "text-[#A3A3A3] hover:text-white"
              )}
            >
              LOG EXERTION
              {activeTab === 'exercise' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5" style={{ backgroundColor: themeColor }}></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('water')}
              className={cn(
                "pb-2 text-xs font-mono font-bold tracking-widest transition-colors relative uppercase",
                activeTab === 'water' ? "text-white" : "text-[#A3A3A3] hover:text-white"
              )}
            >
              HYDRATION
              {activeTab === 'water' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5" style={{ backgroundColor: themeColor }}></span>
              )}
            </button>
          </div>

          {activeTab === 'food' && (
            <div className="flex gap-2 mb-6 border border-[#262626] bg-[#141414] p-1 rounded-sm">
              <button
                type="button"
                onClick={() => setFoodMode('manual')}
                className={cn(
                  "flex-1 py-1.5 text-[10px] font-mono font-bold tracking-widest uppercase transition-all rounded-sm",
                  foodMode === 'manual' ? "bg-[#262626] text-white border border-[#333]" : "text-[#A3A3A3] hover:text-white"
                )}
              >
                MANUAL / TEMPLATES
              </button>
              <button
                type="button"
                onClick={() => setFoodMode('pakistan_diets')}
                className={cn(
                  "flex-1 py-1.5 text-[10px] font-mono font-bold tracking-widest uppercase transition-all rounded-sm",
                  foodMode === 'pakistan_diets' ? "bg-[#262626] text-white border border-[#333]" : "text-[#A3A3A3] hover:text-white"
                )}
              >
                PAKISTANI DIETS
              </button>
            </div>
          )}

          {activeTab === 'exercise' && (
            <div className="flex gap-2 mb-6 border border-[#262626] bg-[#141414] p-1 rounded-sm">
              <button
                type="button"
                onClick={() => setExerciseMode('manual')}
                className={cn(
                  "flex-1 py-1.5 text-[10px] font-mono font-bold tracking-widest uppercase transition-all rounded-sm",
                  exerciseMode === 'manual' ? "bg-[#262626] text-white border border-[#333]" : "text-[#A3A3A3] hover:text-white"
                )}
              >
                MANUAL ENTRY
              </button>
              <button
                type="button"
                onClick={() => {
                  setExerciseMode('plans');
                  setIsCreatingCustomPlan(false);
                }}
                className={cn(
                  "flex-1 py-1.5 text-[10px] font-mono font-bold tracking-widest uppercase transition-all rounded-sm",
                  exerciseMode === 'plans' ? "bg-[#262626] text-white border border-[#333]" : "text-[#A3A3A3] hover:text-white"
                )}
              >
                ATHLETE WORKOUT PLANS
              </button>
            </div>
          )}

          {activeTab === 'food' && foodMode === 'pakistan_diets' ? (
            <PakistaniFoodsSection
              themeColor={themeColor}
              onLogFoodItem={handleLogPakistaniFoodItem}
              onLogDietPlan={handleLogDietPlan}
              onLogDietMeal={handleLogDietMeal}
            />
          ) : activeTab === 'exercise' && exerciseMode === 'plans' ? (
            <div className="space-y-4">
              {/* Creator Toggle / Plans Select */}
              {!isCreatingCustomPlan ? (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-[10px] font-mono text-[#A3A3A3] tracking-widest uppercase">SELECT ATHLETE WORKOUT PLAN</label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingCustomPlan(true);
                        setPlanExercises([]);
                      }}
                      className="text-[10px] font-mono font-bold tracking-widest text-indigo-400 hover:text-indigo-300 uppercase transition-colors font-bold"
                    >
                      + CREATE CUSTOM PLAN
                    </button>
                  </div>

                  <select
                    value={selectedPlanId}
                    onChange={(e) => setSelectedPlanId(e.target.value)}
                    className="w-full bg-[#141414] border border-[#262626] rounded-sm px-4 py-3 text-white font-mono text-xs tracking-wider focus:outline-none focus:ring-1 transition-colors uppercase cursor-pointer"
                    style={{ '--tw-ring-color': themeColor, outlineColor: themeColor } as any}
                  >
                    <optgroup label="BUILT-IN PERFORMANCE PLANS">
                      {BUILT_IN_WORKOUT_PLANS.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </optgroup>
                    {customPlans.length > 0 && (
                      <optgroup label="YOUR CUSTOM WORKOUT PLANS">
                        {customPlans.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </optgroup>
                    )}
                  </select>

                  {/* Selected Plan Details & Exercises */}
                  {(() => {
                    const plan = BUILT_IN_WORKOUT_PLANS.find(p => p.id === selectedPlanId) || customPlans.find(p => p.id === selectedPlanId);
                    if (!plan) return <p className="text-xs font-mono text-[#555] uppercase">Select a plan to preview exercises.</p>;
                    const totalCalories = plan.exercises.reduce((sum: number, ex: any) => sum + ex.calories, 0);
                    const totalDuration = plan.exercises.reduce((sum: number, ex: any) => sum + ex.duration, 0);
                    
                    return (
                      <div className="bg-[#141414] border border-[#262626] rounded-sm p-4 space-y-3 relative overflow-hidden">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[9px] font-mono px-2 py-0.5 bg-[#262626] border border-[#333] text-[#A3A3A3] rounded-sm tracking-widest uppercase">{plan.area}</span>
                            <h4 className="text-sm font-mono font-bold tracking-wider text-white mt-1 uppercase">{plan.name}</h4>
                          </div>
                          {plan.id.startsWith('custom_') && (
                            <button
                              type="button"
                              onClick={() => handleDeleteCustomPlan(plan.id)}
                              className="text-red-500 hover:text-red-400 p-1 border border-transparent hover:border-red-950/50 hover:bg-red-950/20 rounded-sm transition-all cursor-pointer"
                              title="Delete custom plan"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        <p className="text-[10px] font-mono text-[#A3A3A3] leading-relaxed uppercase tracking-wider">{plan.description}</p>
                        
                        <div className="border-t border-[#262626] pt-3 space-y-2">
                          <span className="text-[9px] font-mono text-[#555] tracking-widest uppercase font-bold">PREVIEW EXERCISES ({plan.exercises.length})</span>
                          <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                            {plan.exercises.map((ex: any, idx: number) => (
                              <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono py-2 border-b border-[#262626]/40 last:border-0 gap-2">
                                <div className="flex items-start gap-2">
                                  <Dumbbell className="w-3.5 h-3.5 mt-0.5" style={{ color: themeColor }} />
                                  <div>
                                    <span className="text-white text-[10px] font-bold tracking-wider uppercase block">{ex.name}</span>
                                    {ex.details && (
                                      <span className="text-[8.5px] text-[#A3A3A3] uppercase tracking-wider block mt-0.5">
                                        👉 {ex.details}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="text-[9px] text-[#A3A3A3] tracking-widest uppercase text-right">
                                  {ex.calories} KCAL | {ex.duration} MIN | <span style={{ color: themeColor }}>{ex.muscleGroup}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-[#262626] text-xs font-mono bg-[#0A0A0A] -mx-4 -mb-4 p-4">
                          <div className="text-[#A3A3A3] uppercase tracking-wider text-[10px]">
                            TOTAL: <span className="text-white font-bold">{totalCalories} KCAL</span> / <span className="text-white font-bold">{totalDuration} MIN</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleLogPlan(plan)}
                            className="flex items-center space-x-1 border border-transparent px-3 py-1.5 rounded-sm transition-colors text-black font-mono text-[10px] font-bold tracking-widest uppercase cursor-pointer"
                            style={{ backgroundColor: themeColor }}
                          >
                            <Plus className="w-3.5 h-3.5 text-black" />
                            <span>EXECUTE WORKOUT</span>
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </>
              ) : (
                /* Custom Workout Plan Builder Form */
                <div className="bg-[#141414] border border-[#262626] rounded-sm p-4 space-y-4">
                  <div className="flex justify-between items-center border-b border-[#262626] pb-2">
                    <span className="text-xs font-mono font-bold text-white tracking-widest uppercase flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-indigo-400" /> CUSTOM PLAN BUILDER
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsCreatingCustomPlan(false)}
                      className="text-[10px] font-mono text-[#A3A3A3] hover:text-white uppercase transition-colors"
                    >
                      CANCEL
                    </button>
                  </div>

                  {/* Plan Meta Inputs */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[9px] font-mono text-[#A3A3A3] mb-1 tracking-widest uppercase">WORKOUT PLAN NAME</label>
                      <input 
                        type="text" 
                        value={newPlanName}
                        onChange={(e) => setNewPlanName(e.target.value)}
                        className="w-full bg-[#0A0A0A] border border-[#262626] rounded-sm px-3 py-2 text-white font-mono text-xs tracking-wider focus:outline-none focus:ring-1 uppercase placeholder:text-[#333]"
                        placeholder="E.G., ATHLETE POWER MATRIX"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] font-mono text-[#A3A3A3] mb-1 tracking-widest uppercase">TARGET AREA / FOCUS</label>
                        <input 
                          type="text" 
                          value={newPlanArea}
                          onChange={(e) => setNewPlanArea(e.target.value)}
                          className="w-full bg-[#0A0A0A] border border-[#262626] rounded-sm px-3 py-2 text-white font-mono text-xs tracking-wider focus:outline-none focus:ring-1 uppercase placeholder:text-[#333]"
                          placeholder="E.G., LEGS & PLYOMETRICS"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-mono text-[#A3A3A3] mb-1 tracking-widest uppercase">SHORT DESCRIPTION</label>
                        <input 
                          type="text" 
                          value={newPlanDesc}
                          onChange={(e) => setNewPlanDesc(e.target.value)}
                          className="w-full bg-[#0A0A0A] border border-[#262626] rounded-sm px-3 py-2 text-white font-mono text-xs tracking-wider focus:outline-none focus:ring-1 uppercase placeholder:text-[#333]"
                          placeholder="E.G., ACCELERATE CARDIO & BURN"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Added Exercises list */}
                  <div className="border-t border-[#262626] pt-3">
                    <span className="block text-[9px] font-mono text-[#A3A3A3] mb-2 tracking-widest uppercase font-bold">ADDED EXERCISES ({planExercises.length})</span>
                    <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1 mb-3">
                      {planExercises.map((ex, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-[#0A0A0A] border border-[#262626] px-2 py-1.5 rounded-sm">
                          <span className="text-[10px] font-mono font-bold text-white uppercase">{ex.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-mono text-[#A3A3A3] uppercase">{ex.calories} CAL / {ex.duration} MIN</span>
                            <button
                              type="button"
                              onClick={() => setPlanExercises(planExercises.filter((_, i) => i !== idx))}
                              className="text-red-500 hover:text-red-400 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                      {planExercises.length === 0 && (
                        <p className="text-[10px] font-mono text-[#555] uppercase italic">No exercises added yet. Use the tool below.</p>
                      )}
                    </div>
                  </div>

                  {/* Add Exercise mini form */}
                  <div className="bg-[#0A0A0A] border border-[#262626] p-3 rounded-sm space-y-2">
                    <span className="block text-[9px] font-mono text-indigo-400 tracking-widest uppercase font-bold">+ ADD EXERCISE TO PLAN</span>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="col-span-2">
                        <input 
                          type="text" 
                          placeholder="EXERCISE NAME" 
                          value={newExName}
                          onChange={(e) => setNewExName(e.target.value)}
                          className="w-full bg-[#141414] border border-[#262626] rounded-sm px-2.5 py-1.5 text-white font-mono text-[10px] tracking-wider focus:outline-none uppercase placeholder:text-[#444]"
                        />
                      </div>
                      <div>
                        <input 
                          type="number" 
                          placeholder="CALORIES (KCAL)" 
                          value={newExCals}
                          onChange={(e) => setNewExCals(e.target.value)}
                          className="w-full bg-[#141414] border border-[#262626] rounded-sm px-2.5 py-1.5 text-white font-mono text-[10px] tracking-wider focus:outline-none placeholder:text-[#444]"
                        />
                      </div>
                      <div>
                        <input 
                          type="number" 
                          placeholder="DURATION (MIN)" 
                          value={newExDur}
                          onChange={(e) => setNewExDur(e.target.value)}
                          className="w-full bg-[#141414] border border-[#262626] rounded-sm px-2.5 py-1.5 text-white font-mono text-[10px] tracking-wider focus:outline-none placeholder:text-[#444]"
                        />
                      </div>
                      <div className="col-span-2">
                        <select
                          value={newExMuscle}
                          onChange={(e) => setNewExMuscle(e.target.value as any)}
                          className="w-full bg-[#141414] border border-[#262626] rounded-sm px-2.5 py-1.5 text-white font-mono text-[10px] tracking-wider focus:outline-none uppercase"
                        >
                          <option value="">SELECT TARGET MUSCLE</option>
                          <option value="chest">CHEST</option>
                          <option value="back">BACK</option>
                          <option value="legs">LEGS</option>
                          <option value="arms">ARMS</option>
                          <option value="shoulders">SHOULDERS</option>
                          <option value="core">CORE</option>
                          <option value="cardio">CARDIO</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <input 
                          type="text" 
                          placeholder="REPS / SETS / DETAILS (E.G., 3 SETS OF 15 REPS)" 
                          value={newExDetails}
                          onChange={(e) => setNewExDetails(e.target.value)}
                          className="w-full bg-[#141414] border border-[#262626] rounded-sm px-2.5 py-1.5 text-white font-mono text-[10px] tracking-wider focus:outline-none uppercase placeholder:text-[#444]"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddExerciseToPlanBuilder}
                      className="w-full bg-[#262626] hover:bg-[#333] border border-[#333] text-white py-1 text-[9px] font-mono font-bold tracking-widest uppercase transition-colors rounded-sm cursor-pointer"
                    >
                      ADD EXERCISE
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveCustomPlan}
                    className="w-full py-2.5 rounded-sm transition-colors text-black font-mono text-xs font-bold tracking-widest uppercase cursor-pointer"
                    style={{ backgroundColor: themeColor }}
                  >
                    SAVE & ENROLL WORKOUT PLAN
                  </button>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleAddLog} className="space-y-4">
              {activeTab === 'water' ? (
              <div>
                <label className="block text-[10px] font-mono text-[#A3A3A3] mb-1 tracking-widest uppercase">AMOUNT (ML)</label>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-[#141414] border border-[#262626] rounded-sm px-4 py-3 text-white font-mono text-sm focus:outline-none mb-3"
                  placeholder="E.G., 250"
                  required
                />
                <div className="flex gap-2">
                  <button type="button" onClick={() => setAmount('250')} className="flex-1 bg-[#141414] hover:bg-[#262626] border border-[#262626] text-[#A3A3A3] py-2 rounded-sm font-mono text-xs transition-colors">+250ML</button>
                  <button type="button" onClick={() => setAmount('500')} className="flex-1 bg-[#141414] hover:bg-[#262626] border border-[#262626] text-[#A3A3A3] py-2 rounded-sm font-mono text-xs transition-colors">+500ML</button>
                  <button type="button" onClick={() => setAmount('1000')} className="flex-1 bg-[#141414] hover:bg-[#262626] border border-[#262626] text-[#A3A3A3] py-2 rounded-sm font-mono text-xs transition-colors">+1L</button>
                </div>
              </div>
            ) : (
              <>
                {activeTab === 'food' && (
                  <div className="mb-4">
                    <label className="block text-[10px] font-mono text-[#A3A3A3] mb-1 flex items-center tracking-widest uppercase">
                      <Download className="w-3 h-3 mr-1" /> LOAD TEMPLATE
                    </label>
                    <select
                      value={selectedTemplateId}
                      onChange={(e) => handleLoadTemplate(e.target.value)}
                      className="w-full bg-[#141414] border border-[#262626] rounded-sm px-4 py-3 text-white font-mono text-xs tracking-wider focus:outline-none focus:ring-1 transition-colors"
                      style={{ '--tw-ring-color': themeColor, outlineColor: themeColor } as any}
                    >
                      <option value="">-- SELECT A SAVED FOOD --</option>
                      {foodTemplates?.map(t => (
                        <option key={t.id} value={t.id}>{t.name.toUpperCase()} ({t.calories} KCAL)</option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-[10px] font-mono text-[#A3A3A3] mb-1 tracking-widest uppercase">
                    {activeTab === 'food' ? 'FOOD / MEAL NAME' : 'EXERCISE / ACTIVITY'}
                  </label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#141414] border border-[#262626] rounded-sm px-4 py-3 text-white font-mono text-xs tracking-wider focus:outline-none focus:ring-1 transition-colors uppercase placeholder:text-[#555]"
                    style={{ '--tw-ring-color': themeColor, outlineColor: themeColor } as any}
                    placeholder={activeTab === 'food' ? "E.G., GRILLED CHICKEN SALAD" : "E.G., 5KM RUN"}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-[#A3A3A3] mb-1 tracking-widest uppercase">CALORIES</label>
                    <input 
                      type="number" 
                      value={calories}
                      onChange={(e) => setCalories(e.target.value)}
                      className="w-full bg-[#141414] border border-[#262626] rounded-sm px-4 py-3 text-white font-mono text-xs tracking-wider focus:outline-none focus:ring-1 transition-colors placeholder:text-[#555]"
                      style={{ '--tw-ring-color': themeColor, outlineColor: themeColor } as any}
                      placeholder="KCAL"
                      required
                    />
                  </div>
                  
                  {activeTab === 'food' ? (
                    <>
                      <div>
                        <label className="block text-[10px] font-mono text-[#A3A3A3] mb-1 tracking-widest uppercase">PROTEIN (G)</label>
                        <input 
                          type="number" 
                          value={protein}
                          onChange={(e) => setProtein(e.target.value)}
                          className="w-full bg-[#141414] border border-[#262626] rounded-sm px-4 py-3 text-white font-mono text-xs tracking-wider focus:outline-none focus:ring-1 transition-colors placeholder:text-[#555]"
                          style={{ '--tw-ring-color': themeColor, outlineColor: themeColor } as any}
                          placeholder="OPTIONAL"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-[#A3A3A3] mb-1 tracking-widest uppercase">CARBS (G)</label>
                        <input 
                          type="number" 
                          value={carbs}
                          onChange={(e) => setCarbs(e.target.value)}
                      className="w-full bg-[#141414] border border-[#262626] rounded-sm px-4 py-3 text-white font-mono text-xs tracking-wider focus:outline-none focus:ring-1 transition-colors placeholder:text-[#555]"
                      style={{ '--tw-ring-color': themeColor, outlineColor: themeColor } as any}
                      placeholder="OPTIONAL"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-[#A3A3A3] mb-1 tracking-widest uppercase">FAT (G)</label>
                    <input 
                      type="number" 
                      value={fat}
                      onChange={(e) => setFat(e.target.value)}
                      className="w-full bg-[#141414] border border-[#262626] rounded-sm px-4 py-3 text-white font-mono text-xs tracking-wider focus:outline-none focus:ring-1 transition-colors placeholder:text-[#555]"
                      style={{ '--tw-ring-color': themeColor, outlineColor: themeColor } as any}
                      placeholder="OPTIONAL"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-[10px] font-mono text-[#A3A3A3] mb-1 tracking-widest uppercase">DURATION (MIN)</label>
                    <input 
                      type="number" 
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full bg-[#141414] border border-[#262626] rounded-sm px-4 py-3 text-white font-mono text-xs tracking-wider focus:outline-none focus:ring-1 transition-colors placeholder:text-[#555]"
                      style={{ '--tw-ring-color': themeColor, outlineColor: themeColor } as any}
                      placeholder="OPTIONAL"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-mono text-[#A3A3A3] mb-1 tracking-widest uppercase">PRIMARY MUSCLE GROUP</label>
                    <select 
                      value={muscleGroup}
                      onChange={(e) => setMuscleGroup(e.target.value as any)}
                      className="w-full bg-[#141414] border border-[#262626] rounded-sm px-4 py-3 text-white font-mono text-xs tracking-wider focus:outline-none focus:ring-1 transition-colors uppercase"
                      style={{ '--tw-ring-color': themeColor, outlineColor: themeColor } as any}
                    >
                      <option value="">NONE / FULL BODY</option>
                      <option value="chest">CHEST</option>
                      <option value="back">BACK</option>
                      <option value="legs">LEGS</option>
                      <option value="arms">ARMS</option>
                      <option value="shoulders">SHOULDERS</option>
                      <option value="core">CORE</option>
                      <option value="cardio">CARDIO</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          </>
        )}

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 mt-4 flex items-center justify-center space-x-2 border border-[#262626] px-4 py-3 rounded-sm transition-colors text-black font-mono text-xs font-bold tracking-widest uppercase"
                style={{ backgroundColor: themeColor }}
              >
                <Plus className="w-4 h-4 text-black" />
                <span>ADD LOG</span>
              </button>
              {activeTab === 'food' && (
                <button
                  type="button"
                  onClick={handleSaveTemplate}
                  className="mt-4 flex items-center justify-center space-x-2 bg-[#0A0A0A] border border-[#262626] hover:border-[#333] px-4 py-3 rounded-md transition-colors text-white font-mono text-sm"
                  title="Save as Template"
                >
                  <Save className="w-4 h-4 text-indigo-400" />
                </button>
              )}
            </div>
          </form>
        )}
      </div>

        {/* Today's Logs */}
        <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-4 md:p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#262626]"></div>
          <h3 className="text-lg font-mono text-white mb-4 flex items-center font-bold tracking-widest uppercase">
            <Activity className="w-5 h-5 mr-2" style={{ color: themeColor }} />
            TODAY'S LOGS
          </h3>
          
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {nutritionLogs.length === 0 ? (
              <div className="text-center py-8 text-[#A3A3A3] font-mono text-xs tracking-widest uppercase border border-dashed border-[#262626] rounded-sm">
                NO LOGS RECORDED TODAY.
              </div>
            ) : (
              nutritionLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 bg-[#141414] border border-[#262626] rounded-sm">
                  <div className="flex items-center space-x-3">
                    {log.type === 'food' ? (
                      <Utensils className="w-4 h-4 text-green-400" />
                    ) : (
                      <Activity className="w-4 h-4 text-red-400" />
                    )}
                    <div>
                      <div className="text-xs font-mono text-white font-bold tracking-widest uppercase">{log.name}</div>
                      <div className="text-[10px] font-mono text-[#A3A3A3] flex flex-wrap gap-2 mt-1 tracking-widest uppercase">
                        <span>{log.calories} KCAL</span>
                        {log.type === 'food' && (
                          <>
                            {log.protein && <span className="text-red-400">P:{log.protein}G</span>}
                            {log.carbs && <span className="text-yellow-400">C:{log.carbs}G</span>}
                            {log.fat && <span className="text-blue-400">F:{log.fat}G</span>}
                          </>
                        )}
                        {log.type === 'exercise' && (
                          <>
                            {log.duration && <span>{log.duration} MIN</span>}
                            {log.muscleGroup && <span className="uppercase text-purple-400">{log.muscleGroup}</span>}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => log.id && handleDelete(log.id)}
                    className="p-2 text-[#A3A3A3] hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Growth & Metabolic Integrity */}
      <GrowthSection
        vesselLogs={vesselLogs || []}
        nutritionLogs={nutritionLogs || []}
        todayLog={todayLog}
        themeColor={themeColor}
        targetCalories={targetCalories}
        consumedWater={consumedWater}
        consumedProtein={consumedProtein}
        targetProtein={targetProtein}
        consumedCalories={consumedCalories}
        burnedCalories={burnedCalories}
      />

      {/* Vessel Tracker & Growth Analysis */}
      <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#262626]"></div>
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#262626]"></div>
        <h3 className="text-lg font-mono text-white mb-4 flex items-center font-bold tracking-widest uppercase">
          <Activity className="w-5 h-5 mr-2 text-blue-400" />
          VESSEL TRACKER
        </h3>
        <p className="text-[10px] text-[#A3A3A3] mb-6 font-mono tracking-widest uppercase">Log your physical capacity metrics and monitor vessel integrity over time.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-[300px] min-h-[250px] bg-[#141414] border border-[#262626] rounded-sm p-4">
            {vesselLogs && vesselLogs.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <LineChart data={vesselLogs.map(log => ({
                  ...log,
                  weight: log.weight ?? null,
                  bodyFat: log.bodyFat ?? null,
                  stressLevel: log.stressLevel ?? null,
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                  <XAxis dataKey="date" stroke="#A3A3A3" fontSize={10} tickFormatter={(val) => val.substring(5)} />
                  <YAxis yAxisId="left" stroke="#A3A3A3" fontSize={10} domain={['dataMin - 2', 'dataMax + 2']} />
                  <YAxis yAxisId="right" orientation="right" stroke="#A3A3A3" fontSize={10} domain={[0, 'dataMax + 5']} hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0A0A0A', borderColor: '#262626', color: '#fff', borderRadius: '2px' }}
                    itemStyle={{ color: themeColor }}
                  />
                  <Line yAxisId="left" type="monotone" dataKey="weight" name="WEIGHT (KG)" stroke={themeColor} strokeWidth={2} dot={{ r: 4, fill: themeColor }} activeDot={{ r: 6 }} connectNulls />
                  <Line yAxisId="right" type="monotone" dataKey="bodyFat" name="BODY FAT %" stroke="#FFD700" strokeWidth={2} dot={{ r: 4, fill: '#FFD700' }} connectNulls />
                  <Line yAxisId="right" type="monotone" dataKey="stressLevel" name="STRESS (1-5)" stroke="#ef4444" strokeWidth={2} dot={{ r: 4, fill: '#ef4444' }} connectNulls />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#A3A3A3] font-mono text-xs tracking-widest uppercase">
                NO VESSEL DATA LOGGED YET.
              </div>
            )}
          </div>

          <div>
            <form onSubmit={handleLogVessel} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono text-[#A3A3A3] mb-1 tracking-widest uppercase">WEIGHT (KG)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="E.G., 75.5" 
                  className="w-full bg-[#141414] border border-[#262626] rounded-sm px-4 py-3 text-white font-mono text-xs tracking-wider focus:outline-none focus:ring-1 transition-colors placeholder:text-[#555]"
                  style={{ '--tw-ring-color': themeColor, outlineColor: themeColor } as any}
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-[#A3A3A3] mb-1 tracking-widest uppercase">BODY FAT % (OPTIONAL)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={bodyFat}
                  onChange={(e) => setBodyFat(e.target.value)}
                  placeholder="E.G., 15.2" 
                  className="w-full bg-[#141414] border border-[#262626] rounded-sm px-4 py-3 text-white font-mono text-xs tracking-wider focus:outline-none focus:ring-1 transition-colors placeholder:text-[#555]"
                  style={{ '--tw-ring-color': themeColor, outlineColor: themeColor } as any}
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-[#A3A3A3] mb-1 tracking-widest uppercase">STRESS (1-5)</label>
                <input 
                  type="number" 
                  min="1"
                  max="5"
                  value={stressLevel}
                  onChange={(e) => setStressLevel(e.target.value)}
                  placeholder="1 = LOW" 
                  className="w-full bg-[#141414] border border-[#262626] rounded-sm px-4 py-3 text-white font-mono text-xs tracking-wider focus:outline-none focus:ring-1 transition-colors placeholder:text-[#555]"
                  style={{ '--tw-ring-color': themeColor, outlineColor: themeColor } as any}
                />
              </div>
              <button type="submit" className="w-full bg-[#262626] hover:bg-[#333] text-white px-4 py-3 rounded-sm font-mono text-xs font-bold tracking-widest transition-colors flex items-center justify-center mt-2 border border-[#262626] hover:border-blue-400 uppercase">
                <Plus className="w-4 h-4 mr-2" /> LOG VESSEL DATA
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
