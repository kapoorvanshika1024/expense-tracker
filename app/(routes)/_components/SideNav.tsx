"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { LayoutGrid, ReceiptText, PiggyBank, Users } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface MenuItem {
  id: number;
  name: string;
  icon: React.ComponentType;
  path: string;
}

function SideNav(): JSX.Element {
  const menuList: MenuItem[] = [
    { id: 1, name: "Dashboard", icon: LayoutGrid, path: "/dashboard" },
    { id: 2, name: "Budgets", icon: PiggyBank, path: "/dashboard/budgets" },
    { id: 3, name: "Expenses", icon: ReceiptText, path: "/dashboard/expenses" },
    { id: 4, name: "About Us", icon: Users, path: "/dashboard/aboutus" },
  ];

  const path = usePathname();

  useEffect(() => {
    console.log(path);
  }, [path]);

  return (
    <div className="h-screen p-5 border shadow-sm flex flex-col">
      <Image src={"/logo.svg"} alt="logo" width={90} height={50} />
      <div className="mt-5">
        {menuList.map((menu) => (
          <Link href={menu.path} key={menu.id}>
            <h2
              className={`flex gap-2 items-center text-gray-500 font-medium mb-2 p-5 cursor-pointer rounded-md 
                hover:text-primary hover:bg-blue-100 
                ${path === menu.path ? "text-primary bg-blue-100" : ""}`}
            >
              <menu.icon />
              {menu.name}
            </h2>
          </Link>
        ))}
      </div>
      <div className="fixed bottom-10 p-5 flex gap-2 items-center">
        <UserButton />
        <span>Profile</span>
      </div>
    </div>
  );
}

export default SideNav;
