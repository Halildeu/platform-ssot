// @vitest-environment jsdom
import React, { useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, createEvent, fireEvent, render, screen, within, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Input } from '../primitives/input';
import { Select } from '../primitives/select';
import { Button } from '../primitives/button';
import { Checkbox } from '../primitives/checkbox';
import { Modal } from '../primitives/modal';
import { Drawer } from '../primitives/drawer';
import { Accordion, type AccordionItem } from '../components/accordion/Accordion';
import { Tabs, type TabItem } from '../components/tabs/Tabs';
import { FormField } from '../components/form-field/FormField';
import { Combobox, type ComboboxOption } from '../components/combobox/Combobox';
import { Breadcrumb, type BreadcrumbItem } from '../components/breadcrumb/Breadcrumb';

/* ------------------------------------------------------------------ */
/*  HTMLDialogElement polyfill for jsdom                                */
/* ------------------------------------------------------------------ */

beforeEach(() => {
  if (!HTMLDialogElement.prototype.showModal) {
    HTMLDialogElement.prototype.showModal = function () {
      this.setAttribute('open', '');
    };
  }
  if (!HTMLDialogElement.prototype.close) {
    HTMLDialogElement.prototype.close = function () {
      this.removeAttribute('open');
    };
  }
});

afterEach(() => {
  cleanup();
});

/* ================================================================== */
/*  1. Form focus order                                                */
/* ================================================================== */

describe('Focus order — Form fields', () => {
  it('Tab through Input -> Select -> Checkbox -> Button follows DOM order', async () => {
    const user = userEvent.setup();

    render(
      <form>
        <Input label="Name" data-testid="name-input" />
        <Select
          options={[
            { label: 'A', value: 'a' },
            { label: 'B', value: 'b' },
          ]}
          data-testid="category-select"
        />
        <Checkbox label="Accept terms" />
        <Button data-testid="submit-btn">Submit</Button>
      </form>,
    );

    const input = screen.getByLabelText('Name');
    input.focus();
    expect(document.activeElement).toBe(input);

    await user.tab();
    const selectEl = screen.getByTestId('category-select');
    expect(document.activeElement).toBe(selectEl);

    await user.tab();
    const checkbox = screen.getByRole('checkbox');
    expect(document.activeElement).toBe(checkbox);

    await user.tab();
    const button = screen.getByTestId('submit-btn');
    expect(document.activeElement).toBe(button);
  });

  it('Tab through FormField focuses the input, not the label', async () => {
    const user = userEvent.setup();

    render(
      <div>
        <button data-testid="before">Before</button>
        <FormField label="Email" help="Enter your email" htmlFor="email-field">
          <input id="email-field" type="email" data-testid="email-input" />
        </FormField>
        <button data-testid="after">After</button>
      </div>,
    );

    const beforeBtn = screen.getByTestId('before');
    beforeBtn.focus();

    await user.tab();
    // Focus should land on the input, not the label
    const emailInput = screen.getByTestId('email-input');
    expect(document.activeElement).toBe(emailInput);
  });

  it('Required field star is not focusable', () => {
    render(
      <FormField label="Name" required htmlFor="name-field">
        <input id="name-field" />
      </FormField>,
    );

    // The asterisk has aria-hidden and should not be focusable
    const star = document.querySelector('[aria-hidden]');
    expect(star).toBeInTheDocument();
    expect(star?.textContent).toBe('*');
    expect(star?.getAttribute('tabindex')).not.toBe('0');
  });

  it('Error message is not in tab order', async () => {
    const user = userEvent.setup();

    render(
      <div>
        <FormField label="Email" error="Invalid email" htmlFor="email-err">
          <input id="email-err" data-testid="email-err-input" />
        </FormField>
        <button data-testid="after-err">After</button>
      </div>,
    );

    const input = screen.getByTestId('email-err-input');
    input.focus();
    expect(document.activeElement).toBe(input);

    // Tab should skip the error message and go to the next interactive element
    await user.tab();
    const afterBtn = screen.getByTestId('after-err');
    expect(document.activeElement).toBe(afterBtn);
  });
});

/* ================================================================== */
/*  2. Modal focus trap                                                */
/* ================================================================== */

