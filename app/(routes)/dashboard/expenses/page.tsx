"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/utils/dbConfig";
import { Expenses, Budgets } from "@/utils/schema";
import { eq } from "drizzle-orm";
import ExpenseList from "./_components/ExpenseList";

interface Expense {
  id: number;
  name: string;
  amount: string;
  budgetId: number | null;
  createdAt: string;
}

const ExpensesPage = (): JSX.Element => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [selectedBudgetId, setSelectedBudgetId] = useState<number | null>(null);
  const [budgets, setBudgets] = useState<{ id: number; name: string }[]>([]);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Fetch all budgets and expenses
  const fetchBudgets = async () => {
    try {
      const budgets = await db
        .select({
          id: Budgets.id,
          name: Budgets.name,
        })
        .from(Budgets);
      setBudgets(budgets);
    } catch (error) {
      console.error("Error fetching budgets:", error);
    }
  };

  const fetchExpenses = async () => {
    try {
      const expenses = await db
        .select({
          id: Expenses.id,
          name: Expenses.name,
          amount: Expenses.amount,
          budgetId: Expenses.budgetId,
          createdAt: Expenses.createdAt,
        })
        .from(Expenses);
      setExpenses(expenses);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  useEffect(() => {
    fetchBudgets();
    fetchExpenses();
  }, []);

  // Handle Edit Expense
  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense); // Set the expense to be edited
    setEditDialogOpen(true); // Open the edit dialog
  };

  // Handle Delete Expense
  const handleDeleteExpense = async (id: number) => {
    const confirmation = confirm("Are you sure you want to delete this expense?");
    if (!confirmation) return;

    try {
      await db.delete(Expenses).where(eq(Expenses.id, id));
      alert("Expense deleted successfully!");
      fetchExpenses(); // Refresh the expense list
    } catch (error) {
      console.error("Error deleting expense:", error);
      alert("Failed to delete expense!");
    }
  };

  // Handle Expense Filter
  const handleFilterChange = (budgetId: string) => {
    setSelectedBudgetId(budgetId === "all" ? null : parseInt(budgetId, 10));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Expenses</h1>

      {/* Add Expense Button */}
      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => setEditDialogOpen(true)}
      >
        Add Expense
      </button>

      {/* Budget Filter */}
      <div className="mb-4">
        <label htmlFor="budgetFilter" className="mr-2 font-medium">
          Filter by Budget:
        </label>
        <select
          id="budgetFilter"
          onChange={(e) => handleFilterChange(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="all">All Budgets</option>
          {budgets.map((budget) => (
            <option key={budget.id} value={budget.id}>
              {budget.name}
            </option>
          ))}
        </select>
      </div>

      {/* Expense List */}
      <ExpenseList
        expenses={expenses}
        filterBudgetId={selectedBudgetId}
        onDelete={handleDeleteExpense}
        onEdit={handleEditExpense}
      />

      {/* Add/Edit Expense Dialog */}
      {editDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-lg font-bold mb-4">
              {editingExpense ? "Edit Expense" : "Add Expense"}
            </h2>
            {/* Add/Edit Form */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  if (editingExpense) {
                    // Update existing expense
                    await db
                      .update(Expenses)
                      .set({
                        name: editingExpense.name,
                        amount: editingExpense.amount,
                        budgetId: editingExpense.budgetId,
                      })
                      .where(eq(Expenses.id, editingExpense.id));
                    alert("Expense updated successfully!");
                  } else {
                    // Add new expense logic
                  await db.insert(Expenses).values({
                  name: (e.target as any).name.value,
                  amount: (e.target as any).amount.value,
                  budgetId: parseInt((e.target as any).budgetId.value, 10),
                  createdAt: new Date().toISOString(), // Add current timestamp
                   });
                  alert("Expense added successfully!");
                  }
                  setEditDialogOpen(false);
                  fetchExpenses(); // Refresh the expense list
                } catch (error) {
                  console.error("Error saving expense:", error);
                  alert("Failed to save expense!");
                }
              }}
            >
              <div className="mb-4">
                <label htmlFor="name" className="block font-medium">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  defaultValue={editingExpense?.name || ""}
                  required
                  className="border rounded px-2 py-1 w-full"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="amount" className="block font-medium">
                  Amount
                </label>
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  defaultValue={editingExpense?.amount || ""}
                  required
                  className="border rounded px-2 py-1 w-full"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="budgetId" className="block font-medium">
                  Budget
                </label>
                <select
                  id="budgetId"
                  name="budgetId"
                  defaultValue={editingExpense?.budgetId || ""}
                  required
                  className="border rounded px-2 py-1 w-full"
                >
                  <option value="" disabled>
                    Select a Budget
                  </option>
                  {budgets.map((budget) => (
                    <option key={budget.id} value={budget.id}>
                      {budget.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditDialogOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpensesPage;
