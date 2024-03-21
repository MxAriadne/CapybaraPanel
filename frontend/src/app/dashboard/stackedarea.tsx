"use client";
import React, { PureComponent } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data: any[] | undefined = [
];

// Create random data to fill in the rest
Array.from({ length: 32 }, (_, index) => {
  const name = `03:${index + 10}`;
  const uv = Math.floor(Math.random() * 1000);
  const pv = Math.floor(Math.random() * 1000);
  const amt = Math.floor(Math.random() * 1000);
  data.push({ name, uv, pv, amt })
});

export default function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart
        width={500}
        height={400}
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="uv"
          stackId="1"
          stroke="#8884d8"
          fill="#8884d8"
        />
        <Area
          type="monotone"
          dataKey="pv"
          stackId="1"
          stroke="#82ca9d"
          fill="#82ca9d"
        />
        <Area
          type="monotone"
          dataKey="amt"
          stackId="1"
          stroke="#ffc658"
          fill="#ffc658"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
