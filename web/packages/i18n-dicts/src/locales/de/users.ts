import enUsers from '../en/users';

const users = {
  ...enUsers,
  'users.layout.title': 'Benutzerverwaltung',
  'users.layout.description':
    'Verwalten Sie Benutzerrollen, Berechtigungen und Modulzugriffe und definieren Sie sicherheitsrelevante Kontoaktionen.',
  'admin.users.title': 'Benutzerverwaltung',
  'admin.users.description':
    'Verwalten Sie Benutzerrollen, Berechtigungen und Modulzugriffe und definieren Sie sicherheitsrelevante Kontoaktionen.',
  'users.breadcrumb.management': 'Verwaltung',
  'users.breadcrumb.users': 'Benutzerverwaltung',

  'users.actions.refresh': 'Benutzer aktualisieren',

  'users.grid.themeLabel': 'Thema',
  'users.grid.quickFilterLabel': 'Filter',
  'users.grid.variantLabel': 'Variante',
  'users.grid.quickFilterPlaceholder': 'Alle Spalten durchsuchen...',
  'users.grid.fullscreenTooltip': 'Vollbild in einem neuen Tab öffnen',

  'users.grid.mode.label': 'Datenmodus:',
  'users.grid.mode.server': 'Server',
  'users.grid.mode.client': 'Client',

  'users.filters.search.label': 'Suche',
  'users.filters.search.placeholder': 'Name, E-Mail oder ID',
  'users.filters.search.button': 'Suchen',

  'users.filters.status.label': 'Status',
  'users.filters.status.all': 'Alle',
  'users.filters.status.active': 'Aktiv',
  'users.filters.status.inactive': 'Inaktiv',
  'users.filters.status.invited': 'Eingeladen',
  'users.filters.status.suspended': 'Gesperrt',

  'users.filters.role.label': 'Rolle',
  'users.filters.role.all': 'Alle',
  'users.filters.role.user': 'Standardbenutzer',
  'users.filters.role.admin': 'Administrator',

  'users.filters.moduleKey.label': 'Modulschlüssel',
  'users.filters.moduleKey.placeholder': 'finance.users',

  'users.filters.moduleLevel.label': 'Modulstufe',
  'users.filters.moduleLevel.all': 'Alle',
  'users.filters.moduleLevel.none': 'Kein Zugriff',
  'users.filters.moduleLevel.view': 'Leser',
  'users.filters.moduleLevel.edit': 'Bearbeiter',
  'users.filters.moduleLevel.manage': 'Verantwortlich',

  'users.filters.apply': 'Anwenden',
  'users.filters.reset': 'Zurücksetzen',

  'users.grid.columns.fullName': 'Vollständiger Name',
  'users.grid.columns.email': 'E-Mail',
  'users.grid.columns.role': 'Rolle',
  'users.grid.columns.status': 'Status',
  'users.grid.columns.sessionTimeoutMinutes': 'Sitzungsdauer (Min.)',
  'users.grid.columns.modulePermissions': 'Modulberechtigungen',
  'users.grid.columns.lastLoginAt': 'Letzte Anmeldung',
  'users.grid.columns.actions': 'Aktionen',

  'users.grid.toolbar.resetFilters': 'Filter zurücksetzen',
  'users.grid.toolbar.excelVisible': 'Excel (sichtbar)',
  'users.grid.toolbar.excelAll': 'Excel (alle)',
  'users.grid.toolbar.csvVisible': 'CSV (sichtbar)',
  'users.grid.toolbar.csvAll': 'CSV (alle)',

  'users.grid.locale.groupPanel': 'Spalten hierher ziehen, um zu gruppieren',
  'users.grid.locale.valuePanel': 'Spalten hierher ziehen, um Werte zu aggregieren',
  'users.grid.locale.filters': 'Filter',
  'users.grid.locale.columns': 'Spalten',
  'users.grid.locale.advancedFilter': 'Erweiterter Filter',
  'users.grid.locale.advancedFilterBuilder': 'Erweiterter Filter',
  'users.grid.locale.advancedFilterButtonTooltip': 'Erweiterten Filter öffnen',
  'users.grid.locale.advancedFilterBuilderAdd': 'Bedingung hinzufügen',
  'users.grid.locale.advancedFilterBuilderRemove': 'Entfernen',
  'users.grid.locale.advancedFilterJoinOperator': 'Verknüpfungsoperator',
  'users.grid.locale.advancedFilterAnd': 'UND',
  'users.grid.locale.advancedFilterOr': 'ODER',
  'users.grid.locale.advancedFilterValidationMissingColumn': 'Spalte auswählen',
  'users.grid.locale.advancedFilterValidationMissingOption': 'Operator auswählen',
  'users.grid.locale.advancedFilterValidationMissingValue': 'Wert eingeben',
  'users.grid.locale.advancedFilterApply': 'Anwenden',

  'users.actions.menuLabel': 'Aktionen ▾',
  'users.actions.view': 'Details anzeigen',
  'users.actions.editRole': 'Rolle / Berechtigungen bearbeiten',
  'users.actions.resetPassword': 'Passwort zurücksetzen',
  'users.actions.toggleStatus.disable': 'Deaktivieren',
  'users.actions.toggleStatus.enable': 'Aktivieren',
  'users.actions.resetPassword.success': 'Link zum Zurücksetzen des Passworts wurde gesendet.',
  'users.actions.status.success': 'Der Benutzerstatus wurde aktualisiert.',
  'users.notifications.activation.description': 'Audit-ID: {auditId}',

  'users.detail.title': 'Benutzerdetails',
  'users.detail.section.profile': 'Profilinformationen',
  'users.detail.section.permissions': 'Modulberechtigungen',
  'users.detail.section.quickActions': 'Schnellaktionen',

  'users.detail.sessionTimeout.unit': 'Minuten',
  'users.detail.sessionTimeout.saving': 'Wird gespeichert...',
  'users.detail.sessionTimeout.save': 'Speichern',
  'users.detail.sessionTimeout.minWarning': 'Die Sitzungsdauer muss mindestens 1 Minute betragen.',
  'users.detail.sessionTimeout.noChange': 'Die Sitzungsdauer ist bereits auf diesen Wert gesetzt.',
  'users.detail.sessionTimeout.updated': 'Die Sitzungsdauer wurde aktualisiert.',
  'users.detail.sessionTimeout.updateFailed': 'Die Sitzungsdauer konnte nicht aktualisiert werden.',

  'users.detail.roleUpdated': 'Die Benutzerrolle wurde aktualisiert.',

  'users.detail.noModulePermissions': 'Es sind keine Modulberechtigungen definiert.',
  'users.detail.noPermissionDetails': 'Keine Berechtigungsdetails verfügbar',
  'users.detail.scopeMissingHint':
    'Berechtigungen können nicht bearbeitet werden, da kein Unternehmens-/Zeitraumkontext ausgewählt ist.',
  'users.detail.noAccessWarning':
    'Der Benutzer hat keinen Zugriff auf dieses Modul und kann die zugehörigen Berichte nicht sehen.',
  'users.detail.userManagementScopeHint':
    'Benutzerverwaltungsberechtigungen müssen mit einem ausgewählten Unternehmens-/Zeitraumkontext vergeben werden.',
  'users.detail.modulePermission.noActive': 'Für dieses Modul gibt es keine aktive Berechtigung.',
  'users.detail.modulePermission.removed': 'Die Berechtigung für {module} wurde entfernt.',
  'users.detail.modulePermission.updated': 'Die Berechtigung für {module} wurde aktualisiert.',
  'users.detail.modulePermission.updating': 'Berechtigung wird aktualisiert...',

  'users.detail.moduleLevelDescription.none': 'Kein Zugriff auf dieses Modul',
  'users.detail.moduleLevelDescription.view': 'Nur-Lese-Zugriff',
  'users.detail.moduleLevelDescription.edit': 'Bearbeitungszugriff',
  'users.detail.moduleLevelDescription.manage': 'Vollständiger administrativer Zugriff',

  'users.detail.quickActions.noteSoon': 'Notiz hinzufügen (bald verfügbar)',
};

export default users;
