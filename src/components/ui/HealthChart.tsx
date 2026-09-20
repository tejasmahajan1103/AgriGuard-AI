import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { HealthRecord } from '../../types';
import { HEALTH_STATUS_COLORS } from '../../utils/constants';

interface HealthChartProps {
  data: HealthRecord[];
  height?: number;
}

export default function HealthChart({ data, height = 300 }: HealthChartProps) {
  const chartData = data.map((record) => ({
    date: new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: record.healthScore,
    status: record.status,
    fill: HEALTH_STATUS_COLORS[record.status] || '#10b981',
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="healthGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12, fill: '#94a3b8' }}
          axisLine={{ stroke: '#e2e8f0' }}
          tickLine={false}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fontSize: 12, fill: '#94a3b8' }}
          axisLine={{ stroke: '#e2e8f0' }}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            fontSize: '13px',
          }}
          formatter={(value: any) => [`${value ?? 0}%`, 'Health Score']}
        />
        <Area
          type="monotone"
          dataKey="score"
          stroke="#10b981"
          strokeWidth={2.5}
          fill="url(#healthGradient)"
          dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
          activeDot={{ r: 6, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
