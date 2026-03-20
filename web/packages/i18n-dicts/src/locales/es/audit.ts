import enAudit from '../en/audit';

const audit = {
  ...enAudit,
  'audit.layout.title': 'Eventos de auditoría',
  'audit.layout.description':
    'Revisa la actividad de auditoría de todo el sistema, inspecciona diferencias y exporta informes.',
  'audit.breadcrumb.observability': 'Observabilidad',
  'audit.breadcrumb.audit': 'Auditoría',
  'audit.breadcrumb.events': 'Eventos',
  'audit.filters.user': 'Correo del usuario',
  'audit.filters.service': 'Servicio',
  'audit.filters.level': 'Nivel',
  'audit.filters.level.all': 'Todos los niveles',
  'audit.filters.level.info': 'Información',
  'audit.filters.level.warn': 'Advertencia',
  'audit.filters.level.error': 'Error',
  'audit.grid.timestamp': 'Marca de tiempo',
  'audit.grid.user': 'Usuario',
  'audit.grid.service': 'Servicio',
  'audit.grid.action': 'Acción',
  'audit.grid.level': 'Nivel',
  'audit.grid.correlation': 'ID de correlación',
  'audit.drawer.summary': 'Resumen',
  'audit.drawer.diff': 'Diferencia',
  'audit.drawer.raw': 'JSON bruto',
};

export default audit;
