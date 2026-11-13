import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { LalinState } from '@/features/lalin/types/lalin';
import { lagoonHeal, lagoonLevel } from '@/features/lalin/utils/lagoon';
import { dayKey } from '@/lib/dates';
import { zustandStorage } from '@/lib/storage';

const MAX_ENERGY = 9;

function uid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export const useLalinStore = create<LalinState>()(
  persist(
    (set, get) => ({
      profile: null,
      completions: {},
      totalQuests: 0,
      lastQuestDay: null,
      energy: 3,
      xp: 0,
      moods: {},
      journal: [],
      letters: [],
      levels: {},
      totalPlastic: 0,
      guardian: false,
      themeCounts: { new: 0, waxing: 0, full: 0, waning: 0 },
      fullMoonNights: [],
      learn: {},
      circle: null,
      missionSignedUp: false,
      soundOn: true,
      ambientOn: false,
      seenTutorial: false,

      finishOnboarding: (profile) => set({ profile }),

      completeQuest: (questId, xp, theme, isFullMoon) => {
        const s = get();
        const today = dayKey();
        const done = s.completions[today] ?? [];
        const levelBefore = lagoonLevel(s.totalQuests);
        const healBefore = lagoonHeal(s.totalQuests);
        if (done.includes(questId)) {
          return { levelBefore, levelAfter: levelBefore, healBefore, healAfter: healBefore, energyAfter: s.energy };
        }
        const total = s.totalQuests + 1;
        const energy = Math.min(MAX_ENERGY, s.energy + 1);
        set({
          completions: { ...s.completions, [today]: [...done, questId] },
          totalQuests: total,
          lastQuestDay: today,
          energy,
          xp: s.xp + xp,
          themeCounts: { ...s.themeCounts, [theme]: (s.themeCounts[theme] ?? 0) + 1 },
          fullMoonNights: isFullMoon && !s.fullMoonNights.includes(today) ? [...s.fullMoonNights, today] : s.fullMoonNights,
        });
        return { levelBefore, levelAfter: lagoonLevel(total), healBefore, healAfter: lagoonHeal(total), energyAfter: energy };
      },

      logMood: (value) => set((s) => ({ moods: { ...s.moods, [dayKey()]: value } })),

      addJournal: (questId, text) =>
        set((s) => ({ journal: [{ id: uid(), day: dayKey(), questId, text }, ...s.journal] })),

      answerCard: (cardId, correct) =>
        set((s) => {
          const today = dayKey();
          const answers = s.learn[today] ?? [];
          if (answers.some((a) => a.cardId === cardId)) return s;
          return { learn: { ...s.learn, [today]: [...answers, { cardId, correct }] }, xp: s.xp + (correct ? 3 : 1) };
        }),

      writeLetter: (text, unlockAt) =>
        set((s) => ({ letters: [{ id: uid(), writtenAt: new Date().toISOString(), unlockAt, text }, ...s.letters] })),

      spendEnergy: () => {
        const s = get();
        if (s.energy < 1) return false;
        set({ energy: s.energy - 1 });
        return true;
      },

      recordRun: (level, stars, score, plastic) => {
        const s = get();
        const key = String(level);
        const prev = s.levels[key] ?? { bestStars: 0, bestScore: 0, bestPlastic: 0, plays: 0 };
        const unlockedNext = prev.bestStars === 0 && stars > 0 && level < 6;
        const guardianUnlocked = level === 6 && stars > 0 && !s.guardian;
        set({
          levels: {
            ...s.levels,
            [key]: {
              bestStars: Math.max(prev.bestStars, stars),
              bestScore: Math.max(prev.bestScore, score),
              bestPlastic: Math.max(prev.bestPlastic, plastic),
              plays: prev.plays + 1,
            },
          },
          totalPlastic: s.totalPlastic + plastic,
          xp: s.xp + stars * 5,
          guardian: s.guardian || guardianUnlocked,
        });
        return { newBest: score > prev.bestScore, unlockedNext, guardianUnlocked };
      },

      setCircle: (circle) => set({ circle }),
      setMissionSignedUp: (missionSignedUp) => set({ missionSignedUp }),
      toggleSound: () => set((s) => ({ soundOn: !s.soundOn })),
      toggleAmbient: () => set((s) => ({ ambientOn: !s.ambientOn })),
      markTutorialSeen: () => set({ seenTutorial: true }),
    }),
    {
      name: 'lalin',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);

export function totalStars(levels: Record<string, { bestStars: number }>): number {
  return Object.values(levels).reduce((sum, l) => sum + l.bestStars, 0);
}

export function isLevelUnlocked(levels: Record<string, { bestStars: number }>, level: number): boolean {
  if (level === 1) return true;
  return (levels[String(level - 1)]?.bestStars ?? 0) >= 1;
}
