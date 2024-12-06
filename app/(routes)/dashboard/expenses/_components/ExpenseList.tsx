"use client";

import React, { useState } from "react";
import { Trash, Edit2 } from "lucide-react";

interface Expense {
  id: number;
  name: string;
  amount: string;
  budgetId: number | null;
  createdAt: string;
}

interface ExpenseListProps {
  expenses: Expense[];
  filterBudgetId: number | null; // Filtering by budgetId
  onDelete: (id: number) => void; // Callback for deleting an expense
  onEdit: (expense: Expense) => void; // Callback for editing an expense
}

const ExpenseList = ({ expenses, filterBudgetId, onDelete, onEdit }: ExpenseListProps): JSX.Element => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter the expenses by budgetId
  const filteredExpenses = filterBudgetId
    ? expenses.filter((expense) => expense.budgetId === filterBudgetId)
    : expenses;

  // Paginate the filtered expenses
  const paginatedExpenses = filteredExpenses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);

  return (
    <div className="mt-7">
      <h2 className="text-xl font-bold mb-4">Expense List</h2>
      <div className="overflow-x-auto shadow-md rounded-md">
        <table className="min-w-full text-left border border-gray-200">
          <thead className="bg-blue-100 text-black font-bold">
            <tr>
              <th className="py-3 px-6">Name</th>
              <th className="py-3 px-6">Amount</th>
              <th className="py-3 px-6">Date</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedExpenses.map((expense, index) => (
              <tr
                key={expense.id}
                className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="py-3 px-6">{expense.name}</td>
                <td className="py-3 px-6">${expense.amount}</td>
                <td className="py-3 px-6">
                  {new Date(expense.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-6 text-center flex items-center justify-center space-x-4">
                  {/* Edit Button */}
                  <button
                    onClick={() => onEdit(expense)}
                    className="text-blue-500 hover:text-blue-700"
                    title="Edit Expense"
                  >
                    <Edit2 size={20} />
                  </button>
                  {/* Delete Button */}
                  <button
                    onClick={() => onDelete(expense.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete Expense"
                  >
                    <Trash size={20} />
                  </button>
                </td>
              </tr>
            ))}
            {paginatedExpenses.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-3 px-6 text-gray-500">
                  No expenses to show.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center space-x-3">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1">{`Page ${currentPage} of ${totalPages}`}</span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
