import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { OnboardingGuide } from './OnboardingGuide';
import { Activity, Crosshair, Shield, ShoppingCart, Swords, EyeOff, Eye, BookOpen, CalendarDays, Wallet, Settings, User, Flame, LogIn, LogOut, LayoutGrid, Menu, X, BrainCircuit, Rocket, Package, Plus, CheckCircle, Dumbbell, Terminal, Heart } from 'lucide-react';
import { cn, getRank } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../AuthContext';

export function Layout({ children }: { children: React.ReactNode }) {
  const { isCloaked, currentView, toggleCloak, setView, showActiveQuestTicker } = useStore();
  const userStats = useLiveQuery(() => db.userStats.get(1));
  const { user, isGuest, login, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const activeQuestsList = useLiveQuery(async () => {
    const list = await db.quests.toArray();
    return list.filter(q => !q.completed);
  }) || [];

  const isPenalty = false; // Penalty system removed

  const navCategories: Array<{ title: string; items: Array<{ id: string; icon: any; label: string }> }> = [
    {
      title: "CORE CHANNELS",
      items: [
        { id: 'status', icon: Activity, label: 'Status Window' },
        { id: 'hub', icon: LayoutGrid, label: 'System Hub' },
        { id: 'quests', icon: Shield, label: 'Daily Quests' },
        { id: 'scheduler', icon: CalendarDays, label: 'Directives' },
      ]
    },
    {
      title: "PHYSICAL & VITALITY",
      items: [
        { id: 'training', icon: Dumbbell, label: 'Training & Workouts' },
        { id: 'nutrition', icon: Flame, label: 'Diets & Macros' },
        { id: 'vessel', icon: Heart, label: 'Vessel Tracker' },
      ]
    },
    {
      title: "OPERATIONS",
      items: [
        { id: 'dungeons', icon: Swords, label: 'Instances' },
        { id: 'tactical', icon: BrainCircuit, label: 'Goal Tracking' },
        { id: 'reviews', icon: BookOpen, label: 'Weekly Review' },
      ]
    },
    {
      title: "TREASURY & CONFIG",
      items: [
        { id: 'store', icon: ShoppingCart, label: 'System Store' },
        { id: 'ledger', icon: Wallet, label: 'Treasury' },
        { id: 'settings', icon: Settings, label: 'Settings' },
      ]
    }
  ];

  const pendingReviews = useLiveQuery(() => db.weeklyReviews?.where('status').equals('pending').toArray()) || [];
  const level = Math.floor((userStats?.xp || 0) / 1000) + 1;
  const { color: rankColor } = getRank(level);
  const themeColor = userStats?.selectedColor || rankColor;
  const uiTheme = userStats?.uiTheme || 'default';

  const themeClasses: Record<string, string> = {
    default: 'border-transparent',
    s_class: 'border-purple-500/50 shadow-[inset_0_0_50px_rgba(168,85,247,0.15)] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1a0b2e] via-[#0A0A0A] to-[#0A0A0A]',
    monarch: 'border-indigo-500/60 shadow-[inset_0_0_80px_rgba(99,102,241,0.2)] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] bg-[#05050A]',
  };

  const mobileNavItems = [
    { id: 'status', icon: Activity, label: 'STATUS' },
    { id: 'training', icon: Dumbbell, label: 'TRAINING' },
    { id: 'hub', icon: LayoutGrid, label: 'HUB' },
    { id: 'nutrition', icon: Flame, label: 'DIETS' },
    { id: 'vessel', icon: Heart, label: 'VESSEL' },
  ] as const;

  const viewTitles: Record<string, { title: string, subtitle: string }> = {
    status: { title: 'STATUS WINDOW', subtitle: 'Identity Dashboard & Attribute Matrix' },
    quests: { title: 'DAILY QUESTS', subtitle: 'Task Execution & Rewards' },
    hub: { title: 'SYSTEM HUB', subtitle: 'Central Control Node' },
    scheduler: { title: 'DIRECTIVES', subtitle: 'Schedule & Routines' },
    dungeons: { title: 'INSTANCES', subtitle: 'Combat & Challenges' },
    tactical: { title: 'GOALS', subtitle: 'Tactical Review' },
    training: { title: 'TRAINING ENGINE', subtitle: 'Executable Workout Plans & Active Logs' },
    nutrition: { title: 'DIETS & MACROS', subtitle: 'Metabolism & SQL Data House' },
    vessel: { title: 'VESSEL TRACKER', subtitle: 'Physical Body & Sleep Biometrics' },
    store: { title: 'SYSTEM STORE', subtitle: 'Resource Exchange' },
    ledger: { title: 'TREASURY', subtitle: 'Financial Ledger' },
    reviews: { title: 'WEEKLY REVIEW', subtitle: 'Performance Analysis' },
    settings: { title: 'SYSTEM SETTINGS', subtitle: 'Configuration' },
  };

  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const currentTitleInfo = viewTitles[currentView] || { title: 'SYSTEM', subtitle: 'Active Module' };

  return (
    <div className={cn(
      "min-h-screen bg-[#0A0A0A] text-[#E5E5E5] font-sans flex flex-col md:flex-row transition-all duration-500 relative border-2",
      themeClasses[uiTheme] || 'border-transparent',
      isPenalty && "bg-[#1A0505] border-red-900"
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
      <nav className={cn(
        "hidden md:flex md:flex-col md:w-64 border-r border-[#262626] bg-[#0A0A0A]/90 backdrop-blur-md z-50 p-4 overflow-y-auto custom-scrollbar space-y-2 transition-colors duration-500 relative",
        uiTheme === 'monarch' && "bg-[#05050A]/90 border-indigo-500/50 shadow-[10px_0_50px_-15px_rgba(99,102,241,0.4)]",
        uiTheme === 'national' && "border-cyan-500/20",
        uiTheme === 'sss' && "border-purple-500/20",
        uiTheme === 'ss' && "border-red-500/20",
        uiTheme === 's_plus' && "border-yellow-400/30",
        uiTheme === 's_class' && "border-purple-500/50 shadow-[10px_0_40px_-15px_rgba(168,85,247,0.3)]",
        uiTheme === 'elite' && "border-blue-500/20",
        isPenalty && "border-red-900/50 bg-[#1A0505]/90"
      )}>
        <div className="flex flex-col mb-8 px-4 relative">
          {uiTheme === 'monarch' && (
            <>
              <div className="absolute -top-4 -left-4 w-32 h-32 bg-indigo-500/30 rounded-full blur-3xl pointer-events-none animate-pulse" />
              <div className="absolute top-10 -right-4 w-20 h-20 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
            </>
          )}
          {uiTheme === 's_class' && (
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-purple-500/30 rounded-full blur-2xl pointer-events-none animate-pulse" />
          )}
          <h1 className={cn(
            "text-2xl font-bold tracking-tighter uppercase font-mono transition-all duration-500 relative z-10",
            isPenalty ? "text-red-500" : ""
          )} style={!isPenalty ? { color: themeColor, textShadow: `0 0 10px ${themeColor}80` } : {}}>
            {isPenalty ? 'PENALTY ZONE' : 
             uiTheme === 'monarch' ? 'MONARCH DOMAIN' : 
             uiTheme === 's_class' ? 'S-CLASS SYSTEM' : 
             'LIFE CONTROL SYSTEM'}
          </h1>
          
          {(user && !isGuest) ? (
            <div className="flex items-center mt-4 space-x-3 bg-[#141414] p-2 rounded-lg border border-[#262626]">
              {user.photoURL ? (
                <img src={user.photoURL} alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-[#262626]" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#262626] flex items-center justify-center">
                  <User className="w-4 h-4 text-[#A3A3A3]" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-mono text-white truncate">{user.displayName || user.email || 'User'}</p>
                <p className="text-[10px] font-mono text-[#A3A3A3] truncate">{user.email}</p>
              </div>
            </div>
          ) : userStats?.name ? (
            <div className="flex items-center mt-4 space-x-3 bg-[#141414] p-2 rounded-lg border border-[#262626]">
              {userStats.avatar ? (
                <img src={userStats.avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-[#262626]" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#262626] flex items-center justify-center">
                  <User className="w-4 h-4 text-[#A3A3A3]" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-mono text-white truncate">{userStats.name}</p>
                <p className="text-[10px] font-mono text-[#A3A3A3]">Lvl {Math.floor((userStats.xp || 0) / 1000) + 1} • {userStats.role || 'Player'}</p>
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar pr-1 py-2">
          {navCategories.map((category) => (
            <div key={category.title} className="space-y-1">
              <span className="text-[9px] font-mono font-bold tracking-widest text-[#555] px-3 uppercase block">
                {category.title}
              </span>
              <div className="space-y-0.5">
                {category.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setView(item.id as any)}
                    className={cn(
                      "w-full flex items-center space-x-3 p-2 rounded-md transition-all duration-200 relative",
                      currentView === item.id 
                        ? (isPenalty ? "bg-red-900/20 text-red-400" : "bg-[#1A1A1A]")
                        : "text-[#A3A3A3] hover:bg-[#141414] hover:text-white"
                    )}
                    style={currentView === item.id && !isPenalty ? { color: themeColor } : {}}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    <span className="text-xs font-mono uppercase tracking-wider">{item.label}</span>
                    {item.id === 'reviews' && pendingReviews.length > 0 && (
                      <span className="absolute top-2.5 right-3 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col mt-auto space-y-2">
          {user && !isGuest ? (
            <button
              onClick={logout}
              className="flex items-center space-x-3 p-3 rounded-lg text-[#A3A3A3] hover:bg-[#1A1A1A] hover:text-white transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Cloud Logout</span>
            </button>
          ) : (
            <button
              onClick={login}
              className="flex items-center space-x-3 p-3 rounded-lg text-[#A3A3A3] hover:bg-[#1A1A1A] hover:text-white transition-all"
            >
              <LogIn className="w-5 h-5" />
              <span className="text-sm font-medium">Cloud Login</span>
            </button>
          )}
          <button
            onClick={toggleCloak}
            className="flex items-center space-x-3 p-3 rounded-lg text-[#A3A3A3] hover:bg-[#1A1A1A] hover:text-white transition-all"
          >
            {isCloaked ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            <span className="text-sm font-medium">System Cloak</span>
          </button>
        </div>
      </nav>

      {/* Bottom Bar (Mobile) */}
      <nav className={cn(
        "md:hidden fixed bottom-0 left-0 right-0 border-t border-[#262626] bg-[#0A0A0A]/95 backdrop-blur-lg z-50 flex justify-around p-1 transition-colors duration-500",
        uiTheme === 'monarch' && "bg-[#05050A]/95 border-indigo-500/30",
        isPenalty && "border-red-900/50 bg-[#1A0505]/95"
      )}>
        {mobileNavItems.map((item) => {
          const isHub = item.id === 'hub';
          const isSelected = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id as any)}
              className={cn(
                "flex flex-col items-center justify-center p-1 rounded-lg transition-all duration-200 relative flex-1 min-w-0",
                isHub && "relative -top-2 bg-[#121824] border border-cyan-500/50 shadow-md shadow-cyan-950/50 rounded-xl px-1.5 py-1",
                isSelected
                  ? (isPenalty ? "text-red-400" : "")
                  : "text-[#666666] hover:text-[#A3A3A3]"
              )}
              style={isSelected && !isPenalty ? { color: themeColor } : {}}
            >
              <item.icon className={cn("w-5 h-5 mb-0.5", isHub && "text-cyan-400")} />
              <span className="text-[8px] sm:text-[9px] font-mono uppercase tracking-wider text-center truncate w-full px-0.5 font-bold">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Main Content */}
      <main className={cn(
        "flex-1 p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto no-scrollbar relative z-10 min-w-0",
        isCloaked && "blur-sm transition-all duration-300 hover:blur-none"
      )}>
        {/* Mobile Header */}
        <div className="md:hidden flex justify-between items-center mb-6 border-b border-[#262626] pb-4 gap-2">
          <div className="flex flex-col min-w-0 flex-1">
            <h1 
              className="text-base sm:text-lg font-black font-mono tracking-wider uppercase truncate" 
              style={{ color: themeColor, textShadow: `0 0 10px ${themeColor}40` }}
            >
              {currentTitleInfo.title}
            </h1>
            <p className="text-[9px] text-[#A3A3A3] font-mono uppercase tracking-wider mt-0.5 truncate">
              {currentTitleInfo.subtitle}
            </p>
          </div>
          
          <div className="flex space-x-2 items-center">
            <button 
              onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)} 
              className="p-2 bg-[#141414] hover:bg-[#262626] rounded-sm flex items-center justify-center transition-colors border border-[#262626]"
              title="Toggle Menu Navigation"
            >
              {isMobileDrawerOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5 text-cyan-400" />}
            </button>
            {user && !isGuest ? (
              <button onClick={logout} className="p-2 bg-[#141414] hover:bg-red-900/20 hover:text-red-400 rounded-sm flex items-center justify-center transition-colors border border-[#262626]" title="Cloud Logout">
                <LogOut className="w-4 h-4 text-[#A3A3A3]" />
              </button>
            ) : (
              <button onClick={login} className="p-2 bg-[#141414] hover:bg-[#262626] rounded-sm flex items-center justify-center transition-colors border border-[#262626]" title="Cloud Login">
                <LogIn className="w-4 h-4 text-[#A3A3A3]" />
              </button>
            )}
            <button onClick={() => setView('settings')} className="p-2 bg-[#141414] hover:bg-[#262626] rounded-sm flex items-center justify-center transition-colors border border-[#262626]">
              <Settings className="w-4 h-4 text-[#A3A3A3]" />
            </button>
            {user && !isGuest ? (
              <div className="w-10 h-10 rounded-sm overflow-hidden border border-[#262626] bg-[#141414]">
                {user.photoURL ? (
                   <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                   <div className="w-full h-full flex items-center justify-center"><User className="w-5 h-5 text-[#A3A3A3]" /></div>
                )}
              </div>
            ) : userStats?.avatar ? (
              <div className="w-10 h-10 rounded-sm overflow-hidden border border-[#262626] bg-[#141414]">
                <img src={userStats.avatar} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-sm bg-[#141414] flex items-center justify-center border border-[#262626]">
                <User className="w-5 h-5 text-[#A3A3A3]" />
              </div>
            )}
          </div>
        </div>

        {/* Mobile Full Navigation Overlay Drawer */}
        <AnimatePresence>
          {isMobileDrawerOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#0A0A0A] border-b border-[#262626] pb-6 mb-6 space-y-4 overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-2 p-2">
                {navCategories.flatMap(cat => cat.items).map((item: any) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setView(item.id as any);
                      setIsMobileDrawerOpen(false);
                    }}
                    className={cn(
                      "flex items-center space-x-2 p-2.5 rounded-sm border text-left transition-all",
                      currentView === item.id
                        ? "bg-[#1A1A1A] border-cyan-500/50 text-cyan-400 font-bold"
                        : "bg-[#141414] border-[#262626] text-[#A3A3A3] hover:text-white"
                    )}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    <span className="text-[11px] font-mono uppercase tracking-wider truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* View Content */}
        <motion.div
          key={currentView}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-5xl mx-auto"
        >
          {children}
        </motion.div>
        
        {/* Onboarding Guide Portal */}
        <OnboardingGuide themeColor={themeColor} />
      </main>
    </div>
  );
}
