import React from 'react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface UserManagementBlockProps {
  users: ManagedUser[];
  roles: string[];
  onInvite: () => void;
  onRoleChange: (userId: string, role: string) => void;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function UserManagementBlock({
  users,
  roles,
  onInvite,
  onRoleChange,
}: UserManagementBlockProps) {
  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
        }}
      >
        <h3
          style={{
            fontSize: '1rem',
            fontWeight: 600,
            color: 'var(--color-text-primary, #0f172a)',
            margin: 0,
          }}
        >
          Users ({users.length})
        </h3>
        <button
          type="button"
          onClick={onInvite}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            border: 'none',
            background: 'var(--color-primary, #2563eb)',
            color: '#fff',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Invite User
        </button>
      </div>

      {/* User list */}
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.875rem',
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                textAlign: 'left',
                padding: '0.625rem 0.75rem',
                borderBottom: '2px solid var(--color-border, #e2e8f0)',
                color: 'var(--color-text-secondary, #64748b)',
                fontWeight: 600,
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              User
            </th>
            <th
              style={{
                textAlign: 'left',
                padding: '0.625rem 0.75rem',
                borderBottom: '2px solid var(--color-border, #e2e8f0)',
                color: 'var(--color-text-secondary, #64748b)',
                fontWeight: 600,
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Email
            </th>
            <th
              style={{
                textAlign: 'left',
                padding: '0.625rem 0.75rem',
                borderBottom: '2px solid var(--color-border, #e2e8f0)',
                color: 'var(--color-text-secondary, #64748b)',
                fontWeight: 600,
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Role
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              style={{ borderBottom: '1px solid var(--color-border, #e2e8f0)' }}
            >
              <td style={{ padding: '0.625rem 0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt=""
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-primary, #2563eb)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                      }}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span style={{ color: 'var(--color-text-primary, #0f172a)' }}>
                    {user.name}
                  </span>
                </div>
              </td>
              <td
                style={{
                  padding: '0.625rem 0.75rem',
                  color: 'var(--color-text-secondary, #64748b)',
                }}
              >
                {user.email}
              </td>
              <td style={{ padding: '0.625rem 0.75rem' }}>
                <select
                  value={user.role}
                  onChange={(e) => onRoleChange(user.id, e.target.value)}
                  style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.375rem',
                    border: '1px solid var(--color-border, #e2e8f0)',
                    fontSize: '0.8125rem',
                  }}
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
