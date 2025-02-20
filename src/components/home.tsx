import InputArea from "../components/InputArea";
import ChatArea from "../components/ChatArea";
import Header from "../components/Header";

const Home = () => {
  return (
    <div className="home-container">
      <Header />
      <div>
        <ChatArea />
        <InputArea />
      </div>
    </div>
  );
};

export default Home;
