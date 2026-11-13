import type { MessageKey } from '@/features/content/types/content';
import type { CircleRef, Profile } from '@/features/lalin/types/lalin';
import { dayKey } from '@/lib/dates';
import { supabase } from '@/lib/supabase';

export interface LeaderRow {
  player_id: string;
  nickname: string;
  avatar: string;
  stars: number;
  plastic: number;
}

export interface CircleMember {
  player_id: string;
  nickname: string;
  avatar: string;
  last_quest_date: string | null;
}

export interface Encouragement {
  id: string;
  from_nickname: string;
  to_player_id: string;
  message_key: MessageKey;
  created_at: string;
}

export interface Mission {
  id: string;
  title: string;
  goal: number;
  location: string;
  event_date: string;
}

export async function fetchCommunityPlastic(): Promise<number> {
  const { data, error } = await supabase.rpc('community_plastic');
  if (error) throw error;
  return Number(data ?? 0);
}

export async function fetchLeaderboard(): Promise<LeaderRow[]> {
  const { data, error } = await supabase.rpc('weekly_leaderboard');
  if (error) throw error;
  return ((data ?? []) as LeaderRow[]).map((r) => ({ ...r, stars: Number(r.stars), plastic: Number(r.plastic) }));
}

export async function submitRun(profile: Profile, level: number, score: number, stars: number, plastic: number): Promise<void> {
  await supabase.from('run_scores').insert({
    player_id: profile.playerId,
    nickname: profile.nickname,
    avatar: profile.avatar,
    level,
    score,
    stars,
    plastic_collected: Math.min(1000, plastic),
  });
}

function circleError(message: string): Error {
  if (message.includes('not_found')) return new Error('No circle has that code. Check the letters?');
  if (message.includes('full')) return new Error('That circle already has 5 people.');
  return new Error('Could not reach the circle. Try again in a moment.');
}

export async function createCircle(profile: Profile, name: string): Promise<CircleRef> {
  const { data, error } = await supabase.rpc('create_circle', {
    p_name: name,
    p_player_id: profile.playerId,
    p_nickname: profile.nickname,
    p_avatar: profile.avatar,
  });
  if (error) throw circleError(error.message);
  const c = data as { id: string; code: string; name: string };
  return { id: c.id, code: c.code, name: c.name };
}

export async function joinCircle(profile: Profile, code: string): Promise<CircleRef> {
  const { data, error } = await supabase.rpc('join_circle', {
    p_code: code.toUpperCase(),
    p_player_id: profile.playerId,
    p_nickname: profile.nickname,
    p_avatar: profile.avatar,
  });
  if (error) throw circleError(error.message);
  const c = data as { id: string; code: string; name: string };
  return { id: c.id, code: c.code, name: c.name };
}

export async function leaveCircle(circleID: string, playerID: string): Promise<void> {
  await supabase.from('circle_members').delete().eq('circle_id', circleID).eq('player_id', playerID);
}

export async function fetchMembers(circleID: string): Promise<CircleMember[]> {
  const { data, error } = await supabase
    .from('circle_members')
    .select('player_id, nickname, avatar, last_quest_date')
    .eq('circle_id', circleID)
    .order('joined_at');
  if (error) throw error;
  return (data ?? []) as CircleMember[];
}

export async function fetchEncouragements(circleID: string, playerID: string): Promise<Encouragement[]> {
  const { data, error } = await supabase
    .from('encouragements')
    .select('id, from_nickname, to_player_id, message_key, created_at')
    .eq('circle_id', circleID)
    .eq('to_player_id', playerID)
    .order('created_at', { ascending: false })
    .limit(12);
  if (error) throw error;
  return (data ?? []) as Encouragement[];
}

export async function sendEncouragement(
  circleID: string,
  from: Profile,
  to: CircleMember,
  key: MessageKey,
): Promise<void> {
  const { error } = await supabase.from('encouragements').insert({
    circle_id: circleID,
    from_player_id: from.playerId,
    from_nickname: from.nickname,
    to_player_id: to.player_id,
    to_nickname: to.nickname,
    message_key: key,
  });
  if (error) throw new Error('Could not send that one. Try again?');
}

/** Tell the circle she did a quest today (fills her slice of the shared moon). */
export async function markQuestDay(circleID: string, playerID: string): Promise<void> {
  await supabase
    .from('circle_members')
    .update({ last_quest_date: dayKey() })
    .eq('circle_id', circleID)
    .eq('player_id', playerID);
}

export async function fetchMission(): Promise<{ mission: Mission | null; signups: number }> {
  const { data, error } = await supabase.from('missions').select('*').eq('active', true).limit(1).maybeSingle();
  if (error) throw error;
  if (!data) return { mission: null, signups: 0 };
  const { count } = await supabase
    .from('mission_signups')
    .select('player_id', { count: 'exact', head: true })
    .eq('mission_id', data.id);
  return { mission: data as Mission, signups: count ?? 0 };
}

export async function setMissionSignup(missionID: string, profile: Profile, going: boolean): Promise<void> {
  if (going) {
    await supabase
      .from('mission_signups')
      .insert({ mission_id: missionID, player_id: profile.playerId, nickname: profile.nickname });
    return;
  }
  await supabase.from('mission_signups').delete().eq('mission_id', missionID).eq('player_id', profile.playerId);
}
