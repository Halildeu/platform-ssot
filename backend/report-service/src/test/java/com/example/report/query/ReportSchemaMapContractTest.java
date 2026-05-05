package com.example.report.query;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.regex.Pattern;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;
import org.springframework.util.StreamUtils;

import static org.assertj.core.api.Assertions.assertThat;

class ReportSchemaMapContractTest {

    private static final Pattern TABLE_REF = Pattern.compile(
            "\\[(\\{schema}|\\{companySchema}|workcube_mikrolink)]\\.\\[([A-Z0-9_]+)]");

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    @DisplayName("fin-muhasebe-detay schema-map matches branch SQL schema placeholders")
    void muavinSchemaMapMatchesBranchSql() throws IOException {
        String branchSql = read("reports/sql/fin-muhasebe-detay.branch.sql");
        JsonNode schemaMap = objectMapper.readTree(
                read("reports/schema-maps/fin-muhasebe-detay.schema-map.json"));

        assertThat(schemaMap.path("report").asText()).isEqualTo("fin-muhasebe-detay");
        assertThat(schemaMap.path("requiresSingleCompany").asBoolean()).isTrue();

        Set<String> actualRefs = extractSqlRefs(branchSql);
        Set<String> mappedRefs = extractMapRefs(schemaMap.path("tables"));

        assertThat(mappedRefs).containsExactlyInAnyOrderElementsOf(actualRefs);
        assertThat(mappedRefs).contains(
                "{companySchema}/SETUP_PROCESS_CAT",
                "{companySchema}/CREDIT_CARD_BANK_EXPENSE_MONEY",
                "{companySchema}/TAHAKKUK_PLAN_MONEY");
        assertThat(mappedRefs).contains(
                "workcube_mikrolink/MONEY_HISTORY",
                "workcube_mikrolink/MONEY_TABLES");
    }

    private Set<String> extractSqlRefs(String sql) {
        var matcher = TABLE_REF.matcher(sql);
        Set<String> refs = new LinkedHashSet<>();
        while (matcher.find()) {
            refs.add(matcher.group(1) + "/" + matcher.group(2));
        }
        return refs;
    }

    private Set<String> extractMapRefs(JsonNode tables) {
        Set<String> refs = new LinkedHashSet<>();
        for (JsonNode table : tables) {
            String schema = table.hasNonNull("placeholder")
                    ? table.path("placeholder").asText()
                    : table.path("literalSchema").asText();
            refs.add(schema + "/" + table.path("name").asText());
        }
        return refs;
    }

    private String read(String path) throws IOException {
        ClassPathResource res = new ClassPathResource(path);
        try (var in = res.getInputStream()) {
            return StreamUtils.copyToString(in, StandardCharsets.UTF_8);
        }
    }
}
