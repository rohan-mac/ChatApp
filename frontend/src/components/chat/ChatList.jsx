import { memo } from 'react';
import { LoaderCircle, Search } from 'lucide-react';
import ChatItem from './ChatItem';

const ChatList = ({
  chats,
  loading,
  selectedChatId,
  query,
  onQueryChange,
  onOpenChat,
  getChatName,
  getPreview,
  isDark
}) => (
  <aside className="flex h-full flex-col rounded-[28px] border border-white/10 bg-[rgba(10,16,30,0.42)] p-3 shadow-[0_20px_48px_rgba(0,0,0,0.2)] backdrop-blur-[20px] md:p-4 dark:border-white/10 dark:bg-[rgba(10,16,30,0.42)]">
    <div className={`mb-3 flex items-center gap-3 rounded-2xl border px-3 py-2.5 backdrop-blur-[20px] ${isDark ? 'border-white/10 bg-[rgba(255,255,255,0.07)]' : 'border-white/70 bg-[rgba(255,255,255,0.7)]'}`}>
      <Search size={16} className={isDark ? 'text-slate-300' : 'text-slate-500'} />
      <input
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Search or start new chat"
        className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
      />
    </div>

    <div className="minimal-scrollbar flex-1 space-y-2 overflow-y-auto pr-1">
      {loading ? (
        <div className="flex items-center gap-2 rounded-2xl px-3 py-3 text-sm opacity-70">
          <LoaderCircle size={16} className="animate-spin" />
          <span>Loading chats...</span>
        </div>
      ) : (
        chats.map((chat) => (
          <ChatItem
            key={chat._id}
            chat={chat}
            active={selectedChatId === chat._id}
            onOpen={onOpenChat}
            name={getChatName(chat)}
            preview={getPreview(chat)}
            isDark={isDark}
          />
        ))
      )}
    </div>
  </aside>
);

export default memo(ChatList);
