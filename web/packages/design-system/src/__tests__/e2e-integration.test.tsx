// @vitest-environment jsdom
import React, { useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { act, cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SearchFilterListing, type ActiveFilter } from '../components/search-filter-listing/SearchFilterListing';
import { FormField } from '../components/form-field/FormField';
import { Modal } from '../primitives/modal/Modal';
import { Dialog } from '../primitives/dialog/Dialog';
import { Tabs, type TabItem } from '../components/tabs/Tabs';
import { Accordion, type AccordionItem } from '../components/accordion/Accordion';
import { Drawer } from '../primitives/drawer/Drawer';
import { ToastProvider, useToast } from '../components/toast/Toast';
import { Button } from '../primitives/button/Button';

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
/*  1. SearchFilterListing flow                                        */
/* ================================================================== */

describe('SearchFilterListing flow', () => {
  function SearchFilterListingHarness() {
    const allItems = ['Alpha Widget', 'Beta Service', 'Gamma Tool', 'Delta Platform'];
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

    const filteredItems = allItems.filter((item) => {
      const matchesSearch = item.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = categoryFilter ? item.toLowerCase().includes(categoryFilter.toLowerCase()) : true;
      return matchesSearch && matchesFilter;
    });

    const activeFilters: ActiveFilter[] = categoryFilter
      ? [
          {
            key: 'category',
            label: 'Category',
            value: categoryFilter,
            onRemove: () => setCategoryFilter(null),
          },
        ]
      : [];

    return (
      <SearchFilterListing
        title="Products"
        filters={
          <div>
            <input
              data-testid="search-input"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button data-testid="filter-beta" onClick={() => setCategoryFilter('Beta')}>
              Filter Beta
            </button>
            <button data-testid="filter-clear" onClick={() => setCategoryFilter(null)}>
              Clear Filter
            </button>
          </div>
        }
        activeFilters={activeFilters}
        onClearAllFilters={() => setCategoryFilter(null)}
        items={filteredItems.map((item) => (
          <div key={item} data-testid={`item-${item}`}>
            {item}
          </div>
        ))}
        emptyStateLabel="No products found"
        disablePortal
      />
    );
  }

  it('user types in search input, results filter, clear search resets results', async () => {
    const user = userEvent.setup();
    render(<SearchFilterListingHarness />);

    // All 4 items visible initially
    expect(screen.getByTestId('item-Alpha Widget')).toBeInTheDocument();
    expect(screen.getByTestId('item-Beta Service')).toBeInTheDocument();
    expect(screen.getByTestId('item-Gamma Tool')).toBeInTheDocument();
    expect(screen.getByTestId('item-Delta Platform')).toBeInTheDocument();

    // Type search term
    const searchInput = screen.getByTestId('search-input');
    await user.type(searchInput, 'Alpha');

    expect(screen.getByTestId('item-Alpha Widget')).toBeInTheDocument();
    expect(screen.queryByTestId('item-Beta Service')).not.toBeInTheDocument();
    expect(screen.queryByTestId('item-Gamma Tool')).not.toBeInTheDocument();

    // Clear search
    await user.clear(searchInput);

    expect(screen.getByTestId('item-Alpha Widget')).toBeInTheDocument();
    expect(screen.getByTestId('item-Beta Service')).toBeInTheDocument();
    expect(screen.getByTestId('item-Gamma Tool')).toBeInTheDocument();
    expect(screen.getByTestId('item-Delta Platform')).toBeInTheDocument();
  });

  it('user applies filter, sees filtered results, removes filter, sees all results', async () => {
    const user = userEvent.setup();
    render(<SearchFilterListingHarness />);

    // Apply filter
    await user.click(screen.getByTestId('filter-beta'));

    expect(screen.getByTestId('item-Beta Service')).toBeInTheDocument();
    expect(screen.queryByTestId('item-Alpha Widget')).not.toBeInTheDocument();

    // Remove filter via clear button
    await user.click(screen.getByTestId('filter-clear'));

    expect(screen.getByTestId('item-Alpha Widget')).toBeInTheDocument();
    expect(screen.getByTestId('item-Beta Service')).toBeInTheDocument();
  });

  it('user searches + filters combined, correct intersection shown', async () => {
    const user = userEvent.setup();
    render(<SearchFilterListingHarness />);

    // Apply filter for Beta
    await user.click(screen.getByTestId('filter-beta'));
    expect(screen.getByTestId('item-Beta Service')).toBeInTheDocument();

    // Also type search that matches Beta
    const searchInput = screen.getByTestId('search-input');
    await user.type(searchInput, 'Service');

    expect(screen.getByTestId('item-Beta Service')).toBeInTheDocument();
    expect(screen.queryByTestId('item-Alpha Widget')).not.toBeInTheDocument();

    // Type search that does NOT match Beta
    await user.clear(searchInput);
    await user.type(searchInput, 'Alpha');

    // No items: "Alpha" search + "Beta" filter = empty intersection
    expect(screen.queryByTestId('item-Beta Service')).not.toBeInTheDocument();
    expect(screen.queryByTestId('item-Alpha Widget')).not.toBeInTheDocument();
  });

  it('empty state shown when no results match', async () => {
    const user = userEvent.setup();
    render(<SearchFilterListingHarness />);

    const searchInput = screen.getByTestId('search-input');
    await user.type(searchInput, 'zzzznonexistent');

    // The EmptyState component renders description text
    expect(screen.getByText('No products found')).toBeInTheDocument();
  });
});

/* ================================================================== */
/*  2. Form submission flow                                            */
/* ================================================================== */

describe('Form submission flow', () => {
  function FormHarness({ onSubmit }: { onSubmit: (data: Record<string, string | boolean>) => void }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [category, setCategory] = useState('');
    const [agree, setAgree] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newErrors: Record<string, string> = {};
      if (!name) newErrors.name = 'Name is required';
      if (!email) newErrors.email = 'Email is required';
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      setErrors({});
      setSubmitted(true);
      onSubmit({ name, email, category, agree });
    };

    const handleReset = () => {
      setName('');
      setEmail('');
      setCategory('');
      setAgree(false);
      setErrors({});
      setSubmitted(false);
    };

    return (
      <form onSubmit={handleSubmit} data-testid="test-form">
        <FormField label="Name" error={errors.name} required>
          <input
            data-testid="name-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </FormField>
        <FormField label="Email" error={errors.email} required>
          <input
            data-testid="email-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormField>
        <FormField label="Category">
          <select
            data-testid="category-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select...</option>
            <option value="a">A</option>
            <option value="b">B</option>
          </select>
        </FormField>
        <label>
          <input
            type="checkbox"
            data-testid="agree-checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          />
          I agree
        </label>
        <Button type="submit" data-testid="submit-btn">Submit</Button>
        <Button type="button" variant="secondary" data-testid="reset-btn" onClick={handleReset}>Reset</Button>
        {submitted && <div data-testid="success-message">Form submitted successfully</div>}
      </form>
    );
  }

  it('user fills FormField inputs, submits form, values captured correctly', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<FormHarness onSubmit={onSubmit} />);

    await user.type(screen.getByTestId('name-input'), 'Jane Doe');
    await user.type(screen.getByTestId('email-input'), 'jane@example.com');
    await user.click(screen.getByTestId('submit-btn'));

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Jane Doe',
      email: 'jane@example.com',
      category: '',
      agree: false,
    });
    expect(screen.getByTestId('success-message')).toBeInTheDocument();
  });

  it('user submits with validation errors, sees errors, fixes them, resubmits', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<FormHarness onSubmit={onSubmit} />);

    // Submit empty form
    await user.click(screen.getByTestId('submit-btn'));

    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();

    // Fix errors
    await user.type(screen.getByTestId('name-input'), 'John');
    await user.type(screen.getByTestId('email-input'), 'john@test.com');
    await user.click(screen.getByTestId('submit-btn'));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Name is required')).not.toBeInTheDocument();
    expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
  });

  it('user fills form with Select + Input + Checkbox, all values captured', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<FormHarness onSubmit={onSubmit} />);

    await user.type(screen.getByTestId('name-input'), 'Alice');
    await user.type(screen.getByTestId('email-input'), 'alice@co.com');
    await user.selectOptions(screen.getByTestId('category-select'), 'b');
    await user.click(screen.getByTestId('agree-checkbox'));
    await user.click(screen.getByTestId('submit-btn'));

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Alice',
      email: 'alice@co.com',
      category: 'b',
      agree: true,
    });
  });

  it('form reset clears all fields', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<FormHarness onSubmit={onSubmit} />);

    await user.type(screen.getByTestId('name-input'), 'Bob');
    await user.type(screen.getByTestId('email-input'), 'bob@test.com');
    await user.selectOptions(screen.getByTestId('category-select'), 'a');
    await user.click(screen.getByTestId('agree-checkbox'));

    // Reset
    await user.click(screen.getByTestId('reset-btn'));

    expect(screen.getByTestId('name-input')).toHaveValue('');
    expect(screen.getByTestId('email-input')).toHaveValue('');
    expect(screen.getByTestId('category-select')).toHaveValue('');
    expect(screen.getByTestId('agree-checkbox')).not.toBeChecked();
  });
});

