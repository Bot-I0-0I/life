import React, { useState } from 'react';
import { Utensils, Plus, Shield, CheckCircle, Flame, Beef, Wheat, Droplets, BookOpen, Clock, ChevronRight, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';

export const PAKISTANI_FOOD_ITEMS = [
  // Staples & Breads
  { name: 'Roti (Whole Wheat Chapati)', calories: 120, protein: 4, carbs: 24, fat: 1, portion: '1 Medium (40g)' },
  { name: 'Tandoori Naan', calories: 260, protein: 8, carbs: 48, fat: 4, portion: '1 Piece (90g)' },
  { name: 'Roghani Naan (Sesame & Butter)', calories: 340, protein: 9, carbs: 52, fat: 12, portion: '1 Piece (110g)' },
  { name: 'Paratha (Whole Wheat / Ghee)', calories: 290, protein: 5, carbs: 38, fat: 13, portion: '1 Piece' },
  { name: 'Aloo Paratha', calories: 350, protein: 7, carbs: 50, fat: 14, portion: '1 Piece (150g)' },
  { name: 'Puri (Halwa Puri Paratha)', calories: 210, protein: 3, carbs: 22, fat: 12, portion: '1 Piece' },

  // Rice & Lentils
  { name: 'Boiled White Rice (Basmati)', calories: 200, protein: 4, carbs: 44, fat: 0.5, portion: '1 Cup (150g)' },
  { name: 'Dal Chawal (Lentils & Rice)', calories: 450, protein: 12, carbs: 85, fat: 6, portion: '1 Plate (350g)' },
  { name: 'Chicken Biryani', calories: 550, protein: 28, carbs: 75, fat: 15, portion: '1 Plate (300g)' },
  { name: 'Mutton Biryani', calories: 620, protein: 32, carbs: 74, fat: 22, portion: '1 Plate (300g)' },
  { name: 'Beef Pulao (Yakhni Pulao)', calories: 510, protein: 26, carbs: 68, fat: 16, portion: '1 Plate (300g)' },
  { name: 'Daal Tadka (Yellow Lentils)', calories: 190, protein: 9, carbs: 26, fat: 6, portion: '1 Cup (200g)' },
  { name: 'Daal Makhani / Mash Daal', calories: 240, protein: 11, carbs: 28, fat: 10, portion: '1 Cup (200g)' },

  // Chicken & Meat Curries
  { name: 'Chicken Karahi', calories: 380, protein: 32, carbs: 6, fat: 24, portion: '1 Portion (200g)' },
  { name: 'Chicken Jalfrezi', calories: 340, protein: 30, carbs: 12, fat: 18, portion: '1 Portion (200g)' },
  { name: 'Mutton Karahi', calories: 460, protein: 34, carbs: 4, fat: 34, portion: '1 Portion (200g)' },
  { name: 'Mutton Kunna (Clay Pot Mutton)', calories: 490, protein: 36, carbs: 6, fat: 35, portion: '1 Bowl (250g)' },
  { name: 'Chicken Handi (Boneless Creamy)', calories: 420, protein: 30, carbs: 8, fat: 30, portion: '1 Portion (200g)' },
  { name: 'Beef Nihari', calories: 520, protein: 36, carbs: 12, fat: 36, portion: '1 Bowl (300g)' },
  { name: 'Beef Keema Mattar (Minced Beef with Peas)', calories: 360, protein: 31, carbs: 10, fat: 22, portion: '1 Bowl (200g)' },
  { name: 'Mutton Paya Curry', calories: 480, protein: 38, carbs: 5, fat: 34, portion: '1 Bowl (350g)' },
  { name: 'Chicken Haleem', calories: 410, protein: 30, carbs: 48, fat: 12, portion: '1 Bowl (300g)' },
  { name: 'Beef Haleem', calories: 450, protein: 34, carbs: 46, fat: 15, portion: '1 Bowl (300g)' },
  { name: 'Chicken Korma', calories: 390, protein: 26, carbs: 10, fat: 28, portion: '1 Portion (200g)' },
  { name: 'Anda Ghotala (Eggs & Spiced Keema)', calories: 380, protein: 24, carbs: 8, fat: 28, portion: '1 Plate (200g)' },
  { name: 'Khagina (Pakistani Scrambled Eggs)', calories: 210, protein: 14, carbs: 4, fat: 15, portion: '2 Eggs' },

  // BBQ & Grilled Delicacies
  { name: 'Chicken Tikka (Breast)', calories: 280, protein: 42, carbs: 2, fat: 11, portion: '1 Piece (200g)' },
  { name: 'Chicken Malai Boti', calories: 320, protein: 32, carbs: 3, fat: 20, portion: '5 Pieces (180g)' },
  { name: 'Beef Seekh Kabab', calories: 160, protein: 18, carbs: 2, fat: 9, portion: '1 Skewer (60g)' },
  { name: 'Chicken Seekh Kabab', calories: 140, protein: 19, carbs: 2, fat: 6, portion: '1 Skewer (60g)' },
  { name: 'Chicken Reshmi Kabab', calories: 170, protein: 19, carbs: 3, fat: 9, portion: '1 Skewer (60g)' },
  { name: 'Chapli Kabab (Peshawari Beef)', calories: 310, protein: 24, carbs: 6, fat: 22, portion: '1 Kabab (120g)' },
  { name: 'Egg Shami Kabab', calories: 150, protein: 10, carbs: 6, fat: 9, portion: '1 Piece (60g)' },
  { name: 'Fish Tikka (Grilled)', calories: 220, protein: 32, carbs: 1, fat: 10, portion: '1 Portion (180g)' },
  { name: 'Peshawari Fried Fish', calories: 330, protein: 34, carbs: 12, fat: 16, portion: '1 Portion (200g)' },
  { name: 'Chicken Sajji (Whole Roasted)', calories: 580, protein: 62, carbs: 2, fat: 36, portion: 'Half Chicken (350g)' },

  // Fitness & High-Protein Snacks
  { name: 'Roasted Chana (Spiced Chickpeas)', calories: 160, protein: 9, carbs: 26, fat: 3, portion: '1 Handful (40g)' },
  { name: 'Roasted Almonds & Raisins (Badam Kismis)', calories: 190, protein: 6, carbs: 18, fat: 12, portion: '1 Handful (35g)' },
  { name: 'High-Protein Chana Salad', calories: 210, protein: 11, carbs: 32, fat: 4, portion: '1 Bowl (200g)' },
  { name: 'Oats Dahi Bowl with Dates', calories: 260, protein: 10, carbs: 44, fat: 5, portion: '1 Bowl (250g)' },

  // Vegetable Curries & Extras
  { name: 'Mixed Vegetable Curry (Sabzi)', calories: 150, protein: 3, carbs: 18, fat: 8, portion: '1 Cup (150g)' },
  { name: 'Palak Paneer / Saag', calories: 270, protein: 14, carbs: 10, fat: 20, portion: '1 Cup (200g)' },
  { name: 'Aloo Gobi', calories: 160, protein: 4, carbs: 22, fat: 7, portion: '1 Cup (180g)' },
  { name: 'Bhindi Masala (Okra Curry)', calories: 140, protein: 3, carbs: 14, fat: 8, portion: '1 Cup (150g)' },
  { name: 'Chana Masala', calories: 230, protein: 10, carbs: 36, fat: 6, portion: '1 Cup (200g)' },
  { name: 'Plain Yogurt (Dahi)', calories: 100, protein: 6, carbs: 7, fat: 5, portion: '1 Cup (150g)' },
  { name: 'Zeera Raita (Yogurt with Cumin)', calories: 80, protein: 4, carbs: 6, fat: 4, portion: '1 Cup (150g)' },

  // Street Foods & Breakfasts
  { name: 'Chana Chaat (Chickpeas)', calories: 180, protein: 7, carbs: 32, fat: 3, portion: '1 Cup (150g)' },
  { name: 'Samosa (Potato Vegetable)', calories: 220, protein: 4, carbs: 28, fat: 11, portion: '1 Piece (90g)' },
  { name: 'Samosa (Chicken/Beef)', calories: 240, protein: 11, carbs: 22, fat: 12, portion: '1 Piece (90g)' },
  { name: 'Mix Vegetable Pakora', calories: 210, protein: 5, carbs: 24, fat: 11, portion: '1 Plate (120g)' },
  { name: 'Dahi Bhalle', calories: 250, protein: 8, carbs: 38, fat: 8, portion: '1 Bowl (200g)' },
  { name: 'Gol Gappay (Pani Puri)', calories: 160, protein: 3, carbs: 30, fat: 4, portion: '6 Pieces' },
  { name: 'Chicken Bun Kabab', calories: 340, protein: 18, carbs: 42, fat: 12, portion: '1 Sandwich' },
  { name: 'Chicken Paratha Roll', calories: 480, protein: 26, carbs: 46, fat: 22, portion: '1 Roll' },

  // Drinks & Beverages
  { name: 'Sweet Lassi', calories: 220, protein: 6, carbs: 28, fat: 9, portion: '1 Glass (250ml)' },
  { name: 'Namkeen Lassi (Salty Dahi)', calories: 110, protein: 5, carbs: 8, fat: 6, portion: '1 Glass (250ml)' },
  { name: 'Chai (Traditional Karak Tea)', calories: 90, protein: 2, carbs: 14, fat: 3, portion: '1 Cup' },
  { name: 'Kashmiri Pink Tea', calories: 130, protein: 3, carbs: 16, fat: 6, portion: '1 Cup' },
  { name: 'Sugarcane Juice (Ganay Ka Ras)', calories: 180, protein: 1, carbs: 45, fat: 0, portion: '1 Glass (300ml)' },

  // Desserts & Sweets
  { name: 'Kheer (Rice Pudding)', calories: 240, protein: 6, carbs: 38, fat: 8, portion: '1 Bowl (150g)' },
  { name: 'Gulab Jamun', calories: 300, protein: 4, carbs: 48, fat: 11, portion: '2 Pieces (100g)' },
  { name: 'Gajar Ka Halwa', calories: 320, protein: 6, carbs: 42, fat: 15, portion: '1 Bowl (150g)' },
  { name: 'Jalebi', calories: 290, protein: 2, carbs: 56, fat: 7, portion: '100g' }
];

export const PAKISTANI_DIET_PLANS = [
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

interface PakistaniFoodsSectionProps {
  themeColor?: string;
  onLogFoodItem?: (item: typeof PAKISTANI_FOOD_ITEMS[0]) => void;
  onLogDietPlan?: (plan: typeof PAKISTANI_DIET_PLANS[0]) => void;
  onLogDietMeal?: (meal: any) => void;
}

export function PakistaniFoodsSection({
  themeColor = '#00F0FF',
  onLogFoodItem,
  onLogDietPlan,
  onLogDietMeal
}: PakistaniFoodsSectionProps) {
  const [subMode, setSubMode] = useState<'items' | 'plans' | 'creator'>('items');
  const [creatorMode, setCreatorMode] = useState<'food' | 'plan'>('food');
  const [selectedPlanId, setSelectedPlanId] = useState('pk_balanced');
  const [searchTerm, setSearchTerm] = useState('');

  // Persisted Custom Foods
  const [customFoods, setCustomFoods] = useState<typeof PAKISTANI_FOOD_ITEMS>(() => {
    const saved = localStorage.getItem('custom_traditional_foods');
    return saved ? JSON.parse(saved) : [];
  });

  // Persisted Custom Diets
  const [customDiets, setCustomDiets] = useState<any[]>(() => {
    const saved = localStorage.getItem('custom_diet_plans');
    return saved ? JSON.parse(saved) : [];
  });

  // Merge lists
  const allFoodItems = [...PAKISTANI_FOOD_ITEMS, ...customFoods];
  const allDietPlans = [...PAKISTANI_DIET_PLANS, ...customDiets];

  // Filters
  const filteredItems = allFoodItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activePlan = allDietPlans.find(p => p.id === selectedPlanId) || allDietPlans[0];

  // Custom Food Form State
  const [foodName, setFoodName] = useState('');
  const [foodPortion, setFoodPortion] = useState('');
  const [foodCalories, setFoodCalories] = useState('');
  const [foodProtein, setFoodProtein] = useState('');
  const [foodCarbs, setFoodCarbs] = useState('');
  const [foodFat, setFoodFat] = useState('');

  // Custom Diet Form State
  const [planName, setPlanName] = useState('');
  const [planType, setPlanType] = useState('Maintenance');
  const [planDesc, setPlanDesc] = useState('');
  const [planMeals, setPlanMeals] = useState<any[]>([]);

  // Individual Meal Creator State (inside custom diet plan)
  const [mealName, setMealName] = useState('');
  const [mealCalories, setMealCalories] = useState('');
  const [mealProtein, setMealProtein] = useState('');
  const [mealCarbs, setMealCarbs] = useState('');
  const [mealFat, setMealFat] = useState('');
  const [mealTime, setMealTime] = useState('Breakfast');

  const handleSaveCustomFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName || !foodCalories) {
      alert("Food Name and Calories are required.");
      return;
    }

    const newItem = {
      name: foodName.toUpperCase(),
      portion: foodPortion || '1 Portion',
      calories: Number(foodCalories),
      protein: foodProtein ? Number(foodProtein) : 0,
      carbs: foodCarbs ? Number(foodCarbs) : 0,
      fat: foodFat ? Number(foodFat) : 0,
      isCustom: true
    };

    const updated = [newItem, ...customFoods];
    setCustomFoods(updated);
    localStorage.setItem('custom_traditional_foods', JSON.stringify(updated));

    // Reset Form
    setFoodName('');
    setFoodPortion('');
    setFoodCalories('');
    setFoodProtein('');
    setFoodCarbs('');
    setFoodFat('');

    alert(`Successfully added food item: ${newItem.name}`);
    setSubMode('items');
  };

  const handleDeleteCustomFood = (indexToDelete: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this custom food item?")) return;
    const updated = customFoods.filter((_, i) => i !== indexToDelete);
    setCustomFoods(updated);
    localStorage.setItem('custom_traditional_foods', JSON.stringify(updated));
  };

  const handleAddMealToPlanBuilder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealName || !mealCalories) {
      alert("Meal Name and Calories are required.");
      return;
    }

    const newMeal = {
      name: mealName.toUpperCase(),
      calories: Number(mealCalories),
      protein: mealProtein ? Number(mealProtein) : 0,
      carbs: mealCarbs ? Number(mealCarbs) : 0,
      fat: mealFat ? Number(mealFat) : 0,
      time: mealTime
    };

    setPlanMeals([...planMeals, newMeal]);

    // Reset Meal Sub-Form
    setMealName('');
    setMealCalories('');
    setMealProtein('');
    setMealCarbs('');
    setMealFat('');
  };

  const handleSaveCustomDietPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!planName) {
      alert("Diet Plan Name is required.");
      return;
    }
    if (planMeals.length === 0) {
      alert("Please add at least one meal to this diet plan.");
      return;
    }

    // Calculate plan totals
    const totalCalories = planMeals.reduce((acc, m) => acc + m.calories, 0);
    const totalProtein = planMeals.reduce((acc, m) => acc + m.protein, 0);
    const totalCarbs = planMeals.reduce((acc, m) => acc + m.carbs, 0);
    const totalFat = planMeals.reduce((acc, m) => acc + m.fat, 0);

    const newPlan = {
      id: `custom_diet_${Date.now()}`,
      name: planName.toUpperCase(),
      type: planType,
      description: planDesc || "Custom structured nutritional protocol.",
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      meals: planMeals,
      isCustom: true
    };

    const updated = [newPlan, ...customDiets];
    setCustomDiets(updated);
    localStorage.setItem('custom_diet_plans', JSON.stringify(updated));

    // Reset Form
    setPlanName('');
    setPlanType('Maintenance');
    setPlanDesc('');
    setPlanMeals([]);

    alert(`Successfully created custom diet plan: ${newPlan.name}`);
    setSelectedPlanId(newPlan.id);
    setSubMode('plans');
  };

  const handleDeleteCustomDietPlan = (planId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this custom diet plan?")) return;
    const updated = customDiets.filter(p => p.id !== planId);
    setCustomDiets(updated);
    localStorage.setItem('custom_diet_plans', JSON.stringify(updated));
    setSelectedPlanId('pk_balanced');
  };

  return (
    <div className="space-y-4">
      {/* Sub-toggles inside Pakistan Foods Section */}
      <div className="flex gap-2 border border-[#262626] bg-[#141414] p-1 rounded-sm">
        <button
          type="button"
          onClick={() => setSubMode('items')}
          className={cn(
            "flex-1 py-1.5 text-[10px] font-mono font-bold tracking-widest uppercase transition-all rounded-sm",
            subMode === 'items' ? "bg-[#262626] text-white border border-[#333]" : "text-[#A3A3A3] hover:text-white"
          )}
        >
          Traditional Foods
        </button>
        <button
          type="button"
          onClick={() => setSubMode('plans')}
          className={cn(
            "flex-1 py-1.5 text-[10px] font-mono font-bold tracking-widest uppercase transition-all rounded-sm",
            subMode === 'plans' ? "bg-[#262626] text-white border border-[#333]" : "text-[#A3A3A3] hover:text-white"
          )}
        >
          Diet Plans
        </button>
        <button
          type="button"
          onClick={() => setSubMode('creator')}
          className={cn(
            "flex-1 py-1.5 text-[10px] font-mono font-bold tracking-widest uppercase transition-all rounded-sm",
            subMode === 'creator' ? "bg-[#262626] text-white border border-[#333]" : "text-[#A3A3A3] hover:text-white"
          )}
        >
          Create Custom
        </button>
      </div>

      {subMode === 'items' && (
        <div className="space-y-3">
          {/* Search bar */}
          <input
            type="text"
            placeholder="Search traditional & custom foods..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#141414] border border-[#262626] rounded-sm px-3 py-2 text-white font-mono text-xs tracking-wider focus:outline-none focus:ring-1 transition-colors uppercase placeholder:text-[#555]"
            style={{ '--tw-ring-color': themeColor, outlineColor: themeColor } as any}
          />

          {/* Items list */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
            {filteredItems.map((item: any, idx) => {
              const customIndex = customFoods.findIndex(cf => cf.name === item.name);
              const isCustom = item.isCustom || customIndex !== -1;

              return (
                <div 
                  key={idx} 
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 bg-[#141414] border border-[#262626] rounded-sm hover:border-[#333] transition-all gap-2"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">{item.name}</span>
                      {isCustom && (
                        <span className="text-[7.5px] font-mono px-1 py-0.2 bg-emerald-950/40 text-emerald-400 border border-emerald-800 rounded-xs tracking-widest uppercase font-bold">CUSTOM</span>
                      )}
                    </div>
                    <div className="text-[9px] font-mono text-[#A3A3A3] uppercase tracking-widest mt-0.5">
                      Portion: {item.portion} | {item.calories} KCAL
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-0 border-[#262626] pt-1.5 sm:pt-0">
                    <div className="flex gap-2 text-[9px] font-mono text-[#A3A3A3]">
                      <span className="text-red-400 font-bold">P:{item.protein || 0}g</span>
                      <span className="text-yellow-400 font-bold">C:{item.carbs || 0}g</span>
                      <span className="text-blue-400 font-bold">F:{item.fat || 0}g</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {isCustom && customIndex !== -1 && (
                        <button
                          type="button"
                          onClick={(e) => handleDeleteCustomFood(customIndex, e)}
                          className="p-1.5 bg-red-950/20 text-red-500 hover:text-red-400 hover:bg-red-950/40 rounded-sm border border-red-900 transition-colors cursor-pointer"
                          title="Delete Custom Food"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onLogFoodItem(item)}
                        className="flex items-center justify-center p-1.5 bg-[#262626] hover:bg-[#333] hover:text-white rounded-sm border border-[#333] transition-colors cursor-pointer"
                        title="Log Item"
                      >
                        <Plus className="w-3.5 h-3.5" style={{ color: themeColor }} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {subMode === 'plans' && (
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-mono text-[#A3A3A3] mb-1.5 tracking-widest uppercase">SELECT PAKISTANI OR CUSTOM DIET PLAN</label>
            <select
              value={selectedPlanId}
              onChange={(e) => setSelectedPlanId(e.target.value)}
              className="w-full bg-[#141414] border border-[#262626] rounded-sm px-3 py-2 text-white font-mono text-xs tracking-wider focus:outline-none focus:ring-1 transition-all uppercase cursor-pointer"
              style={{ '--tw-ring-color': themeColor, outlineColor: themeColor } as any}
            >
              {allDietPlans.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="bg-[#141414] border border-[#262626] rounded-sm p-3.5 space-y-3 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] font-mono px-2 py-0.5 bg-[#262626] border border-[#333] text-[#A3A3A3] rounded-sm tracking-widest uppercase">{activePlan.type}</span>
                <h4 className="text-xs font-mono font-bold tracking-wider text-white mt-1.5 uppercase flex items-center gap-1.5">
                  {activePlan.name}
                  {activePlan.isCustom && (
                    <span className="text-[7.5px] font-mono px-1 py-0.2 bg-emerald-950/40 text-emerald-400 border border-emerald-800 rounded-xs tracking-widest uppercase font-bold">CUSTOM</span>
                  )}
                </h4>
              </div>
              {activePlan.isCustom && (
                <button
                  type="button"
                  onClick={(e) => handleDeleteCustomDietPlan(activePlan.id, e)}
                  className="flex items-center space-x-1 border border-red-900 bg-red-950/20 px-2 py-1 rounded-sm text-red-500 hover:text-white hover:bg-red-900 transition-colors font-mono text-[9px] uppercase cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>DELETE PLAN</span>
                </button>
              )}
            </div>

            <p className="text-[10px] font-mono text-[#A3A3A3] leading-relaxed uppercase tracking-wider">{activePlan.description}</p>
            
            <div className="grid grid-cols-4 gap-2 bg-[#0A0A0A] p-2 rounded-sm border border-[#262626] text-center">
              <div className="text-[9px] font-mono uppercase">
                <div className="text-[#A3A3A3] tracking-widest">CALORIES</div>
                <div className="text-white font-bold mt-0.5">{activePlan.totalCalories}</div>
              </div>
              <div className="text-[9px] font-mono uppercase">
                <div className="text-red-400 font-bold tracking-widest">PROTEIN</div>
                <div className="text-white font-bold mt-0.5">{activePlan.totalProtein}g</div>
              </div>
              <div className="text-[9px] font-mono uppercase">
                <div className="text-yellow-400 font-bold tracking-widest">CARBS</div>
                <div className="text-white font-bold mt-0.5">{activePlan.totalCarbs}g</div>
              </div>
              <div className="text-[9px] font-mono uppercase">
                <div className="text-blue-400 font-bold tracking-widest">FAT</div>
                <div className="text-white font-bold mt-0.5">{activePlan.totalFat}g</div>
              </div>
            </div>

            <div className="border-t border-[#262626] pt-3 space-y-2">
              <span className="text-[9px] font-mono text-[#555] tracking-widest uppercase font-bold">MEALS IN THIS PROTOCOL</span>
              <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                {activePlan.meals.map((meal: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center text-[10px] font-mono py-1.5 border-b border-[#262626]/40 last:border-0 hover:bg-[#1C1C1C]/30 px-1 rounded-sm transition-all group">
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] font-mono px-1 py-0.5 bg-[#262626] text-[#A3A3A3] rounded-sm uppercase">{meal.time}</span>
                      <span className="text-white font-medium tracking-wide uppercase">{meal.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-[#A3A3A3] tracking-wider uppercase font-bold">
                        {meal.calories} KCAL
                      </span>
                      <button
                        type="button"
                        onClick={() => onLogDietMeal(meal)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[#262626] rounded text-indigo-400 hover:text-white transition-all cursor-pointer flex items-center justify-center border border-transparent hover:border-[#333]"
                        title="Log this meal only"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#262626] text-xs font-mono bg-[#0A0A0A] -mx-3.5 -mb-3.5 p-3">
              <span className="text-[#A3A3A3] uppercase tracking-wider text-[9px] font-mono">
                Log whole protocol for today
              </span>
              <button
                type="button"
                onClick={() => onLogDietPlan(activePlan)}
                className="flex items-center space-x-1 border border-transparent px-3 py-1.5 rounded-sm transition-colors text-black font-mono text-[9px] font-bold tracking-widest uppercase cursor-pointer hover:opacity-90 active:scale-[0.98]"
                style={{ backgroundColor: themeColor }}
              >
                <Plus className="w-3.5 h-3.5 text-black" />
                <span>EXECUTE DIET</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {subMode === 'creator' && (
        <div className="bg-[#141414] border border-[#262626] rounded-sm p-4 space-y-4">
          <div className="flex gap-2 border-b border-[#262626] pb-3">
            <button
              type="button"
              onClick={() => setCreatorMode('food')}
              className={cn(
                "flex-1 py-1 text-[9px] font-mono tracking-widest uppercase transition-all rounded-sm",
                creatorMode === 'food' ? "bg-indigo-950/40 text-indigo-400 border border-indigo-800" : "text-[#A3A3A3] hover:text-white"
              )}
            >
              + Custom Food
            </button>
            <button
              type="button"
              onClick={() => setCreatorMode('plan')}
              className={cn(
                "flex-1 py-1 text-[9px] font-mono tracking-widest uppercase transition-all rounded-sm",
                creatorMode === 'plan' ? "bg-indigo-950/40 text-indigo-400 border border-indigo-800" : "text-[#A3A3A3] hover:text-white"
              )}
            >
              + Diet Plan
            </button>
          </div>

          {creatorMode === 'food' ? (
            /* Create Custom Food Item Form */
            <form onSubmit={handleSaveCustomFood} className="space-y-3.5">
              <span className="block text-[10px] font-mono text-[#A3A3A3] tracking-widest uppercase font-bold text-center">ADD CUSTOM FOOD ITEM</span>
              
              <div>
                <label className="block text-[8px] font-mono text-[#A3A3A3] mb-1 tracking-widest uppercase">FOOD NAME</label>
                <input 
                  type="text" 
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded-sm px-3 py-2 text-white font-mono text-xs tracking-wider focus:outline-none uppercase placeholder:text-[#333]"
                  placeholder="E.G., SHAMI KABAB HAMBURGER"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[8px] font-mono text-[#A3A3A3] mb-1 tracking-widest uppercase">PORTION SIZE</label>
                  <input 
                    type="text" 
                    value={foodPortion}
                    onChange={(e) => setFoodPortion(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-[#262626] rounded-sm px-3 py-2 text-white font-mono text-xs tracking-wider focus:outline-none uppercase placeholder:text-[#333]"
                    placeholder="E.G., 1 BURGER"
                  />
                </div>
                <div>
                  <label className="block text-[8px] font-mono text-[#A3A3A3] mb-1 tracking-widest uppercase">CALORIES (KCAL)</label>
                  <input 
                    type="number" 
                    value={foodCalories}
                    onChange={(e) => setFoodCalories(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-[#262626] rounded-sm px-3 py-2 text-white font-mono text-xs tracking-wider focus:outline-none placeholder:text-[#333]"
                    placeholder="KCAL"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[8px] font-mono text-red-400 mb-1 tracking-widest uppercase">PROTEIN (G)</label>
                  <input 
                    type="number" 
                    value={foodProtein}
                    onChange={(e) => setFoodProtein(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-[#262626] rounded-sm px-3 py-2 text-white font-mono text-xs tracking-wider focus:outline-none placeholder:text-[#333]"
                    placeholder="G"
                  />
                </div>
                <div>
                  <label className="block text-[8px] font-mono text-yellow-400 mb-1 tracking-widest uppercase">CARBS (G)</label>
                  <input 
                    type="number" 
                    value={foodCarbs}
                    onChange={(e) => setFoodCarbs(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-[#262626] rounded-sm px-3 py-2 text-white font-mono text-xs tracking-wider focus:outline-none placeholder:text-[#333]"
                    placeholder="G"
                  />
                </div>
                <div>
                  <label className="block text-[8px] font-mono text-blue-400 mb-1 tracking-widest uppercase">FAT (G)</label>
                  <input 
                    type="number" 
                    value={foodFat}
                    onChange={(e) => setFoodFat(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-[#262626] rounded-sm px-3 py-2 text-white font-mono text-xs tracking-wider focus:outline-none placeholder:text-[#333]"
                    placeholder="G"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs font-bold tracking-widest uppercase rounded-sm transition-all shadow-sm active:scale-[0.99] cursor-pointer"
              >
                SAVE CUSTOM FOOD
              </button>
            </form>
          ) : (
            /* Create Custom Diet Plan Form */
            <div className="space-y-4">
              <span className="block text-[10px] font-mono text-[#A3A3A3] tracking-widest uppercase font-bold text-center">CREATE MULTI-MEAL DIET PLAN</span>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-[8px] font-mono text-[#A3A3A3] mb-1 tracking-widest uppercase">DIET PLAN NAME</label>
                  <input 
                    type="text" 
                    value={planName}
                    onChange={(e) => setPlanName(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-[#262626] rounded-sm px-3 py-2 text-white font-mono text-xs tracking-wider focus:outline-none uppercase placeholder:text-[#333]"
                    placeholder="E.G., HIGH PROTEIN Traditional BULK"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[8px] font-mono text-[#A3A3A3] mb-1 tracking-widest uppercase">GOAL / TYPE</label>
                    <select
                      value={planType}
                      onChange={(e) => setPlanType(e.target.value)}
                      className="w-full bg-[#0A0A0A] border border-[#262626] rounded-sm px-3 py-2 text-white font-mono text-xs tracking-wider focus:outline-none uppercase cursor-pointer"
                    >
                      <option value="Weight Loss / Cut">Weight Loss / Cut</option>
                      <option value="Muscle Building / Bulk">Muscle Building / Bulk</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Cardio Fitness">Cardio Fitness</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[8px] font-mono text-[#A3A3A3] mb-1 tracking-widest uppercase">PLAN DESCRIPTION</label>
                    <input 
                      type="text" 
                      value={planDesc}
                      onChange={(e) => setPlanDesc(e.target.value)}
                      className="w-full bg-[#0A0A0A] border border-[#262626] rounded-sm px-3 py-2 text-white font-mono text-xs tracking-wider focus:outline-none uppercase placeholder:text-[#333]"
                      placeholder="E.G., TRADITIONAL BULK MEAL PROTOCOL"
                    />
                  </div>
                </div>
              </div>

              {/* Added Meals List */}
              <div className="border-t border-[#262626] pt-3">
                <span className="block text-[9px] font-mono text-[#A3A3A3] mb-2 tracking-widest uppercase font-bold">ADDED MEALS ({planMeals.length})</span>
                <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1 mb-3">
                  {planMeals.map((meal, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-[#0A0A0A] border border-[#262626] px-2 py-1.5 rounded-sm">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[8px] font-mono px-1 py-0.2 bg-[#262626] text-[#888] rounded-xs uppercase">{meal.time}</span>
                        <span className="text-[10px] font-mono font-bold text-white uppercase">{meal.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono text-[#A3A3A3] uppercase">{meal.calories} CAL</span>
                        <button
                          type="button"
                          onClick={() => setPlanMeals(planMeals.filter((_, i) => i !== idx))}
                          className="text-red-500 hover:text-red-400 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {planMeals.length === 0 && (
                    <p className="text-[10px] font-mono text-[#555] uppercase italic">No meals added yet. Use the tool below.</p>
                  )}
                </div>
              </div>

              {/* Add Meal Sub-Form */}
              <div className="bg-[#0A0A0A] border border-[#262626] p-3 rounded-sm space-y-2">
                <span className="block text-[8px] font-mono text-indigo-400 tracking-widest uppercase font-bold">+ ADD MEAL TO PLAN</span>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="col-span-2">
                    <input 
                      type="text" 
                      placeholder="MEAL NAME (E.G., CHICKEN BIRYANI + SALAD)" 
                      value={mealName}
                      onChange={(e) => setMealName(e.target.value)}
                      className="w-full bg-[#141414] border border-[#262626] rounded-sm px-2.5 py-1.5 text-white font-mono text-[10px] tracking-wider focus:outline-none uppercase placeholder:text-[#444]"
                    />
                  </div>
                  <div>
                    <input 
                      type="number" 
                      placeholder="CALORIES (KCAL)" 
                      value={mealCalories}
                      onChange={(e) => setMealCalories(e.target.value)}
                      className="w-full bg-[#141414] border border-[#262626] rounded-sm px-2.5 py-1.5 text-white font-mono text-[10px] tracking-wider focus:outline-none placeholder:text-[#444]"
                    />
                  </div>
                  <div>
                    <select
                      value={mealTime}
                      onChange={(e) => setMealTime(e.target.value)}
                      className="w-full bg-[#141414] border border-[#262626] rounded-sm px-2.5 py-1.5 text-white font-mono text-[10px] tracking-wider focus:outline-none uppercase cursor-pointer"
                    >
                      <option value="Breakfast">Breakfast</option>
                      <option value="Lunch">Lunch</option>
                      <option value="Dinner">Dinner</option>
                      <option value="Snack">Snack</option>
                    </select>
                  </div>

                  <div className="col-span-2 grid grid-cols-3 gap-1">
                    <input 
                      type="number" 
                      placeholder="PRO (G)" 
                      value={mealProtein}
                      onChange={(e) => setMealProtein(e.target.value)}
                      className="w-full bg-[#141414] border border-[#262626] rounded-sm px-1.5 py-1 text-white font-mono text-[9px] tracking-wider focus:outline-none placeholder:text-[#444]"
                    />
                    <input 
                      type="number" 
                      placeholder="CARB (G)" 
                      value={mealCarbs}
                      onChange={(e) => setMealCarbs(e.target.value)}
                      className="w-full bg-[#141414] border border-[#262626] rounded-sm px-1.5 py-1 text-white font-mono text-[9px] tracking-wider focus:outline-none placeholder:text-[#444]"
                    />
                    <input 
                      type="number" 
                      placeholder="FAT (G)" 
                      value={mealFat}
                      onChange={(e) => setMealFat(e.target.value)}
                      className="w-full bg-[#141414] border border-[#262626] rounded-sm px-1.5 py-1 text-white font-mono text-[9px] tracking-wider focus:outline-none placeholder:text-[#444]"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddMealToPlanBuilder}
                  className="w-full py-1.5 bg-[#1C1C1C] hover:bg-[#262626] border border-[#333] text-white font-mono text-[9px] font-bold tracking-widest uppercase rounded-sm transition-colors cursor-pointer"
                >
                  ADD MEAL
                </button>
              </div>

              <button
                type="button"
                onClick={handleSaveCustomDietPlan}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold tracking-widest uppercase rounded-sm transition-all shadow-sm active:scale-[0.99] cursor-pointer"
              >
                SAVE CUSTOM DIET PLAN
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
