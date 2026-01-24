// ===========================================
// MOOD UTILITIES - Mood Tracker
// ===========================================

import type { MoodLevel } from '../types';

// -----------------------------
// Mood Icon Paths (SVG assets)
// -----------------------------
import iconVerySadColor from '../assets/images/icon-very-sad-color.svg';
import iconSadColor from '../assets/images/icon-sad-color.svg';
import iconNeutralColor from '../assets/images/icon-neutral-color.svg';
import iconHappyColor from '../assets/images/icon-happy-color.svg';
import iconVeryHappyColor from '../assets/images/icon-very-happy-color.svg';

import iconVerySadWhite from '../assets/images/icon-very-sad-white.svg';
import iconSadWhite from '../assets/images/icon-sad-white.svg';
import iconNeutralWhite from '../assets/images/icon-neutral-white.svg';
import iconHappyWhite from '../assets/images/icon-happy-white.svg';
import iconVeryHappyWhite from '../assets/images/icon-very-happy-white.svg';

import iconTrendIncrease from '../assets/images/icon-trend-increase.svg';
import iconTrendDecrease from '../assets/images/icon-trend-decrease.svg';
import iconTrendSame from '../assets/images/icon-trend-same.svg';

import iconSleep from '../assets/images/icon-sleep.svg';
import iconQuote from '../assets/images/icon-quote.svg';
import iconReflection from '../assets/images/icon-reflection.svg';

// Export icons for direct use
export {
  iconSleep,
  iconQuote,
  iconReflection,
  iconTrendIncrease,
  iconTrendDecrease,
  iconTrendSame,
};

// -----------------------------
// Mood Icon Mapping (colored)
// -----------------------------
export const MOOD_ICONS: Record<MoodLevel, string> = {
  [-2]: iconVerySadColor,
  [-1]: iconSadColor,
  [0]: iconNeutralColor,
  [1]: iconHappyColor,
  [2]: iconVeryHappyColor,
};

// -----------------------------
// Mood Icon Mapping (white - for dark backgrounds)
// -----------------------------
export const MOOD_ICONS_WHITE: Record<MoodLevel, string> = {
  [-2]: iconVerySadWhite,
  [-1]: iconSadWhite,
  [0]: iconNeutralWhite,
  [1]: iconHappyWhite,
  [2]: iconVeryHappyWhite,
};

// -----------------------------
// Mood Color Mapping (matches SCSS $mood-colors)
// -----------------------------
export const MOOD_COLORS: Record<MoodLevel, string> = {
  [-2]: '#FF9B99', // Very Sad
  [-1]: '#B8B1FF', // Sad
  [0]: '#89CAFF',  // Neutral
  [1]: '#89E780',  // Happy
  [2]: '#FFC97C',  // Very Happy
};

// -----------------------------
// Mood Label Mapping
// -----------------------------
export const MOOD_LABELS: Record<MoodLevel, string> = {
  [-2]: 'Very Sad',
  [-1]: 'Sad',
  [0]: 'Neutral',
  [1]: 'Happy',
  [2]: 'Very Happy',
};

// -----------------------------
// Helper Functions
// -----------------------------

/**
 * Get icon path for a mood level (colored version)
 */
export function getMoodIcon(mood: MoodLevel): string {
  return MOOD_ICONS[mood] ?? MOOD_ICONS[0];
}

/**
 * Get icon path for a mood level (white version)
 */
export function getMoodIconWhite(mood: MoodLevel): string {
  return MOOD_ICONS_WHITE[mood] ?? MOOD_ICONS_WHITE[0];
}

/**
 * Get color for a mood level
 */
export function getMoodColor(mood: MoodLevel): string {
  return MOOD_COLORS[mood] ?? '#89CAFF';
}

/**
 * Get label for a mood level
 */
export function getMoodLabel(mood: MoodLevel): string {
  return MOOD_LABELS[mood] ?? 'Neutral';
}

/**
 * Format sleep hours for display (e.g., "9+ hours", "5-6 Hours")
 */
export function formatSleepHours(hours: number): string {
  if (hours >= 9) return '9+ hours';
  if (hours >= 7) return '7-8 Hours';
  if (hours >= 5) return '5-6 Hours';
  if (hours >= 3) return '3-4 Hours';
  return `${hours} hours`;
}

/**
 * Get a mood quote based on mood level
 */
export function getMoodQuote(mood: MoodLevel): string {
  const quotes: Record<MoodLevel, string[]> = {
    [-2]: [
      "It's okay to not be okay. Take it one moment at a time.",
      "Difficult roads often lead to beautiful destinations.",
      "This feeling is temporary. You are stronger than you know.",
    ],
    [-1]: [
      "Every cloud has a silver lining.",
      "Tomorrow is a new opportunity to feel better.",
      "Be gentle with yourself today.",
    ],
    [0]: [
      "Balance is the key to everything.",
      "Sometimes steady and calm is exactly what you need.",
      "A peaceful mind is a powerful mind.",
    ],
    [1]: [
      "Your positive energy is contagious!",
      "Keep riding this wave of good vibes.",
      "Happiness looks beautiful on you.",
    ],
    [2]: [
      "When your heart is full, share your light with the world.",
      "Your joy is inspiring. Keep shining!",
      "Embrace this amazing feeling!",
    ],
  };

  const moodQuotes = quotes[mood] ?? quotes[0];
  return moodQuotes[Math.floor(Math.random() * moodQuotes.length)];
}

/**
 * Get trend icon path
 */
export function getTrendIcon(trend: 'increase' | 'decrease' | 'same'): string {
  switch (trend) {
    case 'increase':
      return iconTrendIncrease;
    case 'decrease':
      return iconTrendDecrease;
    case 'same':
      return iconTrendSame;
    default:
      return iconTrendSame;
  }
}

/**
 * Get trend description text
 */
export function getTrendDescription(trend: 'increase' | 'decrease' | 'same', type: 'mood' | 'sleep'): string {
  if (type === 'mood') {
    switch (trend) {
      case 'increase':
        return 'Increase from the previous 5 check-ins';
      case 'decrease':
        return 'Decrease from the previous 5 check-ins';
      case 'same':
        return 'Same as the previous 5 check-ins';
    }
  } else {
    switch (trend) {
      case 'increase':
        return 'Increase from the previous 5 check-ins';
      case 'decrease':
        return 'Decrease from the previous 5 check-ins';
      case 'same':
        return 'Same as the previous 5 check-ins';
    }
  }
}