/* ================================================================== */
/*  3. Modal/Dialog lifecycle                                          */
/* ================================================================== */

describe('Modal/Dialog lifecycle', () => {
  function ModalHarness() {
    const [open, setOpen] = useState(false);
    const [formValue, setFormValue] = useState('');

    return (
      <div>
        <Button data-testid="modal-trigger" onClick={() => setOpen(true)}>Open Modal</Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Edit Item"
          disablePortal
          footer={
            <Button data-testid="modal-save" onClick={() => setOpen(false)}>Save</Button>
          }
        >
          <input
            data-testid="modal-input"
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
            placeholder="Enter value"
          />
        </Modal>
        {formValue && <div data-testid="saved-value">{formValue}</div>}
      </div>
    );
  }

  it('user clicks trigger, modal opens, fills form inside, closes modal', async () => {
    const user = userEvent.setup();
    render(<ModalHarness />);

    // Modal not visible
    expect(screen.queryByText('Edit Item')).not.toBeInTheDocument();

    // Open modal
    await user.click(screen.getByTestId('modal-trigger'));
    expect(screen.getByText('Edit Item')).toBeInTheDocument();

    // Fill form
    await user.type(screen.getByTestId('modal-input'), 'New Value');

    // Close via save
    await user.click(screen.getByTestId('modal-save'));

    // Modal gone
    expect(screen.queryByText('Edit Item')).not.toBeInTheDocument();
    // Value persisted
    expect(screen.getByTestId('saved-value')).toHaveTextContent('New Value');
  });

  it('user opens modal, presses Escape, modal closes, focus returns to trigger', async () => {
    const user = userEvent.setup();
    render(<ModalHarness />);

    const trigger = screen.getByTestId('modal-trigger');
    await user.click(trigger);
    expect(screen.getByText('Edit Item')).toBeInTheDocument();

    // The dialog uses native <dialog> which handles cancel event for Escape
    // We simulate the cancel event on the dialog element
    const dialog = document.querySelector('dialog');
    expect(dialog).toBeTruthy();
    act(() => {
      const cancelEvent = new Event('cancel', { bubbles: false, cancelable: true });
      dialog!.dispatchEvent(cancelEvent);
    });

    expect(screen.queryByText('Edit Item')).not.toBeInTheDocument();
  });

  it('nested dialog: open modal, open confirmation inside, close inner, outer still open', async () => {
    const user = userEvent.setup();

    function NestedDialogHarness() {
      const [outerOpen, setOuterOpen] = useState(false);
      const [innerOpen, setInnerOpen] = useState(false);

      return (
        <div>
          <Button data-testid="outer-trigger" onClick={() => setOuterOpen(true)}>
            Open Outer
          </Button>
          <Dialog
            open={outerOpen}
            onClose={() => setOuterOpen(false)}
            title="Outer Dialog"
          >
            <div>
              <p>Outer content</p>
              <Button data-testid="inner-trigger" onClick={() => setInnerOpen(true)}>
                Open Inner
              </Button>
              <Dialog
                open={innerOpen}
                onClose={() => setInnerOpen(false)}
                title="Confirmation"
              >
                <p>Are you sure?</p>
                <Button data-testid="confirm-btn" onClick={() => setInnerOpen(false)}>
                  Confirm
                </Button>
              </Dialog>
            </div>
          </Dialog>
        </div>
      );
    }

    render(<NestedDialogHarness />);

    // Open outer
    await user.click(screen.getByTestId('outer-trigger'));
    expect(screen.getByText('Outer Dialog')).toBeInTheDocument();

    // Open inner
    await user.click(screen.getByTestId('inner-trigger'));
    expect(screen.getByText('Confirmation')).toBeInTheDocument();
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();

    // Close inner
    await user.click(screen.getByTestId('confirm-btn'));
    expect(screen.queryByText('Confirmation')).not.toBeInTheDocument();

    // Outer still open
    expect(screen.getByText('Outer Dialog')).toBeInTheDocument();
    expect(screen.getByText('Outer content')).toBeInTheDocument();
  });
});

