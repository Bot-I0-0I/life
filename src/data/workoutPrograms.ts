export interface ExerciseItem {
  name: string;
  calories: number;
  duration: number; // mins
  muscleGroup: 'chest' | 'back' | 'legs' | 'arms' | 'shoulders' | 'core' | 'cardio';
  tag?: string;
  equipment?: string;
  details?: string;
  defaultSets?: number;
  targetReps?: number;
}

export interface WorkoutDayItem {
  dayNumber: number;
  title: string;
  muscleFocus?: string;
  exercises: ExerciseItem[];
}

export interface WorkoutPlanItem {
  id: string;
  name: string;
  area: string;
  tag: string;
  equipment: string;
  description: string;
  targetGoal: 'fat_loss' | 'muscle_gain' | 'strength' | 'calisthenics' | 'joint_care';
  recommendedBodyType: string;
  compatibilityNote: string;
  days: WorkoutDayItem[];
}

export const BUILT_IN_WORKOUT_PROGRAMS: WorkoutPlanItem[] = [
  // --- NO EQUIPMENT / BODYWEIGHT PROGRAM 1 ---
  {
    id: '7day_no_equipment_calisthenics',
    name: '7-DAY CALISTHENICS & BODYWEIGHT SHRED',
    area: 'Bodyweight Mastery',
    tag: 'Calisthenics',
    equipment: 'No Equipment',
    targetGoal: 'calisthenics',
    recommendedBodyType: 'All Body Types / Athletic or Beginners',
    compatibilityNote: 'Ideal for relative bodyweight strength, core stability, and agile push-pull conditioning.',
    description: 'Complete 7-day bodyweight calisthenics system. Perform one focused session each day to build lean muscle and explosive endurance.',
    days: [
      {
        dayNumber: 1,
        title: 'DAY 1: UPPER PUSH & CHEST',
        muscleFocus: 'Chest, Shoulders & Triceps',
        exercises: [
          { name: 'STANDARD FLOOR PUSHUPS', calories: 120, duration: 10, muscleGroup: 'chest', tag: 'Calisthenics', equipment: 'None', details: '4 sets × 20 reps (Strict form, chest to floor)', defaultSets: 4, targetReps: 20 },
          { name: 'DIAMOND TRICEP PUSHUPS', calories: 100, duration: 8, muscleGroup: 'arms', tag: 'Calisthenics', equipment: 'None', details: '3 sets × 12 reps (Triceps focus)', defaultSets: 3, targetReps: 12 },
          { name: 'DECLINE CHAIR PUSHUPS', calories: 110, duration: 8, muscleGroup: 'chest', tag: 'Calisthenics', equipment: 'None', details: '3 sets × 15 reps (Feet elevated on chair or bed)', defaultSets: 3, targetReps: 15 },
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
          { name: 'L-SIT COMPRESSION TUCKS', calories: 90, duration: 8, muscleGroup: 'core', tag: 'Calisthenics', equipment: 'None', details: '3 sets × 10 knee tucks off floor', defaultSets: 3, targetReps: 10 },
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
          { name: 'WORLD GREATEST LUNGE REACH', calories: 60, duration: 8, muscleGroup: 'legs', tag: 'Mobility', equipment: 'None', details: '3 sets × 8 reps per leg with overhead rotation', defaultSets: 3, targetReps: 8 }
        ]
      }
    ]
  },

  // --- NO EQUIPMENT / BODYWEIGHT PROGRAM 2 ---
  {
    id: '14day_zero_equipment_fullbody_reset',
    name: '14-DAY ZERO EQUIPMENT FULL BODY RESET',
    area: 'Zero Equipment Home Reset',
    tag: 'Fat Loss',
    equipment: 'No Equipment',
    targetGoal: 'fat_loss',
    recommendedBodyType: 'All Body Types / Home Workout',
    compatibilityNote: 'Requires zero gear. Focuses on full-body functional endurance and calorie burn.',
    description: 'A 14-day progressive bodyweight routine designed for at-home training with zero gym gear needed.',
    days: [
      {
        dayNumber: 1,
        title: 'DAY 1: FULL BODY FOUNDATIONS',
        muscleFocus: 'Quads, Chest & Core',
        exercises: [
          { name: 'BODYWEIGHT AIR SQUATS', calories: 130, duration: 10, muscleGroup: 'legs', tag: 'Bodyweight', equipment: 'None', details: '4 sets × 20 reps', defaultSets: 4, targetReps: 20 },
          { name: 'KNEE OR FULL PUSHUPS', calories: 110, duration: 8, muscleGroup: 'chest', tag: 'Bodyweight', equipment: 'None', details: '4 sets × 12 reps', defaultSets: 4, targetReps: 12 },
          { name: 'ALTERNATING REVERSE LUNGES', calories: 120, duration: 10, muscleGroup: 'legs', tag: 'Bodyweight', equipment: 'None', details: '3 sets × 12 reps per leg', defaultSets: 3, targetReps: 12 },
          { name: 'FOREARM PLANK HOLD', calories: 80, duration: 6, muscleGroup: 'core', tag: 'Core', equipment: 'None', details: '3 sets × 45s holds', defaultSets: 3, targetReps: 45 }
        ]
      },
      {
        dayNumber: 2,
        title: 'DAY 2: CARDIO ELEVATION & ABS',
        muscleFocus: 'Heart Rate & Core',
        exercises: [
          { name: 'JUMPING JACKS SPEED BURST', calories: 140, duration: 10, muscleGroup: 'cardio', tag: 'Cardio', equipment: 'None', details: '4 sets × 45s continuous', defaultSets: 4, targetReps: 45 },
          { name: 'MOUNTAIN CLIMBERS', calories: 130, duration: 8, muscleGroup: 'core', tag: 'Cardio', equipment: 'None', details: '4 sets × 30s rapid knee drives', defaultSets: 4, targetReps: 30 },
          { name: 'CRUNCHES WITH PAUSE', calories: 90, duration: 8, muscleGroup: 'core', tag: 'Core', equipment: 'None', details: '3 sets × 20 reps', defaultSets: 3, targetReps: 20 },
          { name: 'HIGH KNEE MARCH IN PLACE', calories: 110, duration: 8, muscleGroup: 'cardio', tag: 'Cardio', equipment: 'None', details: '3 sets × 60s steady tempo', defaultSets: 3, targetReps: 60 }
        ]
      },
      {
        dayNumber: 3,
        title: 'DAY 3: POSTERIOR CHAIN & LATS',
        muscleFocus: 'Glutes, Lower Back & Rear Delts',
        exercises: [
          { name: 'GLUTE BRIDGES WITH SQUEEZE', calories: 110, duration: 10, muscleGroup: 'legs', tag: 'Bodyweight', equipment: 'None', details: '4 sets × 18 reps with 2s squeeze', defaultSets: 4, targetReps: 18 },
          { name: 'SUPERMAN ARM EXTENSIONS', calories: 90, duration: 8, muscleGroup: 'back', tag: 'Bodyweight', equipment: 'None', details: '4 sets × 15 reps', defaultSets: 4, targetReps: 15 },
          { name: 'DOORWAY ARM TOWEL ROWS', calories: 100, duration: 8, muscleGroup: 'back', tag: 'Bodyweight', equipment: 'None', details: '3 sets × 12 reps', defaultSets: 3, targetReps: 12 },
          { name: 'BIRD DOG BALANCE', calories: 70, duration: 6, muscleGroup: 'core', tag: 'Core', equipment: 'None', details: '3 sets × 10 reps per side', defaultSets: 3, targetReps: 10 }
        ]
      }
    ]
  },

  // --- NO EQUIPMENT / BODYWEIGHT PROGRAM 3 ---
  {
    id: 'no_eq_hiit_fat_incinerator',
    name: 'NO-EQUIPMENT HIIT FAT INCINERATOR',
    area: 'HIIT & Fat Loss',
    tag: 'Fat Loss',
    equipment: 'No Equipment',
    targetGoal: 'fat_loss',
    recommendedBodyType: 'All Body Types / Max Calorie Shred Goal',
    compatibilityNote: 'High intensity interval training. Max metabolic output using purely body weight.',
    description: 'Relentless bodyweight HIIT rounds engineered to torch maximum calories in minimal time.',
    days: [
      {
        dayNumber: 1,
        title: 'DAY 1: BURPEE & SQUAT INCINERATOR',
        muscleFocus: 'Full Body Cardiovascular Melt',
        exercises: [
          { name: 'EXPLOSIVE BURPEES', calories: 220, duration: 12, muscleGroup: 'cardio', tag: 'HIIT', equipment: 'None', details: '5 sets × 12 reps', defaultSets: 5, targetReps: 12 },
          { name: 'SPEED AIR SQUATS', calories: 160, duration: 10, muscleGroup: 'legs', tag: 'HIIT', equipment: 'None', details: '4 sets × 25 reps', defaultSets: 4, targetReps: 25 },
          { name: 'PLANK JACK SPRINTS', calories: 140, duration: 8, muscleGroup: 'core', tag: 'HIIT', equipment: 'None', details: '4 sets × 40s fast feet', defaultSets: 4, targetReps: 40 },
          { name: 'SKATER JUMPS', calories: 150, duration: 8, muscleGroup: 'legs', tag: 'HIIT', equipment: 'None', details: '4 sets × 20 alternating leaps', defaultSets: 4, targetReps: 20 }
        ]
      },
      {
        dayNumber: 2,
        title: 'DAY 2: PUSH & CORE METABOLIC BURN',
        muscleFocus: 'Chest, Arms & Abs',
        exercises: [
          { name: 'TEMPO FLOOR PUSHUPS', calories: 150, duration: 10, muscleGroup: 'chest', tag: 'HIIT', equipment: 'None', details: '4 sets × 15 reps (3s down)', defaultSets: 4, targetReps: 15 },
          { name: 'BICYCLE CRUNCH SPRINTS', calories: 120, duration: 8, muscleGroup: 'core', tag: 'Core', equipment: 'None', details: '4 sets × 30 reps', defaultSets: 4, targetReps: 30 },
          { name: 'COMMANDO PLANK LIFTS', calories: 130, duration: 8, muscleGroup: 'core', tag: 'HIIT', equipment: 'None', details: '3 sets × 12 up-down reps', defaultSets: 3, targetReps: 12 },
          { name: 'HIGH KNEE SPRINTS', calories: 160, duration: 8, muscleGroup: 'cardio', tag: 'HIIT', equipment: 'None', details: '4 sets × 45s max speed', defaultSets: 4, targetReps: 45 }
        ]
      }
    ]
  },

  // --- NO EQUIPMENT / BODYWEIGHT PROGRAM 4 ---
  {
    id: 'beginner_bodyweight_foundations',
    name: 'BEGINNER BODYWEIGHT FOUNDATIONS',
    area: 'Beginner Friendly',
    tag: 'Joint Safe',
    equipment: 'No Equipment',
    targetGoal: 'joint_care',
    recommendedBodyType: 'Beginners / New to Fitness / Soft Entry',
    compatibilityNote: 'Low barrier to entry. Smooth transitions with zero equipment needed.',
    description: 'Perfect starting point for newcomers to build baseline strength, joint stability, and stamina safely at home.',
    days: [
      {
        dayNumber: 1,
        title: 'DAY 1: FULL BODY MOBILITY & BASE',
        muscleFocus: 'Joint Activation & Light Muscles',
        exercises: [
          { name: 'WALL PUSHUPS', calories: 80, duration: 8, muscleGroup: 'chest', tag: 'Beginner', equipment: 'None', details: '3 sets × 15 smooth reps against wall', defaultSets: 3, targetReps: 15 },
          { name: 'CHAIR ASSISTED SQUATS', calories: 100, duration: 10, muscleGroup: 'legs', tag: 'Beginner', equipment: 'None', details: '3 sets × 12 reps sit-to-stand', defaultSets: 3, targetReps: 12 },
          { name: 'STANDING MARCH IN PLACE', calories: 90, duration: 8, muscleGroup: 'cardio', tag: 'Beginner', equipment: 'None', details: '3 sets × 60s steady pace', defaultSets: 3, targetReps: 60 },
          { name: 'KNEE BRACING BIRD DOG', calories: 70, duration: 6, muscleGroup: 'core', tag: 'Beginner', equipment: 'None', details: '3 sets × 10 per side', defaultSets: 3, targetReps: 10 }
        ]
      }
    ]
  },

  // --- NO EQUIPMENT / BODYWEIGHT PROGRAM 5 ---
  {
    id: 'no_equipment_push_pull_legs',
    name: 'NO-EQUIPMENT PUSH / PULL / LEGS SPLIT',
    area: 'Bodyweight Split Routine',
    tag: 'Calisthenics',
    equipment: 'No Equipment',
    targetGoal: 'calisthenics',
    recommendedBodyType: 'Athletic / intermediate Home Lifters',
    compatibilityNote: 'Classic PPL structure re-engineered strictly for bodyweight mastery.',
    description: 'Classic 3-day Push-Pull-Legs rotation utilizing pure body weight levers, tempo variations, and angle changes.',
    days: [
      {
        dayNumber: 1,
        title: 'DAY 1: BODYWEIGHT PUSH (CHEST & SHOULDERS)',
        muscleFocus: 'Chest, Delts & Triceps',
        exercises: [
          { name: 'DECLINE PUSHUPS', calories: 130, duration: 10, muscleGroup: 'chest', tag: 'Push', equipment: 'None', details: '4 sets × 15 reps', defaultSets: 4, targetReps: 15 },
          { name: 'PIKE PUSHUPS', calories: 120, duration: 10, muscleGroup: 'shoulders', tag: 'Push', equipment: 'None', details: '4 sets × 12 reps', defaultSets: 4, targetReps: 12 },
          { name: 'CHAIR TRICEP DIPS', calories: 100, duration: 8, muscleGroup: 'arms', tag: 'Push', equipment: 'None', details: '3 sets × 15 reps', defaultSets: 3, targetReps: 15 },
          { name: 'PLANK SHOULDER TAPS', calories: 90, duration: 8, muscleGroup: 'core', tag: 'Push', equipment: 'None', details: '3 sets × 20 taps', defaultSets: 3, targetReps: 20 }
        ]
      },
      {
        dayNumber: 2,
        title: 'DAY 2: BODYWEIGHT PULL (BACK & BICEPS)',
        muscleFocus: 'Lats, Upper Back & Arms',
        exercises: [
          { name: 'DOORWAY / TABLE INVERTED ROWS', calories: 140, duration: 10, muscleGroup: 'back', tag: 'Pull', equipment: 'None', details: '4 sets × 12 reps', defaultSets: 4, targetReps: 12 },
          { name: 'PRONE SUPERMAN PULLBACKS', calories: 100, duration: 8, muscleGroup: 'back', tag: 'Pull', equipment: 'None', details: '4 sets × 15 reps', defaultSets: 4, targetReps: 15 },
          { name: 'ISOMETRIC BICEP TOWEL HOLDS', calories: 90, duration: 8, muscleGroup: 'arms', tag: 'Pull', equipment: 'None', details: '3 sets × 30s max tension pull', defaultSets: 3, targetReps: 30 },
          { name: 'REVERSE FLYES ON MAT', calories: 80, duration: 8, muscleGroup: 'shoulders', tag: 'Pull', equipment: 'None', details: '3 sets × 15 reps', defaultSets: 3, targetReps: 15 }
        ]
      },
      {
        dayNumber: 3,
        title: 'DAY 3: BODYWEIGHT LEGS & GLUTES',
        muscleFocus: 'Quads, Hamstrings & Calves',
        exercises: [
          { name: 'BULGARIAN SPLIT SQUATS (NO WT)', calories: 160, duration: 12, muscleGroup: 'legs', tag: 'Legs', equipment: 'None', details: '4 sets × 12 per leg', defaultSets: 4, targetReps: 12 },
          { name: 'SINGLE LEG GLUTE BRIDGES', calories: 130, duration: 10, muscleGroup: 'legs', tag: 'Legs', equipment: 'None', details: '4 sets × 12 per leg', defaultSets: 4, targetReps: 12 },
          { name: 'AIR SQUAT PULSES', calories: 120, duration: 8, muscleGroup: 'legs', tag: 'Legs', equipment: 'None', details: '3 sets × 20 pulse reps', defaultSets: 3, targetReps: 20 },
          { name: 'SINGLE-LEG CALF RAISES', calories: 80, duration: 8, muscleGroup: 'legs', tag: 'Legs', equipment: 'None', details: '4 sets × 20 per leg', defaultSets: 4, targetReps: 20 }
        ]
      }
    ]
  },

  // --- NO EQUIPMENT / BODYWEIGHT PROGRAM 6 ---
  {
    id: 'morning_mobility_posture_fix',
    name: 'MORNING MOBILITY & POSTURE CORRECTION',
    area: 'Mobility & Spinal Alignment',
    tag: 'Joint Safe',
    equipment: 'No Equipment',
    targetGoal: 'joint_care',
    recommendedBodyType: 'Desk Workers / Posture Fix / All Fitness Levels',
    compatibilityNote: 'Gentle spinal decompression, neck tension release, and thoracic mobility.',
    description: 'Targeted morning mobility routine to unlock stiff joints, eliminate forward head posture, and mobilize the thoracic spine.',
    days: [
      {
        dayNumber: 1,
        title: 'DAY 1: THORACIC & POSTURE UNLOCK',
        muscleFocus: 'Upper Back, Neck & Spine',
        exercises: [
          { name: 'THORACIC CAT-COW FLOW', calories: 50, duration: 8, muscleGroup: 'back', tag: 'Mobility', equipment: 'None', details: '3 sets × 12 deep breath cycles', defaultSets: 3, targetReps: 12 },
          { name: 'WORLD GREATEST LUNGE REACH', calories: 60, duration: 8, muscleGroup: 'legs', tag: 'Mobility', equipment: 'None', details: '3 sets × 8 reps per side', defaultSets: 3, targetReps: 8 },
          { name: 'DOORWAY CHEST & DELT OPENER', calories: 40, duration: 6, muscleGroup: 'chest', tag: 'Mobility', equipment: 'None', details: '3 sets × 45s stretch holds', defaultSets: 3, targetReps: 45 },
          { name: 'CHIN TUCKS & NECK DECOMPRESSION', calories: 30, duration: 5, muscleGroup: 'shoulders', tag: 'Mobility', equipment: 'None', details: '3 sets × 12 gentle hold reps', defaultSets: 3, targetReps: 12 }
        ]
      }
    ]
  },

  // --- NO EQUIPMENT / BODYWEIGHT PROGRAM 7 ---
  {
    id: 'bodyweight_legs_glutes_sculptor',
    name: 'BODYWEIGHT LEGS & GLUTES SCULPTOR',
    area: 'Lower Body Sculpting',
    tag: 'Calisthenics',
    equipment: 'No Equipment',
    targetGoal: 'calisthenics',
    recommendedBodyType: 'All Body Types / Lower Body Focus',
    compatibilityNote: 'High repetition time-under-tension lower body hypertrophy without heavy iron.',
    description: 'High volume leg and glute conditioning program designed to build lower body strength and endurance at home.',
    days: [
      {
        dayNumber: 1,
        title: 'DAY 1: GLUTE BURNOUT & QUAD OVERLOAD',
        muscleFocus: 'Glutes, Quads & Hamstrings',
        exercises: [
          { name: 'SUMO WIDE STANCE AIR SQUATS', calories: 150, duration: 10, muscleGroup: 'legs', tag: 'Legs', equipment: 'None', details: '4 sets × 25 reps', defaultSets: 4, targetReps: 25 },
          { name: 'DONKEY KICK GLUTE ISOLATION', calories: 110, duration: 8, muscleGroup: 'legs', tag: 'Legs', equipment: 'None', details: '4 sets × 20 per leg', defaultSets: 4, targetReps: 20 },
          { name: 'FIRE HYDRANTS (OUTER GLUTE)', calories: 100, duration: 8, muscleGroup: 'legs', tag: 'Legs', equipment: 'None', details: '4 sets × 20 per leg', defaultSets: 4, targetReps: 20 },
          { name: 'WALL SIT ISOMETRIC BRACE', calories: 110, duration: 8, muscleGroup: 'legs', tag: 'Legs', equipment: 'None', details: '3 sets × 60s holds', defaultSets: 3, targetReps: 60 }
        ]
      }
    ]
  },

  // --- NO EQUIPMENT / BODYWEIGHT PROGRAM 8 ---
  {
    id: 'upper_body_bodyweight_blaster',
    name: 'UPPER BODY BODYWEIGHT BLASTER',
    area: 'Upper Body Bodyweight',
    tag: 'Calisthenics',
    equipment: 'No Equipment',
    targetGoal: 'calisthenics',
    recommendedBodyType: 'All Body Types / Upper Body Focus',
    compatibilityNote: 'Push-pull volume targeting chest, arms, shoulders, and core.',
    description: 'Comprehensive upper body bodyweight protocol focused on pushing strength, shoulder stability, and arm definition.',
    days: [
      {
        dayNumber: 1,
        title: 'DAY 1: CHEST, SHOULDERS & TRICEPS BLASTER',
        muscleFocus: 'Chest & Arms',
        exercises: [
          { name: 'WIDE HAND PUSHUPS', calories: 140, duration: 10, muscleGroup: 'chest', tag: 'Upper Body', equipment: 'None', details: '4 sets × 18 reps', defaultSets: 4, targetReps: 18 },
          { name: 'INCLINE CHAIR / BED PUSHUPS', calories: 110, duration: 8, muscleGroup: 'chest', tag: 'Upper Body', equipment: 'None', details: '4 sets × 15 reps', defaultSets: 4, targetReps: 15 },
          { name: 'PIKE SHOULDER PRESS PUSHUPS', calories: 130, duration: 10, muscleGroup: 'shoulders', tag: 'Upper Body', equipment: 'None', details: '3 sets × 12 reps', defaultSets: 3, targetReps: 12 },
          { name: 'DIAMOND PUSHUPS', calories: 120, duration: 8, muscleGroup: 'arms', tag: 'Upper Body', equipment: 'None', details: '3 sets × 12 reps', defaultSets: 3, targetReps: 12 }
        ]
      }
    ]
  },

  // --- NO EQUIPMENT / BODYWEIGHT PROGRAM 9 ---
  {
    id: '15min_quick_home_cardio_blast',
    name: '15-MINUTE QUICK HOME CARDIO BLAST',
    area: 'Express Home Workout',
    tag: 'Fat Loss',
    equipment: 'No Equipment',
    targetGoal: 'fat_loss',
    recommendedBodyType: 'Busy Individuals / Quick Session Goal',
    compatibilityNote: '15 minutes total. Non-stop rapid cardio movements to ignite metabolism.',
    description: 'Fast-paced 15-minute home workout designed for busy days when you need a quick sweat session with zero setup.',
    days: [
      {
        dayNumber: 1,
        title: 'DAY 1: 15-MIN EXPRESS SHRED',
        muscleFocus: 'Cardio & Full Body',
        exercises: [
          { name: 'RAPID JUMPING JACKS', calories: 120, duration: 4, muscleGroup: 'cardio', tag: 'Express', equipment: 'None', details: '3 sets × 60s max speed', defaultSets: 3, targetReps: 60 },
          { name: 'HIGH KNEE SPRINTS', calories: 130, duration: 4, muscleGroup: 'cardio', tag: 'Express', equipment: 'None', details: '3 sets × 45s fast pace', defaultSets: 3, targetReps: 45 },
          { name: 'HALF BURPEES (NO PUSHUP)', calories: 140, duration: 4, muscleGroup: 'cardio', tag: 'Express', equipment: 'None', details: '3 sets × 15 reps', defaultSets: 3, targetReps: 15 },
          { name: 'PLANK HOLD FINISHER', calories: 60, duration: 3, muscleGroup: 'core', tag: 'Express', equipment: 'None', details: '2 sets × 60s hold', defaultSets: 2, targetReps: 60 }
        ]
      }
    ]
  },

  // --- NO EQUIPMENT / BODYWEIGHT PROGRAM 10 ---
  {
    id: 'bodyweight_isometric_strength',
    name: 'ISOMETRIC BODYWEIGHT STRENGTH & BRACING',
    area: 'Core Bracing & Isometric Hold',
    tag: 'Strength',
    equipment: 'No Equipment',
    targetGoal: 'strength',
    recommendedBodyType: 'All Body Types / Isometric Hold Goal',
    compatibilityNote: 'Zero joint motion. Max muscle firing through static tension and time under hold.',
    description: 'Build tendon strength and core rigidity with static isometric holds that protect joint structures.',
    days: [
      {
        dayNumber: 1,
        title: 'DAY 1: ISOMETRIC HOLD MATRIX',
        muscleFocus: 'Static Core & Tendon Strength',
        exercises: [
          { name: 'WALL SIT BRACE HOLD', calories: 110, duration: 8, muscleGroup: 'legs', tag: 'Isometric', equipment: 'None', details: '4 sets × 60s hold', defaultSets: 4, targetReps: 60 },
          { name: 'FOREARM PLANK RIGID HOLD', calories: 90, duration: 8, muscleGroup: 'core', tag: 'Isometric', equipment: 'None', details: '4 sets × 60s hold', defaultSets: 4, targetReps: 60 },
          { name: 'HOLLOW BODY STATIC BRACE', calories: 100, duration: 8, muscleGroup: 'core', tag: 'Isometric', equipment: 'None', details: '4 sets × 45s hold', defaultSets: 4, targetReps: 45 },
          { name: 'SUPERMAN ISOMETRIC HOLD', calories: 80, duration: 6, muscleGroup: 'back', tag: 'Isometric', equipment: 'None', details: '3 sets × 45s hold', defaultSets: 3, targetReps: 45 }
        ]
      }
    ]
  },

  // --- NO EQUIPMENT / BODYWEIGHT PROGRAM 11 ---
  {
    id: 'home_fat_burn_tabata_shred',
    name: 'NO-EQUIPMENT TABATA FAT SHRED',
    area: 'Tabata 20/10 Conditioning',
    tag: 'Fat Loss',
    equipment: 'No Equipment',
    targetGoal: 'fat_loss',
    recommendedBodyType: 'All Fitness Levels / Fat Loss Goal',
    compatibilityNote: '20 seconds max output, 10 seconds rest. Proven metabolic booster.',
    description: 'Classic 20s work / 10s rest Tabata protocol using simple bodyweight movements for rapid fat oxidation.',
    days: [
      {
        dayNumber: 1,
        title: 'DAY 1: TABATA METABOLIC ONSLAUGHT',
        muscleFocus: 'Full Body Tabata Intervals',
        exercises: [
          { name: 'TABATA SQUAT SPRINTS', calories: 160, duration: 8, muscleGroup: 'legs', tag: 'Tabata', equipment: 'None', details: '8 rounds (20s on / 10s rest)', defaultSets: 8, targetReps: 20 },
          { name: 'TABATA MOUNTAIN CLIMBERS', calories: 140, duration: 8, muscleGroup: 'core', tag: 'Tabata', equipment: 'None', details: '8 rounds (20s on / 10s rest)', defaultSets: 8, targetReps: 20 },
          { name: 'TABATA PUSHUPS / KNEE PUSHUPS', calories: 130, duration: 8, muscleGroup: 'chest', tag: 'Tabata', equipment: 'None', details: '8 rounds (20s on / 10s rest)', defaultSets: 8, targetReps: 20 },
          { name: 'TABATA JUMPING JACKS', calories: 120, duration: 8, muscleGroup: 'cardio', tag: 'Tabata', equipment: 'None', details: '8 rounds (20s on / 10s rest)', defaultSets: 8, targetReps: 20 }
        ]
      }
    ]
  },

  // --- NO EQUIPMENT / BODYWEIGHT PROGRAM 12 ---
  {
    id: 'no_eq_athletic_agility_plyo',
    name: 'ATHLETIC PLYOMETRICS & AGILITY',
    area: 'Athletic Performance',
    tag: 'Calisthenics',
    equipment: 'No Equipment',
    targetGoal: 'calisthenics',
    recommendedBodyType: 'Athletes / High Energy / Explosive Goal',
    compatibilityNote: 'Fast footwork, plyometric jumping, and power generation.',
    description: 'Develop fast-twitch muscle fibers, explosive jump height, and agility with zero workout equipment.',
    days: [
      {
        dayNumber: 1,
        title: 'DAY 1: EXPLOSIVE POWER & FOOTWORK',
        muscleFocus: 'Explosive Legs & Fast Twitch',
        exercises: [
          { name: 'SQUAT JUMP EXPLOSION', calories: 170, duration: 10, muscleGroup: 'legs', tag: 'Plyo', equipment: 'None', details: '4 sets × 15 explosive jump landings', defaultSets: 4, targetReps: 15 },
          { name: 'LATERAL BOUNDS (SKATER LEAPS)', calories: 150, duration: 10, muscleGroup: 'legs', tag: 'Plyo', equipment: 'None', details: '4 sets × 20 leaps', defaultSets: 4, targetReps: 20 },
          { name: 'TUCK JUMPS', calories: 180, duration: 8, muscleGroup: 'cardio', tag: 'Plyo', equipment: 'None', details: '3 sets × 12 vertical tucks', defaultSets: 3, targetReps: 12 },
          { name: 'IN-OUT QUICK FEET AGILITY', calories: 110, duration: 8, muscleGroup: 'cardio', tag: 'Agility', equipment: 'None', details: '4 sets × 30s max foot speed', defaultSets: 4, targetReps: 30 }
        ]
      }
    ]
  },

  // --- NO EQUIPMENT / BODYWEIGHT PROGRAM 13 ---
  {
    id: 'zero_equipment_abs_obliques_blast',
    name: 'ZERO EQUIPMENT ABS & OBLIQUES SHRED',
    area: 'Abdominal Shred',
    tag: 'Calisthenics',
    equipment: 'No Equipment',
    targetGoal: 'calisthenics',
    recommendedBodyType: 'All Fitness Levels / Ab Focus',
    compatibilityNote: 'Pure floor core exercises targeting six-pack abs and serratus/obliques.',
    description: 'Targeted core compression routine engineered to build sharp abdominal definition and core endurance.',
    days: [
      {
        dayNumber: 1,
        title: 'DAY 1: SIX-PACK & OBLIQUE SHRED',
        muscleFocus: 'Rectus Abdominis & Obliques',
        exercises: [
          { name: 'BICYCLE CRUNCH KNEE TOUCHES', calories: 120, duration: 8, muscleGroup: 'core', tag: 'Abs', equipment: 'None', details: '4 sets × 25 reps', defaultSets: 4, targetReps: 25 },
          { name: 'RUSSIAN TWIST BODYWEIGHT', calories: 100, duration: 8, muscleGroup: 'core', tag: 'Abs', equipment: 'None', details: '4 sets × 30 twists', defaultSets: 4, targetReps: 30 },
          { name: 'REVERSE CRUNCH LEG LIFTS', calories: 90, duration: 8, muscleGroup: 'core', tag: 'Abs', equipment: 'None', details: '3 sets × 20 controlled reps', defaultSets: 3, targetReps: 20 },
          { name: 'SIDE PLANK DIP LIFTS', calories: 80, duration: 8, muscleGroup: 'core', tag: 'Abs', equipment: 'None', details: '3 sets × 12 per side', defaultSets: 3, targetReps: 12 }
        ]
      }
    ]
  },

  // --- NO EQUIPMENT / BODYWEIGHT PROGRAM 14 ---
  {
    id: 'no_eq_joint_safe_low_impact',
    name: 'NO-EQUIPMENT LOW-IMPACT JOINT RECOVERY',
    area: 'Joint Protection & Recovery',
    tag: 'Joint Safe',
    equipment: 'No Equipment',
    targetGoal: 'joint_care',
    recommendedBodyType: 'Joint Sensitivity / High Body Weight / Active Recovery',
    compatibilityNote: 'Zero jumps, zero hard impact landings. Gentle on knees, spine, and ankles.',
    description: 'A low-impact, joint-safe bodyweight system for burning calories and mobilizing muscles without stress on joints.',
    days: [
      {
        dayNumber: 1,
        title: 'DAY 1: KNEE-SAFE LOW IMPACT CONDITIONING',
        muscleFocus: 'Gentle Cardio & Core',
        exercises: [
          { name: 'STANDING LOW-IMPACT MARCH', calories: 100, duration: 10, muscleGroup: 'cardio', tag: 'Joint Safe', equipment: 'None', details: '4 sets × 60s steady marching', defaultSets: 4, targetReps: 60 },
          { name: 'GLUTE BRIDGES ON MAT', calories: 120, duration: 10, muscleGroup: 'legs', tag: 'Joint Safe', equipment: 'None', details: '4 sets × 15 reps with 2s hold', defaultSets: 4, targetReps: 15 },
          { name: 'BIRD-DOG STABILIZATION', calories: 80, duration: 8, muscleGroup: 'core', tag: 'Joint Safe', equipment: 'None', details: '3 sets × 10 per side', defaultSets: 3, targetReps: 10 },
          { name: 'SEATED ARM PUNCHES', calories: 90, duration: 8, muscleGroup: 'cardio', tag: 'Joint Safe', equipment: 'None', details: '3 sets × 90s rapid light punches', defaultSets: 3, targetReps: 90 }
        ]
      }
    ]
  },

  // --- NO EQUIPMENT / BODYWEIGHT PROGRAM 15 ---
  {
    id: 'calisthenics_skills_handstand_l_sit',
    name: 'CALISTHENICS SKILLS & ISOMETRIC HOLDS',
    area: 'Skill Calisthenics',
    tag: 'Calisthenics',
    equipment: 'No Equipment',
    targetGoal: 'calisthenics',
    recommendedBodyType: 'Advanced Bodyweight Athletes',
    compatibilityNote: 'Focuses on shoulder strength, wall handstand holds, and L-sit compression.',
    description: 'Master gymnastics skill progressions like wall handstand holds, crow pose balance, and floor L-sits.',
    days: [
      {
        dayNumber: 1,
        title: 'DAY 1: WALL HANDSTAND & L-SIT PROGRESSION',
        muscleFocus: 'Shoulder Capacity & Core Compression',
        exercises: [
          { name: 'WALL HANDSTAND HOLDS', calories: 130, duration: 10, muscleGroup: 'shoulders', tag: 'Skill', equipment: 'None', details: '4 sets × 30s wall holds', defaultSets: 4, targetReps: 30 },
          { name: 'FLOOR L-SIT TUCK HOLDS', calories: 110, duration: 8, muscleGroup: 'core', tag: 'Skill', equipment: 'None', details: '4 sets × 20s tuck holds off floor', defaultSets: 4, targetReps: 20 },
          { name: 'CROW POSE STATIC BALANCE', calories: 90, duration: 8, muscleGroup: 'arms', tag: 'Skill', equipment: 'None', details: '3 sets × 20s static hold', defaultSets: 3, targetReps: 20 },
          { name: 'PIKE PUSHUPS WITH PAUSE', calories: 120, duration: 8, muscleGroup: 'shoulders', tag: 'Skill', equipment: 'None', details: '3 sets × 10 reps', defaultSets: 3, targetReps: 10 }
        ]
      }
    ]
  },

  // --- NO EQUIPMENT / BODYWEIGHT PROGRAM 16 ---
  {
    id: 'bodyweight_cardio_endurance_builder',
    name: 'BODYWEIGHT CARDIO & ENDURANCE BUILDER',
    area: 'Cardio Stamina',
    tag: 'Fat Loss',
    equipment: 'No Equipment',
    targetGoal: 'fat_loss',
    recommendedBodyType: 'All Body Types / Stamina Goal',
    compatibilityNote: 'Sustained steady-state and interval bodyweight cardio for lung capacity.',
    description: 'Build robust cardiovascular endurance and stamina without needing a treadmill or outdoor track.',
    days: [
      {
        dayNumber: 1,
        title: 'DAY 1: AEROBIC BODYWEIGHT STAMINA',
        muscleFocus: 'Lung Capacity & Legs',
        exercises: [
          { name: 'CONTINUOUS JUMPING JACKS', calories: 180, duration: 12, muscleGroup: 'cardio', tag: 'Cardio', equipment: 'None', details: '4 sets × 90s steady tempo', defaultSets: 4, targetReps: 90 },
          { name: 'SHADOW BOXING COMBOS', calories: 150, duration: 10, muscleGroup: 'cardio', tag: 'Cardio', equipment: 'None', details: '4 sets × 2 mins non-stop combinations', defaultSets: 4, targetReps: 120 },
          { name: 'HIGH KNEE MARCH SPRINTS', calories: 140, duration: 8, muscleGroup: 'cardio', tag: 'Cardio', equipment: 'None', details: '4 sets × 45s fast pace', defaultSets: 4, targetReps: 45 },
          { name: 'SKATER BOUNDS', calories: 130, duration: 8, muscleGroup: 'legs', tag: 'Cardio', equipment: 'None', details: '3 sets × 20 leaps', defaultSets: 3, targetReps: 20 }
        ]
      }
    ]
  },

  // --- NO EQUIPMENT / BODYWEIGHT PROGRAM 17 ---
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
  },

  // --- EQUIPMENT / GYM PROGRAM 18 ---
  {
    id: '7day_fat_burn_metabolic_recomp',
    name: '7-DAY FAT LOSS & METABOLIC SHRED',
    area: 'Weight Loss & Calorie Shred',
    tag: 'Fat Loss',
    equipment: 'Dumbbells / Bodyweight',
    targetGoal: 'fat_loss',
    recommendedBodyType: 'Overweight / Higher Weight / Fat Loss Goal',
    compatibilityNote: 'Optimized for high calorie burn, metabolic elevation & fat density reduction without overloading joints.',
    description: 'High-density metabolic conditioning system engineered to burn max calories, boost insulin sensitivity, and accelerate body fat loss.',
    days: [
      {
        dayNumber: 1,
        title: 'DAY 1: METABOLIC FULL-BODY IGNITION',
        muscleFocus: 'Full Body Fat Burn',
        exercises: [
          { name: 'DUMBBELL THRUSTERS & PRESS', calories: 240, duration: 12, muscleGroup: 'legs', tag: 'Metabolic', equipment: 'Dumbbell', details: '4 sets × 15 reps (Full compound movement)', defaultSets: 4, targetReps: 15 },
          { name: 'KETTLEBELL / DB SWINGS', calories: 210, duration: 10, muscleGroup: 'back', tag: 'Fat Loss', equipment: 'Dumbbell', details: '4 sets × 20 reps (Explosive hip extension)', defaultSets: 4, targetReps: 20 },
          { name: 'REVERSE LUNGE TO OVERHEAD PRESS', calories: 180, duration: 10, muscleGroup: 'legs', tag: 'Metabolic', equipment: 'Dumbbell', details: '3 sets × 12 reps per leg', defaultSets: 3, targetReps: 12 },
          { name: 'MOUNTAIN CLIMBER SPRINTS', calories: 160, duration: 8, muscleGroup: 'cardio', tag: 'Cardio', equipment: 'None', details: '4 sets × 40 seconds max speed', defaultSets: 4, targetReps: 40 }
        ]
      },
      {
        dayNumber: 2,
        title: 'DAY 2: CARDIO INCLINE & CORE COMPRESSION',
        muscleFocus: 'Endurance & Core Shred',
        exercises: [
          { name: 'INCLINE SPEED WALKING / MARCHING', calories: 250, duration: 20, muscleGroup: 'cardio', tag: 'Cardio', equipment: 'Treadmill / None', details: '1 set × 20 mins steady state at 10% incline', defaultSets: 1, targetReps: 20 },
          { name: 'BICYCLE CRUNCH KNEE CRUNCHES', calories: 120, duration: 8, muscleGroup: 'core', tag: 'Core', equipment: 'None', details: '4 sets × 25 reps per side', defaultSets: 4, targetReps: 25 },
          { name: 'PLANK SHOULDER TAPS', calories: 110, duration: 8, muscleGroup: 'core', tag: 'Core', equipment: 'None', details: '4 sets × 20 alternating taps', defaultSets: 4, targetReps: 20 },
          { name: 'JUMPING JACK BURST', calories: 140, duration: 8, muscleGroup: 'cardio', tag: 'Cardio', equipment: 'None', details: '4 sets × 60 seconds rapid tempo', defaultSets: 4, targetReps: 60 }
        ]
      },
      {
        dayNumber: 3,
        title: 'DAY 3: LOWER BODY CALORIC BLAST',
        muscleFocus: 'Quads, Glutes & Hamstrings',
        exercises: [
          { name: 'GOBLET SQUATS', calories: 220, duration: 14, muscleGroup: 'legs', tag: 'Fat Loss', equipment: 'Dumbbell', details: '4 sets × 15 deep chest-up reps', defaultSets: 4, targetReps: 15 },
          { name: 'STEP-UPS ONTO BOX / CHAIR', calories: 190, duration: 12, muscleGroup: 'legs', tag: 'Metabolic', equipment: 'Box / Bench', details: '4 sets × 12 reps per leg', defaultSets: 4, targetReps: 12 },
          { name: 'DUMBBELL STIFF-LEG DEADLIFT', calories: 180, duration: 10, muscleGroup: 'back', tag: 'Strength', equipment: 'Dumbbell', details: '4 sets × 12 reps (Hamstring stretch focus)', defaultSets: 4, targetReps: 12 },
          { name: 'WALL SIT ISOMETRIC HOLD', calories: 100, duration: 8, muscleGroup: 'legs', tag: 'Endurance', equipment: 'None', details: '3 sets × 60s holds', defaultSets: 3, targetReps: 60 }
        ]
      },
      {
        dayNumber: 4,
        title: 'DAY 4: UPPER BODY FAT-MELT CIRCUIT',
        muscleFocus: 'Chest, Back & Shoulders',
        exercises: [
          { name: 'PUSHUP TO RENEGADE ROW', calories: 230, duration: 12, muscleGroup: 'chest', tag: 'Metabolic', equipment: 'Dumbbell', details: '4 sets × 10 complex reps', defaultSets: 4, targetReps: 10 },
          { name: 'DUMBBELL ARNOLD PRESS', calories: 150, duration: 10, muscleGroup: 'shoulders', tag: 'Fat Loss', equipment: 'Dumbbell', details: '4 sets × 12 rotational press reps', defaultSets: 4, targetReps: 12 },
          { name: 'BENT-OVER DUMBBELL ROWS', calories: 170, duration: 10, muscleGroup: 'back', tag: 'Strength', equipment: 'Dumbbell', details: '4 sets × 15 reps (Strict back contraction)', defaultSets: 4, targetReps: 15 },
          { name: 'SHADOW BOXING SPEED PUNCHES', calories: 130, duration: 8, muscleGroup: 'cardio', tag: 'Cardio', equipment: 'None', details: '3 sets × 90 seconds continuous punches', defaultSets: 3, targetReps: 90 }
        ]
      },
      {
        dayNumber: 5,
        title: 'DAY 5: HIGH-DENSITY HIIT SPRINT DENSITY',
        muscleFocus: 'Full Body Cardiovascular Shred',
        exercises: [
          { name: 'BURPEE BOX STEP-OVERS', calories: 260, duration: 15, muscleGroup: 'cardio', tag: 'HIIT', equipment: 'Box / Bench', details: '5 sets × 12 explosive reps', defaultSets: 5, targetReps: 12 },
          { name: 'HIGH KNEE CARDIO SPRINTS', calories: 170, duration: 10, muscleGroup: 'cardio', tag: 'Cardio', equipment: 'None', details: '4 sets × 45s fast pace', defaultSets: 4, targetReps: 45 },
          { name: 'SQUAT JUMP TUCK LANDINGS', calories: 180, duration: 10, muscleGroup: 'legs', tag: 'HIIT', equipment: 'None', details: '4 sets × 15 reps', defaultSets: 4, targetReps: 15 },
          { name: 'PLANK HOLD TO HOLLOW BRACE', calories: 90, duration: 6, muscleGroup: 'core', tag: 'Core', equipment: 'None', details: '3 sets × 60s holds', defaultSets: 3, targetReps: 60 }
        ]
      },
      {
        dayNumber: 6,
        title: 'DAY 6: METABOLIC PUSH & PULL COMPLEX',
        muscleFocus: 'Chest, Arms & Lats',
        exercises: [
          { name: 'DUMBBELL FLOOR PRESS', calories: 180, duration: 10, muscleGroup: 'chest', tag: 'Fat Loss', equipment: 'Dumbbell', details: '4 sets × 15 reps', defaultSets: 4, targetReps: 15 },
          { name: 'DUMBBELL BICEP CURL TO HAMMER PRESS', calories: 160, duration: 10, muscleGroup: 'arms', tag: 'Fat Loss', equipment: 'Dumbbell', details: '4 sets × 12 reps', defaultSets: 4, targetReps: 12 },
          { name: 'TRICEP CHAIR DIPS', calories: 130, duration: 8, muscleGroup: 'arms', tag: 'Metabolic', equipment: 'Chair', details: '3 sets × 15 reps', defaultSets: 3, targetReps: 15 },
          { name: 'RUSSIAN TWIST WITH DB', calories: 120, duration: 8, muscleGroup: 'core', tag: 'Core', equipment: 'Dumbbell', details: '4 sets × 20 twists', defaultSets: 4, targetReps: 20 }
        ]
      },
      {
        dayNumber: 7,
        title: 'DAY 7: ACTIVE RECOVERY & METABOLIC RESET',
        muscleFocus: 'Flexibility & Low Impact Recovery',
        exercises: [
          { name: 'BRISK OUTDOOR WALK / TREADMILL', calories: 180, duration: 25, muscleGroup: 'cardio', tag: 'Recovery', equipment: 'None', details: '1 set × 25 mins steady pace', defaultSets: 1, targetReps: 25 },
          { name: 'THORACIC CAT-COW FLOW', calories: 50, duration: 8, muscleGroup: 'back', tag: 'Mobility', equipment: 'None', details: '3 sets × 12 fluid cycles', defaultSets: 3, targetReps: 12 },
          { name: 'HIP FLEXOR & PIGEON STRETCH', calories: 50, duration: 8, muscleGroup: 'legs', tag: 'Mobility', equipment: 'None', details: '3 sets × 60s per side', defaultSets: 3, targetReps: 60 }
        ]
      }
    ]
  },

  // --- EQUIPMENT / GYM PROGRAM 19 ---
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

  // --- EQUIPMENT / GYM PROGRAM 20 ---
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

  // --- EQUIPMENT / GYM PROGRAM 21 ---
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

  // --- EQUIPMENT / GYM PROGRAM 22 ---
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

  // --- PROGRAM 4: SHADOW MONARCH SOLO PROTOCOL ---
  {
    id: 'shadow_monarch_solo_protocol',
    name: 'SHADOW MONARCH 100-REPS SOLO PROTOCOL',
    area: 'System Ranking Protocol',
    tag: 'Solo Leveling',
    equipment: 'No Equipment',
    targetGoal: 'strength',
    recommendedBodyType: 'All Ranks / High Willpower',
    compatibilityNote: 'Inspired by Jin-Woo daily QUEST. 100 pushups, 100 situps, 100 squats, 10km daily protocol.',
    description: 'The legendary daily punishment-proof workout. Execute 100 reps of core movements to level up attributes instantly.',
    days: [
      {
        dayNumber: 1,
        title: 'DAY 1: THE MONARCH DAILY 100',
        muscleFocus: 'Full Body Overload & Stamina',
        exercises: [
          { name: 'SHADOW PUSHUPS', calories: 180, duration: 15, muscleGroup: 'chest', tag: 'System', equipment: 'None', details: '5 sets × 20 strict floor pushups', defaultSets: 5, targetReps: 20 },
          { name: 'SYSTEM ABDOMINAL SITUPS', calories: 140, duration: 12, muscleGroup: 'core', tag: 'System', equipment: 'None', details: '5 sets × 20 full range situps', defaultSets: 5, targetReps: 20 },
          { name: 'MONARCH DEEP SQUATS', calories: 200, duration: 15, muscleGroup: 'legs', tag: 'System', equipment: 'None', details: '5 sets × 20 full-depth air squats', defaultSets: 5, targetReps: 20 },
          { name: 'SHADOW RUN / CARDIO MARCH', calories: 350, duration: 30, muscleGroup: 'cardio', tag: 'Endurance', equipment: 'None', details: '30 mins steady pace run or outdoor march', defaultSets: 1, targetReps: 30 }
        ]
      }
    ]
  },

  // --- PROGRAM 5: POWERLIFTING BIG 3 STRENGTH PEAK ---
  {
    id: 'powerlifting_big3_5x5',
    name: 'POWERLIFTING BIG 3 STRENGTH PEAK',
    area: 'Heavy Powerlifting',
    tag: 'Strength',
    equipment: 'Barbell & Squat Rack',
    targetGoal: 'strength',
    recommendedBodyType: 'Intermediate to Heavy Lifter',
    compatibilityNote: 'Designed for maximizing 1-Rep-Max force output across Squat, Bench, and Deadlift.',
    description: 'Pure 5x5 compound powerlifting strength program focusing on neurological adaptation and peak force production.',
    days: [
      {
        dayNumber: 1,
        title: 'DAY 1: SQUAT & BENCH OVERLOAD',
        muscleFocus: 'Quads, Chest & Triceps',
        exercises: [
          { name: 'BARBELL LOW-BAR BACK SQUAT', calories: 300, duration: 20, muscleGroup: 'legs', tag: 'Powerlifting', equipment: 'Barbell', details: '5 sets × 5 heavy reps (85% 1RM)', defaultSets: 5, targetReps: 5 },
          { name: 'PAUSED BARBELL BENCH PRESS', calories: 240, duration: 18, muscleGroup: 'chest', tag: 'Powerlifting', equipment: 'Barbell', details: '5 sets × 5 reps (1 second pause on chest)', defaultSets: 5, targetReps: 5 },
          { name: 'CLOSE-GRIP BENCH PRESS', calories: 160, duration: 12, muscleGroup: 'arms', tag: 'Strength', equipment: 'Barbell', details: '4 sets × 8 reps', defaultSets: 4, targetReps: 8 }
        ]
      },
      {
        dayNumber: 2,
        title: 'DAY 2: CONVENTIONAL DEADLIFT & LAT ROW',
        muscleFocus: 'Posterior Chain & Lats',
        exercises: [
          { name: 'HEAVY CONVENTIONAL DEADLIFT', calories: 320, duration: 22, muscleGroup: 'back', tag: 'Powerlifting', equipment: 'Barbell', details: '5 sets × 5 reps (Reset every rep)', defaultSets: 5, targetReps: 5 },
          { name: 'PENDLAY BARBELL ROWS', calories: 200, duration: 15, muscleGroup: 'back', tag: 'Strength', equipment: 'Barbell', details: '4 sets × 8 reps explosive off floor', defaultSets: 4, targetReps: 8 },
          { name: 'FARMERS BARBELL CARRY', calories: 150, duration: 10, muscleGroup: 'core', tag: 'Grip', equipment: 'Barbell', details: '4 sets × 45s heavy carry', defaultSets: 4, targetReps: 45 }
        ]
      }
    ]
  },

  // --- PROGRAM 6: PUSH PULL LEGS (PPL) PRO HYPERTROPHY ---
  {
    id: 'ppl_pro_hypertrophy_6day',
    name: 'PUSH PULL LEGS (PPL) PRO HYPERTROPHY 6-DAY',
    area: 'Aesthetic Bodybuilding',
    tag: 'Hypertrophy',
    equipment: 'Gym / Barbells & Dumbbells',
    targetGoal: 'muscle_gain',
    recommendedBodyType: 'All Body Types / Mass Building',
    compatibilityNote: 'Gold standard 6-day split maximizing muscular hypertrophy with high volume.',
    description: 'The classic 6-day Push-Pull-Legs split engineered for maximal sarcoplasmic hypertrophy and symmetrical physique.',
    days: [
      {
        dayNumber: 1,
        title: 'DAY 1: PUSH A (CHEST, SHOULDERS, TRICEPS)',
        muscleFocus: 'Chest, Front Delt & Triceps',
        exercises: [
          { name: 'INCLINE BARBELL PRESS', calories: 220, duration: 15, muscleGroup: 'chest', tag: 'Hypertrophy', equipment: 'Barbell', details: '4 sets × 8 reps', defaultSets: 4, targetReps: 8 },
          { name: 'FLAT DUMBBELL CHEST PRESS', calories: 180, duration: 12, muscleGroup: 'chest', tag: 'Hypertrophy', equipment: 'Dumbbell', details: '4 sets × 10 reps', defaultSets: 4, targetReps: 10 },
          { name: 'SEATED DUMBBELL OVERHEAD PRESS', calories: 150, duration: 10, muscleGroup: 'shoulders', tag: 'Hypertrophy', equipment: 'Dumbbell', details: '3 sets × 10 reps', defaultSets: 3, targetReps: 10 },
          { name: 'SIDE LATERAL RAISES', calories: 100, duration: 8, muscleGroup: 'shoulders', tag: 'Isolation', equipment: 'Dumbbell', details: '4 sets × 15 reps', defaultSets: 4, targetReps: 15 }
        ]
      },
      {
        dayNumber: 2,
        title: 'DAY 2: PULL A (BACK, REAR DELT, BICEPS)',
        muscleFocus: 'Lats, Upper Back & Biceps',
        exercises: [
          { name: 'WIDE-GRIP LAT PULLDOWNS', calories: 170, duration: 12, muscleGroup: 'back', tag: 'Hypertrophy', equipment: 'Cable', details: '4 sets × 10 reps', defaultSets: 4, targetReps: 10 },
          { name: 'ONE-ARM DUMBBELL ROW', calories: 160, duration: 12, muscleGroup: 'back', tag: 'Hypertrophy', equipment: 'Dumbbell', details: '4 sets × 10 reps per side', defaultSets: 4, targetReps: 10 },
          { name: 'FACEPULLS WITH CABLE ROPE', calories: 110, duration: 8, muscleGroup: 'shoulders', tag: 'Isolation', equipment: 'Cable', details: '4 sets × 15 reps', defaultSets: 4, targetReps: 15 },
          { name: 'INCLINE DUMBBELL BICEP CURLS', calories: 120, duration: 8, muscleGroup: 'arms', tag: 'Isolation', equipment: 'Dumbbell', details: '4 sets × 12 reps', defaultSets: 4, targetReps: 12 }
        ]
      },
      {
        dayNumber: 3,
        title: 'DAY 3: LEGS A (QUADS, HAMSTRINGS, CALVES)',
        muscleFocus: 'Quads & Hamstrings',
        exercises: [
          { name: 'BARBELL BACK SQUAT', calories: 280, duration: 18, muscleGroup: 'legs', tag: 'Hypertrophy', equipment: 'Barbell', details: '4 sets × 8 reps', defaultSets: 4, targetReps: 8 },
          { name: 'ROMANIAN DEADLIFT (RDL)', calories: 210, duration: 12, muscleGroup: 'legs', tag: 'Hypertrophy', equipment: 'Barbell', details: '4 sets × 10 reps', defaultSets: 4, targetReps: 10 },
          { name: 'LEG EXTENSION MACHINE', calories: 130, duration: 10, muscleGroup: 'legs', tag: 'Isolation', equipment: 'Machine', details: '3 sets × 15 reps', defaultSets: 3, targetReps: 15 },
          { name: 'STANDING CALF RAISES', calories: 90, duration: 8, muscleGroup: 'legs', tag: 'Isolation', equipment: 'Machine', details: '4 sets × 20 reps', defaultSets: 4, targetReps: 20 }
        ]
      }
    ]
  },

  // --- PROGRAM 7: MMA COMBAT STRIKER CONDITIONING ---
  {
    id: 'mma_combat_striker',
    name: 'MMA COMBAT STRIKER CONDITIONING',
    area: 'Martial Arts Athleticism',
    tag: 'Athletic',
    equipment: 'No Equipment or Dumbbell',
    targetGoal: 'fat_loss',
    recommendedBodyType: 'Athletic / Fighter Build',
    compatibilityNote: 'High-speed combat rounds designed to elevate VO2 max and explosive punch torque.',
    description: '3-minute fight rounds simulating MMA octagon demands. Combines shadow boxing, sprawl burpees, and rotational core drive.',
    days: [
      {
        dayNumber: 1,
        title: 'ROUND 1: COMBAT STRIKE & SPRAWL',
        muscleFocus: 'Cardio, Shoulders & Explosive Legs',
        exercises: [
          { name: 'SHADOW BOXING COMBOS (1-2-3-HOOK)', calories: 160, duration: 10, muscleGroup: 'cardio', tag: 'Combat', equipment: 'None', details: '3 rounds × 3 mins rapid punching', defaultSets: 3, targetReps: 180 },
          { name: 'MMA SPRAWL BURPEES', calories: 200, duration: 10, muscleGroup: 'cardio', tag: 'Combat', equipment: 'None', details: '4 sets × 12 fast sprawls', defaultSets: 4, targetReps: 12 },
          { name: 'ROTATIONAL MEDICINE BALL / CORE TWISTS', calories: 120, duration: 8, muscleGroup: 'core', tag: 'Combat', equipment: 'None', details: '4 sets × 20 twisting reps', defaultSets: 4, targetReps: 20 },
          { name: 'EXPLOSIVE EXPLOSIVE TUCK JUMPS', calories: 150, duration: 8, muscleGroup: 'legs', tag: 'Plyo', equipment: 'None', details: '3 sets × 12 high jumps', defaultSets: 3, targetReps: 12 }
        ]
      }
    ]
  },

  // --- PROGRAM 8: TACTICAL KETTLEBELL HYBRID ENGINE ---
  {
    id: 'tactical_kettlebell_hybrid',
    name: 'TACTICAL KETTLEBELL HYBRID ENGINE',
    area: 'Functional Conditioning',
    tag: 'Tactical',
    equipment: 'Kettlebell / Dumbbell',
    targetGoal: 'calisthenics',
    recommendedBodyType: 'All Body Types',
    compatibilityNote: 'Develops unbreakable grip, posterior power, and metabolic resilience.',
    description: 'Special forces style kettlebell conditioning. Heavy swings, goblet squats, and Turkish get-ups.',
    days: [
      {
        dayNumber: 1,
        title: 'DAY 1: KETTLEBELL POSTERIOR OVERDRIVE',
        muscleFocus: 'Posterior Chain, Core & Grip',
        exercises: [
          { name: 'RUSSIAN KETTLEBELL SWINGS', calories: 220, duration: 12, muscleGroup: 'back', tag: 'Tactical', equipment: 'Kettlebell', details: '5 sets × 20 reps (Explosive hip drive)', defaultSets: 5, targetReps: 20 },
          { name: 'HEAVY GOBLET SQUATS', calories: 180, duration: 10, muscleGroup: 'legs', tag: 'Tactical', equipment: 'Kettlebell', details: '4 sets × 12 reps deep depth', defaultSets: 4, targetReps: 12 },
          { name: 'TURKISH GET-UPS', calories: 140, duration: 10, muscleGroup: 'core', tag: 'Tactical', equipment: 'Kettlebell', details: '3 sets × 5 reps per arm slow control', defaultSets: 3, targetReps: 5 },
          { name: 'SINGLE-ARM KETTLEBELL CLEAN & PRESS', calories: 160, duration: 10, muscleGroup: 'shoulders', tag: 'Tactical', equipment: 'Kettlebell', details: '4 sets × 8 reps per arm', defaultSets: 4, targetReps: 8 }
        ]
      }
    ]
  },

  // --- PROGRAM 9: SPINE DECOMPRESSION & JOINT MOBILITY REHAB ---
  {
    id: 'spine_decompression_joint_rehab',
    name: 'SPINE DECOMPRESSION & JOINT MOBILITY REHAB',
    area: 'Rehab & Joint Health',
    tag: 'Rehab',
    equipment: 'No Equipment / Mat',
    targetGoal: 'joint_care',
    recommendedBodyType: 'Heavy Body / Desk Workers / Joint Care',
    compatibilityNote: 'Low impact, zero axial loading. Restores spinal disc height and relieves back/knee friction.',
    description: 'Therapeutic joint mobility protocol designed to decompress lower lumbar vertebrae and open tight hips.',
    days: [
      {
        dayNumber: 1,
        title: 'DAY 1: LUMBAR DECOMPRESSION & HIP OPENER',
        muscleFocus: 'Spine, Lower Back & Hips',
        exercises: [
          { name: 'CAT-COW SPINAL SEGMENTATION', calories: 60, duration: 8, muscleGroup: 'back', tag: 'Mobility', equipment: 'None', details: '3 sets × 12 slow breath-coordinated reps', defaultSets: 3, targetReps: 12 },
          { name: 'BIRD-DOG CORE STABILIZATION', calories: 70, duration: 8, muscleGroup: 'core', tag: 'Rehab', equipment: 'None', details: '3 sets × 10 reps per side (2s pause)', defaultSets: 3, targetReps: 10 },
          { name: '90/90 HIP MOBILITY FLOW', calories: 80, duration: 10, muscleGroup: 'legs', tag: 'Mobility', equipment: 'None', details: '3 sets × 8 gentle transitions', defaultSets: 3, targetReps: 8 },
          { name: 'DEAD HANG SPINE DECOMPRESSION', calories: 50, duration: 6, muscleGroup: 'back', tag: 'Rehab', equipment: 'Pull-up Bar', details: '4 sets × 45s passive bar hang', defaultSets: 4, targetReps: 45 }
        ]
      }
    ]
  },

  // --- PROGRAM 10: HIIT TABATA 20-MIN FAT FURNACE ---
  {
    id: 'hiit_tabata_fat_furnace',
    name: 'HIIT TABATA 20-MIN FAT FURNACE',
    area: 'High Intensity Fat Shred',
    tag: 'Cardio',
    equipment: 'No Equipment',
    targetGoal: 'fat_loss',
    recommendedBodyType: 'Metabolic Shred / Weight Loss',
    compatibilityNote: '20 seconds max effort / 10 seconds rest protocol proven to trigger post-exercise oxygen consumption (EPOC).',
    description: 'Ultra intense 20-minute Tabata intervals burning maximum calories in minimal time.',
    days: [
      {
        dayNumber: 1,
        title: 'DAY 1: TABATA BURPEE & SPRINT MATRIX',
        muscleFocus: 'Full Body Cardiovascular System',
        exercises: [
          { name: 'TABATA BURPEES (20S ON / 10S OFF)', calories: 150, duration: 8, muscleGroup: 'cardio', tag: 'HIIT', equipment: 'None', details: '8 intervals × 20s max effort', defaultSets: 8, targetReps: 20 },
          { name: 'TABATA SPEED MOUNTAIN CLIMBERS', calories: 120, duration: 8, muscleGroup: 'core', tag: 'HIIT', equipment: 'None', details: '8 intervals × 20s fast feet', defaultSets: 8, targetReps: 20 },
          { name: 'TABATA JUMP SQUATS', calories: 140, duration: 8, muscleGroup: 'legs', tag: 'HIIT', equipment: 'None', details: '8 intervals × 20s plyo jumps', defaultSets: 8, targetReps: 20 }
        ]
      }
    ]
  },

  // --- PROGRAM 11: SHADOW NINJA AGILITY & PLYOMETRICS ---
  {
    id: 'ninja_agility_plyometrics',
    name: 'SHADOW NINJA AGILITY & PLYOMETRIC EXPLOSION',
    area: 'Speed & Agility',
    tag: 'Athletic',
    equipment: 'No Equipment',
    targetGoal: 'calisthenics',
    recommendedBodyType: 'Athletic / Lean Build',
    compatibilityNote: 'Enhances nervous system fast-twitch fibers, lateral agility, and vertical jump power.',
    description: 'Dynamic agility and vertical power routine combining lateral bounds, skater hops, and depth jumps.',
    days: [
      {
        dayNumber: 1,
        title: 'DAY 1: LATERAL SPEED & VERTICAL POWER',
        muscleFocus: 'Fast-Twitch Leg Fibers & Agility',
        exercises: [
          { name: 'SKATER BOUND HOPS', calories: 130, duration: 10, muscleGroup: 'legs', tag: 'Agility', equipment: 'None', details: '4 sets × 16 explosive side hops', defaultSets: 4, targetReps: 16 },
          { name: 'BROAD JUMP TO BACKPEDAL', calories: 150, duration: 10, muscleGroup: 'legs', tag: 'Plyo', equipment: 'None', details: '4 sets × 8 max distance leaps', defaultSets: 4, targetReps: 8 },
          { name: 'SINGLE-LEG HOP STABILITY', calories: 100, duration: 8, muscleGroup: 'legs', tag: 'Balance', equipment: 'None', details: '3 sets × 10 hops per leg', defaultSets: 3, targetReps: 10 }
        ]
      }
    ]
  },

  // --- PROGRAM 12: POSTERIOR CHAIN & GLUTE POWER SHRED ---
  {
    id: 'posterior_chain_glute_power',
    name: 'POSTERIOR CHAIN & GLUTE POWER SHRED',
    area: 'Lower Body Aesthetics',
    tag: 'Hypertrophy',
    equipment: 'Barbell or Dumbbells',
    targetGoal: 'muscle_gain',
    recommendedBodyType: 'All Body Types',
    compatibilityNote: 'Strengthens hamstrings, glutes, and lower back to correct anterior pelvic tilt.',
    description: 'High-density glute and hamstring focused training plan utilizing hip thrusts and Romanian deadlifts.',
    days: [
      {
        dayNumber: 1,
        title: 'DAY 1: HEAVY HIP THRUSTS & RDLs',
        muscleFocus: 'Gluteus Maximus & Hamstrings',
        exercises: [
          { name: 'BARBELL / DUMBBELL HIP THRUSTS', calories: 210, duration: 15, muscleGroup: 'legs', tag: 'Hypertrophy', equipment: 'Barbell', details: '4 sets × 12 reps (2 second squeeze at peak)', defaultSets: 4, targetReps: 12 },
          { name: 'SINGLE-LEG DUMBBELL RDL', calories: 160, duration: 10, muscleGroup: 'legs', tag: 'Hypertrophy', equipment: 'Dumbbell', details: '3 sets × 10 reps per side', defaultSets: 3, targetReps: 10 },
          { name: 'FROG PUMPS FOR GLUTE BURN', calories: 120, duration: 8, muscleGroup: 'legs', tag: 'Burnout', equipment: 'None', details: '3 sets × 30 rapid reps', defaultSets: 3, targetReps: 30 }
        ]
      }
    ]
  },

  // --- PROGRAM 13: GYMNASTIC RINGS UPPER BODY DOMINANCE ---
  {
    id: 'gymnastic_rings_dominance',
    name: 'GYMNASTIC RINGS UPPER BODY DOMINANCE',
    area: 'Advanced Calisthenics',
    tag: 'Rings',
    equipment: 'Gymnastic Rings',
    targetGoal: 'calisthenics',
    recommendedBodyType: 'Athletic / Relative Strength',
    compatibilityNote: 'Instability of suspension rings recruits stabilizing micro-muscles across shoulders & chest.',
    description: 'Master upper body suspension training with ring dips, ring pushups, and skin-the-cat progressions.',
    days: [
      {
        dayNumber: 1,
        title: 'DAY 1: RING PUSH & DIP STABILITY',
        muscleFocus: 'Chest, Stabilizers & Triceps',
        exercises: [
          { name: 'SUSPENSION RING DIPS', calories: 170, duration: 12, muscleGroup: 'chest', tag: 'Rings', equipment: 'Rings', details: '4 sets × 8 reps (Turn rings out at top)', defaultSets: 4, targetReps: 8 },
          { name: 'RING FLYES / BULGARIAN PUSHUPS', calories: 150, duration: 10, muscleGroup: 'chest', tag: 'Rings', equipment: 'Rings', details: '3 sets × 10 reps', defaultSets: 3, targetReps: 10 },
          { name: 'RING INVERTED ROWS', calories: 140, duration: 10, muscleGroup: 'back', tag: 'Rings', equipment: 'Rings', details: '4 sets × 12 reps', defaultSets: 4, targetReps: 12 }
        ]
      }
    ]
  },

  // --- PROGRAM 14: 6-PACK ABS & OBLIQUE CORE SHREDDER ---
  {
    id: 'core_sixpack_crusher',
    name: '6-PACK ABS & OBLIQUE CORE SHREDDER',
    area: 'Abdominal Sculpting',
    tag: 'Core',
    equipment: 'No Equipment',
    targetGoal: 'fat_loss',
    recommendedBodyType: 'All Body Types',
    compatibilityNote: 'Targets rectus abdominis, transverse abdominis, and obliques for a chiseled midsection.',
    description: '15-minute intense non-stop core circuit targeting upper abs, lower abs, and obliques.',
    days: [
      {
        dayNumber: 1,
        title: 'DAY 1: ABDOMINAL COMPRESSION MATRIX',
        muscleFocus: 'Rectus Abdominis & Obliques',
        exercises: [
          { name: 'HANGING LEG LIFTS / REVERSE CRUNCHES', calories: 110, duration: 8, muscleGroup: 'core', tag: 'Core', equipment: 'None', details: '4 sets × 15 reps', defaultSets: 4, targetReps: 15 },
          { name: 'RUSSIAN TWISTS WITH WEIGHT', calories: 100, duration: 8, muscleGroup: 'core', tag: 'Core', equipment: 'None', details: '4 sets × 20 twists', defaultSets: 4, targetReps: 20 },
          { name: 'BICYCLE CRUNCHES (CONTROLLED)', calories: 90, duration: 8, muscleGroup: 'core', tag: 'Core', equipment: 'None', details: '3 sets × 20 reps', defaultSets: 3, targetReps: 20 },
          { name: 'HOLLOW BODY isometric HOLD', calories: 80, duration: 6, muscleGroup: 'core', tag: 'Core', equipment: 'None', details: '3 sets × 45 seconds', defaultSets: 3, targetReps: 45 }
        ]
      }
    ]
  },

  // --- PROGRAM 15: IRON BODY ISOMETRIC TENSION PROTOCOL ---
  {
    id: 'isometric_iron_body',
    name: 'IRON BODY ISOMETRIC TENSION PROTOCOL',
    area: 'Tendon Strength & Isometrics',
    tag: 'Tendon Strength',
    equipment: 'No Equipment',
    targetGoal: 'joint_care',
    recommendedBodyType: 'All Fitness Levels / Joint Recovery',
    compatibilityNote: 'Isometric muscle contraction increases tendon stiffness without destructive eccentric damage.',
    description: 'Static hold holds designed to build iron tendon density, mental grit, and joint durability.',
    days: [
      {
        dayNumber: 1,
        title: 'DAY 1: FULL BODY ISOMETRIC HOLD',
        muscleFocus: 'Tendon Stiffness & Core',
        exercises: [
          { name: 'PARALLEL SQUAT WALL SIT HOLD', calories: 90, duration: 8, muscleGroup: 'legs', tag: 'Isometric', equipment: 'None', details: '4 sets × 60s hold', defaultSets: 4, targetReps: 60 },
          { name: 'PUSHUP BOTTOM POSITION ISOMETRIC HOLD', calories: 100, duration: 8, muscleGroup: 'chest', tag: 'Isometric', equipment: 'None', details: '3 sets × 30s hold 2 inches off floor', defaultSets: 3, targetReps: 30 },
          { name: 'SUPERMAN LAT TENSION HOLD', calories: 80, duration: 6, muscleGroup: 'back', tag: 'Isometric', equipment: 'None', details: '3 sets × 45s prone hold', defaultSets: 3, targetReps: 45 }
        ]
      }
    ]
  },

  // --- PROGRAM 16: DUMBBELL ONLY UPPER/LOWER 4-DAY SPLIT ---
  {
    id: 'dumbbell_upper_lower_split',
    name: 'DUMBBELL ONLY UPPER/LOWER 4-DAY SPLIT',
    area: 'Home Gym Hypertrophy',
    tag: 'Dumbbell',
    equipment: 'Dumbbells',
    targetGoal: 'muscle_gain',
    recommendedBodyType: 'All Body Types / Home Gym Users',
    compatibilityNote: 'Hypertrophy system engineered requiring only a pair of adjustable dumbbells.',
    description: 'Complete 4-day upper/lower muscle mass builder requiring only a set of dumbbells.',
    days: [
      {
        dayNumber: 1,
        title: 'DAY 1: UPPER BODY DUMBBELL POWER',
        muscleFocus: 'Chest, Back, Shoulders & Arms',
        exercises: [
          { name: 'DUMBBELL FLOOR / BENCH PRESS', calories: 200, duration: 12, muscleGroup: 'chest', tag: 'Hypertrophy', equipment: 'Dumbbell', details: '4 sets × 10 reps', defaultSets: 4, targetReps: 10 },
          { name: 'SEATED DUMBBELL ROWS', calories: 180, duration: 12, muscleGroup: 'back', tag: 'Hypertrophy', equipment: 'Dumbbell', details: '4 sets × 10 reps', defaultSets: 4, targetReps: 10 },
          { name: 'DUMBBELL SHOULDER PRESS', calories: 150, duration: 10, muscleGroup: 'shoulders', tag: 'Hypertrophy', equipment: 'Dumbbell', details: '3 sets × 10 reps', defaultSets: 3, targetReps: 10 }
        ]
      }
    ]
  },

  // --- PROGRAM 17: HYBRID ATHLETE: RUNNING & BARBELL METCON ---
  {
    id: 'hybrid_runner_barbell_metcon',
    name: 'HYBRID ATHLETE: RUNNING & BARBELL METCON',
    area: 'Hybrid Fitness',
    tag: 'Hybrid',
    equipment: 'Barbell & Running Shoes',
    targetGoal: 'fat_loss',
    recommendedBodyType: 'Endurance & Strength Hybrid',
    compatibilityNote: 'Combines 5K pace endurance with barbell thrusters for maximum cardiovascular output.',
    description: 'Engineered for hybrid athletes who want to run fast 5Ks while maintaining heavy strength.',
    days: [
      {
        dayNumber: 1,
        title: 'DAY 1: BARBELL METCON & 3KM TEMPO',
        muscleFocus: 'Cardio, Quads & Upper Press',
        exercises: [
          { name: 'BARBELL THRUSTERS LIGHT/MED', calories: 240, duration: 12, muscleGroup: 'legs', tag: 'Metcon', equipment: 'Barbell', details: '4 sets × 15 reps continuous', defaultSets: 4, targetReps: 15 },
          { name: '3KM OUTDOOR TEMPO RUN', calories: 300, duration: 18, muscleGroup: 'cardio', tag: 'Running', equipment: 'Shoes', details: 'Target pace under 5:30/km', defaultSets: 1, targetReps: 18 }
        ]
      }
    ]
  },

  // --- PROGRAM 18: GRAPPLER ANATOMY: FOREARMS & GRIP STRENGTH ---
  {
    id: 'grappler_grip_armageddon',
    name: 'GRAPPLER ANATOMY: FOREARMS & GRIP STRENGTH',
    area: 'Combat Grip Strength',
    tag: 'Grip',
    equipment: 'Dumbbells / Towel',
    targetGoal: 'strength',
    recommendedBodyType: 'Martial Artists / Grapplers',
    compatibilityNote: 'Unbreakable grip strength, crushing wrist curls, and thick forearm hypertrophy.',
    description: 'Dedicated grip & forearm conditioning system for Jiu-Jitsu, wrestling, and heavy deadlifters.',
    days: [
      {
        dayNumber: 1,
        title: 'DAY 1: FOREARM FLEXORS & CRUSHING GRIP',
        muscleFocus: 'Wrist Flexors, Brachioradialis & Grip',
        exercises: [
          { name: 'TOWEL PULL-UP HANGS', calories: 120, duration: 8, muscleGroup: 'back', tag: 'Grip', equipment: 'Towel', details: '4 sets × 45s towel hold', defaultSets: 4, targetReps: 45 },
          { name: 'DUMBBELL WRIST CURLS OVER BENCH', calories: 100, duration: 8, muscleGroup: 'arms', tag: 'Isolation', equipment: 'Dumbbell', details: '4 sets × 15 reps', defaultSets: 4, targetReps: 15 },
          { name: 'REVERSE BARBELL BICEP CURLS', calories: 110, duration: 8, muscleGroup: 'arms', tag: 'Hypertrophy', equipment: 'Barbell', details: '4 sets × 12 reps (Brachioradialis focus)', defaultSets: 4, targetReps: 12 }
        ]
      }
    ]
  },

  // --- PROGRAM 19: DESKBOUND POSTURE & SCIATICA RELIEF ---
  {
    id: 'deskbound_posture_sciatica',
    name: 'DESKBOUND POSTURE & SCIATICA RELIEF',
    area: 'Ergonomic Health',
    tag: 'Posture',
    equipment: 'No Equipment',
    targetGoal: 'joint_care',
    recommendedBodyType: 'Desk Workers / Sciatica Prevention',
    compatibilityNote: 'Fixes rounded shoulders (upper cross syndrome) and tight hip flexors from sitting.',
    description: '10-minute daily posture corrector releasing nerve compression and restoring erect spine alignment.',
    days: [
      {
        dayNumber: 1,
        title: 'DAY 1: THORACIC EXTENSION & PIRIFORMIS STRETCH',
        muscleFocus: 'Upper Back, Gluteus & Neck',
        exercises: [
          { name: 'WALL SLIDES FOR UPPER BACK', calories: 50, duration: 6, muscleGroup: 'back', tag: 'Posture', equipment: 'None', details: '3 sets × 12 strict reps against wall', defaultSets: 3, targetReps: 12 },
          { name: 'PIRIFORMIS SEATED FIGURE-4 STRETCH', calories: 40, duration: 6, muscleGroup: 'legs', tag: 'Sciatica', equipment: 'None', details: '3 sets × 45s hold per side', defaultSets: 3, targetReps: 45 },
          { name: 'CHIN TUCKS FOR NECK ALIGNMENT', calories: 30, duration: 4, muscleGroup: 'shoulders', tag: 'Posture', equipment: 'None', details: '3 sets × 15 gentle holds', defaultSets: 3, targetReps: 15 }
        ]
      }
    ]
  },

  // --- PROGRAM 20: 3D PECTORAL PUMP & TRICEP DESTROYER ---
  {
    id: 'pectoral_pump_tricep_destroyer',
    name: '3D PECTORAL PUMP & TRICEP DESTROYER',
    area: 'Chest & Arm Hypertrophy',
    tag: 'Chest & Arms',
    equipment: 'Dumbbells & Cables or Bench',
    targetGoal: 'muscle_gain',
    recommendedBodyType: 'All Body Types',
    compatibilityNote: 'Specialized upper chest incline focus paired with tricep long head isolation.',
    description: 'Focused chest and arm session designed for maximum blood flow and upper chest shelf volume.',
    days: [
      {
        dayNumber: 1,
        title: 'DAY 1: INCLINE CHEST & TRICEP LONG HEAD',
        muscleFocus: 'Upper Pectorals & Triceps',
        exercises: [
          { name: 'INCLINE DUMBBELL CHEST PRESS', calories: 200, duration: 12, muscleGroup: 'chest', tag: 'Hypertrophy', equipment: 'Dumbbell', details: '4 sets × 10 reps', defaultSets: 4, targetReps: 10 },
          { name: 'LOW TO HIGH CABLE FLYES', calories: 140, duration: 10, muscleGroup: 'chest', tag: 'Hypertrophy', equipment: 'Cable', details: '4 sets × 12 reps (Upper chest squeeze)', defaultSets: 4, targetReps: 12 },
          { name: 'OVERHEAD DUMBBELL TRICEP EXTENSION', calories: 130, duration: 10, muscleGroup: 'arms', tag: 'Hypertrophy', equipment: 'Dumbbell', details: '4 sets × 12 reps', defaultSets: 4, targetReps: 12 },
          { name: 'DIPS ON PARALLEL BARS', calories: 160, duration: 10, muscleGroup: 'chest', tag: 'Hypertrophy', equipment: 'Bars', details: '3 sets × 12 reps lean forward', defaultSets: 3, targetReps: 12 }
        ]
      }
    ]
  }
];
