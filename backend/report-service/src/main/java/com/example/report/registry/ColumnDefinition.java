package com.example.report.registry;

public record ColumnDefinition(
        String field,
        String headerName,
        String type,
        Integer width,
        boolean sensitive,
        boolean hidden,
        boolean exportOnly
) {
    public ColumnDefinition {
        if (field == null || field.isBlank()) {
            throw new IllegalArgumentException("Column field must not be blank");
        }
        if (type == null || type.isBlank()) {
            type = "text";
        }
        if (width == null || width <= 0) {
            width = 150;
        }
    }

    /**
     * Backward-compatible constructor (5-arg) for older JSON definitions
     * that don't specify hidden/exportOnly. Defaults: hidden=false, exportOnly=false.
     * Jackson uses the canonical 7-arg constructor when JSON has the new fields.
     */
    public ColumnDefinition(String field, String headerName, String type, Integer width, boolean sensitive) {
        this(field, headerName, type, width, sensitive, false, false);
    }
}
