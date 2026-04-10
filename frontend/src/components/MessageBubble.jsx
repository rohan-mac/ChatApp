const MessageBubble = ({ text, outgoing = false, image = false }) => (
  <div className={`mb-[6px] flex ${outgoing ? 'justify-end' : 'justify-start'}`}>
    <div
      className={`max-w-[185px] rounded-[18px] px-[11px] py-[8px] text-[14px] leading-[17px] ${
        outgoing ? 'bg-[#0a84ff] text-white' : 'bg-[#efefef] text-[#1c1c1e]'
      } ${image ? 'p-[3px]' : ''}`}
    >
      {image ? <div className="h-[64px] w-[136px] rounded-[15px] bg-[linear-gradient(90deg,#6b7280,#f59e0b,#365314)]" /> : text}
    </div>
  </div>
);

export default MessageBubble;
