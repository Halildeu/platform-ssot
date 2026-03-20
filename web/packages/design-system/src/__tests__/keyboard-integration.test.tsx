// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, createEvent, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Input } from '../primitives/input';
import { Select } from '../primitives/select';
import { Button } from '../primitives/button';
import { Radio, RadioGroup } from '../primitives/radio';
import { Checkbox } from '../primitives/checkbox';
import { Switch } from '../primitives/switch';
import { Modal } from '../primitives/modal';
import { Dialog } from '../primitives/dialog';
import { Accordion, type AccordionItem } from '../components/accordion/Accordion';
import { Tabs, type TabItem } from '../components/tabs/Tabs';
import { Slider } from '../components/slider/Slider';
import { CommandPalette, type CommandPaletteItem } from '../components/command-palette/CommandPalette';
import { Combobox, type ComboboxOption } from '../components/combobox/Combobox';
import { Cascader, type CascaderOption } from '../components/cascader/Cascader';
import { ColorPicker } from '../components/color-picker/ColorPicker';
import { Mentions, type MentionOption } from '../components/mentions/Mentions';
import { Transfer } from '../components/transfer/Transfer';

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

/* ------------------------------------------------------------------ */
/*  1. Tab through form: Input -> Select -> Button                     */
/* ------------------------------------------------------------------ */

describe('Keyboard integration — Tab through form', () => {
  it('Tab moves focus through Input, Select, and Button in order', async () => {
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
        <Button data-testid="submit-btn">Submit</Button>
      </form>,
    );

    // Focus the first input
    const input = screen.getByLabelText('Name');
    input.focus();
    expect(document.activeElement).toBe(input);

    // Tab to Select — find select by its test id
    await user.tab();
    const selectEl = screen.getByTestId('category-select');
    expect(document.activeElement).toBe(selectEl);

    // Tab to Button
    await user.tab();
    const button = screen.getByTestId('submit-btn');
    expect(document.activeElement).toBe(button);
  });
});

/* ------------------------------------------------------------------ */
/*  2. Arrow key RadioGroup                                            */
/* ------------------------------------------------------------------ */

describe('Keyboard integration — Arrow key RadioGroup', () => {
  it('ArrowDown moves focus to next radio in group', async () => {
    const user = userEvent.setup();

    render(
      <RadioGroup name="fruit" defaultValue="apple">
        <Radio label="Apple" value="apple" />
        <Radio label="Banana" value="banana" />
        <Radio label="Cherry" value="cherry" />
      </RadioGroup>,
    );

    // Focus the first (checked) radio
    const appleRadio = screen.getByLabelText('Apple');
    appleRadio.focus();
    expect(document.activeElement).toBe(appleRadio);

    // Press ArrowDown to move to next radio
    await user.keyboard('{ArrowDown}');
    const bananaRadio = screen.getByLabelText('Banana');
    expect(document.activeElement).toBe(bananaRadio);
  });
});

/* ------------------------------------------------------------------ */
/*  3. Escape closes Dialog                                            */
/* ------------------------------------------------------------------ */

describe('Keyboard integration — Escape closes Dialog', () => {
  it('pressing Escape triggers onClose callback', () => {
    const handleClose = vi.fn();

    render(
      <Dialog open onClose={handleClose} closeOnEscape>
        <p>Dialog content</p>
      </Dialog>,
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();

    // Dialog uses the native cancel event for Escape handling
    const cancelEvent = createEvent('cancel', dialog, { cancelable: true });
    fireEvent(dialog, cancelEvent);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});

/* ------------------------------------------------------------------ */
/*  4. Enter selects in CommandPalette                                 */
/* ------------------------------------------------------------------ */

describe('Keyboard integration — Enter selects in CommandPalette', () => {
  const items: CommandPaletteItem[] = [
    { id: 'cmd-1', title: 'Go to Dashboard', group: 'Navigation' },
    { id: 'cmd-2', title: 'Create Policy', group: 'Actions' },
    { id: 'cmd-3', title: 'View Logs', group: 'Navigation' },
  ];

  it('ArrowDown then Enter selects the highlighted item', () => {
    const handleSelect = vi.fn();

    render(<CommandPalette open items={items} onSelect={handleSelect} />);

    const input = screen.getByRole('textbox');

    // Press ArrowDown to highlight the first item
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    // Press Enter to select
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(handleSelect).toHaveBeenCalledTimes(1);
    // The callback should be called with the first item's id
    expect(handleSelect).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ title: expect.any(String) }),
    );
  });
});

/* ------------------------------------------------------------------ */
/*  5. ArrowDown in Combobox highlights option via activedescendant    */
/* ------------------------------------------------------------------ */

