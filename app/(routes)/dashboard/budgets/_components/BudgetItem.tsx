"use client";

import React from "react";
import { Edit2, Trash } from "lucide-react"; 

interface Budget {
  id: number;
  name: string;
  amount: number;
  icon: string;
  totalSpend?: number;
  totalItems?: number;
  onEdit: () => void;
  onDelete: () => void;
}

const BudgetItem = ({ budget }: { budget: Budget }): JSX.Element => {
  const totalSpend = budget.totalSpend || 0;
  const totalAmount = budget.amount > 0 ? budget.amount : 1;
  const progressPercentage = Math.min((totalSpend / totalAmount) * 100, 100);

  return (
    <div className="p-5 border rounded-lg hover:shadow-md cursor-pointer">
      <div className="flex gap-2 items-center justify-between">
        <div className="flex gap-2 items-center">
          <h2 className="text-2xl p-3 px-4 bg-slate-100 rounded-full">{budget.icon}</h2>
          <div>
            <h2 className="font-bold">{budget.name}</h2>
            <h2 className="text-sm text-gray-500">{budget.totalItems || 0} Items</h2>
          </div>
        </div>
        <h2 className="font-bold text-primary text-lg">${totalAmount.toFixed(2)}</h2>
      </div>
      <div className="mt-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs text-slate-400">${totalSpend.toFixed(2)} Spent</h2>
          <h2 className="text-xs text-slate-400">${(totalAmount - totalSpend).toFixed(2)} Remaining</h2>
        </div>
        <div className="w-full bg-slate-300 h-2 rounded-full">
          <div
            className="bg-blue-500 h-2 rounded-full"
            style={{
              width: `${progressPercentage}%`,
              transition: "width 0.3s ease-in-out",
            }}
          ></div>
        </div>
      </div>
      <div className="mt-3 flex justify-between">
        <button
          className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 flex items-center justify-center"
          onClick={budget.onEdit}
        >
          <Edit2 size={16} />
        </button>
        <button
          className="p-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center justify-center"
          onClick={budget.onDelete}
        >
          <Trash size={16} />
        </button>
      </div>
    </div>
  );
};

export default BudgetItem;
