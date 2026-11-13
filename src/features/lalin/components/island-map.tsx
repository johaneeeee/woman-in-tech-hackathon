import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useReducedMotion, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Defs, Ellipse, LinearGradient, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

import { Pressable } from '@/components/pressable';
import { BeachColors, Palette, softShadow } from '@/constants/theme';
import { BEACHES, type AvatarID } from '@/features/content/data/worlds';
import { Icon } from '@/features/lalin/components/icon';
import { MoonAvatar } from '@/features/lalin/components/moon-avatar';
import { StarRow } from '@/features/lalin/components/star-row';
import { isLevelUnlocked } from '@/features/lalin/store/lalin-store';
import type { LevelRecord } from '@/features/lalin/types/lalin';
import { ambient, calmEase } from '@/lib/motion';

const VW = 340;
const VH = 400;

const OUTLINE: [number, number][] = [
  [176, 30], [206, 44], [234, 84], [258, 124], [272, 164], [278, 204], [276, 252], [262, 296], [244, 330],
  [206, 352], [160, 364], [112, 368], [66, 362], [40, 344], [46, 312], [60, 276], [70, 236], [80, 196],
  [98, 150], [124, 100], [150, 56],
];

const NODES: Record<number, { x: number; y: number }> = {
  1: { x: 84, y: 214 },
  2: { x: 244, y: 326 },
  3: { x: 262, y: 192 },
  4: { x: 52, y: 340 },
  5: { x: 178, y: 58 },
  6: { x: 306, y: 236 },
};

