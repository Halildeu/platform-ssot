# Mevcut Mikro-Frontend UX Araştırma Özeti

Bu doküman, hâlihazırda çalışan mikro-frontend’ler (`mfe-shell`, `mfe-users`, `mfe-suggestions`, `mfe-ethic`) için kullanıcı araştırma notlarını, ana personayı ve etkileşim akışlarını özetler. Amaç, yeni özellik geliştirmelerinde aynı kullanıcı ihtiyaçlarını gözetip tutarlı bir deneyim sunmaktır.

## 1. Araştırma Yöntemi
- **Kaynaklar:** Ürün ekibi görüşmeleri, destek talepleri, mevcut kullanım istatistikleri, geliştirici geri bildirimleri.
- **Teknik Limitler:** Şu an kullanım telemetrisi ve olay izleme sınırlı; bu nedenle nitel veri (görüşme, destek kaydı) ağır basıyor. Gelecekte `mfe-audit` ile event verisi zenginleşecek.
- **Paydaşlar:** İç operasyon ekipleri (destek & admin), ürün yöneticileri, geliştiriciler.

## 2. Kullanıcı Personaları

| Persona | Beklentiler | İlgilendiği MFE'ler |
| --- | --- | --- |
| **Destek Uzmanı** | Kullanıcı bulma, hesap yeniden etkinleştirme, şifre sıfırlama, izin kontrolü | `mfe-shell`, `mfe-users` |
| **Operasyon Yöneticisi** | Rol ve modül erişim düzeylerini yönetme, audit geçmişine erişim (gelecek) | `mfe-shell`, `mfe-users`, planlanan `mfe-access`, `mfe-audit` |
| **Satış/İş Birimi Yetkilisi** | Özelleştirilmiş veri görünümü, varyantlar, grid temaları | `mfe-users`, `mfe-ethic` (demo) |
| **Geliştirici/DevOps** | Sistem sağlığını ve hata noktalarını hızlıca görmek | `mfe-shell`, planlanan `mfe-security`, `mfe-audit` |

## 3. `mfe-shell` (Host Uygulama)
### 3.1 Araştırma Özeti
- Ana navigasyonun hızlı olması ve module launcher ile uygulamalar arası geçişin sorunsuz olması bekleniyor.
- Kullanıcılar giriş yaptıktan sonra hangi modüllere erişimleri olduğunu hemen anlamak istiyor.
- Tema/renk özelleştirmesi daha çok geliştirici ekibe hitap ediyor; default tema çoğu kullanıcı için yeterli.

### 3.2 Kullanım Akışları
1. **Giriş / Oturum:** Kullanıcı giriş ekranına yönlendirilir → kimlik doğrulama → shell header’da kullanıcı bilgisi ve izinli modüller görünür.
2. **Modüler Navigasyon:** Launcher veya üst menü üzerinden ilgili MFE’ye geçiş → lazy load sonrası route render edilir.
3. **Profil / Logout:** Header’daki kullanıcı menüsünden profil bilgisi (planlı) ve çıkış işlemleri yapılır.

### 3.3 UX Notları
- Login popover hızlı deneyim için olumlu, ancak kayıt/giriş formu validasyon mesajları sadeleştirilmeli.
- Tema değişiminin global etkisi anlaşılır şekilde vurgulanmalı (feedback mesajları).
- Geri bildirimlere göre shell menüsü izin bazlı dinamik olarak güncellenmeye devam etmeli.

## 4. `mfe-users` (Kullanıcı Yönetimi)
### 4.1 Araştırma Özeti
- Destek ekipleri için en kritik modül. Kullanıcı bulma, modül erişimlerini güncelleme, hesap durumu yönetimi günlük işler arasında.
- Filtreler ve grid varyantları sayesinde farklı ekipler kendi görünümünü kaydedebiliyor; bu özellik yoğun kullanılacak.
- Detay çekme, izin değişikliği gibi işlemler sırasında sistem geri bildirimleri ve hata mesajları çok önemli.

### 4.2 Kullanım Akışları
1. **Kullanıcı Listeleme:** Sayfa açılışında liste boş → “Kullanıcıları Yükle” butonu → TanStack Query ile veri → grid üzerinde filter/sorting.
2. **Kullanıcı Detayı:** Grid satırına tıklama → sağ panelde veya drawer’da kullanıcı bilgileri + modül izinleri.
3. **İzin Güncelleme:** Dropdown/menü üzerinden rol veya modül erişimi seçimi → API çağrısı → optimistic update → başarı/hata mesajı.
4. **Varyant Yönetimi:** Grid toolbar’dan varyant oluşturma/güncelleme → `variant-service` ile senkron.

### 4.3 UX Notları
- İlk yüklemede boş state açıklayıcı; buna ek olarak hızlı filtre önerileri (ör. “Son 24 saatte eklenenler”) planlanabilir.
- İzin değişikliğinde mevcut audit logu yok; planlanan `mfe-audit` ile bağlantı kurulmalı.
- Geniş veri setlerinde performansı korumak için kolon görünürlüğü ve sorgu parametreleri optimize edilmeli.

## 5. `mfe-suggestions` (Demo Modül)
### 5.1 Araştırma Özeti
- Şu an eğitim/demonstrasyon amaçlı. Paylaşılan sayaç ve öneri butonları ortak store kullanımını gösteriyor.
- Gerçek iş akışı olmadığı için kullanıcı beklentileri sınırlı; ileride öneri motoru entegre edilirse persona ve flow tekrar ele alınacak.

### 5.2 Kullanım Akışı
- Erişim → sayaç değerini görüntüleme → butonla artırma → shell store güncellemesi → diğer MFE’lerde değer güncellenir.

### 5.3 UX Notları
- Demo olduğu için minimal içerik, ancak UI kit’ten gelen buton kullanımı doğru.
- İleride gerçek bir modüle dönüşürse, öneri listesi + detay panel kombinasyonu düşünülmeli.

## 6. `mfe-ethic` (Demo Modül)
### 6.1 Araştırma Özeti
- Shell store’u azaltma örneği ve ürün listesi gösterimi mevcut. Demo kurgusu sayesinde geliştiriciler AG Grid’siz alternatif data listesi görebiliyor.
- Gerçek kullanıcı hedefi tanımlanmadı; “etik” modülü planlı ise süreç/senaryo çalışması yapılmalı.

### 6.2 Kullanım Akışı
- Modüle giriş → ürün listesini izleme → shell store üzerindeki sayaç değerini düşürme → shell state güncellenir.

### 6.3 UX Notları
- Bilgilendirme metinleri ile demo olduğunun belirtilmesi yeterli.
- Çift yönlü state paylaşımı net olduğu için eğitim materyali olarak kullanılabilir.

## 7. Sonraki Adımlar
- Kullanıcı görüşmeleri ve analitik verileri düzenli olarak toplayıp bu dokümanı güncelleyin (ör. her sprint sonunda).
- `mfe-users` için görev bazlı kullanılabilirlik testleri planlanmalı (kullanıcı bulma, izin güncelleme, varyant kaydetme).
- Demo modüller gerçek iş senaryolarına evrilirse, kullanıcı personası ve ihtiyaçları yeniden tanımlanmalıdır.
- `mfe-shell` menü düzeni ve tema değişim davranışı için A/B testi yapılması önerilir.

