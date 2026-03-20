import { StyleSheet, Text, View } from "react-native";

import { colors, spacing, typography } from "@platform-mobile/tokens";

type HomeHeroProps = {
  title: string;
  subtitle: string;
};

export function HomeHero({ title, subtitle }: HomeHeroProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>Expo bootstrap ready</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  eyebrow: {
    color: colors.primary,
    fontSize: typography.caption,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  subtitle: {
    color: colors.muted,
    fontSize: typography.body,
    lineHeight: 24,
  },
  title: {
    color: colors.text,
    fontSize: typography.hero,
    fontWeight: "800",
    lineHeight: 38,
  },
});