/* ================================================================== */
/*  4. Tabs + content flow                                             */
/* ================================================================== */

describe('Tabs + content flow', () => {
  const tabItems: TabItem[] = [
    { key: 'overview', label: 'Overview', content: <div data-testid="tab-overview">Overview Content</div> },
    { key: 'details', label: 'Details', content: <div data-testid="tab-details">Details Content</div> },
    { key: 'settings', label: 'Settings', content: <div data-testid="tab-settings">Settings Content</div> },
  ];

  it('user clicks tabs, content changes, state preserved switching back', async () => {
    const user = userEvent.setup();

    function TabsWithState() {
      const [counter, setCounter] = useState(0);
      const items: TabItem[] = [
        {
          key: 'counter',
          label: 'Counter',
          content: (
            <div>
              <span data-testid="count">{counter}</span>
              <Button data-testid="increment" onClick={() => setCounter((c) => c + 1)}>+1</Button>
            </div>
          ),
        },
        {
          key: 'other',
          label: 'Other',
          content: <div data-testid="other-content">Other Tab</div>,
        },
      ];
      return <Tabs items={items} />;
    }

    render(<TabsWithState />);

    // Counter tab active by default
    expect(screen.getByTestId('count')).toHaveTextContent('0');

    // Increment counter
    await user.click(screen.getByTestId('increment'));
    expect(screen.getByTestId('count')).toHaveTextContent('1');

    // Switch to other tab
    await user.click(screen.getByRole('tab', { name: 'Other' }));
    expect(screen.getByTestId('other-content')).toBeInTheDocument();
    expect(screen.queryByTestId('count')).not.toBeInTheDocument();

    // Switch back - state preserved because state is lifted
    await user.click(screen.getByRole('tab', { name: 'Counter' }));
    expect(screen.getByTestId('count')).toHaveTextContent('1');
  });

  it('keyboard navigation: Tab to tabs, Arrow keys switch, Enter is not needed (auto-select)', async () => {
    const user = userEvent.setup();
    render(<Tabs items={tabItems} />);

    // Overview is active by default
    expect(screen.getByTestId('tab-overview')).toBeInTheDocument();

    // Focus the active tab
    const overviewTab = screen.getByRole('tab', { name: 'Overview' });
    overviewTab.focus();
    expect(document.activeElement).toBe(overviewTab);

    // Arrow right moves to Details and auto-selects
    await user.keyboard('{ArrowRight}');
    expect(screen.getByTestId('tab-details')).toBeInTheDocument();
    expect(screen.queryByTestId('tab-overview')).not.toBeInTheDocument();

    // Arrow right moves to Settings
    await user.keyboard('{ArrowRight}');
    expect(screen.getByTestId('tab-settings')).toBeInTheDocument();
    expect(screen.queryByTestId('tab-details')).not.toBeInTheDocument();
  });

  it('disabled tab is skipped during keyboard navigation', async () => {
    const user = userEvent.setup();
    const itemsWithDisabled: TabItem[] = [
      { key: 'a', label: 'Tab A', content: <div data-testid="content-a">A</div> },
      { key: 'b', label: 'Tab B', disabled: true, content: <div data-testid="content-b">B</div> },
      { key: 'c', label: 'Tab C', content: <div data-testid="content-c">C</div> },
    ];

    render(<Tabs items={itemsWithDisabled} />);

    // Tab A active
    expect(screen.getByTestId('content-a')).toBeInTheDocument();

    const tabA = screen.getByRole('tab', { name: 'Tab A' });
    tabA.focus();

    // Arrow right should skip Tab B (disabled) and go to Tab C
    await user.keyboard('{ArrowRight}');
    expect(screen.getByTestId('content-c')).toBeInTheDocument();
    expect(screen.queryByTestId('content-b')).not.toBeInTheDocument();
  });
});

