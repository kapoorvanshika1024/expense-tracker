"use client";

import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface MonthlyExpensesChartProps {
  data: { month: string; total: number }[];
}

const MonthlyExpensesChart = ({ data }: MonthlyExpensesChartProps): JSX.Element | null => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensure the chart renders only on the client
  }, []);

  if (!isClient) {
    return null; // Avoid rendering on the server
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        {/* X-Axis */}
        <XAxis
          dataKey="month"
          stroke="#FFFFFF" 
          tick={{ fill: "#FFFFFF" }} 
        />
        {/* Y-Axis */}
        <YAxis
          stroke="#FFFFFF" 
          tick={{ fill: "#FFFFFF" }} 
        />
        {/* Tooltip */}
        <Tooltip
          contentStyle={{ backgroundColor: "#1E1E2F", color: "#FFFFFF" }} 
          
          labelStyle={{ color: "#FFFFFF" }}
        />
        {/* Line */}
        <Line type="monotone" dataKey="total" stroke="#8884d8" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default MonthlyExpensesChart;
