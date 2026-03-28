# Portal Behavior

Standardized portal system for overlay components in the design system.

## When Components Use Portals

Overlay components render into a **portal** (a separate DOM subtree, typically appended to `document.body`) to escape parent `overflow: hidden`, `z-index` stacking contexts, and CSS containment. The following component categories use portals:

- **Modal overlays** — Dialog, Modal, DetailDrawer, FormDrawer
- **Popover-style** — Popover, Tooltip, Combobox dropdown
- **Tab panels** — Tabs (when rendering floating content)

Portal rendering is **enabled by default** for all overlay components. Pass `portal={false}` (or use `usePortal({ enabled: false })`) to render inline.

## usePortal Hook

```tsx
import { usePortal } from "@/internal/overlay-engine";

function MyOverlay({ children }) {
  const { Portal } = usePortal();
  return (
    <Portal>
      <div className="overlay">{children}</div>
    </Portal>
  );
}
```

### Options

| Option      | Type                    | Default         | Description                        |
| ----------- | ----------------------- | --------------- | ---------------------------------- |
| `enabled`   | `boolean`               | `true`          | Whether to render via a portal     |
| `container` | `HTMLElement \| null`    | `document.body` | Target container for the portal    |
| `id`        | `string`                | —               | HTML `id` for the portal container |

### Return Value

| Property        | Type                              | Description                              |
| --------------- | --------------------------------- | ---------------------------------------- |
| `Portal`        | `React.FC<{ children: ReactNode }>` | Wrapper component; renders children into the portal or inline |
| `portalElement` | `RefObject<HTMLDivElement \| null>`  | Ref to the portal container DOM element  |

When `enabled` is `false`, the `Portal` component renders children inline (no DOM reparenting). When `enabled` is `true`, a `<div data-portal="true">` is appended to the target container on mount and removed on unmount.

## PortalProvider — Global Configuration

Wrap your application (or a subtree) in `PortalProvider` to set portal defaults for all overlay components.

```tsx
import { PortalProvider } from "@/internal/overlay-engine";

function App() {
  return (
    <PortalProvider container={document.getElementById("portal-root")}>
      <MyPage />
    </PortalProvider>
  );
}
```

### Disabling Portals Globally

Useful for SSR, testing, or environments without a DOM:

```tsx
<PortalProvider enabled={false}>
  <MyPage />
</PortalProvider>
```

Components read the provider via `usePortalConfig()` and merge with local options.

## Testing with Portals

Portal containers are appended to `document.body` in jsdom. When testing overlay components:

1. **Query the portal container** — look for `[data-portal="true"]` on `document.body`.
2. **Clean up after tests** — portals are removed on unmount, but add a safety cleanup in `afterEach`:
   ```ts
   afterEach(() => {
     document.querySelectorAll("[data-portal]").forEach((el) => el.remove());
   });
   ```
3. **Disable portals for simpler tests** — wrap the component in `<PortalProvider enabled={false}>` to render inline, making assertions easier with standard `render()` queries.

## SSR Considerations

Portals require a DOM. During server-side rendering:

- `usePortal` does not create a container until the `useEffect` runs (client-side only).
- The `Portal` component returns `null` on the server (the ref is `null` before the effect runs).
- Use `<PortalProvider enabled={false}>` to render overlay content inline during SSR, then hydrate with portals on the client.

## z-index Management with registerLayer

Portals escape the parent stacking context but still need proper z-index ordering relative to each other. Use `registerLayer` / `unregisterLayer` from the overlay engine:

```tsx
import { usePortal, registerLayer, unregisterLayer } from "@/internal/overlay-engine";

function Modal({ id, children }) {
  const { Portal } = usePortal();
  const [zIndex, setZIndex] = useState(0);

  useEffect(() => {
    const z = registerLayer(id, "modal");
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

The layer stack assigns incrementing z-indices within each tier (`dropdown: 200+`, `modal: 300+`, `toast: 400+`). Later overlays always stack above earlier ones within the same tier.
