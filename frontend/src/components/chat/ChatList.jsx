import { memo } from 'react';
import { Camera, ChevronDown, LoaderCircle, Plus, Search } from 'lucide-react';
import ChatItem from './ChatItem';
import UserList from '../UserList';

const ChatList = ({
  chats,
  loading,
  selectedChatId,
  query,
  onQueryChange,
  onOpenChat,
  getChatName,
  getPreview,
  isDark,
  theme,
  people,
  showPeople,
  onSelectUser,
  filter,
  onFilterChange,
  unreadCount,
  onAddChat
}) => {
  const isOcean = theme === 'ocean';
  const isRose = theme === 'rose';
  const accentBorder = isOcean ? 'border-cyan-400 text-cyan-200' : isRose ? 'border-fuchsia-400 text-fuchsia-200' : 'border-sky-400 text-sky-200';
  const accentBackground = isOcean ? 'bg-cyan-500/15 text-cyan-100' : isRose ? 'bg-fuchsia-500/15 text-fuchsia-100' : 'bg-sky-500/15 text-sky-100';
  const plusButtonClasses = isDark
    ? 'inline-flex h-11 w-11 items-center justify-center rounded-3xl border border-white/10 bg-white/10 text-white hover:bg-white/15 transition'
    : `inline-flex h-11 w-11 items-center justify-center rounded-3xl border border-white/70 bg-white/75 text-slate-900 hover:bg-white transition ${
        isOcean ? 'shadow-[0_0_0_1px_rgba(56,189,248,0.35)]' : isRose ? 'shadow-[0_0_0_1px_rgba(232,121,249,0.35)]' : ''
      }`;

  return (
  <aside className="flex h-full flex-col rounded-[20px] border border-slate-200/30 bg-slate-100/85 p-3 shadow-[0_12px_28px_rgba(15,23,42,0.08)] md:p-4 dark:border-white/10 dark:bg-slate-950/90">
    <div className="mb-4 rounded-[20px] border border-slate-200/70 bg-white/95 px-4 py-4 shadow-sm dark:border-white/10 dark:bg-slate-900/95">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Chats</p>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Messages</h2>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200">
            <Camera size={18} />
          </button>
          <button
            type="button"
            onClick={onAddChat}
            className={plusButtonClasses}
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3 overflow-x-auto pb-1">
        <button type="button" className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200">
          +
        </button>
        {chats.slice(0, 5).map((chat) => (
          <div key={chat._id} className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-200 text-sm shadow-sm dark:border-white/10 dark:bg-slate-800">
            <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-700 dark:text-white">
              {getChatName(chat).charAt(0).toUpperCase()}
            </span>
            {chat.counterpart?.isOnline ? <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" /> : null}
          </div>
        ))}
      </div>
    </div>

    <div className="mb-3 flex flex-wrap gap-2">
      {['All', 'Unread', 'Favourites'].map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onFilterChange(item)}
          className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
            filter === item
              ? `${accentBorder} ${accentBackground}`
              : 'border border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10'
          }`}
        >
          {item === 'Unread' ? `${item} ${unreadCount}` : item}
        </button>
      ))}
      <button
        type="button"
        className="ml-auto inline-flex h-11 items-center gap-2 rounded-3xl border border-white/10 bg-white/5 px-3 text-xs text-slate-300 transition hover:border-white/20 hover:bg-white/10"
      >
        Sort
        <ChevronDown size={14} />
      </button>
    </div>

    <div className={`mb-3 flex items-center gap-3 rounded-full border px-4 py-3 ${isDark ? 'border-white/10 bg-slate-950/70' : 'border-slate-200 bg-white/95'}`}>
      <Search size={18} className={isDark ? 'text-slate-300' : 'text-slate-500'} />
      <input
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Search"
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
        <>
          {showPeople && people?.length > 0 && (
            <UserList
              users={people}
              onSelect={onSelectUser}
              selectedId={null}
              theme={isDark ? 'dark' : 'light'}
              palette={{
                selected: isDark ? 'bg-blue-600' : 'bg-blue-500',
                idle: isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:bg-gray-50',
                accent: isDark ? 'from-blue-500 to-purple-600' : 'from-blue-400 to-purple-500'
              }}
            />
          )}

          {chats.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-6 text-center text-sm text-slate-300">
              {filter === 'Favourites'
                ? 'No favourite conversations yet.'
                : 'No chats found. Start a conversation with the plus button above.'}
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
                theme={theme}
              />
            ))
          )}
        </>
      )}
    </div>
  </aside>
);
};

export default memo(ChatList);
