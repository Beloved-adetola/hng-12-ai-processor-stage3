import { useState } from "react";
import useData from "../hooks/useData";

const InputArea = () => {
  const { addMessage, detectLanguage } = useData();
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    const id = Date.now();
    const detectedLanguage = await detectLanguage(id, input);
    addMessage?.(id, input, detectedLanguage);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); 
      handleSend();
    }
  };
  return (
    <div className="input-area" role="form" aria-label="Text input form">
      <textarea
        id="message-input"
        name="inputText"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter text to translate"
        aria-label="Text to Translate"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      />
      <button onClick={handleSend} disabled={!input} aria-label="Send text for translation">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          style={{ fill: "green" }}
          aria-hidden="true"
          focusable="false"
        >
          <path d="m21.426 11.095-17-8A1 1 0 0 0 3.03 4.242l1.212 4.849L12 12l-7.758 2.909-1.212 4.849a.998.998 0 0 0 1.396 1.147l17-8a1 1 0 0 0 0-1.81z"></path>
        </svg>
      </button>
    </div>
  );
};

export default InputArea;
