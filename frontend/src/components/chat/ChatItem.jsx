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

const ChatItem = ({ chat, active, onOpen, name, preview, isDark }) => {
  const badge = chat.unreadCount || 0;
  const time = formatTime(chat.lastMessageId?.createdAt || chat.updatedAt);

  return (
    <button
      type="button"
      onClick={() => onOpen(chat)}
      className={`group w-full rounded-[22px] border p-3 text-left backdrop-blur-[20px] transition-all duration-300 ease-in-out hover:scale-[1.01] hover:brightness-110 ${
        active
          ? isDark
            ? 'border-[#25D366]/40 bg-[rgba(37,211,102,0.18)]'
            : 'border-[#25D366]/45 bg-[rgba(37,211,102,0.16)]'
          : isDark
            ? 'border-white/10 bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.12)]'
            : 'border-white/70 bg-[rgba(255,255,255,0.6)] hover:bg-[rgba(255,255,255,0.82)]'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-[#25D366] text-sm font-semibold text-white shadow-lg">
            {getInitials(name)}
          </div>
          {chat.counterpart?.isOnline ? (
            <span className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 ${isDark ? 'border-[#07131c]' : 'border-white'} bg-[#25D366]`} />
          ) : null}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="min-w-0 flex-1 truncate text-sm font-semibold">{name}</p>
            {time ? <span className={`shrink-0 text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{time}</span> : null}
          </div>
          <p className={`mt-1 truncate text-xs ${isDark ? 'text-slate-300/90' : 'text-slate-600'}`}>{preview}</p>
        </div>

        {badge > 0 ? (
          <span className="ml-2 inline-flex min-w-6 items-center justify-center rounded-full bg-[#25D366] px-2 py-1 text-[11px] font-semibold text-white shadow-[0_8px_20px_rgba(37,211,102,0.45)]">
            {badge}
          </span>
        ) : null}
      </div>
    </button>
  );
};

export default memo(ChatItem);
