// AUTO-GENERATED FILE. DO NOT EDIT MANUALLY.
// Kaynak: docs/05-governance/permission-registry/permissions.registry.json

export type PermissionRegistryEntry = {
  key: string;
  status: 'active' | 'deprecated';
  owner: string;
  module: string;
  description: string;
  sunsetAt?: string | null;
  deprecationReason?: string | null;
  tags?: string[];
  notes?: string | null;
};

export const permissionRegistryVersion = '2025-11-29';
export const permissionRegistryGeneratedAt = '2025-11-29T11:45:00Z';

export const permissionRegistry: PermissionRegistryEntry[] = [
  {
    "key": "VIEW_USERS",
    "status": "active",
    "owner": "team-access",
    "module": "user-management",
    "description": "Listeleme ve arama dâhil tüm kullanıcı kayıtlarını görüntüler.",
    "tags": [
      "mfe-users",
      "page:/admin/users"
    ]
  },
  {
    "key": "MANAGE_USERS",
    "status": "active",
    "owner": "team-access",
    "module": "user-management",
    "description": "Kullanıcı oluşturma, güncelleme, parola resetleme ve durum değiştirme aksiyonları."
  },
  {
    "key": "VIEW_ACCESS",
    "status": "active",
    "owner": "team-access",
    "module": "access-management",
    "description": "Rol listeleri ile permission özetlerini görüntüler."
  },
  {
    "key": "MANAGE_ACCESS",
    "status": "active",
    "owner": "team-access",
    "module": "access-management",
    "description": "Rol oluşturma, klonlama ve permission atama aksiyonlarını açar."
  },
  {
    "key": "VIEW_AUDIT",
    "status": "active",
    "owner": "team-audit",
    "module": "audit",
    "description": "Audit event feed ekranına erişim ve filtreleme yetkisi."
  },
  {
    "key": "MANAGE_AUDIT",
    "status": "active",
    "owner": "team-audit",
    "module": "audit",
    "description": "Audit politikalarını veya dışa aktarma planlarını yönetir.",
    "notes": "İlk fazda yalnızca read-only; ilerleyen sürümlerde export limitleri için kullanılacak."
  },
  {
    "key": "VIEW_REPORTS",
    "status": "active",
    "owner": "team-reporting",
    "module": "reporting",
    "description": "Raporlama MFE (grid + varyant) ekranlarını görüntüler."
  },
  {
    "key": "MANAGE_REPORTS",
    "status": "active",
    "owner": "team-reporting",
    "module": "reporting",
    "description": "Rapor varyantı kaydetme, paylaşma ve silme aksiyonlarını açar."
  },
  {
    "key": "VIEW_VARIANTS",
    "status": "active",
    "owner": "team-reporting",
    "module": "variant-service",
    "description": "Grid varyantlarını ve kayıtlı preset'leri görüntüler."
  },
  {
    "key": "MANAGE_VARIANTS",
    "status": "active",
    "owner": "team-reporting",
    "module": "variant-service",
    "description": "Grid varyantı oluşturma, güncelleme ve silme aksiyonlarını açar."
  },
  {
    "key": "SYSTEM_ADMIN",
    "status": "active",
    "owner": "team-platform-arch",
    "module": "platform",
    "description": "Platform seviyesinde tüm modüllere tam erişim verir; yalnız break-glass senaryolarında atanır.",
    "notes": "Keycloak ROLE_SYSTEM_ADMIN ile eşleştirilir."
  },
  {
    "key": "VIEW_PURCHASE",
    "status": "deprecated",
    "owner": "team-procurement",
    "module": "procurement",
    "description": "Legacy satın alma modülündeki listeleme ekranlarını görüntüler.",
    "sunsetAt": "2026-03-31",
    "deprecationReason": "Purchase MFE, otonom platforma taşındı; yeni izin PURCHASE.VIEW.* ile değiştirilecek.",
    "tags": [
      "legacy"
    ]
  },
  {
    "key": "APPROVE_PURCHASE",
    "status": "deprecated",
    "owner": "team-procurement",
    "module": "procurement",
    "description": "Legacy satın alma modülünde sipariş onaylar.",
    "sunsetAt": "2026-03-31",
    "deprecationReason": "Yeni satın alma akışı IAM tarafı ile entegre olmayacak.",
    "tags": [
      "legacy"
    ]
  },
  {
    "key": "VIEW_WAREHOUSE",
    "status": "deprecated",
    "owner": "team-operations",
    "module": "warehouse",
    "description": "Eski depo yönetimi modülünde stok görüntüler.",
    "sunsetAt": "2026-06-30",
    "deprecationReason": "Warehouse modülü kapanıyor; iznin kaldırılması planlandı."
  },
  {
    "key": "MANAGE_WAREHOUSE",
    "status": "deprecated",
    "owner": "team-operations",
    "module": "warehouse",
    "description": "Depo stok güncelleme ve transfer aksiyonlarını açar.",
    "sunsetAt": "2026-06-30",
    "deprecationReason": "Warehouse modülü kapanıyor; iznin kaldırılması planlandı."
  }
] as const;
