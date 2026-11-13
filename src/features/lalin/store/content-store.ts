import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { MYTH_CARDS } from '@/features/content/data/myth-cards';
import { QUESTS } from '@/features/content/data/quests';
import type { MythCard, Quest } from '@/features/content/types/content';
import { supabase } from '@/lib/supabase';
import { zustandStorage } from '@/lib/storage';

interface ContentState {
  quests: Quest[];
  cards: MythCard[];
  refresh: () => Promise<void>;
}

interface QuestRow {
  id: string;
  world: Quest['world'];
  moon_phase: Quest['moonPhase'];
  title: string;
  description: string;
  xp: number;
  kind: Quest['kind'];
}

interface CardRow {
  id: string;
  category: MythCard['category'];
  statement: string;
  is_myth: boolean;
  explanation: string;
}

/** Quests and cards come from Supabase, with the bundled set as the offline fallback. */
export const useContentStore = create<ContentState>()(
  persist(
    (set) => ({
      quests: QUESTS,
      cards: MYTH_CARDS,
      refresh: async () => {
        const [q, c] = await Promise.all([
          supabase.from('quests').select('*'),
          supabase.from('myth_cards').select('*'),
        ]);
        const questRows = (q.data ?? []) as QuestRow[];
        const cardRows = (c.data ?? []) as CardRow[];
        if (questRows.length >= 8) {
          set({
            quests: questRows.map((r) => ({
              id: r.id,
              world: r.world,
              moonPhase: r.moon_phase,
              title: r.title,
              description: r.description,
              xp: r.xp,
              kind: r.kind,
            })),
          });
        }
        if (cardRows.length >= 5) {
          set({
            cards: cardRows.map((r) => ({
              id: r.id,
              category: r.category,
              statement: r.statement,
              isMyth: r.is_myth,
              explanation: r.explanation,
            })),
          });
        }
      },
    }),
    {
      name: 'lalin-content',
      storage: createJSONStorage(() => zustandStorage),
      partialize: (s) => ({ quests: s.quests, cards: s.cards }),
    },
  ),
);
