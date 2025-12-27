# PB-0005 – Uygunsuzluk (NC) & CAPA Yönetimi

ID: PB-0005  
Status: Draft  
Owner: TBD

-------------------------------------------------------------------------------
1. AMAÇ
-------------------------------------------------------------------------------

NC kayıtları dağınık olduğunda tekrar eden hatalar görünmez, aksiyonlar kapanmaz ve kalite maliyeti artar.
Bu PB, NC → RCA → CAPA döngüsünün neden “tek zincirde” işletilmesi gerektiğini tanımlar.

-------------------------------------------------------------------------------
2. KAPSAM
-------------------------------------------------------------------------------

Dahil:
- NC intake (kayıt) + sınıflandırma + öncelik.
- RCA (kök neden) çıktısı ve CAPA aksiyon takibi.
- Kanıt/ek yönetimi ve denetim izi beklentisi.
- Trend raporlama (tekrar eden uygunsuzluklar).

Hariç:
- ERP/finans entegrasyonları.
- Otomatik karar verme (insansız kapanış).

-------------------------------------------------------------------------------
3. SORUN TANIMI
-------------------------------------------------------------------------------

Mevcut durum:
- NC kayıtları farklı kanallarda (Excel/e-posta/manuel) dağınık ve kapanış takibi zayıf.

Belirtiler:
- CAPA aksiyonları gecikir veya kapanmaz; tekrar oranı görünmez olur.
- Denetim sırasında “kim, neyi, ne zaman değiştirdi?” sorusu net cevaplanamaz.

Kimler etkileniyor?
- Saha/operasyon: hızlı kayıt ve kapanış ihtiyacı.
- Kalite/uyum: denetim izi, kapanış disiplini, trend analizi.

-------------------------------------------------------------------------------
4. HEDEF VE BAŞARI KRİTERLERİ
-------------------------------------------------------------------------------

- NC → RCA → CAPA döngüsü izlenebilir ve ölçülebilir olur.
- SLA breach ve kapanış kalitesi takip edilir.
- Tekrar eden uygunsuzluk oranı düşer (trend raporlama ile).

-------------------------------------------------------------------------------
5. VARSAYIMLAR / RİSKLER
-------------------------------------------------------------------------------

Varsayımlar:
- NC kayıtları için en az bir giriş yolu (web/mobil/manuel) vardır.

Riskler:
- Veri kalitesi (duplicate kayıtlar, hatalı sınıflandırma) trend raporlarını bozabilir.
- Platform capability reuse ihlal edilirse (custom attachment/audit), bakım maliyeti artar.

-------------------------------------------------------------------------------
6. ÖZET
-------------------------------------------------------------------------------

- NC & CAPA, “kayıt aç/kapat” değil; tekrar eden hataları azaltan bir iyileştirme döngüsüdür.
- Başarı, kapanış disiplini + audit izi + trend raporlama ile ölçülür.

-------------------------------------------------------------------------------
7. LİNKLER / SONRAKİ ADIMLAR
-------------------------------------------------------------------------------

- PRD: `docs/01-product/PRD/PRD-0005-nc-capa-management-mvp.md`
- Platform Spec: `docs/03-delivery/SPECS/SPEC-0014-platform-capabilities-catalog-v1.md`
