import figma from '@figma/code-connect';
import { Card } from './Card';

figma.connect(Card, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    title: figma.string('Title'),
    variant: figma.enum('Variant', {
      elevated: 'elevated',
      outlined: 'outlined',
      filled: 'filled',
    }),
    padding: figma.enum('Padding', { sm: 'sm', md: 'md', lg: 'lg' }),
  },
  example: ({ title, variant, padding }) => (
    <Card variant={variant} padding={padding}>
      <Card.Header>{title}</Card.Header>
      <Card.Body>Card content goes here</Card.Body>
    </Card>
  ),
});
