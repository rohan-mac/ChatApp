# 📱 Mobile UI Testing Guide

## Quick Start Testing (5 minutes)

### Browser DevTools Viewport Testing
Use Chrome DevTools device emulation:
1. Open DevTools (F12)
2. Click device icon (or Ctrl+Shift+M)
3. Select "iPhone 12" or "Pixel 6"
4. Test each scenario below

---

## Test Scenarios

### 🎯 Test 1: Input Bar Stickiness
**Goal**: Verify input stays at bottom when scrolling messages

**Steps**:
1. Open any chat with many messages (10+)
2. Scroll up to see older messages
3. **Expected**: Input bar stays at bottom, visible at all times
4. **Status**: ✅ PASSED / ❌ FAILED

**What to Look For**:
- [ ] No gap between input and screen bottom
- [ ] Input doesn't disappear while scrolling
- [ ] Input remains clickable
- [ ] Text cursor visible in input field

---

### 🎯 Test 2: Emoji Picker Positioning
**Goal**: Verify emoji picker fits on screen

**Steps**:
1. Tap emoji button (😊 icon)
2. **Expected**: Emoji picker appears fitted in viewport
3. **Expected on bottom 50%**: Picker shows above input
4. **Expected on top 50%**: Picker shows below input
5. **Status**: ✅ PASSED / ❌ FAILED

**What to Look For**:
- [ ] Emoji grid is fully visible
- [ ] No horizontal scrolling
- [ ] Search bar visible
- [ ] Picker doesn't overlap input field
- [ ] Can scroll through emojis

---

### 🎯 Test 3: Header Responsiveness
**Goal**: Verify header adapts to small screens

**Viewport**: 375px (iPhone SE)

**Steps**:
1. Open any chat
2. Check header layout
3. **Expected**: Header stays readable
4. **Status**: ✅ PASSED / ❌ FAILED

**What to Look For**:
- [ ] Back button (←) is visible on mobile
- [ ] Back button is at least 36px × 36px (touchable)
- [ ] Chat name doesn't get cut off
- [ ] Status text visible below name
- [ ] More options (⋮) button accessible
- [ ] No text overlap

---

### 🎯 Test 4: Message Bubbles Sizing
**Goal**: Verify message bubbles scale properly

**Viewport**: 375px (mobile)

**Steps**:
1. Send chat with mixed length messages:
   - Short: "Hi"
   - Medium: "What's up? How are you doing today?"
   - Long: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
2. **Expected**: Messages fit nicely, max width 88% on mobile
3. **Status**: ✅ PASSED / ❌ FAILED

**What to Look For**:
- [ ] Long messages don't stretch to screen edge
- [ ] Short messages don't take full width
- [ ] Text is readable (not too tiny)
- [ ] Timestamps visible
- [ ] Avatar shows for first message
- [ ] No horizontal scrolling

---

### 🎯 Test 5: Input Button Layout
**Goal**: Verify buttons don't wrap or disappear

**Viewport**: 320px (smallest phone)

**Steps**:
1. Focus on input field
2. Type a longer draft message
3. **Expected**: Emoji, paperclip, send buttons stay on same row
4. **Status**: ✅ PASSED / ❌ FAILED

**What to Look For**:
- [ ] All 3 buttons visible (😊, 📎, ✈️)
- [ ] Buttons don't wrap to new line
- [ ] Buttons are at least 40px × 40px each
- [ ] Input field height increases with text (grows up to 3 lines)
- [ ] Buttons stay aligned to input height
- [ ] No horizontal scrolling

---

### 🎯 Test 6: Responsive Padding
**Goal**: Verify spacing adapts to screen size

**Viewport**: 375px (mobile)

**Steps**:
1. Open chat and scroll
2. Check spacing on both sides
3. **Expected**: Tight padding on mobile (px-3)
4. Switch to desktop (1024px)
5. **Expected**: Wider padding (px-6)
6. **Status**: ✅ PASSED / ❌ FAILED

**What to Look For**:
- [ ] Mobile: ~10px padding on sides
- [ ] Desktop: ~20px+ padding on sides
- [ ] No content touching screen edges on mobile
- [ ] Consistent spacing top/bottom

---

### 🎯 Test 7: Keyboard Interaction
**Goal**: Verify UI stays usable with keyboard open

**Platform**: Android phone or DevTools with mobile keyboard

**Steps**:
1. Tap input field
2. Keyboard appears
3. **Expected**: Input field, buttons still visible
4. **Expected**: Can still see at least 2 messages above
5. **Status**: ✅ PASSED / ❌ FAILED

