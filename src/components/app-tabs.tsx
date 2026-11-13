import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useThemeColor } from 'heroui-native';

import { Palette } from '@/constants/theme';

// Icon API: `sf` (SF Symbol, iOS) + `md` (Material Symbol, Android) props.
// `disableAutomaticContentInsets` on EVERY Trigger: the screens' safe-area classes are
// the one inset mechanism.
export default function AppTabs() {
  const accent = useThemeColor('accent');
  return (
    <NativeTabs backgroundColor={Palette.milk} tintColor={accent}>
      <NativeTabs.Trigger name="index" disableAutomaticContentInsets>
        <NativeTabs.Trigger.Label>Lagoon</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="water.waves" md="waves" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="learn" disableAutomaticContentInsets>
        <NativeTabs.Trigger.Label>Learn</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="book.fill" md="menu_book" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="run" disableAutomaticContentInsets>
        <NativeTabs.Trigger.Label>Run</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="figure.run" md="directions_run" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="circle" disableAutomaticContentInsets>
        <NativeTabs.Trigger.Label>Circle</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="moon.circle.fill" md="group" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="progress" disableAutomaticContentInsets>
        <NativeTabs.Trigger.Label>Progress</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="chart.bar.fill" md="insights" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
