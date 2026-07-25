import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, addXp, updateStreak, TimetableBlock, logSystemEvent } from '../db/db';
import { cn, getRank } from '../lib/utils';
import { 
  Clock, Plus, Trash2, CheckCircle, Circle, Sparkles, Calendar, 
  Gamepad2, Palette, Dumbbell, BookOpen, Briefcase, Heart, AlertCircle,
  ChevronRight, Tag, Zap, Check, Edit3, ShieldAlert, Flame
} from 'lucide-react';
import { toast } from 'sonner';

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string; icon: any }> = {
  hobby: { bg: 'bg-cyan-950/40', text: 'text-cyan-400', border: 'border-cyan-500/40', icon: Palette },
  workout: { bg: 'bg-red-950/40', text: 'text-red-400', border: 'border-red-500/40', icon: Dumbbell },
  study: { bg: 'bg-purple-950/40', text: 'text-purple-400', border: 'border-purple-500/40', icon: BookOpen },
  work: { bg: 'bg-blue-950/40', text: 'text-blue-400', border: 'border-blue-500/40', icon: Briefcase },
  gaming: { bg: 'bg-amber-950/40', text: 'text-amber-400', border: 'border-amber-500/40', icon: Gamepad2 },
  rest: { bg: 'bg-emerald-950/40', text: 'text-emerald-400', border: 'border-emerald-500/40', icon: Heart },
  personal: { bg: 'bg-indigo-950/40', text: 'text-indigo-400', border: 'border-indigo-500/40', icon: Clock },
};

const WEEKDAYS = [
  { label: 'SUN', value: 0 },
  { label: 'MON', value: 1 },
  { label: 'TUE', value: 2 },
  { label: 'WED', value: 3 },
  { label: 'THU', value: 4 },
  { label: 'FRI', value: 5 },
  { label: 'SAT', value: 6 },
];

const PRESETS = [
  { title: 'Guitar / Music Hobby', category: 'hobby', startTime: '15:00', endTime: '16:00', days: [0,1,2,3,4,5,6], notes: 'Chord practice & song learning' },
  { title: 'Deep Coding & App Build', category: 'study', startTime: '20:00', endTime: '22:00', days: [1,2,3,4,5], notes: 'Uninterrupted flow state development' },
  { title: 'Night Book Reading', category: 'hobby', startTime: '21:30', endTime: '22:30', days: [0,1,2,3,4,5,6], notes: 'Fiction or technical literature' },
  { title: 'Digital Art / Sketching', category: 'hobby', startTime: '16:30', endTime: '17:30', days: [1,3,5], notes: 'Character design & study' },
  { title: 'Esports & Gaming Session', category: 'gaming', startTime: '22:00', endTime: '23:30', days: [0,5,6], notes: 'Competitive squad ranked play' },
  { title: 'Morning Workout & Stretch', category: 'workout', startTime: '07:00', endTime: '08:00', days: [1,2,3,4,5,6,0], notes: 'Dungeon physical training' }
];

