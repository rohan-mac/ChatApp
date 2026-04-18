// import { memo } from 'react';
// import { Camera, ChevronDown, LoaderCircle, Plus, Search } from 'lucide-react';
// import ChatItem from './ChatItem';
// import UserList from '../UserList';

// const ChatList = ({
//   chats,
//   loading,
//   selectedChatId,
//   query,
//   onQueryChange,
//   onOpenChat,
//   getChatName,
//   getPreview,
//   isDark,
//   theme,
//   people,
//   showPeople,
//   onSelectUser,
//   filter,
//   onFilterChange,
//   unreadCount,
//   onAddChat
// }) => {
//   const isOcean = theme === 'ocean';
//   const isRose = theme === 'rose';
//   const accentBorder = isOcean ? 'border-cyan-400 text-cyan-200' : isRose ? 'border-fuchsia-400 text-fuchsia-200' : 'border-sky-400 text-sky-200';
//   const accentBackground = isOcean ? 'bg-cyan-500/15 text-cyan-100' : isRose ? 'bg-fuchsia-500/15 text-fuchsia-100' : 'bg-sky-500/15 text-sky-100';
//   const plusButtonClasses = isDark
//     ? 'inline-flex h-11 w-11 items-center justify-center rounded-3xl border border-white/10 bg-white/10 text-white hover:bg-white/15 transition'
//     : `inline-flex h-11 w-11 items-center justify-center rounded-3xl border border-white/70 bg-white/75 text-slate-900 hover:bg-white transition ${
//         isOcean ? 'shadow-[0_0_0_1px_rgba(56,189,248,0.35)]' : isRose ? 'shadow-[0_0_0_1px_rgba(232,121,249,0.35)]' : ''
//       }`;

//   return (
//     <aside className="flex h-full flex-col overflow-hidden border border-slate-200/50 bg-gradient-to-br from-white via-slate-50 to-white shadow-xl rounded-3xl">
//       <div className="sticky top-0 z-10 border-b border-slate-200/50 bg-gradient-to-r from-white via-slate-50 to-white px-6 py-5 rounded-t-3xl">
//         <div className="flex items-center justify-between gap-4">
//           <div>
//             <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Chats</p>
//             <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Messenger</h2>
//           </div>
//           <button
//             type="button"
//             onClick={onAddChat}
//             className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
//           >
//             <Plus size={24} />
//           </button>
//         </div>

//         <div className="mt-5 flex items-center gap-3 rounded-2xl border border-slate-200/60 bg-slate-100/80 px-4 py-3 shadow-sm backdrop-blur-sm">
//           <Search size={20} className="text-slate-500" />
//           <input
//             value={query}
//             onChange={(event) => onQueryChange(event.target.value)}
//             placeholder="Search Messenger"
//             className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-500 font-medium"
//           />
//         </div>
//       </div>

//       <div className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-50/30 via-white to-slate-100/30 px-4 pb-6 pt-4">
//         {loading ? (
//           <div className="flex items-center gap-3 bg-slate-100/80 px-4 py-4 rounded-2xl border border-slate-200/50 shadow-sm">
//             <LoaderCircle size={18} className="animate-spin text-blue-600" />
//             <p className="text-sm font-medium text-slate-600">Loading chats...</p>
//           </div>
//         ) : showPeople ? (
//           people?.length > 0 ? (
//             <UserList
//               users={people}
//               onSelect={onSelectUser}
//               selectedId={null}
//               theme={isDark ? 'dark' : 'light'}
//               palette={{
//                 selected: 'bg-gradient-to-br from-blue-500 to-purple-600 text-white',
//                 idle: 'bg-white hover:bg-slate-100/80 rounded-2xl border border-slate-200/50 shadow-sm',
//                 accent: 'from-blue-500 to-purple-600',
//                 secondaryText: 'text-slate-500'
//               }}
//             />
//           ) : (
//             <div className="border border-dashed border-slate-200/60 bg-slate-50/80 px-6 py-8 text-center rounded-2xl shadow-sm">
//               <p className="text-base font-semibold text-slate-600">No users found</p>
//               <p className="text-sm text-slate-500 mt-1">Try a different search term</p>
//             </div>
//           )
//         ) : chats.length === 0 ? (
//           <div className="border border-dashed border-slate-200/60 bg-slate-50/80 px-6 py-8 text-center rounded-2xl shadow-sm">
//             <p className="text-base font-semibold text-slate-600">No chats found</p>
//             <p className="text-sm text-slate-500 mt-1">Start a new conversation</p>
//           </div>
//         ) : (
//           <div className="space-y-3">
//             {chats.map((chat) => (
//               <ChatItem
//                 key={chat._id}
//                 chat={chat}
//                 active={selectedChatId === chat._id}
//                 onOpen={onOpenChat}
//                 name={getChatName(chat)}
//                 preview={getPreview(chat)}
//                 isDark={isDark}
//                 theme={theme}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     </aside>
//   );
// };

