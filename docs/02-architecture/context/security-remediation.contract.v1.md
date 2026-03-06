# Security Remediation Contract v1

- Amaç: backend security gate içinde bloklayıcı CVE'leri sıfırlamak ve yalnız gerekçeli residual MEDIUM bulguları zaman sınırlı kontrat ile taşımak.
- Son doğrulama: 2026-03-06

## Kapatılan dalga
- `mxparser` kritik zinciri direct `xstream 1.4.21` + transitif exclusion ile kapatıldı.
- `httpclient 4.5.3` medium bulgusu `4.5.14` override ile kapatıldı.
- `woodstox-core 6.2.1` high bulgusu `6.7.0` override ile kapatıldı.
- `commons-jxpath` optional transitif medium bulgusu starter seviyesinde exclusion ile kapatıldı.

## Residual risk
- Paket: `jackson-databind 2.15.4`
- CVE: `CVE-2023-35116`
- Seviye: `MEDIUM`
- Durum: `accepted-with-suppression`
- Gerekçe: NVD kaydı vendor notu ile birlikte geçerli dış saldırı modeli bulunmadığını söylüyor; Boot 3.2.x baseline'i 2.15.4 kullanıyor.
- Review tarihi: `2026-04-15`

## Başarı ölçütü
- Dependency-Check raporunda `HIGH/CRITICAL = 0`
- Residual medium yalnız kontratta listelenen suppression ile bulunabilir
- `python3 scripts/check_security_remediation_contract.py` geçmelidir
