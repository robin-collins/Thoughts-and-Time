# Mobile Responsive Design - Mockups

## Design Philosophy
- **Single pane view** - switch between Thoughts and Time panes
- **Bottom navigation** - thumb-friendly
- **Swipe gestures** - natural mobile interactions
- **Floating action button (FAB)** - quick capture
- **Bottom sheet** - Daily Review doesn't block content

---

## 📱 Screen 1: Thoughts Pane (Portrait)

```
┌─────────────────────────────────────┐
│       Thoughts & Time      [🔍][⚙️] │ ← Clean header, no arrows
├─────────────────────────────────────┤
│                                     │
│  WEDNESDAY, NOV 20, 2025            │
│                                     │
│  9:00 AM                            │
│  □ Plan weekend family outing       │
│    □ Check botanical garden hours   │
│    □ Pack picnic supplies           │
│                                     │
│  9:00 AM                            │
│  ↝ Remember to bring sketchbook to  │
│    botanical garden - great...      │
│                                     │
│  THURSDAY, NOV 27, 2025             │
│                                     │
│  ⋮                                  │
│                                     │
│  ⋮ (scroll more content)            │
│                                     │
│                                     │
│                                     │
│                        [+]          │ ← FAB (Floating Action Button)
│                                     │
├─────────────────────────────────────┤
│ ● ○  Type here... (tap to expand)  │ ← Dots show which pane (● = active)
└─────────────────────────────────────┘
 👆 Left dot = Thoughts, Right dot = Time
    Swipe left ← to go to Time pane →
```

---

## 📱 Screen 2: Input Expanded (Portrait)

```
┌─────────────────────────────────────┐
│       Thoughts & Time      [🔍][⚙️] │
├─────────────────────────────────────┤
│                                     │
│  [Dimmed background overlay]        │
│                                     │
│                                     │
│                                     │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ t Main task at 2pm              │ │ ← Full keyboard shown
│ │ t   Subtask 1                   │ │
│ │ │                               │ │
│ │ │ [Tab] indent [↵] submit      │ │
│ │ │ [Shift+↵] new line           │ │
│ │ └───────────────────────────────┘ │
│ │                         [Send ✓]│ │
│ └─────────────────────────────────┘ │
│                                     │
│                                     │
│              [Keyboard]             │
└─────────────────────────────────────┘
```

---

## 📱 Screen 3: TimePane (Portrait)

```
┌─────────────────────────────────────┐
│       Thoughts & Time      [🔍][⚙️] │ ← Same header, clean
├─────────────────────────────────────┤
│                                     │
│  ■ Daily Review              [3] ▼  │ ← Tap to expand bottom sheet
│                                     │
│  WEDNESDAY, NOV 27, 2025            │
│                                     │
│  9:00 AM                            │
│  □ Plan weekend family outing       │
│    □ Check botanical garden hours   │
│    □ Pack picnic supplies           │
│                                     │
│  10:00 AM                           │
│  □ Start new commission - pet       │
│    □ Study reference photos         │
│    □ Rough sketch proportions       │
│    □ Email client with initial...   │
│                                     │
│  2:00 PM                            │
│  □ Order more Payne's Gray and...   │
│                                     │
│  4:00 PM - 5:30 PM                  │
│  ↹ Emma art show at school          │
│                                     │
│  ⋮ (scroll more content)            │
│                                     │
│                                     │
├─────────────────────────────────────┤
│ ○ ●              [Thumb zone safe]  │ ← Right dot active = Time pane
└─────────────────────────────────────┘
     👈 Swipe right → to go back to
        Thoughts pane to add items
```

---

## 📱 Screen 4: Daily Review Bottom Sheet

