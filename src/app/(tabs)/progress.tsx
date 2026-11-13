import { router } from 'expo-router';
import { ScrollView, Switch, Text, View } from 'react-native';

import { Card } from '@/components/card';
import { ListRow } from '@/components/list-row';
import { Palette, softShadow } from '@/constants/theme';
import { MOON_THEME_COPY } from '@/features/content/data/worlds';
import type { MoonTheme } from '@/features/content/types/content';
import { Icon } from '@/features/lalin/components/icon';
import { MoodFace } from '@/features/lalin/components/mood-face';
import { MoonAvatar } from '@/features/lalin/components/moon-avatar';
import { MoonShape } from '@/features/lalin/components/moon-shape';
import { StarRow } from '@/features/lalin/components/star-row';
import { totalStars, useLalinStore } from '@/features/lalin/store/lalin-store';
import { currentStreak, LAGOON_LEVELS, lagoonLevel } from '@/features/lalin/utils/lagoon';
import { addDays, dayKey, prettyDate, weekdayShort } from '@/lib/dates';

const THEME_CYCLE: Record<MoonTheme, number> = { new: 0.02, waxing: 0.3, full: 0.5, waning: 0.72 };

function Tile({ value, label }: { value: string; label: string }) {
  return (
    <View className="flex-1 rounded-3xl bg-white p-4 gap-0.5" style={softShadow}>
      <Text className="font-display-bold text-2xl text-cocoa">{value}</Text>
      <Text className="font-strong text-xs text-muted">{label}</Text>
    </View>
  );
}

