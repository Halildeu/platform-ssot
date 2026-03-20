import type { PropsWithChildren } from "react";
import { memo } from "react";
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";

import { colors, spacing } from "@platform-mobile/tokens";

function ScreenScaffoldComponent({ children }: PropsWithChildren) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>{children}</ScrollView>
    </SafeAreaView>
  );
}

export const ScreenScaffold = memo(ScreenScaffoldComponent);

const styles = StyleSheet.create({
  content: {
    backgroundColor: colors.background,
    gap: spacing.lg,
    padding: spacing.lg,
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
});
