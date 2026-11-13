export type EntityKind = 'bottle' | 'bag' | 'net' | 'star' | 'crab' | 'rock' | 'wave' | 'boat';

export interface Entity {
  id: number;
  kind: EntityKind;
  lane: number;
  laneFrom: number;
  laneTo: number;
  z: number;
  resolved: boolean;
  taken: boolean;
}

export interface LevelConfig {
  travel: number;
  interval: number;
  duration: number;
  obstacles: EntityKind[];
  nets: boolean;
  wind: boolean;
  pickupChance: number;
}

export const LEVEL_CONFIG: Record<number, LevelConfig> = {
  1: { travel: 2.6, interval: 1.5, duration: 60, obstacles: ['crab'], nets: false, wind: false, pickupChance: 0.6 },
  2: { travel: 2.3, interval: 1.3, duration: 65, obstacles: ['crab', 'rock'], nets: false, wind: false, pickupChance: 0.6 },
  3: { travel: 2.1, interval: 1.15, duration: 70, obstacles: ['crab', 'rock'], nets: false, wind: true, pickupChance: 0.62 },
  4: { travel: 1.9, interval: 1.05, duration: 75, obstacles: ['crab', 'rock', 'wave'], nets: true, wind: false, pickupChance: 0.6 },
  5: { travel: 1.75, interval: 0.95, duration: 80, obstacles: ['crab', 'rock', 'boat'], nets: true, wind: false, pickupChance: 0.72 },
  6: { travel: 1.55, interval: 0.85, duration: 85, obstacles: ['crab', 'rock', 'wave', 'boat'], nets: true, wind: true, pickupChance: 0.72 },
};

export const JUMP_TIME = 0.68;
const INVULN = 1;
const HIT_Z = 0.035;
const TUTORIAL_CALM = 5;

export interface GameState {
  t: number;
  playerLane: number;
  playerX: number;
  jumpT: number;
  hearts: number;
  plastic: number;
  bonus: number;
  hits: number;
  invuln: number;
  entities: Entity[];
  spawnT: number;
  gustT: number;
  gustWarn: number;
  gustDir: number;
  nextId: number;
  over: 'win' | 'fail' | null;
}

export type GameEvent = 'collect' | 'net' | 'star' | 'hit' | 'jumpOver' | 'gust';

export function createGame(): GameState {
  return {
    t: 0,
    playerLane: 0,
    playerX: 0,
    jumpT: -1,
    hearts: 3,
    plastic: 0,
    bonus: 0,
    hits: 0,
    invuln: 0,
    entities: [],
    spawnT: 0.6,
    gustT: 8,
    gustWarn: 0,
    gustDir: 1,
    nextId: 1,
    over: null,
  };
}

const JUMPABLE: EntityKind[] = ['crab', 'rock', 'wave'];
export const isPickup = (k: EntityKind) => k === 'bottle' || k === 'bag' || k === 'net' || k === 'star';

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function add(g: GameState, kind: EntityKind, lane: number, laneTo = lane) {
  g.entities.push({ id: g.nextId++, kind, lane, laneFrom: lane, laneTo, z: 1, resolved: false, taken: false });
}

function spawnRow(g: GameState, cfg: LevelConfig, level: number) {
  const lanes = [-1, 0, 1];
  const calm = level === 1 && g.t < TUTORIAL_CALM;
  const roll = Math.random();
  const gentle = level === 1;
  const count = calm ? 0 : gentle ? (roll < 0.5 ? 0 : 1) : roll < 0.35 ? 0 : roll < 0.82 ? 1 : 2;
  const kinds = cfg.obstacles;

  if (count > 0 && kinds.includes('wave') && Math.random() < 0.18) {
    const from = Math.random() < 0.5 ? -1 : 1;
    add(g, 'wave', from, -from);
    return;
  }

  const shuffled = [...lanes].sort(() => Math.random() - 0.5);
  const blocked = shuffled.slice(0, count);
  const plain = kinds.filter((k) => k !== 'wave');
  blocked.forEach((lane) => add(g, pick(plain), lane));

  const free = lanes.filter((l) => !blocked.includes(l));
  let placed = 0;
  free.forEach((lane) => {
    if (Math.random() > cfg.pickupChance) return;
    placed += 1;
    const r = Math.random();
    if (r < 0.05) return add(g, 'star', lane);
    if (cfg.nets && r < 0.17) return add(g, 'net', lane);
    add(g, r < 0.6 ? 'bottle' : 'bag', lane);
  });
  if (placed === 0 && count === 0) add(g, Math.random() < 0.5 ? 'bottle' : 'bag', pick(free));
}

