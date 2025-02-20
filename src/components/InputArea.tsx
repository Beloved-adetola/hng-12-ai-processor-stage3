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
  return (
      <div className="input-area">
        <textarea
          name="inputText"
          value={input}
          onChange={(e) => setInput?.(e.target.value)}
          className=""
          placeholder="Enter text to translate"
        />
        <button onClick={() => handleSend()} className="" disabled={!input}>
          <img src="/image.png" alt="" className="" />
        </button>
      </div>
  );
};

export default InputArea;
