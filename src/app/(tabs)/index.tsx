import { useAudioPlayer } from 'expo-audio';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, Text, useWindowDimensions, View } from 'react-native';

import { Card } from '@/components/card';
import { ListRow } from '@/components/list-row';
import { Pressable } from '@/components/pressable';
import { Section } from '@/components/section';
import { Palette, WorldColors, WorldInk, softShadow } from '@/constants/theme';
import { MOON_THEME_COPY, WORLDS } from '@/features/content/data/worlds';
import { Icon } from '@/features/lalin/components/icon';
import { Lagoon } from '@/features/lalin/components/lagoon';
import { MissionBar } from '@/features/lalin/components/mission-bar';
import { MoonAvatar } from '@/features/lalin/components/moon-avatar';
import { MoonShape } from '@/features/lalin/components/moon-shape';
import { SoftStar } from '@/features/lalin/components/star-row';
import { fetchCommunityPlastic } from '@/features/lalin/api/community';
import { useToday } from '@/features/lalin/hooks/use-today';
import { totalStars, useLalinStore } from '@/features/lalin/store/lalin-store';
import { currentStreak, isLagoonQuiet, LAGOON_LEVELS, lagoonHeal, lagoonLevel, questsToNextLevel } from '@/features/lalin/utils/lagoon';
import { useRemote } from '@/hooks/use-remote';
import { cn } from '@/lib/cn';
import { moonCountdown } from '@/lib/moon';

function greeting(): string {
  const h = new Date().getHours();
  if (h < 5 || h >= 18) return 'Bonswar';
  return 'Bonzour';
}

function Stat({ value, label, icon, md, color }: { value: string; label: string; icon: string; md: string; color: string }) {
  return (
    <View className="flex-1 rounded-3xl bg-white px-3 py-3 gap-1 items-center" style={softShadow}>
      <View className="flex-row items-center gap-1.5">
        <Icon sf={icon} md={md} size={15} color={color} />
        <Text className="font-display-bold text-xl text-cocoa">{value}</Text>
      </View>
      <Text className="font-strong text-xs text-muted">{label}</Text>
    </View>
  );
}

