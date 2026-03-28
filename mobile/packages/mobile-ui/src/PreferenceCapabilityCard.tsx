import { memo, type ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors, spacing, typography } from "@platform-mobile/tokens";

import { ActionButton } from "./ActionButton";
import { InfoCard } from "./InfoCard";
import { StatusPill } from "./StatusPill";

type PreferenceCapabilityCardProps = {
  title: string;
  description: string;
  statusPills?: Array<{
    label: string;
    tone: "ready" | "pending";
  }>;
  detailLines?: string[];
  error?: string | null;
  actions?: Array<{
    label: string;
    onPress: () => void;
    variant?: "primary" | "secondary";
    disabled?: boolean;
  }>;
  children?: ReactNode;
};

function PreferenceCapabilityCardComponent({
  title,
  description,
  statusPills = [],
  detailLines = [],
  error = null,
  actions = [],
  children = null,
}: PreferenceCapabilityCardProps) {
  return (
    <InfoCard title={title} description={description}>
      {statusPills.length > 0 ? (
        <View style={styles.statusRow}>
          {statusPills.map((pill) => (
            <StatusPill key={`${title}-${pill.label}`} label={pill.label} tone={pill.tone} />
          ))}
        </View>
      ) : null}
      {detailLines.map((line) => (
        <Text key={`${title}-${line}`} style={styles.metaText}>
          {line}
        </Text>
      ))}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
    </InfoCard>
  );
}

export const PreferenceCapabilityCard = memo(PreferenceCapabilityCardComponent);

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.caption,
    lineHeight: 18,
  },
  metaText: {
    color: colors.muted,
    fontSize: typography.caption,
    lineHeight: 18,
  },
  statusRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
});
