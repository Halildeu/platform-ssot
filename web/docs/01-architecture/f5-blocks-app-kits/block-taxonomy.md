# Block Taxonomy

## Categories

### Dashboard (5 blocks)
| Block | Description | Composition |
|-------|-------------|-------------|
| KPIDashboardBlock | 4-column KPI metric cards | Pure React |
| MetricStripBlock | Horizontal stat strip | Pure React |
| ChartGridBlock | 2x2 chart container grid | Children slots |
| AnalyticsOverviewBlock | Period + metrics + chart | Children slots |
| DashboardPageTemplate | Full dashboard page | Composes above |

### CRUD (4 blocks)
| Block | Description | Composition |
|-------|-------------|-------------|
| DataListBlock | Searchable, paginated list | Generic `<T>` |
| DetailViewBlock | Sectioned field display | Pure React |
| CreateEditFormBlock | Form with validation | Pure React |
| CrudPageTemplate | Full CRUD flow | State machine |

### Admin (3 blocks)
| Block | Description | Composition |
|-------|-------------|-------------|
| SettingsPageBlock | Sectioned settings form | Text/toggle/select |
| UserManagementBlock | User list + roles | Avatar + role select |
| SettingsPageTemplate | Full settings page | Composes above |

### Analytics (1 block)
| Block | Description | Composition |
|-------|-------------|-------------|
| AnalyticsOverviewBlock | Period + metrics + chart | Slot-based |

### Composition (1 component)
| Component | Description |
|-----------|-------------|
| PageBuilder | Renders PageComposition from registry |

## Total: 14 blocks + 3 templates + 1 composition engine

## Integration with X Suite
Blocks compose with X packages via children/slots:
- ChartGridBlock → `<BarChart>` / `<LineChart>` as children
- DataListBlock → Can be replaced with `<EntityGridTemplate>` for enterprise use
- Dashboard metrics → `<KPICard>` / `<StatWidget>` for rich visualization

## Registry Pattern
```typescript
import { createBlockRegistry } from '@mfe/blocks';

const registry = createBlockRegistry();
registry.register({
  id: 'kpi-dashboard',
  name: 'KPI Dashboard',
  category: 'dashboard',
  component: KPIDashboardBlock,
  tags: ['metrics', 'kpi', 'overview'],
});
```
