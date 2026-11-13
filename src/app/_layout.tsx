import '@/global.css';

import { Fredoka_600SemiBold, Fredoka_700Bold } from '@expo-google-fonts/fredoka';
import { Nunito_500Medium, Nunito_700Bold, Nunito_800ExtraBold, useFonts } from '@expo-google-fonts/nunito';
import Constants from 'expo-constants';
import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { HeroUINativeProvider } from 'heroui-native';
import { useEffect } from 'react';
import { Appearance } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { Uniwind } from 'uniwind';
import { Newly } from '@newly/sdk-react-native';

import { ThemeSwitchHost } from '@/components/theme-switch-host';
import { Palette } from '@/constants/theme';
import { useContentStore } from '@/features/lalin/store/content-store';
import { hideExpoDeveloperUi } from '@/lib/dev-menu';
import generatedAnalytics from '@/lib/newly-analytics.json';

type NewlyAnalyticsExtra = {
  newlyAnalyticsEnabled?: unknown;
  newlyAnalyticsSamplingRate?: unknown;
  newlyApiUrl?: unknown;
  newlyIngestKey?: unknown;
};

const generated = generatedAnalytics as {
  ingestKey?: string;
  apiUrl?: string;
  enabled?: boolean;
  samplingRate?: number | null;
};
const analyticsExtra = (Constants.expoConfig?.extra ?? {}) as NewlyAnalyticsExtra;
const analytics = generated.ingestKey
  ? {
      ingestKey: generated.ingestKey,
      apiUrl: generated.apiUrl,
      enabled: generated.enabled,
      sampling: generated.samplingRate,
    }
  : {
      ingestKey: analyticsExtra.newlyIngestKey,
      apiUrl: analyticsExtra.newlyApiUrl,
      enabled: analyticsExtra.newlyAnalyticsEnabled,
      sampling: analyticsExtra.newlyAnalyticsSamplingRate,
    };

const newlyIngestKey = typeof analytics.ingestKey === 'string' ? analytics.ingestKey : '';
const newlyApiUrl = typeof analytics.apiUrl === 'string' ? analytics.apiUrl : '';
const newlyAnalyticsSampling = typeof analytics.sampling === 'number' ? analytics.sampling : undefined;

hideExpoDeveloperUi();

if (analytics.enabled !== false && newlyIngestKey && newlyApiUrl) {
  Newly.init({
    ingestKey: newlyIngestKey,
    apiUrl: newlyApiUrl,
    sampling: newlyAnalyticsSampling,
  });
}

// Lalin is a dawn picture book: one light look, on every phone.
Appearance.setColorScheme('light');
Uniwind.setTheme('light');
SplashScreen.preventAutoHideAsync().catch(() => undefined);

const navTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: Palette.milk, card: Palette.milk, text: Palette.cocoa, primary: Palette.clay },
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Fredoka_600SemiBold,
    Fredoka_700Bold,
    Nunito_500Medium,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });
  const refresh = useContentStore((s) => s.refresh);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync().catch(() => undefined);
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <HeroUINativeProvider>
          <ThemeProvider value={navTheme}>
            <ThemeSwitchHost>
              <StatusBar style="dark" />
              <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Palette.milk } }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="onboarding" options={{ gestureEnabled: false, animation: 'fade' }} />
                <Stack.Screen
                  name="level/[id]"
                  options={{ presentation: 'formSheet', sheetAllowedDetents: [0.62, 0.9], sheetCornerRadius: 32, sheetGrabberVisible: true }}
                />
                <Stack.Screen name="play/[level]" options={{ presentation: 'fullScreenModal', gestureEnabled: false, animation: 'fade' }} />
                <Stack.Screen name="breathe" options={{ presentation: 'fullScreenModal', animation: 'fade' }} />
              </Stack>
            </ThemeSwitchHost>
          </ThemeProvider>
        </HeroUINativeProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}
