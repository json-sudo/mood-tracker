export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  created_at: string;
}

export interface UserUpdate {
  name?: string;
  avatar_url?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  name: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export type MoodLevel = -2 | -1 | 0 | 1 | 2;

export interface MoodEntry {
  id: string;
  user_id: string;
  mood: MoodLevel;
  feelings: string[];
  reflection: string | null;
  sleep_hours: number;
  created_at: string;
}

export interface MoodEntryCreate {
  mood: MoodLevel;
  feelings: string[];
  reflection?: string;
  sleep_hours: number;
}

export interface MoodAverages {
  current_mood_avg: number;
  current_sleep_avg: number;
  previous_mood_avg: number | null;
  previous_sleep_avg: number | null;
  mood_trend: 'increase' | 'decrease' | 'same';
  sleep_trend: 'increase' | 'decrease' | 'same';
  entries_count: number;
}

export const MOOD_LABELS: Record<MoodLevel, string> = {
  [-2]: 'Very Sad',
  [-1]: 'Sad',
  [0]: 'Neutral',
  [1]: 'Happy',
  [2]: 'Very Happy',
};

export const FEELINGS_OPTIONS = [
  'Grateful',
  'Calm',
  'Peaceful',
  'Optimistic',
  'Confident',
  'Excited',
  'Content',
  'Joyful',
  'Motivated',
  'Hopeful',
  'Irritable',
  'Anxious',
  'Down',
  'Tired',
  'Lonely',
  'Frustrated',
  'Disappointed',
  'Overwhelmed',
] as const;

export interface ApiError {
  detail: string;
}
