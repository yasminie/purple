"use client";
import Navbar from '@/components/Navbar';
import React, { useState } from 'react';
import { FaChevronDown, FaArrowUp } from "react-icons/fa";

const Landing = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("purple.ai");

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleOptionClick = (option: React.SetStateAction<string>) => {
    setSelectedOption(option);
    setDropdownOpen(false); // Close the dropdown after selection
  };

  return (
    <div className="min-h-screen w-full flex">
      <Navbar />
      <div className="h-full w-full flex flex-col justify-between gap-3">
        <main className="min-h-screen w-full bg-black border-2 p-4 flex flex-col justify-between">
          <div className="relative">
            <button 
              onClick={toggleDropdown}
              className="text-lg font-bold flex items-center gap-2 p-2 rounded-md hover:bg-slate-800 transition-all"
            >
              <p>{selectedOption}</p>
              <FaChevronDown className={`text-xs text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full mt-2 w-48 bg-slate-800 rounded-md shadow-lg z-10">
                <ul className="flex flex-col p-2">
                  {["ChatGPT", "Claude", "Gemini", "Command R", "purple.ai"].map((option) => (
                    <li
                      key={option}
                      onClick={() => handleOptionClick(option)}
                      className="p-2 hover:bg-slate-700 rounded-md cursor-pointer"
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex-grow flex flex-col items-center justify-center">
            <p className="text-2xl font-semibold">How can I help you today?</p>
          </div>

          <div className="flex justify-center relative">
            <input
              type="text"
              className="w-full h-12 bg-inherit rounded-xl border border-gray-500 px-4"
              placeholder="Message here..."
            />
            <button className="text-white hover:opacity-80 bg-slate-950 rounded-3x p-3 absolute right-2 top-1">
              <FaArrowUp />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Landing;
