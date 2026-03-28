import type { ComponentGuide } from './types';

export const guides: Record<string, ComponentGuide> = {
  AgGridServer: {
    componentName: "AgGridServer",
    summary: "AgGridServer, sunucu tarafli veri kaynagi ile calisarak buyuk veri kumelerini sayfa sayfa yukleyen AG Grid tabanli veri tablosu bilesenidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `AgGridServer, AG Grid Community/Enterprise altyapisini kullanarak **sunucu tarafli veri modeli** (Server-Side Row Model) ile buyuk veri kumelerini verimli sekilde goruntuleyen bir veri tablosu bilesenidir. Temel yetenekleri:

- **Server-side data fetching** — \`getData\` callback'i ile sayfa sayfa veri cekme
- **Column definitions** — \`columnDefs\` ile esnek sutun tanimlari ve gruplama
- **Grid options** — AG Grid'in tum yapilandirma secenekleri \`gridOptions\` ile desteklenir
- **Mesajlasma** — \`messages.loadingLabel\` ile yerellestirilmis yukleniyor metni

\`\`\`tsx
import { AgGridServer } from '@mfe/design-system';

<AgGridServer
  columnDefs={[
    { field: "ad", headerName: "Ad" },
    { field: "email", headerName: "E-posta" },
    { field: "rol", headerName: "Rol" },
  ]}
  getData={async (request) => {
    const res = await fetchUsers(request);
    return { rows: res.data, total: res.total };
  }}
  height={500}
  messages={{ loadingLabel: "Veriler yukleniyor..." }}
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Binlerce veya milyonlarca satir iceren buyuk veri kumelerini goruntulemek icin
- Sunucu tarafli siralama, filtreleme ve sayfalama gerektiren senaryolarda
- API'den sayfa sayfa veri cekilmesi gereken listeleme ekranlarinda
- Performansin kritik oldugu veri yogun panellerde

**Kullanmayin:**
- Kucuk ve statik veri kumeleri icin — bunun yerine \`TableSimple\` kullanin
- Istemci tarafinda filtreleme ve siralama yeterli oldugunda — bunun yerine \`EntityGridTemplate\` (client modu) kullanin
- Basit liste gorunumu icin — bunun yerine \`List\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────────────────┐
│  [Column Header] [Column Header] [Column Header] │
│  ─────────────────────────────────────────────── │
│  row 1 data      data            data             │
│  row 2 data      data            data             │
│  ...             ...             ...              │
│  ─────────────────────────────────────────────── │
│  [Loading indicator / Pagination]                 │
└──────────────────────────────────────────────────┘
\`\`\`

1. **Grid Container** — Belirtilen \`height\` ile boyutlandirilan ana kapsayici
2. **Column Headers** — \`columnDefs\` ile tanimlanan sutun basliklari; siralama ve filtreleme destegi
3. **Row Data** — \`getData\` callback'i ile sunucudan cekilen satir verileri
4. **Loading State** — Veri cekilirken gosterilen yukleniyor gostergesi
5. **Default Col Def** — \`defaultColDef\` ile tum sutunlara uygulanan varsayilan ayarlar`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**\`getData\` callback'ini optimize edin.** Sunucu isteklerini minimize etmek icin debounce veya cache stratejisi kullanin.

**\`defaultColDef\` ile ortak ayarlari merkezilestirin.** Her sutunda tekrar etmek yerine varsayilan siralama, filtreleme ve boyutlandirma ayarlarini bir kez tanimlayin.

**\`height\` prop'unu icerige uygun secin.** Sayfanin genel duzeniyle uyumlu sabit veya dinamik yukseklik kullanin.

**\`messages\` ile yerellestirilmis metinler saglayin.** \`loadingLabel\` gibi mesajlari kullanicinin diline uygun tanimlayin.

**Column group'lari ile karmasik sutunlari organize edin.** \`ColGroupDef\` kullanarak iliskili sutunlari mantiksal olarak gruplayin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Kucuk veri kumeleri icin sunucu tarafli model kullanmak**
100'den az satir icin istemci tarafli \`TableSimple\` veya \`EntityGridTemplate\` daha uygun ve basittir.

**❌ \`getData\` icinde gereksiz API cagirilari yapmak**
Her siralama/filtreleme degisikliginde tam veri cekimi performans sorunlarina yol acar. Sunucu tarafinda uygun sayfalama yapin.

**❌ Sabit yukseklik vermeden kullanmak**
AG Grid yukseklik belirtilmeden dogru render edemez. Her zaman \`height\` prop'unu belirtin.

**❌ \`gridOptions\` ile asiri yapilandirma**
Tum AG Grid ozelliklerini acmak karmasiklik yaratir. Yalnizca ihtiyac duyulan ozellikleri etkinlestirin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** AG Grid, \`role="grid"\` ile tablo semantigini otomatik saglar. Sutun basliklari \`role="columnheader"\` ile tanimlanir.

**Klavye Navigasyonu:** Ok tuslari ile hucreler arasi gecis. Enter ile hucre duzenleme. Tab ile grid disina cikis.

**Ekran Okuyucu:** AG Grid dahili ARIA ozellikleri ile hucre iceriklerini, siralama durumunu ve filtreleme bilgisini duyurur.

**Yukleniyor Durumu:** \`messages.loadingLabel\` ile yukleniyor metni ekran okuyuculara bildirilir.

**Buyuk Veri:** Sanal kaydirma (virtual scrolling) ile yalnizca gorunen satirlar DOM'da yer alir; bu hem performansi hem erisilebilirlik agacini iyilestirir.`,
      },
    ],
    relatedComponents: ["EntityGridTemplate", "TableSimple", "TreeTable"],
  },

  EntityGridTemplate: {
    componentName: "EntityGridTemplate",
    summary: "EntityGridTemplate, AG Grid ustune toolbar, sayfalama, varyant yonetimi, tema secimi ve disa aktarma yetenekleri ekleyen kapsamli veri tablosu sablonudur.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `EntityGridTemplate, AG Grid altyapisini kullanarak **tam donanimli bir veri tablosu deneyimi** sunan sablon bilesenidir. Icerisinde toolbar, hizli filtre, tema secimi, yogunluk ayari, varyant yonetimi, disa aktarma ve sayfalama gibi ozellikler hazir olarak gelir.

- **Grid Variant Management** — Kullanicilarin grid durumunu (kolon sirasi, filtreler) kaydetmesi ve yuklemesi
- **Quick Filter** — Toolbar'da anlik metin arama
- **Theme & Density** — Quartz, Balham, Alpine gibi temalar ve compact/comfortable yogunluk
- **Export** — Excel ve CSV disa aktarma destegi
- **Server/Client Mode** — \`dataSourceMode\` ile sunucu veya istemci tarafli veri modeli

\`\`\`tsx
import { EntityGridTemplate } from '@mfe/design-system';

<EntityGridTemplate
  gridId="kullanici-listesi"
  gridSchemaVersion={1}
  columnDefs={[
    { field: "ad", headerName: "Ad Soyad" },
    { field: "email", headerName: "E-posta" },
    { field: "durum", headerName: "Durum" },
  ]}
  rowData={users}
  total={totalCount}
  page={currentPage}
  pageSize={20}
  onPageChange={(page, size) => fetchPage(page, size)}
  exportConfig={{ fileBaseName: "kullanicilar" }}
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Karmasik veri tablolari icin tam donanimli grid deneyimi gerektiren ekranlarda
- Kolon siralama, filtreleme, gruplama ve disa aktarma gereken listeleme sayfalarinda
- Kullanicilarin grid gorunumunu kisisellestirmesi (varyant kaydetme) gereken senaryolarda
- Sayfalama ile buyuk veri kumeleri gosterilecek entity listeleme ekranlarinda

**Kullanmayin:**
- Basit ve statik tablolar icin — bunun yerine \`TableSimple\` kullanin
- Salt okunur ozet tablo icin — bunun yerine \`Descriptions\` kullanin
- Hiyerarsik veri icin — bunun yerine \`TreeTable\` kullanin
- Yalnizca sunucu tarafli minimal grid icin — bunun yerine \`AgGridServer\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────────────────────────┐
│ Toolbar: [Quick Filter] [Theme] [Density] [Variants] [Export] [Extras?] │
│ ──────────────────────────────────────────────────────── │
│  [Column Headers with sort/filter indicators]            │
│  ────────────────────────────────────────────            │
│  Row 1 ...                                               │
│  Row 2 ...                                               │
│  ...                                                     │
│ ──────────────────────────────────────────────────────── │
│ Footer: [Page Size] [Record Count] [< 1 2 3 ... >]      │
└──────────────────────────────────────────────────────────┘
\`\`\`

1. **Toolbar** — Hizli filtre, tema, yogunluk, varyant secici, disa aktarma butonlari ve \`toolbarExtras\` slot'u
2. **Grid Area** — AG Grid ile render edilen kolon basliklari ve satir verileri
3. **Column Headers** — Siralama, filtreleme ve yeniden boyutlandirma destegi
4. **Row Data** — Istemci veya sunucu modunda yuklenen veri satirlari
5. **Footer / Pagination** — Sayfa boyutu, toplam kayit sayisi ve sayfa navigasyonu
6. **Variant Manager** — Grid durumunu kaydetme, yukleme ve yonetme modali`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**\`gridId\` ve \`gridSchemaVersion\` benzersiz tanimlayin.** Varyant kaydetme ve state persistance icin her grid'in benzersiz kimlige ihtiyaci vardir. Schema degistiginde versiyonu artirin.

**\`exportConfig\` ile anlamli dosya adi verin.** \`fileBaseName\` alanini icerikle iliskili sekilde tanimlayin (ornegin "musteri-listesi").

**\`defaultColDef\` ile ortak kolon davranislarini merkezilestirin.** Siralama, yeniden boyutlandirma ve filtre ayarlarini tek noktadan yonetin.

**\`toolbarExtras\` ile ozel kontroller ekleyin.** Toolbar'a ek butonlar veya filtreler eklemek icin bu slot'u kullanin.

**\`messages\` ile tum metinleri yerelselestirin.** 80'den fazla mesaj anahtari ile tam yerelselestirme destegi saglayin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ \`gridSchemaVersion\` guncellememek**
Kolon tanimlari degistiginde eski varyantlar bozulur. Schema her degistiginde versiyonu artirin.

**❌ Kucuk ve degismeyen veriler icin EntityGridTemplate kullanmak**
5-10 satirlik statik veriler icin \`TableSimple\` cok daha hafif ve uygun bir secimdir.

**❌ \`gridOptions\` ile tum AG Grid ozelliklerini acmak**
Kullanilmayan ozellikleri etkinlestirmek performansi dusurup kullanici deneyimini karistirabilir.

**❌ Sayfalama olmadan buyuk veri kumesi yuklemek**
\`page\` ve \`pageSize\` prop'lari olmadan binlerce satir yuklemek tarayici performansini olumsuz etkiler.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** AG Grid'in dahili \`role="grid"\` semantigi miras alinir. Toolbar elemanlari uygun ARIA etiketleri ile tanimlanir.

**Klavye:** Grid icinde ok tuslari ile hucre navigasyonu. Toolbar'da Tab ile kontroller arasi gecis. Enter/Space ile buton etkinlestirme.

**Quick Filter:** Arama alani \`aria-label\` ile tanimlanir ve anlik sonuc sayisi ekran okuyucuya bildirilir.

**Sayfalama:** Sayfa navigasyon butonlari \`aria-label\` ile tanimlanir (\`firstPageLabel\`, \`nextPageLabel\` vb.).

**Disa Aktarma:** Export butonlari aciklayici etiketler tasir ve klavye ile erisilebilirdir.

**Yogunluk ve Tema:** Ayar degisiklikleri gorsel olarak aninda yansir ve ekran okuyucuya bildirilir.`,
      },
    ],
    relatedComponents: ["AgGridServer", "TableSimple", "TreeTable", "FilterBar"],
  },

  TableSimple: {
    componentName: "TableSimple",
    summary: "TableSimple, statik ve kucuk veri kumeleri icin hafif, semantik HTML tablo bilesenidir. Erisim kontrolu, yogunluk ayari ve yukleniyor durumu destekler.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `TableSimple, native \`<table>\` elementini kullanarak **hafif ve semantik** bir tablo deneyimi sunan bilesendir. AG Grid bagimliligi olmadan basit veri goruntulemesi icin ideal bir secimdir.

- **Kolon tanimlari** — \`columns\` ile accessor, render, hizalama ve vurgulama destegi
- **Yogunluk** — \`comfortable\` ve \`compact\` modlari
- **Zebra satirlar** — \`striped\` ile alternatif satir renklendirmesi
- **Sticky header** — \`stickyHeader\` ile kaydirmada sabit baslik
- **Access control** — \`full\`, \`readonly\`, \`disabled\`, \`hidden\` erisim seviyeleri

\`\`\`tsx
import { TableSimple } from '@mfe/design-system';

<TableSimple
  caption="Son Islemler"
  description="Son 30 gundeki islem gecmisi"
  columns={[
    { key: "tarih", label: "Tarih", emphasis: true },
    { key: "aciklama", label: "Aciklama" },
    { key: "tutar", label: "Tutar", align: "right" },
  ]}
  rows={transactions}
  density="compact"
  striped
  stickyHeader
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- 100'den az satirlik statik veya az degisen veri kumeleri icin
- Basit listeleme tablolari (son islemler, ozet bilgiler vb.) icin
- Siralama ve filtreleme gerekmeyen salt okunur tablolar icin
- Hafif ve hizli render gereken durumlarda

**Kullanmayin:**
- Buyuk veri kumeleri icin — bunun yerine \`AgGridServer\` veya \`EntityGridTemplate\` kullanin
- Siralama, filtreleme veya kolon yeniden siralama gerektiren tablolar icin — bunun yerine \`EntityGridTemplate\` kullanin
- Hiyerarsik veri icin — bunun yerine \`TreeTable\` kullanin
- Anahtar-deger cift gorunumu icin — bunun yerine \`Descriptions\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────────┐
│ Caption (opsiyonel)                      │
│ Description (opsiyonel)                  │
│ ┌──────────────────────────────────────┐ │
│ │ [TH: Tarih] [TH: Aciklama] [TH: Tutar] │
│ │ ──────────────────────────────────── │ │
│ │  2024-01-15  Odeme alindi     150 TL │ │
│ │  2024-01-14  Fatura           200 TL │ │
│ │  2024-01-13  Iade              50 TL │ │
│ └──────────────────────────────────────┘ │
│ [Empty State — kayit yoksa]              │
└──────────────────────────────────────────┘
\`\`\`

1. **Caption** — Tablo basligi (opsiyonel)
2. **Description** — Tablo aciklamasi (opsiyonel)
3. **Table Container** — Yuvarlatilmis kenarli, golge ve border ile sarili alan
4. **Column Headers** (\`<th>\`) — Uppercase, tracking ile stilize edilmis basliklar
5. **Table Body** — Zebra satir destegi ile veri satirlari
6. **Empty State** — Kayit yoksa \`Empty\` bileseni ile bos durum gosterimi
7. **Loading State** — \`Skeleton\` satirlari ile yukleniyor animasyonu`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**\`caption\` ve \`description\` ile baglam saglayin.** Tablonun ne gosterdigi hakkinda kullaniciya acik bilgi verin.

**\`getRowKey\` ile benzersiz satir anahtari saglayin.** React renderlamasi icin satir indeksi yerine anlamli bir anahtar kullanin.

**\`emphasis\` ile onemli kolonlari vurgulayin.** Birincil veri kolonu (isim, baslik vb.) icin \`emphasis: true\` kullanin.

**\`density="compact"\` ile yogun arayuzlerde kullanin.** Dashboard veya yan panel tablolarinda kompakt yogunluk tercih edin.

**\`truncate\` ile uzun metinleri kesin.** Aciklama gibi degisken uzunluktaki kolonlarda \`truncate: true\` ile tasmayi onleyin.

**\`localeText\` ile yerellestirilmis bos durum mesaji verin.** Bos tablo gosterildiginde anlamli bir mesaj sunun.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Buyuk veri kumeleri icin TableSimple kullanmak**
Yuzlerce satir DOM performansini dusurur. AG Grid tabanli bilesenler sanal kaydirma saglar.

**❌ \`getRowKey\` vermeden dinamik veriler gostermek**
React, satir indeksini anahtar olarak kullandiginda guncelleme sorunlari yasanabilir.

**❌ \`caption\` olmadan bagimsiz tablo kullanmak**
Ekran okuyucular tablonun amacini anlayamaz. En azindan \`caption\` veya \`aria-label\` saglayin.

**❌ Tum kolonlara \`emphasis\` vermek**
Her kolon vurgulandiginda hicbiri one cikmaz. Yalnizca birincil veri kolonunu vurgulayin.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** Native \`<table>\`, \`<thead>\`, \`<tbody>\`, \`<th scope="col">\` elementleri kullanilir. Tam semantik tablo yapisi saglanir.

**Caption:** \`caption\` prop'u tablo amacini tanimlar ve ekran okuyucular tarafindan duyurulur.

**Erisim Kontrolu:** \`access\` prop'u ile \`full\`, \`readonly\`, \`disabled\`, \`hidden\` seviyeleri desteklenir. \`accessReason\` ile tooltip aciklamasi saglanir.

**Sticky Header:** \`stickyHeader\` aktifken basliklar her zaman gorunurdur ve baglam kaybi onlenir.

**Bos Durum:** Kayit yokken \`Empty\` bileseni goruntulenir ve ekran okuyucuya aciklama sunulur.

**Yukleniyor:** \`loading\` durumunda \`Skeleton\` satirlari render edilir ve gorsel geri bildirim saglanir.`,
      },
    ],
    relatedComponents: ["EntityGridTemplate", "AgGridServer", "TreeTable", "Descriptions", "List"],
  },

  EntitySummaryBlock: {
    componentName: "EntitySummaryBlock",
    summary: "EntitySummaryBlock, avatar, baslik, alt baslik, badge ve anahtar-deger ciftleri ile bir varligin ozet bilgilerini goruntuleyen kart bilesenidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `EntitySummaryBlock, bir varligin (kullanici, musteri, urun vb.) ozet bilgilerini **premium gorunumlu kart** icerisinde sunan bilesendir. Avatar, baslik, alt baslik, badge, aksiyon butonlari ve anahtar-deger ciftleri tek bir blokta birlestirilir.

- **Avatar** — Varlik gorseli, isim bas harfleri veya fallback ikon destegi
- **Title & Subtitle** — Ana baslik ve destekleyici alt baslik
- **Badge** — Durum veya kategori gostergesi
- **Actions** — Sag ust kosede aksiyon butonlari slot'u
- **Descriptions** — \`items\` ile anahtar-deger ciftleri (Descriptions bileseni kullanilir)

\`\`\`tsx
import { EntitySummaryBlock } from '@mfe/design-system';

<EntitySummaryBlock
  title="Ahmet Yilmaz"
  subtitle="Yazilim Muhendisi — Istanbul"
  avatar={{ name: "Ahmet Yilmaz", src: "/avatars/ahmet.jpg" }}
  badge={<Badge variant="success">Aktif</Badge>}
  actions={<Button size="sm" variant="secondary">Duzenle</Button>}
  items={[
    { label: "E-posta", value: "ahmet@ornek.com" },
    { label: "Telefon", value: "+90 555 123 4567" },
    { label: "Departman", value: "Muhendislik" },
    { label: "Baslangic", value: "15 Ocak 2023" },
  ]}
/>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Detay sayfasinin ust kisminda varlik ozet bilgisi gostermek icin
- Musteri, caliskan, urun gibi varliklarin profil kartini olusturmak icin
- Avatar, baslik ve anahtar-deger ciftlerini tek blokta birlestirmek icin
- Dashboard'larda onemli varliklarin ozet gorunumlerinde

**Kullanmayin:**
- Uzun form detaylari icin — bunun yerine \`Descriptions\` kullanin
- Navigasyon karti olarak — bunun yerine \`Card\` kullanin
- Coklu varliklari liste halinde gostermek icin — bunun yerine \`List\` kullanin
- Basit istatistik gosterimi icin — bunun yerine \`SummaryStrip\` kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌────────────────────────────────────────────────────┐
│  ┌────┐  Ahmet Yilmaz  [Aktif]      [Duzenle]     │
│  │ AY │  Yazilim Muhendisi — Istanbul              │
│  └────┘                                            │
│  ───────────────────────────────────────────────── │
│  E-posta:    ahmet@ornek.com                       │
│  Telefon:    +90 555 123 4567                      │
│  Departman:  Muhendislik                           │
│  Baslangic:  15 Ocak 2023                          │
└────────────────────────────────────────────────────┘
\`\`\`

1. **Premium Surface** — Yuvarlatilmis kenarlar, gradyan arka plan, golge ve parlak ust cizgi
2. **Avatar** (opsiyonel) — XL boyutlu Avatar bileseni; gorsel, bas harf veya fallback ikon
3. **Title** — Varlik adi veya birincil tanimlayici
4. **Badge** (opsiyonel) — Durum veya kategori etiketi
5. **Subtitle** (opsiyonel) — Destekleyici ek bilgi
6. **Actions Slot** (opsiyonel) — Sag ust kosede buton veya kontroller
7. **Descriptions** — Ayirici cizgi altinda anahtar-deger ciftleri`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**\`avatar\` ile gorsel kimliklendirme saglayin.** Kullanici varliklari icin profil resmi veya bas harfler; diger varliklar icin ikon kullanin.

**\`items\` sayisini makul tutun.** 4-8 anahtar-deger cifti ideal bir ozet saglar. Daha fazla bilgi icin detay sekmelerine yonlendirin.

**\`badge\` ile durum bilgisi verin.** Aktif/Pasif, Onaylandi/Beklemede gibi durum bilgilerini badge ile gosterin.

**\`actions\` slot'unu sade tutun.** En fazla 1-2 birincil aksiyon butonu yeterlidir. Daha fazla aksiyon icin dropdown menu kullanin.

**\`access\` prop'u ile erisim kontrolu saglayin.** Yetkisiz kullanicilara \`readonly\` veya \`hidden\` mod ile uygun gosterim yapin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Cok fazla anahtar-deger cifti eklemek**
10'dan fazla oge gorsel kalabalik yaratir. Detay bilgileri icin ayri sekmeler kullanin.

**❌ Navigasyon linki olarak kullanmak**
EntitySummaryBlock bir gosterim bilesenidir; tiklanabilir kart olarak kullanmak icin \`Card\` tercih edin.

**❌ Actions slot'una form elemanlari yerlestirmek**
Aksiyon alani yalnizca butonlar ve basit kontroller icindir. Form alanlari ayri bolumde olmalidir.

**❌ Avatar olmadan profil karti olusturmak**
Kisi veya varlik kartlarinda avatar gorsel kimliklendirme saglar; eksikligi deneyimi zayiflatir.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** \`<section>\` elementi ile bolumlendirme saglanir. \`data-component="entity-summary-block"\` ile tanimlanir.

**Avatar:** Avatar bileseni \`alt\` veya \`initials\` ile ekran okuyucu destegi saglar.

**Descriptions:** Anahtar-deger ciftleri \`Descriptions\` bileseni uzerinden render edilir ve semantik dl/dt/dd yapisi kullanilir.

**Erisim Kontrolu:** \`access\` prop'u ile \`full\`, \`readonly\`, \`disabled\`, \`hidden\` seviyeleri desteklenir. \`hidden\` durumunda bilesen tamamen gizlenir.

**Aksiyonlar:** Actions slot'undaki butonlar kendi ARIA etiketlerini tasimalidir.`,
      },
    ],
    relatedComponents: ["Descriptions", "Avatar", "Badge", "Card", "SummaryStrip", "DetailSummary"],
  },

  ReportFilterPanel: {
    componentName: "ReportFilterPanel",
    summary: "ReportFilterPanel, rapor ve listeleme sayfalarinda yatay filtre formu ile gonder/sifirla aksiyonlarini bir arada sunan panel bilesenidir.",
    sections: [
      {
        id: "overview",
        title: "Genel Bakis",
        icon: "📖",
        content: `ReportFilterPanel, rapor ve listeleme sayfalarinda **yatay filtre formu** sunan bir bilesendir. Filtre alanlari \`children\` olarak eklenir ve otomatik olarak esit genislikte yan yana dizilir. Sagda gonder ve sifirla butonlari yer alir.

- **Form semantigi** — Native \`<form>\` elementi ile submit/reset islemleri
- **Auto layout** — Alt bilesenleri esit \`flex-1\` genislikte yatay dizme
- **Access control** — \`full\`, \`readonly\`, \`disabled\`, \`hidden\` erisim seviyeleri
- **Loading state** — \`loading\` ile submit butonunu devre disi birakma

\`\`\`tsx
import { ReportFilterPanel } from '@mfe/design-system';

<ReportFilterPanel
  onSubmit={() => fetchReport(filters)}
  onReset={() => resetFilters()}
  submitLabel="Filtrele"
  resetLabel="Sifirla"
  loading={isLoading}
>
  <Select label="Donem" value={period} onChange={setPeriod} options={periodOptions} />
  <Select label="Kategori" value={category} onChange={setCategory} options={categoryOptions} />
  <DatePicker label="Baslangic" value={startDate} onChange={setStartDate} />
</ReportFilterPanel>
\`\`\``,
      },
      {
        id: "when-to-use",
        title: "Ne Zaman Kullanilir",
        icon: "✅",
        content: `**Kullanin:**
- Rapor sayfalarinda filtreleme formu icin
- Listeleme sayfalarinin ustunde filtre paneli olarak
- Birden fazla filtre alanini yatay olarak dizmeniz gerektiginde
- Gonder/sifirla butonlari ile form akisi gerektiren durumlarda

**Kullanmayin:**
- Tablo ustunde inline filtreler icin — bunun yerine \`FilterBar\` kullanin
- Karmasik ve cok adimli form arayuzleri icin — bunun yerine \`FormDrawer\` kullanin
- Tek bir arama alani icin — bunun yerine \`SearchFilterListing\` kullanin
- Grid ici kolon filtreleri icin — bunun yerine \`EntityGridTemplate\` dahili filtrelerini kullanin`,
      },
      {
        id: "anatomy",
        title: "Anatomi",
        icon: "🔬",
        content: `\`\`\`
┌──────────────────────────────────────────────────────┐
│ [Donem ▾] [Kategori ▾] [Baslangic] │ [Filtrele] [Sifirla] │
│  flex-1     flex-1       flex-1      │  butonlar            │
└──────────────────────────────────────────────────────┘
\`\`\`

1. **Form Container** — \`<form>\` elementi ile submit event yonetimi
2. **Filter Fields** — \`children\` olarak eklenen filtre bilesenlerinin her biri \`flex-1 min-w-[200px]\` ile yatay dizilir
3. **Submit Button** — Birincil stilte gonder butonu; \`submitLabel\` ile etiketlenir
4. **Reset Button** (opsiyonel) — Ikincil stilte sifirla butonu; \`onReset\` verildiginde gorunur
5. **Loading Guard** — \`loading=true\` iken submit butonu devre disi olur`,
      },
      {
        id: "best-practices",
        title: "En Iyi Uygulamalar",
        icon: "💡",
        content: `**Filtre sayisini makul tutun.** 3-5 filtre alani yatay dizilimde ideal calisir. Daha fazla filtre icin gruplama veya iki satir duzeni dusunun.

**\`submitLabel\` ve \`resetLabel\` ile anlamli etiketler verin.** "Filtrele", "Rapor Olustur", "Sifirla" gibi beklenen aksiyonu acikca ifade eden metinler kullanin.

**\`loading\` prop'unu API cagirilari sirasinda etkinlestirin.** Kullanicinin cift submit yapmasini onleyin.

**\`testId\`, \`submitTestId\`, \`resetTestId\` ile test etiketleri tanimlayin.** Otomasyon testlerinde guvenilir element secimi saglayin.

**\`access\` ile erisim kontrolu saglayin.** Yetkisiz kullanicilarin filtreleme yapamasini \`readonly\` veya \`disabled\` ile engelleyin.`,
      },
      {
        id: "anti-patterns",
        title: "Anti-Patternler",
        icon: "🚫",
        content: `**❌ Cok fazla filtre alani eklemek**
6'dan fazla yatay filtre gorsel karisiklik yaratir ve mobilde bozulur. Oncelikli filtreleri secin.

**❌ \`onReset\` vermeden kullanmak**
Kullanicilar filtreleri sifirlayamazsa hayal kirikligi yasarlar. Daima sifirla secenegi sunun.

**❌ Form disi icerik yerlestirmek**
ReportFilterPanel bir filtre formudur. Tablo, grafik veya aciklama metni gibi icerikler panel disinda olmalidir.

**❌ \`loading\` durumunu yonetmemek**
Uzun suren API cagirilari sirasinda buton aktif kalirsa kullanici tekrar tekrar tiklar.`,
      },
      {
        id: "accessibility",
        title: "Erisilebilirlik",
        icon: "♿",
        content: `**Semantik:** Native \`<form>\` elementi kullanilir. Submit ve reset butonlari \`type="submit"\` ve \`type="button"\` ile dogru rolleri tasir.

**Klavye:** Enter tusu ile form gonderilir. Tab ile filtre alanlari ve butonlar arasinda gezilir.

**Erisim Kontrolu:** \`access\` prop'u ile butonlar \`disabled\` veya \`aria-disabled\` ile isaretlenir. \`accessReason\` ile tooltip aciklamasi saglanir.

**Loading:** \`loading\` durumunda submit butonu \`disabled\` olur ve tekrar gonderim engellenir.

**Filtre Alanlari:** Her filtre bileseni kendi \`label\` ve \`aria-label\` ozelliklerini tasimalidir.`,
      },
    ],
    relatedComponents: ["FilterBar", "SearchFilterListing", "Select", "DatePicker", "Button"],
  },
};
