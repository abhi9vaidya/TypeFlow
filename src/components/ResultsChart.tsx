// Build: 20251114
import { LiveSample, getMovingAverage } from "@/utils/metrics";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from "recharts";
import { Flame } from "lucide-react";

interface ResultsChartProps {
  samples: LiveSample[];
  isPB: boolean;
}

export function ResultsChart({ samples, isPB }: ResultsChartProps) {
  if (samples.length === 0) return null;

  const movingAvg = getMovingAverage(samples, 3);
  const maxWpm = Math.max(...samples.map(s => s.wpm));
  const peakSample = samples.find(s => s.wpm === maxWpm);

  const chartData = samples.map((sample, i) => ({
    time: sample.t,
    wpm: sample.wpm,
    avg: movingAvg[i].wpm,
    errors: sample.errors,
  }));

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
          <defs>
            <linearGradient id="wpmGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.2} />
          
          <XAxis
            dataKey="time"
            stroke="hsl(var(--muted-foreground))"
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            axisLine={{ stroke: "hsl(var(--border))" }}
          />
          
          <YAxis
            yAxisId="left"
            stroke="hsl(var(--muted-foreground))"
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            axisLine={{ stroke: "hsl(var(--border))" }}
          />
          
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--panel))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "12px",
              padding: "12px 16px",
              boxShadow: "0 8px 24px hsl(var(--primary) / 0.1)",
            }}
            labelStyle={{ 
              color: "hsl(var(--foreground))", 
              marginBottom: "8px",
              fontWeight: 600,
              fontSize: "13px"
            }}
            itemStyle={{ 
              color: "hsl(var(--muted-foreground))",
              fontSize: "12px"
            }}
          />
          
          {/* Moving Average - rendered first so it appears behind */}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="avg"
            stroke="hsl(var(--secondary))"
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={false}
            name="Average"
          />
          
          {/* WPM Line with gradient fill */}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="wpm"
            stroke="hsl(var(--primary))"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 7, fill: "hsl(var(--primary))", strokeWidth: 2, stroke: "hsl(var(--background))" }}
            fill="url(#wpmGradient)"
            name="WPM"
          />
          
          {/* PB marker at peak */}
          {isPB && peakSample && (
            <ReferenceDot
              yAxisId="left"
              x={peakSample.t}
              y={peakSample.wpm}
              r={10}
              fill="hsl(var(--gold))"
              stroke="hsl(var(--background))"
              strokeWidth={3}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

