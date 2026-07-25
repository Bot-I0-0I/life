/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, Suspense, lazy } from 'react';
import { Layout } from './components/Layout';
import { LevelUpModal } from './components/LevelUpModal';
import { useStore } from './store/useStore';
import { useSystemEngine } from './db/engine';
import { useCloudSync } from './useCloudSync';
import { Toaster } from 'sonner';
import { Loader2 } from 'lucide-react';

// Lazy loading views for code separation and instant page responsiveness
const StatusView = lazy(() => import('./views/StatusView').then(m => ({ default: m.StatusView })));
const DungeonView = lazy(() => import('./views/DungeonView').then(m => ({ default: m.DungeonView })));
const MissionAnalyticsView = lazy(() => import('./views/MissionAnalyticsView').then(m => ({ default: m.MissionAnalyticsView })));
const StoreView = lazy(() => import('./views/StoreView').then(m => ({ default: m.StoreView })));
const ReviewView = lazy(() => import('./views/ReviewView').then(m => ({ default: m.ReviewView })));
const SchedulerView = lazy(() => import('./views/SchedulerView').then(m => ({ default: m.SchedulerView })));
const LedgerView = lazy(() => import('./views/LedgerView').then(m => ({ default: m.LedgerView })));
const SettingsView = lazy(() => import('./views/SettingsView').then(m => ({ default: m.SettingsView })));
const NutritionView = lazy(() => import('./views/NutritionView').then(m => ({ default: m.NutritionView })));
const HubView = lazy(() => import('./views/HubView').then(m => ({ default: m.HubView })));
const VesselTrackerView = lazy(() => import('./views/VesselTrackerView').then(m => ({ default: m.VesselTrackerView })));
const TrainingView = lazy(() => import('./views/TrainingView').then(m => ({ default: m.TrainingView })));
const TimetableScheduleView = lazy(() => import('./views/TimetableScheduleView').then(m => ({ default: m.TimetableScheduleView })));

function ViewLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      <span className="text-xs font-mono text-[#888] tracking-widest uppercase animate-pulse">
        INITIALIZING CHANNEL SUBSYSTEM...
      </span>
    </div>
  );
}

export default function App() {
  // Initialize background engine
  useSystemEngine();
  // Initialize cloud sync
  useCloudSync();

  const currentView = useStore((state) => state.currentView);
  const theme = useStore((state) => state.theme);
  const levelUpModal = useStore((state) => state.levelUpModal);
  const setLevelUpModal = useStore((state) => state.setLevelUpModal);

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
  }, [theme]);

  const renderActiveView = () => {
    switch (currentView) {
      case 'status': return <StatusView />;
      case 'scheduler': return <SchedulerView initialTab="directives" />;
      case 'timetable': return <TimetableScheduleView />;
      case 'dungeons': return <DungeonView />;
      case 'tactical': return <MissionAnalyticsView />;
      case 'store': return <StoreView />;
      case 'ledger': return <LedgerView />;
      case 'reviews': return <ReviewView />;
      case 'nutrition': return <NutritionView />;
      case 'training': return <TrainingView />;
      case 'vessel': return <VesselTrackerView />;
      case 'settings': return <SettingsView />;
      case 'hub':
      default:
        return <HubView />;
    }
  };

  return (
    <>
      <Toaster 
        theme={theme === 'light' ? 'light' : 'dark'} 
        position="top-center" 
        style={{ zIndex: 999999 }}
      />
      <Layout>
        <Suspense fallback={<ViewLoader />}>
          {renderActiveView()}
        </Suspense>

        {levelUpModal !== null && (
          <LevelUpModal level={levelUpModal} onClose={() => setLevelUpModal(null)} />
        )}
      </Layout>
    </>
  );
}