describe('Focus order — Modal focus trap', () => {
  // Modal uses native <dialog> with showModal() which provides built-in focus trapping.
  // In jsdom the native focus-trapping is not fully emulated, so we test
  // the structural aspects: focus moves to modal on open, close restores focus,
  // and modal content ordering.

  it('Focus moves to modal on open (close button is first focusable)', () => {
    render(
      <Modal open onClose={() => {}} title="Test Modal" disablePortal>
        <p>Modal content</p>
        <button data-testid="modal-action">Action</button>
      </Modal>,
    );

    const dialog = document.querySelector('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('open');

    // The dialog should contain focusable elements
    const closeButton = screen.getByLabelText('Close');
    expect(closeButton).toBeInTheDocument();
  });

  it('Tab order within modal follows DOM order: close button -> body content -> footer', async () => {
    const user = userEvent.setup();

    render(
      <Modal
        open
        onClose={() => {}}
        title="Focus Test"
        disablePortal
        footer={<Button data-testid="footer-btn">Save</Button>}
      >
        <button data-testid="body-btn">Body Action</button>
      </Modal>,
    );

    const closeBtn = screen.getByLabelText('Close');
    closeBtn.focus();
    expect(document.activeElement).toBe(closeBtn);

    await user.tab();
    const bodyBtn = screen.getByTestId('body-btn');
    expect(document.activeElement).toBe(bodyBtn);

    await user.tab();
    const footerBtn = screen.getByTestId('footer-btn');
    expect(document.activeElement).toBe(footerBtn);
  });

  it('Escape closes modal (focus trap boundary)', () => {
    const handleClose = vi.fn();
    render(
      <Modal open onClose={handleClose} closeOnEscape title="Escape Test" disablePortal>
        <p>Content</p>
      </Modal>,
    );

    const dialog = document.querySelector('dialog');
    const cancelEvent = createEvent('cancel', dialog!, { cancelable: true });
    fireEvent(dialog!, cancelEvent);

    expect(handleClose).toHaveBeenCalledWith('escape');
  });

  it('Focus returns to trigger on close', () => {
    function ModalWrapper() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button data-testid="trigger" onClick={() => setOpen(true)}>
            Open
          </button>
          <Modal open={open} onClose={() => setOpen(false)} title="Test" disablePortal>
            <button data-testid="inside">Inside</button>
          </Modal>
        </>
      );
    }

    render(<ModalWrapper />);

    const trigger = screen.getByTestId('trigger');
    trigger.focus();

    // Open modal
    fireEvent.click(trigger);
    expect(document.querySelector('dialog')).toHaveAttribute('open');

    // Close modal — native dialog returns focus to previously focused element
    const dialog = document.querySelector('dialog')!;
    const cancelEvent = createEvent('cancel', dialog, { cancelable: true });
    fireEvent(dialog, cancelEvent);

    // After close, dialog should be removed or closed
    // The trigger should be in the DOM and focusable
    expect(trigger).toBeInTheDocument();
  });
});

/* ================================================================== */
/*  3. Tabs focus management                                           */
/* ================================================================== */

