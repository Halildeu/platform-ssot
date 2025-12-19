# AC-0050 – PR Bot Automation v0.1 Acceptance

ID: AC-0050  
Story: STORY-0050-pr-bot-automation-v0-1  
Status: Planned  
Owner: @team/ops

## 1. AMAÇ

- PR bot otomasyonunun (PR create + comment upsert + draft policy) test edilebilir kabul kriterlerini tanımlamak.

## 2. KAPSAM

- Trigger: push (branches: `fix/**`, `wip/**`) ve `workflow_dispatch`
- PR davranışı: yoksa oluştur, varsa tekrar kullan
- Yorum davranışı: marker comment upsert (duplicate üretmez)
- Güvenlik: primary `GITHUB_TOKEN`, opsiyonel `GH_PR_BOT_TOKEN` fallback

## 3. GIVEN / WHEN / THEN SENARYOLARI

### GitHub Actions / PR Create

- [ ] Given: `fix/**` branch’ine push yapılır.  
      When: PR bot workflow çalışır.  
      Then: `main` hedefli PR yoksa oluşturulur; varsa mevcut PR bulunur ve reuse edilir.

- [ ] Given: Repo/org policy `GITHUB_TOKEN` ile PR create’a izin vermez (403).  
      When: `GH_PR_BOT_TOKEN` sağlanmıştır.  
      Then: Bot fallback token ile PR create/comment işlemlerini tamamlar.

### Comment Upsert (Idempotent)

- [ ] Given: PR üzerinde `<!-- pr-bot:rules -->` marker comment’i yoktur.  
      When: Bot rule template’ini uygular.  
      Then: Marker içeren tek bir comment oluşturulur.

- [ ] Given: PR üzerinde marker comment’i vardır.  
      When: Bot aynı branch için tekrar çalışır.  
      Then: Aynı comment update edilir; yeni duplicate comment oluşmaz.

### Draft Policy (wip/**)

- [ ] Given: `wip/**` branch’ine push yapılır.  
      When: Bot PR’ı oluşturur veya mevcut PR’ı bulur.  
      Then: PR draft olur (mümkün değilse en azından comment upsert çalışır ve “draft best-effort” notu görülür).

## 4. NOTLAR / KISITLAR

- PR oluşturma/yorum yazma izinleri repo “Workflow permissions” ayarları ve org policy ile kısıtlanabilir.
- Draft’a çevirme GraphQL mutation ile best-effort yapılır; permission yoksa bot fail etmeyebilir (tasarım kararı).

## 5. ÖZET

- PR create + marker comment upsert + (wip) draft policy senaryoları test edilebilir şekilde tanımlıdır.

## 6. LİNKLER (İSTEĞE BAĞLI)

- Story: `docs/03-delivery/STORIES/STORY-0050-pr-bot-automation-v0-1.md`  
- Test Plan: `docs/03-delivery/TEST-PLANS/TP-0050-pr-bot-automation-v0-1.md`

