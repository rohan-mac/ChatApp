import { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import { LoaderCircle, MessageSquarePlus, MoreVertical, Search, Settings, UserCircle2 } from 'lucide-react';
import ChatItem from './ChatItem';
import UserList from '../UserList';

const ChatList = ({ chats, loading, selectedChatId, query, onQueryChange, onOpenChat, getChatName, getPreview, isDark, people, showPeople, onSelectUser, unreadCount, onAddChat }) => {
  const [showQuickMenu, setShowQuickMenu] = useState(false);

  return (
    <aside className="flex h-full min-h-0 flex-col overflow-hidden border-r border-[var(--wa-border)] bg-[var(--wa-sidebar)] text-[var(--wa-text)] lg:rounded-l-sm">
      <div className="sticky top-0 z-10 bg-[var(--wa-sidebar)]">
        <div className="flex h-[60px] items-center justify-between border-b border-[var(--wa-border)] px-4">
          <div>
            <h1 className="text-[20px] font-bold leading-tight">Chats</h1>
            {unreadCount > 0 ? <p className="text-[12px] text-[var(--wa-muted)]">{unreadCount} unread conversation{unreadCount === 1 ? '' : 's'}</p> : null}
          </div>
          <div className="flex items-center gap-1">
            <button type="button" onClick={onAddChat} className="grid h-10 w-10 place-items-center rounded-full text-[var(--wa-muted)] hover:bg-[var(--wa-hover)] focus-visible:bg-[var(--wa-hover)]" aria-label="Start a new chat">
              <MessageSquarePlus size={21} />
            </button>
            <div className="relative">
              <button type="button" onClick={() => setShowQuickMenu((value) => !value)} className="grid h-10 w-10 place-items-center rounded-full text-[var(--wa-muted)] hover:bg-[var(--wa-hover)]" aria-label="Open menu">
                <MoreVertical size={21} />
              </button>
              {showQuickMenu ? (
                <div className="absolute right-0 top-11 z-20 w-44 rounded-md border border-[var(--wa-border)] bg-[var(--wa-card)] py-2 shadow-xl">
                  {[{ to: '/profile', label: 'Profile', icon: UserCircle2 }, { to: '/settings', label: 'Settings', icon: Settings }].map(({ to, label, icon: Icon }) => (
                    <Link key={to} to={to} onClick={() => setShowQuickMenu(false)} className="flex items-center gap-3 px-4 py-2.5 text-[14px] hover:bg-[var(--wa-hover)]"><Icon size={16} />{label}</Link>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="border-b border-[var(--wa-border)] px-3 py-2">
          <label className="flex h-9 items-center gap-3 rounded-lg bg-[var(--wa-search)] px-4 text-[var(--wa-muted)]">
            <Search size={17} />
            <input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search or start a new chat" className="w-full bg-transparent text-[14px] text-[var(--wa-text)] outline-none placeholder:text-[var(--wa-muted)]" aria-label="Search chats and users" />
          </label>
        </div>
      </div>

      <div className="minimal-scrollbar flex-1 overflow-y-auto">
        {loading ? (
          <div className="m-4 flex items-center gap-3 rounded-lg bg-[var(--wa-search)] px-4 py-3 text-[13px] text-[var(--wa-muted)]"><LoaderCircle size={17} className="animate-spin" />Loading chats...</div>
        ) : showPeople ? (
          people?.length ? <UserList users={people} onSelect={onSelectUser} selectedId={null} theme={isDark ? 'dark' : 'light'} /> : <p className="p-6 text-center text-[14px] text-[var(--wa-muted)]">No users found</p>
        ) : chats.length ? (
          chats.map((chat) => <ChatItem key={chat._id} chat={chat} active={selectedChatId === chat._id} onOpen={onOpenChat} name={getChatName(chat)} preview={getPreview(chat)} />)
        ) : (
          <p className="p-6 text-center text-[14px] text-[var(--wa-muted)]">No chats found. Start a new conversation.</p>
        )}
      </div>
    </aside>
  );
};

export default memo(ChatList);
