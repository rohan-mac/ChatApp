import { memo } from 'react';
import { LoaderCircle, Paperclip, Send, Smile } from 'lucide-react';

const InputBar = ({
  isDark,
  theme,
  draft,
  onDraftChange,
  onToggleEmoji,
  onAttachment,
  onSend,
  disabled,
  sending,
  hasAttachment,
  inputRef,
  selectedChat,
  socket,
  userId
}) => {
  const isOcean = theme === 'ocean';
  const isRose = theme === 'rose';
  const sendGradient = isOcean
    ? 'from-cyan-500 to-sky-500'
    : isRose
      ? 'from-fuchsia-500 to-rose-500'
      : 'from-[#25D366] to-emerald-400';

  return (
    <div className={`rounded-2xl border border-slate-200/60 bg-white/95 px-4 py-3 shadow-lg backdrop-blur-sm dark:border-white/20 dark:bg-slate-950/90`}>
      <div className="flex items-end gap-3">
        <button
          type="button"
          onClick={onToggleEmoji}
          className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-200 hover:scale-105 ${isDark ? 'border-white/20 bg-slate-800/70 text-slate-200 hover:bg-slate-700' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100 shadow-sm'}`}
        >
          <Smile size={20} />
        </button>
        <button
          type="button"
          onClick={onAttachment}
          className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-200 hover:scale-105 ${isDark ? 'border-white/20 bg-slate-800/70 text-slate-200 hover:bg-slate-700' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100 shadow-sm'}`}
        >
          <Paperclip size={20} />
        </button>

        <textarea
          ref={inputRef}
          rows="1"
          value={draft}
          disabled={disabled}
          placeholder={selectedChat ? 'Type a message...' : 'Select a chat to start'}
          onChange={(event) => {
            onDraftChange(event.target.value);
            if (selectedChat?._id) {
              socket.emit('chat:typing', {
                chatId: selectedChat._id,
                senderId: userId
              });
            }
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              onSend();
            }
          }}
          className={`h-12 min-h-[3rem] flex-1 resize-none rounded-xl border px-4 py-3 text-sm outline-none transition-all duration-200 focus:ring-2 ${isDark ? 'border-white/20 bg-slate-800/70 text-white placeholder:text-slate-400 focus:border-blue-400/50 focus:ring-blue-500/20' : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-500 focus:border-blue-400/40 focus:ring-blue-500/20 shadow-sm'}`}
        />

        <button
          type="button"
          onClick={onSend}
          disabled={disabled || sending || (!draft.trim() && !hasAttachment)}
          className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${sendGradient} text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100`}
        >
          {sending ? <LoaderCircle size={20} className="animate-spin" /> : <Send size={20} />}
        </button>
      </div>
    </div>
  );
};

export default memo(InputBar);