function smooth(points: [number, number][], scale = 1, cx = 165, cy = 210): string {
  const p = points.map(([x, y]) => [cx + (x - cx) * scale, cy + (y - cy) * scale] as const);
  const n = p.length;
  let d = `M${p[0][0].toFixed(1)} ${p[0][1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = p[(i - 1 + n) % n];
    const p1 = p[i];
    const p2 = p[(i + 1) % n];
    const p3 = p[(i + 2) % n];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return `${d} Z`;
}

const ISLAND = smooth(OUTLINE);
const REEF = smooth(OUTLINE, 1.1);
const INLAND = smooth(OUTLINE, 0.62, 160, 230);

function Breathing({ children, active }: { children: React.ReactNode; active: boolean }) {
  const reduced = useReducedMotion();
  const t = useSharedValue(0);
  useEffect(() => {
    if (!active || reduced) return;
    t.set(withRepeat(withTiming(1, { duration: ambient.breathe / 2, easing: calmEase }), -1, true));
  }, [active, reduced, t]);
  const ring = useAnimatedStyle(() => ({
    opacity: interpolate(t.get(), [0, 1], [0.15, 0.55]),
    transform: [{ scale: interpolate(t.get(), [0, 1], [1, 1.35]) }],
  }));
  return (
    <View className="items-center justify-center">
      {active ? <Animated.View className="absolute size-14 rounded-full bg-white" style={ring} /> : null}
      {children}
    </View>
  );
}

function Floating({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  const t = useSharedValue(0);
  useEffect(() => {
    if (reduced) return;
    t.set(withRepeat(withTiming(1, { duration: ambient.float, easing: calmEase }), -1, true));
  }, [reduced, t]);
  const style = useAnimatedStyle(() => ({ transform: [{ translateY: interpolate(t.get(), [0, 1], [0, -6]) }] }));
  return <Animated.View style={style}>{children}</Animated.View>;
}

interface IslandMapProps {
  width: number;
  levels: Record<string, LevelRecord>;
  avatar: AvatarID;
  onSelect: (level: number) => void;
}

export function IslandMap({ width, levels, avatar, onSelect }: IslandMapProps) {
  const k = width / VW;
  const height = VH * k;
  const unlocked = BEACHES.filter((b) => isLevelUnlocked(levels, b.id));
  const nextPlayable = BEACHES.find((b) => isLevelUnlocked(levels, b.id) && (levels[String(b.id)]?.bestStars ?? 0) === 0)?.id ?? null;
  const current = nextPlayable ?? unlocked[unlocked.length - 1]?.id ?? 1;

  return (
    <View style={{ width, height }} className="overflow-hidden rounded-4xl">
      <Svg width={width} height={height} viewBox={`0 0 ${VW} ${VH}`}>
        <Defs>
          <LinearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={Palette.mist} />
            <Stop offset="0.6" stopColor={Palette.mint} />
            <Stop offset="1" stopColor={Palette.peach} stopOpacity={0.7} />
          </LinearGradient>
          <RadialGradient id="sun" cx="0.85" cy="0.1" r="0.5">
            <Stop offset="0" stopColor={Palette.honey} stopOpacity={0.9} />
            <Stop offset="1" stopColor={Palette.honey} stopOpacity={0} />
          </RadialGradient>
          <LinearGradient id="land" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={Palette.sand} />
            <Stop offset="1" stopColor={Palette.peach} />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width={VW} height={VH} fill="url(#sea)" />
        <Rect x="0" y="0" width={VW} height={VH} fill="url(#sun)" />
        <Path d={REEF} fill={Palette.turquoise} opacity={0.35} />
        <Path d={ISLAND} fill="url(#land)" />
        <Path d={INLAND} fill={Palette.leaf} opacity={0.45} />
        <Path d="M60 330 C70 300 86 300 96 326 Z" fill={Palette.hillDeep} opacity={0.8} />
        <Path d="M150 210 C166 180 186 182 200 214 Z" fill={Palette.hill} opacity={0.8} />
        <Ellipse cx="306" cy="236" rx="16" ry="11" fill="url(#land)" />
        <Path d={smooth(OUTLINE, 0.9)} stroke={Palette.white} strokeWidth="3.5" strokeDasharray="1 9" strokeLinecap="round" fill="none" opacity={0.95} />
        <Path d="M286 230 C294 226 300 228 306 236" stroke={Palette.white} strokeWidth="3.5" strokeDasharray="1 9" strokeLinecap="round" fill="none" />
        <Circle cx="34" cy="60" r="3" fill={Palette.white} opacity={0.7} />
        <Circle cx="300" cy="360" r="2.5" fill={Palette.white} opacity={0.7} />
        <Circle cx="24" cy="200" r="2" fill={Palette.white} opacity={0.7} />
      </Svg>

      {BEACHES.map((b, i) => {
        const pos = NODES[b.id];
        const isOpen = isLevelUnlocked(levels, b.id);
        const stars = levels[String(b.id)]?.bestStars ?? 0;
        const isCurrent = b.id === current;
        const left = pos.x * k - 22;
        const top = pos.y * k - 22;
        return (
          <View key={b.id} className="absolute items-center" style={{ left: left - 20, top, width: 84 }}>
            {isCurrent ? (
              <View className="absolute" style={{ top: -40 }} pointerEvents="none">
                <Floating>
                  <MoonAvatar avatar={avatar} size={36} />
                </Floating>
              </View>
            ) : null}
            <Pressable
              onPress={() => onSelect(b.id)}
              accessibilityRole="button"
              accessibilityLabel={`${b.name}, level ${b.id}${isOpen ? `, ${stars} stars` : ', locked'}`}
              className="rounded-full"
            >
              <Breathing active={b.id === nextPlayable}>
                <View
                  className="size-11 rounded-full items-center justify-center"
                  style={[{ backgroundColor: isOpen ? BeachColors[i] : Palette.fog, opacity: isOpen ? 1 : 0.75 }, softShadow]}
                >
                  {isOpen ? (
                    <Text className="font-display-bold text-lg text-cocoa">{b.id}</Text>
                  ) : (
                    <Icon sf="lock.fill" md="lock" size={14} color={Palette.cocoaSoft} />
                  )}
                </View>
              </Breathing>
            </Pressable>
            <View className="items-center gap-0.5 pt-1" pointerEvents="none">
              <Text className="font-heavy text-xs text-cocoa" numberOfLines={1} style={{ opacity: isOpen ? 1 : 0.55 }}>
                {b.name}
              </Text>
              {isOpen && stars > 0 ? <StarRow stars={stars} size={10} /> : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}
