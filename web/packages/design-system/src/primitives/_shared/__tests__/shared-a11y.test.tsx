// @vitest-environment jsdom
import { describe, it } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import { expectNoA11yViolations } from '../../../__tests__/a11y-utils';
import { FieldControlShell } from '../FieldControlPrimitives';
import { Slot } from '../Slot';

describe('FieldControlShell — a11y', () => {
  it('has no a11y violations with minimal props', async () => {
    const { container } = render(
      <FieldControlShell inputId="test-input" label="Test Label">
        <input id="test-input" type="text" />
      </FieldControlShell>,
    );
    await expectNoA11yViolations(container);
  });

  it('has no a11y violations with error and hint', async () => {
    const { container } = render(
      <FieldControlShell
        inputId="test-input-2"
        label="Field"
        hint="Helper text"
        error="Required field"
        required
      >
        <input id="test-input-2" type="text" aria-invalid="true" />
      </FieldControlShell>,
    );
    await expectNoA11yViolations(container);
  });
});

describe('Slot — a11y', () => {
  it('has no a11y violations when composing a button', async () => {
    const { container } = render(
      <Slot>
        <button type="button">Click me</button>
      </Slot>,
    );
    await expectNoA11yViolations(container);
  });

  it('has no a11y violations when composing a link', async () => {
    const { container } = render(
      <Slot className="extra-class">
        <a href="#test">Test link</a>
      </Slot>,
    );
    await expectNoA11yViolations(container);
  });
});
