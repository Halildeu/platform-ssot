import { http, HttpResponse } from 'msw';

const variants = [
  {
    id: 'variant-1',
    gridId: 'report-users',
    name: 'Varsayılan',
    isDefault: true,
    isGlobal: false,
    isGlobalDefault: false,
    isUserDefault: true,
    isUserSelected: true,
    schemaVersion: 1,
    sortOrder: 0,
    state: {
      columnState: [],
      filterModel: null,
      advancedFilterModel: null,
      sortModel: [],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const variantHandlers = [
  http.get('/api/v1/variants', () =>
    HttpResponse.json({
      items: variants,
      total: variants.length,
      page: 1,
      pageSize: variants.length,
    }),
  ),
  http.get('/api/v1/variants/:id', ({ params }) => {
    const found = variants.find((v) => v.id === params.id);
    if (!found) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    return HttpResponse.json(found);
  }),
  http.post('/api/v1/variants', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const created = {
      id: `variant-${variants.length + 1}`,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    variants.push(created);
    return HttpResponse.json(created, { status: 201 });
  }),
  http.put('/api/v1/variants/:id', async ({ params, request }) => {
    const index = variants.findIndex((v) => v.id === params.id);
    if (index === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    const body = (await request.json()) as Record<string, unknown>;
    variants[index] = { ...variants[index], ...body, updatedAt: new Date().toISOString() };
    return HttpResponse.json(variants[index]);
  }),
  http.delete('/api/v1/variants/:id', ({ params }) => {
    const index = variants.findIndex((v) => v.id === params.id);
    if (index === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    variants.splice(index, 1);
    return HttpResponse.json({ deleted: true });
  }),
  http.post('/api/v1/variants/:id/apply', ({ params }) => {
    const found = variants.find((v) => v.id === params.id);
    if (!found) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    return HttpResponse.json({ applied: true, variant: found });
  }),
];
