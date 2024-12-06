"use client";

import React from "react";

const AboutUs = (): JSX.Element => {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">About Us</h1>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Left Section - Content */}
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Who We Are</h2>
            <p className="text-gray-600 mb-6">
              Expenso is your personal financial assistant. We help individuals and businesses
              track their expenses, manage budgets, and achieve their financial goals.
              Built with simplicity and efficiency in mind, Expenso empowers users to take control of their finances effortlessly.
            </p>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-6">
              Our mission is to simplify financial management for everyone. We aim to provide
              intuitive tools that help our users stay organized, save money, and build a financially
              secure future. With Expenso, managing money becomes stress-free and enjoyable.
            </p>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Our Values</h2>
            <ul className="list-disc pl-6 text-gray-600">
              <li>Empowering financial literacy for all</li>
              <li>Innovation to simplify complex problems</li>
              <li>Transparency and trust in all we do</li>
              <li>Customer-first approach to solutions</li>
            </ul>
          </div>

          {/* Right Section - Image */}
          <div className="flex-1">
            <img
              src="/expensoo.png"
              alt="About Us"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* Team Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Meet Our Team</h2>
          <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <img
                  src="/vanshikaa.jpg"
                  alt="Vanshika Kapoor"
                  className="rounded-full mx-auto w-32 h-32 mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-700">Vanshika Kapoor</h3>
                <p className="text-gray-500">Founder & Lead Developer</p>
                <p className="text-gray-600 mt-2">
                  Vanshika developed Expenso, shaping its core functionalities and technical backbone.
                  She ensures that the app is not only powerful but also user-friendly and effective in solving financial challenges.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <img
                  src="/paras.jpg"
                  alt="Paras Pandey"
                  className="rounded-full mx-auto w-32 h-32 mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-700">Paras Pandey</h3>
                <p className="text-gray-500">CEO & Product Manager</p>
                <p className="text-gray-600 mt-2">
                  Paras oversees the vision and strategy of Expenso. With his expertise in product management,
                  he ensures that the app meets user needs, driving innovation and growth in the financial management space.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
