"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EmojiPicker from "emoji-picker-react";
import { toast } from "sonner";
import { db } from "@/utils/dbConfig";
import { Budgets } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";

interface CreateBudgetProps {
  refreshData: () => void;
  editingBudget?: any;
  onCloseEdit: () => void;
  open: boolean; // Add open prop to control dialog visibility
}

const CreateBudget = ({ refreshData, editingBudget, onCloseEdit, open }: CreateBudgetProps): JSX.Element => {
  const [emojiIcon, setEmojiIcon] = useState("💡");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [name, setName] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const { user } = useUser();

  useEffect(() => {
    if (editingBudget) {
      setName(editingBudget.name);
      setAmount(editingBudget.amount.toString());
      setEmojiIcon(editingBudget.icon);
    } else {
      setName(""); // Reset fields for new budget
      setAmount("");
      setEmojiIcon("💡");
    }
  }, [editingBudget]);

  const handleSaveBudget = async () => {
    try {
      if (!name || !amount || Number(amount) <= 0) {
        toast.error("All fields are required, and amount must be greater than zero!");
        return;
      }

      if (editingBudget) {
        // Update the budget if editing
        await db
          .update(Budgets)
          .set({
            name,
            amount: amount.toString(), // Convert amount to string
            icon: emojiIcon,
          })
          .where(eq(Budgets.id, editingBudget.id));
        toast.success("Budget updated successfully!");
      } else {
        // Create a new budget
        await db.insert(Budgets).values({
          name,
          amount: amount.toString(), // Convert amount to string
          icon: emojiIcon,
          createdBy: user?.primaryEmailAddress?.emailAddress || "",
        });
        toast.success("Budget created successfully!");
      }

      refreshData();
      onCloseEdit(); // Close dialog after saving
    } catch (error) {
      console.error("Error saving budget:", error);
      toast.error("Error saving budget!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onCloseEdit}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingBudget ? "Edit Budget" : "Create New Budget"}</DialogTitle>
        </DialogHeader>
        <div className="mt-5">
          <Button
            variant="outline"
            className="text-lg"
            onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
          >
            {emojiIcon}
          </Button>
          {openEmojiPicker && (
            <div className="absolute z-20">
              <EmojiPicker
                onEmojiClick={(e) => {
                  setEmojiIcon(e.emoji);
                  setOpenEmojiPicker(false);
                }}
              />
            </div>
          )}
          <div className="mt-2">
            <h2 className="text-black font-medium my-1">Budget Name</h2>
            <Input
              placeholder="e.g. Home Decor"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mt-2">
            <h2 className="text-black font-medium my-1">Budget Amount</h2>
            <Input
              type="number"
              placeholder="e.g. 1000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            className="mt-5 w-full bg-blue-600 hover:bg-blue-800 text-white"
            onClick={handleSaveBudget}
          >
            {editingBudget ? "Update Budget" : "Create Budget"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBudget;
