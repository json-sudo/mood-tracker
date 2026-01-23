import { useState, useEffect, useCallback } from 'react';
import { entriesApi } from '../services/api';
import type { MoodEntry, MoodAverages } from '../types';

interface UseMoodDataReturn {
  todayEntry: MoodEntry | null;
  entries: MoodEntry[];
  averages: MoodAverages | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useMoodData(): UseMoodDataReturn {
  const [todayEntry, setTodayEntry] = useState<MoodEntry | null>(null);
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [averages, setAverages] = useState<MoodAverages | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [todayData, entriesData, averagesData] = await Promise.all([
        entriesApi.getTodayEntry(),
        entriesApi.getEntries(11),
        entriesApi.getAverages(),
      ]);

      setTodayEntry(todayData);
      setEntries(entriesData);
      setAverages(averagesData);
    } catch (err) {
      console.error('Failed to fetch mood data:', err);
      setError('Failed to load mood data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    todayEntry,
    entries,
    averages,
    isLoading,
    error,
    refetch: fetchData,
  };
}
