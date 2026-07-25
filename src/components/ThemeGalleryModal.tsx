import React from 'react';
import { X, Palette, Check, Sparkles, Sun, Moon, Shield, Zap, Eye, Terminal, LayoutGrid, Cpu, SlidersHorizontal } from 'lucide-react';
import { db } from '../db/db';
import { useStore, LayoutMode, DensityMode } from '../store/useStore';
import { cn } from '../lib/utils';

export interface ThemePreset {
  id: string;
  name: string;
  subtitle: string;
  badge: string;
  description: string;
  primaryColor: string;
  uiTheme: string;
  layoutMode: LayoutMode;
  densityMode: DensityMode;
  enableCRTScanlines: boolean;
  mode: 'dark' | 'light';
  bgClass: string;
  cardBg: string;
  borderColor: string;
  textColor: string;
  tags: string[];
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'solo_cyan',
    name: 'SOLO CYAN HUD',
    subtitle: 'Classic Cyberpunk RPG Engine',
    badge: 'DEFAULT HUD',
    description: 'Electric cyan HUD highlights, obsidian void canvas, scanline grid, floating status tickers and RPG side menu.',
    primaryColor: '#00F0FF',
    uiTheme: 'default',
    layoutMode: 'cyber_hud',
    densityMode: 'comfortable',
    enableCRTScanlines: false,
    mode: 'dark',
    bgClass: 'bg-[#0A0A0A]',
    cardBg: 'bg-[#141414]',
    borderColor: '#00F0FF',
    textColor: 'text-cyan-400',
    tags: ['Cyberpunk', 'RPG Standard', 'Side Navigation']
  },
  {
    id: 'retro_ascii',
    name: 'RETRO CRT TERMINAL',
    subtitle: 'Monochrome Phosphor & Scanline CRT',
    badge: 'RETRO DECK',
    description: 'Full 1980s retro ASCII terminal transformation! Phosphor green text, CRT scanline flicker, command prompt navigation, and ASCII frame cards.',
    primaryColor: '#00FF66',
    uiTheme: 'emerald_vessel',
    layoutMode: 'terminal_ascii',
    densityMode: 'compact',
    enableCRTScanlines: true,
    mode: 'dark',
    bgClass: 'bg-[#030A05]',
    cardBg: 'bg-[#08180E]',
    borderColor: '#00FF66',
    textColor: 'text-emerald-400',
    tags: ['CRT Scanlines', 'ASCII Frame', 'Retro Console']
  },
  {
    id: 'compact_tactical',
    name: 'TACTICAL BENTO DASHBOARD',
    subtitle: 'High-Density Multi-Column Command Grid',
    badge: 'TACTICAL BENTO',
    description: 'Ultra-dense Bento Grid layout with sticky top action toolbar, micro-sidebar, zero wasted space, and data-dense tactical gauges.',
    primaryColor: '#F59E0B',
    uiTheme: 'golden_national',
    layoutMode: 'compact_tactical',
    densityMode: 'compact',
    enableCRTScanlines: false,
    mode: 'dark',
    bgClass: 'bg-[#0C0A09]',
    cardBg: 'bg-[#1C1917]',
    borderColor: '#F59E0B',
    textColor: 'text-amber-400',
    tags: ['High Density', 'Bento Grid', 'Power User']
  },
  {
    id: 'glass_hologram',
    name: 'GLASS HOLOGRAM DOCK',
    subtitle: 'Translucent Glass & Floating Islands',
    badge: 'HOLOGRAM UI',
    description: 'Frosted glass panels with high backdrop-blur, floating glass dock navigation, rounded-2xl cards, and luminous violet ambient particles.',
    primaryColor: '#818CF8',
    uiTheme: 'monarch',
    layoutMode: 'glass_hologram',
    densityMode: 'spacious',
    enableCRTScanlines: false,
    mode: 'dark',
    bgClass: 'bg-[#05050A]',
    cardBg: 'bg-[#0E0E1A]/80 backdrop-blur-xl',
    borderColor: '#6366F1',
    textColor: 'text-indigo-400',
    tags: ['Backdrop Blur', 'Floating Glass', 'Rounded 2XL']
  },
  {
    id: 's_class_purple',
    name: 'ANIME OVERDRIVE HUD',
    subtitle: 'Radial Aura & Energetic Gaming HUD',
    badge: 'OVERDRIVE',
    description: 'Dynamic gaming anime HUD with pulsing aura particles, prominent rank emblems, energetic magenta gradients, and animated XP rings.',
    primaryColor: '#A855F7',
    uiTheme: 's_class',
    layoutMode: 'anime_overdrive',
    densityMode: 'comfortable',
    enableCRTScanlines: false,
    mode: 'dark',
    bgClass: 'bg-[#0F0716]',
    cardBg: 'bg-[#1A0B2E]',
    borderColor: '#A855F7',
    textColor: 'text-purple-400',
    tags: ['Anime Game', 'Dynamic Aura', 'Pulsing Glow']
  },
  {
    id: 'zen_minimalist',
    name: 'MINIMALIST ZEN STUDIO',
    subtitle: 'Clean Editorial Slate & High Contrast',
    badge: 'ZEN STUDIO',
    description: 'Spacious, high-legibility daylight slate interface. Clean drop shadows, elegant typography, generous margins, and no glowing borders.',
    primaryColor: '#2563EB',
    uiTheme: 'solar_daylight',
    layoutMode: 'zen_minimalist',
    densityMode: 'spacious',
    enableCRTScanlines: false,
    mode: 'light',
    bgClass: 'bg-[#F8FAFC]',
    cardBg: 'bg-white',
    borderColor: '#2563EB',
    textColor: 'text-blue-600',
    tags: ['Clean Editorial', 'Daylight Slate', 'Serene Spacing']
  }
];

