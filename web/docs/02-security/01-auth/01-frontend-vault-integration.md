# Frontend Vault Entegrasyon Planı

Amaç: Frontend build/deploy pipeline’ının secret rotasyon stratejisiyle uyumlu hale getirilmesi, CI’da plaintext secret tutulmaması.

## 1. Mevcut Durum
- `.env.example` varsayılanları: `JWT_SECRET`, `INTERNAL_API_KEY`, `POSTGRES_*`, vb. 
- Frontend build (Varsayım: `mfe-users` ya da benzer mikro-frontend) CI sırasında `.env` dosyasından değerleri alıyor.
- Backend’de `INTERNAL_API_KEY` kaldırıldığı için sadece public JWKS URL ve API endpointleri gerek.

## 2. Uygulama Adımları
1. **Vault Path Oluşturma**  
   ```bash
   vault kv put secret/staging/frontend/config \
     apiBaseUrl="https://api.staging.corp" \
     jwksUrl="https://auth.staging.corp/oauth2/jwks"
   ```
   Prod ortam için benzer komutu uygun değerlerle çalıştırın.
2. **CI Secret Tanımı**  
   - `VAULT_ADDR`, `VAULT_TOKEN`, `ENV` (staging/prod) CI Secret Manager’a eklenir.
3. **Build Pipeline Güncellemesi**  
   - Checkout sonrasında Vault’tan config çekip `.env.production` oluşturun.
   - Build bitince `.env.production` dosyasını silin.
4. **Security Tarama**  
   - `gitleaks` veya eşdeğeri pipeline adımıyla secret taraması yapın.
5. **Staging Smoke Testi**  
   - Deploy sonrası frontend’in doğru base URL ve JWKS URL ile çalıştığını doğrulayın.

## 3. Hedef Mimari
- Frontend build sırasında secret kullanılmaz; yalnızca public config (`REACT_APP_API_BASE`, `REACT_APP_JWKS_URL`).
- Hassas değerler (ör. `JWT_SECRET`) frontend’e dağıtılmayacak; doğrulama backend/gateway’de kalır.
- Deployment pipeline environment’ı Vault’tan sadece ihtiyaç olan public/readonly configleri çeker (`vault kv get secret/${ENV}/frontend/config`).

## 4. Vault Mapping
1. Vault path: `secret/{env}/frontend/config`  
   - `apiBaseUrl` (örn. `https://api.${ENV}.corp`).  
   - `jwksUrl` (`https://auth.${ENV}.corp/oauth2/jwks`).  
2. CI job: `vault kv get -format=json secret/${ENV}/frontend/config` → `.env.production` oluştur.
3. Git repo `.env.example` → yalnız placeholder (secret yok).

## 5. Pipeline Adımları
1. **Pre-build job** (GitHub Actions örneği):
   ```yaml
   - name: Fetch frontend config
     run: |
       CONFIG=$(vault kv get -format=json secret/${ENV}/frontend/config)
       echo "REACT_APP_API_BASE=$(echo $CONFIG | jq -r '.data.data.apiBaseUrl')" >> .env.production
       echo "REACT_APP_JWKS_URL=$(echo $CONFIG | jq -r '.data.data.jwksUrl')" >> .env.production
     env:
       VAULT_ADDR: ${{ secrets.VAULT_ADDR }}
       VAULT_TOKEN: ${{ secrets.VAULT_TOKEN }}
   ```
2. Build step `yarn build` `--env-file .env.production` (CRA veya Vite).  
3. Build sonrası cleanup: `rm -f .env.production` (veya kullanılan geçici dosya).  
4. Deployment: static asset publish; `.env.production` CI artefact’larına eklenmez.

## 6. Rotasyon Uyumu
- Backend rotasyon pipeline yeni JWKS `kid` çıktığında frontend config path yalnızca URL içerdiği için güncelleme gerekmez.  
- API base URL değişirse rotasyon script’i `vault kv patch secret/${ENV}/frontend/config apiBaseUrl=new` ile günceller; build pipeline otomatik alır.

## 7. Security Kontrolleri
- CI script: `.env.production` dosyası build sonrası siliniyor (`rm`).  
- `gitleaks` veya benzeri tarama pipeline’da `.env.production` check.  
  ```yaml
  - name: Secret scan
    run: gitleaks detect --no-banner
  ```
- Frontend repo’da `JWT_SECRET` gibi değişkenler artık kullanılmıyor; PR lint.

### Lokal Geliştirme Notu
- Docker compose varsayılanı `SPRING_CLOUD_VAULT_ENABLED=false` tutar. Vault’lu senaryoyu test etmek için compose çalıştırmadan önce:  
  ```bash
  export SPRING_CLOUD_VAULT_ENABLED=true
  export VAULT_ADDR=https://vault.local:8200
  export SPRING_CLOUD_VAULT_TOKEN=<local-dev-token>
  ```
  şeklinde env değişkenlerini set ederek `docker compose up` komutunu çalıştırın.

## 8. Checklist
- [ ] `secret/{env}/frontend/config` path oluşturuldu ve değerler yazıldı.
- [ ] CI pipeline Vault’dan config çekiyor ve `.env.production` oluşturuyor.
- [ ] Build arkasından `.env.production` temizleniyor.  
- [ ] Frontend config rota dökümana (Confluence) linklendi.
- [ ] Security taramalar (gitleaks) secret bulunmadığını doğruluyor.
- [ ] Staging smoke test: yeni config ile frontend API çağrıları çalışıyor.
- [ ] Prod’e geçiş öncesi onay/imza alındı.

---
**Next:** Frontend’de JWKS cache/misconfig testleri (API gateway logları) ve kullanıcı token rotasyon senaryoları.
