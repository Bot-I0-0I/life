import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type LayoutMode = 'cyber_hud' | 'terminal_ascii' | 'compact_tactical' | 'glass_hologram' | 'zen_minimalist' | 'anime_overdrive';
export type DensityMode = 'comfortable' | 'compact' | 'spacious';

interface AppState {
  isCloaked: boolean;
  theme: 'dark' | 'light';
  layoutMode: LayoutMode;
  densityMode: DensityMode;
  enableCRTScanlines: boolean;
  currentView: 'status' | 'quests' | 'dungeons' | 'tactical' | 'store' | 'reviews' | 'scheduler' | 'ledger' | 'settings' | 'nutrition' | 'hub' | 'vessel' | 'training' | 'timetable';
  levelUpModal: number | null;
  showActiveQuestTicker: boolean;
  showAttributeProgressBars: boolean;
  showRadarChart: boolean;
  showMuscleFigurine: boolean;
  toggleCloak: () => void;
  toggleTheme: () => void;
  setLayoutMode: (mode: LayoutMode) => void;
  setDensityMode: (density: DensityMode) => void;
  toggleCRTScanlines: () => void;
  setView: (view: 'status' | 'quests' | 'dungeons' | 'tactical' | 'store' | 'reviews' | 'scheduler' | 'ledger' | 'settings' | 'nutrition' | 'hub' | 'vessel' | 'training' | 'timetable') => void;
  setLevelUpModal: (level: number | null) => void;
  toggleHUDComponent: (key: 'showActiveQuestTicker' | 'showAttributeProgressBars' | 'showRadarChart' | 'showMuscleFigurine') => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      isCloaked: false,
      theme: 'dark',
      layoutMode: 'cyber_hud',
      densityMode: 'comfortable',
      enableCRTScanlines: false,
      currentView: 'status',
      levelUpModal: null,
      showActiveQuestTicker: true,
      showAttributeProgressBars: true,
      showRadarChart: true,
      showMuscleFigurine: true,
      toggleCloak: () => set((state) => ({ isCloaked: !state.isCloaked })),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      setLayoutMode: (mode) => set({ layoutMode: mode }),
      setDensityMode: (density) => set({ densityMode: density }),
      toggleCRTScanlines: () => set((state) => ({ enableCRTScanlines: !state.enableCRTScanlines })),
      setView: (view) => set({ currentView: view }),
      setLevelUpModal: (level) => set({ levelUpModal: level }),
      toggleHUDComponent: (key) => set((state) => ({ [key]: !state[key] })),
    }),
    {
      name: 'system-ui-storage',
    }
  )
);
