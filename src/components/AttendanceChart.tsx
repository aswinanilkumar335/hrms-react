import { TrendingUp, Activity, Target } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function AttendanceChart() {
  // Enhanced data for visualization
  const data = [
    { day: "Mon", hours: 8.5 },
    { day: "Tue", hours: 7.2 },
    { day: "Wed", hours: 9.0 },
    { day: "Thu", hours: 6.8 },
    { day: "Fri", hours: 8.2 },
    { day: "Sat", hours: 2.0 },
    { day: "Sun", hours: 0.0 },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Quick Stats Summary */}
      <div style={{ 
        display: "flex", 
        gap: "24px", 
        padding: "16px", 
        background: "rgba(99, 102, 241, 0.03)", 
        borderRadius: "var(--border-radius-md)",
        border: "1px solid rgba(99, 102, 241, 0.1)"
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
          <div style={{ marginTop: "4px", color: "var(--primary)" }}><Activity size={16} /></div>
          <div>
            <span style={{ fontSize: "12px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>Weekly Avg</span>
            <span style={{ fontSize: "18px", fontWeight: "700", color: "var(--primary)" }}>7.4h</span>
          </div>
        </div>
        <div style={{ width: "1px", background: "rgba(99, 102, 241, 0.1)" }}></div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
          <div style={{ marginTop: "4px", color: "var(--text-main)" }}><Target size={16} /></div>
          <div>
            <span style={{ fontSize: "12px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>Total Hours</span>
            <span style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-main)" }}>41.7h</span>
          </div>
        </div>
        <div style={{ width: "1px", background: "rgba(99, 102, 241, 0.1)" }}></div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
          <div style={{ marginTop: "4px", color: "var(--success)" }}><TrendingUp size={16} /></div>
          <div>
            <span style={{ fontSize: "12px", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>Consistency</span>
            <span style={{ fontSize: "18px", fontWeight: "700", color: "var(--success)" }}>94%</span>
          </div>
        </div>
      </div>

      {/* Main Chart */}
      <div style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: "var(--text-muted)" }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: "var(--text-muted)" }} 
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: "12px", 
                border: "none", 
                boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                padding: "10px"
              }}
              cursor={{ stroke: 'var(--primary)', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            <Area
              type="monotone"
              dataKey="hours"
              stroke="var(--primary)"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorHours)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AttendanceChart;