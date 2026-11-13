import type { MoonTheme } from '@/features/content/types/content';

/** Mean synodic month (new moon to new moon), in days. */
export const SYNODIC = 29.530588853;
/** A known new moon: 6 Jan 2000, 18:14 UTC. */
const REFERENCE_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14) / 86400000;
const DAY = 86400000;

export type PhaseName =
  | 'New moon'
  | 'Waxing crescent'
  | 'First quarter'
  | 'Waxing gibbous'
  | 'Full moon'
  | 'Waning gibbous'
  | 'Last quarter'
  | 'Waning crescent';

export interface MoonInfo {
  /** Days since the last new moon, 0..29.53 */
  age: number;
  /** 0..1 through the cycle; 0.5 = full */
  cycle: number;
  /** 0..1 of the disc lit */
  illumination: number;
  name: PhaseName;
  theme: MoonTheme;
  isFull: boolean;
  daysToFull: number;
  daysToNew: number;
  nextFullDate: Date;
}

export function moonAge(date: Date): number {
  const days = date.getTime() / DAY - REFERENCE_NEW_MOON;
  return ((days % SYNODIC) + SYNODIC) % SYNODIC;
}

function phaseName(age: number): PhaseName {
  if (age < 1.85) return 'New moon';
  if (age < 5.54) return 'Waxing crescent';
  if (age < 9.23) return 'First quarter';
  if (age < 13.29) return 'Waxing gibbous';
  if (age < 16.24) return 'Full moon';
  if (age < 20.3) return 'Waning gibbous';
  if (age < 23.99) return 'Last quarter';
  if (age < 27.68) return 'Waning crescent';
  return 'New moon';
}

function themeFor(name: PhaseName): MoonTheme {
  if (name === 'New moon') return 'new';
  if (name === 'Full moon') return 'full';
  if (name.startsWith('Waxing') || name === 'First quarter') return 'waxing';
  return 'waning';
}

export function getMoon(date: Date = new Date()): MoonInfo {
  const age = moonAge(date);
  const cycle = age / SYNODIC;
  const name = phaseName(age);
  const fullAge = SYNODIC / 2;
  const toFullRaw = (fullAge - age + SYNODIC) % SYNODIC;
  const daysToFull = Math.round(toFullRaw);
  const daysToNew = Math.round(SYNODIC - age);
  const isFull = name === 'Full moon';
  // Next full moon after this one if we are in it now
  const nextFullOffset = isFull ? toFullRaw + (toFullRaw < 2 ? SYNODIC : 0) : toFullRaw;
  const nextFullDate = new Date(date.getTime() + (isFull && toFullRaw < 2 ? SYNODIC + toFullRaw : nextFullOffset) * DAY);
  return {
    age,
    cycle,
    illumination: (1 - Math.cos(2 * Math.PI * cycle)) / 2,
    name,
    theme: themeFor(name),
    isFull,
    daysToFull,
    daysToNew,
    nextFullDate,
  };
}

export function moonCountdown(info: MoonInfo): string {
  if (info.isFull) return 'Full Moon Night';
  if (info.theme === 'waning' || info.name === 'New moon') {
    if (info.daysToNew <= 1) return 'new moon tomorrow';
    if (info.name === 'New moon') return `${info.daysToFull} days to full moon`;
    return `${info.daysToNew} days to new moon`;
  }
  if (info.daysToFull <= 1) return 'full moon tomorrow';
  return `${info.daysToFull} days to full moon`;
}

/**
 * SVG path of the lit part of a moon disc centred at (cx, cy) with radius r.
 * cycle: 0..1 (0 new, 0.5 full). Waxing is lit on the right (southern-hemisphere
 * viewers see it mirrored, but this is the familiar picture-book convention).
 */
export function litPath(cx: number, cy: number, r: number, cycle: number): string {
  const k = Math.cos(2 * Math.PI * cycle);
  const rx = Math.max(0.001, r * Math.abs(k));
  const top = `${cx} ${cy - r}`;
  const bottom = `${cx} ${cy + r}`;
  const waxing = cycle <= 0.5;
  const crescent = k > 0;
  if (waxing) {
    return `M ${top} A ${r} ${r} 0 0 1 ${bottom} A ${rx} ${r} 0 0 ${crescent ? 0 : 1} ${top} Z`;
  }
  return `M ${top} A ${r} ${r} 0 0 0 ${bottom} A ${rx} ${r} 0 0 ${crescent ? 1 : 0} ${top} Z`;
}

/** A lit fraction (0..1) as a waxing cycle position, for the Circle's shared moon. */
export function cycleForFraction(fraction: number): number {
  const f = Math.min(1, Math.max(0, fraction));
  return Math.acos(1 - 2 * f) / (2 * Math.PI);
}
