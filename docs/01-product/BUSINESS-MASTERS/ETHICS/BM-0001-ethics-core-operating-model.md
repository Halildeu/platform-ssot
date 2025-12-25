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
- Anonim bildirim kabul edilecek mi?
- İki yönlü güvenli iletişim (case mailbox) olacak mı?
- Hangi vaka tipleri etik sisteminde kalır, hangileri yönlendirilir? (etik/İK/InfoSec/Finans vb.)
- Komite karar şablonu standart mı olacak?

## Guardrail’ler
- Çıkar çatışması olan kişi vakaya erişemez / atanamaz.
- “Need-to-know” prensibi: yalnız gereken kadar görünürlük.
- Kapanış “kapandı” değil: kalite kontrol zorunlu.

## Varsayımlar
- Etik komite/karar mekanizması mevcut veya kurulacak.
- En az bir güvenli kanal (web/telefon) işletilecek.

## Doğrulama Planı
- 4 haftalık pilot (1 lokasyon): triage kalitesi + SLA + erişim sınırları
- 10 senaryolu COI testi: yanlış atama/erişim denemeleri

## Top 10 Sürpriz Önleyici
- Yanlış atama (COI) → bağımsız atama + kontrol
- Gizlilik ihlali → erişim sınırları + görüntüleme logu
- “Kapatmış gibi” kapanış → kalite kontrol
- Misilleme görünmezliği → kapanış sonrası check-in
- Aşırı anonim suistimal → triage filtresi + trend analizi
