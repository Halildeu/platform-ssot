import { memo, type ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors, spacing, typography } from "@platform-mobile/tokens";

import { ActionButton } from "./ActionButton";

type PreferenceRemediationPanelProps = {
  title: string;
  detailLines?: string[];
  actions?: Array<{
    label: string;
    onPress: () => void;
    variant?: "primary" | "secondary";
    disabled?: boolean;
  }>;
  children?: ReactNode;
};

function PreferenceRemediationPanelComponent({
  title,
  detailLines = [],
  actions = [],
  children = null,
}: PreferenceRemediationPanelProps) {
  return (
    <View style={styles.panel}>
      <Text style={styles.title}>{title}</Text>
      {detailLines.map((line) => (
        <Text key={`${title}-${line}`} style={styles.metaText}>
          {line}
        </Text>
      ))}
      {actions.length > 0 ? (
        <View style={styles.buttonRow}>
          {actions.map((action) => (
            <ActionButton
              key={`${title}-${action.label}`}
              label={action.label}
              onPress={action.onPress}
              variant={action.variant}
              disabled={action.disabled}
            />
          ))}
        </View>
      ) : null}
      {children}
    </View>
  );
}

export const PreferenceRemediationPanel = memo(PreferenceRemediationPanelComponent);

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  metaText: {
    color: colors.muted,
    fontSize: typography.caption,
    lineHeight: 18,
  },
  panel: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 16,
    gap: spacing.xs,
    padding: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "700",
  },
});
