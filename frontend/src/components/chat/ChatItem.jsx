// import { memo } from 'react';

// const getInitials = (name = '') =>
//   name
//     .split(' ')
//     .filter(Boolean)
//     .slice(0, 2)
//     .map((part) => part[0]?.toUpperCase())
//     .join('') || '?';

// const formatTime = (value) => {
//   if (!value) return '';
//   return new Date(value).toLocaleTimeString([], {
//     hour: 'numeric',
//     minute: '2-digit'
//   });
// };

// const ChatItem = ({ chat, active, onOpen, name, preview, isDark, theme }) => {
//   const badge = chat.unreadCount || 0;
//   const isOcean = theme === 'ocean';
//   const isRose = theme === 'rose';
//   const accent = isOcean
//     ? 'from-cyan-400 to-sky-500'
//     : isRose
//     ? 'from-fuchsia-500 to-rose-500'
//     : 'from-emerald-400 to-[#25D366]';
//   const activeAccent = isOcean
//     ? 'border-cyan-400/35 bg-cyan-500/10'
//     : isRose
//     ? 'border-fuchsia-400/35 bg-fuchsia-500/10'
//     : 'border-[#25D366]/40 bg-[rgba(37,211,102,0.18)]';
//   const badgeColor = isOcean ? 'bg-cyan-500 shadow-[0_8px_20px_rgba(56,189,248,0.35)]' : isRose ? 'bg-fuchsia-500 shadow-[0_8px_20px_rgba(236,72,153,0.35)]' : 'bg-[#25D366] shadow-[0_8px_20px_rgba(37,211,102,0.45)]';
//   const time = formatTime(chat.lastMessageId?.createdAt || chat.updatedAt);

//   return (
//     <button
//       type="button"
//       onClick={() => onOpen(chat)}
//       className={`group flex w-full items-start gap-4 rounded-2xl border px-5 py-4 text-left transition-all duration-200 shadow-sm hover:shadow-md ${
//         active
//           ? 'border-blue-300/50 bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg shadow-blue-500/10'
//           : 'border-transparent bg-white hover:border-slate-200/60 hover:bg-slate-50/80'
//       }`}
//     >
//       <div className="relative shrink-0">
//         <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-lg font-bold text-white shadow-lg">
//           {getInitials(name)}
//         </div>
//         {chat.counterpart?.isOnline ? (
//           <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-white bg-emerald-500 shadow-sm"></span>
//         ) : null}
//       </div>

//       <div className="min-w-0 flex-1">
//         <div className="flex items-center justify-between gap-3">
//           <p className="truncate text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors duration-200">{name}</p>
//           {time ? <span className="shrink-0 text-xs font-medium text-slate-500">{time}</span> : null}
//         </div>
//         <p className="mt-1 truncate text-sm text-slate-600 font-medium">{preview}</p>
//       </div>

//       {badge > 0 ? (
//         <span className="inline-flex min-w-[1.75rem] items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-2.5 py-1 text-xs font-bold text-white shadow-lg">
//           {badge}
//         </span>
//       ) : null}
//     </button>
//   );
// };

// export default memo(ChatItem);





import { memo } from 'react';

const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || '?';

const formatTime = (value) => {
  if (!value) return '';
  return new Date(value).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit'
  });
};

const ChatItem = ({ chat, active, onOpen, name, preview, isDark, theme }) => {
  const badge = chat.unreadCount || 0;
  const isOcean = theme === 'ocean';
  const isRose = theme === 'rose';
  const accent = isOcean
    ? 'from-cyan-400 to-sky-500'
    : isRose
    ? 'from-fuchsia-500 to-rose-500'
    : 'from-emerald-400 to-[#25D366]';
  const activeAccent = isOcean
    ? 'border-cyan-400/35 bg-cyan-500/10'
    : isRose
    ? 'border-fuchsia-400/35 bg-fuchsia-500/10'
    : 'border-[#25D366]/40 bg-[rgba(37,211,102,0.18)]';
  const badgeColor = isOcean ? 'bg-cyan-500 shadow-[0_8px_20px_rgba(56,189,248,0.35)]' : isRose ? 'bg-fuchsia-500 shadow-[0_8px_20px_rgba(236,72,153,0.35)]' : 'bg-[#25D366] shadow-[0_8px_20px_rgba(37,211,102,0.45)]';
  const time = formatTime(chat.lastMessageId?.createdAt || chat.updatedAt);

  return (
    <button
      type="button"
      onClick={() => onOpen(chat)}
      className={`group flex w-full items-start gap-2 sm:gap-4 rounded-xl sm:rounded-2xl border px-3 sm:px-5 py-3 sm:py-4 text-left transition-all duration-200 shadow-sm hover:shadow-md ${
        active
          ? 'border-blue-300/50 bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg shadow-blue-500/10'
          : 'border-transparent bg-white hover:border-slate-200/60 hover:bg-slate-50/80'
      }`}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        {chat.counterpart?.profilePic ? (
          <img
            src={chat.counterpart.profilePic}
            alt={name}
            className="h-10 w-10 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl object-cover shadow-lg ring-2 ring-white/50"
          />
        ) : (
          <div className="flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-sm sm:text-lg font-bold text-white shadow-lg">
            {getInitials(name)}
          </div>
        )}
        {chat.counterpart?.isOnline ? (
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 sm:h-4 sm:w-4 rounded-full border-2 border-white bg-emerald-500 shadow-sm"></span>
        ) : null}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <p className="truncate text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors duration-200">
            {name}
          </p>
          {time ? (
            <span className="shrink-0 text-[10px] sm:text-xs font-medium text-slate-500">
              {time}
            </span>
          ) : null}
        </div>
        <p className="mt-0.5 sm:mt-1 truncate text-xs sm:text-sm text-slate-600 font-medium">
          {preview}
        </p>
      </div>

      {/* Badge */}
      {badge > 0 ? (
        <span className="inline-flex min-w-[1.5rem] h-6 sm:h-7 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold text-white shadow-lg">
          {badge}
        </span>
      ) : null}
    </button>
  );
};

export default memo(ChatItem);