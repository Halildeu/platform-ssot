/* ------------------------------------------------------------------ */
/*  patternTemplates — Template library for auto-generated patterns    */
/*                                                                     */
/*  Each template: trigger condition, code generator, description.     */
/*  Templates produce common UI patterns from component props/slots.   */
/* ------------------------------------------------------------------ */

export type PatternTemplate = {
  id: string;
  name: string;
  description: string;
  category: "form" | "conditional" | "list" | "error" | "composition" | "state";
  /** Which component names this template applies to */
  appliesTo: string[] | "*";
  /** Generate code snippet given component name and available props */
  generate: (componentName: string, props: string[]) => string;
};

export const PATTERN_TEMPLATES: PatternTemplate[] = [
  /* ---- Form Integration ---- */
  {
    id: "form-controlled",
    name: "Controlled Form Field",
    description: "Component integrated with React state for controlled form handling",
    category: "form",
    appliesTo: ["Input", "Select", "Checkbox", "Switch", "Textarea", "DatePicker"],
    generate: (name, props) => {
      const hasValue = props.includes("value");
      const hasChecked = props.includes("checked");
      const stateVar = hasChecked ? "checked" : "value";
      const stateType = hasChecked ? "boolean" : "string";
      const handler = hasChecked ? "onChange={(e) => setChecked(e.target.checked)}" : "onChange={(e) => setValue(e.target.value)}";
      return `function Controlled${name}Example() {
  const [${stateVar}, set${stateVar.charAt(0).toUpperCase() + stateVar.slice(1)}] = useState<${stateType}>(${hasChecked ? "false" : "''"});

  return (
    <${name}
      ${stateVar}={${stateVar}}
      ${handler}
      ${props.includes("placeholder") ? 'placeholder="Enter value..."' : ""}
    />
  );
}`;
    },
  },
  {
    id: "form-validation",
    name: "With Validation",
    description: "Form field with inline validation and error message display",
    category: "form",
    appliesTo: ["Input", "Select", "Textarea"],
    generate: (name) => `function Validated${name}Example() {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const validate = (v: string) => {
    if (!v.trim()) {
      setError("This field is required");
    } else if (v.length < 3) {
      setError("Must be at least 3 characters");
    } else {
      setError(null);
    }
  };

  return (
    <div>
      <${name}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          validate(e.target.value);
        }}
        onBlur={() => validate(value)}
        ${name === "Input" ? 'variant={error ? "error" : "default"}' : ""}
      />
      {error && (
        <Text variant="error" className="mt-1 text-xs text-red-500">
          {error}
        </Text>
      )}
    </div>
  );
}`,
  },

  /* ---- Conditional Rendering ---- */
  {
    id: "conditional-render",
    name: "Conditional Display",
    description: "Show/hide component based on a condition or state",
    category: "conditional",
    appliesTo: "*",
    generate: (name) => `function Conditional${name}Example() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div>
      <Button onClick={() => setIsVisible(!isVisible)}>
        {isVisible ? "Hide" : "Show"} ${name}
      </Button>
      {isVisible && (
        <${name} />
      )}
    </div>
  );
}`,
  },
  {
    id: "conditional-variant",
    name: "Dynamic Variant",
    description: "Switch between variants based on application state",
    category: "conditional",
    appliesTo: ["Button", "Alert", "Badge", "Input"],
    generate: (name) => `function Dynamic${name}Example() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const variantMap = {
    idle: "default",
    loading: "secondary",
    success: "success",
    error: "destructive",
  };

  return (
    <${name}
      variant={variantMap[status]}
      ${name === "Button" ? "disabled={status === 'loading'}" : ""}
    >
      {status === "loading" ? "Processing..." : "${name}"}
    </${name}>
  );
}`,
  },

  /* ---- Dynamic List ---- */
  {
    id: "dynamic-list",
    name: "Dynamic List",
    description: "Render a list of components from array data with add/remove",
    category: "list",
    appliesTo: ["Badge", "Alert", "Checkbox", "Input"],
    generate: (name) => `function ${name}ListExample() {
  const [items, setItems] = useState([
    { id: 1, label: "Item One" },
    { id: 2, label: "Item Two" },
    { id: 3, label: "Item Three" },
  ]);

  const addItem = () => {
    const id = Date.now();
    setItems([...items, { id, label: \`Item \${items.length + 1}\` }]);
  };

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-2">
          <${name}>${name === "Badge" || name === "Alert" ? "{item.label}" : ""}</${name}>
          <Button variant="ghost" size="sm" onClick={() => removeItem(item.id)}>
            Remove
          </Button>
        </div>
      ))}
      <Button variant="secondary" onClick={addItem}>Add Item</Button>
    </div>
  );
}`,
  },

  /* ---- Error State ---- */
  {
    id: "error-boundary",
    name: "Error State Pattern",
    description: "Handle and display error states gracefully",
    category: "error",
    appliesTo: ["Alert", "Toast", "Modal"],
    generate: (name) => `function ${name}ErrorExample() {
  const [error, setError] = useState<string | null>(null);

  const simulateError = async () => {
    try {
      // Simulated API call
      throw new Error("Network request failed");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  return (
    <div>
      <Button onClick={simulateError}>Trigger Error</Button>
      {error && (
        <${name}
          variant="destructive"
          ${name === "Modal" ? 'isOpen={!!error} onClose={() => setError(null)}' : ""}
        >
          {error}
          ${name === "Alert" ? '<Button variant="ghost" size="sm" onClick={() => setError(null)}>Dismiss</Button>' : ""}
        </${name}>
      )}
    </div>
  );
}`,
  },

  /* ---- Composition ---- */
  {
    id: "with-icon",
    name: "With Icon",
    description: "Component combined with an icon for enhanced visual communication",
    category: "composition",
    appliesTo: ["Button", "Alert", "Badge", "Input"],
    generate: (name) => `function ${name}WithIconExample() {
  return (
    <${name}>
      <Icon name="check" className="mr-1.5 h-4 w-4" />
      ${name} with Icon
    </${name}>
  );
}`,
  },
  {
    id: "grouped",
    name: "Grouped Layout",
    description: "Multiple instances arranged in a group with shared context",
    category: "composition",
    appliesTo: ["Button", "Checkbox", "Badge", "Avatar"],
    generate: (name) => `function ${name}GroupExample() {
  return (
    <div className="flex items-center gap-2">
      <${name} variant="primary">First</${name}>
      <${name} variant="secondary">Second</${name}>
      <${name} variant="ghost">Third</${name}>
    </div>
  );
}`,
  },

  /* ---- State Management ---- */
  {
    id: "loading-state",
    name: "Loading State",
    description: "Component with loading/pending state handling",
    category: "state",
    appliesTo: ["Button", "Input", "Select", "DataTable"],
    generate: (name) => `function ${name}LoadingExample() {
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <${name}
      ${name === "Button" ? "onClick={handleAction}" : ""}
      loading={isLoading}
      disabled={isLoading}
    >
      {isLoading ? "Loading..." : "Click Me"}
    </${name}>
  );
}`,
  },
  {
    id: "disabled-state",
    name: "Disabled State",
    description: "Component with conditional disabled state based on form validity",
    category: "state",
    appliesTo: ["Button", "Input", "Select", "Checkbox", "Switch"],
    generate: (name) => `function ${name}DisabledExample() {
  const [isFormValid, setIsFormValid] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <Checkbox
        checked={isFormValid}
        onChange={() => setIsFormValid(!isFormValid)}
      >
        I agree to the terms
      </Checkbox>
      <${name} disabled={!isFormValid}>
        Submit
      </${name}>
    </div>
  );
}`,
  },
];

export function getTemplatesForComponent(componentName: string): PatternTemplate[] {
  return PATTERN_TEMPLATES.filter(
    (t) => t.appliesTo === "*" || t.appliesTo.includes(componentName),
  );
}

export function getPatternCategories(): Array<{ id: string; label: string }> {
  return [
    { id: "form", label: "Form Integration" },
    { id: "conditional", label: "Conditional Rendering" },
    { id: "list", label: "Dynamic Lists" },
    { id: "error", label: "Error Handling" },
    { id: "composition", label: "Composition" },
    { id: "state", label: "State Management" },
  ];
}
