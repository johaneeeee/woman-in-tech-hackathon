import Svg, { Circle, Path } from 'react-native-svg';

import { Palette } from '@/constants/theme';
import { litPath } from '@/lib/moon';

interface MoonShapeProps {
  /** 0..1 through the cycle (0 new, 0.5 full). */
  cycle: number;
  size?: number;
  lit?: string;
  dark?: string;
}

export function MoonShape({ cycle, size = 28, lit = Palette.honey, dark = Palette.lavender }: MoonShapeProps) {
  const near = Math.abs(cycle - 0.5) < 0.012;
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Circle cx="50" cy="50" r="46" fill={dark} />
      {near ? <Circle cx="50" cy="50" r="46" fill={lit} /> : <Path d={litPath(50, 50, 46, cycle)} fill={lit} />}
      <Circle cx="38" cy="36" r="6" fill={Palette.honeyDeep} opacity={0.25} />
      <Circle cx="62" cy="64" r="4" fill={Palette.honeyDeep} opacity={0.2} />
    </Svg>
  );
}
