import enDesignLab from "../en/designlab";

const designlab = {
  ...enDesignLab,
  "designlab.workspace.components": "Komponenten",
  "designlab.workspace.recipes": "Rezepte",
  "designlab.sidebar.title.components": "Komponentenkatalog",
  "designlab.sidebar.title.recipes": "Rezeptkatalog",
  "designlab.sidebar.help.components":
    "Durchsuche denselben Baum uber Grundlagen, Komponenten, Ablaufe, Seiten, KI-Erlebnisse und Governance-Bereiche.",
  "designlab.sidebar.help.recipes":
    "Filtere Rezeptfamilien uber dieselben Hauptbereiche. Das Badge auf der Karte zeigt die semantische Heimat des Rezepts, wahrend der oben gewahlte Bereich die aktuelle Sicht beschreibt.",
  "designlab.sidebar.tooltip.components": "Hilfe zum Design-System-Explorer",
  "designlab.sidebar.tooltip.recipes": "Hilfe zum Rezept-Explorer",
  "designlab.sidebar.section.title": "Bibliotheksbereiche",
  "designlab.rightRail.open": "Rechtes Panel öffnen",
  "designlab.rightRail.close": "Rechtes Panel schließen",
  "designlab.taxonomy.sections.foundations.title": "Grundlagen",
  "designlab.taxonomy.sections.foundations.description":
    "Theme, Tokens, Motion und der grundlegende Appearance-Vertrag des Systems.",
  "designlab.taxonomy.sections.components.title": "Komponenten",
  "designlab.taxonomy.sections.components.description":
    "Eine vollstandige UI-Bibliothek mit Primitives, Formularen, Collections, Overlays und Feedback.",
  "designlab.taxonomy.sections.patterns.title": "Ablaufe",
  "designlab.taxonomy.sections.patterns.description":
    "Wiederholbare Datenablaufe, Grid-Erweiterungen und mehrteilige Loesungsrezepte.",
  "designlab.taxonomy.sections.templates.title": "Seiten",
  "designlab.taxonomy.sections.templates.description":
    "Seitenrahmen, Layouts und grossere Arbeitsflachen.",
  "designlab.taxonomy.sections.visualization.title": "Datenvisualisierung",
  "designlab.taxonomy.sections.visualization.description":
    "Charts, Dashboards und analytische Darstellungsflachen.",
  "designlab.taxonomy.sections.ai_ux.title": "KI-Erlebnisse",
  "designlab.taxonomy.sections.ai_ux.description":
    "KI-native Prompts, Confidence-, Citation- und Review-Ablaufe.",
  "designlab.taxonomy.sections.content_language.title": "Inhalt & Sprache",
  "designlab.taxonomy.sections.content_language.description":
    "Barrierefreiheit, Sprachregeln, Lokalisierung und Inhaltsverhalten.",
  "designlab.taxonomy.sections.governance.title":
    "Veroeffentlichung & Governance",
  "designlab.taxonomy.sections.governance.description":
    "Release, Diagnostics, Migration und operative Governance-Flachen.",
  "designlab.taxonomy.badges.adapter": "Legacy-Adapter",
  "designlab.taxonomy.adapterNotice.title":
    "Diese Ansicht wurde ueber einen Legacy-Einstieg des Design Lab geoeffnet.",
  "designlab.taxonomy.adapterNotice.description":
    "{source} wird jetzt per Adapter in die Ebene {target} aufgeloest.",
  "designlab.taxonomy.adapterNotice.cta.visualization":
    "Data Display & Collections oeffnen",
  "designlab.taxonomy.adapterNotice.cta.ai_ux":
    "AI-Workflows-Rezept oeffnen",
  "designlab.sidebar.search.components.placeholder":
    "Komponenten durchsuchen...",
  "designlab.sidebar.search.recipes.placeholder": "Rezepte durchsuchen...",
  "designlab.sidebar.search.aria": "Suche im Design Lab",
  "designlab.sidebar.productTree.title": "Komponentenbaum",
  "designlab.sidebar.recipeList.title": "Rezepte",
  "designlab.sidebar.recipe.count": "{count} Rezept",
  "designlab.sidebar.recipe.empty.search":
    'Kein Rezept unter {lens} passend zu "{query}" gefunden.',
  "designlab.sidebar.recipe.empty.default":
    "Unter {lens} ist kein Rezept verfugbar.",
  "designlab.sidebar.recipe.empty.hint":
    "Versuche eine andere Linse oder leere die Suche, um weitere Rezeptfamilien zu sehen.",
  "designlab.breadcrumb.docs": "Doku",
  "designlab.breadcrumb.library": "UI-Bibliothek",
  "designlab.hero.label.component": "Komponente",
  "designlab.hero.label.recipe": "Rezept",
  "designlab.hero.placeholder.component": "Komponente auswahlen",
  "designlab.hero.placeholder.recipe": "Rezept auswahlen",
  "designlab.hero.placeholder.description.component":
    "Wahle links eine Komponente, um Live-Demos sowie API- und Qualitatsdetails zu prufen.",
  "designlab.hero.placeholder.description.recipe":
    "Wahle links ein Rezept, um kanonische Screen-Kompositionen zu prufen.",
  "designlab.copy.success": "Kopiert",
  "designlab.copy.failure": "Kopieren fehlgeschlagen",
  "designlab.tabs.general.label": "Allgemein",
  "designlab.tabs.general.description":
    "Identitat, Release-Status und schneller Entscheidungskontext",
  "designlab.tabs.demo.label": "Vorschau",
  "designlab.tabs.demo.description":
    "Live-Demo und Variantenflache in einem aktiven Workspace",
  "designlab.tabs.overview.label": "Uberblick",
  "designlab.tabs.overview.description":
    "Kurze Zusammenfassung, Status und Entscheidungsrahmen",
  "designlab.tabs.api.description":
    "Import, Props, Variantenachsen und Zustandsmodell",
  "designlab.tabs.ux.description":
    "UX-Katalog-Ausrichtung und North-Star-Bindungen",
  "designlab.tabs.quality.label": "Qualitat",
  "designlab.tabs.quality.description":
    "Gate-, Regressions- und Nutzungsnachweise",
  "designlab.componentContracts.spinner.label": "Wird geladen",
  "designlab.componentContracts.pagination.navigationLabel": "Seitennavigation",
  "designlab.componentContracts.pagination.previousButtonLabel": "Zuruck",
  "designlab.componentContracts.pagination.nextButtonLabel": "Weiter",
  "designlab.componentContracts.pagination.previousPageAriaLabel":
    "Vorherige Seite",
  "designlab.componentContracts.pagination.nextPageAriaLabel": "Nachste Seite",
  "designlab.componentContracts.pagination.pageAriaLabel": "Seite {page}",
  "designlab.componentContracts.pagination.pageIndicatorLabel":
    "Seite {currentPage} / {pageCount}",
  "designlab.componentContracts.pagination.totalItemsLabel": "{count} Eintrage",
  "designlab.componentContracts.pagination.mode.server": "Serverseitiger Modus",
  "designlab.componentContracts.pagination.mode.client": "Clientseitiger Modus",
  "designlab.componentContracts.datePicker.emptyValueLabel": "Datum auswahlen",
  "designlab.componentContracts.timePicker.emptyValueLabel":
    "Uhrzeit auswahlen",
  "designlab.componentContracts.tableSimple.emptyFallbackDescription":
    "Keine Eintrage gefunden.",
  "designlab.componentContracts.tree.emptyFallbackDescription":
    "Keine Eintrage gefunden.",
  "designlab.componentContracts.tree.expandNodeAriaLabel": "Zweig aufklappen",
  "designlab.componentContracts.tree.collapseNodeAriaLabel": "Zweig einklappen",
  "designlab.componentContracts.treeTable.treeColumnLabel": "Struktur",
  "designlab.componentContracts.treeTable.emptyFallbackDescription":
    "Keine Eintrage gefunden.",
  "designlab.componentContracts.treeTable.expandNodeAriaLabel":
    "Zweig aufklappen",
  "designlab.componentContracts.treeTable.collapseNodeAriaLabel":
    "Zweig einklappen",
  "designlab.componentContracts.contextMenu.buttonLabel": "Kontextmenu",
  "designlab.componentContracts.contextMenu.contextTriggerHint":
    "Rechtsklick, um das Kontextmenu zu offnen",
  "designlab.componentContracts.contextMenu.menuAriaLabel": "Kontextmenu",
  "designlab.componentContracts.tourCoachmarks.title": "Gefuehrte Tour",
  "designlab.componentContracts.tourCoachmarks.skipLabel": "Ueberspringen",
  "designlab.componentContracts.tourCoachmarks.closeLabel": "Schliessen",
  "designlab.componentContracts.tourCoachmarks.previousLabel": "Zurueck",
  "designlab.componentContracts.tourCoachmarks.nextStepLabel":
    "Naechster Schritt",
  "designlab.componentContracts.tourCoachmarks.finishLabel": "Fertig",
  "designlab.componentContracts.tourCoachmarks.readonlyFinishLabel":
    "Tour abgeschlossen",
  "designlab.componentContracts.agGridServer.loadingLabel": "Wird geladen...",
  "designlab.componentContracts.entityGridTemplate.defaultVariantName":
    "Unbenannte Variante",
  "designlab.componentContracts.entityGridTemplate.quickFilterPlaceholder":
    "In allen Spalten suchen...",
  "designlab.componentContracts.entityGridTemplate.themeLabel": "Thema",
  "designlab.componentContracts.entityGridTemplate.quickFilterLabel":
    "Schnellfilter",
  "designlab.componentContracts.entityGridTemplate.variantLabel": "Variante",
  "designlab.componentContracts.entityGridTemplate.densityToggleLabel":
    "Zeilendichte",
  "designlab.componentContracts.entityGridTemplate.comfortableDensityLabel":
    "Komfortabel",
  "designlab.componentContracts.entityGridTemplate.compactDensityLabel":
    "Kompakt",
  "designlab.componentContracts.entityGridTemplate.densityResetLabel":
    "Globale Einstellung verwenden",
  "designlab.componentContracts.entityGridTemplate.fullscreenTooltip":
    "Vollbild in einem neuen Tab offnen",
  "designlab.componentContracts.entityGridTemplate.resetFiltersLabel":
    "Filter zurucksetzen",
  "designlab.componentContracts.entityGridTemplate.excelVisibleLabel":
    "Excel (sichtbar)",
  "designlab.componentContracts.entityGridTemplate.excelAllLabel":
    "Excel (alle)",
  "designlab.componentContracts.entityGridTemplate.csvVisibleLabel":
    "CSV (sichtbar)",
  "designlab.componentContracts.entityGridTemplate.csvAllLabel": "CSV (alle)",
  "designlab.componentContracts.entityGridTemplate.variantModalTitle":
    "Variantenverwaltung",
  "designlab.componentContracts.entityGridTemplate.variantNewButtonLabel":
    "Neue Variante erstellen",
  "designlab.componentContracts.entityGridTemplate.variantNamePlaceholder":
    "Name der neuen Variante",
  "designlab.componentContracts.entityGridTemplate.overlayLoadingLabel":
    "Eintrage werden geladen...",
  "designlab.componentContracts.entityGridTemplate.overlayNoRowsLabel":
    "Keine Eintrage gefunden",
  "designlab.componentContracts.entityGridTemplate.densityStatusUsingGlobal":
    "Die globale Dichte ist aktiv.",
  "designlab.componentContracts.entityGridTemplate.densityStatusOverride":
    "Dieses Grid verwendet eine lokale Dichteuberschreibung.",
  "designlab.componentContracts.entityGridTemplate.gridNotReadyLabel":
    "Das Grid ist noch nicht bereit.",
  "designlab.componentContracts.entityGridTemplate.resetFiltersSuccessLabel":
    "Filter wurden zuruckgesetzt.",
  "designlab.componentContracts.entityGridTemplate.pageSizeLabel":
    "Seitengrosse:",
  "designlab.componentContracts.entityGridTemplate.recordCountLabel":
    "{start}-{end} / {total} Eintrage",
  "designlab.componentContracts.entityGridTemplate.pageIndicatorLabel":
    "Seite {currentPage} / {pageCount}",
  "designlab.componentContracts.entityGridTemplate.firstPageLabel":
    "Erste Seite",
  "designlab.componentContracts.entityGridTemplate.previousPageLabel":
    "Vorherige Seite",
  "designlab.componentContracts.entityGridTemplate.nextPageLabel":
    "Nachste Seite",
  "designlab.componentContracts.entityGridTemplate.lastPageLabel":
    "Letzte Seite",
  "designlab.componentContracts.entityGridTemplate.variantsLoadingOptionLabel":
    "Varianten werden geladen...",
  "designlab.componentContracts.entityGridTemplate.variantSelectOptionLabel":
    "Variante auswahlen...",
  "designlab.componentContracts.entityGridTemplate.clearVariantSelectionLabel":
    "Variantenauswahl aufheben",
  "designlab.componentContracts.entityGridTemplate.manageVariantsLabel":
    "Varianten verwalten",
  "designlab.componentContracts.entityGridTemplate.closeVariantManagerLabel":
    "Variantenverwaltung schliessen",
  "designlab.componentContracts.entityGridTemplate.personalVariantsTitle":
    "Personliche Varianten",
  "designlab.componentContracts.entityGridTemplate.personalVariantsEmptyLabel":
    "Noch keine personliche Variante.",
  "designlab.componentContracts.entityGridTemplate.globalVariantsTitle":
    "Globale Varianten",
  "designlab.componentContracts.entityGridTemplate.globalVariantsEmptyLabel":
    "Noch keine globale Variante.",
  "designlab.componentContracts.entityGridTemplate.dismissToastLabel":
    "Benachrichtigung schliessen",
  "designlab.componentContracts.entityGridTemplate.localeText.selectAll":
    "Alle auswahlen",
  "designlab.componentContracts.entityGridTemplate.localeText.searchOoo":
    "Suchen...",
  "designlab.componentContracts.entityGridTemplate.localeText.filterOoo":
    "Filtern...",
  "designlab.componentContracts.entityGridTemplate.localeText.blanks": "(Leer)",
  "designlab.componentContracts.entityGridTemplate.localeText.page": "Seite",
  "designlab.componentContracts.entityGridTemplate.localeText.more": "Mehr",
  "designlab.componentContracts.entityGridTemplate.localeText.of": "von",
  "designlab.componentContracts.entityGridTemplate.localeText.next": "Weiter",
  "designlab.componentContracts.entityGridTemplate.localeText.last": "Letzte",
  "designlab.componentContracts.entityGridTemplate.localeText.first": "Erste",
  "designlab.componentContracts.entityGridTemplate.localeText.previous":
    "Zuruck",
  "designlab.componentContracts.entityGridTemplate.localeText.columns":
    "Spalten",
  "designlab.componentContracts.entityGridTemplate.localeText.filters":
    "Filter",
  "designlab.componentContracts.entityGridTemplate.localeText.collapseAll":
    "Alle einklappen",
  "designlab.componentContracts.entityGridTemplate.localeText.expandAll":
    "Alle aufklappen",
  "designlab.componentContracts.entityGridTemplate.localeText.pinColumn":
    "Spalte anheften",
  "designlab.componentContracts.entityGridTemplate.localeText.autosizeThisColumn":
    "Diese Spalte automatisch anpassen",
  "designlab.componentContracts.entityGridTemplate.localeText.autosizeAllColumns":
    "Alle Spalten automatisch anpassen",
  "designlab.componentContracts.entityGridTemplate.localeText.groupBy":
    "Gruppieren nach",
  "designlab.componentContracts.entityGridTemplate.localeText.resetColumns":
    "Spalten zurucksetzen",
  "designlab.componentContracts.entityGridTemplate.localeText.resetFilters":
    "Filter zurucksetzen",
  "designlab.componentContracts.entityGridTemplate.localeText.toolPanelButton":
    "Werkzeugleiste",
  "designlab.componentContracts.entityGridTemplate.localeText.columnMenuPin":
    "Angeheftet",
  "designlab.componentContracts.entityGridTemplate.localeText.columnMenuValue":
    "Werte",
  "designlab.componentContracts.entityGridTemplate.localeText.columnMenuGroup":
    "Gruppen",
  "designlab.componentContracts.entityGridTemplate.localeText.columnMenuSort":
    "Sortieren",
  "designlab.componentContracts.entityGridTemplate.localeText.columnMenuFilter":
    "Spaltenfilter",
  "designlab.componentContracts.entityGridTemplate.localeText.applyFilter":
    "Anwenden",
  "designlab.componentContracts.entityGridTemplate.localeText.clearFilter":
    "Zurucksetzen",
  "designlab.componentContracts.entityGridTemplate.localeText.clearFilters":
    "Alle Filter zurucksetzen",
  "designlab.componentContracts.entityGridTemplate.localeText.equals": "Gleich",
  "designlab.componentContracts.entityGridTemplate.localeText.notEqual":
    "Ungleich",
  "designlab.componentContracts.entityGridTemplate.localeText.lessThan":
    "Kleiner als",
  "designlab.componentContracts.entityGridTemplate.localeText.lessThanOrEqual":
    "Kleiner oder gleich",
  "designlab.componentContracts.entityGridTemplate.localeText.greaterThan":
    "Grosser als",
  "designlab.componentContracts.entityGridTemplate.localeText.greaterThanOrEqual":
    "Grosser oder gleich",
  "designlab.componentContracts.entityGridTemplate.localeText.inRange":
    "Im Bereich",
  "designlab.componentContracts.entityGridTemplate.localeText.contains":
    "Enthalt",
  "designlab.componentContracts.entityGridTemplate.localeText.notContains":
    "Enthalt nicht",
  "designlab.componentContracts.entityGridTemplate.localeText.startsWith":
    "Beginnt mit",
  "designlab.componentContracts.entityGridTemplate.localeText.endsWith":
    "Endet mit",
  "designlab.componentContracts.entityGridTemplate.localeText.blank": "Leer",
  "designlab.componentContracts.entityGridTemplate.localeText.notBlank":
    "Nicht leer",
  "designlab.general.component.empty": "Wahle links eine Komponente aus.",
  "designlab.general.recipe.empty": "Wahle im Rezept-Explorer ein Rezept aus.",
  "designlab.general.component.title": "Komponenten-Snapshot",
  "designlab.general.component.description":
    "Statt eines breiten Hero-Bands werden Komponentenidentitat, Schnellstatus und Importaktion hier in einer einzigen Registerkarte gesammelt.",
  "designlab.general.component.primarySummary": "Primare Zusammenfassung",
  "designlab.general.component.import.label": "Importieren",
  "designlab.general.component.import.action": "Import kopieren",
  "designlab.general.component.releaseIdentity":
    "Veroeffentlichung & Identitaet",
  "designlab.general.component.primaryLens.note":
    "Die primare Entdeckungslinse, abgeleitet aus der Taxonomiegruppe der Komponente.",
  "designlab.general.component.package": "Paket",
  "designlab.general.component.contractTags": "Vertrag / Tags",
  "designlab.general.component.noTags": "Keine Tags",
  "designlab.general.recipe.title": "Rezept-Snapshot",
  "designlab.general.recipe.description":
    "Rezeptidentitat, Owner-Block-Set und schnelle Coverage-Signale werden hier in einer einzigen Registerkarte gesammelt.",
  "designlab.general.recipe.identity": "Rezeptidentitat",
  "designlab.general.recipe.primaryLens.note":
    "Die primare Entdeckungslinse, abgeleitet aus Rezept-Intent und Owner-Block-Komposition.",
  "designlab.general.recipe.tracksThemes": "Linien und Themen",
  "designlab.general.recipe.sectionsGates": "Sektionen & Gates",
  "designlab.general.recipe.noBindings": "Keine Bindungen gefunden",
  "designlab.metadata.primaryLens": "Primare Linse",
  "designlab.metadata.track": "Linie",
  "designlab.metadata.group": "Gruppe",
  "designlab.metadata.usage": "Nutzung",
  "designlab.metadata.ownerBlocks": "Verantwortungsbloecke",
  "designlab.metadata.tracks": "Linien",
  "designlab.metadata.sections": "Sektionen",
  "designlab.metadata.themes": "Themen",
  "designlab.metadata.mode.recipeExplorer": "Rezept-Explorer",
  "designlab.metadata.mode.noSelection": "Keine Auswahl",
  "designlab.metadata.notAvailable": "—",
  "designlab.track.newPackages.label": "Neue Pakete",
  "designlab.track.newPackages.note":
    "Neue Komponentenfamilie, die uber den aktiven Wave-Vertrag erzeugt wurde.",
  "designlab.track.currentSystem.label": "Aktuelles System",
  "designlab.track.currentSystem.note":
    "Bereits exportierte Flache, die im Repo schon verwendet wird.",
  "designlab.track.roadmap.label": "Fahrplan",
  "designlab.track.roadmap.note":
    "Geplanter Komponenten-Backlog, der noch nicht exportiert ist.",
  "designlab.usageRecipes.basic.title": "Basisnutzung",
  "designlab.usageRecipes.basic.description":
    "Sicheres Startrezept mit Paketimport und minimaler API-Flache.",
  "designlab.usageRecipes.controlled.title": "Gesteuerter Zustand",
  "designlab.usageRecipes.controlled.description":
    "Nutzungsmuster, das uber Formular- oder Shell-State verwaltet wird.",
  "designlab.usageRecipes.governed.title": "Ops-/Qualitatshinweis",
  "designlab.usageRecipes.governed.description":
    "Nutzungshinweis, abgestimmt auf Wave-Gate, Browser-Doctor und Registry-Vertrag.",
  "designlab.overview.empty": "Wahle links eine Komponente aus.",
  "designlab.overview.workspace.title": "Ubersichts-Workspace",
  "designlab.overview.workspace.description":
    "Release, Adoption, Migration, Visual Contract, Theme und Rezeptsystem werden hier als Workspace-Panels zweiter Ebene geoffnet, statt in einer Registerkarte gestapelt zu werden.",
  "designlab.overview.workspace.noPanels":
    "Fur diese Komponente ist kein Ubersichtspanel verfugbar.",
  "designlab.common.tabbed": "Mit Registerkarten",
  "designlab.common.panelCount": "{count} Panel",
  "designlab.common.panelCountPlural": "{count} Panels",
  "designlab.component.api.empty":
    "Wahle eine Komponente aus, um API-Details zu prufen.",
  "designlab.component.api.workspace.title": "API-Workspace",
  "designlab.component.api.workspace.description":
    "Import, Modell, Props und Nutzung werden als Workspace-Panels zweiter Ebene geoffnet, statt in einer langen Registerkarte gestapelt zu werden.",
  "designlab.component.api.import": "Import",
  "designlab.component.api.import.planned":
    "Geplantes Element — Import nicht verfugbar",
  "designlab.component.api.registryFields": "Registry-Felder",
  "designlab.component.api.kind": "Typ",
  "designlab.component.api.taxonomy": "Taxonomie",
  "designlab.component.api.subgroup": "Untergruppe",
  "designlab.component.api.track": "Linie",
  "designlab.component.api.model.title": "API-Modell",
  "designlab.component.api.model.noCatalog":
    "Fur diese Komponente gibt es noch keinen detaillierten API-Katalogeintrag.",
  "designlab.component.api.model.variantAxes": "Variantenachsen",
  "designlab.component.api.model.stateModel": "Zustandsmodell",
  "designlab.component.api.model.previewFocus": "Preview-Fokus",
  "designlab.component.api.model.regressionFocus": "Regressionsfokus",
  "designlab.component.ux.empty":
    "Wahle eine Komponente aus, um die UX-Ausrichtung zu prufen.",
  "designlab.component.ux.alignment": "UX-Ausrichtung",
  "designlab.component.ux.northStar": "North-Star-Sektionen",
  "designlab.component.ux.primaryThemeMissing": "Kein primares Theme",
  "designlab.component.ux.primarySubthemeMissing": "Kein primares Subtheme",
  "designlab.component.ux.sectionMissing": "Keine Sektion",
  "designlab.component.quality.empty":
    "Wahle eine Komponente aus, um Qualitatssignale zu prufen.",
  "designlab.component.quality.workspace.title": "Qualitats-Workspace",
  "designlab.component.quality.workspace.description":
    "Gate- und Nutzungssignale sind in Panels zweiter Ebene getrennt, damit die Qualitatsprufung fokussiert bleibt.",
  "designlab.component.quality.gates": "Qualitats-Gates",
  "designlab.component.quality.usage": "Nutzungssignale",
  "designlab.component.quality.noGates": "Kein Qualitats-Gate",
  "designlab.recipe.overview.empty": "Wahle im Rezept-Explorer ein Rezept aus.",
  "designlab.recipe.overview.workspace.title": "Rezept-Workspace",
  "designlab.recipe.overview.workspace.description":
    "Rezeptzusammenfassung, Coverage und Consumer-Flow werden als kontrollierte Workspace-Panels geoffnet, statt als langes Dokument.",
  "designlab.recipe.overview.summary": "Rezeptzusammenfassung",
  "designlab.recipe.overview.quickStatus": "Schnellstatus des Rezepts",
  "designlab.recipe.overview.quickStatus.ownerBlocks.note":
    "Anzahl der kanonischen Komponenten innerhalb dieses Rezepts.",
  "designlab.recipe.overview.quickStatus.tracks.note":
    "Anzahl der Release-Tracks, die das Rezept abdeckt.",
  "designlab.recipe.overview.quickStatus.sections.note":
    "Anzahl der abgedeckten North-Star-Sektionen.",
  "designlab.recipe.overview.quickStatus.themes.note":
    "Gebundene UX-Theme- und Subtheme-Flache.",
  "designlab.recipe.overview.trackCoverage": "Linienabdeckung",
  "designlab.recipe.overview.northStarCoverage": "North-Star-Coverage",
  "designlab.recipe.overview.themeCoverage": "Theme-Coverage",
  "designlab.recipe.overview.qualityCoverage": "Qualitats-Coverage",
  "designlab.recipe.overview.noTrackBinding": "Keine Track-Bindung",
  "designlab.recipe.overview.noSectionBinding": "Keine Sektionsbindung",
  "designlab.recipe.overview.noThemeBinding": "Keine Theme-Bindung",
  "designlab.recipe.overview.noQualityGates": "Kein Qualitats-Gate",
  "designlab.recipe.overview.flow.eyebrow": "Consumer-Flow",
  "designlab.recipe.overview.flow.title": "Adoptionsvertrag des Rezepts",
  "designlab.recipe.overview.flow.description":
    "Anwendungsteams sollten zuerst auf Rezept-Ebene entscheiden und erst dann in fehlende Owner-Block-Details wechseln.",
  "designlab.recipe.overview.flow.step1": "Rezept auswahlen",
  "designlab.recipe.overview.flow.step1.note":
    "Ordne das Bildschirmproblem zuerst einer passenden Rezeptfamilie zu.",
  "designlab.recipe.overview.flow.step2": "Preset fixieren",
  "designlab.recipe.overview.flow.step2.note":
    "Theme-, Dichte- und UX-Sektionsentscheidungen sollten auf Rezept-Ebene festgelegt werden.",
  "designlab.recipe.overview.flow.step3": "In Komponente wechseln",
  "designlab.recipe.overview.flow.step3.note":
    "Offne das Primitive-Detail nur, wenn noch ein Block oder eine Variante fehlt.",
  "designlab.recipe.api.empty":
    "Wahle ein Rezept aus, um den Consume-Contract zu prufen.",
  "designlab.recipe.api.workspace.title": "Consume-Contract-Workspace",
  "designlab.recipe.api.workspace.description":
    "Rezeptimport, Registry-Bindung und Consumer-Handoff werden als kontrollierte Workspace-Panels geoffnet, statt in einem einzigen langen Fluss.",
  "designlab.recipe.api.listLabel": "Rezept-API-Workspace-Panels",
  "designlab.recipe.api.contract": "Vertrag",
  "designlab.recipe.api.binding": "Bindung",
  "designlab.recipe.api.usage": "Nutzung",
  "designlab.recipe.api.contractTitle": "Rezeptvertrag",
  "designlab.recipe.api.bindingTitle": "Registry-Bindung",
  "designlab.recipe.api.binding.recipeId.note":
    "Kanonische Rezept-ID innerhalb von Design Lab.",
  "designlab.recipe.api.binding.ownerBlocks.note":
    "Offizielles Block-Set, das der Consumer-Screen zusammensetzt.",
  "designlab.recipe.api.binding.tracks.note":
    "Release-Linien, die dieses Rezept abdeckt.",
  "designlab.recipe.api.binding.contract.note":
    "Quellvertrag fur das Rezeptsystem.",
  "designlab.recipe.api.compose.title": "Rezept-Shell zusammensetzen",
  "designlab.recipe.api.compose.description":
    "Setze das Owner-Block-Set des Rezepts direkt auf derselben Flache zusammen.",
  "designlab.recipe.api.handoff.title": "Consumer-Handoff",
  "designlab.recipe.api.handoff.description":
    "Anwendungsteams sollten zuerst die Rezeptentscheidung ubernehmen und Primitive-Varianten nur bei Bedarf offnen.",
  "designlab.recipe.quality.empty":
    "Wahle ein Rezept aus, um Qualitatssignale zu prufen.",
  "designlab.recipe.quality.workspace.title": "Rezept-Qualitats-Workspace",
  "designlab.recipe.quality.workspace.description":
    "Gate- und Lifecycle-Signale sind in Panels zweiter Ebene getrennt, damit die Rezept-Qualitatsprufung fokussiert bleibt.",
  "designlab.recipe.quality.listLabel": "Panels des Rezept-Qualitats-Workspace",
  "designlab.recipe.quality.lifecycle": "Lifecycle",
  "designlab.recipe.quality.lifecycle.title": "Lifecycle-Mix",
  "designlab.recipe.quality.lifecycle.stable.note":
    "Anzahl stabiler Blocke innerhalb des Rezepts.",
  "designlab.recipe.quality.lifecycle.beta.note":
    "Anzahl der Blocke, die noch nicht stabilisiert sind.",
  "designlab.recipe.quality.lifecycle.liveDemo.note":
    "Anzahl der Blocke mit Live-Demo-Unterstutzung.",
  "designlab.showcase.previewPanels.live.note":
    "Live-Demo und interaktive Variantenflache.",
  "designlab.showcase.previewPanels.reference.label": "Referenz",
  "designlab.showcase.previewPanels.reference.note":
    "Nutzungshinweise, Vertragskommentare und Referenzpanels.",
  "designlab.showcase.previewPanels.recipe.label": "Rezept",
  "designlab.showcase.previewPanels.recipe.note":
    "Rezeptlinse, Komposition und verbraucherorientierte Blocke.",
  "designlab.showcase.previewSurface.live": "LIVE",
  "designlab.showcase.previewSurface.reference": "REFERENZ",
  "designlab.showcase.previewSurface.recipe": "REZEPT",
  "designlab.showcase.preview.workspace.title": "Preview-Workspace",
  "designlab.showcase.preview.workspace.description.recipes":
    "Die Rezeptkomposition offnet sich in einem einzigen aktiven Preview-Panel. Live-Blocke, Referenzhinweise und Rezept-Handoff lassen sich uber getrennte Registerkarten durchsuchen.",
  "designlab.showcase.preview.workspace.description.components":
    "Live-Demo und Referenzhinweise offnen sich in einem einzigen aktiven Preview-Workspace. Statt eines langen Seitenflusses wird nur die ausgewahlte Komponentenflache gezeigt.",
  "designlab.showcase.preview.workspace.listLabel.recipes":
    "Rezept-Preview-Panels",
  "designlab.showcase.preview.workspace.listLabel.components":
    "Komponenten-Preview-Panels",
  "designlab.showcase.preview.workspace.showcaseCount": "{count} Showcase",
  "designlab.showcase.preview.empty.recipe":
    "Fur das ausgewahlte Preview-Panel gibt es keine sichtbare Rezeptflache. Wechsle das Panel, um Komposition oder Referenzblocke zu offnen.",
  "designlab.showcase.preview.empty.component":
    "Fur das ausgewahlte Preview-Panel gibt es keine sichtbare Demo. Offne eine andere Flache uber Live, Referenz oder Rezept.",
  "designlab.showcase.preview.selectRecipe":
    "Wahle ein Rezept aus, um Demo und Komposition zu prufen.",
  "designlab.showcase.preview.selectComponent":
    "Wahle eine Komponente aus, um das Live-Showcase zu prufen.",
  "designlab.showcase.preview.undefinedRecipePreview":
    "Fur dieses Rezept gibt es noch keine benutzerdefinierte Komponenten-Preview.",
  "designlab.showcase.component.recipeLens.eyebrow": "Rezeptlinse",
  "designlab.showcase.component.recipeLens.title":
    "Linse der Rezeptkomposition",
  "designlab.showcase.component.recipeLens.description":
    "Welche Screen-Rezepte verwenden diese Komponente und wo sollten Consumer-Teams eine fertige Komposition ubernehmen?",
  "designlab.showcase.component.recipeLens.directRecipes": "Direkte Rezepte",
  "designlab.showcase.component.recipeLens.consumerHandoff": "Consumer-Handoff",
  "designlab.showcase.component.recipeLens.badge.directOwner": "Direkter Owner",
  "designlab.showcase.component.recipeLens.badge.related": "Verwandt",
  "designlab.showcase.component.recipeLens.preferredSource":
    "Bevorzugte Quelle",
  "designlab.showcase.component.recipeLens.preferredSource.recipe":
    "Rezeptkomposition",
  "designlab.showcase.component.recipeLens.preferredSource.primitive":
    "Primitive Komposition",
  "designlab.showcase.component.recipeLens.preferredSource.note.recipe":
    "Consumer-Teams sollten fur diese Komponente mit einer fertigen Rezeptfamilie beginnen.",
  "designlab.showcase.component.recipeLens.preferredSource.note.primitive":
    "Es gibt kein fertiges Rezept; die Primitive-Komposition wird direkt verwendet.",
  "designlab.showcase.component.recipeLens.primaryTrack": "Primarer Track",
  "designlab.showcase.component.recipeLens.primaryTrack.note":
    "Consumer-Teams sollten innerhalb desselben Tracks auf kanonische Rezepte und Theme-Presets verweisen.",
  "designlab.showcase.component.recipeLens.consumerRule": "Consumer-Regel",
  "designlab.showcase.component.recipeLens.consumerRule.description":
    "Anwendungsteams sollten das Screen-Design nicht innerhalb der Seite neu erfinden. Prufe zuerst die Rezeptfamilien in dieser Linse; entwerfe nur dann eine neue Primitive-Komposition, wenn noch etwas fehlt.",
  "designlab.showcase.recipe.workspace.surface.title": "Rezeptflache",
  "designlab.showcase.recipe.workspace.surface.description":
    "Die Live-Komposition, der Vertragskontext und der Consumer-Handoff des Rezepts werden in derselben Karte gelesen.",
  "designlab.showcase.recipe.workspace.handoff.preferredPath":
    "Bevorzugter Pfad",
  "designlab.showcase.recipe.workspace.handoff.preferredPath.value":
    "Rezept -> Screen",
  "designlab.showcase.recipe.workspace.handoff.preferredPath.note":
    "Produktteams sollten von diesen Rezeptfamilien ausgehen und nur Daten sowie Business-Regeln anbinden.",
  "designlab.showcase.recipe.workspace.handoff.trackSpread": "Track-Streuung",
  "designlab.showcase.recipe.workspace.handoff.trackSpread.note":
    "Wenn Rezeptkomponenten mehrere Tracks abdecken, sollten Designentscheidungen auf dieser Flache fixiert werden.",
  "designlab.showcase.recipe.workspace.handoff.missingOwners": "Fehlende Owner",
  "designlab.showcase.recipe.workspace.handoff.contractHealth":
    "Vertragszustand",
  "designlab.showcase.recipe.workspace.handoff.contractHealth.description":
    "Alle Owner-Blocke entsprechen der Registry. Dieses Rezept kann jetzt als sicherer Ausgangspunkt fur Consumer-Screens verwendet werden.",
  "designlab.showcase.recipe.workspace.buildingBlocks.title":
    "Primare Baublocke",
  "designlab.showcase.recipe.workspace.buildingBlocks.description":
    "Springe zu einem beliebigen Block im Rezept und setze die Prufung auf Komponentenebene fort.",
  "designlab.showcase.recipe.workspace.buildingBlocks.action":
    "Komponentendetail offnen",
  "designlab.showcase.recipe.workspace.quality.title":
    "Governance- und Qualitatsvertrag",
  "designlab.showcase.recipe.workspace.quality.description":
    "Gemeinsame Qualitats-Gates, UX-Theme und North-Star-Sektionsabdeckung auf Rezept-Ebene.",
  "designlab.showcase.recipe.workspace.quality.gates": "Qualitats-Gates",
  "designlab.showcase.recipe.workspace.quality.uxAndSections":
    "UX und Sektionen",
  "designlab.showcase.recipe.workspace.quality.noGate": "Kein Gate",
  "designlab.showcase.recipe.workspace.quality.noTheme": "Kein UX-Theme",
  "designlab.showcase.recipe.workspace.quality.noSection":
    "Keine North-Star-Sektion",
  "designlab.showcase.recipe.searchFilterListing.eyebrow": "Rezept",
  "designlab.showcase.recipe.searchFilterListing.title": "Policy-Inventar",
  "designlab.showcase.recipe.searchFilterListing.description":
    "Suche, Filter und Ergebnis-Shell werden unter demselben Rezeptvertrag gesammelt.",
  "designlab.showcase.recipe.searchFilterListing.searchLabel": "Suche",
  "designlab.showcase.recipe.searchFilterListing.densityLabel": "Dichte",
  "designlab.showcase.recipe.searchFilterListing.density.comfortable":
    "Komfortabel",
  "designlab.showcase.recipe.searchFilterListing.density.compact": "Kompakt",
  "designlab.showcase.recipe.searchFilterListing.density.readonly":
    "Schreibgeschutzt",
  "designlab.showcase.recipe.searchFilterListing.savedView":
    "Gespeicherte Rezept-Listenansicht",
  "designlab.showcase.recipe.searchFilterListing.summary.results.label":
    "Ergebnisse",
  "designlab.showcase.recipe.searchFilterListing.summary.results.note":
    "Server-Snapshot",
  "designlab.showcase.recipe.searchFilterListing.summary.selection.label":
    "Auswahl",
  "designlab.showcase.recipe.searchFilterListing.summary.selection.note":
    "Aktionszustand der Toolbar",
  "designlab.showcase.recipe.searchFilterListing.summary.density.label":
    "Dichte",
  "designlab.showcase.recipe.searchFilterListing.summary.density.note":
    "Dichte der Rezept-Shell",
  "designlab.showcase.recipe.detailSummary.eyebrow": "Rezept",
  "designlab.showcase.recipe.detailSummary.title": "Wave-11-Rollout-Detail",
  "designlab.showcase.recipe.detailSummary.description":
    "Zusammenfassung, Entitatskontext und Payload werden uber dasselbe Inspector-Rezept gelesen.",
  "designlab.showcase.recipe.detailSummary.status":
    "Bereit fur die Veroffentlichung",
  "designlab.showcase.recipe.detailSummary.summary.owners.note":
    "Anzahl kanonischer Owner-Blocke",
  "designlab.showcase.recipe.detailSummary.summary.doctor.note":
    "ui-library-Voreinstellung",
  "designlab.showcase.recipe.detailSummary.summary.adoption.label":
    "Einfuehrung",
  "designlab.showcase.recipe.detailSummary.summary.adoption.note":
    "Rezeptorientierte Durchsetzung",
  "designlab.showcase.recipe.detailSummary.entity.subtitle":
    "Nutzt Seiten- und Panel-Kompositionen uber Daten und Konfiguration wieder.",
  "designlab.showcase.recipe.detailSummary.entity.owner": "Verantwortlich",
  "designlab.showcase.recipe.detailSummary.detail.focus.value":
    "Wiederverwendbare Seiten-/Panel-Muster",
  "designlab.showcase.recipe.detailSummary.detail.gate.value":
    "doctor + Wellenpruefung",
  "designlab.showcase.recipe.detailSummary.detail.preview.value": "/ui-library",
  "designlab.showcase.recipe.detailSummary.detail.rule.value":
    "Rezept vor seitenbezogener individueller UI",
  "designlab.showcase.recipe.approvalReview.title":
    "Freigabe zur Veroffentlichung",
  "designlab.showcase.recipe.approvalReview.eyebrow": "Rezept",
  "designlab.showcase.recipe.approvalReview.description":
    "Checkpoint, Evidenz und Audit-Flow werden uber dasselbe Review-Rezept gelesen.",
  "designlab.showcase.recipe.approvalReview.summary":
    "Die Veroffentlichungsentscheidung des Rezepts wird mit Citation-Evidenz und Audit-Zeitleiste gelesen.",
  "designlab.showcase.recipe.approvalReview.state":
    "Aktueller Zustand: {state}",
  "designlab.showcase.recipe.emptyErrorLoading.loadingLabel":
    "Rezeptflachen werden vorbereitet",
  "designlab.showcase.recipe.emptyErrorLoading.retry":
    "Wiederholung aus dem Rezeptzustand angefordert",
  "designlab.showcase.recipe.aiGuidedAuthoring.title":
    "ApprovalReview-Rezept verwenden",
  "designlab.showcase.recipe.aiGuidedAuthoring.summary":
    "Verwende das kanonische ApprovalReview-Rezept anstelle einer doppelten Review-Shell.",
  "designlab.showcase.recipe.aiGuidedAuthoring.type": "Rezeptvorschlag",
  "designlab.showcase.recipe.aiGuidedAuthoring.decision":
    "Entscheidung: {decision}",
  "designlab.showcase.component.textInput.live.primary.title":
    "Label / Hilfe / Zahler",
  "designlab.showcase.component.textInput.live.primary.label": "Benutzername",
  "designlab.showcase.component.textInput.live.primary.description":
    "Kurzer Name, der im gesamten System angezeigt wird.",
  "designlab.showcase.component.textInput.live.primary.hint":
    "Bis zu 32 Zeichen ohne Leerzeichen verwenden.",
  "designlab.showcase.component.textInput.live.primary.activeValue":
    "Aktiver Wert: {value}",
  "designlab.showcase.component.textInput.live.stateMatrix.title":
    "Zustandsmatrix",
  "designlab.showcase.component.textInput.live.stateMatrix.validatedLabel":
    "Validiertes Feld",
  "designlab.showcase.component.textInput.live.stateMatrix.invalidLabel":
    "Ungueltiges Feld",
  "designlab.showcase.component.textInput.live.stateMatrix.invalidError":
    "Mindestens 3 Zeichen eingeben.",
  "designlab.showcase.component.textInput.live.stateMatrix.readonlyLabel":
    "Schreibgeschuetztes Feld",
  "designlab.showcase.component.textArea.live.authoring.title":
    "Automatische Hohe / Hilfe",
  "designlab.showcase.component.textArea.live.authoring.label": "Beschreibung",
  "designlab.showcase.component.textArea.live.authoring.description":
    "Gemeinsames Texteingabefeld fuer laengere Inhalte.",
  "designlab.showcase.component.textArea.live.authoring.hint":
    "Bei mehrzeiligen Eingaben automatische Hohe verwenden.",
  "designlab.showcase.component.textArea.live.stateMatrix.title":
    "Validierung / Zugriff",
  "designlab.showcase.component.textArea.live.stateMatrix.invalidLabel":
    "Validierungsbeispiel",
  "designlab.showcase.component.textArea.live.stateMatrix.invalidValue":
    "Beschreibung fehlt",
  "designlab.showcase.component.textArea.live.stateMatrix.invalidError":
    "Dieses Feld muss mindestens 20 Zeichen enthalten.",
  "designlab.showcase.component.textArea.live.stateMatrix.readonlyLabel":
    "Schreibgeschuetzte Notiz",
  "designlab.showcase.component.textArea.live.stateMatrix.readonlyValue":
    "Systemprotokolle konnen vom Benutzer nicht bearbeitet werden.",
  "designlab.showcase.component.textArea.live.stateMatrix.disabledLabel":
    "Deaktivierter Entwurf",
  "designlab.showcase.component.textArea.live.stateMatrix.disabledValue":
    "Nach der Veroeffentlichung gesperrt.",
  "designlab.showcase.component.checkbox.live.controlled.title":
    "Gesteuert + Hilfe",
  "designlab.showcase.component.checkbox.live.controlled.label":
    "Benachrichtigung nach Release senden",
  "designlab.showcase.component.checkbox.live.controlled.description":
    "Stakeholder automatisch informieren, wenn der Ablauf abgeschlossen ist.",
  "designlab.showcase.component.checkbox.live.controlled.hint":
    "Kann bei Bedarf wieder deaktiviert werden.",
  "designlab.showcase.component.checkbox.live.controlled.activeValue":
    "Aktive Auswahl: {state}",
  "designlab.showcase.component.checkbox.live.controlled.stateOn": "An",
  "designlab.showcase.component.checkbox.live.controlled.stateOff": "Aus",
  "designlab.showcase.component.checkbox.live.stateMatrix.title":
    "Validierung / Zugriff",
  "designlab.showcase.component.checkbox.live.stateMatrix.invalidLabel":
    "Freigabe fehlt",
  "designlab.showcase.component.checkbox.live.stateMatrix.invalidError":
    "Vor dem Fortfahren muss zugestimmt werden.",
  "designlab.showcase.component.checkbox.live.stateMatrix.indeterminateLabel":
    "Teilweise Auswahl",
  "designlab.showcase.component.checkbox.live.stateMatrix.indeterminateHint":
    "Ein Teil der untergeordneten Optionen ist ausgewaehlt.",
  "designlab.showcase.component.checkbox.live.stateMatrix.readonlyLabel":
    "Schreibgeschuetzte Auswahl",
  "designlab.showcase.component.checkbox.live.stateMatrix.disabledLabel":
    "Deaktivierte Auswahl",
  "designlab.showcase.component.radio.live.controlled.title":
    "Gesteuerte Optionsgruppe",
  "designlab.showcase.component.radio.live.controlled.design.label":
    "Design-orientiert",
  "designlab.showcase.component.radio.live.controlled.design.description":
    "Visuelle Qualitaet und Dokumentation zuerst abschliessen.",
  "designlab.showcase.component.radio.live.controlled.ops.label":
    "Ops-orientiert",
  "designlab.showcase.component.radio.live.controlled.ops.description":
    "Doctor- und Gate-Nachweise zuerst abschliessen.",
  "designlab.showcase.component.radio.live.controlled.delivery.label":
    "Delivery-orientiert",
  "designlab.showcase.component.radio.live.controlled.delivery.description":
    "Nach dem Landing zuerst Lieferartefakte priorisieren.",
  "designlab.showcase.component.radio.live.stateMatrix.title": "Zustandsmatrix",
  "designlab.showcase.component.radio.live.stateMatrix.defaultLabel":
    "Standardoption",
  "designlab.showcase.component.radio.live.stateMatrix.invalidLabel":
    "Auswahl fehlt",
  "designlab.showcase.component.radio.live.stateMatrix.invalidError":
    "Mindestens eine Rollout-Strategie muss ausgewaehlt werden.",
  "designlab.showcase.component.radio.live.stateMatrix.readonlyLabel":
    "Schreibgeschuetzte Option",
  "designlab.showcase.component.radio.live.stateMatrix.disabledLabel":
    "Deaktivierte Option",
  "designlab.showcase.component.switch.live.controlled.title":
    "Gesteuerter Schalter",
  "designlab.showcase.component.switch.live.controlled.label":
    "Live-Sichtbarkeit aktivieren",
  "designlab.showcase.component.switch.live.controlled.description":
    "Die veroeffentlichte Ansicht sofort fuer Endnutzer sichtbar machen.",
  "designlab.showcase.component.switch.live.controlled.hint":
    "Kann spaeter wieder ausgeschaltet werden.",
  "designlab.showcase.component.switch.live.controlled.activeStatus":
    "Aktueller Status: {state}",
  "designlab.showcase.component.switch.live.controlled.stateOn": "An",
  "designlab.showcase.component.switch.live.controlled.stateOff": "Aus",
  "designlab.showcase.component.switch.live.stateMatrix.title":
    "Zustandsmatrix",
  "designlab.showcase.component.switch.live.stateMatrix.readonlyLabel":
    "Schreibgeschuetzter Schalter",
  "designlab.showcase.component.switch.live.stateMatrix.disabledLabel":
    "Deaktivierter Schalter",
  "designlab.showcase.component.switch.live.stateMatrix.invalidLabel":
    "Policy-Freigabe fehlt",
  "designlab.showcase.component.switch.live.stateMatrix.invalidError":
    "Dieser Wechsel erfordert eine zusaetzliche Freigabe.",
  "designlab.showcase.component.slider.live.controlled.title":
    "Gesteuerter Bereich",
  "designlab.showcase.component.slider.live.controlled.label": "Dichte",
  "designlab.showcase.component.slider.live.controlled.description":
    "Karten- und Tabellenabstaende aus einer Quelle steuern.",
  "designlab.showcase.component.slider.live.controlled.hint":
    "Hoehere Werte erzeugen ein luftigeres Layout.",
  "designlab.showcase.component.slider.live.controlled.minLabel": "Kompakt",
  "designlab.showcase.component.slider.live.controlled.maxLabel": "Komfortabel",
  "designlab.showcase.component.slider.live.stateMatrix.title":
    "Zustandsmatrix",
  "designlab.showcase.component.slider.live.stateMatrix.readonlyLabel":
    "Schreibgeschuetzter Slider",
  "designlab.showcase.component.slider.live.stateMatrix.invalidLabel":
    "Durch Richtlinie blockiert",
  "designlab.showcase.component.slider.live.stateMatrix.invalidError":
    "Diese Aenderung erfordert eine zusaetzliche Freigabe.",
  "designlab.showcase.component.datePicker.live.controlled.title":
    "Gesteuertes Datum",
  "designlab.showcase.component.datePicker.live.controlled.label":
    "Lieferdatum",
  "designlab.showcase.component.datePicker.live.controlled.description":
    "Den Tag planen, an dem die Aufgabe abgeschlossen wird.",
  "designlab.showcase.component.datePicker.live.controlled.hint":
    "Kalenderauswahl verwenden, um einen teilbaren Meilenstein zu setzen.",
  "designlab.showcase.component.datePicker.live.stateMatrix.title":
    "Zustandsmatrix",
  "designlab.showcase.component.datePicker.live.stateMatrix.readonlyLabel":
    "Schreibgeschuetztes Datum",
  "designlab.showcase.component.datePicker.live.stateMatrix.invalidLabel":
    "Ungueltiger Meilenstein",
  "designlab.showcase.component.datePicker.live.stateMatrix.invalidError":
    "Das Datum liegt ausserhalb des aktuellen Release-Fensters.",
  "designlab.showcase.component.timePicker.live.controlled.title":
    "Gesteuerte Uhrzeit",
  "designlab.showcase.component.timePicker.live.controlled.label":
    "Cutover-Zeit",
  "designlab.showcase.component.timePicker.live.controlled.description":
    "Die Ausfuehrungszeit im Release-Fenster auswaehlen.",
  "designlab.showcase.component.timePicker.live.controlled.hint":
    "In 15-Minuten-Schritten planen.",
  "designlab.showcase.component.timePicker.live.stateMatrix.title":
    "Zustandsmatrix",
  "designlab.showcase.component.timePicker.live.stateMatrix.readonlyLabel":
    "Schreibgeschuetzte Uhrzeit",
  "designlab.showcase.component.timePicker.live.stateMatrix.invalidLabel":
    "Ungueltiges Cutover",
  "designlab.showcase.component.timePicker.live.stateMatrix.invalidError":
    "Diese Uhrzeit liegt ausserhalb des erlaubten Deployment-Fensters.",
  "designlab.showcase.component.radio.sections.choice.eyebrow":
    "Alternative 01",
  "designlab.showcase.component.radio.sections.choice.title":
    "Strategie mit Einzelauswahl",
  "designlab.showcase.component.radio.sections.choice.description":
    "Eine gefuehrte Formularflaeche, in der genau eine Entscheidung ueber eine Option getroffen wird.",
  "designlab.showcase.component.radio.sections.choice.badge.singleChoice":
    "einzelauswahl",
  "designlab.showcase.component.radio.sections.choice.badge.decision":
    "entscheidung",
  "designlab.showcase.component.radio.sections.choice.panelControlled":
    "Gesteuerte Gruppe",
  "designlab.showcase.component.radio.sections.choice.panelSelected":
    "Ausgewaehlter Wert",
  "designlab.showcase.component.radio.sections.choice.selected.label":
    "Aktuelle Auswahl",
  "designlab.showcase.component.radio.sections.choice.selected.note":
    "Der gesteuerte Radio-Zustand wird von der Shell verwaltet.",
  "designlab.showcase.component.radio.sections.states.eyebrow":
    "Alternative 02",
  "designlab.showcase.component.radio.sections.states.title": "Zustandsmatrix",
  "designlab.showcase.component.radio.sections.states.description":
    "Ungueltige, schreibgeschuetzte und deaktivierte Radio-Zustaende.",
  "designlab.showcase.component.radio.sections.states.badge.invalid":
    "ungueltig",
  "designlab.showcase.component.radio.sections.states.badge.readonly":
    "schreibgeschuetzt",
  "designlab.showcase.component.radio.sections.states.badge.disabled":
    "deaktiviert",
  "designlab.showcase.component.radio.sections.states.panelDefault": "Standard",
  "designlab.showcase.component.radio.sections.states.panelInvalid":
    "Ungueltig",
  "designlab.showcase.component.radio.sections.states.panelReadonly":
    "Schreibgeschuetzt",
  "designlab.showcase.component.radio.sections.states.panelDisabled":
    "Deaktiviert",
  "designlab.showcase.component.switch.sections.toggle.eyebrow": "Variante 01",
  "designlab.showcase.component.switch.sections.toggle.title":
    "Live-Publish-Schalter",
  "designlab.showcase.component.switch.sections.toggle.description":
    "Gesteuerte Nutzung, die Sichtbarkeit oder Rollout-Zustand mit einem einzelnen Schalter aendert.",
  "designlab.showcase.component.switch.sections.toggle.badge.toggle":
    "schalter",
  "designlab.showcase.component.switch.sections.toggle.badge.controlled":
    "gesteuert",
  "designlab.showcase.component.switch.sections.toggle.badge.release":
    "freigabe",
  "designlab.showcase.component.switch.sections.toggle.panelControlled":
    "Gesteuerter Schalter",
  "designlab.showcase.component.switch.sections.toggle.panelStatus":
    "Aktueller Status",
  "designlab.showcase.component.switch.sections.toggle.status.label":
    "Live-Status",
  "designlab.showcase.component.switch.sections.toggle.status.note":
    "Die Schalteraenderung wird direkt ueber den gesteuerten Zustand verfolgt.",
  "designlab.showcase.component.switch.sections.states.eyebrow": "Variante 02",
  "designlab.showcase.component.switch.sections.states.title": "Zustandsmatrix",
  "designlab.showcase.component.switch.sections.states.description":
    "Schreibgeschuetzte, deaktivierte und durch Richtlinie blockierte Schalterzustande.",
  "designlab.showcase.component.switch.sections.states.badge.readonly":
    "schreibgeschuetzt",
  "designlab.showcase.component.switch.sections.states.badge.disabled":
    "deaktiviert",
  "designlab.showcase.component.switch.sections.states.badge.invalid":
    "ungueltig",
  "designlab.showcase.component.switch.sections.states.panelReadonly":
    "Schreibgeschuetzt",
  "designlab.showcase.component.switch.sections.states.panelDisabled":
    "Deaktiviert",
  "designlab.showcase.component.switch.sections.states.panelPolicyBlocked":
    "Durch Richtlinie blockiert",
  "designlab.showcase.component.slider.sections.density.eyebrow": "Variante 01",
  "designlab.showcase.component.slider.sections.density.title":
    "Dichtekalibrierung",
  "designlab.showcase.component.slider.sections.density.description":
    "Gesteuerte numerische Auswahl fuer Flaechendichte und Layout-Enge.",
  "designlab.showcase.component.slider.sections.density.badge.range": "bereich",
  "designlab.showcase.component.slider.sections.density.badge.controlled":
    "gesteuert",
  "designlab.showcase.component.slider.sections.density.badge.density":
    "dichte",
  "designlab.showcase.component.slider.sections.density.panelControlled":
    "Gesteuerter Slider",
  "designlab.showcase.component.slider.sections.density.panelCurrentValue":
    "Aktueller Wert",
  "designlab.showcase.component.slider.sections.density.currentValue.label":
    "Dichte",
  "designlab.showcase.component.slider.sections.density.currentValue.note":
    "Der Slider-Wert wird ueber den gesteuerten Zustand in Preview- und Regressionsflaechen uebernommen.",
  "designlab.showcase.component.slider.sections.states.eyebrow": "Variante 02",
  "designlab.showcase.component.slider.sections.states.title":
    "Schreibgeschuetzte und Policy-Zustaende",
  "designlab.showcase.component.slider.sections.states.description":
    "Verhalten des Bereichsinputs fuer schreibgeschuetzte und durch Richtlinie blockierte Szenarien.",
  "designlab.showcase.component.slider.sections.states.badge.readonly":
    "schreibgeschuetzt",
  "designlab.showcase.component.slider.sections.states.badge.invalid":
    "ungueltig",
  "designlab.showcase.component.slider.sections.states.badge.policy":
    "richtlinie",
  "designlab.showcase.component.slider.sections.states.panelReadonly":
    "Schreibgeschuetzt",
  "designlab.showcase.component.slider.sections.states.panelPolicyBlocked":
    "Durch Richtlinie blockiert",
  "designlab.showcase.component.datePicker.sections.milestone.eyebrow":
    "Alternative 01",
  "designlab.showcase.component.datePicker.sections.milestone.title":
    "Meilensteinplaner",
  "designlab.showcase.component.datePicker.sections.milestone.description":
    "Kalenderbasierte Auswahl fuer Lieferdatum und Rollout-Tag.",
  "designlab.showcase.component.datePicker.sections.milestone.badge.calendar":
    "kalender",
  "designlab.showcase.component.datePicker.sections.milestone.badge.milestone":
    "meilenstein",
  "designlab.showcase.component.datePicker.sections.milestone.badge.controlled":
    "gesteuert",
  "designlab.showcase.component.datePicker.sections.milestone.panelControlled":
    "Gesteuertes Datum",
  "designlab.showcase.component.datePicker.sections.milestone.panelSelected":
    "Ausgewaehltes Datum",
  "designlab.showcase.component.datePicker.sections.milestone.selected.label":
    "Lieferdatum",
  "designlab.showcase.component.datePicker.sections.milestone.selected.note":
    "Der gesteuerte DatePicker-Wert fliesst in Release- und Planungsablaeufe ein.",
  "designlab.showcase.component.datePicker.sections.states.eyebrow":
    "Alternative 02",
  "designlab.showcase.component.datePicker.sections.states.title":
    "Schreibgeschuetzte und validierte Zustande",
  "designlab.showcase.component.datePicker.sections.states.description":
    "Ein gemeinsamer Shell-Vertrag fuer schreibgeschuetzte und ungueltige Datumszustaende.",
  "designlab.showcase.component.datePicker.sections.states.badge.readonly":
    "readonly",
  "designlab.showcase.component.datePicker.sections.states.badge.invalid":
    "ungueltig",
  "designlab.showcase.component.datePicker.sections.states.badge.dateEntry":
    "datumeingabe",
  "designlab.showcase.component.datePicker.sections.states.panelReadonly":
    "Schreibgeschuetzt",
  "designlab.showcase.component.datePicker.sections.states.panelInvalid":
    "Ungueltig",
  "designlab.showcase.component.timePicker.sections.window.eyebrow":
    "Alternative 01",
  "designlab.showcase.component.timePicker.sections.window.title":
    "Cutover-Fensterplaner",
  "designlab.showcase.component.timePicker.sections.window.description":
    "Steuert Deployment-, Wartungs- und Freigabefensterzeiten auf governte Weise.",
  "designlab.showcase.component.timePicker.sections.window.badge.timeEntry":
    "zeiteingabe",
  "designlab.showcase.component.timePicker.sections.window.badge.controlled":
    "gesteuert",
  "designlab.showcase.component.timePicker.sections.window.badge.releaseWindow":
    "release-fenster",
  "designlab.showcase.component.timePicker.sections.window.panelControlled":
    "Gesteuerte Uhrzeit",
  "designlab.showcase.component.timePicker.sections.window.panelSelected":
    "Ausgewaehlte Uhrzeit",
  "designlab.showcase.component.timePicker.sections.window.selected.label":
    "Cutover-Zeit",
  "designlab.showcase.component.timePicker.sections.window.selected.note":
    "Der gesteuerte TimePicker-Zustand speist den Rollout-Ablauf.",
  "designlab.showcase.component.timePicker.sections.states.eyebrow":
    "Alternative 02",
  "designlab.showcase.component.timePicker.sections.states.title":
    "Schreibgeschuetzte und ungueltige Zustande",
  "designlab.showcase.component.timePicker.sections.states.description":
    "Schreibgeschuetzte und Release-Fenster-Validierungsszenarien mit derselben Shell-Sprache.",
  "designlab.showcase.component.timePicker.sections.states.badge.readonly":
    "readonly",
  "designlab.showcase.component.timePicker.sections.states.badge.invalid":
    "ungueltig",
  "designlab.showcase.component.timePicker.sections.states.badge.governedInput":
    "governter-input",
  "designlab.showcase.component.timePicker.sections.states.panelReadonly":
    "Schreibgeschuetzt",
  "designlab.showcase.component.timePicker.sections.states.panelInvalid":
    "Ungueltig",
  "designlab.showcase.component.upload.sections.evidence.eyebrow":
    "Alternative 01",
  "designlab.showcase.component.upload.sections.evidence.title":
    "Uploader fuer Evidenzpakete",
  "designlab.showcase.component.upload.sections.evidence.description":
    "Eine gesteuerte Upload-Flaeche, die Policy-, Release- und Audit-Nachweise an einem Ort sammelt.",
  "designlab.showcase.component.upload.sections.evidence.badge.files":
    "dateien",
  "designlab.showcase.component.upload.sections.evidence.badge.multiple":
    "mehrfach",
  "designlab.showcase.component.upload.sections.evidence.badge.evidence":
    "nachweis",
  "designlab.showcase.component.upload.sections.evidence.panelControlled":
    "Gesteuerter Upload",
  "designlab.showcase.component.upload.sections.evidence.controlled.label":
    "Evidenzpaket",
  "designlab.showcase.component.upload.sections.evidence.controlled.description":
    "Release- und Freigabenachweise an einer Stelle sammeln.",
  "designlab.showcase.component.upload.sections.evidence.controlled.hint":
    "PDF, XLSX und ZIP werden unterstuetzt.",
  "designlab.showcase.component.upload.sections.evidence.panelSummary":
    "Payload-Zusammenfassung",
  "designlab.showcase.component.upload.sections.evidence.summary.label":
    "Dateien",
  "designlab.showcase.component.upload.sections.states.eyebrow":
    "Alternative 02",
  "designlab.showcase.component.upload.sections.states.title":
    "Validierungs- und Zugriffszustaende",
  "designlab.showcase.component.upload.sections.states.description":
    "Schreibgeschuetzte, deaktivierte und durch Policy blockierte Upload-Verhalten in getrennten Panels.",
  "designlab.showcase.component.upload.sections.states.badge.readonly":
    "readonly",
  "designlab.showcase.component.upload.sections.states.badge.disabled":
    "deaktiviert",
  "designlab.showcase.component.upload.sections.states.badge.invalid":
    "ungueltig",
  "designlab.showcase.component.upload.sections.states.panelReadonly":
    "Schreibgeschuetzt",
  "designlab.showcase.component.upload.sections.states.panelDisabled":
    "Deaktiviert",
  "designlab.showcase.component.upload.sections.states.panelInvalid":
    "Ungueltig",
  "designlab.showcase.component.upload.sections.states.readonlyLabel":
    "Schreibgeschuetzter Upload",
  "designlab.showcase.component.upload.sections.states.disabledLabel":
    "Deaktivierter Upload",
  "designlab.showcase.component.upload.sections.states.invalidLabel":
    "Nachweis fehlt",
  "designlab.showcase.component.upload.sections.states.invalidError":
    "Mindestens eine signierte PDF muss hochgeladen werden.",
  "designlab.showcase.component.commandPalette.sections.launcher.eyebrow":
    "Alternative 01",
  "designlab.showcase.component.commandPalette.sections.launcher.title":
    "Globaler Launcher / Routenwechsler",
  "designlab.showcase.component.commandPalette.sections.launcher.description":
    "Primaere Command-Palette-Erfahrung, die Routen und operative Aktionen in einem Dialog vereint.",
  "designlab.showcase.component.commandPalette.sections.launcher.badge.launcher":
    "launcher",
  "designlab.showcase.component.commandPalette.sections.launcher.badge.dialog":
    "dialog",
  "designlab.showcase.component.commandPalette.sections.launcher.badge.navigate":
    "navigieren",
  "designlab.showcase.component.commandPalette.sections.launcher.panelOpenState":
    "Palette offen",
  "designlab.showcase.component.commandPalette.sections.launcher.openButton":
    "Command Palette oeffnen",
  "designlab.showcase.component.commandPalette.sections.launcher.paletteTitle":
    "UI-Kommandozentrale",
  "designlab.showcase.component.commandPalette.sections.launcher.paletteSubtitle":
    "Navigation, Release-Review und AI-gestuetzte Aktionen leben in derselben Palette.",
  "designlab.showcase.component.commandPalette.sections.launcher.panelSelected":
    "Ausgewaehlter Befehl",
  "designlab.showcase.component.commandPalette.sections.launcher.selected.label":
    "Auswahl",
  "designlab.showcase.component.commandPalette.sections.launcher.selected.empty":
    "Noch keine Auswahl",
  "designlab.showcase.component.commandPalette.sections.launcher.selected.note":
    "Die Palette-Auswahl steuert Route oder Aktionszustand.",
  "designlab.showcase.component.commandPalette.sections.readonly.eyebrow":
    "Alternative 02",
  "designlab.showcase.component.commandPalette.sections.readonly.title":
    "Readonly-Browse-Modus",
  "designlab.showcase.component.commandPalette.sections.readonly.description":
    "Benutzer mit eingeschraenktem Zugriff sehen Befehle, koennen sie aber nicht ausfuehren; dieselbe Komponente bewahrt diese Unterscheidung.",
  "designlab.showcase.component.commandPalette.sections.readonly.badge.readonly":
    "readonly",
  "designlab.showcase.component.commandPalette.sections.readonly.badge.governed":
    "governed",
  "designlab.showcase.component.commandPalette.sections.readonly.badge.browse":
    "browse",
  "designlab.showcase.component.commandPalette.sections.readonly.panelContract":
    "Readonly-Palette-Vertrag",
  "designlab.showcase.component.commandPalette.sections.readonly.chipReadonly":
    "readonly",
  "designlab.showcase.component.commandPalette.sections.readonly.chipDiscoverability":
    "auffindbarkeit",
  "designlab.showcase.component.commandPalette.sections.readonly.chipNoExecution":
    "keine ausfuehrung",
  "designlab.showcase.component.commandPalette.sections.readonly.body":
    "Im Readonly-Modus sieht der Nutzer Befehlsnamen, Gruppeninformationen und Shortcuts; es wird keine Aktion ausgeloest.",
  "designlab.showcase.component.commandPalette.sections.readonly.panelNote":
    "Vertragsnotiz",
  "designlab.showcase.component.commandPalette.sections.readonly.noteTitle":
    "Governance-Vertrag",
  "designlab.showcase.component.commandPalette.sections.readonly.note.accessLabel":
    "Zugriff",
  "designlab.showcase.component.commandPalette.sections.readonly.note.accessValue":
    "readonly",
  "designlab.showcase.component.commandPalette.sections.readonly.note.focusLabel":
    "Fokus",
  "designlab.showcase.component.commandPalette.sections.readonly.note.focusValue":
    "auffindbarkeit + sicherheit",
  "designlab.showcase.component.commandPalette.sections.readonly.note.uxLabel":
    "UX-Anker",
  "designlab.showcase.component.commandPalette.sections.readonly.note.uxValue":
    "guided_navigation_assistance",
  "designlab.showcase.component.commandPalette.sections.scope.eyebrow":
    "Alternative 03",
  "designlab.showcase.component.commandPalette.sections.scope.title":
    "Freigabe-spezifischer Befehlsumfang",
  "designlab.showcase.component.commandPalette.sections.scope.description":
    "AI- und Freigabefluesse werden mit Scope-Badges in derselben Palette gruppiert.",
  "designlab.showcase.component.commandPalette.sections.scope.badge.approval":
    "freigabe",
  "designlab.showcase.component.commandPalette.sections.scope.badge.aiAssist":
    "ki-assistenz",
  "designlab.showcase.component.commandPalette.sections.scope.badge.scope":
    "umfang",
  "designlab.showcase.component.commandPalette.sections.scope.panelCommands":
    "Befehle im Umfang",
  "designlab.showcase.component.commandPalette.sections.scope.chipAiAssist":
    "KI-Assistenz",
  "designlab.showcase.component.commandPalette.sections.scope.chipGovernance":
    "Regelwerk",
  "designlab.showcase.component.commandPalette.sections.scope.generalGroup":
    "Allgemein",
  "designlab.showcase.component.commandPalette.sections.scope.panelSummary":
    "Umfangszusammenfassung",
  "designlab.showcase.component.commandPalette.sections.scope.chipApprovalQueue":
    "Freigabe-Warteschlange",
  "designlab.showcase.component.pageHeader.live.eyebrow": "Seiten-Shell",
  "designlab.showcase.component.pageHeader.live.title": "Komponentenbibliothek",
  "designlab.showcase.component.pageHeader.live.description":
    "Vereint Katalog-, Release- und Qualitaetsinformationen in einer einzigen PageHeader-Shell.",
  "designlab.showcase.component.pageHeader.live.status": "Stabile Shell",
  "designlab.showcase.component.pageHeader.live.action.notes":
    "Release-Notizen",
  "designlab.showcase.component.pageHeader.live.action.publish":
    "Veroeffentlichen",
  "designlab.showcase.component.pageHeader.live.aside":
    "Letzte Doctor-Evidenz: PASS",
  "designlab.showcase.component.detailDrawer.live.open": "Details oeffnen",
  "designlab.showcase.component.detailDrawer.live.title": "Datensatzdetail",
  "designlab.showcase.component.detailDrawer.live.sections.summary.title":
    "Zusammenfassung",
  "designlab.showcase.component.detailDrawer.live.sections.summary.description":
    "Beispiel fuer einen Drawer-Bereich",
  "designlab.showcase.component.detailDrawer.live.sections.summary.content":
    "Kurzer Detailinhalt.",
  "designlab.showcase.component.detailDrawer.live.sections.audit.title":
    "Audit",
  "designlab.showcase.component.detailDrawer.live.sections.audit.description":
    "Metadatenblock",
  "designlab.showcase.component.detailDrawer.live.sections.audit.content":
    "Aktualisiert 2026-03-06",
  "designlab.showcase.component.popover.live.title": "Policy-Hinweis",
  "designlab.showcase.component.popover.live.open": "Popover oeffnen",
  "designlab.showcase.component.popover.live.description":
    "Ein Popover eignet sich, wenn der Kontext kurz, aber inhaltlich reich ist. Dieses Panel liefert Entscheidungshilfe, ohne die Route zu wechseln.",
  "designlab.showcase.component.popover.live.badge.policy": "richtlinie",
  "designlab.showcase.component.popover.live.badge.readonly":
    "schreibgeschuetzt",
  "designlab.showcase.component.contextMenu.live.trigger.panel":
    "Aktions-Trigger",
  "designlab.showcase.component.contextMenu.live.trigger.button": "Kontextmenu",
  "designlab.showcase.component.contextMenu.live.trigger.title":
    "Release-Aktionen",
  "designlab.showcase.component.contextMenu.live.trigger.items.approve.label":
    "Freigabefluss starten",
  "designlab.showcase.component.contextMenu.live.trigger.items.approve.description":
    "Menschliche Freigabe und Wave-Gate-Evidenz gemeinsam sammeln.",
  "designlab.showcase.component.contextMenu.live.trigger.items.review.label":
    "Zur Review-Warteschlange hinzufuegen",
  "designlab.showcase.component.contextMenu.live.trigger.items.review.description":
    "Readonly-Review und zusaetzliche Evidenzanforderungen erzeugen.",
  "designlab.showcase.component.contextMenu.live.trigger.items.archive.label":
    "Ins Archiv verschieben",
  "designlab.showcase.component.contextMenu.live.trigger.items.archive.description":
    "Veraltete Varianten in den geplanten Backlog-Bereich verschieben.",
  "designlab.showcase.component.contextMenu.live.trigger.lastSelection":
    "Letzte Auswahl:",
  "designlab.showcase.component.contextMenu.live.surface.panel":
    "Rechtsklick-Flaeche",
  "designlab.showcase.component.contextMenu.live.surface.title":
    "Flaechenaktionen",
  "designlab.showcase.component.contextMenu.live.surface.items.duplicate.label":
    "Karte duplizieren",
  "designlab.showcase.component.contextMenu.live.surface.items.pin.label":
    "Diese Ansicht anheften",
  "designlab.showcase.component.contextMenu.live.surface.items.readonly.label":
    "Readonly-Grund anzeigen",
  "designlab.showcase.component.contextMenu.live.surface.items.readonly.description":
    "Das Kontextmenu wird ebenfalls vom Policy-Guard begrenzt.",
  "designlab.showcase.component.contextMenu.live.surface.triggerTitle":
    "Rechtsklick",
  "designlab.showcase.component.contextMenu.live.surface.description":
    "Derselbe Vertrag funktioniert auch auf Rechtsklick-Flaechen. Menues sollten kurze Aktionslisten bleiben und keine Navigationsbaeume werden.",
  "designlab.showcase.component.tourCoachmarks.live.guided.panel":
    "Gefuehrte Einfuehrung",
  "designlab.showcase.component.tourCoachmarks.live.guided.open":
    "Tour starten",
  "designlab.showcase.component.tourCoachmarks.live.guided.status.finished":
    "abgeschlossen",
  "designlab.showcase.component.tourCoachmarks.live.guided.status.guided":
    "gefuehrt",
  "designlab.showcase.component.tourCoachmarks.live.guided.status.idle":
    "inaktiv",
  "designlab.showcase.component.tourCoachmarks.live.guided.steps.scope.title":
    "Scope-Validierung",
  "designlab.showcase.component.tourCoachmarks.live.guided.steps.scope.description":
    "Wave- und Registry-Vertraege werden zuerst geklaert, damit sichtbar ist, was veroeffentlicht wird.",
  "designlab.showcase.component.tourCoachmarks.live.guided.steps.preview.title":
    "Live-Demo-Review",
  "designlab.showcase.component.tourCoachmarks.live.guided.steps.preview.description":
    "Preview-, API- und Quality-Evidenz werden in derselben Tour erklaert.",
  "designlab.showcase.component.tourCoachmarks.live.guided.steps.release.title":
    "Release-Evidenz",
  "designlab.showcase.component.tourCoachmarks.live.guided.steps.release.description":
    "Die Tour gilt erst als abgeschlossen, wenn Doctor-, Gate- und Security-Guardrail-Evidenz vorliegt.",
  "designlab.showcase.component.tourCoachmarks.live.readonly.panel":
    "Readonly-Compliance-Tour",
  "designlab.showcase.component.tourCoachmarks.live.readonly.steps.policy.title":
    "Policy-Erklaerung",
  "designlab.showcase.component.tourCoachmarks.live.readonly.steps.policy.description":
    "Readonly-Touren tragen Ursache-Wirkung-Kontext fuer kritische Bereiche im selben Overlay.",
  "designlab.showcase.component.tourCoachmarks.live.readonly.steps.controls.title":
    "Kontrollpunkte",
  "designlab.showcase.component.tourCoachmarks.live.readonly.steps.controls.description":
    "Release-Schaltflaechen sollten erst sichtbar bleiben, wenn Freigabe und Sicherheitskontrollen abgeschlossen sind.",
  "designlab.showcase.component.pageHeader.sections.release.eyebrow":
    "Alternative 01",
  "designlab.showcase.component.pageHeader.sections.release.title":
    "Release- und Docs-Header",
  "designlab.showcase.component.pageHeader.sections.release.description":
    "Fuehrt Eyebrow, Titel, Status, Meta und Schnellaktionen auf einer einzigen Kopfzeile zusammen.",
  "designlab.showcase.component.pageHeader.sections.release.badge.header":
    "kopfzeile",
  "designlab.showcase.component.pageHeader.sections.release.badge.beta": "beta",
  "designlab.showcase.component.pageHeader.sections.release.badge.hero":
    "hero-bereich",
  "designlab.showcase.component.pageHeader.sections.release.panelPrimary":
    "Primaerer Header",
  "designlab.showcase.component.pageHeader.sections.release.header.eyebrow":
    "UI-Bibliothek",
  "designlab.showcase.component.pageHeader.sections.release.header.title":
    "Page-Block-Rollout",
  "designlab.showcase.component.pageHeader.sections.release.header.description":
    "Die Release- und Docs-Flaeche fuer die neue Blockfamilie auf Seitenebene wird mit demselben Header-Primitive aufgebaut.",
  "designlab.showcase.component.pageHeader.sections.release.header.status":
    "Bereit",
  "designlab.showcase.component.pageHeader.sections.release.header.action.share":
    "Teilen",
  "designlab.showcase.component.pageHeader.sections.release.header.action.promote":
    "Hochstufen",
  "designlab.showcase.component.pageHeader.sections.release.header.aside.label":
    "Diagnose",
  "designlab.showcase.component.pageHeader.sections.release.header.aside.value":
    "PASS",
  "designlab.showcase.component.pageHeader.sections.release.header.aside.note":
    "ui-library-Vorgabe",
  "designlab.showcase.component.pageHeader.sections.release.panelGuideline":
    "Leitlinie",
  "designlab.showcase.component.pageHeader.sections.release.guideline":
    "`PageHeader` sammelt den Hero-Bereich einer Route in einem einzigen Primitive. So muessen keine seitenbezogenen Header fuer Meta-Chips, Status-Badges und Aside-Metriken mehr gebaut werden.",
  "designlab.showcase.component.pageHeader.sections.compact.eyebrow":
    "Alternative 02",
  "designlab.showcase.component.pageHeader.sections.compact.title":
    "Kompakter Detail-Header",
  "designlab.showcase.component.pageHeader.sections.compact.description":
    "Kompakte Header-Nutzung fuer dichtere Detailseiten.",
  "designlab.showcase.component.pageHeader.sections.compact.badge.compact":
    "kompakt",
  "designlab.showcase.component.pageHeader.sections.compact.badge.detail":
    "detailansicht",
  "designlab.showcase.component.pageHeader.sections.compact.badge.meta":
    "metadaten",
  "designlab.showcase.component.pageHeader.sections.compact.panelMode":
    "Kompaktmodus",
  "designlab.showcase.component.pageHeader.sections.compact.header.eyebrow":
    "DETAILANSICHT",
  "designlab.showcase.component.pageHeader.sections.compact.header.title":
    "Entitaetszusammenfassung",
  "designlab.showcase.component.pageHeader.sections.compact.header.description":
    "Eine kuerzere Header-Flaeche fuer Komponentendetails.",
  "designlab.showcase.component.pageHeader.sections.compact.header.status":
    "Beta",
  "designlab.showcase.component.pageHeader.sections.compact.panelContract":
    "Vertragshinweis",
  "designlab.showcase.component.pageHeader.sections.compact.contract.title":
    "Header-Vertrag",
  "designlab.showcase.component.pageHeader.sections.compact.contract.eyebrow.label":
    "Eyebrow",
  "designlab.showcase.component.pageHeader.sections.compact.contract.eyebrow.value":
    "optional",
  "designlab.showcase.component.pageHeader.sections.compact.contract.meta.label":
    "Metadaten",
  "designlab.showcase.component.pageHeader.sections.compact.contract.meta.value":
    "Chips / Kennzeichen",
  "designlab.showcase.component.pageHeader.sections.compact.contract.aside.label":
    "Seitenbereich",
  "designlab.showcase.component.pageHeader.sections.compact.contract.aside.value":
    "Metrik oder Helfer",
  "designlab.showcase.component.pageLayout.live.title": "Benutzerverzeichnis",
  "designlab.showcase.component.pageLayout.live.description":
    "Beispiel fur eine Layout-Komposition auf Routenebene",
  "designlab.showcase.component.pageLayout.live.breadcrumb.admin":
    "Administration",
  "designlab.showcase.component.pageLayout.live.breadcrumb.users": "Benutzer",
  "designlab.showcase.component.pageLayout.live.action": "Neuer Eintrag",
  "designlab.showcase.component.pageLayout.live.filterSlot": "Filterbereich",
  "designlab.showcase.component.pageLayout.live.detail": "Detailpanel",
  "designlab.showcase.component.pageLayout.live.content": "Hauptinhalt",
  "designlab.showcase.component.filterBar.live.search": "Suche",
  "designlab.showcase.component.filterBar.live.status": "Status",
  "designlab.showcase.component.reportFilterPanel.live.dateRange":
    "Datumsbereich",
  "designlab.showcase.component.reportFilterPanel.live.owner": "Verantwortlich",
  "designlab.showcase.component.reportFilterPanel.live.statusLabel":
    "Status: {value}",
  "designlab.showcase.component.pageLayout.sections.directory.eyebrow":
    "Variante 01",
  "designlab.showcase.component.pageLayout.sections.directory.title":
    "Verzeichnis-Shell",
  "designlab.showcase.component.pageLayout.sections.directory.description":
    "Fuhrt Breadcrumb, Seitenkopf, Filter-Shell und Detailleiste in demselben Seitenvertrag zusammen.",
  "designlab.showcase.component.pageLayout.sections.directory.badge.pageShell":
    "seiten-shell",
  "designlab.showcase.component.pageLayout.sections.directory.badge.stable":
    "stabil",
  "designlab.showcase.component.pageLayout.sections.directory.badge.directory":
    "verzeichnis",
  "designlab.showcase.component.pageLayout.sections.directory.panelDirectory":
    "Verzeichnis-Shell",
  "designlab.showcase.component.pageLayout.sections.directory.shell.title":
    "UI-Governance-Katalog",
  "designlab.showcase.component.pageLayout.sections.directory.shell.description":
    "Page Shell, Header und Filterverhalten werden uber einen einzigen Layout-Vertrag wiederverwendet.",
  "designlab.showcase.component.pageLayout.sections.directory.breadcrumb.docs":
    "Doku",
  "designlab.showcase.component.pageLayout.sections.directory.breadcrumb.library":
    "UI-Bibliothek",
  "designlab.showcase.component.pageLayout.sections.directory.breadcrumb.pageBlocks":
    "Seitenbausteine",
  "designlab.showcase.component.pageLayout.sections.directory.headerExtra":
    "stabiles Fundament",
  "designlab.showcase.component.pageLayout.sections.directory.actions.export":
    "Exportieren",
  "designlab.showcase.component.pageLayout.sections.directory.actions.newBlock":
    "Neuer Block",
  "designlab.showcase.component.pageLayout.sections.directory.savedViewState":
    "Gespeicherte Page-Block-Ansicht",
  "designlab.showcase.component.pageLayout.sections.directory.filter.search":
    "Suche",
  "designlab.showcase.component.pageLayout.sections.directory.filter.status":
    "Status",
  "designlab.showcase.component.pageLayout.sections.directory.options.comfortable":
    "Komfortabel",
  "designlab.showcase.component.pageLayout.sections.directory.options.compact":
    "Kompakt",
  "designlab.showcase.component.pageLayout.sections.directory.options.readonly":
    "Schreibgeschuetzt",
  "designlab.showcase.component.pageLayout.sections.directory.detail.title":
    "Detailleiste",
  "designlab.showcase.component.pageLayout.sections.directory.detail.description":
    "Das Verhaltnis zwischen Layout, Detailleiste und Hauptbereich bleibt in derselben Shell erhalten.",
  "designlab.showcase.component.pageLayout.sections.directory.detail.metric.label":
    "Auswahl",
  "designlab.showcase.component.pageLayout.sections.directory.detail.metric.note":
    "Status der Aktionsleiste",
  "designlab.showcase.component.pageLayout.sections.directory.summary.title":
    "Release-Zusammenfassung",
  "designlab.showcase.component.pageLayout.sections.directory.summary.description":
    "Hebt die wichtigsten Kennzahlen gemeinsam mit der Seiten-Shell hervor.",
  "designlab.showcase.component.pageLayout.sections.directory.contract.title":
    "Shell-Vertrag",
  "designlab.showcase.component.pageLayout.sections.directory.contract.description":
    "Dasselbe Layout kann sowohl auf Drawer- als auch auf Detailseiten wiederverwendet werden.",
  "designlab.showcase.component.pageLayout.sections.directory.panelContract":
    "Vertragsnotiz",
  "designlab.showcase.component.pageLayout.sections.directory.contractNote":
    "`PageLayout` kombiniert Breadcrumb, Aktionsleiste, Filter-Shell und Detailleiste auf Routenebene und entfernt seitenbezogene Shell-Duplikate.",
  "designlab.showcase.component.pageLayout.sections.detail.eyebrow":
    "Variante 02",
  "designlab.showcase.component.pageLayout.sections.detail.title":
    "Detail-Review-Shell",
  "designlab.showcase.component.pageLayout.sections.detail.description":
    "Dasselbe Layout lasst sich mit einer dichteren Leiste und Fusszeile auf detailfokussierten Seiten verwenden.",
  "designlab.showcase.component.pageLayout.sections.detail.badge.detail":
    "detail",
  "designlab.showcase.component.pageLayout.sections.detail.badge.aside":
    "seitenleiste",
  "designlab.showcase.component.pageLayout.sections.detail.badge.review":
    "pruefung",
  "designlab.showcase.component.pageLayout.sections.detail.panelCompact":
    "Kompaktes Detail",
  "designlab.showcase.component.pageLayout.sections.detail.shell.title":
    "Aenderungsprufung",
  "designlab.showcase.component.pageLayout.sections.detail.shell.description":
    "Pruefung im Nur-Lesen-Modus sowie Freigeben/Ablehnen bleiben innerhalb derselben Seitenshell.",
  "designlab.showcase.component.pageLayout.sections.detail.breadcrumb.releases":
    "Veröffentlichungen",
  "designlab.showcase.component.pageLayout.sections.detail.breadcrumb.wave":
    "Welle 7",
  "designlab.showcase.component.pageLayout.sections.detail.breadcrumb.review":
    "Prufung",
  "designlab.showcase.component.pageLayout.sections.detail.actions.approve":
    "Freigeben",
  "designlab.showcase.component.pageLayout.sections.detail.decision.title":
    "Entscheidung",
  "designlab.showcase.component.pageLayout.sections.detail.decision.risk.label":
    "Risiko",
  "designlab.showcase.component.pageLayout.sections.detail.decision.risk.value":
    "Niedrig",
  "designlab.showcase.component.pageLayout.sections.detail.decision.owner.label":
    "Verantwortlich",
  "designlab.showcase.component.pageLayout.sections.detail.decision.owner.value":
    "Platform UI",
  "designlab.showcase.component.pageLayout.sections.detail.footer":
    "Die Footer-Leiste bleibt innerhalb desselben Shell-Vertrags.",
  "designlab.showcase.component.pageLayout.sections.detail.entity.title":
    "Seitenbausteine fuer Welle 7",
  "designlab.showcase.component.pageLayout.sections.detail.entity.subtitle":
    "Zusammenfassung fur den Rollout wiederverwendbarer Shells auf Seitenebene.",
  "designlab.showcase.component.pageLayout.sections.detail.entity.badge":
    "Bereit",
  "designlab.showcase.component.pageLayout.sections.detail.panelUsage":
    "Nutzungshinweis",
  "designlab.showcase.component.pageLayout.sections.detail.usageNote":
    "Dasselbe Layout funktioniert sowohl fuer Verzeichnis- als auch fuer Detail- und Pruefseiten; nur Inhalt und Callbacks aendern sich.",
  "designlab.showcase.component.filterBar.sections.toolbar.eyebrow":
    "Variante 01",
  "designlab.showcase.component.filterBar.sections.toolbar.title":
    "Toolbar-Rahmen",
  "designlab.showcase.component.filterBar.sections.toolbar.description":
    "Sammelt Suche, Filter und Aktionen zum Speichern von Ansichten auf einer gemeinsamen Toolbar-Flaeche.",
  "designlab.showcase.component.filterBar.sections.toolbar.badge.filters":
    "filter",
  "designlab.showcase.component.filterBar.sections.toolbar.badge.stable":
    "stabil",
  "designlab.showcase.component.filterBar.sections.toolbar.badge.toolbar":
    "werkzeugleiste",
  "designlab.showcase.component.filterBar.sections.toolbar.panelControlled":
    "Gesteuerte Toolbar",
  "designlab.showcase.component.filterBar.sections.toolbar.savedViewState":
    "Gespeicherte Toolbar-Ansicht",
  "designlab.showcase.component.filterBar.sections.toolbar.extraLabel":
    "gemeinsame-toolbar",
  "designlab.showcase.component.filterBar.sections.toolbar.fields.search":
    "Suche",
  "designlab.showcase.component.filterBar.sections.toolbar.fields.density":
    "Dichte",
  "designlab.showcase.component.filterBar.sections.toolbar.fields.activeOnly":
    "Nur aktiv",
  "designlab.showcase.component.filterBar.sections.toolbar.options.comfortable":
    "Komfortabel",
  "designlab.showcase.component.filterBar.sections.toolbar.options.compact":
    "Kompakt",
  "designlab.showcase.component.filterBar.sections.toolbar.panelState":
    "Gemeinsamer Status",
  "designlab.showcase.component.filterBar.sections.toolbar.metric.label":
    "Status der Toolbar",
  "designlab.showcase.component.filterBar.sections.toolbar.metric.note":
    "Zuruecksetzen und Ansicht speichern werden ueber denselben Rahmen verwaltet.",
  "designlab.showcase.component.filterBar.sections.readonly.eyebrow":
    "Alternative 02",
  "designlab.showcase.component.filterBar.sections.readonly.title":
    "Nur-Lesen- und Richtlinienzustande",
  "designlab.showcase.component.filterBar.sections.readonly.description":
    "Toolbar-Zustaende im Nur-Lesen-Modus oder mit Richtliniensperre bleiben innerhalb derselben Komponente.",
  "designlab.showcase.component.filterBar.sections.readonly.badge.readonly":
    "nur-lesen",
  "designlab.showcase.component.filterBar.sections.readonly.badge.policy":
    "richtlinie",
  "designlab.showcase.component.filterBar.sections.readonly.badge.state":
    "status",
  "designlab.showcase.component.filterBar.sections.readonly.panelReadonly":
    "Toolbar im Nur-Lesen-Modus",
  "designlab.showcase.component.filterBar.sections.readonly.fields.search":
    "Suche im Nur-Lesen-Modus",
  "designlab.showcase.component.filterBar.sections.readonly.fields.scope":
    "Bereich",
  "designlab.showcase.component.filterBar.sections.readonly.options.shared":
    "Geteilt",
  "designlab.showcase.component.filterBar.sections.readonly.panelGuideline":
    "Leitlinie",
  "designlab.showcase.component.filterBar.sections.readonly.guideline":
    "Die Filter-Shell klont keine seitenbezogenen Toolbars; nur Felder und Callbacks werden bereitgestellt.",
  "designlab.showcase.component.reportFilterPanel.sections.submit.eyebrow":
    "Variante 01",
  "designlab.showcase.component.reportFilterPanel.sections.submit.title":
    "Panel fuer den Sendeablauf",
  "designlab.showcase.component.reportFilterPanel.sections.submit.description":
    "Fuehrt mehrfeldrige Berichtsfilter und Aktionen in einem gemeinsamen Panel-Vertrag zusammen.",
  "designlab.showcase.component.reportFilterPanel.sections.submit.badge.panel":
    "panel",
  "designlab.showcase.component.reportFilterPanel.sections.submit.badge.submit":
    "senden",
  "designlab.showcase.component.reportFilterPanel.sections.submit.badge.stable":
    "stabil",
  "designlab.showcase.component.reportFilterPanel.sections.submit.panelInteractive":
    "Interaktives Panel",
  "designlab.showcase.component.reportFilterPanel.sections.submit.fields.search":
    "Suche",
  "designlab.showcase.component.reportFilterPanel.sections.submit.fields.status":
    "Status",
  "designlab.showcase.component.reportFilterPanel.sections.submit.fields.startDate":
    "Startdatum",
  "designlab.showcase.component.reportFilterPanel.sections.submit.options.comfortable":
    "Komfortabel",
  "designlab.showcase.component.reportFilterPanel.sections.submit.options.compact":
    "Kompakt",
  "designlab.showcase.component.reportFilterPanel.sections.submit.panelState":
    "Panel-Status",
  "designlab.showcase.component.reportFilterPanel.sections.submit.metric.label":
    "Status",
  "designlab.showcase.component.reportFilterPanel.sections.submit.metric.note":
    "Sende- und Zuruecksetzen-Verhalten werden ueber dasselbe Panel verwaltet.",
  "designlab.showcase.component.reportFilterPanel.sections.readonly.eyebrow":
    "Alternative 02",
  "designlab.showcase.component.reportFilterPanel.sections.readonly.title":
    "Richtlinienpanel im Nur-Lesen-Modus",
  "designlab.showcase.component.reportFilterPanel.sections.readonly.description":
    "Szenarien im Nur-Lesen-Modus oder mit Richtliniensperre halten Informationen sichtbar, waehrend Senden deaktiviert bleibt.",
  "designlab.showcase.component.reportFilterPanel.sections.readonly.badge.readonly":
    "nur-lesen",
  "designlab.showcase.component.reportFilterPanel.sections.readonly.badge.policy":
    "richtlinie",
  "designlab.showcase.component.reportFilterPanel.sections.readonly.badge.governed":
    "gesteuert",
  "designlab.showcase.component.reportFilterPanel.sections.readonly.panelReadonly":
    "Panel im Nur-Lesen-Modus",
  "designlab.showcase.component.reportFilterPanel.sections.readonly.fields.search":
    "Suche im Nur-Lesen-Modus",
  "designlab.showcase.component.reportFilterPanel.sections.readonly.fields.searchValue":
    "wochentliche pruefung",
  "designlab.showcase.component.reportFilterPanel.sections.readonly.fields.date":
    "Datum",
  "designlab.showcase.component.reportFilterPanel.sections.readonly.panelGuideline":
    "Leitlinie",
  "designlab.showcase.component.reportFilterPanel.sections.readonly.rule.title":
    "Panel-Regel",
  "designlab.showcase.component.reportFilterPanel.sections.readonly.rule.submit.label":
    "Senden",
  "designlab.showcase.component.reportFilterPanel.sections.readonly.rule.submit.value":
    "nur bei vollem Zugriff",
  "designlab.showcase.component.reportFilterPanel.sections.readonly.rule.reset.label":
    "Zurucksetzen",
  "designlab.showcase.component.reportFilterPanel.sections.readonly.rule.reset.value":
    "readonly-aware",
  "designlab.showcase.component.reportFilterPanel.sections.readonly.rule.scope.label":
    "Anwendungsfall",
  "designlab.showcase.component.reportFilterPanel.sections.readonly.rule.scope.value":
    "Berichtsseiten",
  "designlab.showcase.component.detailDrawer.sections.tabbed.eyebrow":
    "Alternative 01",
  "designlab.showcase.component.detailDrawer.sections.tabbed.title":
    "Pruef-Drawer mit Tabs",
  "designlab.showcase.component.detailDrawer.sections.tabbed.description":
    "Zeigt Detail-, Audit- und Rollout-Zusammenfassung in derselben Slide-over-Flaeche mit Tabs.",
  "designlab.showcase.component.detailDrawer.sections.tabbed.badge.drawer":
    "drawer",
  "designlab.showcase.component.detailDrawer.sections.tabbed.badge.stable":
    "stabil",
  "designlab.showcase.component.detailDrawer.sections.tabbed.badge.review":
    "pruefung",
  "designlab.showcase.component.detailDrawer.sections.tabbed.panelReview":
    "Detail-Review-Panel",
  "designlab.showcase.component.detailDrawer.sections.tabbed.open":
    "Detail-Drawer",
  "designlab.showcase.component.detailDrawer.sections.tabbed.badgeTabbed":
    "tabbed",
  "designlab.showcase.component.detailDrawer.sections.tabbed.drawerTitle":
    "Rollout-Detail",
  "designlab.showcase.component.detailDrawer.sections.tabbed.tabs.summary.label":
    "Zusammenfassung",
  "designlab.showcase.component.detailDrawer.sections.tabbed.tabs.summary.ownerLabel":
    "Verantwortlich",
  "designlab.showcase.component.detailDrawer.sections.tabbed.tabs.summary.ownerValue":
    "Plattformbetrieb",
  "designlab.showcase.component.detailDrawer.sections.tabbed.tabs.summary.scopeLabel":
    "Scope",
  "designlab.showcase.component.detailDrawer.sections.tabbed.tabs.summary.scopeValue":
    "TR + EU Rollout",
  "designlab.showcase.component.detailDrawer.sections.tabbed.tabs.audit.label":
    "Pruefung",
  "designlab.showcase.component.detailDrawer.sections.tabbed.tabs.audit.approvalLabel":
    "Freigabe",
  "designlab.showcase.component.detailDrawer.sections.tabbed.tabs.audit.approvalValue":
    "07 Mar 2026 / freigegeben",
  "designlab.showcase.component.detailDrawer.sections.tabbed.tabs.audit.traceLabel":
    "Trace",
  "designlab.showcase.component.detailDrawer.sections.tabbed.tabs.audit.traceValue":
    "trace-id: overlay-4471",
  "designlab.showcase.component.detailDrawer.sections.tabbed.panelGuideline":
    "Leitlinie",
  "designlab.showcase.component.detailDrawer.sections.tabbed.guideline":
    "DetailDrawer eignet sich, um Detail-, Audit- und Zusammenfassungsinhalte zu zeigen, ohne die Route zu verlassen. Bevorzuge Drawer, wenn die Inhaltsdichte ueber die eines Modals hinausgeht.",
  "designlab.showcase.component.detailDrawer.sections.readonly.eyebrow":
    "Alternative 02",
  "designlab.showcase.component.detailDrawer.sections.readonly.title":
    "Readonly-Evidence-Drawer",
  "designlab.showcase.component.detailDrawer.sections.readonly.description":
    "Sammelt Evidenz- und Zusammenfassungsbloecke in einer tablosen, aber geordneten Review-Flaeche.",
  "designlab.showcase.component.detailDrawer.sections.readonly.badge.readonly":
    "schreibgeschuetzt",
  "designlab.showcase.component.detailDrawer.sections.readonly.badge.evidence":
    "evidence",
  "designlab.showcase.component.detailDrawer.sections.readonly.badge.summary":
    "summary",
  "designlab.showcase.component.detailDrawer.sections.readonly.panelEvidence":
    "Evidenz-Zusammenfassung",
  "designlab.showcase.component.detailDrawer.sections.readonly.card.title":
    "Deployment-Evidenz",
  "designlab.showcase.component.detailDrawer.sections.readonly.card.body":
    "Ein Detail-Drawer kann auch als einzelne Zusammenfassungsflaeche funktionieren. Das ist besonders wirksam fuer readonly Evidenz- und Snapshot-Reviews.",
  "designlab.showcase.component.detailDrawer.sections.readonly.panelRule":
    "Faustregel",
  "designlab.showcase.component.detailDrawer.sections.readonly.rule":
    "Wenn der Inhalt zu lang wird, nutze Bereiche oder Tabs im Drawer; wenn die Review kurz und passiv ist, reicht eine tablose Zusammenfassung.",
  "designlab.showcase.component.popover.sections.rich.eyebrow":
    "Alternative 01",
  "designlab.showcase.component.popover.sections.rich.title":
    "Reichhaltige Kontext-Hilfe",
  "designlab.showcase.component.popover.sections.rich.description":
    "Zeigt kontextuelle Informationen direkt an der Stelle, wenn ein Tooltip zu kurz und ein Drawer zu schwer waere.",
  "designlab.showcase.component.popover.sections.rich.badge.popover": "popover",
  "designlab.showcase.component.popover.sections.rich.badge.beta": "beta",
  "designlab.showcase.component.popover.sections.rich.badge.guidance":
    "hinweis",
  "designlab.showcase.component.popover.sections.rich.panelHelper":
    "Kontext-Helfer",
  "designlab.showcase.component.popover.sections.rich.popoverTitle":
    "Policy-Hinweis",
  "designlab.showcase.component.popover.sections.rich.open": "Popover oeffnen",
  "designlab.showcase.component.popover.sections.rich.body":
    "Dieser Bereich kann nur bearbeitet werden, wenn das Verentlichungsfenster offen ist. Scope und Risiko werden in einem kurzen Panel erklaert.",
  "designlab.showcase.component.popover.sections.rich.tag.contextual":
    "kontextuell",
  "designlab.showcase.component.popover.sections.rich.tag.policy": "policy",
  "designlab.showcase.component.popover.sections.rich.panelGuideline":
    "Leitlinie",
  "designlab.showcase.component.popover.sections.rich.guideline":
    "Verwende Popover fuer kurze, aber reichhaltige Inhalte. Es ist kein Menue; es liefert ein Hilfepanel, zusaetzlichen Kontext oder einen kleinen Aktionscluster.",
  "designlab.showcase.component.popover.sections.readonly.eyebrow":
    "Alternative 02",
  "designlab.showcase.component.popover.sections.readonly.title":
    "Readonly-Hilfepanel",
  "designlab.showcase.component.popover.sections.readonly.description":
    "Macht Ursache-Wirkung-Informationen in readonly- und disabled-Flows sichtbarer als ein Tooltip.",
  "designlab.showcase.component.popover.sections.readonly.badge.readonly":
    "schreibgeschuetzt",
  "designlab.showcase.component.popover.sections.readonly.badge.helper":
    "helper",
  "designlab.showcase.component.popover.sections.readonly.badge.panel": "panel",
  "designlab.showcase.component.popover.sections.readonly.panelHelper":
    "Readonly-Helfer",
  "designlab.showcase.component.popover.sections.readonly.popoverTitle":
    "Grund fuer readonly",
  "designlab.showcase.component.popover.sections.readonly.open":
    "Warum deaktiviert?",
  "designlab.showcase.component.popover.sections.readonly.body":
    "Ein readonly Popover sollte nicht oeffnen; in diesem Fall sollte eine andere Oberflaeche gewaehlt werden.",
  "designlab.showcase.component.popover.sections.readonly.panelRule":
    "Faustregel",
  "designlab.showcase.component.popover.sections.readonly.rule":
    "Wenn der Nutzer nicht handeln kann, muss auch das Popover selbst dem Policy-Guard folgen; pruefe Tooltip oder Inline-Nachricht als Alternative.",
  "designlab.showcase.component.contextMenu.sections.trigger.eyebrow":
    "Alternative 01",
  "designlab.showcase.component.contextMenu.sections.trigger.title":
    "Aktionsmenu / Release-Kurzbefehle",
  "designlab.showcase.component.contextMenu.sections.trigger.description":
    "Zeigt kurze Aktionslisten zusammen mit Policy- und Review-Kontext im selben Overlay.",
  "designlab.showcase.component.contextMenu.sections.trigger.badge.overlay":
    "overlay-erweiterung",
  "designlab.showcase.component.contextMenu.sections.trigger.badge.beta":
    "beta",
  "designlab.showcase.component.contextMenu.sections.trigger.badge.actions":
    "aktionen",
  "designlab.showcase.component.contextMenu.sections.trigger.panelButton":
    "Button-Trigger",
  "designlab.showcase.component.contextMenu.sections.trigger.button":
    "Kontextmenu",
  "designlab.showcase.component.contextMenu.sections.trigger.menuTitle":
    "Release-Aktionen",
  "designlab.showcase.component.contextMenu.sections.trigger.items.approve.label":
    "Freigabefluss starten",
  "designlab.showcase.component.contextMenu.sections.trigger.items.approve.description":
    "Menschliche Freigabe und Wave-Gate-Evidenz gemeinsam sammeln.",
  "designlab.showcase.component.contextMenu.sections.trigger.items.review.label":
    "Zur Review-Warteschlange hinzufuegen",
  "designlab.showcase.component.contextMenu.sections.trigger.items.review.description":
    "Readonly-Review und zusaetzliche Evidenzanforderungen erzeugen.",
  "designlab.showcase.component.contextMenu.sections.trigger.items.archive.label":
    "Ins Archiv verschieben",
  "designlab.showcase.component.contextMenu.sections.trigger.items.archive.description":
    "Veraltete Varianten in den geplanten Backlog-Bereich verschieben.",
  "designlab.showcase.component.contextMenu.sections.trigger.lastSelection":
    "Letzte Auswahl:",
  "designlab.showcase.component.contextMenu.sections.trigger.panelGuideline":
    "Leitlinie",
  "designlab.showcase.component.contextMenu.sections.trigger.guideline":
    "Ein Kontextmenu ist weder ein mehrstufiger Baum noch ein langes Erklaerpanel. Nutze es fuer kurze kontextuelle Aktionen; waehle Popover oder Drawer, wenn tiefere Informationen noetig sind.",
  "designlab.showcase.component.contextMenu.sections.surface.eyebrow":
    "Alternative 02",
  "designlab.showcase.component.contextMenu.sections.surface.title":
    "Rechtsklick- / Flaechenmenu",
  "designlab.showcase.component.contextMenu.sections.surface.description":
    "Verwendet denselben Vertrag fuer Rechtsklick-Verhalten auf Canvas- oder Kartenflaechen.",
  "designlab.showcase.component.contextMenu.sections.surface.badge.rightClick":
    "rechtsklick",
  "designlab.showcase.component.contextMenu.sections.surface.badge.surface":
    "flaeche",
  "designlab.showcase.component.contextMenu.sections.surface.badge.policy":
    "policy",
  "designlab.showcase.component.contextMenu.sections.surface.panelSurface":
    "Flaechen-Trigger",
  "designlab.showcase.component.contextMenu.sections.surface.menuTitle":
    "Flaechenaktionen",
  "designlab.showcase.component.contextMenu.sections.surface.items.duplicate.label":
    "Karte duplizieren",
  "designlab.showcase.component.contextMenu.sections.surface.items.pin.label":
    "Ansicht anheften",
  "designlab.showcase.component.contextMenu.sections.surface.items.readonly.label":
    "Readonly-Grund anzeigen",
  "designlab.showcase.component.contextMenu.sections.surface.items.readonly.description":
    "Durch den Policy-Guard begrenzt.",
  "designlab.showcase.component.contextMenu.sections.surface.triggerTitle":
    "Rechtsklick",
  "designlab.showcase.component.contextMenu.sections.surface.body":
    "Flaechenmenues bieten schnelle Aktionen auf Zeilen, Karten oder Canvas-Bereichen. Sie sollten nicht fuer Navigationsbaeume genutzt werden.",
  "designlab.showcase.component.contextMenu.sections.surface.panelRule":
    "Faustregel",
  "designlab.showcase.component.contextMenu.sections.surface.rule":
    "Wenn ein Rechtsklick-Menu existiert, muessen dieselben Aktionen auch ueber einen barrierefreien Button-Trigger verfuegbar sein. Exklusiv fuer Mausnutzer gedachte Designs sind nicht akzeptabel.",
  "designlab.showcase.component.tourCoachmarks.sections.guided.eyebrow":
    "Alternative 01",
  "designlab.showcase.component.tourCoachmarks.sections.guided.title":
    "Gefuehrte Einfuehrung / Release-Review",
  "designlab.showcase.component.tourCoachmarks.sections.guided.description":
    "Eine gefuehrte Flaeche, die Wave-, Preview- und Release-Evidenz Schritt fuer Schritt erklaert.",
  "designlab.showcase.component.tourCoachmarks.sections.guided.badge.tour":
    "tour",
  "designlab.showcase.component.tourCoachmarks.sections.guided.badge.guided":
    "gefuehrt",
  "designlab.showcase.component.tourCoachmarks.sections.guided.badge.compliance":
    "compliance",
  "designlab.showcase.component.tourCoachmarks.sections.guided.panelWalkthrough":
    "Interaktive Einfuehrung",
  "designlab.showcase.component.tourCoachmarks.sections.guided.open":
    "Tour starten",
  "designlab.showcase.component.tourCoachmarks.sections.guided.status.finished":
    "abgeschlossen",
  "designlab.showcase.component.tourCoachmarks.sections.guided.status.guided":
    "gefuehrt",
  "designlab.showcase.component.tourCoachmarks.sections.guided.status.idle":
    "inaktiv",
  "designlab.showcase.component.tourCoachmarks.sections.guided.steps.scope.title":
    "Scope-Validierung",
  "designlab.showcase.component.tourCoachmarks.sections.guided.steps.scope.description":
    "Wave- und Registry-Vertraege werden zuerst geklaert, damit der Nutzer sieht, was veroeffentlicht wird.",
  "designlab.showcase.component.tourCoachmarks.sections.guided.steps.preview.title":
    "Live-Demo-Review",
  "designlab.showcase.component.tourCoachmarks.sections.guided.steps.preview.description":
    "Preview-, API- und Quality-Evidenz werden in derselben Einfuehrung erklaert.",
  "designlab.showcase.component.tourCoachmarks.sections.guided.steps.release.title":
    "Release-Evidenz",
  "designlab.showcase.component.tourCoachmarks.sections.guided.steps.release.description":
    "Die Einfuehrung ist erst abgeschlossen, wenn Doctor-, Gate- und Security-Guardrail-Evidenz fertig ist.",
  "designlab.showcase.component.tourCoachmarks.sections.guided.panelGuideline":
    "Leitlinie",
  "designlab.showcase.component.tourCoachmarks.sections.guided.guideline":
    "Touren und Coachmarks eignen sich nicht nur fuer Onboarding, sondern auch fuer kritische Freigabe-, Release- und Policy-Ablaufe, die Schritt-fuer-Schritt-Kontext brauchen.",
  "designlab.showcase.component.tourCoachmarks.sections.readonly.eyebrow":
    "Alternative 02",
  "designlab.showcase.component.tourCoachmarks.sections.readonly.title":
    "Readonly-Compliance-Einfuehrung",
  "designlab.showcase.component.tourCoachmarks.sections.readonly.description":
    "Traegt Readonly-Policy-Gruende und Kontrollpunkte in einer ruhigen Erzaehlung.",
  "designlab.showcase.component.tourCoachmarks.sections.readonly.badge.readonly":
    "schreibgeschuetzt",
  "designlab.showcase.component.tourCoachmarks.sections.readonly.badge.policy":
    "policy",
  "designlab.showcase.component.tourCoachmarks.sections.readonly.badge.walkthrough":
    "walkthrough",
  "designlab.showcase.component.tourCoachmarks.sections.readonly.panelTour":
    "Readonly-Tour",
  "designlab.showcase.component.tourCoachmarks.sections.readonly.steps.policy.title":
    "Policy-Erklaerung",
  "designlab.showcase.component.tourCoachmarks.sections.readonly.steps.policy.description":
    "Eine Readonly-Einfuehrung traegt Ursache-Wirkung-Informationen fuer kritische Bereiche im selben Overlay.",
  "designlab.showcase.component.tourCoachmarks.sections.readonly.steps.controls.title":
    "Kontrollpunkte",
  "designlab.showcase.component.tourCoachmarks.sections.readonly.steps.controls.description":
    "Release-Schaltflaechen sollten erst sichtbar bleiben, wenn Freigabe und Sicherheitspruefungen abgeschlossen sind.",
  "designlab.showcase.component.tourCoachmarks.sections.readonly.panelRule":
    "Faustregel",
  "designlab.showcase.component.tourCoachmarks.sections.readonly.rule":
    "Wenn die Coachmark-Flaeche sehr langen Inhalt braucht, sollte sie zu einer Docs-Seite oder Panel-Struktur werden. Touren muessen kurz, fuehrend und auf die Aufgabe fokussiert bleiben.",
  "designlab.showcase.component.textInput.sections.profile.eyebrow":
    "Alternative 01",
  "designlab.showcase.component.textInput.sections.profile.title":
    "Profil- / Kontofeld",
  "designlab.showcase.component.textInput.sections.profile.description":
    "Klassischer Produktformularfluss mit Label, Beschreibung, Hilfe und Zeichenzahler.",
  "designlab.showcase.component.textInput.sections.profile.badge.form":
    "formular",
  "designlab.showcase.component.textInput.sections.profile.badge.stable":
    "stabil",
  "designlab.showcase.component.textInput.sections.profile.badge.count":
    "zahler",
  "designlab.showcase.component.textInput.sections.profile.panelFilled":
    "Gefuelltes Kontofeld",
  "designlab.showcase.component.textInput.sections.profile.panelGuideline":
    "Nutzungshinweis",
  "designlab.showcase.component.textInput.sections.profile.guideline":
    "Bei primaeren Formularfeldern sollten Label, Beschreibung und Hinweis gemeinsam erscheinen. Zahler nur anzeigen, wenn Zeichenbegrenzung relevant ist.",
  "designlab.showcase.component.textInput.sections.search.eyebrow":
    "Alternative 02",
  "designlab.showcase.component.textInput.sections.search.title":
    "Such- / Befehlsleistenfeld",
  "designlab.showcase.component.textInput.sections.search.description":
    "Schnellere, kuerzere und aktionsorientierte Variante fuer Suche und Filterzeilen.",
  "designlab.showcase.component.textInput.sections.search.badge.search":
    "suche",
  "designlab.showcase.component.textInput.sections.search.badge.compact":
    "kompakt",
  "designlab.showcase.component.textInput.sections.search.badge.leadingIcon":
    "icon-vorn",
  "designlab.showcase.component.textInput.sections.search.panelSearch": "Suche",
  "designlab.showcase.component.textInput.sections.search.searchLabel": "Suche",
  "designlab.showcase.component.textInput.sections.search.searchDescription":
    "Nach Datensatz, Firma oder Benutzer suchen.",
  "designlab.showcase.component.textInput.sections.search.panelFilterRow":
    "Filterzeile",
  "designlab.showcase.component.textInput.sections.search.quickFilterLabel":
    "Schnellfilter",
  "designlab.showcase.component.textInput.sections.search.apply": "Anwenden",
  "designlab.showcase.component.textInput.sections.validation.eyebrow":
    "Alternative 03",
  "designlab.showcase.component.textInput.sections.validation.title":
    "Validierung / Zustandsmatrix",
  "designlab.showcase.component.textInput.sections.validation.description":
    "Validiertes, ungueltiges und schreibgeschuetztes Verhalten mit demselben Primitive.",
  "designlab.showcase.component.textInput.sections.validation.badge.validation":
    "validierung",
  "designlab.showcase.component.textInput.sections.validation.badge.readonly":
    "schreibgeschuetzt",
  "designlab.showcase.component.textInput.sections.validation.panelValidated":
    "Validiert",
  "designlab.showcase.component.textInput.sections.validation.panelInvalid":
    "Ungueltig",
  "designlab.showcase.component.textInput.sections.validation.panelReadonly":
    "Schreibgeschuetzt",
  "designlab.showcase.component.textInput.sections.density.eyebrow":
    "Alternative 04",
  "designlab.showcase.component.textInput.sections.density.title":
    "Dichte- / Groessenmatrix",
  "designlab.showcase.component.textInput.sections.density.description":
    "Kleine, mittlere und grosse Hit-Area-Optionen mit derselben API.",
  "designlab.showcase.component.textInput.sections.density.panelSmall": "Klein",
  "designlab.showcase.component.textInput.sections.density.panelMedium":
    "Mittel",
  "designlab.showcase.component.textInput.sections.density.panelLarge": "Gross",
  "designlab.showcase.component.textInput.sections.density.smallLabel":
    "Kompaktes Feld",
  "designlab.showcase.component.textInput.sections.density.mediumLabel":
    "Standardfeld",
  "designlab.showcase.component.textInput.sections.density.largeLabel":
    "Betontes Feld",
  "designlab.showcase.component.textInput.sections.invite.eyebrow":
    "Alternative 05",
  "designlab.showcase.component.textInput.sections.invite.title":
    "Inline-Aktion / Einladungsfluss",
  "designlab.showcase.component.textInput.sections.invite.description":
    "Kurzer Ablauf, der Feld und Aktion im selben Block zeigt.",
  "designlab.showcase.component.textInput.sections.invite.badge.actionPair":
    "aktionspaar",
  "designlab.showcase.component.textInput.sections.invite.badge.taskFlow":
    "aufgabenfluss",
  "designlab.showcase.component.textInput.sections.invite.panelInput":
    "Einladungsfeld",
  "designlab.showcase.component.textInput.sections.invite.label":
    "Einladungs-E-Mail",
  "designlab.showcase.component.textInput.sections.invite.descriptionShort":
    "Neuen Stakeholder hinzufuegen.",
  "designlab.showcase.component.textInput.sections.invite.pending":
    "Ausstehend",
  "designlab.showcase.component.textInput.sections.invite.send":
    "Einladung senden",
  "designlab.showcase.component.textInput.sections.access.eyebrow":
    "Alternative 06",
  "designlab.showcase.component.textInput.sections.access.title":
    "Policy- / zugriffsgesteuerte Zustaende",
  "designlab.showcase.component.textInput.sections.access.description":
    "Readonly-, disabled- und versteckte Policy-Modi derselben Komponente.",
  "designlab.showcase.component.textInput.sections.access.badge.access":
    "zugriff",
  "designlab.showcase.component.textInput.sections.access.badge.policy":
    "richtlinie",
  "designlab.showcase.component.textInput.sections.access.badge.governance":
    "regelwerk",
  "designlab.showcase.component.textInput.sections.access.panelReadonly":
    "Schreibgeschuetzt",
  "designlab.showcase.component.textInput.sections.access.readonlyLabel":
    "Vertragsfeld",
  "designlab.showcase.component.textInput.sections.access.readonlyHint":
    "Dieses Feld kann nur vom System geaendert werden.",
  "designlab.showcase.component.textInput.sections.access.panelDisabled":
    "Deaktiviert",
  "designlab.showcase.component.textInput.sections.access.disabledLabel":
    "Nach Veroeffentlichung gesperrt",
  "designlab.showcase.component.textInput.sections.access.disabledHint":
    "Bearbeitung ist nach der Veroeffentlichung geschlossen.",
  "designlab.showcase.component.textInput.sections.access.panelRule":
    "Faustregel",
  "designlab.showcase.component.textInput.sections.access.rule":
    "Ein versteckter Zustand darf keinen leeren Raum lassen; disabled und readonly duerfen nicht gleich aussehen. Das eine ist passiv, das andere gesperrt, aber informativ.",
  "designlab.seed.summaryStrip.published.label": "Veroeffentlicht",
  "designlab.seed.summaryStrip.published.note":
    "Tatsaechlich exportierter Block- und Komponentenbestand.",
  "designlab.seed.summaryStrip.published.trend": "+4 diese Woche",
  "designlab.seed.summaryStrip.planned.label": "Geplant",
  "designlab.seed.summaryStrip.planned.note":
    "Verbleibender Produktisierungs-Backlog auf der Roadmap.",
  "designlab.seed.summaryStrip.planned.trend": "Welle 7",
  "designlab.seed.summaryStrip.doctor.label": "Doctor-Check",
  "designlab.seed.summaryStrip.doctor.note":
    "Die Browser-Diagnostik der UI-Bibliothek ist gruen.",
  "designlab.seed.summaryStrip.doctor.trend": "ui-library",
  "designlab.seed.summaryStrip.gate.label": "Wellen-Gate",
  "designlab.seed.summaryStrip.gate.note":
    "Die vollstaendige Release-Gate-Kette ist erfolgreich durchgelaufen.",
  "designlab.seed.summaryStrip.gate.trend": "aktuell",
  "designlab.seed.entitySummary.domain.label": "Bereich",
  "designlab.seed.entitySummary.domain.value": "UI-Plattform",
  "designlab.seed.entitySummary.status.label": "Status",
  "designlab.seed.entitySummary.status.value": "Aktiv",
  "designlab.seed.entitySummary.owner.label": "Verantwortlich",
  "designlab.seed.entitySummary.owner.value": "Platform-Team",
  "designlab.seed.entitySummary.lastRelease.label": "Letztes Release",
  "designlab.seed.gridRows.record": "Eintrag {index}",
  "designlab.seed.gridRows.status.active": "Aktiv",
  "designlab.seed.gridRows.status.pending": "Ausstehend",
  "designlab.seed.gridRows.status.disabled": "Deaktiviert",
  "designlab.seed.serverGridRows.companies.name": "Unternehmen",
  "designlab.seed.serverGridRows.users.name": "Benutzer",
  "designlab.seed.serverGridRows.permissions.name": "Berechtigungen",
  "designlab.seed.serverGridRows.variants.name": "Varianten",
  "designlab.showcase.component.summaryStrip.live.title": "Uebersichtsleiste",
  "designlab.showcase.component.summaryStrip.live.description":
    "Liefert KPI- und Statuskontext oberhalb der Seite ueber ein wiederverwendbares Ueberblicksband.",
  "designlab.showcase.component.summaryStrip.sections.releaseMetrics.eyebrow":
    "Variante 01",
  "designlab.showcase.component.summaryStrip.sections.releaseMetrics.title":
    "Freigabe-Metrikleiste",
  "designlab.showcase.component.summaryStrip.sections.releaseMetrics.description":
    "Zeigt die wichtigste Kennzahlenflaeche ueber einen gemeinsam genutzten Vertrag fuer das Ueberblicksband.",
  "designlab.showcase.component.summaryStrip.sections.releaseMetrics.badge.metrics":
    "metriken",
  "designlab.showcase.component.summaryStrip.sections.releaseMetrics.badge.beta":
    "Beta",
  "designlab.showcase.component.summaryStrip.sections.releaseMetrics.badge.summary":
    "zusammenfassung",
  "designlab.showcase.component.summaryStrip.sections.releaseMetrics.panelPrimary":
    "Primaere Leiste",
  "designlab.showcase.component.summaryStrip.sections.releaseMetrics.stripTitle":
    "UI-Bibliothek im Ueberblick",
  "designlab.showcase.component.summaryStrip.sections.releaseMetrics.stripDescription":
    "Export-, Doctor-Check- und Wellen-Gate-Status in einer Leiste.",
  "designlab.showcase.component.summaryStrip.sections.releaseMetrics.panelGuideline":
    "Leitlinie",
  "designlab.showcase.component.summaryStrip.sections.releaseMetrics.guideline":
    "Ein Summary Strip ist kein Dashboard-KPI-Band; er traegt kurze, entscheidungsrelevante Metriken unter dem Seitenkopf.",
  "designlab.showcase.component.summaryStrip.sections.compactOwnership.eyebrow":
    "Variante 02",
  "designlab.showcase.component.summaryStrip.sections.compactOwnership.title":
    "Kompakte Verantwortungszusammenfassung",
  "designlab.showcase.component.summaryStrip.sections.compactOwnership.description":
    "Zwei- oder dreispaltige Nutzung des Ueberblicksbandes fuer schmalere Seiten.",
  "designlab.showcase.component.summaryStrip.sections.compactOwnership.badge.compact":
    "kompakt",
  "designlab.showcase.component.summaryStrip.sections.compactOwnership.badge.ownership":
    "verantwortung",
  "designlab.showcase.component.summaryStrip.sections.compactOwnership.badge.responsive":
    "responsiv",
  "designlab.showcase.component.summaryStrip.sections.compactOwnership.panelThreeColumn":
    "Dreispaltiger Streifen",
  "designlab.showcase.component.summaryStrip.sections.compactOwnership.stripTitle":
    "Lieferverantwortung",
  "designlab.showcase.component.summaryStrip.sections.compactOwnership.items.owner.label":
    "Verantwortlich",
  "designlab.showcase.component.summaryStrip.sections.compactOwnership.items.owner.value":
    "Platform UI",
  "designlab.showcase.component.summaryStrip.sections.compactOwnership.items.owner.note":
    "Hauptverantwortung",
  "designlab.showcase.component.summaryStrip.sections.compactOwnership.items.review.label":
    "Pruefung",
  "designlab.showcase.component.summaryStrip.sections.compactOwnership.items.review.value":
    "2/3",
  "designlab.showcase.component.summaryStrip.sections.compactOwnership.items.review.note":
    "Security-Freigabe steht noch aus",
  "designlab.showcase.component.summaryStrip.sections.compactOwnership.items.release.label":
    "Freigabe",
  "designlab.showcase.component.summaryStrip.sections.compactOwnership.items.release.value":
    "Bereit",
  "designlab.showcase.component.summaryStrip.sections.compactOwnership.items.release.note":
    "Doctor-Check bestanden",
  "designlab.showcase.component.summaryStrip.sections.compactOwnership.panelUsage":
    "Nutzungshinweis",
  "designlab.showcase.component.summaryStrip.sections.compactOwnership.metric.label":
    "Responsiver Modus",
  "designlab.showcase.component.summaryStrip.sections.compactOwnership.metric.value":
    "3 Spalten",
  "designlab.showcase.component.summaryStrip.sections.compactOwnership.metric.note":
    "Bricht auf schmalen Flaechen automatisch um.",
  "designlab.showcase.component.entitySummaryBlock.live.title": "Ethikprogramm",
  "designlab.showcase.component.entitySummaryBlock.live.subtitle":
    "Buedelt Owner, Lifecycle und Metadaten in einer einzigen Entity-Shell.",
  "designlab.showcase.component.entitySummaryBlock.live.badge": "Programm",
  "designlab.showcase.component.entitySummaryBlock.live.action":
    "Details oeffnen",
  "designlab.showcase.component.entitySummaryBlock.sections.primary.eyebrow":
    "Variante 01",
  "designlab.showcase.component.entitySummaryBlock.sections.primary.title":
    "Zusammenfassung der Entitaetsverantwortung",
  "designlab.showcase.component.entitySummaryBlock.sections.primary.description":
    "Fasst Summary, Badge, Avatar und Detailbeschreibungen auf einer Entity-Flaeche zusammen.",
  "designlab.showcase.component.entitySummaryBlock.sections.primary.badge.entity":
    "Entitaet",
  "designlab.showcase.component.entitySummaryBlock.sections.primary.badge.summary":
    "zusammenfassung",
  "designlab.showcase.component.entitySummaryBlock.sections.primary.badge.beta":
    "Beta",
  "designlab.showcase.component.entitySummaryBlock.sections.primary.panelPrimary":
    "Primaerer Zusammenfassungsblock",
  "designlab.showcase.component.entitySummaryBlock.sections.primary.card.title":
    "Platform UI",
  "designlab.showcase.component.entitySummaryBlock.sections.primary.card.subtitle":
    "Verantwortlich fuer die Page-Block-Familie und die Freigabezusammenfassung",
  "designlab.showcase.component.entitySummaryBlock.sections.primary.card.badge":
    "Aktiv",
  "designlab.showcase.component.entitySummaryBlock.sections.primary.card.action":
    "Details oeffnen",
  "designlab.showcase.component.entitySummaryBlock.sections.primary.panelWhy":
    "Warum einsetzen",
  "designlab.showcase.component.entitySummaryBlock.sections.primary.whyUse":
    "`EntitySummaryBlock` liefert eine direkt lesbare Summary-Flaeche statt eines Detail-Drawers oder Entity-Headers.",
  "designlab.showcase.component.entitySummaryBlock.sections.withAvatar.eyebrow":
    "Variante 02",
  "designlab.showcase.component.entitySummaryBlock.sections.withAvatar.title":
    "Avatar- und Steuerungsmetadaten",
  "designlab.showcase.component.entitySummaryBlock.sections.withAvatar.description":
    "Traegt Avatar, Badge und Beschreibungen in einer governance-orientierten Darstellung zusammen.",
  "designlab.showcase.component.entitySummaryBlock.sections.withAvatar.badge.avatar":
    "Avatar",
  "designlab.showcase.component.entitySummaryBlock.sections.withAvatar.badge.governance":
    "Steuerung",
  "designlab.showcase.component.entitySummaryBlock.sections.withAvatar.badge.details":
    "detailansicht",
  "designlab.showcase.component.entitySummaryBlock.sections.withAvatar.panelGovernance":
    "Governance-Uebersicht",
  "designlab.showcase.component.entitySummaryBlock.sections.withAvatar.card.title":
    "Wave-7-Rollout",
  "designlab.showcase.component.entitySummaryBlock.sections.withAvatar.card.subtitle":
    "Wiederverwendbare Page-Shell-Adoption",
  "designlab.showcase.component.entitySummaryBlock.sections.withAvatar.card.badge":
    "Beta-Status",
  "designlab.showcase.component.entitySummaryBlock.sections.withAvatar.card.avatarAlt":
    "Wave-7-Vorschau",
  "designlab.showcase.component.entitySummaryBlock.sections.withAvatar.items.wave.label":
    "Welle",
  "designlab.showcase.component.entitySummaryBlock.sections.withAvatar.items.wave.value":
    "wave_7_page_blocks",
  "designlab.showcase.component.entitySummaryBlock.sections.withAvatar.items.status.label":
    "Status",
  "designlab.showcase.component.entitySummaryBlock.sections.withAvatar.items.status.value":
    "Abgeschlossen",
  "designlab.showcase.component.entitySummaryBlock.sections.withAvatar.items.next.label":
    "Naechstes",
  "designlab.showcase.component.entitySummaryBlock.sections.withAvatar.items.next.value":
    "SectionShell-Backlog",
  "designlab.showcase.component.entitySummaryBlock.sections.withAvatar.items.owner.label":
    "Verantwortlich",
  "designlab.showcase.component.entitySummaryBlock.sections.withAvatar.items.owner.value":
    "Platform Team",
  "designlab.showcase.component.entitySummaryBlock.sections.withAvatar.panelContract":
    "Vertragshinweis",
  "designlab.showcase.component.entitySummaryBlock.sections.withAvatar.contract.title":
    "Zusammenfassungsvertrag",
  "designlab.showcase.component.entitySummaryBlock.sections.withAvatar.contract.header.label":
    "Kopfzeile",
  "designlab.showcase.component.entitySummaryBlock.sections.withAvatar.contract.header.value":
    "Titel + Badge + Untertitel",
  "designlab.showcase.component.entitySummaryBlock.sections.withAvatar.contract.avatar.label":
    "Avatar",
  "designlab.showcase.component.entitySummaryBlock.sections.withAvatar.contract.avatar.value":
    "optional einblendbar",
  "designlab.showcase.component.entitySummaryBlock.sections.withAvatar.contract.details.label":
    "Detailbereich",
  "designlab.showcase.component.entitySummaryBlock.sections.withAvatar.contract.details.value":
    "Beschreibungsraster",
  "designlab.showcase.component.agGridServer.shared.columns.source": "Quelle",
  "designlab.showcase.component.agGridServer.shared.columns.owner":
    "Verantwortlich",
  "designlab.showcase.component.agGridServer.sections.ownershipList.eyebrow":
    "Variante 01",
  "designlab.showcase.component.agGridServer.sections.ownershipList.title":
    "Servergestuetzte Ownership-Matrix",
  "designlab.showcase.component.agGridServer.sections.ownershipList.description":
    "AgGridServer zeigt owner-/status-Listen mit einem serverseitigen Datasource-Vertrag.",
  "designlab.showcase.component.agGridServer.sections.ownershipList.badge.serverSide":
    "serverseitig",
  "designlab.showcase.component.agGridServer.sections.ownershipList.badge.stable":
    "stabil",
  "designlab.showcase.component.agGridServer.sections.ownershipList.badge.performance":
    "leistung",
  "designlab.showcase.component.agGridServer.sections.ownershipList.panelList":
    "Server-Ownership-Liste",
  "designlab.showcase.component.agGridServer.sections.ownershipList.panelContract":
    "Performance-Vertrag",
  "designlab.showcase.component.agGridServer.sections.ownershipList.metrics.datasource.label":
    "Datasource",
  "designlab.showcase.component.agGridServer.sections.ownershipList.metrics.datasource.value":
    "server",
  "designlab.showcase.component.agGridServer.sections.ownershipList.metrics.datasource.note":
    "Das Grid laedt Daten ueber den getData-Vertrag.",
  "designlab.showcase.component.agGridServer.sections.ownershipList.metrics.rows.label":
    "Zeilen",
  "designlab.showcase.component.agGridServer.sections.ownershipList.metrics.rows.note":
    "Batch-2-Demo-Snapshotdaten.",
  "designlab.showcase.component.agGridServer.sections.ownershipList.metrics.surface.label":
    "Flaeche",
  "designlab.showcase.component.agGridServer.sections.ownershipList.metrics.surface.value":
    "stabil",
  "designlab.showcase.component.agGridServer.sections.ownershipList.metrics.surface.note":
    "Substrat-Komponente; der Performance-Vertrag ist verpflichtend.",
  "designlab.showcase.component.agGridServer.sections.loadingContract.eyebrow":
    "Alternative 02",
  "designlab.showcase.component.agGridServer.sections.loadingContract.title":
    "Lade- und Fallback-Vertrag",
  "designlab.showcase.component.agGridServer.sections.loadingContract.description":
    "Datasource-, Lade- und Empty-Verhalten bleiben im selben Primitive; bildschirmweite Duplikate sind nicht noetig.",
  "designlab.showcase.component.agGridServer.sections.loadingContract.badge.loading":
    "laden",
  "designlab.showcase.component.agGridServer.sections.loadingContract.badge.empty":
    "leer",
  "designlab.showcase.component.agGridServer.sections.loadingContract.badge.ops":
    "ops",
  "designlab.showcase.component.agGridServer.sections.loadingContract.panelGuidance":
    "Operator-Hinweis",
  "designlab.showcase.component.agGridServer.sections.loadingContract.guidance":
    "`AgGridServer` zentralisiert serverseitige Paginierung und Datasource-Bindung an einer Stelle. So koennen Ownership-Listen, Audit-Abfragen und Entity-Register dasselbe Verhaltensmodell teilen.",
  "designlab.showcase.component.agGridServer.sections.loadingContract.panelEvidence":
    "Evidenzfokus",
  "designlab.showcase.component.agGridServer.sections.loadingContract.evidence.title":
    "Regressionsfokus",
  "designlab.showcase.component.agGridServer.sections.loadingContract.evidence.datasource.label":
    "Datasource",
  "designlab.showcase.component.agGridServer.sections.loadingContract.evidence.datasource.value":
    "setGridOption('serverSideDatasource', datasource)",
  "designlab.showcase.component.agGridServer.sections.loadingContract.evidence.loading.label":
    "Laden",
  "designlab.showcase.component.agGridServer.sections.loadingContract.evidence.loading.value":
    "Overlay + Anfrage ausstehend",
  "designlab.showcase.component.agGridServer.sections.loadingContract.evidence.failure.label":
    "Fehler",
  "designlab.showcase.component.agGridServer.sections.loadingContract.evidence.failure.value":
    "fail callback",
  "designlab.showcase.component.entityGridTemplate.shared.columns.name": "Name",
  "designlab.showcase.component.entityGridTemplate.shared.columns.status":
    "Status",
  "designlab.showcase.component.entityGridTemplate.shared.columns.updatedAt":
    "Aktualisiert",
  "designlab.showcase.component.entityGridTemplate.shared.columns.source":
    "Quelle",
  "designlab.showcase.component.entityGridTemplate.shared.columns.owner":
    "Verantwortlich",
  "designlab.showcase.component.entityGridTemplate.sections.clientRegistry.eyebrow":
    "Alternative 01",
  "designlab.showcase.component.entityGridTemplate.sections.clientRegistry.title":
    "Clientseitiges Entity-Register",
  "designlab.showcase.component.entityGridTemplate.sections.clientRegistry.description":
    "Buedelt Toolbar-, Varianten- und Paginierungsverhalten auf einer einzigen Entity-Template-Flaeche.",
  "designlab.showcase.component.entityGridTemplate.sections.clientRegistry.badge.client":
    "client",
  "designlab.showcase.component.entityGridTemplate.sections.clientRegistry.badge.stable":
    "stabil",
  "designlab.showcase.component.entityGridTemplate.sections.clientRegistry.badge.toolbar":
    "toolbar",
  "designlab.showcase.component.entityGridTemplate.sections.clientRegistry.panelRegistry":
    "Entity-Register",
  "designlab.showcase.component.entityGridTemplate.sections.clientRegistry.panelValue":
    "Template-Wert",
  "designlab.showcase.component.entityGridTemplate.sections.clientRegistry.valueNote":
    "`EntityGridTemplate` kombiniert Toolbar, Variantenauswahl, Paginierung und Theme-Achsen in einer einzigen Substrat-Komponente. Clientseitige Listenansichten brauchen keine separate Shell-Implementierung.",
  "designlab.showcase.component.entityGridTemplate.sections.serverMode.eyebrow":
    "Alternative 02",
  "designlab.showcase.component.entityGridTemplate.sections.serverMode.title":
    "Serverseitiger Toolbar- und Datasource-Modus",
  "designlab.showcase.component.entityGridTemplate.sections.serverMode.description":
    "Dasselbe Template behaelt Datasource- und Toolbar-Verhalten auch im Servermodus bei.",
  "designlab.showcase.component.entityGridTemplate.sections.serverMode.badge.server":
    "server",
  "designlab.showcase.component.entityGridTemplate.sections.serverMode.badge.variant":
    "variante",
  "designlab.showcase.component.entityGridTemplate.sections.serverMode.badge.modeSwitch":
    "moduswechsel",
  "designlab.showcase.component.entityGridTemplate.sections.serverMode.panelServer":
    "Servermodus",
  "designlab.showcase.component.entityGridTemplate.sections.serverMode.panelRegression":
    "Regressionsvertrag",
  "designlab.showcase.component.entityGridTemplate.sections.serverMode.regression.title":
    "Template-Fokus",
  "designlab.showcase.component.entityGridTemplate.sections.serverMode.regression.mode.label":
    "Moduswechsel",
  "designlab.showcase.component.entityGridTemplate.sections.serverMode.regression.mode.value":
    "client -> server",
  "designlab.showcase.component.entityGridTemplate.sections.serverMode.regression.toolbar.label":
    "Toolbar",
  "designlab.showcase.component.entityGridTemplate.sections.serverMode.regression.toolbar.value":
    "Theme / Filter / Variante",
  "designlab.showcase.component.entityGridTemplate.sections.serverMode.regression.datasource.label":
    "Datasource",
  "designlab.showcase.component.entityGridTemplate.sections.serverMode.regression.datasource.value":
    "createServerSideDatasource",
  "designlab.showcase.component.recommendationCard.live.interactive.panel":
    "Interaktive Empfehlung",
  "designlab.showcase.component.recommendationCard.live.interactive.card.title":
    "Release fur breitere Nutzung freigeben",
  "designlab.showcase.component.recommendationCard.live.interactive.card.summary":
    "Die Kernprufungen sind stabil und die nachste Stufe kann starten.",
  "designlab.showcase.component.recommendationCard.live.interactive.card.type":
    "Rollout",
  "designlab.showcase.component.recommendationCard.live.interactive.rationale.doctor":
    "Doctor grun",
  "designlab.showcase.component.recommendationCard.live.interactive.rationale.waveGate":
    "Wave gate grun",
  "designlab.showcase.component.recommendationCard.live.interactive.rationale.riskRegister":
    "Kein offener Blocker",
  "designlab.showcase.component.recommendationCard.live.interactive.primaryAction.default":
    "Anwenden",
  "designlab.showcase.component.recommendationCard.live.interactive.primaryAction.applied":
    "Angewendet",
  "designlab.showcase.component.recommendationCard.live.interactive.secondaryAction.default":
    "Zur Review senden",
  "designlab.showcase.component.recommendationCard.live.interactive.secondaryAction.review":
    "Review angefordert",
  "designlab.showcase.component.recommendationCard.live.interactive.footerNote":
    "Vor dem Merge noch den Owner informieren.",
  "designlab.showcase.component.recommendationCard.live.interactive.badge.wave":
    "wave",
  "designlab.showcase.component.recommendationCard.live.interactive.badge.contract":
    "vertrag",
  "designlab.showcase.component.recommendationCard.live.readonly.panel":
    "Readonly-Empfehlung",
  "designlab.showcase.component.recommendationCard.live.readonly.card.title":
    "Review zuerst fortsetzen",
  "designlab.showcase.component.recommendationCard.live.readonly.card.summary":
    "Die Empfehlung ist sichtbar, bleibt aber bewusst beratend.",
  "designlab.showcase.component.recommendationCard.live.readonly.card.type":
    "Hinweis",
  "designlab.showcase.component.recommendationCard.live.readonly.rationale.approvalQueue":
    "Freigabe-Warteschlange ist noch aktiv",
  "designlab.showcase.component.recommendationCard.live.readonly.rationale.policyImpact":
    "Policy verlangt menschliche Prufung",
  "designlab.showcase.component.recommendationCard.live.readonly.footerNote":
    "Keine automatische Ausfuhrung in readonly Flachen.",
  "designlab.showcase.component.confidenceBadge.live.matrix.panel":
    "Vertrauensmatrix",
  "designlab.showcase.component.confidenceBadge.live.compact.panel":
    "Kompaktes Vertrauen",
  "designlab.showcase.component.confidenceBadge.live.compact.manualReviewLabel":
    "Manuelles Review",
  "designlab.showcase.component.confidenceBadge.live.compact.note":
    "Geeignet fur dichte Tabellen und Queue-Zeilen.",
  "designlab.showcase.component.approvalCheckpoint.live.interactive.panel":
    "Interaktiver Checkpoint",
  "designlab.showcase.component.approvalCheckpoint.live.interactive.card.title":
    "Freigabe steht aus",
  "designlab.showcase.component.approvalCheckpoint.live.interactive.card.summary":
    "Ein Owner muss die Empfehlung bestatigen.",
  "designlab.showcase.component.approvalCheckpoint.live.interactive.card.approverLabel":
    "Genehmiger",
  "designlab.showcase.component.approvalCheckpoint.live.interactive.card.dueLabel":
    "Fallig",
  "designlab.showcase.component.approvalCheckpoint.live.interactive.card.footerNote":
    "Nach Freigabe wird der Rollout fortgesetzt.",
  "designlab.showcase.component.approvalCheckpoint.live.readonly.panel":
    "Readonly-Checkpoint",
  "designlab.showcase.component.approvalCheckpoint.live.readonly.card.title":
    "Bereits zur Review gesendet",
  "designlab.showcase.component.approvalCheckpoint.live.readonly.card.summary":
    "Nur Statusanzeige, keine Interaktion.",
  "designlab.showcase.component.approvalCheckpoint.live.interactive.badge.aiNative":
    "KI-nativ",
  "designlab.tabs.api.label": "Schnittstelle",
  "designlab.tabs.ux.label": "Erlebnis",
  "designlab.componentContracts.empty.description": "Keine Einträge gefunden.",
  "designlab.componentContracts.jsonViewer.emptyFallbackDescription":
    "Keine JSON-Nutzlast verfügbar.",
  "designlab.componentContracts.jsonViewer.emptyNodeDescription":
    "Dieser Knoten ist leer.",
  "designlab.componentContracts.anchorToc.title": "Auf dieser Seite",
  "designlab.componentContracts.anchorToc.navigationLabel": "Seitennavigation",
  "designlab.componentContracts.descriptions.emptyFallbackDescription":
    "Keine Details gefunden.",
  "designlab.componentContracts.list.emptyFallbackDescription":
    "Keine Einträge gefunden.",
  "designlab.componentContracts.linkInline.externalScreenReaderLabel":
    "Externer Link",
  "designlab.componentContracts.themePreviewCard.titleText": "Titeltext",
  "designlab.componentContracts.themePreviewCard.secondaryText": "Sekundärtext",
  "designlab.componentContracts.themePreviewCard.saveLabel": "Speichern",
  "designlab.componentContracts.themePreviewCard.selectedLabel":
    "Ausgewählte Theme-Vorschau",
  "designlab.general.component.release": "Veroeffentlichung",
  "designlab.metadata.demo": "Vorschau",
  "designlab.showcase.previewPanels.live.label": "Live-Vorschau",
  "designlab.showcase.component.planned.roadmap": "Fahrplan",
  "designlab.showcase.component.planned.title":
    "{name} ist noch nicht veröffentlicht",
  "designlab.showcase.component.planned.description":
    "Dieses Element befindet sich noch im geplanten Backlog. Die Live-Vorschau bleibt geschlossen, bis Export, Live-Demo und Regressionsnachweise vollständig sind.",
  "designlab.showcase.component.planned.badge": "Geplantes Element",
  "designlab.showcase.component.planned.releaseGate": "Freigabe-Gate",
  "designlab.showcase.component.planned.releaseGate.value": "blockiert",
  "designlab.showcase.component.planned.releaseGate.note":
    "Benötigt Implementierung, Registry-Synchronisierung und Vorschau.",
  "designlab.showcase.component.planned.wave": "Welle",
  "designlab.showcase.component.planned.wave.note":
    "Ausrichtung auf die Roadmap-Wave.",
  "designlab.showcase.component.planned.northStar": "Nordstern",
  "designlab.showcase.component.planned.northStar.title":
    "Wo wird diese Komponente eingesetzt?",
  "designlab.showcase.component.planned.northStar.description":
    "Da es sich um ein Roadmap-Element handelt, müssen UX- und Qualitätsverträge vor dem Export festgelegt werden.",
  "designlab.showcase.component.button.variants.title": "Varianten",
  "designlab.showcase.component.button.variants.primary": "Primäre Aktion",
  "designlab.showcase.component.button.variants.secondary": "Sekundäre Aktion",
  "designlab.showcase.component.button.variants.ghost": "Ghost-Aktion",
  "designlab.showcase.component.button.variants.destructive":
    "Destruktive Aktion",
  "designlab.showcase.component.button.sizes.title": "Größen",
  "designlab.showcase.component.button.sizes.small": "Kleiner Button",
  "designlab.showcase.component.button.sizes.medium": "Mittlerer Button",
  "designlab.showcase.component.button.sizes.large": "Großer Button",
  "designlab.showcase.component.button.states.title": "Zustände",
  "designlab.showcase.component.button.states.loadingLabel":
    "Änderungen werden gespeichert",
  "designlab.showcase.component.button.states.save": "Änderungen speichern",
  "designlab.showcase.component.button.states.disabled": "Deaktivierte Aktion",
  "designlab.showcase.component.button.states.readonly":
    "Schreibgeschützte Aktion",
  "designlab.showcase.component.button.states.fullWidth": "Weiter zur Prüfung",
  "designlab.showcase.component.badge.default": "Standard",
  "designlab.showcase.component.badge.info": "Info",
  "designlab.showcase.component.badge.success": "Erfolg",
  "designlab.showcase.component.badge.warning": "Warnung",
  "designlab.showcase.component.badge.danger": "Gefahr",
  "designlab.showcase.component.avatar.sizes.title": "Größen",
  "designlab.showcase.component.avatar.image.title": "Bild + Quadrat",
  "designlab.showcase.component.avatar.fallback.title": "Fallback-Zustände",
  "designlab.showcase.component.breadcrumb.basic.title": "Einfacher Pfad",
  "designlab.showcase.component.breadcrumb.basic.admin": "Admin",
  "designlab.showcase.component.breadcrumb.basic.uiKit": "UI-Bibliothek",
  "designlab.showcase.component.breadcrumb.basic.navigation": "Navigation",
  "designlab.showcase.component.breadcrumb.collapsed.title":
    "Eingeklappter Pfad",
  "designlab.showcase.component.breadcrumb.collapsed.workspace": "Workspace",
  "designlab.showcase.component.breadcrumb.collapsed.cockpit": "Cockpit",
  "designlab.showcase.component.breadcrumb.collapsed.libraries": "Bibliotheken",
  "designlab.showcase.component.breadcrumb.collapsed.uiSystem": "UI-System",
  "designlab.showcase.component.breadcrumb.collapsed.tabs": "Tabs",
  "designlab.showcase.component.menuBar.aria": "Shell-Header-Navigation",
  "designlab.showcase.component.menuBar.shell.title": "Shell-Header-Rezept",
  "designlab.showcase.component.menuBar.shell.note":
    "Das reale Top-Header-Navigationsrezept verbindet aktive Route, Utility-Bereich und häufig genutzte Ziele in einer Oberfläche.",
  "designlab.showcase.component.menuBar.constrained.title":
    "Overflow bei enger Breite",
  "designlab.showcase.component.menuBar.constrained.note":
    "Dasselbe Rezept fällt bei engerem Raum in ein Overflow-Menü zurück und hält den Top-Header stabil.",
  "designlab.showcase.component.anchorToc.title": "Abschnittsplan",
  "designlab.showcase.component.anchorToc.items.overview": "Überblick",
  "designlab.showcase.component.anchorToc.items.ux": "UX-Vertrag",
  "designlab.showcase.component.anchorToc.items.security": "Sicherheit",
  "designlab.showcase.component.anchorToc.items.release":
    "Release-Bereitschaft",
  "designlab.showcase.component.anchorToc.deepLink.title": "Deep-Link-Inhalt",
  "designlab.showcase.component.anchorToc.deepLink.overview":
    "Hier startest du mit Zweck, Demo-Fläche und Consumer-Erwartung der Komponente.",
  "designlab.showcase.component.anchorToc.deepLink.ux":
    "Vor dem Release Interaktionsvertrag, Dichte-Regeln und Barrierefreiheitsnotizen festhalten.",
  "designlab.showcase.component.anchorToc.deepLink.security":
    "Policy-Grenzen, Schreibschutzverhalten und auditkritische Pfade auf dieser Fläche dokumentieren.",
  "designlab.showcase.component.anchorToc.deepLink.release":
    "Mit Release-Evidenz, Regressions-Gates und Consumer-Handoff-Hinweisen abschließen.",
  "designlab.showcase.component.iconButton.intent.title": "Absicht",
  "designlab.showcase.component.iconButton.intent.add": "Element hinzufügen",
  "designlab.showcase.component.iconButton.intent.pin": "Element anheften",
  "designlab.showcase.component.iconButton.intent.delete": "Element löschen",
  "designlab.showcase.component.iconButton.states.title": "Zustände",
  "designlab.showcase.component.iconButton.states.loading": "Ladeaktion",
  "designlab.showcase.component.iconButton.states.locked": "Gesperrte Aktion",
  "designlab.showcase.component.iconButton.states.openMenu": "Menü öffnen",
  "designlab.showcase.component.divider.horizontal.title": "Horizontaler Fluss",
  "designlab.showcase.component.divider.horizontal.top": "Primärer Kontext",
  "designlab.showcase.component.divider.horizontal.bottom":
    "Sekundärer Kontext",
  "designlab.showcase.component.divider.vertical.title":
    "Vertikal + Inline-Label",
  "designlab.showcase.component.divider.vertical.left": "Vorher",
  "designlab.showcase.component.divider.vertical.right": "Nachher",
  "designlab.showcase.component.divider.vertical.or": "Oder",
  "designlab.showcase.component.divider.semantic.title": "Semantische Nutzung",
  "designlab.showcase.component.divider.semantic.contract": "Vertragsgrenze",
  "designlab.showcase.component.divider.semantic.decorative":
    "Dekorative Divider nur verwenden, wenn die Trennung keine semantische Bedeutung hat.",
  "designlab.showcase.component.linkInline.links.title":
    "Interne / externe Links",
  "designlab.showcase.component.linkInline.links.internal": "Interne Zielseite",
  "designlab.showcase.component.linkInline.links.external": "Externe Zielseite",
  "designlab.showcase.component.linkInline.states.title": "Statusvarianten",
  "designlab.showcase.component.linkInline.states.current": "Aktuelle Route",
  "designlab.showcase.component.linkInline.states.disabled":
    "Deaktivierte Route",
  "designlab.showcase.component.linkInline.states.secondary":
    "Sekundäre Aktion",
  "designlab.showcase.component.skeleton.text": "Textzeilen",
  "designlab.showcase.component.skeleton.avatarText": "Avatar + Text",
  "designlab.showcase.component.skeleton.card": "Kartenblock",
  "designlab.showcase.component.skeleton.tableRow": "Tabellenzeilen",
  "designlab.showcase.component.spinner.inline.title": "Inline-Spinner",
  "designlab.showcase.component.spinner.inline.label":
    "Inline-Inhalt wird geladen",
  "designlab.showcase.component.spinner.block.title": "Block-Spinner",
  "designlab.showcase.component.spinner.block.label": "Bereich wird geladen",
  "designlab.showcase.component.spinner.overlay.title": "Overlay-Spinner",
  "designlab.showcase.component.spinner.overlay.label": "Overlay wird geladen",
  "designlab.showcase.component.spinner.tone.title": "Ton + Größe",
  "designlab.showcase.component.spinner.tone.short": "Kleines neutrales Laden",
  "designlab.showcase.component.spinner.tone.medium": "Primäres Laden",
  "designlab.showcase.component.spinner.tone.inverse": "Invertiertes Laden",
  "designlab.showcase.component.select.option.comfortable": "Komfortabel",
  "designlab.showcase.component.select.option.compact": "Kompakt",
  "designlab.showcase.component.select.option.sharp": "Markant",
  "designlab.showcase.component.select.activeValue": "Aktive Dichte: {value}",
  "designlab.showcase.component.steps.interactive.title": "Interaktiver Ablauf",
  "designlab.showcase.component.steps.interactive.draft.title": "Entwurf",
  "designlab.showcase.component.steps.interactive.draft.description":
    "Die erste Version vor der Stakeholder-Prüfung vorbereiten.",
  "designlab.showcase.component.steps.interactive.review.title": "Prüfung",
  "designlab.showcase.component.steps.interactive.review.description":
    "Feedback, Freigaben und offene Punkte in einem Schritt sammeln.",
  "designlab.showcase.component.steps.interactive.release.title": "Release",
  "designlab.showcase.component.steps.interactive.release.description":
    "Veröffentlichen, sobald Doctor-, Gate- und Evidenz-Prüfungen abgeschlossen sind.",
  "designlab.showcase.component.steps.vertical.title": "Vertikaler Fortschritt",
  "designlab.showcase.component.steps.vertical.scope.title": "Umfang",
  "designlab.showcase.component.steps.vertical.scope.description":
    "Zuerst Rollout-Abdeckung und betroffene Consumer bestätigen.",
  "designlab.showcase.component.steps.vertical.preview.title": "Vorschau",
  "designlab.showcase.component.steps.vertical.preview.description":
    "Live-Fläche, Randfälle und finalen Text prüfen.",
  "designlab.showcase.component.steps.vertical.security.title": "Sicherheit",
  "designlab.showcase.component.steps.vertical.security.description":
    "Optionale Härtung und Readonly-Kontrollen vor dem Release.",
  "designlab.showcase.component.tag.neutral": "Neutral",
  "designlab.showcase.component.tag.approved": "Freigegeben",
  "designlab.showcase.component.tag.pending": "Ausstehend",
  "designlab.showcase.component.tag.blocked": "Blockiert",
  "designlab.showcase.component.text.semanticPreset.title":
    "Semantische Presets",
  "designlab.showcase.component.text.semanticPreset.display":
    "Display-Überschrift",
  "designlab.showcase.component.text.semanticPreset.heading":
    "Abschnittsüberschrift",
  "designlab.showcase.component.text.semanticPreset.titleText":
    "Title-Preset für Karten und Panels.",
  "designlab.showcase.component.text.semanticPreset.body":
    "Body-Text für operative Erzählungen und unterstützende Produktdetails.",
  "designlab.showcase.component.text.semanticPreset.caption":
    "Caption-Metadaten und unterstützende Anmerkungen.",
  "designlab.showcase.component.text.emphasis.title": "Betonungsvarianten",
  "designlab.showcase.component.text.emphasis.primary":
    "Primäre Betonung für wichtige Entscheidungen.",
  "designlab.showcase.component.text.emphasis.secondary":
    "Sekundäre Betonung für unterstützenden Kontext.",
  "designlab.showcase.component.text.emphasis.muted":
    "Zurückhaltende Betonung für ruhige Metadaten.",
  "designlab.showcase.component.text.emphasis.success":
    "Erfolgsbetonung für abgeschlossene Ergebnisse.",
  "designlab.showcase.component.text.emphasis.danger":
    "Gefahrenbetonung für blockierte Aktionen.",
  "designlab.showcase.component.text.clamp.title": "Clamp + Truncate",
  "designlab.showcase.component.text.clamp.singleLine":
    "Ein einzeiliger Satz, der gekürzt werden sollte, bevor er die Kartenbreite überschreitet.",
  "designlab.showcase.component.text.clamp.multiLine":
    "Eine mehrzeilige Erklärung bleibt lesbar, während das Layout eine feste Höhe hält und die umgebende Fläche nicht verdrängt.",
  "designlab.showcase.component.text.readability.title": "Lesbarkeit",
  "designlab.showcase.component.text.readability.paragraph":
    "Gut lesbarer Text sollte auf dichten Admin-Oberflächen den Rhythmus bewahren, damit Prüfungen, Freigaben und Release-Notizen unter Druck klar bleiben.",
  "designlab.showcase.component.text.readability.tabularNums":
    "Tabellarische Ziffern halten Kennzahlen in Audit-Zusammenfassungen sauber ausgerichtet.",
  "designlab.showcase.component.textInput.sections.validation.badge.error":
    "Fehler",
  "designlab.showcase.component.textInput.sections.density.badge.sm": "klein",
  "designlab.showcase.component.textInput.sections.density.badge.md": "mittel",
  "designlab.showcase.component.textInput.sections.density.badge.lg": "groß",
  "designlab.showcase.component.textInput.sections.invite.badge.cta":
    "Aktionsaufruf",
  "designlab.showcase.component.textArea.sections.authoring.eyebrow":
    "Variante 01",
  "designlab.showcase.component.textArea.sections.authoring.title":
    "Authoring / Notizfeld",
  "designlab.showcase.component.textArea.sections.authoring.description":
    "Primäre Authoring-Fläche für längere Beschreibungen.",
  "designlab.showcase.component.textArea.sections.authoring.badge.authoring":
    "Authoring",
  "designlab.showcase.component.textArea.sections.authoring.badge.autoResize":
    "Auto-Größe",
  "designlab.showcase.component.textArea.sections.authoring.badge.count":
    "Zähler",
  "designlab.showcase.component.textArea.sections.authoring.panelAutoResize":
    "Automatische Größe",
  "designlab.showcase.component.textArea.sections.authoring.panelGuideline":
    "Leitlinie",
  "designlab.showcase.component.textArea.sections.authoring.guideline":
    "Automatische Größenanpassung wirkt auf Authoring-Flächen natürlicher. Verwende kontrollierte vertikale Größenanpassung in Audit- oder festen Layout-Bereichen.",
  "designlab.showcase.component.textArea.sections.review.eyebrow":
    "Variante 02",
  "designlab.showcase.component.textArea.sections.review.title":
    "Prüfung / Entscheidungsprotokoll",
  "designlab.showcase.component.textArea.sections.review.description":
    "Gut lesbare Prüfungsfläche für Entscheidungen, Einwände oder Kommentare.",
  "designlab.showcase.component.textArea.sections.review.badge.review":
    "Prüfung",
  "designlab.showcase.component.textArea.sections.review.badge.audit": "Audit",
  "designlab.showcase.component.textArea.sections.review.badge.multiline":
    "mehrzeilig",
  "designlab.showcase.component.textArea.sections.review.panelReviewer":
    "Prüfungsnotiz",
  "designlab.showcase.component.textArea.sections.review.reviewerLabel":
    "Prüfungsnotiz",
  "designlab.showcase.component.textArea.sections.review.reviewerValue":
    "Der Richtlinientext wurde aktualisiert; das Rechtsteam sollte die letzte Prüfung vor der Veröffentlichung abschließen.",
  "designlab.showcase.component.textArea.sections.review.panelAudit":
    "Nur-Lesen-Audit",
  "designlab.showcase.component.textArea.sections.review.auditLabel":
    "Generiertes Protokoll",
  "designlab.showcase.component.textArea.sections.review.auditValue":
    "2026-03-07 12:48 · system-bot -> Release-Nachweisdatei hinzugefügt.",
  "designlab.showcase.component.textArea.sections.validation.eyebrow":
    "Variante 03",
  "designlab.showcase.component.textArea.sections.validation.title":
    "Validierung / Durchsetzung",
  "designlab.showcase.component.textArea.sections.validation.description":
    "Fehlende Beschreibung, Mindestinhalt und Nutzerfeedback.",
  "designlab.showcase.component.textArea.sections.validation.badge.error":
    "Fehler",
  "designlab.showcase.component.textArea.sections.validation.badge.hint":
    "Hinweis",
  "designlab.showcase.component.textArea.sections.validation.badge.count":
    "Zähler",
  "designlab.showcase.component.textArea.sections.validation.panelInvalid":
    "Ungültig",
  "designlab.showcase.component.textArea.sections.validation.panelReadonly":
    "Schreibgeschützt",
  "designlab.showcase.component.textArea.sections.validation.panelDisabled":
    "Deaktiviert",
  "designlab.showcase.component.textArea.sections.layout.eyebrow":
    "Variante 04",
  "designlab.showcase.component.textArea.sections.layout.title":
    "Panel / zweispaltiges Layout",
  "designlab.showcase.component.textArea.sections.layout.description":
    "Zwei Layout-Beispiele derselben Komponente für schmale Seitenpanels und breite Inhaltsflächen.",
  "designlab.showcase.component.textArea.sections.layout.badge.layout":
    "Layout",
  "designlab.showcase.component.textArea.sections.layout.badge.panel": "Panel",
  "designlab.showcase.component.textArea.sections.layout.badge.responsive":
    "responsiv",
  "designlab.showcase.component.textArea.sections.layout.panelSide":
    "Seitenpanel",
  "designlab.showcase.component.textArea.sections.layout.sideLabel":
    "Kurze Notiz",
  "designlab.showcase.component.textArea.sections.layout.sideValue":
    "Kompakte Panel-Notiz.",
  "designlab.showcase.component.textArea.sections.layout.panelPrimary":
    "Primärer Editor",
  "designlab.showcase.component.dropdown.live.trigger": "Aktionsmenu",
  "designlab.showcase.component.dropdown.live.item.publish": "Veroffentlichen",
  "designlab.showcase.component.dropdown.live.item.duplicate": "Duplizieren",
  "designlab.showcase.component.dropdown.live.item.archive": "Archivieren",
  "designlab.showcase.component.dropdown.live.selection": "Auswahl: {value}",
  "designlab.showcase.component.modal.live.open": "Dialog offnen",
  "designlab.showcase.component.modal.live.title": "UI-Kit-Demodialog",
  "designlab.showcase.component.modal.live.cancel": "Abbrechen",
  "designlab.showcase.component.modal.live.save": "Speichern",
  "designlab.showcase.component.modal.live.description":
    "Dialogvorschau, die an die Token-Kette gebunden ist.",
  "designlab.showcase.component.formDrawer.live.open": "Drawer offnen",
  "designlab.showcase.component.formDrawer.live.title": "Neuer Eintrag",
  "designlab.showcase.component.formDrawer.live.field1": "Feld 1",
  "designlab.showcase.component.formDrawer.live.field2": "Feld 2",
  "designlab.showcase.component.modal.sections.confirm.eyebrow":
    "Alternative 01",
  "designlab.showcase.component.modal.sections.confirm.title":
    "Bestatigungs- / destruktiver Dialog",
  "designlab.showcase.component.modal.sections.confirm.description":
    "Kontext fur riskante Freigabe- und Loschaktionen, bei denen der Benutzer die Auswirkung bestatigen muss.",
  "designlab.showcase.component.modal.sections.confirm.badge.dialog": "dialog",
  "designlab.showcase.component.modal.sections.confirm.badge.stable": "stabil",
  "designlab.showcase.component.modal.sections.confirm.badge.confirmation":
    "bestaetigung",
  "designlab.showcase.component.modal.sections.confirm.panelInteractive":
    "Interaktiver Bestatigungsdialog",
  "designlab.showcase.component.modal.sections.confirm.open": "Dialog offnen",
  "designlab.showcase.component.modal.sections.confirm.sectionBadge":
    "riskante Aktion",
  "designlab.showcase.component.modal.sections.confirm.card.title":
    "Rollout-Freigabe erforderlich",
  "designlab.showcase.component.modal.sections.confirm.card.cancel":
    "Abbrechen",
  "designlab.showcase.component.modal.sections.confirm.card.confirm":
    "Bestatigen",
  "designlab.showcase.component.modal.sections.confirm.card.body":
    "Der Freigabe-Track wird fur alle verknupften Oberflachen aktualisiert. Prufe Scope und Nebenwirkungen, bevor du fortfahrst.",
  "designlab.showcase.component.modal.sections.confirm.panelGuideline":
    "Leitlinie",
  "designlab.showcase.component.modal.sections.confirm.guideline":
    "Verwende Bestatigungsdialoge fur irreversible oder breite Rollout-Aktionen. Harmlosen Kontext lieber inline halten.",
  "designlab.showcase.component.modal.sections.readonly.eyebrow":
    "Alternative 02",
  "designlab.showcase.component.modal.sections.readonly.title":
    "Schreibgeschutzter / Audit-Review-Dialog",
  "designlab.showcase.component.modal.sections.readonly.description":
    "Readonly-Dialog fur Evidence-, Audit- und Review-Kontext, in dem gepruft statt bearbeitet wird.",
  "designlab.showcase.component.modal.sections.readonly.badge.readonly":
    "readonly",
  "designlab.showcase.component.modal.sections.readonly.badge.audit": "audit",
  "designlab.showcase.component.modal.sections.readonly.badge.review": "review",
  "designlab.showcase.component.modal.sections.readonly.panelReview":
    "Review-Dialogmuster",
  "designlab.showcase.component.modal.sections.readonly.card.title":
    "Evidence-Zusammenfassung",
  "designlab.showcase.component.modal.sections.readonly.card.body":
    "Readonly-Dialoge eignen sich fur Evidence Review, Policy-Checks und Freigabeverlaufe ohne Inline-Bearbeitung.",
  "designlab.showcase.component.modal.sections.readonly.card.badgeReview":
    "Readonly-Review",
  "designlab.showcase.component.modal.sections.readonly.card.badgeNoEdit":
    "Keine Inline-Bearbeitung",
  "designlab.showcase.component.modal.sections.readonly.panelRule":
    "Faustregel",
  "designlab.showcase.component.modal.sections.readonly.rule":
    "Wenn der Benutzer nur lesen, bestaetigen oder exportieren soll, ist ein readonly Dialog klarer als ein voll editierbares Overlay.",
  "designlab.showcase.component.dropdown.sections.action.eyebrow":
    "Alternative 01",
  "designlab.showcase.component.dropdown.sections.action.title": "Aktionsmenu",
  "designlab.showcase.component.dropdown.sections.action.description":
    "Kompaktes Menu fur Zeilen- oder Kartenaktionen, wenn Sekundaraktionen nicht permanent sichtbar sein sollen.",
  "designlab.showcase.component.dropdown.sections.action.badge.menu": "menu",
  "designlab.showcase.component.dropdown.sections.action.badge.stable":
    "stabil",
  "designlab.showcase.component.dropdown.sections.action.badge.actions":
    "aktionen",
  "designlab.showcase.component.dropdown.sections.action.panelRow":
    "Zeilenaktionsmenu",
  "designlab.showcase.component.dropdown.sections.action.trigger":
    "Aktionsmenu",
  "designlab.showcase.component.dropdown.sections.action.item.publish":
    "Veroffentlichen",
  "designlab.showcase.component.dropdown.sections.action.item.duplicate":
    "Duplizieren",
  "designlab.showcase.component.dropdown.sections.action.item.archive":
    "Archivieren",
  "designlab.showcase.component.dropdown.sections.action.selection":
    "Auswahl: {value}",
  "designlab.showcase.component.dropdown.sections.action.panelGuideline":
    "Leitlinie",
  "designlab.showcase.component.dropdown.sections.action.guideline":
    "Nutze Dropdowns fur seltene oder sekundare Aktionen. Primare Aktionen sollten weiterhin direkt sichtbar bleiben.",
  "designlab.showcase.component.dropdown.sections.density.eyebrow":
    "Alternative 02",
  "designlab.showcase.component.dropdown.sections.density.title":
    "Filter- / Dichtewahler",
  "designlab.showcase.component.dropdown.sections.density.description":
    "Leichter Selector fur dichtebezogene oder lokale Layout-Wahlen ohne schwere Settings-Dialoge.",
  "designlab.showcase.component.dropdown.sections.density.badge.filters":
    "filter",
  "designlab.showcase.component.dropdown.sections.density.badge.density":
    "dichte",
  "designlab.showcase.component.dropdown.sections.density.badge.compact":
    "kompakt",
  "designlab.showcase.component.dropdown.sections.density.panelSelector":
    "Dichtewahler",
  "designlab.showcase.component.dropdown.sections.density.trigger":
    "Dichte auswahlen",
  "designlab.showcase.component.dropdown.sections.density.item.compact":
    "Kompakt",
  "designlab.showcase.component.dropdown.sections.density.item.comfortable":
    "Komfortabel",
  "designlab.showcase.component.dropdown.sections.density.item.relaxed":
    "Entspannt",
  "designlab.showcase.component.dropdown.sections.density.sectionBadge":
    "rechts ausgerichtet",
  "designlab.showcase.component.dropdown.sections.density.panelPolicy":
    "Policy-Hinweis",
  "designlab.showcase.component.dropdown.sections.density.policyNote":
    "Halte Dichte- und Layout-Selector leichtgewichtig. Fur strukturierende Einstellungen eignet sich eher ein Drawer oder Panel.",
  "designlab.showcase.component.formDrawer.sections.create.eyebrow":
    "Alternative 01",
  "designlab.showcase.component.formDrawer.sections.create.title":
    "Form-Drawer / Create-Flow",
  "designlab.showcase.component.formDrawer.sections.create.description":
    "Slide-over fur neue Eintrage oder schnelle Bearbeitung, wenn der Seitenkontext sichtbar bleiben soll.",
  "designlab.showcase.component.formDrawer.sections.create.badge.drawer":
    "drawer",
  "designlab.showcase.component.formDrawer.sections.create.badge.stable":
    "stabil",
  "designlab.showcase.component.formDrawer.sections.create.badge.form":
    "formular",
  "designlab.showcase.component.formDrawer.sections.create.panelEditor":
    "Create- / Edit-Panel",
  "designlab.showcase.component.formDrawer.sections.create.open":
    "Drawer fur neuen Eintrag",
  "designlab.showcase.component.formDrawer.sections.create.sectionBadge":
    "slide-over",
  "designlab.showcase.component.formDrawer.sections.create.card.title":
    "Neuer Eintrag",
  "designlab.showcase.component.formDrawer.sections.create.card.nameLabel":
    "Eintragsname",
  "designlab.showcase.component.formDrawer.sections.create.card.densityLabel":
    "Dichte",
  "designlab.showcase.component.formDrawer.sections.create.card.option.compact":
    "Kompakt",
  "designlab.showcase.component.formDrawer.sections.create.card.option.comfortable":
    "Komfortabel",
  "designlab.showcase.component.formDrawer.sections.create.panelGuideline":
    "Leitlinie",
  "designlab.showcase.component.formDrawer.sections.create.guideline":
    "Form-Drawer eignen sich fur fokussierte Eingaben mit sichtbarem Seitenkontext. Lange, komplexe Workflows besser auf eigene Seiten heben.",
  "designlab.showcase.component.formDrawer.sections.readonly.eyebrow":
    "Alternative 02",
  "designlab.showcase.component.formDrawer.sections.readonly.title":
    "Schreibgeschutzter / policy-begrenzter Form-Drawer",
  "designlab.showcase.component.formDrawer.sections.readonly.description":
    "Readonly-Drawer fur policy-gesperrte Datensatze, Audit-Kontext oder kontrollierte Freigabeschritte.",
  "designlab.showcase.component.formDrawer.sections.readonly.badge.readonly":
    "readonly",
  "designlab.showcase.component.formDrawer.sections.readonly.badge.policy":
    "policy",
  "designlab.showcase.component.formDrawer.sections.readonly.badge.drawer":
    "drawer",
  "designlab.showcase.component.formDrawer.sections.readonly.panelState":
    "Readonly-Zustand",
  "designlab.showcase.component.formDrawer.sections.readonly.open":
    "Readonly-Drawer",
  "designlab.showcase.component.formDrawer.sections.readonly.sectionBadge":
    "policy-locked",
  "designlab.showcase.component.formDrawer.sections.readonly.card.title":
    "Readonly-Datensatz",
  "designlab.showcase.component.formDrawer.sections.readonly.card.nameLabel":
    "Eintragsname",
  "designlab.showcase.component.formDrawer.sections.readonly.card.nameValue":
    "Readonly-Datensatz",
  "designlab.showcase.component.formDrawer.sections.readonly.card.note":
    "Bearbeitung ist gesperrt, bis die Freigabeentscheidung dokumentiert wurde.",
  "designlab.showcase.component.formDrawer.sections.readonly.panelRule":
    "Faustregel",
  "designlab.showcase.component.formDrawer.sections.readonly.rule":
    "Readonly-Drawer eignen sich fur kontrollierte Reviews. Sobald echte Bearbeitung notig ist, sollte der Status bewusst freigegeben werden.",
  "designlab.showcase.component.recommendationCard.sections.rollout.eyebrow":
    "Variante 01",
  "designlab.showcase.component.recommendationCard.sections.rollout.title":
    "Rollout-Empfehlungskarte",
  "designlab.showcase.component.recommendationCard.sections.rollout.description":
    "Empfehlungskarte fur Release-Entscheidungen mit Begrundung, Confidence-Signalen und klaren Folgeaktionen.",
  "designlab.showcase.component.recommendationCard.sections.rollout.badge.ai":
    "ki",
  "designlab.showcase.component.recommendationCard.sections.rollout.badge.rollout":
    "ausrollung",
  "designlab.showcase.component.recommendationCard.sections.rollout.badge.confidence":
    "confidence",
  "designlab.showcase.component.recommendationCard.sections.rollout.panelInteractive":
    "Interaktive Entscheidungskarte",
  "designlab.showcase.component.recommendationCard.sections.rollout.card.title":
    "Forms-Welle ist bereit fur den Rollout",
  "designlab.showcase.component.recommendationCard.sections.rollout.card.summary":
    "Wave Gate, Doctor und Policy-Signale sind grun. Das Paket kann nach dem letzten Board-Check freigegeben werden.",
  "designlab.showcase.component.recommendationCard.sections.rollout.card.type":
    "Ausrollung",
  "designlab.showcase.component.recommendationCard.sections.rollout.card.rationale.waveGate":
    "wave gate PASS",
  "designlab.showcase.component.recommendationCard.sections.rollout.card.rationale.doctor":
    "doctor Nachweis ist sauber",
  "designlab.showcase.component.recommendationCard.sections.rollout.card.rationale.security":
    "Rest-Risiko ist geregelt",
  "designlab.showcase.component.recommendationCard.sections.rollout.card.footerNote":
    "Entscheidungsstatus: {state}",
  "designlab.showcase.component.recommendationCard.sections.rollout.panelSummary":
    "Entscheidungszusammenfassung",
  "designlab.showcase.component.recommendationCard.sections.rollout.summary.label":
    "Aktuelle Entscheidung",
  "designlab.showcase.component.recommendationCard.sections.rollout.summary.note":
    "Zeigt, wie die Empfehlung in den aktuellen Freigabezustand ubergeht.",
  "designlab.showcase.component.recommendationCard.sections.readonly.eyebrow":
    "Variante 02",
  "designlab.showcase.component.recommendationCard.sections.readonly.title":
    "Schreibgeschutzte Governance-Empfehlung",
  "designlab.showcase.component.recommendationCard.sections.readonly.description":
    "Readonly-Variante fur Hinweise mit hohem Policy-Einfluss und verpflichtendem Human Checkpoint.",
  "designlab.showcase.component.recommendationCard.sections.readonly.badge.readonly":
    "schreibgeschuetzt",
  "designlab.showcase.component.recommendationCard.sections.readonly.badge.governance":
    "steuerung",
  "designlab.showcase.component.recommendationCard.sections.readonly.badge.advisory":
    "hinweis",
  "designlab.showcase.component.recommendationCard.sections.readonly.panelCard":
    "Readonly-Karte",
  "designlab.showcase.component.recommendationCard.sections.readonly.card.title":
    "Manuelle Freigabe erforderlich",
  "designlab.showcase.component.recommendationCard.sections.readonly.card.summary":
    "Die Empfehlung bleibt sichtbar, kann aber ohne dokumentierte Freigabe nicht ubernommen werden.",
  "designlab.showcase.component.recommendationCard.sections.readonly.card.type":
    "Hinweis",
  "designlab.showcase.component.recommendationCard.sections.readonly.card.rationale.policy":
    "hoher Policy-Einfluss",
  "designlab.showcase.component.recommendationCard.sections.readonly.card.rationale.humanCheckpoint":
    "Human Checkpoint erforderlich",
  "designlab.showcase.component.recommendationCard.sections.readonly.panelReasoning":
    "Begrundungsflache",
  "designlab.showcase.component.recommendationCard.sections.readonly.reasoning":
    "Nutze diese Variante, wenn die KI nur einordnet und der Mensch die finale Entscheidung dokumentiert.",
  "designlab.showcase.component.recommendationCard.sections.queue.eyebrow":
    "Alternative 03",
  "designlab.showcase.component.recommendationCard.sections.queue.title":
    "Kompakte Queue-Karte",
  "designlab.showcase.component.recommendationCard.sections.queue.description":
    "Verdichtete Darstellung fur Triage-Queues mit wenig Platz und schneller Priorisierung.",
  "designlab.showcase.component.recommendationCard.sections.queue.badge.compact":
    "kompakt",
  "designlab.showcase.component.recommendationCard.sections.queue.badge.queue":
    "warteschlange",
  "designlab.showcase.component.recommendationCard.sections.queue.badge.triage":
    "vorauswahl",
  "designlab.showcase.component.recommendationCard.sections.queue.itemSummary":
    "Zeigt den nachsten Empfehlungstitel mit kompakter Dichte an.",
  "designlab.showcase.component.recommendationCard.sections.queue.itemType":
    "Queue-Eintrag",
  "designlab.showcase.component.recommendationCard.sections.queue.items.security.title":
    "SECURITY-Empfehlung",
  "designlab.showcase.component.recommendationCard.sections.queue.items.security.badge":
    "sicherheit",
  "designlab.showcase.component.recommendationCard.sections.queue.items.release.title":
    "RELEASE-Empfehlung",
  "designlab.showcase.component.recommendationCard.sections.queue.items.release.badge":
    "freigabe",
  "designlab.showcase.component.recommendationCard.sections.queue.items.ux.title":
    "UX-Empfehlung",
  "designlab.showcase.component.recommendationCard.sections.queue.items.ux.badge":
    "ux",
  "designlab.showcase.component.confidenceBadge.sections.matrix.eyebrow":
    "Variante 01",
  "designlab.showcase.component.confidenceBadge.sections.matrix.title":
    "Vertrauensmatrix",
  "designlab.showcase.component.confidenceBadge.sections.matrix.description":
    "Zeigt alle Confidence-Stufen zusammen mit einer kurzen Leselogik fur Governance- und AI-Flachen.",
  "designlab.showcase.component.confidenceBadge.sections.matrix.badge.matrix":
    "matrix",
  "designlab.showcase.component.confidenceBadge.sections.matrix.badge.explainability":
    "erklarbarkeit",
  "designlab.showcase.component.confidenceBadge.sections.matrix.badge.score":
    "bewertung",
  "designlab.showcase.component.confidenceBadge.sections.matrix.panelAllLevels":
    "Alle Stufen",
  "designlab.showcase.component.confidenceBadge.sections.matrix.panelGuidance":
    "Lesehilfe",
  "designlab.showcase.component.confidenceBadge.sections.matrix.guidance":
    "Nutze hohe Werte fur direkte Vorschlage und niedrigere Werte fur Eskalation, Review oder zusatzliche Nachweise.",
  "designlab.showcase.component.confidenceBadge.sections.compact.eyebrow":
    "Alternative 02",
  "designlab.showcase.component.confidenceBadge.sections.compact.title":
    "Kompakte Inline-Nutzung",
  "designlab.showcase.component.confidenceBadge.sections.compact.description":
    "Kompakte Badges fur dichte Tabellen, Header oder Review-Zeilen.",
  "designlab.showcase.component.confidenceBadge.sections.compact.badge.compact":
    "kompakt",
  "designlab.showcase.component.confidenceBadge.sections.compact.badge.inline":
    "eingebettet",
  "designlab.showcase.component.confidenceBadge.sections.compact.badge.denseUi":
    "dense-ui",
  "designlab.showcase.component.confidenceBadge.sections.compact.panelBadges":
    "Kompakte Badges",
  "designlab.showcase.component.confidenceBadge.sections.compact.manualReviewLabel":
    "Manuelles Review",
  "designlab.showcase.component.confidenceBadge.sections.compact.panelEmbedding":
    "Header-Einbettung",
  "designlab.showcase.component.confidenceBadge.sections.compact.embeddingTitle":
    "KI-Vorschlag",
  "designlab.showcase.component.confidenceBadge.sections.governed.eyebrow":
    "Alternative 03",
  "designlab.showcase.component.confidenceBadge.sections.governed.title":
    "Access- und Transparenzzustande",
  "designlab.showcase.component.confidenceBadge.sections.governed.description":
    "Readonly-, no-score- und benutzerdefinierte Label-Zustande fur governte Systeme.",
  "designlab.showcase.component.confidenceBadge.sections.governed.badge.readonly":
    "schreibgeschuetzt",
  "designlab.showcase.component.confidenceBadge.sections.governed.badge.transparency":
    "transparenz",
  "designlab.showcase.component.confidenceBadge.sections.governed.badge.governed":
    "gesteuert",
  "designlab.showcase.component.confidenceBadge.sections.governed.panelReadonly":
    "Nur-Lesen",
  "designlab.showcase.component.confidenceBadge.sections.governed.panelNoScore":
    "Ohne Score",
  "designlab.showcase.component.confidenceBadge.sections.governed.panelCustomLabel":
    "Benutzerdefiniertes Label",
  "designlab.showcase.component.confidenceBadge.sections.governed.customLabel":
    "Eskalieren",
  "designlab.showcase.component.approvalCheckpoint.sections.interactive.eyebrow":
    "Variante 01",
  "designlab.showcase.component.approvalCheckpoint.sections.interactive.title":
    "Interaktiver Freigabe-Checkpoint",
  "designlab.showcase.component.approvalCheckpoint.sections.interactive.description":
    "Freigabepunkt mit klaren Ownern, Frist und Entscheidungsstatus fur produktionsnahe Hand-offs.",
  "designlab.showcase.component.approvalCheckpoint.sections.interactive.badge.approval":
    "freigabe",
  "designlab.showcase.component.approvalCheckpoint.sections.interactive.badge.governance":
    "steuerung",
  "designlab.showcase.component.approvalCheckpoint.sections.interactive.badge.humanInLoop":
    "mensch-in-der-schleife",
  "designlab.showcase.component.approvalCheckpoint.sections.interactive.panelControlled":
    "Gesteuerter Checkpoint",
  "designlab.showcase.component.approvalCheckpoint.sections.interactive.card.title":
    "Freigabe fur Produktions-Release",
  "designlab.showcase.component.approvalCheckpoint.sections.interactive.card.summary":
    "Vor dem Veroffentlichen muss das Board die finale Entscheidung dokumentieren.",
  "designlab.showcase.component.approvalCheckpoint.sections.interactive.card.approverLabel":
    "Plattformgremium",
  "designlab.showcase.component.approvalCheckpoint.sections.interactive.card.dueLabel":
    "Vor dem Publish",
  "designlab.showcase.component.approvalCheckpoint.sections.interactive.card.footerNote":
    "Entscheidung: {state}",
  "designlab.showcase.component.approvalCheckpoint.sections.interactive.panelSummary":
    "Entscheidungszusammenfassung",
  "designlab.showcase.component.approvalCheckpoint.sections.interactive.summary.label":
    "Freigabestatus",
  "designlab.showcase.component.approvalCheckpoint.sections.interactive.summary.note":
    "Zeigt, ob der menschliche Checkpoint bereits freigegeben, abgelehnt oder noch offen ist.",
  "designlab.showcase.component.approvalCheckpoint.sections.readonly.eyebrow":
    "Alternative 02",
  "designlab.showcase.component.approvalCheckpoint.sections.readonly.title":
    "Schreibgeschutzte Review-Queue",
  "designlab.showcase.component.approvalCheckpoint.sections.readonly.description":
    "Readonly-Queue-Eintrag fur kontrollierte Reviews, bei denen nur Evidence sichtbar bleibt.",
  "designlab.showcase.component.approvalCheckpoint.sections.readonly.badge.readonly":
    "schreibgeschuetzt",
  "designlab.showcase.component.approvalCheckpoint.sections.readonly.badge.queue":
    "warteschlange",
  "designlab.showcase.component.approvalCheckpoint.sections.readonly.badge.review":
    "pruefung",
  "designlab.showcase.component.approvalCheckpoint.sections.readonly.panelQueueItem":
    "Readonly-Queue-Eintrag",
  "designlab.showcase.component.approvalCheckpoint.sections.readonly.card.title":
    "Readonly-Queue-Karte",
  "designlab.showcase.component.approvalCheckpoint.sections.readonly.card.summary":
    "Die Karte bleibt sichtbar, wahrend echte Entscheidungen im externen Governance-Prozess erfasst werden.",
  "designlab.showcase.component.approvalCheckpoint.sections.readonly.panelGovernance":
    "Governance-Hinweis",
  "designlab.showcase.component.approvalCheckpoint.sections.readonly.governanceNote":
    "Nutze diese Variante, wenn die Oberflache nur den Review-Kontext zeigt und keine Aktion ausfuhren darf.",
  "designlab.showcase.component.citationPanel.live.interactive.panel":
    "Interaktive Zitate",
  "designlab.showcase.component.citationPanel.live.interactive.metric.panel":
    "Ausgewahltes Zitat",
  "designlab.showcase.component.citationPanel.live.interactive.metric.label":
    "Aktives Zitat",
  "designlab.showcase.component.citationPanel.live.interactive.metric.empty":
    "Keine Quelle ausgewahlt",
  "designlab.showcase.component.citationPanel.sections.sourceTransparency.eyebrow":
    "Alternative 01",
  "designlab.showcase.component.citationPanel.sections.sourceTransparency.title":
    "Panel fur Quellentransparenz",
  "designlab.showcase.component.citationPanel.sections.sourceTransparency.description":
    "Policy-, UX- und Doctor-Evidenz werden in einem Panel gelesen, wahrend die ausgewahlte Quelle hervorgehoben wird.",
  "designlab.showcase.component.citationPanel.sections.sourceTransparency.badge.sources":
    "quellen",
  "designlab.showcase.component.citationPanel.sections.sourceTransparency.badge.transparency":
    "transparenz",
  "designlab.showcase.component.citationPanel.sections.sourceTransparency.badge.citations":
    "zitate",
  "designlab.showcase.component.citationPanel.sections.sourceTransparency.panelSelectable":
    "Wahlbare Quellen",
  "designlab.showcase.component.citationPanel.sections.sourceTransparency.panelSelected":
    "Ausgewahlte Quelle",
  "designlab.showcase.component.citationPanel.sections.sourceTransparency.contextTitle":
    "Zitatkontext",
  "designlab.showcase.component.citationPanel.sections.sourceTransparency.context.labelActive":
    "Aktiv",
  "designlab.showcase.component.citationPanel.sections.sourceTransparency.context.labelSource":
    "Quelle",
  "designlab.showcase.component.citationPanel.sections.readonly.eyebrow":
    "Alternative 02",
  "designlab.showcase.component.citationPanel.sections.readonly.title":
    "Schreibgeschutzte Referenzflache",
  "designlab.showcase.component.citationPanel.sections.readonly.description":
    "Das Quellenpanel bietet keine Aktionen an, bewahrt aber Zitat- und Locator-Details.",
  "designlab.showcase.component.citationPanel.sections.readonly.badge.readonly":
    "schreibgeschuetzt",
  "designlab.showcase.component.citationPanel.sections.readonly.badge.reference":
    "referenz",
  "designlab.showcase.component.citationPanel.sections.readonly.badge.governed":
    "gesteuert",
  "designlab.showcase.component.citationPanel.sections.readonly.panelReadonly":
    "Schreibgeschutzte Zitate",
  "designlab.showcase.component.citationPanel.sections.readonly.panelUsage":
    "Nutzungshinweis",
  "designlab.showcase.component.citationPanel.sections.readonly.usageNote":
    "Das Citation Panel wird als dasselbe Primitive in Recommendation- und Approval-Flachen wiederverwendet.",
  "designlab.showcase.component.aiActionAuditTimeline.live.interactive.panel":
    "Interaktive Audit-Zeitleiste",
  "designlab.showcase.component.aiActionAuditTimeline.live.interactive.details.panel":
    "Ausgewahltes Ereignis",
  "designlab.showcase.component.aiActionAuditTimeline.live.interactive.details.title":
    "Audit-Ereignis",
  "designlab.showcase.component.aiActionAuditTimeline.live.interactive.details.labelSelected":
    "Ausgewahlt",
  "designlab.showcase.component.aiActionAuditTimeline.live.interactive.details.labelActor":
    "Akteur",
  "designlab.showcase.component.aiActionAuditTimeline.live.interactive.details.labelStatus":
    "Status",
  "designlab.showcase.component.aiActionAuditTimeline.sections.interactive.eyebrow":
    "Alternative 01",
  "designlab.showcase.component.aiActionAuditTimeline.sections.interactive.title":
    "Interaktive Audit-Spur",
  "designlab.showcase.component.aiActionAuditTimeline.sections.interactive.description":
    "KI-Aktionen, menschliche Reviews und Systemereignisse werden uber ein gemeinsames Zeitleisten-Primitive gelesen.",
  "designlab.showcase.component.aiActionAuditTimeline.sections.interactive.badge.audit":
    "pruefspur",
  "designlab.showcase.component.aiActionAuditTimeline.sections.interactive.badge.timeline":
    "zeitachse",
  "designlab.showcase.component.aiActionAuditTimeline.sections.interactive.badge.observability":
    "beobachtbarkeit",
  "designlab.showcase.component.aiActionAuditTimeline.sections.interactive.panelSelectable":
    "Wahlbare Zeitleiste",
  "designlab.showcase.component.aiActionAuditTimeline.sections.interactive.panelSelected":
    "Ausgewahltes Ereignis",
  "designlab.showcase.component.aiActionAuditTimeline.sections.interactive.metric.label":
    "Ereignis",
  "designlab.showcase.component.aiActionAuditTimeline.sections.interactive.metric.empty":
    "Kein Eintrag ausgewahlt",
  "designlab.showcase.component.aiActionAuditTimeline.sections.readonly.eyebrow":
    "Alternative 02",
  "designlab.showcase.component.aiActionAuditTimeline.sections.readonly.title":
    "Schreibgeschutztes Nachweisprotokoll",
  "designlab.showcase.component.aiActionAuditTimeline.sections.readonly.description":
    "Im Readonly-Modus wird die Zeitleiste als Audit-Evidenz ohne Auswahl verwendet.",
  "designlab.showcase.component.aiActionAuditTimeline.sections.readonly.badge.readonly":
    "schreibgeschuetzt",
  "designlab.showcase.component.aiActionAuditTimeline.sections.readonly.badge.evidence":
    "nachweis",
  "designlab.showcase.component.aiActionAuditTimeline.sections.readonly.badge.history":
    "historie",
  "designlab.showcase.component.aiActionAuditTimeline.sections.readonly.panelReadonly":
    "Schreibgeschutzte Historie",
  "designlab.showcase.component.aiActionAuditTimeline.sections.readonly.panelAuditNote":
    "Audit-Hinweis",
  "designlab.showcase.component.aiActionAuditTimeline.sections.readonly.auditNote":
    "Dieser Block kann mit demselben Verhalten auf Approval-, Recommendation- und Release-Seiten wiederverwendet werden.",
  "designlab.showcase.component.promptComposer.live.controlled.panel":
    "Gesteuerte Prompt-Erstellung",
  "designlab.showcase.component.promptComposer.live.controlled.footerNote":
    "Wenn Prompt-Ausgaben in die Release Note einfliessen, sollten sie mit menschlicher Freigabe kombiniert werden.",
  "designlab.showcase.component.promptComposer.live.summary.panel":
    "Prompt-Zusammenfassung",
  "designlab.showcase.component.promptComposer.live.summary.subject.label":
    "Betreff",
  "designlab.showcase.component.promptComposer.live.summary.subject.note":
    "Zweck des Prompts",
  "designlab.showcase.component.promptComposer.live.summary.scope.label":
    "Umfang",
  "designlab.showcase.component.promptComposer.live.summary.scope.note":
    "Ausfuhrungsgrenze",
  "designlab.showcase.component.promptComposer.live.summary.tone.label": "Ton",
  "designlab.showcase.component.promptComposer.live.summary.tone.note":
    "Nachrichtendisziplin",
  "designlab.showcase.component.promptComposer.sections.controlled.eyebrow":
    "Alternative 01",
  "designlab.showcase.component.promptComposer.sections.controlled.title":
    "Gesteuerte Prompt-Erstellung",
  "designlab.showcase.component.promptComposer.sections.controlled.description":
    "Prompt-Betreff, Text, Umfang und Ton werden uber ein gemeinsames Composer-Primitive gesteuert.",
  "designlab.showcase.component.promptComposer.sections.controlled.badge.prompt":
    "eingabe",
  "designlab.showcase.component.promptComposer.sections.controlled.badge.controlled":
    "gesteuert",
  "designlab.showcase.component.promptComposer.sections.controlled.badge.guardrails":
    "leitplanken",
  "designlab.showcase.component.promptComposer.sections.controlled.panelComposer":
    "Interaktiver Composer",
  "designlab.showcase.component.promptComposer.sections.controlled.panelState":
    "Live-Zustand",
  "designlab.showcase.component.promptComposer.sections.controlled.state.label":
    "Umfang",
  "designlab.showcase.component.promptComposer.sections.controlled.state.note":
    "Ton: {tone}",
  "designlab.showcase.component.promptComposer.sections.readonly.eyebrow":
    "Alternative 02",
  "designlab.showcase.component.promptComposer.sections.readonly.title":
    "Schreibgeschutzter Review-Modus",
  "designlab.showcase.component.promptComposer.sections.readonly.description":
    "Der Prompt-Entwurf wird mit demselben Component gepruft, kann aber nicht verandert werden.",
  "designlab.showcase.component.promptComposer.sections.readonly.badge.readonly":
    "schreibgeschuetzt",
  "designlab.showcase.component.promptComposer.sections.readonly.badge.review":
    "prufung",
  "designlab.showcase.component.promptComposer.sections.readonly.badge.prompt":
    "eingabe",
  "designlab.showcase.component.promptComposer.sections.readonly.panelReadonly":
    "Schreibgeschutzter Composer",
  "designlab.showcase.component.promptComposer.sections.readonly.panelContract":
    "Vertragshinweis",
  "designlab.showcase.component.promptComposer.sections.readonly.footerNote":
    "Schreibgeschutzter Review-Modus",
  "designlab.showcase.component.promptComposer.sections.readonly.contractNote":
    "Prompt Composer macht Scope- und Tone-Leitplanken sichtbar statt nur eine freie Textflache zu zeigen.",
  "designlab.showcase.component.descriptions.live.rolloutSummary.panel":
    "Rollout-Zusammenfassung",
  "designlab.showcase.component.descriptions.live.rolloutSummary.title":
    "Canary-Zusammenfassung",
  "designlab.showcase.component.descriptions.live.rolloutSummary.description":
    "Rollout-Owner, Umfang und Review-Snapshot in einem Block.",
  "designlab.showcase.component.descriptions.live.rolloutSummary.items.owner.label":
    "Verantwortlich",
  "designlab.showcase.component.descriptions.live.rolloutSummary.items.owner.value":
    "Compliance Operations",
  "designlab.showcase.component.descriptions.live.rolloutSummary.items.owner.helper":
    "Das Team ist fuer Canary- und Rollout-Entscheidungen verantwortlich.",
  "designlab.showcase.component.descriptions.live.rolloutSummary.items.scope.label":
    "Umfang",
  "designlab.showcase.component.descriptions.live.rolloutSummary.items.scope.value":
    "Alle Tochtergesellschaften",
  "designlab.showcase.component.descriptions.live.rolloutSummary.items.status.label":
    "Status",
  "designlab.showcase.component.descriptions.live.rolloutSummary.items.status.value":
    "Aktiv",
  "designlab.showcase.component.descriptions.live.rolloutSummary.items.review.label":
    "Letzte Pruefung",
  "designlab.showcase.component.descriptions.live.rolloutSummary.items.review.helper":
    "Mit dem Change-Approval-Snapshot abgeglichen.",
  "designlab.showcase.component.descriptions.live.riskApproval.panel":
    "Risiko-/Freigabepanel",
  "designlab.showcase.component.descriptions.live.riskApproval.title":
    "Risiko und Freigabe",
  "designlab.showcase.component.descriptions.live.riskApproval.items.risk.label":
    "Risikostufe",
  "designlab.showcase.component.descriptions.live.riskApproval.items.risk.value":
    "Mittel",
  "designlab.showcase.component.descriptions.live.riskApproval.items.approval.label":
    "Freigabefluss",
  "designlab.showcase.component.descriptions.live.riskApproval.items.approval.value":
    "2/3 abgeschlossen",
  "designlab.showcase.component.descriptions.live.riskApproval.items.approval.helper":
    "Security-Sign-off steht noch aus.",
  "designlab.showcase.component.descriptions.shared.ticketLabel": "Change-ID",
  "designlab.showcase.component.descriptions.sections.rolloutSummary.eyebrow":
    "Variante 01",
  "designlab.showcase.component.descriptions.sections.rolloutSummary.title":
    "Rollout-, Owner- und Umfangsuebersicht",
  "designlab.showcase.component.descriptions.sections.rolloutSummary.description":
    "Fuehrt Owner, Umfang, Review und Status in einer schnell lesbaren Key-Value-Flaeche zusammen.",
  "designlab.showcase.component.descriptions.sections.rolloutSummary.badge.summary":
    "zusammenfassung",
  "designlab.showcase.component.descriptions.sections.rolloutSummary.badge.beta":
    "beta",
  "designlab.showcase.component.descriptions.sections.rolloutSummary.badge.rollout":
    "rollout",
  "designlab.showcase.component.descriptions.sections.rolloutSummary.panelPrimary":
    "Primaere Zusammenfassung",
  "designlab.showcase.component.descriptions.sections.rolloutSummary.cardTitle":
    "Canary-Zusammenfassung",
  "designlab.showcase.component.descriptions.sections.rolloutSummary.cardDescription":
    "Rollout-Owner, Umfang und Review-Snapshot in einem Block.",
  "designlab.showcase.component.descriptions.sections.rolloutSummary.panelInterpretation":
    "Interpretation",
  "designlab.showcase.component.descriptions.sections.rolloutSummary.interpretation":
    "`Descriptions` standardisiert wiederkehrende Label-Wert-Gruppen ueber Drawer-, Detail- und Freigabeflaechen hinweg.",
  "designlab.showcase.component.descriptions.sections.compliancePanel.eyebrow":
    "Variante 02",
  "designlab.showcase.component.descriptions.sections.compliancePanel.title":
    "Risiko- und Freigabepanels",
  "designlab.showcase.component.descriptions.sections.compliancePanel.description":
    "Traegt Risiko-, Freigabe- und Kontroll-Snapshots mit tonsensitiven Informationskarten.",
  "designlab.showcase.component.descriptions.sections.compliancePanel.badge.risk":
    "risiko",
  "designlab.showcase.component.descriptions.sections.compliancePanel.badge.approval":
    "freigabe",
  "designlab.showcase.component.descriptions.sections.compliancePanel.badge.compact":
    "kompakt",
  "designlab.showcase.component.descriptions.sections.compliancePanel.panelApproval":
    "Freigabe",
  "designlab.showcase.component.descriptions.sections.compliancePanel.approvalTitle":
    "Risiko und Freigabe",
  "designlab.showcase.component.descriptions.sections.compliancePanel.panelOwnership":
    "Verantwortung",
  "designlab.showcase.component.descriptions.sections.compliancePanel.ownershipTitle":
    "Operative Zusammenfassung",
  "designlab.showcase.component.descriptions.sections.compliancePanel.ownership.items.owner.label":
    "Verantwortlich",
  "designlab.showcase.component.descriptions.sections.compliancePanel.ownership.items.owner.value":
    "Platform UX",
  "designlab.showcase.component.descriptions.sections.compliancePanel.ownership.items.window.label":
    "Zeitfenster",
  "designlab.showcase.component.descriptions.sections.compliancePanel.ownership.items.window.value":
    "Samstag 22:00",
  "designlab.showcase.component.descriptions.sections.compliancePanel.ownership.items.signoff.label":
    "Sign-off",
  "designlab.showcase.component.descriptions.sections.compliancePanel.ownership.items.signoff.value":
    "Bereit",
  "designlab.showcase.component.list.live.inbox.panel":
    "Operativer Posteingang",
  "designlab.showcase.component.list.live.inbox.title":
    "Release-Arbeitswarteschlange",
  "designlab.showcase.component.list.live.inbox.description":
    "Priorisierte Rollout- und Evidenzaufgaben werden auf derselben Flaeche nachverfolgt.",
  "designlab.showcase.component.list.live.compact.panel": "Kompakt auswaehlbar",
  "designlab.showcase.component.list.live.compact.title": "Kompakte Pruefung",
  "designlab.showcase.component.list.live.queue.items.triage.title":
    "Release-Evidenz-Triage",
  "designlab.showcase.component.list.live.queue.items.triage.description":
    "Das Publish-Fenster oeffnet sich erst, wenn Security- und Rollout-Evidenz vollstaendig sind.",
  "designlab.showcase.component.list.live.queue.items.triage.badge":
    "Blockiert",
  "designlab.showcase.component.list.live.queue.items.doctor.title":
    "Frontend-Doctor-Zusammenfassung",
  "designlab.showcase.component.list.live.queue.items.doctor.description":
    "UI-Library-, shell-public- und auth-route-Presets werden in einem Bericht gebuendelt.",
  "designlab.showcase.component.list.live.queue.items.doctor.badge": "Diagnose",
  "designlab.showcase.component.list.live.queue.items.residual.title":
    "Pruefung Restrisiko",
  "designlab.showcase.component.list.live.queue.items.residual.description":
    "Bereite den Update-Plan vor, bevor der Termin zur Jackson-Restreview erreicht ist.",
  "designlab.showcase.component.list.live.queue.items.residual.badge":
    "Sicherheit",
  "designlab.showcase.component.list.sections.operationalInbox.eyebrow":
    "Variante 01",
  "designlab.showcase.component.list.sections.operationalInbox.title":
    "Operativer Posteingang / Aufgabenliste",
  "designlab.showcase.component.list.sections.operationalInbox.description":
    "Kombiniert Prioritaet, Metadaten und Badges auf einer Listenflaeche.",
  "designlab.showcase.component.list.sections.operationalInbox.badge.taskList":
    "aufgabenliste",
  "designlab.showcase.component.list.sections.operationalInbox.badge.selection":
    "auswahl",
  "designlab.showcase.component.list.sections.operationalInbox.badge.beta":
    "beta",
  "designlab.showcase.component.list.sections.operationalInbox.panelQueue":
    "Pruefwarteschlange",
  "designlab.showcase.component.list.sections.operationalInbox.listTitle":
    "Deployment-Arbeitswarteschlange",
  "designlab.showcase.component.list.sections.operationalInbox.listDescription":
    "Security-, Doctor- und Rollout-Evidenz sind auf einer Flaeche lesbar.",
  "designlab.showcase.component.list.sections.operationalInbox.panelWhy":
    "Warum das wichtig ist",
  "designlab.showcase.component.list.sections.operationalInbox.why":
    "`List` fuehrt Auswahl, Badges und Metadaten in leichtgewichtigen, aber zustandsbehafteten Aufgabenablaeufen zusammen, ohne eine Tabelle zu oeffnen.",
  "designlab.showcase.component.list.sections.priorityReview.eyebrow":
    "Variante 02",
  "designlab.showcase.component.list.sections.priorityReview.title":
    "Prioritaets-/Review-Statusmatrix",
  "designlab.showcase.component.list.sections.priorityReview.description":
    "Macht kompakte Dichte, blockierte Eintraege und Ton-Unterschiede sichtbar.",
  "designlab.showcase.component.list.sections.priorityReview.badge.compact":
    "kompakt",
  "designlab.showcase.component.list.sections.priorityReview.badge.priority":
    "prioritaet",
  "designlab.showcase.component.list.sections.priorityReview.badge.tone": "ton",
  "designlab.showcase.component.list.sections.priorityReview.panelCompact":
    "Kompakte Liste",
  "designlab.showcase.component.list.sections.priorityReview.panelLoadingEmpty":
    "Laden und leer",
  "designlab.showcase.component.list.sections.priorityReview.loadingTitle":
    "Warteschlange wird geladen",
  "designlab.showcase.component.list.sections.priorityReview.emptyTitle":
    "Leere Warteschlange",
  "designlab.showcase.component.list.sections.priorityReview.emptyState":
    "Keine Aufgaben zum Anzeigen.",
  "designlab.showcase.component.jsonViewer.live.releasePayload.panel":
    "Freigabe-Evidenzdaten",
  "designlab.showcase.component.jsonViewer.live.releasePayload.title":
    "Wellenzusammenfassung",
  "designlab.showcase.component.jsonViewer.live.releasePayload.description":
    "Macht Gate- und Doctor-Evidenz ohne Debug-Screen lesbar.",
  "designlab.showcase.component.jsonViewer.live.policySnapshot.panel":
    "Richtlinien-Snapshot",
  "designlab.showcase.component.jsonViewer.live.policySnapshot.title":
    "Richtliniendaten",
  "designlab.showcase.component.jsonViewer.live.policySnapshot.description":
    "Schreibgeschuetzte Oberflaeche fuer operative Richtlinienvertraege.",
  "designlab.showcase.component.jsonViewer.live.policy.rollout.mode":
    "doctor-zuerst",
  "designlab.showcase.component.jsonViewer.live.policy.rollout.security":
    "fail-closed",
  "designlab.showcase.component.jsonViewer.live.policy.owners.frontend":
    "platform-ui",
  "designlab.showcase.component.jsonViewer.live.policy.owners.governance":
    "ux-katalog",
  "designlab.showcase.component.jsonViewer.sections.releasePayload.eyebrow":
    "Variante 01",
  "designlab.showcase.component.jsonViewer.sections.releasePayload.title":
    "Freigabe-Evidenzdaten",
  "designlab.showcase.component.jsonViewer.sections.releasePayload.description":
    "Zeigt Wave-Gate- und Doctor-Zusammenfassung als lesbaren, geschichteten JSON-Baum.",
  "designlab.showcase.component.jsonViewer.sections.releasePayload.badge.payload":
    "Nutzlast",
  "designlab.showcase.component.jsonViewer.sections.releasePayload.badge.audit":
    "audit",
  "designlab.showcase.component.jsonViewer.sections.releasePayload.badge.beta":
    "beta",
  "designlab.showcase.component.jsonViewer.sections.releasePayload.panelPrimary":
    "Primaeres Payload",
  "designlab.showcase.component.jsonViewer.sections.releasePayload.cardTitle":
    "Wellenzusammenfassung",
  "designlab.showcase.component.jsonViewer.sections.releasePayload.cardDescription":
    "Gate- und Doctor-Evidenz werden im selben Payload nachverfolgt.",
  "designlab.showcase.component.jsonViewer.sections.releasePayload.panelUsage":
    "Nutzungshinweis",
  "designlab.showcase.component.jsonViewer.sections.releasePayload.usage":
    "`JsonViewer` macht Vertrags-, Konfigurations- und Evidenz-Payloads fuer Endnutzer lesbar, ohne wie ein Debug-Panel zu wirken.",
  "designlab.showcase.component.jsonViewer.sections.policyConfig.eyebrow":
    "Variante 02",
  "designlab.showcase.component.jsonViewer.sections.policyConfig.title":
    "Richtlinien-/Konfigurations-Snapshot",
  "designlab.showcase.component.jsonViewer.sections.policyConfig.description":
    "Kompakte Darstellung fuer schmalere, schreibgeschuetzte Konfigurations-Snapshots.",
  "designlab.showcase.component.jsonViewer.sections.policyConfig.badge.policy":
    "richtlinie",
  "designlab.showcase.component.jsonViewer.sections.policyConfig.badge.config":
    "konfiguration",
  "designlab.showcase.component.jsonViewer.sections.policyConfig.badge.readonly":
    "schreibgeschuetzt",
  "designlab.showcase.component.jsonViewer.sections.policyConfig.panelPolicy":
    "Richtlinien-Snapshot",
  "designlab.showcase.component.jsonViewer.sections.policyConfig.policyTitle":
    "Richtlinie",
  "designlab.showcase.component.jsonViewer.sections.policyConfig.panelEmpty":
    "Leer / undefiniert",
  "designlab.showcase.component.jsonViewer.sections.policyConfig.undefinedTitle":
    "Undefinierter Payload",
  "designlab.showcase.component.jsonViewer.sections.policyConfig.emptyState":
    "Payload nicht empfangen.",
  "designlab.showcase.component.jsonViewer.sections.policyConfig.primitiveTitle":
    "Grundbaustein-Daten",
  "designlab.showcase.component.tree.live.hierarchy.panel":
    "Operative Hierarchie",
  "designlab.showcase.component.tree.live.hierarchy.title": "Lieferhierarchie",
  "designlab.showcase.component.tree.live.hierarchy.description":
    "Liest Gate- und Richtlinienverantwortung in einer gemeinsamen Hierarchie.",
  "designlab.showcase.component.tree.live.readonly.panel":
    "Schreibgeschuetzte Pruefung",
  "designlab.showcase.component.tree.live.readonly.title":
    "Schreibgeschuetzte Pruefung",
  "designlab.showcase.component.tree.live.release.label":
    "Freigabe-Kontrollbereich",
  "designlab.showcase.component.tree.live.release.description":
    "Buendelt Gate-, Doctor- und Sicherheitsevidenz in einer Hierarchie.",
  "designlab.showcase.component.tree.live.release.meta": "wurzel",
  "designlab.showcase.component.tree.live.release.badge": "karriere",
  "designlab.showcase.component.tree.live.doctor.label": "Doctor-Evidenz",
  "designlab.showcase.component.tree.live.doctor.description":
    "Ausgaben des Frontend-Doctor-Presets.",
  "designlab.showcase.component.tree.live.doctorUiLibrary.label":
    "UI-Library-Rundgang",
  "designlab.showcase.component.tree.live.doctorUiLibrary.description":
    "Console-, pageerror- und Klickablauf-Ergebnisse sind sauber.",
  "designlab.showcase.component.tree.live.doctorUiLibrary.meta": "5 schritte",
  "designlab.showcase.component.tree.live.doctorShell.label":
    "Oeffentliches Shell-Preset",
  "designlab.showcase.component.tree.live.doctorShell.description":
    "Login- und Public-Route-Kette ist PASS.",
  "designlab.showcase.component.tree.live.doctorShell.meta": "3 routen",
  "designlab.showcase.component.tree.live.security.label": "Sicherheitsvertrag",
  "designlab.showcase.component.tree.live.security.description":
    "Restrisiko- und Live-Provisioning-Regeln.",
  "designlab.showcase.component.tree.live.security.meta": "pruefung",
  "designlab.showcase.component.tree.live.security.badge": "richtlinie",
  "designlab.showcase.component.tree.live.securityResidual.label":
    "Restrisikopruefung",
  "designlab.showcase.component.tree.live.securityResidual.description":
    "Verbleibende terminierte Risiken werden ueber eine Pflichtpruefung nachverfolgt.",
  "designlab.showcase.component.tree.sections.releaseGovernance.eyebrow":
    "Variante 01",
  "designlab.showcase.component.tree.sections.releaseGovernance.title":
    "Freigabe-/Governance-Hierarchie",
  "designlab.showcase.component.tree.sections.releaseGovernance.description":
    "Verfolgt Doctor-, Sicherheits- und Richtlinienablaeufe in einer hierarchischen Baumansicht.",
  "designlab.showcase.component.tree.sections.releaseGovernance.badge.tree":
    "baum",
  "designlab.showcase.component.tree.sections.releaseGovernance.badge.hierarchy":
    "hierarchie",
  "designlab.showcase.component.tree.sections.releaseGovernance.badge.beta":
    "beta",
  "designlab.showcase.component.tree.sections.releaseGovernance.panelHierarchy":
    "Hierarchie",
  "designlab.showcase.component.tree.sections.releaseGovernance.cardTitle":
    "Freigabehierarchie",
  "designlab.showcase.component.tree.sections.releaseGovernance.panelUsage":
    "Nutzungshinweis",
  "designlab.showcase.component.tree.sections.releaseGovernance.usage":
    "`Tree` bildet Freigabeablauf, Rollout-Verantwortung und Richtlinienaufschluesselung ab, ohne das Hierarchiegefuehl zu verlieren.",
  "designlab.showcase.component.tree.sections.readonlyAudit.eyebrow":
    "Variante 02",
  "designlab.showcase.component.tree.sections.readonlyAudit.title":
    "Schreibgeschuetzter Audit-Baum",
  "designlab.showcase.component.tree.sections.readonlyAudit.description":
    "Zeigt schreibgeschuetzten Zustand, kompakte Dichte und ausgewaehltes Knotenverhalten zusammen.",
  "designlab.showcase.component.tree.sections.readonlyAudit.badge.readonly":
    "schreibgeschuetzt",
  "designlab.showcase.component.tree.sections.readonlyAudit.badge.compact":
    "kompakt",
  "designlab.showcase.component.tree.sections.readonlyAudit.badge.audit":
    "audit",
  "designlab.showcase.component.tree.sections.readonlyAudit.panelReadonly":
    "Schreibgeschuetzter Baum",
  "designlab.showcase.component.tree.sections.readonlyAudit.panelLoadingEmpty":
    "Laden und leer",
  "designlab.showcase.component.tree.sections.readonlyAudit.loadingTitle":
    "Baum wird geladen",
  "designlab.showcase.component.tree.sections.readonlyAudit.emptyTitle":
    "Leerer Baum",
  "designlab.showcase.component.tree.sections.readonlyAudit.emptyState":
    "Hierarchie nicht gefunden.",
  "designlab.showcase.component.treeTable.shared.columns.owner":
    "Verantwortlich",
  "designlab.showcase.component.treeTable.shared.columns.status": "Status",
  "designlab.showcase.component.treeTable.shared.columns.scope": "Umfang",
  "designlab.showcase.component.treeTable.live.ownershipMatrix.panel":
    "Verantwortungsmatrix",
  "designlab.showcase.component.treeTable.live.ownershipMatrix.title":
    "Komponentenverantwortung",
  "designlab.showcase.component.treeTable.live.ownershipMatrix.description":
    "Liest Verantwortlich, Status und Umfang mit hierarchischen Zeilen.",
  "designlab.showcase.component.treeTable.live.compactReview.panel":
    "Kompakte Pruefung",
  "designlab.showcase.component.treeTable.live.compactReview.title":
    "Kompakte Matrix",
  "designlab.showcase.component.treeTable.live.platformUi.label": "Platform UI",
  "designlab.showcase.component.treeTable.live.platformUi.description":
    "Verantwortliches Kernteam des Designsystems.",
  "designlab.showcase.component.treeTable.live.platformUi.meta": "karriere",
  "designlab.showcase.component.treeTable.live.platformUi.badge":
    "verantwortlich",
  "designlab.showcase.component.treeTable.live.platformUi.data.owner":
    "Platform UI",
  "designlab.showcase.component.treeTable.live.platformUi.data.status":
    "Karriere",
  "designlab.showcase.component.treeTable.live.platformUi.data.scope": "Global",
  "designlab.showcase.component.treeTable.live.uiLibrarySurface.label":
    "UI Library",
  "designlab.showcase.component.treeTable.live.uiLibrarySurface.description":
    "Docs-, Preview- und API-Katalogflaeche.",
  "designlab.showcase.component.treeTable.live.uiLibrarySurface.badge":
    "datenanzeige",
  "designlab.showcase.component.treeTable.live.uiLibrarySurface.data.owner":
    "Tasarim Operasyonlari",
  "designlab.showcase.component.treeTable.live.uiLibrarySurface.data.status":
    "Beta",
  "designlab.showcase.component.treeTable.live.uiLibrarySurface.data.scope":
    "Dokumentation",
  "designlab.showcase.component.treeTable.live.deliveryGates.label":
    "Liefer-Gates",
  "designlab.showcase.component.treeTable.live.deliveryGates.description":
    "Wellen-Gate- und Doctor-Evidenzkette.",
  "designlab.showcase.component.treeTable.live.deliveryGates.badge": "qa",
  "designlab.showcase.component.treeTable.live.deliveryGates.data.owner":
    "Yayin Operasyonlari",
  "designlab.showcase.component.treeTable.live.deliveryGates.data.scope":
    "Lieferung",
  "designlab.showcase.component.treeTable.sections.ownershipMatrix.eyebrow":
    "Variante 01",
  "designlab.showcase.component.treeTable.sections.ownershipMatrix.title":
    "Verantwortungsmatrix",
  "designlab.showcase.component.treeTable.sections.ownershipMatrix.description":
    "TreeTable kombiniert Verantwortlich-/Status-/Umfangsdaten mit hierarchischen Zeilen.",
  "designlab.showcase.component.treeTable.sections.ownershipMatrix.badge.matrix":
    "matrix",
  "designlab.showcase.component.treeTable.sections.ownershipMatrix.badge.hierarchy":
    "hierarchie",
  "designlab.showcase.component.treeTable.sections.ownershipMatrix.badge.beta":
    "beta",
  "designlab.showcase.component.treeTable.sections.ownershipMatrix.panelMatrix":
    "Verantwortungsmatrix",
  "designlab.showcase.component.treeTable.sections.ownershipMatrix.panelUsage":
    "Nutzungshinweis",
  "designlab.showcase.component.treeTable.sections.ownershipMatrix.usage":
    "`TreeTable` vergleicht Spalten, ohne Hierarchie in Entitaets- oder Verantwortungsbaeumen zu verlieren.",
  "designlab.showcase.component.treeTable.sections.compactReview.eyebrow":
    "Variante 02",
  "designlab.showcase.component.treeTable.sections.compactReview.title":
    "Kompakte Pruefmatrix",
  "designlab.showcase.component.treeTable.sections.compactReview.description":
    "Zeigt kompakte Dichte, ausgewaehlte Zeilen und Loading-/Empty-Fallback gemeinsam.",
  "designlab.showcase.component.treeTable.sections.compactReview.badge.compact":
    "kompakt",
  "designlab.showcase.component.treeTable.sections.compactReview.badge.selected":
    "ausgewaehlt",
  "designlab.showcase.component.treeTable.sections.compactReview.badge.fallback":
    "fallback",
  "designlab.showcase.component.treeTable.sections.compactReview.panelCompact":
    "Kompakte Tabelle",
  "designlab.showcase.component.treeTable.sections.compactReview.panelLoadingEmpty":
    "Laden und leer",
  "designlab.showcase.component.treeTable.sections.compactReview.loadingTitle":
    "Matrix wird geladen",
  "designlab.showcase.component.treeTable.sections.compactReview.emptyTitle":
    "Leere Matrix",
  "designlab.showcase.component.treeTable.sections.compactReview.emptyState":
    "Kein hierarchischer Tabelleneintrag.",
  "designlab.showcase.component.tableSimple.shared.columns.policy":
    "Richtlinie",
  "designlab.showcase.component.tableSimple.shared.columns.owner":
    "Verantwortlich",
  "designlab.showcase.component.tableSimple.shared.columns.status": "Status",
  "designlab.showcase.component.tableSimple.shared.columns.updatedAt":
    "Aktualisiert",
  "designlab.showcase.component.tableSimple.live.policyStatus.panel":
    "Richtlinienstatus-Tabelle",
  "designlab.showcase.component.tableSimple.live.policyStatus.caption":
    "Richtlinienportfolio",
  "designlab.showcase.component.tableSimple.live.policyStatus.description":
    "Leichtgewichtige Tabellenansicht mit Fokus auf Aufgaben.",
  "designlab.showcase.component.tableSimple.live.loadingEmpty.panel":
    "Laden + Leer",
  "designlab.showcase.component.tableSimple.live.loadingEmpty.loadingCaption":
    "Tabelle wird geladen",
  "designlab.showcase.component.tableSimple.live.loadingEmpty.emptyCaption":
    "Leere Tabelle",
  "designlab.showcase.component.tableSimple.live.loadingEmpty.emptyState":
    "Noch keine veroeffentlichten Daten.",
  "designlab.showcase.component.tableSimple.live.rows.ethics.policy":
    "Ethikrichtlinie",
  "designlab.showcase.component.tableSimple.live.rows.ethics.owner":
    "Compliance",
  "designlab.showcase.component.tableSimple.live.rows.ethics.status": "Aktiv",
  "designlab.showcase.component.tableSimple.live.rows.gifts.policy":
    "Geschenke und Bewirtung",
  "designlab.showcase.component.tableSimple.live.rows.gifts.owner": "Recht",
  "designlab.showcase.component.tableSimple.live.rows.gifts.status": "Entwurf",
  "designlab.showcase.component.tableSimple.live.rows.conflict.policy":
    "Interessenkonflikt",
  "designlab.showcase.component.tableSimple.live.rows.conflict.owner":
    "People Operations",
  "designlab.showcase.component.tableSimple.live.rows.conflict.status":
    "Freigabe ausstehend",
  "designlab.showcase.component.tableSimple.sections.policyList.eyebrow":
    "Variante 01",
  "designlab.showcase.component.tableSimple.sections.policyList.title":
    "Tabelle fuer Richtlinie / Verantwortlich / Status",
  "designlab.showcase.component.tableSimple.sections.policyList.description":
    "Zeigt aufgabenkritische Richtlinienlisten in einer leichten, schnellen und gut lesbaren Tabellenhuelle.",
  "designlab.showcase.component.tableSimple.sections.policyList.badge.table":
    "tabelle",
  "designlab.showcase.component.tableSimple.sections.policyList.badge.beta":
    "beta",
  "designlab.showcase.component.tableSimple.sections.policyList.badge.status":
    "status",
  "designlab.showcase.component.tableSimple.sections.policyList.panelMatrix":
    "Richtlinienmatrix",
  "designlab.showcase.component.tableSimple.sections.policyList.caption":
    "Richtlinienportfolio",
  "designlab.showcase.component.tableSimple.sections.policyList.tableDescription":
    "Verantwortlich- und Statusfelder teilen sich dieselbe Tabellenflaeche.",
  "designlab.showcase.component.tableSimple.sections.policyList.panelGuidance":
    "Leitlinie",
  "designlab.showcase.component.tableSimple.sections.policyList.guidance":
    "`TableSimple` gibt Aufgabenlisten schnelles Rendern sowie einen Vertrag fuer Lade- und Leerzustand, ohne schwere Grid-Infrastruktur zu benoetigen.",
  "designlab.showcase.component.tableSimple.sections.loadingEmpty.eyebrow":
    "Variante 02",
  "designlab.showcase.component.tableSimple.sections.loadingEmpty.title":
    "Lade- und Leerzustaende",
  "designlab.showcase.component.tableSimple.sections.loadingEmpty.description":
    "Dasselbe Primitive behandelt Ladeskelette und leeres Tabellenverhalten ohne lokale Kopien.",
  "designlab.showcase.component.tableSimple.sections.loadingEmpty.badge.loading":
    "laden",
  "designlab.showcase.component.tableSimple.sections.loadingEmpty.badge.empty":
    "leer",
  "designlab.showcase.component.tableSimple.sections.loadingEmpty.badge.compact":
    "kompakt",
  "designlab.showcase.component.tableSimple.sections.loadingEmpty.panelLoading":
    "Laden",
  "designlab.showcase.component.tableSimple.sections.loadingEmpty.loadingCaption":
    "Tabelle wird geladen",
  "designlab.showcase.component.tableSimple.sections.loadingEmpty.panelEmpty":
    "Leer",
  "designlab.showcase.component.tableSimple.sections.loadingEmpty.emptyCaption":
    "Leere Tabelle",
  "designlab.showcase.component.tableSimple.sections.loadingEmpty.emptyState":
    "Noch keine Eintraege zum Anzeigen.",
  "designlab.componentContracts.entityGridTemplate.exportFileBaseName": "daten",
  "designlab.componentContracts.entityGridTemplate.exportSheetName": "Daten",
  "designlab.componentContracts.entityGridTemplate.variantOptionGlobalLabel":
    "Systemweit",
  "designlab.componentContracts.entityGridTemplate.variantOptionGlobalDefaultLabel":
    "Systemweit Standard",
  "designlab.componentContracts.entityGridTemplate.variantOptionDefaultLabel":
    "Standard",
  "designlab.componentContracts.entityGridTemplate.variantOptionIncompatibleLabel":
    "Inkompatibel",
  "designlab.componentContracts.entityGridTemplate.selectedVariantNotFoundLabel":
    "Die ausgewaehlte Variante wurde nicht gefunden.",
  "designlab.componentContracts.entityGridTemplate.selectedVariantIncompatibleLabel":
    "Diese Variante ist mit der aktuellen Grid-Struktur nicht kompatibel.",
  "designlab.componentContracts.entityGridTemplate.variantSaveBlockedLabel":
    "Diese Variante kann nicht gespeichert werden, weil sie inkompatibel ist.",
  "designlab.componentContracts.entityGridTemplate.variantSavedLabel":
    "Variante gespeichert.",
  "designlab.componentContracts.entityGridTemplate.variantSaveFailedLabel":
    "Variante konnte nicht gespeichert werden.",
  "designlab.componentContracts.entityGridTemplate.variantNameEmptyLabel":
    "Der Variantenname darf nicht leer sein.",
  "designlab.componentContracts.entityGridTemplate.variantNameUpdatedLabel":
    "Variantenname aktualisiert.",
  "designlab.componentContracts.entityGridTemplate.variantNameUpdateFailedLabel":
    "Der Variantenname konnte nicht aktualisiert werden.",
  "designlab.componentContracts.entityGridTemplate.variantPromotedToGlobalLabel":
    "Die Variante wird jetzt systemweit geteilt.",
  "designlab.componentContracts.entityGridTemplate.variantDemotedToPersonalLabel":
    "Die Variante ist jetzt nur noch persoenlich.",
  "designlab.componentContracts.entityGridTemplate.variantGlobalStatusUpdateFailedLabel":
    "Der globale Status der Variante konnte nicht aktualisiert werden.",
  "designlab.componentContracts.entityGridTemplate.globalDefaultEnabledLabel":
    "Globaler Standard aktualisiert.",
  "designlab.componentContracts.entityGridTemplate.globalDefaultDisabledLabel":
    "Globaler Standard entfernt.",
  "designlab.componentContracts.entityGridTemplate.globalDefaultUpdateFailedLabel":
    "Der globale Standard konnte nicht aktualisiert werden.",
  "designlab.componentContracts.entityGridTemplate.newVariantNameEmptyLabel":
    "Der Name der neuen Variante darf nicht leer sein.",
  "designlab.componentContracts.entityGridTemplate.variantCreatedLabel":
    "Variante erstellt.",
  "designlab.componentContracts.entityGridTemplate.variantCreateFailedLabel":
    "Variante konnte nicht erstellt werden.",
  "designlab.componentContracts.entityGridTemplate.defaultViewEnabledLabel":
    "Als Standardansicht markiert.",
  "designlab.componentContracts.entityGridTemplate.defaultViewDisabledLabel":
    "Aus der Standardansicht entfernt.",
  "designlab.componentContracts.entityGridTemplate.defaultStateUpdateFailedLabel":
    "Der Standardstatus konnte nicht aktualisiert werden.",
  "designlab.componentContracts.entityGridTemplate.globalVariantUserDefaultEnabledLabel":
    "Die globale Variante wurde zu deinem Standard.",
  "designlab.componentContracts.entityGridTemplate.globalVariantUserDefaultDisabledLabel":
    "Die globale Variante wurde aus deinen Standards entfernt.",
  "designlab.componentContracts.entityGridTemplate.variantPreferenceUpdateFailedLabel":
    "Die Variantenpraeferenz konnte nicht aktualisiert werden.",
  "designlab.componentContracts.entityGridTemplate.variantCorruptedStateLabel":
    "Die gespeicherte Grid-Ansicht ist beschaedigt und konnte nicht angewendet werden.",
  "designlab.componentContracts.entityGridTemplate.deleteVariantConfirmationLabel":
    "Moechtest du die Ansicht mit dem Namen {name} wirklich loeschen?",
  "designlab.componentContracts.entityGridTemplate.variantDeletedLabel":
    "Variante geloescht.",
  "designlab.componentContracts.entityGridTemplate.variantDeleteFailedLabel":
    "Variante konnte nicht geloescht werden.",
  "designlab.componentContracts.entityGridTemplate.menuSelectLabel":
    "Ansicht anwenden",
  "designlab.componentContracts.entityGridTemplate.menuRenameLabel":
    "Umbenennen",
  "designlab.componentContracts.entityGridTemplate.menuUnsetDefaultLabel":
    "Aus meinen Standards entfernen",
  "designlab.componentContracts.entityGridTemplate.menuSetDefaultLabel":
    "Zu meinem Standard machen",
  "designlab.componentContracts.entityGridTemplate.menuUnsetGlobalDefaultLabel":
    "Globalen Standard entfernen",
  "designlab.componentContracts.entityGridTemplate.menuSetGlobalDefaultLabel":
    "Zum globalen Standard machen",
  "designlab.componentContracts.entityGridTemplate.menuMoveToPersonalLabel":
    "In persoenlich verschieben",
  "designlab.componentContracts.entityGridTemplate.menuMoveToGlobalLabel":
    "Systemweit freigeben",
  "designlab.componentContracts.entityGridTemplate.menuDeleteLabel": "Loeschen",
  "designlab.componentContracts.entityGridTemplate.saveLabel": "Speichern",
  "designlab.componentContracts.entityGridTemplate.cancelLabel": "Abbrechen",
  "designlab.componentContracts.entityGridTemplate.selectedTagLabel":
    "Aktuell ausgewaehlt",
  "designlab.componentContracts.entityGridTemplate.globalPublicDefaultTagLabel":
    "Geteilt · Standard",
  "designlab.componentContracts.entityGridTemplate.globalPublicTagLabel":
    "Geteilt",
  "designlab.componentContracts.entityGridTemplate.personalTagLabel":
    "Persoenlich",
  "designlab.componentContracts.entityGridTemplate.personalDefaultTagLabel":
    "Mein persoenlicher Standard",
  "designlab.componentContracts.entityGridTemplate.recentlyUsedTagLabel":
    "Zuletzt verwendet",
  "designlab.componentContracts.entityGridTemplate.incompatibleTagLabel":
    "Inkompatibel",
  "designlab.componentContracts.entityGridTemplate.hideDetailsLabel":
    "Details ausblenden",
  "designlab.componentContracts.entityGridTemplate.showDetailsLabel":
    "Details anzeigen",
  "designlab.componentContracts.entityGridTemplate.variantActionsLabel":
    "Variantenaktionen",
  "designlab.componentContracts.entityGridTemplate.moveToPersonalTitle":
    "Diese Variante in den persoenlichen Bereich verschieben",
  "designlab.componentContracts.entityGridTemplate.moveToGlobalTitle":
    "Diese Variante fuer alle Benutzer freigeben",
  "designlab.componentContracts.entityGridTemplate.saveCurrentLayoutTitle":
    "Das aktuelle Grid-Layout in dieser Variante speichern",
  "designlab.componentContracts.entityGridTemplate.saveCurrentStateLabel":
    "Status speichern",
  "designlab.componentContracts.entityGridTemplate.personalDefaultSwitchLabel":
    "Mein persoenlicher Standard",
  "designlab.componentContracts.entityGridTemplate.globalDefaultSwitchLabel":
    "Globaler Standard",
  "designlab.componentContracts.entityGridTemplate.newVariantToPersonalTitle":
    "In eine persoenliche Variante umwandeln",
  "designlab.componentContracts.entityGridTemplate.newVariantToGlobalTitle":
    "Als globale Variante erstellen",
  "designlab.componentContracts.entityGridTemplate.newVariantUnsetGlobalDefaultTitle":
    "Globalen Standard entfernen",
  "designlab.componentContracts.entityGridTemplate.newVariantSetGlobalDefaultTitle":
    "Zum globalen Standard machen",
  "designlab.componentContracts.entityGridTemplate.newVariantUnsetPersonalDefaultTitle":
    "Persoenlichen Standard entfernen",
  "designlab.componentContracts.entityGridTemplate.newVariantSetPersonalDefaultTitle":
    "Zum persoenlichen Standard machen",
  "designlab.componentContracts.entityGridTemplate.saveTitle": "Speichern",
  "designlab.componentContracts.entityGridTemplate.localeText.to": "bis",
  "designlab.componentContracts.entityGridTemplate.localeText.andCondition":
    "Und",
  "designlab.componentContracts.entityGridTemplate.localeText.orCondition":
    "Oder",
  "designlab.componentContracts.entityGridTemplate.localeText.rowGroupPanel":
    "Gruppen",
  "designlab.componentContracts.entityGridTemplate.localeText.dropZoneColumnGroup":
    "Spalten hierher ziehen, um Zeilen zu gruppieren",
  "designlab.componentContracts.entityGridTemplate.localeText.rowGroupColumnsEmptyMessage":
    "Spalten hierher ziehen, um Zeilen zu gruppieren",
  "designlab.componentContracts.entityGridTemplate.localeText.dragHereToSetColumnRowGroup":
    "Spalten hierher ziehen, um Zeilen zu gruppieren",
  "designlab.componentContracts.entityGridTemplate.localeText.dragHereToSetRowGroup":
    "Spalten hierher ziehen, um Zeilen zu gruppieren",
  "designlab.componentContracts.entityGridTemplate.localeText.dragHereToSetColumnValues":
    "Spalten hierher ziehen, um Werte zu berechnen",
  "designlab.componentContracts.entityGridTemplate.localeText.dropZoneColumnValue":
    "Spalten hierher ziehen, um Werte zu berechnen",
  "designlab.componentContracts.entityGridTemplate.localeText.advancedFilter":
    "Erweiterter Filter",
  "designlab.componentContracts.entityGridTemplate.localeText.advancedFilterBuilder":
    "Erweiterter Filter",
  "designlab.componentContracts.entityGridTemplate.localeText.advancedFilterButtonTooltip":
    "Erweiterten Filter oeffnen",
  "designlab.componentContracts.entityGridTemplate.localeText.advancedFilterBuilderAdd":
    "Bedingung hinzufuegen",
  "designlab.componentContracts.entityGridTemplate.localeText.advancedFilterBuilderRemove":
    "Entfernen",
  "designlab.componentContracts.entityGridTemplate.localeText.advancedFilterJoinOperator":
    "Verknuepfung",
  "designlab.componentContracts.entityGridTemplate.localeText.advancedFilterAnd":
    "UND",
  "designlab.componentContracts.entityGridTemplate.localeText.advancedFilterOr":
    "ODER",
  "designlab.componentContracts.entityGridTemplate.localeText.advancedFilterValidationMissingColumn":
    "Spalte auswaehlen",
  "designlab.componentContracts.entityGridTemplate.localeText.advancedFilterValidationMissingOption":
    "Operator auswaehlen",
  "designlab.componentContracts.entityGridTemplate.localeText.advancedFilterValidationMissingValue":
    "Wert eingeben",
  "designlab.componentContracts.entityGridTemplate.localeText.advancedFilterApply":
    "Anwenden",
  "designlab.showcase.component.tabs.controlled.title": "Gesteuerte Tabs",
  "designlab.showcase.component.tabs.controlled.overview.label": "Uebersicht",
  "designlab.showcase.component.tabs.controlled.overview.title":
    "Release-Cockpit",
  "designlab.showcase.component.tabs.controlled.overview.description":
    "Verfolge Release-Bereitschaft, Aktivitaetssignale und Adoption auf derselben Flaeche.",
  "designlab.showcase.component.tabs.controlled.activity.label": "Aktivitaet",
  "designlab.showcase.component.tabs.controlled.activity.title":
    "Aktivitaetsstrom",
  "designlab.showcase.component.tabs.controlled.activity.description":
    "Pruefe aktuelle Navigation, Nutzeraktionen und Zustandswechsel innerhalb desselben Tab-Vertrags.",
  "designlab.showcase.component.tabs.controlled.settings.label":
    "Einstellungen",
  "designlab.showcase.component.tabs.manual.title": "Manuelle vertikale Tabs",
  "designlab.showcase.component.tabs.manual.tokens.label": "Token",
  "designlab.showcase.component.tabs.manual.tokens.description":
    "Design-Token-Pruefung",
  "designlab.showcase.component.tabs.manual.tokens.content":
    "Pruefe Abstands-, Radius- und Farbvertraege in einer manuellen vertikalen Tab-Ansicht.",
  "designlab.showcase.component.tabs.manual.density.label": "Dichte",
  "designlab.showcase.component.tabs.manual.density.content":
    "Wechsle zwischen kompakter und komfortabler Darstellung, ohne die Container-Struktur zu aendern.",
  "designlab.showcase.component.tabs.manual.motion.label": "Bewegung",
  "designlab.showcase.component.tabs.manual.motion.content":
    "Halte Reduced-Motion- und Animationshinweise in derselben gesteuerten Navigationsflaeche.",
};

export default designlab;
