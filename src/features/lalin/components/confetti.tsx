import { useEffect } from 'react';
import { useWindowDimensions, View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

import { ConfettiColors } from '@/constants/theme';
import { ambient, calmEase } from '@/lib/motion';

const PIECES = Array.from({ length: 34 }, (_, i) => ({
  x: ((i * 37) % 100) / 100,
  drift: (((i * 53) % 21) - 10) * 4,
  delay: (i % 9) * 110,
  size: 8 + (i % 4) * 3,
  round: i % 3 !== 0,
  spin: ((i * 29) % 360) - 180,
  color: ConfettiColors[i % ConfettiColors.length],
}));

function Piece({ p, height, width, run }: { p: (typeof PIECES)[number]; height: number; width: number; run: number }) {
  const t = useSharedValue(0);
  useEffect(() => {
    if (run === 0) return;
    t.set(0);
    t.set(withDelay(p.delay, withTiming(1, { duration: ambient.confetti, easing: calmEase })));
  }, [run, p.delay, t]);
  const style = useAnimatedStyle(() => {
    const v = t.get();
    return {
      opacity: v === 0 ? 0 : interpolate(v, [0, 0.1, 0.8, 1], [0, 1, 1, 0]),
      transform: [
        { translateX: p.x * width + Math.sin(v * Math.PI * 2) * p.drift },
        { translateY: interpolate(v, [0, 1], [-30, height * 0.85]) },
        { rotate: `${v * p.spin}deg` },
      ],
    };
  });
  return (
    <Animated.View
      className="absolute left-0 top-0"
      style={[{ width: p.size, height: p.round ? p.size : p.size * 0.6, borderRadius: p.round ? p.size : 3, backgroundColor: p.color }, style]}
    />
  );
}

/** Slow pastel confetti. Only for big moments: a lagoon level, 3 stars, the Guardian badge. */
export function Confetti({ run }: { run: number }) {
  const { width, height } = useWindowDimensions();
  const reduced = useReducedMotion();
  if (reduced || run === 0) return null;
  return (
    <View className="absolute inset-0" pointerEvents="none">
      {PIECES.map((p, i) => (
        <Piece key={i} p={p} width={width} height={height} run={run} />
      ))}
    </View>
  );
}
