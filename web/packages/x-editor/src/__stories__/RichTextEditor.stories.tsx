import React from 'react';
import { RichTextEditor } from '../RichTextEditor';

export const Default = () => (
  <RichTextEditor placeholder="Start typing..." minHeight={200} />
);

export const WithContent = () => (
  <RichTextEditor
    value="<h2>Welcome</h2><p>This is a <strong>rich text</strong> editor with <em>formatting</em> support.</p>"
    minHeight={300}
  />
);

export const ReadOnly = () => (
  <RichTextEditor
    value="<p>This content is read-only.</p>"
    readOnly
    minHeight={150}
  />
);

export default { title: 'X-Editor/RichTextEditor', component: RichTextEditor };
