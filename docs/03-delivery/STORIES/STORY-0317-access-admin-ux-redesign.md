# STORY-0317: Access Admin UX Redesign — Sifirdan Tasarim

## Problem

Mevcut access admin sayfasi (`/access/roles`) yamali bir yapida:
- Filtre bar + variant toolbar + tab bar + action butonlari + grid + registry hepsi tek sayfada
- Gorsel hiyerarsi yok — her sey ayni agirlikta
- Permission atama mantigi karisik (policy kartlari + checkbox listesi)
- Graph/Matrix/Explain gibi ileri ozellikler tab olarak eklenmis ama organik degil

## Rakip Analizi Ozeti

| Urun | En Iyi Yani | Bizim Icin Uygulanabilir |
|------|------------|--------------------------|
| **Permit.io** | Block/Grid dual view, checkbox matrix, embeddable | Grid view permission matrix |
| **Clerk** | Feature-based permission gruplama | Modul bazli permission gruplama (zaten var) |
| **Linear** | Hover-to-reveal, minimalizm, Cmd+K | Temiz liste, progressive disclosure |
| **Vercel** | Contributor + progressive disclosure, invitation flow | Scope atama progressive disclosure |
| **Auth0** | Iki yonlu navigasyon (rol→kullanici, kullanici→rol) | Drawer'dan her iki yone erisim |
| **Stripe** | Preset roller, IAM Admin ayirimi, basitlik | System role vurgulama |
| **WorkOS** | Immutable slug, environment-level config | Slug bazli rol ID |

## Onerilen Mimari: 4 Sayfa + Drawer Sistemi

Mevcut tek sayfa yerine, **4 ayri sayfa + ortak drawer** yapisi:

```
/access
  ├── /access/roles          → Rol Yonetimi (ana sayfa)
  ├── /access/matrix         → Yetki Matrisi (Permit.io grid view)
  ├── /access/graph          → Iliski Haritasi (FlowBuilder)
  └── /access/audit          → Yetki Degisiklik Gecmisi
```

**Sidebar navigasyon** (sol sidebar'da "Erisim" grubu altinda) — tab degil, route bazli.

## Sayfa 1: Rol Yonetimi (`/access/roles`)

**Referans:** Linear members + Vercel team management

### Layout
```
┌─────────────────────────────────────────────────┐
│ [Breadcrumb: Yonetim > Erisim > Roller]         │
│                                                   │
│ Rol Yonetimi                    [+ Yeni Rol]     │
│ 12 aktif rol                                      │
├─────────────────────────────────────────────────┤
│ [Arama...]          [Modul: Tumu ▼]  [Sifirla]  │
├─────────────────────────────────────────────────┤
│                                                   │
│  ○ Admin                    3 uye    MANAGE ████  │
│    Tam yetki, tum modullere erisim                │
│                                                   │
│  ○ Editor                   8 uye    EDIT   ███░  │
│    Duzenleme yetkisi, silme haric                 │
│                                                   │
│  ○ Viewer                  15 uye    VIEW   ██░░  │
│    Salt okunur erisim                             │
│                                                   │
│  ○ Operasyon Admin (EMEA)   2 uye    MANAGE ████  │
│    EMEA bolgesi operasyon yetkisi    [system]     │
│                                                   │
└─────────────────────────────────────────────────┘
```

### UX Kararlari

1. **Kart bazli rol listesi** (AG Grid yerine) — Her rol bir kart:
   - Sol: Rol adi + aciklama (bir satir)
   - Orta: Uye sayisi badge
   - Sag: En yuksek yetki seviyesi gorsel bar (NONE=bos, VIEW=1/4, EDIT=2/4, MANAGE=4/4)
   - System role icin `[system]` badge
   - **Hover:** Klonla, Sil, Duzenle butonlari gorunur (Linear pattern)

2. **Filtre:** Sadece arama + modul dropdown — Segmented level kaldirilsin (karisiklik)

3. **"+ Yeni Rol" butonu:** Sag ust, primary — Permit.io/Auth0 pattern

4. **Kart tiklandiginda:** Sag drawer acilir (detay + permission duzenleme)

### Rol Detay Drawer

**Referans:** Auth0 role detail + Vercel member management

```
┌──────────────────────────────────┐
│ Admin                    [×]     │
│ Tam yetki, tum modullere erisim  │
│ ─────────────────────────────── │
│                                  │
│ GENEL                            │
│ Uye sayisi         3             │
│ Olusturulma        2026-01-15    │
│ Son guncelleme     2026-04-04    │
│ Sistem rolu        Evet          │
│                                  │
│ MODUL YETKILERI                  │
│ ┌──────────────────────────────┐│
│ │ Kullanici Yonetimi   [Yonet]▼││
│ │  ☑ VIEW_USERS                ││
│ │  ☑ MANAGE_USERS              ││
│ │  ☑ RESET_PASSWORD            ││
│ ├──────────────────────────────┤│
│ │ Erisim Yonetimi      [Yonet]▼││
│ │  ☑ VIEW_ACCESS               ││
│ │  ☑ MANAGE_ACCESS             ││
│ ├──────────────────────────────┤│
│ │ Denetim               [Oku] ▼││
│ │  ☑ VIEW_AUDIT                ││
│ └──────────────────────────────┘│
│                                  │
│ ATANMIS KULLANICILAR (3)         │
│ ┌──────────────────────────────┐│
│ │ ● Ahmet Yilmaz  admin@...   ││
│ │ ● Mehmet Kaya   ops@...     ││
│ │ ● Ayse Demir    hr@...      ││
│ └──────────────────────────────┘│
│                                  │
│ [Kaydet]              [Vazgec]  │
└──────────────────────────────────┘
```

### UX Kararlari (Drawer)

1. **Modul bazli gruplama** — Her modul bir accordion kart (Clerk feature-based pattern)
2. **Level dropdown** per modul: `[Yonet] ▼` — Select component, 4 secenekli (Yok/Oku/Duz./Yonet)
3. **Altindaki permission'lar** otomatik secilir/kaldirilir (level'a gore)
4. **Manuel override:** Tek tek permission toggle da yapilabilir (Switch component)
5. **Atanmis kullanicilar:** Drawer'da kucuk liste (Auth0 iki yonlu navigasyon)
6. **Dirty state:** Kaydet butonu sadece degisiklik varken aktif, cikmada uyari

