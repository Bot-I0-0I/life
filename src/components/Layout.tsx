import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { OnboardingGuide } from './OnboardingGuide';
import { ThemeGalleryModal } from './ThemeGalleryModal';
import { CommandPalette } from './CommandPalette';
import {
  Activity, Shield, ShoppingCart, Swords, EyeOff, Eye, BookOpen, CalendarDays, Wallet,
  Settings, User, Flame, LogIn, LogOut, LayoutGrid, Menu, X, BrainCircuit,
  Dumbbell, Heart, Palette, Clock, Search, ChevronLeft, ChevronRight, Zap, Coins
} from 'lucide-react';
import { cn, getRank } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../AuthContext';

export function Layout({ children }: { children: React.ReactNode }) {
  const { isCloaked, currentView, toggleCloak, setView } = useStore();
  const userStats = useLiveQuery(() => db.userStats.get(1));
  const { user, isGuest, login, logout } = useAuth();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');

  const activeQuestsList = useLiveQuery(async () => {
    const list = await db.quests.toArray();
    return list.filter(q => !q.completed);
  }) || [];

  const pendingReviews = useLiveQuery(() => db.weeklyReviews?.where('status').equals('pending').toArray()) || [];
  const level = Math.floor((userStats?.xp || 0) / 1000) + 1;
  const { color: rankColor, rank } = getRank(level);
  const themeColor = userStats?.selectedColor || rankColor;
  const uiTheme = userStats?.uiTheme || 'default';
  const credits = userStats?.credits || 0;

  const navCategories = [
    {
      title: "CORE CHANNELS",
      items: [
        { id: 'hub', icon: LayoutGrid, label: 'Command Hub' },
        { id: 'status', icon: Activity, label: 'Status Window' },
        { id: 'scheduler', icon: CalendarDays, label: 'Directives' },
        { id: 'timetable', icon: Clock, label: 'Daily Timetable' },
      ]
    },
    {
      title: "PHYSICAL & VITALITY",
      items: [
        { id: 'training', icon: Dumbbell, label: 'Training Engine' },
        { id: 'nutrition', icon: Flame, label: 'Diets & Macros' },
        { id: 'vessel', icon: Heart, label: 'Vessel Tracker' },
      ]
    },
    {
      title: "OPERATIONS",
      items: [
        { id: 'dungeons', icon: Swords, label: 'Instances / Bosses' },
        { id: 'tactical', icon: BrainCircuit, label: 'Goal Analytics' },
        { id: 'reviews', icon: BookOpen, label: 'Weekly Review', badge: pendingReviews.length },
      ]
    },
    {
      title: "RESOURCES & CONFIG",
      items: [
        { id: 'store', icon: ShoppingCart, label: 'System Store' },
        { id: 'ledger', icon: Wallet, label: 'Treasury' },
        { id: 'settings', icon: Settings, label: 'Settings' },
      ]
    }
  ];

  const themeClasses: Record<string, string> = {
    default: 'border-transparent',
    s_class: 'border-purple-500/50 shadow-[inset_0_0_50px_rgba(168,85,247,0.15)] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1a0b2e] via-[#0A0A0A] to-[#0A0A0A]',
    monarch: 'border-indigo-500/60 shadow-[inset_0_0_80px_rgba(99,102,241,0.2)] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] bg-[#05050A]',
    shadow_red: 'border-red-600/50 shadow-[inset_0_0_60px_rgba(239,68,68,0.15)] bg-[#080303]',
    golden_national: 'border-amber-500/50 shadow-[inset_0_0_60px_rgba(245,158,11,0.15)] bg-[#0C0A09]',
    emerald_vessel: 'border-emerald-500/50 shadow-[inset_0_0_60px_rgba(16,185,129,0.15)] bg-[linear-gradient(to_right,#10b98108_1px,transparent_1px),linear-gradient(to_bottom,#10b98108_1px,transparent_1px)] bg-[size:20px_20px] bg-[#02120B]',
    solar_daylight: 'border-blue-500/30 bg-[#F8FAFC]',
  };

  const mobileNavItems: Array<{ id: string; icon: any; label: string; badge?: number | string }> = [
    { id: 'status', icon: Activity, label: 'STATUS' },
    { id: 'timetable', icon: Clock, label: 'TIMETABLE', badge: `${userStats?.currentStreak || 0}D` },
    { id: 'training', icon: Dumbbell, label: 'TRAINING' },
    { id: 'nutrition', icon: Flame, label: 'DIETS' },
    { id: 'vessel', icon: Heart, label: 'VESSEL' },
  ];

  const viewTitles: Record<string, { title: string, subtitle: string }> = {
    hub: { title: 'COMMAND HUB', subtitle: 'Central Control Node & System Overview' },
    status: { title: 'STATUS WINDOW', subtitle: 'Identity Dashboard & Attribute Matrix' },
    scheduler: { title: 'DIRECTIVES', subtitle: 'Schedule, Routines & Habit Tracking' },
    timetable: { title: 'DAILY TIMETABLE', subtitle: '24-Hour Schedule Matrix & Focus Sessions' },
    dungeons: { title: 'INSTANCES', subtitle: 'Combat, Boss Battles & Dungeons' },
    tactical: { title: 'GOAL ANALYTICS', subtitle: 'Tactical Directives & Milestone Tracking' },
    training: { title: 'TRAINING ENGINE', subtitle: 'Executable Workout Plans & Body Targets' },
    nutrition: { title: 'DIETS & MACROS', subtitle: 'Metabolism, SQL Food House & Logs' },
    vessel: { title: 'VESSEL TRACKER', subtitle: 'Physical Biometrics, Sleep & Weight' },
    store: { title: 'SYSTEM STORE', subtitle: 'Equipment, Consumables & Rewards' },
    ledger: { title: 'TREASURY', subtitle: 'Financial Ledger & Credit Balances' },
    reviews: { title: 'WEEKLY REVIEW', subtitle: 'Performance Analysis & Audits' },
    settings: { title: 'SYSTEM SETTINGS', subtitle: 'Interface Styling & User Preferences' },
  };

  const currentTitleInfo = viewTitles[currentView] || { title: 'SYSTEM', subtitle: 'Active Module' };

  // Flattened nav items for mobile drawer search
  const allNavItems = navCategories.flatMap(cat => cat.items);
  const filteredMobileItems = allNavItems.filter(item =>
    item.label.toLowerCase().includes(mobileSearchQuery.toLowerCase())
  );

  return (
    <div className={cn(
      "min-h-screen bg-[#0A0A0A] text-[#E5E5E5] font-sans flex flex-col md:flex-row transition-all duration-500 relative border-2 overflow-x-hidden max-w-vw",
      themeClasses[uiTheme] || 'border-transparent'
    )}>
      {userStats?.backgroundImage && (
        <div
          className={cn(
            "absolute inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none transition-opacity duration-500",
            isCloaked ? "opacity-60" : "opacity-10"
          )}
          style={{ backgroundImage: `url(${userStats.backgroundImage})` }}
        />
      )}

      {/* Sidebar (Desktop) */}
      <aside className={cn(
        "hidden md:flex md:flex-col border-r border-[#262626] bg-[#0A0A0A]/95 backdrop-blur-md z-50 p-3 transition-all duration-300 relative flex-shrink-0",
        isSidebarCollapsed ? "w-20" : "w-64",
        uiTheme === 'monarch' && "bg-[#05050A]/95 border-indigo-500/40 shadow-[10px_0_50px_-15px_rgba(99,102,241,0.3)]",
        uiTheme === 's_class' && "border-purple-500/40 shadow-[10px_0_40px_-15px_rgba(168,85,247,0.25)]"
      )}>
        {/* Sidebar Header & Collapse Toggle */}
        <div className="flex items-center justify-between mb-6 px-2 pt-2 relative">
          {!isSidebarCollapsed && (
            <div className="min-w-0">
              <h1
                className="text-lg font-black tracking-tighter uppercase font-mono truncate"
                style={{ color: themeColor, textShadow: `0 0 10px ${themeColor}60` }}
              >
                {uiTheme === 'monarch' ? 'MONARCH' : uiTheme === 's_class' ? 'S-CLASS' : 'SYSTEM'}
              </h1>
              <p className="text-[9px] font-mono text-[#666] tracking-widest uppercase truncate">LIFE CONTROL v3.5</p>
            </div>
          )}

          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1.5 rounded-md bg-[#141414] hover:bg-[#222] border border-[#262626] text-[#A3A3A3] hover:text-white transition-colors ml-auto touch-target"
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* User Card */}
        {!isSidebarCollapsed && (
          <div className="mb-4 p-2.5 bg-[#121212] border border-[#262626] rounded-lg flex items-center space-x-3">
            {(user && !isGuest && user.photoURL) || userStats?.avatar ? (
              <img
                src={(user && !isGuest && user.photoURL) || userStats?.avatar}
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover border border-[#333]"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#1A1A1A] border border-[#333] flex items-center justify-center">
                <User className="w-4 h-4 text-cyan-400" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-mono font-bold text-white truncate">
                {(user && !isGuest && (user.displayName || user.email)) || userStats?.name || 'Player'}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                  LVL {level}
                </span>
                <span className="text-[9px] font-mono text-[#888] uppercase truncate">{rank}</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Categories & Buttons */}
        <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-1 py-1">
          {navCategories.map((category) => (
            <div key={category.title} className="space-y-1">
              {!isSidebarCollapsed && (
                <span className="text-[9px] font-mono font-bold tracking-widest text-[#555] px-2 uppercase block">
                  {category.title}
                </span>
              )}
              <div className="space-y-1">
                {category.items.map((item) => {
                  const isSelected = currentView === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setView(item.id as any)}
                      title={item.label}
                      className={cn(
                        "w-full flex items-center p-2.5 rounded-lg transition-all duration-200 relative group touch-target",
                        isSidebarCollapsed ? "justify-center px-0" : "space-x-3 justify-start",
                        isSelected
                          ? "bg-[#181818] border border-cyan-500/40 text-cyan-400 font-bold shadow-sm"
                          : "text-[#A3A3A3] hover:bg-[#141414] hover:text-white border border-transparent"
                      )}
                      style={isSelected ? { color: themeColor } : {}}
                    >
                      <Icon className={cn("w-4 h-4 flex-shrink-0", isSelected && "animate-pulse")} />
                      {!isSidebarCollapsed && (
                        <span className="text-xs font-mono uppercase tracking-wider truncate flex-1 text-left">
                          {item.label}
                        </span>
                      )}
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className={cn(
                          "px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-cyan-500 text-black",
                          isSidebarCollapsed && "absolute top-1 right-1"
                        )}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer Actions */}
        <div className="mt-auto pt-3 border-t border-[#262626] space-y-1.5">
          <button
            onClick={() => setIsThemeModalOpen(true)}
            className={cn(
              "w-full flex items-center p-2.5 rounded-lg text-cyan-400 bg-cyan-950/30 border border-cyan-500/30 hover:bg-cyan-900/40 transition-all font-mono text-xs uppercase font-bold touch-target",
              isSidebarCollapsed ? "justify-center px-0" : "justify-start space-x-2"
            )}
            title="Open UI Theme Gallery"
          >
            <Palette className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            {!isSidebarCollapsed && <span className="truncate">Theme Gallery</span>}
          </button>

          <button
            onClick={toggleCloak}
            className={cn(
              "w-full flex items-center p-2.5 rounded-lg text-[#A3A3A3] hover:bg-[#1A1A1A] hover:text-white transition-all font-mono text-xs touch-target",
              isSidebarCollapsed ? "justify-center px-0" : "justify-start space-x-2"
            )}
            title="System Cloak Toggle"
          >
            {isCloaked ? <EyeOff className="w-4 h-4 flex-shrink-0 text-amber-400" /> : <Eye className="w-4 h-4 flex-shrink-0" />}
            {!isSidebarCollapsed && <span className="truncate">Cloak {isCloaked ? 'ON' : 'OFF'}</span>}
          </button>
        </div>
      </aside>

      {/* Main Container Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top Header Bar */}
        <header className="bg-[#0A0A0A]/95 border-b border-[#262626] px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 sm:gap-3 sticky top-0 z-30 backdrop-blur-md">
          {/* Left: Mobile Drawer Trigger & Command Search Button */}
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
              className="hidden max-md:inline-flex p-2 bg-[#141414] hover:bg-[#222] border border-[#262626] rounded-md text-[#A3A3A3] hover:text-white touch-target flex-shrink-0 items-center justify-center"
              title="Toggle Menu"
            >
              {isMobileDrawerOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5 text-cyan-400" />}
            </button>

            {/* Quick Command Search Button */}
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2 bg-[#121212] hover:bg-[#1A1A1A] border border-[#262626] hover:border-cyan-500/40 rounded-lg text-xs font-mono text-[#888] hover:text-white transition-all touch-target"
              title="Open Command Search (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
              <span className="hidden sm:inline-block">Search / Jump to View...</span>
              <span className="sm:hidden text-[11px] font-bold text-[#AAA]">SEARCH</span>
              <span className="hidden md:inline-block text-[9px] bg-[#1C1C1C] border border-[#333] px-1.5 py-0.5 rounded text-[#666] ml-2">
                Ctrl+K
              </span>
            </button>

            {/* View Breadcrumb / Title (Desktop) */}
            <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-[#262626] min-w-0">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-white truncate">
                {currentTitleInfo.title}
              </span>
              <span className="text-[10px] font-mono text-[#666] truncate hidden xl:inline-block">
                • {currentTitleInfo.subtitle}
              </span>
            </div>
          </div>

          {/* Right Top Bar Badges */}
          <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
            {/* Player Level Badge */}
            <div
              onClick={() => setView('status')}
              className="cursor-pointer bg-[#121212] border border-[#262626] hover:border-cyan-500/50 px-2 py-1 sm:px-2.5 sm:py-1 rounded-lg flex items-center gap-1.5 transition-all"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <div className="flex items-center gap-1 font-mono text-xs">
                <span className="font-bold text-white">LVL {level}</span>
                <span className="text-[10px] text-cyan-400 font-bold bg-cyan-950/60 px-1 py-0.2 rounded border border-cyan-800 hidden sm:inline-block">
                  {rank}
                </span>
              </div>
            </div>

            {/* Credits Counter */}
            <div
              onClick={() => setView('ledger')}
              className="cursor-pointer bg-[#121212] border border-[#262626] hover:border-amber-500/50 px-2 py-1 sm:px-2.5 sm:py-1 rounded-lg flex items-center gap-1.5 transition-all font-mono text-xs text-amber-400 font-bold"
            >
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>{credits.toLocaleString()} G</span>
            </div>

            {/* Cloud Auth Button */}
            {user && !isGuest ? (
              <button
                onClick={logout}
                className="hidden sm:flex items-center gap-1.5 p-2 bg-[#121212] hover:bg-red-950/40 border border-[#262626] hover:border-red-500/40 rounded-lg text-xs font-mono text-[#888] hover:text-red-400 transition-colors touch-target"
                title="Cloud Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={login}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/40 rounded-lg text-xs font-mono text-cyan-400 font-bold transition-colors touch-target"
                title="Cloud Sync Login"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>SYNC</span>
              </button>
            )}
          </div>
        </header>

        {/* Mobile View Title Ribbon */}
        <div className="lg:hidden px-4 py-2 bg-[#121212] border-b border-[#262626] flex items-center justify-between">
          <div className="min-w-0">
            <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider truncate">
              {currentTitleInfo.title}
            </h2>
            <p className="text-[9px] font-mono text-[#888] truncate">{currentTitleInfo.subtitle}</p>
          </div>
          <button
            onClick={() => setIsThemeModalOpen(true)}
            className="p-1.5 bg-[#181818] border border-cyan-500/30 rounded text-cyan-400 text-[10px] font-mono flex items-center gap-1"
          >
            <Palette className="w-3 h-3" /> THEME
          </button>
        </div>

        {/* Mobile Full Navigation Overlay Drawer */}
        <AnimatePresence>
          {isMobileDrawerOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#0A0A0A] border-b border-[#262626] p-4 space-y-4 shadow-2xl z-40 overflow-hidden"
            >
              {/* Drawer Search Filter */}
              <div className="flex items-center px-3 py-2 bg-[#121212] border border-[#262626] rounded-lg">
                <Search className="w-4 h-4 text-[#888] mr-2 flex-shrink-0" />
                <input
                  type="text"
                  value={mobileSearchQuery}
                  onChange={(e) => setMobileSearchQuery(e.target.value)}
                  placeholder="Filter channels..."
                  className="w-full bg-transparent text-white font-mono text-xs focus:outline-none placeholder:text-[#555]"
                />
                {mobileSearchQuery && (
                  <button onClick={() => setMobileSearchQuery('')} className="text-[#888] text-xs font-mono">✕</button>
                )}
              </div>

              {/* Categorized Grid of Modules */}
              <div className="grid grid-cols-2 gap-2 max-h-[60vh] overflow-y-auto custom-scrollbar p-1">
                {filteredMobileItems.map((item: any) => {
                  const isSelected = currentView === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setView(item.id as any);
                        setIsMobileDrawerOpen(false);
                      }}
                      className={cn(
                        "flex items-center space-x-2.5 p-3 rounded-lg border text-left transition-all touch-target min-w-0",
                        isSelected
                          ? "bg-[#181818] border-cyan-500/60 text-cyan-400 font-bold shadow-md"
                          : "bg-[#121212] border-[#262626] text-[#A3A3A3] hover:text-white"
                      )}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="text-xs font-mono uppercase tracking-wider truncate flex-1">{item.label}</span>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono bg-cyan-500 text-black font-bold">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Drawer Footer Actions */}
              <div className="flex gap-2 pt-2 border-t border-[#262626]">
                <button
                  onClick={() => { setIsThemeModalOpen(true); setIsMobileDrawerOpen(false); }}
                  className="flex-1 py-2.5 bg-cyan-950/40 border border-cyan-500/40 text-cyan-400 font-mono text-xs uppercase font-bold rounded-lg flex items-center justify-center gap-2 touch-target"
                >
                  <Palette className="w-4 h-4" /> THEME GALLERY
                </button>
                <button
                  onClick={() => { setView('settings'); setIsMobileDrawerOpen(false); }}
                  className="p-2.5 bg-[#121212] border border-[#262626] text-[#A3A3A3] hover:text-white rounded-lg touch-target"
                  title="Settings"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* View Main Content Workspace */}
        <main className={cn(
          "flex-1 p-3 sm:p-6 pb-24 md:pb-8 overflow-y-auto no-scrollbar relative w-full max-w-7xl mx-auto min-w-0",
          isCloaked && "blur-sm transition-all duration-300 hover:blur-none"
        )}>
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="w-full min-w-0"
          >
            {children}
          </motion.div>

          {/* Onboarding Guide Portal */}
          <OnboardingGuide themeColor={themeColor} />
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-[#262626] bg-[#0A0A0A]/95 backdrop-blur-xl z-50 flex justify-around p-1.5 shadow-2xl">
        {mobileNavItems.map((item) => {
          const isSelected = currentView === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id as any)}
              className={cn(
                "flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all duration-200 relative flex-1 min-w-0 touch-target",
                isSelected
                  ? "bg-[#181818] border border-cyan-500/40 text-cyan-400 shadow-md"
                  : "text-[#777] hover:text-[#AAA]"
              )}
            >
              <Icon className={cn("w-5 h-5 mb-0.5", isSelected && "animate-pulse")} />
              <span className="text-[9px] font-mono uppercase tracking-wider text-center truncate w-full font-bold">
                {item.label}
              </span>
              {item.badge !== undefined && (
                <span className="absolute -top-1 right-1 px-1 py-0.2 text-[8px] font-mono font-black bg-cyan-500 text-black rounded-full leading-none shadow">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Command Palette Search Modal */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onOpenThemeGallery={() => setIsThemeModalOpen(true)}
      />

      {/* UI Theme Samples Gallery Modal */}
      <ThemeGalleryModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        currentThemeColor={themeColor}
        currentUiTheme={uiTheme}
      />
    </div>
  );
}
