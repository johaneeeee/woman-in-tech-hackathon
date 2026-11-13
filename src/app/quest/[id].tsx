import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { Text, TextInput, useWindowDimensions, View } from 'react-native';
import { KeyboardAwareScrollView, type KeyboardAwareScrollViewRef } from 'react-native-keyboard-controller';
import Animated, {
  FadeIn,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Presets } from 'react-native-pulsar';
import { scheduleOnRN } from 'react-native-worklets';

import { Pressable } from '@/components/pressable';
import { Palette, WorldColors, WorldInk, softShadow } from '@/constants/theme';
import { MOODS, WORLDS } from '@/features/content/data/worlds';
import { BackButton } from '@/features/lalin/components/back-button';
import { Confetti } from '@/features/lalin/components/confetti';
import { Icon } from '@/features/lalin/components/icon';
import { Lagoon } from '@/features/lalin/components/lagoon';
import { MoodFace } from '@/features/lalin/components/mood-face';
import { PillButton } from '@/features/lalin/components/pill-button';
import { markQuestDay } from '@/features/lalin/api/community';
import { useToday } from '@/features/lalin/hooks/use-today';
import { useContentStore } from '@/features/lalin/store/content-store';
import { useLalinStore } from '@/features/lalin/store/lalin-store';
import { LAGOON_LEVELS, lagoonHeal } from '@/features/lalin/utils/lagoon';
import { cn } from '@/lib/cn';
import { ambient, calmEase, durations } from '@/lib/motion';

interface Point {
  x: number;
  y: number;
}

const ORB = 28;