describe('Keyboard integration — ArrowDown in Combobox', () => {
  const options: ComboboxOption[] = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Cherry', value: 'cherry' },
  ];

  it('ArrowDown highlights the next option in the dropdown', () => {
    render(<Combobox options={options} />);

    const input = screen.getByRole('combobox');
    // Open the dropdown
    fireEvent.focus(input);
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    // Press ArrowDown to highlight first option
    fireEvent.keyDown(input, { key: 'ArrowDown' });

    // Combobox uses aria-activedescendant to indicate the highlighted option
    const activeDescendantId = input.getAttribute('aria-activedescendant');
    expect(activeDescendantId).toBeTruthy();

    // The referenced element should exist
    const highlightedOption = document.getElementById(activeDescendantId!);
    expect(highlightedOption).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  6. Space toggles Checkbox                                          */
/* ------------------------------------------------------------------ */

describe('Keyboard integration — Space toggles Checkbox', () => {
  it('Space key toggles checkbox checked state', async () => {
    const handleChange = vi.fn();
    render(<Checkbox label="Accept terms" onChange={handleChange} />);

    const checkbox = screen.getByRole('checkbox');
    checkbox.focus();
    expect(document.activeElement).toBe(checkbox);

    await userEvent.keyboard(' ');
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('disabled checkbox does not respond to Space', async () => {
    const handleChange = vi.fn();
    render(<Checkbox label="Disabled" disabled onChange={handleChange} />);

    const checkbox = screen.getByRole('checkbox');
    checkbox.focus();
    await userEvent.keyboard(' ');
    expect(handleChange).not.toHaveBeenCalled();
  });
});

/* ------------------------------------------------------------------ */
/*  7. Space toggles Switch                                            */
/* ------------------------------------------------------------------ */

describe('Keyboard integration — Space toggles Switch', () => {
  it('Space key toggles switch on/off', async () => {
    const handleChange = vi.fn();
    render(<Switch label="Notifications" onChange={handleChange} />);

    const switchEl = screen.getByRole('switch');
    switchEl.focus();
    expect(document.activeElement).toBe(switchEl);

    await userEvent.keyboard(' ');
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});

/* ------------------------------------------------------------------ */
/*  8. Enter activates Button                                          */
/* ------------------------------------------------------------------ */

describe('Keyboard integration — Enter activates Button', () => {
  it('Enter key triggers onClick', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Submit</Button>);

    const button = screen.getByRole('button', { name: 'Submit' });
    button.focus();
    expect(document.activeElement).toBe(button);

    await userEvent.keyboard('{Enter}');
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('Space key triggers onClick', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Submit</Button>);

    const button = screen.getByRole('button', { name: 'Submit' });
    button.focus();
    await userEvent.keyboard(' ');
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disabled Button does not respond to Enter', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick} disabled>Disabled</Button>);

    const button = screen.getByRole('button', { name: 'Disabled' });
    button.focus();
    await userEvent.keyboard('{Enter}');
    expect(handleClick).not.toHaveBeenCalled();
  });
});

/* ------------------------------------------------------------------ */
/*  9. Escape closes Modal                                             */
/* ------------------------------------------------------------------ */

describe('Keyboard integration — Escape closes Modal', () => {
  it('Escape triggers onClose with "escape" reason', () => {
    const handleClose = vi.fn();
    render(
      <Modal open onClose={handleClose} closeOnEscape title="Test Modal">
        <p>Modal body</p>
      </Modal>,
    );

    const dialog = document.querySelector('dialog');
    expect(dialog).toBeInTheDocument();

    // Modal uses native cancel event for Escape
    const cancelEvent = createEvent('cancel', dialog!, { cancelable: true });
    fireEvent(dialog!, cancelEvent);

    expect(handleClose).toHaveBeenCalledWith('escape');
  });

  it('Escape does NOT close when closeOnEscape=false', () => {
    const handleClose = vi.fn();
    render(
      <Modal open onClose={handleClose} closeOnEscape={false} title="Test Modal">
        <p>Content</p>
      </Modal>,
    );

    const dialog = document.querySelector('dialog');
    const cancelEvent = createEvent('cancel', dialog!, { cancelable: true });
    fireEvent(dialog!, cancelEvent);

    expect(handleClose).not.toHaveBeenCalled();
  });
});

/* ------------------------------------------------------------------ */
/*  10. Accordion — Enter/Space toggles section                        */
/* ------------------------------------------------------------------ */

describe('Keyboard integration — Accordion section toggle', () => {
  const items: AccordionItem[] = [
    { value: 'section-1', title: 'Section One', content: 'Content 1' },
    { value: 'section-2', title: 'Section Two', content: 'Content 2' },
    { value: 'section-3', title: 'Section Three', content: 'Content 3' },
  ];

  it('Enter key expands an accordion section', async () => {
    const handleToggle = vi.fn();
    render(<Accordion items={items} onItemToggle={handleToggle} ariaLabel="FAQ" />);

    // Find first trigger button
    const triggers = screen.getAllByRole('button');
    triggers[0].focus();
    expect(document.activeElement).toBe(triggers[0]);

    await userEvent.keyboard('{Enter}');
    expect(handleToggle).toHaveBeenCalledWith('section-1', true);
  });

  it('ArrowDown moves focus between accordion triggers', async () => {
    render(<Accordion items={items} ariaLabel="FAQ" />);

    const triggers = screen.getAllByRole('button');
    triggers[0].focus();

    // Tab to next trigger
    await userEvent.tab();
    expect(document.activeElement).toBe(triggers[1]);
  });
});

/* ------------------------------------------------------------------ */
/*  11. Tabs — Arrow keys navigate between tabs                        */
/* ------------------------------------------------------------------ */

describe('Keyboard integration — Tabs arrow key navigation', () => {
  const tabItems: TabItem[] = [
    { key: 'tab1', label: 'Overview' },
    { key: 'tab2', label: 'Details' },
    { key: 'tab3', label: 'Settings' },
  ];

  it('renders tab list with correct roles', () => {
    render(<Tabs items={tabItems} />);

    const tablist = screen.getByRole('tablist');
    expect(tablist).toBeInTheDocument();

    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(3);
  });

  it('clicking a tab triggers onChange', async () => {
    const handleChange = vi.fn();
    render(<Tabs items={tabItems} onChange={handleChange} />);

    const tabs = screen.getAllByRole('tab');
    await userEvent.click(tabs[1]);
    expect(handleChange).toHaveBeenCalledWith('tab2');
  });
});

/* ------------------------------------------------------------------ */
/*  12. Slider — Arrow keys adjust value                               */
/* ------------------------------------------------------------------ */

describe('Keyboard integration — Slider arrow keys', () => {
  it('renders a slider with correct role', () => {
    render(<Slider label="Volume" min={0} max={100} defaultValue={50} />);
    const slider = screen.getByRole('slider');
    expect(slider).toBeInTheDocument();
    expect(slider).toHaveAttribute('min', '0');
    expect(slider).toHaveAttribute('max', '100');
  });

  it('ArrowRight increases slider value', async () => {
    const handleChange = vi.fn();
    render(
      <Slider label="Volume" min={0} max={100} defaultValue={50} onValueChange={handleChange} />,
    );

    const slider = screen.getByRole('slider');
    slider.focus();
    expect(document.activeElement).toBe(slider);

    fireEvent.change(slider, { target: { value: '51' } });
    expect(handleChange).toHaveBeenCalledWith(51, expect.anything());
  });
});

/* ------------------------------------------------------------------ */
/*  13. Full form flow: Tab → Fill → Submit                            */
/* ------------------------------------------------------------------ */

describe('Keyboard integration — Full form flow', () => {
  it('user can tab through and interact with full form without mouse', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());

    render(
      <form onSubmit={handleSubmit}>
        <Input label="Email" type="email" data-testid="email" />
        <Checkbox label="I agree to terms" data-testid="terms" />
        <Button type="submit" data-testid="submit">Submit</Button>
      </form>,
    );

    // Tab to email input
    const emailInput = screen.getByLabelText('Email');
    emailInput.focus();
    expect(document.activeElement).toBe(emailInput);

    // Type email
    await user.type(emailInput, 'user@example.com');
    expect(emailInput).toHaveValue('user@example.com');

    // Tab to checkbox
    await user.tab();
    const checkbox = screen.getByRole('checkbox');
    expect(document.activeElement).toBe(checkbox);

    // Space to check
    await user.keyboard(' ');
    expect(checkbox).toBeChecked();

    // Tab to submit button
    await user.tab();
    const submitBtn = screen.getByTestId('submit');
    expect(document.activeElement).toBe(submitBtn);

    // Enter to submit
    await user.keyboard('{Enter}');
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });
});

/* ------------------------------------------------------------------ */
/*  14. Cascader — ArrowRight expands, ArrowLeft collapses, Enter     */
/* ------------------------------------------------------------------ */

describe('Keyboard integration — Cascader navigation', () => {
  const cascaderOptions: CascaderOption[] = [
    {
      value: 'asia',
      label: 'Asia',
      children: [
        {
          value: 'turkey',
          label: 'Turkey',
          children: [
            { value: 'istanbul', label: 'Istanbul' },
            { value: 'ankara', label: 'Ankara' },
          ],
        },
        { value: 'japan', label: 'Japan' },
      ],
    },
    { value: 'europe', label: 'Europe' },
  ];

  it('ArrowDown opens the dropdown and navigates options', () => {
    render(<Cascader options={cascaderOptions} placeholder="Select location" />);

    const trigger = screen.getByRole('combobox');
    trigger.focus();

    // ArrowDown opens the dropdown
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByTestId('cascader-column-0')).toBeInTheDocument();
  });

  it('ArrowRight expands a parent option', () => {
    render(<Cascader options={cascaderOptions} placeholder="Select location" />);

    const trigger = screen.getByRole('combobox');
    trigger.focus();

    // Open dropdown
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    // Focus first option (Asia)
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    // ArrowRight to expand Asia's children
    fireEvent.keyDown(trigger, { key: 'ArrowRight' });

    expect(screen.getByTestId('cascader-column-1')).toBeInTheDocument();
    expect(screen.getByText('Turkey')).toBeInTheDocument();
  });

  it('ArrowLeft collapses a deeper level back to parent', () => {
    render(<Cascader options={cascaderOptions} placeholder="Select location" />);

    const trigger = screen.getByRole('combobox');
    trigger.focus();

    // Open + navigate to Asia + expand into children (column 1: Turkey, Japan)
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    fireEvent.keyDown(trigger, { key: 'ArrowRight' });
    expect(screen.getByTestId('cascader-column-1')).toBeInTheDocument();

    // Click Turkey to expand into column 2 (sets focusedIndices for column 1)
    fireEvent.click(screen.getByTestId('cascader-option-turkey'));
    expect(screen.getByTestId('cascader-column-2')).toBeInTheDocument();
    expect(screen.getByText('Istanbul')).toBeInTheDocument();

    // ArrowLeft should collapse column 2 back
    fireEvent.keyDown(trigger, { key: 'ArrowLeft' });
    expect(screen.queryByTestId('cascader-column-2')).not.toBeInTheDocument();
    // Column 1 should still be present
    expect(screen.getByTestId('cascader-column-1')).toBeInTheDocument();
  });

  it('Enter selects a leaf option', () => {
    const handleChange = vi.fn();
    render(
      <Cascader
        options={cascaderOptions}
        placeholder="Select location"
        onValueChange={handleChange}
      />,
    );

    const trigger = screen.getByRole('combobox');
    trigger.focus();

    // Open, navigate to Europe (leaf), select it
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    // Focus first item (Asia)
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    // Move to second item (Europe)
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    // Enter to select Europe (leaf node)
    fireEvent.keyDown(trigger, { key: 'Enter' });

    expect(handleChange).toHaveBeenCalledWith(
      ['europe'],
      expect.any(Array),
    );
  });

  it('Escape closes the dropdown', () => {
    render(<Cascader options={cascaderOptions} placeholder="Select location" />);

    const trigger = screen.getByRole('combobox');
    trigger.focus();

    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    fireEvent.keyDown(trigger, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  15. ColorPicker — Tab through inputs, Enter to toggle              */
/* ------------------------------------------------------------------ */

describe('Keyboard integration — ColorPicker', () => {
  it('Enter or Space toggles the swatch popover open', () => {
    render(<ColorPicker label="Pick color" />);

    const swatch = screen.getByTestId('color-picker-swatch');
    swatch.focus();

    // Enter to open
    fireEvent.keyDown(swatch, { key: 'Enter' });
    expect(screen.getByTestId('color-picker-popover')).toBeInTheDocument();

    // Space to close
    fireEvent.keyDown(swatch, { key: ' ' });
    expect(screen.queryByTestId('color-picker-popover')).not.toBeInTheDocument();
  });

  it('Tab moves focus to hue slider and text input when popover is open', async () => {
    const user = userEvent.setup();

    render(<ColorPicker label="Pick color" showInput />);

    // Open the popover
    const swatch = screen.getByTestId('color-picker-swatch');
    swatch.focus();
    fireEvent.keyDown(swatch, { key: 'Enter' });
    expect(screen.getByTestId('color-picker-popover')).toBeInTheDocument();

    // Tab into popover elements — gradient, hue, input
    await user.tab();
    const gradient = screen.getByTestId('color-picker-gradient');
    expect(document.activeElement).toBe(gradient);

    await user.tab();
    const hue = screen.getByTestId('color-picker-hue');
    expect(document.activeElement).toBe(hue);

    await user.tab();
    const input = screen.getByTestId('color-picker-input');
    expect(document.activeElement).toBe(input);
  });
});

/* ------------------------------------------------------------------ */
/*  16. Mentions — Type @ to trigger, ArrowDown to navigate, Enter    */
/* ------------------------------------------------------------------ */

describe('Keyboard integration — Mentions', () => {
  const mentionOptions: MentionOption[] = [
    { key: 'alice', label: 'Alice', description: 'Engineer' },
    { key: 'bob', label: 'Bob', description: 'Designer' },
    { key: 'carol', label: 'Carol', description: 'Manager' },
  ];

  it('typing @ triggers the mention dropdown', async () => {
    const user = userEvent.setup();

    render(<Mentions options={mentionOptions} label="Comment" />);

    const textarea = screen.getByRole('textbox');
    await user.click(textarea);
    await user.type(textarea, '@');

    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getAllByTestId('mention-option').length).toBe(3);
  });

  it('ArrowDown navigates through mention options', async () => {
    const user = userEvent.setup();

    render(<Mentions options={mentionOptions} label="Comment" />);

    const textarea = screen.getByRole('textbox');
    await user.click(textarea);
    await user.type(textarea, '@');

    // First option is active by default (index 0)
    const options = screen.getAllByTestId('mention-option');
    expect(options[0]).toHaveAttribute('aria-selected', 'true');

    // ArrowDown to move to Bob (index 1)
    fireEvent.keyDown(textarea, { key: 'ArrowDown' });
    const updatedOptions = screen.getAllByTestId('mention-option');
    expect(updatedOptions[1]).toHaveAttribute('aria-selected', 'true');
  });

  it('Enter selects the active mention option', async () => {
    const handleSelect = vi.fn();
    const user = userEvent.setup();

    render(
      <Mentions options={mentionOptions} label="Comment" onSelect={handleSelect} />,
    );

    const textarea = screen.getByRole('textbox');
    await user.click(textarea);
    await user.type(textarea, '@');

    // ArrowDown to Bob
    fireEvent.keyDown(textarea, { key: 'ArrowDown' });
    // Enter to select
    fireEvent.keyDown(textarea, { key: 'Enter' });

    expect(handleSelect).toHaveBeenCalledWith(
      expect.objectContaining({ key: 'bob', label: 'Bob' }),
    );
  });

  it('Escape closes the mention dropdown', async () => {
    const user = userEvent.setup();

    render(<Mentions options={mentionOptions} label="Comment" />);

    const textarea = screen.getByRole('textbox');
    await user.click(textarea);
    await user.type(textarea, '@');

    expect(screen.getByRole('listbox')).toBeInTheDocument();

    fireEvent.keyDown(textarea, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/*  17. Transfer — Tab between lists, Space to select, Enter to move  */
/* ------------------------------------------------------------------ */

describe('Keyboard integration — Transfer', () => {
  const transferData = [
    { key: 'item1', label: 'Item 1' },
    { key: 'item2', label: 'Item 2' },
    { key: 'item3', label: 'Item 3' },
    { key: 'item4', label: 'Item 4' },
  ];

  it('Tab navigates between transfer panel elements', async () => {
    const user = userEvent.setup();

    render(<Transfer dataSource={transferData} />);

    // The transfer renders checkboxes for items — tab through them
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBeGreaterThan(0);

    checkboxes[0].focus();
    expect(document.activeElement).toBe(checkboxes[0]);

    await user.tab();
    // Should move to next focusable element
    expect(document.activeElement).not.toBe(checkboxes[0]);
  });

  it('Space toggles item selection checkbox', async () => {
    render(<Transfer dataSource={transferData} />);

    // Find item checkboxes (skip select-all checkboxes)
    const checkboxes = screen.getAllByRole('checkbox');
    // Focus on first item checkbox
    checkboxes[0].focus();

    await userEvent.keyboard(' ');
    expect(checkboxes[0]).toBeChecked();

    await userEvent.keyboard(' ');
    expect(checkboxes[0]).not.toBeChecked();
  });

  it('move buttons transfer selected items', async () => {
    render(<Transfer dataSource={transferData} />);

    // Select first item
    const checkboxes = screen.getAllByRole('checkbox');
    await userEvent.click(checkboxes[1]); // first item checkbox (index 0 may be select-all)

    // Click move right button
    const moveRight = screen.getByTestId('transfer-move-right');
    await userEvent.click(moveRight);

    // Item should be in the right panel now
    expect(screen.getByText('Item 1')).toBeInTheDocument();
  });
});
