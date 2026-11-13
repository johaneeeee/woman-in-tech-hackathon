import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { Presets } from 'react-native-pulsar';

import { BeachColors, Palette } from '@/constants/theme';
import { BEACHES } from '@/features/content/data/worlds';
import { Icon } from '@/features/lalin/components/icon';
import { PillButton } from '@/features/lalin/components/pill-button';
import { StarRow } from '@/features/lalin/components/star-row';
import { isLevelUnlocked, useLalinStore } from '@/features/lalin/store/lalin-store';

const EXTRAS: Record<number, string> = {
  1: 'Crabs only. A good place to learn.',
  2: 'Crabs and rocks.',
  3: 'Wind gusts push you one lane.',
  4: 'Waves cross the lanes. Nets are worth 3.',
  5: 'Boats you cannot jump. Lots of plastic.',
  6: 'Everything at once, at sunset.',
};

export default function LevelSheet() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const level = Number(id);
  const beach = BEACHES.find((b) => b.id === level);
  const levels = useLalinStore((s) => s.levels);
  const energy = useLalinStore((s) => s.energy);
  const spendEnergy = useLalinStore((s) => s.spendEnergy);

  if (!beach) return null;

  const unlocked = isLevelUnlocked(levels, level);
  const rec = levels[String(level)];
  const prev = BEACHES[level - 2];

  const run = () => {
    if (!spendEnergy()) return;
    Presets.System.impactSoft();
    router.replace(`/play/${level}`);
  };

  return (
    <ScrollView className="flex-1 bg-milk" contentContainerClassName="px-6 pt-8 pb-safe-offset-4 gap-5">
      <View className="flex-row items-center gap-4">
        <View className="size-14 rounded-full items-center justify-center" style={{ backgroundColor: unlocked ? BeachColors[level - 1] : Palette.fog }}>
          {unlocked ? <Text className="font-display-bold text-2xl text-cocoa">{level}</Text> : <Icon sf="lock.fill" md="lock" size={18} color={Palette.cocoaSoft} />}
        </View>
        <View className="flex-1 gap-0.5">
          <Text className="font-heavy text-xs uppercase tracking-wide text-muted">{beach.timeOfDay} · {beach.title}</Text>
          <Text className="font-display-bold text-3xl text-cocoa">{beach.name}</Text>
        </View>
      </View>

      <Text className="font-sans text-base text-cocoa leading-relaxed">{beach.line}</Text>

      <View className="flex-row gap-3">
        <View className="flex-1 rounded-3xl bg-white p-4 gap-1">
          <Text className="font-heavy text-xs uppercase tracking-wide text-muted">Goal</Text>
          <Text className="font-display-bold text-xl text-cocoa">{beach.goal} pieces</Text>
        </View>
        <View className="flex-1 rounded-3xl bg-white p-4 gap-2">
          <Text className="font-heavy text-xs uppercase tracking-wide text-muted">Best</Text>
          <StarRow stars={rec?.bestStars ?? 0} size={18} />
        </View>
      </View>

      <View className="flex-row items-center gap-3 rounded-3xl bg-white/60 p-4">
        <Icon sf="info.circle.fill" md="info" size={16} color={Palette.turquoiseDeep} />
        <Text className="flex-1 font-strong text-sm text-cocoa">{EXTRAS[level]}</Text>
      </View>

      {!unlocked ? (
        <Text className="font-strong text-base text-muted text-center">Get 1 star on {prev?.name} to open this beach.</Text>
      ) : energy < 1 ? (
        <View className="gap-3">
          <Text className="font-strong text-base text-cocoa text-center">Out of energy. Complete a quest to recharge.</Text>
          <PillButton label="Go to my quests" tone="white" onPress={() => router.dismissTo('/')} />
        </View>
      ) : (
        <View className="gap-2">
          <PillButton label="Run" onPress={run} />
          <View className="flex-row items-center justify-center gap-1.5">
            <Icon sf="bolt.fill" md="bolt" size={13} color={Palette.honeyDeep} />
            <Text className="font-strong text-sm text-muted">Costs 1 Moon Energy · you have {energy}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}
