import { useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { Presets } from 'react-native-pulsar';

import { Card } from '@/components/card';
import { Palette, softShadow } from '@/constants/theme';
import { COMMUNITY_GOAL, type AvatarID } from '@/features/content/data/worlds';
import { fetchCommunityPlastic, fetchLeaderboard, fetchMission, setMissionSignup } from '@/features/lalin/api/community';
import { BackButton } from '@/features/lalin/components/back-button';
import { Icon } from '@/features/lalin/components/icon';
import { MissionBar } from '@/features/lalin/components/mission-bar';
import { MoonAvatar } from '@/features/lalin/components/moon-avatar';
import { PillButton } from '@/features/lalin/components/pill-button';
import { useLalinStore } from '@/features/lalin/store/lalin-store';
import { useRemote } from '@/hooks/use-remote';

export default function Leaderboard() {
  const profile = useLalinStore((s) => s.profile);
  const signedUp = useLalinStore((s) => s.missionSignedUp);
  const setSignedUp = useLalinStore((s) => s.setMissionSignedUp);
  const [busy, setBusy] = useState(false);
  const board = useRemote('leaderboard', fetchLeaderboard);
  const total = useRemote('community', fetchCommunityPlastic);
  const mission = useRemote('mission', fetchMission);

  const plastic = total.data ?? 0;
  const unlocked = plastic >= COMMUNITY_GOAL;
  const m = mission.data?.mission ?? null;
  const rows = (board.data ?? []).slice(0, 10);

  const toggle = async () => {
    if (!m || !profile) return;
    setBusy(true);
    try {
      await setMissionSignup(m.id, profile, !signedUp);
      setSignedUp(!signedUp);
      if (!signedUp) Presets.System.notificationSuccess();
      mission.reload();
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="px-5 pt-safe-offset-2 pb-safe-offset-4 gap-6">
      <BackButton />
      <View className="gap-1">
        <Text className="text-3xl font-display-bold text-foreground">The real mission</Text>
        <Text className="font-sans text-base text-muted">Every piece in the game counts towards a real beach cleanup.</Text>
      </View>

      <View className="rounded-4xl bg-turquoise p-6 gap-4" style={softShadow}>
        <Text className="font-display-bold text-xl text-cocoa">{plastic.toLocaleString('en')} of {COMMUNITY_GOAL.toLocaleString('en')} pieces</Text>
        <MissionBar total={plastic} />
        {unlocked && m ? (
          <View className="rounded-3xl bg-white p-5 gap-2">
            <Text className="font-heavy text-xs uppercase tracking-wide text-muted">Unlocked</Text>
            <Text className="font-display-bold text-xl text-cocoa">{m.title}</Text>
            <Text className="font-sans text-base text-cocoa">{m.location} · {m.event_date}</Text>
            <Text className="font-sans text-sm text-muted">{mission.data?.signups ?? 0} going. Bring water, a hat and a friend.</Text>
            <PillButton label={signedUp ? "You're going. Change mind" : "I'll be there"} tone={signedUp ? 'white' : 'cocoa'} onPress={toggle} disabled={busy} />
          </View>
        ) : (
          <View className="flex-row items-center gap-3">
            <Icon sf="lock.fill" md="lock" size={16} />
            <Text className="flex-1 font-strong text-sm text-cocoa">
              At {COMMUNITY_GOAL.toLocaleString('en')}, a real cleanup opens: Flic en Flac, Saturday morning.
            </Text>
          </View>
        )}
      </View>

      <View className="gap-3">
        <Text className="font-heavy text-xs uppercase tracking-wide text-muted">Top 10 this week</Text>
        <Card>
          {board.loading && rows.length === 0 ? <ActivityIndicator color={Palette.cocoa} /> : null}
          {board.error && rows.length === 0 ? <Text className="font-sans text-sm text-muted">Could not load the board just now.</Text> : null}
          <View className="gap-1">
            {rows.map((r, i) => {
              const me = r.player_id === profile?.playerId;
              return (
                <View key={r.player_id} className={me ? 'flex-row items-center gap-3 rounded-2xl bg-honey px-3 py-2' : 'flex-row items-center gap-3 px-3 py-2'}>
                  <Text className="w-6 font-heavy text-base text-muted">{i + 1}</Text>
                  <MoonAvatar avatar={r.avatar as AvatarID} size={32} />
                  <Text className="flex-1 font-strong text-base text-cocoa" numberOfLines={1}>{me ? `${r.nickname} (you)` : r.nickname}</Text>
                  <View className="items-end">
                    <Text className="font-heavy text-sm text-cocoa">{r.stars} stars</Text>
                    <Text className="font-sans text-xs text-muted">{r.plastic} pieces</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </Card>
        <Text className="font-sans text-xs text-muted text-center">Nicknames only. Ranked by stars, then plastic.</Text>
      </View>
    </ScrollView>
  );
}