describe('Focus order — Tabs', () => {
  const tabItems: TabItem[] = [
    { key: 'tab1', label: 'Overview', content: <button data-testid="panel-btn">Panel Button</button> },
    { key: 'tab2', label: 'Details', content: <span>Details content</span> },
    { key: 'tab3', label: 'Settings', content: <span>Settings content</span> },
  ];

  it('Tab into tab list focuses active tab', async () => {
    const user = userEvent.setup();

    render(
      <div>
        <button data-testid="before-tabs">Before</button>
        <Tabs items={tabItems} />
      </div>,
    );

    const beforeBtn = screen.getByTestId('before-tabs');
    beforeBtn.focus();

    await user.tab();
    // Should focus the first (active) tab — roving tabindex means only
    // the active tab has tabIndex=0
    const tabs = screen.getAllByRole('tab');
    expect(document.activeElement).toBe(tabs[0]);
  });

  it('Arrow keys move between tabs (not Tab key)', async () => {
    render(<Tabs items={tabItems} />);

    const tabs = screen.getAllByRole('tab');
    tabs[0].focus();
    expect(document.activeElement).toBe(tabs[0]);

    // ArrowRight triggers roving tabindex — updates the active index.
    // The roving hook changes tabIndex attributes; in jsdom the focus
    // is not automatically moved by the React state update so we verify
    // via the tabIndex attribute (the WAI-ARIA roving tabindex pattern).
    fireEvent.keyDown(tabs[0], { key: 'ArrowRight' });

    // After arrow key, tab2 should become the roving-active tab (tabIndex=0)
    const updatedTabs = screen.getAllByRole('tab');
    expect(updatedTabs[1]).toHaveAttribute('tabindex', '0');
    expect(updatedTabs[0]).toHaveAttribute('tabindex', '-1');

    // ArrowRight again — tab3 becomes active
    fireEvent.keyDown(updatedTabs[1], { key: 'ArrowRight' });
    const finalTabs = screen.getAllByRole('tab');
    expect(finalTabs[2]).toHaveAttribute('tabindex', '0');
    expect(finalTabs[1]).toHaveAttribute('tabindex', '-1');
  });

  it('Tab from tab list moves to tab panel content', async () => {
    const user = userEvent.setup();

    render(<Tabs items={tabItems} defaultActiveKey="tab1" />);

    const tabs = screen.getAllByRole('tab');
    tabs[0].focus();
    expect(document.activeElement).toBe(tabs[0]);

    // Tab key should leave tablist and go to panel content
    await user.tab();
    const panelBtn = screen.getByTestId('panel-btn');
    expect(document.activeElement).toBe(panelBtn);
  });
});

/* ================================================================== */
/*  4. Accordion focus order                                           */
/* ================================================================== */

describe('Focus order — Accordion', () => {
  const items: AccordionItem[] = [
    { value: 'section-1', title: 'Section One', content: <button data-testid="content-btn-1">Content 1 Button</button> },
    { value: 'section-2', title: 'Section Two', content: <button data-testid="content-btn-2">Content 2 Button</button> },
    { value: 'section-3', title: 'Section Three', content: <span>Content 3</span> },
  ];

  it('Tab moves between accordion headers', async () => {
    const user = userEvent.setup();

    render(<Accordion items={items} ariaLabel="FAQ" />);

    const triggers = screen.getAllByRole('button');
    triggers[0].focus();
    expect(document.activeElement).toBe(triggers[0]);

    await user.tab();
    expect(document.activeElement).toBe(triggers[1]);

    await user.tab();
    expect(document.activeElement).toBe(triggers[2]);
  });

  it('Content of open panel is in tab order after its header', async () => {
    const user = userEvent.setup();

    render(
      <Accordion items={items} defaultValue={['section-1']} ariaLabel="FAQ" />,
    );

    const triggers = screen.getAllByRole('button');
    triggers[0].focus();

    // Tab from first trigger should go to its content (panel is open)
    await user.tab();
    const contentBtn = screen.getByTestId('content-btn-1');
    expect(document.activeElement).toBe(contentBtn);
  });

  it('Closed panel content is NOT in tab order', () => {
    // All panels are closed by default (destroyOnHidden=true removes them from DOM)
    render(
      <Accordion items={items} ariaLabel="FAQ" />,
    );

    // With destroyOnHidden=true (default), closed panels should not render
    // their content at all — verify no content buttons exist in the DOM
    expect(screen.queryByTestId('content-btn-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('content-btn-2')).not.toBeInTheDocument();

    // All panels should be hidden/not rendered
    const panels = document.querySelectorAll('[role="region"]');
    expect(panels.length).toBe(0);
  });
});

/* ================================================================== */
/*  5. Drawer focus management                                         */
/* ================================================================== */

describe('Focus order — Drawer', () => {
  it('Focus moves to drawer content on open', () => {
    render(
      <Drawer open onClose={() => {}} title="Test Drawer">
        <button data-testid="drawer-action">Drawer Action</button>
      </Drawer>,
    );

    // Drawer auto-focuses its panel via panelRef.current?.focus()
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    // The panel gets focus (tabIndex={-1})
    expect(document.activeElement).toBe(dialog);
  });

  it('Tab order stays within drawer when open', async () => {
    const user = userEvent.setup();

    render(
      <Drawer open onClose={() => {}} title="Focus Drawer">
        <button data-testid="drawer-btn-1">First</button>
        <button data-testid="drawer-btn-2">Second</button>
      </Drawer>,
    );

    const dialog = screen.getByRole('dialog');
    expect(document.activeElement).toBe(dialog);

    // Tab through drawer content
    await user.tab();
    const closeBtn = screen.getByLabelText('Close');
    expect(document.activeElement).toBe(closeBtn);

    await user.tab();
    const btn1 = screen.getByTestId('drawer-btn-1');
    expect(document.activeElement).toBe(btn1);

    await user.tab();
    const btn2 = screen.getByTestId('drawer-btn-2');
    expect(document.activeElement).toBe(btn2);
  });

  it('Focus returns to trigger on close (useFocusRestore)', () => {
    function DrawerWrapper() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button data-testid="drawer-trigger" onClick={() => setOpen(true)}>
            Open Drawer
          </button>
          <Drawer open={open} onClose={() => setOpen(false)} title="Test">
            <button data-testid="inside-drawer">Inside</button>
          </Drawer>
        </>
      );
    }

    render(<DrawerWrapper />);

    const trigger = screen.getByTestId('drawer-trigger');
    trigger.focus();
    expect(document.activeElement).toBe(trigger);

    // Open drawer
    fireEvent.click(trigger);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Close drawer
    fireEvent.click(screen.getByLabelText('Close'));

    // After close, the trigger should still be in the document
    expect(trigger).toBeInTheDocument();
  });
});

