"use client";

import React, { useState } from "react";
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
import EmojiPicker from "emoji-picker-react";
import { toast } from "sonner";
import { db } from "@/utils/dbConfig";
import { Budgets } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";

interface CreateBudgetProps {
  refreshData: () => void;
}

const CreateBudget = ({ refreshData }: CreateBudgetProps): JSX.Element => {
  const [emojiIcon, setEmojiIcon] = useState("💡");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [name, setName] = useState<string>("");
  const [amount, setAmount] = useState<string>(""); // Keep amount as string
  const { user } = useUser();

  const onCreateBudget = async () => {
    try {
      if (!name || !amount || Number(amount) <= 0) {
        toast.error("All fields are required, and amount must be greater than zero!");
        return;
      }

      await db.insert(Budgets).values({
        name,
        amount, // Pass amount as string, as expected by Drizzle ORM
        icon: emojiIcon,
        createdBy: user?.primaryEmailAddress?.emailAddress || "",
      });

      toast.success("Budget Created Successfully!");
      refreshData();
    } catch (error) {
      console.error("Error creating budget:", error);
      toast.error("Error creating budget!");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="bg-slate-100 p-4 rounded-md items-center flex flex-col justify-center border-dashed cursor-pointer hover:shadow-md w-full h-48 text-center">
          <h2 className="text-3xl">+</h2>
          <h2>Create New Budget</h2>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Budget</DialogTitle>
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
          <DialogClose asChild>
            <Button
              className="mt-5 w-full bg-blue-600 hover:bg-blue-800 text-white"
              disabled={!name || !amount || Number(amount) <= 0}
              onClick={onCreateBudget}
            >
              Create Budget
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBudget;