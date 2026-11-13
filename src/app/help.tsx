import { Linking, ScrollView, Text, View } from 'react-native';

import { Card } from '@/components/card';
import { ListRow } from '@/components/list-row';
import { Palette, softShadow } from '@/constants/theme';
import { BackButton } from '@/features/lalin/components/back-button';
import { Icon } from '@/features/lalin/components/icon';

const LINES = [
  { title: 'Police emergency', number: '999', note: 'If you or someone else is in danger right now' },
  { title: 'SAMU ambulance', number: '114', note: 'Medical emergency' },
  { title: 'Child helpline', number: '113', note: 'Ministry of Gender Equality, free and confidential' },
];

export default function Help() {
  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="px-5 pt-safe-offset-2 pb-safe-offset-4 gap-6">
      <BackButton />
      <View className="gap-2">
        <Text className="text-3xl font-display-bold text-foreground">Need to talk?</Text>
        <Text className="font-sans text-base text-muted leading-relaxed">
          Lalin is for small daily things. When something feels too big, talk to a real person. That is a strong thing to do, not a weak one.
        </Text>
      </View>

      <View className="rounded-4xl bg-peach p-6 gap-2" style={softShadow}>
        <Text className="font-display-bold text-xl text-cocoa">Someone you trust</Text>
        <Text className="font-sans text-base text-cocoa leading-relaxed">
          A parent, an aunt, a teacher, a school counsellor, a friend's mum. You do not need the right words. "Can we talk?" is enough.
        </Text>
      </View>

      <View className="gap-3">
        <Text className="font-heavy text-xs uppercase tracking-wide text-muted">In Mauritius</Text>
        <Card list>
          {LINES.map((l) => (
            <ListRow
              key={l.number}
              title={`${l.title} · ${l.number}`}
              subtitle={l.note}
              left={<Icon sf="phone.fill" md="call" size={18} color={Palette.turquoiseDeep} />}
              onPress={() => Linking.openURL(`tel:${l.number}`).catch(() => undefined)}
            />
          ))}
        </Card>
      </View>

      <Text className="font-sans text-xs text-muted text-center">Lalin does not give medical advice.</Text>
    </ScrollView>
  );
}
