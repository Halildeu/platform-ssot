import { beforeEach, describe, expect, it } from "vitest";

import {
  isFavoriteReport,
  listSavedFiltersForReport,
  readReportPreferences,
  removeLocalReportFilterPreset,
  saveLocalReportFilterPreset,
  toggleFavoriteReport,
} from "./report-preferences";

describe("report-preferences", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("favori raporlari localStorage icinde toggle eder", () => {
    expect(isFavoriteReport("audit-activity")).toBe(false);

    toggleFavoriteReport("audit-activity");
    expect(isFavoriteReport("audit-activity")).toBe(true);

    toggleFavoriteReport("audit-activity");
    expect(isFavoriteReport("audit-activity")).toBe(false);
  });

  it("web presetlerini kaydeder ve siler", () => {
    const preset = saveLocalReportFilterPreset("audit-activity", "web", {
      search: "session",
      level: "WARN",
    });

    expect(listSavedFiltersForReport("audit-activity", "web")).toHaveLength(1);
    expect(readReportPreferences().savedFilters[0]?.name).toBe(preset.name);

    removeLocalReportFilterPreset(preset.id);
    expect(listSavedFiltersForReport("audit-activity", "web")).toHaveLength(0);
  });
});
