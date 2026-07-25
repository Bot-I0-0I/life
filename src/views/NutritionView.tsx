import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, addXp, logSystemEvent } from '../db/db';
import { Flame, Utensils, Plus, Trash2, Target, Droplets, Beef, Wheat, Save, Download, Sparkles, Database, Search, Filter, ArrowUpDown, FileText, CheckCircle } from 'lucide-react';
import { cn, getRank } from '../lib/utils';
import { format, subDays, parseISO } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PakistaniFoodsSection } from '../components/PakistaniFoodsSection';

const EXPANDED_SQL_FOOD_DATABASE = [
  // Pakistani Curries & Mains
  { id: 101, name: 'Roti (Whole Wheat Chapati)', category: 'Pakistani', calories: 120, protein: 4, carbs: 24, fat: 1, portion: '1 Medium (40g)' },
  { id: 102, name: 'Tandoori Naan', category: 'Pakistani', calories: 260, protein: 8, carbs: 48, fat: 4, portion: '1 Piece (90g)' },
  { id: 103, name: 'Roghani Naan', category: 'Pakistani', calories: 340, protein: 9, carbs: 52, fat: 12, portion: '1 Piece (110g)' },
  { id: 104, name: 'Paratha (Whole Wheat / Ghee)', category: 'Pakistani', calories: 290, protein: 5, carbs: 38, fat: 13, portion: '1 Piece' },
  { id: 105, name: 'Chicken Biryani', category: 'Pakistani', calories: 550, protein: 28, carbs: 75, fat: 15, portion: '1 Plate (300g)' },
  { id: 106, name: 'Mutton Biryani', category: 'Pakistani', calories: 620, protein: 32, carbs: 74, fat: 22, portion: '1 Plate (300g)' },
  { id: 107, name: 'Beef Pulao', category: 'Pakistani', calories: 510, protein: 26, carbs: 68, fat: 16, portion: '1 Plate (300g)' },
  { id: 108, name: 'Dal Chawal (Lentils & Rice)', category: 'Pakistani', calories: 450, protein: 12, carbs: 85, fat: 6, portion: '1 Plate (350g)' },
  { id: 109, name: 'Chicken Karahi', category: 'Pakistani', calories: 380, protein: 32, carbs: 6, fat: 24, portion: '1 Portion (200g)' },
  { id: 110, name: 'Mutton Karahi', category: 'Pakistani', calories: 460, protein: 34, carbs: 4, fat: 34, portion: '1 Portion (200g)' },
  { id: 111, name: 'Chicken Handi (Boneless)', category: 'Pakistani', calories: 420, protein: 30, carbs: 8, fat: 30, portion: '1 Portion (200g)' },
  { id: 112, name: 'Beef Nihari', category: 'Pakistani', calories: 520, protein: 36, carbs: 12, fat: 36, portion: '1 Bowl (300g)' },
  { id: 113, name: 'Mutton Paya Curry', category: 'Pakistani', calories: 480, protein: 38, carbs: 5, fat: 34, portion: '1 Bowl (350g)' },
  { id: 114, name: 'Chicken Haleem', category: 'Pakistani', calories: 410, protein: 30, carbs: 48, fat: 12, portion: '1 Bowl (300g)' },
  { id: 115, name: 'Palak Paneer', category: 'Pakistani', calories: 270, protein: 14, carbs: 10, fat: 20, portion: '1 Cup (200g)' },
  { id: 116, name: 'Aloo Gobi', category: 'Pakistani', calories: 160, protein: 4, carbs: 22, fat: 7, portion: '1 Cup (180g)' },
  { id: 117, name: 'Daal Tadka (Yellow Lentils)', category: 'Pakistani', calories: 190, protein: 9, carbs: 26, fat: 6, portion: '1 Cup (200g)' },
  { id: 118, name: 'Chicken Jalfrezi', category: 'Pakistani', calories: 340, protein: 30, carbs: 12, fat: 18, portion: '1 Portion (200g)' },
  { id: 119, name: 'Mutton Kunna Claypot', category: 'Pakistani', calories: 490, protein: 36, carbs: 6, fat: 35, portion: '1 Bowl (250g)' },
  { id: 120, name: 'Keema Mattar (Beef Minced)', category: 'Pakistani', calories: 360, protein: 31, carbs: 10, fat: 22, portion: '1 Bowl (200g)' },

  // BBQ & Kebabs
  { id: 151, name: 'Chicken Tikka (Breast)', category: 'BBQ', calories: 280, protein: 42, carbs: 2, fat: 11, portion: '1 Piece (200g)' },
  { id: 152, name: 'Chicken Malai Boti', category: 'BBQ', calories: 320, protein: 32, carbs: 3, fat: 20, portion: '5 Pieces (180g)' },
  { id: 153, name: 'Beef Seekh Kabab', category: 'BBQ', calories: 160, protein: 18, carbs: 2, fat: 9, portion: '1 Skewer (60g)' },
  { id: 154, name: 'Chicken Reshmi Kabab', category: 'BBQ', calories: 170, protein: 19, carbs: 3, fat: 9, portion: '1 Skewer (60g)' },
  { id: 155, name: 'Chapli Kabab (Peshawari Beef)', category: 'BBQ', calories: 310, protein: 24, carbs: 6, fat: 22, portion: '1 Kabab (120g)' },
  { id: 156, name: 'Egg Shami Kabab', category: 'BBQ', calories: 150, protein: 10, carbs: 6, fat: 9, portion: '1 Piece (60g)' },
  { id: 157, name: 'Fish Tikka', category: 'BBQ', calories: 220, protein: 32, carbs: 1, fat: 10, portion: '1 Portion (180g)' },
  { id: 158, name: 'Chicken Sajji (Half)', category: 'BBQ', calories: 580, protein: 62, carbs: 2, fat: 36, portion: 'Half Roasted (350g)' },
  { id: 159, name: 'Chicken Seekh Kabab', category: 'BBQ', calories: 140, protein: 19, carbs: 2, fat: 6, portion: '1 Skewer (60g)' },
  { id: 160, name: 'Peshawari Fried Fish', category: 'BBQ', calories: 330, protein: 34, carbs: 12, fat: 16, portion: '1 Portion (200g)' },

  // High Protein & Global Staples
  { id: 201, name: 'Grilled Chicken Breast', category: 'High Protein', calories: 220, protein: 44, carbs: 0, fat: 4, portion: '200g Raw' },
  { id: 202, name: 'Whey Protein Isolate', category: 'High Protein', calories: 120, protein: 26, carbs: 2, fat: 1, portion: '1 Scoop (30g)' },
  { id: 203, name: 'Whole Eggs (Boiled)', category: 'High Protein', calories: 155, protein: 13, carbs: 1, fat: 11, portion: '2 Large' },
  { id: 204, name: 'Egg Whites', category: 'High Protein', calories: 50, protein: 11, carbs: 1, fat: 0, portion: '100ml (3 Whites)' },
  { id: 205, name: 'Salmon Fillet', category: 'High Protein', calories: 350, protein: 38, carbs: 0, fat: 22, portion: '200g' },
  { id: 206, name: 'Lean Beef Steak', category: 'High Protein', calories: 380, protein: 48, carbs: 0, fat: 20, portion: '200g' },
  { id: 207, name: 'Canned Tuna in Water', category: 'High Protein', calories: 130, protein: 28, carbs: 0, fat: 1, portion: '1 Can (120g)' },
  { id: 208, name: 'Greek Yogurt (Low Fat)', category: 'High Protein', calories: 130, protein: 18, carbs: 6, fat: 3, portion: '1 Cup (200g)' },
  { id: 209, name: 'Cottage Cheese (Paneer)', category: 'High Protein', calories: 180, protein: 22, carbs: 4, fat: 8, portion: '150g' },
  { id: 210, name: 'Firm Tofu', category: 'High Protein', calories: 140, protein: 16, carbs: 3, fat: 8, portion: '150g' },
  { id: 211, name: 'Turkey Breast Slice', category: 'High Protein', calories: 110, protein: 24, carbs: 1, fat: 1, portion: '100g' },
  { id: 212, name: 'Protein Chana Salad', category: 'High Protein', calories: 210, protein: 11, carbs: 32, fat: 4, portion: '1 Bowl (200g)' },

  // Complex Carbs & Grains
  { id: 301, name: 'Rolled Oats / Oatmeal', category: 'Carbs', calories: 190, protein: 7, carbs: 34, fat: 3, portion: '1/2 Cup (50g)' },
  { id: 302, name: 'Sweet Potato (Baked)', category: 'Carbs', calories: 160, protein: 3, carbs: 37, fat: 0, portion: '1 Medium (180g)' },
  { id: 303, name: 'Boiled White Rice', category: 'Carbs', calories: 200, protein: 4, carbs: 44, fat: 0, portion: '1 Cup (150g)' },
  { id: 304, name: 'Cooked Brown Rice', category: 'Carbs', calories: 215, protein: 5, carbs: 45, fat: 2, portion: '1 Cup (150g)' },
  { id: 305, name: 'Cooked Quinoa', category: 'Carbs', calories: 220, protein: 8, carbs: 39, fat: 4, portion: '1 Cup (180g)' },
  { id: 306, name: 'Whole Wheat Pasta', category: 'Carbs', calories: 210, protein: 8, carbs: 42, fat: 2, portion: '1 Cup cooked' },
  { id: 307, name: 'Boiled White Potatoes', category: 'Carbs', calories: 130, protein: 3, carbs: 30, fat: 0, portion: '1 Medium (150g)' },
  { id: 308, name: 'Brown Bread', category: 'Carbs', calories: 140, protein: 6, carbs: 26, fat: 2, portion: '2 Slices (60g)' },

  // Healthy Fats & Nuts
  { id: 401, name: 'Raw Almonds', category: 'Fats', calories: 160, protein: 6, carbs: 6, fat: 14, portion: '1 Handful (28g)' },
  { id: 402, name: 'Fresh Avocado', category: 'Fats', calories: 240, protein: 3, carbs: 12, fat: 22, portion: '1 Medium' },
  { id: 403, name: 'Natural Peanut Butter', category: 'Fats', calories: 190, protein: 8, carbs: 7, fat: 16, portion: '2 Tbsp (32g)' },
  { id: 404, name: 'Extra Virgin Olive Oil', category: 'Fats', calories: 120, protein: 0, carbs: 0, fat: 14, portion: '1 Tbsp (15ml)' },
  { id: 405, name: 'Desi Ghee', category: 'Fats', calories: 130, protein: 0, carbs: 0, fat: 15, portion: '1 Tbsp (15g)' },
  { id: 406, name: 'Walnuts', category: 'Fats', calories: 185, protein: 4, carbs: 4, fat: 18, portion: '1 Handful (28g)' },
  { id: 407, name: 'Chia Seeds', category: 'Fats', calories: 140, protein: 5, carbs: 12, fat: 9, portion: '2 Tbsp (28g)' },
  { id: 408, name: 'Roasted Chana (Spiced)', category: 'Fats', calories: 160, protein: 9, carbs: 26, fat: 3, portion: '1 Handful (40g)' },

  // Fruits & Vegetables
  { id: 501, name: 'Fresh Banana', category: 'Fruits & Veggies', calories: 105, protein: 1, carbs: 27, fat: 0, portion: '1 Medium' },
  { id: 502, name: 'Fresh Apple', category: 'Fruits & Veggies', calories: 95, protein: 0, carbs: 25, fat: 0, portion: '1 Medium' },
  { id: 503, name: 'Fresh Pakistani Mango', category: 'Fruits & Veggies', calories: 150, protein: 2, carbs: 38, fat: 0, portion: '1 Whole' },
  { id: 504, name: 'Fresh Dates (Khajoor)', category: 'Fruits & Veggies', calories: 130, protein: 1, carbs: 35, fat: 0, portion: '4 Pieces' },
  { id: 505, name: 'Steamed Broccoli', category: 'Fruits & Veggies', calories: 55, protein: 4, carbs: 11, fat: 1, portion: '1 Cup (150g)' },
  { id: 506, name: 'Fresh Cucumber Salad', category: 'Fruits & Veggies', calories: 20, protein: 1, carbs: 4, fat: 0, portion: '1 Bowl' },
  { id: 507, name: 'Watermelon Slices', category: 'Fruits & Veggies', calories: 85, protein: 1, carbs: 21, fat: 0, portion: '1 Bowl (250g)' },

  // Street Food & Fast Food
  { id: 601, name: 'Chana Chaat', category: 'Fast Food', calories: 180, protein: 7, carbs: 32, fat: 3, portion: '1 Cup (150g)' },
  { id: 602, name: 'Chicken Bun Kabab', category: 'Fast Food', calories: 340, protein: 18, carbs: 42, fat: 12, portion: '1 Sandwich' },
  { id: 603, name: 'Chicken Paratha Roll', category: 'Fast Food', calories: 480, protein: 26, carbs: 46, fat: 22, portion: '1 Roll' },
  { id: 604, name: 'Crispy Zinger Burger', category: 'Fast Food', calories: 560, protein: 28, carbs: 54, fat: 26, portion: '1 Burger' },
  { id: 605, name: 'Chicken Shawarma Roll', category: 'Fast Food', calories: 420, protein: 24, carbs: 40, fat: 18, portion: '1 Roll' },

  // Beverages & Sweets
  { id: 701, name: 'Sweet Lassi', category: 'Beverages', calories: 220, protein: 6, carbs: 28, fat: 9, portion: '1 Glass (250ml)' },
  { id: 702, name: 'Karak Milk Tea (Chai)', category: 'Beverages', calories: 90, protein: 2, carbs: 14, fat: 3, portion: '1 Cup' },
  { id: 703, name: 'Sugarcane Juice', category: 'Beverages', calories: 180, protein: 1, carbs: 45, fat: 0, portion: '1 Glass' },
  { id: 704, name: 'Rice Kheer Dessert', category: 'Sweets', calories: 240, protein: 6, carbs: 38, fat: 8, portion: '1 Bowl' },
  { id: 705, name: 'Gulab Jamun', category: 'Sweets', calories: 300, protein: 4, carbs: 48, fat: 11, portion: '2 Pieces' }
];

