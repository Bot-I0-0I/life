import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { cn, getRank, RANK_TIERS } from '../lib/utils';
import { Settings, User, Palette, Activity, Save, Upload, Download, Database, Trash2, Moon, Sun, AlertTriangle, Cloud, RefreshCw, Sparkles, CheckCircle, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { useStore } from '../store/useStore';
import { useAuth } from '../AuthContext';
import { useCloudSync } from '../useCloudSync';
import { format } from 'date-fns';
import { ThemeGalleryModal } from '../components/ThemeGalleryModal';

export function SettingsView() {
  const userStats = useLiveQuery(() => db.userStats.get(1));
  
  // Live counts for life tracking tables
  const questsCount = useLiveQuery(() => db.quests.count()) || 0;
  const dungeonsCount = useLiveQuery(() => db.dungeons.count()) || 0;
  const vesselCount = useLiveQuery(() => db.vesselLogs.count()) || 0;
  const ledgerCount = useLiveQuery(() => db.ledger.count()) || 0;
  const nutritionCount = useLiveQuery(() => db.nutritionLogs.count()) || 0;
  const timetableCount = useLiveQuery(() => db.timetable.count()) || 0;
  const tasksCount = useLiveQuery(() => db.tasks.count()) || 0;
  const missionCount = useLiveQuery(() => db.missionLogs.count()) || 0;
  const totalDbRecords = questsCount + dungeonsCount + vesselCount + ledgerCount + nutritionCount + timetableCount + tasksCount + missionCount;

  const { theme, toggleTheme, showActiveQuestTicker, showAttributeProgressBars, showRadarChart, showMuscleFigurine, toggleHUDComponent } = useStore();
  const { user, isGuest } = useAuth();
  const { isSyncing, lastSync, forceSync } = useCloudSync();
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  
  const level = Math.floor((userStats?.xp || 0) / 1000) + 1;
  const rankColor = getRank(level).color;
  const themeColor = userStats?.selectedColor || rankColor;

  // New elegant active settings tab
  const [activeTab, setActiveTab] = useState<'biometrics' | 'engine' | 'interface' | 'data'>('biometrics');

  const [name, setName] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [weightLogNotice, setWeightLogNotice] = useState<string | null>(null);
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [fitnessGoal, setFitnessGoal] = useState<'lose' | 'maintain' | 'build'>('maintain');
  const [activityLevel, setActivityLevel] = useState<'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'>('sedentary');
  const [avatar, setAvatar] = useState('');
  const [role, setRole] = useState('Player');
  const [uiTheme, setUiTheme] = useState('default');
  const [selectedColor, setSelectedColor] = useState('');
  const [backgroundImage, setBackgroundImage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Advanced game settings states
  const [macroGoalRatio, setMacroGoalRatio] = useState<'balanced' | 'keto' | 'high_protein' | 'custom'>('balanced');
  const [customProtein, setCustomProtein] = useState('30');
  const [customCarbs, setCustomCarbs] = useState('40');
  const [customFat, setCustomFat] = useState('30');
  const [gameDifficulty, setGameDifficulty] = useState<'casual' | 'normal' | 'hardcore'>('normal');

  useEffect(() => {
    if (userStats) {
      setName(userStats.name || '');
      setHeight(userStats.height?.toString() || '');
      setWeight(userStats.weight?.toString() || '');
      setAge(userStats.age?.toString() || '');
      setGender(userStats.gender || 'male');
      setFitnessGoal(userStats.fitnessGoal || 'maintain');
      setActivityLevel(userStats.activityLevel || 'sedentary');
      setAvatar(userStats.avatar || '');
      setRole(userStats.role || 'Player');
      setUiTheme(userStats.uiTheme || 'default');
      setSelectedColor(userStats.selectedColor || '');
      setBackgroundImage(userStats.backgroundImage || '');
      
      // Load advanced game settings from DB
      setMacroGoalRatio((userStats as any).macroGoalRatio || 'balanced');
      setCustomProtein(((userStats as any).customProtein || 30).toString());
      setCustomCarbs(((userStats as any).customCarbs || 40).toString());
      setCustomFat(((userStats as any).customFat || 30).toString());
      setGameDifficulty((userStats as any).gameDifficulty || 'normal');
    }
  }, [userStats]);

  const handleDirectLogWeight = async (valToLog?: number) => {
    const targetVal = valToLog !== undefined ? valToLog : parseFloat(weight);
    if (isNaN(targetVal) || targetVal <= 0) {
      setWeightLogNotice('⚠️ Please enter a valid weight');
      return;
    }
    const roundedVal = Number(targetVal.toFixed(1));
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    await db.userStats.update(1, { weight: roundedVal });
    await db.vesselLogs.add({
      date: todayStr,
      weight: roundedVal,
      energyLevel: 8,
      sleepHours: 8,
      notes: 'Quick logged via System Settings'
    });
    setWeight(roundedVal.toString());
    setWeightLogNotice(`✅ WEIGHT LOGGED: ${roundedVal} KG (Synced to Vessel Tracker & Training Engine)`);
    if (user) {
      await forceSync();
    }
    window.dispatchEvent(new CustomEvent('userstats-updated', { detail: { ...userStats, weight: roundedVal } }));
    setTimeout(() => setWeightLogNotice(null), 4000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBgImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackgroundImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveBgImage = () => {
    setBackgroundImage('');
  };

  const handleSave = async () => {
    setIsSaving(true);
    await db.userStats.update(1, {
      name,
      height: height ? parseFloat(height) : undefined,
      weight: weight ? parseFloat(weight) : undefined,
      age: age ? parseInt(age) : undefined,
      gender,
      fitnessGoal,
      activityLevel,
      avatar,
      role,
      uiTheme,
      selectedColor,
      backgroundImage,
      
      // Save advanced settings
      macroGoalRatio,
      customProtein: customProtein ? parseInt(customProtein) : 30,
      customCarbs: customCarbs ? parseInt(customCarbs) : 40,
      customFat: customFat ? parseInt(customFat) : 30,
      gameDifficulty
    });
    if (user) {
      await forceSync();
    }
    setTimeout(() => {
      setIsSaving(false);
      db.userStats.get(1).then(updated => {
        if (updated) {
          // Trigger instant visual sync
          window.dispatchEvent(new CustomEvent('userstats-updated', { detail: updated }));
        }
      });
    }, 500);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const rawContent = event.target?.result as string;
        const data = JSON.parse(rawContent);

        if (!data || typeof data !== 'object') {
          throw new Error("Invalid or empty JSON structure.");
        }

        const validKeys = [
          'userStats', 'quests', 'dungeons', 'inventory', 'shopItems', 
          'vesselLogs', 'weeklyReviews', 'tasks', 'ledger', 'nutritionLogs', 
          'tacticalLogs', 'foodTemplates', 'questTemplates', 'missionLogs', 
          'systemLogs', 'timetable'
        ];

        const containsData = validKeys.some(key => Array.isArray(data[key]));
        if (!containsData) {
          throw new Error("Unrecognized backup format. File must contain life-tracking tables.");
        }

        let restoredItemsCount = 0;

        await db.transaction('rw', [
          db.userStats, db.quests, db.dungeons, db.inventory, db.shopItems,
          db.vesselLogs, db.weeklyReviews, db.tasks, db.ledger, db.nutritionLogs,
          db.tacticalLogs, db.foodTemplates, db.questTemplates, db.missionLogs,
          db.systemLogs, db.timetable
        ], async () => {
          if (Array.isArray(data.userStats) && data.userStats.length > 0) { 
            await db.userStats.clear(); 
            await db.userStats.bulkAdd(data.userStats); 
            restoredItemsCount += data.userStats.length;
          }
          if (Array.isArray(data.quests)) { 
            await db.quests.clear(); 
            if (data.quests.length > 0) await db.quests.bulkAdd(data.quests); 
            restoredItemsCount += data.quests.length;
          }
          if (Array.isArray(data.inventory)) { 
            await db.inventory.clear(); 
            if (data.inventory.length > 0) await db.inventory.bulkAdd(data.inventory); 
            restoredItemsCount += data.inventory.length;
          }
          if (Array.isArray(data.shopItems)) { 
            await db.shopItems.clear(); 
            if (data.shopItems.length > 0) await db.shopItems.bulkAdd(data.shopItems); 
            restoredItemsCount += data.shopItems.length;
          }
          if (Array.isArray(data.vesselLogs)) { 
            await db.vesselLogs.clear(); 
            if (data.vesselLogs.length > 0) await db.vesselLogs.bulkAdd(data.vesselLogs); 
            restoredItemsCount += data.vesselLogs.length;
          }
          if (Array.isArray(data.weeklyReviews)) { 
            await db.weeklyReviews.clear(); 
            if (data.weeklyReviews.length > 0) await db.weeklyReviews.bulkAdd(data.weeklyReviews); 
            restoredItemsCount += data.weeklyReviews.length;
          }
          if (Array.isArray(data.tasks)) { 
            await db.tasks.clear(); 
            if (data.tasks.length > 0) await db.tasks.bulkAdd(data.tasks); 
            restoredItemsCount += data.tasks.length;
          }
          if (Array.isArray(data.ledger)) { 
            await db.ledger.clear(); 
            if (data.ledger.length > 0) await db.ledger.bulkAdd(data.ledger); 
            restoredItemsCount += data.ledger.length;
          }
          if (Array.isArray(data.dungeons)) { 
            await db.dungeons.clear(); 
            if (data.dungeons.length > 0) await db.dungeons.bulkAdd(data.dungeons); 
            restoredItemsCount += data.dungeons.length;
          }
          if (Array.isArray(data.nutritionLogs)) { 
            await db.nutritionLogs.clear(); 
            if (data.nutritionLogs.length > 0) await db.nutritionLogs.bulkAdd(data.nutritionLogs); 
            restoredItemsCount += data.nutritionLogs.length;
          }
          if (Array.isArray(data.tacticalLogs)) { 
            await db.tacticalLogs.clear(); 
            if (data.tacticalLogs.length > 0) await db.tacticalLogs.bulkAdd(data.tacticalLogs); 
            restoredItemsCount += data.tacticalLogs.length;
          }
          if (Array.isArray(data.foodTemplates)) { 
            await db.foodTemplates.clear(); 
            if (data.foodTemplates.length > 0) await db.foodTemplates.bulkAdd(data.foodTemplates); 
            restoredItemsCount += data.foodTemplates.length;
          }
          if (Array.isArray(data.questTemplates)) { 
            await db.questTemplates.clear(); 
            if (data.questTemplates.length > 0) await db.questTemplates.bulkAdd(data.questTemplates); 
            restoredItemsCount += data.questTemplates.length;
          }
          if (Array.isArray(data.missionLogs)) { 
            await db.missionLogs.clear(); 
            if (data.missionLogs.length > 0) await db.missionLogs.bulkAdd(data.missionLogs); 
            restoredItemsCount += data.missionLogs.length;
          }
          if (Array.isArray(data.systemLogs)) { 
            await db.systemLogs.clear(); 
            if (data.systemLogs.length > 0) await db.systemLogs.bulkAdd(data.systemLogs); 
            restoredItemsCount += data.systemLogs.length;
          }
          if (Array.isArray(data.timetable)) { 
            await db.timetable.clear(); 
            if (data.timetable.length > 0) await db.timetable.bulkAdd(data.timetable); 
            restoredItemsCount += data.timetable.length;
          }
        });

        if (user) {
          await forceSync();
        }

        toast.success(`Successfully restored backup (${restoredItemsCount} records updated across tables)! Reloading...`);
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } catch (error: any) {
        console.error('Import failed', error);
        toast.error(`Import failed: ${error?.message || 'Invalid JSON format'}`);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetText, setResetText] = useState('');

  const handleExport = async () => {
    try {
      const exportData = {
        meta: {
          app: "SOLO SYSTEM LIFE TRACKER",
          version: "1.0",
          exportedAt: new Date().toISOString(),
          recordCount: totalDbRecords
        },
        userStats: await db.userStats.toArray(),
        quests: await db.quests.toArray(),
        dungeons: await db.dungeons.toArray(),
        inventory: await db.inventory.toArray(),
        shopItems: await db.shopItems.toArray(),
        vesselLogs: await db.vesselLogs.toArray(),
        weeklyReviews: await db.weeklyReviews.toArray(),
        tasks: await db.tasks.toArray(),
        ledger: await db.ledger.toArray(),
        nutritionLogs: await db.nutritionLogs.toArray(),
        tacticalLogs: await db.tacticalLogs.toArray(),
        foodTemplates: await db.foodTemplates.toArray(),
        questTemplates: await db.questTemplates.toArray(),
        missionLogs: await db.missionLogs.toArray(),
        systemLogs: await db.systemLogs.toArray(),
        timetable: await db.timetable.toArray(),
      };

      const jsonStr = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const filenameStr = `system_life_backup_${format(new Date(), 'yyyy-MM-dd_HHmm')}.json`;

      const link = document.createElement('a');
      link.href = url;
      link.download = filenameStr;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`Exported ${totalDbRecords} records to ${filenameStr}`);
    } catch (err: any) {
      console.error("Export error:", err);
      toast.error("Failed to export backup file.");
    }
  };

  const handleReset = async () => {
    if (resetText === 'RESET') {
      localStorage.setItem('system_reset_pending', 'true');
      await db.delete();
      window.location.reload();
    }
  };

  if (!userStats) return <div className="opacity-80">Loading Settings...</div>;

  return (
    <div className="space-y-8 pb-10">
      <header className="hidden md:block border-b border-[#262626] pb-6">
        <h2 className="text-3xl font-mono font-bold tracking-tight text-white flex items-center uppercase" style={{ color: themeColor }}>
          SYSTEM CONFIGURATION
        </h2>
        <p className="text-[#A3A3A3] text-sm mt-1 font-mono uppercase tracking-widest">Manage profile, biometrics, and interface preferences.</p>
      </header>

      {/* Modern High-Fidelity Tab Select Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 bg-[#0A0A0A] p-1 border border-[#262626] rounded-sm gap-1 w-full max-w-3xl">
        <button
          onClick={() => setActiveTab('biometrics')}
          className={cn(
            "py-3 text-[10px] sm:text-xs font-mono rounded-sm transition-all uppercase tracking-widest font-bold flex items-center justify-center gap-1.5 touch-target min-h-[44px]",
            activeTab === 'biometrics' ? "bg-[#1A1A1A] text-white" : "text-[#A3A3A3] hover:text-white"
          )}
          style={activeTab === 'biometrics' ? { color: themeColor } : {}}
        >
          <User className="w-4 h-4 flex-shrink-0" /> BIOMETRICS
        </button>
        <button
          onClick={() => setActiveTab('engine')}
          className={cn(
            "py-3 text-[10px] sm:text-xs font-mono rounded-sm transition-all uppercase tracking-widest font-bold flex items-center justify-center gap-1.5 touch-target min-h-[44px]",
            activeTab === 'engine' ? "bg-[#1A1A1A] text-white" : "text-[#A3A3A3] hover:text-white"
          )}
          style={activeTab === 'engine' ? { color: themeColor } : {}}
        >
          <Activity className="w-4 h-4 flex-shrink-0" /> METABOLISM
        </button>
        <button
          onClick={() => setActiveTab('interface')}
          className={cn(
            "py-3 text-[10px] sm:text-xs font-mono rounded-sm transition-all uppercase tracking-widest font-bold flex items-center justify-center gap-1.5 touch-target min-h-[44px]",
            activeTab === 'interface' ? "bg-[#1A1A1A] text-white" : "text-[#A3A3A3] hover:text-white"
          )}
          style={activeTab === 'interface' ? { color: themeColor } : {}}
        >
          <Palette className="w-4 h-4 flex-shrink-0" /> HUD / THEME
        </button>
        <button
          onClick={() => setActiveTab('data')}
          className={cn(
            "py-3 text-[10px] sm:text-xs font-mono rounded-sm transition-all uppercase tracking-widest font-bold flex items-center justify-center gap-1.5 touch-target min-h-[44px]",
            activeTab === 'data' ? "bg-[#1A1A1A] text-white" : "text-[#A3A3A3] hover:text-white"
          )}
          style={activeTab === 'data' ? { color: themeColor } : {}}
        >
          <Database className="w-4 h-4 flex-shrink-0" /> DATA & QUOTA
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Tab 1: BIOMETRICS & IDENTITY */}
        {activeTab === 'biometrics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Profile Settings */}
            <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-6 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2" style={{ borderColor: themeColor }}></div>
              <h3 className="text-xl font-mono text-white flex items-center border-b border-[#262626] pb-4 font-bold tracking-widest uppercase">
                <User className="w-5 h-5 mr-2" style={{ color: themeColor }} />
                IDENTITY
              </h3>
              
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                <div className="relative w-24 h-24 rounded-sm border-2 border-dashed border-[#262626] flex items-center justify-center overflow-hidden bg-[#141414]">
                  {avatar ? (
                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-[#A3A3A3]" />
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <div className="flex-1 w-full">
                  <label className="block text-[10px] font-mono text-[#A3A3A3] mb-1 tracking-widest uppercase">CODENAME / ALIAS</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#141414] border border-[#262626] rounded-sm px-4 py-3 text-white font-mono text-xs tracking-wider focus:outline-none focus:ring-1 transition-colors uppercase placeholder:text-[#555]"
                    style={{ '--tw-ring-color': themeColor, outlineColor: themeColor } as any}
                    placeholder="ENTER YOUR ALIAS"
                  />
                  <p className="text-[10px] text-[#A3A3A3] mt-2 flex items-center tracking-widest uppercase">
                    <Upload className="w-3 h-3 mr-1" /> CLICK AVATAR TO UPLOAD IMAGE
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-[10px] font-mono text-[#A3A3A3] mb-1 tracking-widest uppercase">CLASS / ROLE</label>
                <select 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-[#141414] border border-[#262626] rounded-sm px-4 py-3 text-white font-mono text-xs tracking-wider focus:outline-none focus:ring-1 transition-colors uppercase"
                  style={{ '--tw-ring-color': themeColor, outlineColor: themeColor } as any}
                >
                  <option value="Player">PLAYER</option>
                  <option value="Hunter">HUNTER</option>
                  <option value="Assassin">ASSASSIN</option>
                  <option value="Mage">MAGE</option>
                  <option value="Tank">TANK</option>
                  <option value="Healer">HEALER</option>
                  <option value="Fighter">FIGHTER</option>
                  <option value="Ranger">RANGER</option>
                  <option value="Necromancer">NECROMANCER</option>
                  <option value="Monarch">MONARCH</option>
                </select>
              </div>

              <div className="mt-4">
                <label className="block text-[10px] font-mono text-[#A3A3A3] mb-1 tracking-widest uppercase">BACKGROUND IMAGE</label>
                <div className="flex items-center gap-4">
                  <div className="relative flex-1 bg-[#141414] border border-[#262626] hover:border-[#333] rounded-sm px-4 py-3 text-white font-mono text-xs tracking-widest uppercase transition-colors cursor-pointer flex items-center justify-center">
                    <Upload className="w-4 h-4 mr-2" />
                    <span>{backgroundImage ? 'CHANGE IMAGE' : 'UPLOAD IMAGE'}</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleBgImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  {backgroundImage && (
                    <button 
                      onClick={handleRemoveBgImage}
                      className="p-3 text-[#A3A3A3] hover:text-red-400 transition-colors border border-[#262626] rounded-sm bg-[#141414]"
                      title="Remove Background"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Biometrics */}
            <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-6 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2" style={{ borderColor: themeColor }}></div>
              <h3 className="text-xl font-mono text-white flex items-center border-b border-[#262626] pb-4 font-bold tracking-widest uppercase">
                <Activity className="w-5 h-5 mr-2" style={{ color: themeColor }} />
                BIOMETRICS
              </h3>
              <p className="text-[10px] text-[#A3A3A3] font-mono tracking-widest uppercase">Required for advanced Vessel Tracker analysis (BMI/BMR).</p>
              
              {/* Quick Weight Logger Block */}
              <div className="p-4 bg-[#141414] border border-cyan-500/30 rounded-sm space-y-3">
                <div className="flex items-center justify-between border-b border-[#262626] pb-2">
                  <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="w-4 h-4" /> FAST WEIGHT LOG
                  </span>
                  {height && weight && (
                    <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded uppercase">
                      BMI: {(parseFloat(weight) / Math.pow(parseFloat(height) / 100, 2)).toFixed(1)}
                    </span>
                  )}
                </div>

                {weightLogNotice && (
                  <div className="p-2 bg-emerald-950/60 border border-emerald-500/50 rounded text-[10px] font-mono text-emerald-400 font-bold uppercase animate-fadeIn">
                    {weightLogNotice}
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-mono text-[#A3A3A3] mb-1 tracking-widest uppercase">CURRENT WEIGHT (KG)</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      step="0.1"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="flex-1 bg-[#0A0A0A] border border-[#262626] rounded-sm px-4 py-2.5 text-white font-mono text-sm font-bold tracking-wider focus:outline-none focus:border-cyan-500 placeholder:text-[#555]"
                      placeholder="e.g. 72.5"
                    />
                    <button
                      type="button"
                      onClick={() => handleDirectLogWeight()}
                      className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-bold uppercase rounded-sm transition-all whitespace-nowrap shadow-md"
                    >
                      LOG WEIGHT NOW
                    </button>
                  </div>
                </div>

                {/* Quick Increment Chips */}
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="text-[9px] font-mono text-[#A3A3A3] uppercase mr-1">QUICK ADJUST:</span>
                  {[-1, -0.5, +0.5, +1].map(delta => (
                    <button
                      key={delta}
                      type="button"
                      onClick={() => {
                        const curr = parseFloat(weight) || 70;
                        const next = Math.max(1, curr + delta);
                        handleDirectLogWeight(next);
                      }}
                      className="px-2.5 py-1 bg-[#0A0A0A] hover:bg-cyan-950/50 border border-[#262626] hover:border-cyan-500/50 text-[#CCC] hover:text-cyan-400 text-[10px] font-mono font-bold rounded transition-all"
                    >
                      {delta > 0 ? `+${delta}kg` : `${delta}kg`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-[#A3A3A3] mb-1 tracking-widest uppercase">HEIGHT (CM)</label>
                  <input 
                    type="number" 
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full bg-[#141414] border border-[#262626] rounded-sm px-4 py-3 text-white font-mono text-xs tracking-wider focus:outline-none placeholder:text-[#555]"
                    placeholder="175"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-[#A3A3A3] mb-1 tracking-widest uppercase">AGE</label>
                  <input 
                    type="number" 
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full bg-[#141414] border border-[#262626] rounded-sm px-4 py-3 text-white font-mono text-xs tracking-wider focus:outline-none placeholder:text-[#555]"
                    placeholder="25"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-mono text-[#A3A3A3] mb-1 tracking-widest uppercase">BIOLOGICAL SEX (FOR BMR CALC)</label>
                  <select 
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full bg-[#141414] border border-[#262626] rounded-sm px-4 py-3 text-white font-mono text-xs tracking-wider focus:outline-none uppercase"
                  >
                    <option value="male">MALE</option>
                    <option value="female">FEMALE</option>
                    <option value="other">OTHER</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-mono text-[#A3A3A3] mb-1 tracking-widest uppercase">FITNESS GOAL</label>
                  <select 
                    value={fitnessGoal}
                    onChange={(e) => setFitnessGoal(e.target.value as any)}
                    className="w-full bg-[#141414] border border-[#262626] rounded-sm px-4 py-3 text-white font-mono text-xs tracking-wider focus:outline-none uppercase"
                  >
                    <option value="lose">LOSE WEIGHT / CUT</option>
                    <option value="maintain">MAINTAIN WEIGHT / RECOMP</option>
                    <option value="build">BUILD MUSCLE / BULK</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-mono text-[#A3A3A3] mb-1 tracking-widest uppercase">ACTIVITY LEVEL</label>
                  <select 
                    value={activityLevel}
                    onChange={(e) => setActivityLevel(e.target.value as any)}
                    className="w-full bg-[#141414] border border-[#262626] rounded-sm px-4 py-3 text-white font-mono text-xs tracking-wider focus:outline-none uppercase"
                  >
                    <option value="sedentary">SEDENTARY (LITTLE TO NO EXERCISE)</option>
                    <option value="light">LIGHTLY ACTIVE (LIGHT EXERCISE 1-3 DAYS/WEEK)</option>
                    <option value="moderate">MODERATELY ACTIVE (MODERATE EXERCISE 3-5 DAYS/WEEK)</option>
                    <option value="active">ACTIVE (HARD EXERCISE 6-7 DAYS/WEEK)</option>
                    <option value="very_active">VERY ACTIVE (VERY HARD EXERCISE/PHYSICAL JOB)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: METABOLIC ENGINE */}
        {activeTab === 'engine' && (
          <div className="space-y-6 max-w-3xl">
            {/* Advanced System Modifiers */}
            <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-6 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2" style={{ borderColor: themeColor }}></div>
              <h3 className="text-xl font-mono text-white flex items-center border-b border-[#262626] pb-4 font-bold tracking-widest uppercase">
                <Activity className="w-5 h-5 mr-2" style={{ color: themeColor }} />
                SYSTEM ENGINE MODIFIERS & DIFFICULTY
              </h3>
              <p className="text-[10px] text-[#A3A3A3] font-mono tracking-widest uppercase">
                Alter core RPG mechanics, reward weights, and metabolic equation targets.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Game Difficulty */}
                <div>
                  <label className="block text-[10px] font-mono text-[#A3A3A3] mb-2 tracking-widest uppercase">SYSTEM DIFFICULTY RANK</label>
                  <select
                    value={gameDifficulty}
                    onChange={(e) => setGameDifficulty(e.target.value as any)}
                    className="w-full bg-[#141414] border border-[#262626] rounded-sm px-4 py-3 text-white font-mono text-xs tracking-wider focus:outline-none focus:ring-1 transition-colors uppercase"
                    style={{ '--tw-ring-color': themeColor, outlineColor: themeColor } as any}
                  >
                    <option value="casual">CASUAL (0.7X REWARDS, ZERO EXERTION PENALTIES)</option>
                    <option value="normal">NORMAL (1.0X STANDARD REWARDS / RULES)</option>
                    <option value="hardcore">HARDCORE (1.5X REWARDS, DOUBLE ATTRIBUTE PENALTIES)</option>
                  </select>
                  <p className="text-[9px] text-[#A3A3A3] font-mono mt-2 uppercase tracking-wide">
                    Affects experience multiplier and penalties from failed dailies or negative treasury events.
                  </p>
                </div>

                {/* Macro Distribution */}
                <div>
                  <label className="block text-[10px] font-mono text-[#A3A3A3] mb-2 tracking-widest uppercase">METABOLIC MACRO RATIOS</label>
                  <select
                    value={macroGoalRatio}
                    onChange={(e) => setMacroGoalRatio(e.target.value as any)}
                    className="w-full bg-[#141414] border border-[#262626] rounded-sm px-4 py-3 text-white font-mono text-xs tracking-wider focus:outline-none focus:ring-1 transition-colors uppercase"
                    style={{ '--tw-ring-color': themeColor, outlineColor: themeColor } as any}
                  >
                    <option value="balanced">BALANCED RECOMP (30% PRO, 40% CARB, 30% FAT)</option>
                    <option value="keto">KETOGENIC DIET (25% PRO, 5% CARB, 70% FAT)</option>
                    <option value="high_protein">ATHLETIC SHRED (40% PRO, 30% CARB, 30% FAT)</option>
                    <option value="custom">CUSTOM MACRO RATIOS</option>
                  </select>
                  <p className="text-[9px] text-[#A3A3A3] font-mono mt-2 uppercase tracking-wide">
                    Dynamically adjusts daily protein, carb, and fat gram targets inside the Metabolic Engine tab.
                  </p>
                </div>
              </div>

              {macroGoalRatio === 'custom' && (
                <div className="bg-[#141414] border border-[#262626] rounded-sm p-4 space-y-4">
                  <h4 className="text-[10px] font-mono text-white tracking-widest uppercase font-bold">CUSTOM PERCENTAGE RATIOS (MUST SUM TO 100%)</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[9px] font-mono text-[#A3A3A3] mb-1 uppercase">PROTEIN %</label>
                      <input
                        type="number"
                        value={customProtein}
                        onChange={(e) => setCustomProtein(e.target.value)}
                        className="w-full bg-[#0A0A0A] border border-[#262626] rounded-sm px-3 py-2 text-white font-mono text-xs focus:outline-none"
                        min="0"
                        max="100"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-mono text-[#A3A3A3] mb-1 uppercase">CARBS %</label>
                      <input
                        type="number"
                        value={customCarbs}
                        onChange={(e) => setCustomCarbs(e.target.value)}
                        className="w-full bg-[#0A0A0A] border border-[#262626] rounded-sm px-3 py-2 text-white font-mono text-xs focus:outline-none"
                        min="0"
                        max="100"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-mono text-[#A3A3A3] mb-1 uppercase">FAT %</label>
                      <input
                        type="number"
                        value={customFat}
                        onChange={(e) => setCustomFat(e.target.value)}
                        className="w-full bg-[#0A0A0A] border border-[#262626] rounded-sm px-3 py-2 text-white font-mono text-xs focus:outline-none"
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-mono uppercase">
                    <span className="text-[#A3A3A3]">TOTAL PERCENTAGE:</span>
                    <span className={cn(
                      "font-bold",
                      (parseInt(customProtein || '0') + parseInt(customCarbs || '0') + parseInt(customFat || '0')) === 100 ? "text-green-400" : "text-red-500"
                    )}>
                      {parseInt(customProtein || '0') + parseInt(customCarbs || '0') + parseInt(customFat || '0')}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: INTERFACE & HUD */}
        {activeTab === 'interface' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Theme Settings */}
            <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-6 space-y-6 relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2" style={{ borderColor: themeColor }}></div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#262626] pb-4 gap-4">
                <h3 className="text-xl font-mono text-white flex items-center font-bold tracking-widest uppercase">
                  <Palette className="w-5 h-5 mr-2" style={{ color: themeColor }} />
                  INTERFACE THEME
                </h3>
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-2 bg-[#141414] border border-[#262626] hover:border-[#333] px-4 py-2 rounded-sm transition-colors"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-blue-400" />}
                  <span className="text-[10px] font-mono text-white tracking-widest uppercase">{theme === 'dark' ? 'LIGHT MODE' : 'DARK MODE'}</span>
                </button>
              </div>

              {/* Theme Samples Gallery Launcher Banner */}
              <div className="p-4 bg-gradient-to-r from-cyan-950/40 via-purple-950/20 to-[#141414] border border-cyan-500/40 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                    <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">UI THEME PRESET GALLERY</h4>
                    <p className="text-[10px] font-mono text-[#A3A3A3]">Preview & switch between 7 visual UI styles and layouts live.</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsGalleryOpen(true)}
                  className="w-full sm:w-auto px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-bold uppercase rounded transition-all shadow-md flex items-center justify-center gap-1.5 whitespace-nowrap"
                >
                  <Palette className="w-4 h-4" /> EXPLORE UI SAMPLES
                </button>
              </div>

              <p className="text-[10px] text-[#A3A3A3] font-mono tracking-widest uppercase">
                Your system theme color is automatically determined by your current Rank or manually selected below.
              </p>
              
              <div className="mt-4">
                <label className="block text-[10px] font-mono text-[#A3A3A3] mb-1 tracking-widest uppercase">ACCENT COLOR</label>
                <select 
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-full bg-[#141414] border border-[#262626] rounded-sm px-4 py-3 text-white font-mono text-xs tracking-wider focus:outline-none focus:ring-1 transition-colors uppercase"
                  style={{ '--tw-ring-color': themeColor, outlineColor: themeColor } as any}
                >
                  <option value="">AUTO (CURRENT RANK)</option>
                  <option value="#00F0FF">SYSTEM DEFAULT (CYAN)</option>
                  <option value="#818CF8">MONARCH INDIGO (#818CF8)</option>
                  <option value="#A855F7">S-CLASS PURPLE (#A855F7)</option>
                  <option value="#EF4444">CRIMSON BERSERKER (#EF4444)</option>
                  <option value="#F59E0B">GOLDEN NATIONAL (#F59E0B)</option>
                  <option value="#10B981">EMERALD MATRIX (#10B981)</option>
                  <option value="#2563EB">COBALT BLUE (#2563EB)</option>
                  {RANK_TIERS.filter(t => level >= t.minLevel).map(t => (
                    <option key={t.rank} value={t.color}>{t.rank.toUpperCase()} ({t.color})</option>
                  ))}
                </select>
              </div>
              
              <div className="mt-4">
                <label className="block text-[10px] font-mono text-[#A3A3A3] mb-1 tracking-widest uppercase">UI THEME LAYOUT</label>
                <select 
                  value={uiTheme}
                  onChange={(e) => setUiTheme(e.target.value)}
                  className="w-full bg-[#141414] border border-[#262626] rounded-sm px-4 py-3 text-white font-mono text-xs tracking-wider focus:outline-none focus:ring-1 transition-colors uppercase"
                  style={{ '--tw-ring-color': themeColor, outlineColor: themeColor } as any}
                >
                  <option value="default">SOLO CYAN (STANDARD UI)</option>
                  <option value="monarch">MONARCH VOID (INDIGO GRID)</option>
                  <option value="s_class">S-CLASS OVERDRIVE (PURPLE RADIAL)</option>
                  <option value="shadow_red">CRIMSON SHADOW (BERSERKER)</option>
                  <option value="golden_national">GOLDEN NATIONAL (SSS LUXURY)</option>
                  <option value="emerald_vessel">EMERALD MATRIX (BIO-TECH TERMINAL)</option>
                  <option value="solar_daylight">SOLAR DAYLIGHT (MINIMALIST LIGHT MODE)</option>
                </select>
              </div>
            </div>

            {/* HUD Configuration */}
            <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-6 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2" style={{ borderColor: themeColor }}></div>
              <h3 className="text-xl font-mono text-white flex items-center border-b border-[#262626] pb-4 font-bold tracking-widest uppercase">
                <Settings className="w-5 h-5 mr-2" style={{ color: themeColor }} />
                SYSTEM HUD CONFIGURATION
              </h3>
              <p className="text-[10px] text-[#A3A3A3] font-mono tracking-widest uppercase">
                Toggle visibility for individual HUD components on the main screens.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex items-center justify-between p-4 bg-[#141414] border border-[#262626] hover:border-[#333] rounded-sm cursor-pointer transition-colors">
                  <div className="flex flex-col">
                    <span className="text-xs font-mono font-bold text-white tracking-widest uppercase">ACTIVE QUEST TICKER</span>
                    <span className="text-[9px] font-mono text-[#A3A3A3] mt-1 uppercase">Active directives ticker</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={showActiveQuestTicker}
                    onChange={() => toggleHUDComponent('showActiveQuestTicker')}
                    className="w-4 h-4 rounded-sm border-[#262626] bg-[#141414] text-current focus:ring-0 focus:ring-offset-0"
                    style={{ color: themeColor } as any}
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-[#141414] border border-[#262626] hover:border-[#333] rounded-sm cursor-pointer transition-colors">
                  <div className="flex flex-col">
                    <span className="text-xs font-mono font-bold text-white tracking-widest uppercase">ATTRIBUTE BARS</span>
                    <span className="text-[9px] font-mono text-[#A3A3A3] mt-1 uppercase">Visual bars for chest, back etc.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={showAttributeProgressBars}
                    onChange={() => toggleHUDComponent('showAttributeProgressBars')}
                    className="w-4 h-4 rounded-sm border-[#262626] bg-[#141414] text-current focus:ring-0 focus:ring-offset-0"
                    style={{ color: themeColor } as any}
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-[#141414] border border-[#262626] hover:border-[#333] rounded-sm cursor-pointer transition-colors">
                  <div className="flex flex-col">
                    <span className="text-xs font-mono font-bold text-white tracking-widest uppercase">RADAR CHART</span>
                    <span className="text-[9px] font-mono text-[#A3A3A3] mt-1 uppercase">Attribute distribution radar chart</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={showRadarChart}
                    onChange={() => toggleHUDComponent('showRadarChart')}
                    className="w-4 h-4 rounded-sm border-[#262626] bg-[#141414] text-current focus:ring-0 focus:ring-offset-0"
                    style={{ color: themeColor } as any}
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-[#141414] border border-[#262626] hover:border-[#333] rounded-sm cursor-pointer transition-colors">
                  <div className="flex flex-col">
                    <span className="text-xs font-mono font-bold text-white tracking-widest uppercase">MUSCLE FIGURINE</span>
                    <span className="text-[9px] font-mono text-[#A3A3A3] mt-1 uppercase">Front/back muscle figurine SVG</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={showMuscleFigurine}
                    onChange={() => toggleHUDComponent('showMuscleFigurine')}
                    className="w-4 h-4 rounded-sm border-[#262626] bg-[#141414] text-current focus:ring-0 focus:ring-offset-0"
                    style={{ color: themeColor } as any}
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: DATA & CLOUD */}
        {activeTab === 'data' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Data Management */}
            <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-6 space-y-6 relative overflow-hidden">
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2" style={{ borderColor: themeColor }}></div>
              <h3 className="text-xl font-mono text-white flex items-center border-b border-[#262626] pb-4 font-bold tracking-widest uppercase">
                <Database className="w-5 h-5 mr-2" style={{ color: themeColor }} />
                DATA BACKUP & RESTORE
              </h3>
              <p className="text-[10px] text-[#A3A3A3] font-mono tracking-widest uppercase">
                Export your entire life-tracking database as a JSON file or restore from a previous local backup.
              </p>

              {/* Database Record Summary Badges */}
              <div className="bg-[#141414] border border-[#262626] p-3.5 rounded-sm space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider border-b border-[#222] pb-1.5">
                  <span className="text-[#A3A3A3] font-bold">STORED LIFE TRACKING DATA</span>
                  <span className="text-emerald-400 font-bold">{totalDbRecords} TOTAL RECORDS</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono">
                  <div className="bg-[#0A0A0A] p-2 border border-[#222] rounded-sm">
                    <div className="text-[#888]">QUESTS</div>
                    <div className="text-white font-bold">{questsCount}</div>
                  </div>
                  <div className="bg-[#0A0A0A] p-2 border border-[#222] rounded-sm">
                    <div className="text-[#888]">TIMETABLE</div>
                    <div className="text-cyan-400 font-bold">{timetableCount}</div>
                  </div>
                  <div className="bg-[#0A0A0A] p-2 border border-[#222] rounded-sm">
                    <div className="text-[#888]">NUTRITION</div>
                    <div className="text-emerald-400 font-bold">{nutritionCount}</div>
                  </div>
                  <div className="bg-[#0A0A0A] p-2 border border-[#222] rounded-sm">
                    <div className="text-[#888]">FINANCE</div>
                    <div className="text-amber-400 font-bold">{ledgerCount}</div>
                  </div>
                  <div className="bg-[#0A0A0A] p-2 border border-[#222] rounded-sm">
                    <div className="text-[#888]">VESSEL LOGS</div>
                    <div className="text-indigo-400 font-bold">{vesselCount}</div>
                  </div>
                  <div className="bg-[#0A0A0A] p-2 border border-[#222] rounded-sm">
                    <div className="text-[#888]">TASKS</div>
                    <div className="text-purple-400 font-bold">{tasksCount}</div>
                  </div>
                  <div className="bg-[#0A0A0A] p-2 border border-[#222] rounded-sm">
                    <div className="text-[#888]">DUNGEONS</div>
                    <div className="text-rose-400 font-bold">{dungeonsCount}</div>
                  </div>
                  <div className="bg-[#0A0A0A] p-2 border border-[#222] rounded-sm">
                    <div className="text-[#888]">MISSIONS</div>
                    <div className="text-yellow-400 font-bold">{missionCount}</div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleExport}
                  className="flex-1 bg-[#141414] border border-[#262626] hover:bg-[#1A1A1A] hover:border-emerald-500/50 text-white px-4 py-3.5 rounded-sm font-mono text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 group"
                >
                  <Download className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" /> EXPORT JSON BACKUP
                </button>

                <div className="flex-1 relative">
                  <input 
                    type="file" 
                    accept=".json" 
                    onChange={handleImport}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    title="Import JSON Backup file"
                  />
                  <button className="w-full bg-[#141414] border border-[#262626] hover:bg-[#1A1A1A] hover:border-cyan-500/50 text-white px-4 py-3.5 rounded-sm font-mono text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 group">
                    <Upload className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" /> RESTORE FROM JSON
                  </button>
                </div>
              </div>
              
              <div className="pt-4 border-t border-[#262626]">
                <button 
                  onClick={() => setShowResetConfirm(true)}
                  className="w-full bg-red-950/30 border border-red-900/50 hover:bg-red-900/50 text-red-400 px-4 py-3 rounded-sm font-mono text-xs font-bold tracking-widest uppercase transition-colors flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> FACTORY RESET (WIPE ALL DATA)
                </button>
              </div>
            </div>

            {/* Quota & Capacity Monitor */}
            <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-6 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2" style={{ borderColor: themeColor }}></div>
              <div className="flex items-center justify-between border-b border-[#262626] pb-4">
                <div className="flex items-center text-white font-mono font-bold tracking-widest uppercase text-sm">
                  <Activity className="w-5 h-5 mr-2 text-emerald-400" />
                  SYSTEM QUOTA & CAPACITY STATUS
                </div>
                <span className="px-2 py-0.5 bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 font-mono text-[10px] uppercase rounded-sm font-bold">
                  HEALTHY (UNLIMITED)
                </span>
              </div>

              <div className="space-y-4 font-mono text-xs">
                <div className="bg-[#141414] p-3 rounded-sm border border-[#262626]">
                  <div className="flex justify-between text-[#A3A3A3] text-[10px] uppercase mb-1">
                    <span>INDEXEDDB STORAGE CAPACITY</span>
                    <span className="text-emerald-400 font-bold">UNLIMITED LOCAL</span>
                  </div>
                  <div className="w-full bg-[#0A0A0A] h-2 rounded-sm overflow-hidden mb-1">
                    <div className="bg-emerald-500 h-full w-[2%]" />
                  </div>
                  <div className="flex justify-between text-[10px] text-[#A3A3A3] uppercase">
                    <span>USED: ~250 KB</span>
                    <span>AVAILABLE: ~50,000 KB (99.5% FREE)</span>
                  </div>
                </div>

                <div className="bg-[#141414] p-3 rounded-sm border border-[#262626] space-y-2">
                  <div className="flex justify-between items-center text-[10px] uppercase">
                    <span className="text-[#A3A3A3]">APPLET AI STUDIO QUOTA:</span>
                    <span className="text-cyan-400 font-bold">UNLIMITED EXECUTION</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] uppercase">
                    <span className="text-[#A3A3A3]">SQL FOOD DATABASE CAPACITY:</span>
                    <span className="text-amber-400 font-bold">1,000+ PRESET ITEMS</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] uppercase">
                    <span className="text-[#A3A3A3]">NUTRITION LOG ENGINE:</span>
                    <span className="text-emerald-400 font-bold">ACTIVE & PERSISTED</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Save configuration control strip */}
      <div className="flex justify-end pt-4 border-t border-[#262626] pb-10">
        <button 
          onClick={handleSave}
          className="bg-[#141414] border border-[#262626] hover:bg-[#1A1A1A] text-white px-8 py-3 rounded-sm font-mono text-xs font-bold tracking-widest uppercase transition-all flex items-center"
          style={{ borderColor: isSaving ? themeColor : undefined, color: isSaving ? themeColor : 'white' }}
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'CONFIG SAVED' : 'SAVE CONFIGURATION'}
        </button>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
          <div className="bg-[#0A0A0A] border border-red-900/50 rounded-sm max-w-md w-full p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
            <h3 className="text-xl font-mono text-red-500 font-bold mb-4 flex items-center tracking-widest uppercase">
              <AlertTriangle className="w-6 h-6 mr-2" />
              CRITICAL WARNING
            </h3>
            <p className="text-[#A3A3A3] text-xs font-mono mb-6 tracking-widest uppercase leading-relaxed">
              This action will permanently delete all your data, including quests, inventory, logs, and settings. This cannot be undone.
            </p>
            <div className="mb-6">
              <label className="block text-[10px] font-mono text-[#A3A3A3] mb-2 tracking-widest uppercase">
                TYPE <span className="text-white font-bold">RESET</span> TO CONFIRM:
              </label>
              <input 
                type="text" 
                value={resetText}
                onChange={(e) => setResetText(e.target.value)}
                className="w-full bg-[#141414] border border-[#262626] rounded-sm px-4 py-3 text-white font-mono text-center focus:outline-none focus:border-red-500 tracking-widest uppercase"
                placeholder="RESET"
              />
            </div>
            <div className="flex space-x-4">
              <button 
                onClick={() => {
                  setShowResetConfirm(false);
                  setResetText('');
                }}
                className="flex-1 bg-[#141414] hover:bg-[#262626] border border-[#262626] text-white px-4 py-3 rounded-sm font-mono text-xs font-bold tracking-widest uppercase transition-colors"
              >
                CANCEL
              </button>
              <button 
                onClick={handleReset}
                disabled={resetText !== 'RESET'}
                className={cn(
                  "flex-1 px-4 py-3 rounded-sm font-mono text-xs font-bold tracking-widest uppercase transition-colors",
                  resetText === 'RESET' 
                    ? "bg-red-600 hover:bg-red-700 text-white" 
                    : "bg-red-950/30 text-red-900 cursor-not-allowed"
                )}
              >
                CONFIRM WIPE
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Theme Samples Gallery Modal */}
      <ThemeGalleryModal 
        isOpen={isGalleryOpen} 
        onClose={() => setIsGalleryOpen(false)} 
        currentThemeColor={themeColor}
        currentUiTheme={uiTheme}
      />
    </div>
  );
}
