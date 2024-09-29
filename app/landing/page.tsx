'use client';

import Navbar from '@/components/Navbar';
import React, { useEffect, useState } from 'react';
import { FaChevronDown, FaArrowUp } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import ChatTextDisplay from '@/components/ChatTextDisplay';

// Define types
type LLMOptions = 'ChatGPT' | 'Claude' | 'Llama' | 'purple.ai';

type ChatLogEntry = {
  type: 'user' | 'llm' | 'error';
  message: string;
  llm?: LLMOptions;
  reasoning?: string; // Added reasoning field
};

const MainPage: React.FC = () => {
  // State variables
  const [isDropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<LLMOptions>('purple.ai');
  const [loading, setLoading] = useState<boolean>(true);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>('');
  const [chatLog, setChatLog] = useState<ChatLogEntry[]>([]);
  const router = useRouter();

  // Session validation
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/validate-session');
        if (res.ok) {
          setLoading(false);
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Failed to validate session:', error);
        router.push('/login');
      }
    };

    checkSession();

    // Load chat log from session storage if available
    const savedChatLog = sessionStorage.getItem('chatLog');
    if (savedChatLog) {
      setChatLog(JSON.parse(savedChatLog));
    }
  }, [router]);

  useEffect(() => {
    // Save chat log to session storage whenever it updates
    sessionStorage.setItem('chatLog', JSON.stringify(chatLog));
  }, [chatLog]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Handlers
  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleOptionClick = (option: LLMOptions) => {
    setSelectedOption(option);
    setDropdownOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  // Inside your MainPage component

const handleSendPrompt = async () => {
  if (!prompt.trim()) return;

  let apiEndpoint = '';

  // Determine API endpoint based on selected LLM
  switch (selectedOption) {
    case 'ChatGPT':
      apiEndpoint = '/api/chatgpt';
      break;
    case 'Claude':
      apiEndpoint = '/api/claude';
      break;
    case 'Llama':
      apiEndpoint = '/api/llama';
      break;
    case 'purple.ai':
      apiEndpoint = '/api/purple';
      break;
    default:
      setChatLog((prevLog) => [
        ...prevLog,
        { type: 'error', message: 'Please select a valid LLM.' },
      ]);
      return;
  }

  try {
    setIsSending(true);

    const res = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, chatLog }), // Send the chat log
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to fetch response from the LLM.');
    }

    const data = await res.json();
    console.log('API Response:', data); // For debugging

    // Update chat log with the user's prompt
    setChatLog((prevLog) => [
      ...prevLog,
      { type: 'user', message: prompt },
    ]);

    if (selectedOption === 'purple.ai') {
      // For purple.ai, use the separate fields
      const { selectedLlm, reasonForSelection, response } = data;

      setChatLog((prevLog) => [
        ...prevLog,
        {
          type: 'llm',
          llm: selectedOption,
          message: response,
          reasoning: `Purple chose ${selectedLlm}. ${reasonForSelection}`,
        },
      ]);
    } else {
      // For other LLMs
      const { response } = data;
      setChatLog((prevLog) => [
        ...prevLog,
        { type: 'llm', llm: selectedOption, message: response },
      ]);
    }

    setPrompt('');
  } catch (error: any) {
    console.error('Error making API call:', error);
    setChatLog((prevLog) => [
      ...prevLog,
      { type: 'error', message: error.message || 'An error occurred.' },
    ]);
  } finally {
    setIsSending(false);
  }
};

  
  

  // Render
  return (
    <div className="min-h-screen w-full flex">
      <Navbar />
      <div className="h-full w-full flex flex-col justify-between gap-3">
        <main className="min-h-screen w-full bg-[#240046] p-4 flex flex-col justify-between">
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="text-lg font-bold flex items-center gap-2 p-2 rounded-md hover:bg-[#5A189A] transition-all"
              aria-haspopup="true"
              aria-expanded={isDropdownOpen}
            >
              <p className="questrial text-white">{selectedOption}</p>
              <FaChevronDown
                className={`text-xs text-gray-500 transition-transform ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isDropdownOpen && (
              <div
                className="absolute top-full mt-2 w-48 bg-[#10002B] rounded-md shadow-lg z-10"
                role="menu"
              >
                <ul className="flex flex-col p-2 questrial">
                  {['ChatGPT', 'Claude', 'Llama', 'purple.ai'].map((option) => (
                    <li
                      key={option}
                      onClick={() => handleOptionClick(option as LLMOptions)}
                      className="p-2 hover:bg-[#5A189A] rounded-md cursor-pointer text-white"
                      role="menuitem"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleOptionClick(option as LLMOptions);
                      }}
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Chat Log Display */}
          <div className="flex-grow flex flex-col items-center justify-center">
            {chatLog.length === 0 ? (
              <h1 className="roboto text-4xl font-semibold text-white">
                How can I help you today?
              </h1>
            ) : (
              <div className="w-full max-w-screen max-h-[80vh] bg-transparent p-4 rounded-md overflow-y-auto no-scrollbar flex flex-col">
                <ChatTextDisplay chatLog={chatLog} />
              </div>
            )}
          </div>

          <p className="text-xs text-center p-2 roboto text-white">
            AI isn't always correct. Please check for mistakes.
          </p>

          <div className="flex justify-center relative">
            <input
              type="text"
              className="w-full h-12 bg-white rounded-xl border border-gray-500 px-4 text-black"
              placeholder="Message here..."
              value={prompt}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSendPrompt();
                }
              }}
              aria-label="Prompt input"
            />
            <button
              onClick={handleSendPrompt}
              disabled={isSending}
              className="text-white hover:opacity-80 bg-[#240046] rounded-lg p-3 absolute right-2 top-1"
              aria-label="Send message"
            >
              <FaArrowUp className={isSending ? 'text-gray-400' : 'text-white'} />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainPage;
