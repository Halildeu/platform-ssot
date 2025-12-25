# BENCH-0002: Fleet Operations Management — Trendler, Boşluklar, AI Yapılabilirlik (v0.1)

## Amaç
Sektör trendlerini, tipik boşlukları ve AI’nin “asistan rolü” olarak nerede değer üretebileceğini çıkarmak.

## Trendler (Kısa Liste)
- “Araç listesi” → “uyum + maliyet + süreklilik” odaklı operasyon yönetimi
- Elektrifikasyon ile yeni KPI’lar (şarj, batarya sağlığı, enerji maliyeti)
- Telematics + tüketim/anomali gözlemi (yakıt/rota/odometre)
- Doküman otomasyonu (OCR) ve denetim izi beklentisinin artması

## Tipik Boşluklar
- Kimlik/duplicasyon: VIN/plaka belirsizliği ve history yönetiminin zayıflığı
- Takvim semantiği: timezone/iş günü/hatırlatma kurallarının tutarsız olması
- Doküman disiplini: sigorta/muayene dokümanlarının sürümsüz ve izsiz kalması
- Yakıt verisi kalitesi: manuel giriş, reconcile eksikliği ve fraud sinyalinin olmaması
- Ceza yönetimi: doğrulama/itiraz sürecinin dağınık olması

## AI Yapılabilirlik (Asistan Rolü)
### Uygun
- Doküman OCR: sigorta poliçesi / muayene raporu alanlarını çıkarma (kontrollü)
- Anomali tespiti: yakıt tüketim spike ve tutarsız odometre sinyali
- Özetleme: bakım/ceza kayıtlarının kısa özetlenmesi (policy ile)

### Riskli / Yasak
- İnsan onayı olmadan ceza/itiraz kararı üretimi
- PII içeren serbest metin üretimi veya rapor dışa aktarımı

## Guardrail Önerileri (Minimum)
- Human-in-the-loop: karar/aksiyon otomasyonu yok; yalnız öneri.
- Audit: AI önerileri ve kullanılan veri sınıfları loglanır.
- Redaksiyon: PII maskeleme; policy allowlist dışında veri AI’ye gitmez.

