import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, Ellipse, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

import { Palette } from '@/constants/theme';
import { ambient, calmEase } from '@/lib/motion';

const VW = 360;
const VH = 240;

interface LagoonProps {
  /** 0..1 how healed it is. Changes ease in slowly. */
  heal: number;
  width: number;
  /** Faded after three quiet days. */
  quiet?: boolean;
  /** Bump to play a sparkle burst (a quest just landed). */
  burstKey?: number;
}

const CORALS = [
  { x: 52, y: 196, s: 1.1 },
  { x: 108, y: 206, s: 0.8 },
  { x: 236, y: 204, s: 0.9 },
  { x: 300, y: 194, s: 1.15 },
  { x: 172, y: 212, s: 0.7 },
];
const CORAL_COLORS = [Palette.coralRose, Palette.coralHoney, Palette.coralLilac, Palette.coralPeach, Palette.coralRose];

const PLASTIC = [
  { x: 70, y: 112, kind: 'bottle' as const, r: -20 },
  { x: 164, y: 132, kind: 'bag' as const, r: 0 },
  { x: 262, y: 104, kind: 'bottle' as const, r: 25 },
  { x: 318, y: 150, kind: 'bag' as const, r: 0 },
  { x: 118, y: 160, kind: 'bottle' as const, r: 70 },
];

const SPARKLES = [
  { x: 60, y: 96 },
  { x: 150, y: 84 },
  { x: 214, y: 120 },
  { x: 292, y: 90 },
  { x: 104, y: 140 },
  { x: 250, y: 160 },
];

function Coral({ x, y, s, color }: { x: number; y: number; s: number; color: string }) {
  return (
    <G transform={`translate(${x} ${y}) scale(${s})`}>
      <Path d="M0 0 C-4 -10 -14 -14 -12 -24 C-10 -32 -2 -28 -2 -20 C-2 -30 2 -38 8 -34 C14 -30 8 -20 6 -14 C10 -22 20 -24 20 -16 C20 -8 10 -4 8 0 Z" fill={color} />
      <Circle cx="-11" cy="-25" r="3.2" fill={color} />
      <Circle cx="8" cy="-34" r="3.2" fill={color} />
      <Circle cx="20" cy="-16" r="3" fill={color} />
    </G>
  );
}

function Bottle({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <G transform={`translate(${x} ${y}) rotate(${r})`}>
      <Rect x="-5" y="-10" width="10" height="18" rx="4" fill={Palette.plastic} />
      <Rect x="-2.5" y="-14" width="5" height="5" rx="1.5" fill={Palette.plasticCap} />
    </G>
  );
}

function Bag({ x, y }: { x: number; y: number }) {
  return (
    <G transform={`translate(${x} ${y})`}>
      <Path d="M-9 -6 C-9 -12 -5 -12 -4 -8 L4 -8 C5 -12 9 -12 9 -6 C10 2 8 9 0 9 C-8 9 -10 2 -9 -6 Z" fill={Palette.bag} opacity={0.95} />
    </G>
  );
}

function Fish({ color }: { color: string }) {
  return (
    <Svg width={34} height={18} viewBox="0 0 34 18">
      <Ellipse cx="14" cy="9" rx="12" ry="7" fill={color} />
      <Path d="M24 9 L33 2 L33 16 Z" fill={color} />
      <Circle cx="8" cy="7.5" r="1.6" fill={Palette.cocoa} />
    </Svg>
  );
}

function Sparkle({ size = 12, color = Palette.white }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20">
      <Path d="M10 0 C11 7 13 9 20 10 C13 11 11 13 10 20 C9 13 7 11 0 10 C7 9 9 7 10 0 Z" fill={color} />
    </Svg>
  );
}

