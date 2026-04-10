import ChatHeader from '../components/ChatHeader';
import ChatList from '../components/ChatList';

const Home = () => (
  <div className="phone-frame">
    <ChatHeader />
    <ChatList />
    <div className="mt-auto border-t border-[#f0f0f0] bg-[#f9f9f9] px-[44px] py-[8px]">
      <div className="flex items-end justify-between text-[#111827]">
        <span className="text-[24px]">💬</span>
        <span className="text-[24px] text-[#9ca3af]">👥</span>
        <span className="text-[24px] text-[#9ca3af]">◍</span>
      </div>
    </div>
    <div className="bottom-home"><span /></div>
  </div>
);

export default Home;
