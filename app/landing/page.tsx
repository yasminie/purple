// pages/MainPage.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { FaChevronDown, FaArrowUp } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import ChatTextDisplay from '@/components/ChatTextDisplay';

// Define types
type LLMOptions = 'ChatGPT' | 'Claude' | 'Llama' | 'purple.ai';

interface ChatLogEntry {
  type: 'user' | 'llm' | 'error';
  message: string;
  llm?: LLMOptions;
  modelUsed?: string;
  reasonForModelSelection?: string;
}

interface Message {
  sender: string;
  text: string;
}

interface Conversation {
  conversationId: string;
  participants: string[];
  messages: Message[];
}

const MainPage: React.FC = () => {
  // State variables
  const [isDropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<LLMOptions>('purple.ai');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>('');
  const [chatLog, setChatLog] = useState<ChatLogEntry[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [userFirstName, setUserFirstName] = useState<string>('');
  const router = useRouter();

  // Session validation and fetch conversations
  useEffect(() => {
    const initializePage = async () => {
      try {
        const res = await fetch('/api/auth/validate-session', {
          credentials: 'include',
        });
        if (res.ok) {
          const sessionData = await res.json();
          setUserFirstName(sessionData.firstName);

          // Fetch conversations
          const convRes = await fetch('/api/conversations', {
            credentials: 'include',
          });
          if (convRes.ok) {
            const data = await convRes.json();
            setConversations(data.conversations);

            if (data.conversations.length > 0) {
              // Set the first conversation as active
              setActiveConversationId(data.conversations[0].conversationId);
              loadConversation(data.conversations[0].conversationId);
            } else {
              // If no conversations exist, create a new one
              await handleNewConversation();
            }
          } else if (convRes.status === 401) {
            router.push('/login');
          }
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Failed to initialize page:', error);
        router.push('/login');
      }
    };

    initializePage();
  }, [router]);

  // Load conversation messages into chatLog
  const loadConversation = (conversationId: string) => {
    const conversation = conversations.find(
      (conv) => conv.conversationId === conversationId
    );
    if (conversation) {
      const newChatLog = conversation.messages.map((msg) => ({
        type: msg.sender === userFirstName ? 'user' : 'llm',
        message: msg.text,
        llm: msg.sender !== userFirstName ? (msg.sender as LLMOptions) : undefined,
        modelUsed: undefined,
        reasonForModelSelection: undefined,
      }));
      setChatLog(newChatLog);
    }
  };

  // Handle conversation click
  const handleConversationClick = (conversationId: string) => {
    setActiveConversationId(conversationId);
    loadConversation(conversationId);
  };

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

  // Declare the function as async
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
        credentials: 'include',
        body: JSON.stringify({
          prompt,
          chatLog,
          activeConversationId,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch response from the LLM.');
      }

      const data = await res.json();

      // Extract modelUsed and reasonForModelSelection
      let modelUsed = '';
      let reasonForModelSelection = '';

      if (selectedOption === 'purple.ai') {
        modelUsed = data.selectedLlm || 'Unknown Model';
        reasonForModelSelection = data.reasonForSelection || 'No reason provided.';
      } else {
        modelUsed = selectedOption;
        reasonForModelSelection = `Using ${selectedOption} as selected.`;
      }

      // Update chat log with the user's prompt and LLM response
      setChatLog((prevLog) => [
        ...prevLog,
        { type: 'user', message: prompt },
        {
          type: 'llm',
          llm: selectedOption,
          message: data.response,
          modelUsed: modelUsed,
          reasonForModelSelection: reasonForModelSelection,
        },
      ]);

      // Update conversations state
      setConversations((prevConversations) =>
        prevConversations.map((conv) => {
          if (conv.conversationId === activeConversationId) {
            return {
              ...conv,
              messages: [
                ...conv.messages,
                { sender: userFirstName, text: prompt },
                { sender: selectedOption, text: data.response },
              ],
            };
          }
          return conv;
        })
      );

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

  const handleNewConversation = async () => {
    try {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedOption,
        }),
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        setConversations((prev) => [...prev, data.conversation]);
        setActiveConversationId(data.conversation.conversationId);
        setChatLog([]);
      } else {
        const errorData = await res.json();
        console.error('Error creating new conversation:', errorData.error);
      }
    } catch (error) {
      console.error('Error creating new conversation:', error);
    }
  };

  // Function to get conversation name
  const getConversationName = (conv: Conversation, index: number) => {
    if (conv.messages.length > 0) {
      // Get the first few words of the first message
      const firstMessage = conv.messages[0].text;
      return firstMessage.split(' ').slice(0, 3).join(' ') + '...';
    } else {
      // Assign numerical name if no messages
      return `Conversation ${index + 1}`;
    }
  };

  // Render
  return (
    <div className="min-h-screen w-full flex">
      {/* Combined Sidebar with Navbar styling */}
      <div className="w-64 bg-[#10002B] text-white p-4">
        {/* Navbar content (styling from the nonfunctional sidebar) */}

        {/* Functional Conversations Sidebar */}
        <button
          className="p-2 bg-[#5A189A] rounded-md mb-4 w-full"
          onClick={handleNewConversation}
        >
          New Conversation
        </button>
        <h2 className="text-xl font-bold mb-4">Conversations</h2>
        <ul>
          {conversations.map((conv, index) => (
            <li
              key={conv.conversationId}
              className={`p-2 cursor-pointer ${
                conv.conversationId === activeConversationId ? 'bg-[#5A189A]' : ''
              }`}
              onClick={() => handleConversationClick(conv.conversationId)}
            >
              {getConversationName(conv, index)}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 h-full w-full flex flex-col justify-between gap-3">
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
