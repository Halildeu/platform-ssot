export const reportFilterPanelCodemodPrototype = {
  candidateId: 'reportfilterpanel-mfe-reporting-codemod',
  component: 'ReportFilterPanel',
  transformKind: 'slot-prop-review',
  runPlan: [
    "findImport('ReportFilterPanel', '@mfe/design-system')",
    'capture submitLabel/resetLabel and onSubmit/onReset pairs',
    "preserve children slot exactly; only normalize prop ordering and explicit access fallback",
    'skip render-prop or dynamic access cases',
  ],
};

export default reportFilterPanelCodemodPrototype;
