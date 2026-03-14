"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const data = [
  { name: "Jan", total: 1800 },
  { name: "Feb", total: 3200 },
  { name: "Mar", total: 2800 },
  { name: "Apr", total: 4100 },
  { name: "May", total: 2400 },
  { name: "Jun", total: 3800 },
  { name: "Jul", total: 4600 },
  { name: "Aug", total: 3100 },
  { name: "Sep", total: 5200 },
  { name: "Oct", total: 4800 },
  { name: "Nov", total: 3600 },
  { name: "Dec", total: 4400 },
];

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height="100%" minHeight={300}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Bar
          dataKey="total"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
