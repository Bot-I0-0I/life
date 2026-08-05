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
  // Enhanced execution & form guidance fields
  executionSteps?: string[];
  formTips?: string[];
  commonMistakes?: string[];
  targetMuscles?: string[];
  tempo?: string;
  restTime?: string;
  category?: 'Warm-Up' | 'Primary Compound' | 'Accessory' | 'Finisher' | 'Mobility';
  regressionTip?: string;
  progressionTip?: string;
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
  equipment: string; // 'No Equipment' | 'Dumbbells' | 'Barbell / Dumbbell / Gym' | 'Low Impact / Machines / Bands'
  targetGoal: 'fat_loss' | 'muscle_gain' | 'strength' | 'calisthenics' | 'joint_care';
  recommendedBodyType: string;
  compatibilityNote: string;
  description: string;
  durationWeeks?: number; // 4 or 8 weeks
  daysPerWeek?: number;
  days: WorkoutDayItem[];
}

// Master execution guide dictionary for step-by-step form instructions & smart coaching
export const MASTER_EXERCISE_GUIDES: Record<string, {
  executionSteps: string[];
  formTips: string[];
  commonMistakes: string[];
  targetMuscles: string[];
  tempo: string;
  restTime: string;
  category: 'Warm-Up' | 'Primary Compound' | 'Accessory' | 'Finisher' | 'Mobility';
  regressionTip: string;
  progressionTip: string;
}> = {
  'STANDARD FLOOR PUSHUPS': {
    executionSteps: [
      '1. Setup: Place hands on floor slightly wider than shoulder-width, palms flat.',
      '2. Core Lock: Engage glutes and brace abdominal wall in a rigid plank.',
      '3. Controlled Descent: Inhale and lower chest to 1-2 inches off floor with elbows at 45°.',
      '4. Explosive Press: Exhale and press through palms back to arm lockout.'
    ],
    formTips: ['Keep glutes tight to prevent lower back sagging.', 'Stare at a spot 6 inches ahead to keep neck neutral.'],
    commonMistakes: ['Flaring elbows outward at 90° angle.', 'Sagging hips or touching chin before chest.'],
    targetMuscles: ['Chest (Pectoralis Major)', 'Anterior Deltoids', 'Triceps Brachii', 'Core'],
    tempo: '2s down - 1s pause - 1s up',
    restTime: '60-90 seconds',
    category: 'Primary Compound',
    regressionTip: 'Perform with knees on floor or hands elevated on a sturdy chair.',
    progressionTip: 'Elevate feet on chair (Decline Pushups) or pause 2 seconds at bottom.'
  },
  'DIAMOND TRICEP PUSHUPS': {
    executionSteps: [
      '1. Setup: Place hands together under chest forming a diamond shape with thumbs and index fingers.',
      '2. Descent: Lower chest towards hands while keeping elbows tucked close to ribcage.',
      '3. Press: Drive through palms, extending elbows to contract triceps at top.'
    ],
    formTips: ['Keep elbows tucked right beside ribs to isolate tricep lateral heads.'],
    commonMistakes: ['Flaring elbows wide outward.', 'Arching lower back.'],
    targetMuscles: ['Triceps Brachii', 'Inner Chest', 'Anterior Deltoid'],
    tempo: '2s down - 1s pause - 1s up',
    restTime: '60 seconds',
    category: 'Accessory',
    regressionTip: 'Perform on knees or separate hands 4-6 inches apart.',
    progressionTip: 'Elevate feet onto a chair or raise one leg in mid-air.'
  },
  'PIKE PUSHUPS (SHOULDER PRESS)': {
    executionSteps: [
      '1. Setup: Begin in pushup stance, walk feet forward while lifting hips high into inverted V-shape.',
      '2. Tripod Descent: Lower forehead diagonally forward towards floor ahead of hands.',
      '3. Press: Push back diagonally up through shoulders to return to inverted V stance.'
    ],
    formTips: ['Look back towards your feet at top to protect neck.', 'Rise onto toes to load deltoids.'],
    commonMistakes: ['Bending knees excessively.', 'Lowering head straight down between hands.'],
    targetMuscles: ['Anterior & Lateral Deltoids', 'Upper Chest', 'Triceps'],
    tempo: '2s down - 1s pause - 1s up',
    restTime: '60-90 seconds',
    category: 'Primary Compound',
    regressionTip: 'Bend knees slightly or move hands further forward.',
    progressionTip: 'Elevate feet on a chair to increase vertical load.'
  },
  'EXPLOSIVE AIR SQUATS': {
    executionSteps: [
      '1. Stance: Stand with feet shoulder-width apart, toes turned slightly out.',
      '2. Hinge & Sit: Push hips back and bend knees until thigh crease drops below top of knees.',
      '3. Stand & Squeeze: Drive through mid-foot and heels to stand up, squeezing glutes at top.'
    ],
    formTips: ['Keep chest up and gaze straight ahead.', 'Knees must track in direction of toes.'],
    commonMistakes: ['Heels lifting off floor.', 'Knees collapsing inward.'],
    targetMuscles: ['Quadriceps', 'Gluteus Maximus', 'Hamstrings', 'Calves'],
    tempo: '2s down - 1s hold - 1s explosive up',
    restTime: '60 seconds',
    category: 'Primary Compound',
    regressionTip: 'Perform sit-to-stand squats onto a chair.',
    progressionTip: 'Add 3-second pause at bottom depth or convert to Jump Squats.'
  },
  'PLYOMETRIC JUMP LUNGES': {
    executionSteps: [
      '1. Setup: Step into a lunge with both knees bent at 90°.',
      '2. Jump Explosively: Drive off floor with both feet, swinging arms for momentum.',
      '3. Mid-Air Switch: Switch leg positions in air, landing softly into lunge on opposite side.'
    ],
    formTips: ['Land smoothly on mid-foot to absorb impact.', 'Keep torso upright.'],
    commonMistakes: ['Banging back knee on floor.', 'Leaning torso far forward.'],
    targetMuscles: ['Quadriceps', 'Hamstrings', 'Glutes', 'Calves'],
    tempo: 'Explosive continuous jumps',
    restTime: '60-90 seconds',
    category: 'Primary Compound',
    regressionTip: 'Replace jumps with rapid non-jumping reverse lunges.',
    progressionTip: 'Increase jump height or pause 1s in bottom lunge before jumping.'
  },
  'ISOMETRIC WALL SITS': {
    executionSteps: [
      '1. Setup: Lean back flat against wall, slide down until knees are bent at 90°.',
      '2. Alignment: Thighs parallel to floor, shins vertical over ankles.',
      '3. Hold: Keep lower back pressed into wall, hands off legs, breathing steadily.'
    ],
    formTips: ['Press lower back flush against wall.', 'Rest hands on chest or at sides.'],
    commonMistakes: ['Sliding too high above 90°.', 'Resting hands on knees.'],
    targetMuscles: ['Quadriceps', 'Gluteus Medius', 'Core'],
    tempo: 'Static hold',
    restTime: '45-60 seconds',
    category: 'Accessory',
    regressionTip: 'Slide up to 100-110° knee angle.',
    progressionTip: 'Perform single-leg wall sit alternating every 15s.'
  },
  'CHAIR / BENCH TRICEP DIPS': {
    executionSteps: [
      '1. Setup: Sit on edge of sturdy chair, place palms beside hips, extend legs forward.',
      '2. Descent: Slide hips off edge, lower body vertically until upper arms are parallel to floor.',
      '3. Press: Push through palms to lock out arms and contract triceps.'
    ],
    formTips: ['Keep spine close to chair edge throughout movement.', 'Do not dip below 90° elbow bend.'],
    commonMistakes: ['Drifting body far forward away from bench.', 'Shrugging shoulders up.'],
    targetMuscles: ['Triceps Brachii', 'Lower Pectorals', 'Anterior Deltoids'],
    tempo: '2s down - 1s pause - 1s up',
    restTime: '60 seconds',
    category: 'Accessory',
    regressionTip: 'Bend knees at 90° with feet flat on floor.',
    progressionTip: 'Elevate feet on a second chair.'
  },
  'HOLLOW BODY COMPRESSION HOLDS': {
    executionSteps: [
      '1. Setup: Lie face up with legs straight and arms extended overhead.',
      '2. Engage: Press lower back flat into mat, lift shoulder blades and feet 4-6 inches off floor.',
      '3. Hold: Hold banana-like curved body shape while breathing steadily.'
    ],
    formTips: ['Press belly button down into floor.', 'If back arches, lift legs higher.'],
    commonMistakes: ['Arching lumbar spine off floor.', 'Tucking chin into chest excessively.'],
    targetMuscles: ['Rectus Abdominis', 'Transverse Abdominis', 'Hip Flexors'],
    tempo: 'Static hold',
    restTime: '45 seconds',
    category: 'Finisher',
    regressionTip: 'Tuck knees to chest or extend arms beside thighs.',
    progressionTip: 'Add gentle hollow body rocking back and forth.'
  },
  'RAPID MOUNTAIN CLIMBERS': {
    executionSteps: [
      '1. Setup: High plank position with wrists under shoulders and body straight.',
      '2. Knee Drive: Drive right knee toward chest without letting hips bounce.',
      '3. Rapid Switch: Extend right leg back while driving left knee to chest in running tempo.'
    ],
    formTips: ['Keep shoulders directly over hands.', 'Maintain constant core tension.'],
    commonMistakes: ['Piking hips up high.', 'Sagging lower back.'],
    targetMuscles: ['Core', 'Hip Flexors', 'Shoulder Girdle', 'Cardio'],
    tempo: 'Rapid high frequency',
    restTime: '45-60 seconds',
    category: 'Finisher',
    regressionTip: 'Perform slow controlled step-ins without jumping.',
    progressionTip: 'Drive knees cross-body toward opposite elbow.'
  },
  'FULL BODY BURPEE SPRINTS': {
    executionSteps: [
      '1. Setup: Stand tall with feet hip-width apart.',
      '2. Drop: Bend knees, plant hands on floor, kick feet back into plank.',
      '3. Pushup & Hop: Lower chest to floor, push up, jump feet to hands, launch overhead with clap.'
    ],
    formTips: ['Pace yourself smoothly.', 'Land softly on mid-foot.'],
    commonMistakes: ['Sagging back during plank kick.', 'Skipping overhead jump.'],
    targetMuscles: ['Full Body', 'Quadriceps', 'Chest', 'Core', 'Cardio'],
    tempo: 'Fluid explosive motion',
    restTime: '60-90 seconds',
    category: 'Finisher',
    regressionTip: 'Step feet back one at a time without chest-to-floor pushup.',
    progressionTip: 'Perform tuck-jump at peak or double pushup at bottom.'
  },
  'DOORWAY BODYWEIGHT ROWS': {
    executionSteps: [
      '1. Setup: Stand inside doorway, grip both sides of doorframe at chest height.',
      '2. Lean Back: Extend arms, lean back so body hangs at 45° angle.',
      '3. Pull & Squeeze: Pull chest forward between frame by driving elbows back.',
      '4. Lower: Return under 2-3s control back to hang.'
    ],
    formTips: ['Keep body straight from head to heels.', 'Squeeze shoulder blades 1s at top.'],
    commonMistakes: ['Bending at hips or sagging glutes.', 'Pulling with wrists instead of back.'],
    targetMuscles: ['Latissimus Dorsi', 'Rhomboids', 'Rear Deltoids', 'Biceps'],
    tempo: '2s down - 1s pause - 1s up',
    restTime: '60 seconds',
    category: 'Primary Compound',
    regressionTip: 'Walk feet backward to stand more upright.',
    progressionTip: 'Walk feet further forward to steepen body angle.'
  },
  'DUMBBELL GOBLET SQUATS': {
    executionSteps: [
      '1. Setup: Hold single dumbbell vertically against chest with both hands under bell top.',
      '2. Stance: Feet shoulder-width apart, toes turned out 15-30°.',
      '3. Squat: Inhale, push hips back and lower until thighs pass parallel.',
      '4. Stand: Drive through mid-foot to stand, squeezing glutes at top.'
    ],
    formTips: ['Keep chest up and elbows tucked inside knees at bottom.', 'Brace core before lowering.'],
    commonMistakes: ['Rounding lower back.', 'Letting dumbbell pull torso forward.'],
    targetMuscles: ['Quadriceps', 'Gluteus Maximus', 'Core', 'Upper Back'],
    tempo: '3s down - 1s pause - 1s up',
    restTime: '60-90 seconds',
    category: 'Primary Compound',
    regressionTip: 'Use lighter weight or perform bodyweight air squats.',
    progressionTip: 'Increase dumbbell weight or pause 2s at bottom.'
  },
  'DUMBBELL BENCH PRESS': {
    executionSteps: [
      '1. Setup: Lie on bench holding dumbbells at chest width with palms facing forward.',
      '2. Press: Exhale, drive dumbbells straight up over mid-chest until arms lock out.',
      '3. Lower: Inhale, lower dumbbells under 3s control until upper arms are parallel to floor.'
    ],
    formTips: ['Squeeze shoulder blades together into bench.', 'Keep elbows angled at 45° to torso.'],
    commonMistakes: ['Flaring elbows out at 90°.', 'Bouncing weight at bottom.'],
    targetMuscles: ['Pectoralis Major', 'Anterior Deltoids', 'Triceps'],
    tempo: '3s down - 1s pause - 1s up',
    restTime: '90 seconds',
    category: 'Primary Compound',
    regressionTip: 'Perform Dumbbell Floor Press on mat.',
    progressionTip: 'Increase dumbbell weight or pause 2s at bottom chest stretch.'
  },
  'DUMBBELL ROMANIAN DEADLIFTS': {
    executionSteps: [
      '1. Setup: Stand holding dumbbells in front of thighs with shoulder-width stance.',
      '2. Hinge: Softly bend knees, push hips backward hinging at waist while lowering dumbbells along shins.',
      '3. Stretch & Drive: Lower until deep hamstring stretch (mid-shin), then drive hips forward to stand tall.'
    ],
    formTips: ['Keep back completely flat.', 'Imagine pushing hips back to touch a wall behind you.'],
    commonMistakes: ['Rounding spine.', 'Squatting down instead of hinging hips back.'],
    targetMuscles: ['Hamstrings', 'Gluteus Maximus', 'Erector Spinae', 'Grip'],
    tempo: '3s down - 1s stretch - 1s drive up',
    restTime: '90 seconds',
    category: 'Primary Compound',
    regressionTip: 'Lower dumbbells only to knee level.',
    progressionTip: 'Increase dumbbell weight or slow down descent to 4 seconds.'
  },
  'DUMBBELL BENT-OVER ROWS': {
    executionSteps: [
      '1. Setup: Bend knees slightly, hinge forward at hips until torso is 45° to floor, holding dumbbells hanging down.',
      '2. Pull: Drive elbows up and back towards hip crease, squeezing lats and rhomboids.',
      '3. Lower: Lower under 2-3s control to full arm extension.'
    ],
    formTips: ['Keep spine neutral and neck aligned with spine.', 'Squeeze shoulder blades at peak.'],
    commonMistakes: ['Using torso momentum to jerk weights up.', 'Rounding lower back.'],
    targetMuscles: ['Latissimus Dorsi', 'Rhomboids', 'Rear Deltoids', 'Biceps'],
    tempo: '2s down - 1s squeeze - 1s up',
    restTime: '60-90 seconds',
    category: 'Primary Compound',
    regressionTip: 'Support one hand on a bench (Single-Arm Dumbbell Row).',
    progressionTip: 'Increase dumbbell weight or hold 2s squeeze at top.'
  },
  'DUMBBELL OVERHEAD SHOULDER PRESS': {
    executionSteps: [
      '1. Setup: Seated or standing, hold dumbbells at ear level with palms facing forward or neutral.',
      '2. Press: Exhale, press dumbbells overhead in smooth arc until arms lock out over shoulders.',
      '3. Lower: Inhale, lower under control back to ear level.'
    ],
    formTips: ['Brace core hard to prevent arching lower back.', 'Do not bang dumbbells together at top.'],
    commonMistakes: ['Arching lower back excessively.', 'Shortening bottom range of motion.'],
    targetMuscles: ['Anterior & Lateral Deltoids', 'Triceps Brachii', 'Upper Traps'],
    tempo: '2s down - 1s pause - 1s up',
    restTime: '60-90 seconds',
    category: 'Primary Compound',
    regressionTip: 'Seated supported shoulder press.',
    progressionTip: 'Standing single-arm alternating press.'
  },
  'DUMBBELL THRUSTERS (SQUAT-TO-PRESS)': {
    executionSteps: [
      '1. Setup: Stand with dumbbells resting at shoulder height.',
      '2. Front Squat: Lower into a full squat with thighs parallel or lower.',
      '3. Drive & Press: Drive up explosively through legs and use leg momentum to press dumbbells overhead in one fluid movement.'
    ],
    formTips: ['Transfer power smoothly from leg drive into overhead press.', 'Keep core locked at top.'],
    commonMistakes: ['Pressing before completing squat drive.', 'Arching lower back.'],
    targetMuscles: ['Quadriceps', 'Glutes', 'Deltoids', 'Triceps', 'Cardio'],
    tempo: 'Explosive fluid compound',
    restTime: '60-90 seconds',
    category: 'Primary Compound',
    regressionTip: 'Perform separate squats then shoulder presses.',
    progressionTip: 'Increase dumbbell weight or speed up rep pace.'
  },
  'DUMBBELL RENEGADE ROWS': {
    executionSteps: [
      '1. Setup: Assume high plank holding dumbbells on floor under shoulders with wide foot stance.',
      '2. Row: Row right dumbbell up to hip while balancing on left arm and keeping hips square.',
      '3. Switch: Lower right dumbbell to floor, row left dumbbell up to left hip.'
    ],
    formTips: ['Widen feet to stabilize hips.', 'Brace core hard so hips do not twist.'],
    commonMistakes: ['Twisting hips side to side.', 'Piking hips in air.'],
    targetMuscles: ['Lats', 'Core Anti-Rotation', 'Chest', 'Triceps', 'Shoulders'],
    tempo: 'Controlled alternate rowing',
    restTime: '60 seconds',
    category: 'Primary Compound',
    regressionTip: 'Perform renegade rows with knees resting on floor.',
    progressionTip: 'Add pushup between each row rep (Pushup Renegade Row).'
  },
  'DUMBBELL WALKING LUNGES': {
    executionSteps: [
      '1. Setup: Stand tall holding dumbbells at sides.',
      '2. Step Forward: Take a generous step forward, lowering back knee toward floor until both knees are bent at 90°.',
      '3. Drive Through: Push off front heel to step forward into next lunge rep.'
    ],
    formTips: ['Keep chest upright and eyes forward.', 'Ensure front knee does not cave inward.'],
    commonMistakes: ['Banging back knee on floor.', 'Stepping on a tightrope (keep feet hip-width).'],
    targetMuscles: ['Quadriceps', 'Gluteus Maximus', 'Hamstrings', 'Calves', 'Grip'],
    tempo: '2s down - 1s drive up',
    restTime: '60 seconds',
    category: 'Primary Compound',
    regressionTip: 'Perform stationary lunges holding light dumbbells or bodyweight.',
    progressionTip: 'Increase dumbbell weight or perform Bulgarian split squats.'
  },
  'PULLUPS / CHINUPS': {
    executionSteps: [
      '1. Setup: Hang from pullup bar with overhand (pullup) or underhand (chinup) grip.',
      '2. Pull: Drive elbows down toward floor, pulling chest up to bar until chin clears bar.',
      '3. Lower: Lower under 3-second control back to dead hang.'
    ],
    formTips: ['Depress shoulder blades down before initiating pull.', 'Squeeze lats at top.'],
    commonMistakes: ['Kipping or swinging legs.', 'Not lowering to full arm extension.'],
    targetMuscles: ['Latissimus Dorsi', 'Biceps', 'Rhomboids', 'Grip'],
    tempo: '1s up - 1s squeeze - 3s down',
    restTime: '90-120 seconds',
    category: 'Primary Compound',
    regressionTip: 'Use assistance band, door rows, or negative pullups (jump up & 5s lower).',
    progressionTip: 'Add weighted vest or hold dumbbell between feet.'
  },
  'BARBELL BENCH PRESS': {
    executionSteps: [
      '1. Setup: Lie on bench, eyes under bar, grip slightly wider than shoulders.',
      '2. Unrack: Arch upper back, squeeze shoulder blades, unrack bar over chest.',
      '3. Lower & Drive: Lower bar in arc to mid-chest with 45° elbows, press back up.'
    ],
    formTips: ['Plant feet firmly for leg drive.', 'Keep shoulder blades squeezed into bench.'],
    commonMistakes: ['Bouncing bar off chest.', 'Flaring elbows at 90°.'],
    targetMuscles: ['Pectoralis Major', 'Anterior Deltoids', 'Triceps'],
    tempo: '3s down - 1s pause - 1s up',
    restTime: '120 seconds',
    category: 'Primary Compound',
    regressionTip: 'Dumbbell bench press or pushups.',
    progressionTip: 'Increase bar load progressively.'
  },
  'BARBELL BACK SQUATS': {
    executionSteps: [
      '1. Setup: Rest bar on upper traps, unrack and take 2 steps back with shoulder-width stance.',
      '2. Squat: Inhale into belly, push hips back, lower until thigh crease drops below knees.',
      '3. Drive: Exhale, drive through mid-foot to stand up tall.'
    ],
    formTips: ['Keep chest up and knees tracking over toes.', 'Brace core with deep belly breath.'],
    commonMistakes: ['Rounding lower back.', 'Knees caving inward.'],
    targetMuscles: ['Quadriceps', 'Gluteus Maximus', 'Hamstrings', 'Core'],
    tempo: '3s down - 1s pause - 1s up',
    restTime: '120-180 seconds',
    category: 'Primary Compound',
    regressionTip: 'Goblet squats with dumbbell or bodyweight air squats.',
    progressionTip: 'Increase bar load progressively.'
  },
  'BARBELL DEADLIFT': {
    executionSteps: [
      '1. Setup: Stand with shins 1 inch from bar, feet hip-width. Hinge hips to grip bar.',
      '2. Tension: Pull chest up, flatten back, pull slack out of bar.',
      '3. Drive: Push floor away with legs until bar clears knees, drive hips forward to lockout.'
    ],
    formTips: ['Keep bar sliding along shins and thighs.', 'Squeeze glutes at lockout, do not lean back.'],
    commonMistakes: ['Rounding lumbar spine.', 'Jerking bar off floor without pulling slack.'],
    targetMuscles: ['Hamstrings', 'Glutes', 'Erector Spinae', 'Lats', 'Grip'],
    tempo: 'Explosive up - 2s controlled down',
    restTime: '120-180 seconds',
    category: 'Primary Compound',
    regressionTip: 'Dumbbell Romanian Deadlifts or Trap Bar Deadlift.',
    progressionTip: 'Increase bar load progressively.'
  },
  'RESISTANCE BAND SHOULDER DISLOCATES': {
    executionSteps: [
      '1. Setup: Stand holding resistance band wide overhead with palms down.',
      '2. Arc Back: Keep arms straight, rotate band slowly overhead and back behind hips.',
      '3. Return: Reverse arc smoothly back over head to front.'
    ],
    formTips: ['Keep elbows straight throughout arc.', 'Widen grip on band if tight.'],
    commonMistakes: ['Bending elbows to force band back.', 'Arching lower back.'],
    targetMuscles: ['Rotator Cuff', 'Anterior Deltoid', 'Chest Stretch', 'Thoracic Spine'],
    tempo: 'Smooth slow mobility rotation',
    restTime: '30 seconds',
    category: 'Mobility',
    regressionTip: 'Widen grip on band or use a broomstick.',
    progressionTip: 'Narrows hands on band slightly for deeper mobility.'
  },
  'THORACIC CAT-COW FLOW': {
    executionSteps: [
      '1. Setup: On hands and knees, wrists under shoulders, knees under hips.',
      '2. Cow: Inhale, drop belly down, lift chest and tailbone.',
      '3. Cat: Exhale, round spine upward, tuck chin and tailbone.'
    ],
    formTips: ['Move fluidly through each segment of spine.'],
    commonMistakes: ['Jerking movements.', 'Holding breath.'],
    targetMuscles: ['Spinal Erectors', 'Core', 'Thoracic Spine'],
    tempo: 'Smooth breath flow',
    restTime: '30 seconds',
    category: 'Warm-Up',
    regressionTip: 'Reduce range of motion.',
    progressionTip: 'Pause 3s at full extension.'
  },
  'WORLD GREATEST LUNGE STRETCH': {
    executionSteps: [
      '1. Setup: Deep lunge with right foot forward, left leg extended straight back.',
      '2. Elbow Drive: Place hands inside right foot, lower right elbow toward ankle.',
      '3. Rotation: Reach right hand up to ceiling, rotating torso.'
    ],
    formTips: ['Keep back leg actively engaged.', 'Breathe deeply through rotation.'],
    commonMistakes: ['Collapsing back knee to floor.'],
    targetMuscles: ['Hip Flexors', 'Hamstrings', 'Thoracic Spine'],
    tempo: 'Dynamic mobility flow',
    restTime: '30 seconds',
    category: 'Warm-Up',
    regressionTip: 'Rest back knee gently on mat.',
    progressionTip: 'Shift hips back into hamstring stretch before rotating.'
  }
};

