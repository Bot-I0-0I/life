import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, addXp, logSystemEvent } from '../db/db';
import { cn, getRank } from '../lib/utils';
import { 
  Dumbbell, Play, CheckCircle, Clock, Flame, Plus, Trash2, Award, 
  Sparkles, RotateCcw, BarChart3, ChevronRight, ChevronLeft, Save, 
  Layers, Search, Filter, Calendar, Zap, Check, ArrowRight, Activity, ShieldAlert, HeartPulse, Scale, UserCheck
} from 'lucide-react';
import { format, subDays } from 'date-fns';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { 
  BUILT_IN_WORKOUT_PROGRAMS, 
  ExerciseItem, 
  WorkoutDayItem, 
  WorkoutPlanItem 
} from '../data/workoutPrograms';

export type { ExerciseItem, WorkoutDayItem, WorkoutPlanItem };

const OLD_PROGRAMS: any[] = [];
/*
  {
    id: '7day_mass_gainer_hypertrophy',
    name: '7-DAY SKINNY-TO-MUSCLE MASS GAINER',
    area: 'Muscle Hypertrophy & Bulking',
    tag: 'Muscle Gain',
    equipment: 'Barbell / Dumbbell / Gym',
    targetGoal: 'muscle_gain',
    recommendedBodyType: 'Slim Build / Underweight / Muscle Bulking Goal',
    compatibilityNote: 'High mechanical tension, compound overload, and progressive hypertrophy designed for slim builds seeking mass gain.',
    description: 'Heavy compound mass-building protocol engineered for hardgainers and slim builds to stimulate rapid skeletal muscle hypertrophy.',
    days: [
      {
        dayNumber: 1,
        title: 'DAY 1: HEAVY CHEST MASS OVERLOAD',
        muscleFocus: 'Pectorals & Upper Body Thickness',
        exercises: [
          { name: 'BARBELL BENCH PRESS', calories: 230, duration: 15, muscleGroup: 'chest', tag: 'Mass Build', equipment: 'Barbell', details: '5 sets × 6 heavy reps (Max power, 2m rest)', defaultSets: 5, targetReps: 6 },
          { name: 'INCLINE DUMBBELL CHEST PRESS', calories: 190, duration: 12, muscleGroup: 'chest', tag: 'Hypertrophy', equipment: 'Dumbbell', details: '4 sets × 8 heavy reps (Full stretch at bottom)', defaultSets: 4, targetReps: 8 },
          { name: 'WEIGHTED CHEST DIPS', calories: 160, duration: 10, muscleGroup: 'chest', tag: 'Hypertrophy', equipment: 'Bodyweight / Dumbbell', details: '4 sets × 10 reps', defaultSets: 4, targetReps: 10 },
          { name: 'DUMBBELL FLY CROSSOVERS', calories: 120, duration: 8, muscleGroup: 'chest', tag: 'Isolation', equipment: 'Dumbbell', details: '3 sets × 12 reps (Squeeze chest at top)', defaultSets: 3, targetReps: 12 }
        ]
      },
      {
        dayNumber: 2,
        title: 'DAY 2: LAT DENSITY & HEAVY DEADLIFTS',
        muscleFocus: 'Lats, Upper Back & Biceps',
        exercises: [
          { name: 'CONVENTIONAL BARBELL DEADLIFT', calories: 290, duration: 18, muscleGroup: 'back', tag: 'Mass Build', equipment: 'Barbell', details: '5 sets × 5 heavy reps (Spine neutral, drive hips)', defaultSets: 5, targetReps: 5 },
          { name: 'WEIGHTED PULL-UPS / LAT PULLDOWN', calories: 180, duration: 12, muscleGroup: 'back', tag: 'Hypertrophy', equipment: 'Barbell / Cable', details: '4 sets × 8 heavy reps', defaultSets: 4, targetReps: 8 },
          { name: 'BARBELL BENT-OVER ROWS', calories: 200, duration: 12, muscleGroup: 'back', tag: 'Mass Build', equipment: 'Barbell', details: '4 sets × 8 heavy reps', defaultSets: 4, targetReps: 8 },
          { name: 'STANDING BARBELL BICEP CURLS', calories: 130, duration: 10, muscleGroup: 'arms', tag: 'Hypertrophy', equipment: 'Barbell', details: '4 sets × 10 strict reps', defaultSets: 4, targetReps: 10 }
        ]
      },
      {
        dayNumber: 3,
        title: 'DAY 3: QUAD MASS & HEAVY SQUATS',
        muscleFocus: 'Quads, Glutes & Calves',
        exercises: [
          { name: 'BARBELL BACK SQUATS', calories: 300, duration: 20, muscleGroup: 'legs', tag: 'Mass Build', equipment: 'Barbell', details: '5 sets × 6 heavy reps below 90 degrees', defaultSets: 5, targetReps: 6 },
          { name: 'LEG PRESS MACHINE OVERLOAD', calories: 220, duration: 12, muscleGroup: 'legs', tag: 'Hypertrophy', equipment: 'Machine', details: '4 sets × 10 heavy reps', defaultSets: 4, targetReps: 10 },
          { name: 'ROMANIAN DEADLIFT (HAMSTRINGS)', calories: 190, duration: 10, muscleGroup: 'legs', tag: 'Hypertrophy', equipment: 'Barbell', details: '4 sets × 10 reps', defaultSets: 4, targetReps: 10 },
          { name: 'STANDING HEAVY CALF RAISES', calories: 110, duration: 8, muscleGroup: 'legs', tag: 'Isolation', equipment: 'Machine', details: '4 sets × 15 reps (2s top peak hold)', defaultSets: 4, targetReps: 15 }
        ]
      },
      {
        dayNumber: 4,
        title: 'DAY 4: SHOULDER CANNON PRESS & DELTS',
        muscleFocus: 'Anterior, Lateral & Rear Deltoids',
        exercises: [
          { name: 'BARBELL OVERHEAD MILITARY PRESS', calories: 200, duration: 12, muscleGroup: 'shoulders', tag: 'Mass Build', equipment: 'Barbell', details: '5 sets × 6 heavy strict reps', defaultSets: 5, targetReps: 6 },
          { name: 'HEAVY DUMBBELL LATERAL RAISES', calories: 140, duration: 10, muscleGroup: 'shoulders', tag: 'Hypertrophy', equipment: 'Dumbbell', details: '4 sets × 12 reps', defaultSets: 4, targetReps: 12 },
          { name: 'FACE PULLS WITH CABLE ROPE', calories: 130, duration: 10, muscleGroup: 'shoulders', tag: 'Hypertrophy', equipment: 'Cable', details: '4 sets × 15 reps (Rear delt activation)', defaultSets: 4, targetReps: 15 },
          { name: 'HEAVY DUMBBELL SHRUGS', calories: 120, duration: 8, muscleGroup: 'shoulders', tag: 'Isolation', equipment: 'Dumbbell', details: '4 sets × 12 reps', defaultSets: 4, targetReps: 12 }
        ]
      },
      {
        dayNumber: 5,
        title: 'DAY 5: ARMS MASS & PEAK ISOLATION',
        muscleFocus: 'Biceps & Triceps Mass',
        exercises: [
          { name: 'EZ-BAR SKULLCRUSHERS', calories: 160, duration: 10, muscleGroup: 'arms', tag: 'Mass Build', equipment: 'Barbell', details: '4 sets × 10 heavy reps', defaultSets: 4, targetReps: 10 },
          { name: 'INCLINE DUMBBELL CURLS', calories: 140, duration: 10, muscleGroup: 'arms', tag: 'Hypertrophy', equipment: 'Dumbbell', details: '4 sets × 10 reps (Deep stretch)', defaultSets: 4, targetReps: 10 },
          { name: 'TRICEP CABLE ROPE PUSHDOWNS', calories: 140, duration: 8, muscleGroup: 'arms', tag: 'Hypertrophy', equipment: 'Cable', details: '4 sets × 12 reps', defaultSets: 4, targetReps: 12 },
          { name: 'DUMBBELL HAMMER CURLS', calories: 120, duration: 8, muscleGroup: 'arms', tag: 'Isolation', equipment: 'Dumbbell', details: '4 sets × 12 reps per arm', defaultSets: 4, targetReps: 12 }
        ]
      },
      {
        dayNumber: 6,
        title: 'DAY 6: POSTERIOR CHAIN & POWER CLEANS',
        muscleFocus: 'Hamstrings, Glutes & Trap Power',
        exercises: [
          { name: 'BARBELL POWER CLEANS', calories: 250, duration: 15, muscleGroup: 'legs', tag: 'Power', equipment: 'Barbell', details: '4 sets × 5 reps (Explosive triple extension)', defaultSets: 4, targetReps: 5 },
          { name: 'BARBELL HIP THRUSTS', calories: 210, duration: 12, muscleGroup: 'legs', tag: 'Mass Build', equipment: 'Barbell', details: '4 sets × 10 heavy reps', defaultSets: 4, targetReps: 10 },
          { name: 'LYING LEG CURL MACHINE', calories: 140, duration: 10, muscleGroup: 'legs', tag: 'Hypertrophy', equipment: 'Machine', details: '4 sets × 12 reps', defaultSets: 4, targetReps: 12 },
          { name: 'HANGING LEG RAISES', calories: 100, duration: 8, muscleGroup: 'core', tag: 'Core', equipment: 'Pullup Bar', details: '4 sets × 12 strict reps', defaultSets: 4, targetReps: 12 }
        ]
      },
      {
        dayNumber: 7,
        title: 'DAY 7: MASS RECOVERY & CORE BRACING',
        muscleFocus: 'Rest, Regeneration & Ab Strength',
        exercises: [
          { name: 'AB WHEEL ROLLOUTS', calories: 100, duration: 8, muscleGroup: 'core', tag: 'Core', equipment: 'Ab Wheel / None', details: '4 sets × 10 controlled reps', defaultSets: 4, targetReps: 10 },
          { name: 'HEAVY FARMER CARRY WALKS', calories: 160, duration: 10, muscleGroup: 'core', tag: 'Grip & Core', equipment: 'Dumbbell', details: '4 sets × 40 meters heavy walk', defaultSets: 4, targetReps: 40 },
          { name: 'FULL BODY FOAM ROLLING & STRETCH', calories: 60, duration: 15, muscleGroup: 'back', tag: 'Recovery', equipment: 'Foam Roller', details: '1 set × 15 mins deep myofascial release', defaultSets: 1, targetReps: 15 }
        ]
      }
    ]
  },
  {
    id: '5day_low_impact_joint_care',
    name: '5-DAY LOW-IMPACT JOINT CARE & MOBILITY',
    area: 'Joint Protection & Easy Entry',
    tag: 'Joint Safe',
    equipment: 'Low Impact / Machines / Bands',
    targetGoal: 'joint_care',
    recommendedBodyType: 'High Body Weight / Joint Concerns / Beginners',
    compatibilityNote: 'Zero high-impact jumping, knee-friendly lever movements, and controlled tempo exercise for absolute joint safety.',
    description: 'Joint-protective fitness system engineered for high body weight individuals, beginners, or those recovering from joint strain.',
    days: [
      {
        dayNumber: 1,
        title: 'DAY 1: LOW-IMPACT PUSH & MACHINE PRESS',
        muscleFocus: 'Chest, Shoulders & Triceps (Joint-Safe)',
        exercises: [
          { name: 'SEATED CHEST PRESS MACHINE', calories: 140, duration: 12, muscleGroup: 'chest', tag: 'Joint Safe', equipment: 'Machine', details: '4 sets × 12 smooth controlled reps', defaultSets: 4, targetReps: 12 },
          { name: 'INCLINE DUMBBELL PRESS (LIGHT)', calories: 120, duration: 10, muscleGroup: 'chest', tag: 'Controlled', equipment: 'Dumbbell', details: '3 sets × 12 reps', defaultSets: 3, targetReps: 12 },
          { name: 'SEATED DUMBBELL OVERHEAD PRESS', calories: 110, duration: 10, muscleGroup: 'shoulders', tag: 'Joint Safe', equipment: 'Dumbbell', details: '3 sets × 12 reps', defaultSets: 3, targetReps: 12 },
          { name: 'TRICEP CABLE PUSHDOWNS', calories: 100, duration: 8, muscleGroup: 'arms', tag: 'Joint Safe', equipment: 'Cable', details: '3 sets × 12 reps', defaultSets: 3, targetReps: 12 }
        ]
      },
      {
        dayNumber: 2,
        title: 'DAY 2: SEATED PULL & LAT ENGAGEMENT',
        muscleFocus: 'Back, Lats & Biceps',
        exercises: [
          { name: 'SEATED CABLE ROW (NEUTRAL GRIP)', calories: 150, duration: 12, muscleGroup: 'back', tag: 'Joint Safe', equipment: 'Cable', details: '4 sets × 12 reps (Smooth squeeze, zero jerk)', defaultSets: 4, targetReps: 12 },
          { name: 'WIDE GRIP LAT PULLDOWN', calories: 140, duration: 12, muscleGroup: 'back', tag: 'Joint Safe', equipment: 'Cable', details: '4 sets × 12 reps', defaultSets: 4, targetReps: 12 },
          { name: 'SEATED DUMBBELL BICEP CURLS', calories: 100, duration: 8, muscleGroup: 'arms', tag: 'Joint Safe', equipment: 'Dumbbell', details: '3 sets × 12 reps', defaultSets: 3, targetReps: 12 },
          { name: 'FACE PULLS WITH RESISTANCE BAND', calories: 90, duration: 8, muscleGroup: 'shoulders', tag: 'Joint Safe', equipment: 'Band', details: '3 sets × 15 reps', defaultSets: 3, targetReps: 15 }
        ]
      },
      {
        dayNumber: 3,
        title: 'DAY 3: KNEE-FRIENDLY LOWER BODY & GLUTES',
        muscleFocus: 'Quads & Glute Activation (No Jumps)',
        exercises: [
          { name: 'GLUTE BRIDGES ON MAT', calories: 130, duration: 10, muscleGroup: 'legs', tag: 'Joint Safe', equipment: 'None', details: '4 sets × 15 reps with 2s squeeze at top', defaultSets: 4, targetReps: 15 },
          { name: 'SEATED LEG EXTENSION MACHINE', calories: 120, duration: 10, muscleGroup: 'legs', tag: 'Joint Safe', equipment: 'Machine', details: '3 sets × 12 smooth reps', defaultSets: 3, targetReps: 12 },
          { name: 'SEATED HAMSTRING CURL MACHINE', calories: 120, duration: 10, muscleGroup: 'legs', tag: 'Joint Safe', equipment: 'Machine', details: '3 sets × 12 smooth reps', defaultSets: 3, targetReps: 12 },
          { name: 'STANDING SEATED CALF RAISES', calories: 80, duration: 8, muscleGroup: 'legs', tag: 'Joint Safe', equipment: 'Machine / Bench', details: '3 sets × 15 reps', defaultSets: 3, targetReps: 15 }
        ]
      },
      {
        dayNumber: 4,
        title: 'DAY 4: LOW-IMPACT CARDIO & CORE STABILITY',
        muscleFocus: 'Heart Health & Core (Zero Impact)',
        exercises: [
          { name: 'STATIONARY RECUMBENT BIKE / ROWING', calories: 180, duration: 20, muscleGroup: 'cardio', tag: 'Low Impact', equipment: 'Stationary Bike', details: '1 set × 20 mins moderate cadence', defaultSets: 1, targetReps: 20 },
          { name: 'BIRD-DOG CORE STABILIZATION', calories: 80, duration: 8, muscleGroup: 'core', tag: 'Joint Safe', equipment: 'None', details: '4 sets × 10 reps per side', defaultSets: 4, targetReps: 10 },
          { name: 'DEADBUG COMPRESSION HOLDS', calories: 80, duration: 8, muscleGroup: 'core', tag: 'Joint Safe', equipment: 'None', details: '4 sets × 10 reps per side', defaultSets: 4, targetReps: 10 },
          { name: 'STANDING SIDE BENDS WITH DB', calories: 90, duration: 8, muscleGroup: 'core', tag: 'Joint Safe', equipment: 'Dumbbell', details: '3 sets × 12 reps per side', defaultSets: 3, targetReps: 12 }
        ]
      },
      {
        dayNumber: 5,
        title: 'DAY 5: FULL BODY DEEP FLEXIBILITY & FLOW',
        muscleFocus: 'Full Body Mobility & Spine Care',
        exercises: [
          { name: 'SEATED HAMSTRING & CALF STRETCH', calories: 40, duration: 8, muscleGroup: 'legs', tag: 'Mobility', equipment: 'Mat', details: '3 sets × 60s holds per leg', defaultSets: 3, targetReps: 60 },
          { name: 'GENTLE COBRA SPINE EXTENSION', calories: 40, duration: 8, muscleGroup: 'back', tag: 'Mobility', equipment: 'Mat', details: '3 sets × 10 gentle breaths', defaultSets: 3, targetReps: 10 },
          { name: 'SHOULDER MOBILITY BAND PASS-THROUGHS', calories: 50, duration: 8, muscleGroup: 'shoulders', tag: 'Mobility', equipment: 'Band', details: '3 sets × 12 controlled rotations', defaultSets: 3, targetReps: 12 }
        ]
      }
    ]
  },
  {
    id: '7day_no_equipment_calisthenics',
    name: '7-DAY CALISTHENICS & BODYWEIGHT SHRED',
    area: 'Bodyweight Mastery',
    tag: 'Calisthenics',
    equipment: 'No Equipment',
    targetGoal: 'calisthenics',
    recommendedBodyType: 'Athletic / Normal Weight / Relative Strength',
    compatibilityNote: 'Ideal for relative bodyweight strength, core stability, and agile push-pull conditioning.',
    description: 'Complete 7-day bodyweight calisthenics system. Perform one focused day session each day to build lean muscle and speed.',
    days: [
      {
        dayNumber: 1,
        title: 'DAY 1: UPPER PUSH & CHEST',
        muscleFocus: 'Chest, Shoulders & Triceps',
        exercises: [
          { name: 'STANDARD FLOOR PUSHUPS', calories: 120, duration: 10, muscleGroup: 'chest', tag: 'Calisthenics', equipment: 'None', details: '4 sets × 20 reps (Strict form, chest to floor)', defaultSets: 4, targetReps: 20 },
          { name: 'DIAMOND TRICEP PUSHUPS', calories: 100, duration: 8, muscleGroup: 'arms', tag: 'Calisthenics', equipment: 'None', details: '3 sets × 12 reps (Triceps focus)', defaultSets: 3, targetReps: 12 },
          { name: 'DECLINE CHAIR PUSHUPS', calories: 110, duration: 8, muscleGroup: 'chest', tag: 'Calisthenics', equipment: 'None', details: '3 sets × 15 reps (Feet elevated on chair)', defaultSets: 3, targetReps: 15 },
          { name: 'BENCH / CHAIR TRICEP DIPS', calories: 90, duration: 8, muscleGroup: 'arms', tag: 'Calisthenics', equipment: 'None', details: '3 sets × 15 reps (Full lockouts at top)', defaultSets: 3, targetReps: 15 }
        ]
      },
      {
        dayNumber: 2,
        title: 'DAY 2: EXPLOSIVE LEGS & PLYOMETRICS',
        muscleFocus: 'Quads, Hamstrings & Calves',
        exercises: [
          { name: 'EXPLOSIVE AIR SQUATS', calories: 140, duration: 12, muscleGroup: 'legs', tag: 'Calisthenics', equipment: 'None', details: '4 sets × 25 reps (Break 90 degree depth)', defaultSets: 4, targetReps: 25 },
          { name: 'PLYOMETRIC JUMP LUNGES', calories: 160, duration: 10, muscleGroup: 'legs', tag: 'Athletic', equipment: 'None', details: '4 sets × 16 jump switch reps', defaultSets: 4, targetReps: 16 },
          { name: 'ISOMETRIC WALL SITS', calories: 100, duration: 8, muscleGroup: 'legs', tag: 'Calisthenics', equipment: 'None', details: '3 sets × 60s static wall holds', defaultSets: 3, targetReps: 60 },
          { name: 'SINGLE-LEG CALF RAISES', calories: 80, duration: 8, muscleGroup: 'legs', tag: 'Calisthenics', equipment: 'None', details: '4 sets × 20 reps per calf', defaultSets: 4, targetReps: 20 }
        ]
      },
      {
        dayNumber: 3,
        title: 'DAY 3: INVERTED PULL & LAT MATRIX',
        muscleFocus: 'Lats, Upper Back & Biceps',
        exercises: [
          { name: 'INVERTED DOORWAY BODYWEIGHT ROWS', calories: 130, duration: 10, muscleGroup: 'back', tag: 'Calisthenics', equipment: 'None', details: '4 sets × 15 reps (Squeeze lats at top)', defaultSets: 4, targetReps: 15 },
          { name: 'PRONE SUPERMAN EXTENSIONS', calories: 90, duration: 8, muscleGroup: 'back', tag: 'Calisthenics', equipment: 'None', details: '4 sets × 20 reps (2s hold at peak)', defaultSets: 4, targetReps: 20 },
          { name: 'TOWEL RESISTANCE BICEP ISOMETRICS', calories: 100, duration: 8, muscleGroup: 'arms', tag: 'Calisthenics', equipment: 'None', details: '3 sets × 12 heavy pull reps', defaultSets: 3, targetReps: 12 },
          { name: 'REVERSE SHOULDER FLY EXTENSIONS', calories: 80, duration: 8, muscleGroup: 'shoulders', tag: 'Calisthenics', equipment: 'None', details: '3 sets × 15 controlled prone arm flys', defaultSets: 3, targetReps: 15 }
        ]
      },
      {
        dayNumber: 4,
        title: 'DAY 4: CORE FORTRESS & HOLLOW HOLDS',
        muscleFocus: 'Abs, Obliques & Lower Back',
        exercises: [
          { name: 'HOLLOW BODY COMPRESSION HOLDS', calories: 100, duration: 8, muscleGroup: 'core', tag: 'Calisthenics', equipment: 'None', details: '4 sets × 45s hollow body hold', defaultSets: 4, targetReps: 45 },
          { name: 'RAPID MOUNTAIN CLIMBERS', calories: 120, duration: 8, muscleGroup: 'core', tag: 'Athletic', equipment: 'None', details: '4 sets × 30s fast knee drives', defaultSets: 4, targetReps: 30 },
          { name: 'SIDE PLANK OBLIQUE DIP LIFTS', calories: 90, duration: 8, muscleGroup: 'core', tag: 'Calisthenics', equipment: 'None', details: '3 sets × 15 reps per side', defaultSets: 3, targetReps: 15 },
          { name: 'REVERSE CRUNCH KNEE LIFTS', calories: 80, duration: 8, muscleGroup: 'core', tag: 'Calisthenics', equipment: 'None', details: '3 sets × 20 controlled lower abdominal lifts', defaultSets: 3, targetReps: 20 }
        ]
      },
      {
        dayNumber: 5,
        title: 'DAY 5: METABOLIC BURPEE HIIT & CARDIO',
        muscleFocus: 'Full Body & Endurance',
        exercises: [
          { name: 'FULL BODY BURPEE SPRINTS', calories: 180, duration: 12, muscleGroup: 'cardio', tag: 'Athletic', equipment: 'None', details: '5 sets × 15 explosive burpees', defaultSets: 5, targetReps: 15 },
          { name: 'HIGH KNEE CARDIO SPRINTS', calories: 130, duration: 10, muscleGroup: 'cardio', tag: 'Cardio', equipment: 'None', details: '4 sets × 45s max frequency sprint', defaultSets: 4, targetReps: 45 },
          { name: 'SQUAT JUMP TUCK LANDINGS', calories: 150, duration: 10, muscleGroup: 'legs', tag: 'Athletic', equipment: 'None', details: '4 sets × 15 explosive vertical tuck jumps', defaultSets: 4, targetReps: 15 },
          { name: 'FOREARM PLANK HOLD', calories: 70, duration: 6, muscleGroup: 'core', tag: 'Calisthenics', equipment: 'None', details: '3 sets × 60s rigid core plank', defaultSets: 3, targetReps: 60 }
        ]
      },
      {
        dayNumber: 6,
        title: 'DAY 6: ISOMETRIC SKILL & PIKE OVERLOAD',
        muscleFocus: 'Shoulders & Stability',
        exercises: [
          { name: 'PIKE PUSHUPS (SHOULDER PRESS)', calories: 120, duration: 10, muscleGroup: 'shoulders', tag: 'Calisthenics', equipment: 'None', details: '4 sets × 12 reps (Hips high, head down)', defaultSets: 4, targetReps: 12 },
          { name: 'CROW POSE BALANCE DRILLS', calories: 80, duration: 8, muscleGroup: 'core', tag: 'Calisthenics', equipment: 'None', details: '4 sets × 20s static balance holds', defaultSets: 4, targetReps: 20 },
          { name: 'L-SET COMPRESSION TUCKS', calories: 90, duration: 8, muscleGroup: 'core', tag: 'Calisthenics', equipment: 'None', details: '3 sets × 10 knee tucks off floor', defaultSets: 3, targetReps: 10 },
          { name: 'REVERSE BRIDGE ARCH HOLDS', calories: 80, duration: 8, muscleGroup: 'back', tag: 'Mobility', equipment: 'None', details: '3 sets × 30s back bridge extension', defaultSets: 3, targetReps: 30 }
        ]
      },
      {
        dayNumber: 7,
        title: 'DAY 7: DEEP JOINT MOBILITY & RECOVERY',
        muscleFocus: 'Flexibility & Recovery',
        exercises: [
          { name: 'THORACIC CAT-COW FLOW', calories: 50, duration: 8, muscleGroup: 'back', tag: 'Mobility', equipment: 'None', details: '3 sets × 12 slow breath-synchronized movements', defaultSets: 3, targetReps: 12 },
          { name: 'PIGEON POSE HIP OPENERS', calories: 50, duration: 8, muscleGroup: 'legs', tag: 'Mobility', equipment: 'None', details: '3 sets × 60s holds per side', defaultSets: 3, targetReps: 60 },
          { name: 'DOWNWARD DOG TO COBRA EXTENSION', calories: 60, duration: 8, muscleGroup: 'core', tag: 'Mobility', equipment: 'None', details: '3 sets × 10 fluid wave transitions', defaultSets: 3, targetReps: 10 },
          { name: 'WORLD\'S GREATEST LUNGE REACH', calories: 60, duration: 8, muscleGroup: 'legs', tag: 'Mobility', equipment: 'None', details: '3 sets × 8 reps per leg with overhead rotation', defaultSets: 3, targetReps: 8 }
        ]
      }
    ]
  },
  {
    id: '7day_equipment_strength_split',
    name: '7-DAY HEAVY STRENGTH & HYPERTROPHY SPLIT',
    area: 'Gym Split',
    tag: 'Strength',
    equipment: 'Barbell / Dumbbell',
    targetGoal: 'strength',
    recommendedBodyType: 'Intermediate / Heavy Lifter / Gym Access',
    compatibilityNote: 'Pro gym split system engineered to maximize 1RM strength and muscle density.',
    description: 'Pro gym split system. Select each daily split routine to log heavy barbell & dumbbell sets.',
    days: [
      {
        dayNumber: 1,
        title: 'DAY 1: CHEST & TRICEPS HYPERTROPHY',
        muscleFocus: 'Pectorals & Triceps',
        exercises: [
          { name: 'BARBELL BENCH PRESS', calories: 220, duration: 15, muscleGroup: 'chest', tag: 'Strength', equipment: 'Barbell', details: '5 sets × 5 heavy reps (Tuck elbows, arched back)', defaultSets: 5, targetReps: 5 },
          { name: 'INCLINE DUMBBELL PRESS', calories: 180, duration: 12, muscleGroup: 'chest', tag: 'Hypertrophy', equipment: 'Dumbbell', details: '4 sets × 10 reps (Deep chest stretch)', defaultSets: 4, targetReps: 10 },
          { name: 'CABLE CHEST FLY CROSSOVERS', calories: 130, duration: 10, muscleGroup: 'chest', tag: 'Hypertrophy', equipment: 'Cable', details: '3 sets × 15 reps (Peak contraction squeeze)', defaultSets: 3, targetReps: 15 },
          { name: 'OVERHEAD TRICEP EXTENSION', calories: 120, duration: 10, muscleGroup: 'arms', tag: 'Hypertrophy', equipment: 'Dumbbell', details: '4 sets × 12 reps', defaultSets: 4, targetReps: 12 }
        ]
      },
      {
        dayNumber: 2,
        title: 'DAY 2: DEADLIFTS, LATS & BICEPS',
        muscleFocus: 'Posterior Back & Biceps',
        exercises: [
          { name: 'BARBELL DEADLIFT', calories: 280, duration: 18, muscleGroup: 'back', tag: 'Strength', equipment: 'Barbell', details: '5 sets × 5 heavy reps (Neutral spine)', defaultSets: 5, targetReps: 5 },
          { name: 'LAT PULLDOWN (WIDE GRIP)', calories: 150, duration: 12, muscleGroup: 'back', tag: 'Hypertrophy', equipment: 'Cable', details: '4 sets × 10 reps (Pull to upper chest)', defaultSets: 4, targetReps: 10 },
          { name: 'SEATED CABLE ROW WITH PAUSE', calories: 140, duration: 10, muscleGroup: 'back', tag: 'Hypertrophy', equipment: 'Cable', details: '4 sets × 12 reps (1 second squeeze)', defaultSets: 4, targetReps: 12 },
          { name: 'STANDING BARBELL BICEP CURLS', calories: 110, duration: 10, muscleGroup: 'arms', tag: 'Hypertrophy', equipment: 'Barbell', details: '4 sets × 10 strict reps', defaultSets: 4, targetReps: 10 }
        ]
      },
      {
        dayNumber: 3,
        title: 'DAY 3: HEAVY SQUATS & QUAD MASS',
        muscleFocus: 'Quads, Glutes & Calves',
        exercises: [
          { name: 'BARBELL BACK SQUATS', calories: 290, duration: 18, muscleGroup: 'legs', tag: 'Strength', equipment: 'Barbell', details: '5 sets × 6 heavy reps below parallel', defaultSets: 5, targetReps: 6 },
          { name: 'BULGARIAN DUMBBELL SPLIT SQUATS', calories: 180, duration: 12, muscleGroup: 'legs', tag: 'Hypertrophy', equipment: 'Dumbbell', details: '3 sets × 10 reps per leg', defaultSets: 3, targetReps: 10 },
          { name: 'QUAD LEG EXTENSION MACHINE', calories: 140, duration: 10, muscleGroup: 'legs', tag: 'Hypertrophy', equipment: 'Machine', details: '4 sets × 12 reps', defaultSets: 4, targetReps: 12 },
          { name: 'STANDING BARBELL CALF RAISES', calories: 100, duration: 8, muscleGroup: 'legs', tag: 'Hypertrophy', equipment: 'Barbell', details: '4 sets × 20 reps with 2s squeeze at top', defaultSets: 4, targetReps: 20 }
        ]
      },
      {
        dayNumber: 4,
        title: 'DAY 4: MILITARY PRESS & DELTS',
        muscleFocus: 'Anterior, Lateral & Rear Deltoids',
        exercises: [
          { name: 'BARBELL MILITARY OVERHEAD PRESS', calories: 180, duration: 12, muscleGroup: 'shoulders', tag: 'Strength', equipment: 'Barbell', details: '4 sets × 8 reps (Strict press)', defaultSets: 4, targetReps: 8 },
          { name: 'STANDING DUMBBELL LATERAL RAISES', calories: 120, duration: 10, muscleGroup: 'shoulders', tag: 'Hypertrophy', equipment: 'Dumbbell', details: '4 sets × 15 strict reps', defaultSets: 4, targetReps: 15 },
          { name: 'FACE PULLS WITH ROPE CABLE', calories: 110, duration: 10, muscleGroup: 'shoulders', tag: 'Hypertrophy', equipment: 'Cable', details: '4 sets × 15 reps (Rear delt squeeze)', defaultSets: 4, targetReps: 15 },
          { name: 'DUMBBELL SHRUGS FOR TRAPS', calories: 110, duration: 8, muscleGroup: 'shoulders', tag: 'Hypertrophy', equipment: 'Dumbbell', details: '4 sets × 15 reps', defaultSets: 4, targetReps: 15 }
        ]
      },
      {
        dayNumber: 5,
        title: 'DAY 5: ARMS ISOLATION & CABLE PUSHDOWNS',
        muscleFocus: 'Biceps & Triceps Hypertrophy',
        exercises: [
          { name: 'TRICEP ROPE CABLE PUSHDOWNS', calories: 130, duration: 10, muscleGroup: 'arms', tag: 'Hypertrophy', equipment: 'Cable', details: '4 sets × 12 reps (Spread rope at bottom)', defaultSets: 4, targetReps: 12 },
          { name: 'INCLINE DUMBBELL BICEP CURLS', calories: 120, duration: 10, muscleGroup: 'arms', tag: 'Hypertrophy', equipment: 'Dumbbell', details: '4 sets × 10 reps (Deep stretch)', defaultSets: 4, targetReps: 10 },
          { name: 'EZ-BAR SKULLCRUSHERS', calories: 140, duration: 10, muscleGroup: 'arms', tag: 'Hypertrophy', equipment: 'Barbell', details: '4 sets × 10 reps', defaultSets: 4, targetReps: 10 },
          { name: 'DUMBBELL HAMMER CURLS', calories: 110, duration: 8, muscleGroup: 'arms', tag: 'Hypertrophy', equipment: 'Dumbbell', details: '3 sets × 12 reps per arm', defaultSets: 3, targetReps: 12 }
        ]
      },
      {
        dayNumber: 6,
        title: 'DAY 6: POWER CLEANS & HAMSTRING RDLs',
        muscleFocus: 'Power & Posterior Chain',
        exercises: [
          { name: 'BARBELL POWER CLEANS', calories: 240, duration: 15, muscleGroup: 'legs', tag: 'Athletic', equipment: 'Barbell', details: '4 sets × 5 reps (Explosive triple extension)', defaultSets: 4, targetReps: 5 },
          { name: 'BARBELL ROMANIAN DEADLIFTS (RDLs)', calories: 200, duration: 12, muscleGroup: 'back', tag: 'Strength', equipment: 'Barbell', details: '4 sets × 10 reps (Controlled eccentric lowering)', defaultSets: 4, targetReps: 10 },
          { name: 'HAMSTRING LEG CURL MACHINE', calories: 130, duration: 10, muscleGroup: 'legs', tag: 'Hypertrophy', equipment: 'Machine', details: '4 sets × 12 reps', defaultSets: 4, targetReps: 12 },
          { name: 'RENEGADE DUMBBELL PLANK ROWS', calories: 150, duration: 10, muscleGroup: 'core', tag: 'Strength', equipment: 'Dumbbell', details: '3 sets × 10 reps per side', defaultSets: 3, targetReps: 10 }
        ]
      },
      {
        dayNumber: 7,
        title: 'DAY 7: CORE STABILITY & RECOVERY',
        muscleFocus: 'Core Bracing & Mobility',
        exercises: [
          { name: 'CABLE WOODCHOPPERS', calories: 100, duration: 8, muscleGroup: 'core', tag: 'Strength', equipment: 'Cable', details: '4 sets × 15 reps per side', defaultSets: 4, targetReps: 15 },
          { name: 'HANGING KNEE LIFTS', calories: 90, duration: 8, muscleGroup: 'core', tag: 'Calisthenics', equipment: 'None', details: '4 sets × 12 strict reps', defaultSets: 4, targetReps: 12 },
          { name: 'HOLLOW PLANK HOLD', calories: 80, duration: 8, muscleGroup: 'core', tag: 'Mobility', equipment: 'None', details: '3 sets × 60s core brace', defaultSets: 3, targetReps: 60 }
        ]
      }
    ]
  },
  {
    id: '30min_dumbbell_fullbody',
    name: '30-MIN DUMBBELL FULL-BODY ROUTINE',
    area: 'Dumbbell Home Gym',
    tag: 'Hypertrophy',
    equipment: 'Dumbbells',
    targetGoal: 'fat_loss',
    recommendedBodyType: 'All Body Types / Busy Schedule',
    compatibilityNote: 'Compact, high-efficiency workout suitable for any weight or fitness level.',
    description: 'Time-efficient full-body dumbbell routine targeting chest, back, legs, and shoulders in one compact session.',
    days: [
      {
        dayNumber: 1,
        title: 'DAY 1: FULL BODY DUMBBELL OVERLOAD',
        muscleFocus: 'Chest, Back, Legs & Shoulders',
        exercises: [
          { name: 'DUMBBELL THRUSTERS (SQUAT TO PRESS)', calories: 230, duration: 12, muscleGroup: 'legs', tag: 'Hypertrophy', equipment: 'Dumbbell', details: '4 sets × 12 reps deep squat into overhead press', defaultSets: 4, targetReps: 12 },
          { name: 'RENEGADE DUMBBELL ROWS & PUSHUPS', calories: 210, duration: 10, muscleGroup: 'back', tag: 'Strength', equipment: 'Dumbbell', details: '4 sets × 10 reps per arm plank rows', defaultSets: 4, targetReps: 10 },
          { name: 'DUMBBELL ROMANIAN DEADLIFTS', calories: 190, duration: 10, muscleGroup: 'legs', tag: 'Hypertrophy', equipment: 'Dumbbell', details: '4 sets × 12 reps slow eccentric hamstring stretch', defaultSets: 4, targetReps: 12 },
          { name: 'STANDING DUMBBELL BICEP TO ARNOLD PRESS', calories: 160, duration: 8, muscleGroup: 'shoulders', tag: 'Hypertrophy', equipment: 'Dumbbell', details: '3 sets × 10 complex curl-and-press reps', defaultSets: 3, targetReps: 10 }
        ]
      }
    ]
  },
  {
    id: 'calisthenics_core_fortress',
    name: 'CALISTHENICS ABS & CORE ROUTINE',
    area: 'Abdominal Fortress',
    tag: 'Calisthenics',
    equipment: 'No Equipment',
    targetGoal: 'calisthenics',
    recommendedBodyType: 'All Body Types / Core Focus',
    compatibilityNote: 'Core isolation system for abdominal bracing and lower back health.',
    description: 'Targeted gymnastics core routine engineered to forge bulletproof abs, obliques, and lower back stability.',
    days: [
      {
        dayNumber: 1,
        title: 'DAY 1: GYMNASTICS CORE OVERLOAD',
        muscleFocus: 'Abs & Obliques',
        exercises: [
          { name: 'DRAGON FLAG NEGATIVES & HOLDS', calories: 140, duration: 10, muscleGroup: 'core', tag: 'Calisthenics', equipment: 'None', details: '4 sets × 8 slow controlled lowering reps', defaultSets: 4, targetReps: 8 },
          { name: 'HANGING KNEE-TO-ELBOW LIFTS', calories: 120, duration: 8, muscleGroup: 'core', tag: 'Calisthenics', equipment: 'None', details: '4 sets × 12 strict reps', defaultSets: 4, targetReps: 12 },
          { name: 'HOLLOW BODY ROCKING HOLDS', calories: 100, duration: 8, muscleGroup: 'core', tag: 'Calisthenics', equipment: 'None', details: '4 sets × 45s hollow body compression', defaultSets: 4, targetReps: 45 },
          { name: 'SIDE PLANK OBLIQUE DIP LIFTS', calories: 90, duration: 8, muscleGroup: 'core', tag: 'Calisthenics', equipment: 'None', details: '3 sets × 15 reps per side', defaultSets: 3, targetReps: 15 }
        ]
      }
    ]
  }
];
*/

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

  // User Weight & Height Body Parameters State (auto-fetched from user profile)
  const [userWeightKg, setUserWeightKg] = useState<number>(75);
  const [userHeightCm, setUserHeightCm] = useState<number>(175);
  const [isSyncedWithProfile, setIsSyncedWithProfile] = useState<boolean>(true);

  // Sync state automatically when userStats or latestVessel changes in Dexie
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

  // Persist weight changes & sync to system userStats + vessel logs
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

  // LAYERS / TAB SYSTEM
  // Layer 1: Program Explorer (Filtered by Body Compatibility)
  // Layer 2: Selected Program Day Schedule
  // Layer 3: Active Workout Player
  // Layer 4: Custom Routine Builder
  // Layer 5: Load Stats Analytics
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

  // Filter plans by Goal & Compatibility
  const filteredPlans = allPlans.filter(plan => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = plan.name.toLowerCase().includes(q) ||
                          plan.area.toLowerCase().includes(q) ||
                          plan.equipment.toLowerCase().includes(q) ||
                          plan.description.toLowerCase().includes(q);

    const matchesGoal = userPrimaryGoal === 'all' || plan.targetGoal === userPrimaryGoal;

    return matchesSearch && matchesGoal;
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

  // Completion Modal
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

  // Start Workout for a specific Day
  const handleStartWorkoutDay = (plan: WorkoutPlanItem, dayIdx: number) => {
    const dayToRun = plan.days[dayIdx] || plan.days[0];
    setActivePlan(plan);
    setActiveDay(dayToRun);
    setWorkoutSeconds(0);
    setIsWorkoutActive(true);
    setIsResting(false);

    // Initialize set tracker
    const initialSets: Record<number, Array<{ weight: number; reps: number; completed: boolean }>> = {};
    dayToRun.exercises.forEach((ex, idx) => {
      const numSets = ex.defaultSets || 3;
      initialSets[idx] = Array.from({ length: numSets }, () => ({
        weight: 0,
        reps: ex.targetReps || 10,
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

    const newEx: ExerciseItem = {
      name: exName.toUpperCase(),
      calories: exCals ? Number(exCals) : 120,
      duration: exDur ? Number(exDur) : 10,
      muscleGroup: exMuscle,
      defaultSets: Number(exSets),
      targetReps: Number(exReps)
    };

    setBuilderExercises([...builderExercises, newEx]);
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
              title="Program Catalog (Layer 1)"
              aria-label="Program Catalog"
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
              title="Day Routine (Layer 2)"
              aria-label="Day Routine"
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
              title="Workout Player (Layer 3)"
              aria-label="Workout Player"
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
              title="New Routine Builder"
              aria-label="New Routine Builder"
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
              title="Workout Load Stats"
              aria-label="Workout Load Stats"
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

        {/* STEP / LAYER STEPPER BREADCRUMB NAVIGATOR */}
        <div className="bg-[#0A0A0A] border border-[#262626] rounded-md p-1.5 sm:p-2 flex items-center justify-between flex-wrap gap-2 text-xs font-mono">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-0.5 max-w-full">
            <button
              onClick={() => setActiveLayer('programs')}
              title="Layer 1: Program Catalog"
              aria-label="Layer 1: Program Catalog"
              className={cn(
                "px-2.5 py-1 rounded border flex items-center gap-1.5 transition-all whitespace-nowrap text-xs font-bold",
                activeLayer === 'programs' ? "bg-cyan-950/80 border-cyan-500 text-cyan-300" : "bg-[#141414] border-[#262626] text-[#A3A3A3] hover:text-white"
              )}
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>1. CATALOG</span>
            </button>

            <ChevronRight className="w-3.5 h-3.5 text-[#444] flex-shrink-0" />

            <button
              onClick={() => setActiveLayer('schedule')}
              title="Layer 2: Day Routine"
              aria-label="Layer 2: Day Routine"
              className={cn(
                "px-2.5 py-1 rounded border flex items-center gap-1.5 transition-all whitespace-nowrap text-xs font-bold",
                activeLayer === 'schedule' ? "bg-cyan-950/80 border-cyan-500 text-cyan-300" : "bg-[#141414] border-[#262626] text-[#A3A3A3] hover:text-white"
              )}
            >
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>2. ROUTINE</span>
            </button>

            <ChevronRight className="w-3.5 h-3.5 text-[#444] flex-shrink-0" />

            <button
              onClick={() => setActiveLayer('execute')}
              title="Layer 3: Workout Player"
              aria-label="Layer 3: Workout Player"
              className={cn(
                "px-2.5 py-1 rounded border flex items-center gap-1.5 transition-all whitespace-nowrap text-xs font-bold",
                activeLayer === 'execute' ? "bg-emerald-950/80 border-emerald-500 text-emerald-300" : "bg-[#141414] border-[#262626] text-[#A3A3A3] hover:text-white"
              )}
            >
              <Play className="w-3.5 h-3.5 text-emerald-400" />
              <span>3. PLAYER</span>
            </button>
          </div>

          {currentSelectedPlan && (
            <span className="text-[10px] text-[#A3A3A3] uppercase font-bold hidden md:inline-flex items-center gap-1 truncate max-w-[220px] bg-[#141414] px-2 py-1 rounded border border-[#222]">
              <span className="text-cyan-400">PLAN:</span> {currentSelectedPlan.name}
            </span>
          )}
        </div>
      </header>

      {/* BODY WEIGHT & COMPATIBILITY PARAMETERS WIDGET */}
      <section className="bg-[#0D1520] border border-cyan-900/60 rounded-sm p-4 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-cyan-900/40 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-cyan-950 border border-cyan-700 rounded-sm">
              <Scale className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-sm font-mono font-bold text-white uppercase flex items-center gap-2">
                YOUR BODY PROFILE & WEIGHT COMPATIBILITY ENGINE
              </h3>
              <p className="text-xs font-mono text-[#A3A3A3]">
                Enter weight & height to auto-match programs suited for your BMI and primary goal.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-2.5 py-1 bg-[#0A0A0A] border border-[#262626] rounded-sm text-cyan-300">
              BMI: <strong className="text-white">{bmi}</strong>
            </span>
            <span className="px-2.5 py-1 bg-cyan-950/80 border border-cyan-700 rounded-sm text-cyan-300 font-bold">
              {bodyTypeCategory.label}
            </span>
          </div>
        </div>

        {/* Input Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 font-mono text-xs">
          {/* Weight Input */}
          <div className="bg-[#0A0A0A] p-2.5 border border-[#262626] rounded-sm space-y-1">
            <label className="text-[10px] text-[#A3A3A3] uppercase block font-bold">CURRENT BODY WEIGHT (KG)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={userWeightKg}
                onChange={e => handleUpdateWeight(Number(e.target.value))}
                className="bg-[#141414] border border-[#333] text-white px-2.5 py-1 rounded-sm w-full font-bold focus:outline-none focus:border-cyan-500"
              />
              <span className="text-[#888] font-bold">KG</span>
            </div>
          </div>

          {/* Height Input */}
          <div className="bg-[#0A0A0A] p-2.5 border border-[#262626] rounded-sm space-y-1">
            <label className="text-[10px] text-[#A3A3A3] uppercase block font-bold">HEIGHT (CM)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={userHeightCm}
                onChange={e => handleUpdateHeight(Number(e.target.value))}
                className="bg-[#141414] border border-[#333] text-white px-2.5 py-1 rounded-sm w-full font-bold focus:outline-none focus:border-cyan-500"
              />
              <span className="text-[#888] font-bold">CM</span>
            </div>
          </div>

          {/* Goal Selector */}
          <div className="bg-[#0A0A0A] p-2.5 border border-[#262626] rounded-sm space-y-1">
            <label className="text-[10px] text-[#A3A3A3] uppercase block font-bold">PRIMARY COMPATIBILITY GOAL</label>
            <select
              value={userPrimaryGoal}
              onChange={e => handleUpdateGoal(e.target.value as any)}
              className="bg-[#141414] border border-[#333] text-cyan-300 font-bold px-2 py-1 rounded-sm w-full focus:outline-none focus:border-cyan-500 uppercase"
            >
              <option value="all">ALL GOALS & PROGRAMS</option>
              <option value="fat_loss">FAT LOSS & SHRED (HIGH CALS)</option>
              <option value="muscle_gain">SKINNY-TO-MUSCLE GAINER</option>
              <option value="joint_care">JOINT-SAFE / LOW IMPACT</option>
              <option value="calisthenics">BODYWEIGHT & CALISTHENICS</option>
              <option value="strength">HEAVY STRENGTH & GYM SPLIT</option>
            </select>
          </div>
        </div>

        {/* Recommendation Note */}
        <div className="bg-[#091018] border border-cyan-800/40 p-2.5 rounded-sm flex items-center gap-2 text-xs font-mono text-cyan-200">
          <HeartPulse className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span><strong>Engine Recommendation:</strong> {bodyTypeCategory.desc}</span>
        </div>
      </section>

      {/* LAYER 1: PROGRAM CATALOG & COMPATIBILITY FILTER */}
      {activeLayer === 'programs' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222] pb-2">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 bg-cyan-950 border border-cyan-700 rounded-sm text-[10px]">LAYER 1</span>
              SELECT WORKOUT PROGRAM ({filteredPlans.length} AVAILABLE)
            </span>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="SEARCH PROGRAMS..."
                className="bg-[#0A0A0A] border border-[#262626] rounded-sm px-3 py-1.5 text-xs text-white font-mono uppercase focus:outline-none focus:border-cyan-500 w-full sm:w-64"
              />
            </div>
          </div>

          {/* Goal Filter Quick Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono">
            <button
              onClick={() => handleUpdateGoal('all')}
              className={cn(
                "px-3 py-1 rounded-sm border uppercase transition-all whitespace-nowrap",
                userPrimaryGoal === 'all' ? "bg-cyan-500 text-black border-cyan-400 font-bold" : "bg-[#0A0A0A] text-[#A3A3A3] border-[#262626] hover:text-white"
              )}
            >
              ALL PROGRAMS
            </button>
            <button
              onClick={() => handleUpdateGoal('fat_loss')}
              className={cn(
                "px-3 py-1 rounded-sm border uppercase transition-all whitespace-nowrap",
                userPrimaryGoal === 'fat_loss' ? "bg-cyan-500 text-black border-cyan-400 font-bold" : "bg-[#0A0A0A] text-[#A3A3A3] border-[#262626] hover:text-white"
              )}
            >
              FAT SHRED
            </button>
            <button
              onClick={() => handleUpdateGoal('muscle_gain')}
              className={cn(
                "px-3 py-1 rounded-sm border uppercase transition-all whitespace-nowrap",
                userPrimaryGoal === 'muscle_gain' ? "bg-cyan-500 text-black border-cyan-400 font-bold" : "bg-[#0A0A0A] text-[#A3A3A3] border-[#262626] hover:text-white"
              )}
            >
              MASS GAINER
            </button>
            <button
              onClick={() => handleUpdateGoal('joint_care')}
              className={cn(
                "px-3 py-1 rounded-sm border uppercase transition-all whitespace-nowrap",
                userPrimaryGoal === 'joint_care' ? "bg-cyan-500 text-black border-cyan-400 font-bold" : "bg-[#0A0A0A] text-[#A3A3A3] border-[#262626] hover:text-white"
              )}
            >
              JOINT-SAFE
            </button>
            <button
              onClick={() => handleUpdateGoal('calisthenics')}
              className={cn(
                "px-3 py-1 rounded-sm border uppercase transition-all whitespace-nowrap",
                userPrimaryGoal === 'calisthenics' ? "bg-cyan-500 text-black border-cyan-400 font-bold" : "bg-[#0A0A0A] text-[#A3A3A3] border-[#262626] hover:text-white"
              )}
            >
              CALISTHENICS
            </button>
            <button
              onClick={() => handleUpdateGoal('strength')}
              className={cn(
                "px-3 py-1 rounded-sm border uppercase transition-all whitespace-nowrap",
                userPrimaryGoal === 'strength' ? "bg-cyan-500 text-black border-cyan-400 font-bold" : "bg-[#0A0A0A] text-[#A3A3A3] border-[#262626] hover:text-white"
              )}
            >
              STRENGTH SPLIT
            </button>
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
                      <span className="text-cyan-300 font-bold">{daysCount} {daysCount === 1 ? 'DAY' : 'DAYS'}</span>
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

      {/* LAYER 2: SELECTED PROGRAM DAY SCHEDULE */}
      {activeLayer === 'schedule' && currentSelectedPlan && (
        <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-4 sm:p-5 space-y-5">
          {/* Header Bar with Back Button */}
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

          {/* Day Selector Tabs */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 bg-cyan-950 border border-cyan-700 rounded-sm text-[10px]">STEP 2</span>
              SELECT A DAY ROUTINE TO PERFORM:
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
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
                  <span className="text-[10px] font-mono text-[#A3A3A3] uppercase block">DAY {currentSelectedDay.dayNumber} SCHEDULE</span>
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

              {/* Exercise Cards */}
              <div className="space-y-2">
                <span className="text-xs font-mono text-[#A3A3A3] uppercase block">
                  EXERCISES IN THIS SESSION ({currentSelectedDay.exercises.length}):
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {currentSelectedDay.exercises.map((ex, exIdx) => (
                    <div key={exIdx} className="bg-[#181818] border border-[#262626] p-3 rounded-sm space-y-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-xs font-mono font-bold text-white uppercase truncate">{ex.name}</span>
                        <span className="px-2 py-0.5 bg-cyan-950/60 text-cyan-300 text-[10px] font-mono rounded-sm border border-cyan-900/50 uppercase flex-shrink-0">
                          {ex.muscleGroup}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-[#A3A3A3] flex items-center justify-between pt-1">
                        <span>TARGET: {ex.defaultSets || 3} SETS × {ex.targetReps || 10} REPS</span>
                        <span>~{ex.calories} KCAL</span>
                      </div>
                      {ex.details && (
                        <p className="text-[10px] font-mono text-amber-400/90 italic pt-0.5 truncate">{ex.details}</p>
                      )}
                    </div>
                  ))}
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
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold uppercase rounded-sm transition-all flex-shrink-0"
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
                {activeDay?.exercises.map((ex, exIdx) => {
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
                          </div>
                          <h4 className="text-base sm:text-lg font-mono text-white font-bold uppercase mt-0.5 truncate">{ex.name}</h4>
                          {ex.details && <p className="text-xs font-mono text-amber-400 mt-0.5 truncate">{ex.details}</p>}
                        </div>

                        <button
                          onClick={() => handleAddSet(exIdx)}
                          className="px-2.5 py-1 bg-[#1A1A1A] hover:bg-[#262626] border border-[#333] text-emerald-400 text-xs font-mono uppercase rounded-sm flex-shrink-0"
                        >
                          + ADD SET
                        </button>
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

                            <div className="col-span-3 sm:col-span-4 text-right">
                              <button
                                onClick={() => handleToggleSetComplete(exIdx, setIdx)}
                                className={cn(
                                  "px-2.5 py-1 font-mono text-[11px] font-bold uppercase rounded-sm transition-all inline-flex items-center gap-1",
                                  set.completed
                                    ? "bg-emerald-500 text-black"
                                    : "bg-[#222] hover:bg-[#333] border border-[#444] text-white"
                                )}
                              >
                                {set.completed ? <Check className="w-3.5 h-3.5" /> : null}
                                {set.completed ? 'DONE' : 'LOG'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Complete Workout Button */}
              <button
                onClick={handleFinishWorkout}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-sm font-bold uppercase rounded-sm transition-all shadow-lg"
              >
                COMPLETE WORKOUT & LOG RESULTS
              </button>
            </div>
          )}
        </div>
      )}

      {/* LAYER 4: CUSTOM ROUTINE BUILDER */}
      {activeLayer === 'builder' && (
        <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-4 sm:p-5 space-y-6">
          <div className="border-b border-[#262626] pb-3">
            <h3 className="text-lg font-mono text-white font-bold uppercase">CREATE CUSTOM ROUTINE</h3>
            <p className="text-xs font-mono text-[#A3A3A3] uppercase mt-0.5">
              Build personalized workout programs to save into your catalog.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 font-mono text-xs">
            <div>
              <label className="text-[10px] text-[#A3A3A3] uppercase block mb-1">ROUTINE NAME</label>
              <input
                type="text"
                value={newPlanName}
                onChange={e => setNewPlanName(e.target.value)}
                placeholder="E.G., ARMS & CORE BLAST"
                className="w-full bg-[#141414] border border-[#262626] rounded-sm p-2 text-white font-mono text-xs focus:outline-none focus:border-cyan-500 uppercase"
              />
            </div>

            <div>
              <label className="text-[10px] text-[#A3A3A3] uppercase block mb-1">TARGET AREA</label>
              <input
                type="text"
                value={newPlanArea}
                onChange={e => setNewPlanArea(e.target.value)}
                placeholder="E.G., BICEPS & TRICEPS"
                className="w-full bg-[#141414] border border-[#262626] rounded-sm p-2 text-white font-mono text-xs focus:outline-none focus:border-cyan-500 uppercase"
              />
            </div>

            <div>
              <label className="text-[10px] text-[#A3A3A3] uppercase block mb-1">TARGET GOAL</label>
              <select
                value={newPlanGoal}
                onChange={e => setNewPlanGoal(e.target.value as any)}
                className="w-full bg-[#141414] border border-[#262626] rounded-sm p-2 text-white font-mono text-xs focus:outline-none focus:border-cyan-500 uppercase"
              >
                <option value="fat_loss">FAT LOSS</option>
                <option value="muscle_gain">MUSCLE GAIN</option>
                <option value="joint_care">JOINT SAFE</option>
                <option value="calisthenics">CALISTHENICS</option>
                <option value="strength">STRENGTH</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-[#A3A3A3] uppercase block mb-1">ROUTINE DESCRIPTION</label>
              <input
                type="text"
                value={newPlanDesc}
                onChange={e => setNewPlanDesc(e.target.value)}
                placeholder="E.G., HIGH INTENSITY ARM PUMP"
                className="w-full bg-[#141414] border border-[#262626] rounded-sm p-2 text-white font-mono text-xs focus:outline-none focus:border-cyan-500 uppercase"
              />
            </div>
          </div>

          {/* Add Exercise Form */}
          <form onSubmit={handleAddExerciseToBuilder} className="bg-[#121212] border border-[#262626] p-4 rounded-sm space-y-4">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase block">ADD EXERCISES TO ROUTINE</span>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="text-[10px] font-mono text-[#A3A3A3] uppercase block mb-1">EXERCISE NAME</label>
                <input
                  type="text"
                  value={exName}
                  onChange={e => setExName(e.target.value)}
                  placeholder="EX. INCLINE PRESS"
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded-sm p-2 text-white font-mono text-xs focus:outline-none focus:border-cyan-500 uppercase"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-[#A3A3A3] uppercase block mb-1">MUSCLE TARGET</label>
                <select
                  value={exMuscle}
                  onChange={e => setExMuscle(e.target.value as any)}
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded-sm p-2 text-white font-mono text-xs focus:outline-none focus:border-cyan-500 uppercase"
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
                <label className="text-[10px] font-mono text-[#A3A3A3] uppercase block mb-1">SETS & REPS</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={exSets}
                    onChange={e => setExSets(e.target.value)}
                    placeholder="3"
                    className="w-1/2 bg-[#0A0A0A] border border-[#262626] rounded-sm p-2 text-white font-mono text-xs text-center"
                  />
                  <input
                    type="number"
                    value={exReps}
                    onChange={e => setExReps(e.target.value)}
                    placeholder="10"
                    className="w-1/2 bg-[#0A0A0A] border border-[#262626] rounded-sm p-2 text-white font-mono text-xs text-center"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-[#A3A3A3] uppercase block mb-1">ESTIMATED KCAL</label>
                <input
                  type="number"
                  value={exCals}
                  onChange={e => setExCals(e.target.value)}
                  placeholder="120"
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded-sm p-2 text-white font-mono text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold uppercase rounded-sm transition-all"
            >
              + ADD EXERCISE
            </button>
          </form>

          {/* Builder Exercise List */}
          {builderExercises.length > 0 && (
            <div className="space-y-3">
              <span className="text-xs font-mono text-[#A3A3A3] uppercase">EXERCISES IN NEW ROUTINE ({builderExercises.length}):</span>
              <div className="space-y-2">
                {builderExercises.map((ex, idx) => (
                  <div key={idx} className="bg-[#141414] border border-[#262626] p-3 rounded-sm flex items-center justify-between font-mono text-xs gap-2">
                    <div className="min-w-0">
                      <span className="font-bold text-white uppercase truncate block">{idx + 1}. {ex.name}</span>
                      <span className="text-[10px] text-[#A3A3A3] block truncate">
                        {ex.muscleGroup.toUpperCase()} • {ex.defaultSets} SETS × {ex.targetReps} REPS • ~{ex.calories} KCAL
                      </span>
                    </div>

                    <button
                      onClick={() => setBuilderExercises(builderExercises.filter((_, i) => i !== idx))}
                      className="text-rose-400 hover:text-rose-300 p-1 flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={handleSaveCustomPlan}
                className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-bold uppercase rounded-sm transition-all"
              >
                SAVE ROUTINE TO CATALOG
              </button>
            </div>
          )}
        </div>
      )}

      {/* LAYER 5: LOAD STATS ANALYTICS */}
      {activeLayer === 'analytics' && (
        <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-5 space-y-5">
          <div className="border-b border-[#262626] pb-3">
            <h3 className="text-lg font-mono text-white font-bold uppercase">7-DAY MUSCLE GROUP LOAD DISTRIBUTION</h3>
            <p className="text-xs font-mono text-[#A3A3A3] uppercase mt-0.5">Training load logged across muscle groups over the past 7 days.</p>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                <XAxis dataKey="name" stroke="#A3A3A3" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                <YAxis stroke="#A3A3A3" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#141414', borderColor: '#262626', borderRadius: '2px', color: '#fff', fontFamily: 'monospace', fontSize: '12px' }}
                />
                <Bar dataKey="load" radius={[2, 2, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={themeColor} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Completion Summary Modal */}
      {showSummaryModal && summaryData && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
          <div className="bg-[#0A0A0A] border border-emerald-500 rounded-sm p-6 max-w-md w-full space-y-5 text-center relative">
            <div className="inline-flex p-3 bg-emerald-950/60 rounded-full border border-emerald-500">
              <Award className="w-10 h-10 text-emerald-400" />
            </div>

            <div>
              <h3 className="text-xl font-mono text-white font-bold uppercase">WORKOUT COMPLETED!</h3>
              <p className="text-xs font-mono text-emerald-400 uppercase mt-1">LOGGED TO YOUR SYSTEM RECORD</p>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-[#141414] p-3 border border-[#262626] rounded-sm text-left font-mono">
              <div>
                <span className="text-[10px] text-[#A3A3A3] uppercase block">WORKOUT TIME</span>
                <span className="text-sm text-white font-bold">{formatTimer(summaryData.duration)}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#A3A3A3] uppercase block">CALORIES BURNED</span>
                <span className="text-sm text-amber-400 font-bold">{summaryData.totalCalories} KCAL</span>
              </div>
              <div>
                <span className="text-[10px] text-[#A3A3A3] uppercase block">TOTAL VOLUME</span>
                <span className="text-sm text-cyan-400 font-bold">{summaryData.totalVolume} KG</span>
              </div>
              <div>
                <span className="text-[10px] text-[#A3A3A3] uppercase block">XP EARNED</span>
                <span className="text-sm text-emerald-400 font-bold">+{summaryData.totalXp} XP</span>
              </div>
            </div>

            <button
              onClick={() => {
                setShowSummaryModal(false);
                setActiveLayer('programs');
              }}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold uppercase rounded-sm transition-all"
            >
              RETURN TO LAYER 1: CATALOG
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
