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

// Master execution guide dictionary for seamless step-by-step form instructions & smart coaching
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
      '1. High Plank Setup: Place hands on floor slightly wider than shoulder-width, palms flat, fingers pointing slightly outward.',
      '2. Core & Spine Lock: Engage glutes and brace abdominal wall so your body forms a rigid straight line from head to heels.',
      '3. Controlled Descent: Inhale and lower chest until 1-2 inches above the floor while tucking elbows back at a 45° angle.',
      '4. Explosive Press: Exhale and press through your palms to lock arms back out at peak height.'
    ],
    formTips: [
      'Keep glutes tight to prevent your lower back from sagging.',
      'Maintain a neutral neck by staring at a spot 6 inches ahead of your hands.'
    ],
    commonMistakes: [
      'Flaring elbows outward at a 90° angle (overstresses shoulder joints).',
      'Dropping hips first or letting your chin touch before your chest.'
    ],
    targetMuscles: ['Chest (Pectoralis Major)', 'Anterior Deltoids', 'Triceps Brachii', 'Core Stabilizers'],
    tempo: '2s down - 1s pause - 1s up',
    restTime: '60-90 seconds',
    category: 'Primary Compound',
    regressionTip: 'Lower knees to the floor or elevate hands onto a bench or sturdy table.',
    progressionTip: 'Elevate feet on a chair (Decline Pushups) or add a 2-second pause at the bottom.'
  },
  'DIAMOND TRICEP PUSHUPS': {
    executionSteps: [
      '1. Setup: Place hands close together directly beneath chest, forming a diamond shape with index fingers and thumbs.',
      '2. Descent: Lower your chest towards the diamond while keeping elbows pinned close to your ribcage.',
      '3. Press: Squeeze your triceps intensely and drive back up to full elbow extension.'
    ],
    formTips: ['Keep elbows tucked right beside ribs to isolate tricep lateral heads.', 'If too challenging on floor, elevate hands onto a bench.'],
    commonMistakes: ['Flaring elbows wide.', 'Arching lower back.'],
    targetMuscles: ['Triceps Brachii', 'Inner Chest', 'Anterior Deltoid'],
    tempo: '2s down - 1s pause - 1s up',
    restTime: '60 seconds',
    category: 'Accessory',
    regressionTip: 'Perform on knees or separate hands to narrow-grip width (4-6 inches apart).',
    progressionTip: 'Elevate feet or perform with a single-leg raised in mid-air.'
  },
  'PIKE PUSHUPS (SHOULDER PRESS)': {
    executionSteps: [
      '1. Setup: Begin in pushup stance, then walk feet forward while raising hips high into an inverted V-shape.',
      '2. Tripod Descent: Bend elbows to lower top of forehead diagonally forward towards floor in front of hands.',
      '3. Press Back: Push back diagonally up through your shoulders to return to the apex inverted V position.'
    ],
    formTips: ['Look back towards your feet at top of rep to keep neck safe.', 'Rise up on toes to shift maximum load to shoulder deltoids.'],
    commonMistakes: ['Bending knees excessively.', 'Lowering head straight down between hands instead of forward.'],
    targetMuscles: ['Anterior & Lateral Deltoids', 'Upper Chest', 'Triceps', 'Upper Traps'],
    tempo: '2s down - 1s pause - 1s up',
    restTime: '60-90 seconds',
    category: 'Primary Compound',
    regressionTip: 'Bend knees slightly or move hands further forward to reduce hip angle.',
    progressionTip: 'Elevate feet onto a chair or box to increase inverted vertical shoulder load.'
  },
  'EXPLOSIVE AIR SQUATS': {
    executionSteps: [
      '1. Stance: Stand with feet shoulder-width apart, toes pointing slightly outward (15-20°).',
      '2. Hinge & Sit: Initiate by pushing hips back and bending knees, lowering until thigh crease drops below top of knees.',
      '3. Stand & Squeeze: Drive firmly through your mid-foot and heels to stand up, squeezing glutes tightly at top.'
    ],
    formTips: ['Keep chest up and gaze straight ahead.', 'Ensure knees track in direction of your toes throughout the movement.'],
    commonMistakes: ['Heels lifting off ground.', 'Knees collapsing inward (valgus collapse).'],
    targetMuscles: ['Quadriceps', 'Gluteus Maximus', 'Hamstrings', 'Calves'],
    tempo: '2s down - 1s hold - 1s explosive up',
    restTime: '60 seconds',
    category: 'Primary Compound',
    regressionTip: 'Perform sit-to-stand squats onto a chair or shorten depth to parallel.',
    progressionTip: 'Add a 3-second pause at bottom depth or convert to explosive Jump Squats.'
  },
  'PLYOMETRIC JUMP LUNGES': {
    executionSteps: [
      '1. Setup: Step forward into a lunge with both front and back knees bent at 90° angles.',
      '2. Jump Explosively: Drive off floor explosively with both feet, swinging arms for momentum as you launch into air.',
      '3. Mid-Air Switch: Switch leg positions in mid-air, landing softly into a lunge on opposite side.'
    ],
    formTips: ['Land smoothly on mid-foot to absorb impact.', 'Keep torso upright and core braced.'],
    commonMistakes: ['Banging back knee hard on floor.', 'Leaning torso excessively forward.'],
    targetMuscles: ['Quadriceps', 'Hamstrings', 'Glutes', 'Calves', 'Cardio system'],
    tempo: 'Explosive continuous jumps',
    restTime: '60-90 seconds',
    category: 'Primary Compound',
    regressionTip: 'Replace jumps with fast non-jumping alternating reverse lunges.',
    progressionTip: 'Increase jump height or pause 1 second in bottom lunge position before jumping.'
  },
  'ISOMETRIC WALL SITS': {
    executionSteps: [
      '1. Setup: Lean back flat against a wall and slide down until your knees are bent at a 90° angle.',
      '2. Alignment: Ensure thighs are parallel to floor and shins are vertical directly over ankles.',
      '3. Hold: Hold your back flat against wall, hands off thighs, breathing steadily.'
    ],
    formTips: ['Press lower back flush against wall.', 'Rest hands on chest or at sides, never on legs.'],
    commonMistakes: ['Sliding too high above 90°.', 'Resting hands on knees to relieve weight.'],
    targetMuscles: ['Quadriceps', 'Gluteus Medius', 'Core'],
    tempo: 'Static isometric hold',
    restTime: '45-60 seconds',
    category: 'Accessory',
    regressionTip: 'Slide up slightly to a 100-110° knee angle.',
    progressionTip: 'Perform single-leg wall sit alternating every 15 seconds.'
  },
  'CHAIR / BENCH TRICEP DIPS': {
    executionSteps: [
      '1. Setup: Sit on edge of a sturdy chair or bed, place palms beside hips, extend legs forward.',
      '2. Descent: Slide hips off edge and lower body vertically until upper arms are parallel to floor (90° elbow bend).',
      '3. Press: Press through palms to fully extend arms and squeeze triceps at top.'
    ],
    formTips: ['Keep your spine close to the chair edge throughout movement.', 'Avoid dipping below 90° to protect shoulder capsules.'],
    commonMistakes: ['Drifting body far forward away from bench.', 'Shrugging shoulders up to ears.'],
    targetMuscles: ['Triceps Brachii', 'Lower Pectorals', 'Anterior Deltoids'],
    tempo: '2s down - 1s pause - 1s up',
    restTime: '60 seconds',
    category: 'Accessory',
    regressionTip: 'Bend knees at 90° with feet flat on floor to reduce bodyweight load.',
    progressionTip: 'Elevate feet onto a second chair in front of you.'
  },
  'HOLLOW BODY COMPRESSION HOLDS': {
    executionSteps: [
      '1. Setup: Lie face up on mat with legs straight and arms extended overhead.',
      '2. Engage: Flatten lower back into mat, then lift shoulder blades and feet 4-6 inches off floor.',
      '3. Hold: Maintain a tight banana-like curved body position while breathing steadily.'
    ],
    formTips: ['If lower back arches, lift legs higher or bring arms to sides.', 'Press belly button down into floor.'],
    commonMistakes: ['Arching lumbar spine off floor.', 'Tucking chin into chest excessively.'],
    targetMuscles: ['Rectus Abdominis', 'Transverse Abdominis', 'Hip Flexors'],
    tempo: 'Static compression hold',
    restTime: '45 seconds',
    category: 'Finisher',
    regressionTip: 'Tuck knees to chest or extend arms forward beside thighs.',
    progressionTip: 'Add gentle hollow body rocking back and forth without losing spinal curve.'
  },
  'RAPID MOUNTAIN CLIMBERS': {
    executionSteps: [
      '1. Setup: Assume a high plank position with wrists directly under shoulders and body straight.',
      '2. Knee Drive: Drive right knee toward chest without letting hips rise or bounce.',
      '3. Rapid Switch: Quickly extend right leg back while simultaneously driving left knee to chest in running motion.'
    ],
    formTips: ['Keep shoulders stacked directly over hands.', 'Maintain constant core tension.'],
    commonMistakes: ['Piking hips up in air.', 'Sagging lower back.'],
    targetMuscles: ['Core / Abs', 'Hip Flexors', 'Shoulder Girdle', 'Cardio'],
    tempo: 'Rapid high frequency',
    restTime: '45-60 seconds',
    category: 'Finisher',
    regressionTip: 'Perform slow, controlled step-ins without jumping switch.',
    progressionTip: 'Drive knees cross-body toward opposite elbow (Cross-Body Climbers).'
  },
  'FULL BODY BURPEE SPRINTS': {
    executionSteps: [
      '1. Setup: Stand tall with feet hip-width apart.',
      '2. Drop: Bend knees, plant hands flat on floor, and kick feet back into a plank position.',
      '3. Pushup & Hop: Lower chest to floor, push up, jump feet forward near hands, and jump explosively overhead with a hand clap.'
    ],
    formTips: ['Pace yourself smoothly for continuous reps.', 'Land softly on mid-foot.'],
    commonMistakes: ['Sagging back during plank kick-back.', 'Skipping the vertical jump.'],
    targetMuscles: ['Full Body', 'Quadriceps', 'Chest', 'Core', 'Cardiovascular System'],
    tempo: 'Fluid explosive motion',
    restTime: '60-90 seconds',
    category: 'Finisher',
    regressionTip: 'Step feet back one at a time without chest-to-floor pushup.',
    progressionTip: 'Perform tuck-jump at peak or add a double pushup at bottom.'
  },
  'ASSISTED PISTOL SQUAT PROGRESSION': {
    executionSteps: [
      '1. Setup: Stand on one leg in front of a doorframe, pole, or chair for light balance support.',
      '2. Extend Leg: Extend non-working leg straight out in front off floor.',
      '3. Deep Single-Leg Squat: Lower hips back down smoothly on working leg until thigh passes horizontal.',
      '4. Drive Up: Press through mid-foot and heel to return to standing position.'
    ],
    formTips: ['Use doorframe for minimal guidance, force working leg to bear 90% of load.', 'Keep working heel grounded throughout rep.'],
    commonMistakes: ['Lifting working heel off floor.', 'Pulling excessively with upper body.'],
    targetMuscles: ['Quadriceps', 'Gluteus Maximus', 'Hamstrings', 'Ankle Stabilizers', 'Core'],
    tempo: '3s down - 1s pause - 1s up',
    restTime: '60-90 seconds',
    category: 'Primary Compound',
    regressionTip: 'Squat down onto a high chair seat or box single-legged.',
    progressionTip: 'Release hands completely for full unassisted Pistol Squat.'
  },
  'DOORWAY BODYWEIGHT ROWS': {
    executionSteps: [
      '1. Setup: Stand inside a doorway, grip both sides of doorframe at chest level with feet near base.',
      '2. Lean Back: Extend arms fully and lean back so body hangs at a 45° angle.',
      '3. Pull & Squeeze: Pull chest forward between doorframe by driving elbows back and squeezing shoulder blades.',
      '4. Lower: Slowly extend arms under 2-3 second control back to starting hang.'
    ],
    formTips: ['Keep body straight as a board from head to heels.', 'Incorporate a 1-second squeeze at peak contraction.'],
    commonMistakes: ['Bending hips or sagging glutes.', 'Pulling with wrists instead of back lats.'],
    targetMuscles: ['Latissimus Dorsi', 'Rhomboids', 'Rear Deltoids', 'Biceps', 'Core'],
    tempo: '2s down - 1s pause - 1s up',
    restTime: '60 seconds',
    category: 'Primary Compound',
    regressionTip: 'Walk feet slightly backwards to stand more upright and lighten resistance.',
    progressionTip: 'Walk feet further forward beneath doorframe to steepen body angle.'
  },
  'PLANK-TO-PUSHUP COMMANDOS': {
    executionSteps: [
      '1. Setup: Begin in a forearm plank position with elbows under shoulders.',
      '2. Up Phase: Press right hand onto floor, then left hand, pushing up into a full hand plank.',
      '3. Down Phase: Lower right forearm back to floor, followed by left forearm to return to forearm plank.',
      '4. Alternate: Repeat while alternating starting arm each rep.'
    ],
    formTips: ['Minimize hip twisting by bracing glutes and abs hard.', 'Keep palms directly under shoulders.'],
    commonMistakes: ['Excessive rocking hips side to side.', 'Piking hips in air.'],
    targetMuscles: ['Triceps', 'Anterior Deltoids', 'Chest', 'Core Stabilizers'],
    tempo: 'Smooth continuous motion',
    restTime: '60 seconds',
    category: 'Accessory',
    regressionTip: 'Perform commandos with knees resting on floor.',
    progressionTip: 'Pause in forearm plank for 2 seconds between each up-down rep.'
  },
  'SKATER HOP LATERAL JUMPS': {
    executionSteps: [
      '1. Setup: Stand on right leg with knee slightly bent.',
      '2. Lateral Bound: Bound laterally to the left, landing softly on left foot while sweeping right leg behind.',
      '3. Reverse Bound: Immediately push off left foot and bound back to right leg.',
      '4. Rhythm: Swing arms naturally to maintain speed and lateral balance.'
    ],
    formTips: ['Land softly on mid-foot with knee bent to absorb impact.', 'Keep chest upright.'],
    commonMistakes: ['Landing stiff-legged.', 'Stumbling or losing balance.'],
    targetMuscles: ['Gluteus Medius', 'Quadriceps', 'Calves', 'Ankle Stabilizers', 'Cardio'],
    tempo: 'Explosive lateral jumps',
    restTime: '45-60 seconds',
    category: 'Primary Compound',
    regressionTip: 'Perform lateral side-steps without explosive flight time.',
    progressionTip: 'Increase lateral jump distance or touch ground with hand on each landing.'
  },
  'BEAR CRAWL ISOMETRIC HOLDS': {
    executionSteps: [
      '1. Setup: Begin on hands and knees with wrists directly under shoulders and knees under hips.',
      '2. Lift Knees: Tuck toes and hover knees 1-2 inches above the floor.',
      '3. Rigid Hold: Hold position with flat back, braced abs, and knees hovering without touching floor.'
    ],
    formTips: ['Keep back completely flat like a tabletop.', 'Breathe deeply through nose into abdomen.'],
    commonMistakes: ['Raising hips too high.', 'Letting lower back arch down.'],
    targetMuscles: ['Transverse Abdominis', 'Quadriceps', 'Shoulder Girdle', 'Serratus Anterior'],
    tempo: 'Static isometric hold',
    restTime: '45 seconds',
    category: 'Accessory',
    regressionTip: 'Rest knees briefly on floor every 5 seconds.',
    progressionTip: 'Crawl forward 3 paces and backward 3 paces while keeping knees hovering.'
  },
  'V-UP ABDOMINAL CRUNCHES': {
    executionSteps: [
      '1. Setup: Lie face up on floor with legs extended straight and arms extended overhead.',
      '2. Explosive Lift: Simultaneously lift torso and legs off floor, reaching hands towards toes to form a "V" shape.',
      '3. Controlled Lower: Lower body back down under control without letting heels or shoulders touch floor.'
    ],
    formTips: ['Exhale sharply as you reach top "V" position.', 'Keep legs as straight as mobility allows.'],
    commonMistakes: ['Using swinging momentum.', 'Bending knees excessively.'],
    targetMuscles: ['Rectus Abdominis', 'Hip Flexors', 'Upper & Lower Core'],
    tempo: '1s up - 1s pause - 2s down',
    restTime: '45-60 seconds',
    category: 'Primary Compound',
    regressionTip: 'Perform Tuck Crunches with knees bent at 90° bringing chest to knees.',
    progressionTip: 'Hold a 1-second pause at the peak V-position on every rep.'
  },
  'WALL WALK-UPS TO HANDSTAND HOLD': {
    executionSteps: [
      '1. Setup: Begin in a high plank position with heels touching a wall behind you.',
      '2. Walk Up: Step feet up the wall while walking hands backward towards the wall.',
      '3. Vertical Position: Walk as close to wall as comfortable into a vertical handstand, pressing shoulders up.',
      '4. Descent: Walk hands forward and feet down wall under control to return to plank.'
    ],
    formTips: ['Press floor away strongly to lock out shoulders.', 'Brace glutes to prevent back arching.'],
    commonMistakes: ['Arching lower back into a banana curve.', 'Collapsing shoulders.'],
    targetMuscles: ['Deltoids', 'Upper Traps', 'Triceps', 'Core Stabilizers'],
    tempo: 'Controlled climb & hold',
    restTime: '90 seconds',
    category: 'Primary Compound',
    regressionTip: 'Walk feet halfway up wall into a 45° inverted pike position.',
    progressionTip: 'Hold peak vertical handstand for 15-30 seconds before walking down.'
  },
  'L-SIT TUCKED FLOOR PRESS': {
    executionSteps: [
      '1. Setup: Sit on floor with legs extended straight. Place palms flat on floor beside hips.',
      '2. Press & Lift: Press palms down firmly, lock arms out, and lift hips and buttocks off floor.',
      '3. Tuck Knees: Tuck knees into chest and hold feet off floor in a suspended tucked position.'
    ],
    formTips: ['Depress shoulders down away from ears.', 'Compress abdomen hard to lift feet.'],
    commonMistakes: ['Shoulders shrugging up.', 'Feet dragging on carpet.'],
    targetMuscles: ['Core', 'Hip Flexors', 'Triceps', 'Lats & Serratus'],
    tempo: 'Static compression hold',
    restTime: '60 seconds',
    category: 'Primary Compound',
    regressionTip: 'Keep heels resting lightly on floor while lifting hips.',
    progressionTip: 'Extend one or both legs straight out parallel to floor (Full L-Sit).'
  },
  'THORACIC CAT-COW FLOW': {
    executionSteps: [
      '1. Setup: Start on hands and knees with wrists under shoulders and knees under hips.',
      '2. Cow Position: Inhale, drop belly towards floor, lift chest and tailbone upward.',
      '3. Cat Position: Exhale, round spine upward towards ceiling, tuck chin to chest and tuck tailbone.',
      '4. Flow: Alternate between Cat and Cow smoothly with breath rhythm.'
    ],
    formTips: ['Move fluidly through each segment of spine.', 'Focus on thoracic upper spine flex.'],
    commonMistakes: ['Jerking movements.', 'Holding breath.'],
    targetMuscles: ['Spinal Erectors', 'Core', 'Thoracic Spine', 'Neck Stabilizers'],
    tempo: 'Smooth breath flow',
    restTime: '30 seconds',
    category: 'Warm-Up',
    regressionTip: 'Reduce range of motion if spinal discomfort occurs.',
    progressionTip: 'Pause 3 seconds at full Cat and full Cow extension.'
  },
  'WORLD GREATEST LUNGE STRETCH': {
    executionSteps: [
      '1. Setup: Step forward into a deep lunge position with right foot forward and left leg extended straight back.',
      '2. Elbow Drive: Place hands on floor inside right foot. Lower right elbow towards right ankle.',
      '3. Rotation: Reach right hand up towards ceiling, rotating torso to look at right hand.',
      '4. Switch: Return hands to floor, step back into plank and repeat on opposite side.'
    ],
    formTips: ['Keep back leg actively engaged with heel pushed back.', 'Breathe deeply through rotation.'],
    commonMistakes: ['Collapsing back knee to floor.', 'Rushing through rotation.'],
    targetMuscles: ['Hip Flexors', 'Hamstrings', 'Thoracic Spine', 'Adductors'],
    tempo: 'Dynamic mobility flow',
    restTime: '30 seconds',
    category: 'Warm-Up',
    regressionTip: 'Rest back knee gently on a mat for stability.',
    progressionTip: 'Add a hamstring hamstring stretch shift backward before rotating.'
  },
  'BARBELL BENCH PRESS': {
    executionSteps: [
      '1. Setup: Lie on bench with eyes under bar. Grip bar slightly wider than shoulders, plant feet flat on floor.',
      '2. Arch & Set: Squeeze shoulder blades together into bench and unrack bar over chest.',
      '3. Controlled Lower: Inhale, lower bar in controlled path to mid-chest while tucking elbows at 45°.',
      '4. Drive: Exhale and press bar explosively back up over shoulders to lockout.'
    ],
    formTips: ['Keep feet firmly planted on floor for leg drive.', 'Maintain upper back arch throughout set.'],
    commonMistakes: ['Bouncing bar off chest.', 'Flaring elbows outward at 90°.'],
    targetMuscles: ['Pectoralis Major', 'Anterior Deltoids', 'Triceps Brachii'],
    tempo: '3s down - 1s pause - 1s up',
    restTime: '90-120 seconds',
    category: 'Primary Compound',
    regressionTip: 'Use lighter dumbbells or floor press with dumbbells.',
    progressionTip: 'Add pause press at chest or increase load progressively.'
  },
  'BARBELL BACK SQUATS': {
    executionSteps: [
      '1. Setup: Step under bar resting it across upper traps. Unrack bar and take 2 steps back.',
      '2. Stance: Feet shoulder-width apart, toes turned out 15-30°.',
      '3. Squat: Inhale deep into belly, push hips back and bend knees, lowering until thigh crease is below knee level.',
      '4. Drive: Exhale, drive through mid-foot and heels to stand up tall.'
    ],
    formTips: ['Keep chest up and knees tracking over toes.', 'Brace core with Valsalva maneuver before descent.'],
    commonMistakes: ['Rounding lower back at bottom.', 'Knees caving inward.'],
    targetMuscles: ['Quadriceps', 'Gluteus Maximus', 'Hamstrings', 'Core & Lower Back'],
    tempo: '3s down - 1s pause - 1s up',
    restTime: '120-180 seconds',
    category: 'Primary Compound',
    regressionTip: 'Goblet squat with a single dumbbell or bodyweight air squat.',
    progressionTip: 'Increase bar weight or perform tempo squats with 4s descent.'
  },
  'BARBELL DEADLIFT': {
    executionSteps: [
      '1. Setup: Stand with shins 1 inch from bar, feet hip-width apart. Hinge hips to grip bar outside knees.',
      '2. Wedge & Tension: Pull chest up, pull slack out of bar, flatten back and contract lats.',
      '3. Drive: Inhale, push floor away with legs until bar reaches knees, then drive hips forward to lockout.'
    ],
    formTips: ['Keep bar sliding along shins and thighs.', 'Lock out hips by squeezing glutes, not leaning back.'],
    commonMistakes: ['Rounding lumbar spine.', 'Jerking bar off floor without pulling slack.'],
    targetMuscles: ['Hamstrings', 'Glutes', 'Erector Spinae', 'Lats & Upper Back', 'Grip'],
    tempo: 'Explosive up - 2s controlled down',
    restTime: '120-180 seconds',
    category: 'Primary Compound',
    regressionTip: 'Dumbbell Romanian Deadlift or Trap-Bar Deadlift.',
    progressionTip: 'Increase load or introduce deficit deadlifts.'
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

  // Generic fallback enrichment for custom or unmatched exercises
  return {
    ...ex,
    executionSteps: ex.executionSteps || [
      `1. Setup: Position body securely for ${ex.name} with proper posture and spine alignment.`,
      `2. Movement Phase: Perform the concentric phase under control focusing on ${ex.muscleGroup.toUpperCase()} activation.`,
      `3. Peak Contraction: Squeeze targeted muscle group at peak of movement for 1 second.`,
      `4. Return Phase: Lower under 2-3 second control back to starting position.`
    ],
    formTips: ex.formTips || [
      'Maintain steady breathing (inhale on stretch, exhale on effort).',
      'Keep core engaged and avoid momentum or swinging.'
    ],
    commonMistakes: ex.commonMistakes || [
      'Using momentum or rapid un-controlled dropping.',
      'Shortening range of motion.'
    ],
    targetMuscles: ex.targetMuscles || [ex.muscleGroup.toUpperCase(), 'Stabilizing Core Muscles'],
    tempo: ex.tempo || '2s down - 1s pause - 1s up',
    restTime: ex.restTime || '60 seconds',
    category: ex.category || (ex.defaultSets && ex.defaultSets >= 4 ? 'Primary Compound' : 'Accessory'),
    regressionTip: ex.regressionTip || 'Reduce speed, slow down reps, or shorten range of motion slightly.',
    progressionTip: ex.progressionTip || 'Add a 2-second isometric pause at peak contraction or increase total reps.'
  };
}