**What to Look For**:
- [ ] Input field not hidden by keyboard
- [ ] Send button reachable
- [ ] Chat still scrollable above
- [ ] No UI jank or jumping

---

### 🎯 Test 8: Long Usernames
**Goal**: Verify chat name doesn't overflow

**Steps**:
1. Find or create chat with very long name (30+ chars)
2. **Expected**: Name truncates with "..."
3. **Status**: ✅ PASSED / ❌ FAILED

**What to Look For**:
- [ ] Long name shows "..." at end
- [ ] Status text also truncated if needed
- [ ] Header layout doesn't break
- [ ] Rest of header unaffected

---

### 🎯 Test 9: Landscape Orientation
**Goal**: Verify layout works in landscape

**Platform**: Mobile device or DevTools

**Steps**:
1. Rotate device to landscape
2. **Expected**: Layout adapts
3. Opens chat with messages
4. **Expected**: Input still visible
5. **Status**: ✅ PASSED / ❌ FAILED

**What to Look For**:
- [ ] Messages still visible (at least 1)
- [ ] Input bar not pushed off screen
- [ ] All buttons accessible
- [ ] No horizontal scrolling
- [ ] Header stays visible

---

### 🎯 Test 10: iPhone Notch Support
**Goal**: Verify safe-area-inset works

**Platform**: iPhone 12+ or DevTools device emulation

**Steps**:
1. Use iPhone 12 Pro (has notch)
2. Open chat app
3. **Expected**: Content doesn't go behind notch
4. **Status**: ✅ PASSED / ❌ FAILED

**What to Look For**:
- [ ] No content hidden behind notch
- [ ] Input area has padding below safe area
- [ ] Home indicator area respected
- [ ] All buttons clickable (not in safe margin)

---

## Performance Checks

### ⚡ Scrolling Performance
- [ ] Messages scroll smoothly (60 FPS)
- [ ] No lag when scrolling 100+ messages
- [ ] No jank when emoji picker opens
- [ ] Animations smooth and under 16ms

### ⚡ Interaction Responsiveness
- [ ] Tap input field: < 100ms to show cursor
- [ ] Send message: < 50ms UI feedback
- [ ] Emoji picker toggle: < 150ms animation
- [ ] Menu open/close: Instant

---

## Summary Checklist

Copy this and fill in during testing:

```
DEVICE: _______________
VIEWPORT: _______________
BROWSER: _______________
DATE: _______________

✅ Input stickiness
✅ Emoji picker positioning
✅ Header responsiveness
✅ Message bubble sizing
✅ Input button layout
✅ Responsive padding
✅ Keyboard interaction
✅ Long username handling
✅ Landscape orientation
✅ iPhone notch support
✅ Scrolling performance
✅ Interaction responsiveness

ISSUES FOUND:
- [ ] Issue 1: _______________
- [ ] Issue 2: _______________
- [ ] Issue 3: _______________

OVERALL STATUS: ✅ PASS / ❌ NEEDS WORK
```

---

## Common Issues & Solutions

### ❌ Input bar disappears when scrolling
**Solution**: Check if ChatWindow has `flex h-full flex-col` and input has `flex-shrink-0`

### ❌ Emoji picker goes off-screen
**Solution**: Verify `emojiPickerPosition` state and `useEffect` are working. Check if ref is attached correctly.

### ❌ Text too small on mobile
**Solution**: Check responsive classes like `text-sm sm:text-lg`. Increase base size if needed.

### ❌ Buttons wrap on small screens
**Solution**: Ensure buttons have `flex-shrink-0` and input has `flex-1`

### ❌ Horizontal scrolling on mobile
**Solution**: Check for hardcoded widths. Remove `w-full` if parent doesn't have max-width.

---

## Quick Links to Code

- **Layout Structure**: [ChatWindow.jsx](../frontend/src/components/chat/ChatWindow.jsx) lines 59-194
- **Emoji Picker Logic**: [ChatWindow.jsx](../frontend/src/components/chat/ChatWindow.jsx) lines 44-58
- **Input Bar**: [InputBar.jsx](../frontend/src/components/chat/InputBar.jsx) lines 30-85
- **Responsive Hook**: [useMediaQuery.js](../frontend/src/hooks/useMediaQuery.js)
- **Z-Index System**: [zIndex.js](../frontend/src/constants/zIndex.js)

---

## Test Results Template

Use this for documentation:

**Test Date**: __________
**Tester**: __________
**Devices Tested**: Mobile, Tablet, Desktop ✓
**Issues Found**: _____ critical, _____ high, _____ medium
**Pass Rate**: _____%
**Sign-off**: __________

---

**Ready to test? Start with Test 1 and work through systematically!** 🚀
