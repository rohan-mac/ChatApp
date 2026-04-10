import ChatItem from './ChatItem';
import { Search } from './Icons';

const chats = [
  { name: 'Martin Randolph', preview: "You: What's man!", time: '9:40 AM', avatar: 'linear-gradient(145deg,#cfb084,#5d6366)' },
  { name: 'Andrew Parker', preview: 'You: Ok, thanks! ·', time: '9:25 AM', avatar: 'linear-gradient(145deg,#9f6e3e,#d5b18d)' },
  { name: 'Karen Castillo', preview: 'You: Ok, See you in To... ·', time: 'Fri', avatar: 'linear-gradient(145deg,#f5d6cb,#afb4bb)' },
  { name: 'Maisy Humphrey', preview: 'Have a good day, Maisy! ·', time: 'Fri', avatar: 'linear-gradient(145deg,#a896a4,#4a5d73)' },
  { name: 'Joshua Lawrence', preview: 'The business plan loo... ·', time: 'Thu', avatar: 'linear-gradient(145deg,#00ccff,#2563eb)' }
];

const ChatList = () => (
  <div className="px-[10px]">
    <div className="flex h-[33px] items-center gap-[8px] rounded-[10px] bg-[#f1f1f1] px-[8px]">
      <Search />
      <span className="text-[22px] text-[#8e8e93]">Search</span>
    </div>

    <div className="mt-[10px] flex items-start gap-[8px] overflow-hidden">
      <div className="w-[52px] text-center">
        <div className="mx-auto flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#efefef] text-[36px]">+</div>
        <p className="mt-[4px] text-[16px] text-[#8e8e93]">Your story</p>
      </div>
      {['Joshua', 'Martin', 'Karen', 'Martha'].map((name, idx) => (
        <div className="w-[52px] text-center" key={name}>
          <div className="mx-auto h-[52px] w-[52px] rounded-full" style={{ background: ['#00ccff', '#7a6c4d', '#f3d6ce', '#f59e0b'][idx] }} />
          <p className="mt-[4px] truncate text-[16px] text-[#8e8e93]">{name}</p>
        </div>
      ))}
    </div>

    <div className="mt-[10px]">
      {chats.map((chat) => <ChatItem key={chat.name} {...chat} />)}
    </div>

    <div className="mt-[4px] flex items-center px-[10px] pb-[8px]">
      <div className="h-[34px] w-[34px] rounded-[8px] bg-black" />
      <div className="ml-[10px] min-w-0 flex-1">
        <p className="text-[29px] font-medium leading-[30px]">Pixsellz <span className="rounded bg-[#e5e7eb] px-1 text-[15px] align-middle text-[#8e8e93]">Ad</span></p>
        <p className="truncate text-[21px] leading-[23px] text-[#8e8e93]">Make design process easier...</p>
        <p className="text-[21px] leading-[23px] text-[#1877f2]">View More</p>
      </div>
      <div className="h-[44px] w-[44px] rounded-[10px] bg-[#7c3aed]" />
    </div>
  </div>
);

export default ChatList;
