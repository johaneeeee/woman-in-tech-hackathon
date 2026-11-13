import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Palette } from '@/constants/theme';

export const STAR_PATH =
  'M50 8 C54 8 56 30 62 36 C68 42 92 42 92 50 C92 56 70 60 66 66 C62 72 62 92 50 92 C38 92 38 72 34 66 C30 60 8 56 8 50 C8 42 32 42 38 36 C44 30 46 8 50 8 Z';

export function SoftStar({ size = 18, filled = true }: { size?: number; filled?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Path d={STAR_PATH} fill={filled ? Palette.honeyDeep : Palette.milkDeep} />
    </Svg>
  );
}

export function StarRow({ stars, size = 18 }: { stars: number; size?: number }) {
  return (
    <View className="flex-row gap-1" accessibilityLabel={`${stars} of 3 stars`}>
      {[1, 2, 3].map((i) => (
        <SoftStar key={i} size={size} filled={i <= stars} />
      ))}
    </View>
  );
}
