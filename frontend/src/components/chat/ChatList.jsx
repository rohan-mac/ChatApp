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
    <aside className="flex h-full flex-col overflow-hidden border border-slate-200/70 bg-white shadow-lg rounded-none">
      <div className="sticky top-0 z-10 border-b border-slate-200/70 bg-white px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Chats</p>
            <h2 className="text-2xl font-semibold text-slate-900">Messenger</h2>
          </div>
          <button
            type="button"
            onClick={onAddChat}
            className="inline-flex h-12 w-12 items-center justify-center rounded-none bg-[#0084ff] text-white shadow-lg transition hover:bg-[#006ce5]"
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-none border border-slate-200 bg-slate-100 px-4 py-3">
          <Search size={18} className="text-slate-500" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search Messenger"
            className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-white px-2 pb-4 pt-3">
        {loading ? (
          <div className="flex items-center gap-2 bg-slate-100 px-4 py-4 text-sm text-slate-500">
            <LoaderCircle size={16} className="animate-spin" />
            Loading chats...
          </div>
        ) : showPeople ? (
          people?.length > 0 ? (
            <UserList
              users={people}
              onSelect={onSelectUser}
              selectedId={null}
              theme={isDark ? 'dark' : 'light'}
              palette={{
                selected: 'bg-[#0084ff] text-white',
                idle: 'bg-white hover:bg-slate-100',
                accent: 'from-[#0084ff] to-[#006ce5]',
                secondaryText: 'text-slate-500'
              }}
            />
          ) : (
            <div className="border border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
              No users found.
            </div>
          )
        ) : chats.length === 0 ? (
          <div className="border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
            No chats found.
          </div>
        ) : (
          <div className="space-y-2">
            {chats.map((chat) => (
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
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default memo(ChatList);