interface ThemeGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentThemeColor?: string;
  currentUiTheme?: string;
}

export function ThemeGalleryModal({ isOpen, onClose, currentThemeColor, currentUiTheme }: ThemeGalleryModalProps) {
  const { theme, toggleTheme, layoutMode, setLayoutMode, setDensityMode, toggleCRTScanlines, enableCRTScanlines } = useStore();

  if (!isOpen) return null;

  const handleSelectTheme = async (preset: ThemePreset) => {
    // 1. Update userStats in DB
    const existing = await db.userStats.get(1);
    if (existing) {
      await db.userStats.update(1, {
        selectedColor: preset.primaryColor,
        uiTheme: preset.uiTheme,
      });
    }

    // 2. Set layout mode & density mode
    setLayoutMode(preset.layoutMode);
    setDensityMode(preset.densityMode);

    if (preset.enableCRTScanlines !== enableCRTScanlines) {
      toggleCRTScanlines();
    }

    // 3. Align light/dark mode state
    if ((preset.mode === 'light' && theme === 'dark') || (preset.mode === 'dark' && theme === 'light')) {
      toggleTheme();
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0A0A0A] border-2 border-[#333] rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-[#262626] bg-[#111] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#1C1C1C] rounded-lg border border-[#333]">
              <Palette className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                UI SYSTEM GALLERY & THEME SAMPLES
              </h2>
              <p className="text-xs font-mono text-[#A3A3A3]">
                Select a visual interface sample to transform the entire app layout, color scheme, and lighting.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#888] hover:text-white bg-[#1A1A1A] hover:bg-[#262626] rounded-lg border border-[#333] transition-all"
            title="Close Gallery"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content / Presets Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {THEME_PRESETS.map((preset) => {
              const isSelected = 
                (currentThemeColor?.toLowerCase() === preset.primaryColor.toLowerCase()) &&
                (currentUiTheme === preset.uiTheme);

              return (
                <div
                  key={preset.id}
                  onClick={() => handleSelectTheme(preset)}
                  className={cn(
                    "group relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 flex flex-col justify-between overflow-hidden",
                    isSelected
                      ? "border-cyan-400 bg-[#141414] shadow-[0_0_20px_rgba(0,240,255,0.2)]"
                      : "border-[#262626] bg-[#0E0E0E] hover:border-[#555] hover:bg-[#121212]"
                  )}
                >
                  {/* Active Indicator Badge */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 bg-cyan-500 text-black px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase flex items-center gap-1 shadow-md">
                      <Check className="w-3 h-3 stroke-[3]" /> ACTIVE THEME
                    </div>
                  )}

                  <div>
                    {/* Top Tag & Badge */}
                    <div className="flex items-center gap-2 mb-2">
                      <span 
                        className="text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase border"
                        style={{
                          backgroundColor: `${preset.primaryColor}15`,
                          color: preset.primaryColor,
                          borderColor: `${preset.primaryColor}40`
                        }}
                      >
                        {preset.badge}
                      </span>
                      <span className="text-[10px] font-mono text-[#777] uppercase flex items-center gap-1">
                        {preset.mode === 'light' ? <Sun className="w-3 h-3 text-amber-400" /> : <Moon className="w-3 h-3 text-indigo-400" />}
                        {preset.mode.toUpperCase()}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-mono font-bold text-white uppercase group-hover:text-cyan-300 transition-colors">
                      {preset.name}
                    </h3>
                    <p className="text-xs font-mono text-[#A3A3A3] mb-3">
                      {preset.subtitle}
                    </p>

                    {/* MINI LIVE PREVIEW BOX */}
                    <div 
                      className={cn(
                        "w-full rounded-lg p-3 mb-3 border relative overflow-hidden transition-all",
                        preset.bgClass
                      )}
                      style={{ borderColor: `${preset.primaryColor}50` }}
                    >
                      {/* Mini Header Bar */}
                      <div className="flex items-center justify-between border-b pb-2 mb-2" style={{ borderColor: `${preset.primaryColor}30` }}>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: preset.primaryColor }} />
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider" style={{ color: preset.primaryColor }}>
                            STATUS HUD
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-1.5 rounded-xs" style={{ backgroundColor: preset.primaryColor }} />
                          <span className="w-2 h-1.5 rounded-xs bg-[#444]" />
                        </div>
                      </div>

                      {/* Mini Cards Grid */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 rounded border" style={{ backgroundColor: `${preset.primaryColor}10`, borderColor: `${preset.primaryColor}30` }}>
                          <p className="text-[9px] font-mono text-[#888] uppercase">QUEST</p>
                          <p className="text-xs font-mono font-bold" style={{ color: preset.primaryColor }}>100 PUSHUPS</p>
                        </div>
                        <div className="p-2 rounded border bg-black/40 border-white/10">
                          <p className="text-[9px] font-mono text-[#888] uppercase">RANK</p>
                          <p className="text-xs font-mono font-bold text-white">LEVEL 25</p>
                        </div>
                      </div>

                      {/* Mini Button Preview */}
                      <div className="mt-2.5 flex items-center gap-2">
                        <div 
                          className="px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase text-black flex items-center justify-center gap-1 flex-1 shadow-sm"
                          style={{ backgroundColor: preset.primaryColor }}
                        >
                          <Zap className="w-3 h-3 fill-black" /> EXECUTE
                        </div>
                        <div className="px-2 py-1 rounded text-[10px] font-mono border text-[#888] bg-black/30 border-white/10">
                          100 XP
                        </div>
                      </div>
                    </div>

                    <p className="text-xs font-mono text-[#888] leading-relaxed mb-3">
                      {preset.description}
                    </p>
                  </div>

                  {/* Footer Tags & Select Action */}
                  <div className="pt-2 border-t border-[#222] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 flex-wrap">
                      {preset.tags.map(t => (
                        <span key={t} className="text-[9px] font-mono text-[#666] bg-[#181818] px-1.5 py-0.5 rounded">
                          #{t}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectTheme(preset);
                      }}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 whitespace-nowrap",
                        isSelected
                          ? "bg-cyan-500 text-black shadow-md shadow-cyan-950"
                          : "bg-[#1C1C1C] text-white hover:bg-[#2A2A2A] border border-[#333]"
                      )}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      {isSelected ? 'CURRENT UI' : 'APPLY SAMPLE'}
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#262626] bg-[#0E0E0E] flex items-center justify-between flex-wrap gap-2 text-xs font-mono text-[#888]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>Click any theme card to instantly transform your system experience.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#262626] text-white rounded-lg border border-[#333] transition-all uppercase font-bold"
          >
            CLOSE GALLERY
          </button>
        </div>

      </div>
    </div>
  );
}
