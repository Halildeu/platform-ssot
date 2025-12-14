---
title: "Module Federation — Paylaşım Kontrolü"
status: published
owner: "@team/platform-fe"
last_review: 2025-11-08
tags: ["frontend", "module-federation", "routing", "checklist"]
---

# MF Paylaşım Kontrol Script’i

Amaç: `web/apps` altında MF shared ayarlarının (react/react-dom/react-router/react-router-dom → singleton) ve remote’larda Router sarması olmadığının hızlı kontrolü.

Çalıştırma

- Repo kökünde (backend/) iken:
  - `chmod +x scripts/check-mf.sh`
  - `./scripts/check-mf.sh ../web`

Ne Kontrol Edilir

- Shared blokları: `react`, `react-dom`, `react-router`, `react-router-dom` için `singleton: true` (dev/prod webpack*.js)
- Remote’larda `BrowserRouter`/`MemoryRouter` kullanılmaması (Router host/shell’den gelir)
- Shell (dev) içinde `remotes` alanının varlığı

Çıktı Örneği

```
[check-mf] Frontend root: ../web
[OK]   mfe-shell: shared blokları (...)
[OK]   mfe-users: shared blokları (...)
[OK]   mfe-users: Remote içinde Router sarması yok
[OK]   mfe-shell: remotes tanımlı (dev)
[check-mf] Tamamlandı. PASS=7 FAIL=0
```

Başarısızlık durumunda: ilgili webpack config veya kaynak dosyada düzeltme yapın; tekrar script’i çalıştırın.
