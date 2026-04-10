import MessageBubble from '../components/MessageBubble';
import MessageInput from '../components/MessageInput';

const Keyboard = () => (
  <div className="keyboard">
    <div className="key-row">{Array.from({ length: 10 }).map((_, i) => <div key={i} className="key" />)}</div>
    <div className="key-row">{Array.from({ length: 9 }).map((_, i) => <div key={i} className="key" />)}</div>
    <div className="key-row">{Array.from({ length: 10 }).map((_, i) => <div key={i} className={`key ${i === 0 || i === 9 ? 'key-dark' : ''}`} />)}</div>
    <div className="grid grid-cols-[1fr_2fr_1fr] gap-[4px] px-[4px] pt-[4px]">
      <div className="key key-dark" />
      <div className="key" />
      <div className="key key-dark" />
    </div>
    <div className="bottom-home"><span /></div>
  </div>
);

const Chat = () => (
  <div className="phone-frame">
    <div className="status-bar"><span>9:41</span><span>◢◣ ◓ ▂</span></div>
    <div className="border-b border-[#f0f0f0] px-[10px] py-[8px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[8px]">
          <span className="text-[#0a84ff] text-[20px]">‹</span>
          <div className="h-[32px] w-[32px] rounded-full bg-[linear-gradient(145deg,#f59e0b,#111827)]" />
          <div>
            <p className="text-[14px] font-semibold">Martha Craig</p>
            <p className="text-[11px] text-[#8e8e93]">Messenger</p>
          </div>
        </div>
        <div className="text-[#0a84ff]">📞 📹</div>
      </div>
    </div>

    <div className="flex-1 px-[10px] pt-[12px]">
      <MessageBubble text="It's morning in Tokyo 😎" outgoing />
      <div className="my-[8px] text-center text-[10px] text-[#c1c1c7]">11:40</div>
      <MessageBubble text="What is the most popular meal in Japan?" />
      <MessageBubble text="Do you like it?" />
      <MessageBubble text="I think top two are:" outgoing />
      <MessageBubble image outgoing />
    </div>

    <MessageInput />
    <Keyboard />
  </div>
);

export default Chat;
