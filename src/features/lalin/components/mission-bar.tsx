import { Text, View } from 'react-native';

import { COMMUNITY_GOAL } from '@/features/content/data/worlds';

export function MissionBar({ total, compact }: { total: number; compact?: boolean }) {
  const pct = Math.min(1, total / COMMUNITY_GOAL);
  return (
    <View className="gap-2">
      <View className={compact ? 'h-2.5 rounded-full bg-milk overflow-hidden' : 'h-3.5 rounded-full bg-milk overflow-hidden'}>
        <View className="h-full rounded-full bg-turquoise" style={{ width: `${Math.max(3, pct * 100)}%` }} />
      </View>
      <View className="flex-row justify-between">
        <Text className="font-strong text-xs text-muted">{total.toLocaleString('en-US')} pieces</Text>
        <Text className="font-strong text-xs text-muted">{COMMUNITY_GOAL.toLocaleString('en-US')}</Text>
      </View>
    </View>
  );
}
