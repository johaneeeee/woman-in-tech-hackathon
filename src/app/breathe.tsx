import { useAudioPlayer } from 'expo-audio';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useReducedMotion, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { Presets } from 'react-native-pulsar';

import { Pressable } from '@/components/pressable';
import { Palette, WorldInk, softShadow } from '@/constants/theme';
import { BackButton } from '@/features/lalin/components/back-button';
import { Icon } from '@/features/lalin/components/icon';
import { PillButton } from '@/features/lalin/components/pill-button';
import { useLalinStore } from '@/features/lalin/store/lalin-store';
import { ambient, calmEase, durations } from '@/lib/motion';

const TOTAL = 60;
const HALF = ambient.breathe / 1000;

export default function Breathe() {
  const soundOn = useLalinStore((s) => s.soundOn);
  const toggleSound = useLalinStore((s) => s.toggleSound);
  const reduced = useReducedMotion();
  const [started, setStarted] = useState(false);
  const [left, setLeft] = useState(TOTAL);
  const scale = useSharedValue(0);
  const player = useAudioPlayer(require('../../assets/sounds/waves.wav'));

  useEffect(() => {
    player.loop = true;
    player.volume = 0.5;
    if (started && left > 0 && soundOn) player.play();
    else player.pause();
  }, [started, left, soundOn, player]);

  useEffect(() => {
    if (!started) return;
    scale.set(withRepeat(withTiming(1, { duration: ambient.breathe, easing: calmEase }), -1, true));
    const t = setInterval(() => {
      setLeft((l) => {
        if (l <= 1) {
          clearInterval(t);
          Presets.System.notificationSuccess();
          return 0;
        }
        return l - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [started, scale]);

  useEffect(() => {
    if (left === 0) scale.set(withTiming(0.5, { duration: durations.draw, easing: calmEase }));
  }, [left, scale]);

  const circle = useAnimatedStyle(() => ({
    transform: [{ scale: reduced ? 0.75 : interpolate(scale.get(), [0, 1], [0.55, 1]) }],
  }));
  const halo = useAnimatedStyle(() => ({
    opacity: interpolate(scale.get(), [0, 1], [0.25, 0.6]),
    transform: [{ scale: reduced ? 0.9 : interpolate(scale.get(), [0, 1], [0.7, 1.25]) }],
  }));

  const elapsed = TOTAL - left;
  const inhaling = Math.floor(elapsed / HALF) % 2 === 0;
  const finished = left === 0;

  return (
    <View className="flex-1 bg-mint px-5 pt-safe-offset-2 pb-safe-offset-4 justify-between">
      <View className="flex-row justify-between items-center">
        <BackButton icon="close" />
        <Pressable
          onPress={toggleSound}
          accessibilityRole="switch"
          accessibilityLabel="Wave sound"
          accessibilityState={{ checked: soundOn }}
          className="rounded-full"
        >
          <View className="size-11 rounded-full bg-white items-center justify-center" style={softShadow}>
            {soundOn ? (
              <Icon sf="speaker.wave.2.fill" md="volume_up" size={16} color={WorldInk.mind} />
            ) : (
              <Icon sf="speaker.slash.fill" md="volume_off" size={16} color={Palette.cocoaSoft} />
            )}
          </View>
        </Pressable>
      </View>

      <View className="items-center justify-center gap-10">
        <View className="size-72 items-center justify-center">
          <Animated.View style={halo} className="absolute size-72 rounded-full bg-white" />
          <Animated.View style={[circle, softShadow]} className="size-60 rounded-full bg-turquoise items-center justify-center">
            <Text className="font-display-bold text-5xl text-white">{finished ? '' : left}</Text>
          </Animated.View>
        </View>
        <View className="items-center gap-2 px-6">
          <Text className="font-display-bold text-3xl text-cocoa text-center">
            {finished ? 'Bravo. One minute, just for you.' : started ? (inhaling ? 'Breathe in' : 'Breathe out') : 'One slow minute'}
          </Text>
          <Text className="font-sans text-base text-cocoa text-center">
            {finished ? 'Go back and tick the quest when you are ready.' : started ? 'Follow the circle. Five seconds each way.' : 'In as the circle grows, out as it shrinks.'}
          </Text>
        </View>
      </View>

      {finished ? (
        <PillButton label="Back" onPress={() => router.back()} />
      ) : started ? (
        <PillButton label="Stop" tone="white" onPress={() => router.back()} />
      ) : (
        <PillButton label="Start" onPress={() => setStarted(true)} />
      )}
    </View>
  );
}
