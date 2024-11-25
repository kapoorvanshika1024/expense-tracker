"use client";
import React, { useEffect, ReactNode } from "react";
import SideNav from "../_components/SideNav";
import DashBoardHeader from "../_components/DashBoardHeader";
import { useUser } from "@clerk/nextjs";

interface DashboardLayoutProps {
  children: ReactNode; // Type for the `children` prop
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      checkUserBudgets();
    }
  }, [user]);

  const checkUserBudgets = async () => {
    const res = await fetch("/api/budgets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: user?.primaryEmailAddress?.emailAddress }), // Send user email
    });

    const result = await res.json();
    console.log(result);
  };

  return (
    <div>
      <div className="fixed md:w-64 hidden md:block">
        <SideNav />
      </div>
      <div className="md:ml-64">
        <DashBoardHeader />
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
