# BM-0001: Etik Programı — Core İşletim Modeli (v0.1)

## Kuzey Yıldızı
Etik bildirim sistemi “şikâyet kutusu” değil; kurum içi güvenin işletim sistemidir.

## Amaç
Güvenli bildirim → tarafsız ele alma → koruma → ölçülebilir iyileştirme döngüsünü işletmek.

## Kapsam
- Bildirim alımı (çok kanallı)
- Triage (sınıflandırma + öncelik + yönlendirme)
- İnceleme/soruşturma (delil, görev, zaman çizelgesi)
- Karar + aksiyon + kapanış
- Misilleme koruma
- Sürekli iyileştirme (trend → politika/kontrol iyileştirme)

## Kapsam Dışı (v0.1)
- Otomatik “yargılama/ceza önerisi”
- İnsan onayı olmadan karar üretimi

## İşletim Akışı
1) Intake
2) Triage
3) İnceleme
4) Karar & Aksiyon
5) Kapanış Kalite Kontrolü
6) Misilleme Koruma Takibi
7) Öğrenme & İyileştirme

## Karar Noktaları (E/H + Gerekçe)
- BM-0001-CORE-DEC-001: Anonim bildirim kabul edilecek mi?
- BM-0001-CORE-DEC-002: İki yönlü güvenli iletişim (case mailbox) olacak mı?
- BM-0001-CORE-DEC-003: Hangi vaka tipleri etik sisteminde kalır, hangileri yönlendirilir? (etik/İK/InfoSec/Finans vb.)
- BM-0001-CORE-DEC-004: Komite karar şablonu standart mı olacak?

## Guardrail’ler
- BM-0001-CORE-GRD-001: Çıkar çatışması olan kişi vakaya erişemez / atanamaz.
- BM-0001-CORE-GRD-002: Need-to-know prensibi: yalnız gereken kadar görünürlük.
- BM-0001-CORE-GRD-003: Kapanış “kapandı” değil: kalite kontrol zorunlu.

## Varsayımlar
- BM-0001-CORE-ASM-001: Etik komite/karar mekanizması mevcut veya kurulacak.
- BM-0001-CORE-ASM-002: En az bir güvenli kanal (web/telefon) işletilecek.

## Doğrulama Planı
- BM-0001-CORE-VAL-001: 4 haftalık pilot (1 lokasyon): triage kalitesi + SLA + erişim sınırları
- BM-0001-CORE-VAL-002: 10 senaryolu COI testi: yanlış atama/erişim denemeleri

## Top 10 Sürpriz Önleyici
- BM-0001-CORE-RSK-001: Yanlış atama (COI) → bağımsız atama + kontrol
- BM-0001-CORE-RSK-002: Gizlilik ihlali → erişim sınırları + görüntüleme logu
- BM-0001-CORE-RSK-003: “Kapatmış gibi” kapanış → kalite kontrol
- BM-0001-CORE-RSK-004: Misilleme görünmezliği → kapanış sonrası check-in
- BM-0001-CORE-RSK-005: Aşırı anonim suistimal → triage filtresi + trend analizi
