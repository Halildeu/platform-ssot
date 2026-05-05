package com.example.report.registry;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests for {@link ColumnDefinition} — hidden and exportOnly fields (Codex 019df4ed
 * iter-4 absorb).
 */
class ColumnDefinitionTest {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    @DisplayName("Default values: sensitive=false, hidden=false, exportOnly=false")
    void defaultsViaCanonicalConstructor() {
        ColumnDefinition col = new ColumnDefinition("foo", "Foo", "text", 100, false, false, false);
        assertFalse(col.sensitive());
        assertFalse(col.hidden());
        assertFalse(col.exportOnly());
    }

    @Test
    @DisplayName("Backward-compat 5-arg constructor sets hidden=false, exportOnly=false")
    void backwardCompatConstructor() {
        ColumnDefinition col = new ColumnDefinition("foo", "Foo", "text", 100, false);
        assertFalse(col.hidden(), "hidden must default to false");
        assertFalse(col.exportOnly(), "exportOnly must default to false");
    }

    @Test
    @DisplayName("Type defaults to 'text' when blank")
    void typeDefault() {
        ColumnDefinition col = new ColumnDefinition("foo", "Foo", null, 100, false);
        assertEquals("text", col.type());
    }

    @Test
    @DisplayName("Width defaults to 150 when null/non-positive")
    void widthDefault() {
        ColumnDefinition c1 = new ColumnDefinition("foo", "Foo", "text", null, false);
        ColumnDefinition c2 = new ColumnDefinition("foo", "Foo", "text", 0, false);
        ColumnDefinition c3 = new ColumnDefinition("foo", "Foo", "text", -10, false);
        assertEquals(150, c1.width());
        assertEquals(150, c2.width());
        assertEquals(150, c3.width());
    }

    @Test
    @DisplayName("Blank field throws IllegalArgumentException")
    void blankFieldRejected() {
        assertThrows(IllegalArgumentException.class,
                () -> new ColumnDefinition("", "Foo", "text", 100, false));
        assertThrows(IllegalArgumentException.class,
                () -> new ColumnDefinition(null, "Foo", "text", 100, false));
    }

    @Test
    @DisplayName("JSON without hidden/exportOnly defaults both to false (backward-compat)")
    void jsonOldFormatDefaults() throws Exception {
        String json = """
                {
                  "field": "amount",
                  "headerName": "Tutar",
                  "type": "number",
                  "width": 130,
                  "sensitive": false
                }
                """;
        ColumnDefinition col = objectMapper.readValue(json, ColumnDefinition.class);
        assertEquals("amount", col.field());
        assertFalse(col.hidden());
        assertFalse(col.exportOnly());
    }

    @Test
    @DisplayName("JSON with hidden=true and exportOnly=true is parsed correctly")
    void jsonNewFormatHiddenExportOnly() throws Exception {
        String json = """
                {
                  "field": "kur_tarihi",
                  "headerName": "Kur Tarihi",
                  "type": "date",
                  "width": 110,
                  "sensitive": false,
                  "hidden": true,
                  "exportOnly": true
                }
                """;
        ColumnDefinition col = objectMapper.readValue(json, ColumnDefinition.class);
        assertTrue(col.hidden());
        assertTrue(col.exportOnly());
    }

    @Test
    @DisplayName("JSON with only hidden=true (no exportOnly) sets exportOnly=false")
    void jsonHiddenOnly() throws Exception {
        String json = """
                {
                  "field": "card_row_id",
                  "headerName": "Satır ID",
                  "type": "number",
                  "width": 80,
                  "sensitive": false,
                  "hidden": true
                }
                """;
        ColumnDefinition col = objectMapper.readValue(json, ColumnDefinition.class);
        assertTrue(col.hidden());
        assertFalse(col.exportOnly(), "exportOnly should default to false when omitted");
    }
}
