import enUsers from '../en/users';

const users = {
  ...enUsers,
  'users.layout.title': 'Gestión de usuarios',
  'users.layout.description':
    'Gestiona roles de usuario, permisos y acceso a módulos; define operaciones relacionadas con la seguridad de la cuenta.',
  'admin.users.title': 'Gestión de usuarios',
  'admin.users.description':
    'Gestiona roles de usuario, permisos y acceso a módulos; define operaciones relacionadas con la seguridad de la cuenta.',
  'users.breadcrumb.management': 'Administración',
  'users.breadcrumb.users': 'Gestión de usuarios',

  'users.actions.refresh': 'Actualizar usuarios',

  'users.grid.themeLabel': 'Tema',
  'users.grid.quickFilterLabel': 'Filtro',
  'users.grid.variantLabel': 'Variante',
  'users.grid.quickFilterPlaceholder': 'Buscar en todas las columnas...',
  'users.grid.fullscreenTooltip': 'Abrir pantalla completa en una pestaña nueva',

  'users.grid.mode.label': 'Modo de datos:',
  'users.grid.mode.server': 'Servidor',
  'users.grid.mode.client': 'Cliente',

  'users.filters.search.label': 'Búsqueda',
  'users.filters.search.placeholder': 'Nombre, correo o ID',
  'users.filters.search.button': 'Buscar',

  'users.filters.status.label': 'Estado',
  'users.filters.status.all': 'Todos',
  'users.filters.status.active': 'Activo',
  'users.filters.status.inactive': 'Inactivo',
  'users.filters.status.invited': 'Invitado',
  'users.filters.status.suspended': 'Suspendido',

  'users.filters.role.label': 'Rol',
  'users.filters.role.all': 'Todos',
  'users.filters.role.user': 'Usuario estándar',
  'users.filters.role.admin': 'Administrador',

  'users.filters.moduleKey.label': 'Clave del módulo',
  'users.filters.moduleKey.placeholder': 'finance.users',

  'users.filters.moduleLevel.label': 'Nivel del módulo',
  'users.filters.moduleLevel.all': 'Todos',
  'users.filters.moduleLevel.none': 'Sin acceso',
  'users.filters.moduleLevel.view': 'Lector',
  'users.filters.moduleLevel.edit': 'Editor',
  'users.filters.moduleLevel.manage': 'Responsable',

  'users.filters.apply': 'Aplicar',
  'users.filters.reset': 'Restablecer',

  'users.grid.columns.fullName': 'Nombre completo',
  'users.grid.columns.email': 'Correo electrónico',
  'users.grid.columns.role': 'Rol',
  'users.grid.columns.status': 'Estado',
  'users.grid.columns.sessionTimeoutMinutes': 'Duración de sesión (min)',
  'users.grid.columns.modulePermissions': 'Permisos de módulo',
  'users.grid.columns.lastLoginAt': 'Último acceso',
  'users.grid.columns.actions': 'Acciones',

  'users.grid.toolbar.resetFilters': 'Restablecer filtros',
  'users.grid.toolbar.excelVisible': 'Excel (visible)',
  'users.grid.toolbar.excelAll': 'Excel (todos)',
  'users.grid.toolbar.csvVisible': 'CSV (visible)',
  'users.grid.toolbar.csvAll': 'CSV (todos)',

  'users.grid.locale.groupPanel': 'Arrastra columnas aquí para agrupar',
  'users.grid.locale.valuePanel': 'Arrastra columnas aquí para agregar valores',
  'users.grid.locale.filters': 'Filtros',
  'users.grid.locale.columns': 'Columnas',
  'users.grid.locale.advancedFilter': 'Filtro avanzado',
  'users.grid.locale.advancedFilterBuilder': 'Filtro avanzado',
  'users.grid.locale.advancedFilterButtonTooltip': 'Abrir filtro avanzado',
  'users.grid.locale.advancedFilterBuilderAdd': 'Añadir condición',
  'users.grid.locale.advancedFilterBuilderRemove': 'Eliminar',
  'users.grid.locale.advancedFilterJoinOperator': 'Operador de unión',
  'users.grid.locale.advancedFilterAnd': 'Y',
  'users.grid.locale.advancedFilterOr': 'O',
  'users.grid.locale.advancedFilterValidationMissingColumn': 'Selecciona una columna',
  'users.grid.locale.advancedFilterValidationMissingOption': 'Selecciona un operador',
  'users.grid.locale.advancedFilterValidationMissingValue': 'Introduce un valor',
  'users.grid.locale.advancedFilterApply': 'Aplicar',

  'users.actions.menuLabel': 'Acciones ▾',
  'users.actions.view': 'Ver detalles',
  'users.actions.editRole': 'Editar rol / permisos',
  'users.actions.resetPassword': 'Restablecer contraseña',
  'users.actions.toggleStatus.disable': 'Desactivar',
  'users.actions.toggleStatus.enable': 'Activar',
  'users.actions.resetPassword.success': 'Se ha enviado el enlace para restablecer la contraseña.',
  'users.actions.status.success': 'El estado del usuario se ha actualizado.',
  'users.notifications.activation.description': 'ID de auditoría: {auditId}',

  'users.detail.title': 'Detalles del usuario',
  'users.detail.section.profile': 'Información de perfil',
  'users.detail.section.permissions': 'Permisos de módulo',
  'users.detail.section.quickActions': 'Acciones rápidas',

  'users.detail.sessionTimeout.unit': 'minutos',
  'users.detail.sessionTimeout.saving': 'Guardando...',
  'users.detail.sessionTimeout.save': 'Guardar',
  'users.detail.sessionTimeout.minWarning': 'La duración de la sesión debe ser de al menos 1 minuto.',
  'users.detail.sessionTimeout.noChange': 'La duración de la sesión ya está configurada con este valor.',
  'users.detail.sessionTimeout.updated': 'La duración de la sesión se ha actualizado.',
  'users.detail.sessionTimeout.updateFailed': 'No se pudo actualizar la duración de la sesión.',

  'users.detail.roleUpdated': 'Se ha actualizado el rol del usuario.',

  'users.detail.noModulePermissions': 'No hay permisos de módulo definidos.',
  'users.detail.noPermissionDetails': 'No hay detalles de permisos disponibles',
  'users.detail.scopeMissingHint':
    'No se pueden editar permisos porque no hay un alcance de empresa/período seleccionado.',
  'users.detail.noAccessWarning':
    'El usuario no tiene acceso a este módulo y no puede ver los informes relacionados.',
  'users.detail.userManagementScopeHint':
    'Los permisos de Gestión de usuarios deben concederse con una empresa/período seleccionado.',
  'users.detail.modulePermission.noActive': 'No hay ningún permiso activo para este módulo.',
  'users.detail.modulePermission.removed': 'Se eliminó el permiso para {module}.',
  'users.detail.modulePermission.updated': 'Se actualizó el permiso para {module}.',
  'users.detail.modulePermission.updating': 'Actualizando permiso...',

  'users.detail.moduleLevelDescription.none': 'Sin acceso a este módulo',
  'users.detail.moduleLevelDescription.view': 'Acceso solo de lectura',
  'users.detail.moduleLevelDescription.edit': 'Acceso de edición',
  'users.detail.moduleLevelDescription.manage': 'Acceso administrativo completo',

  'users.detail.quickActions.noteSoon': 'Añadir nota (próximamente)',
};

export default users;
