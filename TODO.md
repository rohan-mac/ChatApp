# Call UI Enhancements (WhatsApp-style Popups/Pages)
## Completed
- [x] Analyzed repo - Core incoming popup exists in CallModal.jsx, globals in main.jsx
- [x] 1. Enhanced CallModal.jsx - Added outgoing "Calling..." state, real names/avatars, conditional buttons/status

## Plan Steps
2. [x] Fixed ChatWindow.jsx - Corrected `useCall` import to CallContext, polished call buttons with motion/shadow
3. [x] Updated callStore.js - Added callHistory[] (tracks ended calls w/ duration/dir), clearHistory()
4. [x] Updated CallsPage.jsx - Real history UI w/ avatars, direction icons (incoming/outgoing), duration, quick redial, empty state, animations
5. [ ] Polish active screens (VideoCallScreen/AudioCallScreen) + ensure full integration
6. [ ] Test full flow

## Testing
- cd frontend && npm run dev
- cd backend && npm run dev  
- Open 2 browser tabs (different users), test audio/video calls: initiate → incoming/outgoing popup → answer/decline → active screen → end

