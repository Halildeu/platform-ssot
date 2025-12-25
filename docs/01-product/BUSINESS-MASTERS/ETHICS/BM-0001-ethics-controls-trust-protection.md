# BM-0001: Etik Programı — Controls (Güven, Tarafsızlık, Koruma) (v0.1)

## Amaç
Programın güvenilirliğini belirleyen kontrol mekanizmalarını tanımlamak.

## Gizlilik ve Anonimlik
### Karar Noktaları
- BM-0001-CTRL-DEC-002: Anonim bildirimi kabul ediyor muyuz?
- BM-0001-CTRL-DEC-003: Gizli kimlik yönetimi nasıl? (kimler görebilir, hangi şartta)

### Guardrail
- BM-0001-CTRL-GRD-007: Kimlik bilgisi “varsayılan gizli”; yalnız rol bazlı ve gerekçeli erişim.
- BM-0001-CTRL-GRD-008: Anonim vakalarda güvenli iki yönlü iletişim (case mailbox) varsa, kimlik açığa çıkarmadan konuşma sürer.

## Çıkar Çatışması (COI)
### Karar
- BM-0001-CTRL-DEC-001: COI kontrolü zorunlu (evet).
### Guardrail
- BM-0001-CTRL-GRD-001: COI sinyali varsa otomatik erişim engeli + bağımsız yeniden atama.
- BM-0001-CTRL-GRD-002: Komite üyeleri dahil “ilgili kişi” erişemez.

## Delil ve Denetim İzi (Audit)
### Guardrail
- BM-0001-CTRL-GRD-003: Delil/ekler silinmez; yeni sürüm eklenir (immutability beklentisi).
- BM-0001-CTRL-GRD-004: Kim, neyi, ne zaman görüntüledi/değiştirdi kayıt altındadır.

## Misilleme Koruması
### İşletim
- BM-0001-CTRL-GRD-005: Kapanış sonrası 30/60/90 gün kontrol (risk bazlı)
- BM-0001-CTRL-GRD-006: Misilleme iddiası ayrı vaka tipi olarak açılır

## Veri Yaşam Döngüsü (business seviyede)
- Saklama süreleri (retention) ve legal hold yaklaşımı tanımlanır.
- PII maskeleme/redaksiyon ihtiyacı değerlendirilir (özellikle raporlama ve eğitim çıktılarında).

## Varsayımlar
- KVKK/yerel mevzuat çerçevesi netleştirilecek.
## Doğrulama
- Pilot sırasında “erişim testi” ve “audit log kontrolü” yapılacak.
