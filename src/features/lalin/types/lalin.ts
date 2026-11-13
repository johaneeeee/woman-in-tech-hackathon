import type { AvatarID } from '@/features/content/data/worlds';
import type { MoonTheme, WorldID } from '@/features/content/types/content';

export interface Profile {
  nickname: string;
  avatar: AvatarID;
  favorites: WorldID[];
  playerId: string;
}

export interface JournalEntry {
  id: string;
  day: string;
  questId: string;
  text: string;
}

export interface MoonLetter {
  id: string;
  writtenAt: string;
  unlockAt: string;
  text: string;
}

export interface LevelRecord {
  bestStars: number;
  bestScore: number;
  bestPlastic: number;
  plays: number;
}

export interface LearnAnswer {
  cardId: string;
  correct: boolean;
}

export interface CircleRef {
  id: string;
  code: string;
  name: string;
}

export interface QuestResult {
  levelBefore: number;
  levelAfter: number;
  healBefore: number;
  healAfter: number;
  energyAfter: number;
}

export interface RunRecordResult {
  newBest: boolean;
  unlockedNext: boolean;
  guardianUnlocked: boolean;
}

export interface LalinState {
  profile: Profile | null;
  completions: Record<string, string[]>;
  totalQuests: number;
  lastQuestDay: string | null;
  energy: number;
  xp: number;
  moods: Record<string, number>;
  journal: JournalEntry[];
  letters: MoonLetter[];
  levels: Record<string, LevelRecord>;
  totalPlastic: number;
  guardian: boolean;
  themeCounts: Record<MoonTheme, number>;
  fullMoonNights: string[];
  learn: Record<string, LearnAnswer[]>;
  circle: CircleRef | null;
  missionSignedUp: boolean;
  soundOn: boolean;
  ambientOn: boolean;
  seenTutorial: boolean;

  finishOnboarding: (profile: Profile) => void;
  completeQuest: (questId: string, xp: number, theme: MoonTheme, isFullMoon: boolean) => QuestResult;
  logMood: (value: number) => void;
  addJournal: (questId: string, text: string) => void;
  answerCard: (cardId: string, correct: boolean) => void;
  writeLetter: (text: string, unlockAt: string) => void;
  spendEnergy: () => boolean;
  recordRun: (level: number, stars: number, score: number, plastic: number) => RunRecordResult;
  setCircle: (circle: CircleRef | null) => void;
  setMissionSignedUp: (value: boolean) => void;
  toggleSound: () => void;
  toggleAmbient: () => void;
  markTutorialSeen: () => void;
}
