"use client";
import Navbar from '@/components/Navbar';
import React, { useState } from 'react';
import { FaChevronDown, FaArrowUp } from "react-icons/fa";
import ChatTextDisplay from '../../components/ChatTextDisplay'; // Assuming this is your chat display component

const Landing = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("purple.ai");
  const [inputValue, setInputValue] = useState(""); // Track input value
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleOptionClick = (option: React.SetStateAction<string>) => {
    setSelectedOption(option);
    setDropdownOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = () => {
    if (inputValue.trim()) {
      setIsSubmitted(true); // Set submission state to true
    }
  };

  const texts = [
    "Hello?",
    "Sure, let me assist with that.",
    "Is there anything else you'd like to know?",
    "Hello?",
    "Sure, let me assist with that.",
    "Is there anything else you'd like to know?",
    "Hello?",
    "Sure, let me assist with that.",
    "Is there anything else you'd like to know?",
    "Hello?",
    "Sure, let me assist with that.",
    "Is there anything else you'd like to know?",
    "Hello?",
    "Sure, let me assist with that.",
    "Is there anything else you'd like to know?",
    "Hello?",
    "Sure, let me assist with that.",
    "Is there anything else you'd like to know?",
    "Hello?",
    "Sure, let me assist with that.",
    "Is there anything else you'd like to know?",
    "Hello?",
    "Sure, let me assist with that.",
    "Is there anything else you'd like to know?",
    "Hello?",
    "Sure, let me assist with that.",
    "Is there anything else you'd like to know?",
  ];

  return (
    <div className="min-h-screen w-full flex">
      <Navbar />
      <div className="h-full w-full flex flex-col justify-between gap-3">
        <main className="min-h-screen w-full bg-[#240046] p-4 flex flex-col justify-between">
          <div className="relative">
            <button 
              onClick={toggleDropdown}
              className="text-lg font-bold flex items-center gap-2 p-2 rounded-md hover:bg-[#5A189A] transition-all"
            >
              <p className="questrial">{selectedOption}</p>
              <FaChevronDown className={`text-xs text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full mt-2 w-48 bg-[#10002B] rounded-md shadow-lg z-10">
                <ul className="flex flex-col p-2 questrial">
                  {["ChatGPT", "Claude", "Gemini", "Command R", "purple.ai"].map((option) => (
                    <li
                      key={option}
                      onClick={() => handleOptionClick(option)}
                      className="p-2 hover:bg-[#5A189A] rounded-md cursor-pointer"
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex-grow flex flex-col items-center justify-center">
            {/* Conditionally render the text or chat display */}
            {isSubmitted ? (
              <div className="w-full max-w-screen max-h-[80vh] bg-transparent p-4 rounded-md overflow-y-auto no-scrollbar justify-end flex flex-col-reverse">
                <ChatTextDisplay texts={texts} />
              </div>
            ) : (
              <h1 className="roboto text-4xl font-semibold">How can I help you today?</h1>
            )}
          </div>

          <p className="text-xs text-center p-2 roboto">AI isn't always correct. Please check for mistakes.</p>
          <div className="flex justify-center relative">
            <input
              type="text"
              className="w-full h-12 bg-white rounded-xl border border-gray-500 px-4 text-black"
              placeholder="Message here..."
              value={inputValue}
              onChange={handleInputChange}
            />
            <button 
              className="text-white hover:opacity-80 bg-[#240046] rounded-lg p-3 absolute right-2 top-1"
              onClick={handleSubmit} 
            >
              <FaArrowUp/>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Landing;
