import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { useAuthorization } from './use-authorization.model';

const authState = {
  auth: {
    user: {
      permissions: [] as string[],
      role: 'USER' as string | null,
      email: 'viewer@example.com',
    },
  },
};

vi.mock('../../../app/store/store.hooks', () => ({
  useAppSelector: (selector: (state: typeof authState) => unknown) => selector(authState),
}));

const AuthorizationProbe = ({ required }: { required: string }) => {
  const { hasPermission, permissions } = useAuthorization();

  return (
    <div>
      <span data-testid="allowed">{String(hasPermission(required))}</span>
      <span data-testid="permissions">{permissions.join(',')}</span>
    </div>
  );
};

describe('useAuthorization', () => {
  afterEach(() => {
    cleanup();
    authState.auth.user.permissions = [];
    authState.auth.user.role = 'USER';
    authState.auth.user.email = 'viewer@example.com';
  });

  it('VIEW_USERS iznini USER-READ olarak da normalize eder', () => {
    authState.auth.user.permissions = ['VIEW_USERS'];

    render(<AuthorizationProbe required="user-read" />);

    expect(screen.getByTestId('allowed')).toHaveTextContent('true');
    expect(screen.getByTestId('permissions')).toHaveTextContent('VIEW_USERS');
    expect(screen.getByTestId('permissions')).toHaveTextContent('USER-READ');
  });

  it('MANAGE_USERS iznini yeni granular kullanıcı izinlerine genişletir', () => {
    authState.auth.user.permissions = ['MANAGE_USERS'];

    render(<AuthorizationProbe required="user-delete" />);

    expect(screen.getByTestId('allowed')).toHaveTextContent('true');
    expect(screen.getByTestId('permissions')).toHaveTextContent('USER-READ');
    expect(screen.getByTestId('permissions')).toHaveTextContent('USER-UPDATE');
    expect(screen.getByTestId('permissions')).toHaveTextContent('USER-DELETE');
  });
});