export const BUILT_IN_WORKOUT_PROGRAMS: WorkoutPlanItem[] = [
  // =========================================================================
  // PROGRAM 1: 8-WEEK NO-EQUIPMENT CALISTHENICS & BODYWEIGHT SHRED (2 MONTHS)
  // 100% PURE BODYWEIGHT (0 EQUIPMENT LEAKAGE)
  // =========================================================================
  {
    id: '8week_no_equipment_calisthenics_shred',
    name: '8-WEEK NO-EQUIPMENT CALISTHENICS & BODYWEIGHT SHRED',
    area: '2-Month Bodyweight Progression',
    tag: 'Calisthenics',
    equipment: 'No Equipment',
    targetGoal: 'calisthenics',
    durationWeeks: 8,
    daysPerWeek: 5,
    recommendedBodyType: 'All Body Types / Zero Gear Home Training',
    compatibilityNote: '100% equipment-free guaranteed. 6-8 structured exercises per session designed for 2-month linear bodyweight progress.',
    description: 'Complete 8-Week (2 Month) calisthenics system with 6-8 daily exercises spanning Warm-up, Push, Pull, Leg Overload, Core & Mobility.',
    days: [
      {
        dayNumber: 1,
        title: 'DAY 1: CHEST & TRICEPS OVERLOAD MATRIX',
        muscleFocus: 'Upper Push, Chest & Triceps',
        exercises: [
          enrichExercise({ name: 'ARM CIRCLES & SHOULDER TAPS', calories: 40, duration: 5, muscleGroup: 'shoulders', tag: 'Warm-Up', equipment: 'None', details: '2 sets × 15 reps warm-up', defaultSets: 2, targetReps: 15, category: 'Warm-Up' }),
          enrichExercise({ name: 'STANDARD FLOOR PUSHUPS', calories: 120, duration: 10, muscleGroup: 'chest', tag: 'Calisthenics', equipment: 'None', details: '4 sets × 20 reps (Strict form, chest to floor)', defaultSets: 4, targetReps: 20, category: 'Primary Compound' }),
          enrichExercise({ name: 'DECLINE CHAIR PUSHUPS', calories: 110, duration: 8, muscleGroup: 'chest', tag: 'Calisthenics', equipment: 'None', details: '4 sets × 15 reps (Feet elevated on chair)', defaultSets: 4, targetReps: 15, category: 'Primary Compound' }),
          enrichExercise({ name: 'DIAMOND TRICEP PUSHUPS', calories: 100, duration: 8, muscleGroup: 'arms', tag: 'Calisthenics', equipment: 'None', details: '3 sets × 12 reps (Triceps focus)', defaultSets: 3, targetReps: 12, category: 'Accessory' }),
          enrichExercise({ name: 'CHAIR / BENCH TRICEP DIPS', calories: 90, duration: 8, muscleGroup: 'arms', tag: 'Calisthenics', equipment: 'None', details: '3 sets × 15 reps (Full lockouts)', defaultSets: 3, targetReps: 15, category: 'Accessory' }),
          enrichExercise({ name: 'WIDE HAND EXPLOSIVE PUSHUPS', calories: 110, duration: 8, muscleGroup: 'chest', tag: 'Calisthenics', equipment: 'None', details: '3 sets × 12 reps', defaultSets: 3, targetReps: 12, category: 'Accessory' }),
          enrichExercise({ name: 'PLANK SHOULDER TAPS', calories: 80, duration: 6, muscleGroup: 'core', tag: 'Core', equipment: 'None', details: '3 sets × 20 taps', defaultSets: 3, targetReps: 20, category: 'Finisher' }),
          enrichExercise({ name: 'CHEST & TRICEP DOORWAY STRETCH', calories: 30, duration: 5, muscleGroup: 'chest', tag: 'Mobility', equipment: 'None', details: '2 sets × 45s holds', defaultSets: 2, targetReps: 45, category: 'Mobility' })
        ]
      },
      {
        dayNumber: 2,
        title: 'DAY 2: EXPLOSIVE QUAD & GLUTE CAPACITY',
        muscleFocus: 'Quads, Hamstrings & Calves',
        exercises: [
          enrichExercise({ name: 'STANDING BODYWEIGHT LEG SWINGS', calories: 40, duration: 5, muscleGroup: 'legs', tag: 'Warm-Up', equipment: 'None', details: '2 sets × 15 swings per leg', defaultSets: 2, targetReps: 15, category: 'Warm-Up' }),
          enrichExercise({ name: 'EXPLOSIVE AIR SQUATS', calories: 140, duration: 12, muscleGroup: 'legs', tag: 'Calisthenics', equipment: 'None', details: '4 sets × 25 reps (Break 90 degree depth)', defaultSets: 4, targetReps: 25, category: 'Primary Compound' }),
          enrichExercise({ name: 'PLYOMETRIC JUMP LUNGES', calories: 160, duration: 10, muscleGroup: 'legs', tag: 'Athletic', equipment: 'None', details: '4 sets × 16 jump switch reps', defaultSets: 4, targetReps: 16, category: 'Primary Compound' }),
          enrichExercise({ name: 'BULGARIAN BODYWEIGHT SPLIT SQUATS', calories: 130, duration: 10, muscleGroup: 'legs', tag: 'Calisthenics', equipment: 'None', details: '3 sets × 12 reps per leg', defaultSets: 3, targetReps: 12, category: 'Accessory' }),
          enrichExercise({ name: 'GLUTE BRIDGES WITH 2S HOLD', calories: 110, duration: 8, muscleGroup: 'legs', tag: 'Calisthenics', equipment: 'None', details: '4 sets × 18 reps', defaultSets: 4, targetReps: 18, category: 'Accessory' }),
          enrichExercise({ name: 'ISOMETRIC WALL SITS', calories: 100, duration: 8, muscleGroup: 'legs', tag: 'Calisthenics', equipment: 'None', details: '3 sets × 60s static wall holds', defaultSets: 3, targetReps: 60, category: 'Accessory' }),
          enrichExercise({ name: 'SINGLE-LEG CALF RAISES', calories: 80, duration: 8, muscleGroup: 'legs', tag: 'Calisthenics', equipment: 'None', details: '4 sets × 20 reps per calf', defaultSets: 4, targetReps: 20, category: 'Finisher' }),
          enrichExercise({ name: 'QUAD & QUADRICEPS MAT STRETCH', calories: 30, duration: 5, muscleGroup: 'legs', tag: 'Mobility', equipment: 'None', details: '2 sets × 45s holds', defaultSets: 2, targetReps: 45, category: 'Mobility' })
        ]
      },
      {
        dayNumber: 3,
        title: 'DAY 3: INVERTED PULL & LAT DENSITY',
        muscleFocus: 'Lats, Upper Back & Biceps',
        exercises: [
          enrichExercise({ name: 'THORACIC CAT-COW FLOW', calories: 40, duration: 5, muscleGroup: 'back', tag: 'Warm-Up', equipment: 'None', details: '2 sets × 12 reps', defaultSets: 2, targetReps: 12, category: 'Warm-Up' }),
          enrichExercise({ name: 'DOORWAY BODYWEIGHT ROWS', calories: 130, duration: 10, muscleGroup: 'back', tag: 'Calisthenics', equipment: 'None', details: '4 sets × 15 reps (Squeeze lats)', defaultSets: 4, targetReps: 15, category: 'Primary Compound' }),
          enrichExercise({ name: 'PRONE SUPERMAN LAT EXTENSIONS', calories: 110, duration: 8, muscleGroup: 'back', tag: 'Calisthenics', equipment: 'None', details: '4 sets × 20 reps (2s peak hold)', defaultSets: 4, targetReps: 20, category: 'Primary Compound' }),
          enrichExercise({ name: 'REVERSE SHOULDER FLY EXTENSIONS', calories: 90, duration: 8, muscleGroup: 'shoulders', tag: 'Calisthenics', equipment: 'None', details: '3 sets × 15 prone flys', defaultSets: 3, targetReps: 15, category: 'Accessory' }),
          enrichExercise({ name: 'ISOMETRIC BICEP TENSION HOLDS', calories: 100, duration: 8, muscleGroup: 'arms', tag: 'Calisthenics', equipment: 'None', details: '3 sets × 30s max pull hold', defaultSets: 3, targetReps: 30, category: 'Accessory' }),
          enrichExercise({ name: 'BIRD DOG BALANCE EXTENSIONS', calories: 80, duration: 6, muscleGroup: 'core', tag: 'Core', equipment: 'None', details: '3 sets × 12 per side', defaultSets: 3, targetReps: 12, category: 'Accessory' }),
          enrichExercise({ name: 'PRONE COBRA BACK EXTENSION', calories: 70, duration: 6, muscleGroup: 'back', tag: 'Calisthenics', equipment: 'None', details: '3 sets × 15 reps', defaultSets: 3, targetReps: 15, category: 'Finisher' }),
          enrichExercise({ name: 'CHILD POSE LAT DECOMPRESSION', calories: 30, duration: 5, muscleGroup: 'back', tag: 'Mobility', equipment: 'None', details: '2 sets × 60s holds', defaultSets: 2, targetReps: 60, category: 'Mobility' })
        ]
      },
      {
        dayNumber: 4,
        title: 'DAY 4: ABDOMINAL FORTRESS & HOLLOW HOLDS',
        muscleFocus: 'Abs, Obliques & Core Bracing',
        exercises: [
          enrichExercise({ name: 'STANDING CORE TWISTS', calories: 30, duration: 4, muscleGroup: 'core', tag: 'Warm-Up', equipment: 'None', details: '2 sets × 20 twists', defaultSets: 2, targetReps: 20, category: 'Warm-Up' }),
          enrichExercise({ name: 'HOLLOW BODY COMPRESSION HOLDS', calories: 100, duration: 8, muscleGroup: 'core', tag: 'Calisthenics', equipment: 'None', details: '4 sets × 45s hollow body hold', defaultSets: 4, targetReps: 45, category: 'Primary Compound' }),
          enrichExercise({ name: 'RAPID MOUNTAIN CLIMBERS', calories: 120, duration: 8, muscleGroup: 'core', tag: 'Athletic', equipment: 'None', details: '4 sets × 30s fast knee drives', defaultSets: 4, targetReps: 30, category: 'Primary Compound' }),
          enrichExercise({ name: 'BICYCLE CRUNCH SPRINTS', calories: 110, duration: 8, muscleGroup: 'core', tag: 'Calisthenics', equipment: 'None', details: '4 sets × 30 reps', defaultSets: 4, targetReps: 30, category: 'Accessory' }),
          enrichExercise({ name: 'SIDE PLANK OBLIQUE DIP LIFTS', calories: 90, duration: 8, muscleGroup: 'core', tag: 'Calisthenics', equipment: 'None', details: '3 sets × 15 reps per side', defaultSets: 3, targetReps: 15, category: 'Accessory' }),
          enrichExercise({ name: 'REVERSE CRUNCH KNEE LIFTS', calories: 80, duration: 8, muscleGroup: 'core', tag: 'Calisthenics', equipment: 'None', details: '3 sets × 20 controlled lower abdominal lifts', defaultSets: 3, targetReps: 20, category: 'Accessory' }),
          enrichExercise({ name: 'FOREARM PLANK RIGID HOLD', calories: 90, duration: 6, muscleGroup: 'core', tag: 'Core', equipment: 'None', details: '3 sets × 60s rigid plank', defaultSets: 3, targetReps: 60, category: 'Finisher' }),
          enrichExercise({ name: 'COBRA spine STRETCH', calories: 30, duration: 5, muscleGroup: 'back', tag: 'Mobility', equipment: 'None', details: '2 sets × 45s gentle stretch', defaultSets: 2, targetReps: 45, category: 'Mobility' })
        ]
      },
      {
        dayNumber: 5,
        title: 'DAY 5: METABOLIC BURPEE & SHOULDER PIKE',
        muscleFocus: 'Deltoids, Upper Body & Full Body Cardio',
        exercises: [
          enrichExercise({ name: 'JUMPING JACK WARMUP', calories: 50, duration: 5, muscleGroup: 'cardio', tag: 'Warm-Up', equipment: 'None', details: '2 sets × 60s steady pace', defaultSets: 2, targetReps: 60, category: 'Warm-Up' }),
          enrichExercise({ name: 'PIKE PUSHUPS (SHOULDER PRESS)', calories: 120, duration: 10, muscleGroup: 'shoulders', tag: 'Calisthenics', equipment: 'None', details: '4 sets × 12 reps (Hips high, head down)', defaultSets: 4, targetReps: 12, category: 'Primary Compound' }),
          enrichExercise({ name: 'FULL BODY BURPEE SPRINTS', calories: 180, duration: 12, muscleGroup: 'cardio', tag: 'Athletic', equipment: 'None', details: '5 sets × 15 explosive burpees', defaultSets: 5, targetReps: 15, category: 'Primary Compound' }),
          enrichExercise({ name: 'HIGH KNEE CARDIO SPRINTS', calories: 130, duration: 10, muscleGroup: 'cardio', tag: 'Cardio', equipment: 'None', details: '4 sets × 45s max frequency sprint', defaultSets: 4, targetReps: 45, category: 'Accessory' }),
          enrichExercise({ name: 'SQUAT JUMP TUCK LANDINGS', calories: 150, duration: 10, muscleGroup: 'legs', tag: 'Athletic', equipment: 'None', details: '4 sets × 15 vertical tuck jumps', defaultSets: 4, targetReps: 15, category: 'Accessory' }),
          enrichExercise({ name: 'PLANK-TO-PUSHUP COMMANDOS', calories: 110, duration: 8, muscleGroup: 'core', tag: 'Calisthenics', equipment: 'None', details: '3 sets × 12 up-down reps', defaultSets: 3, targetReps: 12, category: 'Accessory' }),
          enrichExercise({ name: 'WALL WALK-UPS TO HANDSTAND HOLD', calories: 100, duration: 8, muscleGroup: 'shoulders', tag: 'Calisthenics', equipment: 'None', details: '3 sets × 30s wall holds', defaultSets: 3, targetReps: 30, category: 'Finisher' }),
          enrichExercise({ name: 'WORLD GREATEST LUNGE STRETCH', calories: 40, duration: 5, muscleGroup: 'legs', tag: 'Mobility', equipment: 'None', details: '2 sets × 8 per side', defaultSets: 2, targetReps: 8, category: 'Mobility' })
        ]
      }
    ]
  },

  // =========================================================================
  // PROGRAM 2: NEW! 4-WEEK NO-EQUIPMENT METABOLIC FAT BURN & SHRED (1 MONTH)
  // 100% PURE BODYWEIGHT - HIGH DENSITY HIIT & FAT BURNING
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
    compatibilityNote: '100% equipment-free high-density metabolic training. High calorie burn per minute with zero equipment required.',
    description: 'High-energy 4-Week bodyweight fat burn protocol engineered with fast-paced plyometric intervals and bodyweight density circuits.',
    days: [
      {
        dayNumber: 1,
        title: 'DAY 1: HIGH-FREQUENCY HIIT & LOWER BODY BURN',
        muscleFocus: 'Legs, Heart Rate & Full Body Calorie Burn',
        exercises: [
          enrichExercise({ name: 'JUMPING JACK WARMUP', calories: 50, duration: 5, muscleGroup: 'cardio', tag: 'Warm-Up', equipment: 'None', details: '2 sets × 60s warm-up', defaultSets: 2, targetReps: 60, category: 'Warm-Up' }),
          enrichExercise({ name: 'EXPLOSIVE AIR SQUATS', calories: 150, duration: 10, muscleGroup: 'legs', tag: 'HIIT', equipment: 'None', details: '4 sets × 25 rapid reps', defaultSets: 4, targetReps: 25, category: 'Primary Compound' }),
          enrichExercise({ name: 'SKATER HOP LATERAL JUMPS', calories: 160, duration: 10, muscleGroup: 'legs', tag: 'HIIT', equipment: 'None', details: '4 sets × 20 bounds per side', defaultSets: 4, targetReps: 20, category: 'Primary Compound' }),
          enrichExercise({ name: 'RAPID MOUNTAIN CLIMBERS', calories: 140, duration: 8, muscleGroup: 'core', tag: 'HIIT', equipment: 'None', details: '4 sets × 40s max speed', defaultSets: 4, targetReps: 40, category: 'Accessory' }),
          enrichExercise({ name: 'PLYOMETRIC JUMP LUNGES', calories: 170, duration: 10, muscleGroup: 'legs', tag: 'HIIT', equipment: 'None', details: '4 sets × 16 jump switches', defaultSets: 4, targetReps: 16, category: 'Accessory' }),
          enrichExercise({ name: 'ISOMETRIC WALL SITS', calories: 100, duration: 8, muscleGroup: 'legs', tag: 'Burnout', equipment: 'None', details: '3 sets × 60s hold', defaultSets: 3, targetReps: 60, category: 'Finisher' }),
          enrichExercise({ name: 'QUAD & QUADRICEPS MAT STRETCH', calories: 30, duration: 5, muscleGroup: 'legs', tag: 'Mobility', equipment: 'None', details: '2 sets × 45s holds', defaultSets: 2, targetReps: 45, category: 'Mobility' })
        ]
      },
      {
        dayNumber: 2,
        title: 'DAY 2: EXPLOSIVE UPPER BODY PUSH & CORE SHRED',
        muscleFocus: 'Chest, Shoulders, Triceps & Abs',
        exercises: [
          enrichExercise({ name: 'ARM CIRCLES & SHOULDER TAPS', calories: 40, duration: 5, muscleGroup: 'shoulders', tag: 'Warm-Up', equipment: 'None', details: '2 sets × 15 reps', defaultSets: 2, targetReps: 15, category: 'Warm-Up' }),
          enrichExercise({ name: 'STANDARD FLOOR PUSHUPS', calories: 130, duration: 10, muscleGroup: 'chest', tag: 'Shred', equipment: 'None', details: '4 sets × 18 strict reps', defaultSets: 4, targetReps: 18, category: 'Primary Compound' }),
          enrichExercise({ name: 'PIKE PUSHUPS (SHOULDER PRESS)', calories: 120, duration: 10, muscleGroup: 'shoulders', tag: 'Calisthenics', equipment: 'None', details: '4 sets × 12 reps', defaultSets: 4, targetReps: 12, category: 'Primary Compound' }),
          enrichExercise({ name: 'PLANK-TO-PUSHUP COMMANDOS', calories: 110, duration: 8, muscleGroup: 'core', tag: 'Core HIIT', equipment: 'None', details: '4 sets × 12 up-downs', defaultSets: 4, targetReps: 12, category: 'Accessory' }),
          enrichExercise({ name: 'CHAIR / BENCH TRICEP DIPS', calories: 100, duration: 8, muscleGroup: 'arms', tag: 'Burnout', equipment: 'None', details: '3 sets × 15 reps', defaultSets: 3, targetReps: 15, category: 'Accessory' }),
          enrichExercise({ name: 'BICYCLE CRUNCH SPRINTS', calories: 100, duration: 8, muscleGroup: 'core', tag: 'Abs', equipment: 'None', details: '4 sets × 30 fast twists', defaultSets: 4, targetReps: 30, category: 'Finisher' }),
          enrichExercise({ name: 'CHEST & TRICEP DOORWAY STRETCH', calories: 30, duration: 5, muscleGroup: 'chest', tag: 'Mobility', equipment: 'None', details: '2 sets × 45s holds', defaultSets: 2, targetReps: 45, category: 'Mobility' })
        ]
      },
      {
        dayNumber: 3,
        title: 'DAY 3: FULL BODY CARDIO INFERNO & BURPEE SPRINT',
        muscleFocus: 'Full Body Cardiovascular System & Stamina',
        exercises: [
          enrichExercise({ name: 'JUMPING JACK WARMUP', calories: 50, duration: 5, muscleGroup: 'cardio', tag: 'Warm-Up', equipment: 'None', details: '2 sets × 60s', defaultSets: 2, targetReps: 60, category: 'Warm-Up' }),
          enrichExercise({ name: 'FULL BODY BURPEE SPRINTS', calories: 200, duration: 12, muscleGroup: 'cardio', tag: 'HIIT', equipment: 'None', details: '5 sets × 15 explosive burpees', defaultSets: 5, targetReps: 15, category: 'Primary Compound' }),
          enrichExercise({ name: 'BEAR CRAWL ISOMETRIC HOLDS', calories: 110, duration: 8, muscleGroup: 'core', tag: 'Metabolic', equipment: 'None', details: '4 sets × 45s knee hover hold', defaultSets: 4, targetReps: 45, category: 'Primary Compound' }),
          enrichExercise({ name: 'SKATER HOP LATERAL JUMPS', calories: 140, duration: 10, muscleGroup: 'legs', tag: 'Cardio', equipment: 'None', details: '4 sets × 18 bounds per side', defaultSets: 4, targetReps: 18, category: 'Accessory' }),
          enrichExercise({ name: 'HIGH KNEE CARDIO SPRINTS', calories: 130, duration: 8, muscleGroup: 'cardio', tag: 'Cardio', equipment: 'None', details: '4 sets × 45s sprint', defaultSets: 4, targetReps: 45, category: 'Accessory' }),
          enrichExercise({ name: 'HOLLOW BODY COMPRESSION HOLDS', calories: 90, duration: 6, muscleGroup: 'core', tag: 'Core', equipment: 'None', details: '3 sets × 40s hold', defaultSets: 3, targetReps: 40, category: 'Finisher' }),
          enrichExercise({ name: 'WORLD GREATEST LUNGE STRETCH', calories: 40, duration: 5, muscleGroup: 'legs', tag: 'Mobility', equipment: 'None', details: '2 sets × 8 per side', defaultSets: 2, targetReps: 8, category: 'Mobility' })
        ]
      },
      {
        dayNumber: 4,
        title: 'DAY 4: CORE FORTRESS & ISOMETRIC ENDURANCE',
        muscleFocus: 'Core Bracing, Obliques & Lower Back',
        exercises: [
          enrichExercise({ name: 'STANDING CORE TWISTS', calories: 30, duration: 4, muscleGroup: 'core', tag: 'Warm-Up', equipment: 'None', details: '2 sets × 20 twists', defaultSets: 2, targetReps: 20, category: 'Warm-Up' }),
          enrichExercise({ name: 'V-UP ABDOMINAL CRUNCHES', calories: 120, duration: 8, muscleGroup: 'core', tag: 'Core', equipment: 'None', details: '4 sets × 15 V-ups', defaultSets: 4, targetReps: 15, category: 'Primary Compound' }),
          enrichExercise({ name: 'DOORWAY BODYWEIGHT ROWS', calories: 120, duration: 10, muscleGroup: 'back', tag: 'Back', equipment: 'None', details: '4 sets × 15 door rows', defaultSets: 4, targetReps: 15, category: 'Primary Compound' }),
          enrichExercise({ name: 'SIDE PLANK OBLIQUE DIP LIFTS', calories: 100, duration: 8, muscleGroup: 'core', tag: 'Obliques', equipment: 'None', details: '3 sets × 15 per side', defaultSets: 3, targetReps: 15, category: 'Accessory' }),
          enrichExercise({ name: 'PRONE SUPERMAN LAT EXTENSIONS', calories: 100, duration: 8, muscleGroup: 'back', tag: 'Posterior', equipment: 'None', details: '3 sets × 18 reps with hold', defaultSets: 3, targetReps: 18, category: 'Accessory' }),
          enrichExercise({ name: 'FOREARM PLANK RIGID HOLD', calories: 90, duration: 6, muscleGroup: 'core', tag: 'Hold', equipment: 'None', details: '3 sets × 60s hold', defaultSets: 3, targetReps: 60, category: 'Finisher' }),
          enrichExercise({ name: 'COBRA spine STRETCH', calories: 30, duration: 5, muscleGroup: 'back', tag: 'Mobility', equipment: 'None', details: '2 sets × 45s stretch', defaultSets: 2, targetReps: 45, category: 'Mobility' })
        ]
      }
    ]
  },

  // =========================================================================
  // PROGRAM 3: NEW! 8-WEEK NO-EQUIPMENT CALISTHENICS SKILL & ISOMETRIC MASTERY
  // 100% PURE BODYWEIGHT - GYMNASTIC LEVERS, HANDSTANDS & PISTOL SQUATS
  // =========================================================================
  {
    id: '8week_calisthenics_skill_and_isometric_mastery',
    name: '8-WEEK CALISTHENICS SKILL & ISOMETRIC MASTERY',
    area: '2-Month Advanced Calisthenics & Balance',
    tag: 'Skill Mastery',
    equipment: 'No Equipment',
    targetGoal: 'calisthenics',
    durationWeeks: 8,
    daysPerWeek: 4,
    recommendedBodyType: 'Athletic / Intermediate Calisthenics Practitioners',
    compatibilityNote: '100% equipment-free skill progressions. Master body control, single-leg pistol squats, and handstand shoulder power.',
    description: 'Advanced 8-Week bodyweight mastery protocol focusing on handstand wall climbs, pistol squat progressions, and L-sit core compression.',
    days: [
      {
        dayNumber: 1,
        title: 'DAY 1: HANDSTAND WALL CLIMB & OVERHEAD POWER',
        muscleFocus: 'Deltoids, Upper Traps & Handstand Balance',
        exercises: [
          enrichExercise({ name: 'ARM CIRCLES & SHOULDER TAPS', calories: 40, duration: 5, muscleGroup: 'shoulders', tag: 'Warm-Up', equipment: 'None', details: '2 sets × 15 reps', defaultSets: 2, targetReps: 15, category: 'Warm-Up' }),
          enrichExercise({ name: 'WALL WALK-UPS TO HANDSTAND HOLD', calories: 140, duration: 12, muscleGroup: 'shoulders', tag: 'Skill', equipment: 'None', details: '4 sets × 30s wall hold', defaultSets: 4, targetReps: 30, category: 'Primary Compound' }),
          enrichExercise({ name: 'PIKE PUSHUPS (SHOULDER PRESS)', calories: 130, duration: 10, muscleGroup: 'shoulders', tag: 'Calisthenics', equipment: 'None', details: '4 sets × 12 reps', defaultSets: 4, targetReps: 12, category: 'Primary Compound' }),
          enrichExercise({ name: 'DECLINE CHAIR PUSHUPS', calories: 110, duration: 8, muscleGroup: 'chest', tag: 'Chest', equipment: 'None', details: '3 sets × 15 reps', defaultSets: 3, targetReps: 15, category: 'Accessory' }),
          enrichExercise({ name: 'PLANK-TO-PUSHUP COMMANDOS', calories: 100, duration: 8, muscleGroup: 'core', tag: 'Core', equipment: 'None', details: '3 sets × 12 up-downs', defaultSets: 3, targetReps: 12, category: 'Accessory' }),
          enrichExercise({ name: 'PLANK SHOULDER TAPS', calories: 80, duration: 6, muscleGroup: 'core', tag: 'Finisher', equipment: 'None', details: '3 sets × 20 taps', defaultSets: 3, targetReps: 20, category: 'Finisher' }),
          enrichExercise({ name: 'CROSS BODY SHOULDER DECOMPRESSION', calories: 30, duration: 5, muscleGroup: 'shoulders', tag: 'Mobility', equipment: 'None', details: '2 sets × 45s per side', defaultSets: 2, targetReps: 45, category: 'Mobility' })
        ]
      },
      {
        dayNumber: 2,
        title: 'DAY 2: UNILATERAL PISTOL SQUAT & SINGLE-LEG POWER',
        muscleFocus: 'Quadriceps, Glutes, Hamstrings & Balance',
        exercises: [
          enrichExercise({ name: 'STANDING BODYWEIGHT LEG SWINGS', calories: 40, duration: 5, muscleGroup: 'legs', tag: 'Warm-Up', equipment: 'None', details: '2 sets × 15 swings per leg', defaultSets: 2, targetReps: 15, category: 'Warm-Up' }),
          enrichExercise({ name: 'ASSISTED PISTOL SQUAT PROGRESSION', calories: 150, duration: 12, muscleGroup: 'legs', tag: 'Skill', equipment: 'None', details: '4 sets × 8 reps per leg', defaultSets: 4, targetReps: 8, category: 'Primary Compound' }),
          enrichExercise({ name: 'BULGARIAN BODYWEIGHT SPLIT SQUATS', calories: 130, duration: 10, muscleGroup: 'legs', tag: 'Strength', equipment: 'None', details: '4 sets × 12 reps per leg', defaultSets: 4, targetReps: 12, category: 'Primary Compound' }),
          enrichExercise({ name: 'GLUTE BRIDGES WITH 2S HOLD', calories: 110, duration: 8, muscleGroup: 'legs', tag: 'Glutes', equipment: 'None', details: '4 sets × 18 reps', defaultSets: 4, targetReps: 18, category: 'Accessory' }),
          enrichExercise({ name: 'ISOMETRIC WALL SITS', calories: 100, duration: 8, muscleGroup: 'legs', tag: 'Isometric', equipment: 'None', details: '3 sets × 60s hold', defaultSets: 3, targetReps: 60, category: 'Accessory' }),
          enrichExercise({ name: 'SINGLE-LEG CALF RAISES', calories: 80, duration: 8, muscleGroup: 'legs', tag: 'Calves', equipment: 'None', details: '4 sets × 20 per calf', defaultSets: 4, targetReps: 20, category: 'Finisher' }),
          enrichExercise({ name: 'HAMSTRING & HIP FLEXOR STRETCH', calories: 30, duration: 5, muscleGroup: 'legs', tag: 'Mobility', equipment: 'None', details: '2 sets × 60s holds', defaultSets: 2, targetReps: 60, category: 'Mobility' })
        ]
      },
      {
        dayNumber: 3,
        title: 'DAY 3: HORIZONTAL BODYWEIGHT PULL & POSTERIOR CHAIN',
        muscleFocus: 'Lats, Rhomboids, Rear Delts & Lower Back',
        exercises: [
          enrichExercise({ name: 'THORACIC CAT-COW FLOW', calories: 40, duration: 5, muscleGroup: 'back', tag: 'Warm-Up', equipment: 'None', details: '2 sets × 12 reps', defaultSets: 2, targetReps: 12, category: 'Warm-Up' }),
          enrichExercise({ name: 'DOORWAY BODYWEIGHT ROWS', calories: 140, duration: 12, muscleGroup: 'back', tag: 'Skill Pull', equipment: 'None', details: '4 sets × 15 steep rows', defaultSets: 4, targetReps: 15, category: 'Primary Compound' }),
          enrichExercise({ name: 'PRONE SUPERMAN LAT EXTENSIONS', calories: 120, duration: 10, muscleGroup: 'back', tag: 'Posterior', equipment: 'None', details: '4 sets × 20 reps with 2s hold', defaultSets: 4, targetReps: 20, category: 'Primary Compound' }),
          enrichExercise({ name: 'REVERSE SHOULDER FLY EXTENSIONS', calories: 90, duration: 8, muscleGroup: 'shoulders', tag: 'Rear Delt', equipment: 'None', details: '3 sets × 15 flys', defaultSets: 3, targetReps: 15, category: 'Accessory' }),
          enrichExercise({ name: 'ISOMETRIC BICEP TENSION HOLDS', calories: 100, duration: 8, muscleGroup: 'arms', tag: 'Isometric', equipment: 'None', details: '3 sets × 30s pull hold', defaultSets: 3, targetReps: 30, category: 'Accessory' }),
          enrichExercise({ name: 'PRONE COBRA BACK EXTENSION', calories: 80, duration: 6, muscleGroup: 'back', tag: 'Finisher', equipment: 'None', details: '3 sets × 15 reps', defaultSets: 3, targetReps: 15, category: 'Finisher' }),
          enrichExercise({ name: 'CHILD POSE LAT DECOMPRESSION', calories: 30, duration: 5, muscleGroup: 'back', tag: 'Mobility', equipment: 'None', details: '2 sets × 60s holds', defaultSets: 2, targetReps: 60, category: 'Mobility' })
        ]
      },
      {
        dayNumber: 4,
        title: 'DAY 4: L-SIT CORE COMPRESSION & HOLLOW HOLDS',
        muscleFocus: 'L-Sit Gymnastics, Rectus Abdominis & Obliques',
        exercises: [
          enrichExercise({ name: 'STANDING CORE TWISTS', calories: 30, duration: 4, muscleGroup: 'core', tag: 'Warm-Up', equipment: 'None', details: '2 sets × 20 twists', defaultSets: 2, targetReps: 20, category: 'Warm-Up' }),
          enrichExercise({ name: 'L-SIT TUCKED FLOOR PRESS', calories: 130, duration: 10, muscleGroup: 'core', tag: 'Gymnastic', equipment: 'None', details: '4 sets × 20s suspended hold', defaultSets: 4, targetReps: 20, category: 'Primary Compound' }),
          enrichExercise({ name: 'HOLLOW BODY COMPRESSION HOLDS', calories: 110, duration: 8, muscleGroup: 'core', tag: 'Hollow', equipment: 'None', details: '4 sets × 45s compression hold', defaultSets: 4, targetReps: 45, category: 'Primary Compound' }),
          enrichExercise({ name: 'V-UP ABDOMINAL CRUNCHES', calories: 100, duration: 8, muscleGroup: 'core', tag: 'Core', equipment: 'None', details: '4 sets × 15 V-ups', defaultSets: 4, targetReps: 15, category: 'Accessory' }),
          enrichExercise({ name: 'SIDE PLANK OBLIQUE DIP LIFTS', calories: 90, duration: 8, muscleGroup: 'core', tag: 'Obliques', equipment: 'None', details: '3 sets × 15 per side', defaultSets: 3, targetReps: 15, category: 'Accessory' }),
          enrichExercise({ name: 'FOREARM PLANK RIGID HOLD', calories: 90, duration: 6, muscleGroup: 'core', tag: 'Finisher', equipment: 'None', details: '3 sets × 60s hold', defaultSets: 3, targetReps: 60, category: 'Finisher' }),
          enrichExercise({ name: 'COBRA spine STRETCH', calories: 30, duration: 5, muscleGroup: 'back', tag: 'Mobility', equipment: 'None', details: '2 sets × 45s stretch', defaultSets: 2, targetReps: 45, category: 'Mobility' })
        ]
      }
    ]
  },

  // =========================================================================
  // PROGRAM 4: NEW! 4-WEEK MORNING MOBILITY & POSTURE RESET (1 MONTH)
  // 100% PURE BODYWEIGHT - GENTLE DESK RECOVERY, JOINT MOBILITY & FLEXIBILITY
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
        muscleFocus: 'Thoracic Spine, Neck, Upper Back & Shoulders',
        exercises: [
          enrichExercise({ name: 'THORACIC CAT-COW FLOW', calories: 40, duration: 6, muscleGroup: 'back', tag: 'Mobility', equipment: 'None', details: '3 sets × 12 smooth flows', defaultSets: 3, targetReps: 12, category: 'Warm-Up' }),
          enrichExercise({ name: 'BIRD DOG BALANCE EXTENSIONS', calories: 70, duration: 8, muscleGroup: 'core', tag: 'Posture', equipment: 'None', details: '3 sets × 12 per side', defaultSets: 3, targetReps: 12, category: 'Primary Compound' }),
          enrichExercise({ name: 'PRONE SUPERMAN LAT EXTENSIONS', calories: 80, duration: 8, muscleGroup: 'back', tag: 'Posture', equipment: 'None', details: '3 sets × 15 gentle holds', defaultSets: 3, targetReps: 15, category: 'Accessory' }),
          enrichExercise({ name: 'REVERSE SHOULDER FLY EXTENSIONS', calories: 70, duration: 6, muscleGroup: 'shoulders', tag: 'Posture', equipment: 'None', details: '3 sets × 12 light squeezes', defaultSets: 3, targetReps: 12, category: 'Accessory' }),
          enrichExercise({ name: 'CHILD POSE LAT DECOMPRESSION', calories: 30, duration: 6, muscleGroup: 'back', tag: 'Decompress', equipment: 'None', details: '3 sets × 60s holds', defaultSets: 3, targetReps: 60, category: 'Finisher' }),
          enrichExercise({ name: 'CHEST & TRICEP DOORWAY STRETCH', calories: 30, duration: 5, muscleGroup: 'chest', tag: 'Stretch', equipment: 'None', details: '2 sets × 60s holds', defaultSets: 2, targetReps: 60, category: 'Mobility' })
        ]
      },
      {
        dayNumber: 2,
        title: 'DAY 2: DEEP HIP OPENER & ANKLE AGILITY RESET',
        muscleFocus: 'Hip Flexors, Adductors, Glutes & Ankle Range',
        exercises: [
          enrichExercise({ name: 'STANDING BODYWEIGHT LEG SWINGS', calories: 40, duration: 5, muscleGroup: 'legs', tag: 'Warm-Up', equipment: 'None', details: '2 sets × 15 swings per leg', defaultSets: 2, targetReps: 15, category: 'Warm-Up' }),
          enrichExercise({ name: 'WORLD GREATEST LUNGE STRETCH', calories: 60, duration: 8, muscleGroup: 'legs', tag: 'Hip Flow', equipment: 'None', details: '3 sets × 8 per side', defaultSets: 3, targetReps: 8, category: 'Primary Compound' }),
          enrichExercise({ name: 'GLUTE BRIDGES WITH 2S HOLD', calories: 90, duration: 8, muscleGroup: 'legs', tag: 'Glute Activation', equipment: 'None', details: '3 sets × 15 smooth bridges', defaultSets: 3, targetReps: 15, category: 'Accessory' }),
          enrichExercise({ name: 'CHAIR ASSISTED SQUATS', calories: 80, duration: 8, muscleGroup: 'legs', tag: 'Mobility Squat', equipment: 'None', details: '3 sets × 12 sit-to-stands', defaultSets: 3, targetReps: 12, category: 'Accessory' }),
          enrichExercise({ name: 'QUAD & QUADRICEPS MAT STRETCH', calories: 30, duration: 5, muscleGroup: 'legs', tag: 'Stretch', equipment: 'None', details: '2 sets × 60s holds', defaultSets: 2, targetReps: 60, category: 'Mobility' }),
          enrichExercise({ name: 'SEATED HAMSTRING STRETCH', calories: 30, duration: 5, muscleGroup: 'legs', tag: 'Stretch', equipment: 'Mat', details: '2 sets × 60s holds', defaultSets: 2, targetReps: 60, category: 'Mobility' })
        ]
      },
      {
        dayNumber: 3,
        title: 'DAY 3: FULL BODY MORNING ENERGY & SPINE ALIGNMENT',
        muscleFocus: 'Full Body Flexibility & Spinal Length',
        exercises: [
          enrichExercise({ name: 'ARM CIRCLES & SHOULDER TAPS', calories: 40, duration: 5, muscleGroup: 'shoulders', tag: 'Warm-Up', equipment: 'None', details: '2 sets × 15 reps', defaultSets: 2, targetReps: 15, category: 'Warm-Up' }),
          enrichExercise({ name: 'WORLD GREATEST LUNGE STRETCH', calories: 60, duration: 8, muscleGroup: 'legs', tag: 'Mobility', equipment: 'None', details: '3 sets × 8 per side', defaultSets: 3, targetReps: 8, category: 'Primary Compound' }),
          enrichExercise({ name: 'BEAR CRAWL ISOMETRIC HOLDS', calories: 80, duration: 6, muscleGroup: 'core', tag: 'Bracing', equipment: 'None', details: '3 sets × 30s hover', defaultSets: 3, targetReps: 30, category: 'Accessory' }),
          enrichExercise({ name: 'PRONE COBRA BACK EXTENSION', calories: 70, duration: 6, muscleGroup: 'back', tag: 'Spine', equipment: 'None', details: '3 sets × 12 holds', defaultSets: 3, targetReps: 12, category: 'Accessory' }),
          enrichExercise({ name: 'COBRA spine STRETCH', calories: 30, duration: 5, muscleGroup: 'back', tag: 'Stretch', equipment: 'None', details: '2 sets × 60s stretch', defaultSets: 2, targetReps: 60, category: 'Mobility' }),
          enrichExercise({ name: 'CHILD POSE LAT DECOMPRESSION', calories: 30, duration: 5, muscleGroup: 'back', tag: 'Decompress', equipment: 'None', details: '2 sets × 60s holds', defaultSets: 2, targetReps: 60, category: 'Mobility' })
        ]
      }
    ]
  },

  // =========================================================================
  // PROGRAM 5: 8-WEEK SKINNY-TO-MUSCLE MASS GAINER HYPERTROPHY (2 MONTHS)
  // FULL GYM / DUMBBELL / BARBELL
  // =========================================================================
  {
    id: '8week_mass_gainer_hypertrophy',
    name: '8-WEEK SKINNY-TO-MUSCLE MASS GAINER',
    area: '2-Month Bulking & Muscle Mass',
    tag: 'Muscle Gain',
    equipment: 'Barbell / Dumbbell / Gym',
    targetGoal: 'muscle_gain',
    durationWeeks: 8,
    daysPerWeek: 4,
    recommendedBodyType: 'Slim Build / Underweight / Hardgainers',
    compatibilityNote: 'Heavy compound overload with structured exercises per workout day for maximum 2-month muscle hypertrophy.',
    description: 'Structured 8-week compound mass-building protocol engineered with progressive gym overload to stimulate skeletal muscle growth.',
    days: [
      {
        dayNumber: 1,
        title: 'DAY 1: HEAVY CHEST & TRICEP MASS OVERLOAD',
        muscleFocus: 'Pectorals, Anterior Deltoids & Triceps',
        exercises: [
          enrichExercise({ name: 'ARM CIRCLES & SHOULDER TAPS', calories: 40, duration: 5, muscleGroup: 'shoulders', tag: 'Warm-Up', equipment: 'None', details: '2 sets × 15 reps light', defaultSets: 2, targetReps: 15, category: 'Warm-Up' }),
          enrichExercise({ name: 'BARBELL BENCH PRESS', calories: 230, duration: 15, muscleGroup: 'chest', tag: 'Mass Build', equipment: 'Barbell', details: '5 sets × 6 heavy reps (Max power, 2m rest)', defaultSets: 5, targetReps: 6, category: 'Primary Compound' }),
          enrichExercise({ name: 'STANDARD FLOOR PUSHUPS', calories: 120, duration: 8, muscleGroup: 'chest', tag: 'Hypertrophy', equipment: 'None', details: '4 sets × 15 reps (Full stretch)', defaultSets: 4, targetReps: 15, category: 'Primary Compound' }),
          enrichExercise({ name: 'CHAIR / BENCH TRICEP DIPS', calories: 120, duration: 8, muscleGroup: 'arms', tag: 'Triceps', equipment: 'None', details: '4 sets × 12 reps', defaultSets: 4, targetReps: 12, category: 'Accessory' }),
          enrichExercise({ name: 'DIAMOND TRICEP PUSHUPS', calories: 110, duration: 8, muscleGroup: 'arms', tag: 'Triceps', equipment: 'None', details: '3 sets × 12 reps', defaultSets: 3, targetReps: 12, category: 'Finisher' }),
          enrichExercise({ name: 'CHEST & TRICEP DOORWAY STRETCH', calories: 30, duration: 5, muscleGroup: 'chest', tag: 'Mobility', equipment: 'None', details: '2 sets × 45s holds', defaultSets: 2, targetReps: 45, category: 'Mobility' })
        ]
      },
      {
        dayNumber: 2,
        title: 'DAY 2: LAT DENSITY & HEAVY DEADLIFT OVERLOAD',
        muscleFocus: 'Lats, Rhomboids, Traps & Biceps',
        exercises: [
          enrichExercise({ name: 'THORACIC CAT-COW FLOW', calories: 40, duration: 5, muscleGroup: 'back', tag: 'Warm-Up', equipment: 'None', details: '2 sets × 15 reps light', defaultSets: 2, targetReps: 15, category: 'Warm-Up' }),
          enrichExercise({ name: 'BARBELL DEADLIFT', calories: 290, duration: 18, muscleGroup: 'back', tag: 'Mass Build', equipment: 'Barbell', details: '5 sets × 5 heavy reps (Neutral spine)', defaultSets: 5, targetReps: 5, category: 'Primary Compound' }),
          enrichExercise({ name: 'DOORWAY BODYWEIGHT ROWS', calories: 150, duration: 10, muscleGroup: 'back', tag: 'Lats', equipment: 'None', details: '4 sets × 15 door rows', defaultSets: 4, targetReps: 15, category: 'Primary Compound' }),
          enrichExercise({ name: 'PRONE SUPERMAN LAT EXTENSIONS', calories: 120, duration: 8, muscleGroup: 'back', tag: 'Upper Back', equipment: 'None', details: '4 sets × 15 reps', defaultSets: 4, targetReps: 15, category: 'Accessory' }),
          enrichExercise({ name: 'ISOMETRIC BICEP TENSION HOLDS', calories: 110, duration: 8, muscleGroup: 'arms', tag: 'Biceps', equipment: 'None', details: '3 sets × 30s holds', defaultSets: 3, targetReps: 30, category: 'Finisher' }),
          enrichExercise({ name: 'CHILD POSE LAT DECOMPRESSION', calories: 30, duration: 5, muscleGroup: 'back', tag: 'Mobility', equipment: 'None', details: '2 sets × 60s holds', defaultSets: 2, targetReps: 60, category: 'Mobility' })
        ]
      },
      {
        dayNumber: 3,
        title: 'DAY 3: QUAD MASS & HEAVY BARBELL SQUATS',
        muscleFocus: 'Quads, Glutes & Hamstrings',
        exercises: [
          enrichExercise({ name: 'STANDING BODYWEIGHT LEG SWINGS', calories: 40, duration: 5, muscleGroup: 'legs', tag: 'Warm-Up', equipment: 'None', details: '2 sets × 15 reps light', defaultSets: 2, targetReps: 15, category: 'Warm-Up' }),
          enrichExercise({ name: 'BARBELL BACK SQUATS', calories: 300, duration: 20, muscleGroup: 'legs', tag: 'Mass Build', equipment: 'Barbell', details: '5 sets × 6 heavy reps below 90°', defaultSets: 5, targetReps: 6, category: 'Primary Compound' }),
          enrichExercise({ name: 'BULGARIAN BODYWEIGHT SPLIT SQUATS', calories: 140, duration: 10, muscleGroup: 'legs', tag: 'Hypertrophy', equipment: 'None', details: '4 sets × 12 per leg', defaultSets: 4, targetReps: 12, category: 'Primary Compound' }),
          enrichExercise({ name: 'GLUTE BRIDGES WITH 2S HOLD', calories: 110, duration: 8, muscleGroup: 'legs', tag: 'Glutes', equipment: 'None', details: '4 sets × 18 reps', defaultSets: 4, targetReps: 18, category: 'Accessory' }),
          enrichExercise({ name: 'SINGLE-LEG CALF RAISES', calories: 90, duration: 8, muscleGroup: 'legs', tag: 'Calves', equipment: 'None', details: '4 sets × 20 per calf', defaultSets: 4, targetReps: 20, category: 'Finisher' }),
          enrichExercise({ name: 'HAMSTRING & HIP FLEXOR STRETCH', calories: 30, duration: 5, muscleGroup: 'legs', tag: 'Mobility', equipment: 'None', details: '2 sets × 60s holds', defaultSets: 2, targetReps: 60, category: 'Mobility' })
        ]
      },
      {
        dayNumber: 4,
        title: 'DAY 4: SHOULDER CANNON PRESS & DELT DENSITY',
        muscleFocus: 'Anterior, Lateral & Rear Deltoids',
        exercises: [
          enrichExercise({ name: 'ARM CIRCLES & SHOULDER TAPS', calories: 40, duration: 5, muscleGroup: 'shoulders', tag: 'Warm-Up', equipment: 'None', details: '2 sets × 15 rotations', defaultSets: 2, targetReps: 15, category: 'Warm-Up' }),
          enrichExercise({ name: 'PIKE PUSHUPS (SHOULDER PRESS)', calories: 150, duration: 10, muscleGroup: 'shoulders', tag: 'Delts', equipment: 'None', details: '4 sets × 12 reps', defaultSets: 4, targetReps: 12, category: 'Primary Compound' }),
          enrichExercise({ name: 'WALL WALK-UPS TO HANDSTAND HOLD', calories: 130, duration: 8, muscleGroup: 'shoulders', tag: 'Hold', equipment: 'None', details: '3 sets × 30s wall hold', defaultSets: 3, targetReps: 30, category: 'Primary Compound' }),
          enrichExercise({ name: 'REVERSE SHOULDER FLY EXTENSIONS', calories: 100, duration: 8, muscleGroup: 'shoulders', tag: 'Rear Delts', equipment: 'None', details: '3 sets × 15 flys', defaultSets: 3, targetReps: 15, category: 'Accessory' }),
          enrichExercise({ name: 'PLANK SHOULDER TAPS', calories: 90, duration: 6, muscleGroup: 'core', tag: 'Core', equipment: 'None', details: '3 sets × 20 taps', defaultSets: 3, targetReps: 20, category: 'Finisher' }),
          enrichExercise({ name: 'CROSS BODY SHOULDER DECOMPRESSION', calories: 30, duration: 5, muscleGroup: 'shoulders', tag: 'Mobility', equipment: 'None', details: '2 sets × 45s per side', defaultSets: 2, targetReps: 45, category: 'Mobility' })
        ]
      }
    ]
  },

  // =========================================================================
  // PROGRAM 6: 4-WEEK KNEE-SAFE LOW-IMPACT & JOINT CARE (1 MONTH)
  // LOW IMPACT / MACHINES / BANDS / BODYWEIGHT
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
          enrichExercise({ name: 'ARM CIRCLES & SHOULDER TAPS', calories: 30, duration: 5, muscleGroup: 'shoulders', tag: 'Warm-Up', equipment: 'None', details: '2 sets × 12 smooth circles', defaultSets: 2, targetReps: 12, category: 'Warm-Up' }),
          enrichExercise({ name: 'STANDARD FLOOR PUSHUPS', calories: 110, duration: 10, muscleGroup: 'chest', tag: 'Joint Safe', equipment: 'None', details: '3 sets × 12 smooth reps (On knees if needed)', defaultSets: 3, targetReps: 12, category: 'Primary Compound' }),
          enrichExercise({ name: 'CHAIR / BENCH TRICEP DIPS', calories: 90, duration: 8, muscleGroup: 'arms', tag: 'Triceps', equipment: 'None', details: '3 sets × 12 smooth reps', defaultSets: 3, targetReps: 12, category: 'Accessory' }),
          enrichExercise({ name: 'FOREARM PLANK RIGID HOLD', calories: 70, duration: 6, muscleGroup: 'core', tag: 'Joint Safe', equipment: 'None', details: '3 sets × 30s holds', defaultSets: 3, targetReps: 30, category: 'Finisher' }),
          enrichExercise({ name: 'CHEST & TRICEP DOORWAY STRETCH', calories: 30, duration: 5, muscleGroup: 'chest', tag: 'Mobility', equipment: 'None', details: '2 sets × 45s holds', defaultSets: 2, targetReps: 45, category: 'Mobility' })
        ]
      },
      {
        dayNumber: 2,
        title: 'DAY 2: KNEE-FRIENDLY LOWER BODY & GLUTE ACTIVATION',
        muscleFocus: 'Quads, Glutes & Hamstrings (Zero Jumps)',
        exercises: [
          enrichExercise({ name: 'GLUTE BRIDGES WITH 2S HOLD', calories: 130, duration: 10, muscleGroup: 'legs', tag: 'Joint Safe', equipment: 'None', details: '4 sets × 15 reps with 2s squeeze', defaultSets: 4, targetReps: 15, category: 'Primary Compound' }),
          enrichExercise({ name: 'CHAIR ASSISTED SQUATS', calories: 100, duration: 10, muscleGroup: 'legs', tag: 'Joint Safe', equipment: 'None', details: '3 sets × 12 sit-to-stand reps', defaultSets: 3, targetReps: 12, category: 'Accessory' }),
          enrichExercise({ name: 'BIRD DOG BALANCE EXTENSIONS', calories: 80, duration: 8, muscleGroup: 'core', tag: 'Joint Safe', equipment: 'None', details: '3 sets × 12 per side', defaultSets: 3, targetReps: 12, category: 'Accessory' }),
          enrichExercise({ name: 'ISOMETRIC WALL SITS', calories: 90, duration: 8, muscleGroup: 'legs', tag: 'Joint Safe', equipment: 'None', details: '3 sets × 45s static hold', defaultSets: 3, targetReps: 45, category: 'Finisher' }),
          enrichExercise({ name: 'SEATED HAMSTRING STRETCH', calories: 30, duration: 5, muscleGroup: 'legs', tag: 'Mobility', equipment: 'Mat', details: '2 sets × 60s per leg', defaultSets: 2, targetReps: 60, category: 'Mobility' })
        ]
      }
    ]
  }
];
