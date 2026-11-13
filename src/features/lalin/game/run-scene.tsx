import Svg, { Circle, Defs, Ellipse, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

import { Palette, RunSkies } from '@/constants/theme';
import { STAR_PATH } from '@/features/lalin/components/star-row';
import type { Entity, EntityKind } from '@/features/lalin/game/engine';

export interface Projection {
  W: number;
  H: number;
  horizon: number;
  player: number;
  laneW: number;
}

export function makeProjection(W: number, H: number): Projection {
  return { W, H, horizon: H * 0.34, player: H * 0.8, laneW: W * 0.3 };
}

export function project(p: Projection, lane: number, z: number) {
  const d = Math.max(0, 1 - z);
  const s = 0.22 + 0.78 * d;
  const y = p.horizon + (p.player - p.horizon) * Math.pow(d, 1.7);
  const x = p.W / 2 + lane * p.laneW * s;
  return { x, y, s };
}

function Sprite({ kind }: { kind: EntityKind }) {
  switch (kind) {
    case 'bottle':
      return (
        <G>
          <Ellipse cx="0" cy="0" rx="14" ry="4" fill={Palette.shadow} opacity={0.18} />
          <Rect x="-9" y="-46" width="18" height="44" rx="8" fill={Palette.plastic} />
          <Rect x="-5" y="-54" width="10" height="10" rx="3" fill={Palette.plasticCap} />
          <Rect x="-5" y="-38" width="4" height="26" rx="2" fill={Palette.white} opacity={0.6} />
        </G>
      );
    case 'bag':
      return (
        <G>
          <Ellipse cx="0" cy="0" rx="18" ry="4" fill={Palette.shadow} opacity={0.18} />
          <Path d="M-18 -4 C-20 -26 -14 -36 -6 -38 L6 -38 C14 -36 20 -26 18 -4 Z" fill={Palette.bag} />
          <Path d="M-8 -38 C-10 -50 -2 -50 -3 -38 M3 -38 C2 -50 10 -50 8 -38" stroke={Palette.plasticCap} strokeWidth="3" fill="none" strokeLinecap="round" />
        </G>
      );
    case 'net':
      return (
        <G>
          <Ellipse cx="0" cy="0" rx="22" ry="5" fill={Palette.shadow} opacity={0.18} />
          <Path d="M-22 -4 C-24 -22 -12 -34 0 -34 C12 -34 24 -22 22 -4 Z" fill={Palette.net} />
          <Path d="M-16 -8 L8 -30 M-6 -4 L16 -24 M-18 -22 L6 -4 M-6 -32 L18 -10" stroke={Palette.white} strokeWidth="2" opacity={0.7} />
          <Circle cx="14" cy="-28" r="4" fill={Palette.honey} />
        </G>
      );
    case 'star':
      return (
        <G>
          <Circle cx="0" cy="-30" r="24" fill={Palette.honey} opacity={0.45} />
          <G transform="translate(-20 -50) scale(0.4)">
            <Path d={STAR_PATH} fill={Palette.honeyDeep} />
          </G>
        </G>
      );
    case 'crab':
      return (
        <G>
          <Ellipse cx="0" cy="0" rx="24" ry="5" fill={Palette.shadow} opacity={0.2} />
          <Path d="M-22 -6 L-30 2 M22 -6 L30 2 M-16 -4 L-22 4 M16 -4 L22 4" stroke={Palette.crab} strokeWidth="4" strokeLinecap="round" />
          <Ellipse cx="0" cy="-14" rx="22" ry="14" fill={Palette.crab} />
          <Circle cx="-26" cy="-26" r="8" fill={Palette.crab} />
          <Circle cx="26" cy="-26" r="8" fill={Palette.crab} />
          <Circle cx="-7" cy="-30" r="4.5" fill={Palette.white} />
          <Circle cx="7" cy="-30" r="4.5" fill={Palette.white} />
          <Circle cx="-7" cy="-30" r="2.2" fill={Palette.cocoa} />
          <Circle cx="7" cy="-30" r="2.2" fill={Palette.cocoa} />
        </G>
      );
    case 'rock':
      return (
        <G>
          <Ellipse cx="0" cy="0" rx="28" ry="6" fill={Palette.shadow} opacity={0.2} />
          <Path d="M-28 -2 C-30 -22 -16 -36 0 -36 C18 -36 30 -20 28 -2 Z" fill={Palette.rock} />
          <Path d="M-14 -26 C-8 -32 2 -32 6 -28" stroke={Palette.white} strokeWidth="3" opacity={0.4} fill="none" strokeLinecap="round" />
        </G>
      );
    case 'wave':
      return (
        <G>
          <Path d="M-46 0 C-40 -26 -12 -40 10 -34 C26 -30 34 -18 30 -10 C22 -20 8 -18 6 -8 C4 0 20 2 46 0 Z" fill={Palette.turquoise} />
          <Path d="M-40 -6 C-30 -26 -8 -34 10 -30" stroke={Palette.white} strokeWidth="5" fill="none" strokeLinecap="round" opacity={0.85} />
        </G>
      );
    case 'boat':
      return (
        <G>
          <Ellipse cx="0" cy="0" rx="40" ry="7" fill={Palette.shadow} opacity={0.2} />
          <Path d="M-40 -18 L40 -18 C36 -4 26 0 0 0 C-26 0 -36 -4 -40 -18 Z" fill={Palette.boat} />
          <Rect x="-40" y="-20" width="80" height="5" rx="2" fill={Palette.clay} />
          <Rect x="-2" y="-78" width="4" height="60" fill={Palette.cocoaSoft} />
          <Path d="M2 -76 L32 -26 L2 -26 Z" fill={Palette.boatSail} />
          <Path d="M-2 -66 L-24 -26 L-2 -26 Z" fill={Palette.peach} />
        </G>
      );
  }
}

interface RunSceneProps {
  proj: Projection;
  level: number;
  t: number;
  travel: number;
  entities: Entity[];
}

/** The beach in perspective: sky, sea, a sandbar with three lanes, and everything coming at her. */
export function RunScene({ proj, level, t, travel, entities }: RunSceneProps) {
  const { W, H, horizon, player } = proj;
  const [skyTop, skyBottom, sea, sand] = RunSkies[level - 1];
  const sunset = level === 6;
  const topL = project(proj, -1.6, 1).x;
  const topR = project(proj, 1.6, 1).x;
  const botL = project(proj, -1.6, -0.25).x;
  const botR = project(proj, 1.6, -0.25).x;
  const bottomY = project(proj, 0, -0.25).y;
  const ripples = [0, 1, 2, 3, 4, 5].map((k) => {
    const z = 1 - (((t / travel) * 1.5 + k / 6) % 1);
    return project(proj, 0, z);
  });
  const sorted = [...entities].sort((a, b) => b.z - a.z);

  return (
    <Svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0 }}>
      <Defs>
        <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={skyTop} />
          <Stop offset="1" stopColor={skyBottom} />
        </LinearGradient>
        <LinearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={sea} stopOpacity={0.75} />
          <Stop offset="1" stopColor={sea} />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width={W} height={horizon + 2} fill="url(#sky)" />
      <Circle cx={sunset ? W * 0.5 : W * 0.78} cy={horizon - (sunset ? 4 : 60)} r={sunset ? 56 : 30} fill={sunset ? Palette.honey : Palette.white} opacity={sunset ? 0.95 : 0.8} />
      {level === 4 ? (
        <Path d={`M${W * 0.08} ${horizon} L${W * 0.3} ${horizon - 70} C${W * 0.36} ${horizon - 84} ${W * 0.42} ${horizon - 82} ${W * 0.46} ${horizon - 60} L${W * 0.6} ${horizon} Z`} fill={Palette.hillDeep} opacity={0.75} />
      ) : (
        <Path d={`M0 ${horizon} C${W * 0.15} ${horizon - 22} ${W * 0.3} ${horizon - 18} ${W * 0.42} ${horizon} Z`} fill={Palette.hill} opacity={0.6} />
      )}
      <Rect x="0" y={horizon} width={W} height={H - horizon} fill="url(#sea)" />
      <Path d={`M${topL} ${horizon} L${topR} ${horizon} L${botR} ${bottomY} L${botL} ${bottomY} Z`} fill={sand} />
      <Path d={`M${topL} ${horizon} L${botL} ${bottomY}`} stroke={Palette.white} strokeWidth="6" opacity={0.6} />
      <Path d={`M${topR} ${horizon} L${botR} ${bottomY}`} stroke={Palette.white} strokeWidth="6" opacity={0.6} />
      {[-0.5, 0.5].map((l) => {
        const a = project(proj, l, 1);
        const b = project(proj, l, -0.25);
        return <Path key={l} d={`M${a.x} ${a.y} L${b.x} ${b.y}`} stroke={Palette.sandDeep} strokeWidth="3" strokeDasharray="6 14" opacity={0.7} />;
      })}
      {ripples.map((r, i) => (
        <Path key={i} d={`M${W / 2 - 40 * r.s} ${r.y} Q${W / 2} ${r.y + 4 * r.s} ${W / 2 + 40 * r.s} ${r.y}`} stroke={Palette.sandDeep} strokeWidth={2 * r.s} fill="none" opacity={0.5} />
      ))}
      {sorted.map((e) => {
        const p = project(proj, e.lane, e.z);
        if (p.y > H + 40) return null;
        const size = e.kind === 'boat' ? 1.15 : 1;
        return (
          <G key={e.id} transform={`translate(${p.x} ${p.y}) scale(${p.s * size * (W / 390)})`}>
            <Sprite kind={e.kind} />
          </G>
        );
      })}
      <Ellipse cx={W / 2} cy={player + 6} rx="0" ry="0" fill="none" />
    </Svg>
  );
}
