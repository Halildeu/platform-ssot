import figma from '@figma/code-connect';
import { FileUploadZone } from './FileUploadZone';

figma.connect(FileUploadZone, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    accept: figma.string('Accept'),
    multiple: figma.boolean('Multiple'),
    disabled: figma.boolean('Disabled'),
    label: figma.string('Label'),
    description: figma.string('Description'),
  },
  example: (props) => (
    <FileUploadZone {...props} />
  ),
});
