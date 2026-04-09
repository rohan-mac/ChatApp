import { memo } from 'react';
import { Pencil, Star, StarOff, Trash2 } from 'lucide-react';

const formatTime = (value) =>
  value
    ? new Date(value).toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit'
      })
    : '';

const MessageBubble = ({
  message,
  isMine,
  isDark,
  currentUserId,
  onEdit,
  onDelete,
  onToggleStar
}) => {
  const isStarred = message.starredBy?.some((entry) => (entry._id || entry) === currentUserId);
  const bubbleClasses = isMine
    ? 'border border-white/10 bg-[linear-gradient(135deg,_rgba(0,122,255,1),_rgba(91,110,255,0.9))] text-white'
    : isDark
      ? 'border border-white/10 bg-white/8 text-white'
      : 'border border-white/70 bg-white/80 text-slate-900';

  return (
    <div className={`group flex ${isMine ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[88%] rounded-[28px] px-4 py-3 shadow-lg sm:max-w-[72%] ${bubbleClasses}`}>
        {message.text ? <p className="whitespace-pre-wrap break-words text-sm leading-6 sm:text-[15px]">{message.text}</p> : null}

        {message.mediaUrl ? (
          <div className="mt-3 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/10">
            {message.mediaType === 'image' ? (
              <img src={message.mediaUrl} alt="attachment" className="max-h-72 w-full object-cover" />
            ) : message.mediaType === 'video' ? (
              <video src={message.mediaUrl} controls className="max-h-72 w-full object-cover" />
            ) : (
              <a href={message.mediaUrl} target="_blank" rel="noreferrer" className="block px-4 py-3 text-sm underline underline-offset-4">
                Open attachment
              </a>
            )}
          </div>
        ) : null}

        {message.deletedForEveryone ? (
          <p className={`mt-2 text-xs italic ${isMine ? 'text-white/80' : isDark ? 'text-slate-300' : 'text-slate-500'}`}>
            Message deleted for everyone
          </p>
        ) : null}

        <div className={`mt-3 flex flex-wrap items-center gap-2 text-[11px] ${isMine ? 'text-white/75' : isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          <span>{formatTime(message.createdAt)}</span>
          <span className="capitalize">{message.status || 'sent'}</span>
          {message.isEdited ? <span>Edited</span> : null}
          {isStarred ? <span>Starred</span> : null}
        </div>

        <div className="mt-3 flex items-center gap-2 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
          <button
            type="button"
            onClick={() => onToggleStar(message)}
            className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${
              isDark ? 'bg-white/10 text-slate-200 hover:bg-white/15' : 'bg-slate-900/5 text-slate-700 hover:bg-slate-900/10'
            }`}
            aria-label="Toggle star"
          >
            {isStarred ? <StarOff size={14} /> : <Star size={14} />}
          </button>

          {isMine && !message.deletedForEveryone ? (
            <button
              type="button"
              onClick={() => onEdit(message)}
              className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${
                isDark ? 'bg-white/10 text-slate-200 hover:bg-white/15' : 'bg-slate-900/5 text-slate-700 hover:bg-slate-900/10'
              }`}
              aria-label="Edit message"
            >
              <Pencil size={14} />
            </button>
          ) : null}

          <button
            type="button"
            onClick={() => onDelete(message)}
            className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${
              isDark ? 'bg-rose-500/15 text-rose-200 hover:bg-rose-500/20' : 'bg-rose-500/10 text-rose-700 hover:bg-rose-500/15'
            }`}
            aria-label="Delete message"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(MessageBubble);
