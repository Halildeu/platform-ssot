// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, fireEvent } from '@testing-library/react';
import { expectNoA11yViolations } from './a11y-utils';

/* ---- Component imports ---- */
import { Button } from '../primitives/button';
import { Input } from '../primitives/input';
import { Select } from '../primitives/select';
import { Checkbox } from '../primitives/checkbox';
import { Switch } from '../primitives/switch';
import { Slider } from '../components/slider';
import { Modal } from '../primitives/modal';
import { Drawer } from '../primitives/drawer';
import { Tooltip } from '../primitives/tooltip';
import { Popover } from '../primitives/popover';
import { Dialog } from '../primitives/dialog';
import { Spinner } from '../primitives/spinner';
import { Skeleton } from '../primitives/skeleton';
import { Tabs } from '../components/tabs';
import { Accordion } from '../components/accordion';
import { Pagination } from '../components/pagination';
import { Steps } from '../components/steps';
import { Breadcrumb } from '../components/breadcrumb';
import { FormField } from '../components/form-field';
import { Autocomplete } from '../components/autocomplete';
import { InputNumber } from '../components/input-number';
import { Radio, RadioGroup } from '../primitives/radio';

/* ------------------------------------------------------------------ */
/*  jsdom polyfills for HTMLDialogElement                              */
/* ------------------------------------------------------------------ */
beforeAll(() => {
  if (!HTMLDialogElement.prototype.showModal) {
    HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
      this.setAttribute('open', '');
    };
  }
  if (!HTMLDialogElement.prototype.close) {
    HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
      this.removeAttribute('open');
    };
  }
});

afterEach(() => {
  cleanup();
  document.body.style.overflow = '';
});

/* ================================================================== */
/*  1. Interactive components — disabled state (6 tests)               */
/* ================================================================== */

describe('A11y Depth — Disabled states', () => {
  it('Button disabled has no a11y violations', async () => {
    const { container } = render(<Button disabled>Save</Button>);
    await expectNoA11yViolations(container);
  });

  it('Input disabled has no a11y violations', async () => {
    const { container } = render(<Input label="Name" disabled />);
    await expectNoA11yViolations(container);
  });

  it('Select disabled has no a11y violations', async () => {
    const { container } = render(
      <Select
        disabled
        aria-label="Country"
        options={[
          { value: 'us', label: 'United States' },
          { value: 'uk', label: 'United Kingdom' },
        ]}
      />,
    );
    await expectNoA11yViolations(container);
  });

  it('Checkbox disabled has no a11y violations', async () => {
    const { container } = render(<Checkbox label="Accept terms" disabled />);
    await expectNoA11yViolations(container);
  });

  it('Switch disabled has no a11y violations', async () => {
    const { container } = render(<Switch label="Dark mode" disabled />);
    await expectNoA11yViolations(container);
  });

  it('Slider disabled has no a11y violations', async () => {
    const { container } = render(<Slider label="Volume" disabled />);
    await expectNoA11yViolations(container);
  });
});

/* ================================================================== */
/*  2. Form components — error state (6 tests)                        */
/* ================================================================== */

describe('A11y Depth — Error states', () => {
  it('Input with error message has no a11y violations', async () => {
    const { container } = render(
      <Input label="Email" error="Invalid email address" />,
    );
    await expectNoA11yViolations(container);
  });

  it('Select with error has no a11y violations', async () => {
    const { container } = render(
      <Select
        error="Please select an option"
        aria-label="Status"
        options={[
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
        ]}
      />,
    );
    await expectNoA11yViolations(container);
  });

  it('FormField with error + required has no a11y violations', async () => {
    const { container } = render(
      <FormField label="Username" error="Username is required" required>
        <input type="text" />
      </FormField>,
    );
    await expectNoA11yViolations(container);
  });

  it('Autocomplete with error has no a11y violations', async () => {
    const { container } = render(
      <Autocomplete
        label="City"
        error="Please select a city"
        options={[
          { value: 'nyc', label: 'New York' },
          { value: 'la', label: 'Los Angeles' },
        ]}
      />,
    );
    await expectNoA11yViolations(container);
  });

  it('InputNumber with error has no a11y violations', async () => {
    const { container } = render(
      <InputNumber label="Quantity" error="Must be at least 1" min={1} />,
    );
    await expectNoA11yViolations(container);
  });

  it('Checkbox with error has no a11y violations', async () => {
    const { container } = render(
      <Checkbox label="I agree to the terms" error="You must agree" />,
    );
    await expectNoA11yViolations(container);
  });
});

/* ================================================================== */
/*  3. Overlay components — open state (5 tests)                       */
/* ================================================================== */

describe('A11y Depth — Open overlay states', () => {
  it('Modal open has no a11y violations', async () => {
    const { container } = render(
      <Modal open title="Confirm action" onClose={vi.fn()} disablePortal>
        <p>Are you sure?</p>
      </Modal>,
    );
    await expectNoA11yViolations(container);
  });

  it('Drawer open has no a11y violations', async () => {
    const { container } = render(
      <Drawer open title="Settings" onClose={vi.fn()}>
        <p>Drawer content here</p>
      </Drawer>,
    );
    // Drawer renders via portal, so audit document.body
    await expectNoA11yViolations(document.body);
  });

  it('Tooltip visible has no a11y violations', async () => {
    const { container } = render(
      <Tooltip content="Helpful tip" delay={0}>
        <button type="button">Hover me</button>
      </Tooltip>,
    );
    // Trigger tooltip by firing mouseEnter + wait for state update
    const wrapper = container.querySelector('span')!;
    fireEvent.mouseEnter(wrapper);
    // Allow the 0ms delay timeout to fire
    await vi.waitFor(() => {
      expect(container.querySelector('[role="tooltip"]')).toBeTruthy();
    });
    await expectNoA11yViolations(container);
  });

  it('Popover open has no a11y violations', async () => {
    const { container } = render(
      <Popover
        trigger={<button type="button">Open</button>}
        content={<p>Popover body</p>}
        open
        disablePortal
      />,
    );
    await expectNoA11yViolations(container);
  });

  it('Dialog open has no a11y violations', async () => {
    const { container } = render(
      <Dialog open onClose={vi.fn()} title="Confirm" closable>
        <p>Dialog body</p>
      </Dialog>,
    );
    await expectNoA11yViolations(container);
  });
});

