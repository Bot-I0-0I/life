import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import {
  Search, Activity, Shield, CalendarDays, Clock, Dumbbell, Flame, Heart,
  Swords, BrainCircuit, BookOpen, ShoppingCart, Wallet, Settings, LayoutGrid,
  Palette, Eye, EyeOff, LogIn, LogOut, ArrowRight, CornerDownLeft
} from 'lucide-react';
import { cn, getRank } from '../lib/utils';
import { useAuth } from '../AuthContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenThemeGallery: () => void;
}

export function CommandPalette({ isOpen, onClose, onOpenThemeGallery }: CommandPaletteProps) {
  const { setView, isCloaked, toggleCloak } = useStore();
  const userStats = useLiveQuery(() => db.userStats.get(1));
  const { user, isGuest, login, logout } = useAuth();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const level = Math.floor((userStats?.xp || 0) / 1000) + 1;
  const { color: rankColor } = getRank(level);
  const themeColor = userStats?.selectedColor || rankColor;

  const viewsList = [
    { id: 'hub', label: 'Command Hub', desc: 'Central Control Node & Overview', icon: LayoutGrid, category: 'Core' },
    { id: 'status', label: 'Status Window', desc: 'Identity Dashboard & Attribute Matrix', icon: Activity, category: 'Core' },
    { id: 'scheduler', label: 'Directives', desc: 'Schedules, Routines & Habits', icon: CalendarDays, category: 'Core' },
    { id: 'timetable', label: 'Daily Timetable', desc: '24-Hour Time Block Matrix & Focus Timer', icon: Clock, category: 'Core' },
    { id: 'training', label: 'Training Engine', desc: 'Executable Workout Plans & Body Target Split', icon: Dumbbell, category: 'Vitality' },
    { id: 'nutrition', label: 'Diets & Macros', desc: 'Metabolism, SQL Food House & Meal Tracker', icon: Flame, category: 'Vitality' },
    { id: 'vessel', label: 'Vessel Tracker', desc: 'Biometrics, Weight Progress & Sleep Log', icon: Heart, category: 'Vitality' },
    { id: 'dungeons', label: 'Instances / Dungeons', desc: 'Boss Raids & Combat Challenges', icon: Swords, category: 'Operations' },
    { id: 'tactical', label: 'Goal Tracking', desc: 'Mission Analytics & Long-Term Objectives', icon: BrainCircuit, category: 'Operations' },
    { id: 'reviews', label: 'Weekly Review', desc: 'Performance Analysis & Weekly Audits', icon: BookOpen, category: 'Operations' },
    { id: 'store', label: 'System Store', desc: 'Resource Exchange & Reward Redemptions', icon: ShoppingCart, category: 'Treasury' },
    { id: 'ledger', label: 'Treasury', desc: 'Financial Ledger & Credit Tracker', icon: Wallet, category: 'Treasury' },
    { id: 'settings', label: 'System Settings', desc: 'Custom UI Themes, Backgrounds & System Preferences', icon: Settings, category: 'System' },
  ];

  const quickActions = [
    {
      id: 'action-theme',
      label: 'Open UI Theme Gallery',
      desc: 'Customize colors, S-Class, Monarch, and Solar themes',
      icon: Palette,
      action: () => { onOpenThemeGallery(); onClose(); }
    },
    {
      id: 'action-cloak',
      label: isCloaked ? 'Disable System Cloak' : 'Enable System Cloak',
      desc: 'Toggle background wallpaper privacy masking',
      icon: isCloaked ? Eye : EyeOff,
      action: () => { toggleCloak(); onClose(); }
    },
    {
      id: 'action-auth',
      label: (user && !isGuest) ? 'Cloud Logout' : 'Cloud Login / Sync',
      desc: (user && !isGuest) ? 'Disconnect Google Firebase Account' : 'Connect Firebase account for cloud sync',
      icon: (user && !isGuest) ? LogOut : LogIn,
      action: () => {
        if (user && !isGuest) logout();
        else login();
        onClose();
      }
    }
  ];

  const filteredViews = viewsList.filter(v =>
    v.label.toLowerCase().includes(query.toLowerCase()) ||
    v.desc.toLowerCase().includes(query.toLowerCase()) ||
    v.category.toLowerCase().includes(query.toLowerCase())
  );

  const filteredActions = quickActions.filter(a =>
    a.label.toLowerCase().includes(query.toLowerCase()) ||
    a.desc.toLowerCase().includes(query.toLowerCase())
  );

  const totalItems = filteredViews.length + filteredActions.length;

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Handle keyboard shortcuts (Ctrl/Cmd + K, Esc, Arrows, Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open
          setQuery('');
        }
      }

      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % Math.max(1, totalItems));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + totalItems) % Math.max(1, totalItems));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedIndex < filteredViews.length) {
          const targetView = filteredViews[selectedIndex];
          if (targetView) {
            setView(targetView.id as any);
            onClose();
          }
        } else {
          const actionIdx = selectedIndex - filteredViews.length;
          const targetAction = filteredActions[actionIdx];
          if (targetAction) {
            targetAction.action();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, totalItems, selectedIndex, filteredViews, filteredActions, setView, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-start justify-center pt-12 sm:pt-20 px-3 sm:px-6 animate-fadeIn">
      <div
        className="bg-[#0A0A0A] border-2 border-[#333] rounded-xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col relative"
        style={{ borderColor: `${themeColor}60` }}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#262626] bg-[#121212]">
          <Search className="w-5 h-5 text-[#888] mr-3 flex-shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a view name or command (e.g., Training, Quests, Theme)..."
            className="w-full bg-transparent text-white font-mono text-sm placeholder:text-[#555] focus:outline-none"
          />
          <span className="text-[10px] font-mono text-[#666] bg-[#1C1C1C] px-2 py-1 rounded border border-[#333] hidden sm:inline-block ml-2">
            ESC TO CLOSE
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-2 space-y-1">
          {totalItems === 0 ? (
            <div className="p-8 text-center text-xs font-mono text-[#666] uppercase">
              NO MODULES OR COMMANDS FOUND FOR "{query}"
            </div>
          ) : (
            <>
              {filteredViews.length > 0 && (
                <div className="space-y-1">
                  <div className="px-3 py-1 text-[10px] font-mono font-bold text-[#666] uppercase tracking-widest">
                    SYSTEM NAVIGATION CHANNELS ({filteredViews.length})
                  </div>
                  {filteredViews.map((item, idx) => {
                    const isSelected = idx === selectedIndex;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setView(item.id as any);
                          onClose();
                        }}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={cn(
                          "w-full flex items-center justify-between p-3 rounded-lg text-left transition-all duration-150 font-mono text-xs",
                          isSelected
                            ? "bg-[#181818] border border-cyan-500/40 text-white shadow-md"
                            : "hover:bg-[#121212] text-[#A3A3A3]"
                        )}
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <div className={cn(
                            "p-2 rounded-md border flex-shrink-0",
                            isSelected ? "bg-cyan-950/60 border-cyan-500/50 text-cyan-400" : "bg-[#141414] border-[#262626] text-[#888]"
                          )}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-white uppercase truncate">{item.label}</span>
                              <span className="text-[9px] bg-[#222] text-[#888] px-1.5 py-0.5 rounded uppercase">
                                {item.category}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#777] truncate">{item.desc}</p>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="flex items-center text-cyan-400 text-[10px] gap-1 font-bold flex-shrink-0 ml-2">
                            <span>JUMP</span>
                            <CornerDownLeft className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {filteredActions.length > 0 && (
                <div className="space-y-1 pt-2 border-t border-[#262626] mt-2">
                  <div className="px-3 py-1 text-[10px] font-mono font-bold text-[#666] uppercase tracking-widest">
                    QUICK ACTIONS ({filteredActions.length})
                  </div>
                  {filteredActions.map((action, idx) => {
                    const realIdx = filteredViews.length + idx;
                    const isSelected = realIdx === selectedIndex;
                    const Icon = action.icon;
                    return (
                      <button
                        key={action.id}
                        onClick={action.action}
                        onMouseEnter={() => setSelectedIndex(realIdx)}
                        className={cn(
                          "w-full flex items-center justify-between p-3 rounded-lg text-left transition-all duration-150 font-mono text-xs",
                          isSelected
                            ? "bg-[#181818] border border-amber-500/40 text-white shadow-md"
                            : "hover:bg-[#121212] text-[#A3A3A3]"
                        )}
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <div className={cn(
                            "p-2 rounded-md border flex-shrink-0",
                            isSelected ? "bg-amber-950/60 border-amber-500/50 text-amber-400" : "bg-[#141414] border-[#262626] text-[#888]"
                          )}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-white uppercase block truncate">{action.label}</span>
                            <p className="text-[11px] text-[#777] truncate">{action.desc}</p>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="flex items-center text-amber-400 text-[10px] gap-1 font-bold flex-shrink-0 ml-2">
                            <span>RUN</span>
                            <ArrowRight className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-4 py-2 bg-[#0A0A0A] border-t border-[#262626] flex items-center justify-between text-[10px] font-mono text-[#666]">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
          </div>
          <span className="uppercase text-cyan-400 font-bold">LIFE CONTROL SYSTEM v3.5</span>
        </div>
      </div>
    </div>
  );
}
