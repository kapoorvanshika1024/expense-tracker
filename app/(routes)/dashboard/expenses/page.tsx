"use client";

import React, { useState, useEffect } from "react";
import AddExpense from "./_components/AddExpense";
import ExpenseList from "./_components/ExpenseList";
import { db } from "@/utils/dbConfig";
import { Expenses, Budgets } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { eq, desc } from "drizzle-orm";

interface Expense {
  id: number;
  name: string;
  amount: string;
  budgetId: number | null;
  createdAt: string;
}

const ExpensesPage = (): JSX.Element => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const { user } = useUser();

  const refreshData = async () => {
    if (!user) return;

    try {
      const result = await db
        .select({
          id: Expenses.id,
          name: Expenses.name,
          amount: Expenses.amount,
          budgetId: Expenses.budgetId,
          createdAt: Expenses.createdAt,
        })
        .from(Expenses)
        .leftJoin(Budgets, eq(Expenses.budgetId, Budgets.id))
        .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress || ""))
        .orderBy(desc(Expenses.createdAt));

      setExpenses(result as Expense[]);
    } catch (error) {
      console.error("Error refreshing expenses:", error);
    }
  };

  useEffect(() => {
    refreshData();
  }, [user]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Expenses</h1>
      <AddExpense refreshData={refreshData} />
      <ExpenseList expenses={expenses} />
    </div>
  );
};

export default ExpensesPage;
