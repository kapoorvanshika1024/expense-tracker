"use client";

import React from "react";
import Dashboard from "@/app/(routes)/dashboard/page"; 

function Hero(): JSX.Element {
  return (
    <section className="bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center py-16">
        <h1 className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl">
          Manage Your Expense
          <span className="sm:block">Control Your Money</span>
        </h1>
        <p className="mt-4 max-w-xl text-lg text-gray-300">
          Start creating your budget and save tons of money.
        </p>
        <div className="mt-8">
          <a
            href="dashboard"
            className="inline-block rounded bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
          >
            Get Started
          </a>
        </div>
      </div>

      {/* Dashboard Section */}
      <div id="dashboard" className="bg-black w-full py-16">
        <div className="container mx-auto max-w-7xl px-4">
          <Dashboard />
        </div>
      </div>
    </section>
  );
}

export default Hero;
