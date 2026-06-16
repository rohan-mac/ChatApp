import { memo } from 'react';
import { formatMessageTime } from '../../utils/time';

const getInitials = (name = '') =>
  name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || '?';

const ChatItem = ({ chat, active, onOpen, name, preview }) => {
  const badge = chat.unreadCount || 0;
  const time = formatMessageTime(chat.lastMessageId?.createdAt || chat.updatedAt);

  return (
    <button
      type="button"
      onClick={() => onOpen(chat)}
      className={`group grid w-full grid-cols-[48px_minmax(0,1fr)_auto] items-center gap-3 border-b border-[var(--wa-border)] px-3 py-3 text-left transition-colors duration-150 hover:bg-[var(--wa-hover)] focus-visible:bg-[var(--wa-hover)] ${active ? 'bg-[var(--wa-selected)]' : 'bg-transparent'}`}
      aria-current={active ? 'true' : undefined}
    >
      <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-[#128C7E] to-[#25D366] text-white shadow-sm">
        {chat.counterpart?.profilePic ? (
          <img src={chat.counterpart.profilePic} alt="" loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-[15px] font-semibold">{getInitials(name)}</span>
        )}
        {chat.counterpart?.isOnline ? <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-[var(--wa-sidebar)] bg-[#25D366]" /> : null}
      </span>

      <span className="min-w-0">
        <span className="flex items-center justify-between gap-3">
          <span className="truncate text-[16px] font-semibold text-[var(--wa-text)]">{name}</span>
          {time ? <span className={`shrink-0 text-[11px] ${badge ? 'font-semibold text-[#25D366]' : 'text-[var(--wa-muted)]'}`}>{time}</span> : null}
        </span>
        <span className="mt-0.5 block truncate text-[13px] leading-5 text-[var(--wa-muted)]">{preview}</span>
      </span>

      {badge > 0 ? (
        <span className="ml-1 flex h-5 min-w-5 animate-[badge-pop_.25s_ease-out] items-center justify-center rounded-full bg-[#25D366] px-1.5 text-[12px] font-bold text-white">
          {badge > 99 ? '99+' : badge}
        </span>
      ) : null}
    </button>
  );
};

export default memo(ChatItem);