export function NutritionView() {
  const userStats = useLiveQuery(() => db.userStats.get(1));
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

  const [activeSubTab, setActiveSubTab] = useState<'tracker' | 'sql_house' | 'pakistani_diets'>('tracker');
  const [showFormulaModal, setShowFormulaModal] = useState(false);

  // Advanced Formula Calculator State
  const [calcFormula, setCalcFormula] = useState<'mifflin' | 'katch' | 'harris'>('mifflin');
  const [calcWeightKg, setCalcWeightKg] = useState('70');
  const [calcHeightCm, setCalcHeightCm] = useState('175');
  const [calcAgeYrs, setCalcAgeYrs] = useState('25');
  const [calcGenderType, setCalcGenderType] = useState<'male' | 'female'>('male');
  const [calcBodyFatPct, setCalcBodyFatPct] = useState('15');
  const [calcActivityLevel, setCalcActivityLevel] = useState<number>(1.375);
  const [calcHealthGoal, setCalcHealthGoal] = useState<'cut_aggr' | 'cut_mod' | 'maint' | 'bulk_lean' | 'bulk_heavy'>('maint');
  const [calcMacroPreset, setCalcMacroPreset] = useState<'balanced' | 'high_protein' | 'keto' | 'low_fat'>('balanced');

  // Manual Log Form State
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [waterAmount, setWaterAmount] = useState('');

  // SQL Data House / Spreadsheet State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<'calories' | 'protein' | 'carbs' | 'fat'>('protein');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [selectedMealSlot, setSelectedMealSlot] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'>('Lunch');

  if (!userStats || !nutritionLogs) return <div className="p-[#1a1a1a] p-6 font-mono text-white opacity-80 uppercase">Loading Metabolism Engine...</div>;

  const level = Math.floor((userStats.xp || 0) / 1000) + 1;
  const rankColor = getRank(level).color;
  const themeColor = userStats?.selectedColor || rankColor;

  // Real-time BMR & TDEE Calculations using Advanced Formulas
  const wKg = userStats.weight || parseFloat(calcWeightKg) || 70;
  const hCm = userStats.height || parseFloat(calcHeightCm) || 175;
  const aYrs = userStats.age || parseInt(calcAgeYrs) || 25;
  const gType = userStats.gender || calcGenderType;

  // Formula 1: Mifflin-St Jeor Equation
  const bmrMifflin = (10 * wKg) + (6.25 * hCm) - (5 * aYrs) + (gType === 'female' ? -161 : 5);

  // Formula 2: Katch-McArdle Equation (Lean Body Mass)
  const leanBodyMassKg = wKg * (1 - (parseFloat(calcBodyFatPct) / 100));
  const bmrKatch = 370 + (21.6 * leanBodyMassKg);

  // Formula 3: Harris-Benedict Revised Equation
  const bmrHarris = gType === 'female'
    ? 447.593 + (9.247 * wKg) + (3.098 * hCm) - (4.330 * aYrs)
    : 88.362 + (13.397 * wKg) + (4.799 * hCm) - (5.677 * aYrs);

  let activeBmr = bmrMifflin;
  if (calcFormula === 'katch') activeBmr = bmrKatch;
  if (calcFormula === 'harris') activeBmr = bmrHarris;

  const activeTdee = activeBmr * calcActivityLevel;

  let goalCalorieModifier = 0;
  if (calcHealthGoal === 'cut_aggr') goalCalorieModifier = -750;
  else if (calcHealthGoal === 'cut_mod') goalCalorieModifier = -400;
  else if (calcHealthGoal === 'bulk_lean') goalCalorieModifier = +300;
  else if (calcHealthGoal === 'bulk_heavy') goalCalorieModifier = +600;

  const targetCalories = Math.round(activeTdee + goalCalorieModifier);

  let proRatio = 0.30, carbRatio = 0.40, fatRatio = 0.30;
  if (calcMacroPreset === 'high_protein') { proRatio = 0.40; carbRatio = 0.35; fatRatio = 0.25; }
  else if (calcMacroPreset === 'keto') { proRatio = 0.25; carbRatio = 0.05; fatRatio = 0.70; }
  else if (calcMacroPreset === 'low_fat') { proRatio = 0.35; carbRatio = 0.50; fatRatio = 0.15; }

  const targetProtein = Math.round((targetCalories * proRatio) / 4);
  const targetCarbs = Math.round((targetCalories * carbRatio) / 4);
  const targetFat = Math.round((targetCalories * fatRatio) / 9);

  const consumedCalories = nutritionLogs.filter(log => log.type === 'food').reduce((acc, log) => acc + log.calories, 0);
  const consumedProtein = nutritionLogs.filter(log => log.type === 'food').reduce((acc, log) => acc + (log.protein || 0), 0);
  const consumedCarbs = nutritionLogs.filter(log => log.type === 'food').reduce((acc, log) => acc + (log.carbs || 0), 0);
  const consumedFat = nutritionLogs.filter(log => log.type === 'food').reduce((acc, log) => acc + (log.fat || 0), 0);
  const consumedWater = nutritionLogs.filter(log => log.type === 'water').reduce((acc, log) => acc + (log.amount || 0), 0);

  const handleLogManualFood = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !calories) return;

    await db.nutritionLogs.add({
      date: today,
      type: 'food',
      name,
      calories: parseInt(calories),
      protein: protein ? parseInt(protein) : undefined,
      carbs: carbs ? parseInt(carbs) : undefined,
      fat: fat ? parseInt(fat) : undefined
    });

    await addXp(parseInt(calories) / 2 + 50);
    await logSystemEvent('NUTRITION', 'SUCCESS', `Logged food: ${name} (${calories} kcal)`);

    setName('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
  };

  const handleLogWater = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waterAmount) return;

    await db.nutritionLogs.add({
      date: today,
      type: 'water',
      name: 'Hydration',
      calories: 0,
      amount: parseInt(waterAmount)
    });

    await addXp(50);
    await logSystemEvent('NUTRITION', 'SUCCESS', `Logged water: ${waterAmount} ml`);
    setWaterAmount('');
  };

  const handleLogFoodFromSpreadsheet = async (item: typeof EXPANDED_SQL_FOOD_DATABASE[0]) => {
    await db.nutritionLogs.add({
      date: today,
      type: 'food',
      name: `[${selectedMealSlot}] ${item.name} (${item.portion})`,
      calories: item.calories,
      protein: item.protein,
      carbs: item.carbs,
      fat: item.fat
    });

    await addXp(item.calories / 2 + 50);
    await logSystemEvent('NUTRITION', 'SUCCESS', `Logged from SQL Data House: ${item.name}`);
    alert(`✅ Logged ${item.name} (${item.calories} KCAL) into ${selectedMealSlot}!`);
  };

  const handleDeleteLog = async (id: number) => {
    await db.nutritionLogs.delete(id);
    await logSystemEvent('NUTRITION', 'WARN', `Deleted food log ID: ${id}`);
  };

  // SQL Spreadsheet Filter logic
  const filteredFoodData = EXPANDED_SQL_FOOD_DATABASE.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategoryFilter === 'ALL' || item.category.toUpperCase() === selectedCategoryFilter.toUpperCase();
    return matchesSearch && matchesCat;
  }).sort((a, b) => {
    const valA = a[sortBy];
    const valB = b[sortBy];
    return sortDir === 'desc' ? valB - valA : valA - valB;
  });

  const handleExportCsv = () => {
    const headers = "ID,Name,Category,Calories,Protein_g,Carbs_g,Fat_g,Portion\n";
    const rows = filteredFoodData.map(f => `${f.id},"${f.name}",${f.category},${f.calories},${f.protein},${f.carbs},${f.fat},"${f.portion}"`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'food_spreadsheet_database.csv';
    a.click();
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <header className="border-b border-[#262626] pb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-mono font-bold tracking-tight text-white flex items-center uppercase" style={{ color: themeColor }}>
              <Utensils className="w-8 h-8 mr-3" />
              METABOLISM & DIETARY DATA HOUSE
            </h2>
            <p className="text-[#A3A3A3] text-sm mt-1 font-mono uppercase tracking-widest">
              Manage caloric budget, macro balances, and access the SQL Spreadsheet Food Repository.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 bg-[#0A0A0A] p-1 border border-[#262626] rounded-sm gap-1 w-full sm:w-auto">
            <button
              onClick={() => setActiveSubTab('tracker')}
              className={cn(
                "px-3 py-2 text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider rounded-sm transition-all flex items-center justify-center w-full sm:w-auto",
                activeSubTab === 'tracker' ? "bg-[#141414] text-white" : "text-[#A3A3A3] hover:text-white"
              )}
              style={activeSubTab === 'tracker' ? { color: themeColor } : {}}
            >
              <span className="truncate">DIET TRACKER</span>
            </button>
            <button
              onClick={() => setActiveSubTab('sql_house')}
              className={cn(
                "px-3 py-2 text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider rounded-sm transition-all flex items-center justify-center gap-1.5 w-full sm:w-auto",
                activeSubTab === 'sql_house' ? "bg-[#141414] text-white" : "text-[#A3A3A3] hover:text-white"
              )}
              style={activeSubTab === 'sql_house' ? { color: themeColor } : {}}
            >
              <Database className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
              <span className="truncate">SQL DATA SPREADSHEET</span>
            </button>
            <button
              onClick={() => setActiveSubTab('pakistani_diets')}
              className={cn(
                "px-3 py-2 text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider rounded-sm transition-all flex items-center justify-center w-full sm:w-auto",
                activeSubTab === 'pakistani_diets' ? "bg-[#141414] text-white" : "text-[#A3A3A3] hover:text-white"
              )}
              style={activeSubTab === 'pakistani_diets' ? { color: themeColor } : {}}
            >
              <span className="truncate">PAKISTANI DIETS</span>
            </button>
          </div>
        </div>
      </header>

      {/* SUBTAB 1: DIET TRACKER */}
      {activeSubTab === 'tracker' && (
        <div className="space-y-8">
          {/* Caloric & Macro Budget Dashboard */}
          <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-6 relative overflow-hidden space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#262626] pb-4">
                <div>
                  <span className="text-[10px] font-mono text-[#A3A3A3] uppercase tracking-widest">DAILY CALORIC BUDGET</span>
                  <h3 className="text-2xl font-mono text-white font-bold">{consumedCalories} / {targetCalories} KCAL</h3>
                  <div className="text-[10px] font-mono text-cyan-400 mt-0.5 flex items-center gap-1">
                    <span>Formula: {calcFormula === 'mifflin' ? 'Mifflin-St Jeor' : calcFormula === 'katch' ? 'Katch-McArdle' : 'Harris-Benedict'}</span>
                    <span>| BMR: {Math.round(activeBmr)} KCAL</span>
                    <span>| TDEE: {Math.round(activeTdee)} KCAL</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                  <button
                    onClick={() => setShowFormulaModal(true)}
                    className="px-3 py-1.5 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 font-bold uppercase rounded-sm flex items-center gap-1.5 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> ADVANCED HEALTH FORMULAS
                  </button>
                  <div className="px-3 py-1.5 bg-[#141414] border border-[#262626] rounded-sm">
                    <span className="text-[#A3A3A3] uppercase">NET REMAINING:</span> <span className="text-emerald-400 font-bold">{Math.max(0, targetCalories - consumedCalories)} KCAL</span>
                  </div>
                </div>
              </div>

            {/* Macros Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#141414] border border-[#262626] p-4 rounded-sm">
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-red-400 font-bold uppercase flex items-center gap-1"><Beef className="w-3.5 h-3.5" /> PROTEIN</span>
                  <span className="text-white">{consumedProtein} / {targetProtein}g</span>
                </div>
                <div className="w-full bg-[#0A0A0A] h-2 rounded-sm overflow-hidden">
                  <div className="bg-red-500 h-full transition-all" style={{ width: `${Math.min(100, (consumedProtein / targetProtein) * 100)}%` }} />
                </div>
              </div>

              <div className="bg-[#141414] border border-[#262626] p-4 rounded-sm">
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-amber-400 font-bold uppercase flex items-center gap-1"><Wheat className="w-3.5 h-3.5" /> CARBS</span>
                  <span className="text-white">{consumedCarbs} / {targetCarbs}g</span>
                </div>
                <div className="w-full bg-[#0A0A0A] h-2 rounded-sm overflow-hidden">
                  <div className="bg-amber-500 h-full transition-all" style={{ width: `${Math.min(100, (consumedCarbs / targetCarbs) * 100)}%` }} />
                </div>
              </div>

              <div className="bg-[#141414] border border-[#262626] p-4 rounded-sm">
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-cyan-400 font-bold uppercase flex items-center gap-1"><Flame className="w-3.5 h-3.5" /> FAT</span>
                  <span className="text-white">{consumedFat} / {targetFat}g</span>
                </div>
                <div className="w-full bg-[#0A0A0A] h-2 rounded-sm overflow-hidden">
                  <div className="bg-cyan-500 h-full transition-all" style={{ width: `${Math.min(100, (consumedFat / targetFat) * 100)}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Form & Logged List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <form onSubmit={handleLogManualFood} className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-6 space-y-4">
              <h3 className="text-lg font-mono text-white font-bold uppercase tracking-wider border-b border-[#262626] pb-3">LOG MEAL INTAKE</h3>

              <div>
                <label className="block text-[10px] font-mono text-[#A3A3A3] mb-1 uppercase">MEAL / FOOD ITEM</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Chicken Tikka & Roti"
                  className="w-full bg-[#141414] border border-[#262626] rounded-sm px-4 py-2.5 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[9px] font-mono text-[#A3A3A3] mb-1 uppercase">CALORIES</label>
                  <input
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    placeholder="e.g. 450"
                    className="w-full bg-[#141414] border border-[#262626] rounded-sm px-3 py-2 text-white font-mono text-xs focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-mono text-[#A3A3A3] mb-1 uppercase">PROTEIN (G)</label>
                  <input
                    type="number"
                    value={protein}
                    onChange={(e) => setProtein(e.target.value)}
                    placeholder="30"
                    className="w-full bg-[#141414] border border-[#262626] rounded-sm px-3 py-2 text-white font-mono text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-mono text-[#A3A3A3] mb-1 uppercase">CARBS (G)</label>
                  <input
                    type="number"
                    value={carbs}
                    onChange={(e) => setCarbs(e.target.value)}
                    placeholder="40"
                    className="w-full bg-[#141414] border border-[#262626] rounded-sm px-3 py-2 text-white font-mono text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-mono text-[#A3A3A3] mb-1 uppercase">FAT (G)</label>
                  <input
                    type="number"
                    value={fat}
                    onChange={(e) => setFat(e.target.value)}
                    placeholder="15"
                    className="w-full bg-[#141414] border border-[#262626] rounded-sm px-3 py-2 text-white font-mono text-xs focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#141414] border border-[#262626] hover:bg-[#1A1A1A] text-white font-mono text-xs font-bold uppercase rounded-sm transition-colors"
              >
                LOG MEAL ENTRY (+XP)
              </button>
            </form>

            {/* Hydration & Today's Logs */}
            <div className="space-y-6">
              <form onSubmit={handleLogWater} className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-cyan-400" />
                  <div>
                    <div className="text-xs font-mono text-white font-bold uppercase">HYDRATION TRACKER</div>
                    <div className="text-[10px] font-mono text-[#A3A3A3]">{consumedWater} ML TODAY</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={waterAmount}
                    onChange={(e) => setWaterAmount(e.target.value)}
                    placeholder="250 ml"
                    className="w-24 bg-[#141414] border border-[#262626] rounded-sm px-3 py-1.5 text-white font-mono text-xs focus:outline-none"
                  />
                  <button type="submit" className="px-3 py-1.5 bg-cyan-600 text-black font-mono text-xs font-bold uppercase rounded-sm">
                    LOG
                  </button>
                </div>
              </form>

              {/* Today's Food Logs List */}
              <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-4 space-y-3">
                <h4 className="text-xs font-mono text-white font-bold uppercase border-b border-[#262626] pb-2">TODAY'S FOOD LOGS ({nutritionLogs.filter(l => l.type === 'food').length})</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {nutritionLogs.filter(l => l.type === 'food').map(log => (
                    <div key={log.id} className="flex justify-between items-center bg-[#141414] p-2.5 rounded-sm font-mono text-xs">
                      <div>
                        <div className="text-white font-bold uppercase">{log.name}</div>
                        <div className="text-[10px] text-[#A3A3A3]">P: {log.protein || 0}g | C: {log.carbs || 0}g | F: {log.fat || 0}g</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-cyan-400 font-bold">{log.calories} KCAL</span>
                        <button onClick={() => handleDeleteLog(log.id!)} className="text-red-400 hover:text-red-300">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: SQL DATA SPREADSHEET */}
      {activeSubTab === 'sql_house' && (
        <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#262626] pb-4">
            <div>
              <h3 className="text-lg font-mono text-white font-bold uppercase flex items-center gap-2">
                <Database className="w-5 h-5 text-cyan-400" />
                SQL SPREADSHEET FOOD DATA HOUSE ({filteredFoodData.length} RECORDS)
              </h3>
              <p className="text-[10px] font-mono text-[#A3A3A3] uppercase mt-1">
                Filter, sort, and log directly from our extensive structured food repository.
              </p>
            </div>

            <button
              onClick={handleExportCsv}
              className="px-4 py-2 bg-[#141414] border border-[#262626] hover:bg-[#1A1A1A] text-white font-mono text-xs font-bold uppercase rounded-sm flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-cyan-400" /> EXPORT TO CSV
            </button>
          </div>

          {/* Controls bar */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-[#A3A3A3] absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search food name..."
                className="w-full bg-[#141414] border border-[#262626] rounded-sm pl-9 pr-3 py-2.5 text-white font-mono text-xs focus:outline-none uppercase"
              />
            </div>

            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="bg-[#141414] border border-[#262626] rounded-sm px-3 py-2.5 text-white font-mono text-xs focus:outline-none uppercase"
            >
              <option value="ALL">ALL CATEGORIES ({EXPANDED_SQL_FOOD_DATABASE.length})</option>
              <option value="PAKISTANI">PAKISTANI CURRIES</option>
              <option value="BBQ">BBQ & KEBABS</option>
              <option value="HIGH PROTEIN">HIGH PROTEIN</option>
              <option value="CARBS">COMPLEX CARBS</option>
              <option value="FATS">HEALTHY FATS</option>
              <option value="FRUITS & VEGGIES">FRUITS & VEGGIES</option>
              <option value="FAST FOOD">STREET & FAST FOOD</option>
              <option value="BEVERAGES">BEVERAGES & DRINKS</option>
              <option value="SWEETS">DESSERTS & SWEETS</option>
            </select>

            <select
              value={selectedMealSlot}
              onChange={(e) => setSelectedMealSlot(e.target.value as any)}
              className="bg-[#141414] border border-[#262626] rounded-sm px-3 py-2.5 text-cyan-300 font-mono text-xs font-bold focus:outline-none uppercase"
            >
              <option value="Breakfast">TARGET: BREAKFAST</option>
              <option value="Lunch">TARGET: LUNCH</option>
              <option value="Dinner">TARGET: DINNER</option>
              <option value="Snack">TARGET: SNACK</option>
            </select>

            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="flex-1 bg-[#141414] border border-[#262626] rounded-sm px-3 py-2.5 text-white font-mono text-xs focus:outline-none uppercase"
              >
                <option value="protein">SORT: PROTEIN</option>
                <option value="calories">SORT: CALORIES</option>
                <option value="carbs">SORT: CARBS</option>
                <option value="fat">SORT: FAT</option>
              </select>

              <button
                onClick={() => setSortDir(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="px-3 bg-[#141414] border border-[#262626] text-white rounded-sm font-mono text-xs hover:bg-[#1A1A1A]"
              >
                <ArrowUpDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* SQL Table */}
          <div className="overflow-x-auto border border-[#262626] rounded-sm">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-[#141414] border-b border-[#262626] text-[#A3A3A3] text-[10px] uppercase">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">FOOD ITEM</th>
                  <th className="py-3 px-4">CATEGORY</th>
                  <th className="py-3 px-4">CALORIES</th>
                  <th className="py-3 px-4">PROTEIN</th>
                  <th className="py-3 px-4">CARBS</th>
                  <th className="py-3 px-4">FAT</th>
                  <th className="py-3 px-4">PORTION</th>
                  <th className="py-3 px-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]">
                {filteredFoodData.map((item) => (
                  <tr key={item.id} className="hover:bg-[#141414] transition-colors">
                    <td className="py-2.5 px-4 text-[#A3A3A3]">{item.id}</td>
                    <td className="py-2.5 px-4 text-white font-bold">{item.name}</td>
                    <td className="py-2.5 px-4"><span className="px-2 py-0.5 bg-[#141414] border border-[#262626] rounded-sm text-[10px] text-cyan-400">{item.category}</span></td>
                    <td className="py-2.5 px-4 text-amber-400 font-bold">{item.calories} kcal</td>
                    <td className="py-2.5 px-4 text-red-400 font-bold">{item.protein}g</td>
                    <td className="py-2.5 px-4 text-amber-200">{item.carbs}g</td>
                    <td className="py-2.5 px-4 text-cyan-300">{item.fat}g</td>
                    <td className="py-2.5 px-4 text-[#A3A3A3]">{item.portion}</td>
                    <td className="py-2.5 px-4 text-right">
                      <button
                        onClick={() => handleLogFoodFromSpreadsheet(item)}
                        className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-black font-bold rounded-sm text-[10px] uppercase transition-colors"
                      >
                        LOG TO DIET
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 3: PAKISTANI DIETS */}
      {activeSubTab === 'pakistani_diets' && (
        <PakistaniFoodsSection 
          themeColor={themeColor}
          onLogFoodItem={async (item) => {
            await db.nutritionLogs.add({
              date: today,
              type: 'food',
              name: `${item.name} (${item.portion})`,
              calories: item.calories,
              protein: item.protein,
              carbs: item.carbs,
              fat: item.fat
            });
            await addXp(item.calories / 2 + 50);
            await logSystemEvent('NUTRITION', 'SUCCESS', `Logged diet item: ${item.name}`);
            alert(`✅ Logged ${item.name} (${item.calories} KCAL) to today's log!`);
          }}
          onLogDietPlan={async (plan) => {
            for (const m of plan.meals) {
              await db.nutritionLogs.add({
                date: today,
                type: 'food',
                name: `[${plan.name}] ${m.name}`,
                calories: m.calories,
                protein: m.protein,
                carbs: m.carbs,
                fat: m.fat
              });
            }
            await addXp(plan.totalCalories / 2 + 150);
            await logSystemEvent('NUTRITION', 'SUCCESS', `Executed diet plan: ${plan.name}`);
            alert(`🔥 Executed Full Diet Protocol: ${plan.name} (${plan.totalCalories} KCAL logged for today)!`);
          }}
          onLogDietMeal={async (meal) => {
            await db.nutritionLogs.add({
              date: today,
              type: 'food',
              name: `${meal.name} (${meal.time})`,
              calories: meal.calories,
              protein: meal.protein,
              carbs: meal.carbs,
              fat: meal.fat
            });
            await addXp(meal.calories / 2 + 30);
            await logSystemEvent('NUTRITION', 'SUCCESS', `Logged plan meal: ${meal.name}`);
            alert(`✅ Logged ${meal.name} (${meal.calories} KCAL) to today's log!`);
          }}
        />
      )}

      {/* ADVANCED HEALTH INTAKE FORMULA MODAL */}
      {showFormulaModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[99999] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm max-w-2xl w-full p-6 shadow-2xl relative my-8 space-y-6">
            <div className="flex justify-between items-center border-b border-[#262626] pb-4">
              <div>
                <h3 className="text-lg font-mono text-white font-bold uppercase flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  ADVANCED METABOLIC INTAKE CALCULATOR
                </h3>
                <p className="text-[10px] font-mono text-[#A3A3A3] uppercase">
                  Calculate precise clinical energy expenditure based on biometrics & health goals.
                </p>
              </div>
              <button onClick={() => setShowFormulaModal(false)} className="text-[#A3A3A3] hover:text-white font-mono text-sm">✕</button>
            </div>

            {/* Formula Selector */}
            <div className="space-y-2">
              <label className="block text-[10px] font-mono text-cyan-400 font-bold uppercase">SELECT METABOLIC FORMULA ENGINE:</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => setCalcFormula('mifflin')}
                  className={cn(
                    "p-3 rounded-sm border font-mono text-xs text-left transition-all",
                    calcFormula === 'mifflin' ? "bg-cyan-950/50 border-cyan-500 text-white" : "bg-[#141414] border-[#262626] text-[#A3A3A3]"
                  )}
                >
                  <div className="font-bold">Mifflin-St Jeor</div>
                  <div className="text-[9px] text-[#A3A3A3] mt-1">Clinical standard. Highest precision for general population.</div>
                </button>
                <button
                  onClick={() => setCalcFormula('katch')}
                  className={cn(
                    "p-3 rounded-sm border font-mono text-xs text-left transition-all",
                    calcFormula === 'katch' ? "bg-cyan-950/50 border-cyan-500 text-white" : "bg-[#141414] border-[#262626] text-[#A3A3A3]"
                  )}
                >
                  <div className="font-bold">Katch-McArdle</div>
                  <div className="text-[9px] text-[#A3A3A3] mt-1">Uses Lean Body Mass (LBM). Ideal for athletes & low fat %.</div>
                </button>
                <button
                  onClick={() => setCalcFormula('harris')}
                  className={cn(
                    "p-3 rounded-sm border font-mono text-xs text-left transition-all",
                    calcFormula === 'harris' ? "bg-cyan-950/50 border-cyan-500 text-white" : "bg-[#141414] border-[#262626] text-[#A3A3A3]"
                  )}
                >
                  <div className="font-bold">Harris-Benedict</div>
                  <div className="text-[9px] text-[#A3A3A3] mt-1">Revised classic formula. Great for high activity levels.</div>
                </button>
              </div>
            </div>

            {/* Input Inputs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[9px] font-mono text-[#A3A3A3] mb-1 uppercase">WEIGHT (KG)</label>
                <input
                  type="number"
                  value={calcWeightKg}
                  onChange={(e) => setCalcWeightKg(e.target.value)}
                  className="w-full bg-[#141414] border border-[#262626] rounded-sm px-3 py-2 text-white font-mono text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[9px] font-mono text-[#A3A3A3] mb-1 uppercase">HEIGHT (CM)</label>
                <input
                  type="number"
                  value={calcHeightCm}
                  onChange={(e) => setCalcHeightCm(e.target.value)}
                  className="w-full bg-[#141414] border border-[#262626] rounded-sm px-3 py-2 text-white font-mono text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[9px] font-mono text-[#A3A3A3] mb-1 uppercase">AGE (YEARS)</label>
                <input
                  type="number"
                  value={calcAgeYrs}
                  onChange={(e) => setCalcAgeYrs(e.target.value)}
                  className="w-full bg-[#141414] border border-[#262626] rounded-sm px-3 py-2 text-white font-mono text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[9px] font-mono text-[#A3A3A3] mb-1 uppercase">BODY FAT %</label>
                <input
                  type="number"
                  value={calcBodyFatPct}
                  onChange={(e) => setCalcBodyFatPct(e.target.value)}
                  className="w-full bg-[#141414] border border-[#262626] rounded-sm px-3 py-2 text-white font-mono text-xs focus:outline-none"
                />
              </div>
            </div>

            {/* Activity Level & Goal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono text-[#A3A3A3] mb-1 uppercase">PHYSICAL ACTIVITY MULTIPLIER:</label>
                <select
                  value={calcActivityLevel}
                  onChange={(e) => setCalcActivityLevel(parseFloat(e.target.value))}
                  className="w-full bg-[#141414] border border-[#262626] rounded-sm px-3 py-2.5 text-white font-mono text-xs focus:outline-none uppercase"
                >
                  <option value={1.2}>1.20 - Sedentary (Desk job, minimal exercise)</option>
                  <option value={1.375}>1.375 - Lightly Active (1-3 workouts / week)</option>
                  <option value={1.55}>1.55 - Moderately Active (3-5 workouts / week)</option>
                  <option value={1.725}>1.725 - Very Active (6-7 heavy workouts / week)</option>
                  <option value={1.9}>1.90 - Athlete / Heavy Labor (2x daily training)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-[#A3A3A3] mb-1 uppercase">HEALTH & FITNESS GOAL:</label>
                <select
                  value={calcHealthGoal}
                  onChange={(e) => setCalcHealthGoal(e.target.value as any)}
                  className="w-full bg-[#141414] border border-[#262626] rounded-sm px-3 py-2.5 text-white font-mono text-xs focus:outline-none uppercase"
                >
                  <option value="cut_aggr">Aggressive Fat Shred (-750 kcal)</option>
                  <option value="cut_mod">Moderate Deficit (-400 kcal)</option>
                  <option value="maint">Maintenance & Recomp (+0 kcal)</option>
                  <option value="bulk_lean">Lean Muscle Mass (+300 kcal)</option>
                  <option value="bulk_heavy">Heavy Hypertrophy Bulk (+600 kcal)</option>
                </select>
              </div>
            </div>

            {/* Macro Distribution Ratio */}
            <div>
              <label className="block text-[10px] font-mono text-[#A3A3A3] mb-1 uppercase">MACRONUTRIENT RATIO SPLIT:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => setCalcMacroPreset('balanced')}
                  className={cn(
                    "p-2 rounded-sm border font-mono text-[10px] text-center uppercase transition-all",
                    calcMacroPreset === 'balanced' ? "bg-cyan-950/60 border-cyan-500 text-white font-bold" : "bg-[#141414] border-[#262626] text-[#A3A3A3]"
                  )}
                >
                  Balanced (30/40/30)
                </button>
                <button
                  onClick={() => setCalcMacroPreset('high_protein')}
                  className={cn(
                    "p-2 rounded-sm border font-mono text-[10px] text-center uppercase transition-all",
                    calcMacroPreset === 'high_protein' ? "bg-cyan-950/60 border-cyan-500 text-white font-bold" : "bg-[#141414] border-[#262626] text-[#A3A3A3]"
                  )}
                >
                  High Protein (40/35/25)
                </button>
                <button
                  onClick={() => setCalcMacroPreset('keto')}
                  className={cn(
                    "p-2 rounded-sm border font-mono text-[10px] text-center uppercase transition-all",
                    calcMacroPreset === 'keto' ? "bg-cyan-950/60 border-cyan-500 text-white font-bold" : "bg-[#141414] border-[#262626] text-[#A3A3A3]"
                  )}
                >
                  Keto / Low Carb (25/5/70)
                </button>
                <button
                  onClick={() => setCalcMacroPreset('low_fat')}
                  className={cn(
                    "p-2 rounded-sm border font-mono text-[10px] text-center uppercase transition-all",
                    calcMacroPreset === 'low_fat' ? "bg-cyan-950/60 border-cyan-500 text-white font-bold" : "bg-[#141414] border-[#262626] text-[#A3A3A3]"
                  )}
                >
                  Low Fat (35/50/15)
                </button>
              </div>
            </div>

            {/* Calculated Output Summary Card */}
            <div className="p-4 bg-[#141414] border border-cyan-900/50 rounded-sm space-y-3">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-[#A3A3A3] uppercase">CALCULATED BMR:</span>
                <span className="text-white font-bold">{Math.round(activeBmr)} KCAL/DAY</span>
              </div>
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-[#A3A3A3] uppercase">ESTIMATED TDEE:</span>
                <span className="text-cyan-400 font-bold">{Math.round(activeTdee)} KCAL/DAY</span>
              </div>
              <div className="flex justify-between items-center text-sm font-mono border-t border-[#262626] pt-2">
                <span className="text-white font-bold uppercase">TARGET DAILY INTAKE BUDGET:</span>
                <span className="text-emerald-400 font-bold">{targetCalories} KCAL</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-center pt-2">
                <div className="p-2 bg-[#0A0A0A] border border-[#262626] rounded-sm text-red-400">
                  PROTEIN: <span className="font-bold text-white">{targetProtein}g</span>
                </div>
                <div className="p-2 bg-[#0A0A0A] border border-[#262626] rounded-sm text-amber-400">
                  CARBS: <span className="font-bold text-white">{targetCarbs}g</span>
                </div>
                <div className="p-2 bg-[#0A0A0A] border border-[#262626] rounded-sm text-cyan-400">
                  FAT: <span className="font-bold text-white">{targetFat}g</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setShowFormulaModal(false);
                alert(`✅ Applied ${calcFormula.toUpperCase()} formula targets: ${targetCalories} KCAL (${targetProtein}g P, ${targetCarbs}g C, ${targetFat}g F)`);
              }}
              className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-black font-mono text-xs font-bold uppercase rounded-sm transition-colors"
            >
              APPLY TARGETS TO MY METABOLISM ENGINE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
