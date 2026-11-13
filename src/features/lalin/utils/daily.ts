import { LEARN_QUEST_CATEGORY } from '@/features/content/data/quests';
import { WORLD_ORDER } from '@/features/content/data/worlds';
import type { MoonTheme, MythCard, Quest, WorldID } from '@/features/content/types/content';
import { hash } from '@/lib/dates';

/** Today's four quests, one per world, picked from the moon's theme. Favourite worlds first. */
export function dailyQuests(all: Quest[], day: string, theme: MoonTheme, favorites: WorldID[]): Quest[] {
  const order = [...favorites, ...WORLD_ORDER.filter((w) => !favorites.includes(w))];
  return order
    .map((world) => {
      const themed = all.filter((q) => q.world === world && q.moonPhase === theme);
      const pool = themed.length > 0 ? themed : all.filter((q) => q.world === world);
      return pool[hash(`${day}:${world}`) % pool.length];
    })
    .filter((q): q is Quest => Boolean(q));
}

/** Today's five Myth or Fact cards. Leans on the Learn quest's topic. */
export function dailyDeck(cards: MythCard[], day: string, learnQuestId: string | undefined): MythCard[] {
  const category = learnQuestId ? LEARN_QUEST_CATEGORY[learnQuestId] : undefined;
  const shuffled = [...cards].sort((a, b) => hash(`${day}:${a.id}`) - hash(`${day}:${b.id}`));
  const topical = shuffled.filter((c) => c.category === category).slice(0, 2);
  const rest = shuffled.filter((c) => !topical.includes(c));
  return [...topical, ...rest].slice(0, 5);
}
