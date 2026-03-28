import enAccess from '../en/access';

const access = {
  ...enAccess,
  'access.layout.title': 'Rollen- und Richtlinienverwaltung',
  'access.layout.description':
    'Modulberechtigungen prüfen, Zugriffsregeln anpassen und Audit-Aktivitäten nachverfolgen.',
  'access.breadcrumb.management': 'Verwaltung',
  'access.breadcrumb.access': 'Zugriff',
  'access.breadcrumb.roles': 'Rollen',

  'access.actions.create': 'Neue Rolle',
  'access.actions.create.tooltip': 'Diese Aktion wird nach dem MVP-Release aktiviert.',
  'access.actions.clone': 'Rolle klonen',
  'access.actions.clone.tooltip': 'Erstellen Sie eine neue Rolle, indem Sie die Richtlinien der ausgewählten Rolle kopieren.',
  'access.actions.bulk': 'Massenberechtigung',
  'access.actions.bulk.tooltip': 'Aktualisieren Sie dieselbe Modulberechtigung für mehrere Rollen.',

  'access.metrics.activeRoleCount': 'Aktive Rollenanzahl: {count}',
  'access.empty.noResults': 'Keine Rollen entsprechen den aktuellen Filtern.',

  'access.grid.columns.name': 'Rollenname',
  'access.grid.columns.memberCount': 'Mitgliederanzahl',
  'access.grid.columns.moduleSummary': 'Erlaubte Module',
  'access.grid.columns.lastModified': 'Letzte Aktualisierung',

  'access.variants.selectPlaceholder': 'Gespeicherte Ansicht auswählen',
  'access.variants.save': 'Speichern',
  'access.variants.saveChanges': 'Änderungen speichern',
  'access.variants.saveAs': 'Speichern unter',
  'access.variants.delete': 'Löschen',
  'access.variants.unsavedChanges': 'Für diese Ansicht gibt es ungespeicherte Änderungen.',
  'access.variants.promptName': 'Geben Sie einen Namen für die neue Ansicht ein',
  'access.variants.promptPlaceholder': 'z. B. Kritische Sicherheitsrollen',
  'access.variants.saved': 'Ansicht gespeichert.',
  'access.variants.updated': 'Ansicht aktualisiert.',
  'access.variants.deleted': 'Ansicht gelöscht.',
  'access.variants.deleteConfirm.title': 'Ansicht löschen',
  'access.variants.deleteConfirm.content':
    'Die ausgewählte Ansicht wird dauerhaft gelöscht. Möchten Sie fortfahren?',
  'access.variants.deleteConfirm.ok': 'Löschen',
  'access.variants.deleteConfirm.cancel': 'Abbrechen',

  'access.filter.searchPlaceholder': 'Rollenname oder Beschreibung',
  'access.filter.moduleAll': 'Alle Module',
  'access.filter.apply': 'Anwenden',
  'access.filter.reset': 'Zurücksetzen',
  'access.filter.level.all': 'Alle',
  'access.filter.level.none': 'Kein Zugriff',
  'access.filter.level.view': 'Anzeigen',
  'access.filter.level.edit': 'Bearbeiten',
  'access.filter.level.manage': 'Verwalten',

  'access.drawer.noDescription': 'Für diese Rolle wurde noch keine Beschreibung hinterlegt.',
  'access.drawer.members': 'Mitgliederanzahl',
  'access.drawer.systemRole': 'Systemrolle',
  'access.drawer.systemRole.yes': 'Ja',
  'access.drawer.systemRole.no': 'Nein',
  'access.drawer.lastModified': 'Zuletzt aktualisiert',
  'access.drawer.permissionsTitle': 'Modulberechtigungen',
  'access.drawer.permissionsEmpty': 'Es wurden noch keine Modulberechtigungen zugewiesen.',
  'access.drawer.permissionUpdated': 'Aktualisiert von {user} · {timestamp}',
  'access.drawer.auditHint': 'Der Link zum zugehörigen Audit-Ereignis erscheint hier.',

  'access.notifications.cloneSuccess.title': 'Rolle geklont',
  'access.notifications.cloneSuccess.description': 'Audit-ID: {auditId}',
  'access.notifications.cloneError': 'Die Rolle konnte nicht geklont werden.',
  'access.notifications.cloneMissingSelection': 'Wählen Sie eine Rolle zum Klonen aus.',
  'access.notifications.bulkSuccess.title': 'Massenaktualisierung der Berechtigungen',
  'access.notifications.bulkSuccess.description':
    'Es wurden {count} Rollen aktualisiert. Audit-ID: {auditId}',
  'access.notifications.bulkNoop':
    'Die ausgewählten Rollen verwenden bereits diese Berechtigungsstufe.',

  'access.clone.modal.title': 'Rolle klonen',
  'access.clone.modal.subtitle': 'Erstellen Sie eine neue Rolle, die die Richtlinien von {roleName} übernimmt.',
  'access.clone.nameLabel': 'Neuer Rollenname',
  'access.clone.namePlaceholder': 'z. B. Operations Admin (EMEA)',
  'access.clone.nameSuggestion': '{roleName} (Kopie)',
  'access.clone.nameRequired': 'Der Rollenname ist erforderlich.',
  'access.clone.nameMin': 'Der Rollenname muss mindestens 3 Zeichen lang sein.',
  'access.clone.descriptionLabel': 'Beschreibung',
  'access.clone.descriptionPlaceholder': 'Kurze Beschreibung hinzufügen (optional)',
  'access.clone.copyMemberCount': 'Mitgliederanzahl kopieren',
  'access.clone.copyMemberTooltip':
    'Behalten Sie die bestehende Mitgliederanzahl für die geklonte Rolle bei. Standardmäßig startet die Rolle mit null Mitgliedern.',
  'access.clone.okText': 'Erstellen',
  'access.clone.cancelText': 'Abbrechen',

  'access.bulk.modal.title': 'Massenaktualisierung der Berechtigungen',
  'access.bulk.info':
    'Sie sind dabei, dieselbe Modulberechtigung für {count} ausgewählte Rollen zu aktualisieren.',
  'access.bulk.moduleLabel': 'Modul',
  'access.bulk.moduleRequired': 'Wählen Sie ein Modul aus.',
  'access.bulk.levelLabel': 'Berechtigungsstufe',
  'access.bulk.levelRequired': 'Wählen Sie eine Berechtigungsstufe aus.',
  'access.bulk.modulePlaceholder': 'Modul auswählen',
  'access.bulk.levelPlaceholder': 'Berechtigungsstufe auswählen',
  'access.bulk.okText': 'Aktualisieren',
  'access.bulk.cancelText': 'Abbrechen',

  'access.registry.title': 'Snapshot des Berechtigungsregisters',
  'access.registry.subtitle':
    'Quellversion {version}. CI hält diese Tabelle mit dem kanonischen Register synchron.',
  'access.registry.summary.active': 'Aktive Berechtigungen',
  'access.registry.summary.deprecated': 'Veraltete Berechtigungen',
  'access.registry.legend': 'Zuletzt erzeugt: {generatedAt}',
  'access.registry.columns.key': 'Berechtigungsschlüssel',
  'access.registry.columns.module': 'Modul',
  'access.registry.columns.owner': 'Verantwortlich',
  'access.registry.columns.status': 'Status',
  'access.registry.columns.sunset': 'Ablauf',
  'access.registry.status.active': 'Aktiv',
  'access.registry.status.deprecated': 'Veraltet',
  'access.registry.sunset.tbd': 'Nicht geplant',
};

export default access;
