import React, { useEffect, useRef } from 'react';

type LLMOptions = 'ChatGPT' | 'Claude' | 'Llama' | 'Gemini' | 'Command R' | 'purple.ai';

interface ChatLogEntry {
  type: 'user' | 'llm' | 'error';
  message: string;
  llm?: LLMOptions;
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
      {chatLog.map((entry, index) => (
        <div
          key={index}
          className={`p-3 rounded-xl max-w-xs ${
            entry.type === 'user'
              ? 'bg-[#C77DFF] text-white self-end'
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
      ))}
      <div ref={endOfChatRef} /> {/* Empty div to scroll into view */}
    </div>
  );
};

export default ChatTextDisplay;
