# Backend Integration Rules

## AG Grid SSRM — Backend Contract

All grid endpoints that support Server-Side Row Model MUST accept these query parameters:

### Standard Parameters
```
page=1              — 1-based page number
pageSize=25         — rows per page
search=text         — quick filter text
sort=col,asc;col2,desc — semicolon-separated sort
status=ACTIVE       — domain-specific filter
role=ADMIN          — domain-specific filter
advancedFilter=json — URL-encoded JSON filter model
dataSource=client   — "client" = return all rows unpaged
```

### Grouping Parameters (SSRM Row Grouping)
```
rowGroupCols=role,status   — comma-separated column IDs being grouped
groupKeys=ADMIN,ACTIVE     — comma-separated group drill-down path
```

**Group-level request**: `rowGroupCols` has more items than `groupKeys`
→ Server returns GROUP BY results for the next grouping level
→ Response: `{ items: [{name: "ADMIN (2)", role: "ADMIN", ...}], total: 2 }`

**Leaf-level request**: `rowGroupCols.length === groupKeys.length`
→ Server returns filtered rows (WHERE role='ADMIN' AND status='ACTIVE')
→ Response: normal paginated rows

### Aggregation Parameters (SSRM Value Aggregation)
```
valueCols=sessionTimeoutMinutes:sum,salary:avg  — col:aggFunc pairs
```

Server must include aggregate values in group-level responses:
```json
{
  "items": [
    { "name": "ADMIN (2)", "role": "ADMIN", "sessionTimeoutMinutes": 30 }
  ],
  "total": 2,
  "aggData": { "sessionTimeoutMinutes": 30 }
}
```

### Pivot Parameters (SSRM Pivot Mode)
```
pivotMode=true
pivotCols=status                — columns being pivoted
valueCols=salary:sum            — values to aggregate per pivot
```

Server returns pivoted response with secondary column definitions:
```json
{
  "items": [
    { "role": "ADMIN", "ACTIVE_salary": 5000, "INACTIVE_salary": 3000 }
  ],
  "secondaryColumns": ["ACTIVE_salary", "INACTIVE_salary"]
}
```

## Response Format
```json
{
  "items": [...],
  "total": 1200,
  "page": 1,
  "pageSize": 25
}
```

## Backend Endpoints
| Service | Port | Base Path | Grid Endpoint |
|---------|------|-----------|---------------|
| user-service | 8089 | /api/v1/users | GET /api/v1/users |
| report-service | 8095 | /api/v1/reports | GET /api/v1/reports/{key}/data |
| api-gateway | 8080 | /api | Proxies all |

## Proxy Mapping (Vite → Backend)
```
/api/v1/users      → localhost:8089
/api/v1/reports    → localhost:8095
/api/v1/dashboards → localhost:8095
/api/v1/authz      → localhost:8090
/api/services      → Vite plugin (no backend)
/api               → localhost:8080 (gateway fallback)
```

## Docker
```bash
cd ~/Documents/dev/backend
docker compose up -d              # start all
docker compose up -d --build svc  # rebuild + restart one
docker compose logs --tail 50 svc # check logs
```
