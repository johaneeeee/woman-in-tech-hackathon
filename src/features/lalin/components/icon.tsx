import { SymbolView } from 'expo-symbols';
import type { SFSymbol } from 'sf-symbols-typescript';
import type { ComponentProps } from 'react';

import { Palette } from '@/constants/theme';

type AndroidName = Extract<ComponentProps<typeof SymbolView>['name'], { android?: unknown }>['android'];

interface IconProps {
  sf: string;
  md: string;
  size?: number;
  color?: string;
}

/** SF Symbol on iOS, Material Symbol on Android. */
export function Icon({ sf, md, size = 18, color = Palette.cocoa }: IconProps) {
  return <SymbolView name={{ ios: sf as SFSymbol, android: md as AndroidName }} size={size} tintColor={color} />;
}
