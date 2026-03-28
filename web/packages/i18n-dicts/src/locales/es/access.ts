import enAccess from '../en/access';

const access = {
  ...enAccess,
  'access.layout.title': 'Gestión de roles y políticas',
  'access.layout.description':
    'Inspecciona permisos de módulos, ajusta reglas de acceso y sigue la actividad de auditoría.',
  'access.breadcrumb.management': 'Administración',
  'access.breadcrumb.access': 'Acceso',
  'access.breadcrumb.roles': 'Roles',

  'access.actions.create': 'Nuevo rol',
  'access.actions.create.tooltip': 'Esta acción se habilitará después del lanzamiento del MVP.',
  'access.actions.clone': 'Clonar rol',
  'access.actions.clone.tooltip': 'Crea un nuevo rol copiando las políticas del rol seleccionado.',
  'access.actions.bulk': 'Permiso masivo',
  'access.actions.bulk.tooltip': 'Actualiza el mismo permiso de módulo en varios roles.',

  'access.metrics.activeRoleCount': 'Cantidad de roles activos: {count}',
  'access.empty.noResults': 'Ningún rol coincide con los filtros actuales.',

  'access.grid.columns.name': 'Nombre del rol',
  'access.grid.columns.memberCount': 'Cantidad de miembros',
  'access.grid.columns.moduleSummary': 'Módulos permitidos',
  'access.grid.columns.lastModified': 'Última actualización',

  'access.variants.selectPlaceholder': 'Selecciona una vista guardada',
  'access.variants.save': 'Guardar',
  'access.variants.saveChanges': 'Guardar cambios',
  'access.variants.saveAs': 'Guardar como',
  'access.variants.delete': 'Eliminar',
  'access.variants.unsavedChanges': 'Hay cambios sin guardar en esta vista.',
  'access.variants.promptName': 'Introduce un nombre para la nueva vista',
  'access.variants.promptPlaceholder': 'p. ej. Roles críticos de seguridad',
  'access.variants.saved': 'Vista guardada.',
  'access.variants.updated': 'Vista actualizada.',
  'access.variants.deleted': 'Vista eliminada.',
  'access.variants.deleteConfirm.title': 'Eliminar vista',
  'access.variants.deleteConfirm.content':
    'La vista seleccionada se eliminará de forma permanente. ¿Continuar?',
  'access.variants.deleteConfirm.ok': 'Eliminar',
  'access.variants.deleteConfirm.cancel': 'Cancelar',

  'access.filter.searchPlaceholder': 'Nombre o descripción del rol',
  'access.filter.moduleAll': 'Todos los módulos',
  'access.filter.apply': 'Aplicar',
  'access.filter.reset': 'Restablecer',
  'access.filter.level.all': 'Todos',
  'access.filter.level.none': 'Sin acceso',
  'access.filter.level.view': 'Ver',
  'access.filter.level.edit': 'Editar',
  'access.filter.level.manage': 'Administrar',

  'access.drawer.noDescription': 'Todavía no se ha proporcionado una descripción para este rol.',
  'access.drawer.members': 'Cantidad de miembros',
  'access.drawer.systemRole': 'Rol del sistema',
  'access.drawer.systemRole.yes': 'Sí',
  'access.drawer.systemRole.no': 'No',
  'access.drawer.lastModified': 'Última actualización',
  'access.drawer.permissionsTitle': 'Permisos del módulo',
  'access.drawer.permissionsEmpty': 'Todavía no se han asignado permisos de módulo.',
  'access.drawer.permissionUpdated': 'Actualizado por {user} · {timestamp}',
  'access.drawer.auditHint': 'Aquí aparecerá el enlace al evento de auditoría relacionado.',

  'access.notifications.cloneSuccess.title': 'Rol clonado',
  'access.notifications.cloneSuccess.description': 'ID de auditoría: {auditId}',
  'access.notifications.cloneError': 'No se pudo clonar el rol.',
  'access.notifications.cloneMissingSelection': 'Selecciona un rol para clonar.',
  'access.notifications.bulkSuccess.title': 'Actualización masiva de permisos',
  'access.notifications.bulkSuccess.description':
    'Se actualizaron {count} roles. ID de auditoría: {auditId}',
  'access.notifications.bulkNoop':
    'Los roles seleccionados ya usan ese nivel de permiso.',

  'access.clone.modal.title': 'Clonar rol',
  'access.clone.modal.subtitle': 'Crea un nuevo rol que herede las políticas de {roleName}.',
  'access.clone.nameLabel': 'Nuevo nombre del rol',
  'access.clone.namePlaceholder': 'p. ej. Administrador de operaciones (EMEA)',
  'access.clone.nameSuggestion': '{roleName} (Copia)',
  'access.clone.nameRequired': 'El nombre del rol es obligatorio.',
  'access.clone.nameMin': 'El nombre del rol debe tener al menos 3 caracteres.',
  'access.clone.descriptionLabel': 'Descripción',
  'access.clone.descriptionPlaceholder': 'Añade una breve descripción (opcional)',
  'access.clone.copyMemberCount': 'Copiar cantidad de miembros',
  'access.clone.copyMemberTooltip':
    'Mantén la cantidad de miembros existente para el rol clonado. De forma predeterminada el rol empieza con cero miembros.',
  'access.clone.okText': 'Crear',
  'access.clone.cancelText': 'Cancelar',

  'access.bulk.modal.title': 'Actualización masiva de permisos',
  'access.bulk.info':
    'Vas a actualizar el mismo permiso de módulo para {count} roles seleccionados.',
  'access.bulk.moduleLabel': 'Módulo',
  'access.bulk.moduleRequired': 'Selecciona un módulo.',
  'access.bulk.levelLabel': 'Nivel de permiso',
  'access.bulk.levelRequired': 'Selecciona un nivel de permiso.',
  'access.bulk.modulePlaceholder': 'Seleccionar módulo',
  'access.bulk.levelPlaceholder': 'Seleccionar nivel de permiso',
  'access.bulk.okText': 'Actualizar',
  'access.bulk.cancelText': 'Cancelar',

  'access.registry.title': 'Instantánea del registro de permisos',
  'access.registry.subtitle':
    'Versión de origen {version}. CI mantiene esta tabla sincronizada con el registro canónico.',
  'access.registry.summary.active': 'Permisos activos',
  'access.registry.summary.deprecated': 'Permisos obsoletos',
  'access.registry.legend': 'Última generación: {generatedAt}',
  'access.registry.columns.key': 'Clave del permiso',
  'access.registry.columns.module': 'Módulo',
  'access.registry.columns.owner': 'Responsable',
  'access.registry.columns.status': 'Estado',
  'access.registry.columns.sunset': 'Retiro',
  'access.registry.status.active': 'Activo',
  'access.registry.status.deprecated': 'Obsoleto',
  'access.registry.sunset.tbd': 'Sin fecha programada',
};

export default access;
