import React, { useState, useEffect, useRef } from 'react';

interface ChatTextDisplayProps {
  texts: string[];
  delay?: number;
}

const ChatTextDisplay: React.FC<ChatTextDisplayProps> = ({ texts, delay = 1000 }) => {
  const [currentText, setCurrentText] = useState<string[]>([]);
  const endOfChatRef = useRef<HTMLDivElement | null>(null); // Create a ref for the end of the chat

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < texts.length) {
        setCurrentText((prev) => [...prev, texts[index]]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, delay);

    return () => clearInterval(interval);
  }, [texts, delay]);

  // Scroll to the bottom whenever currentText changes
  useEffect(() => {
    if (endOfChatRef.current) {
      endOfChatRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentText]);

  return (
    <div className="flex flex-col space-y-3 w-full p-4 mx-auto">
      {currentText.map((text, i) => (
        <div
          key={i}
          className={`p-3 rounded-xl max-w-xs ${
            i % 2 === 0 ? 'bg-[#C77DFF] text-white self-end' : 'bg-gray-200 text-black self-start'
          }`}
        >
          {text}
        </div>
      ))}
      <div ref={endOfChatRef} /> {/* Empty div to scroll into view */}
    </div>
  );
};

export default ChatTextDisplay;
