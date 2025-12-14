import { createRoot } from 'react-dom/client';
import ReportingApp from './reporting/ReportingApp';
import { configureShellServices } from './services/shell-services';

const container = document.getElementById('root');

if (container) {
  configureShellServices({});
  const root = createRoot(container);
  root.render(<ReportingApp />);
}