```
┌─────────────────────────────────────┐
│       Thoughts & Time      [🔍][⚙️] │
├─────────────────────────────────────┤
│  [Dimmed overlay - can tap to close]│
│                                     │
│  WEDNESDAY, NOV 27, 2025            │
│                                     │
│  10:00 AM                           │
│  □ Start new commission...          │
│    □ Study reference photos         │
│                                     │
├═════════════════════════════════════┤ ← Drag handle
│ ═══   Daily Review                  │
├─────────────────────────────────────┤
│ │ • Work on Martinez commission     │ │
│ │   (9 days old)          [↻][✓][×]│ │
│ │                                   │ │
│ │ • Reply to gallery inquiry        │ │
│ │   (4 days old)          [↻][✓][×]│ │
│ │                                   │ │
│ │ • Update Instagram with work      │ │
│ │   (3 days old)          [↻][✓][×]│ │
│ │                                   │ │
│ │ • Send invoice to Martinez        │ │
│ │   (2 days old)          [↻][✓][×]│ │
│ │                                   │ │
│ │         [Show 2 more...]          │ │
│ └───────────────────────────────────┘ │
│                                       │
│              [Keyboard safe area]     │
└───────────────────────────────────────┘
    👆 Swipe down to dismiss
```

---

## 📱 Screen 5: Landscape Mode

```
┌───────────────────────────────────────────────────────────────────┐
│  Thoughts & Time                              [🔍] [⚙️]           │
├──────────────────────────────┬────────────────────────────────────┤
│ THOUGHTS                     │ TIME PANE                          │
│ ─────────                    │ ──────────                         │
│                              │                                    │
│ WEDNESDAY, NOV 27, 2025      │ ■ Daily Review         [3] ▼       │
│                              │                                    │
│ 9:00 AM                      │ WEDNESDAY, NOV 27, 2025            │
│ □ Plan weekend family outing │                                    │
│   □ Check botanical garden..│ 9:00 AM                            │
│   □ Pack picnic supplies     │ □ Plan weekend family outing       │
│                              │   □ Check botanical garden hours   │
│ 9:00 AM                      │   □ Pack picnic supplies           │
│ ↝ Remember to bring...       │                                    │
│                              │ 10:00 AM                           │
│ ⋮                            │ □ Start new commission - pet       │
│                              │   □ Study reference photos         │
│                              │   ⋮                                │
│                              │                                    │
├──────────────────────────────┴────────────────────────────────────┤
│ Type here... (Tab to indent, Shift+Enter for new line)      [→]  │
└───────────────────────────────────────────────────────────────────┘
         👆 Dual pane in landscape (like desktop)
```

---

## 🎨 Design Specs

### Breakpoints
- **Mobile Portrait**: < 768px (single pane)
- **Tablet/Landscape**: 768px - 1024px (optional dual pane or larger single)
- **Desktop**: > 1024px (current dual pane layout)

### Navigation (Thumb-Zone Optimized)
- **Swipe left/right**: PRIMARY navigation - Switch between Thoughts ↔ Time panes
- **Pane indicators (dots)**: Visual feedback at bottom showing current pane
  - ● ○ = Thoughts pane active
  - ○ ● = Time pane active
  - Dots are tappable to switch panes (alternative to swiping)
- **Tap Daily Review badge**: Open bottom sheet
- **No header arrows**: Removed - too far from thumb, swipe is better

### Input Behavior
- **Collapsed**: Sticky bar at bottom, tap to expand
- **Expanded**: Full screen overlay with dimmed background
- **Keyboard shortcuts**: Still work (Tab, Shift+Enter, etc.)
- **Submit**: Tap checkmark or Enter key

### Daily Review
- **Bottom sheet**: Swipe up to open, down to close
- **Drag handle**: Visual affordance at top
- **Backdrop tap**: Close sheet
- **Actions inline**: [↻ Reschedule] [✓ Complete] [× Cancel]

### Touch Targets
- **Minimum 44x44px**: All interactive elements
- **Spacing**: 8px between touch targets
- **Checkboxes**: 32x32px active area (larger than visual)