export default function Home() {
  const { width } = useWindowDimensions();
  const profile = useLalinStore((s) => s.profile);
  const totalQuests = useLalinStore((s) => s.totalQuests);
  const lastQuestDay = useLalinStore((s) => s.lastQuestDay);
  const completions = useLalinStore((s) => s.completions);
  const energy = useLalinStore((s) => s.energy);
  const levels = useLalinStore((s) => s.levels);
  const ambientOn = useLalinStore((s) => s.ambientOn);
  const toggleAmbient = useLalinStore((s) => s.toggleAmbient);
  const { moon, quests, done } = useToday();
  const community = useRemote('community', fetchCommunityPlastic);
  const player = useAudioPlayer(require('../../../assets/sounds/waves.wav'));

  useEffect(() => {
    player.loop = true;
    player.volume = 0.35;
    if (ambientOn) player.play();
    else player.pause();
  }, [ambientOn, player]);

  const level = lagoonLevel(totalQuests);
  const quiet = isLagoonQuiet(lastQuestDay, totalQuests);
  const toNext = questsToNextLevel(totalQuests);
  const streak = currentStreak(completions);
  const stars = totalStars(levels);
  const lagoonWidth = width - 40;

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="px-5 pt-safe-offset-2 pb-safe-offset-22 gap-6">
      <View className="flex-row items-center gap-3 pt-2">
        <MoonAvatar avatar={profile?.avatar ?? 'pearl'} size={46} sleepy={quiet} />
        <View className="flex-1">
          <Text className="font-display-bold text-3xl text-cocoa" numberOfLines={1}>
            {greeting()}, {profile?.nickname ?? 'friend'}
          </Text>
        </View>
        <Pressable
          onPress={toggleAmbient}
          accessibilityRole="switch"
          accessibilityLabel="Ocean sound"
          accessibilityState={{ checked: ambientOn }}
          className="rounded-full"
        >
          <View className="size-11 rounded-full bg-white items-center justify-center" style={softShadow}>
            {ambientOn ? (
              <Icon sf="speaker.wave.2.fill" md="volume_up" size={16} color={Palette.turquoiseDeep} />
            ) : (
              <Icon sf="speaker.slash.fill" md="volume_off" size={16} color={Palette.cocoaSoft} />
            )}
          </View>
        </Pressable>
      </View>

      <Pressable onPress={() => (moon.isFull ? router.push('/letter') : null)} accessibilityRole={moon.isFull ? 'button' : 'text'} className="rounded-3xl">
        <View className={cn('flex-row items-center gap-3 rounded-3xl px-4 py-3', moon.isFull ? 'bg-honey' : 'bg-lavender')}>
          <MoonShape cycle={moon.cycle} size={40} lit={Palette.honeyDeep} dark={Palette.white} />
          <View className="flex-1 gap-0.5">
            <Text className="font-heavy text-sm text-cocoa">
              {moon.isFull ? 'Full Moon Night' : `${moon.name} · ${moonCountdown(moon)}`}
            </Text>
            <Text className="font-sans text-sm text-cocoa" numberOfLines={2}>
              {moon.isFull ? 'Double plastic in Lalin Run tonight. Write a letter to future you.' : MOON_THEME_COPY[moon.theme].line}
            </Text>
          </View>
          {moon.isFull ? <Icon sf="envelope.fill" md="mail" size={18} color={Palette.cocoa} /> : null}
        </View>
      </Pressable>

      <View className="gap-3">
        <View className="rounded-3xl" style={softShadow}>
          <Lagoon heal={lagoonHeal(totalQuests)} width={lagoonWidth} quiet={quiet} />
        </View>
        <View className="flex-row items-end justify-between px-1">
          <View className="flex-1 gap-0.5">
            <Text className="font-heavy text-xs uppercase tracking-wide text-muted">My lagoon · Level {level + 1}</Text>
            <Text className="font-display-bold text-2xl text-cocoa">{LAGOON_LEVELS[level].name}</Text>
            <Text className="font-sans text-sm text-muted">
              {quiet ? "Your lagoon's been quiet. Come back when you're ready." : LAGOON_LEVELS[level].line}
            </Text>
          </View>
        </View>
        {toNext !== null ? (
          <Text className="font-strong text-sm text-turquoise-deep px-1">
            {toNext === 1 ? '1 quest' : `${toNext} quests`} to {LAGOON_LEVELS[level + 1].name}
          </Text>
        ) : null}
      </View>

      <View className="flex-row gap-3">
        <Stat value={String(streak)} label={streak === 1 ? 'day streak' : 'day streak'} icon="flame.fill" md="local_fire_department" color={Palette.clay} />
        <Stat value={String(energy)} label="Moon Energy" icon="bolt.fill" md="bolt" color={Palette.honeyDeep} />
        <Stat value={`${done.length}/4`} label="today" icon="checkmark.circle.fill" md="check_circle" color={Palette.turquoiseDeep} />
      </View>

      <Section title="Today's quests">
        <View className="gap-3">
          {quests.map((q) => {
            const isDone = done.includes(q.id);
            const w = WORLDS[q.world];
            return (
              <Pressable key={q.id} onPress={() => router.push(`/quest/${q.id}`)} accessibilityRole="button" accessibilityLabel={`${w.name} quest: ${q.title}${isDone ? ', done' : ''}`} className="rounded-3xl">
                <View className="flex-row items-center gap-4 rounded-3xl p-4" style={[{ backgroundColor: WorldColors[q.world] }, softShadow]}>
                  <View className="size-12 rounded-full bg-white items-center justify-center">
                    <Icon sf={w.sf} md={w.md} size={20} color={WorldInk[q.world]} />
                  </View>
                  <View className="flex-1 gap-0.5">
                    <Text className="font-heavy text-xs uppercase tracking-wide" style={{ color: WorldInk[q.world] }}>
                      {w.name} · +{q.xp} XP
                    </Text>
                    <Text className={cn('font-display text-lg text-cocoa', isDone ? 'opacity-50' : null)} numberOfLines={2}>
                      {q.title}
                    </Text>
                  </View>
                  {isDone ? (
                    <View className="size-8 rounded-full bg-white items-center justify-center">
                      <Icon sf="checkmark" md="check" size={14} color={WorldInk[q.world]} />
                    </View>
                  ) : (
                    <View className="size-8 rounded-full bg-white/70 items-center justify-center">
                      <Icon sf="plus" md="add" size={14} color={WorldInk[q.world]} />
                    </View>
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>
      </Section>

      <Pressable onPress={() => router.push('/run')} accessibilityRole="button" accessibilityLabel="Open Lalin Run" className="rounded-3xl">
        <View className="rounded-3xl bg-turquoise p-5 gap-3" style={softShadow}>
          <View className="flex-row items-center justify-between">
            <Text className="font-display-bold text-2xl text-cocoa">Lalin Run</Text>
            <View className="flex-row items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5">
              <SoftStar size={14} />
              <Text className="font-heavy text-sm text-cocoa">{stars}/18</Text>
            </View>
          </View>
          <Text className="font-sans text-sm text-cocoa">Six real beaches. Run, dodge crabs, pick up plastic. Each run costs 1 Moon Energy.</Text>
          <View className="self-start rounded-full bg-cocoa px-5 py-2.5">
            <Text className="font-heavy text-sm text-milk">Play</Text>
          </View>
        </View>
      </Pressable>

      <Section title="Real mission">
        <Card list>
          <View className="gap-3 py-4">
            <View className="gap-0.5">
              <Text className="font-display text-lg text-cocoa">Clean up Flic en Flac, for real</Text>
              <Text className="font-sans text-sm text-muted">When everyone together removes 10,000 pieces in Lalin Run, we meet on the beach.</Text>
            </View>
            <MissionBar total={community.data ?? 0} />
          </View>
          <ListRow title="Mission and leaderboard" onPress={() => router.push('/leaderboard')} />
        </Card>
      </Section>

      <Card list>
        <ListRow
          title="Need to talk?"
          subtitle="People you can call, any time"
          left={<Icon sf="heart.fill" md="favorite" size={18} color={Palette.clay} />}
          onPress={() => router.push('/help')}
        />
      </Card>
    </ScrollView>
  );
}
