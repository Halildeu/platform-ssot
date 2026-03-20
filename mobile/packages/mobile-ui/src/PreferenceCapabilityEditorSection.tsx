import { memo } from "react";
import { StyleSheet, View } from "react-native";

import { spacing } from "@platform-mobile/tokens";

import { PreferenceCapabilityCard } from "./PreferenceCapabilityCard";
import { PreferenceRemediationPanel } from "./PreferenceRemediationPanel";

type ActionConfig = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
};

type RemediationConfig = {
  title: string;
  detailLines?: string[];
  actions?: ActionConfig[];
} | null;

type PreferenceCapabilityEditorSectionProps = {
  title: string;
  description: string;
  statusPills?: Array<{
    label: string;
    tone: "ready" | "pending";
  }>;
  detailLines?: string[];
  error?: string | null;
  actions?: ActionConfig[];
  failedPanel?: RemediationConfig;
  conflictPanel?: RemediationConfig;
};

function PreferenceCapabilityEditorSectionComponent({
  title,
  description,
  statusPills = [],
  detailLines = [],
  error = null,
  actions = [],
  failedPanel = null,
  conflictPanel = null,
}: PreferenceCapabilityEditorSectionProps) {
  return (
    <PreferenceCapabilityCard
      title={title}
      description={description}
      statusPills={statusPills}
      detailLines={detailLines}
      error={error}
      actions={actions}
    >
      {failedPanel || conflictPanel ? (
        <View style={styles.sectionStack}>
          {failedPanel ? (
            <PreferenceRemediationPanel
              title={failedPanel.title}
              detailLines={failedPanel.detailLines}
              actions={failedPanel.actions}
            />
          ) : null}
          {conflictPanel ? (
            <PreferenceRemediationPanel
              title={conflictPanel.title}
              detailLines={conflictPanel.detailLines}
              actions={conflictPanel.actions}
            />
          ) : null}
        </View>
      ) : null}
    </PreferenceCapabilityCard>
  );
}

export const PreferenceCapabilityEditorSection = memo(PreferenceCapabilityEditorSectionComponent);

const styles = StyleSheet.create({
  sectionStack: {
    gap: spacing.sm,
  },
});
