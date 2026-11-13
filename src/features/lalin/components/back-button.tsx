import { router } from 'expo-router';
import { View } from 'react-native';

import { Pressable } from '@/components/pressable';
import { softShadow } from '@/constants/theme';
import { Icon } from '@/features/lalin/components/icon';

export function BackButton({ onPress, icon = 'back' }: { onPress?: () => void; icon?: 'back' | 'close' }) {
  return (
    <Pressable
      onPress={onPress ?? (() => router.back())}
      accessibilityRole="button"
      accessibilityLabel={icon === 'close' ? 'Close' : 'Back'}
      className="self-start rounded-full"
    >
      <View className="size-11 rounded-full bg-white items-center justify-center" style={softShadow}>
        {icon === 'close' ? <Icon sf="xmark" md="close" size={16} /> : <Icon sf="chevron.left" md="arrow_back" size={16} />}
      </View>
    </Pressable>
  );
}
