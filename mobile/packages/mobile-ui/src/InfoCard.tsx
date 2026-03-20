import type { PropsWithChildren } from "react";
import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors, shadows, spacing, typography } from "@platform-mobile/tokens";

type InfoCardProps = PropsWithChildren<{
  title: string;
  description: string;
}>;

function InfoCardComponent({ title, description, children }: InfoCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

export const InfoCard = memo(InfoCardComponent);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.lg,
    ...shadows.card,
  },
  content: {
    gap: spacing.sm,
  },
  description: {
    color: colors.muted,
    fontSize: typography.body,
    lineHeight: 22,
  },
  title: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: "700",
  },
});
