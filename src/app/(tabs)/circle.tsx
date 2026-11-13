import { useState } from 'react';
import { ActivityIndicator, ScrollView, Share, Text, TextInput, View } from 'react-native';
import { Presets } from 'react-native-pulsar';

import { Card } from '@/components/card';
import { ListRow } from '@/components/list-row';
import { Pressable } from '@/components/pressable';
import { Palette, softShadow } from '@/constants/theme';
import { CIRCLE_NAMES, MESSAGE_KEYS, MESSAGES } from '@/features/content/data/worlds';
import { createCircle, fetchEncouragements, fetchMembers, joinCircle, leaveCircle, sendEncouragement, type CircleMember } from '@/features/lalin/api/community';
import { Icon } from '@/features/lalin/components/icon';
import { MoonAvatar } from '@/features/lalin/components/moon-avatar';
import { MoonShape } from '@/features/lalin/components/moon-shape';
import { PillButton } from '@/features/lalin/components/pill-button';
import { useLalinStore } from '@/features/lalin/store/lalin-store';
import type { AvatarID } from '@/features/content/data/worlds';
import type { MessageKey } from '@/features/content/types/content';
import { useRemote } from '@/hooks/use-remote';
import { confirmDelete } from '@/lib/confirm';
import { dayKey } from '@/lib/dates';
import { cycleForFraction } from '@/lib/moon';

function NoCircle() {
  const profile = useLalinStore((s) => s.profile);
  const setCircle = useLalinStore((s) => s.setCircle);
  const [name, setName] = useState(CIRCLE_NAMES[0]);
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (fn: () => Promise<{ id: string; code: string; name: string }>) => {
    if (!profile) return;
    setBusy(true);
    setError(null);
    try {
      const ref = await fn();
      Presets.System.notificationSuccess();
      setCircle(ref);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Try again?');
      Presets.System.notificationError();
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <View className="rounded-4xl bg-lavender p-6 gap-3 items-center" style={softShadow}>
        <View className="flex-row gap-2">
          {[0.15, 0.35, 0.5, 0.65, 0.85].map((c) => (
            <MoonShape key={c} cycle={c} size={26} dark={Palette.milk} />
          ))}
        </View>
        <Text className="font-display-bold text-2xl text-cocoa text-center">A small moon, shared</Text>
        <Text className="font-sans text-base text-cocoa text-center leading-relaxed">
          2 to 5 friends. Your shared moon is full on days when everyone does a quest. Messages are kind ones only, picked from four.
        </Text>
      </View>

      <View className="gap-3">
        <Text className="font-heavy text-xs uppercase tracking-wide text-muted">Start a circle</Text>
        <View className="flex-row flex-wrap gap-2">
          {CIRCLE_NAMES.map((n) => (
            <Pressable key={n} onPress={() => setName(n)} accessibilityRole="button" accessibilityState={{ selected: n === name }} className="rounded-full">
              <View className={n === name ? 'rounded-full bg-cocoa px-4 py-2' : 'rounded-full bg-white px-4 py-2'}>
                <Text className={n === name ? 'font-strong text-sm text-milk' : 'font-strong text-sm text-cocoa'}>{n}</Text>
              </View>
            </Pressable>
          ))}
        </View>
        <PillButton label={`Start ${name}`} onPress={() => run(() => createCircle(profile!, name))} disabled={busy || !profile} />
      </View>

      <View className="gap-3">
        <Text className="font-heavy text-xs uppercase tracking-wide text-muted">Join with a code</Text>
        <View className="h-14 rounded-full bg-white px-6 justify-center" style={softShadow}>
          <TextInput
            value={code}
            onChangeText={(v) => setCode(v.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))}
            placeholder="6 letters, like LUNA42"
            placeholderTextColor={Palette.cocoaSoft}
            autoCapitalize="characters"
            autoCorrect={false}
            className="font-heavy text-lg leading-none text-cocoa tracking-widest"
            accessibilityLabel="Circle code"
          />
        </View>
        <PillButton label="Join circle" tone="peach" onPress={() => run(() => joinCircle(profile!, code))} disabled={busy || code.length !== 6 || !profile} />
      </View>

      {busy ? <ActivityIndicator color={Palette.cocoa} /> : null}
      {error ? <Text className="font-strong text-sm text-clay text-center">{error}</Text> : null}
    </>
  );
}

function MemberRow({ member, me, onSend, sent }: { member: CircleMember; me: boolean; onSend: (key: MessageKey) => void; sent: MessageKey | null }) {
  const doneToday = member.last_quest_date === dayKey();
  return (
    <View className="gap-3 py-3">
      <View className="flex-row items-center gap-3">
        <MoonAvatar avatar={member.avatar as AvatarID} size={40} sleepy={!doneToday} />
        <View className="flex-1 gap-0.5">
          <Text className="font-strong text-base text-cocoa">{me ? `${member.nickname} (you)` : member.nickname}</Text>
          <Text className="font-sans text-sm text-muted">{doneToday ? 'Did a quest today' : 'Not yet today'}</Text>
        </View>
        {doneToday ? <Icon sf="checkmark.circle.fill" md="check_circle" size={22} color={Palette.turquoiseDeep} /> : null}
      </View>
      {me ? null : sent ? (
        <Text className="font-strong text-sm text-turquoise-deep">Sent: {MESSAGES[sent]}</Text>
      ) : (
        <View className="flex-row flex-wrap gap-2">
          {MESSAGE_KEYS.map((k) => (
            <PillButton key={k} label={MESSAGES[k]} size="sm" tone="mist" onPress={() => onSend(k)} />
          ))}
        </View>
      )}
    </View>
  );
}

