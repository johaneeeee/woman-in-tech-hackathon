/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

/**
 * Lalin's art palette. Illustrations (lagoon, map, runs, moons) are drawn in SVG and
 * take real color values, so they live here, mirroring the tokens in src/global.css.
 */
export const Palette = {
  milk: '#FFF6EF',
  milkDeep: '#FBEADF',
  cocoa: '#4A3B47',
  cocoaSoft: '#8C7A86',
  peach: '#FFC9B5',
  peachDeep: '#F4A78F',
  clay: '#D9826B',
  mint: '#BFE8DF',
  honey: '#FFE3A8',
  honeyDeep: '#F7C96B',
  mist: '#CFE0F5',
  lavender: '#E3D7F7',
  lavenderDeep: '#C7B4EA',
  turquoise: '#7FD6C7',
  turquoiseDeep: '#4FB8A8',
  white: '#FFFFFF',
  // murky lagoon (before healing)
  fog: '#E4DEDA',
  fogWater: '#C9C3BF',
  fogDeep: '#B3ADA9',
  fogCoral: '#D6CFCA',
  // healed coral
  coralRose: '#FFB3A7',
  coralPeach: '#FFC9B5',
  coralHoney: '#FFD98A',
  coralLilac: '#D5C2F2',
  sand: '#F6DFC2',
  sandDeep: '#EBCBA4',
  plastic: '#A9C7D9',
  plasticCap: '#7FA3BB',
  bag: '#EEF1F3',
  net: '#9BB7A6',
  rock: '#B9A9A3',
  crab: '#F49C84',
  boat: '#F2E6DA',
  boatSail: '#FFFFFF',
  hill: '#D9CBE0',
  hillDeep: '#C2B0CF',
  leaf: '#9ED3B8',
  glow: '#B9FFF1',
  shadow: 'rgba(74, 59, 71, 0.10)',
  scrim: 'rgba(74, 59, 71, 0.35)',
} as const;

export const WorldColors = {
  body: '#FFC9B5',
  mind: '#BFE8DF',
  glow: '#FFE3A8',
  learn: '#CFE0F5',
} as const;

export const WorldInk = {
  body: '#C86F55',
  mind: '#3E9C8B',
  glow: '#B98A1E',
  learn: '#5584BB',
} as const;

export const BeachColors = ['#FFC9B5', '#7FD6C7', '#CFE0F5', '#C7B4EA', '#F7C96B', '#4FB8A8'] as const;

export const AvatarColors = {
  pearl: { body: '#E3D7F7', shade: '#C7B4EA' },
  honey: { body: '#FFE3A8', shade: '#F7C96B' },
  peach: { body: '#FFC9B5', shade: '#F4A78F' },
  lagoon: { body: '#BFE8DF', shade: '#7FD6C7' },
  mist: { body: '#CFE0F5', shade: '#A7C3E6' },
} as const;

export const ConfettiColors = ['#FFC9B5', '#BFE8DF', '#FFE3A8', '#CFE0F5', '#E3D7F7', '#7FD6C7'] as const;

/** Soft warm depth: one diffuse cocoa-tinted shadow, never a hard edge. */
export const softShadow = { boxShadow: '0 12px 32px rgba(74, 59, 71, 0.10)' } as const;
export const liftShadow = { boxShadow: '0 8px 20px rgba(74, 59, 71, 0.14)' } as const;

/** Lalin Run skies per beach: [sky top, sky bottom, sea, sand]. Dawn on beach 1, golden sunset on 6. */
export const RunSkies = [
  ['#FFD9C9', '#FFF1E6', '#9ED9CF', '#F6DFC2'],
  ['#CFE7F2', '#FFF4EA', '#6FCBBE', '#F4E2C8'],
  ['#BFDDF5', '#EEF6FB', '#7EC8D8', '#F3E0C4'],
  ['#E9D3EC', '#FFEBDD', '#79BFC4', '#EBD2B4'],
  ['#FFD38F', '#FFE9C9', '#5FB7B9', '#F0D3AE'],
  ['#F7A98B', '#FFD7A6', '#4FA3B0', '#EDC9A0'],
] as const;
