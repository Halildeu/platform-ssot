# Planlanan Mikro-Frontend UX Çalışmaları

Bu doküman, geliştirilmesi planlanan `mfe-security`, `mfe-access` ve `mfe-audit` modülleri için kullanıcı araştırması varsayımlarını, hedef personayı, kritik kullanıcı görevlerini ve beklenen ekran akışlarını sunar. Bu bir başlangıç taslağıdır; proje ilerledikçe gerçek kullanıcı görüşmeleri ve analitik verilerle güncellenmelidir.

## 1. Yöntem ve Varsayımlar
- **Ön Araştırma:** Destek ekibi ve güvenlik operasyonlarıyla yapılan 1:1 görüşmeler, mevcut destek taleplerinin analizi, roadmap notları.
- **Eksikler:** Ölçümlenmiş veri ve kullanıcı testleri yapılmadı; burada yer alan persona ve akışlar doğrulama bekler.
- **Güncelleme Döngüsü:** Her sprint başlangıcında güncelleyin; kullanıcı testlerinden çıkan bulguları ekleyin.

## 2. Ortak Personalar
- **Güvenlik Yöneticisi (Security Admin):** MFA politikaları, session süreleri, servis token yönetimi, KV secret’ları takip eder.
- **Erişim Yöneticisi (Access Manager):** Rol tanımları, izin matrisleri, modül erişim seviyelerini yönetir, toplu değişiklik yapar.
- **Denetçi / Uyum Ekibi (Auditor):** Sistem üzerinde yapılan kritik değişiklikleri takip eder, raporlar oluşturur, dış denetimlere hazırlık yapar.
- **Destek Uzmanı:** Audit kaydına hızlıca ulaşp kullanıcının ne yaptığını görmek ister, gerektiğinde izin güncellemesi yapar.

## 3. `mfe-security`

### 3.1 Kullanıcı İhtiyaçları
- MFA zorunluluk politikasını kullanıcı gruplarına göre tanımlayabilme.
- Session timeout süresini değiştirme, belirli rollere özel kurallar tanımlama.
- API anahtarlarını listeleme, iptal etme, yenisini üretme ve aktivitelerini izleme.
- Servis token politikalarını gözden geçirme (örn. expiration, izin setleri).

### 3.2 Ana Akışlar
1. **Politika Görüntüleme:** Dashboard → mevcut MFA/session politikaları kartlar halinde.
2. **Politika Güncelleme:** Kart üzerindeki “Düzenle” → form (dropdown, slider) → onay modal → backend’e PATCH/PUT.
3. **API Anahtarı Yönetimi:** Liste tablosu → bir anahtarı seçme → detay panelinde izin seti + son kullanım → “İptal” veya “Yenile” aksiyonları.
4. **Servis Token İzleme:** Token listesi + yetkili servisler → kritik değişiklikler audit log’a yazılır → `mfe-audit` bağlantısı.

### 3.3 UI Taslakları
- Başlangıç: 3 kart + 1 tablo (Ant Design `Card`, `Table`).
- Politika düzenleme için drawer/modal. Değişiklik onayı için iki adımlı doğrulama.
- Gerçek zamanlı uyarılar için banner veya notification (gerekiyorsa websocket desteği).

### 3.4 Gelecek Araştırma Soruları
- Kullanıcılar politika değişikliklerinin etkilerini nasıl takip etmek istiyor?
- MFA zorunluluğu hangi kullanıcı segmentleri için farklılaşmalı?
- API anahtarı işlemleri sırasında ikincil onaya ihtiyaç var mı?

## 4. `mfe-access`

### 4.1 Kullanıcı İhtiyaçları
- Roller ve izin setlerini hızlıca görmek, düzenlemek, klonlamak.
- Modül bazında erişim seviyelerini toplu olarak atayabilmek (ör. VIEW/EDIT/MANAGE).
- Erişim değişikliklerinin kim tarafından ne zaman yapıldığını kayıt altına almak.
- Rol başına şablon veya policy dosyası dışa aktarımı (CSV/JSON).

### 4.2 Ana Akışlar
1. **Rol İncelemesi:** Rol listesi (AG Grid) → seçilen rol için yan panelde izinler.
2. **Erişim Düzenleme:** Modül/izin matrisi (grid) → checkbox/switch ile seviyeleri güncelleme → toplu kaydetme.
3. **Rol Klonlama:** Rol seç → “Klonla” aksiyonu → yeni ad + varsayılan izinlerle oluşsun → düzenleme akışına yönlendir.
4. **İçeri/Dışarı Aktarım:** Toolbarda import/export butonları → JSON/CSV şablonları.

