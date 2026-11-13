import { daysBetween, dayKey } from '@/lib/dates';

export const LAGOON_LEVELS = [
  { name: 'Misty Lagoon', line: 'Grey water, a bit of plastic. It is waiting for you.' },
  { name: 'Waking Reef', line: 'The water is clearing. Something pink is growing.' },
  { name: 'Coral Bloom', line: 'Coral everywhere. The plastic is almost gone.' },
  { name: 'Turtle Bay', line: 'A turtle moved in. That is a big deal.' },
  { name: 'Glowing Lagoon', line: 'Clear, alive and glowing at night. You did this.' },
] as const;

/** Total quests needed to reach each lagoon level. */
export const LAGOON_THRESHOLDS = [0, 2, 5, 10, 18] as const;

export function lagoonLevel(total: number): number {
  let level = 0;
  LAGOON_THRESHOLDS.forEach((t, i) => {
    if (total >= t) level = i;
  });
  return level;
}

/** 0..1: how healed the lagoon looks. Each level is a quarter, filled in between. */
export function lagoonHeal(total: number): number {
  const level = lagoonLevel(total);
  if (level >= LAGOON_THRESHOLDS.length - 1) return 1;
  const from = LAGOON_THRESHOLDS[level];
  const to = LAGOON_THRESHOLDS[level + 1];
  return (level + (total - from) / (to - from)) / (LAGOON_THRESHOLDS.length - 1);
}

export function questsToNextLevel(total: number): number | null {
  const level = lagoonLevel(total);
  if (level >= LAGOON_THRESHOLDS.length - 1) return null;
  return LAGOON_THRESHOLDS[level + 1] - total;
}

/** The lagoon fades after three days without a quest. */
export function isLagoonQuiet(lastQuestDay: string | null, total: number): boolean {
  if (!lastQuestDay || total === 0) return false;
  return daysBetween(lastQuestDay, dayKey()) >= 3;
}

export function currentStreak(completions: Record<string, string[]>): number {
  const today = dayKey();
  let cursor = today;
  let streak = 0;
  if (!(completions[today]?.length > 0)) {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    cursor = dayKey(d);
  }
  while (completions[cursor]?.length > 0) {
    streak += 1;
    const [y, m, dd] = cursor.split('-').map(Number);
    cursor = dayKey(new Date(y, m - 1, dd - 1));
  }
  return streak;
}