export default function ProgressScreen() {
  const profile = useLalinStore((s) => s.profile);
  const totalQuests = useLalinStore((s) => s.totalQuests);
  const completions = useLalinStore((s) => s.completions);
  const xp = useLalinStore((s) => s.xp);
  const moods = useLalinStore((s) => s.moods);
  const levels = useLalinStore((s) => s.levels);
  const totalPlastic = useLalinStore((s) => s.totalPlastic);
  const guardian = useLalinStore((s) => s.guardian);
  const themeCounts = useLalinStore((s) => s.themeCounts);
  const fullMoonNights = useLalinStore((s) => s.fullMoonNights);
  const letters = useLalinStore((s) => s.letters);
  const soundOn = useLalinStore((s) => s.soundOn);
  const toggleSound = useLalinStore((s) => s.toggleSound);

  const level = lagoonLevel(totalQuests);
  const streak = currentStreak(completions);
  const today = dayKey();
  const week = [-6, -5, -4, -3, -2, -1, 0].map((n) => addDays(today, n));
  const now = Date.now();

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="px-5 pt-safe-offset-2 pb-safe-offset-22 gap-6">
      <View className="flex-row items-center gap-4">
        <MoonAvatar avatar={profile?.avatar ?? 'pearl'} size={56} />
        <View className="flex-1 gap-0.5">
          <Text className="text-3xl font-display-bold text-foreground">{profile?.nickname ?? 'You'}</Text>
          <Text className="font-sans text-base text-muted">{LAGOON_LEVELS[level].name} · level {level + 1} of 5</Text>
        </View>
      </View>

      <View className="flex-row gap-3">
        <Tile value={String(totalQuests)} label="Quests" />
        <Tile value={String(streak)} label="Day streak" />
        <Tile value={String(xp)} label="XP" />
      </View>

      <View className="gap-3">
        <Text className="font-heavy text-xs uppercase tracking-wide text-muted">This week</Text>
        <Card>
          <View className="flex-row justify-between">
            {week.map((d) => (
              <View key={d} className="items-center gap-2">
                {moods[d] ? (
                  <MoodFace value={moods[d]} size={34} />
                ) : (completions[d]?.length ?? 0) > 0 ? (
                  <View className="size-9 rounded-full bg-mint items-center justify-center">
                    <Icon sf="checkmark" md="check" size={14} color={Palette.cocoa} />
                  </View>
                ) : (
                  <View className="size-9 rounded-full bg-milk" />
                )}
                <Text className={d === today ? 'font-heavy text-xs text-cocoa' : 'font-strong text-xs text-muted'}>{weekdayShort(d)}</Text>
              </View>
            ))}
          </View>
        </Card>
      </View>

      <View className="gap-3">
        <Text className="font-heavy text-xs uppercase tracking-wide text-muted">Moon badges</Text>
        <View className="flex-row flex-wrap gap-3">
          {(Object.keys(THEME_CYCLE) as MoonTheme[]).map((t) => {
            const n = themeCounts[t] ?? 0;
            return (
              <View key={t} className={n > 0 ? 'w-[47%] rounded-3xl bg-lavender p-4 gap-2' : 'w-[47%] rounded-3xl bg-white/60 p-4 gap-2'}>
                <MoonShape cycle={THEME_CYCLE[t]} size={30} dark={n > 0 ? Palette.milk : Palette.fog} />
                <Text className="font-strong text-sm text-cocoa">{MOON_THEME_COPY[t].name}</Text>
                <Text className="font-sans text-xs text-muted">{n > 0 ? `${n} ${n === 1 ? 'quest' : 'quests'}` : 'Not yet'}</Text>
              </View>
            );
          })}
        </View>
        <Text className="font-sans text-sm text-muted">Full Moon Nights: {fullMoonNights.length}</Text>
      </View>

      <View className="gap-3">
        <Text className="font-heavy text-xs uppercase tracking-wide text-muted">For the island</Text>
        <View className="flex-row gap-3">
          <Tile value={String(totalPlastic)} label="Pieces picked up" />
          <View className="flex-1 rounded-3xl bg-white p-4 gap-2" style={softShadow}>
            <Text className="font-display-bold text-2xl text-cocoa">{totalStars(levels)}/18</Text>
            <StarRow stars={Math.min(3, Math.round(totalStars(levels) / 6))} size={14} />
          </View>
        </View>
        {guardian ? (
          <View className="flex-row items-center gap-3 rounded-3xl bg-honey p-4">
            <Icon sf="shield.fill" md="shield" size={22} />
            <Text className="flex-1 font-strong text-base text-cocoa">Guardian of the Lagoon</Text>
          </View>
        ) : (
          <Text className="font-sans text-sm text-muted">Finish Île aux Cerfs to become Guardian of the Lagoon.</Text>
        )}
      </View>

      <View className="gap-3">
        <Text className="font-heavy text-xs uppercase tracking-wide text-muted">Moon letters</Text>
        <Card list>
          {letters.length === 0 ? (
            <ListRow title="Write to future you" subtitle="On a full moon. It opens at the next one." onPress={() => router.push('/letter')} />
          ) : null}
          {letters.map((l) => {
            const open = new Date(l.unlockAt).getTime() <= now;
            return (
              <ListRow
                key={l.id}
                title={open ? l.text : 'Sealed until the next full moon'}
                subtitle={open ? `Written ${prettyDate(new Date(l.writtenAt))}` : `Opens ${prettyDate(new Date(l.unlockAt))}`}
                left={<Icon sf={open ? 'envelope.open.fill' : 'envelope.fill'} md={open ? 'drafts' : 'mail'} size={18} color={Palette.turquoiseDeep} />}
              />
            );
          })}
        </Card>
      </View>

      <Card list>
        <ListRow title="Leaderboard and mission" left={<Icon sf="trophy.fill" md="emoji_events" size={18} color={Palette.honeyDeep} />} onPress={() => router.push('/leaderboard')} />
        <ListRow title="Need to talk?" left={<Icon sf="heart.text.square.fill" md="support" size={18} color={Palette.clay} />} onPress={() => router.push('/help')} />
        <ListRow title="Sounds" subtitle="Waves and haptic chimes" right={<Switch value={soundOn} onValueChange={toggleSound} trackColor={{ true: Palette.turquoise }} />} />
      </Card>
    </ScrollView>
  );
}
