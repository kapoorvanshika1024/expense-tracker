"use client";

import React from "react";

interface Expense {
  id: number;
  name: string;
  amount: string;
  budgetId: number | null;
  createdAt: string;
}

interface ExpenseListProps {
  expenses: Expense[];
}

const ExpenseList = ({ expenses }: ExpenseListProps): JSX.Element => {
  return (
    <div className="mt-7">
      <h2 className="text-xl font-bold mb-4">Expense List</h2>
      <div className="space-y-3">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="p-4 bg-white shadow-md rounded-md flex justify-between"
          >
            <div>
              <h3 className="font-medium">{expense.name}</h3>
              <p className="text-sm text-gray-500">${expense.amount}</p>
            </div>
            <span className="text-sm text-gray-400">
              {new Date(expense.createdAt).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseList;
