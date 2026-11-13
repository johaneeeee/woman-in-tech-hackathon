import { Redirect } from 'expo-router';

import AppTabs from '@/components/app-tabs';
import { useLalinStore } from '@/features/lalin/store/lalin-store';

export default function TabsLayout() {
  const profile = useLalinStore((s) => s.profile);
  if (!profile) return <Redirect href="/onboarding" />;
  return <AppTabs />;
}
