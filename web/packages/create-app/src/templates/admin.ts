import type { TemplateFile } from '../types';
import {
  generatePackageJson,
  generateTsConfig,
  generateViteConfig,
  generateIndexHtml,
  generateMain,
  generateCss,
  generateAppLayout,
} from './shared';

/* ------------------------------------------------------------------ */
/*  Admin template                                                     */
/* ------------------------------------------------------------------ */

export function generateAdminTemplate(name: string): TemplateFile[] {
  return [
    { path: 'package.json', content: generatePackageJson(name, 'admin') },
    { path: 'tsconfig.json', content: generateTsConfig() },
    { path: 'vite.config.ts', content: generateViteConfig() },
    { path: 'index.html', content: generateIndexHtml(name) },
    { path: 'src/main.tsx', content: generateMain() },
    { path: 'src/App.tsx', content: generateAdminApp() },
    { path: 'src/pages/SettingsPage.tsx', content: generateSettingsPage() },
    { path: 'src/pages/UsersPage.tsx', content: generateUsersPage() },
    { path: 'src/layouts/AppLayout.tsx', content: generateAppLayout(name) },
    { path: 'src/index.css', content: generateCss() },
  ];
}

/* ------------------------------------------------------------------ */
/*  src/App.tsx                                                        */
/* ------------------------------------------------------------------ */

function generateAdminApp(): string {
  return `import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import SettingsPage from './pages/SettingsPage';
import UsersPage from './pages/UsersPage';

const linkStyle: React.CSSProperties = {
  textDecoration: 'none',
  fontSize: '0.875rem',
  fontWeight: 500,
  color: 'var(--color-text-secondary))',
};

export default function App() {
  return (
    <Routes>
      <Route
        element={
          <AppLayout>
            <NavLink to="/" style={linkStyle}>
              Settings
            </NavLink>
            <NavLink to="/users" style={linkStyle}>
              Users
            </NavLink>
          </AppLayout>
        }
      >
        <Route index element={<SettingsPage />} />
        <Route path="users" element={<UsersPage />} />
      </Route>
    </Routes>
  );
}
`;
}

/* ------------------------------------------------------------------ */
/*  src/pages/SettingsPage.tsx                                          */
/* ------------------------------------------------------------------ */

function generateSettingsPage(): string {
  return `import React, { useState, useCallback } from 'react';
import { SettingsPageTemplate } from '@mfe/blocks';
import type { SettingsSection } from '@mfe/blocks';

export default function SettingsPage() {
  const [appName, setAppName] = useState('My Application');
  const [language, setLanguage] = useState('en');
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [timezone, setTimezone] = useState('utc');

  const sections: SettingsSection[] = [
    {
      title: 'General',
      description: 'Basic application configuration',
      fields: [
        {
          name: 'appName',
          label: 'Application Name',
          type: 'text',
          value: appName,
          onChange: setAppName,
        },
        {
          name: 'language',
          label: 'Language',
          type: 'select',
          value: language,
          onChange: setLanguage,
          options: [
            { label: 'English', value: 'en' },
            { label: 'Turkish', value: 'tr' },
            { label: 'German', value: 'de' },
            { label: 'French', value: 'fr' },
          ],
        },
        {
          name: 'timezone',
          label: 'Timezone',
          type: 'select',
          value: timezone,
          onChange: setTimezone,
          options: [
            { label: 'UTC', value: 'utc' },
            { label: 'Europe/Istanbul', value: 'europe-istanbul' },
            { label: 'US/Eastern', value: 'us-eastern' },
            { label: 'US/Pacific', value: 'us-pacific' },
          ],
        },
      ],
    },
    {
      title: 'Appearance',
      description: 'Customize how the application looks',
      fields: [
        {
          name: 'darkMode',
          label: 'Dark Mode',
          type: 'toggle',
          value: darkMode,
          onChange: setDarkMode,
        },
      ],
    },
    {
      title: 'Notifications',
      description: 'Configure how you receive notifications',
      fields: [
        {
          name: 'emailNotifications',
          label: 'Email Notifications',
          type: 'toggle',
          value: emailNotifications,
          onChange: setEmailNotifications,
        },
        {
          name: 'pushNotifications',
          label: 'Push Notifications',
          type: 'toggle',
          value: pushNotifications,
          onChange: setPushNotifications,
        },
      ],
    },
  ];

  const handleSave = useCallback(() => {
    console.log('Settings saved:', {
      appName,
      language,
      darkMode,
      emailNotifications,
      pushNotifications,
      timezone,
    });
  }, [appName, language, darkMode, emailNotifications, pushNotifications, timezone]);

  return (
    <SettingsPageTemplate
      title="Settings"
      sections={sections}
      onSave={handleSave}
    />
  );
}
`;
}

/* ------------------------------------------------------------------ */
/*  src/pages/UsersPage.tsx                                            */
/* ------------------------------------------------------------------ */

function generateUsersPage(): string {
  return `import React, { useState, useCallback } from 'react';
import { UserManagementBlock } from '@mfe/blocks';
import type { ManagedUser } from '@mfe/blocks';

const initialUsers: ManagedUser[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'Editor' },
  { id: '3', name: 'Carol Williams', email: 'carol@example.com', role: 'Viewer' },
  { id: '4', name: 'David Brown', email: 'david@example.com', role: 'Editor' },
  { id: '5', name: 'Eve Davis', email: 'eve@example.com', role: 'Viewer' },
];

const roles = ['Admin', 'Editor', 'Viewer'];

export default function UsersPage() {
  const [users, setUsers] = useState(initialUsers);

  const handleInvite = useCallback(() => {
    console.log('Open invite dialog');
  }, []);

  const handleRoleChange = useCallback((userId: string, role: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role } : u)),
    );
  }, []);

  return (
    <div>
      <h1
        style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          color: 'var(--color-text-primary))',
          margin: '0 0 1.5rem 0',
        }}
      >
        User Management
      </h1>
      <UserManagementBlock
        users={users}
        roles={roles}
        onInvite={handleInvite}
        onRoleChange={handleRoleChange}
      />
    </div>
  );
}
`;
}
