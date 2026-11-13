import type { Beach, MessageKey, MoonTheme, World, WorldID } from '@/features/content/types/content';

export const WORLDS: Record<WorldID, World> = {
  body: { id: 'body', name: 'Body', blurb: 'Water, walks, sleep', sf: 'drop.fill', md: 'water_drop' },
  mind: { id: 'mind', name: 'Mind', blurb: 'Moods, breath, one line', sf: 'moon.stars.fill', md: 'bedtime' },
  glow: { id: 'glow', name: 'Glow', blurb: 'Small brave things', sf: 'sparkles', md: 'auto_awesome' },
  learn: { id: 'learn', name: 'Learn', blurb: 'Myth or Fact', sf: 'book.fill', md: 'menu_book' },
};

export const WORLD_ORDER: WorldID[] = ['body', 'mind', 'glow', 'learn'];

export const MOON_THEME_COPY: Record<MoonTheme, { name: string; line: string }> = {
  new: { name: 'Set intentions', line: 'New moon. A clean page for the month.' },
  waxing: { name: 'Build habits', line: 'The moon is growing. So are your habits.' },
  full: { name: 'Celebrate and connect', line: 'Full moon. Find your people.' },
  waning: { name: 'Rest and reflect', line: 'The moon is getting smaller. Go easy.' },
};

export const BEACHES: Beach[] = [
  { id: 1, name: 'Flic en Flac', title: 'First Light', timeOfDay: 'Dawn', line: 'The west coast is waking up. Crabs are out, and so is the plastic.', goal: 20, fact: 'Flic en Flac has one of the longest beaches on the island, around 8 km of sand on the west coast.' },
  { id: 2, name: 'Blue Bay', title: 'Coral Garden', timeOfDay: 'Early morning', line: 'Rocks along the shore and coral just beyond. Step lightly.', goal: 30, fact: 'Blue Bay Marine Park is a protected area with dozens of coral species and lots of reef fish.' },
  { id: 3, name: 'Belle Mare', title: 'Windy Shore', timeOfDay: 'Daylight', line: 'The east wind is strong today. It will push you around.', goal: 40, fact: 'Belle Mare faces the trade winds that blow across the Indian Ocean for much of the year.' },
  { id: 4, name: 'Le Morne', title: 'Mountain Shadow', timeOfDay: 'Afternoon', line: 'Waves cross the sand under the mountain. Nets wash up here.', goal: 50, fact: 'Le Morne Brabant is a UNESCO World Heritage Site, a symbol of freedom and resistance to slavery.' },
  { id: 5, name: 'Grand Baie', title: 'Busy Bay', timeOfDay: 'Late afternoon', line: 'Boats everywhere, and more plastic than anywhere else.', goal: 60, fact: 'Ghost nets, fishing nets lost at sea, keep catching turtles and fish for years. Every net removed matters.' },
  { id: 6, name: 'Île aux Cerfs', title: 'Glowing Lagoon', timeOfDay: 'Golden sunset', line: 'The last beach. The moon is rising and the water glows.', goal: 80, fact: 'Some plankton glow blue when the water moves. It is called bioluminescence.' },
];

export const MESSAGES: Record<MessageKey, string> = {
  proud: 'Proud of you',
  keep_going: 'Keep going',
  thinking: 'Thinking of you',
  bravo: 'Bravo',
};

export const MESSAGE_KEYS: MessageKey[] = ['proud', 'keep_going', 'thinking', 'bravo'];

export const MOODS = [
  { value: 1, label: 'Heavy' },
  { value: 2, label: 'Low' },
  { value: 3, label: 'Okay' },
  { value: 4, label: 'Good' },
  { value: 5, label: 'Bright' },
] as const;

export const AVATARS = [
  { id: 'pearl', name: 'Pearl' },
  { id: 'honey', name: 'Honey' },
  { id: 'peach', name: 'Peach' },
  { id: 'lagoon', name: 'Lagoon' },
  { id: 'mist', name: 'Mist' },
] as const;

export type AvatarID = (typeof AVATARS)[number]['id'];

export const CIRCLE_NAMES = ['Moonrise', 'Tidepool', 'Reef Girls', 'Night Swim', 'Coral Club', 'Low Tide', 'Lagon Lalin', 'Shell Crew'];

export const COMMUNITY_GOAL = 10000;
