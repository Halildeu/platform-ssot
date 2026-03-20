import React from "react";
import { CodeBlock } from "../../../../../../../packages/design-system/src/catalog/design-lab-internals";

/* ------------------------------------------------------------------ */
/*  PlaygroundCodeOutput — Generated JSX code with syntax highlighting */
/* ------------------------------------------------------------------ */

type PlaygroundCodeOutputProps = {
  code: string;
  importStatement?: string;
};

export const PlaygroundCodeOutput: React.FC<PlaygroundCodeOutputProps> = ({
  code,
  importStatement,
}) => {
  const fullCode = importStatement
    ? `${importStatement}\n\n${code}`
    : code;

  return (
    <CodeBlock
      code={fullCode}
      language="tsx"
      variant="dark"
      label="JSX"
    />
  );
};