### 4.3 UI Taslakları
- Sol tarafta rol seçicisi, sağda modül erişim matrisi (AG Grid dynamic columns).
- Toolbar’da filtreler (departman, rol tipi), varyant yönetimi (grid varyant reuse).
- Onay gerektiren değişiklikler için `Steps` bileşeni veya modal + özet ekran.

### 4.4 Gelecek Araştırma Soruları
- Kullanıcılar sık yaptığı erişim değişikliği kombinasyonlarını kaydetmek istiyor mu?
- Policy şablonlarının versiyonlanması gerek mi?
- Büyük ekiplerde arama ve filtre ihtiyaçları (500+ rol) nasıl optimize edilmeli?

## 5. `mfe-audit`

### 5.1 Kullanıcı İhtiyaçları
- Tüm güvenlik ve erişim değişikliklerini tek ekranda görebilmek.
- Tarih, kullanıcı, servis, event tipi gibi filtrelerle arama yapabilmek.
- Bir olayın detayına inip önce/sonra değerlerini ve ilişkili kayıtları görebilmek.
- Raporları dışa aktarabilmek ve gerektiğinde soruşturmalara kanıt sağlayabilmek.

### 5.2 Ana Akışlar
1. **Event Listeleme:** Varsayılan olarak son 24 saatlik event’ler (tablo/list, infinite scroll).
2. **Filtreleme:** Tarih aralığı, kullanıcı e-postası, event seviyesi (INFO/WARN/CRITICAL), kaynak servis.
3. **Detay İncelemesi:** Satıra tıklayınca modal ya da drawer → payload öncesi/sonrası, ilişkili kullanıcı, IP bilgisi.
4. **Raporlama:** Seçilen aralıkta CSV/JSON export. Gelecekte plan: PDF rapor şablonu.
5. **Gerçek Zamanlı İzleme (opsiyonel):** Canlı akış sekmesi (websocket/SSE) → kritik olayları anında gösterir.

### 5.3 UI Taslakları
- Üstte özet kartları (toplam kritik event, aktif kullanıcı sayısı), altta event stream.
- Filtre bar sabit, sonuçlar scrollable. Event detayında timeline veya diff görünümü.
- Kritik event’ler için renk vurgusu ve ikonlar (`AntdTag`, `Badge`).

### 5.4 Gelecek Araştırma Soruları
- Hangi olay türleri için anlık bildirim gerekli?
- Dış denetim ekipleri raporları hangi formatta istiyor?
- Event’lerin birbirine bağlanabilmesi (ör. aynı kullanıcıya ait zincir) gerekli mi?

## 6. Entegrasyon Notları
- Tüm modüller shell’in auth context’ini kullanacak; izin anahtarları: `PERMISSIONS.SECURITY_MODULE`, `PERMISSIONS.ACCESS_MODULE`, `PERMISSIONS.AUDIT_MODULE` (öneri).
- `mfe-access` ve `mfe-security` üzerinden yapılan değişiklikler audit event’lerine yazılmalı; `mfe-audit` bunları tüketmeli.
- UX seviyesinde cross-link’ler: ör. `mfe-access`’te bir değişiklik yapıldıktan sonra ilgili audit kaydına “Göster” bağlantısı.
- Backend endpoint’leri tamamlandıkça form ve tablo bileşenleri için mock veri setleri hazırlanmalı; UI geliştirme aşamasında storybook benzeri katalog kullanılabilir.

## 7. Teslim Öncelikleri ve UX Gereksinimleri
1. **Access (roller & policy yönetimi)**
   - İlk MVP bu modül olacak; rol matrisi ve policy kurguları diğer modüllerin temelini oluşturuyor.
   - AG Grid için server-side row model + lazy loading zorunlu. Permission-service sorguları sayfalı/pivot’lu çalışacak şekilde hazırlanmalı.
   - Değişiklik sonrası “Audit kaydını gör” bağlantısı göstermek şart; kullanıcılar yapılan işlemin izini hemen takip edebilmeli.
   - Mobilde matris düzenlemesi pratik olmayacağından, responsive görünüm read-only tablo + CSV export sunmalı.
2. **Security (MFA / API key / gateway metrikleri)**
   - API key oluşturma/iptal akışında gerçek zamanlı olarak audit bağlantısı gösterin.
   - Inline toast yerine shell üstünde “notification center” kullanarak sonuç mesajlarını oraya düşürün; kullanıcı önceki işlemlerin bildirimlerini takip edebilsin.
