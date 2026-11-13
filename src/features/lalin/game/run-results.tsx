import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { Presets } from 'react-native-pulsar';

import { Palette, softShadow } from '@/constants/theme';
import type { Beach } from '@/features/content/types/content';
import { Icon } from '@/features/lalin/components/icon';
import { MissionBar } from '@/features/lalin/components/mission-bar';
import { PillButton } from '@/features/lalin/components/pill-button';
import { SoftStar } from '@/features/lalin/components/star-row';
import { ambient, calmEase } from '@/lib/motion';

function StarPop({ index, filled }: { index: number; filled: boolean }) {
  const v = useSharedValue(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    const delay = ambient.starGap * (index + 1);
    v.set(withDelay(reduced ? 0 : delay, withTiming(1, { duration: ambient.starPop, easing: calmEase })));
    if (!filled) return;
    const t = setTimeout(() => Presets.System.impactSoft(), delay);
    return () => clearTimeout(t);
  }, [index, filled, reduced, v]);
  const style = useAnimatedStyle(() => ({
    opacity: interpolate(v.get(), [0, 1], [0.15, 1]),
    transform: [{ scale: interpolate(v.get(), [0, 1], [0.5, index === 1 ? 1.2 : 1]) }],
  }));
  return (
    <Animated.View style={style} className="items-center justify-center">
      {filled ? <View className="absolute size-20 rounded-full bg-honey opacity-60" /> : null}
      <SoftStar size={index === 1 ? 72 : 58} filled={filled} />
    </Animated.View>
  );
}

interface RunResultsProps {
  beach: Beach;
  won: boolean;
  stars: number;
  plastic: number;
  bonus: number;
  hearts: number;
  score: number;
  newBest: boolean;
  community: number | null;
  guardian: boolean;
  doubled: boolean;
  energy: number;
  hasNext: boolean;
  onNext: () => void;
  onReplay: () => void;
  onMap: () => void;
  onShare: () => void;
}

export function RunResults(props: RunResultsProps) {
  const { beach, won, stars, plastic, bonus, hearts, score, newBest, community, guardian, doubled, energy, hasNext } = props;
  const outOfEnergy = energy < 1;
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setSettled(true), 1000);
    return () => clearTimeout(id);
  }, []);

  const guard = (fn: () => void) => () => {
    if (!settled) return;
    fn();
  };

  return (
    <ScrollView className="flex-1" contentContainerClassName="px-5 pt-safe-offset-8 pb-safe-offset-4 gap-6">
      {guardian ? (
        <View className="rounded-4xl bg-honey p-6 gap-2 items-center" style={softShadow}>
          <Icon sf="shield.fill" md="shield" size={30} color={Palette.cocoa} />
          <Text className="font-heavy text-xs uppercase tracking-wide text-cocoa">New badge</Text>
          <Text className="font-display-bold text-3xl text-cocoa text-center">Guardian of the Lagoon</Text>
          <Text className="font-sans text-base text-cocoa text-center">Six beaches, all the way round the island. Bravo.</Text>
        </View>
      ) : null}

      <View className="items-center gap-2">
        <Text className="font-heavy text-xs uppercase tracking-wide text-muted">{beach.name}</Text>
        <Text className="font-display-bold text-3xl text-cocoa text-center">
          {won ? `${beach.name} is cleaner.` : 'Not this time. Try again?'}
        </Text>
        <Text className="font-strong text-base text-muted text-center">
          {won ? `${plastic} pieces removed.` : `Plastic still counts. ${plastic} pieces removed.`}
        </Text>
      </View>

      {won ? (
        <View className="flex-row items-end justify-center gap-4 py-2">
          {[0, 1, 2].map((i) => (
            <StarPop key={i} index={i} filled={i < stars} />
          ))}
        </View>
      ) : null}

      <View className="flex-row gap-3">
        {[
          { label: 'Plastic', value: String(plastic) },
          { label: 'Bonus stars', value: String(bonus) },
          { label: 'Hearts', value: `${Math.max(0, hearts)}/3` },
          { label: newBest ? 'New best' : 'Score', value: String(score) },
        ].map((s) => (
          <View key={s.label} className="flex-1 rounded-3xl bg-white py-3 items-center gap-0.5" style={softShadow}>
            <Text className="font-display-bold text-lg text-cocoa">{s.value}</Text>
            <Text className="font-strong text-xs text-muted text-center">{s.label}</Text>
          </View>
        ))}
      </View>

      {doubled ? <Text className="font-strong text-sm text-turquoise-deep text-center">Full Moon Night: every piece counted twice.</Text> : null}

      <View className="rounded-3xl bg-mist p-5 gap-2">
        <Text className="font-heavy text-xs uppercase tracking-wide text-cocoa">Did you know</Text>
        <Text className="font-sans text-base text-cocoa leading-relaxed">{beach.fact}</Text>
      </View>

      <View className="rounded-3xl bg-white p-5 gap-3" style={softShadow}>
        <Text className="font-strong text-sm text-cocoa">
          {community === null ? 'Adding your pieces to the island total...' : `Everyone together: ${community.toLocaleString('en')} pieces`}
        </Text>
        <MissionBar total={community ?? 0} compact />
      </View>

      <View className="gap-3">
        {outOfEnergy ? <Text className="font-strong text-sm text-cocoa text-center">Out of energy. Complete a quest to recharge.</Text> : null}
        {won && hasNext ? <PillButton label="Next level" onPress={guard(props.onNext)} disabled={outOfEnergy} /> : null}
        {!won ? <PillButton label="Try again" onPress={guard(props.onReplay)} disabled={outOfEnergy} /> : null}
        {won && stars < 3 ? <PillButton label="Replay for 3 stars" tone="white" onPress={guard(props.onReplay)} disabled={outOfEnergy} /> : null}
        <View className="flex-row gap-3">
          <PillButton label="Back to map" tone="peach" size="md" onPress={guard(props.onMap)} className="flex-1" />
          {won ? <PillButton label="Share" tone="mint" size="md" onPress={guard(props.onShare)} className="flex-1" /> : null}
        </View>
      </View>
    </ScrollView>
  );
}
