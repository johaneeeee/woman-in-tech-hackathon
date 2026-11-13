import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { FadeIn, interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Presets } from 'react-native-pulsar';
import { scheduleOnRN } from 'react-native-worklets';

import { Palette, WorldInk, softShadow } from '@/constants/theme';
import type { MythCard } from '@/features/content/types/content';
import { Icon } from '@/features/lalin/components/icon';
import { PillButton } from '@/features/lalin/components/pill-button';
import { useToday } from '@/features/lalin/hooks/use-today';
import { useLalinStore } from '@/features/lalin/store/lalin-store';
import { ambient, calmEase, durations } from '@/lib/motion';

const THRESHOLD = 110;

const CATEGORY_LABEL: Record<MythCard['category'], string> = {
  health: 'Health',
  sleep: 'Sleep',
  stress: 'Stress',
  online: 'Online life',
  body: 'Body',
  studies: 'Studies',
  ocean: 'Ocean',
};

function SwipeCard({ card, width, onAnswer }: { card: MythCard; width: number; onAnswer: (saidMyth: boolean) => void }) {
  const x = useSharedValue(0);
  const y = useSharedValue(0);

  const throwCard = (dir: -1 | 1) => {
    x.set(withTiming(dir * width * 1.4, { duration: ambient.slide, easing: calmEase }, (done) => {
      if (done) scheduleOnRN(onAnswer, dir === -1);
    }));
  };

  const pan = Gesture.Pan()
    .onChange((e) => {
      x.set(e.translationX);
      y.set(e.translationY * 0.3);
    })
    .onEnd((e) => {
      if (Math.abs(e.translationX) > THRESHOLD) {
        const dir = e.translationX < 0 ? -1 : 1;
        x.set(withTiming(dir * width * 1.4, { duration: ambient.slide, easing: calmEase }, (done) => {
          if (done) scheduleOnRN(onAnswer, dir === -1);
        }));
        return;
      }
      x.set(withTiming(0, { duration: durations.base, easing: calmEase }));
      y.set(withTiming(0, { duration: durations.base, easing: calmEase }));
    });

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.get() },
      { translateY: y.get() },
      { rotate: `${interpolate(x.get(), [-width, 0, width], [-14, 0, 14])}deg` },
    ],
  }));
  const mythTag = useAnimatedStyle(() => ({ opacity: interpolate(x.get(), [-THRESHOLD, -20, 0], [1, 0, 0]) }));
  const factTag = useAnimatedStyle(() => ({ opacity: interpolate(x.get(), [0, 20, THRESHOLD], [0, 0, 1]) }));

  return (
    <View className="gap-5">
      <GestureDetector gesture={pan}>
        <Animated.View style={[style, softShadow]} className="rounded-4xl bg-white p-6 gap-5 min-h-80 justify-between">
          <View className="flex-row justify-between items-center">
            <View className="rounded-full bg-mist px-3 py-1.5">
              <Text className="font-heavy text-xs uppercase tracking-wide" style={{ color: WorldInk.learn }}>
                {CATEGORY_LABEL[card.category]}
              </Text>
            </View>
            <View className="flex-row gap-2">
              <Animated.View style={mythTag} className="rounded-full bg-peach px-3 py-1.5">
                <Text className="font-heavy text-xs text-cocoa">MYTH</Text>
              </Animated.View>
              <Animated.View style={factTag} className="rounded-full bg-mint px-3 py-1.5">
                <Text className="font-heavy text-xs text-cocoa">FACT</Text>
              </Animated.View>
            </View>
          </View>
          <Text className="font-display-bold text-3xl text-cocoa leading-tight">{card.statement}</Text>
          <Text className="font-sans text-sm text-muted">Swipe left for Myth, right for Fact.</Text>
        </Animated.View>
      </GestureDetector>
      <View className="flex-row gap-3">
        <PillButton label="Myth" tone="peach" onPress={() => throwCard(-1)} className="flex-1" />
        <PillButton label="Fact" tone="mint" onPress={() => throwCard(1)} className="flex-1" />
      </View>
    </View>
  );
}