3. **Audit (event feed)**
   - Büyük liste ve timeline yapısı için AG Grid veya sanallaştırılmış liste server-side lazy load ile kurulmalı.
   - Tüm modüllerden gelen “audit log link” tıklamalarını destekleyip ilgili event’i doğrudan vurgulayan anchor sunmalı.

### Evrensel UX Gereksinimleri
- Tüm tablo/listelerde birincil grid çözümü **AG Grid** olacak; başka kütüphaneye geçmeden önce UX/UI lideri onayı alın. Grid varyant altyapısı, server-side row model, lazy loading ve erişilebilirlik ayarları her modül için aynı şekilde uygulanacak.
- Ant Design bileşenlerine (Form, Drawer, Modal, Table) manuel `aria-label`, `aria-describedby`, `role` atayın; klavye odağını işlemden sonra ilgili elemana geri verin.
- Telemetry planı: her ana görev (rol atama, MFA güncelleme, audit export) için event isimlerini baştan belirleyin; görev süresi, hata oranı ve feature kullanımları izlenebilsin.
- Bildirim merkezi için shell store’da queue mantığı kurulmalı; MFE’ler başarı/hata durumlarını ortak API ile iletsin.
- Sayfa düzeni yalın ve tutarlı olmalı: üstte başlık/breadcrumb, altında filtre & varyant toolbar, merkezde AG Grid, sağda detay drawer. Formlar iki kolonlu grid (mobilde tek sütun) ve aynı aksiyon butonu yerleşimini paylaşmalı.
- Değişiklik sonrası audit bağlantısı hem satır detayında hem notification center mesajında gösterilmeli; kullanıcı sonra da erişebilsin.
- Filtre ve varyantlar yeniden kullanılabilir olmalı; access/security/audit sayfaları aynı toolbar bileşenlerini paylaşmalı.

## 7. Harici Yönetim Araçları ve Shell İçindeki Yönlendirmeler

| Bileşen | Yerleşik Yönetim Aracı | MFE’de Nasıl Kullanılacak? |
| --- | --- | --- |
| **Vault** | Vault Web UI (`https://<vault-host>/ui`), CLI | `mfe-security` kritik secret/policy özetlerini gösterir ve “Detaya Git” bağlantısıyla Vault UI’de ilgili path’i açar. DB secrets rotasyon durumları aynı ekranda izlenir. |
| **Keycloak** | Keycloak Admin Console | `mfe-security` MFA/realm-mapping aksiyonlarını basitleştirilmiş formlarla sunar; ileri düzey ayarlar için “Keycloak’ta aç” bağlantısı. |
| **OPA** | Styra DAS (veya seçilen policy yönetim aracı) | `mfe-access` policy snapshot’larını ve test sonuçlarını gösterir; policy düzenlemesi için Styra/OPA IDE linki verilir. |
| **Gateway** | Grafana / Kibana panoları, Spring Actuator | `mfe-security` gateway health ve rate-limit metriklerini özetler; detay metrikler için Grafana/Kibana dashboard linkleri kullanılır. |
| **DB Secrets** | Vault UI & API | `mfe-security` secret rotasyon tarihlerini görüntüler; secret içeriği gerekirse Vault UI’de açılır. |

> Not: Bu linklerin görünürlüğü yetki bazlı olacak. Her MFE sadece ilgili rol izinlerine sahip kullanıcıya harici araca yönlendirme gösterecek. Böylece kritik panellerin URL’leri kontrolsüz paylaşılmamış olur.

## 8. Araştırma Planı
| Sprint | Aktivite | Çıktı |
| --- | --- | --- |
| Sprint 0 | Paydaş workshop (Security, IT Ops, Destek) | Persona doğrulaması |
| Sprint 1 | Düşük sadakat wireframe + ekip içi inceleme | Wireframe seti, geri bildirim listesi |
| Sprint 2 | Prototip usability testi (5 katılımcı) | Görev tamamlama oranı, pain point listesi |
| Sprint 3+ | MVP geliştirme & telemetry instrumentation | Ürün içi event dashboard, Csat sorusu |

## 9. Açık Noktalar
- Veriye dayalı kararlar için audit event şeması ve telemetry planı finalize edilmeli.
- MFA ve API key yönetimi için backend’de hangi detayların döneceği netleştirilmeli (örn. maskelenmiş secret gösterimi).
- `mfe-access`’te modül/izin matrisi mobil veya dar ekranlarda nasıl davranacak? Tasarım kararı gerekiyor.
- Tüm modüller için erişilebilirlik (A11Y) kriterleri gözden geçirilmeli (klavye navigasyonu, kontrast, ekran okuyucu etiketleri).