### Gestures (All in Thumb Zone)
```
Swipe left on Thoughts pane → Go to Time pane
Swipe right on Time pane → Go to Thoughts pane
Tap pane indicator dots → Switch panes (alternative to swipe)
Swipe up on Daily Review badge → Open review sheet
Swipe down on sheet → Close sheet
Pull to refresh (at top of pane) → Reload data (optional)
Long press on item → Show context menu (edit/delete)
Tap input bar → Expand full screen input
```

**Thumb Zone Priority**: All primary actions (swipe, tap input, tap dots) are in bottom third of screen.

### Floating Action Button (FAB)
- **Position**: Bottom right, above input bar
- **Action**: Quick capture (opens input immediately)
- **Animation**: Bounce in on page load
- **Hide on scroll down**: Shows on scroll up

### Bottom Input Bar
- **Collapsed**: 52px height, shows placeholder
- **Expanded**: Full screen overlay, auto-focus
- **Backdrop**: Semi-transparent black (opacity 0.5)
- **Animation**: Slide up with ease-out

---

## 🎯 Key Mobile UX Principles

### Thumb Zone First
Modern smartphones (6"+ screens) make top header unreachable with one hand. All primary navigation moved to bottom:

```
┌─────────────────────────────┐
│ ← Unreachable (hard zone)   │  Header: Display only
│                             │
│                             │
│                             │
│ ← Stretch (medium zone)     │  Content: Scrollable
│                             │
│                             │
│ ← Natural (easy zone)       │
├─────────────────────────────┤
│ ● ○  Input...          [+]  │  ← ALL controls here
└─────────────────────────────┘  Bottom: Thumb-friendly
```

**Design Decision**: Swipe gestures + bottom indicators instead of top header arrows.

### Other Principles

1. **Thumb Zone**: Most important actions within thumb reach (bottom third)
2. **One-handed operation**: Everything accessible with one hand
3. **Gestures over buttons**: Swipe to navigate, not multiple taps
4. **Progressive disclosure**: Don't show everything at once
5. **Clear affordances**: Visual hints for swipeable elements
6. **Fast input**: Minimize taps to create items
7. **Undo visible**: Toasts with undo buttons (already implemented)

---

## 📐 Visual Hierarchy (Mobile)

### Thoughts Pane
```
Header (Navigation)              60px
  ↓
Content Area (scrollable)        Fill
  ↓
Input Bar (collapsed)            52px
  ↓
Safe Area (iOS notch, etc)       Auto
```

### Time Pane (Read-only)
```
Header (Navigation)              60px
  ↓
Content Area (scrollable)        Fill
  ↓
Safe Area (iOS notch, etc)       Auto
```
*No input bar - TimePane is read-only for viewing timeline*

---

## 🎭 Example Flow: Creating a Task on Mobile

1. **User on Thoughts pane** (input available here)
2. Taps input bar OR taps FAB
3. Input expands full screen, keyboard shows
4. Types: `t Buy groceries at 5pm`
5. Taps Tab, types: `Milk, eggs, bread`
6. Taps Send ✓
7. Input collapses, item appears in Thoughts list
8. Swipes left to see it in Time pane at 5pm

**Note**: If user is on Time pane and wants to add an item, they must:
- **Swipe right** to go back to Thoughts pane (primary method), OR
- **Tap left dot** (● ○) to switch to Thoughts pane
- Then use the input bar (only available on Thoughts pane)

**Ergonomics**: Both methods keep thumb in comfortable zone at bottom of screen

---

## 💡 Additional Mobile Considerations

### Offline Support
- Service worker for offline access
- Queue items when offline
- Sync icon shows status

### Performance
- Virtual scrolling already implemented ✓
- Lazy load images (if attachments added)
- Minimize animations on low-end devices

### Native Feel
- Use system fonts for better performance
- Haptic feedback on actions (if available)
- Respect system dark/light mode
- Safe area insets for notch/home indicator

### Accessibility
- Touch targets meet 44x44px minimum
- High contrast mode support
- Screen reader announcements for state changes
- Focus management for keyboard users
