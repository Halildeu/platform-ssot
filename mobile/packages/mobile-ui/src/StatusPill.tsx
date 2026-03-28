import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors, spacing, typography } from "@platform-mobile/tokens";

type StatusPillProps = {
  label: string;
  tone: "ready" | "pending";
};

function StatusPillComponent({ label, tone }: StatusPillProps) {
  return (
    <View style={[styles.pill, tone === "ready" ? styles.pillReady : styles.pillPending]}>
      <Text style={styles.pillText}>{label}</Text>
    </View>
  );
}

export const StatusPill = memo(StatusPillComponent);

const styles = StyleSheet.create({
  pill: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
  },
  pillPending: {
    backgroundColor: colors.warningSoft,
  },
  pillReady: {
    backgroundColor: colors.primarySoft,
  },
  pillText: {
    color: colors.text,
    fontSize: typography.caption,
    fontWeight: "700",
  },
});
