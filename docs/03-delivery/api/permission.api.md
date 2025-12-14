# Permission API Sözleşmesi (v1)

Amaç: Rol ve izin atama/listeleme uçlarının v1 REST path ve DTO özetini
tanımlamak; legacy uçları işaretlemek.

-------------------------------------------------------------------------------
1) v1 REST Path (Tercih Edilen)
-------------------------------------------------------------------------------

- `POST /api/v1/permissions/check`  
  - Body: `PermissionCheckRequestDto`  
  - Response: `{ "allowed": boolean }`

- `POST /api/v1/permissions/assignments`  
  - Body: `PermissionAssignRequestDto`  
  - Response: `PermissionAssignmentDto`

- `PATCH /api/v1/permissions/assignments`  
  - Body: `PermissionAssignmentUpdateRequestDto`  
  - Response: `PermissionAssignmentDto`

- `DELETE /api/v1/permissions/assignments/{assignmentId}?performedBy=`  
  - Response: `{ "status": "ok", "auditId": "..." }`

- `GET /api/v1/permissions/assignments?userId=&companyId=&projectId=&warehouseId=`  
  - Response: `PagedResultDto<PermissionAssignmentDto>`

- `GET /api/v1/roles`  
  - Response: `PagedResultDto<RoleDto>`

- `POST /api/v1/roles/{roleId}/clone`  
  - Body: `CloneRoleRequestDto`  
  - Response: `{ "role": RoleDto, "auditId": "..." }`

- `PATCH /api/v1/roles/{roleId}/permissions/bulk`  
  - Body: `BulkPermissionsRequestDto`  
  - Response: `{ "updatedRoleIds": [ ... ], "auditId": "..." }`

-------------------------------------------------------------------------------
2) DTO Özetleri
-------------------------------------------------------------------------------

- `PermissionAssignRequestDto`  
  - `userId`, `companyId?`, `projectId?`, `warehouseId?`, `roleId`, `assignedBy`
- `PermissionAssignmentUpdateRequestDto`  
  - `userId`, `companyId?`, `projectId?`, `warehouseId?`, `roleId`, `performedBy`
- `PermissionAssignmentDto`  
  - `assignmentId`, `roleId`, `roleName`, `scope` (company/project/warehouse), `permissions`, `auditId`
- `RoleDto`  
  - `id`, `name`, `description`, `memberCount`, `systemRole`,  
    `policies[{moduleKey,moduleLabel,level,...}]`
- Zarf: `PagedResultDto<T>` → `items`, `total`, `page`, `pageSize`
- Hata: `ErrorResponse` (STYLE-API-001) → `error`, `message`, `fieldErrors?`, `meta.traceId`

-------------------------------------------------------------------------------
3) Legacy (Deprecated, Kaldırılacak)
-------------------------------------------------------------------------------

Aşağıdaki uçlar geriye dönük uyumluluk için çalışmaya devam eder ancak
**yeni geliştirmelerde kullanılmamalıdır**:

- `/api/permissions/check|assign|assignments|assign/{id}`  
- `/api/access/roles`  
- `/api/access/roles/clone`  
- `/api/access/roles/bulk-permissions`

-------------------------------------------------------------------------------
4) Güvenlik
-------------------------------------------------------------------------------

- Header: `Authorization: Bearer <jwt>`  
- Scope header’ları ve bağlam: `docs/03-delivery/api/common-headers.md`
- Bazı iç uçlar için service token / internal permission kontrolleri uygulanır;
  detaylar backend security config ve ilgili STORY/ACCEPTANCE dokümanlarında
  açıklanır.

-------------------------------------------------------------------------------
5) Bağlantılar
-------------------------------------------------------------------------------

- Permission servisinin mimari detayları ve kapsamı için: docs/02-architecture/services/permission-service/TECH-DESIGN-*.md  