// Helper function to enrich exercise items with form guidance & smart coaching
export function enrichExercise(ex: ExerciseItem): ExerciseItem {
  const guide = MASTER_EXERCISE_GUIDES[ex.name.toUpperCase()];
  if (guide) {
    return {
      ...ex,
      executionSteps: ex.executionSteps || guide.executionSteps,
      formTips: ex.formTips || guide.formTips,
      commonMistakes: ex.commonMistakes || guide.commonMistakes,
      targetMuscles: ex.targetMuscles || guide.targetMuscles,
      tempo: ex.tempo || guide.tempo,
      restTime: ex.restTime || guide.restTime,
      category: ex.category || guide.category,
      regressionTip: ex.regressionTip || guide.regressionTip,
      progressionTip: ex.progressionTip || guide.progressionTip
    };
  }

  // Generic fallback enrichment
  return {
    ...ex,
    executionSteps: ex.executionSteps || [
      `1. Setup: Position body securely for ${ex.name} with proper spine alignment.`,
      `2. Movement: Perform concentric phase focusing on ${ex.muscleGroup.toUpperCase()} activation.`,
      `3. Peak Contraction: Squeeze targeted muscle group at peak for 1 second.`,
      `4. Lowering: Return under 2-3 second control to starting position.`
    ],
    formTips: ex.formTips || ['Maintain steady breathing.', 'Keep core engaged and avoid momentum.'],
    commonMistakes: ex.commonMistakes || ['Using momentum or fast uncontrolled drop.', 'Shortening range of motion.'],
    targetMuscles: ex.targetMuscles || [ex.muscleGroup.toUpperCase(), 'Core Stabilizers'],
    tempo: ex.tempo || '2s down - 1s pause - 1s up',
    restTime: ex.restTime || '60 seconds',
    category: ex.category || 'Primary Compound',
    regressionTip: ex.regressionTip || 'Lighten weight or reduce range of motion.',
    progressionTip: ex.progressionTip || 'Increase reps or add a 2-second pause at peak contraction.'
  };
}

