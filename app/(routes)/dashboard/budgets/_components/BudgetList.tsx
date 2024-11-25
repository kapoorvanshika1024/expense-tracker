"use client";
import React, { useEffect, useState } from "react";
import CreateBudget from "./CreateBudget";
import { db } from "@/utils/dbConfig";
import { eq, sql, desc } from "drizzle-orm";
import { Budgets, Expenses } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import BudgetItem from "./BudgetItem";

interface Budget {
  id: number;
  name: string;
  amount: number;
  icon: string;
  createdBy: string;
  totalSpend?: number;
  totalItems?: number;
}

const BudgetList = (): JSX.Element => {
  const [budgetList, setBudgetList] = useState<Budget[]>([]);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      getBudgetList();
    }
  }, [user]);

  const getBudgetList = async () => {
    const result = await db
      .select({
        id: Budgets.id,
        name: Budgets.name,
        amount: sql<number>`CAST(${Budgets.amount} AS FLOAT)`, // Convert to number
        icon: Budgets.icon,
        createdBy: Budgets.createdBy,
        totalSpend: sql<number>`SUM(${Expenses.amount})`,
        totalItems: sql<number>`COUNT(${Expenses.id})`,
      })
      .from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
      .groupBy(Budgets.id)
      .orderBy(desc(Budgets.id));
  
    setBudgetList(result as Budget[]); // Cast to Budget[]
  };
  
  return (
    <div className="mt-7">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <CreateBudget refreshData={getBudgetList} />
        {budgetList.length > 0 ? (
          budgetList.map((budget, index) => (
            <BudgetItem key={index} budget={budget} />
          ))
        ) : (
          [1, 2, 3, 4, 5, 6, 7].map((item) => (
            <div
              key={item}
              className="w-full bg-slate-200 rounded-lg h-[150px] animate-pulse"
            ></div>
          ))
        )}
      </div>
    </div>
  );
};

export default BudgetList;
