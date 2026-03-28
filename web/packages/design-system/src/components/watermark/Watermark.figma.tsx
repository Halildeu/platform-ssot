import figma from '@figma/code-connect';
import { Watermark } from './Watermark';

figma.connect(Watermark, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    image: figma.string('Image'),
    fontColor: figma.string('FontColor'),
  },
  example: ({ image, fontColor }) => (
    <Watermark image={image} fontColor={fontColor} />
  ),
});
