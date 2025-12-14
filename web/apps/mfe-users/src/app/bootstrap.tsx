import { createRoot } from 'react-dom/client';
import UsersApp from './UsersApp.ui';
import { configureShellServices } from './services/shell-services';

configureShellServices({});

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<UsersApp />);
}
