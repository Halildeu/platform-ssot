# BM-0001: Etik Programı — Controls (Güven, Tarafsızlık, Koruma) (v0.1)

## Amaç
Programın güvenilirliğini belirleyen kontrol mekanizmalarını tanımlamak.

## Gizlilik ve Anonimlik
### Karar Noktaları
- Anonim bildirimi kabul ediyor muyuz?
- Gizli kimlik yönetimi nasıl? (kimler görebilir, hangi şartta)

### Guardrail
- Kimlik bilgisi “varsayılan gizli”; yalnız rol bazlı ve gerekçeli erişim.
- Anonim vakalarda güvenli iki yönlü iletişim (case mailbox) varsa, kimlik açığa çıkarmadan konuşma sürer.

## Çıkar Çatışması (COI)
### Karar
- COI kontrolü zorunlu (evet).
### Guardrail
- COI sinyali varsa otomatik erişim engeli + bağımsız yeniden atama.
- Komite üyeleri dahil “ilgili kişi” erişemez.

## Delil ve Denetim İzi (Audit)
### Guardrail
- Delil/ekler silinmez; yeni sürüm eklenir (immutability beklentisi).
- Kim, neyi, ne zaman görüntüledi/değiştirdi kayıt altındadır.

## Misilleme Koruması
### İşletim
- Kapanış sonrası 30/60/90 gün kontrol (risk bazlı)
- Misilleme iddiası ayrı vaka tipi olarak açılır

## Veri Yaşam Döngüsü (business seviyede)
- Saklama süreleri (retention) ve legal hold yaklaşımı tanımlanır.
- PII maskeleme/redaksiyon ihtiyacı değerlendirilir (özellikle raporlama ve eğitim çıktılarında).

## Varsayımlar
- KVKK/yerel mevzuat çerçevesi netleştirilecek.
## Doğrulama
- Pilot sırasında “erişim testi” ve “audit log kontrolü” yapılacak.
