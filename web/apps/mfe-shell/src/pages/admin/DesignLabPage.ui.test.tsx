import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import DesignLabPage from './DesignLabPage';

class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

const scrollIntoViewMock = vi.fn();

const renderPage = () =>
  render(
    <MemoryRouter>
      <DesignLabPage />
    </MemoryRouter>,
  );

const selectComponent = async (
  user: ReturnType<typeof userEvent.setup>,
  query: string,
  testId: string,
) => {
  const search = screen.getByTestId('design-lab-search');
  await user.clear(search);
  await user.type(search, query);
  await user.click(await screen.findByTestId(testId));
};

const selectRecipe = async (
  user: ReturnType<typeof userEvent.setup>,
  query: string,
  testId: string,
) => {
  await user.click(screen.getByTestId('design-lab-workspace-recipes'));
  const search = screen.getByTestId('design-lab-search');
  await user.clear(search);
  await user.type(search, query);
  await user.click(await screen.findByTestId(testId));
};

describe('DesignLabPage', () => {
  beforeEach(() => {
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    );
    Object.defineProperty(window.HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: scrollIntoViewMock,
    });
    scrollIntoViewMock.mockClear();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('renders the vertical status-rich steps preview as interactive', async () => {
    const user = userEvent.setup();

    renderPage();
    await selectComponent(user, 'Steps', 'design-lab-item-steps');

    await screen.findByText('Steps live preview');

    const statusRichPanel = screen.getByText('Vertical / status-rich').closest('[data-demo-panel-kind]') as HTMLElement;
    expect(within(statusRichPanel).getByText('Preview').closest('[aria-current="step"]')).toBeInTheDocument();

    const securityButton = within(statusRichPanel).getByRole('button', { name: /Security/i });
    await user.click(securityButton);

    expect(within(statusRichPanel).getByText('Security').closest('[aria-current="step"]')).toBeInTheDocument();
  });

  it('demo only modunda referans panelleri gizler ve canlı yüzeyleri bırakır', async () => {
    const user = userEvent.setup();

    renderPage();
    await selectComponent(user, 'TextInput', 'design-lab-item-textinput');

    expect(screen.getByText('Doğru kullanım notu')).toBeInTheDocument();
    await user.click(screen.getByTestId('design-lab-demo-mode-live_only'));

    expect(screen.queryByText('Doğru kullanım notu')).not.toBeInTheDocument();
    expect(screen.queryByText('Recipe summary')).not.toBeInTheDocument();
    expect(screen.getByText('Filled account field')).toBeInTheDocument();
    expect(screen.getByText('Invite input')).toBeInTheDocument();
  });

  it('recipes first modunda recipe lensini öne alır', async () => {
    const user = userEvent.setup();

    renderPage();
    await selectComponent(user, 'ApprovalCheckpoint', 'design-lab-item-approvalcheckpoint');

    await user.click(screen.getByTestId('design-lab-demo-mode-recipes_first'));

    expect(screen.getByText('Recipe composition lens')).toBeInTheDocument();
    expect(screen.getAllByText('approval_review').length).toBeGreaterThan(0);
    expect(screen.getAllByText('RECIPE').length).toBeGreaterThan(0);
  });

  it('section lock açıkken component değişse de seçili ana başlığı korur', async () => {
    const user = userEvent.setup();

    renderPage();

    const apiTab = screen.getByTestId('design-lab-tab-api');
    await user.click(apiTab);
    expect(apiTab.className).toContain('bg-surface-panel');

    scrollIntoViewMock.mockClear();
    await selectComponent(user, 'Steps', 'design-lab-item-steps');

    expect(screen.getByTestId('design-lab-tab-api').className).toContain('bg-surface-panel');
    await waitFor(() => expect(scrollIntoViewMock).toHaveBeenCalled());
  });

  it('recipe explorer modunda recipe seçip consume contract yüzeyini açar', async () => {
    const user = userEvent.setup();

    renderPage();
    await selectRecipe(user, 'approval', 'design-lab-recipe-approval_review');

    expect(screen.getByRole('heading', { name: 'approval_review' })).toBeInTheDocument();
    expect(screen.getByTestId('design-lab-workspace-recipes').className).toContain('bg-surface-panel');
    expect(screen.getByText('Recipe adoption contract')).toBeInTheDocument();
    expect(screen.getByText('Recipe-first design')).toBeInTheDocument();
  });

  it('recipe içindeki owner block köprüsü component moduna geri döner', async () => {
    const user = userEvent.setup();

    renderPage();
    await selectRecipe(user, 'approval', 'design-lab-recipe-approval_review');

    await user.click(screen.getByTestId('design-lab-tab-demo'));
    await user.click(await screen.findByTestId('design-lab-recipe-owner-approval_review-approvalcheckpoint'));

    expect(screen.getByRole('heading', { name: 'ApprovalCheckpoint' })).toBeInTheDocument();
    expect(screen.getByText('Component Explorer')).toBeInTheDocument();
    expect(screen.getByTestId('design-lab-workspace-components').className).toContain('bg-surface-panel');
  });
});
