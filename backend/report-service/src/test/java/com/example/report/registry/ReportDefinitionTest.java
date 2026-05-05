package com.example.report.registry;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests for {@link ReportDefinition} — file-based SQL refs and outer wrapper
 * (Codex 019df4ed iter-4 absorb).
 */
class ReportDefinitionTest {

    private final ObjectMapper objectMapper = new ObjectMapper();

    private ColumnDefinition col() {
        return new ColumnDefinition("id", "ID", "number", 80, false);
    }

    @Test
    @DisplayName("hasSourceQueryFile returns true when sourceQueryFile is set")
    void hasSourceQueryFileTrue() {
        ReportDefinition def = new ReportDefinition(
                "key", "1.0", "Title", "Desc", "Cat",
                null, "dbo", "static", null,
                null, "sql/test.sql", null, null,
                List.of(col()), null, null, null);
        assertTrue(def.hasSourceQueryFile());
        assertTrue(def.hasSourceQuery(), "hasSourceQuery should be true with sourceQueryFile");
    }

    @Test
    @DisplayName("hasOuterQueryFile returns true when outerQueryFile is set")
    void hasOuterQueryFileTrue() {
        ReportDefinition def = new ReportDefinition(
                "key", "1.0", "Title", "Desc", "Cat",
                null, "dbo", "static", null,
                null, "sql/test.sql", "sql/test.outer.sql", "BRANCH_UNION_THEN_OUTER",
                List.of(col()), null, null, null);
        assertTrue(def.hasOuterQueryFile());
        assertTrue(def.isBranchUnionThenOuter());
    }

    @Test
    @DisplayName("isBranchUnionThenOuter is false for null queryShape")
    void isBranchUnionThenOuterFalseDefault() {
        ReportDefinition def = new ReportDefinition(
                "key", "1.0", "Title", "Desc", "Cat",
                "TABLE", "dbo", "static", null,
                null, null, null, null,
                List.of(col()), null, null, null);
        assertFalse(def.isBranchUnionThenOuter());
    }

    @Test
    @DisplayName("Validation: must have one of source / sourceQuery / sourceQueryFile")
    void validationRequiresOneSource() {
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> new ReportDefinition(
                        "key", "1.0", "Title", "Desc", "Cat",
                        null, "dbo", "static", null,
                        null, null, null, null,
                        List.of(col()), null, null, null));
        assertTrue(ex.getMessage().contains("must have one of"),
                "expected 'must have one of' in message: " + ex.getMessage());
    }

    @Test
    @DisplayName("Backward-compat 14-arg constructor sets new fields to null")
    void backwardCompat14ArgConstructor() {
        ReportDefinition def = new ReportDefinition(
                "key", "1.0", "Title", "Desc", "Cat",
                "TABLE", "dbo", "static", null, null,
                List.of(col()), null, null, null);
        assertNull(def.sourceQueryFile());
        assertNull(def.outerQueryFile());
        assertNull(def.queryShape());
        assertFalse(def.isBranchUnionThenOuter());
    }

    @Test
    @DisplayName("JSON parse: sourceQueryFile + outerQueryFile + queryShape preserved")
    void jsonParseFileBasedSql() throws Exception {
        String json = """
                {
                  "key": "test-muavin",
                  "version": "3.0",
                  "title": "Test",
                  "description": "Desc",
                  "category": "Cat",
                  "source": "TBL",
                  "sourceSchema": "dbo",
                  "schemaMode": "yearly",
                  "yearColumn": "action_date",
                  "sourceQueryFile": "sql/test.branch.sql",
                  "outerQueryFile": "sql/test.outer.sql",
                  "queryShape": "BRANCH_UNION_THEN_OUTER",
                  "columns": [
                    { "field": "id", "headerName": "ID", "type": "number", "width": 80, "sensitive": false }
                  ],
                  "defaultSort": "id",
                  "defaultSortDirection": "ASC",
                  "access": null
                }
                """;
        ReportDefinition def = objectMapper.readValue(json, ReportDefinition.class);
        assertEquals("sql/test.branch.sql", def.sourceQueryFile());
        assertEquals("sql/test.outer.sql", def.outerQueryFile());
        assertEquals("BRANCH_UNION_THEN_OUTER", def.queryShape());
        assertTrue(def.isBranchUnionThenOuter());
        assertTrue(def.hasOuterQueryFile());
    }

    @Test
    @DisplayName("JSON parse: legacy v2 without new fields still works")
    void jsonParseLegacyV2() throws Exception {
        String json = """
                {
                  "key": "test-legacy",
                  "version": "2.0",
                  "title": "Legacy",
                  "description": "Desc",
                  "category": "Cat",
                  "source": "TBL",
                  "sourceSchema": "dbo",
                  "schemaMode": "static",
                  "sourceQuery": "SELECT * FROM dbo.TBL",
                  "columns": [
                    { "field": "id", "headerName": "ID", "type": "number", "width": 80, "sensitive": false }
                  ],
                  "defaultSort": "id",
                  "defaultSortDirection": "ASC"
                }
                """;
        ReportDefinition def = objectMapper.readValue(json, ReportDefinition.class);
        assertEquals("test-legacy", def.key());
        assertNull(def.sourceQueryFile());
        assertNull(def.outerQueryFile());
        assertNull(def.queryShape());
        assertFalse(def.isBranchUnionThenOuter());
    }
}
