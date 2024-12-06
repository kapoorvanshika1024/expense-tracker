"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/utils/dbConfig";
import { Expenses, Budgets } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { eq, sql } from "drizzle-orm";
import dynamic from "next/dynamic";

// Dynamically import charts to prevent SSR issues
const CategoryBreakdownChart = dynamic(() => import("../_components/CategoryBreakdownChart"), {
  ssr: false,
});
const MonthlyExpensesChart = dynamic(() => import("../_components/MonthlyExpensesChart"), {
  ssr: false,
});
const BudgetVsExpensesChart = dynamic(() => import("../_components/BudgetVsExpensesChart"), {
  ssr: false,
});
const BudgetBreakdownChart = dynamic(() => import("../_components/BudgetBreakdownChart"), {
  ssr: false,
});

const DashboardPage = (): JSX.Element => {
  const { user } = useUser();
  const [categories, setCategories] = useState<{ category: string; total: number }[]>([]);
  const [budgets, setBudgets] = useState<{ name: string; total: number }[]>([]);
  const [monthlyExpenses, setMonthlyExpenses] = useState<{ month: string; total: number }[]>([]);
  const [budgetData, setBudgetData] = useState<{ name: string; budget: number; spent: number }[]>([]);
  const [totalBudget, setTotalBudget] = useState<number>(0);
  const [totalSpent, setTotalSpent] = useState<number>(0);
  const [remaining, setRemaining] = useState<number>(0);

  const fetchDashboardData = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return;

    try {
      console.log("Fetching dashboard data for:", user.primaryEmailAddress.emailAddress);

      // Fetch total budget directly from Budgets table
      const budgetResult = await db
        .select({
          totalBudget: sql<number>`COALESCE(SUM(CAST(${Budgets.amount} AS NUMERIC)), 0)`,
        })
        .from(Budgets)
        .where(eq(Budgets.createdBy, user.primaryEmailAddress.emailAddress));

      const expenseResult = await db
        .select({
          totalSpent: sql<number>`COALESCE(SUM(${Expenses.amount}), 0)`,
        })
        .from(Expenses)
        .leftJoin(Budgets, eq(Expenses.budgetId, Budgets.id))
        .where(eq(Budgets.createdBy, user.primaryEmailAddress.emailAddress));

      const budgetSummary = budgetResult[0] || { totalBudget: 0 };
      const expenseSummary = expenseResult[0] || { totalSpent: 0 };

      setTotalBudget(Number(budgetSummary.totalBudget) || 0);
      setTotalSpent(Number(expenseSummary.totalSpent) || 0);
      setRemaining(Number(budgetSummary.totalBudget) - Number(expenseSummary.totalSpent));

      // Fetch category breakdown (Expenses Pie Chart Data)
      const categoryData = await db
        .select({
          category: Budgets.name,
          total: sql<number>`COALESCE(SUM(${Expenses.amount}), 0)`,
        })
        .from(Expenses)
        .leftJoin(Budgets, eq(Expenses.budgetId, Budgets.id))
        .where(eq(Budgets.createdBy, user.primaryEmailAddress.emailAddress))
        .groupBy(Budgets.name);

      setCategories(
        categoryData.map((data) => ({
          category: data.category || "Uncategorized",
          total: Number(data.total),
        }))
      );

      // Fetch budget breakdown (Budgets Pie Chart Data)
      const budgetBreakdown = await db
        .select({
          name: Budgets.name,
          total: sql<number>`CAST(${Budgets.amount} AS NUMERIC)`,
        })
        .from(Budgets)
        .where(eq(Budgets.createdBy, user.primaryEmailAddress.emailAddress));

      setBudgets(
        budgetBreakdown.map((data) => ({
          name: data.name || "Uncategorized",
          total: Number(data.total),
        }))
      );

      // Fetch monthly expenses (Line Chart Data)
      const monthlyData = await db
        .select({
          month: sql<string>`DATE_TRUNC('month', ${Expenses.createdAt}::timestamp)`,
          total: sql<number>`COALESCE(SUM(${Expenses.amount}), 0)`,
        })
        .from(Expenses)
        .leftJoin(Budgets, eq(Expenses.budgetId, Budgets.id))
        .where(eq(Budgets.createdBy, user.primaryEmailAddress.emailAddress))
        .groupBy(sql<string>`DATE_TRUNC('month', ${Expenses.createdAt}::timestamp)`);

      setMonthlyExpenses(
        monthlyData.map((entry) => ({
          ...entry,
          month: new Date(entry.month).toLocaleDateString("en-CA", {
            year: "numeric",
            month: "short",
          }),
        }))
      );

      // Fetch budget vs. expenses data (Bar Chart Data)
      const budgetVsExpenses = await db
        .select({
          name: Budgets.name,
          budget: sql<number>`CAST(${Budgets.amount} AS NUMERIC)`,
          spent: sql<number>`COALESCE(SUM(${Expenses.amount}), 0)`,
        })
        .from(Budgets)
        .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
        .where(eq(Budgets.createdBy, user.primaryEmailAddress.emailAddress))
        .groupBy(Budgets.name, Budgets.amount);

      setBudgetData(budgetVsExpenses);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="col-span-1 bg-gray-900 text-white shadow-md rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold">Total Budget</h2>
          <p className="text-2xl font-bold">${totalBudget.toFixed(2)}</p>
        </div>
        <div className="col-span-1 bg-gray-900 text-white shadow-md rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold">Total Spent</h2>
          <p className="text-2xl font-bold">${totalSpent.toFixed(2)}</p>
        </div>
        <div className="col-span-1 bg-gray-900 text-white shadow-md rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold">Remaining</h2>
          <p className="text-2xl font-bold">${remaining.toFixed(2)}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-900 text-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Expenses Breakdown</h2>
          <CategoryBreakdownChart data={categories} />
        </div>

        <div className="bg-gray-900 text-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Budget Breakdown</h2>
          <BudgetBreakdownChart data={budgets} />
        </div>
      </div>

      <div className="bg-gray-900 text-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Monthly Expenses</h2>
        <MonthlyExpensesChart data={monthlyExpenses} />
      </div>

      <div className="bg-gray-900 text-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Budget vs Expenses</h2>
        <BudgetVsExpensesChart data={budgetData} />

      </div>
    </div>
  );
};

export default DashboardPage;
