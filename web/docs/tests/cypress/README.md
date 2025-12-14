Users Page SSRM Single-Fetch (Cypress)

Amaç: `mfe-users` ana kullanıcı listesi açılırken SSRM ilk blok için sadece 1 adet ağ çağrısı yapıldığını doğrulamak.

Dosya: `docs/frontend/tests/cypress/users-ssrm-single-fetch.cy.ts`

Kopyalama:
- Bu dosyayı frontend projenizde `cypress/e2e/users-ssrm-single-fetch.cy.ts` konumuna kopyalayın.

Önkoşullar:
- Shell dev sunucusu: `http://localhost:3000`
- Kullanıcı sayfası rotası: `/admin/users` (gerekirse spec’te URL’i değiştirin)
- MFE Users grid’i SSRM kullanıyor ve `/api/users/all` uç noktasını çağırıyor.

Çalıştırma:
- `npm run cypress:open` veya `npx cypress open` (proje ayarınıza göre)
- Testi seçip çalıştırın.

Beklenen:
- İlk yüklemede `GET **/api/users/all*` tek bir kez yakalanır.

Notlar:
- React 18 dev’de StrictMode açıksa bazı mount effect’leri iki kez tetiklenebilir. Bu durumda testteki `expect(calls.length).to.eq(1)` ifadesi hata verir. Prod build’te (veya StrictMode devre dışı) tek çağrıya iner.
- Alternatif: Dev ortamında toleranslı doğrulama istiyorsanız assertion’ı `<= 1` olacak şekilde değiştirebilirsiniz; fakat tek çağrıyı garanti etmek için prod doğrulaması önerilir.

## Manuel Smoke — Reporting CTA’ları

Amaç: Kullanıcı ve Access modüllerinden raporlara giden butonların doğru deep‑link’leri tetiklediğini gözle doğrulamak.

Adımlar:
1. Shell’i (localhost:3000) ayağa kaldır ve yetkili kullanıcı ile giriş yap.
2. `/admin/users` ekranında sağ üstteki “Kullanıcı Raporu” butonuna tıkla. URL `/admin/reports/users` altına yönlenmeli; seçim yaptıysan `?userId=...` query’si taşınmalı.
3. `/admin/access` ekranında yeni “Raporlar” butonuna bas; `/admin/reports/access` açılmalı ve seçili rol ID’si query parametresi olarak eklenmeli.
4. Rapor sekmeleri arasında dolaşıp guard’ın hâlâ çalıştığını (izin yoksa `/unauthorized`) manuel olarak teyit et.

Not: Bu smoke senaryosu UI üzerinden yapılır; otomasyona gerek duyulursa aynı akış Cypress ile de script’lenebilir.