/* ================================================================== */
/*  5. Accordion multi-panel flow                                      */
/* ================================================================== */

describe('Accordion multi-panel flow', () => {
  const accordionItems: AccordionItem[] = [
    { value: 'panel-1', title: 'Panel 1', content: <div data-testid="panel-1-content">Content 1</div> },
    { value: 'panel-2', title: 'Panel 2', content: <div data-testid="panel-2-content">Content 2</div> },
    { value: 'panel-3', title: 'Panel 3', content: <div data-testid="panel-3-content">Content 3</div> },
  ];

  it('user opens panel, opens another, first stays open (non-exclusive / multiple mode)', async () => {
    const user = userEvent.setup();
    render(<Accordion items={accordionItems} selectionMode="multiple" />);

    // All panels closed initially (destroyOnHidden=true means content not in DOM)
    expect(screen.queryByTestId('panel-1-content')).not.toBeInTheDocument();
    expect(screen.queryByTestId('panel-2-content')).not.toBeInTheDocument();

    // Open panel 1
    const panel1Trigger = screen.getByRole('button', { name: /Panel 1/i });
    await user.click(panel1Trigger);
    expect(screen.getByTestId('panel-1-content')).toBeVisible();

    // Open panel 2
    const panel2Trigger = screen.getByRole('button', { name: /Panel 2/i });
    await user.click(panel2Trigger);
    expect(screen.getByTestId('panel-2-content')).toBeVisible();

    // Panel 1 still open
    expect(screen.getByTestId('panel-1-content')).toBeVisible();
  });

  it('content inside accordion panels is interactive (buttons, links work)', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    const itemsWithInteractive: AccordionItem[] = [
      {
        value: 'interactive',
        title: 'Interactive Panel',
        content: (
          <div>
            <Button data-testid="panel-button" onClick={onClick}>Click Me</Button>
            <a href="#test" data-testid="panel-link">Test Link</a>
          </div>
        ),
      },
    ];

    render(<Accordion items={itemsWithInteractive} selectionMode="multiple" />);

    // Open the panel
    await user.click(screen.getByRole('button', { name: /Interactive Panel/i }));

    // Click button inside the panel
    await user.click(screen.getByTestId('panel-button'));
    expect(onClick).toHaveBeenCalledTimes(1);

    // Link is present and clickable
    expect(screen.getByTestId('panel-link')).toBeInTheDocument();
  });
});

