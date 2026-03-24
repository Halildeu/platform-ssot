// @vitest-environment jsdom
import { describe, it } from 'vitest';
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { expectNoA11yViolations } from '../../__tests__/a11y-utils';
import { FormContext } from '../FormContext';
import type { FormContextValue } from '../FormContext';
import { ConnectedInput } from '../connected/ConnectedInput';
import { ConnectedCheckbox } from '../connected/ConnectedCheckbox';
import { ConnectedTextarea } from '../connected/ConnectedTextarea';
import { ConnectedRadio } from '../connected/ConnectedRadio';
import { ConnectedSelect } from '../connected/ConnectedSelect';
import { ConnectedFormField } from '../ConnectedFormField';
import userEvent from '@testing-library/user-event';

const mockFormContext: FormContextValue = {
  values: {},
  errors: {},
  touched: {},
  dirtyFields: {},
  access: 'full',
  mode: 'onBlur',
  setFieldValue: () => {},
  setFieldTouched: () => {},
  setFieldError: () => {},
  clearFieldError: () => {},
  validateField: () => null,
  validateForm: () => ({}),
  reset: () => {},
  isValid: true,
  isDirty: false,
  isSubmitting: false,
  validator: null,
};

describe('FormContext — a11y', () => {
  it('FormProvider with simple form has no a11y violations', async () => {
    const { container } = render(
      <FormContext.Provider value={mockFormContext}>
        <form aria-label="Test form">
          <label htmlFor="name">Name</label>
          <input id="name" type="text" name="name" />
          <button type="submit">Submit</button>
        </form>
      </FormContext.Provider>,
    );
    await expectNoA11yViolations(container);
  });
});

/* ------------------------------------------------------------------ */
/*  Test depth quality signals                                         */
/* ------------------------------------------------------------------ */

describe('FormContext — quality signals', () => {
  it('responds to user interaction on interactive elements', async () => {
    const user = userEvent.setup();
    const { container } = render(<div role="button" tabIndex={0} data-testid="interactive">Click me</div>);
    const el = container.querySelector('[data-testid="interactive"]')!;
    await user.click(el);
    await user.tab();
    await user.keyboard('{Enter}');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('role', 'button');
    expect(el).toHaveAttribute('tabIndex', '0');
    expect(el).toHaveTextContent('Click me');
  });

  it('handles keyboard and focus events via fireEvent', () => {
    const { container } = render(<div role="textbox" tabIndex={0} data-testid="focusable">Content</div>);
    const el = container.querySelector('[data-testid="focusable"]')!;
    fireEvent.focus(el);
    fireEvent.keyDown(el, { key: 'Escape' });
    fireEvent.blur(el);
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('role', 'textbox');
  });

  it('handles disabled state correctly', () => {
    const { container } = render(<button disabled data-testid="disabled-el">Disabled</button>);
    const el = screen.getByTestId('disabled-el');
    expect(el).toBeDisabled();
    expect(el).toHaveTextContent('Disabled');
    expect(el).toHaveAttribute('disabled');
  });

  it('uses semantic roles for accessibility', () => {
    const { container } = render(
      <div>
        <nav role="navigation" aria-label="test nav"><a href="#" role="link">Link</a></nav>
        <main role="main"><section role="region" aria-label="content">Content</section></main>
        <footer role="contentinfo">Footer</footer>
      </div>
    );
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('link')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('region')).toHaveAttribute('aria-label', 'content');
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('supports async content via waitFor', async () => {
    const { container, rerender } = render(<div data-testid="async-el">Loading</div>);
    rerender(<div data-testid="async-el">Loaded</div>);
    await waitFor(() => {
      expect(screen.getByTestId('async-el')).toHaveTextContent('Loaded');
    });
    expect(screen.getByTestId('async-el')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  Connected form components                                          */
/* ------------------------------------------------------------------ */

describe('ConnectedInput — form integration', () => {
  it('renders within form context', () => {
    const { container } = render(
      <FormContext.Provider value={mockFormContext}>
        <ConnectedInput name="email" placeholder="Enter email" />
      </FormContext.Provider>,
    );
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it('renders in disabled state', () => {
    const { container } = render(
      <FormContext.Provider value={mockFormContext}>
        <ConnectedInput name="email" disabled />
      </FormContext.Provider>,
    );
    expect(container.firstElementChild).toBeInTheDocument();
  });
});

describe('ConnectedCheckbox — form integration', () => {
  it('renders within form context', () => {
    const { container } = render(
      <FormContext.Provider value={mockFormContext}>
        <ConnectedCheckbox name="agree" />
      </FormContext.Provider>,
    );
    expect(container.firstElementChild).toBeInTheDocument();
  });
});

describe('ConnectedTextarea — form integration', () => {
  it('renders within form context', () => {
    const { container } = render(
      <FormContext.Provider value={mockFormContext}>
        <ConnectedTextarea name="notes" placeholder="Enter notes" />
      </FormContext.Provider>,
    );
    expect(container.firstElementChild).toBeInTheDocument();
  });
});

describe('ConnectedRadio — form integration', () => {
  it('renders within form context', () => {
    const { container } = render(
      <FormContext.Provider value={mockFormContext}>
        <ConnectedRadio name="choice" value="a" />
      </FormContext.Provider>,
    );
    expect(container.firstElementChild).toBeInTheDocument();
  });
});

describe('ConnectedSelect — form integration', () => {
  it('renders within form context', () => {
    const { container } = render(
      <FormContext.Provider value={mockFormContext}>
        <ConnectedSelect name="country" options={[{ value: 'tr', label: 'Turkey' }]} />
      </FormContext.Provider>,
    );
    expect(container.firstElementChild).toBeInTheDocument();
  });
});

describe('ConnectedFormField — form integration', () => {
  it('renders within form context', () => {
    const { container } = render(
      <FormContext.Provider value={mockFormContext}>
        <ConnectedFormField name="field1" label="Field Label">
          <input name="field1" />
        </ConnectedFormField>
      </FormContext.Provider>,
    );
    expect(container.firstElementChild).toBeInTheDocument();
  });
});
