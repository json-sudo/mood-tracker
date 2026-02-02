import { useState, useRef } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { MoodEntry, MoodLevel } from '../../types';
import { getMoodColor, getMoodIcon, MOOD_LABELS } from '../../utils';
import { ChartPopover } from './ChartPopover';
import styles from './TrendChart.module.scss';

interface TrendChartProps {
  entries: MoodEntry[];
}

interface ChartDataPoint {
  date: string;
  shortDate: string;
  mood: number;
  moodLevel: MoodLevel;
  sleep: number;
  entry: MoodEntry;
}

const Y_AXIS_LABELS: Record<number, string> = {
  5: '· 9+ hours',
  4: '· 7-8 hours',
  3: '· 5-6 hours',
  2: '· 3-4 hours',
  1: '· 0-2 hours',
};

export function TrendChart({ entries }: TrendChartProps) {
  const [selectedEntry, setSelectedEntry] = useState<MoodEntry | null>(null);
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });
  const chartRef = useRef<HTMLDivElement>(null);

  const chartData: ChartDataPoint[] = entries
    .slice(0, 11)
    .reverse()
    .map((entry) => {
      const date = new Date(entry.created_at);
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        shortDate: date.toLocaleDateString('en-US', { weekday: 'short' }),
        mood: entry.mood + 3,
        moodLevel: entry.mood,
        sleep: entry.sleep_hours,
        entry,
      };
    });

  const handleBarClick = (data: ChartDataPoint, event: React.MouseEvent) => {
    if (!chartRef.current) return;

    const rect = chartRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setSelectedEntry(data.entry);
    setPopoverPosition({ x, y });
  };

  const handleClosePopover = () => {
    setSelectedEntry(null);
  };

  const CustomBar = (props: any) => {
    const { x, y, width, height, payload } = props;
    const iconSrc = getMoodIcon(payload.moodLevel);
    
    const iconSize = 24;
    const iconX = x + (width - iconSize) / 2;
    const iconY = y - iconSize - 4;

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          rx={6}
          ry={6}
          fill={getMoodColor(payload.moodLevel)}
          className={styles.bar}
        />
        <image
          href={iconSrc}
          x={iconX}
          y={iconY}
          width={iconSize}
          height={iconSize}
          className={styles.barIcon}
        />
      </g>
    );
  };

  if (entries.length === 0) {
    return (
      <article className={styles.card}>
        <header className={styles.header}>
          <h2 className={styles.title}>Mood and sleep trends</h2>
        </header>
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>
            No data yet. Start tracking your mood to see trends!
          </p>
        </div>
        <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 40, right: 10, left: 10, bottom: 5 }}
            barCategoryGap="15%"
          >
            <XAxis
              dataKey="shortDate"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#57577B', fontSize: 12 }}
            />
            <YAxis
              domain={[0, 6]}
              ticks={[1, 2, 3, 4, 5]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9393B7', fontSize: 11 }}
              width={80}
              tickFormatter={(value) => Y_AXIS_LABELS[value] || ''}
            />
            <Bar
              dataKey="mood"
              shape={<CustomBar />}
              onClick={(data, _index, event) => {
                const chartPoint = data.payload as ChartDataPoint;
                handleBarClick(chartPoint, event as unknown as React.MouseEvent);
              }}
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  cursor="pointer"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      </article>
    );
  }

  

  return (
    <article className={styles.card} ref={chartRef}>
      <header className={styles.header}>
        <h2 className={styles.title}>Mood and sleep trends</h2>
        <div className={styles.legend}>
          {([-2, -1, 0, 1, 2] as MoodLevel[]).map((level) => (
            <span key={level} className={styles.legendItem}>
              <span 
                className={styles.legendDot} 
                style={{ backgroundColor: getMoodColor(level) }}
              />
              {MOOD_LABELS[level]}
            </span>
          ))}
        </div>
      </header>

      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" minHeight={380}>
          <BarChart
            data={chartData}
            margin={{ top: 40, right: 10, left: 10, bottom: 5 }}
            barCategoryGap="15%"
          >
            <XAxis
              dataKey="shortDate"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#57577B', fontSize: 12 }}
            />
            <YAxis
              domain={[0, 6]}
              ticks={[1, 2, 3, 4, 5]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9393B7', fontSize: 11 }}
              width={80}
              tickFormatter={(value) => Y_AXIS_LABELS[value] || ''}
            />
            <Bar
              dataKey="mood"
              shape={<CustomBar />}
              onClick={(data, _index, event) => {
                const chartPoint = data.payload as ChartDataPoint;
                handleBarClick(chartPoint, event as unknown as React.MouseEvent);
              }}
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  cursor="pointer"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {selectedEntry && (
        <ChartPopover
          entry={selectedEntry}
          position={popoverPosition}
          onClose={handleClosePopover}
        />
      )}
    </article>
  );
}
