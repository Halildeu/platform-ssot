import ReportingApp from './app/reporting/ReportingApp';
import { ReportingProviders } from './app/reporting/ReportingProviders';

const App = () => (
  <ReportingProviders>
    <ReportingApp />
  </ReportingProviders>
);

export default App;