export function Lagoon({ heal, width, quiet, burstKey = 0 }: LagoonProps) {
  const height = (width * VH) / VW;
  const k = width / VW;
  const reduced = useReducedMotion();
  const h = useSharedValue(heal);
  const wave = useSharedValue(0);
  const bob = useSharedValue(0);
  const swim = useSharedValue(0);
  const twinkle = useSharedValue(0);
  const burst = useSharedValue(0);
  const quietV = useSharedValue(quiet ? 1 : 0);

  useEffect(() => {
    h.set(withTiming(heal, { duration: ambient.heal, easing: calmEase }));
  }, [heal, h]);

  useEffect(() => {
    quietV.set(withTiming(quiet ? 1 : 0, { duration: ambient.heal, easing: calmEase }));
  }, [quiet, quietV]);

  useEffect(() => {
    if (reduced) return;
    wave.set(withRepeat(withTiming(1, { duration: ambient.wave, easing: Easing.linear }), -1));
    bob.set(withRepeat(withTiming(1, { duration: ambient.float, easing: calmEase }), -1, true));
    swim.set(withRepeat(withTiming(1, { duration: ambient.swim, easing: Easing.linear }), -1));
    twinkle.set(withRepeat(withTiming(1, { duration: ambient.sparkle, easing: calmEase }), -1, true));
  }, [reduced, wave, bob, swim, twinkle]);

  useEffect(() => {
    if (burstKey === 0) return;
    burst.set(0);
    burst.set(
      withSequence(
        withTiming(1, { duration: ambient.sparkle / 2, easing: calmEase }),
        withDelay(ambient.sparkle / 3, withTiming(2, { duration: ambient.sparkle, easing: calmEase })),
      ),
    );
  }, [burstKey, burst]);

  const clearStyle = useAnimatedStyle(() => ({
    opacity: interpolate(h.get(), [0, 0.6], [0, 1], Extrapolation.CLAMP) * (1 - quietV.get() * 0.5),
  }));
  const coralStyle = useAnimatedStyle(() => ({
    opacity: interpolate(h.get(), [0.1, 0.5], [0, 1], Extrapolation.CLAMP) * (1 - quietV.get() * 0.4),
    transform: [{ translateY: interpolate(h.get(), [0.1, 0.5], [6 * k, 0], Extrapolation.CLAMP) }],
  }));
  const plasticStyle = useAnimatedStyle(() => ({
    opacity: interpolate(h.get(), [0, 0.45], [1, 0], Extrapolation.CLAMP),
    transform: [{ translateY: interpolate(bob.get(), [0, 1], [-2 * k, 3 * k]) }],
  }));
  const fishStyle = useAnimatedStyle(() => ({
    opacity: interpolate(h.get(), [0.4, 0.55], [0, 1], Extrapolation.CLAMP),
    transform: [{ translateX: interpolate(swim.get(), [0, 1], [width + 20, -60]) }, { translateY: interpolate(bob.get(), [0, 1], [0, 4 * k]) }],
  }));
  const fish2Style = useAnimatedStyle(() => ({
    opacity: interpolate(h.get(), [0.5, 0.65], [0, 1], Extrapolation.CLAMP),
    transform: [{ translateX: interpolate((swim.get() + 0.45) % 1, [0, 1], [width + 20, -60]) }, { translateY: interpolate(bob.get(), [0, 1], [3 * k, 0]) }, { scale: 0.8 }],
  }));
  const turtleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(h.get(), [0.68, 0.8], [0, 1], Extrapolation.CLAMP),
    transform: [
      { translateX: interpolate(swim.get(), [0, 1], [-20 * k, 20 * k]) },
      { translateY: interpolate(bob.get(), [0, 1], [-3 * k, 3 * k]) },
      { rotate: `${interpolate(bob.get(), [0, 1], [-4, 4])}deg` },
    ],
  }));
  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(h.get(), [0.9, 1], [0, 1], Extrapolation.CLAMP) * interpolate(twinkle.get(), [0, 1], [0.35, 1]),
  }));
  const burstStyle = useAnimatedStyle(() => {
    const b = burst.get();
    return {
      opacity: b <= 1 ? b : Math.max(0, 2 - b),
      transform: [{ translateY: interpolate(b, [0, 2], [10 * k, -26 * k]) }],
    };
  });
  const waveStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -wave.get() * width }],
  }));
  const wave2Style = useAnimatedStyle(() => ({
    transform: [{ translateX: -((wave.get() * 0.6 + 0.3) % 1) * width }],
  }));
  const mistStyle = useAnimatedStyle(() => ({
    opacity: Math.max(interpolate(h.get(), [0, 0.3], [0.85, 0], Extrapolation.CLAMP), quietV.get() * 0.55),
    transform: [{ translateX: interpolate(bob.get(), [0, 1], [-8 * k, 8 * k]) }],
  }));

  return (
    <View style={{ width, height }} className="overflow-hidden rounded-3xl" accessibilityRole="image" accessibilityLabel="Your lagoon">
      {/* murky base */}
      <Svg width={width} height={height} viewBox={`0 0 ${VW} ${VH}`} style={{ position: 'absolute' }}>
        <Defs>
          <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={Palette.milk} />
            <Stop offset="1" stopColor={Palette.peach} stopOpacity={0.55} />
          </LinearGradient>
          <LinearGradient id="murk" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={Palette.fogWater} />
            <Stop offset="1" stopColor={Palette.fogDeep} />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width={VW} height="80" fill="url(#sky)" />
        <Circle cx="292" cy="34" r="16" fill={Palette.honey} />
        <Path d="M0 74 C40 52 80 50 120 66 C150 56 190 44 228 62 C262 48 310 52 360 70 L360 82 L0 82 Z" fill={Palette.hill} />
        <Path d="M0 78 C60 64 110 70 150 76 C200 66 260 66 360 76 L360 84 L0 84 Z" fill={Palette.hillDeep} opacity={0.7} />
        <Rect x="0" y="80" width={VW} height={VH - 80} fill="url(#murk)" />
        <Path d="M0 206 C70 190 140 214 200 206 C260 198 310 214 360 202 L360 240 L0 240 Z" fill={Palette.sandDeep} opacity={0.6} />
        {CORALS.map((c, i) => (
          <Coral key={i} x={c.x} y={c.y} s={c.s * 0.85} color={Palette.fogCoral} />
        ))}
      </Svg>

      {/* clear turquoise water */}
      <Animated.View className="absolute inset-0" style={clearStyle} pointerEvents="none">
        <Svg width={width} height={height} viewBox={`0 0 ${VW} ${VH}`}>
          <Defs>
            <LinearGradient id="clear" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={Palette.turquoise} />
              <Stop offset="0.55" stopColor={Palette.mint} />
              <Stop offset="1" stopColor={Palette.sand} />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="80" width={VW} height={VH - 80} fill="url(#clear)" />
          <Path d="M0 82 C90 78 270 78 360 82 L360 90 C270 86 90 86 0 90 Z" fill={Palette.white} opacity={0.5} />
          <Path d="M0 210 C70 194 140 218 200 210 C260 202 310 218 360 206 L360 240 L0 240 Z" fill={Palette.sand} />
        </Svg>
      </Animated.View>

      {/* waves */}
      <Animated.View className="absolute inset-0 flex-row" style={waveStyle} pointerEvents="none">
        {[0, 1].map((i) => (
          <Svg key={i} width={width} height={height} viewBox={`0 0 ${VW} ${VH}`}>
            <Path d="M0 104 C30 98 60 110 90 104 C120 98 150 110 180 104 C210 98 240 110 270 104 C300 98 330 110 360 104" stroke={Palette.white} strokeOpacity={0.55} strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <Path d="M0 150 C45 142 90 158 135 150 C180 142 225 158 270 150 C300 145 330 152 360 150" stroke={Palette.white} strokeOpacity={0.35} strokeWidth="2" fill="none" strokeLinecap="round" />
          </Svg>
        ))}
      </Animated.View>
      <Animated.View className="absolute inset-0 flex-row" style={wave2Style} pointerEvents="none">
        {[0, 1].map((i) => (
          <Svg key={i} width={width} height={height} viewBox={`0 0 ${VW} ${VH}`}>
            <Path d="M0 126 C40 120 80 132 120 126 C160 120 200 132 240 126 C280 120 320 132 360 126" stroke={Palette.white} strokeOpacity={0.3} strokeWidth="2" fill="none" strokeLinecap="round" />
            <Path d="M0 178 C60 172 120 184 180 178 C240 172 300 184 360 178" stroke={Palette.white} strokeOpacity={0.3} strokeWidth="2" fill="none" strokeLinecap="round" />
          </Svg>
        ))}
      </Animated.View>

      {/* healed coral */}
      <Animated.View className="absolute inset-0" style={coralStyle} pointerEvents="none">
        <Svg width={width} height={height} viewBox={`0 0 ${VW} ${VH}`}>
          {CORALS.map((c, i) => (
            <Coral key={i} x={c.x} y={c.y} s={c.s} color={CORAL_COLORS[i]} />
          ))}
          <Circle cx="82" cy="212" r="5" fill={Palette.leaf} />
          <Circle cx="272" cy="214" r="4" fill={Palette.leaf} />
        </Svg>
      </Animated.View>

      {/* fish and turtle */}
      <Animated.View className="absolute" style={[{ top: 118 * k, left: 0 }, fishStyle]} pointerEvents="none">
        <Fish color={Palette.honeyDeep} />
      </Animated.View>
      <Animated.View className="absolute" style={[{ top: 168 * k, left: 0 }, fish2Style]} pointerEvents="none">
        <Fish color={Palette.peachDeep} />
      </Animated.View>
      <Animated.View className="absolute" style={[{ top: 128 * k, left: 196 * k }, turtleStyle]} pointerEvents="none">
        <Svg width={64 * k} height={44 * k} viewBox="0 0 64 44">
          <Ellipse cx="14" cy="10" rx="7" ry="4" fill={Palette.leaf} transform="rotate(-30 14 10)" />
          <Ellipse cx="14" cy="34" rx="7" ry="4" fill={Palette.leaf} transform="rotate(30 14 34)" />
          <Ellipse cx="44" cy="8" rx="8" ry="4" fill={Palette.leaf} transform="rotate(30 44 8)" />
          <Ellipse cx="44" cy="36" rx="8" ry="4" fill={Palette.leaf} transform="rotate(-30 44 36)" />
          <Circle cx="56" cy="22" r="6" fill={Palette.leaf} />
          <Ellipse cx="30" cy="22" rx="20" ry="15" fill={Palette.turquoiseDeep} />
          <Path d="M18 22 L30 12 L42 22 L30 32 Z" fill={Palette.mint} opacity={0.5} />
          <Circle cx="58" cy="20" r="1.4" fill={Palette.cocoa} />
        </Svg>
      </Animated.View>

      {/* plastic floating in the murk */}
      <Animated.View className="absolute inset-0" style={plasticStyle} pointerEvents="none">
        <Svg width={width} height={height} viewBox={`0 0 ${VW} ${VH}`}>
          {PLASTIC.map((p, i) => (p.kind === 'bottle' ? <Bottle key={i} x={p.x} y={p.y} r={p.r} /> : <Bag key={i} x={p.x} y={p.y} />))}
        </Svg>
      </Animated.View>

      {/* the glow, at the top level */}
      <Animated.View className="absolute inset-0" style={glowStyle} pointerEvents="none">
        {SPARKLES.map((s, i) => (
          <View key={i} className="absolute" style={{ left: s.x * k, top: s.y * k }}>
            <Sparkle size={(i % 2 === 0 ? 12 : 8) * k} color={Palette.glow} />
          </View>
        ))}
      </Animated.View>

      {/* mist */}
      <Animated.View className="absolute inset-0" style={mistStyle} pointerEvents="none">
        <Svg width={width} height={height} viewBox={`0 0 ${VW} ${VH}`}>
          <Ellipse cx="80" cy="110" rx="120" ry="34" fill={Palette.milk} opacity={0.6} />
          <Ellipse cx="270" cy="140" rx="130" ry="36" fill={Palette.milk} opacity={0.55} />
          <Ellipse cx="170" cy="190" rx="150" ry="30" fill={Palette.milk} opacity={0.45} />
        </Svg>
      </Animated.View>

      {/* sparkle burst when a quest lands */}
      <Animated.View className="absolute inset-0" style={burstStyle} pointerEvents="none">
        {SPARKLES.map((s, i) => (
          <View key={i} className="absolute" style={{ left: s.x * k, top: (s.y + 20) * k }}>
            <Sparkle size={(i % 2 === 0 ? 16 : 11) * k} color={i % 2 === 0 ? Palette.honey : Palette.white} />
          </View>
        ))}
      </Animated.View>
    </View>
  );
}
