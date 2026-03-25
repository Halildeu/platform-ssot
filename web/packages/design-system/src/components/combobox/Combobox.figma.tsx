import figma from '@figma/code-connect';
import { Combobox } from './Combobox';

figma.connect(Combobox, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    invalid: figma.boolean('Invalid'),
    selectionMode: figma.enum('SelectionMode', {
      single: 'single',
      multiple: 'multiple',
      tags: 'tags',
    }),
    inputValue: figma.string('InputValue'),
    defaultInputValue: figma.string('DefaultInputValue'),
    freeSolo: figma.boolean('FreeSolo'),
    open: figma.boolean('Open'),
    defaultOpen: figma.boolean('DefaultOpen'),
    loading: figma.boolean('Loading'),
    clearable: figma.boolean('Clearable'),
    clearLabel: figma.string('ClearLabel'),
    showAccessReasonHint: figma.boolean('ShowAccessReasonHint'),
    fullWidth: figma.boolean('FullWidth'),
    disabledItemFocusPolicy: figma.enum('DisabledItemFocusPolicy', {
      skip: 'skip',
      allow: 'allow',
    }),
    popupStrategy: figma.enum('PopupStrategy', {
      inline: 'inline',
      portal: 'portal',
    }),
    popupSide: figma.enum('PopupSide', {
      bottom: 'bottom',
      top: 'top',
    }),
    popupAlign: figma.enum('PopupAlign', {
      start: 'start',
      end: 'end',
    }),
    popupClassName: figma.string('PopupClassName'),
    listboxClassName: figma.string('ListboxClassName'),
    flipOnCollision: figma.boolean('FlipOnCollision'),
    tagRemoveLabel: figma.string('TagRemoveLabel'),
  },
  example: (props) => (
    <Combobox {...props} />
  ),
});
