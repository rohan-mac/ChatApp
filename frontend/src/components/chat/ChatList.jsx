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
  people,
  peopleLoading,
  peopleQuery,
  onPeopleQueryChange,
  onCreateChat,
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

    <div className={`mt-3 rounded-2xl border p-2.5 backdrop-blur-[20px] ${isDark ? 'border-white/10 bg-[rgba(255,255,255,0.05)]' : 'border-white/70 bg-[rgba(255,255,255,0.55)]'}`}>
      <p className={`mb-2 px-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${isDark ? 'text-slate-300/80' : 'text-slate-600'}`}>
        Start new chat
      </p>
      <div className={`mb-2 flex items-center gap-2 rounded-xl border px-2.5 py-2 ${isDark ? 'border-white/10 bg-[rgba(255,255,255,0.08)]' : 'border-white/70 bg-[rgba(255,255,255,0.72)]'}`}>
        <Search size={14} className={isDark ? 'text-slate-300' : 'text-slate-500'} />
        <input
          value={peopleQuery}
          onChange={(event) => onPeopleQueryChange(event.target.value)}
          placeholder="Find people"
          className="w-full bg-transparent text-xs outline-none placeholder:text-slate-400"
        />
      </div>

      <div className="minimal-scrollbar max-h-40 space-y-1 overflow-y-auto pr-1">
        {peopleLoading ? (
          <div className="flex items-center gap-2 px-2 py-2 text-xs opacity-70">
            <LoaderCircle size={13} className="animate-spin" />
            Loading users...
          </div>
        ) : people.length ? (
          people.map((person) => (
            <button
              key={person._id}
              type="button"
              onClick={() => onCreateChat(person._id)}
              className={`flex w-full items-center justify-between rounded-xl border px-2.5 py-2 text-left text-xs transition ${isDark ? 'border-white/10 bg-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.14)]' : 'border-white/70 bg-[rgba(255,255,255,0.72)] hover:bg-white/90'}`}
            >
              <span className="truncate font-medium">{person.name}</span>
              <span className={`ml-2 shrink-0 ${person.isOnline ? 'text-[#25D366]' : isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {person.isOnline ? 'online' : 'offline'}
              </span>
            </button>
          ))
        ) : (
          <p className="px-2 py-2 text-xs opacity-70">No users found.</p>
        )}
      </div>
    </div>
  </aside>
);

export default memo(ChatList);
