import { randomUUID } from 'expo-crypto';
import { router } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, useWindowDimensions, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Presets } from 'react-native-pulsar';

import { Pressable } from '@/components/pressable';
import { Palette, WorldColors, WorldInk, softShadow } from '@/constants/theme';
import { AVATARS, WORLD_ORDER, WORLDS, type AvatarID } from '@/features/content/data/worlds';
import type { WorldID } from '@/features/content/types/content';
import { Icon } from '@/features/lalin/components/icon';
import { Lagoon } from '@/features/lalin/components/lagoon';
import { MoonAvatar } from '@/features/lalin/components/moon-avatar';
import { PillButton } from '@/features/lalin/components/pill-button';
import { useLalinStore } from '@/features/lalin/store/lalin-store';
import { cn } from '@/lib/cn';
import { durations } from '@/lib/motion';

const SLIDES = [
  { title: 'Mauritius has a lagoon. So do you.', body: 'Yours lives in this app. Right now it is a bit misty.', heal: 0 },
  { title: 'Small daily things keep it alive.', body: 'A glass of water, a deep breath, one brave message. Each one clears the water.', heal: 0.55 },
  { title: 'And your moves help clean the real one.', body: 'Every piece of plastic you pick up in Lalin Run counts toward a real beach cleanup.', heal: 1 },
];

export default function Onboarding() {
  const { width } = useWindowDimensions();
  const finish = useLalinStore((s) => s.finishOnboarding);
  const [step, setStep] = useState(0);
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState<AvatarID>('pearl');
  const [favorites, setFavorites] = useState<WorldID[]>([]);

  const toggleWorld = (id: WorldID) => {
    setFavorites((prev) => {
      if (prev.includes(id)) return prev.filter((w) => w !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  const done = () => {
    const raw = nickname.trim();
    const name = raw.charAt(0).toUpperCase() + raw.slice(1);
    if (!name || favorites.length < 2) return;
    Presets.System.notificationSuccess();
    finish({ nickname: name.slice(0, 16), avatar, favorites, playerId: randomUUID() });
    router.replace('/');
  };

  if (step < SLIDES.length) {
    const s = SLIDES[step];
    return (
      <View className="flex-1 bg-background px-5 pt-safe-offset-6 pb-safe-offset-4 justify-between">
        <View className="flex-row justify-between items-center">
          <Text className="font-display-bold text-2xl text-cocoa">Lalin</Text>
          <Pressable onPress={() => setStep(SLIDES.length)} accessibilityRole="button" className="rounded-full">
            <Text className="font-strong text-sm text-muted px-2 py-2">Skip</Text>
          </Pressable>
        </View>
        <Animated.View key={step} entering={FadeIn.duration(durations.draw)} exiting={FadeOut.duration(durations.fast)} className="gap-8">
          <View style={softShadow} className="rounded-3xl">
            <Lagoon heal={s.heal} width={width - 40} />
          </View>
          <View className="gap-3">
            <Text className="font-display-bold text-4xl text-cocoa leading-tight">{s.title}</Text>
            <Text className="font-sans text-lg text-muted leading-relaxed">{s.body}</Text>
          </View>
        </Animated.View>
        <View className="gap-5">
          <View className="flex-row gap-2 justify-center">
            {SLIDES.map((_, i) => (
              <View key={i} className={cn('h-2 rounded-full', i === step ? 'w-6 bg-clay' : 'w-2 bg-peach')} />
            ))}
          </View>
          <PillButton label={step === SLIDES.length - 1 ? 'Make it mine' : 'Next'} onPress={() => setStep(step + 1)} />
        </View>
      </View>
    );
  }

  const ready = nickname.trim().length > 0 && favorites.length === 2;

  return (
    <KeyboardAwareScrollView
      className="flex-1 bg-background"
      contentContainerClassName="px-5 pt-safe-offset-6 pb-safe-offset-4 gap-8"
      bottomOffset={24}
      keyboardShouldPersistTaps="handled"
    >
      <View className="gap-2">
        <Text className="font-display-bold text-3xl text-cocoa">Who is looking after this lagoon?</Text>
        <Text className="font-sans text-base text-muted">A nickname is enough. No real names needed.</Text>
      </View>

      <View className="items-center gap-5">
        <MoonAvatar avatar={avatar} size={110} />
        <View className="flex-row gap-3">
          {AVATARS.map((a) => (
            <Pressable key={a.id} onPress={() => setAvatar(a.id)} accessibilityRole="button" accessibilityLabel={`${a.name} moon`} className="rounded-full">
              <View className={cn('rounded-full p-1', avatar === a.id ? 'bg-clay' : 'bg-transparent')}>
                <View className="rounded-full bg-white p-1">
                  <MoonAvatar avatar={a.id} size={44} />
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </View>

      <View className="gap-2">
        <Text className="font-heavy text-xs uppercase tracking-wide text-muted px-1">Nickname</Text>
        <TextInput
          value={nickname}
          onChangeText={setNickname}
          placeholder="Like Mimi or Shell"
          placeholderTextColor={Palette.cocoaSoft}
          maxLength={16}
          autoCorrect={false}
          autoCapitalize="words"
          returnKeyType="done"
          className="h-14 rounded-full bg-white px-6 font-strong text-lg text-cocoa leading-none"
          style={softShadow}
        />
      </View>

      <View className="gap-3">
        <View className="gap-1 px-1">
          <Text className="font-heavy text-xs uppercase tracking-wide text-muted">Pick two favourite worlds</Text>
          <Text className="font-sans text-sm text-muted">Their quests show up first.</Text>
        </View>
        <View className="flex-row flex-wrap gap-3">
          {WORLD_ORDER.map((id) => {
            const w = WORLDS[id];
            const on = favorites.includes(id);
            return (
              <Pressable
                key={id}
                onPress={() => toggleWorld(id)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: on }}
                className="rounded-3xl"
                style={{ width: (width - 52) / 2 }}
              >
                <View
                  className={cn('rounded-3xl p-4 gap-3', on ? null : 'opacity-70')}
                  style={[{ backgroundColor: on ? WorldColors[id] : Palette.white }, softShadow]}
                >
                  <View className="flex-row justify-between items-center">
                    <View className="size-10 rounded-full items-center justify-center" style={{ backgroundColor: on ? Palette.white : WorldColors[id] }}>
                      <Icon sf={w.sf} md={w.md} size={18} color={WorldInk[id]} />
                    </View>
                    {on ? <Icon sf="checkmark.circle.fill" md="check_circle" size={20} color={WorldInk[id]} /> : null}
                  </View>
                  <View className="gap-0.5">
                    <Text className="font-display text-lg text-cocoa">{w.name}</Text>
                    <Text className="font-sans text-xs text-cocoa">{w.blurb}</Text>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View className="flex-row gap-3 items-center rounded-3xl bg-mint/60 p-4">
        <Icon sf="lock.fill" md="lock" size={16} color={WorldInk.mind} />
        <Text className="flex-1 font-strong text-sm text-cocoa">Your mood and notes stay on your phone. Nobody else sees them.</Text>
      </View>

      <PillButton label="Wake up my lagoon" onPress={done} disabled={!ready} />
    </KeyboardAwareScrollView>
  );
}