// export default memo(ChatList);




import { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import { LoaderCircle, MoreVertical, Plus, Search, Settings, UserCircle2 } from 'lucide-react';
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
  const [showQuickMenu, setShowQuickMenu] = useState(false);

  const quickActions = [
    { to: '/profile', label: 'Profile', icon: UserCircle2 },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="flex h-full min-h-0 flex-col overflow-hidden rounded-none sm:rounded-2xl sm:sm:rounded-3xl border border-[var(--border)] bg-[var(--bg-surface)] shadow-xl">
      
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-slate-200/50 bg-gradient-to-r from-white via-slate-50 to-white px-4 sm:px-6 py-4 sm:py-5 rounded-t-2xl sm:rounded-t-3xl">
        
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          <div>
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-500">
              Chats
            </p>
            <h2 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Messenger
            </h2>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowQuickMenu((current) => !current)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white/90 text-slate-700 shadow-sm transition-all duration-200 hover:bg-slate-100"
              aria-label="Open chat actions"
            >
              <MoreVertical size={18} />
            </button>

            {showQuickMenu && (
              <div className="absolute right-0 top-12 z-20 flex min-w-[170px] flex-col gap-1 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                {quickActions.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setShowQuickMenu(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
                    >
                      <Icon size={16} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="mt-4 sm:mt-5 flex items-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl border border-slate-200/60 bg-slate-100/80 px-3 sm:px-4 py-2.5 sm:py-3 shadow-sm backdrop-blur-sm">
          <Search size={18} className="text-slate-500 sm:w-5 sm:h-5" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search Messenger"
            className="w-full bg-transparent text-xs sm:text-sm text-slate-900 outline-none placeholder:text-slate-500 font-medium"
          />
          <button
            type="button"
            onClick={onAddChat}
            className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-sm transition-transform duration-200 active:scale-95 sm:h-9 sm:w-9"
            aria-label="Start a new chat"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="minimal-scrollbar flex-1 overflow-y-auto bg-gradient-to-b from-slate-50/30 via-white to-slate-100/30 px-3 pb-4 pt-3 sm:px-4 sm:pb-6 sm:pt-4">
        
        {loading ? (
          <div className="flex items-center gap-2 sm:gap-3 bg-slate-100/80 px-3 sm:px-4 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-slate-200/50 shadow-sm">
            <LoaderCircle size={16} className="animate-spin text-blue-600 sm:w-[18px] sm:h-[18px]" />
            <p className="text-xs sm:text-sm font-medium text-slate-600">
              Loading chats...
            </p>
          </div>

        ) : showPeople ? (
          people?.length > 0 ? (
            <UserList
              users={people}
              onSelect={onSelectUser}
              selectedId={null}
              theme={isDark ? 'dark' : 'light'}
              palette={{
                selected: 'bg-gradient-to-br from-blue-500 to-purple-600 text-white',
                idle: 'bg-white hover:bg-slate-100/80 rounded-2xl border border-slate-200/50 shadow-sm',
                accent: 'from-blue-500 to-purple-600',
                secondaryText: 'text-slate-500'
              }}
            />
          ) : (
            <div className="border border-dashed border-slate-200/60 bg-slate-50/80 px-4 sm:px-6 py-6 sm:py-8 text-center rounded-xl sm:rounded-2xl shadow-sm">
              <p className="text-sm sm:text-base font-semibold text-slate-600">
                No users found
              </p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Try a different search term
              </p>
            </div>
          )

        ) : chats.length === 0 ? (
          <div className="border border-dashed border-slate-200/60 bg-slate-50/80 px-4 sm:px-6 py-6 sm:py-8 text-center rounded-xl sm:rounded-2xl shadow-sm">
            <p className="text-sm sm:text-base font-semibold text-slate-600">
              No chats found
            </p>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Start a new conversation
            </p>
          </div>

        ) : (
          <div className="space-y-2 sm:space-y-3">
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