export function TimetableScheduleView() {
  const userStats = useLiveQuery(() => db.userStats.get(1));
  const timetableBlocks = useLiveQuery(() => db.timetable.toArray()) || [];

  const level = Math.floor((userStats?.xp || 0) / 1000) + 1;
  const { color: rankColor } = getRank(level);
  const themeColor = userStats?.selectedColor || rankColor;

  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDay());
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Form State for Add / Edit
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBlock, setEditingBlock] = useState<TimetableBlock | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'hobby' | 'workout' | 'study' | 'work' | 'personal' | 'gaming' | 'rest'>('hobby');
  const [newStartTime, setNewStartTime] = useState('14:00');
  const [newEndTime, setNewEndTime] = useState('15:00');
  const [selectedDays, setSelectedDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [newNotes, setNewNotes] = useState('');

  // Active Focus Session State
  const [focusBlock, setFocusBlock] = useState<TimetableBlock | null>(null);
  const [focusRemainingSeconds, setFocusRemainingSeconds] = useState<number>(0);
  const [isFocusRunning, setIsFocusRunning] = useState(false);

  // Live Current Time Ticker
  const [currentTimeStr, setCurrentTimeStr] = useState('');
  const [currentMinuteOfDay, setCurrentMinuteOfDay] = useState<number>(0);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hrs = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      setCurrentTimeStr(`${hrs}:${mins}`);
      setCurrentMinuteOfDay(now.getHours() * 60 + now.getMinutes());
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  // Timer countdown hook for focus session
  useEffect(() => {
    let interval: any = null;
    if (isFocusRunning && focusRemainingSeconds > 0) {
      interval = setInterval(() => {
        setFocusRemainingSeconds(prev => prev - 1);
      }, 1000);
    } else if (isFocusRunning && focusRemainingSeconds <= 0 && focusBlock) {
      setIsFocusRunning(false);
      handleToggleComplete(focusBlock, true);
      toast.success(`🎉 FOCUS SESSION COMPLETE: "${focusBlock.title}" +50 XP AWARDED!`);
    }
    return () => clearInterval(interval);
  }, [isFocusRunning, focusRemainingSeconds, focusBlock]);

  // Filter blocks by day and category
  const filteredBlocks = timetableBlocks
    .filter(block => {
      const matchesDay = block.daysOfWeek.includes(selectedDay);
      const matchesCat = filterCategory === 'all' || block.category === filterCategory;
      return matchesDay && matchesCat;
    })
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Calculate day completion stats
  const totalDayBlocks = filteredBlocks.length;
  const completedDayBlocks = filteredBlocks.filter(b => b.completedToday).length;
  const dayCompletionPercent = totalDayBlocks > 0 ? Math.round((completedDayBlocks / totalDayBlocks) * 100) : 0;

  // Determine current active block
  const currentActiveBlock = timetableBlocks.find(block => {
    if (!block.daysOfWeek.includes(selectedDay)) return false;
    return currentTimeStr >= block.startTime && currentTimeStr <= block.endTime;
  });

  const handleOpenAddModal = () => {
    setEditingBlock(null);
    setNewTitle('');
    setNewCategory('hobby');
    setNewStartTime('14:00');
    setNewEndTime('15:00');
    setSelectedDays([0, 1, 2, 3, 4, 5, 6]);
    setNewNotes('');
    setShowAddModal(true);
  };

  const handleOpenEditModal = (block: TimetableBlock) => {
    setEditingBlock(block);
    setNewTitle(block.title);
    setNewCategory(block.category);
    setNewStartTime(block.startTime);
    setNewEndTime(block.endTime);
    setSelectedDays(block.daysOfWeek);
    setNewNotes(block.notes || '');
    setShowAddModal(true);
  };

  const handleSaveBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error('Please enter a title for the time block');
      return;
    }

    try {
      if (editingBlock && editingBlock.id) {
        await db.timetable.update(editingBlock.id, {
          title: newTitle.trim(),
          category: newCategory,
          startTime: newStartTime,
          endTime: newEndTime,
          daysOfWeek: selectedDays,
          notes: newNotes.trim() || undefined,
        });
        toast.success(`Updated "${newTitle}"!`);
      } else {
        await db.timetable.add({
          title: newTitle.trim(),
          category: newCategory,
          startTime: newStartTime,
          endTime: newEndTime,
          daysOfWeek: selectedDays,
          notes: newNotes.trim() || undefined,
          completedToday: false
        });
        toast.success(`Timetable entry "${newTitle}" registered!`);
        logSystemEvent('QUEST', 'SUCCESS', `Added timetable slot: ${newTitle} (${newStartTime}-${newEndTime})`);
      }
      setNewTitle('');
      setNewNotes('');
      setShowAddModal(false);
      setEditingBlock(null);
    } catch (err) {
      toast.error('Failed to save timetable block');
    }
  };

  const handleDeleteBlock = async (id: number) => {
    try {
      await db.timetable.delete(id);
      toast.info('Time block removed');
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const handleToggleComplete = async (block: TimetableBlock, forceState?: boolean) => {
    if (!block.id) return;
    const nextState = forceState !== undefined ? forceState : !block.completedToday;
    await db.timetable.update(block.id, { completedToday: nextState });

    if (nextState) {
      await addXp(50, block.category === 'workout' ? 'STR' : block.category === 'study' ? 'INT' : 'AGI');
      toast.success(`Completed "${block.title}"! +50 XP awarded!`, {
        style: {
          background: '#0A0A0A',
          border: `1px solid ${themeColor}`,
          color: '#FFFFFF'
        }
      });
    }
  };

  const handleStartFocusTimer = (block: TimetableBlock) => {
    const [startH, startM] = block.startTime.split(':').map(Number);
    const [endH, endM] = block.endTime.split(':').map(Number);
    let durMins = (endH * 60 + endM) - (startH * 60 + startM);
    if (durMins <= 0) durMins = 30; // fallback default
    setFocusBlock(block);
    setFocusRemainingSeconds(durMins * 60);
    setIsFocusRunning(true);
  };

  const handleApplyPreset = async (preset: typeof PRESETS[0]) => {
    try {
      await db.timetable.add({
        title: preset.title,
        category: preset.category as any,
        startTime: preset.startTime,
        endTime: preset.endTime,
        daysOfWeek: preset.days,
        notes: preset.notes,
        completedToday: false
      });
      toast.success(`Preset "${preset.title}" added to your timetable!`);
    } catch (err) {
      toast.error('Failed to apply preset');
    }
  };

  const toggleDaySelection = (dayVal: number) => {
    if (selectedDays.includes(dayVal)) {
      if (selectedDays.length === 1) return;
      setSelectedDays(selectedDays.filter(d => d !== dayVal));
    } else {
      setSelectedDays([...selectedDays, dayVal].sort());
    }
  };

  return (
    <div className="space-[#141414] max-w-7xl mx-auto space-y-6 pb-20">
      {/* Header Banner */}
      <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-6 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2" style={{ borderColor: themeColor }}></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2" style={{ borderColor: themeColor }}></div>

        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#A3A3A3] tracking-widest uppercase mb-1">
            <Clock className="w-4 h-4" style={{ color: themeColor }} />
            <span>24-HOUR ROUTINE & HOBBY TIMETABLE</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-mono text-white font-black tracking-wider uppercase">
            DAILY SCHEDULE MATRIX
          </h1>
          <p className="text-xs font-mono text-[#888] mt-1 max-w-xl">
            Design daily time-blocks for hobbies, deep work, workouts, and rest. Track execution seamlessly.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {currentActiveBlock ? (
            <div className="bg-emerald-950/40 border border-emerald-500/50 px-4 py-2 rounded-sm flex items-center gap-3">
              <Zap className="w-4 h-4 text-emerald-400 animate-pulse" />
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block">NOW ACTIVE ({currentTimeStr})</span>
                <span className="text-xs font-mono font-bold text-white uppercase">{currentActiveBlock.title}</span>
              </div>
            </div>
          ) : (
            <div className="bg-[#141414] border border-[#262626] px-3 py-2 rounded-sm text-right">
              <span className="text-[10px] font-mono text-[#A3A3A3] block uppercase tracking-widest">SYSTEM TIME</span>
              <span className="text-sm font-mono font-bold text-white">{currentTimeStr || '12:00'}</span>
            </div>
          )}

          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-black rounded-sm flex items-center gap-2 transition-transform active:scale-95 shadow-lg"
            style={{ backgroundColor: themeColor }}
          >
            <Plus className="w-4 h-4" />
            ADD TIME BLOCK
          </button>
        </div>
      </div>

      {/* Everyday Execution Streak Card */}
      <div className="bg-[#0A0A0A] border border-amber-500/40 p-4 sm:p-5 rounded-sm relative overflow-hidden bg-gradient-to-r from-amber-950/20 via-[#0A0A0A] to-[#0A0A0A] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-amber-950/50 border border-amber-500/50 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Flame className="w-7 h-7 text-amber-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400 tracking-widest uppercase">
                EVERYDAY EXECUTION STREAK
              </span>
              <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2 py-0.5 text-[9px] font-mono font-bold rounded">
                ACTIVE
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl sm:text-3xl font-mono font-black text-white">
                {userStats?.currentStreak || 0}
              </span>
              <span className="text-xs font-mono text-[#A3A3A3] uppercase font-bold">DAYS IN A ROW</span>
              <span className="text-[10px] font-mono text-[#666] ml-2">
                (BEST: {userStats?.longestStreak || 0} DAYS)
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={async () => {
            const today = new Date().toISOString().split('T')[0];
            if (userStats?.lastCheckInDate === today) {
              toast.info("🔥 Already checked in today! Streak extended.");
              return;
            }
            await addXp(50, 'WIL');
            await updateStreak();
            toast.success("🔥 DAILY CHECK-IN RECORDED! +50 XP & Streak Extended!");
          }}
          className={cn(
            "w-full sm:w-auto px-5 py-2.5 rounded-sm font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md touch-target",
            userStats?.lastCheckInDate === new Date().toISOString().split('T')[0]
              ? "bg-amber-950/40 text-amber-400 border border-amber-500/40 cursor-default"
              : "bg-amber-500 hover:bg-amber-400 text-black font-black active:scale-95"
          )}
        >
          <Flame className="w-4 h-4" />
          {userStats?.lastCheckInDate === new Date().toISOString().split('T')[0]
            ? 'CHECKED IN TODAY ✓'
            : 'CHECK IN FOR TODAY (+50 XP)'}
        </button>
      </div>

      {/* 24-Hour Visual Timeline Progress Gauge */}
      <div className="bg-[#0A0A0A] border border-[#262626] p-4 rounded-sm space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-[#A3A3A3] uppercase tracking-wider font-bold flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-cyan-400" /> 24-HOUR DAY TIMELINE PROGRESS
          </span>
          <span className="text-cyan-400 font-bold uppercase">
            {completedDayBlocks} / {totalDayBlocks} BLOCKS COMPLETED ({dayCompletionPercent}%)
          </span>
        </div>

        {/* Visual 24-Hour Timeline Bar */}
        <div className="relative w-full h-8 bg-[#121212] border border-[#262626] rounded-sm overflow-hidden flex items-center">
          {/* Scheduled block markers along 24h timeline */}
          {filteredBlocks.map((b) => {
            const [sh, sm] = b.startTime.split(':').map(Number);
            const [eh, em] = b.endTime.split(':').map(Number);
            const startPct = ((sh * 60 + sm) / 1440) * 100;
            const endPct = ((eh * 60 + em) / 1440) * 100;
            const widthPct = Math.max(1.5, endPct - startPct);

            return (
              <div
                key={b.id}
                title={`${b.title} (${b.startTime}-${b.endTime})`}
                className={cn(
                  "absolute h-full border-r border-black/50 transition-all cursor-pointer opacity-80 hover:opacity-100",
                  b.completedToday ? "bg-emerald-500/80" : "bg-cyan-500/60"
                )}
                style={{ left: `${startPct}%`, width: `${widthPct}%` }}
                onClick={() => handleOpenEditModal(b)}
              />
            );
          })}

          {/* Current Time Needle Indicator */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-red-500 z-20 shadow-[0_0_8px_#EF4444]"
            style={{ left: `${(currentMinuteOfDay / 1440) * 100}%` }}
            title={`Current Time: ${currentTimeStr}`}
          >
            <div className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
          </div>
        </div>

        <div className="flex justify-between text-[9px] font-mono text-[#666] uppercase">
          <span>00:00 (MIDNIGHT)</span>
          <span>06:00 (MORNING)</span>
          <span>12:00 (NOON)</span>
          <span>18:00 (EVENING)</span>
          <span>23:59 (NIGHT)</span>
        </div>
      </div>

      {/* Quick Presets Carousel */}
      <div className="bg-[#0A0A0A] border border-[#262626] p-4 rounded-sm">
        <span className="text-[10px] font-mono tracking-widest text-[#A3A3A3] uppercase block mb-3 flex items-center">
          <Sparkles className="w-3 h-3 mr-1 text-yellow-400" />
          QUICK HOBBY & ROUTINE PRESETS (1-CLICK ADD)
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {PRESETS.map((preset, idx) => {
            const CatIcon = CATEGORY_COLORS[preset.category]?.icon || Clock;
            return (
              <button
                key={idx}
                onClick={() => handleApplyPreset(preset)}
                className="bg-[#141414] hover:bg-[#1f1f1f] border border-[#262626] hover:border-[#444] p-2.5 rounded-sm text-left transition-all group relative overflow-hidden"
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-[#888] mb-1">
                  <span className="flex items-center gap-1">
                    <CatIcon className="w-3 h-3" style={{ color: themeColor }} />
                    {preset.startTime}-{preset.endTime}
                  </span>
                  <Plus className="w-3 h-3 text-[#555] group-hover:text-white transition-colors" />
                </div>
                <span className="text-xs font-mono text-white font-bold block truncate group-hover:text-[#00F0FF] transition-colors uppercase">
                  {preset.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Weekday Selector, Actions & Filters */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-[#0A0A0A] border border-[#262626] p-3 rounded-sm">
        {/* Days of Week */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0">
          {WEEKDAYS.map(day => {
            const isToday = new Date().getDay() === day.value;
            const isSelected = selectedDay === day.value;
            return (
              <button
                key={day.value}
                onClick={() => setSelectedDay(day.value)}
                className={cn(
                  "px-3 py-1.5 font-mono text-xs rounded-sm transition-all flex items-center gap-1 uppercase tracking-wider font-bold touch-target",
                  isSelected 
                    ? "bg-[#222] text-white border-b-2" 
                    : "bg-[#121212] text-[#888] hover:text-white hover:bg-[#1a1a1a]"
                )}
                style={isSelected ? { borderBottomColor: themeColor, color: themeColor } : {}}
              >
                {day.label}
                {isToday && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
              </button>
            );
          })}
        </div>

        {/* Quick Day Actions & Category Filter */}
        <div className="flex flex-wrap items-center gap-2">
          {filteredBlocks.length > 0 && (
            <div className="flex items-center gap-1">
              <button
                onClick={async () => {
                  for (const b of filteredBlocks) {
                    if (b.id) await db.timetable.update(b.id, { completedToday: true });
                  }
                  toast.success(`marked all ${filteredBlocks.length} blocks completed!`);
                }}
                className="px-2.5 py-1.5 bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono font-bold uppercase rounded-sm transition-all"
                title="Mark all blocks for today completed"
              >
                ✓ COMPLETE ALL
              </button>
              <button
                onClick={async () => {
                  for (const b of filteredBlocks) {
                    if (b.id) await db.timetable.update(b.id, { completedToday: false });
                  }
                  toast.info("Reset today's execution progress");
                }}
                className="px-2.5 py-1.5 bg-[#141414] hover:bg-[#1a1a1a] border border-[#262626] text-[#888] hover:text-white text-[10px] font-mono font-bold uppercase rounded-sm transition-all"
                title="Reset completion state for today"
              >
                ↺ RESET
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Tag className="w-3.5 h-3.5 text-[#888]" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-[#141414] border border-[#262626] text-xs font-mono text-[#CCC] px-3 py-1.5 rounded-sm focus:outline-none focus:border-[#555] uppercase"
            >
              <option value="all">ALL CATEGORIES</option>
              <option value="hobby">🎨 HOBBY & CRAFTS</option>
              <option value="workout">🏋️ WORKOUT</option>
              <option value="study">📚 STUDY & SKILL</option>
              <option value="work">💼 WORK</option>
              <option value="gaming">🎮 GAMING</option>
              <option value="rest">🧘 REST & WIND DOWN</option>
              <option value="personal">👤 PERSONAL</option>
            </select>
          </div>
        </div>
      </div>

      {/* Timetable Slots Grid */}
      <div className="space-y-3">
        {filteredBlocks.length === 0 ? (
          <div className="bg-[#0A0A0A] border border-dashed border-[#262626] rounded-sm p-12 text-center space-y-3">
            <Clock className="w-8 h-8 text-[#444] mx-auto" />
            <div className="font-mono text-sm text-[#A3A3A3] uppercase tracking-wider">
              NO TIMETABLE BLOCKS SET FOR {WEEKDAYS.find(d => d.value === selectedDay)?.label}
            </div>
            <p className="text-xs font-mono text-[#666] max-w-md mx-auto">
              Add your custom daily activities from 2x:xx to 3x:xx (e.g., Hobby practice, Gaming, Study, Workout) or click a quick preset above.
            </p>
            <button
              onClick={handleOpenAddModal}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-[#141414] hover:bg-[#1a1a1a] border border-[#333] text-xs font-mono text-white rounded-sm uppercase tracking-wider"
            >
              <Plus className="w-3.5 h-3.5" /> CREATE FIRST TIME BLOCK
            </button>
          </div>
        ) : (
          filteredBlocks.map(block => {
            const catInfo = CATEGORY_COLORS[block.category] || CATEGORY_COLORS.personal;
            const CatIcon = catInfo.icon;
            const isActiveNow = currentTimeStr >= block.startTime && currentTimeStr <= block.endTime;

            return (
              <div
                key={block.id}
                className={cn(
                  "bg-[#0A0A0A] border rounded-sm p-4 transition-all relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4",
                  isActiveNow ? "border-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.15)]" : "border-[#262626] hover:border-[#333]"
                )}
              >
                {isActiveNow && (
                  <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#00F0FF] animate-pulse"></div>
                )}

                <div className="flex items-center gap-4 flex-1">
                  {/* Completion Button */}
                  <button
                    onClick={() => handleToggleComplete(block)}
                    className={cn(
                      "p-1.5 rounded-sm border transition-colors flex-shrink-0",
                      block.completedToday 
                        ? "bg-emerald-950/60 border-emerald-500 text-emerald-400" 
                        : "bg-[#141414] border-[#333] text-[#666] hover:text-white"
                    )}
                  >
                    {block.completedToday ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                  </button>

                  {/* Time Badge */}
                  <div className="bg-[#141414] border border-[#262626] px-3 py-1.5 rounded-sm font-mono text-xs text-center min-w-[100px]">
                    <span className="text-white font-bold block">{block.startTime}</span>
                    <span className="text-[10px] text-[#666] uppercase">TO {block.endTime}</span>
                  </div>

                  {/* Title and Category */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-[10px] font-mono px-2 py-0.5 rounded-sm border flex items-center gap-1 uppercase tracking-wider font-bold",
                        catInfo.bg, catInfo.text, catInfo.border
                      )}>
                        <CatIcon className="w-3 h-3" />
                        {block.category}
                      </span>
                      {isActiveNow && (
                        <span className="text-[9px] font-mono bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/40 px-1.5 py-0.5 rounded-sm uppercase tracking-widest font-bold flex items-center">
                          <Zap className="w-2.5 h-2.5 mr-1 animate-ping" /> IN PROGRESS
                        </span>
                      )}
                    </div>
                    <h3 className={cn(
                      "text-sm md:text-base font-mono font-bold tracking-wider uppercase",
                      block.completedToday ? "text-[#777] line-through" : "text-white"
                    )}>
                      {block.title}
                    </h3>
                    {block.notes && (
                      <p className="text-xs font-mono text-[#888]">{block.notes}</p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t border-[#262626] md:border-t-0 pt-3 md:pt-0">
                  <button
                    onClick={() => handleStartFocusTimer(block)}
                    className="px-2.5 py-1.5 bg-[#141414] hover:bg-cyan-950/40 border border-[#262626] hover:border-cyan-500/40 text-cyan-400 font-mono text-[10px] font-bold uppercase rounded-sm transition-all flex items-center gap-1"
                    title="Start Live Focus Timer"
                  >
                    <Zap className="w-3 h-3" /> TIMER
                  </button>

                  <button
                    onClick={() => handleOpenEditModal(block)}
                    className="p-1.5 text-[#A3A3A3] hover:text-white bg-[#141414] border border-[#262626] hover:border-[#444] rounded-sm transition-colors"
                    title="Edit block"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDeleteBlock(block.id!)}
                    className="p-1.5 text-[#666] hover:text-red-400 bg-[#141414] hover:bg-red-950/30 border border-[#262626] rounded-sm transition-colors"
                    title="Delete block"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Focus Timer Session Modal */}
      {focusBlock && (
        <div className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0A0A0A] border border-cyan-500/50 rounded-lg p-6 max-w-md w-full text-center space-y-6 relative shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#262626] pb-3">
              <span className="text-xs font-mono text-cyan-400 uppercase font-bold tracking-widest flex items-center gap-1.5">
                <Zap className="w-4 h-4 animate-pulse" /> ACTIVE FOCUS SESSION
              </span>
              <button onClick={() => { setIsFocusRunning(false); setFocusBlock(null); }} className="text-[#888] hover:text-white font-mono">✕</button>
            </div>

            <div>
              <h3 className="text-lg font-mono font-bold text-white uppercase tracking-wider">{focusBlock.title}</h3>
              <p className="text-xs font-mono text-[#A3A3A3] mt-1 uppercase">{focusBlock.category} • {focusBlock.startTime} - {focusBlock.endTime}</p>
            </div>

            {/* Big Countdown Timer Display */}
            <div className="py-6 bg-[#121212] border border-[#262626] rounded-lg">
              <div className="text-5xl font-mono font-black text-cyan-400 tracking-widest">
                {String(Math.floor(focusRemainingSeconds / 60)).padStart(2, '0')}:
                {String(focusRemainingSeconds % 60).padStart(2, '0')}
              </div>
              <p className="text-[10px] font-mono text-[#666] uppercase mt-2">REMAINING TIME IN BLOCK</p>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setIsFocusRunning(!isFocusRunning)}
                className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-bold uppercase rounded-sm shadow-md"
              >
                {isFocusRunning ? 'PAUSE TIMER' : 'RESUME TIMER'}
              </button>
              <button
                onClick={() => {
                  handleToggleComplete(focusBlock, true);
                  setIsFocusRunning(false);
                  setFocusBlock(null);
                }}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold uppercase rounded-sm shadow-md"
              >
                MARK COMPLETED (+50 XP)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Time Block Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0A0A0A] border border-[#262626] rounded-sm p-6 max-w-lg w-full space-y-5 relative shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#262626] pb-3">
              <h3 className="text-lg font-mono text-white font-bold uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-5 h-5" style={{ color: themeColor }} />
                {editingBlock ? 'EDIT TIME TABLE BLOCK' : 'NEW TIME TABLE BLOCK'}
              </h3>
              <button
                onClick={() => { setShowAddModal(false); setEditingBlock(null); }}
                className="text-[#888] hover:text-white font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveBlock} className="space-y-4">
              <div>
                <label className="text-[10px] font-mono text-[#A3A3A3] uppercase tracking-widest block mb-1">
                  ACTIVITY / HOBBY TITLE
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Guitar Practice, Coding, 30m Workout"
                  className="w-full bg-[#141414] border border-[#262626] text-white text-sm font-mono px-3 py-2 rounded-sm focus:outline-none focus:border-[#555]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-[#A3A3A3] uppercase tracking-widest block mb-1">
                    START TIME (2X:XX)
                  </label>
                  <input
                    type="time"
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    className="w-full bg-[#141414] border border-[#262626] text-white text-sm font-mono px-3 py-2 rounded-sm focus:outline-none focus:border-[#555]"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-[#A3A3A3] uppercase tracking-widest block mb-1">
                    END TIME (3X:XX)
                  </label>
                  <input
                    type="time"
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                    className="w-full bg-[#141414] border border-[#262626] text-white text-sm font-mono px-3 py-2 rounded-sm focus:outline-none focus:border-[#555]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-[#A3A3A3] uppercase tracking-widest block mb-1">
                  CATEGORY
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-[#141414] border border-[#262626] text-white text-sm font-mono px-3 py-2 rounded-sm focus:outline-none focus:border-[#555] uppercase"
                >
                  <option value="hobby">🎨 HOBBY & CRAFTS</option>
                  <option value="workout">🏋️ WORKOUT & EXERCISE</option>
                  <option value="study">📚 STUDY & SKILLS</option>
                  <option value="work">💼 WORK & OPERATIONS</option>
                  <option value="gaming">🎮 GAMING & ESPORTS</option>
                  <option value="rest">🧘 REST & RECOVERY</option>
                  <option value="personal">👤 PERSONAL</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono text-[#A3A3A3] uppercase tracking-widest block mb-1">
                  RECURRING DAYS
                </label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {WEEKDAYS.map(d => {
                    const isSel = selectedDays.includes(d.value);
                    return (
                      <button
                        type="button"
                        key={d.value}
                        onClick={() => toggleDaySelection(d.value)}
                        className={cn(
                          "px-2.5 py-1 text-xs font-mono rounded-sm border uppercase transition-colors font-bold",
                          isSel ? "bg-[#222] border-white text-white" : "bg-[#141414] border-[#262626] text-[#666]"
                        )}
                      >
                        {d.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-[#A3A3A3] uppercase tracking-widest block mb-1">
                  NOTES / GOAL DETAILS (OPTIONAL)
                </label>
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Practice pentatonic scales, read chapter 4..."
                  className="w-full bg-[#141414] border border-[#262626] text-white text-xs font-mono p-2.5 rounded-sm focus:outline-none focus:border-[#555] h-20"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); setEditingBlock(null); }}
                  className="px-4 py-2 text-xs font-mono text-[#888] hover:text-white uppercase"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-mono font-bold text-black uppercase tracking-wider rounded-sm shadow-md"
                  style={{ backgroundColor: themeColor }}
                >
                  {editingBlock ? 'UPDATE BLOCK' : 'SAVE BLOCK'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
