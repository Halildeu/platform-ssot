import { memo } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

import { colors, spacing, typography } from "@platform-mobile/tokens";

type ActionButtonProps = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
};

function ActionButtonComponent({
  label,
  onPress,
  variant = "primary",
  disabled = false,
}: ActionButtonProps) {
  return (
    <Pressable
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === "secondary" ? styles.buttonSecondary : styles.buttonPrimary,
        pressed && !disabled ? styles.buttonPressed : null,
        disabled ? styles.buttonDisabled : null,
      ]}
    >
      <Text style={variant === "secondary" ? styles.buttonSecondaryText : styles.buttonPrimaryText}>
        {label}
      </Text>
    </Pressable>
  );
}

export const ActionButton = memo(ActionButtonComponent);

const styles = StyleSheet.create({
  button: {
    borderRadius: 14,
    minWidth: 148,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
  },
  buttonPrimaryText: {
    color: colors.surface,
    fontSize: typography.body,
    fontWeight: "700",
    textAlign: "center",
  },
  buttonSecondary: {
    backgroundColor: colors.primarySoft,
  },
  buttonSecondaryText: {
    color: colors.primary,
    fontSize: typography.body,
    fontWeight: "700",
    textAlign: "center",
  },
});