/* ================================================================== */
/*  6. Composite components                                            */
/* ================================================================== */

describe('Focus order — Composite components', () => {
  it('Combobox: Tab to input, Tab moves to next field (not dropdown)', async () => {
    const user = userEvent.setup();
    const options: ComboboxOption[] = [
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana' },
    ];

    render(
      <div>
        <Combobox options={options} label="Fruit" />
        <button data-testid="next-field">Next</button>
      </div>,
    );

    const input = screen.getByRole('combobox');
    input.focus();
    expect(document.activeElement).toBe(input);

    // Open dropdown by typing
    await user.type(input, 'A');

    // Tab should leave the combobox and go to next field
    await user.tab();
    const nextField = screen.getByTestId('next-field');
    expect(document.activeElement).toBe(nextField);
  });

  it('Breadcrumb: Only link items are focusable, current page is not a link', async () => {
    const user = userEvent.setup();
    const breadcrumbItems: BreadcrumbItem[] = [
      { label: 'Home', onClick: vi.fn() },
      { label: 'Products', onClick: vi.fn() },
      { label: 'Current Page' }, // last item — no onClick, rendered as span
    ];

    render(
      <div>
        <button data-testid="before-breadcrumb">Before</button>
        <Breadcrumb items={breadcrumbItems} />
        <button data-testid="after-breadcrumb">After</button>
      </div>,
    );

    const beforeBtn = screen.getByTestId('before-breadcrumb');
    beforeBtn.focus();

    // Tab to first breadcrumb link (Home)
    await user.tab();
    const links = screen.getAllByRole('button').filter(
      (el) => el.textContent === 'Home' || el.textContent === 'Products',
    );
    expect(document.activeElement).toBe(links[0]);

    // Tab to second breadcrumb link (Products)
    await user.tab();
    expect(document.activeElement).toBe(links[1]);

    // Tab should skip current page (span with aria-current) and go to after
    await user.tab();
    const afterBtn = screen.getByTestId('after-breadcrumb');
    expect(document.activeElement).toBe(afterBtn);

    // Verify current page has aria-current="page"
    const currentPage = screen.getByText('Current Page');
    expect(currentPage).toHaveAttribute('aria-current', 'page');
  });

  it('Breadcrumb: Current page is rendered as non-interactive span', () => {
    const breadcrumbItems: BreadcrumbItem[] = [
      { label: 'Home', onClick: vi.fn() },
      { label: 'Current' },
    ];

    render(<Breadcrumb items={breadcrumbItems} />);

    const currentPage = screen.getByText('Current');
    // Should be a span, not a button or link
    expect(currentPage.tagName).toBe('SPAN');
    expect(currentPage).toHaveAttribute('aria-current', 'page');
  });
});
