import React from "react";
import { UserButton } from "@clerk/nextjs";

function DashBoardHeader(): JSX.Element {
  return (
    <div className="p-5 shadow-sm border-b flex justify-between">
      <div></div>
      <div>
        <UserButton />
      </div>
    </div>
  );
}

export default DashBoardHeader;