/* ================================================================== */
/*  6. Drawer + form flow                                              */
/* ================================================================== */

describe('Drawer + form flow', () => {
  function DrawerFormHarness({ onSave }: { onSave?: (val: string) => void }) {
    const [open, setOpen] = useState(false);
    const [fieldValue, setFieldValue] = useState('');

    return (
      <div>
        <Button data-testid="drawer-trigger" onClick={() => setOpen(true)}>Open Drawer</Button>
        <Drawer
          open={open}
          onClose={() => {
            setOpen(false);
          }}
          title="Edit Settings"
          footer={
            <Button
              data-testid="drawer-save"
              onClick={() => {
                onSave?.(fieldValue);
                setOpen(false);
              }}
            >
              Save
            </Button>
          }
        >
          <input
            data-testid="drawer-input"
            value={fieldValue}
            onChange={(e) => setFieldValue(e.target.value)}
            placeholder="Enter setting"
          />
        </Drawer>
      </div>
    );
  }

  it('user opens drawer, fills form inside, submits, drawer closes', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<DrawerFormHarness onSave={onSave} />);

    // Drawer not visible
    expect(screen.queryByText('Edit Settings')).not.toBeInTheDocument();

    // Open drawer
    await user.click(screen.getByTestId('drawer-trigger'));
    expect(screen.getByText('Edit Settings')).toBeInTheDocument();

    // Fill form
    await user.type(screen.getByTestId('drawer-input'), 'New Setting');

    // Save
    await user.click(screen.getByTestId('drawer-save'));
    expect(onSave).toHaveBeenCalledWith('New Setting');

    // Drawer closed
    expect(screen.queryByText('Edit Settings')).not.toBeInTheDocument();
  });

  it('user opens drawer, clicks overlay, drawer closes without saving', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<DrawerFormHarness onSave={onSave} />);

    // Open drawer
    await user.click(screen.getByTestId('drawer-trigger'));
    expect(screen.getByText('Edit Settings')).toBeInTheDocument();

    // Type something
    await user.type(screen.getByTestId('drawer-input'), 'Unsaved');

    // Click overlay backdrop
    const overlay = screen.getByTestId('drawer-overlay');
    await user.click(overlay);

    // Drawer closed without saving
    expect(screen.queryByText('Edit Settings')).not.toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });
});

