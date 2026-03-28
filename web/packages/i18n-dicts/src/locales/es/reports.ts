import enReports from '../en/reports';

const reports = {
  ...enReports,
  'reports.nav.users': 'Usuarios',
  'reports.nav.access': 'Acceso',
  'reports.nav.audit': 'Auditoría',
  'reports.breadcrumb.root': 'Informes',

  'reports.toolbar.refresh': 'Actualizar datos',
  'reports.toolbar.exportCsv': 'Exportar CSV',

  'reports.filters.apply': 'Aplicar filtros',
  'reports.filters.reset': 'Restablecer',
  'reports.filters.all': 'Todos',
  'reports.filters.search.placeholder': 'Buscar por nombre, correo o ID',
  'reports.filters.status.placeholder': 'Estado',
  'reports.filters.level.placeholder': 'Severidad',

  'reports.status.active': 'Activo',
  'reports.status.inactive': 'Inactivo',
  'reports.status.invited': 'Invitado',
  'reports.status.suspended': 'Suspendido',

  'reports.detail.empty': 'Selecciona un registro para ver sus detalles.',

  'reports.users': 'Informe de usuarios',
  'reports.users.title': 'Actividad de usuarios',
  'reports.users.description':
    'Haz seguimiento del estado del usuario, el último acceso y los roles asignados.',
  'reports.users.breadcrumb': 'Usuarios',
  'reports.users.columns.fullName': 'Nombre completo',
  'reports.users.columns.email': 'Correo electrónico',
  'reports.users.columns.role': 'Rol',
  'reports.users.columns.status': 'Estado',
  'reports.users.columns.lastLoginAt': 'Último acceso',
  'reports.users.columns.createdAt': 'Creado el',

  'reports.access': 'Informe de acceso',
  'reports.access.title': 'Cobertura de roles',
  'reports.access.description':
    'Consulta cuántos usuarios dependen de cada rol crítico.',
  'reports.access.breadcrumb': 'Acceso',
  'reports.access.columns.roleName': 'Nombre del rol',
  'reports.access.columns.memberCount': 'Miembros',
  'reports.access.columns.moduleSummary': 'Módulos',
  'reports.access.columns.updatedAt': 'Actualizado el',
  'reports.access.comingSoon': 'La analítica detallada de acceso estará disponible pronto.',

  'reports.audit': 'Informe de auditoría',
  'reports.audit.title': 'Rastro de auditoría',
  'reports.audit.description':
    'Filtra eventos de auditoría por servicio, actor y severidad.',
  'reports.audit.breadcrumb': 'Auditoría',
  'reports.audit.columns.eventId': 'ID de evento',
  'reports.audit.columns.userEmail': 'Correo del usuario',
  'reports.audit.columns.service': 'Servicio',
  'reports.audit.columns.action': 'Acción',
  'reports.audit.columns.level': 'Nivel',
  'reports.audit.columns.timestamp': 'Marca de tiempo',
  'reports.audit.comingSoon': 'El panel de detalle de auditoría está en construcción.',
};

export default reports;
