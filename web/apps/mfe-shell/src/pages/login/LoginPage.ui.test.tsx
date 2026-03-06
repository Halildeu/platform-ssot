import React from 'react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';

const authModeMock = { permitAll: false };

vi.mock('../../app/auth/keycloakClient', () => ({
  default: {
    login: vi.fn().mockResolvedValue(undefined),
  },
}));

vi.mock('../../app/i18n', () => ({
  useShellCommonI18n: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('../../app/auth/auth-config', () => ({
  isPermitAllMode: () => authModeMock.permitAll,
}));

import keycloak from '../../app/auth/keycloakClient';
import LoginPage from './LoginPage.ui';

const LocationViewer = () => {
  const location = useLocation();
  return <div data-testid="location-display">{`${location.pathname}${location.search}`}</div>;
};

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authModeMock.permitAll = false;
  });

  afterEach(() => {
    cleanup();
  });

  it('renders corporate login button', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <LoginPage />
      </MemoryRouter>,
    );

    const buttons = screen.getAllByTestId('corporate-login-button');
    expect(buttons[0]).toBeInTheDocument();
  });

  it('calls keycloak.login on click with redirect', async () => {
    const loginSpy = vi.spyOn(keycloak, 'login');
    render(
      <MemoryRouter initialEntries={['/login?redirect=/access/roles']}>
        <LoginPage />
      </MemoryRouter>,
    );

    const button = screen.getAllByTestId('corporate-login-button')[0];
    fireEvent.click(button);

    expect(loginSpy).toHaveBeenCalledTimes(1);
  });

  it('shows permitAll banner instead of corporate button', () => {
    authModeMock.permitAll = true;
    render(
      <MemoryRouter initialEntries={['/login']}>
        <LoginPage />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('permitall-login-banner')).toBeInTheDocument();
    expect(screen.queryByTestId('corporate-login-button')).toBeNull();
  });

  it('navigates to ui library on continue in permitAll mode', () => {
    authModeMock.permitAll = true;
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/ui-library" element={<LocationViewer />} />
        </Routes>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText('auth.login.continue'));

    expect(screen.getByTestId('location-display')).toHaveTextContent('/ui-library');
  });
});
