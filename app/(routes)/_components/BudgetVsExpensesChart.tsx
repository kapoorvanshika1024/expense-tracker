"use client";

import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface BudgetVsExpensesChartProps {
  data: { name: string; budget: number; spent: number }[];
}

const BudgetVsExpensesChart = ({ data }: BudgetVsExpensesChartProps): JSX.Element | null => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensure the chart renders only on the client
  }, []);

  if (!isClient) {
    return null; // Avoid rendering on the server
  }

  const maxValue = Math.max(...data.map((item) => Math.max(item.budget, item.spent)));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        {/* X-Axis */}
        <XAxis
          dataKey="name"
          stroke="#FFFFFF" // Makes the x-axis white
          tick={{ fill: "#FFFFFF" }} // Makes the x-axis labels white
        />
        {/* Y-Axis */}
        <YAxis
          domain={[0, maxValue + 20]}
          stroke="#FFFFFF" // Makes the y-axis white
          tick={{ fill: "#FFFFFF" }} // Makes the y-axis labels white
        />
        {/* Tooltip */}
        <Tooltip
          contentStyle={{ backgroundColor: "#1E1E2F", color: "#FFFFFF" }} // Optional: Dark tooltip background with white text
          labelStyle={{ color: "#FFFFFF" }}
        />
        {/* Bars */}
        <Bar dataKey="budget" fill="#87CEEB" /> 
        <Bar dataKey="spent" fill="#FF7F50" /> 
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BudgetVsExpensesChart;
