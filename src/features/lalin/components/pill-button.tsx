import { Text, View } from 'react-native';

import { Pressable } from '@/components/pressable';
import { softShadow } from '@/constants/theme';
import { cn } from '@/lib/cn';

type Tone = 'cocoa' | 'clay' | 'white' | 'peach' | 'mint' | 'honey' | 'mist' | 'lavender' | 'ghost';

const TONES: Record<Tone, { bg: string; text: string }> = {
  cocoa: { bg: 'bg-cocoa', text: 'text-milk' },
  clay: { bg: 'bg-clay', text: 'text-white' },
  white: { bg: 'bg-white', text: 'text-cocoa' },
  peach: { bg: 'bg-peach', text: 'text-cocoa' },
  mint: { bg: 'bg-mint', text: 'text-cocoa' },
  honey: { bg: 'bg-honey', text: 'text-cocoa' },
  mist: { bg: 'bg-mist', text: 'text-cocoa' },
  lavender: { bg: 'bg-lavender', text: 'text-cocoa' },
  ghost: { bg: 'bg-transparent', text: 'text-cocoa' },
};

interface PillButtonProps {
  label: string;
  onPress: () => void;
  tone?: Tone;
  size?: 'md' | 'lg' | 'sm';
  disabled?: boolean;
  className?: string;
  accessibilityLabel?: string;
}

export function PillButton({ label, onPress, tone = 'cocoa', size = 'lg', disabled, className, accessibilityLabel }: PillButtonProps) {
  const t = TONES[tone];
  const pad = size === 'lg' ? 'h-14 px-8' : size === 'md' ? 'h-12 px-6' : 'h-10 px-4';
  const textSize = size === 'sm' ? 'text-sm' : 'text-base';
  return (
    <Pressable
      onPress={onPress}
      isDisabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      className={cn('rounded-full', disabled ? 'opacity-40' : null, className)}
    >
      <View
        className={cn('rounded-full items-center justify-center', pad, t.bg)}
        style={tone === 'ghost' ? undefined : softShadow}
      >
        <Text className={cn('font-heavy', textSize, t.text)}>{label}</Text>
      </View>
    </Pressable>
  );
}
