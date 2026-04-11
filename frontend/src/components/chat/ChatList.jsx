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
    ? 'inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl sm:rounded-3xl border border-white/10 bg-white/10 text-white hover:bg-white/15 transition'
    : `inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl sm:rounded-3xl border border-white/70 bg-white/75 text-slate-900 hover:bg-white transition ${
        isOcean ? 'shadow-[0_0_0_1px_rgba(56,189,248,0.35)]' : isRose ? 'shadow-[0_0_0_1px_rgba(232,121,249,0.35)]' : ''
      }`;

  return (
    <aside className="flex h-full flex-col overflow-hidden border border-slate-200/50 bg-gradient-to-br from-white via-slate-50 to-white shadow-xl rounded-2xl sm:rounded-3xl">
      
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

          <button
            type="button"
            onClick={onAddChat}
            className="inline-flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg transition-all duration-200 active:scale-95 sm:hover:scale-105 hover:shadow-xl"
          >
            <Plus size={20} className="sm:w-6 sm:h-6" />
          </button>
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
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-50/30 via-white to-slate-100/30 px-3 sm:px-4 pb-4 sm:pb-6 pt-3 sm:pt-4">
        
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