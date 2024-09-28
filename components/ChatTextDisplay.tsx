import { useState, useEffect } from 'react';

// Define the type for the component props
interface ChatTextDisplayProps {
  texts: string[]; // Array of texts to display
  delay?: number;  // Optional delay in milliseconds between messages
}

const ChatTextDisplay: React.FC<ChatTextDisplayProps> = ({ texts, delay = 1000 }) => {
  const [currentText, setCurrentText] = useState<string[]>([]); // State for the text to display

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

    return () => clearInterval(interval); // Cleanup on unmount
  }, [texts, delay]);

  return (
    <div className="flex flex-col space-y-3 p-4 max-w-md mx-auto overflow-scroll">
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
    </div>
  );
};

export default ChatTextDisplay;
