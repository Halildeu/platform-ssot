import React from "react";
import { Text } from "@mfe/design-system";
import { useDesignLab } from "../DesignLabProvider";
import type { PlaygroundControl } from "./usePlaygroundState";

/* ------------------------------------------------------------------ */
/*  PlaygroundControls — Prop editor panel                             */
/*                                                                     */
/*  Renders typed controls for each prop:                              */
/*  - select → radio group or dropdown                                 */
/*  - boolean → toggle switch                                          */
/*  - text → text input                                                */
/*  - number → number input                                            */
/* ------------------------------------------------------------------ */

type PlaygroundControlsProps = {
  controls: PlaygroundControl[];
  propValues: Record<string, string | boolean | number>;
  onPropChange: (name: string, value: string | boolean | number) => void;
  onReset: () => void;
};

export const PlaygroundControls: React.FC<PlaygroundControlsProps> = ({
  controls,
  propValues,
  onPropChange,
  onReset,
}) => {
  const { t } = useDesignLab();
  const variantControls = controls.filter((c) => c.group === "variant");
  const stateControls = controls.filter((c) => c.group === "state");
  const propControls = controls.filter((c) => c.group === "prop");

  return (
    <div className="flex flex-col gap-5">
      {/* Variant controls */}
      {variantControls.length > 0 && (
        <ControlGroup label={t("designlab.playground.group.variants")}>
          {variantControls.map((control) => (
            <ControlField
              key={control.name}
              control={control}
              value={propValues[control.name]}
              onChange={(v) => onPropChange(control.name, v)}
            />
          ))}
        </ControlGroup>
      )}

      {/* State toggles */}
      {stateControls.length > 0 && (
        <ControlGroup label={t("designlab.playground.group.state")}>
          {stateControls.map((control) => (
            <ControlField
              key={control.name}
              control={control}
              value={propValues[control.name]}
              onChange={(v) => onPropChange(control.name, v)}
            />
          ))}
        </ControlGroup>
      )}

      {/* Other props */}
      {propControls.length > 0 && (
        <ControlGroup label={t("designlab.playground.group.props")}>
          {propControls.map((control) => (
            <ControlField
              key={control.name}
              control={control}
              value={propValues[control.name]}
              onChange={(v) => onPropChange(control.name, v)}
            />
          ))}
        </ControlGroup>
      )}

      {/* Reset button */}
      <button
        type="button"
        onClick={onReset}
        className="mt-2 rounded-xl border border-border-subtle px-3 py-2 text-xs font-medium text-text-secondary transition hover:bg-surface-muted"
      >
        {t("designlab.playground.resetAll")}
      </button>
    </div>
  );
};

/* ---- Sub-components ---- */

function ControlGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Text
        as="div"
        variant="secondary"
        className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.18em]"
      >
        {label}
      </Text>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function ControlField({
  control,
  value,
  onChange,
}: {
  control: PlaygroundControl;
  value: string | boolean | number | undefined;
  onChange: (value: string | boolean | number) => void;
}) {
  switch (control.kind) {
    case "select":
      return (
        <SelectControl
          name={control.name}
          options={control.options ?? []}
          value={String(value ?? "")}
          onChange={(v) => onChange(v)}
        />
      );

    case "boolean":
      return (
        <BooleanControl
          name={control.name}
          value={Boolean(value)}
          onChange={(v) => onChange(v)}
        />
      );

    case "number":
      return (
        <NumberControl
          name={control.name}
          value={Number(value ?? 0)}
          onChange={(v) => onChange(v)}
        />
      );

    case "text":
    default:
      return (
        <TextControl
          name={control.name}
          value={String(value ?? "")}
          onChange={(v) => onChange(v)}
        />
      );
  }
}

/* ---- Typed controls ---- */

function SelectControl({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Text className="mb-1 block text-xs font-medium text-text-primary">
        {name}
      </Text>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={[
              "rounded-lg px-2.5 py-1 text-xs font-medium transition",
              value === opt
                ? "bg-action-primary text-white shadow-xs"
                : "bg-surface-muted text-text-secondary hover:bg-surface-canvas",
            ].join(" ")}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function BooleanControl({
  name,
  value,
  onChange,
}: {
  name: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2.5 py-0.5">
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={[
          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors",
          value ? "bg-action-primary" : "bg-surface-muted",
        ].join(" ")}
      >
        <span
          className={[
            "pointer-events-none inline-block h-4 w-4 translate-y-0.5 rounded-full bg-[var(--surface-default,#fff)] shadow-xs transition-transform",
            value ? "translate-x-4" : "translate-x-0.5",
          ].join(" ")}
        />
      </button>
      <Text className="text-xs font-medium text-text-primary">{name}</Text>
    </label>
  );
}

function NumberControl({
  name,
  value,
  onChange,
}: {
  name: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <Text className="mb-1 block text-xs font-medium text-text-primary">
        {name}
      </Text>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="h-8 w-full rounded-lg border border-border-subtle bg-surface-canvas px-2.5 text-xs text-text-primary focus:border-action-primary focus:outline-hidden focus:ring-1 focus:ring-action-primary/20"
      />
    </div>
  );
}

function TextControl({
  name,
  value,
  onChange,
}: {
  name: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Text className="mb-1 block text-xs font-medium text-text-primary">
        {name}
      </Text>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-full rounded-lg border border-border-subtle bg-surface-canvas px-2.5 text-xs text-text-primary focus:border-action-primary focus:outline-hidden focus:ring-1 focus:ring-action-primary/20"
      />
    </div>
  );
}
