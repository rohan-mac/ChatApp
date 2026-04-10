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
    <div className={`rounded-full border border-slate-200/80 bg-white px-3 py-2 shadow-sm dark:border-white/10 dark:bg-slate-950/90`}>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleEmoji}
          className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition duration-300 hover:scale-105 hover:brightness-110 ${isDark ? 'border-white/10 bg-slate-900/70 text-slate-200' : 'border-slate-200 bg-white text-slate-700'}`}
        >
          <Smile size={18} />
        </button>
        <button
          type="button"
          onClick={onAttachment}
          className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition duration-300 hover:scale-105 hover:brightness-110 ${isDark ? 'border-white/10 bg-slate-900/70 text-slate-200' : 'border-slate-200 bg-white text-slate-700'}`}
        >
          <Paperclip size={18} />
        </button>

        <textarea
          ref={inputRef}
          rows="1"
          value={draft}
          disabled={disabled}
          placeholder={selectedChat ? 'Type a message' : 'Select a chat to start'}
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
          className={`h-12 min-h-[3rem] flex-1 resize-none rounded-full border px-4 py-3 text-sm outline-none transition-all duration-300 ${isDark ? 'border-white/15 bg-slate-950/70 text-white placeholder:text-slate-400 focus:border-[#25D366]/45 focus:ring-2 focus:ring-[#25D366]/10' : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-500 focus:border-[#25D366]/40 focus:ring-2 focus:ring-[#25D366]/10'}`}
        />

        <button
          type="button"
          onClick={onSend}
          disabled={disabled || sending || (!draft.trim() && !hasAttachment)}
          className={`inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${sendGradient} text-white shadow-[0_16px_35px_rgba(37,211,102,0.22)] transition duration-300 hover:scale-105 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50`}
        >
          {sending ? <LoaderCircle size={18} className="animate-spin" /> : <Send size={18} />}
        </button>
      </div>
    </div>
  );
};

export default memo(InputBar);
