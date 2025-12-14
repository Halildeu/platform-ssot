import { http, HttpResponse } from 'msw';

const roles = [
  {
    id: 'r-admin',
    name: 'Admin',
    description: 'Sistem yöneticisi',
    memberCount: 2,
    systemRole: true,
    lastModifiedAt: new Date().toISOString(),
    lastModifiedBy: 'system',
    permissions: ['VIEW_USERS', 'MANAGE_USERS', 'VIEW_AUDIT'],
    policies: [
      { moduleKey: 'USER_MANAGEMENT', moduleLabel: 'Kullanıcı Modülü', level: 'MANAGE', lastUpdatedAt: new Date().toISOString(), updatedBy: 'system' },
    ],
  },
];

const permissions = [
  { id: 1, code: 'VIEW_USERS', moduleKey: 'USER_MANAGEMENT', moduleLabel: 'Kullanıcı Modülü' },
  { id: 2, code: 'MANAGE_USERS', moduleKey: 'USER_MANAGEMENT', moduleLabel: 'Kullanıcı Modülü' },
  { id: 3, code: 'VIEW_AUDIT', moduleKey: 'AUDIT_TRAIL', moduleLabel: 'Audit Kayıtları' },
];

export const accessHandlers = [
  http.get('/api/v1/roles', () =>
    HttpResponse.json({
      items: roles,
      total: roles.length,
      page: 1,
      pageSize: roles.length,
    }),
  ),
  http.get('/api/v1/roles/:id', ({ params }) => {
    const role = roles.find((r) => r.id === params.id);
    if (!role) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    return HttpResponse.json(role);
  }),
  http.put('/api/v1/roles/:id', ({ params, request }) => {
    const role = roles.find((r) => r.id === params.id);
    if (!role) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    return HttpResponse.json({ ...role, ...(request as any)?.body });
  }),
  http.post('/api/v1/roles/:id/clone', ({ params }) => {
    const role = roles.find((r) => r.id === params.id);
    if (!role) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    const cloned = { ...role, id: `${role.id}-clone`, name: `${role.name} (Clone)` };
    return HttpResponse.json({ role: cloned });
  }),
  http.put('/api/v1/roles/:id/permissions', async ({ params, request }) => {
    const role = roles.find((r) => r.id === params.id);
    if (!role) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    const body = (await request.json()) as { permissionIds?: Array<string | number> };
    const nextPermissions = Array.isArray(body?.permissionIds)
      ? body.permissionIds.map((p) => String(p))
      : role.permissions ?? [];
    const updated = { ...role, permissions: nextPermissions };
    return HttpResponse.json(updated);
  }),
  http.get('/api/v1/roles/:id', ({ params }) => {
    const role = roles.find((r) => r.id === params.id);
    if (!role) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    return HttpResponse.json(role);
  }),
  http.post('/api/v1/roles/:id/clone', ({ params }) => {
    const source = roles.find((r) => r.id === params.id);
    if (!source) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    return HttpResponse.json({ role: { ...source, id: `${source.id}-clone` } });
  }),
  http.patch('/api/v1/roles/:id/permissions/bulk', () =>
    HttpResponse.json({ updatedRoleIds: roles.map((r) => r.id), auditId: 'audit-1' }),
  ),
  http.get('/api/v1/permissions', () =>
    HttpResponse.json({
      items: permissions,
      total: permissions.length,
    }),
  ),
];