## Sayfa 2: Yetki Matrisi (`/access/matrix`)

**Referans:** Permit.io grid view + Cerbos Hub matrix

```
┌──────────────────────────────────────────────────────────┐
│ Yetki Matrisi                              [Kaydet (3)]  │
├──────────┬──────────┬──────────┬──────────┬─────────────┤
│          │ Kullanici│ Erisim   │ Denetim  │ Raporlama   │
│          │ Yonetimi │ Yonetimi │          │             │
├──────────┼──────────┼──────────┼──────────┼─────────────┤
│ Admin    │ ● Yonet  │ ● Yonet  │ ● Yonet  │ ● Yonet     │
│ Editor   │ ● Duz.   │ ○ Yok    │ ● Oku    │ ● Duz.      │
│ Viewer   │ ● Oku    │ ○ Yok    │ ● Oku    │ ● Oku       │
│ Support  │ ● Oku    │ ○ Yok    │ ○ Yok    │ ○ Yok       │
└──────────┴──────────┴──────────┴──────────┴─────────────┘
```

### UX Kararlari

1. **Renk kodlu hucreler:** Yonet=koyu mavi, Duz.=acik mavi, Oku=gri, Yok=bos
2. **Tiklanabilir hucreler** — Hucreye tikla, 4'lu dropdown acilir (Permit.io pattern)
3. **Batch save** — Degisiklikler sayilir, tek "Kaydet" butonu
4. **Sticky ilk sutun** — Rol adlari scroll'da sabit
5. **Riskli izinler vurgulu** — "Yonet" seviyesi sari/turuncu arka plan (risk highlighting)

## Sayfa 3: Iliski Haritasi (`/access/graph`)

**Referans:** Permit.io ReBAC graph + OpenFGA Playground

```
┌──────────────────────────────────────────────┐
│ Iliski Haritasi          [Agac ▪ Grafik]     │
├──────────────────────────────────────────────┤
│                                              │
│    [User: Ahmet]                             │
│        │                                     │
│        ├── admin ──→ [Organization: Default] │
│        │                    │                │
│        │                    ├── [Company: A]  │
│        │                    │      ├── viewer │
│        │                    │      └── [Prj]  │
│        │                    └── [Company: B]  │
│        │                         └── admin    │
│        │                                     │
│        └── can_view ──→ [Module: USER_MGMT]  │
│                                              │
│ [Erisimi Kontrol Et]                        │
│ ┌────────────────────────────────────────┐   │
│ │ Iliski: [can_view ▼]                   │   │
│ │ Kaynak: [module ▼]  ID: [USER_MGMT ▼] │   │
│ │                          [Kontrol Et]  │   │
│ │                                        │   │
│ │ ✅ Erisim VAR — admin → org → company  │   │
│ │    → module inheritance                │   │
│ └────────────────────────────────────────┘   │
└──────────────────────────────────────────────┘
```

