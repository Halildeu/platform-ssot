import enAudit from '../en/audit';

const audit = {
  ...enAudit,
  'audit.layout.title': 'Audit-Ereignisse',
  'audit.layout.description':
    'Prüfen Sie systemweite Audit-Aktivitäten, analysieren Sie Diffs und exportieren Sie Berichte.',
  'audit.breadcrumb.observability': 'Beobachtbarkeit',
  'audit.breadcrumb.audit': 'Audit',
  'audit.breadcrumb.events': 'Ereignisse',
  'audit.filters.user': 'Benutzer-E-Mail',
  'audit.filters.service': 'Dienst',
  'audit.filters.level': 'Stufe',
  'audit.filters.level.all': 'Alle Stufen',
  'audit.filters.level.info': 'Info',
  'audit.filters.level.warn': 'Warnung',
  'audit.filters.level.error': 'Fehler',
  'audit.grid.timestamp': 'Zeitstempel',
  'audit.grid.user': 'Benutzer',
  'audit.grid.service': 'Dienst',
  'audit.grid.action': 'Aktion',
  'audit.grid.level': 'Stufe',
  'audit.grid.correlation': 'Korrelations-ID',
  'audit.drawer.summary': 'Zusammenfassung',
  'audit.drawer.diff': 'Diff',
  'audit.drawer.raw': 'Rohes JSON',
};

export default audit;
