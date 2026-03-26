# Chat-like Item Ordering Requirements

## 1. Message Ordering (Bottom-to-Top)

- The chat follows a **chronological order**:
  - Oldest messages at the top
  - Newest messages at the bottom

- The UI must behave like modern chat applications:
  - **Viewport is anchored to the bottom** by default
  - On initial load, automatically scroll to the **latest message**

- New messages (entries or summaries):
  - Are appended to the **bottom of the list**
  - Trigger **auto-scroll to bottom** _only if_ the user is already near the bottom

- If the user has scrolled up:
  - Do **not** auto-scroll when new messages arrive
  - Optionally show a **“New messages” indicator**

## 2. Scroll Behavior

### Initial Load

- Load the most recent N items
- Immediately scroll to the **bottom**

### Loading Older Messages

- Triggered when user scrolls near the **top**
- Fetch older items (pagination / cursor-based)

### Scroll Position Preservation

- When prepending older messages:
  - Maintain the user's **visual scroll position**
  - Prevent “jumping” or sudden shifts

## 3. Virtualized Rendering (Performance)

- The message list must use **virtualization** to handle large datasets efficiently

### Requirements

- Only render:
  - Items within the viewport
  - Plus a small buffer (overscan)

- Support:
  - **Thousands of messages** without performance degradation

### Dynamic Heights

- Messages may have variable heights (e.g., summaries vs entries)
- Virtualization must support:
  - **Dynamic measurement**
  - Smooth reflow without layout breaking

## 4. Bi-directional Infinite Scrolling

- Support both:
  - **Upward loading** → older messages
  - **Downward appending** → new messages

- Must handle:
  - Continuous streaming of new messages at the bottom
  - Pagination at the top without affecting bottom anchoring

## 5. Bottom Anchoring Logic

- Maintain a **sticky-bottom behavior**:
  - If user is at (or near) bottom → stay pinned on updates
  - If user scrolls away → release the anchor

- Define threshold:
  - e.g., within ~100px of bottom = “near bottom”

## 6. Stability & UX Constraints

- No flickering or layout jumps during:
  - New message insertion
  - Older message loading
  - Resize events (especially mobile)

- Ensure:
  - Smooth scrolling experience
  - Consistent spacing between items

## 7. Edge Cases

- First load with very few items:
  - Still anchor to bottom

- Extremely long messages:
  - Must not break virtualization calculations

- Rapid message bursts:
  - Batch or debounce renders if necessary
