import { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { db as localDb } from './db/db';
import { db as cloudDb } from './firebase';
import { collection, doc, getDoc, getDocs, writeBatch, query, where } from 'firebase/firestore';
import { toast } from 'sonner';

export function useCloudSync() {
  const { user } = useAuth();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  useEffect(() => {
    if (!user) return;

    const syncData = async () => {
      setIsSyncing(true);
      try {
        const localStats = await localDb.userStats.get(1);
        const isLocalOwnedByUser = localStats && localStats.uid === user.uid;

        // Check if cloud has data
        const userStatsRef = doc(cloudDb, 'userStats', user.uid);
        const userStatsSnap = await getDoc(userStatsRef);

        if (!isLocalOwnedByUser) {
          const wasReset = localStorage.getItem('system_reset_pending');
          if (wasReset) {
            await clearCloudData(user.uid);
            localStorage.removeItem('system_reset_pending');
            try {
              await localDb.open();
              await new Promise(resolve => setTimeout(resolve, 500));
              await forceSync();
            } catch (e) {
              console.error("Delayed sync after reset failed:", e);
            }
          } else if (userStatsSnap.exists()) {
            // New device or account switch: pull from cloud
            await pullFromCloud(user.uid);
          } else {
            // First time login: push local guest data to cloud
            await pushToCloud(user.uid);
          }
        } else {
          // Page refresh / normal session: push local data to cloud backup
          await pushToCloud(user.uid);
        }
        setLastSync(new Date());
      } catch (error) {
        console.error("Sync error:", error);
        // Soft error notification
        toast.error("Cloud sync notice: local offline data preserved.");
      } finally {
        setIsSyncing(false);
      }
    };

    syncData();
  }, [user]);

  // Recursively sanitize objects for Firestore storage
  const cleanData = (obj: any): any => {
    if (obj === null || obj === undefined) return null;
    if (typeof obj !== 'object') {
      if (typeof obj === 'number' && Number.isNaN(obj)) return null;
      return obj;
    }
    if (Array.isArray(obj)) {
      return obj.map(item => cleanData(item)).filter(item => item !== undefined);
    }
    const cleaned: Record<string, any> = {};
    Object.keys(obj).forEach(key => {
      if (key === 'id') return; // Do not push Dexie auto-increment ID into body
      const val = obj[key];
      if (val === undefined || val === null || (typeof val === 'number' && Number.isNaN(val))) {
        return;
      }
      cleaned[key] = cleanData(val);
    });
    return cleaned;
  };

  const pushToCloud = async (uid: string) => {
    try {
      const chunks: Promise<void>[] = [];
      let currentBatch = writeBatch(cloudDb);
      let opCount = 0;

      const addToBatch = (ref: any, data: any) => {
        currentBatch.set(ref, data, { merge: true });
        opCount++;
        if (opCount >= 400) {
          chunks.push(currentBatch.commit());
          currentBatch = writeBatch(cloudDb);
          opCount = 0;
        }
      };

      // 1. User Stats
      const localStats = await localDb.userStats.get(1);
      if (localStats) {
        const statsRef = doc(cloudDb, 'userStats', uid);
        const cleanedStats = cleanData({ ...localStats, uid });
        addToBatch(statsRef, cleanedStats);
      }

      // Collections to sync
      const collectionsToSync: Array<{ name: string; table: any }> = [
        { name: 'quests', table: localDb.quests },
        { name: 'dungeons', table: localDb.dungeons },
        { name: 'inventory', table: localDb.inventory },
        { name: 'shopItems', table: localDb.shopItems },
        { name: 'vesselLogs', table: localDb.vesselLogs },
        { name: 'weeklyReviews', table: localDb.weeklyReviews },
        { name: 'tasks', table: localDb.tasks },
        { name: 'ledger', table: localDb.ledger },
        { name: 'nutritionLogs', table: localDb.nutritionLogs },
        { name: 'tacticalLogs', table: localDb.tacticalLogs },
        { name: 'missionLogs', table: localDb.missionLogs },
        { name: 'timetable', table: localDb.timetable },
        { name: 'badHabits', table: localDb.badHabits },
        { name: 'habitUrgeLogs', table: localDb.habitUrgeLogs },
        { name: 'systemLogs', table: localDb.systemLogs },
        { name: 'foodTemplates', table: localDb.foodTemplates },
        { name: 'questTemplates', table: localDb.questTemplates },
      ];

      for (const col of collectionsToSync) {
        try {
          const records = await col.table.toArray();
          records.forEach((rec: any) => {
            const docKey = `${uid}_${rec.id ?? Math.random().toString(36).substr(2, 9)}`;
            const ref = doc(cloudDb, col.name, docKey);
            addToBatch(ref, cleanData({ ...rec, uid }));
          });
        } catch (e) {
          console.warn(`Error reading local table ${col.name} for sync:`, e);
        }
      }

      if (opCount > 0) {
        chunks.push(currentBatch.commit());
      }

      await Promise.all(chunks);
      console.log("Cloud sync push complete.");
    } catch (error) {
      console.error("Push to cloud failed:", error);
      throw error;
    }
  };

  const pullFromCloud = async (uid: string) => {
    try {
      // 1. User Stats
      const statsSnap = await getDoc(doc(cloudDb, 'userStats', uid));
      if (statsSnap.exists()) {
        const data = statsSnap.data();
        const { uid: _, ...localData } = data;
        await localDb.userStats.put({ ...localData, id: 1, uid } as any);
      }

      // 2. Collections
      const collectionsToSync: Array<{ name: string; table: any }> = [
        { name: 'quests', table: localDb.quests },
        { name: 'dungeons', table: localDb.dungeons },
        { name: 'inventory', table: localDb.inventory },
        { name: 'shopItems', table: localDb.shopItems },
        { name: 'vesselLogs', table: localDb.vesselLogs },
        { name: 'weeklyReviews', table: localDb.weeklyReviews },
        { name: 'tasks', table: localDb.tasks },
        { name: 'ledger', table: localDb.ledger },
        { name: 'nutritionLogs', table: localDb.nutritionLogs },
        { name: 'tacticalLogs', table: localDb.tacticalLogs },
        { name: 'missionLogs', table: localDb.missionLogs },
        { name: 'timetable', table: localDb.timetable },
        { name: 'badHabits', table: localDb.badHabits },
        { name: 'habitUrgeLogs', table: localDb.habitUrgeLogs },
        { name: 'systemLogs', table: localDb.systemLogs },
        { name: 'foodTemplates', table: localDb.foodTemplates },
        { name: 'questTemplates', table: localDb.questTemplates },
      ];

      for (const col of collectionsToSync) {
        try {
          const q = query(collection(cloudDb, col.name), where("uid", "==", uid));
          const snap = await getDocs(q);
          const items = snap.docs.map(docSnap => {
            const data = docSnap.data();
            const { uid: _, ...localData } = data;
            const parts = docSnap.id.split('_');
            const rawId = parts.length > 1 ? parts[parts.length - 1] : docSnap.id;
            const parsedId = parseInt(rawId, 10);
            if (!Number.isNaN(parsedId) && parsedId > 0) {
              localData.id = parsedId;
            }
            return localData;
          }).filter(item => item && Object.keys(item).length > 0);

          if (items.length > 0) {
            await localDb.transaction('rw', col.table, async () => {
              await col.table.clear();
              await col.table.bulkAdd(items);
            });
          }
        } catch (colErr) {
          console.warn(`Pulling collection ${col.name} warning:`, colErr);
        }
      }

      toast.success("Cloud data restored successfully!");
    } catch (error) {
      console.error("Pull from cloud error:", error);
      throw error;
    }
  };

  const clearCloudData = async (uid: string) => {
    try {
      setIsSyncing(true);
      const collectionsNames = [
        'quests', 'dungeons', 'inventory', 'shopItems', 'vesselLogs', 
        'weeklyReviews', 'tasks', 'ledger', 'nutritionLogs', 
        'tacticalLogs', 'missionLogs', 'timetable', 'badHabits',
        'habitUrgeLogs', 'systemLogs', 'foodTemplates', 'questTemplates'
      ];

      const chunks: Promise<void>[] = [];
      let currentBatch = writeBatch(cloudDb);
      let opCount = 0;

      // Delete User Stats
      currentBatch.delete(doc(cloudDb, 'userStats', uid));
      opCount++;

      for (const collName of collectionsNames) {
        try {
          const q = query(collection(cloudDb, collName), where("uid", "==", uid));
          const snap = await getDocs(q);
          snap.docs.forEach(d => {
            currentBatch.delete(d.ref);
            opCount++;
            if (opCount >= 400) {
              chunks.push(currentBatch.commit());
              currentBatch = writeBatch(cloudDb);
              opCount = 0;
            }
          });
        } catch (e) {
          console.warn(`Clear collection ${collName} warning:`, e);
        }
      }

      if (opCount > 0) {
        chunks.push(currentBatch.commit());
      }
      await Promise.all(chunks);
      toast.success("Cloud data cleared");
    } catch (error) {
      console.error("Clear cloud error:", error);
      toast.error("Failed to clear cloud data");
    } finally {
      setIsSyncing(false);
    }
  };

  const forceSync = async () => {
    if (!user) return;
    setIsSyncing(true);
    try {
      await pushToCloud(user.uid);
      setLastSync(new Date());
      toast.success("Data synced to cloud!");
    } catch (error) {
      toast.error("Failed to force sync");
    } finally {
      setIsSyncing(false);
    }
  };

  return { isSyncing, lastSync, forceSync, clearCloudData };
}