// Master map of exercise name upper case -> { beginner, intermediate, advanced } difficulty variants
export const EXERCISE_DIFFICULTY_VARIANTS: Record<string, {
  beginner: { earlyWeeks: { name: string; executionSteps: string[]; formTips?: string[]; restTime?: string }; lateWeeks: { name: string; executionSteps: string[]; formTips?: string[]; restTime?: string } };
  intermediate: { earlyWeeks: { name: string; executionSteps: string[]; formTips?: string[]; restTime?: string }; lateWeeks: { name: string; executionSteps: string[]; formTips?: string[]; restTime?: string } };
  advanced: { earlyWeeks: { name: string; executionSteps: string[]; formTips?: string[]; restTime?: string }; lateWeeks: { name: string; executionSteps: string[]; formTips?: string[]; restTime?: string } };
}> = {
  'STANDARD FLOOR PUSHUPS': {
    beginner: {
      earlyWeeks: {
        name: 'WALL / KNEE INCLINE PUSHUPS (BEGINNER ADAPTED)',
        executionSteps: [
          '1. Setup: Place hands against a wall or sturdy elevated bed/chair, or place knees on floor with mat padding.',
          '2. Core Brace: Maintain a straight line from shoulders to hips/knees with glutes tight.',
          '3. Incline Descent: Inhale and lower chest gently toward surface with elbows at 45°.',
          '4. Smooth Press: Exhale and press back to arm lockout.'
        ],
        formTips: ['Keep glutes engaged to prevent lower back arching.', 'Do not allow hips to sag.'],
        restTime: '75-90 seconds'
      },
      lateWeeks: {
        name: 'LOW INCLINE / KNEE PUSHUPS (BEGINNER PROGRESSION)',
        executionSteps: [
          '1. Setup: Knees on floor or hands on a low bench/chair, palms shoulder-width.',
          '2. Descent: Lower chest to 1 inch off surface with 2-second controlled lowering.',
          '3. Press: Drive through palms to full elbow lockout.'
        ],
        formTips: ['Keep spine neutral throughout.'],
        restTime: '60-75 seconds'
      }
    },
    intermediate: {
      earlyWeeks: {
        name: 'STANDARD FLOOR PUSHUPS',
        executionSteps: [
          '1. Setup: Place hands on floor slightly wider than shoulder-width, palms flat.',
          '2. Core Lock: Engage glutes and brace abdominal wall in a rigid plank.',
          '3. Controlled Descent: Inhale and lower chest to 1-2 inches off floor with elbows at 45°.',
          '4. Explosive Press: Exhale and press through palms back to arm lockout.'
        ],
        restTime: '60 seconds'
      },
      lateWeeks: {
        name: 'TEMPO PAUSE FLOOR PUSHUPS',
        executionSteps: [
          '1. Setup: High plank stance on floor.',
          '2. Controlled Lower: Lower chest over 3 seconds to 1 inch off floor.',
          '3. Pause: Hold bottom chest position for 1 full second.',
          '4. Press: Exhale and drive explosively to lockout.'
        ],
        restTime: '45-60 seconds'
      }
    },
    advanced: {
      earlyWeeks: {
        name: 'DECLINE CHAIR PUSHUPS (ADVANCED LOAD)',
        executionSteps: [
          '1. Setup: Place feet elevated on a sturdy chair or bench, hands flat on floor.',
          '2. Descent: Inhale and lower chest to floor with core locked in rigid plank.',
          '3. Press: Drive through palms to press upper body up diagonally.'
        ],
        restTime: '60 seconds'
      },
      lateWeeks: {
        name: 'EXPLOSIVE PLYOMETRIC CLAPPING PUSHUPS',
        executionSteps: [
          '1. Setup: Standard pushup plank stance.',
          '2. Explosive Drive: Lower chest rapidly and press with maximal force to launch hands off floor.',
          '3. Clap & Catch: Perform a rapid hand clap in mid-air and land softly back into pushup position.'
        ],
        restTime: '45-60 seconds'
      }
    }
  },

  'DIAMOND TRICEP PUSHUPS': {
    beginner: {
      earlyWeeks: {
        name: 'INCLINE BENCH TRICEP PUSHUPS (BEGINNER)',
        executionSteps: [
          '1. Setup: Place hands close together on an elevated bench or wall.',
          '2. Lowering: Lower chest toward hands keeping elbows tucked right against ribs.',
          '3. Press: Push through palms focusing on tricep contraction.'
        ],
        restTime: '75-90 seconds'
      },
      lateWeeks: {
        name: 'KNEELING DIAMOND PUSHUPS (BEGINNER PROGRESSION)',
        executionSteps: [
          '1. Setup: Knees on floor, hands forming diamond shape under chest.',
          '2. Lowering: Lower chest toward diamond hands with elbows tucked close.',
          '3. Press: Drive back up to lockout.'
        ],
        restTime: '60 seconds'
      }
    },
    intermediate: {
      earlyWeeks: {
        name: 'DIAMOND TRICEP PUSHUPS',
        executionSteps: [
          '1. Setup: Place hands together under chest forming a diamond shape with thumbs and index fingers.',
          '2. Descent: Lower chest towards hands while keeping elbows tucked close to ribcage.',
          '3. Press: Drive through palms, extending elbows to contract triceps at top.'
        ],
        restTime: '60 seconds'
      },
      lateWeeks: {
        name: 'TEMPO DIAMOND PUSHUPS (PAUSE AT BOTTOM)',
        executionSteps: [
          '1. Setup: Diamond stance on toes.',
          '2. Descent: 3-second slow lowering to diamond hands with 1-second pause at bottom.',
          '3. Press: Explosive lockout focusing on tricep squeeze.'
        ],
        restTime: '45-60 seconds'
      }
    },
    advanced: {
      earlyWeeks: {
        name: 'DECLINE DIAMOND TRICEP PUSHUPS',
        executionSteps: [
          '1. Setup: Elevate feet on a chair, hands in diamond shape under chest.',
          '2. Lowering & Press: Lower chest to hands with full control, press up explosively.'
        ],
        restTime: '60 seconds'
      },
      lateWeeks: {
        name: 'ARCHER TRICEP PUSHUPS',
        executionSteps: [
          '1. Setup: Wide stance with weight shifted primarily onto one tricep/arm.',
          '2. Press: Press body up through working arm.'
        ],
        restTime: '45-60 seconds'
      }
    }
  },

  'PIKE PUSHUPS (SHOULDER PRESS)': {
    beginner: {
      earlyWeeks: {
        name: 'INCLINE HIGH PLANK SHOULDER TAPS (BEGINNER)',
        executionSteps: [
          '1. Setup: Hands elevated on chair or bed in high plank stance.',
          '2. Shoulder Tap: Alternately lift right hand to tap left shoulder, then left hand to right shoulder while bracing core.'
        ],
        restTime: '75 seconds'
      },
      lateWeeks: {
        name: 'MODIFIED SHORT PIKE HOLD & PRESS (BEGINNER)',
        executionSteps: [
          '1. Setup: Feet wide, hips lifted slightly in high pike stance.',
          '2. Micro Press: Lower forehead 2-3 inches diagonally forward and press back up.'
        ],
        restTime: '60 seconds'
      }
    },
    intermediate: {
      earlyWeeks: {
        name: 'PIKE PUSHUPS (SHOULDER PRESS)',
        executionSteps: [
          '1. Setup: Inverted V-shape with hips high.',
          '2. Tripod Descent: Lower forehead diagonally forward toward floor.',
          '3. Press: Push diagonally back to inverted V.'
        ],
        restTime: '60-70 seconds'
      },
      lateWeeks: {
        name: 'PAUSE PIKE PUSHUPS',
        executionSteps: [
          '1. Setup: High inverted V stance.',
          '2. Pause: Lower forehead 1 inch off floor and hold for 1.5 seconds before driving overhead.'
        ],
        restTime: '45-60 seconds'
      }
    },
    advanced: {
      earlyWeeks: {
        name: 'FEET-ELEVATED PIKE PUSHUPS',
        executionSteps: [
          '1. Setup: Elevate feet on chair, hips stacked over shoulders.',
          '2. Press: Lower forehead diagonally and press up vertically.'
        ],
        restTime: '60 seconds'
      },
      lateWeeks: {
        name: 'WALL HANDSTAND HOLD / WALK-UPS',
        executionSteps: [
          '1. Setup: Walk feet up wall into partial or full handstand hold against wall.',
          '2. Hold/Press: Maintain rigid shoulder lockout for full set duration.'
        ],
        restTime: '45-60 seconds'
      }
    }
  },

  'EXPLOSIVE AIR SQUATS': {
    beginner: {
      earlyWeeks: {
        name: 'CHAIR SIT-TO-STAND SQUATS (BEGINNER ADAPTED)',
        executionSteps: [
          '1. Setup: Stand 2 inches in front of a sturdy chair with feet shoulder-width.',
          '2. Sit Back: Inhale, hinge hips back and gently lower glutes onto chair seat.',
          '3. Stand Up: Exhale, drive through mid-foot to stand back up tall without using hands.'
        ],
        formTips: ['Keep chest lifted and knees tracking over toes.', 'Do not plop onto chair; control descent.'],
        restTime: '75-90 seconds'
      },
      lateWeeks: {
        name: 'CONTROLLED BODYWEIGHT SQUATS (BEGINNER PROGRESSION)',
        executionSteps: [
          '1. Setup: Stand with feet shoulder-width apart.',
          '2. Squat: Lower hips until thighs are parallel to floor.',
          '3. Drive: Press through heels to stand tall.'
        ],
        restTime: '60 seconds'
      }
    },
    intermediate: {
      earlyWeeks: {
        name: 'STANDARD BODYWEIGHT AIR SQUATS',
        executionSteps: [
          '1. Setup: Stand with feet shoulder-width apart, toes turned slightly out.',
          '2. Hinge & Sit: Push hips back and lower until thigh crease passes knee line.',
          '3. Stand: Drive through heels to stand up, squeezing glutes at top.'
        ],
        restTime: '60 seconds'
      },
      lateWeeks: {
        name: 'TEMPO PAUSE AIR SQUATS (2S BOTTOM HOLD)',
        executionSteps: [
          '1. Setup: Shoulder-width stance.',
          '2. Lower & Hold: Lower into deep squat, hold bottom depth for 2 full seconds.',
          '3. Stand: Drive up explosively.'
        ],
        restTime: '45-60 seconds'
      }
    },
    advanced: {
      earlyWeeks: {
        name: 'EXPLOSIVE AIR SQUATS',
        executionSteps: [
          '1. Setup: Stand shoulder-width apart.',
          '2. Squat & Launch: Lower to parallel and drive up with maximal speed.',
          '3. Squeeze: Lock out glutes at peak.'
        ],
        restTime: '60 seconds'
      },
      lateWeeks: {
        name: 'PLYOMETRIC JUMP SQUATS / BULGARIAN SPLIT SQUATS',
        executionSteps: [
          '1. Setup: Dip into squat stance and explode upward launching 3-6 inches off floor.',
          '2. Landing: Land smoothly on balls of feet absorbing impact into next rep.'
        ],
        restTime: '45-60 seconds'
      }
    }
  },

  'PLYOMETRIC JUMP LUNGES': {
    beginner: {
      earlyWeeks: {
        name: 'SUPPORTED REVERSE LUNGES (BEGINNER)',
        executionSteps: [
          '1. Setup: Stand beside a wall or sturdy chair, placing one hand gently on it for balance.',
          '2. Step Back: Take a generous step backward with right leg, lowering back knee toward floor.',
          '3. Drive Up: Press through front heel to step forward to standing stance.'
        ],
        restTime: '75 seconds'
      },
      lateWeeks: {
        name: 'ALTERNATING STATIONARY LUNGES (BEGINNER PROGRESSION)',
        executionSteps: [
          '1. Setup: Stand tall with hands on hips.',
          '2. Lunge: Step forward alternating legs, bending both knees to 90°.',
          '3. Return: Push back to starting position.'
        ],
        restTime: '60 seconds'
      }
    },
    intermediate: {
      earlyWeeks: {
        name: 'ALTERNATING STEPPING LUNGES',
        executionSteps: [
          '1. Setup: Stand tall with feet hip-width.',
          '2. Step Forward: Step forward into a deep lunge with back knee 1 inch off floor.',
          '3. Drive: Push off front foot back to start.'
        ],
        restTime: '60 seconds'
      },
      lateWeeks: {
        name: 'EXPANDED SPEED STEPPING LUNGES',
        executionSteps: [
          '1. Continuous fluid stepping lunges maintaining steady cadence.'
        ],
        restTime: '45-60 seconds'
      }
    },
    advanced: {
      earlyWeeks: {
        name: 'PLYOMETRIC JUMP LUNGES',
        executionSteps: [
          '1. Setup: Lunge position.',
          '2. Jump: Explode vertically and switch leg positions in air landing softly into lunge.'
        ],
        restTime: '60 seconds'
      },
      lateWeeks: {
        name: 'EXPLOSIVE HEIGHT JUMP LUNGES',
        executionSteps: [
          '1. Max vertical height jump lunges switching legs rapidly in mid-air.'
        ],
        restTime: '45 seconds'
      }
    }
  },

  'FULL BODY BURPEE SPRINTS': {
    beginner: {
      earlyWeeks: {
        name: 'STEP-OUT PLANK STEPPERS (NO-JUMP BURPEE)',
        executionSteps: [
          '1. Setup: Stand tall with feet shoulder-width.',
          '2. Hands Down: Bend knees and place hands on floor.',
          '3. Step Back: Step right leg back then left leg back into high plank.',
          '4. Step In & Stand: Step feet back up one at a time and stand tall reaching hands overhead.'
        ],
        formTips: ['No jumping or pushup required; focus on fluid hip mobility and balance.'],
        restTime: '75-90 seconds'
      },
      lateWeeks: {
        name: 'LOW IMPACT STEP-OUT BURPEES',
        executionSteps: [
          '1. Place hands on floor, hop or step feet back into plank, step back in and jump 1 inch overhead.'
        ],
        restTime: '60 seconds'
      }
    },
    intermediate: {
      earlyWeeks: {
        name: 'STANDARD BURPEES (WITH JUMP)',
        executionSteps: [
          '1. Hands to floor, kick feet back to plank, jump feet back to hands, launch overhead with clap.'
        ],
        restTime: '60 seconds'
      },
      lateWeeks: {
        name: 'CHEST-TO-FLOOR BURPEES',
        executionSteps: [
          '1. Lower chest completely to floor at bottom of plank before jumping overhead.'
        ],
        restTime: '45-60 seconds'
      }
    },
    advanced: {
      earlyWeeks: {
        name: 'CHEST-TO-FLOOR BURPEE SPRINTS',
        executionSteps: [
          '1. Rapid chest-to-floor burpee with maximal height overhead jump.'
        ],
        restTime: '45 seconds'
      },
      lateWeeks: {
        name: 'BURPEE TUCK JUMP SPRINTS',
        executionSteps: [
          '1. Perform chest-to-floor burpee and explode into a high knee tuck-jump at top.'
        ],
        restTime: '30-45 seconds'
      }
    }
  },

  'DOORWAY BODYWEIGHT ROWS': {
    beginner: {
      earlyWeeks: {
        name: 'STANDING DOORWAY UPRIGHT LEAN ROWS (BEGINNER)',
        executionSteps: [
          '1. Setup: Stand close to doorway holding both sides of doorframe with arms bent slightly.',
          '2. Lean Back 20°: Lean back slightly so body is at a gentle angle.',
          '3. Pull & Squeeze: Pull chest forward toward doorframe by driving elbows back and squeezing shoulder blades.'
        ],
        restTime: '60-75 seconds'
      },
      lateWeeks: {
        name: 'MID-ANGLE DOORWAY BODYWEIGHT ROWS',
        executionSteps: [
          '1. Walk feet forward slightly to steepen lean angle to 35-40°, pull chest firmly between frame.'
        ],
        restTime: '60 seconds'
      }
    },
    intermediate: {
      earlyWeeks: {
        name: 'DOORWAY BODYWEIGHT ROWS',
        executionSteps: [
          '1. Feet walked forward under frame at 45° angle, pull chest fully between frame with lats.'
        ],
        restTime: '60 seconds'
      },
      lateWeeks: {
        name: 'DEEP INCLINE / TABLE INVERTED ROWS',
        executionSteps: [
          '1. Lie under sturdy dining table, grip edge, pull chest up to table underside.'
        ],
        restTime: '45-60 seconds'
      }
    },
    advanced: {
      earlyWeeks: {
        name: 'TABLE / TOWEL INVERTED BODYWEIGHT ROWS',
        executionSteps: [
          '1. Horizontal inverted rows with body parallel to floor or feet elevated.'
        ],
        restTime: '60 seconds'
      },
      lateWeeks: {
        name: 'STRICT PULLUPS / CHINUPS / SINGLE-ARM ASSISTED ROWS',
        executionSteps: [
          '1. High tension pullups or feet-elevated inverted rows.'
        ],
        restTime: '45-60 seconds'
      }
    }
  },

  'RAPID MOUNTAIN CLIMBERS': {
    beginner: {
      earlyWeeks: {
        name: 'ELEVATED CHAIR SLOW KNEE DRIVES (BEGINNER)',
        executionSteps: [
          '1. Setup: Place hands on sturdy chair seat or bed edge in elevated plank position.',
          '2. Controlled Drive: Slowly bring right knee toward chest, hold 1 second, step back.',
          '3. Alternate: Bring left knee to chest slowly without bouncing hips.'
        ],
        restTime: '60-75 seconds'
      },
      lateWeeks: {
        name: 'FLOOR SLOW MOUNTAIN CLIMBERS',
        executionSteps: [
          '1. High plank on floor, driving knees forward in controlled rhythm.'
        ],
        restTime: '60 seconds'
      }
    },
    intermediate: {
      earlyWeeks: {
        name: 'RAPID MOUNTAIN CLIMBERS',
        executionSteps: [
          '1. High plank position, driving knees toward chest in running tempo.'
        ],
        restTime: '60 seconds'
      },
      lateWeeks: {
        name: 'CROSS-BODY RAPID MOUNTAIN CLIMBERS',
        executionSteps: [
          '1. Drive right knee toward left elbow and left knee toward right elbow in rapid tempo.'
        ],
        restTime: '45 seconds'
      }
    },
    advanced: {
      earlyWeeks: {
        name: 'CROSS-BODY SPEED MOUNTAIN CLIMBERS',
        executionSteps: [
          '1. Maximal velocity cross-body knee drives maintaining low plank hips.'
        ],
        restTime: '45 seconds'
      },
      lateWeeks: {
        name: 'SPIDERMAN PLANK / EXPLOSIVE MOUNTAIN CLIMBERS',
        executionSteps: [
          '1. High frequency explosive climbers combined with wide knee drives.'
        ],
        restTime: '30-45 seconds'
      }
    }
  }
};

