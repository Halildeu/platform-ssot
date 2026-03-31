# SchemaLens

**The schema explorer that works when your database has zero documentation.**

SchemaLens discovers foreign key relationships, visualizes schema structure, and generates interactive documentation for legacy databases with no FK constraints.

## Features

- **FK Discovery Engine** &mdash; 5+ techniques: name matching, alias patterns, common FK patterns, cross-schema PK/FK, data overlap validation
- **Interactive ER Diagrams** &mdash; Cytoscape.js with domain clustering, progressive disclosure (double-click to expand)
- **Find Join Path** &mdash; BFS-based path finder between any two tables with auto-generated SQL
- **Schema Health Score** &mdash; Automated quality analysis (0-100 score, A-F grade)
- **Column Search** &mdash; Find any column across 1500+ tables instantly
- **Impact Analysis** &mdash; "What breaks if I change this column?" with N-hop traversal
- **AI Chat** &mdash; Natural language questions about your schema (local + LLM)
- **Auto-Generated Descriptions** &mdash; Heuristic-based column/table descriptions
- **Schema Drift Detection** &mdash; Track changes between snapshots
- **Smart Query Suggestions** &mdash; Contextual SQL templates per table
- **Column Lineage** &mdash; Trace data flow through views and relationships
- **Export** &mdash; Mermaid ER, DBML, JSON
- **Annotations** &mdash; Collaborative table/column descriptions with tags

## Quick Start

### Standalone (Python CLI)

```bash
cd tools/schema-explorer/extractor
python extract.py \
  --type mssql \
  --host 10.9.193.201 --port 1433 \
  --db workcube_mikrolink --schema workcube_mikrolink \
  --user sa --password 'xxx' \
  --output schema_snapshot.json --pretty

cd ../frontend
npm install && npm run build
open dist/index.html
```

### Microservice (Spring Boot + React MFE)

```bash
# Backend (port 8096)
cd backend/schema-service
mvn package -DskipTests
AUTH_MODE=permitAll \
SCHEMA_MSSQL_HOST=localhost SCHEMA_MSSQL_PORT=1433 \
SCHEMA_MSSQL_DB=mydb SCHEMA_MSSQL_USERNAME=sa \
SCHEMA_MSSQL_PASSWORD=xxx SCHEMA_DEFAULT_SCHEMA=dbo \
java -jar target/schema-service-0.0.1-SNAPSHOT.jar

# Frontend (port 3008)
cd web/apps/mfe-schema-explorer
npm install && npm start
# Open http://localhost:3008
```

### Docker

```bash
cd backend
docker compose up schema-service -d
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/schema/snapshot` | GET | Full schema snapshot |
| `/api/v1/schema/tables/{name}` | GET | Single table detail |
| `/api/v1/schema/search/columns?q=` | GET | Column search |
| `/api/v1/schema/path?from=A&to=B` | GET | Find join path |
| `/api/v1/schema/health-score` | GET | Schema health analysis |
| `/api/v1/schema/impact/{name}` | GET | Impact analysis |
| `/api/v1/schema/drift` | GET | Schema drift detection |
| `/api/v1/schema/suggestions/{name}` | GET | Query suggestions |
| `/api/v1/schema/chat` | POST | AI chat |
| `/api/v1/schema/ai-descriptions/table/{name}` | GET | Auto descriptions |
| `/api/v1/schema/lineage/{table}/{col}` | GET | Column lineage |
| `/api/v1/schema/domains` | GET | Domain clusters |
| `/api/v1/schema/hubs` | GET | Hub tables |
| `/api/v1/schema/annotations` | GET/PUT | Annotations CRUD |

## Architecture

```
schema-service (Spring Boot, port 8096)
  SchemaExtractService         -- metadata extraction via JDBC
  RelationshipDiscoveryService -- 4 techniques + dedup + scoring
  DomainClusteringService      -- label propagation clustering
  PathFinderService            -- BFS join path finder
  SchemaHealthService          -- quality rules engine
  SchemaDriftService           -- snapshot comparison
  QuerySuggestionService       -- contextual SQL templates
  AiChatService                -- NL chat (local + LLM)
  AiDescriptionService         -- heuristic descriptions
  ColumnLineageService         -- view/FK lineage tracing
  AnnotationService            -- persist annotations

mfe-schema-explorer (React + Cytoscape.js, port 3008)
  SchemaGraph    -- ER diagram (domain map + neighborhood + expand)
  FindPath       -- join path finder with SQL
  HealthScore    -- health dashboard
  ColumnSearch   -- global column search
  TableDetail    -- columns, FK, refs, annotations, queries, lineage
  AiChat         -- natural language chat
  DriftDashboard -- schema change tracking
  ExportPanel    -- Mermaid, DBML, JSON export
```

## Supported Databases

- SQL Server (primary, tested with 1500+ tables)
- PostgreSQL (connector ready)

## Tech Stack

- **Backend**: Java 21, Spring Boot 3.5, JDBC, Spring Cache
- **Frontend**: React 18, TypeScript, Cytoscape.js, TanStack Query, Vite
- **Standalone**: Python 3.11, networkx (Louvain clustering)
- **Infra**: Docker, Eureka, Spring Cloud Gateway

## Differentiation

| vs | SchemaLens Advantage |
|----|---------------------|
| SchemaSpy | Doesn't crash on large DBs, discovers implicit FKs |
| ChartDB | Works on databases with zero FK constraints |
| DataHub | 3-command setup (vs Kubernetes), legacy DB focused |
| dbForge | Free, open source, community-driven |

## License

MIT License. See [LICENSE](LICENSE).
