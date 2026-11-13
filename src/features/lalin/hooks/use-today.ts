import { useContentStore } from '@/features/lalin/store/content-store';
import { useLalinStore } from '@/features/lalin/store/lalin-store';
import { dailyDeck, dailyQuests } from '@/features/lalin/utils/daily';
import { dayKey } from '@/lib/dates';
import { getMoon } from '@/lib/moon';

/** Everything that depends on today's date and moon: the four quests, the card deck, what is done. */
export function useToday() {
  const quests = useContentStore((s) => s.quests);
  const cards = useContentStore((s) => s.cards);
  const favorites = useLalinStore((s) => s.profile?.favorites ?? []);
  const completions = useLalinStore((s) => s.completions);
  const learn = useLalinStore((s) => s.learn);
  const day = dayKey();
  const moon = getMoon();
  const todays = dailyQuests(quests, day, moon.theme, favorites);
  const done = completions[day] ?? [];
  const learnQuest = todays.find((q) => q.world === 'learn');
  const deck = dailyDeck(cards, day, learnQuest?.id);
  const answers = learn[day] ?? [];
  return { day, moon, quests: todays, done, deck, answers, learnQuest };
}
