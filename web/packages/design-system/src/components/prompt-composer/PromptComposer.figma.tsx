import figma from '@figma/code-connect';
import { PromptComposer } from './PromptComposer';

figma.connect(PromptComposer, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    subject: figma.string('Subject'),
    defaultSubject: figma.string('DefaultSubject'),
    value: figma.string('Value'),
    defaultValue: figma.string('DefaultValue'),
    scope: figma.enum('Scope', {
      general: 'general',
      approval: 'approval',
      policy: 'policy',
      release: 'release',
    }),
    defaultScope: figma.enum('DefaultScope', {
      general: 'general',
      approval: 'approval',
      policy: 'policy',
      release: 'release',
    }),
    tone: figma.enum('Tone', {
      neutral: 'neutral',
      strict: 'strict',
      exploratory: 'exploratory',
    }),
    defaultTone: figma.enum('DefaultTone', {
      neutral: 'neutral',
      strict: 'strict',
      exploratory: 'exploratory',
    }),
  },
  example: (props) => (
    <PromptComposer {...props} />
  ),
});
