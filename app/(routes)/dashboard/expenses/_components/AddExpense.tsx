"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { db } from "@/utils/dbConfig";
import { Budgets, Expenses } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { eq, sql } from "drizzle-orm";

interface AddExpenseProps {
  refreshData: () => void;
}

const AddExpense = ({ refreshData }: AddExpenseProps): JSX.Element => {
  const [expenseName, setExpenseName] = useState<string>("");
  const [expenseAmount, setExpenseAmount] = useState<string>("");
  const [selectedBudgetId, setSelectedBudgetId] = useState<number | null>(null);
  const [budgets, setBudgets] = useState<any[]>([]);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      fetchBudgets();
    }
  }, [user]);

  const fetchBudgets = async () => {
    try {
      const result = await db
        .select({
          id: Budgets.id,
          name: Budgets.name,
          amount: Budgets.amount,
        })
        .from(Budgets)
        .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress || ""));
      setBudgets(result);
    } catch (error) {
      console.error("Error fetching budgets:", error);
    }
  };

  const onAddExpense = async () => {
    try {
      if (!expenseName || !expenseAmount || !selectedBudgetId) {
        toast.error("All fields are required!");
        return;
      }

      const budget = budgets.find((b) => b.id === selectedBudgetId);
      if (!budget) {
        toast.error("Invalid budget selected!");
        return;
      }

      const expenseAmt = Number(expenseAmount);

      // Fetch the total expenses for the selected budget
      const totalExpenses = await db
        .select({
          total: sql<number>`SUM(${Expenses.amount})`,
        })
        .from(Expenses)
        .where(eq(Expenses.budgetId, selectedBudgetId));

      const totalSpent = totalExpenses[0]?.total || 0; // Total expenses for the budget
      const remainingBudget = Number(budget.amount) - totalSpent;

      // Check if the new expense exceeds the remaining budget
      if (expenseAmt > remainingBudget) {
        toast.error(
          `Expense amount exceeds the budget for ${budget.name}! Remaining budget: $${remainingBudget.toFixed(
            2
          )}`
        );
        return;
      }

      // Insert the expense into the database
      await db.insert(Expenses).values({
        name: expenseName,
        amount: expenseAmt.toString(), // Drizzle expects amount as a string
        budgetId: selectedBudgetId,
        createdAt: new Date().toISOString(),
      });

      toast.success("Expense added successfully!");
      refreshData(); // Refresh the UI
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("Error adding expense!");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-800 text-white rounded-lg px-4 py-2">
          Add Expense
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
        </DialogHeader>
        <div className="mt-5">
          <div className="mb-3">
            <h2 className="text-black font-medium my-1">Expense Name</h2>
            <Input
              placeholder="e.g. Dinner"
              value={expenseName}
              onChange={(e) => setExpenseName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <h2 className="text-black font-medium my-1">Expense Amount</h2>
            <Input
              type="number"
              placeholder="e.g. 500"
              value={expenseAmount}
              onChange={(e) => setExpenseAmount(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <h2 className="text-black font-medium my-1">Select Budget</h2>
            <select
              className="w-full h-10 px-3 py-2 rounded-md border text-sm"
              value={selectedBudgetId || ""}
              onChange={(e) => setSelectedBudgetId(Number(e.target.value))}
            >
              <option value="" disabled>
                Choose a Budget
              </option>
              {budgets.map((budget) => (
                <option key={budget.id} value={budget.id}>
                  {budget.name} (Total: ${budget.amount})
                </option>
              ))}
            </select>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              className="mt-5 w-full bg-blue-600 hover:bg-blue-800 text-white"
              disabled={!expenseName || !expenseAmount || !selectedBudgetId}
              onClick={onAddExpense}
            >
              Add Expense
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddExpense;
