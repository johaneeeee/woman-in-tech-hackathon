export type WorldID = 'body' | 'mind' | 'glow' | 'learn';

export type MoonTheme = 'new' | 'waxing' | 'full' | 'waning';

export type QuestKind = 'simple' | 'mood' | 'breathe' | 'journal' | 'cards';

export interface Quest {
  id: string;
  world: WorldID;
  moonPhase: MoonTheme;
  title: string;
  description: string;
  xp: number;
  kind: QuestKind;
}

export type MythCategory =
  | 'health'
  | 'sleep'
  | 'stress'
  | 'online'
  | 'body'
  | 'studies'
  | 'ocean';

export interface MythCard {
  id: string;
  category: MythCategory;
  statement: string;
  isMyth: boolean;
  explanation: string;
}

export interface World {
  id: WorldID;
  name: string;
  blurb: string;
  sf: string;
  md: string;
}

export interface Beach {
  id: number;
  name: string;
  title: string;
  timeOfDay: string;
  line: string;
  goal: number;
  fact: string;
}

export type MessageKey = 'proud' | 'keep_going' | 'thinking' | 'bravo';
