import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Share, Text, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Presets } from 'react-native-pulsar';

import { Pressable } from '@/components/pressable';
import { Palette, RunSkies, softShadow } from '@/constants/theme';
import { BEACHES } from '@/features/content/data/worlds';
import { Confetti } from '@/features/lalin/components/confetti';
import { Icon } from '@/features/lalin/components/icon';
import { MoonAvatar } from '@/features/lalin/components/moon-avatar';
import { PillButton } from '@/features/lalin/components/pill-button';
import { fetchCommunityPlastic, submitRun } from '@/features/lalin/api/community';
import { createGame, jump, JUMP_TIME, LEVEL_CONFIG, moveLane, scoreFor, starsFor, step, type GameState } from '@/features/lalin/game/engine';
import { RunResults } from '@/features/lalin/game/run-results';
import { makeProjection, RunScene } from '@/features/lalin/game/run-scene';
import { useLalinStore } from '@/features/lalin/store/lalin-store';
import { getMoon } from '@/lib/moon';
import { durations } from '@/lib/motion';

type Phase = 'ready' | 'playing' | 'paused' | 'over';

interface Outcome {
  won: boolean;
  stars: number;
  score: number;
  plastic: number;
  bonus: number;
  hearts: number;
  newBest: boolean;
  guardian: boolean;
}

const READY_MS = 1600;
const PLAYER = 64;

function snapshot(g: GameState): GameState {
  return { ...g, entities: g.entities.map((e) => ({ ...e })) };
}

function tutorialHint(t: number): string | null {
  if (t < 4) return 'Swipe left or right to change lane';
  if (t < 8) return 'Tap to jump over crabs';
  if (t < 12) return 'Bottles and bags are +1. Grab them';
  return null;
}

