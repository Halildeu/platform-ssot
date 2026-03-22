# Editor Collaboration Strategy

## Current State (v0.1)
- Tiptap-first architecture with 15 extensions
- Single-user editing
- No real-time sync

## Collaboration Options

### Option A: Tiptap Collaboration (Recommended for v1)
- Uses Y.js CRDT
- Tiptap native: @tiptap/extension-collaboration + @tiptap/extension-collaboration-cursor
- Server: y-websocket or Hocuspocus
- Pros: Native integration, cursor awareness, undo/redo per user
- Cons: Requires WebSocket server

### Option B: Liveblocks
- Managed service, no server needed
- React hooks integration
- Pros: Zero infra, great DX
- Cons: Vendor lock-in, cost at scale

### Option C: Custom Y.js
- Direct Y.js integration without Tiptap extension
- Pros: Full control
- Cons: More work, less Tiptap-native

## Decision
Option A selected for v1. Implementation plan:
1. Add @tiptap/extension-collaboration + @tiptap/extension-collaboration-cursor
2. Create CollaborativeEditor wrapper component
3. Abstract WebSocket provider (pluggable: y-websocket, Hocuspocus, custom)
4. Awareness: cursor colors, user names, selection highlights

## Timeline
- v0.1 (current): Single-user, 15 extensions
- v0.2 (Wave 6): Collaboration extension installed, offline-first
- v1.0 (Wave 8): Full collab with cursor awareness + conflict resolution
