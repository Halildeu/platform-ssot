import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, spacing, typography } from "@platform-mobile/tokens";

type InlineToastProps = {
  title: string;
  message: string;
  tone?: "success" | "warning";
  actionLabel?: string;
  dismissLabel?: string;
  onAction?: () => void;
  onDismiss?: () => void;
};

function InlineToastComponent({
  title,
  message,
  tone = "success",
  actionLabel,
  dismissLabel = "Dismiss",
  onAction,
  onDismiss,
}: InlineToastProps) {
  return (
    <View style={[styles.container, tone === "warning" ? styles.warning : styles.success]}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
      <View style={styles.actions}>
        {actionLabel && onAction ? (
          <Pressable onPress={onAction} style={styles.actionButton}>
            <Text style={styles.actionText}>{actionLabel}</Text>
          </Pressable>
        ) : null}
        {onDismiss ? (
          <Pressable onPress={onDismiss} style={styles.dismissButton}>
            <Text style={styles.dismissText}>{dismissLabel}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

export const InlineToast = memo(InlineToastComponent);

const styles = StyleSheet.create({
  actionButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs + 2,
  },
  actionText: {
    color: colors.primary,
    fontSize: typography.caption,
    fontWeight: "700",
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  container: {
    borderRadius: 18,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.md,
  },
  content: {
    gap: spacing.xs,
  },
  dismissButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs + 2,
  },
  dismissText: {
    color: colors.muted,
    fontSize: typography.caption,
    fontWeight: "700",
  },
  message: {
    color: colors.text,
    fontSize: typography.caption,
    lineHeight: 18,
  },
  success: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  title: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "700",
  },
  warning: {
    backgroundColor: colors.warningSoft,
    borderColor: colors.danger,
  },
});