### UX Kararlari

1. **Varsayilan: Agac gorunumu** (daha okunabilir, daha az performans maliyeti)
2. **Toggle: Grafik gorunumu** — FlowBuilder ile (isteyen icin)
3. **Erisimi Kontrol Et** ayni sayfa icinde, altta — ayri drawer degil
4. **Kullanici secici:** Sayfa basinda dropdown — kimin iliskilerini goruyorsun?

## Sayfa 4: Yetki Audit (`/access/audit`)

**Referans:** Permit.io Audit Logs embeddable

- Son yetki degisiklikleri timeline
- Kim, ne zaman, hangi rolu degistirdi
- Before/After karsilastirma
- Filtre: Kullanici, rol, tarih araligi

## Sidebar Navigasyon Yapisi

```
Yonetim
  ├── Erisim
  │     ├── Roller          (/access/roles)
  │     ├── Yetki Matrisi   (/access/matrix)
  │     ├── Iliskiler        (/access/graph)
  │     └── Audit            (/access/audit)
  ├── Kullanicilar           (/users)
  └── Denetim                (/audit)
```

## Teknik Yaklasim

### Silinecekler (mevcut)
- `AccessPage.ui.tsx` — tamamen yeniden yazilacak
- `AccessFilterBar.ui.tsx` — basitlestirilecek
- `AccessGrid.ui.tsx` — kart bazli listeye donusecek
- `AccessRoleDrawer.ui.tsx` — yeniden yazilacak
- `PermissionMatrix.ui.tsx` — yeniden yazilacak
- `RelationshipGraph.ui.tsx` / `RelationshipTreeView.ui.tsx` — birlesitirilecek
- `ExplainPanel.ui.tsx` — graph sayfasina entegre edilecek
- `ScopeAssignmentPanel.ui.tsx` — drawer'a entegre edilecek

### Korunacaklar
- `roles.api.ts`, `permissions.api.ts`, `scopes.api.ts`, `companies.api.ts`, `authz.api.ts` — API katmani aynen kalir
- `use-access-roles.model.ts` — query/mutation'lar aynen kalir
- `use-relationship-data.model.ts` — data model aynen kalir
- `access.types.ts` — tipler aynen kalir
- Backend endpoint'ler — degisiklik yok

### Yeni Dosya Yapisi

```
src/
├── pages/
│   ├── roles/
│   │   └── RolesPage.ui.tsx        — Rol listesi (kart bazli)
│   ├── matrix/
│   │   └── MatrixPage.ui.tsx       — Yetki matrisi
│   ├── graph/
│   │   └── GraphPage.ui.tsx        — Iliski haritasi + explain
│   └── audit/
│       └── AuditPage.ui.tsx        — Yetki audit
├── widgets/
│   ├── role-card/
│   │   └── RoleCard.ui.tsx         — Tek rol karti
│   ├── role-drawer/
│   │   └── RoleDrawer.ui.tsx       — Rol detay/duzenleme drawer
│   ├── matrix-cell/
│   │   └── MatrixCell.ui.tsx       — Matris hucresi (tiklanabilir)
│   ├── relationship-tree/
│   │   └── RelationshipTree.ui.tsx — Agac gorunumu
│   └── explain-check/
│       └── ExplainCheck.ui.tsx     — Erisim kontrol formu
└── shared/
    └── AccessNav.ui.tsx            — 4 sayfa arasi navigasyon
```

## Uygulama Sirasi

1. **P0: Rol sayfasi** — RolesPage + RoleCard + RoleDrawer (ana deneyim)
2. **P1: Matris sayfasi** — MatrixPage + MatrixCell (toplu yetki gorunumu)
3. **P2: Iliski sayfasi** — GraphPage + Tree + Explain (gorsel analiz)
4. **P3: Audit sayfasi** — AuditPage (gecmis takibi)

## Basari Kriterleri

- [ ] Sayfa yuklenmesi < 1s (lazy load ile)
- [ ] Rol olusturma 3 tikta tamamlanir (buton → form → kaydet)
- [ ] Permission degisikligi 2 tikta tamamlanir (drawer → level dropdown)
- [ ] Hicbir raw i18n key gorulmez
- [ ] Tum sayfalar 768px'te responsive
- [ ] 12/12+ test gecmeli
