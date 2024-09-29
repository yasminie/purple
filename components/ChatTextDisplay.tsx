import React, { useEffect, useRef } from 'react';

type LLMOptions = 'ChatGPT' | 'Claude' | 'Llama' | 'purple.ai';

interface ChatLogEntry {
  type: 'user' | 'llm' | 'error';
  message: string;
  llm?: LLMOptions;
  reasoning?: string; // Added reasoning field
}

interface ChatTextDisplayProps {
  chatLog: ChatLogEntry[];
}

const ChatTextDisplay: React.FC<ChatTextDisplayProps> = ({ chatLog }) => {
  const endOfChatRef = useRef<HTMLDivElement | null>(null);

  // Scroll to the bottom whenever chatLog changes
  useEffect(() => {
    if (endOfChatRef.current) {
      endOfChatRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatLog]);

  return (
    <div className="flex flex-col space-y-3 w-full p-4 mx-auto">
      {chatLog.map((entry, index) => {
        if (entry.type === 'llm' && entry.llm === 'purple.ai') {
          // For purple.ai messages
          return (
            <div
              key={index}
              className="p-3 rounded-xl max-w-xs bg-gray-200 text-black self-start relative"
            >
              {/* Tooltip Container */}
              <span
                className="text-sm font-semibold text-purple-500 cursor-pointer group relative"
                tabIndex={0} // Make focusable for accessibility
                aria-describedby={`tooltip-${index}`}
              >
                purple.ai
                {entry.reasoning && (
                  <span
                    id={`tooltip-${index}`}
                    className="absolute top-0 left-full ml-2 w-[300px] bg-purple-950 text-white p-2 rounded-lg border-2 border-transparent group-hover:border-purple-500 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200 z-10"
                    style={{
                      borderImage: 'linear-gradient(90deg, #8B5CF6, #D53F8C) 1', // Slightly adjusted gradient colors for a more vibrant look
                    }}
                  >
                    {entry.reasoning}
                  </span>
                )}
              </span>




              <p className="mt-2">{entry.message}</p>
            </div>
          );
        } else {
          // For other entries
          return (
            <div
              key={index}
              className={`p-3 rounded-xl max-w-xs ${
                entry.type === 'user'
                  ? 'bg-[#581fad] text-white self-end'
                  : entry.type === 'llm'
                  ? 'bg-gray-200 text-black self-start'
                  : 'bg-red-200 text-black self-start'
              }`}
            >
              {entry.type === 'llm' && entry.llm && (
                <p className="text-sm font-semibold">{entry.llm}</p>
              )}
              <p>{entry.message}</p>
            </div>
          );
        }
      })}
      <div ref={endOfChatRef} /> {/* Empty div to scroll into view */}
    </div>
  );
};

export default ChatTextDisplay;