export interface ExerciseOverloadRecord {
  completionsCount?: number;
  userMultiplier?: number;
  userExtraSets?: number;
  userExtraReps?: number;
}

// Progressive Overload & Difficulty Scaling Engine
export function scaleExerciseForWeek(
  ex: ExerciseItem,
  week: number = 1,
  experienceLevel: 'beginner' | 'intermediate' | 'advanced' = 'beginner',
  overloadRecord?: ExerciseOverloadRecord,
  globalDifficultyMultiplier: number = 1.0
): ExerciseItem & { 
  scaledSets: number; 
  scaledReps: number; 
  scaledDuration: number;
  weekPhaseLabel: string; 
  difficultyLabel: string;
  autoOverloadPercent: number;
  totalDifficultyMultiplier: number;
  completionsCount: number;
  userMultiplier: number;
} {
  const enriched = enrichExercise(ex);
  const cleanWeek = Math.max(1, Math.min(8, week));
  const isLateWeeks = cleanWeek >= 5;

  // 1. Determine Exercise Variant (Name, Steps, Rest)
  let exerciseName = enriched.name;
  let steps = enriched.executionSteps;
  let formTips = enriched.formTips;
  let customRest = enriched.restTime;

  const key = enriched.name.toUpperCase();
  const variantData = EXERCISE_DIFFICULTY_VARIANTS[key];

  if (variantData) {
    const levelObj = variantData[experienceLevel] || variantData.beginner;
    const variant = isLateWeeks ? levelObj.lateWeeks : levelObj.earlyWeeks;
    exerciseName = variant.name;
    steps = variant.executionSteps || steps;
    formTips = variant.formTips || formTips;
    customRest = variant.restTime || customRest;
  } else if (experienceLevel === 'beginner') {
    // Generic fallback variant transformation for beginner
    if (cleanWeek <= 4) {
      exerciseName = `BEGINNER MODIFIED: ${enriched.name}`;
      steps = [
        `1. Beginner Setup: Position yourself with lightweight or assisted posture.`,
        `2. Controlled Movement: Perform movement smoothly with full breath control.`,
        `3. Pause: Pause 1s at peak and return under 2s control.`
      ];
    }
  } else if (experienceLevel === 'advanced' && isLateWeeks) {
    exerciseName = `TEMPO OVERLOAD: ${enriched.name}`;
  }

  // 2. Progressive Overload Base Sets & Reps Scaling Table over Weeks 1-8
  let baseSets = 3;
  let baseReps = 10;

  if (experienceLevel === 'beginner') {
    // Gentle entry -> Progressive build
    if (cleanWeek === 1) { baseSets = 2; baseReps = 8; customRest = customRest || '80 seconds'; }
    else if (cleanWeek === 2) { baseSets = 2; baseReps = 10; customRest = customRest || '75 seconds'; }
    else if (cleanWeek === 3) { baseSets = 3; baseReps = 10; customRest = customRest || '70 seconds'; }
    else if (cleanWeek === 4) { baseSets = 3; baseReps = 12; customRest = customRest || '60 seconds'; }
    else if (cleanWeek === 5) { baseSets = 3; baseReps = 12; customRest = customRest || '60 seconds'; }
    else if (cleanWeek === 6) { baseSets = 3; baseReps = 14; customRest = customRest || '60 seconds'; }
    else if (cleanWeek === 7) { baseSets = 4; baseReps = 12; customRest = customRest || '50 seconds'; }
    else { baseSets = 4; baseReps = 15; customRest = customRest || '45 seconds'; }
  } else if (experienceLevel === 'intermediate') {
    // Standard progression
    if (cleanWeek === 1) { baseSets = 3; baseReps = 10; customRest = customRest || '75 seconds'; }
    else if (cleanWeek === 2) { baseSets = 3; baseReps = 12; customRest = customRest || '60 seconds'; }
    else if (cleanWeek === 3) { baseSets = 3; baseReps = 14; customRest = customRest || '60 seconds'; }
    else if (cleanWeek === 4) { baseSets = 4; baseReps = 12; customRest = customRest || '60 seconds'; }
    else if (cleanWeek === 5) { baseSets = 4; baseReps = 14; customRest = customRest || '50 seconds'; }
    else if (cleanWeek === 6) { baseSets = 4; baseReps = 15; customRest = customRest || '45 seconds'; }
    else if (cleanWeek === 7) { baseSets = 4; baseReps = 16; customRest = customRest || '45 seconds'; }
    else { baseSets = 4; baseReps = 18; customRest = customRest || '45 seconds'; }
  } else {
    // Advanced Athletic Overload
    if (cleanWeek === 1) { baseSets = 3; baseReps = 12; customRest = customRest || '60 seconds'; }
    else if (cleanWeek === 2) { baseSets = 3; baseReps = 15; customRest = customRest || '60 seconds'; }
    else if (cleanWeek === 3) { baseSets = 4; baseReps = 15; customRest = customRest || '50 seconds'; }
    else if (cleanWeek === 4) { baseSets = 4; baseReps = 16; customRest = customRest || '45 seconds'; }
    else if (cleanWeek === 5) { baseSets = 4; baseReps = 18; customRest = customRest || '45 seconds'; }
    else if (cleanWeek === 6) { baseSets = 4; baseReps = 20; customRest = customRest || '40 seconds'; }
    else if (cleanWeek === 7) { baseSets = 5; baseReps = 18; customRest = customRest || '35 seconds'; }
    else { baseSets = 5; baseReps = 20; customRest = customRest || '30 seconds'; }
  }

  // Preserve relative scale for heavy compound exercises with lower default reps
  if (enriched.targetReps && enriched.targetReps < 8) {
    const ratio = enriched.targetReps / 10;
    baseReps = Math.max(3, Math.round(baseReps * ratio));
  }

  // 3. Completion History Auto-Overload Calculation (+5% per completion)
  const completionsCount = overloadRecord?.completionsCount || 0;
  const autoOverloadFactor = 1 + (completionsCount * 0.05); // +5% per completion
  const autoOverloadPercent = Math.round((autoOverloadFactor - 1) * 100);

  // 4. Editable Multipliers (Manual User Multiplier & Global Difficulty Multiplier)
  const userMultiplier = overloadRecord?.userMultiplier ?? 1.0;
  const cleanGlobalMult = Math.max(0.4, Math.min(3.0, globalDifficultyMultiplier));
  const totalDifficultyMultiplier = Number((autoOverloadFactor * userMultiplier * cleanGlobalMult).toFixed(2));

  // Compute final scaled parameters
  const userExtraSets = overloadRecord?.userExtraSets || 0;
  const userExtraReps = overloadRecord?.userExtraReps || 0;

  const scaledReps = Math.max(1, Math.round(baseReps * totalDifficultyMultiplier)) + userExtraReps;
  const scaledSets = Math.max(1, Math.round(baseSets * Math.min(1.6, Math.sqrt(totalDifficultyMultiplier)))) + userExtraSets;
  const scaledDuration = Math.max(5, Math.round((enriched.duration || 10) * totalDifficultyMultiplier));

  // Labels for UI clarity
  let weekPhaseLabel = `🌱 Week ${cleanWeek}: Entry Foundation`;
  if (cleanWeek === 2) weekPhaseLabel = `🌱 Week 2: Form Consolidation`;
  else if (cleanWeek === 3) weekPhaseLabel = `📈 Week 3: Progressive Overload (+Volume)`;
  else if (cleanWeek === 4) weekPhaseLabel = `⚡ Week 4: Intensity Baseline`;
  else if (cleanWeek === 5) weekPhaseLabel = `🔥 Week 5: Hypertrophy Phase (+1 Variation)`;
  else if (cleanWeek === 6) weekPhaseLabel = `🔥 Week 6: Capacity Push`;
  else if (cleanWeek === 7) weekPhaseLabel = `🚀 Week 7: Peak Resistance`;
  else if (cleanWeek === 8) weekPhaseLabel = `🏆 Week 8: Master Performance Peak`;

  const difficultyLabel = experienceLevel === 'beginner'
    ? '🌱 BEGINNER LEVEL (ACCESSIBLE ADAPTATION)'
    : experienceLevel === 'intermediate'
    ? '⚡ INTERMEDIATE LEVEL (STANDARD)'
    : '🔥 ADVANCED LEVEL (HIGH INTENSITY)';

  return {
    ...enriched,
    name: exerciseName,
    executionSteps: steps,
    formTips,
    restTime: customRest,
    defaultSets: scaledSets,
    targetReps: scaledReps,
    duration: scaledDuration,
    scaledSets,
    scaledReps,
    scaledDuration,
    weekPhaseLabel,
    difficultyLabel,
    autoOverloadPercent,
    totalDifficultyMultiplier,
    completionsCount,
    userMultiplier
  };
}

