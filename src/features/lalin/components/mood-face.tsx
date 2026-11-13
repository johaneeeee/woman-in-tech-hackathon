import Svg, { Circle, Path } from 'react-native-svg';

import { Palette } from '@/constants/theme';

const FACE_COLORS = [Palette.mist, Palette.lavender, Palette.mint, Palette.honey, Palette.peach];

const MOUTHS = [
  'M36 68 Q50 58 64 68',
  'M37 66 Q50 62 63 66',
  'M37 64 L63 64',
  'M36 62 Q50 70 64 62',
  'M34 60 Q50 76 66 60',
];

interface MoodFaceProps {
  value: number;
  size?: number;
  dim?: boolean;
}

/** Five soft faces, from heavy to bright. Feelings only, no scores. */
export function MoodFace({ value, size = 44, dim }: MoodFaceProps) {
  const i = Math.max(0, Math.min(4, value - 1));
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" opacity={dim ? 0.35 : 1}>
      <Circle cx="50" cy="50" r="44" fill={FACE_COLORS[i]} />
      {i === 0 ? (
        <>
          <Path d="M32 46 Q38 50 44 46" stroke={Palette.cocoa} strokeWidth="4" strokeLinecap="round" fill="none" />
          <Path d="M56 46 Q62 50 68 46" stroke={Palette.cocoa} strokeWidth="4" strokeLinecap="round" fill="none" />
        </>
      ) : (
        <>
          <Circle cx="38" cy="45" r="4.5" fill={Palette.cocoa} />
          <Circle cx="62" cy="45" r="4.5" fill={Palette.cocoa} />
        </>
      )}
      <Path d={MOUTHS[i]} stroke={Palette.cocoa} strokeWidth="4" strokeLinecap="round" fill="none" />
      {i === 4 ? (
        <>
          <Circle cx="27" cy="58" r="6" fill={Palette.coralRose} opacity={0.6} />
          <Circle cx="73" cy="58" r="6" fill={Palette.coralRose} opacity={0.6} />
        </>
      ) : null}
    </Svg>
  );
}
