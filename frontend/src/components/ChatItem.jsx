const ChatItem = ({ name, preview, time, avatar = '#d8d8d8', active = false }) => (
  <div className="flex items-center px-[10px] py-[8px]">
    <div className="h-[52px] w-[52px] rounded-full" style={{ background: avatar }} />
    <div className="ml-[10px] min-w-0 flex-1">
      <div className="flex items-center justify-between">
        <p className="truncate pr-2 text-[30px] font-medium leading-[32px] tracking-[-0.3px]">{name}</p>
        <span className="text-[19px] text-[#8e8e93]">{time}</span>
      </div>
      <p className="truncate text-[22px] leading-[24px] text-[#8e8e93]">{preview}</p>
    </div>
    <div className={`ml-[8px] h-[12px] w-[12px] rounded-full border ${active ? 'border-transparent bg-[#22c55e]' : 'border-[#bcc0c6]'}`} />
  </div>
);

export default ChatItem;
