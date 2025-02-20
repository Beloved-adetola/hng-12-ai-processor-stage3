import useData from "../hooks/useData";
import MessageList from "./Message";

const ChatArea = () => {
  const { messages } = useData();

  return (
    <div className="chat-area">
      <MessageList messages={messages} />
    </div>
  );
};

export default ChatArea;
