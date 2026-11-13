import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { Pressable, Text, View } from 'react-native';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="index" href="/" asChild>
            <TabButton>Lagoon</TabButton>
          </TabTrigger>
          <TabTrigger name="learn" href="/learn" asChild>
            <TabButton>Learn</TabButton>
          </TabTrigger>
          <TabTrigger name="run" href="/run" asChild>
            <TabButton>Run</TabButton>
          </TabTrigger>
          <TabTrigger name="circle" href="/circle" asChild>
            <TabButton>Circle</TabButton>
          </TabTrigger>
          <TabTrigger name="progress" href="/progress" asChild>
            <TabButton>Progress</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({ children, isFocused, ...props }: TabTriggerSlotProps) {
  return (
    <Pressable {...props} className="rounded-xl px-4 py-2 active:opacity-70">
      <Text
        className={
          isFocused ? 'text-sm font-medium text-foreground' : 'text-sm font-medium text-muted'
        }>
        {children}
      </Text>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  return (
    <View {...props} className="absolute w-full flex-row items-center justify-center p-4">
      <View className="w-full max-w-3xl flex-row items-center gap-2 rounded-2xl bg-surface px-5 py-2">
        {props.children}
      </View>
    </View>
  );
}
