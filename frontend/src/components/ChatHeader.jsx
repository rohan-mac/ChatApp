import { Camera, PencilSquare } from './Icons';

const ChatHeader = () => (
  <div className="px-[12px] pt-[6px] pb-[10px]">
    <div className="status-bar px-0">
      <span>9:41</span>
      <div className="flex items-center gap-[5px] text-[10px]">
        <span>◢◣</span>
        <span>◓</span>
        <span>▂</span>
      </div>
    </div>

    <div className="mt-[8px] flex items-center justify-between">
      <div className="flex items-center gap-[10px]">
        <div className="h-[28px] w-[28px] rounded-full bg-[linear-gradient(135deg,#f5d7c4,#d28e60)]" />
        <h2 className="text-[39px] font-semibold leading-[42px] tracking-[-0.6px]">Chats</h2>
      </div>
      <div className="flex items-center gap-[9px]">
        <button className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#efefef]">
          <Camera />
        </button>
        <button className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#efefef]">
          <PencilSquare />
        </button>
      </div>
    </div>
  </div>
);

export default ChatHeader;
