# AC-0101 – Login API Rate Limiting Acceptance

ID: AC-0101  
Story: STORY-0101-login-api-rate-limiting  
Status: Planned  
Owner: Halil K.

## 1. AMAÇ

- Login uçlarında rate limiting davranışını test edilebilir kriterlerle doğrulamak.

## 2. KAPSAM

- Login/refresh gibi kritik auth uçları.
- Limit aşımlarında hata zarfı, status code ve telemetry.

## 3. GIVEN / WHEN / THEN SENARYOLARI

- [ ] Senaryo 1 – Limit altında normal akış  
      Given: Limit konfigürasyonu aktiftir  
      When: Kullanıcı limit altında login olur  
      Then: 200/201 ve beklenen response döner, ek gecikme oluşmaz

- [ ] Senaryo 2 – Limit aşıldı  
      Given: Aynı kullanıcı/IP kısa sürede çok sayıda login denemesi yapar  
      When: Limit aşıldığında istek gönderilir  
      Then: 429 döner; hata zarfı standarda uyar; retry bilgisi sağlanır

- [ ] Senaryo 3 – İzlenebilirlik  
      Given: Telemetry/log aktif  
      When: Rate limit block olur  
      Then: Block sayısı/log kaydı görülebilir ve ayırt edilebilir

## 4. NOTLAR / KISITLAR

- Limit stratejisi (IP/user/device) değişebilir; bu acceptance “davranış”ı doğrular.

## 5. ÖZET

- Abuse senaryoları 429 ile kontrol edilir, normal login deneyimi korunur.

## 6. LİNKLER (İSTEĞE BAĞLI)

- Story: docs/03-delivery/STORIES/STORY-0101-login-api-rate-limiting.md  
- Test Plan: docs/03-delivery/TEST-PLANS/TP-0101-login-api-rate-limiting.md  
