import { memo } from 'react';
import { LoaderCircle, Paperclip, Send, Smile } from 'lucide-react';

const InputBar = ({
  isDark,
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
}) => (
  <div className={`rounded-[26px] border p-3 backdrop-blur-[20px] ${isDark ? 'border-white/10 bg-[rgba(255,255,255,0.07)]' : 'border-white/70 bg-[rgba(255,255,255,0.75)]'}`}>
    <div className="flex items-end gap-2">
      <button
        type="button"
        onClick={onToggleEmoji}
        className={`inline-flex h-11 w-11 items-center justify-center rounded-full transition duration-300 hover:scale-105 hover:brightness-110 ${isDark ? 'bg-white/10 text-slate-200' : 'bg-slate-900/5 text-slate-600'}`}
      >
        <Smile size={18} />
      </button>
      <button
        type="button"
        onClick={onAttachment}
        className={`inline-flex h-11 w-11 items-center justify-center rounded-full transition duration-300 hover:scale-105 hover:brightness-110 ${isDark ? 'bg-white/10 text-slate-200' : 'bg-slate-900/5 text-slate-600'}`}
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
        className={`h-12 min-h-[3rem] flex-1 resize-none rounded-2xl border px-3 py-3 text-sm outline-none transition-all duration-300 ${isDark ? 'border-white/10 bg-[rgba(255,255,255,0.06)] text-white placeholder:text-slate-400 focus:border-[#25D366]/45 focus:shadow-[0_0_0_4px_rgba(37,211,102,0.15)]' : 'border-white/70 bg-[rgba(255,255,255,0.72)] text-slate-900 placeholder:text-slate-500 focus:border-[#25D366]/40 focus:shadow-[0_0_0_4px_rgba(37,211,102,0.16)]'}`}
      />

      <button
        type="button"
        onClick={onSend}
        disabled={disabled || sending || (!draft.trim() && !hasAttachment)}
        className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#25D366] to-emerald-400 text-white shadow-[0_16px_35px_rgba(37,211,102,0.38)] transition duration-300 hover:scale-105 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {sending ? <LoaderCircle size={18} className="animate-spin" /> : <Send size={18} />}
      </button>
    </div>
  </div>
);

export default memo(InputBar);