// BUILT IN WORKOUT PROGRAMS (12 FULLY FEATURED PLANS COVERING ALL GOALS & EQUIPMENT TYPES)
export const BUILT_IN_WORKOUT_PROGRAMS: WorkoutPlanItem[] = [
  // =========================================================================
  // 1. CALISTHENICS - NO EQUIPMENT
  // =========================================================================
  {
    id: '8week_no_equipment_calisthenics_shred',
    name: '8-WEEK NO-EQUIPMENT CALISTHENICS & BODYWEIGHT SHRED',
    area: '2-Month Bodyweight Calisthenics',
    tag: 'Calisthenics',
    equipment: 'No Equipment',
    targetGoal: 'calisthenics',
    durationWeeks: 8,
    daysPerWeek: 5,
    recommendedBodyType: 'All Body Types / Zero Gear Home Training',
    compatibilityNote: '100% equipment-free guaranteed. 6-8 structured exercises per session designed for 2-month linear bodyweight progress.',
    description: 'Complete 8-Week calisthenics system spanning Warm-up, Push, Pull, Leg Overload, Core & Mobility.',
    days: [
      {
        dayNumber: 1,
        title: 'DAY 1: CHEST & TRICEPS OVERLOAD MATRIX',
        muscleFocus: 'Upper Push, Chest & Triceps',
        exercises: [
          enrichExercise({ name: 'ARM CIRCLES & SHOULDER TAPS', calories: 40, duration: 5, muscleGroup: 'shoulders', defaultSets: 2, targetReps: 15, category: 'Warm-Up' }),
          enrichExercise({ name: 'STANDARD FLOOR PUSHUPS', calories: 120, duration: 10, muscleGroup: 'chest', defaultSets: 4, targetReps: 20, category: 'Primary Compound' }),
          enrichExercise({ name: 'DIAMOND TRICEP PUSHUPS', calories: 100, duration: 8, muscleGroup: 'arms', defaultSets: 3, targetReps: 12, category: 'Accessory' }),
          enrichExercise({ name: 'CHAIR / BENCH TRICEP DIPS', calories: 90, duration: 8, muscleGroup: 'arms', defaultSets: 3, targetReps: 15, category: 'Accessory' }),
          enrichExercise({ name: 'HOLLOW BODY COMPRESSION HOLDS', calories: 80, duration: 6, muscleGroup: 'core', defaultSets: 3, targetReps: 45, category: 'Finisher' })
        ]
      },
      {
        dayNumber: 2,
        title: 'DAY 2: EXPLOSIVE QUAD & GLUTE CAPACITY',
        muscleFocus: 'Quads, Hamstrings & Calves',
        exercises: [
          enrichExercise({ name: 'EXPLOSIVE AIR SQUATS', calories: 140, duration: 12, muscleGroup: 'legs', defaultSets: 4, targetReps: 25, category: 'Primary Compound' }),
          enrichExercise({ name: 'PLYOMETRIC JUMP LUNGES', calories: 160, duration: 10, muscleGroup: 'legs', defaultSets: 4, targetReps: 16, category: 'Primary Compound' }),
          enrichExercise({ name: 'ISOMETRIC WALL SITS', calories: 100, duration: 8, muscleGroup: 'legs', defaultSets: 3, targetReps: 60, category: 'Accessory' })
        ]
      },
      {
        dayNumber: 3,
        title: 'DAY 3: INVERTED PULL & LAT DENSITY',
        muscleFocus: 'Lats, Upper Back & Biceps',
        exercises: [
          enrichExercise({ name: 'THORACIC CAT-COW FLOW', calories: 40, duration: 5, muscleGroup: 'back', defaultSets: 2, targetReps: 12, category: 'Warm-Up' }),
          enrichExercise({ name: 'DOORWAY BODYWEIGHT ROWS', calories: 130, duration: 10, muscleGroup: 'back', defaultSets: 4, targetReps: 15, category: 'Primary Compound' }),
          enrichExercise({ name: 'RAPID MOUNTAIN CLIMBERS', calories: 110, duration: 8, muscleGroup: 'core', defaultSets: 4, targetReps: 30, category: 'Finisher' })
        ]
      }
    ]
  },

  // =========================================================================
  // 2. CALISTHENICS - EQUIPMENT REQUIRED (PULLUP BAR / DUMBBELLS)
  // =========================================================================
  {
    id: '8week_weighted_calisthenics_athletic_power',
    name: '8-WEEK WEIGHTED CALISTHENICS & ATHLETIC POWER SPLIT',
    area: 'Weighted Calisthenics & Pullup Progression',
    tag: 'Athletic Power',
    equipment: 'Dumbbells',
    targetGoal: 'calisthenics',
    durationWeeks: 8,
    daysPerWeek: 4,
    recommendedBodyType: 'Athletic / Intermediate Calisthenics & Gym Goers',
    compatibilityNote: 'Combines bodyweight gymnastics with weighted pullups, dumbbell goblet squats, and dips.',
    description: '8-Week progression blending strict bodyweight gymnastics skills with light dumbbell loading for maximum back, shoulder, and leg power.',
    days: [
      {
        dayNumber: 1,
        title: 'DAY 1: HEAVY PULLUPS & INVERTED ROW OVERLOAD',
        muscleFocus: 'Lats, Rhomboids & Biceps',
        exercises: [
          enrichExercise({ name: 'THORACIC CAT-COW FLOW', calories: 40, duration: 5, muscleGroup: 'back', defaultSets: 2, targetReps: 12, category: 'Warm-Up' }),
          enrichExercise({ name: 'PULLUPS / CHINUPS', calories: 160, duration: 12, muscleGroup: 'back', defaultSets: 4, targetReps: 8, category: 'Primary Compound' }),
          enrichExercise({ name: 'DUMBBELL BENT-OVER ROWS', calories: 140, duration: 10, muscleGroup: 'back', defaultSets: 4, targetReps: 12, category: 'Primary Compound' }),
          enrichExercise({ name: 'DOORWAY BODYWEIGHT ROWS', calories: 110, duration: 8, muscleGroup: 'back', defaultSets: 3, targetReps: 15, category: 'Accessory' }),
          enrichExercise({ name: 'HOLLOW BODY COMPRESSION HOLDS', calories: 90, duration: 6, muscleGroup: 'core', defaultSets: 3, targetReps: 45, category: 'Finisher' })
        ]
      },
      {
        dayNumber: 2,
        title: 'DAY 2: DUMBBELL GOBLET SQUAT & SINGLE-LEG POWER',
        muscleFocus: 'Quads, Glutes & Calves',
        exercises: [
          enrichExercise({ name: 'DUMBBELL GOBLET SQUATS', calories: 170, duration: 12, muscleGroup: 'legs', defaultSets: 4, targetReps: 12, category: 'Primary Compound' }),
          enrichExercise({ name: 'DUMBBELL WALKING LUNGES', calories: 150, duration: 10, muscleGroup: 'legs', defaultSets: 4, targetReps: 12, category: 'Primary Compound' }),
          enrichExercise({ name: 'ISOMETRIC WALL SITS', calories: 100, duration: 8, muscleGroup: 'legs', defaultSets: 3, targetReps: 60, category: 'Accessory' })
        ]
      }
    ]
  },

  // =========================================================================
  // 3. MUSCLE GAIN - NO EQUIPMENT (BODYWEIGHT HYPERTROPHY)
  // =========================================================================
  {
    id: '8week_bodyweight_hypertrophy_mass',
    name: '8-WEEK BODYWEIGHT MUSCLE HYPERTROPHY & MASS BUILD',
    area: 'No-Equipment Home Hypertrophy',
    tag: 'Muscle Gain',
    equipment: 'No Equipment',
    targetGoal: 'muscle_gain',
    durationWeeks: 8,
    daysPerWeek: 4,
    recommendedBodyType: 'Slim / Hardgainers without Gym Access',
    compatibilityNote: '100% equipment-free. High volume, strict 3-second time-under-tension lowers, and pause squeezes to stimulate muscle hypertrophy at home.',
    description: 'Targeted 8-Week bodyweight muscle builder engineered with slow tempo eccentrics, high rep thresholds, and strict isometric peak contractions.',
    days: [
      {
        dayNumber: 1,
        title: 'DAY 1: CHEST & TRICEP TIME-UNDER-TENSION HYPERTROPHY',
        muscleFocus: 'Pectorals & Triceps',
        exercises: [
          enrichExercise({ name: 'STANDARD FLOOR PUSHUPS', calories: 130, duration: 12, muscleGroup: 'chest', defaultSets: 5, targetReps: 18, category: 'Primary Compound' }),
          enrichExercise({ name: 'DIAMOND TRICEP PUSHUPS', calories: 110, duration: 10, muscleGroup: 'arms', defaultSets: 4, targetReps: 12, category: 'Primary Compound' }),
          enrichExercise({ name: 'CHAIR / BENCH TRICEP DIPS', calories: 100, duration: 8, muscleGroup: 'arms', defaultSets: 4, targetReps: 15, category: 'Accessory' })
        ]
      },
      {
        dayNumber: 2,
        title: 'DAY 2: QUAD & GLUTE DENSITY HYPERTROPHY',
        muscleFocus: 'Quadriceps, Glutes & Hamstrings',
        exercises: [
          enrichExercise({ name: 'EXPLOSIVE AIR SQUATS', calories: 150, duration: 12, muscleGroup: 'legs', defaultSets: 5, targetReps: 25, category: 'Primary Compound' }),
          enrichExercise({ name: 'PLYOMETRIC JUMP LUNGES', calories: 160, duration: 10, muscleGroup: 'legs', defaultSets: 4, targetReps: 16, category: 'Primary Compound' }),
          enrichExercise({ name: 'ISOMETRIC WALL SITS', calories: 110, duration: 8, muscleGroup: 'legs', defaultSets: 4, targetReps: 60, category: 'Accessory' })
        ]
      }
    ]
  },

  // =========================================================================
  // 4. MUSCLE GAIN - EQUIPMENT REQUIRED (BARBELL / DUMBBELL / FULL GYM)
  // =========================================================================
  {
    id: '8week_mass_gainer_hypertrophy',
    name: '8-WEEK SKINNY-TO-MUSCLE MASS GAINER (FULL GYM)',
    area: '2-Month Heavy Bulking Split',
    tag: 'Muscle Gain',
    equipment: 'Barbell / Dumbbell / Gym',
    targetGoal: 'muscle_gain',
    durationWeeks: 8,
    daysPerWeek: 4,
    recommendedBodyType: 'Slim Build / Underweight / Hardgainers',
    compatibilityNote: 'Heavy compound overload with structured barbell & dumbbell exercises for maximum 2-month muscle hypertrophy.',
    description: 'Structured 8-week compound mass-building protocol engineered with progressive gym overload to stimulate skeletal muscle growth.',
    days: [
      {
        dayNumber: 1,
        title: 'DAY 1: HEAVY CHEST & TRICEP MASS OVERLOAD',
        muscleFocus: 'Pectorals, Anterior Deltoids & Triceps',
        exercises: [
          enrichExercise({ name: 'BARBELL BENCH PRESS', calories: 230, duration: 15, muscleGroup: 'chest', defaultSets: 5, targetReps: 6, category: 'Primary Compound' }),
          enrichExercise({ name: 'DUMBBELL BENCH PRESS', calories: 180, duration: 12, muscleGroup: 'chest', defaultSets: 4, targetReps: 10, category: 'Primary Compound' }),
          enrichExercise({ name: 'STANDARD FLOOR PUSHUPS', calories: 120, duration: 8, muscleGroup: 'chest', defaultSets: 4, targetReps: 15, category: 'Accessory' }),
          enrichExercise({ name: 'CHAIR / BENCH TRICEP DIPS', calories: 120, duration: 8, muscleGroup: 'arms', defaultSets: 4, targetReps: 12, category: 'Accessory' })
        ]
      },
      {
        dayNumber: 2,
        title: 'DAY 2: LAT DENSITY & HEAVY DEADLIFT OVERLOAD',
        muscleFocus: 'Lats, Rhomboids, Traps & Biceps',
        exercises: [
          enrichExercise({ name: 'BARBELL DEADLIFT', calories: 290, duration: 18, muscleGroup: 'back', defaultSets: 5, targetReps: 5, category: 'Primary Compound' }),
          enrichExercise({ name: 'DUMBBELL BENT-OVER ROWS', calories: 160, duration: 10, muscleGroup: 'back', defaultSets: 4, targetReps: 10, category: 'Primary Compound' }),
          enrichExercise({ name: 'PULLUPS / CHINUPS', calories: 150, duration: 10, muscleGroup: 'back', defaultSets: 4, targetReps: 8, category: 'Accessory' })
        ]
      },
      {
        dayNumber: 3,
        title: 'DAY 3: QUAD MASS & HEAVY BARBELL SQUATS',
        muscleFocus: 'Quads, Glutes & Hamstrings',
        exercises: [
          enrichExercise({ name: 'BARBELL BACK SQUATS', calories: 300, duration: 20, muscleGroup: 'legs', defaultSets: 5, targetReps: 6, category: 'Primary Compound' }),
          enrichExercise({ name: 'DUMBBELL GOBLET SQUATS', calories: 170, duration: 12, muscleGroup: 'legs', defaultSets: 4, targetReps: 12, category: 'Primary Compound' }),
          enrichExercise({ name: 'DUMBBELL ROMANIAN DEADLIFTS', calories: 180, duration: 12, muscleGroup: 'legs', defaultSets: 4, targetReps: 10, category: 'Accessory' })
        ]
      }
    ]
  },

  {
    id: '6week_dumbbell_only_home_muscle_builder',
    name: '6-WEEK DUMBBELL-ONLY HOME MUSCLE BUILDER',
    area: 'Dumbbell PPL Home Split',
    tag: 'Dumbbell Mass',
    equipment: 'Dumbbells',
    targetGoal: 'muscle_gain',
    durationWeeks: 6,
    daysPerWeek: 4,
    recommendedBodyType: 'Home Gym / Dumbbell Owners seeking Muscle Mass',
    compatibilityNote: '100% dumbbell & bodyweight driven. Full PPL progression requiring only a pair of adjustable dumbbells.',
    description: '6-Week dumbbell push/pull/legs protocol for complete upper and lower body hypertrophy without needing a commercial gym.',
    days: [
      {
        dayNumber: 1,
        title: 'DAY 1: DUMBBELL PUSH (CHEST, SHOULDERS & TRICEPS)',
        muscleFocus: 'Chest, Shoulders & Triceps',
        exercises: [
          enrichExercise({ name: 'DUMBBELL BENCH PRESS', calories: 180, duration: 12, muscleGroup: 'chest', defaultSets: 4, targetReps: 10, category: 'Primary Compound' }),
          enrichExercise({ name: 'DUMBBELL OVERHEAD SHOULDER PRESS', calories: 160, duration: 10, muscleGroup: 'shoulders', defaultSets: 4, targetReps: 10, category: 'Primary Compound' }),
          enrichExercise({ name: 'CHAIR / BENCH TRICEP DIPS', calories: 110, duration: 8, muscleGroup: 'arms', defaultSets: 3, targetReps: 15, category: 'Accessory' })
        ]
      },
      {
        dayNumber: 2,
        title: 'DAY 2: DUMBBELL PULL (BACK, REAR DELTS & BICEPS)',
        muscleFocus: 'Lats, Rhomboids & Biceps',
        exercises: [
          enrichExercise({ name: 'DUMBBELL BENT-OVER ROWS', calories: 170, duration: 12, muscleGroup: 'back', defaultSets: 4, targetReps: 10, category: 'Primary Compound' }),
          enrichExercise({ name: 'DUMBBELL ROMANIAN DEADLIFTS', calories: 180, duration: 12, muscleGroup: 'legs', defaultSets: 4, targetReps: 10, category: 'Primary Compound' }),
          enrichExercise({ name: 'DOORWAY BODYWEIGHT ROWS', calories: 110, duration: 8, muscleGroup: 'back', defaultSets: 3, targetReps: 15, category: 'Accessory' })
        ]
      }
    ]
  },

  // =========================================================================
  // 5. STRENGTH SPLIT - EQUIPMENT REQUIRED (BARBELL / GYM 5x5 POWERLIFTING)
  // =========================================================================
  {
    id: '8week_powerlifting_5x5_strength_split',
    name: '8-WEEK HEAVY POWERLIFTING & STRENGTH SPLIT (5x5)',
    area: '2-Month Max Strength & Powerlifting',
    tag: 'Max Strength',
    equipment: 'Barbell / Dumbbell / Gym',
    targetGoal: 'strength',
    durationWeeks: 8,
    daysPerWeek: 3,
    recommendedBodyType: 'Athletic / Intermediate Strength Lifters',
    compatibilityNote: 'Classic 5x5 compound strength progression focusing on max load linear overload across Squat, Bench, and Deadlift.',
    description: 'Gold-standard 8-Week 5x5 strength system designed to build raw neuromuscular strength and tendon density.',
    days: [
      {
        dayNumber: 1,
        title: 'DAY 1: SQUAT & BENCH PRESS POWER 5x5',
        muscleFocus: 'Quads, Chest & Triceps',
        exercises: [
          enrichExercise({ name: 'BARBELL BACK SQUATS', calories: 310, duration: 20, muscleGroup: 'legs', defaultSets: 5, targetReps: 5, category: 'Primary Compound' }),
          enrichExercise({ name: 'BARBELL BENCH PRESS', calories: 240, duration: 15, muscleGroup: 'chest', defaultSets: 5, targetReps: 5, category: 'Primary Compound' }),
          enrichExercise({ name: 'DOORWAY BODYWEIGHT ROWS', calories: 120, duration: 8, muscleGroup: 'back', defaultSets: 4, targetReps: 12, category: 'Accessory' })
        ]
      },
      {
        dayNumber: 2,
        title: 'DAY 2: DEADLIFT & OVERHEAD SHOULDER PRESS 5x5',
        muscleFocus: 'Posterior Chain, Shoulders & Upper Back',
        exercises: [
          enrichExercise({ name: 'BARBELL DEADLIFT', calories: 320, duration: 20, muscleGroup: 'back', defaultSets: 5, targetReps: 5, category: 'Primary Compound' }),
          enrichExercise({ name: 'PIKE PUSHUPS (SHOULDER PRESS)', calories: 140, duration: 10, muscleGroup: 'shoulders', defaultSets: 5, targetReps: 5, category: 'Primary Compound' }),
          enrichExercise({ name: 'PULLUPS / CHINUPS', calories: 150, duration: 10, muscleGroup: 'back', defaultSets: 4, targetReps: 6, category: 'Accessory' })
        ]
      }
    ]
  },

  // =========================================================================
  // 6. STRENGTH SPLIT - NO EQUIPMENT (CALISTHENICS LEVERAGE STRENGTH)
  // =========================================================================
  {
    id: '8week_bodyweight_leverage_strength_split',
    name: '8-WEEK CALISTHENICS STRENGTH & MAX FORCE SPLIT',
    area: 'No-Equipment Maximum Force & Leverage',
    tag: 'Pure Strength',
    equipment: 'No Equipment',
    targetGoal: 'strength',
    durationWeeks: 8,
    daysPerWeek: 4,
    recommendedBodyType: 'Bodyweight Athletes seeking Pure Strength & Neural Power',
    compatibilityNote: '100% equipment-free. High leverage positions (Pike pushups, Wall handstand climbs, Decline pushups) to generate max force without weights.',
    description: '8-Week calisthenics strength split focusing on low rep, high tension bodyweight leverage movements to develop maximal upper and lower body strength.',
    days: [
      {
        dayNumber: 1,
        title: 'DAY 1: MAX LEVERAGE UPPER BODY PUSH STRENGTH',
        muscleFocus: 'Deltoids, Upper Chest & Triceps',
        exercises: [
          enrichExercise({ name: 'PIKE PUSHUPS (SHOULDER PRESS)', calories: 130, duration: 10, muscleGroup: 'shoulders', defaultSets: 5, targetReps: 6, category: 'Primary Compound' }),
          enrichExercise({ name: 'STANDARD FLOOR PUSHUPS', calories: 120, duration: 10, muscleGroup: 'chest', defaultSets: 5, targetReps: 12, category: 'Primary Compound' }),
          enrichExercise({ name: 'DIAMOND TRICEP PUSHUPS', calories: 110, duration: 8, muscleGroup: 'arms', defaultSets: 4, targetReps: 8, category: 'Accessory' })
        ]
      },
      {
        dayNumber: 2,
        title: 'DAY 2: UNILATERAL LEG FORCE & EXPLOSIVE DRIVE',
        muscleFocus: 'Quads & Glutes Strength',
        exercises: [
          enrichExercise({ name: 'PLYOMETRIC JUMP LUNGES', calories: 170, duration: 10, muscleGroup: 'legs', defaultSets: 4, targetReps: 12, category: 'Primary Compound' }),
          enrichExercise({ name: 'EXPLOSIVE AIR SQUATS', calories: 150, duration: 10, muscleGroup: 'legs', defaultSets: 4, targetReps: 20, category: 'Primary Compound' }),
          enrichExercise({ name: 'ISOMETRIC WALL SITS', calories: 100, duration: 8, muscleGroup: 'legs', defaultSets: 4, targetReps: 60, category: 'Accessory' })
        ]
      }
    ]
  },

  // =========================================================================
  // 7. FAT LOSS - NO EQUIPMENT
  // =========================================================================
  {
    id: '4week_no_equipment_metabolic_fat_burn',
    name: '4-WEEK NO-EQUIPMENT METABOLIC FAT BURN & SHRED',
    area: '1-Month Bodyweight Fat Loss HIIT',
    tag: 'Fat Loss',
    equipment: 'No Equipment',
    targetGoal: 'fat_loss',
    durationWeeks: 4,
    daysPerWeek: 4,
    recommendedBodyType: 'Weight Loss / Calorie Shred / Rapid Recomp',
    compatibilityNote: '100% equipment-free high-density metabolic training. High calorie burn per minute with zero gear required.',
    description: 'High-energy 4-Week bodyweight fat burn protocol engineered with fast-paced plyometric intervals and bodyweight density circuits.',
    days: [
      {
        dayNumber: 1,
        title: 'DAY 1: HIGH-FREQUENCY HIIT & LOWER BODY BURN',
        muscleFocus: 'Legs & Cardiovascular System',
        exercises: [
          enrichExercise({ name: 'EXPLOSIVE AIR SQUATS', calories: 150, duration: 10, muscleGroup: 'legs', defaultSets: 4, targetReps: 25, category: 'Primary Compound' }),
          enrichExercise({ name: 'RAPID MOUNTAIN CLIMBERS', calories: 140, duration: 8, muscleGroup: 'core', defaultSets: 4, targetReps: 40, category: 'Primary Compound' }),
          enrichExercise({ name: 'PLYOMETRIC JUMP LUNGES', calories: 170, duration: 10, muscleGroup: 'legs', defaultSets: 4, targetReps: 16, category: 'Accessory' })
        ]
      },
      {
        dayNumber: 2,
        title: 'DAY 2: FULL BODY CARDIO INFERNO & BURPEE SPRINT',
        muscleFocus: 'Full Body Cardiovascular Endurance',
        exercises: [
          enrichExercise({ name: 'FULL BODY BURPEE SPRINTS', calories: 200, duration: 12, muscleGroup: 'cardio', defaultSets: 5, targetReps: 15, category: 'Primary Compound' }),
          enrichExercise({ name: 'RAPID MOUNTAIN CLIMBERS', calories: 130, duration: 8, muscleGroup: 'core', defaultSets: 4, targetReps: 45, category: 'Accessory' }),
          enrichExercise({ name: 'HOLLOW BODY COMPRESSION HOLDS', calories: 90, duration: 6, muscleGroup: 'core', defaultSets: 3, targetReps: 40, category: 'Finisher' })
        ]
      }
    ]
  },

  // =========================================================================
  // 8. FAT LOSS - EQUIPMENT REQUIRED (DUMBBELL METABOLIC SHRED)
  // =========================================================================
  {
    id: '6week_dumbbell_metabolic_fat_shred',
    name: '6-WEEK DUMBBELL METABOLIC FAT SHRED & RECOMP',
    area: 'Dumbbell HIIT & Calorie Density',
    tag: 'Dumbbell Shred',
    equipment: 'Dumbbells',
    targetGoal: 'fat_loss',
    durationWeeks: 6,
    daysPerWeek: 4,
    recommendedBodyType: 'Calorie Shredding with Dumbbells & Home Gym',
    compatibilityNote: 'High calorie output per minute using dumbbell thrusters, renegade rows, and lunges.',
    description: '6-Week weighted metabolic conditioning protocol designed to preserve lean muscle tissue while maximizing body fat loss.',
    days: [
      {
        dayNumber: 1,
        title: 'DAY 1: DUMBBELL THRUSTER & BURPEE METABOLIC COMPLEX',
        muscleFocus: 'Full Body Calorie Burn & Heart Rate',
        exercises: [
          enrichExercise({ name: 'DUMBBELL THRUSTERS (SQUAT-TO-PRESS)', calories: 210, duration: 12, muscleGroup: 'cardio', defaultSets: 4, targetReps: 12, category: 'Primary Compound' }),
          enrichExercise({ name: 'DUMBBELL RENEGADE ROWS', calories: 170, duration: 10, muscleGroup: 'back', defaultSets: 4, targetReps: 10, category: 'Primary Compound' }),
          enrichExercise({ name: 'FULL BODY BURPEE SPRINTS', calories: 190, duration: 10, muscleGroup: 'cardio', defaultSets: 4, targetReps: 15, category: 'Accessory' })
        ]
      },
      {
        dayNumber: 2,
        title: 'DAY 2: DUMBBELL LUNGE & CORE SHRED CIRCUIT',
        muscleFocus: 'Legs, Core & Calorie Burning',
        exercises: [
          enrichExercise({ name: 'DUMBBELL WALKING LUNGES', calories: 180, duration: 12, muscleGroup: 'legs', defaultSets: 4, targetReps: 14, category: 'Primary Compound' }),
          enrichExercise({ name: 'DUMBBELL GOBLET SQUATS', calories: 170, duration: 10, muscleGroup: 'legs', defaultSets: 4, targetReps: 15, category: 'Primary Compound' }),
          enrichExercise({ name: 'RAPID MOUNTAIN CLIMBERS', calories: 130, duration: 8, muscleGroup: 'core', defaultSets: 4, targetReps: 40, category: 'Finisher' })
        ]
      }
    ]
  },

  // =========================================================================
  // 9. JOINT CARE & MOBILITY - NO EQUIPMENT
  // =========================================================================
  {
    id: '4week_morning_mobility_posture_flow',
    name: '4-WEEK MORNING MOBILITY & POSTURE RESET',
    area: '1-Month Daily Posture & Joint Decompression',
    tag: 'Mobility Flow',
    equipment: 'No Equipment',
    targetGoal: 'joint_care',
    durationWeeks: 4,
    daysPerWeek: 3,
    recommendedBodyType: 'Desk Workers / Office Workers / Beginners / Recovery Days',
    compatibilityNote: '100% equipment-free gentle mobility flow. Ideal for morning energy, desk posture reset, and spinal alignment.',
    description: 'Gentle 4-Week zero-impact bodyweight mobility system designed to un-hunch shoulders, loosen tight hips, and decompress the spine.',
    days: [
      {
        dayNumber: 1,
        title: 'DAY 1: THORACIC SPINE & SHOULDER UN-HUNCH FLOW',
        muscleFocus: 'Thoracic Spine, Neck & Shoulders',
        exercises: [
          enrichExercise({ name: 'THORACIC CAT-COW FLOW', calories: 40, duration: 6, muscleGroup: 'back', defaultSets: 3, targetReps: 12, category: 'Warm-Up' }),
          enrichExercise({ name: 'WORLD GREATEST LUNGE STRETCH', calories: 60, duration: 8, muscleGroup: 'legs', defaultSets: 3, targetReps: 8, category: 'Primary Compound' })
        ]
      },
      {
        dayNumber: 2,
        title: 'DAY 2: DEEP HIP OPENER & ANKLE AGILITY RESET',
        muscleFocus: 'Hip Flexors, Adductors & Glutes',
        exercises: [
          enrichExercise({ name: 'WORLD GREATEST LUNGE STRETCH', calories: 60, duration: 8, muscleGroup: 'legs', defaultSets: 3, targetReps: 8, category: 'Primary Compound' }),
          enrichExercise({ name: 'ISOMETRIC WALL SITS', calories: 80, duration: 6, muscleGroup: 'legs', defaultSets: 3, targetReps: 45, category: 'Accessory' })
        ]
      }
    ]
  },

  // =========================================================================
  // 10. JOINT CARE & MOBILITY - EQUIPMENT REQUIRED (BANDS / LOW IMPACT MACHINES)
  // =========================================================================
  {
    id: '4week_low_impact_joint_care',
    name: '4-WEEK KNEE-SAFE LOW-IMPACT & JOINT CARE',
    area: 'Joint Protection & Gentle Entry',
    tag: 'Joint Safe',
    equipment: 'Low Impact / Machines / Bands',
    targetGoal: 'joint_care',
    durationWeeks: 4,
    daysPerWeek: 4,
    recommendedBodyType: 'Beginners / High Body Weight / Joint Concerns',
    compatibilityNote: 'Zero high-impact jumping, knee-friendly lever movements, and smooth control for absolute joint safety.',
    description: 'Joint-protective fitness system engineered for high body weight individuals, beginners, or joint strain recovery.',
    days: [
      {
        dayNumber: 1,
        title: 'DAY 1: LOW-IMPACT CHEST & SEATED PRESS',
        muscleFocus: 'Chest, Shoulders & Triceps (Joint-Safe)',
        exercises: [
          enrichExercise({ name: 'RESISTANCE BAND SHOULDER DISLOCATES', calories: 40, duration: 5, muscleGroup: 'shoulders', defaultSets: 3, targetReps: 12, category: 'Warm-Up' }),
          enrichExercise({ name: 'STANDARD FLOOR PUSHUPS', calories: 110, duration: 10, muscleGroup: 'chest', defaultSets: 3, targetReps: 12, category: 'Primary Compound' }),
          enrichExercise({ name: 'CHAIR / BENCH TRICEP DIPS', calories: 90, duration: 8, muscleGroup: 'arms', defaultSets: 3, targetReps: 12, category: 'Accessory' })
        ]
      },
      {
        dayNumber: 2,
        title: 'DAY 2: KNEE-FRIENDLY LOWER BODY & GLUTE ACTIVATION',
        muscleFocus: 'Quads, Glutes & Hamstrings (Zero Jumps)',
        exercises: [
          enrichExercise({ name: 'ISOMETRIC WALL SITS', calories: 90, duration: 8, muscleGroup: 'legs', defaultSets: 3, targetReps: 45, category: 'Primary Compound' }),
          enrichExercise({ name: 'WORLD GREATEST LUNGE STRETCH', calories: 50, duration: 6, muscleGroup: 'legs', defaultSets: 2, targetReps: 8, category: 'Mobility' })
        ]
      }
    ]
  }
];
