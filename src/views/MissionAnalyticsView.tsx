import React, { useState, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, addXp } from '../db/db';
import { Target, TrendingUp, Activity, Plus, Trash2, BrainCircuit, BarChart3, Trophy } from 'lucide-react';
import { cn, getRank } from '../lib/utils';
import { format, subDays } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { toast } from 'sonner';

export function MissionAnalyticsView() {
  const userStats = useLiveQuery(() => db.userStats.get(1));
  
  const thirtyDaysAgo = useMemo(() => subDays(new Date(), 30).toISOString(), []);
  const missionLogs = useLiveQuery(() => 
    db.missionLogs.where('date').aboveOrEqual(thirtyDaysAgo).toArray()
  );

  // Tab state
  const [activeTab, setActiveTab] = useState<'goals' | 'analytics'>('goals');

  // Goals list (persisted in localStorage)
  const [goals, setGoals] = useState<any[]>(() => {
    const saved = localStorage.getItem('system_core_goals');
    return saved ? JSON.parse(saved) : [
      {
        id: 'g1',
        title: 'BUILD COMPREHENSIVE LIFE CONSOLE',
        description: 'Implement full-stack system features with high-fidelity UI.',
        category: 'career',
        timeframe: 'short',
        targetValue: 100,
        currentValue: 85,
        unit: '% completed',
        linkedAttribute: 'INT',
        completed: false,
        dateCreated: new Date().toISOString(),
        dueDate: format(new Date(Date.now() + 7 * 24 * 3600 * 1000), 'yyyy-MM-dd')
      },
      {
        id: 'g2',
        title: 'ESTABLISH BULK SAVINGS SURPLUS',
        description: 'Accumulate target credits inside the treasury vaults.',
        category: 'wealth',
        timeframe: 'mid',
        targetValue: 1000,
        currentValue: 200,
        unit: 'credits',
        linkedAttribute: 'SEN',
        completed: false,
        dateCreated: new Date().toISOString(),
        dueDate: format(new Date(Date.now() + 30 * 24 * 3600 * 1000), 'yyyy-MM-dd')
      }
    ];
  });

  const saveGoalsToStorage = (updatedGoals: any[]) => {
    setGoals(updatedGoals);
    localStorage.setItem('system_core_goals', JSON.stringify(updatedGoals));
  };

  // Form states for goals
  const [goalTitle, setGoalTitle] = useState('');
  const [goalDesc, setGoalDesc] = useState('');
  const [goalCategory, setGoalCategory] = useState<'career' | 'health' | 'wealth' | 'intellect'>('intellect');
  const [goalTimeframe, setGoalTimeframe] = useState<'short' | 'mid' | 'long'>('short');
  const [goalTarget, setGoalTarget] = useState('100');
  const [goalUnit, setGoalUnit] = useState('%');
  const [goalAttr, setGoalAttr] = useState<'STR' | 'VIT' | 'AGI' | 'INT' | 'SEN'>('INT');
  const [goalDueDate, setGoalDueDate] = useState(format(new Date(Date.now() + 14 * 24 * 3600 * 1000), 'yyyy-MM-dd'));

  // Increment goal progress input values
  const [incrementAmount, setIncrementAmount] = useState<Record<string, string>>({});

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'study' | 'work' | 'personal' | 'fitness'>('study');
  const [result, setResult] = useState<'success' | 'failure' | 'partial'>('success');
  const [completionRate, setCompletionRate] = useState('100');
  const [noiseLevel, setNoiseLevel] = useState('10');
  const [notes, setNotes] = useState('');

  // Objectives action handlers
  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle || !goalTarget) return;

    const newGoal = {
      id: `goal_${Date.now()}`,
      title: goalTitle.toUpperCase(),
      description: goalDesc.toUpperCase(),
      category: goalCategory,
      timeframe: goalTimeframe,
      targetValue: parseFloat(goalTarget),
      currentValue: 0,
      unit: goalUnit || 'units',
      linkedAttribute: goalAttr,
      completed: false,
      dateCreated: new Date().toISOString(),
      dueDate: goalDueDate
    };

    const updated = [...goals, newGoal];
    saveGoalsToStorage(updated);

    // Reset Form
    setGoalTitle('');
    setGoalDesc('');
    setGoalUnit('%');
    setGoalTarget('100');
    toast.success('Core Objective successfully locked in.');
  };

  const handleDeleteGoal = (id: string) => {
    const updated = goals.filter(g => g.id !== id);
    saveGoalsToStorage(updated);
    toast.error('Objective deleted.');
  };

  const handleIncrementGoal = async (id: string) => {
    const amountStr = incrementAmount[id] || '1';
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) return;

    const targetGoal = goals.find(g => g.id === id);
    if (!targetGoal) return;

    const nextValue = Math.min(targetGoal.targetValue, targetGoal.currentValue + amount);
    const isNowCompleted = nextValue >= targetGoal.targetValue && !targetGoal.completed;

    const updated = goals.map(g => {
      if (g.id === id) {
        return {
          ...g,
          currentValue: nextValue,
          completed: isNowCompleted ? true : g.completed
        };
      }
      return g;
    });
    saveGoalsToStorage(updated);

    if (isNowCompleted) {
      let xpAward = 500;
      let creditAward = 100;
      if (targetGoal.timeframe === 'mid') {
        xpAward = 1500;
        creditAward = 300;
      } else if (targetGoal.timeframe === 'long') {
        xpAward = 5000;
        creditAward = 1000;
      }

      const currentStats = await db.userStats.get(1);
      if (currentStats) {
        const currentAttrVal = (currentStats as any)[targetGoal.linkedAttribute] || 10;
        const attrBoost = targetGoal.timeframe === 'long' ? 5 : (targetGoal.timeframe === 'mid' ? 3 : 1);
        await db.userStats.update(1, {
          [targetGoal.linkedAttribute]: currentAttrVal + attrBoost,
          credits: currentStats.credits + creditAward
        });
        await addXp(xpAward);

        toast.success(`OBJECTIVE COMPLETE! +${xpAward} XP, +${creditAward} credits, +${attrBoost} ${targetGoal.linkedAttribute}!`, {
          icon: <Trophy className="w-5 h-5 text-yellow-400" />,
          duration: 5000
        });
      }
    } else {
      toast.info(`Progress log: (${nextValue}/${targetGoal.targetValue} ${targetGoal.unit})`);
    }

    setIncrementAmount(prev => ({ ...prev, [id]: '' }));
  };

  // Chart Data
  const chartData = useMemo(() => {
    if (!missionLogs) return [];
    
    const daysMap = new Map();
    for (let i = 29; i >= 0; i--) {
      const d = subDays(new Date(), i);
      const dateStr = format(d, 'MMM dd');
      daysMap.set(dateStr, {
        date: dateStr,
        completionSum: 0,
        noiseSum: 0,
        successCount: 0,
        totalCount: 0
      });
    }

    missionLogs.forEach(log => {
      const dateStr = format(new Date(log.date), 'MMM dd');
      if (daysMap.has(dateStr)) {
        const day = daysMap.get(dateStr);
        day.completionSum += log.completionRate;
        day.noiseSum += log.noiseLevel;
        if (log.result === 'success') day.successCount += 1;
        day.totalCount += 1;
      }
    });

    return Array.from(daysMap.values()).map(day => ({
      date: day.date,
      completion: day.totalCount > 0 ? Math.round(day.completionSum / day.totalCount) : 0,
      noise: day.totalCount > 0 ? Math.round(day.noiseSum / day.totalCount) : 0,
      successRate: day.totalCount > 0 ? Math.round((day.successCount / day.totalCount) * 100) : 0,
    }));
  }, [missionLogs]);

  if (!userStats) return <div className="opacity-80">Loading Analytics...</div>;

  const level = Math.floor((userStats.xp || 0) / 1000) + 1;
  const rankColor = getRank(level).color;
  const themeColor = userStats?.selectedColor || rankColor;

  const handleLogMission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !completionRate || !noiseLevel) return;

    const cr = Math.min(100, Math.max(0, parseInt(completionRate)));
    const nl = Math.min(100, Math.max(0, parseInt(noiseLevel)));

    await db.missionLogs.add({
      date: new Date().toISOString(),
      title,
      category,
      result,
      completionRate: cr,
      noiseLevel: nl,
      notes
    });

    // Skill Linking: Success contributes to INT and SEN
    if (result === 'success') {
      await db.userStats.update(1, {
        INT: userStats.INT + (category === 'study' ? 2 : 1),
        SEN: userStats.SEN + (nl < 30 ? 2 : 1)
      });
      const xpGain = cr * 10 + 500;
      await addXp(xpGain); // Generous XP to make leveling easy
      toast.success(`Mission Success! +${xpGain} XP gained.`, {
        icon: <Trophy className="w-4 h-4 text-yellow-400" />,
        duration: 3000,
      });
    } else if (result === 'partial') {
      const xpGain = Math.floor(cr / 2) * 10 + 250;
      await addXp(xpGain);
      toast.success(`Mission Partial! +${xpGain} XP gained.`, {
        icon: <Trophy className="w-4 h-4 text-yellow-400" />,
        duration: 3000,
      });
    }

    setTitle('');
    setCompletionRate('100');
    setNoiseLevel('10');
    setNotes('');
  };

  const handleDelete = async (id: number) => {
    await db.missionLogs.delete(id);
  };

  // Calculate Analytics
  let avgCompletion = 0;
  let avgNoise = 0;
  let successRate = 0;
  let totalMissions = 0;

  const categoryCounts: Record<string, number> = { study: 0, work: 0, fitness: 0, personal: 0 };
  const resultCounts: Record<string, number> = { success: 0, partial: 0, failure: 0 };

  if (missionLogs && missionLogs.length > 0) {
    totalMissions = missionLogs.length;
    const recentLogs = missionLogs.slice(0, 10);
    const successes = recentLogs.filter(l => l.result === 'success').length;
    successRate = (successes / recentLogs.length) * 100;

    const totalCompletion = missionLogs.reduce((acc, l) => acc + l.completionRate, 0);
    const totalNoise = missionLogs.reduce((acc, l) => acc + l.noiseLevel, 0);
    
    avgCompletion = totalCompletion / missionLogs.length;
    avgNoise = totalNoise / missionLogs.length;

    missionLogs.forEach(log => {
      if (categoryCounts[log.category] !== undefined) {
        categoryCounts[log.category]++;
      }
      if (resultCounts[log.result] !== undefined) {
        resultCounts[log.result]++;
      }
    });
  }

  const categoryData = [
    { name: 'Study', value: categoryCounts.study, color: '#3b82f6' },
    { name: 'Work', value: categoryCounts.work, color: '#8b5cf6' },
    { name: 'Fitness', value: categoryCounts.fitness, color: '#10b981' },
    { name: 'Personal', value: categoryCounts.personal, color: '#f59e0b' }
  ].filter(d => d.value > 0);

  const resultData = [
    { name: 'Success', value: resultCounts.success, color: '#22c55e' },
    { name: 'Partial', value: resultCounts.partial, color: '#eab308' },
    { name: 'Failure', value: resultCounts.failure, color: '#ef4444' }
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-8 pb-10">
      <header className="hidden md:block border-b border-[#262626] pb-6">
        <h2 className="text-3xl font-mono font-bold tracking-tight text-white flex items-center uppercase" style={{ color: themeColor }}>
          TACTICAL OPERATIONS & GOALS
        </h2>
        <p className="text-[#A3A3A3] text-sm mt-1 font-mono uppercase tracking-widest">Manage long-term core system objectives, track active milestones, and view mission analytics.</p>
      </header>

      {/* Tab Switcher */}
      <div className="flex bg-[#0A0A0A] border border-[#262626] rounded-sm p-1 max-w-md">
        <button
          onClick={() => setActiveTab('goals')}
          className={cn(
            "flex-1 py-2 text-xs font-mono rounded-sm transition-colors font-bold tracking-widest uppercase flex items-center justify-center",
            activeTab === 'goals' 
              ? "bg-[#141414] text-white border border-[#333]" 
              : "text-[#A3A3A3] hover:text-white"
          )}
        >
          <Target className="w-4 h-4 mr-2" style={{ color: activeTab === 'goals' ? themeColor : undefined }} />
          SYSTEM OBJECTIVES
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={cn(
            "flex-1 py-2 text-xs font-mono rounded-sm transition-colors font-bold tracking-widest uppercase flex items-center justify-center",
            activeTab === 'analytics' 
              ? "bg-[#141414] text-white border border-[#333]" 
              : "text-[#A3A3A3] hover:text-white"
          )}
        >
          <BarChart3 className="w-4 h-4 mr-2" style={{ color: activeTab === 'analytics' ? themeColor : undefined }} />
          MISSION METRICS
        </button>
      </div>

      {activeTab === 'goals' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Objectives */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2" style={{ borderColor: themeColor }}></div>
              <h3 className="text-xl font-mono text-white mb-6 flex items-center font-bold tracking-widest uppercase border-b border-[#262626] pb-4">
                <Target className="w-5 h-5 mr-2" style={{ color: themeColor }} />
                ACTIVE CORE OBJECTIVES
              </h3>
              
              {goals.filter(g => !g.completed).length > 0 ? (
                <div className="space-y-6">
                  {goals.filter(g => !g.completed).map(goal => {
                    const pct = Math.min(100, (goal.currentValue / goal.targetValue) * 100);
                    return (
                      <div key={goal.id} className="bg-[#141414] border border-[#262626] rounded-sm p-4 hover:border-[#333] transition-colors relative">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                              <span className={cn(
                                "text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest font-mono",
                                goal.timeframe === 'short' ? "bg-cyan-950/40 text-cyan-400 border border-cyan-900/50" :
                                goal.timeframe === 'mid' ? "bg-purple-950/40 text-purple-400 border border-purple-900/50" :
                                "bg-yellow-950/40 text-yellow-400 border border-yellow-900/50 animate-pulse"
                              )}>
                                {goal.timeframe}-term Goal
                              </span>
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest font-mono bg-[#0A0A0A] border border-[#262626] text-[#A3A3A3]">
                                Category: {goal.category}
                              </span>
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest font-mono bg-blue-950/30 border border-blue-900/40 text-blue-400">
                                Link: +{goal.linkedAttribute}
                              </span>
                            </div>
                            <h4 className="font-mono text-sm font-bold text-white uppercase tracking-wide">{goal.title}</h4>
                            <p className="text-[10px] font-mono text-[#A3A3A3] mt-1 uppercase tracking-wider">{goal.description}</p>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-mono text-[#A3A3A3] whitespace-nowrap">DUE: {goal.dueDate}</span>
                            <button 
                              onClick={() => handleDeleteGoal(goal.id)}
                              className="text-[#A3A3A3] hover:text-red-500 transition-colors p-1"
                              title="Delete Goal"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-[10px] font-mono">
                            <span className="text-[#A3A3A3]">TACTICAL PROGRESS: {pct.toFixed(0)}%</span>
                            <span className="text-white font-bold">{goal.currentValue} / {goal.targetValue} {goal.unit}</span>
                          </div>
                          <div className="w-full bg-[#0A0A0A] h-2 rounded-sm overflow-hidden border border-[#262626]">
                            <div 
                              className="h-full transition-all duration-300" 
                              style={{ 
                                width: `${pct}%`,
                                backgroundColor: goal.timeframe === 'short' ? '#06b6d4' : (goal.timeframe === 'mid' ? '#a855f7' : '#eab308')
                              }}
                            ></div>
                          </div>
                        </div>

                        {/* Log Progress Inline Section */}
                        <div className="mt-4 pt-3 border-t border-[#262626] flex items-center justify-between gap-4">
                          <span className="text-[9px] font-mono text-[#737373] uppercase tracking-widest">RECORD PROGRESS:</span>
                          <div className="flex items-center space-x-2">
                            <input 
                              type="number"
                              value={incrementAmount[goal.id] || ''}
                              onChange={(e) => setIncrementAmount(prev => ({ ...prev, [goal.id]: e.target.value }))}
                              placeholder={`INC (${goal.unit})`}
                              className="bg-[#0A0A0A] border border-[#262626] rounded-sm px-2 py-1.5 text-xs font-mono text-white placeholder:text-[#555] w-24 focus:outline-none"
                            />
                            <button 
                              onClick={() => handleIncrementGoal(goal.id)}
                              className="bg-[#0A0A0A] border border-[#262626] hover:bg-[#1C1C1C] text-white px-3 py-1.5 rounded-sm font-mono text-[10px] tracking-widest uppercase transition-colors"
                            >
                              LOG
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-[#A3A3A3] font-mono text-sm uppercase">
                  NO ACTIVE OBJECTIVES COMMENCED. COMMENCE CORE GOALS TO COMMENCE PROGRESS.
                </div>
              )}
            </div>

            {/* Completed Goals */}
            <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2" style={{ borderColor: themeColor }}></div>
              <h3 className="text-lg font-mono text-white mb-4 flex items-center font-bold tracking-widest uppercase border-b border-[#262626] pb-4">
                <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                COMPLETED OBJECTIVES (ARCHIVE)
              </h3>
              
              {goals.filter(g => g.completed).length > 0 ? (
                <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                  {goals.filter(g => g.completed).map(goal => (
                    <div key={goal.id} className="bg-[#141414]/40 border border-[#262626] rounded-sm p-3 flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-widest font-mono bg-green-950/40 text-green-400 border border-green-900/50">
                            COMPLETE
                          </span>
                          <span className="font-mono text-xs font-bold text-white uppercase tracking-wider line-through decoration-neutral-600">{goal.title}</span>
                        </div>
                        <p className="text-[9px] font-mono text-[#737373] uppercase tracking-wide">
                          ARCHIVED • LINKED {goal.linkedAttribute} • TIMEFRAME {goal.timeframe}
                        </p>
                      </div>
                      <button 
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="text-[#555] hover:text-red-500 transition-colors p-1"
                        title="Delete Goal Log"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[9px] font-mono text-[#737373] uppercase">NO COMPLETED OBJECTIVES RECORDED YET.</p>
              )}
            </div>
          </div>

          {/* Establish Goal Sidebar Form */}
          <div className="lg:col-span-1">
            <form onSubmit={handleAddGoal} className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-6 sticky top-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2" style={{ borderColor: themeColor }}></div>
              <h4 className="text-sm font-mono text-white mb-4 font-bold tracking-widest uppercase">ESTABLISH CORE GOAL</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono text-[#A3A3A3] mb-1 tracking-widest uppercase">OBJECTIVE TITLE</label>
                  <input 
                    type="text" 
                    value={goalTitle}
                    onChange={(e) => setGoalTitle(e.target.value)}
                    required
                    placeholder="E.G. STUDY CHINESE"
                    className="w-full bg-[#141414] border border-[#262626] rounded-sm px-3 py-3 text-white font-mono text-xs uppercase placeholder:text-[#555] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-[#A3A3A3] mb-1 tracking-widest uppercase">DESCRIPTION</label>
                  <textarea 
                    value={goalDesc}
                    onChange={(e) => setGoalDesc(e.target.value)}
                    placeholder="E.G. MEMORIZE 500 NEW CHARACTERS"
                    rows={2}
                    className="w-full bg-[#141414] border border-[#262626] rounded-sm px-3 py-2 text-white font-mono text-xs uppercase placeholder:text-[#555] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-[#A3A3A3] mb-1 tracking-widest uppercase">CATEGORY</label>
                    <select 
                      value={goalCategory}
                      onChange={(e) => setGoalCategory(e.target.value as any)}
                      className="w-full bg-[#141414] border border-[#262626] rounded-sm px-3 py-2.5 text-white font-mono text-xs uppercase focus:outline-none"
                    >
                      <option value="intellect">INTELLECT</option>
                      <option value="career">CAREER</option>
                      <option value="health">HEALTH</option>
                      <option value="wealth">WEALTH</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-[#A3A3A3] mb-1 tracking-widest uppercase">TIMEFRAME</label>
                    <select 
                      value={goalTimeframe}
                      onChange={(e) => setGoalTimeframe(e.target.value as any)}
                      className="w-full bg-[#141414] border border-[#262626] rounded-sm px-3 py-2.5 text-white font-mono text-xs uppercase focus:outline-none"
                    >
                      <option value="short">SHORT-TERM</option>
                      <option value="mid">MID-TERM</option>
                      <option value="long">LONG-TERM</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-[#A3A3A3] mb-1 tracking-widest uppercase">TARGET VALUE</label>
                    <input 
                      type="number" 
                      value={goalTarget}
                      onChange={(e) => setGoalTarget(e.target.value)}
                      required
                      className="w-full bg-[#141414] border border-[#262626] rounded-sm px-3 py-2.5 text-white font-mono text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-[#A3A3A3] mb-1 tracking-widest uppercase">UNIT</label>
                    <input 
                      type="text" 
                      value={goalUnit}
                      onChange={(e) => setGoalUnit(e.target.value)}
                      placeholder="e.g. books"
                      className="w-full bg-[#141414] border border-[#262626] rounded-sm px-3 py-2.5 text-white font-mono text-xs focus:outline-none uppercase placeholder:text-[#555]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-[#A3A3A3] mb-1 tracking-widest uppercase">LINKED ATTRIBUTE</label>
                    <select 
                      value={goalAttr}
                      onChange={(e) => setGoalAttr(e.target.value as any)}
                      className="w-full bg-[#141414] border border-[#262626] rounded-sm px-3 py-2.5 text-white font-mono text-xs focus:outline-none"
                    >
                      <option value="STR">STR (STRENGTH)</option>
                      <option value="VIT">VIT (VITALITY)</option>
                      <option value="AGI">AGI (AGILITY)</option>
                      <option value="INT">INT (INTELLIGENCE)</option>
                      <option value="SEN">SEN (SENSE)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-[#A3A3A3] mb-1 tracking-widest uppercase">DUE DATE</label>
                    <input 
                      type="date" 
                      value={goalDueDate}
                      onChange={(e) => setGoalDueDate(e.target.value)}
                      className="w-full bg-[#141414] border border-[#262626] rounded-sm px-3 py-2 text-white font-mono text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full border px-4 py-3 rounded-sm font-mono text-[10px] font-bold tracking-widest uppercase transition-colors flex items-center justify-center mt-4" 
                  style={{ color: themeColor, borderColor: `${themeColor}80`, backgroundColor: `${themeColor}10` }}
                >
                  <Plus className="w-4 h-4 mr-2" /> LOCK OBJECTIVE
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <>
          {/* Analytics Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-3 md:p-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#262626]"></div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[9px] md:text-[10px] font-mono text-[#A3A3A3] tracking-widest uppercase">TOTAL MISSIONS</span>
                <Target className="w-3 h-3 md:w-4 md:h-4" style={{ color: themeColor }} />
              </div>
              <div className="text-2xl md:text-3xl font-mono text-white">{totalMissions}</div>
            </div>
            <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-3 md:p-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-2 h-2 border-t-r border-[#262626]"></div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[9px] md:text-[10px] font-mono text-[#A3A3A3] tracking-widest uppercase">AVG COMPLETION</span>
                <Target className="w-3 h-3 md:w-4 md:h-4" style={{ color: themeColor }} />
              </div>
              <div className="text-2xl md:text-3xl font-mono text-white">{Math.round(avgCompletion)}<span className="text-xs text-[#A3A3A3]">%</span></div>
            </div>
            <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-3 md:p-4 relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#262626]"></div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[9px] md:text-[10px] font-mono text-[#A3A3A3] tracking-widest uppercase">SUCCESS RATE</span>
                <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-green-400" />
              </div>
              <div className="text-2xl md:text-3xl font-mono text-white">{Math.round(successRate)}<span className="text-xs text-[#A3A3A3]">%</span></div>
            </div>
            <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-3 md:p-4 relative overflow-hidden">
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#262626]"></div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[9px] md:text-[10px] font-mono text-[#A3A3A3] tracking-widest uppercase">AVG NOISE</span>
                <Activity className="w-3 h-3 md:w-4 md:h-4 text-red-400" />
              </div>
              <div className="text-2xl md:text-3xl font-mono text-white">{Math.round(avgNoise)}<span className="text-xs text-[#A3A3A3]">%</span></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Log Form */}
            <div className="lg:col-span-1 bg-[#0A0A0A] border border-[#262626] rounded-sm p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2" style={{ borderColor: themeColor }}></div>
              <h3 className="text-lg font-mono text-white mb-4 tracking-widest uppercase font-bold">LOG MISSION</h3>
              <form onSubmit={handleLogMission} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono text-[#A3A3A3] mb-1 tracking-widest uppercase">MISSION TITLE</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="E.G. STUDY REACT HOOKS"
                    className="w-full bg-[#141414] border border-[#262626] rounded-sm px-3 py-3 text-white font-mono text-xs focus:outline-none focus:border-[#404040] uppercase placeholder:text-[#555]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-[#A3A3A3] mb-1 tracking-widest uppercase">CATEGORY</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-[#141414] border border-[#262626] rounded-sm px-3 py-3 text-white font-mono text-xs focus:outline-none focus:border-[#404040] uppercase"
                  >
                    <option value="study">STUDY / LEARNING</option>
                    <option value="work">WORK / PROJECT</option>
                    <option value="fitness">FITNESS / HEALTH</option>
                    <option value="personal">PERSONAL / LIFE</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-[#A3A3A3] mb-1 tracking-widest uppercase">COMPLETION %</label>
                    <input
                      type="number"
                      value={completionRate}
                      onChange={(e) => setCompletionRate(e.target.value)}
                      className="w-full bg-[#141414] border border-[#262626] rounded-sm px-3 py-3 text-white font-mono text-xs focus:outline-none focus:border-[#404040]"
                      required
                      min="0"
                      max="100"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-[#A3A3A3] mb-1 tracking-widest uppercase">NOISE LEVEL %</label>
                    <input
                      type="number"
                      value={noiseLevel}
                      onChange={(e) => setNoiseLevel(e.target.value)}
                      className="w-full bg-[#141414] border border-[#262626] rounded-sm px-3 py-3 text-white font-mono text-xs focus:outline-none focus:border-[#404040]"
                      required
                      min="0"
                      max="100"
                      title="0% = Deep Focus, 100% = High Distraction"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-[#A3A3A3] mb-1 tracking-widest uppercase">RESULT</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setResult('success')}
                      className={cn("flex-1 py-3 rounded-sm font-mono text-[10px] font-bold tracking-widest border transition-colors", result === 'success' ? "bg-green-900/30 border-green-500 text-green-400" : "bg-[#141414] border-[#262626] text-[#A3A3A3] hover:border-[#404040]")}
                    >SUCCESS</button>
                    <button
                      type="button"
                      onClick={() => setResult('partial')}
                      className={cn("flex-1 py-3 rounded-sm font-mono text-[10px] font-bold tracking-widest border transition-colors", result === 'partial' ? "bg-yellow-900/30 border-yellow-500 text-yellow-400" : "bg-[#141414] border-[#262626] text-[#A3A3A3] hover:border-[#404040]")}
                    >PARTIAL</button>
                    <button
                      type="button"
                      onClick={() => setResult('failure')}
                      className={cn("flex-1 py-3 rounded-sm font-mono text-[10px] font-bold tracking-widest border transition-colors", result === 'failure' ? "bg-red-900/30 border-red-500 text-red-400" : "bg-[#141414] border-[#262626] text-[#A3A3A3] hover:border-[#404040]")}
                    >FAILURE</button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full border py-3 rounded-sm font-mono text-xs font-bold tracking-widest transition-colors flex items-center justify-center mt-4"
                  style={{ color: themeColor, borderColor: `${themeColor}80`, backgroundColor: `${themeColor}10` }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  LOG MISSION
                </button>
              </form>
            </div>

            {/* Chart & Logs */}
            <div className="lg:col-span-2 space-y-8">
              {/* Performance Chart */}
              <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2" style={{ borderColor: themeColor }}></div>
                <h3 className="text-lg font-mono text-white mb-4 flex items-center font-bold tracking-widest uppercase">
                  <BarChart3 className="w-5 h-5 mr-2" style={{ color: themeColor }} />
                  30-DAY TRENDS
                </h3>
                <div className="h-[250px] w-full">
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorCompletion" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={themeColor} stopOpacity={0.3}/>
                            <stop offset="95%" stopColor={themeColor} stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorNoise" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                        <XAxis dataKey="date" stroke="#A3A3A3" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="#A3A3A3" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #262626', borderRadius: '8px' }}
                          itemStyle={{ color: '#fff' }}
                        />
                        <Area type="monotone" dataKey="completion" stroke={themeColor} fillOpacity={1} fill="url(#colorCompletion)" strokeWidth={2} name="Avg Completion %" />
                        <Area type="monotone" dataKey="successRate" stroke="#22c55e" fillOpacity={1} fill="url(#colorSuccess)" strokeWidth={2} name="Success Rate %" />
                        <Area type="monotone" dataKey="noise" stroke="#ef4444" fillOpacity={1} fill="url(#colorNoise)" strokeWidth={2} name="Avg Noise %" />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-[#A3A3A3] font-mono text-sm">No data to display. Log missions to see trends.</div>
                  )}
                </div>
              </div>

              {/* Distribution Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-6 relative overflow-hidden">
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#262626]"></div>
                  <h3 className="text-[10px] font-mono text-[#A3A3A3] mb-4 tracking-widest uppercase">CATEGORY DISTRIBUTION</h3>
                  <div className="h-[200px] w-full">
                    {categoryData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #262626', borderRadius: '8px' }}
                            itemStyle={{ color: '#fff' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-[#A3A3A3] font-mono text-sm">No data</div>
                    )}
                  </div>
                  <div className="flex flex-wrap justify-center gap-4 mt-2">
                    {categoryData.map(d => (
                      <div key={d.name} className="flex items-center text-xs font-mono text-[#A3A3A3]">
                        <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: d.color }}></div>
                        {d.name} ({d.value})
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-6 relative overflow-hidden">
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#262626]"></div>
                  <h3 className="text-[10px] font-mono text-[#A3A3A3] mb-4 tracking-widest uppercase">RESULT DISTRIBUTION</h3>
                  <div className="h-[200px] w-full">
                    {resultData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                        <PieChart>
                          <Pie
                            data={resultData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {resultData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #262626', borderRadius: '8px' }}
                            itemStyle={{ color: '#fff' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-[#A3A3A3] font-mono text-sm">No data</div>
                    )}
                  </div>
                  <div className="flex flex-wrap justify-center gap-4 mt-2">
                    {resultData.map(d => (
                      <div key={d.name} className="flex items-center text-xs font-mono text-[#A3A3A3]">
                        <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: d.color }}></div>
                        {d.name} ({d.value})
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Logs */}
              <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2" style={{ borderColor: themeColor }}></div>
                <h3 className="text-lg font-mono text-white mb-4 font-bold tracking-widest uppercase">RECENT MISSIONS</h3>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {missionLogs?.length === 0 ? (
                    <div className="text-center text-[#A3A3A3] font-mono text-sm py-4">No recent missions.</div>
                  ) : (
                    missionLogs?.map((log) => (
                      <div key={log.id} className="bg-[#141414] border border-[#262626] rounded-sm p-3 flex justify-between items-center">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={cn(
                              "text-[10px] font-bold px-2 py-0.5 rounded-sm tracking-widest",
                              log.result === 'success' ? "bg-green-900/30 text-green-400" :
                              log.result === 'failure' ? "bg-red-900/30 text-red-400" :
                              "bg-yellow-900/30 text-yellow-400"
                            )}>
                              {log.result.toUpperCase()}
                            </span>
                            <span className="text-xs font-mono text-white truncate max-w-[150px] sm:max-w-[300px] uppercase tracking-wider">{log.title}</span>
                          </div>
                          <div className="text-[10px] font-mono text-[#A3A3A3] tracking-widest uppercase mt-2">
                            {log.completionRate}% DONE • {log.noiseLevel}% NOISE • {log.category.toUpperCase()} • {format(new Date(log.date), 'MMM dd, HH:mm')}
                          </div>
                        </div>
                        <button
                          onClick={() => log.id && handleDelete(log.id)}
                          className="text-[#A3A3A3] hover:text-red-400 transition-colors p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

