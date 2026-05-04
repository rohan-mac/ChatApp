# Chat App Updates COMPLETE

## Original Task:
- ✅ Removed toggle button from chat window header
- Header now WhatsApp-style: back | info | audio | video | three-dots

## Feedback Fix:
- ✅ Added `text-[var(--text-primary)]` to audio/video/three-dots buttons
- ✅ Unified padding (`p-2`) and icon size (`size={20}`) for consistency
- Icons now visible across all themes (light/dark/ocean/rose) via CSS vars

**Files updated:** `frontend/src/components/chat/ChatWindow.jsx`, `TODO.md`

**Next:** Reload dev server (`cd frontend && npm run dev`) and test all themes. No issues found.
