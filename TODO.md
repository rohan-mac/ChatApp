# ChatApp Theme Enhancement & Mobile UI Fix TODO

## Current Progress: 0/10

### Phase 1: Theme Infrastructure (3 steps)
- [x] 1. Extend tailwind.config.js with 5 new WhatsApp-inspired theme colors (whatsapp-green, business-blue, vibrant-purple, sunset-orange, cool-teal)
- [x] 2. Update index.css with CSS variables for all 9 themes under [data-theme='theme-name']
- [x] 3. Read/confirm ChatPage.jsx passes theme props to ChatList/ChatWindow/AppShell

### Phase 2: Settings UI (2 steps)
- [x] 4. Update pages/chat/SettingsPage.jsx: Expand theme selector to 9-option grid with previews
- [x] 5. Update backend User model enum for all 9 themes (controller OK)

### Phase 3: App Integration (3 steps)
- [x] 6. Activate full theme menu in AppShell.jsx using themeOptions prop
- [ ] 7. Propagate theme to ChatPage/ChatWindow/ChatList/Sidebar
- [ ] 8. Add theme-aware accents (buttons, selections, bubbles)

### Phase 4: Mobile Fixes (2 steps)
- [x] 9. Remove mobile border-radius: ChatList/ChatWindow (rounded-none base)
- [ ] 10. Test & Completion: Restart dev server, verify mobile no-round, themes app-wide, persistence

**Bonus: Added WhatsApp-style 3-dots menu in ChatWindow** (View Contact, Media, Search, Clear, Delete). Test & enjoy!

