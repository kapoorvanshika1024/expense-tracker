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
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null); // For editing
  const [dialogOpen, setDialogOpen] = useState(false); // Control dialog visibility
  const { user } = useUser();

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      getBudgetList(user.primaryEmailAddress.emailAddress);
    }
  }, [user]);

  const getBudgetList = async (emailAddress: string) => {
    try {
      const result = await db
        .select({
          id: Budgets.id,
          name: Budgets.name,
          amount: sql<number>`CAST(${Budgets.amount} AS FLOAT)`,
          icon: Budgets.icon,
          createdBy: Budgets.createdBy,
          totalSpend: sql<number>`SUM(CAST(${Expenses.amount} AS FLOAT))`,
          totalItems: sql<number>`COUNT(${Expenses.id})`,
        })
        .from(Budgets)
        .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
        .where(eq(Budgets.createdBy, emailAddress))
        .groupBy(Budgets.id)
        .orderBy(desc(Budgets.id));

      setBudgetList(result as Budget[]);
    } catch (error) {
      console.error("Error fetching budget list:", error);
    }
  };

  const handleDeleteBudget = async (budgetId: number) => {
    if (!user?.primaryEmailAddress?.emailAddress) return;

    const confirmation = confirm("Are you sure you want to delete this budget?");
    if (!confirmation) return;

    try {
      // Delete all related expenses
      await db.delete(Expenses).where(eq(Expenses.budgetId, budgetId));

      // Delete the budget itself
      await db.delete(Budgets).where(eq(Budgets.id, budgetId));

      alert("Budget deleted successfully!");
      getBudgetList(user.primaryEmailAddress.emailAddress); // Refresh the list
    } catch (error) {
      console.error("Error deleting budget:", error);
      alert("Failed to delete budget!");
    }
  };

  const handleEditBudget = (budget: Budget) => {
    setEditingBudget(budget);
    setDialogOpen(true); // Open the dialog for editing
  };

  const handleCreateNewBudget = () => {
    setEditingBudget(null); // Ensure no budget is being edited
    setDialogOpen(true); // Open the dialog for creating a new budget
  };

  const handleCloseDialog = () => {
    setEditingBudget(null); // Reset the editing budget
    setDialogOpen(false); // Close the dialog
  };

  return (
    <div className="mt-7">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Button for creating a new budget */}
        <div
          className="bg-slate-100 p-4 rounded-md items-center flex flex-col justify-center border-dashed cursor-pointer hover:shadow-md w-full h-48 text-center"
          onClick={handleCreateNewBudget}
        >
          <h2 className="text-3xl">+</h2>
          <h2>Create New Budget</h2>
        </div>

        {/* Dialog for creating or editing budget */}
        <CreateBudget
          refreshData={() =>
            user?.primaryEmailAddress?.emailAddress &&
            getBudgetList(user.primaryEmailAddress.emailAddress)
          }
          editingBudget={editingBudget}
          onCloseEdit={handleCloseDialog}
          open={dialogOpen} // Pass the dialog open state
        />

        {/* List of budgets */}
        {budgetList.length > 0 ? (
          budgetList.map((budget) => (
            <BudgetItem
              key={budget.id}
              budget={{
                ...budget,
                onEdit: () => handleEditBudget(budget),
                onDelete: () => handleDeleteBudget(budget.id),
              }}
            />
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