/* ================================================================== */
/*  4. Loading states (4 tests)                                        */
/* ================================================================== */

describe('A11y Depth — Loading states', () => {
  it('Spinner standalone has no a11y violations', async () => {
    const { container } = render(<Spinner label="Loading data" />);
    await expectNoA11yViolations(container);
  });

  it('Skeleton loading placeholder has no a11y violations', async () => {
    const { container } = render(
      <div role="status" aria-label="Loading content">
        <Skeleton width="100%" height={20} />
        <Skeleton width="80%" height={20} />
        <Skeleton width="60%" height={20} />
      </div>,
    );
    await expectNoA11yViolations(container);
  });

  it('Autocomplete with loading has no a11y violations', async () => {
    const { container } = render(
      <Autocomplete
        label="Search"
        loading
        options={[]}
        placeholder="Type to search..."
      />,
    );
    await expectNoA11yViolations(container);
  });

  it('Button with loading state has no a11y violations', async () => {
    const { container } = render(<Button loading>Submitting</Button>);
    await expectNoA11yViolations(container);
  });
});

/* ================================================================== */
/*  5. Complex component states (5 tests)                              */
/* ================================================================== */

describe('A11y Depth — Complex component states', () => {
  it('Tabs with disabled tab has no a11y violations', async () => {
    const { container } = render(
      <Tabs
        items={[
          { key: 'general', label: 'General', content: <p>General settings</p> },
          { key: 'security', label: 'Security', content: <p>Security settings</p>, disabled: true },
          { key: 'billing', label: 'Billing', content: <p>Billing settings</p> },
        ]}
        defaultActiveKey="general"
      />,
    );
    await expectNoA11yViolations(container);
  });

  it('Accordion with multiple panels open has no a11y violations', async () => {
    const { container } = render(
      <Accordion
        selectionMode="multiple"
        defaultValue={['faq1', 'faq2']}
        items={[
          { value: 'faq1', title: 'What is this?', content: <p>This is the design system.</p> },
          { value: 'faq2', title: 'How to use it?', content: <p>Import and render components.</p> },
          { value: 'faq3', title: 'Is it free?', content: <p>Yes, open source.</p> },
        ]}
      />,
    );
    await expectNoA11yViolations(container);
  });

  it('Pagination at first page has no a11y violations', async () => {
    const { container } = render(
      <Pagination total={100} pageSize={10} current={1} />,
    );
    await expectNoA11yViolations(container);
  });

  it('Steps with completed/active/disabled steps has no a11y violations', async () => {
    const { container } = render(
      <Steps
        current={1}
        items={[
          { key: 'info', title: 'Information' },
          { key: 'review', title: 'Review' },
          { key: 'submit', title: 'Submit', disabled: true },
        ]}
      />,
    );
    await expectNoA11yViolations(container);
  });

  it('Breadcrumb with current page has no a11y violations', async () => {
    const { container } = render(
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Products', href: '/products' },
          { label: 'Widget' },
        ]}
      />,
    );
    await expectNoA11yViolations(container);
  });
});

/* ================================================================== */
/*  6. Form patterns (4 tests)                                         */
/* ================================================================== */

describe('A11y Depth — Form patterns', () => {
  it('FormField with all slots filled has no a11y violations', async () => {
    const { container } = render(
      <FormField
        label="Full name"
        help="Enter your legal name as it appears on your ID."
        error="Name is required"
        required
      >
        <input type="text" placeholder="Jane Doe" />
      </FormField>,
    );
    await expectNoA11yViolations(container);
  });

  it('Required input without value has aria-required and no a11y violations', async () => {
    const { container } = render(
      <Input label="Email" required placeholder="you@example.com" />,
    );
    const input = container.querySelector('input');
    expect(input).toHaveAttribute('required');
    await expectNoA11yViolations(container);
  });

  it('Input with aria-describedby linking has no a11y violations', async () => {
    const { container } = render(
      <Input
        label="Password"
        description="Must be at least 8 characters"
        hint="Use a mix of letters and numbers"
      />,
    );
    const input = container.querySelector('input');
    expect(input?.getAttribute('aria-describedby')).toBeTruthy();
    await expectNoA11yViolations(container);
  });

  it('RadioGroup with fieldset/legend pattern has no a11y violations', async () => {
    const { container } = render(
      <fieldset>
        <legend>Preferred contact method</legend>
        <RadioGroup name="contact" defaultValue="email">
          <Radio value="email" label="Email" />
          <Radio value="phone" label="Phone" />
          <Radio value="sms" label="SMS" />
        </RadioGroup>
      </fieldset>,
    );
    await expectNoA11yViolations(container);
  });
});
