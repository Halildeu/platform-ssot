import React from 'react';
import { Provider as ReduxProvider, ReactReduxContext } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import {
  QueryClient,
  QueryClientProvider,
  QueryClientContext,
} from '@tanstack/react-query';
import UsersPage from '../pages/users/UsersPage.ui';
import './setup-ag-grid-license.lib';


const createStandaloneStore = () =>
  configureStore({
    reducer: (state = {
      auth: {
        token: null,
        status: 'idle',
        error: null,
        user: {
          id: 'demo-user',
          fullName: 'Demo Kullanıcı',
          permissions: ['VIEW_USERS', 'EDIT_USERS', 'MANAGE_USERS'],
          role: 'ADMIN',
        },
      },
    }) => state,
  });

class UsersAppErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[UsersApp] Unhandled error yakalandı', error, info.componentStack);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24 }}>
          <h2>Kullanıcı modülü yüklenirken beklenmeyen bir hata oluştu.</h2>
          <p>Lütfen sayfayı yenileyin. Sorun devam ederse sistem yöneticinizle iletişime geçin.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const UsersAppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const existingReduxContext = React.useContext(ReactReduxContext);
  const existingQueryClient = React.useContext(QueryClientContext);

  const queryClientRef = React.useRef<QueryClient>();
  if (!existingQueryClient && !queryClientRef.current) {
    queryClientRef.current = new QueryClient();
  }

  const storeRef = React.useRef<ReturnType<typeof createStandaloneStore>>();
  if (!existingReduxContext && !storeRef.current) {
    storeRef.current = createStandaloneStore();
  }

  let content = children;

  if (!existingQueryClient && queryClientRef.current) {
    content = (
      <QueryClientProvider client={queryClientRef.current}>
        {content}
      </QueryClientProvider>
    );
  }

  if (!existingReduxContext && storeRef.current) {
    content = (
      <ReduxProvider store={storeRef.current}>
        {content}
      </ReduxProvider>
    );
  }

  return <>{content}</>;
};

const UsersApp: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = React.useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return new URLSearchParams(window.location.search).get('usersGridFullscreen') === '1';
  });

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const updateFromLocation = () => {
      const params = new URLSearchParams(window.location.search);
      setIsFullscreen(params.get('usersGridFullscreen') === '1');
    };
    updateFromLocation();
    window.addEventListener('popstate', updateFromLocation);
    return () => {
      window.removeEventListener('popstate', updateFromLocation);
    };
  }, []);

  return (
    <UsersAppProviders>
      <UsersAppErrorBoundary>
        <UsersPage isFullscreen={isFullscreen} />
      </UsersAppErrorBoundary>
    </UsersAppProviders>
  );
};

export default UsersApp;
