# PB-0003 – Access Permission Bulk-Assign API v2

ID: PB-0003

-------------------------------------------------------------------------------
1. AMAÇ
-------------------------------------------------------------------------------

- Access yönetim ekranlarında aynı anda çok sayıda kullanıcıya veya role
  permission atama işlemlerinin yavaş, hataya açık ve manuel olması
  nedeniyle, iş birimlerinin toplu yetki verme/geri alma operasyonlarını
  zorlaştıran problemi net ve ölçülebilir şekilde tanımlamak.

-------------------------------------------------------------------------------
2. KAPSAM
-------------------------------------------------------------------------------

- Ürün: Access / permission yönetim konsolu (web admin).  
- Modül: Permission bulk-assign / bulk-revoke akışları.  
- Ortamlar: Özellikle prod; stage/test ortamındaki gözlemler destekleyici.

-------------------------------------------------------------------------------
3. SORUN TANIMI
-------------------------------------------------------------------------------

- Mevcut durum:
  - Bir kampanya, şirket birleşmesi veya ekip yeniden yapılanması sırasında
    onlarca/yüzlerce kullanıcı için permission değişiklikleri yapılması
    gerekiyor.
  - Access UI şu an tek tek kullanıcı/role bazlı atamalara odaklı; toplu
    işlem için UI veya API tarafında net bir “bulk assign” modeli yok.
- Belirtiler:
  - Operasyon ekipleri CSV/Excel listeleriyle tek tek kullanıcılara girip
    permission değiştiriyor; bu da hem zaman kaybı, hem de hata riski
    (yanlış kullanıcıya yetki verme) yaratıyor.
  - Büyük toplu işlemlerde API çağrıları artıyor, loglarda benzer pattern’ler
    (aynı permission için onlarca çağrı) görülüyor.
  - Bazı durumlarda “yarım kalmış” toplu yetki değişiklikleri; kimlerin
    yeni yetkiyi aldığı net görünmüyor.
- Kimler etkileniyor?
  - Operasyon ve IT ekipleri: Toplu yetki işlemlerini manuel yönetmek
    zorunda kalıyor, SLA baskısı artıyor.
  - Güvenlik/uyum ekipleri: Kimlere hangi yetkinin verildiğini, hangi
    toplu işlemin sorumlu olduğunu takip etmekte zorlanıyor.

-------------------------------------------------------------------------------
4. HEDEF VE BAŞARI KRİTERLERİ
-------------------------------------------------------------------------------

- İş hedefleri:
  - Tipik bir “100 kullanıcıya aynı permission set’ini verme” senaryosunda
    operasyon süresini en az 3x kısaltmak.
  - Toplu işlem başına hata (yanlış kullanıcı/permission) oranını anlamlı
    şekilde düşürmek.
- Teknik/metrik hedefler:
  - Bulk-assign API’leri için P95 yanıt süresi ≤ 1 sn (makul batch boyutu
    altında).  
  - İşlem idempotent olmalı; aynı isteğin tekrar gönderilmesi double-assign
    yaratmamalı.  
  - Audit log’larda her bulk işlem için tekil bir “bulk operation id”
    ile izlenebilirlik sağlanmalı.

-------------------------------------------------------------------------------
5. VARSAYIMLAR / RİSKLER
-------------------------------------------------------------------------------

- Varsayımlar:
  - Permission modeli hali hazırda user/role/permission üçgeninde
    normalize; bulk-assign bu modeli bozmayacak, sadece daha verimli
    kullanım sağlayacak.
  - UI tarafında büyük batch’ler için kullanıcı geri bildirimi (progress,
    success/failure özetleri) sağlanabilir.
- Riskler:
  - Yanlış tasarlanmış bir bulk API, büyük kapsamlı yanlış yetkilendirme
    hatalarına yol açabilir; rollback ve audit senaryoları kritik önemdedir.
  - Büyük batch’ler backend performansını olumsuz etkileyebilir; uygun
    batch boyutu ve throttling kuralları tanımlanmalıdır.

-------------------------------------------------------------------------------
6. ÖZET
-------------------------------------------------------------------------------

- Access permission bulk-assign işlemleri bugün manuel ve hataya açık;
  operasyonel verimlilik ve güvenlik açısından risk oluşturuyor.
- Bu Problem Brief, bulk-assign API v2 ve ilgili UI/operasyon akışları
  için sonraki adımda hazırlanacak PRD + teknik tasarım + Story/Acceptance
  zinciri için temel girdi olacaktır.