function InCircle() {
  const profile = useLalinStore((s) => s.profile);
  const circle = useLalinStore((s) => s.circle);
  const setCircle = useLalinStore((s) => s.setCircle);
  const [sent, setSent] = useState<Record<string, MessageKey>>({});
  const [sendError, setSendError] = useState<string | null>(null);
  const circleID = circle?.id ?? '';
  const playerID = profile?.playerId ?? '';
  const members = useRemote(`members-${circleID}`, () => fetchMembers(circleID));
  const inbox = useRemote(`inbox-${circleID}`, () => fetchEncouragements(circleID, playerID));

  if (!circle || !profile) return null;

  const list = members.data ?? [];
  const today = dayKey();
  const doneCount = list.filter((m) => m.last_quest_date === today).length;
  const fraction = list.length > 0 ? doneCount / list.length : 0;
  const full = list.length > 0 && doneCount === list.length;

  const send = async (to: CircleMember, key: MessageKey) => {
    setSendError(null);
    try {
      await sendEncouragement(circle.id, profile, to, key);
      Presets.System.notificationSuccess();
      setSent((s) => ({ ...s, [to.player_id]: key }));
    } catch (e) {
      setSendError(e instanceof Error ? e.message : 'Could not send that one. Try again?');
    }
  };

  const leave = () =>
    confirmDelete({
      title: `Leave ${circle.name}?`,
      message: 'You can join again later with the code.',
      confirmLabel: 'Leave',
      onConfirm: async () => {
        await leaveCircle(circle.id, profile.playerId).catch(() => undefined);
        setCircle(null);
      },
    });

  return (
    <>
      <View className="rounded-4xl bg-lavender p-6 gap-4 items-center" style={softShadow}>
        <MoonShape cycle={cycleForFraction(fraction)} size={120} dark={Palette.milk} />
        <View className="items-center gap-1">
          <Text className="font-display-bold text-2xl text-cocoa text-center">{full ? 'Full moon tonight' : `${doneCount} of ${list.length || '...'} lit today`}</Text>
          <Text className="font-sans text-base text-cocoa text-center">
            {full ? 'Everyone did a quest. Bravo, all of you.' : 'The moon fills up as each of you does a quest today.'}
          </Text>
        </View>
        <Pressable
          onPress={() => Share.share({ message: `Join my Lalin circle "${circle.name}" with the code ${circle.code}` }).catch(() => undefined)}
          accessibilityRole="button"
          accessibilityLabel={`Share code ${circle.code}`}
          className="rounded-full"
        >
          <View className="flex-row items-center gap-2 rounded-full bg-white px-5 py-2.5">
            <Text className="font-heavy text-base tracking-widest text-cocoa">{circle.code}</Text>
            <Icon sf="square.and.arrow.up" md="share" size={15} />
          </View>
        </Pressable>
      </View>

      <View className="gap-3">
        <Text className="font-heavy text-xs uppercase tracking-wide text-muted">Members · {list.length}/5</Text>
        <Card>
          {members.loading && list.length === 0 ? <ActivityIndicator color={Palette.cocoa} /> : null}
          {members.error && list.length === 0 ? <Text className="font-sans text-sm text-muted">Could not reach your circle. Pull back in a moment.</Text> : null}
          {list.map((m) => (
            <MemberRow key={m.player_id} member={m} me={m.player_id === profile.playerId} sent={sent[m.player_id] ?? null} onSend={(k) => send(m, k)} />
          ))}
        </Card>
        {sendError ? <Text className="font-strong text-sm text-clay">{sendError}</Text> : null}
        {list.length === 1 ? <Text className="font-sans text-sm text-muted text-center">Send the code to a friend so the moon has company.</Text> : null}
      </View>

      <View className="gap-3">
        <Text className="font-heavy text-xs uppercase tracking-wide text-muted">For you</Text>
        <Card>
          {(inbox.data ?? []).length === 0 ? (
            <Text className="font-sans text-base text-muted">Nothing yet. Kind words land here.</Text>
          ) : (
            <View className="gap-3">
              {(inbox.data ?? []).map((m) => (
                <View key={m.id} className="flex-row items-center gap-3">
                  <View className="size-9 rounded-full bg-honey items-center justify-center">
                    <Icon sf="heart.fill" md="favorite" size={14} color={Palette.clay} />
                  </View>
                  <Text className="flex-1 font-sans text-base text-cocoa">
                    <Text className="font-strong">{m.from_nickname}</Text>: {MESSAGES[m.message_key as MessageKey] ?? ''}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </Card>
      </View>

      <Card list>
        <ListRow title="Leave this circle" left={<Icon sf="rectangle.portrait.and.arrow.right" md="logout" size={18} color={Palette.clay} />} onPress={leave} />
      </Card>
    </>
  );
}

export default function CircleScreen() {
  const circle = useLalinStore((s) => s.circle);
  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="px-5 pt-safe-offset-2 pb-safe-offset-22 gap-6" keyboardShouldPersistTaps="handled">
      <View className="gap-1">
        <Text className="text-3xl font-display-bold text-foreground">{circle ? circle.name : 'Moon Circle'}</Text>
        <Text className="font-sans text-base text-muted">{circle ? 'Your circle' : 'Friends who keep each other going'}</Text>
      </View>
      {circle ? <InCircle /> : <NoCircle />}
    </ScrollView>
  );
}
