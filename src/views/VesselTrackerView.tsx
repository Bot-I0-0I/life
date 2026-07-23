import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, addXp, logSystemEvent } from '../db/db';
import { cn, getRank } from '../lib/utils';
import { Activity, Scale, HeartPulse, Moon, Sparkles, TrendingUp, TrendingDown, Target, Save, Trash2, Calendar, Shield, Award, AlertCircle } from 'lucide-react';
import { format, subDays, parseISO } from 'date-fns';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from 'recharts';
import { GrowthSection } from '../components/GrowthSection';

export function VesselTrackerView() {
  const userStats = useLiveQuery(() => db.userStats.get(1));
  const vesselLogs = useLiveQuery(() => db.vesselLogs.orderBy('date').toArray());
  const today = React.useMemo(() => format(new Date(), 'yyyy-MM-dd'), []);

  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [stressLevel, setStressLevel] = useState<string>('3');
  const [sleepHours, setSleepHours] = useState('');
  const [activeTab, setActiveTab] = useState<'metrics' | 'growth' | 'history'>('metrics');

  if (!userStats) return <div className="p-6 font-mono text-white opacity-80 uppercase">Initializing Vessel Tracker...</div>;

  const level = Math.floor((userStats.xp || 0) / 1000) + 1;
  const rankColor = getRank(level).color;
  const themeColor = userStats?.selectedColor || rankColor;

  const latestWeightLog = vesselLogs?.slice().reverse().find(log => log.weight !== undefined);
  const currentWeight = latestWeightLog?.weight || 70;
  const calcHeight = userStats.height || 175;
  const calcAge = userStats.age || 25;
  const calcGender = userStats.gender || 'male';

  // Calculate BMR & BMI
  let bmr = 0;
  if (calcGender === 'male') {
    bmr = (10 * currentWeight) + (6.25 * calcHeight) - (5 * calcAge) + 5;
  } else if (calcGender === 'female') {
    bmr = (10 * currentWeight) + (6.25 * calcHeight) - (5 * calcAge) - 161;
  } else {
    bmr = (10 * currentWeight) + (6.25 * calcHeight) - (5 * calcAge) - 78;
  }

  const heightM = calcHeight / 100;
  const bmi = currentWeight / (heightM * heightM);

  let bmiCategory = 'Optimal';
  if (bmi < 18.5) bmiCategory = 'Underweight';
  else if (bmi < 25) bmiCategory = 'Optimal';
  else if (bmi < 30) bmiCategory = 'Overweight';
  else bmiCategory = 'Obese';

  let activityMultiplier = 1.2;
  switch (userStats.activityLevel) {
    case 'light': activityMultiplier = 1.375; break;
    case 'moderate': activityMultiplier = 1.55; break;
    case 'active': activityMultiplier = 1.725; break;
    case 'very_active': activityMultiplier = 1.9; break;
  }

  const tdee = bmr * activityMultiplier;

  // Chart data formatting
  const chartData = (vesselLogs || []).map(log => ({
    date: log.date ? format(parseISO(log.date), 'MMM d') : '',
    fullDate: log.date,
    weight: log.weight,
    bodyFat: log.bodyFat,
    sleepHours: log.sleepHours,
    stressLevel: log.stressLevel
  })).filter(item => item.weight !== undefined || item.sleepHours !== undefined);

  const handleLogVessel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight) return;

    const weightVal = parseFloat(weight);
    const bodyFatVal = bodyFat ? parseFloat(bodyFat) : undefined;
    const stressVal = stressLevel ? parseInt(stressLevel) as 1|2|3|4|5 : undefined;

    const existing = await db.vesselLogs.where('date').equals(today).first();

    const logData = {
      weight: weightVal,
      bodyFat: bodyFatVal,
      stressLevel: stressVal
    };

    if (existing) {
      await db.vesselLogs.update(existing.id!, logData);
    } else {
      await db.vesselLogs.add({
        date: today,
        ...logData
      });
    }

    await addXp(150, 'VIT');
    await logSystemEvent('VESSEL', 'SUCCESS', `Logged vessel metrics: ${weightVal} kg`, `BodyFat: ${bodyFatVal || 'N/A'}%`);

    setWeight('');
    setBodyFat('');
  };

  const handleLogSleep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sleepHours) return;

    const hours = parseFloat(sleepHours);
    const existing = await db.vesselLogs.where('date').equals(today).first();

    if (existing) {
      await db.vesselLogs.update(existing.id!, { sleepHours: hours });
    } else {
      await db.vesselLogs.add({ date: today, sleepHours: hours });
    }

    await addXp(100, 'SEN');
    await logSystemEvent('VESSEL', 'SUCCESS', `Logged sleep: ${hours} hours`);
    setSleepHours('');
  };

  const handleDeleteLog = async (id: number) => {
    await db.vesselLogs.delete(id);
    await logSystemEvent('VESSEL', 'WARN', `Deleted vessel log ID: ${id}`);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* View Header */}
      <header className="border-b border-[#262626] pb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-mono font-bold tracking-tight text-white flex items-center uppercase" style={{ color: themeColor }}>
              <Activity className="w-8 h-8 mr-3" />
              VESSEL & BIOMETRICS TRACKER
            </h2>
            <p className="text-[#A3A3A3] text-sm mt-1 font-mono uppercase tracking-widest">
              Monitor physical body state, body fat, sleep recovery, and biological progression.
            </p>
          </div>

          <div className="flex bg-[#0A0A0A] p-1 border border-[#262626] rounded-sm">
            <button
              onClick={() => setActiveTab('metrics')}
              className={cn(
                "px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-sm transition-all",
                activeTab === 'metrics' ? "bg-[#141414] text-white" : "text-[#A3A3A3] hover:text-white"
              )}
              style={activeTab === 'metrics' ? { color: themeColor } : {}}
            >
              BIOMETRICS & LOGS
            </button>
            <button
              onClick={() => setActiveTab('growth')}
              className={cn(
                "px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-sm transition-all",
                activeTab === 'growth' ? "bg-[#141414] text-white" : "text-[#A3A3A3] hover:text-white"
              )}
              style={activeTab === 'growth' ? { color: themeColor } : {}}
            >
              GROWTH & TRANSFORM
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={cn(
                "px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-sm transition-all",
                activeTab === 'history' ? "bg-[#141414] text-white" : "text-[#A3A3A3] hover:text-white"
              )}
              style={activeTab === 'history' ? { color: themeColor } : {}}
            >
              HISTORY & AUDIT
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      {activeTab === 'metrics' && (
        <div className="space-y-8">
          {/* Top Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-5 relative overflow-hidden">
              <div className="text-[10px] font-mono text-[#A3A3A3] tracking-widest uppercase mb-1 flex items-center">
                <Scale className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
                CURRENT WEIGHT
              </div>
              <div className="text-3xl font-mono font-bold text-white">
                {currentWeight} <span className="text-sm font-normal text-[#A3A3A3]">KG</span>
              </div>
              <div className="text-[10px] font-mono text-cyan-400 mt-2 uppercase tracking-wider">
                {latestWeightLog ? `LOGGED: ${latestWeightLog.date}` : 'NO LOG TODAY'}
              </div>
            </div>

            <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-5 relative overflow-hidden">
              <div className="text-[10px] font-mono text-[#A3A3A3] tracking-widest uppercase mb-1 flex items-center">
                <HeartPulse className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                BMI & STATUS
              </div>
              <div className="text-3xl font-mono font-bold text-white">
                {bmi.toFixed(1)}
              </div>
              <div className={cn(
                "text-[10px] font-mono mt-2 uppercase tracking-wider font-bold",
                bmiCategory === 'Optimal' ? "text-emerald-400" : "text-amber-400"
              )}>
                {bmiCategory.toUpperCase()} STATUS
              </div>
            </div>

            <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-5 relative overflow-hidden">
              <div className="text-[10px] font-mono text-[#A3A3A3] tracking-widest uppercase mb-1 flex items-center">
                <Activity className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
                BASAL BMR
              </div>
              <div className="text-3xl font-mono font-bold text-amber-400">
                {Math.round(bmr)} <span className="text-sm font-normal text-[#A3A3A3]">KCAL</span>
              </div>
              <div className="text-[10px] font-mono text-[#A3A3A3] mt-2 uppercase tracking-wider">
                TDEE: {Math.round(tdee)} KCAL
              </div>
            </div>

            <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-5 relative overflow-hidden">
              <div className="text-[10px] font-mono text-[#A3A3A3] tracking-widest uppercase mb-1 flex items-center">
                <Moon className="w-3.5 h-3.5 mr-1.5 text-purple-400" />
                SLEEP & RECOVERY
              </div>
              <div className="text-3xl font-mono font-bold text-purple-300">
                {vesselLogs?.slice().reverse().find(l => l.sleepHours !== undefined)?.sleepHours || 0} <span className="text-sm font-normal text-[#A3A3A3]">HRS</span>
              </div>
              <div className="text-[10px] font-mono text-purple-400 mt-2 uppercase tracking-wider">
                REGENERATION MATRIX
              </div>
            </div>
          </div>

          {/* Logging Forms Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Weight & Body Metrics Form */}
            <form onSubmit={handleLogVessel} className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-6 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2" style={{ borderColor: themeColor }}></div>
              <h3 className="text-lg font-mono text-white font-bold tracking-widest uppercase border-b border-[#262626] pb-4 flex items-center">
                <Scale className="w-5 h-5 mr-2" style={{ color: themeColor }} />
                LOG TODAY'S VESSEL METRICS
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-[#A3A3A3] mb-1 tracking-widest uppercase">BODY WEIGHT (KG)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="e.g. 74.5"
                    className="w-full bg-[#141414] border border-[#262626] rounded-sm px-4 py-3 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-[#A3A3A3] mb-1 tracking-widest uppercase">BODY FAT % (OPTIONAL)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={bodyFat}
                    onChange={(e) => setBodyFat(e.target.value)}
                    placeholder="e.g. 14.2"
                    className="w-full bg-[#141414] border border-[#262626] rounded-sm px-4 py-3 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-mono text-[#A3A3A3] mb-1 tracking-widest uppercase">STRESS / FATIGUE INDEX (1-5)</label>
                  <select
                    value={stressLevel}
                    onChange={(e) => setStressLevel(e.target.value)}
                    className="w-full bg-[#141414] border border-[#262626] rounded-sm px-4 py-3 text-white font-mono text-xs focus:outline-none uppercase"
                  >
                    <option value="1">1 - RECOVERY OPTIMAL (ZERO FATIGUE)</option>
                    <option value="2">2 - LIGHT FATIGUE</option>
                    <option value="3">3 - MODERATE STRESS</option>
                    <option value="4">4 - HIGH STRESS / HEAVY LOAD</option>
                    <option value="5">5 - SYSTEM CRITICAL EXHAUSTION</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#141414] border border-[#262626] hover:bg-[#1A1A1A] text-white px-4 py-3 rounded-sm font-mono text-xs font-bold tracking-widest uppercase transition-colors flex items-center justify-center"
              >
                <Save className="w-4 h-4 mr-2 text-cyan-400" /> RECORD VESSEL METRICS (+150 XP)
              </button>
            </form>

            {/* Sleep Log Form */}
            <form onSubmit={handleLogSleep} className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-6 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2" style={{ borderColor: themeColor }}></div>
              <h3 className="text-lg font-mono text-white font-bold tracking-widest uppercase border-b border-[#262626] pb-4 flex items-center">
                <Moon className="w-5 h-5 mr-2 text-purple-400" />
                LOG NIGHT RECOVERY & SLEEP
              </h3>

              <div>
                <label className="block text-[10px] font-mono text-[#A3A3A3] mb-1 tracking-widest uppercase">SLEEP DURATION (HOURS)</label>
                <input
                  type="number"
                  step="0.5"
                  value={sleepHours}
                  onChange={(e) => setSleepHours(e.target.value)}
                  placeholder="e.g. 8.0"
                  className="w-full bg-[#141414] border border-[#262626] rounded-sm px-4 py-3 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <p className="text-[10px] font-mono text-[#A3A3A3] uppercase tracking-wider leading-relaxed">
                Sleep regulates human growth hormone release, muscle tissue repair, and neural capacity recovery. Aim for 7.5 - 9.0 hours per night.
              </p>

              <button
                type="submit"
                className="w-full bg-[#141414] border border-[#262626] hover:bg-[#1A1A1A] text-white px-4 py-3 rounded-sm font-mono text-xs font-bold tracking-widest uppercase transition-colors flex items-center justify-center"
              >
                <Save className="w-4 h-4 mr-2 text-purple-400" /> LOG SLEEP RECOVERY (+100 XP)
              </button>
            </form>
          </div>

          {/* Weight Progression Chart */}
          <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-6 relative overflow-hidden">
            <h3 className="text-sm font-mono text-white font-bold tracking-widest uppercase mb-4 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-cyan-400" />
              WEIGHT PROGRESSION OVER TIME (KG)
            </h3>

            {chartData.length > 0 ? (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#00F0FF" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                    <XAxis dataKey="date" stroke="#A3A3A3" fontSize={10} fontFamily="monospace" />
                    <YAxis stroke="#A3A3A3" fontSize={10} fontFamily="monospace" domain={['dataMin - 2', 'dataMax + 2']} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0A0A0A', borderColor: '#262626', color: '#FFF', fontFamily: 'monospace', fontSize: '11px' }}
                    />
                    <Area type="monotone" dataKey="weight" stroke="#00F0FF" strokeWidth={2} fillOpacity={1} fill="url(#weightGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="p-8 text-center border border-dashed border-[#262626] text-[#A3A3A3] font-mono text-xs uppercase tracking-widest">
                NO VESSEL WEIGHT DATA LOGGED YET. USE THE FORM ABOVE TO LOG YOUR FIRST ENTRY.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Growth Section Tab */}
      {activeTab === 'growth' && (
        <div>
          <GrowthSection />
        </div>
      )}

      {/* History & Audit Tab */}
      {activeTab === 'history' && (
        <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-6 space-y-4">
          <h3 className="text-lg font-mono text-white font-bold tracking-widest uppercase border-b border-[#262626] pb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2" style={{ color: themeColor }} />
            HISTORICAL VESSEL AUDIT LOGS
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-[#262626] text-[#A3A3A3] uppercase text-[10px]">
                  <th className="py-3 px-4">DATE</th>
                  <th className="py-3 px-4">WEIGHT (KG)</th>
                  <th className="py-3 px-4">BODY FAT %</th>
                  <th className="py-3 px-4">SLEEP (HRS)</th>
                  <th className="py-3 px-4">STRESS INDEX</th>
                  <th className="py-3 px-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]">
                {(vesselLogs || []).slice().reverse().map((log) => (
                  <tr key={log.id} className="hover:bg-[#141414] transition-colors">
                    <td className="py-3 px-4 text-white font-bold">{log.date}</td>
                    <td className="py-3 px-4 text-cyan-400 font-bold">{log.weight ? `${log.weight} kg` : '-'}</td>
                    <td className="py-3 px-4 text-emerald-400">{log.bodyFat ? `${log.bodyFat}%` : '-'}</td>
                    <td className="py-3 px-4 text-purple-400">{log.sleepHours ? `${log.sleepHours} hrs` : '-'}</td>
                    <td className="py-3 px-4 text-amber-400">{log.stressLevel ? `${log.stressLevel} / 5` : '-'}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteLog(log.id!)}
                        className="text-red-400 hover:text-red-300 transition-colors p-1"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
