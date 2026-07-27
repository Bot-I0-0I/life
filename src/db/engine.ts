import { useEffect } from 'react';
import { db, seedDefaultHabitsIfEmpty } from './db';
import { format, startOfWeek, differenceInDays } from 'date-fns';
import { useLiveQuery } from 'dexie-react-hooks';

export function useSystemEngine() {
  const userStats = useLiveQuery(() => db.userStats.get(1));

  useEffect(() => {
    // Seed default bad habits if database is empty
    seedDefaultHabitsIfEmpty();

    const checkMidnightReset = async () => {
      if (!userStats) return;

      const today = format(new Date(), 'yyyy-MM-dd');

      // Update habit clean days dynamically
      try {
        const habits = await db.badHabits.where('active').equals(1).toArray();
        const now = new Date();
        for (const h of habits) {
          if (h.id && h.startDate) {
            const start = new Date(h.startDate);
            const calculatedClean = Math.max(0, differenceInDays(now, start));
            const newLongest = Math.max(h.longestCleanDays || 0, calculatedClean);
            if (h.cleanDays !== calculatedClean || h.longestCleanDays !== newLongest) {
              await db.badHabits.update(h.id, {
                cleanDays: calculatedClean,
                longestCleanDays: newLongest
              });
            }
          }
        }
      } catch (e) {
        console.warn('Habit days update warning:', e);
      }

      if (userStats.lastResetDate !== today) {
        // It's a new day. Check yesterday's quests.
        const yesterdayQuests = await db.quests
          .where('date')
          .equals(userStats.lastResetDate)
          .and(q => q.type === 'daily')
          .toArray();

        // Reset successful, generate new daily quests if needed
        await db.userStats.update(1, { 
          lastResetDate: today
        });
        
        // Duplicate yesterday's recurring quests for today
        const recurringQuests = yesterdayQuests.filter(q => q.isRecurring);
        const newQuests = recurringQuests.map(q => ({
          ...q,
          id: undefined,
          currentValue: 0,
          completed: false,
          date: today
        }));
        if (newQuests.length > 0) {
           await db.quests.bulkAdd(newQuests as any);
        }

        // Reset timetable recurring completion status for the new day
        const allTimetableBlocks = await db.timetable.toArray();
        for (const block of allTimetableBlocks) {
          if (block.id && block.lastCompletedDate !== today) {
            await db.timetable.update(block.id, { completedToday: false });
          }
        }
      }

      // Weekly Review Logic
      const todayDate = new Date();
      if (todayDate.getDay() === 0) { // Sunday
        const weekStart = format(startOfWeek(todayDate, { weekStartsOn: 1 }), 'yyyy-MM-dd');
        const existingReview = await db.weeklyReviews.where('weekStartDate').equals(weekStart).first();
        
        if (!existingReview) {
          await db.weeklyReviews.add({
            weekStartDate: weekStart,
            accomplishments: '',
            challenges: '',
            intentions: '',
            status: 'pending'
          });
        }
      }
    };

    checkMidnightReset();
    // Check every minute just in case the app is left open overnight
    const interval = setInterval(checkMidnightReset, 60000);
    return () => clearInterval(interval);
  }, [userStats]);

  return { userStats };
}
