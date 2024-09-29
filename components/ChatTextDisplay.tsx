import React, { useEffect, useRef } from 'react';

type LLMOptions = 'ChatGPT' | 'Claude' | 'Llama' | 'purple.ai';

interface ChatLogEntry {
  type: 'user' | 'llm' | 'error';
  message: string;
  llm?: LLMOptions;
  modelUsed?: string;
  reasonForModelSelection?: string;
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
        if (entry.type === 'llm') {
          // For LLM messages
          return (
            <div
              key={index}
              className={`p-3 rounded-xl max-w-xs ${
                entry.llm === 'purple.ai'
                  ? 'bg-gray-200 text-black self-start relative'
                  : 'bg-gray-200 text-black self-start'
              }`}
            >
              {/* Sender Name with Tooltip for 'purple.ai' */}
              <div className="text-sm font-semibold">
                {entry.llm === 'purple.ai' ? (
                  <span
                    className="text-purple-500 cursor-pointer group relative"
                    tabIndex={0}
                    aria-describedby={`tooltip-${index}`}
                  >
                    {entry.llm}
                    {entry.modelUsed && entry.reasonForModelSelection && (
                      <span
                        id={`tooltip-${index}`}
                        className="absolute top-0 left-full ml-2 w-[300px] bg-purple-950 text-white p-2 rounded-lg border-2 border-transparent group-hover:border-purple-500 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200 z-10"
                        style={{
                          borderImage: 'linear-gradient(90deg, #8B5CF6, #D53F8C) 1',
                        }}
                      >
                        Model used: {entry.modelUsed}
                        <br />
                        Reason: {entry.reasonForModelSelection}
                      </span>
                    )}
                  </span>
                ) : (
                  // Sender Name for other LLMs
                  <span>{entry.llm}</span>
                )}
              </div>

              {/* Message Content */}
              <p className="mt-2" style={{ whiteSpace: 'pre-wrap' }}>
                {entry.message}
              </p>
            </div>
          );
        } else if (entry.type === 'user') {
          // For User messages
          return (
            <div
              key={index}
              className="p-3 rounded-xl max-w-xs bg-[#581fad] text-white self-end"
            >
              <p style={{ whiteSpace: 'pre-wrap' }}>{entry.message}</p>
            </div>
          );
        } else {
          // For Error messages
          return (
            <div
              key={index}
              className="p-3 rounded-xl max-w-xs bg-red-200 text-black self-start"
            >
              <p style={{ whiteSpace: 'pre-wrap' }}>{entry.message}</p>
            </div>
          );
        }
      })}
      <div ref={endOfChatRef} /> {/* Empty div to scroll into view */}
    </div>
  );
};

export default ChatTextDisplay;

