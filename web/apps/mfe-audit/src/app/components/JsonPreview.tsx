import React from 'react';

export type JsonPreviewProps = {
  data: unknown;
};

export const JsonPreview: React.FC<JsonPreviewProps> = ({ data }) => {
  const content = data === undefined
    ? 'undefined'
    : data === null
      ? 'null'
      : JSON.stringify(data, null, 2);
  return (
    <pre className="json-preview" role="region" aria-live="polite">
      {content}
    </pre>
  );
};

export default JsonPreview;
