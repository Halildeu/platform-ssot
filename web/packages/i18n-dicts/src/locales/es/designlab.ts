import enDesignLab from "../en/designlab";

const designlab = {
  ...enDesignLab,
  "designlab.workspace.components": "Componentes",
  "designlab.workspace.recipes": "Recetas",
  "designlab.sidebar.title.components": "Catalogo de componentes",
  "designlab.sidebar.title.recipes": "Catalogo de recetas",
  "designlab.sidebar.help.components":
    "Recorre el mismo arbol con las secciones de fundamentos, componentes, flujos, paginas, experiencias AI y gobernanza.",
  "designlab.sidebar.help.recipes":
    "Filtra familias de recetas con las mismas secciones principales. La insignia de cada tarjeta muestra el hogar semantico de la receta, mientras que la seccion seleccionada arriba muestra la vista actual.",
  "designlab.sidebar.tooltip.components":
    "Ayuda del explorador del sistema de diseno",
  "designlab.sidebar.tooltip.recipes": "Ayuda del explorador de recetas",
  "designlab.sidebar.section.title": "Secciones principales",
  "designlab.rightRail.open": "Abrir panel derecho",
  "designlab.rightRail.close": "Cerrar panel derecho",
  "designlab.taxonomy.sections.foundations.title": "Fundamentos",
  "designlab.taxonomy.sections.foundations.description":
    "Theme, tokens, motion y el contrato base de apariencia del sistema.",
  "designlab.taxonomy.sections.components.title": "Componentes",
  "designlab.taxonomy.sections.components.description":
    "Una biblioteca UI completa con primitives, formularios, colecciones, overlays y feedback.",
  "designlab.taxonomy.sections.patterns.title": "Flujos",
  "designlab.taxonomy.sections.patterns.description":
    "Flujos de datos repetibles, extensiones de grid y recetas de solucion multi-componente.",
  "designlab.taxonomy.sections.templates.title": "Paginas",
  "designlab.taxonomy.sections.templates.description":
    "Esqueletos de pagina, layouts y superficies de trabajo amplias.",
  "designlab.taxonomy.sections.visualization.title": "Visualizacion de datos",
  "designlab.taxonomy.sections.visualization.description":
    "Graficos, dashboards y superficies de presentacion analitica.",
  "designlab.taxonomy.sections.ai_ux.title": "Experiencias AI",
  "designlab.taxonomy.sections.ai_ux.description":
    "Prompts, confidence, citas y flujos asistidos nativos de AI.",
  "designlab.taxonomy.sections.content_language.title": "Contenido y Lenguaje",
  "designlab.taxonomy.sections.content_language.description":
    "Accesibilidad, reglas de idioma, localizacion y comportamiento del contenido.",
  "designlab.taxonomy.sections.governance.title": "Lanzamiento y Gobernanza",
  "designlab.taxonomy.sections.governance.description":
    "Release, diagnostics, migration y superficies de gobernanza operativa.",
  "designlab.taxonomy.badges.adapter": "Adaptador legacy",
  "designlab.taxonomy.adapterNotice.title":
    "Esta vista se abrio desde una entrada legacy de Design Lab.",
  "designlab.taxonomy.adapterNotice.description":
    "{source} ahora se resuelve mediante un adaptador dentro de la capa {target}.",
  "designlab.taxonomy.adapterNotice.cta.visualization":
    "Abrir Data Display & Collections",
  "designlab.taxonomy.adapterNotice.cta.ai_ux":
    "Abrir receta de AI Workflows",
  "designlab.sidebar.search.components.placeholder": "Buscar componentes...",
  "designlab.sidebar.search.recipes.placeholder": "Buscar recetas...",
  "designlab.sidebar.search.aria": "Buscar dentro de Design Lab",
  "designlab.sidebar.productTree.title": "Arbol de componentes",
  "designlab.sidebar.recipeList.title": "Recetas",
  "designlab.sidebar.recipe.count": "{count} receta",
  "designlab.sidebar.recipe.empty.search":
    'No se encontro ninguna receta para "{query}" dentro de {lens}.',
  "designlab.sidebar.recipe.empty.default":
    "No hay recetas disponibles dentro de {lens}.",
  "designlab.sidebar.recipe.empty.hint":
    "Prueba otra lente o limpia la busqueda para ver otras familias de recetas.",
  "designlab.breadcrumb.docs": "Documentacion",
  "designlab.breadcrumb.library": "Biblioteca UI",
  "designlab.hero.label.component": "Componente",
  "designlab.hero.label.recipe": "Receta",
  "designlab.hero.placeholder.component": "Seleccionar componente",
  "designlab.hero.placeholder.recipe": "Seleccionar receta",
  "designlab.hero.placeholder.description.component":
    "Selecciona un componente en el menu izquierdo para revisar demos en vivo y detalles de API y calidad.",
  "designlab.hero.placeholder.description.recipe":
    "Selecciona una receta en el menu izquierdo para revisar composiciones de pantalla canonicas.",
  "designlab.copy.success": "Copiado",
  "designlab.copy.failure": "Error al copiar",
  "designlab.tabs.general.description":
    "Identidad, estado del release y contexto rapido para decisiones",
  "designlab.tabs.demo.label": "Vista previa",
  "designlab.tabs.demo.description":
    "Demo en vivo y superficie de variantes en un unico workspace activo",
  "designlab.tabs.overview.label": "Resumen",
  "designlab.tabs.overview.description":
    "Resumen corto, estado y marco de decision",
  "designlab.tabs.api.description":
    "Import, props, ejes de variantes y modelo de estado",
  "designlab.tabs.ux.description":
    "Alineacion con el catalogo UX y enlaces north-star",
  "designlab.tabs.quality.label": "Calidad",
  "designlab.tabs.quality.description": "Gates, regresion y evidencia de uso",
  "designlab.componentContracts.spinner.label": "Cargando",
  "designlab.componentContracts.pagination.navigationLabel": "Paginacion",
  "designlab.componentContracts.pagination.previousButtonLabel": "Anterior",
  "designlab.componentContracts.pagination.nextButtonLabel": "Siguiente",
  "designlab.componentContracts.pagination.previousPageAriaLabel":
    "Pagina anterior",
  "designlab.componentContracts.pagination.nextPageAriaLabel":
    "Pagina siguiente",
  "designlab.componentContracts.pagination.pageAriaLabel": "Pagina {page}",
  "designlab.componentContracts.pagination.pageIndicatorLabel":
    "Pagina {currentPage} / {pageCount}",
  "designlab.componentContracts.pagination.totalItemsLabel":
    "{count} registros",
  "designlab.componentContracts.pagination.mode.server":
    "Modo del lado del servidor",
  "designlab.componentContracts.pagination.mode.client":
    "Modo del lado del cliente",
  "designlab.componentContracts.datePicker.emptyValueLabel":
    "Seleccionar fecha",
  "designlab.componentContracts.timePicker.emptyValueLabel": "Seleccionar hora",
  "designlab.componentContracts.tableSimple.emptyFallbackDescription":
    "No se encontraron registros.",
  "designlab.componentContracts.tree.emptyFallbackDescription":
    "No se encontraron registros.",
  "designlab.componentContracts.tree.expandNodeAriaLabel": "Expandir rama",
  "designlab.componentContracts.tree.collapseNodeAriaLabel": "Contraer rama",
  "designlab.componentContracts.treeTable.treeColumnLabel": "Estructura",
  "designlab.componentContracts.treeTable.emptyFallbackDescription":
    "No se encontraron registros.",
  "designlab.componentContracts.treeTable.expandNodeAriaLabel": "Expandir rama",
  "designlab.componentContracts.treeTable.collapseNodeAriaLabel":
    "Contraer rama",
  "designlab.componentContracts.contextMenu.buttonLabel": "Menu contextual",
  "designlab.componentContracts.contextMenu.contextTriggerHint":
    "Haz clic derecho para abrir el menu contextual",
  "designlab.componentContracts.contextMenu.menuAriaLabel": "Menu contextual",
  "designlab.componentContracts.tourCoachmarks.title": "Recorrido guiado",
  "designlab.componentContracts.tourCoachmarks.skipLabel": "Omitir",
  "designlab.componentContracts.tourCoachmarks.closeLabel": "Cerrar",
  "designlab.componentContracts.tourCoachmarks.previousLabel": "Atras",
  "designlab.componentContracts.tourCoachmarks.nextStepLabel": "Siguiente paso",
  "designlab.componentContracts.tourCoachmarks.finishLabel": "Finalizar",
  "designlab.componentContracts.tourCoachmarks.readonlyFinishLabel":
    "Recorrido completado",
  "designlab.componentContracts.agGridServer.loadingLabel": "Cargando...",
  "designlab.componentContracts.entityGridTemplate.defaultVariantName":
    "Variante sin titulo",
  "designlab.componentContracts.entityGridTemplate.quickFilterPlaceholder":
    "Buscar en todas las columnas...",
  "designlab.componentContracts.entityGridTemplate.themeLabel": "Tema",
  "designlab.componentContracts.entityGridTemplate.quickFilterLabel": "Filtro",
  "designlab.componentContracts.entityGridTemplate.variantLabel": "Variante",
  "designlab.componentContracts.entityGridTemplate.densityToggleLabel":
    "Densidad de filas",
  "designlab.componentContracts.entityGridTemplate.comfortableDensityLabel":
    "Comoda",
  "designlab.componentContracts.entityGridTemplate.compactDensityLabel":
    "Compacta",
  "designlab.componentContracts.entityGridTemplate.densityResetLabel":
    "Usar la configuracion global",
  "designlab.componentContracts.entityGridTemplate.fullscreenTooltip":
    "Abrir pantalla completa en una nueva pestana",
  "designlab.componentContracts.entityGridTemplate.resetFiltersLabel":
    "Restablecer filtros",
  "designlab.componentContracts.entityGridTemplate.excelVisibleLabel":
    "Excel (visible)",
  "designlab.componentContracts.entityGridTemplate.excelAllLabel":
    "Excel (todo)",
  "designlab.componentContracts.entityGridTemplate.csvVisibleLabel":
    "CSV (visible)",
  "designlab.componentContracts.entityGridTemplate.csvAllLabel": "CSV (todo)",
  "designlab.componentContracts.entityGridTemplate.variantModalTitle":
    "Gestor de variantes",
  "designlab.componentContracts.entityGridTemplate.variantNewButtonLabel":
    "Crear nueva variante",
  "designlab.componentContracts.entityGridTemplate.variantNamePlaceholder":
    "Nombre de la nueva variante",
  "designlab.componentContracts.entityGridTemplate.overlayLoadingLabel":
    "Cargando registros...",
  "designlab.componentContracts.entityGridTemplate.overlayNoRowsLabel":
    "No se encontraron registros",
  "designlab.componentContracts.entityGridTemplate.densityStatusUsingGlobal":
    "La densidad global esta activa.",
  "designlab.componentContracts.entityGridTemplate.densityStatusOverride":
    "Esta grilla usa una anulacion local de densidad.",
  "designlab.componentContracts.entityGridTemplate.gridNotReadyLabel":
    "La grilla todavia no esta lista.",
  "designlab.componentContracts.entityGridTemplate.resetFiltersSuccessLabel":
    "Los filtros se restablecieron.",
  "designlab.componentContracts.entityGridTemplate.pageSizeLabel":
    "Tamano de pagina:",
  "designlab.componentContracts.entityGridTemplate.recordCountLabel":
    "{start}-{end} / {total} registros",
  "designlab.componentContracts.entityGridTemplate.pageIndicatorLabel":
    "Pagina {currentPage} / {pageCount}",
  "designlab.componentContracts.entityGridTemplate.firstPageLabel":
    "Primera pagina",
  "designlab.componentContracts.entityGridTemplate.previousPageLabel":
    "Pagina anterior",
  "designlab.componentContracts.entityGridTemplate.nextPageLabel":
    "Pagina siguiente",
  "designlab.componentContracts.entityGridTemplate.lastPageLabel":
    "Ultima pagina",
  "designlab.componentContracts.entityGridTemplate.variantsLoadingOptionLabel":
    "Cargando variantes...",
  "designlab.componentContracts.entityGridTemplate.variantSelectOptionLabel":
    "Seleccionar variante...",
  "designlab.componentContracts.entityGridTemplate.clearVariantSelectionLabel":
    "Limpiar seleccion de variante",
  "designlab.componentContracts.entityGridTemplate.manageVariantsLabel":
    "Gestionar variantes",
  "designlab.componentContracts.entityGridTemplate.closeVariantManagerLabel":
    "Cerrar gestor de variantes",
  "designlab.componentContracts.entityGridTemplate.personalVariantsTitle":
    "Variantes personales",
  "designlab.componentContracts.entityGridTemplate.personalVariantsEmptyLabel":
    "Todavia no hay variantes personales.",
  "designlab.componentContracts.entityGridTemplate.globalVariantsTitle":
    "Variantes globales",
  "designlab.componentContracts.entityGridTemplate.globalVariantsEmptyLabel":
    "Todavia no hay variantes globales.",
  "designlab.componentContracts.entityGridTemplate.dismissToastLabel":
    "Cerrar notificacion",
  "designlab.componentContracts.entityGridTemplate.localeText.selectAll":
    "Seleccionar todo",
  "designlab.componentContracts.entityGridTemplate.localeText.searchOoo":
    "Buscar...",
  "designlab.componentContracts.entityGridTemplate.localeText.filterOoo":
    "Filtrar...",
  "designlab.componentContracts.entityGridTemplate.localeText.blanks":
    "(Vacio)",
  "designlab.componentContracts.entityGridTemplate.localeText.page": "Pagina",
  "designlab.componentContracts.entityGridTemplate.localeText.more": "Mas",
  "designlab.componentContracts.entityGridTemplate.localeText.of": "de",
  "designlab.componentContracts.entityGridTemplate.localeText.next":
    "Siguiente",
  "designlab.componentContracts.entityGridTemplate.localeText.last": "Ultima",
  "designlab.componentContracts.entityGridTemplate.localeText.first": "Primera",
  "designlab.componentContracts.entityGridTemplate.localeText.previous":
    "Anterior",
  "designlab.componentContracts.entityGridTemplate.localeText.columns":
    "Columnas",
  "designlab.componentContracts.entityGridTemplate.localeText.filters":
    "Filtros",
  "designlab.componentContracts.entityGridTemplate.localeText.collapseAll":
    "Contraer todo",
  "designlab.componentContracts.entityGridTemplate.localeText.expandAll":
    "Expandir todo",
  "designlab.componentContracts.entityGridTemplate.localeText.pinColumn":
    "Fijar columna",
  "designlab.componentContracts.entityGridTemplate.localeText.autosizeThisColumn":
    "Ajustar automaticamente esta columna",
  "designlab.componentContracts.entityGridTemplate.localeText.autosizeAllColumns":
    "Ajustar automaticamente todas las columnas",
  "designlab.componentContracts.entityGridTemplate.localeText.groupBy":
    "Agrupar por",
  "designlab.componentContracts.entityGridTemplate.localeText.resetColumns":
    "Restablecer columnas",
  "designlab.componentContracts.entityGridTemplate.localeText.resetFilters":
    "Restablecer filtros",
  "designlab.componentContracts.entityGridTemplate.localeText.toolPanelButton":
    "Panel de herramientas",
  "designlab.componentContracts.entityGridTemplate.localeText.columnMenuPin":
    "Fijada",
  "designlab.componentContracts.entityGridTemplate.localeText.columnMenuValue":
    "Valores",
  "designlab.componentContracts.entityGridTemplate.localeText.columnMenuGroup":
    "Grupos",
  "designlab.componentContracts.entityGridTemplate.localeText.columnMenuSort":
    "Ordenar",
  "designlab.componentContracts.entityGridTemplate.localeText.columnMenuFilter":
    "Filtrar",
  "designlab.componentContracts.entityGridTemplate.localeText.applyFilter":
    "Aplicar",
  "designlab.componentContracts.entityGridTemplate.localeText.clearFilter":
    "Limpiar",
  "designlab.componentContracts.entityGridTemplate.localeText.clearFilters":
    "Limpiar todos los filtros",
  "designlab.componentContracts.entityGridTemplate.localeText.equals":
    "Igual a",
  "designlab.componentContracts.entityGridTemplate.localeText.notEqual":
    "Distinto de",
  "designlab.componentContracts.entityGridTemplate.localeText.lessThan":
    "Menor que",
  "designlab.componentContracts.entityGridTemplate.localeText.lessThanOrEqual":
    "Menor o igual que",
  "designlab.componentContracts.entityGridTemplate.localeText.greaterThan":
    "Mayor que",
  "designlab.componentContracts.entityGridTemplate.localeText.greaterThanOrEqual":
    "Mayor o igual que",
  "designlab.componentContracts.entityGridTemplate.localeText.inRange":
    "Dentro del rango",
  "designlab.componentContracts.entityGridTemplate.localeText.contains":
    "Contiene",
  "designlab.componentContracts.entityGridTemplate.localeText.notContains":
    "No contiene",
  "designlab.componentContracts.entityGridTemplate.localeText.startsWith":
    "Empieza con",
  "designlab.componentContracts.entityGridTemplate.localeText.endsWith":
    "Termina con",
  "designlab.componentContracts.entityGridTemplate.localeText.blank": "Vacio",
  "designlab.componentContracts.entityGridTemplate.localeText.notBlank":
    "No vacio",
  "designlab.general.component.empty":
    "Selecciona un componente desde el menu izquierdo.",
  "designlab.general.recipe.empty":
    "Selecciona una receta desde el Explorador de recetas.",
  "designlab.general.component.title": "Resumen del componente",
  "designlab.general.component.description":
    "En lugar de una banda hero ancha, la identidad del componente, su estado rapido y la accion de importacion se agrupan aqui en una sola pestana.",
  "designlab.general.component.primarySummary": "Resumen principal",
  "designlab.general.component.import.action": "Copiar import",
  "designlab.general.component.releaseIdentity": "Lanzamiento e identidad",
  "designlab.general.component.primaryLens.note":
    "La lente principal de descubrimiento derivada del grupo de taxonomia del componente.",
  "designlab.general.component.package": "Paquete",
  "designlab.general.component.contractTags": "Contrato / etiquetas",
  "designlab.general.component.noTags": "Sin etiquetas",
  "designlab.general.recipe.title": "Resumen de la receta",
  "designlab.general.recipe.description":
    "La identidad de la receta, el conjunto de owner blocks y las senales rapidas de cobertura se recogen aqui en una sola pestana.",
  "designlab.general.recipe.identity": "Identidad de la receta",
  "designlab.general.recipe.primaryLens.note":
    "La lente principal de descubrimiento derivada de la intencion de la receta y de la composicion de owner blocks.",
  "designlab.general.recipe.tracksThemes": "Lineas y temas",
  "designlab.general.recipe.sectionsGates": "Secciones y gates",
  "designlab.general.recipe.noBindings": "No se encontraron vinculaciones",
  "designlab.metadata.primaryLens": "Lente principal",
  "designlab.metadata.track": "Linea",
  "designlab.metadata.group": "Grupo",
  "designlab.metadata.usage": "Uso",
  "designlab.metadata.ownerBlocks": "Bloques responsables",
  "designlab.metadata.tracks": "Lineas",
  "designlab.metadata.sections": "Secciones",
  "designlab.metadata.themes": "Temas",
  "designlab.metadata.mode.recipeExplorer": "Explorador de recetas",
  "designlab.metadata.mode.noSelection": "Sin seleccion",
  "designlab.metadata.notAvailable": "—",
  "designlab.track.newPackages.label": "Paquetes nuevos",
  "designlab.track.newPackages.note":
    "Nueva familia de componentes generada por el contrato de wave activo.",
  "designlab.track.currentSystem.label": "Sistema actual",
  "designlab.track.currentSystem.note":
    "Superficie exportada previamente que ya se consume en el repositorio.",
  "designlab.track.roadmap.label": "Hoja de ruta",
  "designlab.track.roadmap.note":
    "Backlog planificado de componentes que todavia no se exporta.",
  "designlab.usageRecipes.basic.title": "Uso basico",
  "designlab.usageRecipes.basic.description":
    "Receta de inicio segura con importacion de paquete y superficie minima de API.",
  "designlab.usageRecipes.controlled.title": "Estado controlado",
  "designlab.usageRecipes.controlled.description":
    "Patron de uso gestionado a traves del estado del formulario o del shell.",
  "designlab.usageRecipes.governed.title": "Nota de ops / calidad",
  "designlab.usageRecipes.governed.description":
    "Nota de uso alineada con wave gate, browser doctor y contrato de registry.",
  "designlab.overview.empty":
    "Selecciona un componente desde el menu izquierdo.",
  "designlab.overview.workspace.title": "Workspace de resumen",
  "designlab.overview.workspace.description":
    "Release, adopcion, migracion, contrato visual, theme y sistema de recetas se abren aqui como paneles de segundo nivel en lugar de apilarse en una sola pestana.",
  "designlab.overview.workspace.noPanels":
    "No hay paneles de resumen disponibles para este componente.",
  "designlab.common.tabbed": "Con pestanas",
  "designlab.common.panelCount": "{count} panel",
  "designlab.common.panelCountPlural": "{count} paneles",
  "designlab.component.api.empty":
    "Selecciona un componente para inspeccionar los detalles de la API.",
  "designlab.component.api.workspace.title": "Workspace de API",
  "designlab.component.api.workspace.description":
    "Import, modelo, props y uso se abren como paneles de segundo nivel en lugar de apilarse en una sola pestana larga.",
  "designlab.component.api.import": "Import",
  "designlab.component.api.import.planned":
    "Elemento planificado — import no disponible",
  "designlab.component.api.registryFields": "Campos de registry",
  "designlab.component.api.kind": "Tipo",
  "designlab.component.api.taxonomy": "Taxonomia",
  "designlab.component.api.subgroup": "Subgrupo",
  "designlab.component.api.track": "Linea",
  "designlab.component.api.model.title": "Modelo de API",
  "designlab.component.api.model.noCatalog":
    "Todavia no existe una entrada detallada del catalogo API para este componente.",
  "designlab.component.api.model.variantAxes": "Ejes de variantes",
  "designlab.component.api.model.stateModel": "Modelo de estado",
  "designlab.component.api.model.previewFocus": "Foco de preview",
  "designlab.component.api.model.regressionFocus": "Foco de regresion",
  "designlab.component.ux.empty":
    "Selecciona un componente para inspeccionar la alineacion UX.",
  "designlab.component.ux.alignment": "Alineacion UX",
  "designlab.component.ux.northStar": "Secciones North Star",
  "designlab.component.ux.primaryThemeMissing": "Sin theme principal",
  "designlab.component.ux.primarySubthemeMissing": "Sin subtheme principal",
  "designlab.component.ux.sectionMissing": "Sin seccion",
  "designlab.component.quality.empty":
    "Selecciona un componente para inspeccionar la evidencia de calidad.",
  "designlab.component.quality.workspace.title": "Workspace de calidad",
  "designlab.component.quality.workspace.description":
    "Las evidencias de gates y uso se separan en paneles de segundo nivel para mantener enfocada la revision de calidad.",
  "designlab.component.quality.gates": "Gates de calidad",
  "designlab.component.quality.usage": "Evidencia de uso",
  "designlab.component.quality.noGates": "Sin gate de calidad",
  "designlab.recipe.overview.empty":
    "Selecciona una receta desde el Explorador de recetas.",
  "designlab.recipe.overview.workspace.title": "Workspace de receta",
  "designlab.recipe.overview.workspace.description":
    "El resumen de la receta, la cobertura y el flujo del consumidor se abren como paneles controlados en lugar de un documento largo.",
  "designlab.recipe.overview.summary": "Resumen de la receta",
  "designlab.recipe.overview.quickStatus": "Estado rapido de la receta",
  "designlab.recipe.overview.quickStatus.ownerBlocks.note":
    "Cantidad canonica de componentes dentro de esta receta.",
  "designlab.recipe.overview.quickStatus.tracks.note":
    "Numero de release tracks cubiertos por la receta.",
  "designlab.recipe.overview.quickStatus.sections.note":
    "Numero de secciones North Star cubiertas.",
  "designlab.recipe.overview.quickStatus.themes.note":
    "Superficie enlazada de theme y subtheme UX.",
  "designlab.recipe.overview.trackCoverage": "Cobertura de lineas",
  "designlab.recipe.overview.northStarCoverage": "Cobertura North Star",
  "designlab.recipe.overview.themeCoverage": "Cobertura de theme",
  "designlab.recipe.overview.qualityCoverage": "Cobertura de calidad",
  "designlab.recipe.overview.noTrackBinding": "Sin vinculacion de track",
  "designlab.recipe.overview.noSectionBinding": "Sin vinculacion de seccion",
  "designlab.recipe.overview.noThemeBinding": "Sin vinculacion de theme",
  "designlab.recipe.overview.noQualityGates": "Sin gate de calidad",
  "designlab.recipe.overview.flow.eyebrow": "Flujo del consumidor",
  "designlab.recipe.overview.flow.title": "Contrato de adopcion de la receta",
  "designlab.recipe.overview.flow.description":
    "Los equipos de aplicacion deben decidir primero a nivel de receta y solo despues profundizar en los detalles faltantes de owner blocks.",
  "designlab.recipe.overview.flow.step1": "Seleccionar receta",
  "designlab.recipe.overview.flow.step1.note":
    "Relaciona primero el problema de pantalla con una familia de recetas lista.",
  "designlab.recipe.overview.flow.step2": "Fijar preset",
  "designlab.recipe.overview.flow.step2.note":
    "Las decisiones de theme, densidad y seccion UX deben fijarse a nivel de receta.",
  "designlab.recipe.overview.flow.step3": "Ir al componente",
  "designlab.recipe.overview.flow.step3.note":
    "Abre el detalle del primitive solo si todavia falta un bloque o una variante.",
  "designlab.recipe.api.empty":
    "Selecciona una receta para inspeccionar el contrato de consumo.",
  "designlab.recipe.api.workspace.title": "Workspace del contrato de consumo",
  "designlab.recipe.api.workspace.description":
    "La importacion de la receta, el binding de registry y el handoff al consumidor se abren en paneles controlados en lugar de un unico flujo largo.",
  "designlab.recipe.api.listLabel": "Paneles del workspace API de recetas",
  "designlab.recipe.api.contract": "Contrato",
  "designlab.recipe.api.binding": "Vinculacion",
  "designlab.recipe.api.usage": "Uso",
  "designlab.recipe.api.contractTitle": "Contrato de la receta",
  "designlab.recipe.api.bindingTitle": "Vinculacion del registry",
  "designlab.recipe.api.binding.recipeId.note":
    "Id canonico de la receta dentro de Design Lab.",
  "designlab.recipe.api.binding.ownerBlocks.note":
    "Conjunto oficial de bloques que compondran la pantalla consumidora.",
  "designlab.recipe.api.binding.tracks.note":
    "Lineas de lanzamiento cubiertas por esta receta.",
  "designlab.recipe.api.binding.contract.note":
    "Contrato fuente del sistema de recetas.",
  "designlab.recipe.api.compose.title": "Componer shell de receta",
  "designlab.recipe.api.compose.description":
    "Compone el conjunto de owner blocks de la receta directamente en la misma superficie.",
  "designlab.recipe.api.handoff.title": "Handoff al consumidor",
  "designlab.recipe.api.handoff.description":
    "Los equipos de aplicacion deben llevar primero la decision de la receta y abrir variantes primitivas solo cuando sea necesario.",
  "designlab.recipe.quality.empty":
    "Selecciona una receta para inspeccionar la evidencia de calidad.",
  "designlab.recipe.quality.workspace.title": "Workspace de calidad de receta",
  "designlab.recipe.quality.workspace.description":
    "Las evidencias de gates y lifecycle se separan en paneles de segundo nivel para mantener enfocada la revision de calidad de la receta.",
  "designlab.recipe.quality.listLabel":
    "Paneles del workspace de calidad de receta",
  "designlab.recipe.quality.lifecycle": "Lifecycle",
  "designlab.recipe.quality.lifecycle.title": "Mezcla de lifecycle",
  "designlab.recipe.quality.lifecycle.stable.note":
    "Numero de bloques estables dentro de la receta.",
  "designlab.recipe.quality.lifecycle.beta.note":
    "Numero de bloques que todavia no estan estabilizados.",
  "designlab.recipe.quality.lifecycle.liveDemo.note":
    "Numero de bloques con soporte de demo en vivo.",
  "designlab.showcase.previewPanels.live.note":
    "Demo en vivo y superficie interactiva de variantes.",
  "designlab.showcase.previewPanels.reference.label": "Referencia",
  "designlab.showcase.previewPanels.reference.note":
    "Notas de uso, comentarios de contrato y paneles de referencia.",
  "designlab.showcase.previewPanels.recipe.label": "Receta",
  "designlab.showcase.previewPanels.recipe.note":
    "Lente de receta, composicion y bloques centrados en el consumidor.",
  "designlab.showcase.previewSurface.live": "LIVE",
  "designlab.showcase.previewSurface.reference": "REFERENCIA",
  "designlab.showcase.previewSurface.recipe": "RECETA",
  "designlab.showcase.preview.workspace.title": "Workspace de preview",
  "designlab.showcase.preview.workspace.description.recipes":
    "La composicion de la receta se abre en un unico panel de preview activo. Puedes recorrer bloques live, notas de referencia y handoff de receta en pestanas separadas.",
  "designlab.showcase.preview.workspace.description.components":
    "La demo en vivo y las notas de referencia se abren en un unico workspace de preview activo. En lugar de un flujo largo de pagina, solo se muestra la superficie del componente seleccionado.",
  "designlab.showcase.preview.workspace.listLabel.recipes":
    "Paneles de preview de recetas",
  "designlab.showcase.preview.workspace.listLabel.components":
    "Paneles de preview de componentes",
  "designlab.showcase.preview.workspace.showcaseCount": "{count} showcase",
  "designlab.showcase.preview.empty.recipe":
    "No hay una superficie visible de receta para el panel de preview seleccionado. Cambia de panel para abrir bloques de composicion o referencia.",
  "designlab.showcase.preview.empty.component":
    "No hay una demo visible para el panel de preview seleccionado. Abre otra superficie desde Live, Referencia o Receta.",
  "designlab.showcase.preview.selectRecipe":
    "Selecciona una receta para inspeccionar la demo y la composicion.",
  "designlab.showcase.preview.selectComponent":
    "Selecciona un componente para inspeccionar el showcase en vivo.",
  "designlab.showcase.preview.undefinedRecipePreview":
    "Todavia no existe una preview personalizada de componente para esta receta.",
  "designlab.showcase.component.recipeLens.eyebrow": "Lente de receta",
  "designlab.showcase.component.recipeLens.title":
    "Lente de composicion de receta",
  "designlab.showcase.component.recipeLens.description":
    "Que recetas de pantalla usan este componente y donde deben tomar los equipos consumidores una composicion ya lista?",
  "designlab.showcase.component.recipeLens.directRecipes": "Recetas directas",
  "designlab.showcase.component.recipeLens.consumerHandoff":
    "Handoff al consumidor",
  "designlab.showcase.component.recipeLens.badge.directOwner": "Owner directo",
  "designlab.showcase.component.recipeLens.badge.related": "Relacionado",
  "designlab.showcase.component.recipeLens.preferredSource": "Fuente preferida",
  "designlab.showcase.component.recipeLens.preferredSource.recipe":
    "Composicion de receta",
  "designlab.showcase.component.recipeLens.preferredSource.primitive":
    "Composicion primitiva",
  "designlab.showcase.component.recipeLens.preferredSource.note.recipe":
    "Los equipos consumidores deben empezar con una familia de recetas lista para este componente.",
  "designlab.showcase.component.recipeLens.preferredSource.note.primitive":
    "No existe una receta lista; la composicion primitiva se usara directamente.",
  "designlab.showcase.component.recipeLens.primaryTrack": "Track principal",
  "designlab.showcase.component.recipeLens.primaryTrack.note":
    "Los equipos consumidores deben referenciar recetas canonicas y presets de theme dentro del mismo track.",
  "designlab.showcase.component.recipeLens.consumerRule":
    "Regla del consumidor",
  "designlab.showcase.component.recipeLens.consumerRule.description":
    "Los equipos de aplicacion no deben reinventar el diseno de pantalla dentro de la pagina. Primero revisa las familias de recetas en esta lente; solo disena una nueva composicion primitiva si todavia falta algo.",
  "designlab.showcase.recipe.workspace.surface.title": "Superficie de receta",
  "designlab.showcase.recipe.workspace.surface.description":
    "La composicion live, el contexto del contrato y el handoff al consumidor de la receta se leen en la misma tarjeta.",
  "designlab.showcase.recipe.workspace.handoff.preferredPath": "Ruta preferida",
  "designlab.showcase.recipe.workspace.handoff.preferredPath.value":
    "Receta -> Pantalla",
  "designlab.showcase.recipe.workspace.handoff.preferredPath.note":
    "Los equipos de producto deben partir de estas familias de recetas y vincular solo datos y reglas de negocio.",
  "designlab.showcase.recipe.workspace.handoff.trackSpread":
    "Cobertura de tracks",
  "designlab.showcase.recipe.workspace.handoff.trackSpread.note":
    "Si los componentes de la receta abarcan varios tracks, las decisiones de diseno deben fijarse en esta superficie.",
  "designlab.showcase.recipe.workspace.handoff.missingOwners":
    "Owners faltantes",
  "designlab.showcase.recipe.workspace.handoff.contractHealth":
    "Salud del contrato",
  "designlab.showcase.recipe.workspace.handoff.contractHealth.description":
    "Todos los owner blocks coinciden con el registry. Esta receta ya puede usarse como punto de partida seguro para pantallas consumidoras.",
  "designlab.showcase.recipe.workspace.buildingBlocks.title":
    "Bloques de construccion principales",
  "designlab.showcase.recipe.workspace.buildingBlocks.description":
    "Salta a cualquier bloque dentro de la receta y continua la revision a nivel de componente.",
  "designlab.showcase.recipe.workspace.buildingBlocks.action":
    "Abrir detalle del componente",
  "designlab.showcase.recipe.workspace.quality.title":
    "Contrato de gobernanza y calidad",
  "designlab.showcase.recipe.workspace.quality.description":
    "Gates de calidad compartidos, theme UX y cobertura de secciones North Star a nivel de receta.",
  "designlab.showcase.recipe.workspace.quality.gates": "Gates de calidad",
  "designlab.showcase.recipe.workspace.quality.uxAndSections": "UX y secciones",
  "designlab.showcase.recipe.workspace.quality.noGate": "Sin gate",
  "designlab.showcase.recipe.workspace.quality.noTheme": "Sin theme UX",
  "designlab.showcase.recipe.workspace.quality.noSection":
    "Sin seccion North Star",
  "designlab.showcase.recipe.searchFilterListing.eyebrow": "Receta",
  "designlab.showcase.recipe.searchFilterListing.title":
    "Inventario de politicas",
  "designlab.showcase.recipe.searchFilterListing.description":
    "La busqueda, el filtro y el shell de resultados se agrupan bajo el mismo contrato de receta.",
  "designlab.showcase.recipe.searchFilterListing.searchLabel": "Buscar",
  "designlab.showcase.recipe.searchFilterListing.densityLabel": "Densidad",
  "designlab.showcase.recipe.searchFilterListing.density.comfortable": "Comoda",
  "designlab.showcase.recipe.searchFilterListing.density.compact": "Compacta",
  "designlab.showcase.recipe.searchFilterListing.density.readonly":
    "Solo lectura",
  "designlab.showcase.recipe.searchFilterListing.savedView":
    "Vista guardada de la lista de recetas",
  "designlab.showcase.recipe.searchFilterListing.summary.results.label":
    "Resultados",
  "designlab.showcase.recipe.searchFilterListing.summary.results.note":
    "Snapshot del servidor",
  "designlab.showcase.recipe.searchFilterListing.summary.selection.label":
    "Seleccion",
  "designlab.showcase.recipe.searchFilterListing.summary.selection.note":
    "Estado de acciones de la toolbar",
  "designlab.showcase.recipe.searchFilterListing.summary.density.label":
    "Densidad",
  "designlab.showcase.recipe.searchFilterListing.summary.density.note":
    "Densidad del shell de receta",
  "designlab.showcase.recipe.detailSummary.eyebrow": "Receta",
  "designlab.showcase.recipe.detailSummary.title": "Detalle de rollout Wave 11",
  "designlab.showcase.recipe.detailSummary.description":
    "El resumen, el contexto de entidad y el payload se leen a traves de la misma receta inspector.",
  "designlab.showcase.recipe.detailSummary.status": "Listo para publicar",
  "designlab.showcase.recipe.detailSummary.summary.owners.note":
    "Cantidad canonica de owner blocks",
  "designlab.showcase.recipe.detailSummary.summary.doctor.note":
    "preajuste ui-library",
  "designlab.showcase.recipe.detailSummary.summary.adoption.label": "Adopcion",
  "designlab.showcase.recipe.detailSummary.summary.adoption.note":
    "Aplicacion guiada por receta",
  "designlab.showcase.recipe.detailSummary.entity.subtitle":
    "Reutiliza composiciones de pagina y panel mediante datos y configuracion.",
  "designlab.showcase.recipe.detailSummary.entity.owner": "Responsable",
  "designlab.showcase.recipe.detailSummary.detail.focus.value":
    "Patrones reutilizables de pagina/panel",
  "designlab.showcase.recipe.detailSummary.detail.gate.value":
    "doctor + revision de ola",
  "designlab.showcase.recipe.detailSummary.detail.preview.value": "/ui-library",
  "designlab.showcase.recipe.detailSummary.detail.rule.value":
    "Receta antes que UI personalizada a nivel de pagina",
  "designlab.showcase.recipe.approvalReview.title": "Aprobacion de publicacion",
  "designlab.showcase.recipe.approvalReview.eyebrow": "Receta",
  "designlab.showcase.recipe.approvalReview.description":
    "Checkpoint, evidencia y flujo de auditoria se leen a traves de la misma receta de revision.",
  "designlab.showcase.recipe.approvalReview.summary":
    "La decision de publicacion de la receta se lee con evidencia de citas y linea de tiempo de auditoria.",
  "designlab.showcase.recipe.approvalReview.state": "Estado actual: {state}",
  "designlab.showcase.recipe.emptyErrorLoading.loadingLabel":
    "Preparando superficies de receta",
  "designlab.showcase.recipe.emptyErrorLoading.retry":
    "Reintento solicitado desde el estado de la receta",
  "designlab.showcase.recipe.aiGuidedAuthoring.title":
    "Usar la receta ApprovalReview",
  "designlab.showcase.recipe.aiGuidedAuthoring.summary":
    "Usa la receta canonica ApprovalReview en lugar de una shell de revision duplicada.",
  "designlab.showcase.recipe.aiGuidedAuthoring.type": "Sugerencia de receta",
  "designlab.showcase.recipe.aiGuidedAuthoring.decision":
    "Decision: {decision}",
  "designlab.showcase.component.textInput.live.primary.title":
    "Etiqueta / ayuda / contador",
  "designlab.showcase.component.textInput.live.primary.label":
    "Nombre de usuario",
  "designlab.showcase.component.textInput.live.primary.description":
    "Nombre corto que se muestra en todo el sistema.",
  "designlab.showcase.component.textInput.live.primary.hint":
    "Usa hasta 32 caracteres sin espacios.",
  "designlab.showcase.component.textInput.live.primary.activeValue":
    "Valor activo: {value}",
  "designlab.showcase.component.textInput.live.stateMatrix.title":
    "Matriz de estados",
  "designlab.showcase.component.textInput.live.stateMatrix.validatedLabel":
    "Campo validado",
  "designlab.showcase.component.textInput.live.stateMatrix.invalidLabel":
    "Campo invalido",
  "designlab.showcase.component.textInput.live.stateMatrix.invalidError":
    "Introduce al menos 3 caracteres.",
  "designlab.showcase.component.textInput.live.stateMatrix.readonlyLabel":
    "Campo de solo lectura",
  "designlab.showcase.component.textArea.live.authoring.title":
    "Autoajuste / ayuda",
  "designlab.showcase.component.textArea.live.authoring.label": "Descripcion",
  "designlab.showcase.component.textArea.live.authoring.description":
    "Campo de texto compartido para contenidos mas largos.",
  "designlab.showcase.component.textArea.live.authoring.hint":
    "Usa altura automatica para entradas de varias lineas.",
  "designlab.showcase.component.textArea.live.stateMatrix.title":
    "Validacion / acceso",
  "designlab.showcase.component.textArea.live.stateMatrix.invalidLabel":
    "Ejemplo de validacion",
  "designlab.showcase.component.textArea.live.stateMatrix.invalidValue":
    "Falta descripcion",
  "designlab.showcase.component.textArea.live.stateMatrix.invalidError":
    "Este campo debe tener al menos 20 caracteres.",
  "designlab.showcase.component.textArea.live.stateMatrix.readonlyLabel":
    "Nota de solo lectura",
  "designlab.showcase.component.textArea.live.stateMatrix.readonlyValue":
    "Los registros del sistema no pueden ser editados por el usuario.",
  "designlab.showcase.component.textArea.live.stateMatrix.disabledLabel":
    "Borrador deshabilitado",
  "designlab.showcase.component.textArea.live.stateMatrix.disabledValue":
    "Bloqueado despues de publicar.",
  "designlab.showcase.component.checkbox.live.controlled.title":
    "Controlado + ayuda",
  "designlab.showcase.component.checkbox.live.controlled.label":
    "Enviar notificacion posterior al release",
  "designlab.showcase.component.checkbox.live.controlled.description":
    "Notifica automaticamente a las partes interesadas cuando el flujo termine.",
  "designlab.showcase.component.checkbox.live.controlled.hint":
    "Puedes desactivarlo nuevamente si hace falta.",
  "designlab.showcase.component.checkbox.live.controlled.activeValue":
    "Seleccion activa: {state}",
  "designlab.showcase.component.checkbox.live.controlled.stateOn": "Encendido",
  "designlab.showcase.component.checkbox.live.controlled.stateOff": "Apagado",
  "designlab.showcase.component.checkbox.live.stateMatrix.title":
    "Validacion / acceso",
  "designlab.showcase.component.checkbox.live.stateMatrix.invalidLabel":
    "Falta aprobacion",
  "designlab.showcase.component.checkbox.live.stateMatrix.invalidError":
    "Debes aprobar antes de continuar.",
  "designlab.showcase.component.checkbox.live.stateMatrix.indeterminateLabel":
    "Seleccion parcial",
  "designlab.showcase.component.checkbox.live.stateMatrix.indeterminateHint":
    "Un subconjunto de opciones hijas esta seleccionado.",
  "designlab.showcase.component.checkbox.live.stateMatrix.readonlyLabel":
    "Seleccion de solo lectura",
  "designlab.showcase.component.checkbox.live.stateMatrix.disabledLabel":
    "Seleccion deshabilitada",
  "designlab.showcase.component.radio.live.controlled.title":
    "Grupo de opciones controlado",
  "designlab.showcase.component.radio.live.controlled.design.label":
    "Orientado al diseno",
  "designlab.showcase.component.radio.live.controlled.design.description":
    "Completa primero la calidad visual y la documentacion.",
  "designlab.showcase.component.radio.live.controlled.ops.label":
    "Orientado a operaciones",
  "designlab.showcase.component.radio.live.controlled.ops.description":
    "Completa primero la evidencia de doctor y gate.",
  "designlab.showcase.component.radio.live.controlled.delivery.label":
    "Orientado a entrega",
  "designlab.showcase.component.radio.live.controlled.delivery.description":
    "Prioriza los artefactos de entrega despues del landing.",
  "designlab.showcase.component.radio.live.stateMatrix.title":
    "Matriz de estados",
  "designlab.showcase.component.radio.live.stateMatrix.defaultLabel":
    "Opcion predeterminada",
  "designlab.showcase.component.radio.live.stateMatrix.invalidLabel":
    "Falta seleccion",
  "designlab.showcase.component.radio.live.stateMatrix.invalidError":
    "Debe seleccionarse al menos una estrategia de rollout.",
  "designlab.showcase.component.radio.live.stateMatrix.readonlyLabel":
    "Opcion de solo lectura",
  "designlab.showcase.component.radio.live.stateMatrix.disabledLabel":
    "Opcion deshabilitada",
  "designlab.showcase.component.switch.live.controlled.title":
    "Interruptor controlado",
  "designlab.showcase.component.switch.live.controlled.label":
    "Activar visibilidad en vivo",
  "designlab.showcase.component.switch.live.controlled.description":
    "Haz visible la pantalla publicada para los usuarios finales de inmediato.",
  "designlab.showcase.component.switch.live.controlled.hint":
    "Puedes volver a apagarlo cuando sea necesario.",
  "designlab.showcase.component.switch.live.controlled.activeStatus":
    "Estado actual: {state}",
  "designlab.showcase.component.switch.live.controlled.stateOn": "Encendido",
  "designlab.showcase.component.switch.live.controlled.stateOff": "Apagado",
  "designlab.showcase.component.switch.live.stateMatrix.title":
    "Matriz de estados",
  "designlab.showcase.component.switch.live.stateMatrix.readonlyLabel":
    "Interruptor de solo lectura",
  "designlab.showcase.component.switch.live.stateMatrix.disabledLabel":
    "Interruptor deshabilitado",
  "designlab.showcase.component.switch.live.stateMatrix.invalidLabel":
    "Falta aprobacion de politica",
  "designlab.showcase.component.switch.live.stateMatrix.invalidError":
    "Esta transicion requiere una aprobacion adicional.",
  "designlab.showcase.component.slider.live.controlled.title":
    "Rango controlado",
  "designlab.showcase.component.slider.live.controlled.label": "Densidad",
  "designlab.showcase.component.slider.live.controlled.description":
    "Gestiona el espaciado de tarjetas y tablas desde una sola fuente.",
  "designlab.showcase.component.slider.live.controlled.hint":
    "Los valores mas altos crean un layout mas aireado.",
  "designlab.showcase.component.slider.live.controlled.minLabel": "Compacta",
  "designlab.showcase.component.slider.live.controlled.maxLabel": "Comoda",
  "designlab.showcase.component.slider.live.stateMatrix.title":
    "Matriz de estados",
  "designlab.showcase.component.slider.live.stateMatrix.readonlyLabel":
    "Slider de solo lectura",
  "designlab.showcase.component.slider.live.stateMatrix.invalidLabel":
    "Bloqueado por politica",
  "designlab.showcase.component.slider.live.stateMatrix.invalidError":
    "Este cambio requiere una aprobacion adicional.",
  "designlab.showcase.component.datePicker.live.controlled.title":
    "Fecha controlada",
  "designlab.showcase.component.datePicker.live.controlled.label":
    "Fecha de entrega",
  "designlab.showcase.component.datePicker.live.controlled.description":
    "Planifica el dia en que la tarea quedara terminada.",
  "designlab.showcase.component.datePicker.live.controlled.hint":
    "Usa el calendario para crear un hito compartible.",
  "designlab.showcase.component.datePicker.live.stateMatrix.title":
    "Matriz de estados",
  "designlab.showcase.component.datePicker.live.stateMatrix.readonlyLabel":
    "Fecha de solo lectura",
  "designlab.showcase.component.datePicker.live.stateMatrix.invalidLabel":
    "Hito invalido",
  "designlab.showcase.component.datePicker.live.stateMatrix.invalidError":
    "La fecha queda fuera de la ventana de release actual.",
  "designlab.showcase.component.timePicker.live.controlled.title":
    "Hora controlada",
  "designlab.showcase.component.timePicker.live.controlled.label":
    "Hora de corte",
  "designlab.showcase.component.timePicker.live.controlled.description":
    "Selecciona la hora de ejecucion dentro de la ventana de release.",
  "designlab.showcase.component.timePicker.live.controlled.hint":
    "Planifica en intervalos de 15 minutos.",
  "designlab.showcase.component.timePicker.live.stateMatrix.title":
    "Matriz de estados",
  "designlab.showcase.component.timePicker.live.stateMatrix.readonlyLabel":
    "Hora de solo lectura",
  "designlab.showcase.component.timePicker.live.stateMatrix.invalidLabel":
    "Cutover invalido",
  "designlab.showcase.component.timePicker.live.stateMatrix.invalidError":
    "Esta hora queda fuera de la ventana de despliegue permitida.",
  "designlab.showcase.component.radio.sections.choice.eyebrow":
    "Alternativa 01",
  "designlab.showcase.component.radio.sections.choice.title":
    "Estrategia de seleccion unica",
  "designlab.showcase.component.radio.sections.choice.description":
    "Una superficie de formulario guiada donde se elige una sola decision con una unica opcion.",
  "designlab.showcase.component.radio.sections.choice.badge.singleChoice":
    "seleccion-unica",
  "designlab.showcase.component.radio.sections.choice.badge.decision":
    "decision-guiada",
  "designlab.showcase.component.radio.sections.choice.panelControlled":
    "Grupo controlado",
  "designlab.showcase.component.radio.sections.choice.panelSelected":
    "Valor seleccionado",
  "designlab.showcase.component.radio.sections.choice.selected.label":
    "Seleccion actual",
  "designlab.showcase.component.radio.sections.choice.selected.note":
    "El estado controlado del radio es gestionado por la shell.",
  "designlab.showcase.component.radio.sections.states.eyebrow":
    "Alternativa 02",
  "designlab.showcase.component.radio.sections.states.title":
    "Matriz de estados",
  "designlab.showcase.component.radio.sections.states.description":
    "Estados de radio invalidos, de solo lectura y deshabilitados.",
  "designlab.showcase.component.radio.sections.states.badge.invalid":
    "invalido",
  "designlab.showcase.component.radio.sections.states.badge.readonly":
    "solo-lectura",
  "designlab.showcase.component.radio.sections.states.badge.disabled":
    "deshabilitado",
  "designlab.showcase.component.radio.sections.states.panelDefault":
    "Predeterminado",
  "designlab.showcase.component.radio.sections.states.panelInvalid": "Invalido",
  "designlab.showcase.component.radio.sections.states.panelReadonly":
    "Solo lectura",
  "designlab.showcase.component.radio.sections.states.panelDisabled":
    "Deshabilitado",
  "designlab.showcase.component.switch.sections.toggle.eyebrow":
    "Alternativa 01",
  "designlab.showcase.component.switch.sections.toggle.title":
    "Interruptor de publicacion en vivo",
  "designlab.showcase.component.switch.sections.toggle.description":
    "Uso controlado que cambia la visibilidad o el estado de rollout con un solo interruptor.",
  "designlab.showcase.component.switch.sections.toggle.badge.toggle":
    "interruptor",
  "designlab.showcase.component.switch.sections.toggle.badge.controlled":
    "controlado",
  "designlab.showcase.component.switch.sections.toggle.badge.release":
    "lanzamiento",
  "designlab.showcase.component.switch.sections.toggle.panelControlled":
    "Interruptor controlado",
  "designlab.showcase.component.switch.sections.toggle.panelStatus":
    "Estado actual",
  "designlab.showcase.component.switch.sections.toggle.status.label":
    "Estado en vivo",
  "designlab.showcase.component.switch.sections.toggle.status.note":
    "El cambio del interruptor se sigue directamente mediante el estado controlado.",
  "designlab.showcase.component.switch.sections.states.eyebrow":
    "Alternativa 02",
  "designlab.showcase.component.switch.sections.states.title":
    "Matriz de estados",
  "designlab.showcase.component.switch.sections.states.description":
    "Comportamientos de interruptor de solo lectura, deshabilitado y bloqueado por politica.",
  "designlab.showcase.component.switch.sections.states.badge.readonly":
    "solo-lectura",
  "designlab.showcase.component.switch.sections.states.badge.disabled":
    "deshabilitado",
  "designlab.showcase.component.switch.sections.states.badge.invalid":
    "invalido",
  "designlab.showcase.component.switch.sections.states.panelReadonly":
    "Solo lectura",
  "designlab.showcase.component.switch.sections.states.panelDisabled":
    "Deshabilitado",
  "designlab.showcase.component.switch.sections.states.panelPolicyBlocked":
    "Bloqueado por politica",
  "designlab.showcase.component.slider.sections.density.eyebrow":
    "Alternativa 01",
  "designlab.showcase.component.slider.sections.density.title":
    "Calibracion de densidad",
  "designlab.showcase.component.slider.sections.density.description":
    "Seleccion numerica controlada para densidad de superficie y compactacion del layout.",
  "designlab.showcase.component.slider.sections.density.badge.range": "rango",
  "designlab.showcase.component.slider.sections.density.badge.controlled":
    "controlado",
  "designlab.showcase.component.slider.sections.density.badge.density":
    "densidad",
  "designlab.showcase.component.slider.sections.density.panelControlled":
    "Slider controlado",
  "designlab.showcase.component.slider.sections.density.panelCurrentValue":
    "Valor actual",
  "designlab.showcase.component.slider.sections.density.currentValue.label":
    "Densidad",
  "designlab.showcase.component.slider.sections.density.currentValue.note":
    "El valor del slider se transporta a las superficies de preview y regresion mediante el estado controlado.",
  "designlab.showcase.component.slider.sections.states.eyebrow":
    "Alternativa 02",
  "designlab.showcase.component.slider.sections.states.title":
    "Estados de solo lectura y politica",
  "designlab.showcase.component.slider.sections.states.description":
    "Comportamiento del rango para escenarios de solo lectura y bloqueo por politica.",
  "designlab.showcase.component.slider.sections.states.badge.readonly":
    "solo-lectura",
  "designlab.showcase.component.slider.sections.states.badge.invalid":
    "invalido",
  "designlab.showcase.component.slider.sections.states.badge.policy":
    "politica",
  "designlab.showcase.component.slider.sections.states.panelReadonly":
    "Solo lectura",
  "designlab.showcase.component.slider.sections.states.panelPolicyBlocked":
    "Bloqueado por politica",
  "designlab.showcase.component.datePicker.sections.milestone.eyebrow":
    "Alternativa 01",
  "designlab.showcase.component.datePicker.sections.milestone.title":
    "Planificador de hitos",
  "designlab.showcase.component.datePicker.sections.milestone.description":
    "Seleccion basada en calendario para fecha de entrega y dia de rollout.",
  "designlab.showcase.component.datePicker.sections.milestone.badge.calendar":
    "calendario",
  "designlab.showcase.component.datePicker.sections.milestone.badge.milestone":
    "hito",
  "designlab.showcase.component.datePicker.sections.milestone.badge.controlled":
    "controlado",
  "designlab.showcase.component.datePicker.sections.milestone.panelControlled":
    "Fecha controlada",
  "designlab.showcase.component.datePicker.sections.milestone.panelSelected":
    "Fecha seleccionada",
  "designlab.showcase.component.datePicker.sections.milestone.selected.label":
    "Fecha de entrega",
  "designlab.showcase.component.datePicker.sections.milestone.selected.note":
    "El valor controlado del DatePicker fluye hacia los recorridos de release y planificacion.",
  "designlab.showcase.component.datePicker.sections.states.eyebrow":
    "Alternativa 02",
  "designlab.showcase.component.datePicker.sections.states.title":
    "Estados de solo lectura y validacion",
  "designlab.showcase.component.datePicker.sections.states.description":
    "Un unico contrato de shell para estados de fecha de solo lectura e invalidos.",
  "designlab.showcase.component.datePicker.sections.states.badge.readonly":
    "solo-lectura",
  "designlab.showcase.component.datePicker.sections.states.badge.invalid":
    "invalido",
  "designlab.showcase.component.datePicker.sections.states.badge.dateEntry":
    "entrada-fecha",
  "designlab.showcase.component.datePicker.sections.states.panelReadonly":
    "Solo lectura",
  "designlab.showcase.component.datePicker.sections.states.panelInvalid":
    "Invalido",
  "designlab.showcase.component.timePicker.sections.window.eyebrow":
    "Alternativa 01",
  "designlab.showcase.component.timePicker.sections.window.title":
    "Planificador de ventana de cutover",
  "designlab.showcase.component.timePicker.sections.window.description":
    "Controla horarios de despliegue, mantenimiento y aprobacion de forma gobernada.",
  "designlab.showcase.component.timePicker.sections.window.badge.timeEntry":
    "entrada-hora",
  "designlab.showcase.component.timePicker.sections.window.badge.controlled":
    "controlado",
  "designlab.showcase.component.timePicker.sections.window.badge.releaseWindow":
    "ventana-release",
  "designlab.showcase.component.timePicker.sections.window.panelControlled":
    "Hora controlada",
  "designlab.showcase.component.timePicker.sections.window.panelSelected":
    "Hora seleccionada",
  "designlab.showcase.component.timePicker.sections.window.selected.label":
    "Hora de cutover",
  "designlab.showcase.component.timePicker.sections.window.selected.note":
    "El estado controlado del TimePicker alimenta el flujo de rollout.",
  "designlab.showcase.component.timePicker.sections.states.eyebrow":
    "Alternativa 02",
  "designlab.showcase.component.timePicker.sections.states.title":
    "Estados de solo lectura e invalidos",
  "designlab.showcase.component.timePicker.sections.states.description":
    "Escenarios de solo lectura y validacion de ventana de release mostrados con el mismo lenguaje de shell.",
  "designlab.showcase.component.timePicker.sections.states.badge.readonly":
    "solo-lectura",
  "designlab.showcase.component.timePicker.sections.states.badge.invalid":
    "invalido",
  "designlab.showcase.component.timePicker.sections.states.badge.governedInput":
    "entrada-gobernada",
  "designlab.showcase.component.timePicker.sections.states.panelReadonly":
    "Solo lectura",
  "designlab.showcase.component.timePicker.sections.states.panelInvalid":
    "Invalido",
  "designlab.showcase.component.upload.sections.evidence.eyebrow":
    "Alternativa 01",
  "designlab.showcase.component.upload.sections.evidence.title":
    "Cargador de paquete de evidencias",
  "designlab.showcase.component.upload.sections.evidence.description":
    "Una superficie de carga controlada que recopila evidencia de politica, release y auditoria en un solo lugar.",
  "designlab.showcase.component.upload.sections.evidence.badge.files":
    "archivos",
  "designlab.showcase.component.upload.sections.evidence.badge.multiple":
    "multiple",
  "designlab.showcase.component.upload.sections.evidence.badge.evidence":
    "evidencia",
  "designlab.showcase.component.upload.sections.evidence.panelControlled":
    "Carga controlada",
  "designlab.showcase.component.upload.sections.evidence.controlled.label":
    "Paquete de evidencias",
  "designlab.showcase.component.upload.sections.evidence.controlled.description":
    "Reunir evidencia de release y aprobacion desde un solo lugar.",
  "designlab.showcase.component.upload.sections.evidence.controlled.hint":
    "Se admiten PDF, XLSX y ZIP.",
  "designlab.showcase.component.upload.sections.evidence.panelSummary":
    "Resumen del payload",
  "designlab.showcase.component.upload.sections.evidence.summary.label":
    "Archivos",
  "designlab.showcase.component.upload.sections.states.eyebrow":
    "Alternativa 02",
  "designlab.showcase.component.upload.sections.states.title":
    "Estados de validacion y acceso",
  "designlab.showcase.component.upload.sections.states.description":
    "Comportamientos de carga de solo lectura, deshabilitados y bloqueados por politica en paneles separados.",
  "designlab.showcase.component.upload.sections.states.badge.readonly":
    "solo-lectura",
  "designlab.showcase.component.upload.sections.states.badge.disabled":
    "deshabilitado",
  "designlab.showcase.component.upload.sections.states.badge.invalid":
    "invalido",
  "designlab.showcase.component.upload.sections.states.panelReadonly":
    "Solo lectura",
  "designlab.showcase.component.upload.sections.states.panelDisabled":
    "Deshabilitado",
  "designlab.showcase.component.upload.sections.states.panelInvalid":
    "Invalido",
  "designlab.showcase.component.upload.sections.states.readonlyLabel":
    "Carga de solo lectura",
  "designlab.showcase.component.upload.sections.states.disabledLabel":
    "Carga deshabilitada",
  "designlab.showcase.component.upload.sections.states.invalidLabel":
    "Falta evidencia",
  "designlab.showcase.component.upload.sections.states.invalidError":
    "Debe cargarse al menos un PDF firmado.",
  "designlab.showcase.component.commandPalette.sections.launcher.eyebrow":
    "Alternativa 01",
  "designlab.showcase.component.commandPalette.sections.launcher.title":
    "Launcher global / cambiador de rutas",
  "designlab.showcase.component.commandPalette.sections.launcher.description":
    "Experiencia principal de command palette que reune rutas y acciones operativas en un solo dialogo.",
  "designlab.showcase.component.commandPalette.sections.launcher.badge.launcher":
    "launcher",
  "designlab.showcase.component.commandPalette.sections.launcher.badge.dialog":
    "dialogo",
  "designlab.showcase.component.commandPalette.sections.launcher.badge.navigate":
    "navegar",
  "designlab.showcase.component.commandPalette.sections.launcher.panelOpenState":
    "Estado abierto de la paleta",
  "designlab.showcase.component.commandPalette.sections.launcher.openButton":
    "Abrir command palette",
  "designlab.showcase.component.commandPalette.sections.launcher.paletteTitle":
    "Centro de comandos UI",
  "designlab.showcase.component.commandPalette.sections.launcher.paletteSubtitle":
    "Navegacion, revision de release y acciones asistidas por AI conviven en la misma paleta.",
  "designlab.showcase.component.commandPalette.sections.launcher.panelSelected":
    "Comando seleccionado",
  "designlab.showcase.component.commandPalette.sections.launcher.selected.label":
    "Seleccion",
  "designlab.showcase.component.commandPalette.sections.launcher.selected.empty":
    "Aun no hay seleccion",
  "designlab.showcase.component.commandPalette.sections.launcher.selected.note":
    "La seleccion de la paleta dirige la ruta o el estado de la accion.",
  "designlab.showcase.component.commandPalette.sections.readonly.eyebrow":
    "Alternativa 02",
  "designlab.showcase.component.commandPalette.sections.readonly.title":
    "Modo de exploracion de solo lectura",
  "designlab.showcase.component.commandPalette.sections.readonly.description":
    "Los usuarios con acceso restringido pueden ver los comandos pero no ejecutarlos; el mismo componente conserva esta distincion.",
  "designlab.showcase.component.commandPalette.sections.readonly.badge.readonly":
    "solo-lectura",
  "designlab.showcase.component.commandPalette.sections.readonly.badge.governed":
    "gobernado",
  "designlab.showcase.component.commandPalette.sections.readonly.badge.browse":
    "explorar",
  "designlab.showcase.component.commandPalette.sections.readonly.panelContract":
    "Contrato de paleta de solo lectura",
  "designlab.showcase.component.commandPalette.sections.readonly.chipReadonly":
    "solo-lectura",
  "designlab.showcase.component.commandPalette.sections.readonly.chipDiscoverability":
    "descubribilidad",
  "designlab.showcase.component.commandPalette.sections.readonly.chipNoExecution":
    "sin ejecucion",
  "designlab.showcase.component.commandPalette.sections.readonly.body":
    "En modo de solo lectura, el usuario ve titulos de comandos, informacion de grupo y atajos; no se dispara ninguna accion.",
  "designlab.showcase.component.commandPalette.sections.readonly.panelNote":
    "Nota del contrato",
  "designlab.showcase.component.commandPalette.sections.readonly.noteTitle":
    "Contrato de governance",
  "designlab.showcase.component.commandPalette.sections.readonly.note.accessLabel":
    "Acceso",
  "designlab.showcase.component.commandPalette.sections.readonly.note.accessValue":
    "solo-lectura",
  "designlab.showcase.component.commandPalette.sections.readonly.note.focusLabel":
    "Foco",
  "designlab.showcase.component.commandPalette.sections.readonly.note.focusValue":
    "descubribilidad + seguridad",
  "designlab.showcase.component.commandPalette.sections.readonly.note.uxLabel":
    "Ancla UX",
  "designlab.showcase.component.commandPalette.sections.readonly.note.uxValue":
    "guided_navigation_assistance",
  "designlab.showcase.component.commandPalette.sections.scope.eyebrow":
    "Alternativa 03",
  "designlab.showcase.component.commandPalette.sections.scope.title":
    "Conjunto de comandos acotado por aprobacion",
  "designlab.showcase.component.commandPalette.sections.scope.description":
    "Los flujos de AI y aprobacion se agrupan en la misma paleta con badges de alcance.",
  "designlab.showcase.component.commandPalette.sections.scope.badge.approval":
    "aprobacion",
  "designlab.showcase.component.commandPalette.sections.scope.badge.aiAssist":
    "asistencia-ia",
  "designlab.showcase.component.commandPalette.sections.scope.badge.scope":
    "alcance",
  "designlab.showcase.component.commandPalette.sections.scope.panelCommands":
    "Comandos con alcance",
  "designlab.showcase.component.commandPalette.sections.scope.chipAiAssist":
    "Asistencia IA",
  "designlab.showcase.component.commandPalette.sections.scope.chipGovernance":
    "Gobernanza",
  "designlab.showcase.component.commandPalette.sections.scope.generalGroup":
    "General",
  "designlab.showcase.component.commandPalette.sections.scope.panelSummary":
    "Resumen del alcance",
  "designlab.showcase.component.commandPalette.sections.scope.chipApprovalQueue":
    "cola-de-aprobacion",
  "designlab.showcase.component.pageHeader.live.eyebrow": "Shell de pagina",
  "designlab.showcase.component.pageHeader.live.title":
    "Biblioteca de componentes",
  "designlab.showcase.component.pageHeader.live.description":
    "Reune catalogo, release e informacion de calidad en una unica shell de PageHeader.",
  "designlab.showcase.component.pageHeader.live.status": "Shell estable",
  "designlab.showcase.component.pageHeader.live.action.notes":
    "Notas de release",
  "designlab.showcase.component.pageHeader.live.action.publish": "Publicar",
  "designlab.showcase.component.pageHeader.live.aside":
    "Ultima evidencia de doctor: PASS",
  "designlab.showcase.component.detailDrawer.live.open": "Abrir detalle",
  "designlab.showcase.component.detailDrawer.live.title":
    "Detalle del registro",
  "designlab.showcase.component.detailDrawer.live.sections.summary.title":
    "Resumen",
  "designlab.showcase.component.detailDrawer.live.sections.summary.description":
    "Ejemplo de seccion del drawer",
  "designlab.showcase.component.detailDrawer.live.sections.summary.content":
    "Contenido de detalle breve.",
  "designlab.showcase.component.detailDrawer.live.sections.audit.title":
    "Auditoria",
  "designlab.showcase.component.detailDrawer.live.sections.audit.description":
    "Bloque de metadatos",
  "designlab.showcase.component.detailDrawer.live.sections.audit.content":
    "Actualizado 2026-03-06",
  "designlab.showcase.component.popover.live.title": "Guia de policy",
  "designlab.showcase.component.popover.live.open": "Abrir popover",
  "designlab.showcase.component.popover.live.description":
    "Usa un popover cuando se necesita contexto breve pero rico. Este panel aporta ayuda para decidir sin cambiar la ruta.",
  "designlab.showcase.component.popover.live.badge.policy": "politica",
  "designlab.showcase.component.popover.live.badge.readonly": "solo-lectura",
  "designlab.showcase.component.contextMenu.live.trigger.panel":
    "Disparador de acciones",
  "designlab.showcase.component.contextMenu.live.trigger.button":
    "Menu contextual",
  "designlab.showcase.component.contextMenu.live.trigger.title":
    "Acciones de release",
  "designlab.showcase.component.contextMenu.live.trigger.items.approve.label":
    "Iniciar flujo de aprobacion",
  "designlab.showcase.component.contextMenu.live.trigger.items.approve.description":
    "Reune aprobacion humana y evidencia del wave gate en el mismo lugar.",
  "designlab.showcase.component.contextMenu.live.trigger.items.review.label":
    "Agregar a la cola de revision",
  "designlab.showcase.component.contextMenu.live.trigger.items.review.description":
    "Genera revision readonly y solicitudes adicionales de evidencia.",
  "designlab.showcase.component.contextMenu.live.trigger.items.archive.label":
    "Mover al archivo",
  "designlab.showcase.component.contextMenu.live.trigger.items.archive.description":
    "Mueve variantes obsoletas al area de backlog planificado.",
  "designlab.showcase.component.contextMenu.live.trigger.lastSelection":
    "Ultima seleccion:",
  "designlab.showcase.component.contextMenu.live.surface.panel":
    "Superficie con clic derecho",
  "designlab.showcase.component.contextMenu.live.surface.title":
    "Acciones de superficie",
  "designlab.showcase.component.contextMenu.live.surface.items.duplicate.label":
    "Duplicar tarjeta",
  "designlab.showcase.component.contextMenu.live.surface.items.pin.label":
    "Fijar esta vista",
  "designlab.showcase.component.contextMenu.live.surface.items.readonly.label":
    "Mostrar motivo readonly",
  "designlab.showcase.component.contextMenu.live.surface.items.readonly.description":
    "El menu contextual tambien esta limitado por el policy guard.",
  "designlab.showcase.component.contextMenu.live.surface.triggerTitle":
    "Clic derecho",
  "designlab.showcase.component.contextMenu.live.surface.description":
    "El mismo contrato funciona tambien sobre superficies con clic derecho. Los menus deben seguir siendo listas cortas de acciones y no arboles de navegacion.",
  "designlab.showcase.component.tourCoachmarks.live.guided.panel":
    "Recorrido guiado",
  "designlab.showcase.component.tourCoachmarks.live.guided.open":
    "Iniciar recorrido",
  "designlab.showcase.component.tourCoachmarks.live.guided.status.finished":
    "finalizado",
  "designlab.showcase.component.tourCoachmarks.live.guided.status.guided":
    "guiado",
  "designlab.showcase.component.tourCoachmarks.live.guided.status.idle":
    "inactivo",
  "designlab.showcase.component.tourCoachmarks.live.guided.steps.scope.title":
    "Validacion de alcance",
  "designlab.showcase.component.tourCoachmarks.live.guided.steps.scope.description":
    "Primero se aclaran los contratos de wave y registry para que el usuario vea que se esta publicando.",
  "designlab.showcase.component.tourCoachmarks.live.guided.steps.preview.title":
    "Revision de demo en vivo",
  "designlab.showcase.component.tourCoachmarks.live.guided.steps.preview.description":
    "La evidencia de preview, API y quality se explica dentro del mismo recorrido.",
  "designlab.showcase.component.tourCoachmarks.live.guided.steps.release.title":
    "Evidencia de release",
  "designlab.showcase.component.tourCoachmarks.live.guided.steps.release.description":
    "El recorrido no se considera completo hasta terminar la evidencia de doctor, gate y guardrails de seguridad.",
  "designlab.showcase.component.tourCoachmarks.live.readonly.panel":
    "Recorrido de cumplimiento readonly",
  "designlab.showcase.component.tourCoachmarks.live.readonly.steps.policy.title":
    "Explicacion de policy",
  "designlab.showcase.component.tourCoachmarks.live.readonly.steps.policy.description":
    "Los recorridos readonly llevan contexto de causa y efecto para areas criticas dentro del mismo overlay.",
  "designlab.showcase.component.tourCoachmarks.live.readonly.steps.controls.title":
    "Puntos de control",
  "designlab.showcase.component.tourCoachmarks.live.readonly.steps.controls.description":
    "Los botones de release no deben seguir visibles hasta que se completen la aprobacion y los controles de seguridad.",
  "designlab.showcase.component.pageHeader.sections.release.eyebrow":
    "Alternativa 01",
  "designlab.showcase.component.pageHeader.sections.release.title":
    "Header de release y docs",
  "designlab.showcase.component.pageHeader.sections.release.description":
    "Reune eyebrow, titulo, estado, meta y acciones rapidas en una unica superficie superior.",
  "designlab.showcase.component.pageHeader.sections.release.badge.header":
    "cabecera",
  "designlab.showcase.component.pageHeader.sections.release.badge.beta": "beta",
  "designlab.showcase.component.pageHeader.sections.release.badge.hero":
    "hero-principal",
  "designlab.showcase.component.pageHeader.sections.release.panelPrimary":
    "Header principal",
  "designlab.showcase.component.pageHeader.sections.release.header.eyebrow":
    "Biblioteca UI",
  "designlab.showcase.component.pageHeader.sections.release.header.title":
    "Rollout de bloques de pagina",
  "designlab.showcase.component.pageHeader.sections.release.header.description":
    "La superficie de release y docs para la nueva familia de bloques de nivel pagina se construye con el mismo primitive de header.",
  "designlab.showcase.component.pageHeader.sections.release.header.status":
    "Listo",
  "designlab.showcase.component.pageHeader.sections.release.header.action.share":
    "Compartir",
  "designlab.showcase.component.pageHeader.sections.release.header.action.promote":
    "Promover",
  "designlab.showcase.component.pageHeader.sections.release.header.aside.label":
    "Diagnostico",
  "designlab.showcase.component.pageHeader.sections.release.header.aside.value":
    "PASS",
  "designlab.showcase.component.pageHeader.sections.release.header.aside.note":
    "ajuste predefinido de ui-library",
  "designlab.showcase.component.pageHeader.sections.release.panelGuideline":
    "Guia",
  "designlab.showcase.component.pageHeader.sections.release.guideline":
    "`PageHeader` reune el area hero de nivel ruta en un unico primitive. Evita construir headers especificos de pagina para meta chips, badges de estado y metricas laterales.",
  "designlab.showcase.component.pageHeader.sections.compact.eyebrow":
    "Alternativa 02",
  "designlab.showcase.component.pageHeader.sections.compact.title":
    "Header compacto de detalle",
  "designlab.showcase.component.pageHeader.sections.compact.description":
    "Uso compacto del header para paginas de detalle mas densas.",
  "designlab.showcase.component.pageHeader.sections.compact.badge.compact":
    "compacto",
  "designlab.showcase.component.pageHeader.sections.compact.badge.detail":
    "detalle",
  "designlab.showcase.component.pageHeader.sections.compact.badge.meta":
    "metadatos",
  "designlab.showcase.component.pageHeader.sections.compact.panelMode":
    "Modo compacto",
  "designlab.showcase.component.pageHeader.sections.compact.header.eyebrow":
    "DETALLE",
  "designlab.showcase.component.pageHeader.sections.compact.header.title":
    "Resumen de entidad",
  "designlab.showcase.component.pageHeader.sections.compact.header.description":
    "Una superficie de header mas corta para detalle de componente.",
  "designlab.showcase.component.pageHeader.sections.compact.header.status":
    "Beta",
  "designlab.showcase.component.pageHeader.sections.compact.panelContract":
    "Nota de contrato",
  "designlab.showcase.component.pageHeader.sections.compact.contract.title":
    "Contrato del header",
  "designlab.showcase.component.pageHeader.sections.compact.contract.eyebrow.label":
    "Eyebrow",
  "designlab.showcase.component.pageHeader.sections.compact.contract.eyebrow.value":
    "opcional",
  "designlab.showcase.component.pageHeader.sections.compact.contract.meta.label":
    "Metadatos",
  "designlab.showcase.component.pageHeader.sections.compact.contract.meta.value":
    "chips / etiquetas",
  "designlab.showcase.component.pageHeader.sections.compact.contract.aside.label":
    "Lateral",
  "designlab.showcase.component.pageHeader.sections.compact.contract.aside.value":
    "metrica o ayuda",
  "designlab.showcase.component.pageLayout.live.title":
    "Directorio de usuarios",
  "designlab.showcase.component.pageLayout.live.description":
    "Ejemplo de composicion de layout a nivel de ruta",
  "designlab.showcase.component.pageLayout.live.breadcrumb.admin":
    "Administracion",
  "designlab.showcase.component.pageLayout.live.breadcrumb.users": "Usuarios",
  "designlab.showcase.component.pageLayout.live.action": "Nuevo registro",
  "designlab.showcase.component.pageLayout.live.filterSlot": "Area de filtros",
  "designlab.showcase.component.pageLayout.live.detail": "Panel de detalle",
  "designlab.showcase.component.pageLayout.live.content": "Contenido principal",
  "designlab.showcase.component.filterBar.live.search": "Buscar",
  "designlab.showcase.component.filterBar.live.status": "Estado",
  "designlab.showcase.component.reportFilterPanel.live.dateRange":
    "Rango de fechas",
  "designlab.showcase.component.reportFilterPanel.live.owner": "Responsable",
  "designlab.showcase.component.reportFilterPanel.live.statusLabel":
    "Estado: {value}",
  "designlab.showcase.component.pageLayout.sections.directory.eyebrow":
    "Alternativa 01",
  "designlab.showcase.component.pageLayout.sections.directory.title":
    "Shell de directorio",
  "designlab.showcase.component.pageLayout.sections.directory.description":
    "Reune breadcrumb, encabezado, shell de filtros y lateral de detalle dentro del mismo contrato de pagina.",
  "designlab.showcase.component.pageLayout.sections.directory.badge.pageShell":
    "shell-pagina",
  "designlab.showcase.component.pageLayout.sections.directory.badge.stable":
    "estable",
  "designlab.showcase.component.pageLayout.sections.directory.badge.directory":
    "directorio",
  "designlab.showcase.component.pageLayout.sections.directory.panelDirectory":
    "Shell de directorio",
  "designlab.showcase.component.pageLayout.sections.directory.shell.title":
    "Catalogo de gobernanza UI",
  "designlab.showcase.component.pageLayout.sections.directory.shell.description":
    "El shell de pagina, el header y el comportamiento de filtros se reutilizan mediante un unico contrato de layout.",
  "designlab.showcase.component.pageLayout.sections.directory.breadcrumb.docs":
    "Documentacion",
  "designlab.showcase.component.pageLayout.sections.directory.breadcrumb.library":
    "Biblioteca UI",
  "designlab.showcase.component.pageLayout.sections.directory.breadcrumb.pageBlocks":
    "Bloques de pagina",
  "designlab.showcase.component.pageLayout.sections.directory.headerExtra":
    "base estable",
  "designlab.showcase.component.pageLayout.sections.directory.actions.export":
    "Exportar",
  "designlab.showcase.component.pageLayout.sections.directory.actions.newBlock":
    "Nuevo bloque",
  "designlab.showcase.component.pageLayout.sections.directory.savedViewState":
    "Vista guardada de bloques de pagina",
  "designlab.showcase.component.pageLayout.sections.directory.filter.search":
    "Buscar",
  "designlab.showcase.component.pageLayout.sections.directory.filter.status":
    "Estado",
  "designlab.showcase.component.pageLayout.sections.directory.options.comfortable":
    "Comodo",
  "designlab.showcase.component.pageLayout.sections.directory.options.compact":
    "Compacto",
  "designlab.showcase.component.pageLayout.sections.directory.options.readonly":
    "Solo lectura",
  "designlab.showcase.component.pageLayout.sections.directory.detail.title":
    "Lateral de detalle",
  "designlab.showcase.component.pageLayout.sections.directory.detail.description":
    "La relacion entre layout, rail de detalle y cuerpo se mantiene dentro del mismo shell.",
  "designlab.showcase.component.pageLayout.sections.directory.detail.metric.label":
    "Seleccion",
  "designlab.showcase.component.pageLayout.sections.directory.detail.metric.note":
    "Estado del rail de acciones",
  "designlab.showcase.component.pageLayout.sections.directory.summary.title":
    "Resumen del release",
  "designlab.showcase.component.pageLayout.sections.directory.summary.description":
    "Destaca las metricas principales junto con el shell de pagina.",
  "designlab.showcase.component.pageLayout.sections.directory.contract.title":
    "Contrato del shell",
  "designlab.showcase.component.pageLayout.sections.directory.contract.description":
    "El mismo layout se puede reutilizar en drawers y paginas de detalle.",
  "designlab.showcase.component.pageLayout.sections.directory.panelContract":
    "Nota de contrato",
  "designlab.showcase.component.pageLayout.sections.directory.contractNote":
    "`PageLayout` combina breadcrumb, rail de acciones, shell de filtros y lateral de detalle a nivel de ruta y elimina la duplicacion de shells especificos por pagina.",
  "designlab.showcase.component.pageLayout.sections.detail.eyebrow":
    "Alternativa 02",
  "designlab.showcase.component.pageLayout.sections.detail.title":
    "Shell de revision de detalle",
  "designlab.showcase.component.pageLayout.sections.detail.description":
    "El mismo layout se puede usar con un lateral mas denso y footer en paginas centradas en detalle.",
  "designlab.showcase.component.pageLayout.sections.detail.badge.detail":
    "detalle",
  "designlab.showcase.component.pageLayout.sections.detail.badge.aside":
    "panel-lateral",
  "designlab.showcase.component.pageLayout.sections.detail.badge.review":
    "revision",
  "designlab.showcase.component.pageLayout.sections.detail.panelCompact":
    "Detalle compacto",
  "designlab.showcase.component.pageLayout.sections.detail.shell.title":
    "Revision de cambios",
  "designlab.showcase.component.pageLayout.sections.detail.shell.description":
    "La revision en modo solo lectura y las acciones aprobar/rechazar permanecen dentro del mismo contenedor de pagina.",
  "designlab.showcase.component.pageLayout.sections.detail.breadcrumb.releases":
    "Lanzamientos",
  "designlab.showcase.component.pageLayout.sections.detail.breadcrumb.wave":
    "Ola 7",
  "designlab.showcase.component.pageLayout.sections.detail.breadcrumb.review":
    "Revision",
  "designlab.showcase.component.pageLayout.sections.detail.actions.approve":
    "Aprobar",
  "designlab.showcase.component.pageLayout.sections.detail.decision.title":
    "Decision de revision",
  "designlab.showcase.component.pageLayout.sections.detail.decision.risk.label":
    "Riesgo",
  "designlab.showcase.component.pageLayout.sections.detail.decision.risk.value":
    "Bajo",
  "designlab.showcase.component.pageLayout.sections.detail.decision.owner.label":
    "Responsable",
  "designlab.showcase.component.pageLayout.sections.detail.decision.owner.value":
    "UI de plataforma",
  "designlab.showcase.component.pageLayout.sections.detail.footer":
    "El footer rail permanece dentro del mismo contrato de shell.",
  "designlab.showcase.component.pageLayout.sections.detail.entity.title":
    "Bloques de pagina de la Ola 7",
  "designlab.showcase.component.pageLayout.sections.detail.entity.subtitle":
    "Resumen del rollout de shells reutilizables a nivel de pagina.",
  "designlab.showcase.component.pageLayout.sections.detail.entity.badge":
    "Listo",
  "designlab.showcase.component.pageLayout.sections.detail.panelUsage":
    "Nota de uso",
  "designlab.showcase.component.pageLayout.sections.detail.usageNote":
    "El mismo layout funciona tanto para pantallas de directorio como de detalle y revision; solo cambian el contenido y los callbacks.",
  "designlab.showcase.component.filterBar.sections.toolbar.eyebrow":
    "Alternativa 01",
  "designlab.showcase.component.filterBar.sections.toolbar.title":
    "Contenedor de barra de herramientas",
  "designlab.showcase.component.filterBar.sections.toolbar.description":
    "Agrupa busqueda, filtros y acciones para guardar vistas en una superficie compartida de barra de herramientas.",
  "designlab.showcase.component.filterBar.sections.toolbar.badge.filters":
    "filtros",
  "designlab.showcase.component.filterBar.sections.toolbar.badge.stable":
    "estable",
  "designlab.showcase.component.filterBar.sections.toolbar.badge.toolbar":
    "barra-herramientas",
  "designlab.showcase.component.filterBar.sections.toolbar.panelControlled":
    "Barra de herramientas controlada",
  "designlab.showcase.component.filterBar.sections.toolbar.savedViewState":
    "Vista guardada de la barra",
  "designlab.showcase.component.filterBar.sections.toolbar.extraLabel":
    "barra-de-herramientas-compartida",
  "designlab.showcase.component.filterBar.sections.toolbar.fields.search":
    "Buscar",
  "designlab.showcase.component.filterBar.sections.toolbar.fields.density":
    "Densidad",
  "designlab.showcase.component.filterBar.sections.toolbar.fields.activeOnly":
    "Solo activos",
  "designlab.showcase.component.filterBar.sections.toolbar.options.comfortable":
    "Comodo",
  "designlab.showcase.component.filterBar.sections.toolbar.options.compact":
    "Compacto",
  "designlab.showcase.component.filterBar.sections.toolbar.panelState":
    "Estado compartido",
  "designlab.showcase.component.filterBar.sections.toolbar.metric.label":
    "Estado de la barra",
  "designlab.showcase.component.filterBar.sections.toolbar.metric.note":
    "Las acciones de reset y guardar vista se gestionan desde el mismo shell.",
  "designlab.showcase.component.filterBar.sections.readonly.eyebrow":
    "Alternativa 02",
  "designlab.showcase.component.filterBar.sections.readonly.title":
    "Estados de solo lectura y de politica",
  "designlab.showcase.component.filterBar.sections.readonly.description":
    "Los estados de solo lectura o bloqueados por politica permanecen dentro del mismo componente.",
  "designlab.showcase.component.filterBar.sections.readonly.badge.readonly":
    "solo-lectura",
  "designlab.showcase.component.filterBar.sections.readonly.badge.policy":
    "politica",
  "designlab.showcase.component.filterBar.sections.readonly.badge.state":
    "estado",
  "designlab.showcase.component.filterBar.sections.readonly.panelReadonly":
    "Barra en solo lectura",
  "designlab.showcase.component.filterBar.sections.readonly.fields.search":
    "Busqueda en solo lectura",
  "designlab.showcase.component.filterBar.sections.readonly.fields.scope":
    "Alcance",
  "designlab.showcase.component.filterBar.sections.readonly.options.shared":
    "Compartido",
  "designlab.showcase.component.filterBar.sections.readonly.panelGuideline":
    "Guia de uso",
  "designlab.showcase.component.filterBar.sections.readonly.guideline":
    "El shell de filtros no clona toolbars especificas por pagina; solo se proporcionan campos y callbacks.",
  "designlab.showcase.component.reportFilterPanel.sections.submit.eyebrow":
    "Alternativa 01",
  "designlab.showcase.component.reportFilterPanel.sections.submit.title":
    "Panel para el flujo de envio",
  "designlab.showcase.component.reportFilterPanel.sections.submit.description":
    "Agrupa filtros de reportes con multiples campos y acciones bajo un contrato unico de panel.",
  "designlab.showcase.component.reportFilterPanel.sections.submit.badge.panel":
    "panel-filtro",
  "designlab.showcase.component.reportFilterPanel.sections.submit.badge.submit":
    "envio",
  "designlab.showcase.component.reportFilterPanel.sections.submit.badge.stable":
    "estable",
  "designlab.showcase.component.reportFilterPanel.sections.submit.panelInteractive":
    "Panel interactivo",
  "designlab.showcase.component.reportFilterPanel.sections.submit.fields.search":
    "Buscar",
  "designlab.showcase.component.reportFilterPanel.sections.submit.fields.status":
    "Estado",
  "designlab.showcase.component.reportFilterPanel.sections.submit.fields.startDate":
    "Fecha de inicio",
  "designlab.showcase.component.reportFilterPanel.sections.submit.options.comfortable":
    "Comodo",
  "designlab.showcase.component.reportFilterPanel.sections.submit.options.compact":
    "Compacto",
  "designlab.showcase.component.reportFilterPanel.sections.submit.panelState":
    "Estado del panel",
  "designlab.showcase.component.reportFilterPanel.sections.submit.metric.label":
    "Estado",
  "designlab.showcase.component.reportFilterPanel.sections.submit.metric.note":
    "El comportamiento de envio y reinicio se gestiona desde el mismo panel.",
  "designlab.showcase.component.reportFilterPanel.sections.readonly.eyebrow":
    "Alternativa 02",
  "designlab.showcase.component.reportFilterPanel.sections.readonly.title":
    "Panel de politica en solo lectura",
  "designlab.showcase.component.reportFilterPanel.sections.readonly.description":
    "Los escenarios en solo lectura y bloqueados por politica mantienen la informacion visible mientras el envio sigue deshabilitado.",
  "designlab.showcase.component.reportFilterPanel.sections.readonly.badge.readonly":
    "solo-lectura",
  "designlab.showcase.component.reportFilterPanel.sections.readonly.badge.policy":
    "politica",
  "designlab.showcase.component.reportFilterPanel.sections.readonly.badge.governed":
    "gobernado",
  "designlab.showcase.component.reportFilterPanel.sections.readonly.panelReadonly":
    "Panel en solo lectura",
  "designlab.showcase.component.reportFilterPanel.sections.readonly.fields.search":
    "Busqueda readonly",
  "designlab.showcase.component.reportFilterPanel.sections.readonly.fields.searchValue":
    "revision semanal",
  "designlab.showcase.component.reportFilterPanel.sections.readonly.fields.date":
    "Fecha",
  "designlab.showcase.component.reportFilterPanel.sections.readonly.panelGuideline":
    "Guia",
  "designlab.showcase.component.reportFilterPanel.sections.readonly.rule.title":
    "Regla del panel",
  "designlab.showcase.component.reportFilterPanel.sections.readonly.rule.submit.label":
    "Enviar",
  "designlab.showcase.component.reportFilterPanel.sections.readonly.rule.submit.value":
    "solo con acceso completo",
  "designlab.showcase.component.reportFilterPanel.sections.readonly.rule.reset.label":
    "Restablecer",
  "designlab.showcase.component.reportFilterPanel.sections.readonly.rule.reset.value":
    "consciente de readonly",
  "designlab.showcase.component.reportFilterPanel.sections.readonly.rule.scope.label":
    "Caso de uso",
  "designlab.showcase.component.reportFilterPanel.sections.readonly.rule.scope.value":
    "paginas de reportes",
  "designlab.showcase.component.detailDrawer.sections.tabbed.eyebrow":
    "Alternativa 01",
  "designlab.showcase.component.detailDrawer.sections.tabbed.title":
    "Panel lateral de revision con pestanas",
  "designlab.showcase.component.detailDrawer.sections.tabbed.description":
    "Presenta el resumen de detalle, auditoria y despliegue en la misma superficie deslizante con pestanas.",
  "designlab.showcase.component.detailDrawer.sections.tabbed.badge.drawer":
    "drawer",
  "designlab.showcase.component.detailDrawer.sections.tabbed.badge.stable":
    "estable",
  "designlab.showcase.component.detailDrawer.sections.tabbed.badge.review":
    "revision",
  "designlab.showcase.component.detailDrawer.sections.tabbed.panelReview":
    "Panel de revision de detalle",
  "designlab.showcase.component.detailDrawer.sections.tabbed.open":
    "Drawer de detalle",
  "designlab.showcase.component.detailDrawer.sections.tabbed.badgeTabbed":
    "tabbed",
  "designlab.showcase.component.detailDrawer.sections.tabbed.drawerTitle":
    "Detalle del rollout",
  "designlab.showcase.component.detailDrawer.sections.tabbed.tabs.summary.label":
    "Resumen",
  "designlab.showcase.component.detailDrawer.sections.tabbed.tabs.summary.ownerLabel":
    "Responsable",
  "designlab.showcase.component.detailDrawer.sections.tabbed.tabs.summary.ownerValue":
    "Operaciones de plataforma",
  "designlab.showcase.component.detailDrawer.sections.tabbed.tabs.summary.scopeLabel":
    "Alcance",
  "designlab.showcase.component.detailDrawer.sections.tabbed.tabs.summary.scopeValue":
    "rollout TR + UE",
  "designlab.showcase.component.detailDrawer.sections.tabbed.tabs.audit.label":
    "Auditoria",
  "designlab.showcase.component.detailDrawer.sections.tabbed.tabs.audit.approvalLabel":
    "Aprobacion",
  "designlab.showcase.component.detailDrawer.sections.tabbed.tabs.audit.approvalValue":
    "07 Mar 2026 / aprobado",
  "designlab.showcase.component.detailDrawer.sections.tabbed.tabs.audit.traceLabel":
    "Trazabilidad",
  "designlab.showcase.component.detailDrawer.sections.tabbed.tabs.audit.traceValue":
    "trace-id: overlay-4471",
  "designlab.showcase.component.detailDrawer.sections.tabbed.panelGuideline":
    "Guia",
  "designlab.showcase.component.detailDrawer.sections.tabbed.guideline":
    "DetailDrawer es adecuado para presentar detalle, auditoria y contenido de resumen sin romper la ruta. Prefiere drawers cuando la densidad de contenido supera a la de un modal.",
  "designlab.showcase.component.detailDrawer.sections.readonly.eyebrow":
    "Alternativa 02",
  "designlab.showcase.component.detailDrawer.sections.readonly.title":
    "Drawer de evidencia de solo lectura",
  "designlab.showcase.component.detailDrawer.sections.readonly.description":
    "Agrupa bloques de evidencia y resumen en una superficie de revision ordenada sin tabs.",
  "designlab.showcase.component.detailDrawer.sections.readonly.badge.readonly":
    "solo lectura",
  "designlab.showcase.component.detailDrawer.sections.readonly.badge.evidence":
    "evidencia",
  "designlab.showcase.component.detailDrawer.sections.readonly.badge.summary":
    "resumen",
  "designlab.showcase.component.detailDrawer.sections.readonly.panelEvidence":
    "Resumen de evidencia",
  "designlab.showcase.component.detailDrawer.sections.readonly.card.title":
    "Evidencia de despliegue",
  "designlab.showcase.component.detailDrawer.sections.readonly.card.body":
    "Un detail drawer tambien puede funcionar como una unica superficie de resumen. Es especialmente util para revisar evidencia y snapshots de solo lectura.",
  "designlab.showcase.component.detailDrawer.sections.readonly.panelRule":
    "Regla practica",
  "designlab.showcase.component.detailDrawer.sections.readonly.rule":
    "Si el contenido se vuelve largo, usa secciones o tabs dentro del drawer; si la revision es corta y pasiva, un resumen sin tabs es suficiente.",
  "designlab.showcase.component.popover.sections.rich.eyebrow":
    "Alternativa 01",
  "designlab.showcase.component.popover.sections.rich.title":
    "Guia contextual enriquecida",
  "designlab.showcase.component.popover.sections.rich.description":
    "Muestra informacion contextual en el lugar cuando un tooltip es demasiado corto y un drawer demasiado pesado.",
  "designlab.showcase.component.popover.sections.rich.badge.popover": "popover",
  "designlab.showcase.component.popover.sections.rich.badge.beta": "beta",
  "designlab.showcase.component.popover.sections.rich.badge.guidance": "guia",
  "designlab.showcase.component.popover.sections.rich.panelHelper":
    "Ayuda contextual",
  "designlab.showcase.component.popover.sections.rich.popoverTitle":
    "Nota de policy",
  "designlab.showcase.component.popover.sections.rich.open": "Abrir popover",
  "designlab.showcase.component.popover.sections.rich.body":
    "Esta area solo puede editarse mientras la ventana de publicacion este abierta. El alcance y el riesgo se explican en un panel breve.",
  "designlab.showcase.component.popover.sections.rich.tag.contextual":
    "contextual",
  "designlab.showcase.component.popover.sections.rich.tag.policy": "policy",
  "designlab.showcase.component.popover.sections.rich.panelGuideline": "Guia",
  "designlab.showcase.component.popover.sections.rich.guideline":
    "Usa popovers para contenido breve pero rico. No es un menu; aporta un panel de ayuda, contexto extra o un pequeno grupo de acciones.",
  "designlab.showcase.component.popover.sections.readonly.eyebrow":
    "Alternativa 02",
  "designlab.showcase.component.popover.sections.readonly.title":
    "Panel auxiliar de solo lectura",
  "designlab.showcase.component.popover.sections.readonly.description":
    "Hace mas visible la informacion de causa y efecto que un tooltip en flujos readonly o disabled.",
  "designlab.showcase.component.popover.sections.readonly.badge.readonly":
    "solo lectura",
  "designlab.showcase.component.popover.sections.readonly.badge.helper":
    "ayuda",
  "designlab.showcase.component.popover.sections.readonly.badge.panel": "panel",
  "designlab.showcase.component.popover.sections.readonly.panelHelper":
    "Ayuda de solo lectura",
  "designlab.showcase.component.popover.sections.readonly.popoverTitle":
    "Motivo del modo readonly",
  "designlab.showcase.component.popover.sections.readonly.open":
    "Por que esta deshabilitado?",
  "designlab.showcase.component.popover.sections.readonly.body":
    "Un popover de solo lectura no deberia abrirse; en este caso debe elegirse otra superficie.",
  "designlab.showcase.component.popover.sections.readonly.panelRule":
    "Regla practica",
  "designlab.showcase.component.popover.sections.readonly.rule":
    "Si el usuario no puede actuar, el propio popover tambien debe seguir el policy guard; considera un tooltip o un mensaje inline como alternativa.",
  "designlab.showcase.component.contextMenu.sections.trigger.eyebrow":
    "Alternativa 01",
  "designlab.showcase.component.contextMenu.sections.trigger.title":
    "Menu de acciones / atajos de release",
  "designlab.showcase.component.contextMenu.sections.trigger.description":
    "Muestra listas cortas de acciones junto con contexto de policy y revision en el mismo overlay.",
  "designlab.showcase.component.contextMenu.sections.trigger.badge.overlay":
    "extension-overlay",
  "designlab.showcase.component.contextMenu.sections.trigger.badge.beta":
    "beta",
  "designlab.showcase.component.contextMenu.sections.trigger.badge.actions":
    "acciones",
  "designlab.showcase.component.contextMenu.sections.trigger.panelButton":
    "Disparador por boton",
  "designlab.showcase.component.contextMenu.sections.trigger.button":
    "Menu contextual",
  "designlab.showcase.component.contextMenu.sections.trigger.menuTitle":
    "Acciones de release",
  "designlab.showcase.component.contextMenu.sections.trigger.items.approve.label":
    "Iniciar flujo de aprobacion",
  "designlab.showcase.component.contextMenu.sections.trigger.items.approve.description":
    "Reune aprobacion humana y evidencia del wave gate en el mismo lugar.",
  "designlab.showcase.component.contextMenu.sections.trigger.items.review.label":
    "Agregar a la cola de revision",
  "designlab.showcase.component.contextMenu.sections.trigger.items.review.description":
    "Genera revision readonly y solicitudes adicionales de evidencia.",
  "designlab.showcase.component.contextMenu.sections.trigger.items.archive.label":
    "Mover al archivo",
  "designlab.showcase.component.contextMenu.sections.trigger.items.archive.description":
    "Mueve variantes obsoletas al area de backlog planificado.",
  "designlab.showcase.component.contextMenu.sections.trigger.lastSelection":
    "Ultima seleccion:",
  "designlab.showcase.component.contextMenu.sections.trigger.panelGuideline":
    "Guia",
  "designlab.showcase.component.contextMenu.sections.trigger.guideline":
    "Un menu contextual no es un arbol multinivel ni un panel de explicacion largo. Usalo para acciones contextuales breves; elige un popover o un drawer cuando haga falta informacion mas profunda.",
  "designlab.showcase.component.contextMenu.sections.surface.eyebrow":
    "Alternativa 02",
  "designlab.showcase.component.contextMenu.sections.surface.title":
    "Menu de clic derecho / superficie",
  "designlab.showcase.component.contextMenu.sections.surface.description":
    "Usa el mismo contrato para el comportamiento de clic derecho en lienzos o tarjetas.",
  "designlab.showcase.component.contextMenu.sections.surface.badge.rightClick":
    "clic-derecho",
  "designlab.showcase.component.contextMenu.sections.surface.badge.surface":
    "superficie",
  "designlab.showcase.component.contextMenu.sections.surface.badge.policy":
    "policy",
  "designlab.showcase.component.contextMenu.sections.surface.panelSurface":
    "Disparador de superficie",
  "designlab.showcase.component.contextMenu.sections.surface.menuTitle":
    "Acciones de superficie",
  "designlab.showcase.component.contextMenu.sections.surface.items.duplicate.label":
    "Duplicar tarjeta",
  "designlab.showcase.component.contextMenu.sections.surface.items.pin.label":
    "Fijar vista",
  "designlab.showcase.component.contextMenu.sections.surface.items.readonly.label":
    "Mostrar motivo readonly",
  "designlab.showcase.component.contextMenu.sections.surface.items.readonly.description":
    "Limitado por el policy guard.",
  "designlab.showcase.component.contextMenu.sections.surface.triggerTitle":
    "Clic derecho",
  "designlab.showcase.component.contextMenu.sections.surface.body":
    "Los menus de superficie ofrecen acciones rapidas sobre filas, tarjetas o areas de canvas. No deben usarse para arboles de navegacion.",
  "designlab.showcase.component.contextMenu.sections.surface.panelRule":
    "Regla practica",
  "designlab.showcase.component.contextMenu.sections.surface.rule":
    "Si existe un menu de clic derecho, las mismas acciones tambien deben existir mediante un disparador accesible por boton. No son aceptables los disenos exclusivos para usuarios de raton.",
  "designlab.showcase.component.tourCoachmarks.sections.guided.eyebrow":
    "Alternativa 01",
  "designlab.showcase.component.tourCoachmarks.sections.guided.title":
    "Onboarding guiado / revision de release",
  "designlab.showcase.component.tourCoachmarks.sections.guided.description":
    "Una superficie guiada que explica paso a paso la evidencia de wave, preview y release.",
  "designlab.showcase.component.tourCoachmarks.sections.guided.badge.tour":
    "tour",
  "designlab.showcase.component.tourCoachmarks.sections.guided.badge.guided":
    "guiado",
  "designlab.showcase.component.tourCoachmarks.sections.guided.badge.compliance":
    "cumplimiento",
  "designlab.showcase.component.tourCoachmarks.sections.guided.panelWalkthrough":
    "Recorrido interactivo",
  "designlab.showcase.component.tourCoachmarks.sections.guided.open":
    "Iniciar recorrido",
  "designlab.showcase.component.tourCoachmarks.sections.guided.status.finished":
    "finalizado",
  "designlab.showcase.component.tourCoachmarks.sections.guided.status.guided":
    "guiado",
  "designlab.showcase.component.tourCoachmarks.sections.guided.status.idle":
    "inactivo",
  "designlab.showcase.component.tourCoachmarks.sections.guided.steps.scope.title":
    "Validacion de alcance",
  "designlab.showcase.component.tourCoachmarks.sections.guided.steps.scope.description":
    "Primero se aclaran los contratos de wave y registry para que el usuario vea que se esta publicando.",
  "designlab.showcase.component.tourCoachmarks.sections.guided.steps.preview.title":
    "Revision de demo en vivo",
  "designlab.showcase.component.tourCoachmarks.sections.guided.steps.preview.description":
    "La evidencia de preview, API y quality se explica dentro del mismo recorrido.",
  "designlab.showcase.component.tourCoachmarks.sections.guided.steps.release.title":
    "Evidencia de release",
  "designlab.showcase.component.tourCoachmarks.sections.guided.steps.release.description":
    "El recorrido no se completa hasta terminar la evidencia de doctor, gate y guardrails de seguridad.",
  "designlab.showcase.component.tourCoachmarks.sections.guided.panelGuideline":
    "Guia",
  "designlab.showcase.component.tourCoachmarks.sections.guided.guideline":
    "Los tours y coachmarks no sirven solo para onboarding; tambien encajan en flujos criticos de aprobacion, release y policy que necesitan contexto paso a paso.",
  "designlab.showcase.component.tourCoachmarks.sections.readonly.eyebrow":
    "Alternativa 02",
  "designlab.showcase.component.tourCoachmarks.sections.readonly.title":
    "Recorrido de cumplimiento readonly",
  "designlab.showcase.component.tourCoachmarks.sections.readonly.description":
    "Lleva motivos de policy readonly y puntos de control en una narrativa serena.",
  "designlab.showcase.component.tourCoachmarks.sections.readonly.badge.readonly":
    "solo lectura",
  "designlab.showcase.component.tourCoachmarks.sections.readonly.badge.policy":
    "policy",
  "designlab.showcase.component.tourCoachmarks.sections.readonly.badge.walkthrough":
    "recorrido",
  "designlab.showcase.component.tourCoachmarks.sections.readonly.panelTour":
    "Recorrido readonly",
  "designlab.showcase.component.tourCoachmarks.sections.readonly.steps.policy.title":
    "Explicacion de policy",
  "designlab.showcase.component.tourCoachmarks.sections.readonly.steps.policy.description":
    "Un recorrido readonly lleva informacion de causa y efecto para areas criticas dentro del mismo overlay.",
  "designlab.showcase.component.tourCoachmarks.sections.readonly.steps.controls.title":
    "Puntos de control",
  "designlab.showcase.component.tourCoachmarks.sections.readonly.steps.controls.description":
    "Los botones de release no deben seguir visibles hasta que se completen la aprobacion y las revisiones de seguridad.",
  "designlab.showcase.component.tourCoachmarks.sections.readonly.panelRule":
    "Regla practica",
  "designlab.showcase.component.tourCoachmarks.sections.readonly.rule":
    "Si la superficie de coachmarks necesita contenido muy largo, debe convertirse en una pagina de docs o en una estructura de paneles. Manten los recorridos cortos, guiados y centrados en la tarea.",
  "designlab.showcase.component.textInput.sections.profile.eyebrow":
    "Alternativa 01",
  "designlab.showcase.component.textInput.sections.profile.title":
    "Campo de perfil / cuenta",
  "designlab.showcase.component.textInput.sections.profile.description":
    "Flujo clasico de formulario con etiqueta, descripcion, ayuda y contador de caracteres.",
  "designlab.showcase.component.textInput.sections.profile.badge.form":
    "formulario",
  "designlab.showcase.component.textInput.sections.profile.badge.stable":
    "estable",
  "designlab.showcase.component.textInput.sections.profile.badge.count":
    "contador",
  "designlab.showcase.component.textInput.sections.profile.panelFilled":
    "Campo de cuenta completo",
  "designlab.showcase.component.textInput.sections.profile.panelGuideline":
    "Nota de uso",
  "designlab.showcase.component.textInput.sections.profile.guideline":
    "En campos de formulario primarios, la etiqueta, la descripcion y la ayuda deben aparecer juntas. Los contadores solo deben mostrarse cuando haya presion de longitud.",
  "designlab.showcase.component.textInput.sections.search.eyebrow":
    "Alternativa 02",
  "designlab.showcase.component.textInput.sections.search.title":
    "Entrada de busqueda / barra de comandos",
  "designlab.showcase.component.textInput.sections.search.description":
    "Variante mas rapida, corta y orientada a la accion para filas de busqueda y filtro.",
  "designlab.showcase.component.textInput.sections.search.badge.search":
    "busqueda",
  "designlab.showcase.component.textInput.sections.search.badge.compact":
    "compacta",
  "designlab.showcase.component.textInput.sections.search.badge.leadingIcon":
    "icono-inicial",
  "designlab.showcase.component.textInput.sections.search.panelSearch":
    "Busqueda",
  "designlab.showcase.component.textInput.sections.search.searchLabel":
    "Buscar",
  "designlab.showcase.component.textInput.sections.search.searchDescription":
    "Busca un registro, empresa o usuario.",
  "designlab.showcase.component.textInput.sections.search.panelFilterRow":
    "Fila de filtros",
  "designlab.showcase.component.textInput.sections.search.quickFilterLabel":
    "Filtro rapido",
  "designlab.showcase.component.textInput.sections.search.apply": "Aplicar",
  "designlab.showcase.component.textInput.sections.validation.eyebrow":
    "Alternativa 03",
  "designlab.showcase.component.textInput.sections.validation.title":
    "Validacion / matriz de estados",
  "designlab.showcase.component.textInput.sections.validation.description":
    "Comportamiento validado, invalido y de solo lectura con el mismo primitive.",
  "designlab.showcase.component.textInput.sections.validation.badge.validation":
    "validacion",
  "designlab.showcase.component.textInput.sections.validation.badge.readonly":
    "solo-lectura",
  "designlab.showcase.component.textInput.sections.validation.panelValidated":
    "Validado",
  "designlab.showcase.component.textInput.sections.validation.panelInvalid":
    "Invalido",
  "designlab.showcase.component.textInput.sections.validation.panelReadonly":
    "Solo lectura",
  "designlab.showcase.component.textInput.sections.density.eyebrow":
    "Alternativa 04",
  "designlab.showcase.component.textInput.sections.density.title":
    "Matriz de densidad / tamano",
  "designlab.showcase.component.textInput.sections.density.description":
    "Opciones pequenas, medianas y grandes de area de toque con la misma API.",
  "designlab.showcase.component.textInput.sections.density.panelSmall":
    "Pequeno",
  "designlab.showcase.component.textInput.sections.density.panelMedium":
    "Mediano",
  "designlab.showcase.component.textInput.sections.density.panelLarge":
    "Grande",
  "designlab.showcase.component.textInput.sections.density.smallLabel":
    "Campo compacto",
  "designlab.showcase.component.textInput.sections.density.mediumLabel":
    "Campo predeterminado",
  "designlab.showcase.component.textInput.sections.density.largeLabel":
    "Campo destacado",
  "designlab.showcase.component.textInput.sections.invite.eyebrow":
    "Alternativa 05",
  "designlab.showcase.component.textInput.sections.invite.title":
    "Accion inline / flujo de invitacion",
  "designlab.showcase.component.textInput.sections.invite.description":
    "Flujo corto que muestra el campo y la accion en el mismo bloque.",
  "designlab.showcase.component.textInput.sections.invite.badge.actionPair":
    "par-accion",
  "designlab.showcase.component.textInput.sections.invite.badge.taskFlow":
    "flujo-tarea",
  "designlab.showcase.component.textInput.sections.invite.panelInput":
    "Campo de invitacion",
  "designlab.showcase.component.textInput.sections.invite.label":
    "Correo de invitacion",
  "designlab.showcase.component.textInput.sections.invite.descriptionShort":
    "Agregar una nueva parte interesada.",
  "designlab.showcase.component.textInput.sections.invite.pending": "Pendiente",
  "designlab.showcase.component.textInput.sections.invite.send":
    "Enviar invitacion",
  "designlab.showcase.component.textInput.sections.access.eyebrow":
    "Alternativa 06",
  "designlab.showcase.component.textInput.sections.access.title":
    "Estados controlados por politica / acceso",
  "designlab.showcase.component.textInput.sections.access.description":
    "Modos oculto, deshabilitado y de solo lectura de la misma componente.",
  "designlab.showcase.component.textInput.sections.access.badge.access":
    "acceso",
  "designlab.showcase.component.textInput.sections.access.badge.policy":
    "politica",
  "designlab.showcase.component.textInput.sections.access.badge.governance":
    "gobernanza",
  "designlab.showcase.component.textInput.sections.access.panelReadonly":
    "Solo lectura",
  "designlab.showcase.component.textInput.sections.access.readonlyLabel":
    "Campo de contrato",
  "designlab.showcase.component.textInput.sections.access.readonlyHint":
    "Solo el sistema puede modificar este campo.",
  "designlab.showcase.component.textInput.sections.access.panelDisabled":
    "Deshabilitado",
  "designlab.showcase.component.textInput.sections.access.disabledLabel":
    "Bloqueado despues de publicar",
  "designlab.showcase.component.textInput.sections.access.disabledHint":
    "La edicion queda cerrada despues de publicar.",
  "designlab.showcase.component.textInput.sections.access.panelRule":
    "Regla practica",
  "designlab.showcase.component.textInput.sections.access.rule":
    "Un estado oculto no debe dejar espacio vacio en la pagina; disabled y readonly no deben verse iguales. Uno es pasivo y el otro esta bloqueado, pero sigue informando.",
  "designlab.seed.summaryStrip.active.title": "Tasa de precision",
  "designlab.seed.summaryStrip.active.value": "98%",
  "designlab.seed.summaryStrip.active.note": "7 dias",
  "designlab.seed.summaryStrip.active.tone": "positive",
  "designlab.seed.summaryStrip.pending.title": "Requiere revision",
  "designlab.seed.summaryStrip.pending.value": "4",
  "designlab.seed.summaryStrip.pending.note":
    "Necesita decision del responsable",
  "designlab.seed.summaryStrip.pending.tone": "warning",
  "designlab.seed.summaryStrip.blocked.title": "Bloqueado",
  "designlab.seed.summaryStrip.blocked.value": "1",
  "designlab.seed.summaryStrip.blocked.note": "Dependencia de lanzamiento",
  "designlab.seed.summaryStrip.blocked.tone": "critical",
  "designlab.seed.entitySummary.contract.title": "Contrato de lanzamiento",
  "designlab.seed.entitySummary.contract.value": "Sincronizado",
  "designlab.seed.entitySummary.contract.note": "Manifest y doctor alineados",
  "designlab.seed.entitySummary.contract.badge": "PASS",
  "designlab.seed.entitySummary.contract.tone": "positive",
  "designlab.seed.entitySummary.migration.title": "Migracion",
  "designlab.seed.entitySummary.migration.value": "2 acciones",
  "designlab.seed.entitySummary.migration.note": "Checklist lista para aplicar",
  "designlab.seed.entitySummary.migration.badge": "READY",
  "designlab.seed.entitySummary.migration.tone": "warning",
  "designlab.seed.entitySummary.adoption.title": "Adopcion",
  "designlab.seed.entitySummary.adoption.value": "34 equipos",
  "designlab.seed.entitySummary.adoption.note": "Cobertura en crecimiento",
  "designlab.seed.entitySummary.adoption.badge": "TRACKED",
  "designlab.seed.entitySummary.adoption.tone": "info",
  "designlab.seed.gridRows.alpha.name": "Revision de permisos",
  "designlab.seed.gridRows.alpha.status": "Activo",
  "designlab.seed.gridRows.beta.name": "Consola de variantes",
  "designlab.seed.gridRows.beta.status": "Pendiente",
  "designlab.seed.gridRows.gamma.name": "Flujo de adopcion",
  "designlab.seed.gridRows.gamma.status": "Bloqueado",
  "designlab.seed.serverGridRows.alpha.name": "Revision de permisos",
  "designlab.seed.serverGridRows.alpha.owner": "Equipo Acceso",
  "designlab.seed.serverGridRows.beta.name": "Consola de variantes",
  "designlab.seed.serverGridRows.beta.owner": "Equipo UI",
  "designlab.seed.serverGridRows.gamma.name": "Flujo de adopcion",
  "designlab.seed.serverGridRows.gamma.owner": "Equipo Plataforma",
  "designlab.showcase.component.summaryStrip.live.title": "Barra de resumen",
  "designlab.showcase.component.summaryStrip.live.description":
    "Muestra metricas compactas para release, migracion y adopcion en un solo nivel.",
  "designlab.showcase.component.summaryStrip.sections.releaseMetrics.eyebrow":
    "Seccion 01",
  "designlab.showcase.component.summaryStrip.sections.releaseMetrics.title":
    "Metricas de release",
  "designlab.showcase.component.summaryStrip.sections.releaseMetrics.description":
    "Muestra un resumen compacto para leer rapido el contrato de release y la salud del rollout.",
  "designlab.showcase.component.summaryStrip.sections.releaseMetrics.badge1":
    "Metricas compactas",
  "designlab.showcase.component.summaryStrip.sections.releaseMetrics.badge2":
    "Resumen de release",
  "designlab.showcase.component.summaryStrip.sections.releaseMetrics.badge3":
    "Densidad alineada",
  "designlab.showcase.component.summaryStrip.sections.releaseMetrics.panelTitle":
    "Barra para metricas de release",
  "designlab.showcase.component.summaryStrip.sections.releaseMetrics.metric1Label":
    "Espacios de metricas",
  "designlab.showcase.component.summaryStrip.sections.releaseMetrics.metric1Value":
    "3 elementos",
  "designlab.showcase.component.summaryStrip.sections.releaseMetrics.metric1Note":
    "Precision, revision y bloqueado",
  "designlab.showcase.component.summaryStrip.sections.releaseMetrics.metric2Label":
    "Contexto de lectura",
  "designlab.showcase.component.summaryStrip.sections.releaseMetrics.metric2Value":
    "Una sola linea",
  "designlab.showcase.component.summaryStrip.sections.releaseMetrics.metric2Note":
    "Sin perder jerarquia visual",
  "designlab.showcase.component.summaryStrip.sections.compactOwnership.eyebrow":
    "Seccion 02",
  "designlab.showcase.component.summaryStrip.sections.compactOwnership.title":
    "Resumen compacto de responsables",
  "designlab.showcase.component.summaryStrip.sections.compactOwnership.description":
    "Usa la misma barra para ownership y revision cuando el panel lateral debe quedar ligero.",
  "designlab.showcase.component.summaryStrip.sections.compactOwnership.badge1":
    "Responsables",
  "designlab.showcase.component.summaryStrip.sections.compactOwnership.badge2":
    "Traspaso de revision",
  "designlab.showcase.component.summaryStrip.sections.compactOwnership.badge3":
    "Resumen operativo",
  "designlab.showcase.component.summaryStrip.sections.compactOwnership.panelTitle":
    "Barra compacta para responsables",
  "designlab.showcase.component.summaryStrip.sections.compactOwnership.metric1Label":
    "Linea",
  "designlab.showcase.component.summaryStrip.sections.compactOwnership.metric1Value":
    "AI UX",
  "designlab.showcase.component.summaryStrip.sections.compactOwnership.metric1Note":
    "Linea principal del componente",
  "designlab.showcase.component.summaryStrip.sections.compactOwnership.metric2Label":
    "Responsable",
  "designlab.showcase.component.summaryStrip.sections.compactOwnership.metric2Value":
    "Equipo UI",
  "designlab.showcase.component.summaryStrip.sections.compactOwnership.metric2Note":
    "Sigue el contrato de cambios",
  "designlab.showcase.component.entitySummaryBlock.live.title":
    "Bloque de resumen",
  "designlab.showcase.component.entitySummaryBlock.live.description":
    "Agrupa contrato, migracion y adopcion en un resumen vertical de lectura rapida.",
  "designlab.showcase.component.entitySummaryBlock.sections.primary.eyebrow":
    "Seccion 01",
  "designlab.showcase.component.entitySummaryBlock.sections.primary.title":
    "Resumen principal",
  "designlab.showcase.component.entitySummaryBlock.sections.primary.description":
    "Usa el bloque para combinar estado, nota de release y ownership dentro del detail workspace.",
  "designlab.showcase.component.entitySummaryBlock.sections.primary.badge1":
    "Contrato",
  "designlab.showcase.component.entitySummaryBlock.sections.primary.badge2":
    "Migracion",
  "designlab.showcase.component.entitySummaryBlock.sections.primary.badge3":
    "Adopcion",
  "designlab.showcase.component.entitySummaryBlock.sections.primary.panelTitle":
    "Bloque de resumen para contrato",
  "designlab.showcase.component.entitySummaryBlock.sections.primary.metric1Label":
    "Tarjetas",
  "designlab.showcase.component.entitySummaryBlock.sections.primary.metric1Value":
    "3 paneles",
  "designlab.showcase.component.entitySummaryBlock.sections.primary.metric1Note":
    "Contrato, migracion, adopcion",
  "designlab.showcase.component.entitySummaryBlock.sections.primary.metric2Label":
    "Direccion",
  "designlab.showcase.component.entitySummaryBlock.sections.primary.metric2Value":
    "Flujo vertical",
  "designlab.showcase.component.entitySummaryBlock.sections.primary.metric2Note":
    "Adecuado para rail o panel lateral",
  "designlab.showcase.component.entitySummaryBlock.sections.withAvatar.eyebrow":
    "Seccion 02",
  "designlab.showcase.component.entitySummaryBlock.sections.withAvatar.title":
    "Resumen con avatar",
  "designlab.showcase.component.entitySummaryBlock.sections.withAvatar.description":
    "Agrega ownership visual cuando el bloque debe resaltar persona o equipo responsable.",
  "designlab.showcase.component.entitySummaryBlock.sections.withAvatar.badge1":
    "Responsabilidad visible",
  "designlab.showcase.component.entitySummaryBlock.sections.withAvatar.badge2":
    "traspaso-avatar",
  "designlab.showcase.component.entitySummaryBlock.sections.withAvatar.badge3":
    "Contexto operativo",
  "designlab.showcase.component.entitySummaryBlock.sections.withAvatar.panelTitle":
    "Bloque con responsable visible",
  "designlab.showcase.component.entitySummaryBlock.sections.withAvatar.metric1Label":
    "Responsable",
  "designlab.showcase.component.entitySummaryBlock.sections.withAvatar.metric1Value":
    "Equipo Plataforma",
  "designlab.showcase.component.entitySummaryBlock.sections.withAvatar.metric1Note":
    "Responsable del rollout",
  "designlab.showcase.component.entitySummaryBlock.sections.withAvatar.metric2Label":
    "Modo",
  "designlab.showcase.component.entitySummaryBlock.sections.withAvatar.metric2Value":
    "Revision",
  "designlab.showcase.component.entitySummaryBlock.sections.withAvatar.metric2Note":
    "Listo para la checklist de decision",
  "designlab.showcase.component.agGridServer.shared.columns.name": "Nombre",
  "designlab.showcase.component.agGridServer.shared.columns.owner":
    "Responsable",
  "designlab.showcase.component.agGridServer.sections.ownershipList.eyebrow":
    "Seccion 01",
  "designlab.showcase.component.agGridServer.sections.ownershipList.title":
    "Lista server-side con ownership",
  "designlab.showcase.component.agGridServer.sections.ownershipList.description":
    "Muestra ownership y handoff en una grilla server-side para registros largos de release.",
  "designlab.showcase.component.agGridServer.sections.ownershipList.badge1":
    "Server-side",
  "designlab.showcase.component.agGridServer.sections.ownershipList.badge2":
    "Ownership",
  "designlab.showcase.component.agGridServer.sections.ownershipList.badge3":
    "Large list",
  "designlab.showcase.component.agGridServer.sections.ownershipList.panelTitle":
    "Grilla server-side con ownership",
  "designlab.showcase.component.agGridServer.sections.ownershipList.metric1Label":
    "Filas visibles",
  "designlab.showcase.component.agGridServer.sections.ownershipList.metric1Value":
    "3 registros",
  "designlab.showcase.component.agGridServer.sections.ownershipList.metric1Note":
    "Fixture del servidor",
  "designlab.showcase.component.agGridServer.sections.ownershipList.metric2Label":
    "Modo de datos",
  "designlab.showcase.component.agGridServer.sections.ownershipList.metric2Value":
    "Server-side",
  "designlab.showcase.component.agGridServer.sections.ownershipList.metric2Note":
    "Datasource remoto listo",
  "designlab.showcase.component.agGridServer.sections.loadingContract.eyebrow":
    "Seccion 02",
  "designlab.showcase.component.agGridServer.sections.loadingContract.title":
    "Contrato de carga",
  "designlab.showcase.component.agGridServer.sections.loadingContract.description":
    "Enfatiza la relacion entre loading state, filtros y contrato de consulta del servidor.",
  "designlab.showcase.component.agGridServer.sections.loadingContract.badge1":
    "Loading",
  "designlab.showcase.component.agGridServer.sections.loadingContract.badge2":
    "Contrato",
  "designlab.showcase.component.agGridServer.sections.loadingContract.badge3":
    "Filters",
  "designlab.showcase.component.agGridServer.sections.loadingContract.panelTitle":
    "Contrato de carga server-side",
  "designlab.showcase.component.agGridServer.sections.loadingContract.metric1Label":
    "Surface",
  "designlab.showcase.component.agGridServer.sections.loadingContract.metric1Value":
    "Grid shell",
  "designlab.showcase.component.agGridServer.sections.loadingContract.metric1Note":
    "Adecuado para detalle y reportes",
  "designlab.showcase.component.agGridServer.sections.loadingContract.metric2Label":
    "Dependencia",
  "designlab.showcase.component.agGridServer.sections.loadingContract.metric2Value":
    "Query params",
  "designlab.showcase.component.agGridServer.sections.loadingContract.metric2Note":
    "Sincronizado con filtros",
  "designlab.showcase.component.entityGridTemplate.shared.columns.name":
    "Nombre",
  "designlab.showcase.component.entityGridTemplate.shared.columns.owner":
    "Responsable",
  "designlab.showcase.component.entityGridTemplate.sections.clientRegistry.eyebrow":
    "Seccion 01",
  "designlab.showcase.component.entityGridTemplate.sections.clientRegistry.title":
    "Registro en modo cliente",
  "designlab.showcase.component.entityGridTemplate.sections.clientRegistry.description":
    "Muestra resumen de entidad, ownership y acciones en un surface listo para inspection.",
  "designlab.showcase.component.entityGridTemplate.sections.clientRegistry.badge1":
    "Client mode",
  "designlab.showcase.component.entityGridTemplate.sections.clientRegistry.badge2":
    "Registry",
  "designlab.showcase.component.entityGridTemplate.sections.clientRegistry.badge3":
    "Inspection",
  "designlab.showcase.component.entityGridTemplate.sections.clientRegistry.panelTitle":
    "Template en modo cliente",
  "designlab.showcase.component.entityGridTemplate.sections.clientRegistry.metric1Label":
    "Toolbar",
  "designlab.showcase.component.entityGridTemplate.sections.clientRegistry.metric1Value":
    "Activo",
  "designlab.showcase.component.entityGridTemplate.sections.clientRegistry.metric1Note":
    "Busqueda, filtros, acciones",
  "designlab.showcase.component.entityGridTemplate.sections.clientRegistry.metric2Label":
    "Modo",
  "designlab.showcase.component.entityGridTemplate.sections.clientRegistry.metric2Value":
    "Client-side",
  "designlab.showcase.component.entityGridTemplate.sections.clientRegistry.metric2Note":
    "Con datos locales y summary",
  "designlab.showcase.component.entityGridTemplate.sections.serverMode.eyebrow":
    "Seccion 02",
  "designlab.showcase.component.entityGridTemplate.sections.serverMode.title":
    "Contrato en modo servidor",
  "designlab.showcase.component.entityGridTemplate.sections.serverMode.description":
    "Usa la misma plantilla con datasource remoto y handoff de ownership en report pages.",
  "designlab.showcase.component.entityGridTemplate.sections.serverMode.badge1":
    "Server mode",
  "designlab.showcase.component.entityGridTemplate.sections.serverMode.badge2":
    "Ownership",
  "designlab.showcase.component.entityGridTemplate.sections.serverMode.badge3":
    "Report page",
  "designlab.showcase.component.entityGridTemplate.sections.serverMode.panelTitle":
    "Template en modo servidor",
  "designlab.showcase.component.entityGridTemplate.sections.serverMode.metric1Label":
    "Datasource",
  "designlab.showcase.component.entityGridTemplate.sections.serverMode.metric1Value":
    "Remoto",
  "designlab.showcase.component.entityGridTemplate.sections.serverMode.metric1Note":
    "Listo para listas largas",
  "designlab.showcase.component.entityGridTemplate.sections.serverMode.metric2Label":
    "Contrato",
  "designlab.showcase.component.entityGridTemplate.sections.serverMode.metric2Value":
    "Sincronizado",
  "designlab.showcase.component.entityGridTemplate.sections.serverMode.metric2Note":
    "Filtros, toolbar y ownership alineados",
  "designlab.showcase.component.recommendationCard.live.interactive.panel":
    "Recomendacion interactiva",
  "designlab.showcase.component.recommendationCard.live.interactive.card.title":
    "Habilitar release para mas adopcion",
  "designlab.showcase.component.recommendationCard.live.interactive.card.summary":
    "Las verificaciones clave estan estables y puede empezar la siguiente fase.",
  "designlab.showcase.component.recommendationCard.live.interactive.card.type":
    "Rollout",
  "designlab.showcase.component.recommendationCard.live.interactive.rationale.doctor":
    "Doctor en verde",
  "designlab.showcase.component.recommendationCard.live.interactive.rationale.waveGate":
    "Wave gate en verde",
  "designlab.showcase.component.recommendationCard.live.interactive.rationale.riskRegister":
    "Sin bloqueadores abiertos",
  "designlab.showcase.component.recommendationCard.live.interactive.primaryAction.default":
    "Aplicar",
  "designlab.showcase.component.recommendationCard.live.interactive.primaryAction.applied":
    "Aplicado",
  "designlab.showcase.component.recommendationCard.live.interactive.secondaryAction.default":
    "Enviar a revision",
  "designlab.showcase.component.recommendationCard.live.interactive.secondaryAction.review":
    "Revision solicitada",
  "designlab.showcase.component.recommendationCard.live.interactive.footerNote":
    "Avisa al owner antes del merge.",
  "designlab.showcase.component.recommendationCard.live.interactive.badge.wave":
    "wave",
  "designlab.showcase.component.recommendationCard.live.interactive.badge.contract":
    "contrato",
  "designlab.showcase.component.recommendationCard.live.readonly.panel":
    "Recomendacion readonly",
  "designlab.showcase.component.recommendationCard.live.readonly.card.title":
    "Continuar primero con la revision",
  "designlab.showcase.component.recommendationCard.live.readonly.card.summary":
    "La recomendacion es visible, pero sigue siendo solo orientativa.",
  "designlab.showcase.component.recommendationCard.live.readonly.card.type":
    "Aviso",
  "designlab.showcase.component.recommendationCard.live.readonly.rationale.approvalQueue":
    "La cola de aprobacion sigue activa",
  "designlab.showcase.component.recommendationCard.live.readonly.rationale.policyImpact":
    "La policy exige revision humana",
  "designlab.showcase.component.recommendationCard.live.readonly.footerNote":
    "Sin ejecucion automatica en superficies readonly.",
  "designlab.showcase.component.confidenceBadge.live.matrix.panel":
    "Matriz de confianza",
  "designlab.showcase.component.confidenceBadge.live.compact.panel":
    "Confianza compacta",
  "designlab.showcase.component.confidenceBadge.live.compact.manualReviewLabel":
    "Revision manual",
  "designlab.showcase.component.confidenceBadge.live.compact.note":
    "Adecuado para tablas densas y filas de cola.",
  "designlab.showcase.component.approvalCheckpoint.live.interactive.panel":
    "Checkpoint interactivo",
  "designlab.showcase.component.approvalCheckpoint.live.interactive.card.title":
    "Aprobacion pendiente",
  "designlab.showcase.component.approvalCheckpoint.live.interactive.card.summary":
    "Un owner debe confirmar la recomendacion.",
  "designlab.showcase.component.approvalCheckpoint.live.interactive.card.approverLabel":
    "Aprobador",
  "designlab.showcase.component.approvalCheckpoint.live.interactive.card.dueLabel":
    "Vence",
  "designlab.showcase.component.approvalCheckpoint.live.interactive.card.footerNote":
    "El rollout continua despues de la aprobacion.",
  "designlab.showcase.component.approvalCheckpoint.live.readonly.panel":
    "Checkpoint readonly",
  "designlab.showcase.component.approvalCheckpoint.live.readonly.card.title":
    "Ya enviado a revision",
  "designlab.showcase.component.approvalCheckpoint.live.readonly.card.summary":
    "Solo estado visible, sin interaccion.",
  "designlab.showcase.component.approvalCheckpoint.live.interactive.badge.aiNative":
    "IA nativa",
  "designlab.tabs.general.label": "General",
  "designlab.tabs.api.label": "Interfaz",
  "designlab.tabs.ux.label": "Experiencia",
  "designlab.componentContracts.empty.description":
    "No se encontraron registros.",
  "designlab.componentContracts.jsonViewer.emptyFallbackDescription":
    "No hay un payload JSON disponible.",
  "designlab.componentContracts.jsonViewer.emptyNodeDescription":
    "Este nodo está vacío.",
  "designlab.componentContracts.anchorToc.title": "En esta página",
  "designlab.componentContracts.anchorToc.navigationLabel":
    "Navegación en la página",
  "designlab.componentContracts.descriptions.emptyFallbackDescription":
    "No se encontraron detalles.",
  "designlab.componentContracts.list.emptyFallbackDescription":
    "No se encontraron registros.",
  "designlab.componentContracts.linkInline.externalScreenReaderLabel":
    "Enlace externo",
  "designlab.componentContracts.themePreviewCard.titleText": "Texto del título",
  "designlab.componentContracts.themePreviewCard.secondaryText":
    "Texto secundario",
  "designlab.componentContracts.themePreviewCard.saveLabel": "Guardar",
  "designlab.componentContracts.themePreviewCard.selectedLabel":
    "Vista previa de theme seleccionada",
  "designlab.general.component.import.label": "Importar",
  "designlab.general.component.release": "Lanzamiento",
  "designlab.metadata.demo": "Vista previa",
  "designlab.showcase.previewPanels.live.label": "En vivo",
  "designlab.showcase.component.planned.roadmap": "Hoja de ruta",
  "designlab.showcase.component.planned.title":
    "{name} todavía no está publicado",
  "designlab.showcase.component.planned.description":
    "Este elemento sigue en estado de backlog planificado. La vista previa en vivo permanece cerrada hasta completar export, demo en vivo y evidencia de regresión.",
  "designlab.showcase.component.planned.badge": "Elemento planificado",
  "designlab.showcase.component.planned.releaseGate": "Control de lanzamiento",
  "designlab.showcase.component.planned.releaseGate.value": "bloqueado",
  "designlab.showcase.component.planned.releaseGate.note":
    "Requiere implementación, sincronización de registry y vista previa.",
  "designlab.showcase.component.planned.wave": "Ola",
  "designlab.showcase.component.planned.wave.note":
    "Alineación con la wave del roadmap.",
  "designlab.showcase.component.planned.northStar": "Estrella del norte",
  "designlab.showcase.component.planned.northStar.title":
    "¿Dónde se usará este componente?",
  "designlab.showcase.component.planned.northStar.description":
    "Como es un elemento del roadmap, los contratos de UX y calidad deben fijarse antes de exportarlo.",
  "designlab.showcase.component.button.variants.title": "Variantes",
  "designlab.showcase.component.button.variants.primary": "Acción primaria",
  "designlab.showcase.component.button.variants.secondary": "Acción secundaria",
  "designlab.showcase.component.button.variants.ghost": "Acción fantasma",
  "designlab.showcase.component.button.variants.destructive":
    "Acción destructiva",
  "designlab.showcase.component.button.sizes.title": "Tamaños",
  "designlab.showcase.component.button.sizes.small": "Botón pequeño",
  "designlab.showcase.component.button.sizes.medium": "Botón mediano",
  "designlab.showcase.component.button.sizes.large": "Botón grande",
  "designlab.showcase.component.button.states.title": "Estados",
  "designlab.showcase.component.button.states.loadingLabel":
    "Guardando cambios",
  "designlab.showcase.component.button.states.save": "Guardar cambios",
  "designlab.showcase.component.button.states.disabled": "Acción deshabilitada",
  "designlab.showcase.component.button.states.readonly":
    "Acción de solo lectura",
  "designlab.showcase.component.button.states.fullWidth":
    "Continuar a revisión",
  "designlab.showcase.component.badge.default": "Predeterminado",
  "designlab.showcase.component.badge.info": "Información",
  "designlab.showcase.component.badge.success": "Éxito",
  "designlab.showcase.component.badge.warning": "Advertencia",
  "designlab.showcase.component.badge.danger": "Peligro",
  "designlab.showcase.component.avatar.sizes.title": "Tamaños",
  "designlab.showcase.component.avatar.image.title": "Imagen + cuadrado",
  "designlab.showcase.component.avatar.fallback.title": "Estados fallback",
  "designlab.showcase.component.breadcrumb.basic.title": "Ruta básica",
  "designlab.showcase.component.breadcrumb.basic.admin": "Administración",
  "designlab.showcase.component.breadcrumb.basic.uiKit": "Biblioteca UI",
  "designlab.showcase.component.breadcrumb.basic.navigation": "Navegación",
  "designlab.showcase.component.breadcrumb.collapsed.title": "Rastro colapsado",
  "designlab.showcase.component.breadcrumb.collapsed.workspace": "Workspace",
  "designlab.showcase.component.breadcrumb.collapsed.cockpit": "Cockpit",
  "designlab.showcase.component.breadcrumb.collapsed.libraries": "Bibliotecas",
  "designlab.showcase.component.breadcrumb.collapsed.uiSystem": "Sistema UI",
  "designlab.showcase.component.breadcrumb.collapsed.tabs": "Tabs",
  "designlab.showcase.component.menuBar.aria":
    "Navegación del encabezado shell",
  "designlab.showcase.component.menuBar.shell.title":
    "Receta del encabezado shell",
  "designlab.showcase.component.menuBar.shell.note":
    "La receta real de navegación del encabezado superior reúne ruta activa, área utilitaria y destinos frecuentes en una sola superficie.",
  "designlab.showcase.component.menuBar.constrained.title":
    "Overflow en ancho estrecho",
  "designlab.showcase.component.menuBar.constrained.note":
    "La misma receta cae a un menú overflow cuando el espacio se estrecha y mantiene estable el encabezado superior.",
  "designlab.showcase.component.anchorToc.title": "Mapa de secciones",
  "designlab.showcase.component.anchorToc.items.overview": "Resumen",
  "designlab.showcase.component.anchorToc.items.ux": "Contrato UX",
  "designlab.showcase.component.anchorToc.items.security": "Seguridad",
  "designlab.showcase.component.anchorToc.items.release":
    "Preparación para release",
  "designlab.showcase.component.anchorToc.deepLink.title":
    "Contenido con deep link",
  "designlab.showcase.component.anchorToc.deepLink.overview":
    "Empieza aquí para entender el propósito del componente, la superficie demo y la expectativa del consumidor.",
  "designlab.showcase.component.anchorToc.deepLink.ux":
    "Antes de publicar, fija el contrato de interacción, las reglas de densidad y las notas de accesibilidad.",
  "designlab.showcase.component.anchorToc.deepLink.security":
    "Documenta en esta superficie las restricciones de policy, el comportamiento de solo lectura y las rutas sensibles para auditoría.",
  "designlab.showcase.component.anchorToc.deepLink.release":
    "Cierra con evidencia de release, gates de regresión y notas de handoff para consumidores.",
  "designlab.showcase.component.iconButton.intent.title": "Intención",
  "designlab.showcase.component.iconButton.intent.add": "Agregar elemento",
  "designlab.showcase.component.iconButton.intent.pin": "Fijar elemento",
  "designlab.showcase.component.iconButton.intent.delete": "Eliminar elemento",
  "designlab.showcase.component.iconButton.states.title": "Estados",
  "designlab.showcase.component.iconButton.states.loading": "Acción de carga",
  "designlab.showcase.component.iconButton.states.locked": "Acción bloqueada",
  "designlab.showcase.component.iconButton.states.openMenu": "Abrir menú",
  "designlab.showcase.component.divider.horizontal.title": "Flujo horizontal",
  "designlab.showcase.component.divider.horizontal.top": "Contexto primario",
  "designlab.showcase.component.divider.horizontal.bottom":
    "Contexto secundario",
  "designlab.showcase.component.divider.vertical.title":
    "Vertical + etiqueta inline",
  "designlab.showcase.component.divider.vertical.left": "Antes",
  "designlab.showcase.component.divider.vertical.right": "Después",
  "designlab.showcase.component.divider.vertical.or": "O",
  "designlab.showcase.component.divider.semantic.title": "Uso semántico",
  "designlab.showcase.component.divider.semantic.contract":
    "Límite de contrato",
  "designlab.showcase.component.divider.semantic.decorative":
    "Usa divisores decorativos solo cuando la separación no tenga significado semántico.",
  "designlab.showcase.component.linkInline.links.title":
    "Enlaces internos / externos",
  "designlab.showcase.component.linkInline.links.internal": "Destino interno",
  "designlab.showcase.component.linkInline.links.external": "Destino externo",
  "designlab.showcase.component.linkInline.states.title": "Variantes de estado",
  "designlab.showcase.component.linkInline.states.current": "Ruta actual",
  "designlab.showcase.component.linkInline.states.disabled":
    "Ruta deshabilitada",
  "designlab.showcase.component.linkInline.states.secondary":
    "Acción secundaria",
  "designlab.showcase.component.skeleton.text": "Líneas de texto",
  "designlab.showcase.component.skeleton.avatarText": "Avatar + texto",
  "designlab.showcase.component.skeleton.card": "Bloque de tarjeta",
  "designlab.showcase.component.skeleton.tableRow": "Filas de tabla",
  "designlab.showcase.component.spinner.inline.title": "Spinner inline",
  "designlab.showcase.component.spinner.inline.label":
    "Cargando contenido inline",
  "designlab.showcase.component.spinner.block.title": "Spinner en bloque",
  "designlab.showcase.component.spinner.block.label": "Cargando sección",
  "designlab.showcase.component.spinner.overlay.title": "Spinner overlay",
  "designlab.showcase.component.spinner.overlay.label": "Cargando overlay",
  "designlab.showcase.component.spinner.tone.title": "Tono + tamaño",
  "designlab.showcase.component.spinner.tone.short": "Carga neutra pequeña",
  "designlab.showcase.component.spinner.tone.medium": "Carga primaria",
  "designlab.showcase.component.spinner.tone.inverse": "Carga invertida",
  "designlab.showcase.component.select.option.comfortable": "Cómodo",
  "designlab.showcase.component.select.option.compact": "Compacto",
  "designlab.showcase.component.select.option.sharp": "Marcado",
  "designlab.showcase.component.select.activeValue": "Densidad activa: {value}",
  "designlab.showcase.component.steps.interactive.title": "Flujo interactivo",
  "designlab.showcase.component.steps.interactive.draft.title": "Borrador",
  "designlab.showcase.component.steps.interactive.draft.description":
    "Prepara la primera versión antes de la revisión de stakeholders.",
  "designlab.showcase.component.steps.interactive.review.title": "Revisión",
  "designlab.showcase.component.steps.interactive.review.description":
    "Reúne feedback, aprobaciones y puntos abiertos en un solo paso.",
  "designlab.showcase.component.steps.interactive.release.title": "Lanzamiento",
  "designlab.showcase.component.steps.interactive.release.description":
    "Publica cuando doctor, gate y las evidencias estén completos.",
  "designlab.showcase.component.steps.vertical.title": "Progreso vertical",
  "designlab.showcase.component.steps.vertical.scope.title": "Alcance",
  "designlab.showcase.component.steps.vertical.scope.description":
    "Confirma primero el alcance del rollout y los consumidores afectados.",
  "designlab.showcase.component.steps.vertical.preview.title": "Vista previa",
  "designlab.showcase.component.steps.vertical.preview.description":
    "Revisa la superficie en vivo, los casos límite y el copy final.",
  "designlab.showcase.component.steps.vertical.security.title": "Seguridad",
  "designlab.showcase.component.steps.vertical.security.description":
    "Endurecimiento opcional y controles de solo lectura antes del release.",
  "designlab.showcase.component.tag.neutral": "Neutral",
  "designlab.showcase.component.tag.approved": "Aprobado",
  "designlab.showcase.component.tag.pending": "Pendiente",
  "designlab.showcase.component.tag.blocked": "Bloqueado",
  "designlab.showcase.component.text.semanticPreset.title":
    "Presets semánticos",
  "designlab.showcase.component.text.semanticPreset.display": "Título display",
  "designlab.showcase.component.text.semanticPreset.heading":
    "Encabezado de sección",
  "designlab.showcase.component.text.semanticPreset.titleText":
    "Preset de título para tarjetas y paneles.",
  "designlab.showcase.component.text.semanticPreset.body":
    "Texto body para narrativas operativas y detalle de producto de soporte.",
  "designlab.showcase.component.text.semanticPreset.caption":
    "Metadatos caption y anotaciones de apoyo.",
  "designlab.showcase.component.text.emphasis.title": "Variantes de énfasis",
  "designlab.showcase.component.text.emphasis.primary":
    "Énfasis primario para decisiones clave.",
  "designlab.showcase.component.text.emphasis.secondary":
    "Énfasis secundario para contexto de apoyo.",
  "designlab.showcase.component.text.emphasis.muted":
    "Énfasis tenue para metadatos discretos.",
  "designlab.showcase.component.text.emphasis.success":
    "Énfasis de éxito para resultados completados.",
  "designlab.showcase.component.text.emphasis.danger":
    "Énfasis de peligro para acciones bloqueadas.",
  "designlab.showcase.component.text.clamp.title": "Clamp + truncate",
  "designlab.showcase.component.text.clamp.singleLine":
    "Una frase de una sola línea que debería truncarse antes de desbordar el ancho de la tarjeta.",
  "designlab.showcase.component.text.clamp.multiLine":
    "Una explicación multilínea sigue siendo legible mientras el diseño mantiene una altura estricta y evita empujar la superficie circundante.",
  "designlab.showcase.component.text.readability.title": "Legibilidad",
  "designlab.showcase.component.text.readability.paragraph":
    "El texto legible debe conservar el ritmo en pantallas admin densas para que revisiones, aprobaciones y notas de release sigan claras bajo presión.",
  "designlab.showcase.component.text.readability.tabularNums":
    "Los números tabulares mantienen alineadas las métricas en los resúmenes de auditoría.",
  "designlab.showcase.component.textInput.sections.validation.badge.error":
    "estado-error",
  "designlab.showcase.component.textInput.sections.density.badge.sm": "pequeño",
  "designlab.showcase.component.textInput.sections.density.badge.md": "mediano",
  "designlab.showcase.component.textInput.sections.density.badge.lg": "grande",
  "designlab.showcase.component.textInput.sections.invite.badge.cta":
    "llamada-a-la-accion",
  "designlab.showcase.component.textArea.sections.authoring.eyebrow":
    "Alternativa 01",
  "designlab.showcase.component.textArea.sections.authoring.title":
    "Autoría / campo de nota",
  "designlab.showcase.component.textArea.sections.authoring.description":
    "Superficie principal de autoría para descripciones largas.",
  "designlab.showcase.component.textArea.sections.authoring.badge.authoring":
    "autoría",
  "designlab.showcase.component.textArea.sections.authoring.badge.autoResize":
    "autoajuste",
  "designlab.showcase.component.textArea.sections.authoring.badge.count":
    "contador",
  "designlab.showcase.component.textArea.sections.authoring.panelAutoResize":
    "Autoajuste",
  "designlab.showcase.component.textArea.sections.authoring.panelGuideline":
    "Guía",
  "designlab.showcase.component.textArea.sections.authoring.guideline":
    "El autoajuste se siente más natural en superficies de autoría. Usa redimensionado vertical controlado en áreas de auditoría o diseños fijos.",
  "designlab.showcase.component.textArea.sections.review.eyebrow":
    "Alternativa 02",
  "designlab.showcase.component.textArea.sections.review.title":
    "Revisión / registro de decisiones",
  "designlab.showcase.component.textArea.sections.review.description":
    "Superficie de revisión legible para decisiones, objeciones o comentarios.",
  "designlab.showcase.component.textArea.sections.review.badge.review":
    "revisión",
  "designlab.showcase.component.textArea.sections.review.badge.audit":
    "auditoría",
  "designlab.showcase.component.textArea.sections.review.badge.multiline":
    "multilínea",
  "designlab.showcase.component.textArea.sections.review.panelReviewer":
    "Nota del revisor",
  "designlab.showcase.component.textArea.sections.review.reviewerLabel":
    "Nota de revisión",
  "designlab.showcase.component.textArea.sections.review.reviewerValue":
    "El texto de la policy se actualizó; el equipo legal debería completar la revisión final antes del release.",
  "designlab.showcase.component.textArea.sections.review.panelAudit":
    "Auditoría de solo lectura",
  "designlab.showcase.component.textArea.sections.review.auditLabel":
    "Registro generado",
  "designlab.showcase.component.textArea.sections.review.auditValue":
    "2026-03-07 12:48 · system-bot -> se agregó el archivo de evidencia de release.",
  "designlab.showcase.component.textArea.sections.validation.eyebrow":
    "Alternativa 03",
  "designlab.showcase.component.textArea.sections.validation.title":
    "Validación / enforcement",
  "designlab.showcase.component.textArea.sections.validation.description":
    "Descripción faltante, contenido mínimo y feedback al usuario.",
  "designlab.showcase.component.textArea.sections.validation.badge.error":
    "estado-error",
  "designlab.showcase.component.textArea.sections.validation.badge.hint":
    "ayuda",
  "designlab.showcase.component.textArea.sections.validation.badge.count":
    "contador",
  "designlab.showcase.component.textArea.sections.validation.panelInvalid":
    "Inválido",
  "designlab.showcase.component.textArea.sections.validation.panelReadonly":
    "Solo lectura",
  "designlab.showcase.component.textArea.sections.validation.panelDisabled":
    "Deshabilitado",
  "designlab.showcase.component.textArea.sections.layout.eyebrow":
    "Alternativa 04",
  "designlab.showcase.component.textArea.sections.layout.title":
    "Panel / diseño lado a lado",
  "designlab.showcase.component.textArea.sections.layout.description":
    "Dos ejemplos de diseño del mismo componente para paneles laterales estrechos y paneles de contenido amplios.",
  "designlab.showcase.component.textArea.sections.layout.badge.layout":
    "diseño",
  "designlab.showcase.component.textArea.sections.layout.badge.panel":
    "panel-lateral",
  "designlab.showcase.component.textArea.sections.layout.badge.responsive":
    "adaptable",
  "designlab.showcase.component.textArea.sections.layout.panelSide":
    "Panel lateral",
  "designlab.showcase.component.textArea.sections.layout.sideLabel":
    "Nota corta",
  "designlab.showcase.component.textArea.sections.layout.sideValue":
    "Nota compacta del panel.",
  "designlab.showcase.component.textArea.sections.layout.panelPrimary":
    "Editor principal",
  "designlab.showcase.component.dropdown.live.trigger": "Menu de acciones",
  "designlab.showcase.component.dropdown.live.item.publish": "Publicar",
  "designlab.showcase.component.dropdown.live.item.duplicate": "Duplicar",
  "designlab.showcase.component.dropdown.live.item.archive": "Archivar",
  "designlab.showcase.component.dropdown.live.selection": "Seleccion: {value}",
  "designlab.showcase.component.modal.live.open": "Abrir modal",
  "designlab.showcase.component.modal.live.title":
    "Modal de demostracion UI Kit",
  "designlab.showcase.component.modal.live.cancel": "Cancelar",
  "designlab.showcase.component.modal.live.save": "Guardar",
  "designlab.showcase.component.modal.live.description":
    "Vista previa del dialogo conectada a la cadena de tokens.",
  "designlab.showcase.component.formDrawer.live.open": "Abrir drawer",
  "designlab.showcase.component.formDrawer.live.title": "Nuevo registro",
  "designlab.showcase.component.formDrawer.live.field1": "Campo 1",
  "designlab.showcase.component.formDrawer.live.field2": "Campo 2",
  "designlab.showcase.component.modal.sections.confirm.eyebrow":
    "Alternativa 01",
  "designlab.showcase.component.modal.sections.confirm.title":
    "Dialogo de confirmacion / destructivo",
  "designlab.showcase.component.modal.sections.confirm.description":
    "Contexto para aprobaciones de rollout y acciones de borrado donde el usuario debe confirmar el impacto.",
  "designlab.showcase.component.modal.sections.confirm.badge.dialog": "dialogo",
  "designlab.showcase.component.modal.sections.confirm.badge.stable": "estable",
  "designlab.showcase.component.modal.sections.confirm.badge.confirmation":
    "confirmacion",
  "designlab.showcase.component.modal.sections.confirm.panelInteractive":
    "Patron de confirmacion interactiva",
  "designlab.showcase.component.modal.sections.confirm.open": "Abrir modal",
  "designlab.showcase.component.modal.sections.confirm.sectionBadge":
    "accion riesgosa",
  "designlab.showcase.component.modal.sections.confirm.card.title":
    "Se requiere aprobacion del rollout",
  "designlab.showcase.component.modal.sections.confirm.card.cancel": "Cancelar",
  "designlab.showcase.component.modal.sections.confirm.card.confirm":
    "Confirmar",
  "designlab.showcase.component.modal.sections.confirm.card.body":
    "El track de release se actualizara para todas las superficies enlazadas. Revisa el alcance y los efectos secundarios antes de continuar.",
  "designlab.showcase.component.modal.sections.confirm.panelGuideline": "Guia",
  "designlab.showcase.component.modal.sections.confirm.guideline":
    "Utiliza dialogos de confirmacion para acciones irreversibles o de rollout amplio. Mantén el contexto inofensivo inline.",
  "designlab.showcase.component.modal.sections.readonly.eyebrow":
    "Alternativa 02",
  "designlab.showcase.component.modal.sections.readonly.title":
    "Dialogo de revision readonly / audit",
  "designlab.showcase.component.modal.sections.readonly.description":
    "Dialogo readonly para evidencia, auditoria y revisiones donde se inspecciona el contexto sin edicion inline.",
  "designlab.showcase.component.modal.sections.readonly.badge.readonly":
    "readonly",
  "designlab.showcase.component.modal.sections.readonly.badge.audit": "audit",
  "designlab.showcase.component.modal.sections.readonly.badge.review": "review",
  "designlab.showcase.component.modal.sections.readonly.panelReview":
    "Patron de dialogo de revision",
  "designlab.showcase.component.modal.sections.readonly.card.title":
    "Resumen de evidencia",
  "designlab.showcase.component.modal.sections.readonly.card.body":
    "Los dialogos readonly funcionan bien para revisar evidencia, comprobar politicas y validar handoffs sin edicion inline.",
  "designlab.showcase.component.modal.sections.readonly.card.badgeReview":
    "Revision readonly",
  "designlab.showcase.component.modal.sections.readonly.card.badgeNoEdit":
    "Sin edicion inline",
  "designlab.showcase.component.modal.sections.readonly.panelRule":
    "Regla practica",
  "designlab.showcase.component.modal.sections.readonly.rule":
    "Si el usuario solo debe leer, confirmar o exportar, un dialogo readonly es mas claro que un overlay totalmente editable.",
  "designlab.showcase.component.dropdown.sections.action.eyebrow":
    "Alternativa 01",
  "designlab.showcase.component.dropdown.sections.action.title":
    "Menu de acciones",
  "designlab.showcase.component.dropdown.sections.action.description":
    "Menu compacto para acciones de fila o tarjeta cuando las acciones secundarias no deben quedar visibles de forma permanente.",
  "designlab.showcase.component.dropdown.sections.action.badge.menu": "menu",
  "designlab.showcase.component.dropdown.sections.action.badge.stable":
    "estable",
  "designlab.showcase.component.dropdown.sections.action.badge.actions":
    "acciones",
  "designlab.showcase.component.dropdown.sections.action.panelRow":
    "Menu de acciones por fila",
  "designlab.showcase.component.dropdown.sections.action.trigger":
    "Menu de acciones",
  "designlab.showcase.component.dropdown.sections.action.item.publish":
    "Publicar",
  "designlab.showcase.component.dropdown.sections.action.item.duplicate":
    "Duplicar",
  "designlab.showcase.component.dropdown.sections.action.item.archive":
    "Archivar",
  "designlab.showcase.component.dropdown.sections.action.selection":
    "Seleccion: {value}",
  "designlab.showcase.component.dropdown.sections.action.panelGuideline":
    "Guia",
  "designlab.showcase.component.dropdown.sections.action.guideline":
    "Usa dropdowns para acciones raras o secundarias. Las acciones primarias deben seguir siendo visibles.",
  "designlab.showcase.component.dropdown.sections.density.eyebrow":
    "Alternativa 02",
  "designlab.showcase.component.dropdown.sections.density.title":
    "Selector de filtros / densidad",
  "designlab.showcase.component.dropdown.sections.density.description":
    "Selector ligero para decisiones de densidad o layout local sin abrir un panel de configuracion pesado.",
  "designlab.showcase.component.dropdown.sections.density.badge.filters":
    "filtros",
  "designlab.showcase.component.dropdown.sections.density.badge.density":
    "densidad",
  "designlab.showcase.component.dropdown.sections.density.badge.compact":
    "compacto",
  "designlab.showcase.component.dropdown.sections.density.panelSelector":
    "Selector de densidad",
  "designlab.showcase.component.dropdown.sections.density.trigger":
    "Elegir densidad",
  "designlab.showcase.component.dropdown.sections.density.item.compact":
    "Compacta",
  "designlab.showcase.component.dropdown.sections.density.item.comfortable":
    "Comoda",
  "designlab.showcase.component.dropdown.sections.density.item.relaxed":
    "Relajada",
  "designlab.showcase.component.dropdown.sections.density.sectionBadge":
    "alineado a la derecha",
  "designlab.showcase.component.dropdown.sections.density.panelPolicy":
    "Nota de politica",
  "designlab.showcase.component.dropdown.sections.density.policyNote":
    "Mantén los selectores de densidad y layout ligeros. Para configuraciones estructurales es mejor un drawer o panel.",
  "designlab.showcase.component.formDrawer.sections.create.eyebrow":
    "Alternativa 01",
  "designlab.showcase.component.formDrawer.sections.create.title":
    "Form drawer / flujo de creacion",
  "designlab.showcase.component.formDrawer.sections.create.description":
    "Slide-over para crear registros o ediciones rapidas cuando el contexto de la pagina debe seguir visible.",
  "designlab.showcase.component.formDrawer.sections.create.badge.drawer":
    "drawer",
  "designlab.showcase.component.formDrawer.sections.create.badge.stable":
    "estable",
  "designlab.showcase.component.formDrawer.sections.create.badge.form":
    "formulario",
  "designlab.showcase.component.formDrawer.sections.create.panelEditor":
    "Panel de creacion / edicion",
  "designlab.showcase.component.formDrawer.sections.create.open":
    "Drawer de nuevo registro",
  "designlab.showcase.component.formDrawer.sections.create.sectionBadge":
    "slide-over",
  "designlab.showcase.component.formDrawer.sections.create.card.title":
    "Nuevo registro",
  "designlab.showcase.component.formDrawer.sections.create.card.nameLabel":
    "Nombre del registro",
  "designlab.showcase.component.formDrawer.sections.create.card.densityLabel":
    "Densidad",
  "designlab.showcase.component.formDrawer.sections.create.card.option.compact":
    "Compacta",
  "designlab.showcase.component.formDrawer.sections.create.card.option.comfortable":
    "Comoda",
  "designlab.showcase.component.formDrawer.sections.create.panelGuideline":
    "Guia",
  "designlab.showcase.component.formDrawer.sections.create.guideline":
    "Usa form drawers para capturas enfocadas con el contexto de la pagina todavia visible. Los flujos largos deben ir a una pagina propia.",
  "designlab.showcase.component.formDrawer.sections.readonly.eyebrow":
    "Alternativa 02",
  "designlab.showcase.component.formDrawer.sections.readonly.title":
    "Form drawer readonly / restringido por politica",
  "designlab.showcase.component.formDrawer.sections.readonly.description":
    "Drawer readonly para registros bloqueados por politica, contexto de auditoria o handoffs controlados.",
  "designlab.showcase.component.formDrawer.sections.readonly.badge.readonly":
    "readonly",
  "designlab.showcase.component.formDrawer.sections.readonly.badge.policy":
    "politica",
  "designlab.showcase.component.formDrawer.sections.readonly.badge.drawer":
    "drawer",
  "designlab.showcase.component.formDrawer.sections.readonly.panelState":
    "Estado readonly",
  "designlab.showcase.component.formDrawer.sections.readonly.open":
    "Drawer readonly",
  "designlab.showcase.component.formDrawer.sections.readonly.sectionBadge":
    "bloqueado-por-politica",
  "designlab.showcase.component.formDrawer.sections.readonly.card.title":
    "Registro readonly",
  "designlab.showcase.component.formDrawer.sections.readonly.card.nameLabel":
    "Nombre del registro",
  "designlab.showcase.component.formDrawer.sections.readonly.card.nameValue":
    "Registro readonly",
  "designlab.showcase.component.formDrawer.sections.readonly.card.note":
    "La edicion queda bloqueada hasta que la decision de aprobacion se registre.",
  "designlab.showcase.component.formDrawer.sections.readonly.panelRule":
    "Regla practica",
  "designlab.showcase.component.formDrawer.sections.readonly.rule":
    "Los drawers readonly sirven para revisiones controladas. En cuanto exista edicion real, el estado debe abrirse de forma consciente.",
  "designlab.showcase.component.recommendationCard.sections.rollout.eyebrow":
    "Alternativa 01",
  "designlab.showcase.component.recommendationCard.sections.rollout.title":
    "Tarjeta de recomendacion para rollout",
  "designlab.showcase.component.recommendationCard.sections.rollout.description":
    "Tarjeta de recomendacion para decisiones de release con razonamiento, confidence y acciones siguientes.",
  "designlab.showcase.component.recommendationCard.sections.rollout.badge.ai":
    "IA",
  "designlab.showcase.component.recommendationCard.sections.rollout.badge.rollout":
    "despliegue",
  "designlab.showcase.component.recommendationCard.sections.rollout.badge.confidence":
    "confianza",
  "designlab.showcase.component.recommendationCard.sections.rollout.panelInteractive":
    "Tarjeta interactiva de decision",
  "designlab.showcase.component.recommendationCard.sections.rollout.card.title":
    "La wave de formularios esta lista para rollout",
  "designlab.showcase.component.recommendationCard.sections.rollout.card.summary":
    "Las senales de wave gate, doctor y policy estan en verde. El paquete puede publicarse tras la ultima aprobacion del board.",
  "designlab.showcase.component.recommendationCard.sections.rollout.card.type":
    "Despliegue",
  "designlab.showcase.component.recommendationCard.sections.rollout.card.rationale.waveGate":
    "wave gate PASS",
  "designlab.showcase.component.recommendationCard.sections.rollout.card.rationale.doctor":
    "evidencia del doctor limpia",
  "designlab.showcase.component.recommendationCard.sections.rollout.card.rationale.security":
    "riesgo residual gobernado",
  "designlab.showcase.component.recommendationCard.sections.rollout.card.footerNote":
    "Estado de la decision: {state}",
  "designlab.showcase.component.recommendationCard.sections.rollout.panelSummary":
    "Resumen de la decision",
  "designlab.showcase.component.recommendationCard.sections.rollout.summary.label":
    "Decision actual",
  "designlab.showcase.component.recommendationCard.sections.rollout.summary.note":
    "Muestra como la recomendacion se traduce al estado actual de aprobacion.",
  "designlab.showcase.component.recommendationCard.sections.readonly.eyebrow":
    "Alternativa 02",
  "designlab.showcase.component.recommendationCard.sections.readonly.title":
    "Asesoria de gobernanza readonly",
  "designlab.showcase.component.recommendationCard.sections.readonly.description":
    "Variante readonly para recomendaciones con alto impacto de politica y checkpoint humano obligatorio.",
  "designlab.showcase.component.recommendationCard.sections.readonly.badge.readonly":
    "solo-lectura",
  "designlab.showcase.component.recommendationCard.sections.readonly.badge.governance":
    "gobernanza",
  "designlab.showcase.component.recommendationCard.sections.readonly.badge.advisory":
    "asesoria",
  "designlab.showcase.component.recommendationCard.sections.readonly.panelCard":
    "Tarjeta readonly",
  "designlab.showcase.component.recommendationCard.sections.readonly.card.title":
    "Se requiere aprobacion manual",
  "designlab.showcase.component.recommendationCard.sections.readonly.card.summary":
    "La recomendacion sigue visible, pero no puede aplicarse sin una aprobacion documentada.",
  "designlab.showcase.component.recommendationCard.sections.readonly.card.type":
    "Asesoria",
  "designlab.showcase.component.recommendationCard.sections.readonly.card.rationale.policy":
    "alto impacto de politica",
  "designlab.showcase.component.recommendationCard.sections.readonly.card.rationale.humanCheckpoint":
    "checkpoint humano requerido",
  "designlab.showcase.component.recommendationCard.sections.readonly.panelReasoning":
    "Superficie de razonamiento",
  "designlab.showcase.component.recommendationCard.sections.readonly.reasoning":
    "Usa esta variante cuando la AI solo orienta y la decision final debe registrarla una persona.",
  "designlab.showcase.component.recommendationCard.sections.queue.eyebrow":
    "Alternativa 03",
  "designlab.showcase.component.recommendationCard.sections.queue.title":
    "Tarjeta compacta de cola",
  "designlab.showcase.component.recommendationCard.sections.queue.description":
    "Presentacion compacta para colas de triage con poco espacio y priorizacion rapida.",
  "designlab.showcase.component.recommendationCard.sections.queue.badge.compact":
    "compacta",
  "designlab.showcase.component.recommendationCard.sections.queue.badge.queue":
    "cola",
  "designlab.showcase.component.recommendationCard.sections.queue.badge.triage":
    "triaje",
  "designlab.showcase.component.recommendationCard.sections.queue.itemSummary":
    "Muestra el siguiente titulo de recomendacion con densidad compacta.",
  "designlab.showcase.component.recommendationCard.sections.queue.itemType":
    "Elemento de cola",
  "designlab.showcase.component.recommendationCard.sections.queue.items.security.title":
    "Recomendacion SECURITY",
  "designlab.showcase.component.recommendationCard.sections.queue.items.security.badge":
    "seguridad",
  "designlab.showcase.component.recommendationCard.sections.queue.items.release.title":
    "Recomendacion RELEASE",
  "designlab.showcase.component.recommendationCard.sections.queue.items.release.badge":
    "lanzamiento",
  "designlab.showcase.component.recommendationCard.sections.queue.items.ux.title":
    "Recomendacion UX",
  "designlab.showcase.component.recommendationCard.sections.queue.items.ux.badge":
    "ux",
  "designlab.showcase.component.confidenceBadge.sections.matrix.eyebrow":
    "Alternativa 01",
  "designlab.showcase.component.confidenceBadge.sections.matrix.title":
    "Matriz de confidence",
  "designlab.showcase.component.confidenceBadge.sections.matrix.description":
    "Muestra todos los niveles de confidence junto con una guia corta de lectura para superficies AI y de gobernanza.",
  "designlab.showcase.component.confidenceBadge.sections.matrix.badge.matrix":
    "matriz",
  "designlab.showcase.component.confidenceBadge.sections.matrix.badge.explainability":
    "explicabilidad",
  "designlab.showcase.component.confidenceBadge.sections.matrix.badge.score":
    "puntaje",
  "designlab.showcase.component.confidenceBadge.sections.matrix.panelAllLevels":
    "Todos los niveles",
  "designlab.showcase.component.confidenceBadge.sections.matrix.panelGuidance":
    "Guia de lectura",
  "designlab.showcase.component.confidenceBadge.sections.matrix.guidance":
    "Usa valores altos para sugerencias directas y valores bajos para escalado, revision o evidencia adicional.",
  "designlab.showcase.component.confidenceBadge.sections.compact.eyebrow":
    "Alternativa 02",
  "designlab.showcase.component.confidenceBadge.sections.compact.title":
    "Uso inline compacto",
  "designlab.showcase.component.confidenceBadge.sections.compact.description":
    "Badges compactos para tablas densas, headers o filas de revision.",
  "designlab.showcase.component.confidenceBadge.sections.compact.badge.compact":
    "compacta",
  "designlab.showcase.component.confidenceBadge.sections.compact.badge.inline":
    "en-linea",
  "designlab.showcase.component.confidenceBadge.sections.compact.badge.denseUi":
    "ui-densa",
  "designlab.showcase.component.confidenceBadge.sections.compact.panelBadges":
    "Badges compactos",
  "designlab.showcase.component.confidenceBadge.sections.compact.manualReviewLabel":
    "Revision manual",
  "designlab.showcase.component.confidenceBadge.sections.compact.panelEmbedding":
    "Insercion en header",
  "designlab.showcase.component.confidenceBadge.sections.compact.embeddingTitle":
    "Sugerencia AI",
  "designlab.showcase.component.confidenceBadge.sections.governed.eyebrow":
    "Alternativa 03",
  "designlab.showcase.component.confidenceBadge.sections.governed.title":
    "Estados de acceso y transparencia",
  "designlab.showcase.component.confidenceBadge.sections.governed.description":
    "Estados readonly, sin score y con etiqueta personalizada para sistemas gobernados.",
  "designlab.showcase.component.confidenceBadge.sections.governed.badge.readonly":
    "solo-lectura",
  "designlab.showcase.component.confidenceBadge.sections.governed.badge.transparency":
    "transparencia",
  "designlab.showcase.component.confidenceBadge.sections.governed.badge.governed":
    "governado",
  "designlab.showcase.component.confidenceBadge.sections.governed.panelReadonly":
    "Solo lectura",
  "designlab.showcase.component.confidenceBadge.sections.governed.panelNoScore":
    "Sin score",
  "designlab.showcase.component.confidenceBadge.sections.governed.panelCustomLabel":
    "Etiqueta personalizada",
  "designlab.showcase.component.confidenceBadge.sections.governed.customLabel":
    "Escalar",
  "designlab.showcase.component.approvalCheckpoint.sections.interactive.eyebrow":
    "Alternativa 01",
  "designlab.showcase.component.approvalCheckpoint.sections.interactive.title":
    "Checkpoint humano interactivo",
  "designlab.showcase.component.approvalCheckpoint.sections.interactive.description":
    "Punto de aprobacion con owner claro, fecha limite y estado de decision para handoffs cercanos a produccion.",
  "designlab.showcase.component.approvalCheckpoint.sections.interactive.badge.approval":
    "aprobacion",
  "designlab.showcase.component.approvalCheckpoint.sections.interactive.badge.governance":
    "gobernanza",
  "designlab.showcase.component.approvalCheckpoint.sections.interactive.badge.humanInLoop":
    "humano-en-circuito",
  "designlab.showcase.component.approvalCheckpoint.sections.interactive.panelControlled":
    "Checkpoint controlado",
  "designlab.showcase.component.approvalCheckpoint.sections.interactive.card.title":
    "Aprobacion para release de produccion",
  "designlab.showcase.component.approvalCheckpoint.sections.interactive.card.summary":
    "Antes de publicar, el board debe registrar la decision final.",
  "designlab.showcase.component.approvalCheckpoint.sections.interactive.card.approverLabel":
    "Board de plataforma",
  "designlab.showcase.component.approvalCheckpoint.sections.interactive.card.dueLabel":
    "Antes de publicar",
  "designlab.showcase.component.approvalCheckpoint.sections.interactive.card.footerNote":
    "Decision registrada: {state}",
  "designlab.showcase.component.approvalCheckpoint.sections.interactive.panelSummary":
    "Resumen de la decision",
  "designlab.showcase.component.approvalCheckpoint.sections.interactive.summary.label":
    "Estado de aprobacion",
  "designlab.showcase.component.approvalCheckpoint.sections.interactive.summary.note":
    "Muestra si el checkpoint humano ya fue aprobado, rechazado o sigue pendiente.",
  "designlab.showcase.component.approvalCheckpoint.sections.readonly.eyebrow":
    "Alternativa 02",
  "designlab.showcase.component.approvalCheckpoint.sections.readonly.title":
    "Cola de revision readonly",
  "designlab.showcase.component.approvalCheckpoint.sections.readonly.description":
    "Elemento readonly para revisiones controladas donde solo queda visible la evidencia.",
  "designlab.showcase.component.approvalCheckpoint.sections.readonly.badge.readonly":
    "solo-lectura",
  "designlab.showcase.component.approvalCheckpoint.sections.readonly.badge.queue":
    "cola",
  "designlab.showcase.component.approvalCheckpoint.sections.readonly.badge.review":
    "revision",
  "designlab.showcase.component.approvalCheckpoint.sections.readonly.panelQueueItem":
    "Elemento readonly de cola",
  "designlab.showcase.component.approvalCheckpoint.sections.readonly.card.title":
    "Tarjeta readonly de cola",
  "designlab.showcase.component.approvalCheckpoint.sections.readonly.card.summary":
    "La tarjeta sigue visible mientras las decisiones reales se registran en el proceso externo de gobernanza.",
  "designlab.showcase.component.approvalCheckpoint.sections.readonly.panelGovernance":
    "Nota de gobernanza",
  "designlab.showcase.component.approvalCheckpoint.sections.readonly.governanceNote":
    "Usa esta variante cuando la superficie solo muestra el contexto de revision y no puede ejecutar acciones.",
  "designlab.showcase.component.citationPanel.live.interactive.panel":
    "Citas interactivas",
  "designlab.showcase.component.citationPanel.live.interactive.metric.panel":
    "Cita seleccionada",
  "designlab.showcase.component.citationPanel.live.interactive.metric.label":
    "Cita activa",
  "designlab.showcase.component.citationPanel.live.interactive.metric.empty":
    "Ninguna fuente seleccionada",
  "designlab.showcase.component.citationPanel.sections.sourceTransparency.eyebrow":
    "Alternativa 01",
  "designlab.showcase.component.citationPanel.sections.sourceTransparency.title":
    "Panel de transparencia de fuentes",
  "designlab.showcase.component.citationPanel.sections.sourceTransparency.description":
    "La evidencia de policy, UX y doctor se lee en un mismo panel mientras la fuente seleccionada queda resaltada.",
  "designlab.showcase.component.citationPanel.sections.sourceTransparency.badge.sources":
    "fuentes",
  "designlab.showcase.component.citationPanel.sections.sourceTransparency.badge.transparency":
    "transparencia",
  "designlab.showcase.component.citationPanel.sections.sourceTransparency.badge.citations":
    "citas",
  "designlab.showcase.component.citationPanel.sections.sourceTransparency.panelSelectable":
    "Fuentes seleccionables",
  "designlab.showcase.component.citationPanel.sections.sourceTransparency.panelSelected":
    "Fuente seleccionada",
  "designlab.showcase.component.citationPanel.sections.sourceTransparency.contextTitle":
    "Contexto de la cita",
  "designlab.showcase.component.citationPanel.sections.sourceTransparency.context.labelActive":
    "Activa",
  "designlab.showcase.component.citationPanel.sections.sourceTransparency.context.labelSource":
    "Fuente",
  "designlab.showcase.component.citationPanel.sections.readonly.eyebrow":
    "Alternativa 02",
  "designlab.showcase.component.citationPanel.sections.readonly.title":
    "Superficie de referencia readonly",
  "designlab.showcase.component.citationPanel.sections.readonly.description":
    "El panel de fuentes no ofrece acciones, pero conserva las citas y los detalles de localizacion.",
  "designlab.showcase.component.citationPanel.sections.readonly.badge.readonly":
    "solo-lectura",
  "designlab.showcase.component.citationPanel.sections.readonly.badge.reference":
    "referencia",
  "designlab.showcase.component.citationPanel.sections.readonly.badge.governed":
    "gobernado",
  "designlab.showcase.component.citationPanel.sections.readonly.panelReadonly":
    "Citas readonly",
  "designlab.showcase.component.citationPanel.sections.readonly.panelUsage":
    "Nota de uso",
  "designlab.showcase.component.citationPanel.sections.readonly.usageNote":
    "El Citation Panel se reutiliza como el mismo primitive en superficies de recommendation y approval.",
  "designlab.showcase.component.aiActionAuditTimeline.live.interactive.panel":
    "Timeline de auditoria interactivo",
  "designlab.showcase.component.aiActionAuditTimeline.live.interactive.details.panel":
    "Evento seleccionado",
  "designlab.showcase.component.aiActionAuditTimeline.live.interactive.details.title":
    "Evento de auditoria",
  "designlab.showcase.component.aiActionAuditTimeline.live.interactive.details.labelSelected":
    "Seleccionado",
  "designlab.showcase.component.aiActionAuditTimeline.live.interactive.details.labelActor":
    "Responsable",
  "designlab.showcase.component.aiActionAuditTimeline.live.interactive.details.labelStatus":
    "Estado",
  "designlab.showcase.component.aiActionAuditTimeline.sections.interactive.eyebrow":
    "Alternativa 01",
  "designlab.showcase.component.aiActionAuditTimeline.sections.interactive.title":
    "Rastro de auditoria interactivo",
  "designlab.showcase.component.aiActionAuditTimeline.sections.interactive.description":
    "Las acciones AI, las revisiones humanas y los eventos del sistema se leen a traves de un mismo primitive de timeline.",
  "designlab.showcase.component.aiActionAuditTimeline.sections.interactive.badge.audit":
    "auditoria",
  "designlab.showcase.component.aiActionAuditTimeline.sections.interactive.badge.timeline":
    "cronologia",
  "designlab.showcase.component.aiActionAuditTimeline.sections.interactive.badge.observability":
    "observabilidad",
  "designlab.showcase.component.aiActionAuditTimeline.sections.interactive.panelSelectable":
    "Timeline seleccionable",
  "designlab.showcase.component.aiActionAuditTimeline.sections.interactive.panelSelected":
    "Evento seleccionado",
  "designlab.showcase.component.aiActionAuditTimeline.sections.interactive.metric.label":
    "Evento",
  "designlab.showcase.component.aiActionAuditTimeline.sections.interactive.metric.empty":
    "Ningun registro seleccionado",
  "designlab.showcase.component.aiActionAuditTimeline.sections.readonly.eyebrow":
    "Alternativa 02",
  "designlab.showcase.component.aiActionAuditTimeline.sections.readonly.title":
    "Registro probatorio readonly",
  "designlab.showcase.component.aiActionAuditTimeline.sections.readonly.description":
    "En modo readonly, el timeline se usa como evidencia de auditoria sin seleccion.",
  "designlab.showcase.component.aiActionAuditTimeline.sections.readonly.badge.readonly":
    "solo-lectura",
  "designlab.showcase.component.aiActionAuditTimeline.sections.readonly.badge.evidence":
    "evidencia",
  "designlab.showcase.component.aiActionAuditTimeline.sections.readonly.badge.history":
    "historial",
  "designlab.showcase.component.aiActionAuditTimeline.sections.readonly.panelReadonly":
    "Historial readonly",
  "designlab.showcase.component.aiActionAuditTimeline.sections.readonly.panelAuditNote":
    "Nota de auditoria",
  "designlab.showcase.component.aiActionAuditTimeline.sections.readonly.auditNote":
    "Este bloque puede reutilizarse con el mismo comportamiento en paginas de approval, recommendation y release.",
  "designlab.showcase.component.promptComposer.live.controlled.panel":
    "Autorias controlada de prompts",
  "designlab.showcase.component.promptComposer.live.controlled.footerNote":
    "Si la salida del prompt entra en la release note, debe combinarse con aprobacion humana.",
  "designlab.showcase.component.promptComposer.live.summary.panel":
    "Resumen del prompt",
  "designlab.showcase.component.promptComposer.live.summary.subject.label":
    "Asunto",
  "designlab.showcase.component.promptComposer.live.summary.subject.note":
    "Objetivo del prompt",
  "designlab.showcase.component.promptComposer.live.summary.scope.label":
    "Alcance",
  "designlab.showcase.component.promptComposer.live.summary.scope.note":
    "Limite de ejecucion",
  "designlab.showcase.component.promptComposer.live.summary.tone.label": "Tono",
  "designlab.showcase.component.promptComposer.live.summary.tone.note":
    "Disciplina del mensaje",
  "designlab.showcase.component.promptComposer.sections.controlled.eyebrow":
    "Alternativa 01",
  "designlab.showcase.component.promptComposer.sections.controlled.title":
    "Autoria controlada de prompts",
  "designlab.showcase.component.promptComposer.sections.controlled.description":
    "Asunto, cuerpo, alcance y tono del prompt se controlan desde un unico primitive composer.",
  "designlab.showcase.component.promptComposer.sections.controlled.badge.prompt":
    "indicacion",
  "designlab.showcase.component.promptComposer.sections.controlled.badge.controlled":
    "controlado",
  "designlab.showcase.component.promptComposer.sections.controlled.badge.guardrails":
    "guardarrailes",
  "designlab.showcase.component.promptComposer.sections.controlled.panelComposer":
    "Composer interactivo",
  "designlab.showcase.component.promptComposer.sections.controlled.panelState":
    "Estado en vivo",
  "designlab.showcase.component.promptComposer.sections.controlled.state.label":
    "Alcance",
  "designlab.showcase.component.promptComposer.sections.controlled.state.note":
    "Tono: {tone}",
  "designlab.showcase.component.promptComposer.sections.readonly.eyebrow":
    "Alternativa 02",
  "designlab.showcase.component.promptComposer.sections.readonly.title":
    "Modo de revision readonly",
  "designlab.showcase.component.promptComposer.sections.readonly.description":
    "El borrador del prompt se revisa con el mismo component, pero no puede modificarse.",
  "designlab.showcase.component.promptComposer.sections.readonly.badge.readonly":
    "solo-lectura",
  "designlab.showcase.component.promptComposer.sections.readonly.badge.review":
    "revision",
  "designlab.showcase.component.promptComposer.sections.readonly.badge.prompt":
    "indicacion",
  "designlab.showcase.component.promptComposer.sections.readonly.panelReadonly":
    "Composer readonly",
  "designlab.showcase.component.promptComposer.sections.readonly.panelContract":
    "Nota de contrato",
  "designlab.showcase.component.promptComposer.sections.readonly.footerNote":
    "Modo de revision readonly",
  "designlab.showcase.component.promptComposer.sections.readonly.contractNote":
    "Prompt Composer hace visibles los guardrails de alcance y tono en lugar de dejar solo un textarea libre.",
  "designlab.showcase.component.descriptions.live.rolloutSummary.panel":
    "Resumen de despliegue",
  "designlab.showcase.component.descriptions.live.rolloutSummary.title":
    "Resumen canary",
  "designlab.showcase.component.descriptions.live.rolloutSummary.description":
    "Owner del despliegue, alcance y snapshot de revision en un solo bloque.",
  "designlab.showcase.component.descriptions.live.rolloutSummary.items.owner.label":
    "Responsable",
  "designlab.showcase.component.descriptions.live.rolloutSummary.items.owner.value":
    "Operaciones de cumplimiento",
  "designlab.showcase.component.descriptions.live.rolloutSummary.items.owner.helper":
    "Equipo responsable de las decisiones de canary y despliegue.",
  "designlab.showcase.component.descriptions.live.rolloutSummary.items.scope.label":
    "Alcance",
  "designlab.showcase.component.descriptions.live.rolloutSummary.items.scope.value":
    "Todas las filiales",
  "designlab.showcase.component.descriptions.live.rolloutSummary.items.status.label":
    "Estado",
  "designlab.showcase.component.descriptions.live.rolloutSummary.items.status.value":
    "Activo",
  "designlab.showcase.component.descriptions.live.rolloutSummary.items.review.label":
    "Ultima revision",
  "designlab.showcase.component.descriptions.live.rolloutSummary.items.review.helper":
    "Alineado con el snapshot de aprobacion del cambio.",
  "designlab.showcase.component.descriptions.live.riskApproval.panel":
    "Panel de riesgo / aprobacion",
  "designlab.showcase.component.descriptions.live.riskApproval.title":
    "Riesgo y aprobacion",
  "designlab.showcase.component.descriptions.live.riskApproval.items.risk.label":
    "Nivel de riesgo",
  "designlab.showcase.component.descriptions.live.riskApproval.items.risk.value":
    "Medio",
  "designlab.showcase.component.descriptions.live.riskApproval.items.approval.label":
    "Flujo de aprobacion",
  "designlab.showcase.component.descriptions.live.riskApproval.items.approval.value":
    "2/3 completado",
  "designlab.showcase.component.descriptions.live.riskApproval.items.approval.helper":
    "La aprobacion de Security sigue pendiente.",
  "designlab.showcase.component.descriptions.shared.ticketLabel":
    "ID del cambio",
  "designlab.showcase.component.descriptions.sections.rolloutSummary.eyebrow":
    "Alternativa 01",
  "designlab.showcase.component.descriptions.sections.rolloutSummary.title":
    "Resumen de despliegue / owner / alcance",
  "designlab.showcase.component.descriptions.sections.rolloutSummary.description":
    "Reune owner, alcance, revision y estado en una superficie clave-valor facil de leer.",
  "designlab.showcase.component.descriptions.sections.rolloutSummary.badge.summary":
    "resumen",
  "designlab.showcase.component.descriptions.sections.rolloutSummary.badge.beta":
    "beta",
  "designlab.showcase.component.descriptions.sections.rolloutSummary.badge.rollout":
    "despliegue",
  "designlab.showcase.component.descriptions.sections.rolloutSummary.panelPrimary":
    "Resumen principal",
  "designlab.showcase.component.descriptions.sections.rolloutSummary.cardTitle":
    "Resumen canary",
  "designlab.showcase.component.descriptions.sections.rolloutSummary.cardDescription":
    "Owner del despliegue, alcance y snapshot de revision en un solo bloque.",
  "designlab.showcase.component.descriptions.sections.rolloutSummary.panelInterpretation":
    "Interpretacion",
  "designlab.showcase.component.descriptions.sections.rolloutSummary.interpretation":
    "`Descriptions` estandariza grupos repetidos de etiqueta-valor en drawers, paneles de detalle y superficies de aprobacion.",
  "designlab.showcase.component.descriptions.sections.compliancePanel.eyebrow":
    "Alternativa 02",
  "designlab.showcase.component.descriptions.sections.compliancePanel.title":
    "Paneles de riesgo y aprobacion",
  "designlab.showcase.component.descriptions.sections.compliancePanel.description":
    "Transporta snapshots de riesgo, aprobacion y control con tarjetas informativas sensibles al tono.",
  "designlab.showcase.component.descriptions.sections.compliancePanel.badge.risk":
    "riesgo",
  "designlab.showcase.component.descriptions.sections.compliancePanel.badge.approval":
    "aprobacion",
  "designlab.showcase.component.descriptions.sections.compliancePanel.badge.compact":
    "compacto",
  "designlab.showcase.component.descriptions.sections.compliancePanel.panelApproval":
    "Aprobacion",
  "designlab.showcase.component.descriptions.sections.compliancePanel.approvalTitle":
    "Riesgo y aprobacion",
  "designlab.showcase.component.descriptions.sections.compliancePanel.panelOwnership":
    "Responsabilidad",
  "designlab.showcase.component.descriptions.sections.compliancePanel.ownershipTitle":
    "Resumen operativo",
  "designlab.showcase.component.descriptions.sections.compliancePanel.ownership.items.owner.label":
    "Responsable",
  "designlab.showcase.component.descriptions.sections.compliancePanel.ownership.items.owner.value":
    "Platform UX",
  "designlab.showcase.component.descriptions.sections.compliancePanel.ownership.items.window.label":
    "Ventana",
  "designlab.showcase.component.descriptions.sections.compliancePanel.ownership.items.window.value":
    "Sabado 22:00",
  "designlab.showcase.component.descriptions.sections.compliancePanel.ownership.items.signoff.label":
    "Aprobacion final",
  "designlab.showcase.component.descriptions.sections.compliancePanel.ownership.items.signoff.value":
    "Lista",
  "designlab.showcase.component.list.live.inbox.panel": "Bandeja operativa",
  "designlab.showcase.component.list.live.inbox.title":
    "Cola de trabajo de release",
  "designlab.showcase.component.list.live.inbox.description":
    "Las tareas prioritarias de despliegue y evidencia se siguen en la misma superficie.",
  "designlab.showcase.component.list.live.compact.panel":
    "Compacta seleccionable",
  "designlab.showcase.component.list.live.compact.title": "Revision compacta",
  "designlab.showcase.component.list.live.queue.items.triage.title":
    "Triage de evidencia de release",
  "designlab.showcase.component.list.live.queue.items.triage.description":
    "La ventana de publicacion no se abre hasta que la evidencia de Security y despliegue este completa.",
  "designlab.showcase.component.list.live.queue.items.triage.badge":
    "Bloqueado",
  "designlab.showcase.component.list.live.queue.items.doctor.title":
    "Resumen de frontend doctor",
  "designlab.showcase.component.list.live.queue.items.doctor.description":
    "Los presets de UI Library, shell-public y auth-route se agrupan en un solo informe.",
  "designlab.showcase.component.list.live.queue.items.doctor.badge":
    "Diagnostico",
  "designlab.showcase.component.list.live.queue.items.residual.title":
    "Revision de riesgo residual",
  "designlab.showcase.component.list.live.queue.items.residual.description":
    "Prepara el plan de actualizacion antes de que llegue la fecha de revision residual de Jackson.",
  "designlab.showcase.component.list.live.queue.items.residual.badge":
    "Seguridad",
  "designlab.showcase.component.list.sections.operationalInbox.eyebrow":
    "Alternativa 01",
  "designlab.showcase.component.list.sections.operationalInbox.title":
    "Bandeja operativa / lista de tareas",
  "designlab.showcase.component.list.sections.operationalInbox.description":
    "Combina prioridad, metadatos y badges en una sola superficie de lista.",
  "designlab.showcase.component.list.sections.operationalInbox.badge.taskList":
    "lista-tareas",
  "designlab.showcase.component.list.sections.operationalInbox.badge.selection":
    "seleccion",
  "designlab.showcase.component.list.sections.operationalInbox.badge.beta":
    "beta",
  "designlab.showcase.component.list.sections.operationalInbox.panelQueue":
    "Cola de revision",
  "designlab.showcase.component.list.sections.operationalInbox.listTitle":
    "Cola de trabajo de despliegue",
  "designlab.showcase.component.list.sections.operationalInbox.listDescription":
    "La evidencia de Security, doctor y despliegue se lee en una sola superficie.",
  "designlab.showcase.component.list.sections.operationalInbox.panelWhy":
    "Por que importa",
  "designlab.showcase.component.list.sections.operationalInbox.why":
    "`List` combina seleccion, badges y metadatos en flujos de tareas ligeros pero con estado, sin abrir una tabla.",
  "designlab.showcase.component.list.sections.priorityReview.eyebrow":
    "Alternativa 02",
  "designlab.showcase.component.list.sections.priorityReview.title":
    "Matriz de prioridad / estado de revision",
  "designlab.showcase.component.list.sections.priorityReview.description":
    "Hace visibles la densidad compacta, los elementos bloqueados y las diferencias de tono.",
  "designlab.showcase.component.list.sections.priorityReview.badge.compact":
    "compacto",
  "designlab.showcase.component.list.sections.priorityReview.badge.priority":
    "prioridad",
  "designlab.showcase.component.list.sections.priorityReview.badge.tone":
    "tono",
  "designlab.showcase.component.list.sections.priorityReview.panelCompact":
    "Lista compacta",
  "designlab.showcase.component.list.sections.priorityReview.panelLoadingEmpty":
    "Cargando y vacio",
  "designlab.showcase.component.list.sections.priorityReview.loadingTitle":
    "Cola cargando",
  "designlab.showcase.component.list.sections.priorityReview.emptyTitle":
    "Cola vacia",
  "designlab.showcase.component.list.sections.priorityReview.emptyState":
    "No hay tareas para mostrar.",
  "designlab.showcase.component.jsonViewer.live.releasePayload.panel":
    "Datos de evidencia de lanzamiento",
  "designlab.showcase.component.jsonViewer.live.releasePayload.title":
    "Resumen de la ola",
  "designlab.showcase.component.jsonViewer.live.releasePayload.description":
    "Hace legible la evidencia de gate y doctor sin una pantalla de debug.",
  "designlab.showcase.component.jsonViewer.live.policySnapshot.panel":
    "Instantanea de politica",
  "designlab.showcase.component.jsonViewer.live.policySnapshot.title":
    "Datos de politica",
  "designlab.showcase.component.jsonViewer.live.policySnapshot.description":
    "Superficie de solo lectura del contrato operativo.",
  "designlab.showcase.component.jsonViewer.live.policy.rollout.mode":
    "doctor-primero",
  "designlab.showcase.component.jsonViewer.live.policy.rollout.security":
    "fail-closed",
  "designlab.showcase.component.jsonViewer.live.policy.owners.frontend":
    "platform-ui",
  "designlab.showcase.component.jsonViewer.live.policy.owners.governance":
    "ux-catalog",
  "designlab.showcase.component.jsonViewer.sections.releasePayload.eyebrow":
    "Alternativa 01",
  "designlab.showcase.component.jsonViewer.sections.releasePayload.title":
    "Datos de evidencia de lanzamiento",
  "designlab.showcase.component.jsonViewer.sections.releasePayload.description":
    "Presenta el resumen del wave gate y del doctor como un arbol JSON legible y en capas.",
  "designlab.showcase.component.jsonViewer.sections.releasePayload.badge.payload":
    "carga",
  "designlab.showcase.component.jsonViewer.sections.releasePayload.badge.audit":
    "auditoria",
  "designlab.showcase.component.jsonViewer.sections.releasePayload.badge.beta":
    "beta",
  "designlab.showcase.component.jsonViewer.sections.releasePayload.panelPrimary":
    "Payload principal",
  "designlab.showcase.component.jsonViewer.sections.releasePayload.cardTitle":
    "Resumen de la ola",
  "designlab.showcase.component.jsonViewer.sections.releasePayload.cardDescription":
    "La evidencia de gate y doctor se sigue dentro del mismo payload.",
  "designlab.showcase.component.jsonViewer.sections.releasePayload.panelUsage":
    "Nota de uso",
  "designlab.showcase.component.jsonViewer.sections.releasePayload.usage":
    "`JsonViewer` hace legibles para el usuario final los payloads de contrato, configuracion y evidencia sin parecer un panel de debug.",
  "designlab.showcase.component.jsonViewer.sections.policyConfig.eyebrow":
    "Alternativa 02",
  "designlab.showcase.component.jsonViewer.sections.policyConfig.title":
    "Instantanea de politica / configuracion",
  "designlab.showcase.component.jsonViewer.sections.policyConfig.description":
    "Renderizado compacto para snapshots de configuracion readonly y de menor ancho.",
  "designlab.showcase.component.jsonViewer.sections.policyConfig.badge.policy":
    "politica",
  "designlab.showcase.component.jsonViewer.sections.policyConfig.badge.config":
    "configuracion",
  "designlab.showcase.component.jsonViewer.sections.policyConfig.badge.readonly":
    "solo lectura",
  "designlab.showcase.component.jsonViewer.sections.policyConfig.panelPolicy":
    "Instantanea de politica",
  "designlab.showcase.component.jsonViewer.sections.policyConfig.policyTitle":
    "Politica",
  "designlab.showcase.component.jsonViewer.sections.policyConfig.panelEmpty":
    "Vacio / indefinido",
  "designlab.showcase.component.jsonViewer.sections.policyConfig.undefinedTitle":
    "Payload indefinido",
  "designlab.showcase.component.jsonViewer.sections.policyConfig.emptyState":
    "Payload no recibido.",
  "designlab.showcase.component.jsonViewer.sections.policyConfig.primitiveTitle":
    "Datos de primitivas",
  "designlab.showcase.component.tree.live.hierarchy.panel":
    "Jerarquia operativa",
  "designlab.showcase.component.tree.live.hierarchy.title":
    "Jerarquia de entrega",
  "designlab.showcase.component.tree.live.hierarchy.description":
    "Lee la propiedad de gate y politica en una sola jerarquia.",
  "designlab.showcase.component.tree.live.readonly.panel":
    "Revision de solo lectura",
  "designlab.showcase.component.tree.live.readonly.title":
    "Revision de solo lectura",
  "designlab.showcase.component.tree.live.release.label":
    "Plano de control de release",
  "designlab.showcase.component.tree.live.release.description":
    "Reune evidencia de gate, doctor y seguridad en una sola jerarquia.",
  "designlab.showcase.component.tree.live.release.meta": "raiz",
  "designlab.showcase.component.tree.live.release.badge": "estable",
  "designlab.showcase.component.tree.live.doctor.label": "Evidencia de doctor",
  "designlab.showcase.component.tree.live.doctor.description":
    "Salidas del preset de frontend doctor.",
  "designlab.showcase.component.tree.live.doctorUiLibrary.label":
    "Recorrido de UI Library",
  "designlab.showcase.component.tree.live.doctorUiLibrary.description":
    "Los resultados de console, pageerror y clicks estan limpios.",
  "designlab.showcase.component.tree.live.doctorUiLibrary.meta": "5 pasos",
  "designlab.showcase.component.tree.live.doctorShell.label":
    "Preset publico de shell",
  "designlab.showcase.component.tree.live.doctorShell.description":
    "La cadena de login y rutas publicas esta en PASS.",
  "designlab.showcase.component.tree.live.doctorShell.meta": "3 rutas",
  "designlab.showcase.component.tree.live.security.label":
    "Contrato de seguridad",
  "designlab.showcase.component.tree.live.security.description":
    "Reglas de riesgo residual y aprovisionamiento en vivo.",
  "designlab.showcase.component.tree.live.security.meta": "revision",
  "designlab.showcase.component.tree.live.security.badge": "politica",
  "designlab.showcase.component.tree.live.securityResidual.label":
    "Revision de riesgo residual",
  "designlab.showcase.component.tree.live.securityResidual.description":
    "Los riesgos pendientes programados se siguen mediante una revision obligatoria.",
  "designlab.showcase.component.tree.sections.releaseGovernance.eyebrow":
    "Alternativa 01",
  "designlab.showcase.component.tree.sections.releaseGovernance.title":
    "Jerarquia de governance de release",
  "designlab.showcase.component.tree.sections.releaseGovernance.description":
    "Sigue flujos de doctor, seguridad y politica en un solo arbol jerarquico.",
  "designlab.showcase.component.tree.sections.releaseGovernance.badge.tree":
    "arbol",
  "designlab.showcase.component.tree.sections.releaseGovernance.badge.hierarchy":
    "jerarquia",
  "designlab.showcase.component.tree.sections.releaseGovernance.badge.beta":
    "beta",
  "designlab.showcase.component.tree.sections.releaseGovernance.panelHierarchy":
    "Jerarquia",
  "designlab.showcase.component.tree.sections.releaseGovernance.cardTitle":
    "Jerarquia de release",
  "designlab.showcase.component.tree.sections.releaseGovernance.panelUsage":
    "Nota de uso",
  "designlab.showcase.component.tree.sections.releaseGovernance.usage":
    "`Tree` aporta jerarquia al flujo de aprobacion, la propiedad del rollout y el desglose de politicas sin perder profundidad.",
  "designlab.showcase.component.tree.sections.readonlyAudit.eyebrow":
    "Alternativa 02",
  "designlab.showcase.component.tree.sections.readonlyAudit.title":
    "Arbol de auditoria de solo lectura",
  "designlab.showcase.component.tree.sections.readonlyAudit.description":
    "Muestra estado readonly, densidad compacta y comportamiento del nodo seleccionado juntos.",
  "designlab.showcase.component.tree.sections.readonlyAudit.badge.readonly":
    "solo lectura",
  "designlab.showcase.component.tree.sections.readonlyAudit.badge.compact":
    "compacto",
  "designlab.showcase.component.tree.sections.readonlyAudit.badge.audit":
    "auditoria",
  "designlab.showcase.component.tree.sections.readonlyAudit.panelReadonly":
    "Arbol readonly",
  "designlab.showcase.component.tree.sections.readonlyAudit.panelLoadingEmpty":
    "Carga y vacio",
  "designlab.showcase.component.tree.sections.readonlyAudit.loadingTitle":
    "Arbol cargando",
  "designlab.showcase.component.tree.sections.readonlyAudit.emptyTitle":
    "Arbol vacio",
  "designlab.showcase.component.tree.sections.readonlyAudit.emptyState":
    "Jerarquia no encontrada.",
  "designlab.showcase.component.treeTable.shared.columns.owner": "Responsable",
  "designlab.showcase.component.treeTable.shared.columns.status": "Estado",
  "designlab.showcase.component.treeTable.shared.columns.scope": "Alcance",
  "designlab.showcase.component.treeTable.live.ownershipMatrix.panel":
    "Matriz de responsables",
  "designlab.showcase.component.treeTable.live.ownershipMatrix.title":
    "Responsabilidad del componente",
  "designlab.showcase.component.treeTable.live.ownershipMatrix.description":
    "Lee responsable, estado y alcance con filas jerarquicas.",
  "designlab.showcase.component.treeTable.live.compactReview.panel":
    "Revision compacta",
  "designlab.showcase.component.treeTable.live.compactReview.title":
    "Matriz compacta",
  "designlab.showcase.component.treeTable.live.platformUi.label": "Platform UI",
  "designlab.showcase.component.treeTable.live.platformUi.description":
    "Equipo responsable del nucleo del sistema de diseno.",
  "designlab.showcase.component.treeTable.live.platformUi.meta": "estable",
  "designlab.showcase.component.treeTable.live.platformUi.badge": "responsable",
  "designlab.showcase.component.treeTable.live.platformUi.data.owner":
    "Platform UI",
  "designlab.showcase.component.treeTable.live.platformUi.data.status":
    "Estable",
  "designlab.showcase.component.treeTable.live.platformUi.data.scope": "Global",
  "designlab.showcase.component.treeTable.live.uiLibrarySurface.label":
    "UI Library",
  "designlab.showcase.component.treeTable.live.uiLibrarySurface.description":
    "Superficie de docs, preview y catalogo API.",
  "designlab.showcase.component.treeTable.live.uiLibrarySurface.badge": "datos",
  "designlab.showcase.component.treeTable.live.uiLibrarySurface.data.owner":
    "Tasarim Operasyonlari",
  "designlab.showcase.component.treeTable.live.uiLibrarySurface.data.status":
    "Beta",
  "designlab.showcase.component.treeTable.live.uiLibrarySurface.data.scope":
    "Docs",
  "designlab.showcase.component.treeTable.live.deliveryGates.label":
    "Gates de entrega",
  "designlab.showcase.component.treeTable.live.deliveryGates.description":
    "Cadena de evidencia del wave gate y del doctor.",
  "designlab.showcase.component.treeTable.live.deliveryGates.badge": "qa",
  "designlab.showcase.component.treeTable.live.deliveryGates.data.owner":
    "Yayin Operasyonlari",
  "designlab.showcase.component.treeTable.live.deliveryGates.data.scope":
    "Entrega",
  "designlab.showcase.component.treeTable.sections.ownershipMatrix.eyebrow":
    "Alternativa 01",
  "designlab.showcase.component.treeTable.sections.ownershipMatrix.title":
    "Matriz de responsables",
  "designlab.showcase.component.treeTable.sections.ownershipMatrix.description":
    "TreeTable combina datos de responsable/estado/alcance con filas jerarquicas.",
  "designlab.showcase.component.treeTable.sections.ownershipMatrix.badge.matrix":
    "matriz",
  "designlab.showcase.component.treeTable.sections.ownershipMatrix.badge.hierarchy":
    "jerarquia",
  "designlab.showcase.component.treeTable.sections.ownershipMatrix.badge.beta":
    "beta",
  "designlab.showcase.component.treeTable.sections.ownershipMatrix.panelMatrix":
    "Matriz de responsables",
  "designlab.showcase.component.treeTable.sections.ownershipMatrix.panelUsage":
    "Nota de uso",
  "designlab.showcase.component.treeTable.sections.ownershipMatrix.usage":
    "`TreeTable` compara columnas sin perder jerarquia en arboles de entidades o responsables.",
  "designlab.showcase.component.treeTable.sections.compactReview.eyebrow":
    "Alternativa 02",
  "designlab.showcase.component.treeTable.sections.compactReview.title":
    "Matriz compacta de revision",
  "designlab.showcase.component.treeTable.sections.compactReview.description":
    "Muestra densidad compacta, filas seleccionadas y fallback de carga/vacio en conjunto.",
  "designlab.showcase.component.treeTable.sections.compactReview.badge.compact":
    "compacto",
  "designlab.showcase.component.treeTable.sections.compactReview.badge.selected":
    "seleccionado",
  "designlab.showcase.component.treeTable.sections.compactReview.badge.fallback":
    "fallback",
  "designlab.showcase.component.treeTable.sections.compactReview.panelCompact":
    "Tabla compacta",
  "designlab.showcase.component.treeTable.sections.compactReview.panelLoadingEmpty":
    "Carga y vacio",
  "designlab.showcase.component.treeTable.sections.compactReview.loadingTitle":
    "Cargando matriz",
  "designlab.showcase.component.treeTable.sections.compactReview.emptyTitle":
    "Matriz vacia",
  "designlab.showcase.component.treeTable.sections.compactReview.emptyState":
    "No hay registro jerarquico de tabla.",
  "designlab.showcase.component.tableSimple.shared.columns.policy": "Politica",
  "designlab.showcase.component.tableSimple.shared.columns.owner":
    "Responsable",
  "designlab.showcase.component.tableSimple.shared.columns.status": "Estado",
  "designlab.showcase.component.tableSimple.shared.columns.updatedAt":
    "Actualizado",
  "designlab.showcase.component.tableSimple.live.policyStatus.panel":
    "Tabla de estado de politicas",
  "designlab.showcase.component.tableSimple.live.policyStatus.caption":
    "Portafolio de politicas",
  "designlab.showcase.component.tableSimple.live.policyStatus.description":
    "Vista de tabla ligera centrada en tareas.",
  "designlab.showcase.component.tableSimple.live.loadingEmpty.panel":
    "Carga + vacio",
  "designlab.showcase.component.tableSimple.live.loadingEmpty.loadingCaption":
    "Cargando tabla",
  "designlab.showcase.component.tableSimple.live.loadingEmpty.emptyCaption":
    "Tabla vacia",
  "designlab.showcase.component.tableSimple.live.loadingEmpty.emptyState":
    "Aun no hay datos publicados.",
  "designlab.showcase.component.tableSimple.live.rows.ethics.policy":
    "Politica de etica",
  "designlab.showcase.component.tableSimple.live.rows.ethics.owner":
    "Cumplimiento",
  "designlab.showcase.component.tableSimple.live.rows.ethics.status": "Activo",
  "designlab.showcase.component.tableSimple.live.rows.gifts.policy":
    "Regalos y hospitalidad",
  "designlab.showcase.component.tableSimple.live.rows.gifts.owner": "Legal",
  "designlab.showcase.component.tableSimple.live.rows.gifts.status": "Borrador",
  "designlab.showcase.component.tableSimple.live.rows.conflict.policy":
    "Conflicto de intereses",
  "designlab.showcase.component.tableSimple.live.rows.conflict.owner":
    "Operaciones de Personas",
  "designlab.showcase.component.tableSimple.live.rows.conflict.status":
    "Aprobacion pendiente",
  "designlab.showcase.component.tableSimple.sections.policyList.eyebrow":
    "Alternativa 01",
  "designlab.showcase.component.tableSimple.sections.policyList.title":
    "Tabla de politica / responsable / estado",
  "designlab.showcase.component.tableSimple.sections.policyList.description":
    "Muestra listas de politicas criticas para tareas en una tabla ligera, rapida y legible.",
  "designlab.showcase.component.tableSimple.sections.policyList.badge.table":
    "tabla",
  "designlab.showcase.component.tableSimple.sections.policyList.badge.beta":
    "beta",
  "designlab.showcase.component.tableSimple.sections.policyList.badge.status":
    "estado",
  "designlab.showcase.component.tableSimple.sections.policyList.panelMatrix":
    "Matriz de politicas",
  "designlab.showcase.component.tableSimple.sections.policyList.caption":
    "Portafolio de politicas",
  "designlab.showcase.component.tableSimple.sections.policyList.tableDescription":
    "Los campos de responsable y estado comparten una sola superficie de tabla.",
  "designlab.showcase.component.tableSimple.sections.policyList.panelGuidance":
    "Guia",
  "designlab.showcase.component.tableSimple.sections.policyList.guidance":
    "`TableSimple` ofrece a las listas de tareas renderizado rapido y un contrato de carga y vacio sin requerir infraestructura pesada de grid.",
  "designlab.showcase.component.tableSimple.sections.loadingEmpty.eyebrow":
    "Alternativa 02",
  "designlab.showcase.component.tableSimple.sections.loadingEmpty.title":
    "Estados de carga y vacio",
  "designlab.showcase.component.tableSimple.sections.loadingEmpty.description":
    "El mismo primitivo resuelve esqueletos de carga y comportamiento de tabla vacia sin copias locales.",
  "designlab.showcase.component.tableSimple.sections.loadingEmpty.badge.loading":
    "carga",
  "designlab.showcase.component.tableSimple.sections.loadingEmpty.badge.empty":
    "vacio",
  "designlab.showcase.component.tableSimple.sections.loadingEmpty.badge.compact":
    "compacto",
  "designlab.showcase.component.tableSimple.sections.loadingEmpty.panelLoading":
    "Carga",
  "designlab.showcase.component.tableSimple.sections.loadingEmpty.loadingCaption":
    "Cargando tabla",
  "designlab.showcase.component.tableSimple.sections.loadingEmpty.panelEmpty":
    "Vacio",
  "designlab.showcase.component.tableSimple.sections.loadingEmpty.emptyCaption":
    "Tabla vacia",
  "designlab.showcase.component.tableSimple.sections.loadingEmpty.emptyState":
    "Aun no hay registros para mostrar.",
  "designlab.componentContracts.entityGridTemplate.exportFileBaseName": "datos",
  "designlab.componentContracts.entityGridTemplate.exportSheetName": "Datos",
  "designlab.componentContracts.entityGridTemplate.variantOptionGlobalLabel":
    "Compartida",
  "designlab.componentContracts.entityGridTemplate.variantOptionGlobalDefaultLabel":
    "Compartida predeterminada",
  "designlab.componentContracts.entityGridTemplate.variantOptionDefaultLabel":
    "Predeterminada",
  "designlab.componentContracts.entityGridTemplate.variantOptionIncompatibleLabel":
    "Incompatible",
  "designlab.componentContracts.entityGridTemplate.selectedVariantNotFoundLabel":
    "No se encontro la variante seleccionada.",
  "designlab.componentContracts.entityGridTemplate.selectedVariantIncompatibleLabel":
    "Esta variante no es compatible con la estructura actual de la cuadricula.",
  "designlab.componentContracts.entityGridTemplate.variantSaveBlockedLabel":
    "Esta variante no puede guardarse porque es incompatible.",
  "designlab.componentContracts.entityGridTemplate.variantSavedLabel":
    "Variante guardada.",
  "designlab.componentContracts.entityGridTemplate.variantSaveFailedLabel":
    "No se pudo guardar la variante.",
  "designlab.componentContracts.entityGridTemplate.variantNameEmptyLabel":
    "El nombre de la variante no puede estar vacio.",
  "designlab.componentContracts.entityGridTemplate.variantNameUpdatedLabel":
    "Nombre de la variante actualizado.",
  "designlab.componentContracts.entityGridTemplate.variantNameUpdateFailedLabel":
    "No se pudo actualizar el nombre de la variante.",
  "designlab.componentContracts.entityGridTemplate.variantPromotedToGlobalLabel":
    "La variante ahora se comparte globalmente.",
  "designlab.componentContracts.entityGridTemplate.variantDemotedToPersonalLabel":
    "La variante ahora es solo personal.",
  "designlab.componentContracts.entityGridTemplate.variantGlobalStatusUpdateFailedLabel":
    "No se pudo actualizar el estado global de la variante.",
  "designlab.componentContracts.entityGridTemplate.globalDefaultEnabledLabel":
    "Predeterminada global actualizada.",
  "designlab.componentContracts.entityGridTemplate.globalDefaultDisabledLabel":
    "Predeterminada global eliminada.",
  "designlab.componentContracts.entityGridTemplate.globalDefaultUpdateFailedLabel":
    "No se pudo actualizar la predeterminada global.",
  "designlab.componentContracts.entityGridTemplate.newVariantNameEmptyLabel":
    "El nombre de la nueva variante no puede estar vacio.",
  "designlab.componentContracts.entityGridTemplate.variantCreatedLabel":
    "Variante creada.",
  "designlab.componentContracts.entityGridTemplate.variantCreateFailedLabel":
    "No se pudo crear la variante.",
  "designlab.componentContracts.entityGridTemplate.defaultViewEnabledLabel":
    "Marcada como vista predeterminada.",
  "designlab.componentContracts.entityGridTemplate.defaultViewDisabledLabel":
    "Se quito de la vista predeterminada.",
  "designlab.componentContracts.entityGridTemplate.defaultStateUpdateFailedLabel":
    "No se pudo actualizar el estado predeterminado.",
  "designlab.componentContracts.entityGridTemplate.globalVariantUserDefaultEnabledLabel":
    "La variante global paso a ser tu predeterminada.",
  "designlab.componentContracts.entityGridTemplate.globalVariantUserDefaultDisabledLabel":
    "La variante global se quito de tus predeterminadas.",
  "designlab.componentContracts.entityGridTemplate.variantPreferenceUpdateFailedLabel":
    "No se pudo actualizar la preferencia de la variante.",
  "designlab.componentContracts.entityGridTemplate.variantCorruptedStateLabel":
    "La vista guardada de la cuadricula esta danada y no pudo aplicarse.",
  "designlab.componentContracts.entityGridTemplate.deleteVariantConfirmationLabel":
    "¿Seguro que quieres eliminar la vista llamada {name}?",
  "designlab.componentContracts.entityGridTemplate.variantDeletedLabel":
    "Variante eliminada.",
  "designlab.componentContracts.entityGridTemplate.variantDeleteFailedLabel":
    "No se pudo eliminar la variante.",
  "designlab.componentContracts.entityGridTemplate.menuSelectLabel":
    "Aplicar vista",
  "designlab.componentContracts.entityGridTemplate.menuRenameLabel":
    "Renombrar",
  "designlab.componentContracts.entityGridTemplate.menuUnsetDefaultLabel":
    "Quitar de mis predeterminadas",
  "designlab.componentContracts.entityGridTemplate.menuSetDefaultLabel":
    "Convertir en mi predeterminada",
  "designlab.componentContracts.entityGridTemplate.menuUnsetGlobalDefaultLabel":
    "Quitar predeterminada global",
  "designlab.componentContracts.entityGridTemplate.menuSetGlobalDefaultLabel":
    "Convertir en predeterminada global",
  "designlab.componentContracts.entityGridTemplate.menuMoveToPersonalLabel":
    "Mover a personal",
  "designlab.componentContracts.entityGridTemplate.menuMoveToGlobalLabel":
    "Compartir con todos",
  "designlab.componentContracts.entityGridTemplate.menuDeleteLabel": "Eliminar",
  "designlab.componentContracts.entityGridTemplate.saveLabel": "Guardar",
  "designlab.componentContracts.entityGridTemplate.cancelLabel": "Cancelar",
  "designlab.componentContracts.entityGridTemplate.selectedTagLabel":
    "Seleccion actual",
  "designlab.componentContracts.entityGridTemplate.globalPublicDefaultTagLabel":
    "Compartida · Predeterminada",
  "designlab.componentContracts.entityGridTemplate.globalPublicTagLabel":
    "Compartida",
  "designlab.componentContracts.entityGridTemplate.personalTagLabel":
    "Personal",
  "designlab.componentContracts.entityGridTemplate.personalDefaultTagLabel":
    "Mi predeterminada personal",
  "designlab.componentContracts.entityGridTemplate.recentlyUsedTagLabel":
    "Usada recientemente",
  "designlab.componentContracts.entityGridTemplate.incompatibleTagLabel":
    "Incompatible",
  "designlab.componentContracts.entityGridTemplate.hideDetailsLabel":
    "Ocultar detalles",
  "designlab.componentContracts.entityGridTemplate.showDetailsLabel":
    "Mostrar detalles",
  "designlab.componentContracts.entityGridTemplate.variantActionsLabel":
    "Acciones de variante",
  "designlab.componentContracts.entityGridTemplate.moveToPersonalTitle":
    "Mover esta variante al alcance personal",
  "designlab.componentContracts.entityGridTemplate.moveToGlobalTitle":
    "Compartir esta variante con todos los usuarios",
  "designlab.componentContracts.entityGridTemplate.saveCurrentLayoutTitle":
    "Guardar el diseno actual de la cuadricula en esta variante",
  "designlab.componentContracts.entityGridTemplate.saveCurrentStateLabel":
    "Guardar estado",
  "designlab.componentContracts.entityGridTemplate.personalDefaultSwitchLabel":
    "Mi predeterminada personal",
  "designlab.componentContracts.entityGridTemplate.globalDefaultSwitchLabel":
    "Predeterminada global",
  "designlab.componentContracts.entityGridTemplate.newVariantToPersonalTitle":
    "Convertir en una variante personal",
  "designlab.componentContracts.entityGridTemplate.newVariantToGlobalTitle":
    "Crear como variante global",
  "designlab.componentContracts.entityGridTemplate.newVariantUnsetGlobalDefaultTitle":
    "Quitar predeterminada global",
  "designlab.componentContracts.entityGridTemplate.newVariantSetGlobalDefaultTitle":
    "Convertir en predeterminada global",
  "designlab.componentContracts.entityGridTemplate.newVariantUnsetPersonalDefaultTitle":
    "Quitar predeterminada personal",
  "designlab.componentContracts.entityGridTemplate.newVariantSetPersonalDefaultTitle":
    "Convertir en predeterminada personal",
  "designlab.componentContracts.entityGridTemplate.saveTitle": "Guardar",
  "designlab.componentContracts.entityGridTemplate.localeText.to": "a",
  "designlab.componentContracts.entityGridTemplate.localeText.andCondition":
    "Y",
  "designlab.componentContracts.entityGridTemplate.localeText.orCondition": "O",
  "designlab.componentContracts.entityGridTemplate.localeText.rowGroupPanel":
    "Grupos",
  "designlab.componentContracts.entityGridTemplate.localeText.dropZoneColumnGroup":
    "Arrastra columnas aqui para agrupar filas",
  "designlab.componentContracts.entityGridTemplate.localeText.rowGroupColumnsEmptyMessage":
    "Arrastra columnas aqui para agrupar filas",
  "designlab.componentContracts.entityGridTemplate.localeText.dragHereToSetColumnRowGroup":
    "Arrastra columnas aqui para agrupar filas",
  "designlab.componentContracts.entityGridTemplate.localeText.dragHereToSetRowGroup":
    "Arrastra columnas aqui para agrupar filas",
  "designlab.componentContracts.entityGridTemplate.localeText.dragHereToSetColumnValues":
    "Arrastra columnas aqui para valores",
  "designlab.componentContracts.entityGridTemplate.localeText.dropZoneColumnValue":
    "Arrastra columnas aqui para valores",
  "designlab.componentContracts.entityGridTemplate.localeText.advancedFilter":
    "Filtro avanzado",
  "designlab.componentContracts.entityGridTemplate.localeText.advancedFilterBuilder":
    "Filtro avanzado",
  "designlab.componentContracts.entityGridTemplate.localeText.advancedFilterButtonTooltip":
    "Abrir el filtro avanzado",
  "designlab.componentContracts.entityGridTemplate.localeText.advancedFilterBuilderAdd":
    "Agregar condicion",
  "designlab.componentContracts.entityGridTemplate.localeText.advancedFilterBuilderRemove":
    "Eliminar",
  "designlab.componentContracts.entityGridTemplate.localeText.advancedFilterJoinOperator":
    "Operador de union",
  "designlab.componentContracts.entityGridTemplate.localeText.advancedFilterAnd":
    "Y",
  "designlab.componentContracts.entityGridTemplate.localeText.advancedFilterOr":
    "O",
  "designlab.componentContracts.entityGridTemplate.localeText.advancedFilterValidationMissingColumn":
    "Selecciona una columna",
  "designlab.componentContracts.entityGridTemplate.localeText.advancedFilterValidationMissingOption":
    "Selecciona un operador",
  "designlab.componentContracts.entityGridTemplate.localeText.advancedFilterValidationMissingValue":
    "Introduce un valor",
  "designlab.componentContracts.entityGridTemplate.localeText.advancedFilterApply":
    "Aplicar",
  "designlab.showcase.component.tabs.controlled.title": "Pestanas controladas",
  "designlab.showcase.component.tabs.controlled.overview.label": "Resumen",
  "designlab.showcase.component.tabs.controlled.overview.title":
    "Cockpit de lanzamiento",
  "designlab.showcase.component.tabs.controlled.overview.description":
    "Sigue la preparacion del lanzamiento, las senales de actividad y la adopcion en la misma superficie.",
  "designlab.showcase.component.tabs.controlled.activity.label": "Actividad",
  "designlab.showcase.component.tabs.controlled.activity.title":
    "Flujo de actividad",
  "designlab.showcase.component.tabs.controlled.activity.description":
    "Revisa la navegacion reciente, las acciones del usuario y los cambios de estado dentro del mismo contrato de pestanas.",
  "designlab.showcase.component.tabs.controlled.settings.label":
    "Configuracion",
  "designlab.showcase.component.tabs.manual.title":
    "Pestanas verticales manuales",
  "designlab.showcase.component.tabs.manual.tokens.label": "Tokens",
  "designlab.showcase.component.tabs.manual.tokens.description":
    "Revision de tokens de diseno",
  "designlab.showcase.component.tabs.manual.tokens.content":
    "Revisa los contratos de espaciado, radio y color en un flujo de pestanas verticales manual.",
  "designlab.showcase.component.tabs.manual.density.label": "Densidad",
  "designlab.showcase.component.tabs.manual.density.content":
    "Cambia entre patrones compactos y comodos sin modificar la estructura del contenedor.",
  "designlab.showcase.component.tabs.manual.motion.label": "Movimiento",
  "designlab.showcase.component.tabs.manual.motion.content":
    "Manten la guia de movimiento reducido y animacion en la misma superficie de navegacion controlada.",
};

export default designlab;
