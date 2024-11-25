"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";

function Header(): JSX.Element {
  const { user, isSignedIn } = useUser();

  return (
    <div className="p-5 flex justify-between items-center border-b bg-white shadow-sm">
      {/* Logo */}
      <Image src={"/logo.svg"} alt="logo" width={90} height={50} />

      {/* Button */}
      {isSignedIn ? (
        <UserButton />
      ) : (
        <Link href={"/sign-in"}>
          <Button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-800">
            SignUp
          </Button>
        </Link>
      )}
    </div>
  );
}

export default Header;