export default function QuestScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width } = useWindowDimensions();
  const quest = useContentStore((s) => s.quests.find((q) => q.id === id));
  const totalQuests = useLalinStore((s) => s.totalQuests);
  const moods = useLalinStore((s) => s.moods);
  const circle = useLalinStore((s) => s.circle);
  const profile = useLalinStore((s) => s.profile);
  const completeQuest = useLalinStore((s) => s.completeQuest);
  const logMood = useLalinStore((s) => s.logMood);
  const addJournal = useLalinStore((s) => s.addJournal);
  const { day, moon, done, answers } = useToday();
  const reduced = useReducedMotion();

  const [heal, setHeal] = useState(lagoonHeal(totalQuests));
  const [burst, setBurst] = useState(0);
  const [confetti, setConfetti] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'flying' | 'done'>('idle');
  const [levelUp, setLevelUp] = useState<number | null>(null);
  const [line, setLine] = useState('');
  const [mood, setMood] = useState<number | null>(moods[day] ?? null);

  const rootRef = useRef<View>(null);
  const buttonRef = useRef<View>(null);
  const lagoonRef = useRef<View>(null);
  const scrollRef = useRef<KeyboardAwareScrollViewRef>(null);
  const from = useSharedValue<Point>({ x: 0, y: 0 });
  const to = useSharedValue<Point>({ x: 0, y: 0 });
  const p = useSharedValue(0);
  const orbOpacity = useSharedValue(0);
  const reward = useSharedValue(0);

  const orbStyle = useAnimatedStyle(() => {
    const t = p.get();
    const a = from.get();
    const b = to.get();
    const x = a.x + (b.x - a.x) * t;
    const lift = Math.sin(t * Math.PI) * 90;
    const y = a.y + (b.y - a.y) * t - lift;
    return {
      opacity: orbOpacity.get(),
      transform: [{ translateX: x - ORB / 2 }, { translateY: y - ORB / 2 }, { scale: interpolate(t, [0, 0.5, 1], [0.6, 1.15, 0.5]) }],
    };
  });

  const rewardStyle = useAnimatedStyle(() => ({
    opacity: reward.get(),
    transform: [{ translateY: interpolate(reward.get(), [0, 1], [10, 0]) }],
  }));

  if (!quest) {
    return (
      <View className="flex-1 bg-background px-5 pt-safe-offset-2 pb-safe-offset-4 gap-6">
        <BackButton />
        <Text className="font-display-bold text-2xl text-cocoa">This quest drifted away.</Text>
        <PillButton label="Back to my lagoon" onPress={() => router.back()} />
      </View>
    );
  }

  const w = WORLDS[quest.world];
  const alreadyDone = done.includes(quest.id) && phase === 'idle';
  const lagoonWidth = width - 40;

  const needs = (() => {
    if (quest.kind === 'mood' && mood === null) return 'Pick a face first.';
    if (quest.kind === 'journal' && line.trim().length === 0) return 'Write one line first.';
    if (quest.kind === 'cards' && answers.length < 5) return `${answers.length}/5 cards answered.`;
    return null;
  })();

  const land = (healAfter: number, levelBefore: number, levelAfter: number) => {
    setHeal(healAfter);
    setBurst((b) => b + 1);
    Presets.System.notificationSuccess();
    setPhase('done');
    reward.set(withTiming(1, { duration: durations.draw, easing: calmEase }));
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), durations.draw);
    if (levelAfter > levelBefore) {
      setLevelUp(levelAfter);
      setConfetti((c) => c + 1);
    }
  };

  const finish = () => {
    if (needs || phase !== 'idle') return;
    if (quest.kind === 'mood' && mood !== null) logMood(mood);
    if (quest.kind === 'journal') addJournal(quest.id, line.trim());
    const result = completeQuest(quest.id, quest.xp, moon.theme, moon.isFull);
    if (circle && profile) markQuestDay(circle.id, profile.playerId).catch(() => undefined);
    Presets.System.impactSoft();
    setPhase('flying');

    if (reduced) {
      land(result.healAfter, result.levelBefore, result.levelAfter);
      return;
    }

    rootRef.current?.measureInWindow((rx, ry) => {
      buttonRef.current?.measureInWindow((bx, by, bw, bh) => {
        lagoonRef.current?.measureInWindow((lx, ly, lw, lh) => {
          from.set({ x: bx - rx + bw / 2, y: by - ry + bh / 2 });
          to.set({ x: lx - rx + lw * 0.5, y: ly - ry + lh * 0.55 });
          p.set(0);
          orbOpacity.set(withSequence(withTiming(1, { duration: durations.fast }), withDelay(ambient.orb - durations.fast * 2, withTiming(0, { duration: durations.fast }))));
          p.set(
            withTiming(1, { duration: ambient.orb, easing: calmEase }, (finished) => {
              if (finished) scheduleOnRN(land, result.healAfter, result.levelBefore, result.levelAfter);
            }),
          );
        });
      });
    });
  };

  return (
    <View ref={rootRef} className="flex-1 bg-background">
      <KeyboardAwareScrollView
        ref={scrollRef}
        className="flex-1"
        contentContainerClassName="px-5 pt-safe-offset-2 pb-safe-offset-4 gap-6"
        bottomOffset={24}
        keyboardShouldPersistTaps="handled"
      >
        <BackButton />

        <View className="gap-3">
          <View className="flex-row items-center gap-2 self-start rounded-full px-3 py-1.5" style={{ backgroundColor: WorldColors[quest.world] }}>
            <Icon sf={w.sf} md={w.md} size={13} color={WorldInk[quest.world]} />
            <Text className="font-heavy text-xs uppercase tracking-wide" style={{ color: WorldInk[quest.world] }}>
              {w.name} · +{quest.xp} XP
            </Text>
          </View>
          <Text className="font-display-bold text-3xl text-cocoa">{quest.title}</Text>
          <Text className="font-sans text-lg text-muted leading-relaxed">{quest.description}</Text>
        </View>

        {quest.kind === 'mood' ? (
          <View className="gap-3">
            <Text className="font-heavy text-xs uppercase tracking-wide text-muted px-1">How do you feel, honestly?</Text>
            <View className="flex-row justify-between rounded-3xl bg-white px-3 py-4" style={softShadow}>
              {MOODS.map((m) => (
                <Pressable
                  key={m.value}
                  onPress={() => (alreadyDone ? null : setMood(m.value))}
                  accessibilityRole="radio"
                  accessibilityLabel={m.label}
                  accessibilityState={{ selected: mood === m.value }}
                  className="items-center gap-1 rounded-2xl"
                >
                  <MoodFace value={m.value} size={50} dim={mood !== null && mood !== m.value} />
                  <Text className={cn('font-strong text-xs', mood === m.value ? 'text-cocoa' : 'text-muted')}>{m.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : null}

        {quest.kind === 'journal' && !alreadyDone ? (
          <View className="gap-2">
            <Text className="font-heavy text-xs uppercase tracking-wide text-muted px-1">One line. Just for you.</Text>
            <TextInput
              value={line}
              onChangeText={setLine}
              placeholder="Today I..."
              placeholderTextColor={Palette.cocoaSoft}
              maxLength={140}
              returnKeyType="done"
              editable={phase === 'idle'}
              className="h-14 rounded-full bg-white px-6 font-strong text-base text-cocoa leading-none"
              style={softShadow}
            />
            <Text className="font-sans text-xs text-muted px-2">Stays on this phone. Nobody else sees it.</Text>
          </View>
        ) : null}

        {quest.kind === 'breathe' ? (
          <Pressable onPress={() => router.push('/breathe')} accessibilityRole="button" className="rounded-3xl">
            <View className="flex-row items-center gap-4 rounded-3xl bg-mint p-4">
              <View className="size-12 rounded-full bg-white items-center justify-center">
                <Icon sf="wind" md="air" size={20} color={WorldInk.mind} />
              </View>
              <View className="flex-1">
                <Text className="font-display text-lg text-cocoa">Start one minute of breathing</Text>
                <Text className="font-sans text-sm text-cocoa">Full screen, slow, with waves if you like.</Text>
              </View>
            </View>
          </Pressable>
        ) : null}

        {quest.kind === 'cards' ? (
          <Pressable onPress={() => router.push('/learn')} accessibilityRole="button" className="rounded-3xl">
            <View className="flex-row items-center gap-4 rounded-3xl bg-mist p-4">
              <View className="size-12 rounded-full bg-white items-center justify-center">
                <Icon sf="rectangle.stack.fill" md="style" size={20} color={WorldInk.learn} />
              </View>
              <View className="flex-1">
                <Text className="font-display text-lg text-cocoa">Myth or Fact</Text>
                <Text className="font-sans text-sm text-cocoa">{answers.length >= 5 ? 'All 5 cards done today.' : `${answers.length}/5 cards today. Swipe the rest.`}</Text>
              </View>
            </View>
          </Pressable>
        ) : null}

        <View ref={lagoonRef} collapsable={false} className="rounded-3xl" style={softShadow}>
          <Lagoon heal={heal} width={lagoonWidth} burstKey={burst} />
        </View>

        {phase === 'done' ? (
          <Animated.View style={rewardStyle} className="items-center gap-1">
            <Text className="font-display-bold text-2xl text-cocoa">Bravo.</Text>
            <View className="flex-row items-center gap-1.5">
              <Icon sf="bolt.fill" md="bolt" size={15} color={Palette.honeyDeep} />
              <Text className="font-strong text-base text-cocoa">+1 Moon Energy · +{quest.xp} XP</Text>
            </View>
            <Text className="font-sans text-sm text-muted">The water just got a little clearer.</Text>
          </Animated.View>
        ) : null}

        <View ref={buttonRef} collapsable={false} className="gap-2">
          {alreadyDone ? (
            <View className="h-14 rounded-full bg-mint flex-row items-center justify-center gap-2">
              <Icon sf="checkmark" md="check" size={16} color={WorldInk.mind} />
              <Text className="font-heavy text-base text-cocoa">Done today</Text>
            </View>
          ) : phase === 'done' ? (
            <PillButton label="Back to my lagoon" onPress={() => router.back()} />
          ) : (
            <PillButton label="Done" onPress={finish} disabled={needs !== null || phase !== 'idle'} />
          )}
          {needs && phase === 'idle' && !alreadyDone ? <Text className="font-sans text-sm text-muted text-center">{needs}</Text> : null}
        </View>
      </KeyboardAwareScrollView>

      <Animated.View
        pointerEvents="none"
        style={[{ position: 'absolute', left: 0, top: 0, width: ORB, height: ORB, borderRadius: ORB / 2, backgroundColor: Palette.glow, shadowColor: Palette.honeyDeep, shadowOpacity: 0.9, shadowRadius: 18, shadowOffset: { width: 0, height: 0 }, elevation: 8 }, orbStyle]}
      />

      <Confetti run={confetti} />

      {levelUp !== null ? (
        <Animated.View entering={FadeIn.duration(durations.draw)} className="absolute inset-0 items-center justify-center px-8 bg-cocoa/30">
          <View className="w-full rounded-4xl bg-milk p-6 gap-4 items-center" style={softShadow}>
            <Text className="font-heavy text-xs uppercase tracking-wide text-turquoise-deep">Lagoon level {levelUp + 1}</Text>
            <Text className="font-display-bold text-3xl text-cocoa text-center">{LAGOON_LEVELS[levelUp].name}</Text>
            <Text className="font-sans text-base text-muted text-center">{LAGOON_LEVELS[levelUp].line}</Text>
            <PillButton label="Bravo, me" onPress={() => setLevelUp(null)} className="self-stretch" />
          </View>
        </Animated.View>
      ) : null}
    </View>
  );
}
