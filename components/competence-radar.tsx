"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts';
import type { RadarDataPoint } from '@/types';

interface Props {
  data: RadarDataPoint[];
}

export function CompetenceRadar({ data }: Props) {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="var(--chart-grid)" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fontSize: 10, fill: 'var(--chart-text)' }}
          />
          <Radar
            name="Desempenho"
            dataKey="value"
            stroke="#2563eb"
            fill="#2563eb"
            fillOpacity={0.5}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

