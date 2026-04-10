import { useState } from 'react';
import { motion } from 'framer-motion';
import { EllipsisVertical, Pencil, Star, StarOff, Trash2 } from 'lucide-react';

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
  const [menuOpen, setMenuOpen] = useState(false);
  const text = message.text || message.content || 'No content';
  const isStarred = message.starredBy?.some((entry) => (entry._id || entry) === currentUserId);

  const bubbleClasses = isMine
    ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
    : 'bg-white text-slate-900 shadow-md shadow-slate-200/50 border border-slate-200/60';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`group flex ${isMine ? 'justify-end' : 'justify-start'}`}
      onContextMenu={(event) => {
        event.preventDefault();
        setMenuOpen((current) => !current);
      }}
    >
      <div className={`relative max-w-[85%] rounded-2xl px-4 py-3 sm:max-w-[70%] transition-all duration-200 hover:shadow-lg ${bubbleClasses}`}>
        <button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          className={`absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full opacity-0 transition-all duration-200 group-hover:opacity-100 hover:scale-110 ${isMine ? 'bg-white/20 text-white hover:bg-white/30' : isDark ? 'bg-slate-700/80 text-slate-200 hover:bg-slate-600' : 'bg-slate-900/10 text-slate-600 hover:bg-slate-900/20'}`}
        >
          <EllipsisVertical size={14} />
        </button>

        <p className="whitespace-pre-wrap break-words pr-8 text-sm leading-6">{text}</p>

        <div className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${isMine ? 'text-white/75' : isDark ? 'text-slate-300/80' : 'text-slate-500'}`}>
          <span>{formatTime(message.createdAt)}</span>
          {message.isEdited ? <span>• edited</span> : null}
        </div>

        {menuOpen ? (
          <div className={`absolute ${isMine ? 'left-0' : 'right-0'} top-full z-20 mt-3 min-w-48 rounded-2xl border p-2 shadow-xl backdrop-blur-sm ${isDark ? 'border-white/20 bg-slate-800/95 text-slate-100' : 'border-slate-200/60 bg-white/95 text-slate-700'}`}>
            <button
              type="button"
              onClick={() => {
                onToggleStar(message);
                setMenuOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm hover:bg-white/10 transition-colors duration-150"
            >
              {isStarred ? <StarOff size={16} /> : <Star size={16} />}
              <span>{isStarred ? 'Remove star' : 'Star message'}</span>
            </button>

            {isMine && !message.deletedForEveryone ? (
              <button
                type="button"
                onClick={() => {
                  onEdit(message);
                  setMenuOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm hover:bg-white/10 transition-colors duration-150"
              >
                <Pencil size={16} />
                <span>Edit message</span>
              </button>
            ) : null}

            <button
              type="button"
              onClick={() => {
                onDelete(message);
                setMenuOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-rose-500 hover:bg-rose-500/10 transition-colors duration-150"
            >
              <Trash2 size={16} />
              <span>Delete message</span>
            </button>
          </div>
        ) : null}
      </div>
    </motion.div>
  );
};

export default MessageBubble;
