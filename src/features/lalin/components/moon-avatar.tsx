import Svg, { Circle, Ellipse, Path } from 'react-native-svg';

import type { AvatarID } from '@/features/content/data/worlds';
import { AvatarColors, Palette } from '@/constants/theme';

interface MoonAvatarProps {
  avatar: AvatarID;
  size?: number;
  sleepy?: boolean;
}

/** A little round moon with a face. Five colours, one character. */
export function MoonAvatar({ avatar, size = 48, sleepy }: MoonAvatarProps) {
  const c = AvatarColors[avatar] ?? AvatarColors.pearl;
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Circle cx="50" cy="52" r="42" fill={c.shade} />
      <Circle cx="48" cy="48" r="42" fill={c.body} />
      <Circle cx="30" cy="30" r="6" fill={c.shade} opacity={0.45} />
      <Circle cx="70" cy="70" r="4" fill={c.shade} opacity={0.45} />
      <Circle cx="72" cy="34" r="3" fill={c.shade} opacity={0.45} />
      {sleepy ? (
        <>
          <Path d="M32 52 Q38 57 44 52" stroke={Palette.cocoa} strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <Path d="M56 52 Q62 57 68 52" stroke={Palette.cocoa} strokeWidth="3.5" strokeLinecap="round" fill="none" />
        </>
      ) : (
        <>
          <Ellipse cx="38" cy="50" rx="4" ry="5" fill={Palette.cocoa} />
          <Ellipse cx="62" cy="50" rx="4" ry="5" fill={Palette.cocoa} />
          <Circle cx="39.5" cy="48" r="1.4" fill={Palette.white} />
          <Circle cx="63.5" cy="48" r="1.4" fill={Palette.white} />
        </>
      )}
      <Ellipse cx="28" cy="61" rx="6" ry="3.5" fill={Palette.coralRose} opacity={0.6} />
      <Ellipse cx="72" cy="61" rx="6" ry="3.5" fill={Palette.coralRose} opacity={0.6} />
      <Path d="M44 62 Q50 67 56 62" stroke={Palette.cocoa} strokeWidth="3" strokeLinecap="round" fill="none" />
    </Svg>
  );
}