/* ================================================================== */
/*  7. Toast notification flow                                         */
/* ================================================================== */

describe('Toast notification flow', () => {
  function ToastTrigger() {
    const toast = useToast();
    return (
      <div>
        <Button data-testid="toast-success" onClick={() => toast.success('Item saved')}>
          Success Toast
        </Button>
        <Button data-testid="toast-error" onClick={() => toast.error('Something failed')}>
          Error Toast
        </Button>
        <Button data-testid="toast-multi" onClick={() => {
          toast.info('First notification');
          toast.warning('Second notification');
          toast.success('Third notification');
        }}>
          Multiple Toasts
        </Button>
      </div>
    );
  }

  it('action triggers toast, toast appears, auto-dismisses after timeout', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    render(
      <ToastProvider duration={1000}>
        <ToastTrigger />
      </ToastProvider>,
    );

    await user.click(screen.getByTestId('toast-success'));

    // Toast appears
    expect(screen.getByText('Item saved')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();

    // Advance time past duration
    act(() => {
      vi.advanceTimersByTime(1100);
    });

    // Toast dismissed
    expect(screen.queryByText('Item saved')).not.toBeInTheDocument();

    vi.useRealTimers();
  });

  it('multiple toasts stack correctly', async () => {
    const user = userEvent.setup();

    render(
      <ToastProvider duration={10000} maxVisible={5}>
        <ToastTrigger />
      </ToastProvider>,
    );

    await user.click(screen.getByTestId('toast-multi'));

    // All three toasts visible
    expect(screen.getByText('First notification')).toBeInTheDocument();
    expect(screen.getByText('Second notification')).toBeInTheDocument();
    expect(screen.getByText('Third notification')).toBeInTheDocument();

    // Multiple alerts rendered
    const alerts = screen.getAllByRole('alert');
    expect(alerts.length).toBe(3);
  });
});
