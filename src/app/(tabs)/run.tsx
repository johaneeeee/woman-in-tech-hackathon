import { router } from 'expo-router';
import { ScrollView, Text, useWindowDimensions, View } from 'react-native';

import { Card } from '@/components/card';
import { ListRow } from '@/components/list-row';
import { BeachColors, Palette, softShadow } from '@/constants/theme';
import { BEACHES } from '@/features/content/data/worlds';
import { Icon } from '@/features/lalin/components/icon';
import { IslandMap } from '@/features/lalin/components/island-map';
import { SoftStar, StarRow } from '@/features/lalin/components/star-row';
import { isLevelUnlocked, totalStars, useLalinStore } from '@/features/lalin/store/lalin-store';
import { getMoon } from '@/lib/moon';

export default function Run() {
  const { width } = useWindowDimensions();
  const levels = useLalinStore((s) => s.levels);
  const energy = useLalinStore((s) => s.energy);
  const avatar = useLalinStore((s) => s.profile?.avatar ?? 'pearl');
  const totalPlastic = useLalinStore((s) => s.totalPlastic);
  const moon = getMoon();
  const stars = totalStars(levels);

  const open = (id: number) => router.push(`/level/${id}`);

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="px-5 pt-safe-offset-2 pb-safe-offset-22 gap-6">
      <View className="gap-1 pt-2">
        <Text className="font-display-bold text-3xl text-cocoa">Lalin Run</Text>
        <Text className="font-sans text-base text-muted">Six beaches around the island. Pick up the plastic, dodge the rest.</Text>
      </View>

      <View className="flex-row gap-3">
        <View className="flex-1 flex-row items-center gap-2 rounded-full bg-white px-4 py-3" style={softShadow}>
          <Icon sf="bolt.fill" md="bolt" size={15} color={Palette.honeyDeep} />
          <Text className="font-heavy text-sm text-cocoa">{energy} energy</Text>
        </View>
        <View className="flex-1 flex-row items-center gap-2 rounded-full bg-white px-4 py-3" style={softShadow}>
          <SoftStar size={15} />
          <Text className="font-heavy text-sm text-cocoa">{stars}/18 stars</Text>
        </View>
      </View>

      {moon.isFull ? (
        <View className="flex-row items-center gap-3 rounded-3xl bg-honey px-4 py-3">
          <Icon sf="moon.fill" md="dark_mode" size={16} color={Palette.cocoa} />
          <Text className="flex-1 font-strong text-sm text-cocoa">Full Moon Night. Every piece counts double tonight.</Text>
        </View>
      ) : null}

      <View className="rounded-4xl overflow-hidden" style={softShadow}>
        <IslandMap width={width - 40} levels={levels} avatar={avatar} onSelect={open} />
      </View>

      <Card list>
        {BEACHES.map((b) => {
          const unlocked = isLevelUnlocked(levels, b.id);
          const rec = levels[String(b.id)];
          return (
            <ListRow
              key={b.id}
              title={`${b.id}. ${b.name}`}
              subtitle={unlocked ? `${b.title} · goal ${b.goal}` : `Get 1 star on ${BEACHES[b.id - 2]?.name} to unlock`}
              left={
                <View className="size-9 rounded-full items-center justify-center" style={{ backgroundColor: unlocked ? BeachColors[b.id - 1] : Palette.fog }}>
                  {unlocked ? <Text className="font-heavy text-sm text-cocoa">{b.id}</Text> : <Icon sf="lock.fill" md="lock" size={13} color={Palette.cocoaSoft} />}
                </View>
              }
              right={unlocked ? <StarRow stars={rec?.bestStars ?? 0} size={14} /> : undefined}
              onPress={() => open(b.id)}
            />
          );
        })}
      </Card>

      <Text className="font-sans text-sm text-muted text-center">You have picked up {totalPlastic} pieces so far.</Text>
    </ScrollView>
  );
}
