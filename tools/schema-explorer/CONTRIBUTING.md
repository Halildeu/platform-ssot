# Contributing to SchemaLens

We welcome contributions! Here's how to get started.

## Development Setup

### Prerequisites
- Java 21+
- Node.js 20+
- Python 3.11+ (for standalone extractor)
- Docker (optional, for MSSQL connector)

### Backend
```bash
cd backend/schema-service
mvn compile
mvn test
```

### Frontend
```bash
cd web/apps/mfe-schema-explorer
npm install
npm start        # dev server on :3008
npm run build    # production build
```

### Standalone
```bash
cd tools/schema-explorer/extractor
pip install networkx
python extract.py --help
```

## Adding a New Discovery Technique

1. Create `backend/schema-service/src/main/java/com/example/schema/service/discovery/MyTechniqueService.java`
2. Implement discovery logic returning `List<Relationship>`
3. Wire it into `RelationshipDiscoveryService.discoverAll()`
4. Add unit tests
5. Update confidence scoring if needed

## Adding a New Database Connector

### Python (standalone)
1. Create `tools/schema-explorer/extractor/connectors/mydb.py`
2. Extend `BaseConnector` from `connectors/base.py`
3. Implement all abstract methods

### Java (microservice)
1. Add JDBC driver to `pom.xml`
2. Create new `DataSource` config
3. Adapt SQL queries in `SchemaExtractService`

## Code Style

- Java: follow existing Spring Boot patterns, records for DTOs
- TypeScript: functional components, hooks, no class components
- Python: type hints, docstrings, 800 line max per file
- CSS: `se-` prefix for all class names (MFE isolation)

## Pull Request Process

1. Create a feature branch from `main`
2. Write/update tests
3. Ensure `mvn test` passes
4. Ensure `npm run build` passes
5. Update README if adding new features
6. Submit PR with clear description

## Reporting Issues

Use GitHub Issues with these labels:
- `bug` - something broken
- `feature` - new capability
- `discovery` - new FK detection technique
- `connector` - new database support
- `docs` - documentation improvement