export default function Play() {
  const params = useLocalSearchParams<{ level: string }>();
  const { width: W, height: H } = useWindowDimensions();
  const profile = useLalinStore((s) => s.profile);
  const energy = useLalinStore((s) => s.energy);
  const recordRun = useLalinStore((s) => s.recordRun);
  const spendEnergy = useLalinStore((s) => s.spendEnergy);
  const [level, setLevel] = useState(Math.min(6, Math.max(1, Number(params.level) || 1)));
  const [phase, setPhase] = useState<Phase>('ready');
  const [view, setView] = useState<GameState>(createGame);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [community, setCommunity] = useState<number | null>(null);
  const [confetti, setConfetti] = useState(0);
  const game = useRef<GameState>(createGame());
  const moon = getMoon();
  const doubled = moon.isFull;
  const cfg = LEVEL_CONFIG[level];
  const beach = BEACHES[level - 1];
  const proj = makeProjection(W, H);

  useEffect(() => {
    if (phase !== 'ready') return;
    const t = setTimeout(() => setPhase('playing'), READY_MS);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'playing') return;
    let raf = 0;
    let last = 0;
    const finish = (g: GameState) => {
      const stars = starsFor(g, beach.goal);
      const score = scoreFor(g);
      const rec = recordRun(level, stars, score, g.plastic);
      const won = g.over === 'win';
      if (won) Presets.System.notificationSuccess();
      else Presets.System.notificationError();
      if (rec.guardianUnlocked || (won && stars === 3)) setConfetti((c) => c + 1);
      setOutcome({ won, stars, score, plastic: g.plastic, bonus: g.bonus, hearts: g.hearts, newBest: rec.newBest && score > 0, guardian: rec.guardianUnlocked });
      setPhase('over');
      setCommunity(null);
      const p = profile ? submitRun(profile, level, score, stars, g.plastic).catch(() => undefined) : Promise.resolve();
      p.then(() => fetchCommunityPlastic())
        .then((n) => setCommunity(n))
        .catch(() => setCommunity(null));
    };
    const frame = (now: number) => {
      const dt = last === 0 ? 0 : Math.min(0.05, (now - last) / 1000);
      last = now;
      const g = game.current;
      const events = step(g, dt, cfg, level, doubled);
      events.forEach((e) => {
        if (e === 'hit') Presets.System.notificationError();
        else if (e === 'net' || e === 'star' || e === 'gust') Presets.System.impactSoft();
        else if (e === 'collect') Presets.System.selection();
      });
      setView(snapshot(g));
      if (g.over) {
        finish(g);
        return;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [phase, cfg, level, doubled, beach.goal, recordRun, profile]);

  const restart = (nextLevel: number) => {
    if (!spendEnergy()) return;
    game.current = createGame();
    setView(snapshot(game.current));
    setOutcome(null);
    setLevel(nextLevel);
    setPhase('ready');
  };

  const leave = () => {
    const g = game.current;
    if (phase !== 'over' && g.plastic > 0) {
      recordRun(level, 0, scoreFor(g), g.plastic);
      if (profile) submitRun(profile, level, scoreFor(g), 0, g.plastic).catch(() => undefined);
    }
    router.back();
  };

  const share = () => {
    if (!outcome) return;
    Share.share({ message: `I picked up ${outcome.plastic} pieces of plastic at ${beach.name} in Lalin. Look after yourself. Look after the island.` }).catch(() => undefined);
  };

  const pan = Gesture.Pan()
    .runOnJS(true)
    .minDistance(16)
    .onStart((e) => {
      if (Math.abs(e.translationX) < Math.abs(e.translationY)) return;
      moveLane(game.current, e.translationX < 0 ? -1 : 1);
    });
  const tap = Gesture.Tap()
    .runOnJS(true)
    .maxDuration(250)
    .onEnd(() => jump(game.current));
  const gesture = Gesture.Race(pan, tap);

  if (phase === 'over' && outcome) {
    return (
      <View className="flex-1" style={{ backgroundColor: RunSkies[level - 1][1] }}>
        <RunResults
          beach={beach}
          {...outcome}
          community={community}
          doubled={doubled}
          energy={energy}
          hasNext={level < 6}
          onNext={() => restart(level + 1)}
          onReplay={() => restart(level)}
          onMap={() => router.back()}
          onShare={share}
        />
        <Confetti run={confetti} />
      </View>
    );
  }

  const g = view;
  const jumpP = g.jumpT >= 0 ? Math.sin((g.jumpT / JUMP_TIME) * Math.PI) : 0;
  const px = W / 2 + g.playerX * proj.laneW - PLAYER / 2;
  const py = proj.player - PLAYER + 6 - jumpP * 70;
  const blink = g.invuln > 0 && Math.floor(g.invuln * 10) % 2 === 0;
  const progress = Math.min(1, g.t / cfg.duration);
  const hint = level === 1 ? tutorialHint(g.t) : null;
  const shadowW = PLAYER * (0.8 - jumpP * 0.3);

  return (
    <GestureDetector gesture={gesture}>
      <View className="flex-1" collapsable={false}>
        <RunScene proj={proj} level={level} t={g.t} travel={cfg.travel} entities={g.entities} />

        <View
          pointerEvents="none"
          style={{ position: 'absolute', left: W / 2 + g.playerX * proj.laneW - shadowW / 2, top: proj.player, width: shadowW, height: 10, borderRadius: 10, backgroundColor: Palette.shadow, opacity: 0.18 }}
        />
        <View pointerEvents="none" style={{ position: 'absolute', left: px, top: py, opacity: blink ? 0.35 : 1 }}>
          <MoonAvatar avatar={profile?.avatar ?? 'pearl'} size={PLAYER} />
        </View>

        <View className="absolute left-0 right-0 top-0 px-4 pt-safe-offset-2 gap-3">
          <View className="flex-row items-center gap-3">
            <Pressable onPress={() => setPhase('paused')} accessibilityRole="button" accessibilityLabel="Pause" className="rounded-full">
              <View className="size-11 rounded-full bg-white items-center justify-center" style={softShadow}>
                <Icon sf="pause.fill" md="pause" size={16} />
              </View>
            </Pressable>
            <View className="flex-1 h-3 rounded-full bg-white/70 overflow-hidden">
              <View className="h-3 rounded-full bg-turquoise-deep" style={{ width: `${progress * 100}%` }} />
            </View>
            <View className="flex-row gap-1">
              {[1, 2, 3].map((i) => (
                <Icon key={i} sf={i <= g.hearts ? 'heart.fill' : 'heart'} md={i <= g.hearts ? 'favorite' : 'favorite_border'} size={18} color={Palette.clay} />
              ))}
            </View>
          </View>
          <View className="flex-row gap-2">
            <View className="flex-row items-center gap-2 rounded-full bg-white px-4 py-2" style={softShadow}>
              <Text className="font-heavy text-base text-cocoa">
                {g.plastic}/{beach.goal}
              </Text>
              <Text className="font-strong text-xs text-muted">pieces{doubled ? ' · x2' : ''}</Text>
            </View>
            {g.gustWarn > 0 ? (
              <View className="rounded-full bg-mist px-4 py-2">
                <Text className="font-heavy text-sm text-cocoa">Gust coming {g.gustDir > 0 ? 'from the left' : 'from the right'}</Text>
              </View>
            ) : null}
          </View>
        </View>

        {hint && phase === 'playing' ? (
          <Animated.View key={hint} entering={FadeIn.duration(durations.base)} exiting={FadeOut.duration(durations.fast)} pointerEvents="none" className="absolute left-0 right-0 items-center px-8" style={{ top: proj.horizon + 40 }}>
            <View className="rounded-full bg-white/90 px-5 py-3">
              <Text className="font-strong text-base text-cocoa text-center">{hint}</Text>
            </View>
          </Animated.View>
        ) : null}

        {phase === 'ready' ? (
          <Animated.View entering={FadeIn.duration(durations.base)} pointerEvents="none" className="absolute inset-0 items-center justify-center gap-2">
            <Text className="font-heavy text-sm uppercase tracking-wide text-cocoa">{beach.name} · goal {beach.goal}</Text>
            <Text className="font-display-bold text-6xl text-cocoa">Alé</Text>
          </Animated.View>
        ) : null}

        {phase === 'paused' ? (
          <View className="absolute inset-0 items-center justify-center px-8 bg-cocoa/30">
            <View className="w-full rounded-4xl bg-milk p-6 gap-3" style={softShadow}>
              <Text className="font-display-bold text-2xl text-cocoa text-center">Paused</Text>
              <Text className="font-sans text-sm text-muted text-center">Leaving keeps the plastic you already picked up.</Text>
              <PillButton label="Keep running" onPress={() => setPhase('playing')} />
              <PillButton label="Leave run" tone="white" onPress={leave} />
            </View>
          </View>
        ) : null}
      </View>
    </GestureDetector>
  );
}