export default function Learn() {
  const { width } = useWindowDimensions();
  const { deck, answers, learnQuest, done } = useToday();
  const answerCard = useLalinStore((s) => s.answerCard);
  const [reveal, setReveal] = useState<{ card: MythCard; correct: boolean } | null>(null);

  const answeredIds = answers.map((a) => a.cardId);
  const next = deck.find((c) => !answeredIds.includes(c.id));
  const correctCount = answers.filter((a) => a.correct).length;
  const questDone = learnQuest ? done.includes(learnQuest.id) : false;

  const onAnswer = (card: MythCard, saidMyth: boolean) => {
    const correct = saidMyth === card.isMyth;
    if (correct) Presets.System.notificationSuccess();
    else Presets.System.impactSoft();
    answerCard(card.id, correct);
    setReveal({ card, correct });
  };

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="px-5 pt-safe-offset-2 pb-safe-offset-22 gap-6" scrollEnabled={reveal !== null || !next}>
      <View className="gap-1 pt-2">
        <Text className="font-display-bold text-3xl text-cocoa">Myth or Fact</Text>
        <Text className="font-sans text-base text-muted">
          Five cards a day. {Math.min(answers.length, 5)}/5 done, {correctCount} right.
        </Text>
      </View>

      <View className="flex-row gap-2">
        {deck.map((c, i) => {
          const a = answers.find((x) => x.cardId === c.id);
          const bg = a ? (a.correct ? 'bg-turquoise' : 'bg-peach-deep') : i === answers.length ? 'bg-cocoa' : 'bg-peach';
          return <View key={c.id} className={`h-2 flex-1 rounded-full ${bg}`} />;
        })}
      </View>

      {reveal ? (
        <Animated.View key={reveal.card.id} entering={FadeIn.duration(durations.draw)} className="gap-5">
          <View className="rounded-4xl p-6 gap-4" style={[{ backgroundColor: reveal.card.isMyth ? Palette.peach : Palette.mint }, softShadow]}>
            <View className="flex-row items-center gap-2">
              <Icon
                sf={reveal.correct ? 'checkmark.circle.fill' : 'arrow.uturn.left.circle.fill'}
                md={reveal.correct ? 'check_circle' : 'undo'}
                size={20}
                color={Palette.cocoa}
              />
              <Text className="font-heavy text-sm text-cocoa">
                {reveal.correct ? 'Bravo, you got it.' : 'Not quite.'} It is a {reveal.card.isMyth ? 'myth' : 'fact'}.
              </Text>
            </View>
            <Text className="font-display text-xl text-cocoa">{reveal.card.statement}</Text>
            <Text className="font-sans text-base text-cocoa leading-relaxed">{reveal.card.explanation}</Text>
          </View>
          <PillButton label={next ? 'Next card' : 'See today'} onPress={() => setReveal(null)} />
        </Animated.View>
      ) : next ? (
        <SwipeCard key={next.id} card={next} width={width} onAnswer={(saidMyth) => onAnswer(next, saidMyth)} />
      ) : (
        <Animated.View entering={FadeIn.duration(durations.draw)} className="gap-5">
          <View className="rounded-4xl bg-mist p-6 gap-3" style={softShadow}>
            <Text className="font-display-bold text-2xl text-cocoa">That is today's five.</Text>
            <Text className="font-sans text-base text-cocoa">
              {correctCount} out of {deck.length} right. New cards tomorrow.
            </Text>
          </View>
          {learnQuest && !questDone ? (
            <PillButton label="Tick off the Learn quest" onPress={() => router.push(`/quest/${learnQuest.id}`)} />
          ) : null}
          {questDone ? <Text className="font-strong text-sm text-turquoise-deep text-center">Learn quest done for today.</Text> : null}
        </Animated.View>
      )}
    </ScrollView>
  );
}
