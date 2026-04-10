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
      className={`group flex w-full items-start gap-3 rounded-none border px-4 py-3 text-left transition ${
        active
          ? 'border-[#0084ff] bg-[#e8f0ff] shadow-sm'
          : 'border-transparent bg-white hover:border-slate-200 hover:bg-slate-50'
      }`}
    >
      <div className="relative shrink-0">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0084ff] text-lg font-semibold text-white shadow-sm">
          {getInitials(name)}
        </div>
        {chat.counterpart?.isOnline ? (
          <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
        ) : null}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <p className="truncate text-sm font-semibold text-slate-900">{name}</p>
          {time ? <span className="shrink-0 text-xs text-slate-500">{time}</span> : null}
        </div>
        <p className="mt-1 truncate text-sm text-slate-500">{preview}</p>
      </div>

      {badge > 0 ? (
        <span className="inline-flex min-w-[1.5rem] items-center justify-center rounded-full bg-[#0084ff] px-2 py-1 text-xs font-semibold text-white">
          {badge}
        </span>
      ) : null}
    </button>
  );
};

export default memo(ChatItem);
