import enReports from '../en/reports';

const reports = {
  ...enReports,
  'reports.nav.users': 'Benutzer',
  'reports.nav.access': 'Zugriff',
  'reports.nav.audit': 'Audit',
  'reports.breadcrumb.root': 'Berichte',

  'reports.toolbar.refresh': 'Daten aktualisieren',
  'reports.toolbar.exportCsv': 'CSV exportieren',

  'reports.filters.apply': 'Filter anwenden',
  'reports.filters.reset': 'Zurücksetzen',
  'reports.filters.all': 'Alle',
  'reports.filters.search.placeholder': 'Nach Name, E-Mail oder ID suchen',
  'reports.filters.status.placeholder': 'Status',
  'reports.filters.level.placeholder': 'Schweregrad',

  'reports.status.active': 'Aktiv',
  'reports.status.inactive': 'Inaktiv',
  'reports.status.invited': 'Eingeladen',
  'reports.status.suspended': 'Gesperrt',

  'reports.detail.empty': 'Wählen Sie einen Datensatz aus, um die Details zu sehen.',

  'reports.users': 'Benutzerbericht',
  'reports.users.title': 'Benutzeraktivität',
  'reports.users.description':
    'Verfolgen Sie Benutzerstatus, letzte Anmeldung und zugewiesene Rollen.',
  'reports.users.breadcrumb': 'Benutzer',
  'reports.users.columns.fullName': 'Vollständiger Name',
  'reports.users.columns.email': 'E-Mail',
  'reports.users.columns.role': 'Rolle',
  'reports.users.columns.status': 'Status',
  'reports.users.columns.lastLoginAt': 'Letzte Anmeldung',
  'reports.users.columns.createdAt': 'Erstellt am',

  'reports.access': 'Zugriffsbericht',
  'reports.access.title': 'Rollenabdeckung',
  'reports.access.description':
    'Sehen Sie, wie viele Benutzer auf jede kritische Rolle angewiesen sind.',
  'reports.access.breadcrumb': 'Zugriff',
  'reports.access.columns.roleName': 'Rollenname',
  'reports.access.columns.memberCount': 'Mitglieder',
  'reports.access.columns.moduleSummary': 'Module',
  'reports.access.columns.updatedAt': 'Aktualisiert am',
  'reports.access.comingSoon': 'Detaillierte Zugriffsanalysen sind bald verfügbar.',

  'reports.audit': 'Audit-Bericht',
  'reports.audit.title': 'Audit-Trail',
  'reports.audit.description':
    'Filtern Sie Audit-Ereignisse nach Dienst, Akteur und Schweregrad.',
  'reports.audit.breadcrumb': 'Audit',
  'reports.audit.columns.eventId': 'Ereignis-ID',
  'reports.audit.columns.userEmail': 'Benutzer-E-Mail',
  'reports.audit.columns.service': 'Dienst',
  'reports.audit.columns.action': 'Aktion',
  'reports.audit.columns.level': 'Stufe',
  'reports.audit.columns.timestamp': 'Zeitstempel',
  'reports.audit.comingSoon': 'Das Audit-Detailpanel befindet sich im Aufbau.',
};

export default reports;
