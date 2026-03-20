/* ------------------------------------------------------------------ */
/*  interactionScenarios — Pre-built cross-component interaction defs  */
/* ------------------------------------------------------------------ */

export type InteractionNode = {
  id: string;
  componentName: string;
  props: Record<string, unknown>;
  x: number;
  y: number;
};

export type InteractionWire = {
  id: string;
  from: { nodeId: string; event: string };
  to: { nodeId: string; prop: string };
  transform?: string; // e.g., "value", "!value" (negate), "value.length > 0"
};

export type InteractionScenario = {
  id: string;
  name: string;
  description: string;
  nodes: InteractionNode[];
  wires: InteractionWire[];
};

export const SCENARIOS: InteractionScenario[] = [
  {
    id: "select-filters-list",
    name: "Select Filters List",
    description: "A Select dropdown filters items displayed in a list below",
    nodes: [
      { id: "select1", componentName: "Select", props: { placeholder: "Filter by category...", options: [{ value: "All", label: "All" }, { value: "Active", label: "Active" }, { value: "Archived", label: "Archived" }] }, x: 50, y: 30 },
      { id: "badge1", componentName: "Badge", props: { children: "Active: 3" }, x: 50, y: 120 },
      { id: "alert1", componentName: "Alert", props: { children: "Showing filtered results", variant: "info" }, x: 50, y: 200 },
    ],
    wires: [
      { id: "w1", from: { nodeId: "select1", event: "onChange" }, to: { nodeId: "badge1", prop: "children" }, transform: "value" },
      { id: "w2", from: { nodeId: "select1", event: "onChange" }, to: { nodeId: "alert1", prop: "children" }, transform: "value" },
    ],
  },
  {
    id: "checkbox-enables-button",
    name: "Checkbox Enables Button",
    description: "A checkbox toggles the disabled state of a submit button",
    nodes: [
      { id: "checkbox1", componentName: "Checkbox", props: { children: "I agree to the terms" }, x: 50, y: 30 },
      { id: "button1", componentName: "Button", props: { children: "Submit", disabled: true, variant: "primary" }, x: 50, y: 120 },
    ],
    wires: [
      { id: "w1", from: { nodeId: "checkbox1", event: "onChange" }, to: { nodeId: "button1", prop: "disabled" }, transform: "!value" },
    ],
  },
  {
    id: "input-updates-badge",
    name: "Input Updates Badge",
    description: "Text typed in an input is reflected in a badge in real-time",
    nodes: [
      { id: "input1", componentName: "Input", props: { placeholder: "Type something..." }, x: 50, y: 30 },
      { id: "badge1", componentName: "Badge", props: { children: "Preview" }, x: 50, y: 120 },
      { id: "text1", componentName: "Text", props: { children: "0 characters" }, x: 50, y: 200 },
    ],
    wires: [
      { id: "w1", from: { nodeId: "input1", event: "onChange" }, to: { nodeId: "badge1", prop: "children" }, transform: "value" },
      { id: "w2", from: { nodeId: "input1", event: "onChange" }, to: { nodeId: "text1", prop: "children" }, transform: "value.length + ' characters'" },
    ],
  },
  {
    id: "switch-toggles-alert",
    name: "Switch Toggles Alert",
    description: "A switch shows or hides an alert notification",
    nodes: [
      { id: "switch1", componentName: "Switch", props: { children: "Show notification" }, x: 50, y: 30 },
      { id: "alert1", componentName: "Alert", props: { children: "Notifications are enabled!", variant: "success" }, x: 50, y: 120 },
    ],
    wires: [
      { id: "w1", from: { nodeId: "switch1", event: "onChange" }, to: { nodeId: "alert1", prop: "visible" }, transform: "value" },
    ],
  },
  {
    id: "multi-select-counter",
    name: "Multi-Select Counter",
    description: "Checkboxes control a counter badge and enable a clear button",
    nodes: [
      { id: "cb1", componentName: "Checkbox", props: { children: "Option A" }, x: 50, y: 30 },
      { id: "cb2", componentName: "Checkbox", props: { children: "Option B" }, x: 50, y: 80 },
      { id: "cb3", componentName: "Checkbox", props: { children: "Option C" }, x: 50, y: 130 },
      { id: "badge1", componentName: "Badge", props: { children: "0 selected" }, x: 250, y: 60 },
      { id: "button1", componentName: "Button", props: { children: "Clear All", variant: "ghost", disabled: true }, x: 250, y: 130 },
    ],
    wires: [
      { id: "w1", from: { nodeId: "cb1", event: "onChange" }, to: { nodeId: "badge1", prop: "children" }, transform: "count" },
      { id: "w2", from: { nodeId: "cb2", event: "onChange" }, to: { nodeId: "badge1", prop: "children" }, transform: "count" },
      { id: "w3", from: { nodeId: "cb3", event: "onChange" }, to: { nodeId: "badge1", prop: "children" }, transform: "count" },
    ],
  },
];

export function getScenarioById(id: string): InteractionScenario | undefined {
  return SCENARIOS.find((s) => s.id === id);
}