export function moveLane(g: GameState, dir: -1 | 1) {
  if (g.over) return;
  g.playerLane = Math.max(-1, Math.min(1, g.playerLane + dir));
}

export function jump(g: GameState) {
  if (g.over) return;
  if (g.jumpT >= 0 && g.jumpT < JUMP_TIME) return;
  g.jumpT = 0;
}

/** Advance the run by dt seconds. Mutates g and returns what happened, for haptics. */
export function step(g: GameState, dt: number, cfg: LevelConfig, level: number, doubled: boolean): GameEvent[] {
  if (g.over) return [];
  const events: GameEvent[] = [];
  g.t += dt;

  g.playerX += (g.playerLane - g.playerX) * Math.min(1, dt * 14);
  if (g.jumpT >= 0) {
    g.jumpT += dt;
    if (g.jumpT >= JUMP_TIME) g.jumpT = -1;
  }
  if (g.invuln > 0) g.invuln = Math.max(0, g.invuln - dt);

  if (cfg.wind) {
    if (g.gustWarn > 0) {
      g.gustWarn -= dt;
      if (g.gustWarn <= 0) {
        const target = g.playerLane + g.gustDir;
        g.playerLane = target > 1 || target < -1 ? g.playerLane - g.gustDir : target;
        events.push('gust');
      }
    } else {
      g.gustT -= dt;
      if (g.gustT <= 0) {
        g.gustDir = Math.random() < 0.5 ? -1 : 1;
        g.gustWarn = 1.3;
        g.gustT = 7 + Math.random() * 4;
      }
    }
  }

  g.spawnT -= dt;
  if (g.spawnT <= 0 && g.t < cfg.duration - cfg.travel) {
    spawnRow(g, cfg, level);
    g.spawnT = cfg.interval * (0.85 + Math.random() * 0.3);
  }

  const speed = 1 / cfg.travel;
  const jumping = g.jumpT >= 0 && g.jumpT < JUMP_TIME;
  for (const e of g.entities) {
    e.z -= dt * speed;
    if (e.kind === 'wave') e.lane = e.laneFrom + (e.laneTo - e.laneFrom) * Math.min(1, Math.max(0, (1 - e.z) / 0.95));
    if (e.resolved || e.z > HIT_Z) continue;
    e.resolved = true;
    const sameLane = Math.round(e.lane) === g.playerLane;
    if (!sameLane) continue;
    if (isPickup(e.kind)) {
      e.taken = true;
      const mult = doubled ? 2 : 1;
      if (e.kind === 'star') {
        g.bonus += 1;
        events.push('star');
      } else if (e.kind === 'net') {
        g.plastic += 3 * mult;
        events.push('net');
      } else {
        g.plastic += 1 * mult;
        events.push('collect');
      }
      continue;
    }
    if (jumping && JUMPABLE.includes(e.kind)) {
      events.push('jumpOver');
      continue;
    }
    if (g.invuln > 0) continue;
    g.hearts -= 1;
    g.hits += 1;
    g.invuln = INVULN;
    events.push('hit');
  }
  g.entities = g.entities.filter((e) => e.z > -0.2 && !e.taken);

  if (g.hearts <= 0) g.over = 'fail';
  else if (g.t >= cfg.duration) g.over = 'win';
  return events;
}

export function starsFor(g: GameState, goal: number): number {
  if (g.over !== 'win') return 0;
  const reached = g.plastic >= goal;
  if (!reached) return 1;
  return g.hits === 0 ? 3 : 2;
}

export function scoreFor(g: GameState): number {
  return g.plastic * 10 + g.bonus * 25 + Math.max(0, g.hearts) * 100;
}
