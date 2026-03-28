# Portal Behavior

## What Portals Are

Portals render UI into a separate DOM subtree (typically `document.body`) instead of the parent component's DOM hierarchy. This lets overlay content escape `overflow: hidden`, `z-index` stacking contexts, and CSS containment that would otherwise clip or hide it.

## Components That Use Portals

- **Modal overlays** -- Dialog, Modal, DetailDrawer, FormDrawer
- **Popover-style** -- Popover, Tooltip, Combobox dropdown
- **Tab panels** -- Tabs (floating content)

Portal rendering is **enabled by default** for all overlay components.

## usePortal Hook

Creates and manages a portal container div. The container is appended on mount and removed on unmount.

```tsx
import { usePortal } from '@mfe/design-system/unstable/overlay-engine';

function MyOverlay({ children }) {
  const container = usePortal();
  if (!container) return null;
  return ReactDOM.createPortal(children, container);
}
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | `boolean` | `true` | Render via portal or inline |
| `container` | `HTMLElement \| null` | `document.body` | Target container |
| `id` | `string` | -- | HTML `id` for the portal container |

### Return Value

When used with the overlay engine's enhanced API:

| Property | Type | Description |
|----------|------|-------------|
| `Portal` | `React.FC<{ children: ReactNode }>` | Wrapper that renders into the portal or inline |
| `portalElement` | `RefObject<HTMLDivElement \| null>` | Ref to the portal container DOM element |

When `enabled` is `false`, `Portal` renders children inline (no DOM reparenting). When `true`, a `<div data-portal="true">` is appended to the target container.

## Portal Component

A simpler declarative wrapper:

```tsx
import { Portal } from '@mfe/design-system/unstable/overlay-engine';

<Portal>
  <div className="modal-overlay">Modal content</div>
</Portal>

// Custom container
<Portal container={document.getElementById('portal-root')}>
  <div className="tooltip">Tooltip text</div>
</Portal>
```

## PortalProvider -- Global Configuration

Set portal defaults for all overlay components in a subtree.

```tsx
import { PortalProvider } from '@mfe/design-system/unstable/overlay-engine';

function App() {
  return (
    <PortalProvider container={document.getElementById('portal-root')}>
      <MyPage />
    </PortalProvider>
  );
}
```

### Custom container

```tsx
const portalRoot = document.getElementById('portal-root');
<PortalProvider container={portalRoot}>
  <MyPage />
</PortalProvider>
```

### Disable portals globally (SSR / testing)

```tsx
<PortalProvider enabled={false}>
  <MyPage />
</PortalProvider>
```

## usePortalConfig Hook

Components call `usePortalConfig()` to read the nearest `PortalProvider` values and merge them with local options. Local options take precedence over provider values.

## z-index Management

Portals escape parent stacking contexts but still need z-index ordering relative to each other. Use `registerLayer` / `unregisterLayer`:

```tsx
import { usePortal, registerLayer, unregisterLayer } from '@mfe/design-system/unstable/overlay-engine';

function Modal({ id, children }) {
  const { Portal } = usePortal();
  const [zIndex, setZIndex] = useState(0);

  useEffect(() => {
    const z = registerLayer(id, 'modal');
    setZIndex(z);
    return () => unregisterLayer(id);
  }, [id]);

  return (
    <Portal>
      <div style={{ zIndex }}>{children}</div>
    </Portal>
  );
}
```

Layer tiers: `dropdown: 200+`, `modal: 300+`, `toast: 400+`. Later overlays stack above earlier ones within the same tier.

## Testing

1. **Query portal content** -- look for `[data-portal="true"]` on `document.body`.
2. **Clean up** -- portals auto-remove on unmount, but add safety cleanup:
   ```ts
   afterEach(() => {
     document.querySelectorAll('[data-portal]').forEach((el) => el.remove());
   });
   ```
3. **Disable for simpler tests** -- wrap in `<PortalProvider enabled={false}>` to render inline.

## SSR

Portals require a DOM. During server-side rendering:

- `usePortal` defers container creation to `useEffect` (client-only).
- `Portal` returns `null` on the server.
- Use `<PortalProvider enabled={false}>` to render inline during SSR, then hydrate with portals on the client.
