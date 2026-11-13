import { router } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Presets } from 'react-native-pulsar';

import { Palette, softShadow } from '@/constants/theme';
import { BackButton } from '@/features/lalin/components/back-button';
import { MoonShape } from '@/features/lalin/components/moon-shape';
import { PillButton } from '@/features/lalin/components/pill-button';
import { useLalinStore } from '@/features/lalin/store/lalin-store';
import { prettyDate } from '@/lib/dates';
import { getMoon } from '@/lib/moon';

export default function Letter() {
  const moon = getMoon();
  const writeLetter = useLalinStore((s) => s.writeLetter);
  const [text, setText] = useState('');
  const [sealed, setSealed] = useState(false);

  const seal = () => {
    if (!text.trim()) return;
    writeLetter(text.trim(), moon.nextFullDate.toISOString());
    Presets.System.notificationSuccess();
    setSealed(true);
  };

  return (
    <KeyboardAwareScrollView className="flex-1 bg-background" contentContainerClassName="px-5 pt-safe-offset-2 pb-safe-offset-4 gap-6" bottomOffset={24}>
      <BackButton />
      <View className="items-center gap-3">
        <MoonShape cycle={moon.isFull ? 0.5 : moon.cycle} size={88} />
        <Text className="text-3xl font-display-bold text-foreground text-center">Moon letter</Text>
        <Text className="font-sans text-base text-muted text-center">
          {moon.isFull ? `Write to future you. It stays sealed until ${prettyDate(moon.nextFullDate)}.` : `Letters are written on a full moon. The next one is in ${moon.daysToFull} days.`}
        </Text>
      </View>

      {sealed ? (
        <View className="rounded-4xl bg-lavender p-6 gap-3 items-center" style={softShadow}>
          <Text className="font-display-bold text-2xl text-cocoa">Sealed.</Text>
          <Text className="font-sans text-base text-cocoa text-center">It opens on {prettyDate(moon.nextFullDate)}. Find it in Progress.</Text>
          <PillButton label="Done" onPress={() => router.back()} />
        </View>
      ) : moon.isFull ? (
        <>
          <View className="rounded-4xl bg-white p-5" style={softShadow}>
            <TextInput
              value={text}
              onChangeText={setText}
              multiline
              maxLength={600}
              placeholder="Dear me, next full moon..."
              placeholderTextColor={Palette.cocoaSoft}
              className="min-h-48 font-sans text-base text-cocoa"
              textAlignVertical="top"
              accessibilityLabel="Your letter"
            />
          </View>
          <Text className="font-sans text-xs text-muted text-center">Stays on this phone. Nobody else can read it.</Text>
          <PillButton label="Seal until next full moon" onPress={seal} disabled={!text.trim()} />
        </>
      ) : null}
    </KeyboardAwareScrollView>
  );
}
