# AGENTS.md – Proje Genel Agent Talimatları

## 1. İş tipleri

- [BE]  → Backend endpoint / servis / job
- [WEB] → Web frontend ekran/bileşen
- [MOB] → Mobil frontend ekran/bileşen
- [AI]  → AI/ML model / servis / pipeline
- [DATA]→ SQL / rapor / ETL / pipeline
- [DOC] → Problem Brief / PRD / Tech Design / Story / Acceptance / Runbook

## 2. Temel okuma sırası

Her görevde önce:

1. AGENT-CODEX.core.md
2. docs/00-handbook/DOC-HIERARCHY.md (varsa)
3. docs/00-handbook/DEV-GUIDE.md (varsa)

Sonra iş tipine göre ilgili AGENT-CODEX.*.md ve layout/style dokümanları okunur.

### [BE] Backend işleri
- AGENT-CODEX.backend.md
- docs/00-handbook/BACKEND-PROJECT-LAYOUT.md
- docs/00-handbook/STYLE-BE-001.md
- docs/00-handbook/STYLE-API-001.md (API çıkışı varsa)

### [WEB] Web frontend işleri
- AGENT-CODEX.web.md
- docs/00-handbook/WEB-PROJECT-LAYOUT.md
- docs/00-handbook/STYLE-WEB-001.md

### [MOB] Mobil frontend işleri
- AGENT-CODEX.mobile.md
- docs/00-handbook/MOBILE-PROJECT-LAYOUT.md
- docs/00-handbook/STYLE-MOB-001.md

### [AI] AI/ML işleri
- AGENT-CODEX.ai.md
- docs/00-handbook/AI-PROJECT-LAYOUT.md
- docs/00-handbook/STYLE-AI-001.md
- docs/00-handbook/DATA-GOV-001.md (varsa)

### [DATA] Data / rapor işleri
- AGENT-CODEX.data.md
- docs/00-handbook/DATA-PROJECT-LAYOUT.md
- docs/00-handbook/STYLE-DATA-001.md
- docs/00-handbook/NAMING.md

### [DOC] Doküman işleri
- AGENT-CODEX.docs.md
- docs/00-handbook/STYLE-DOCS-001.md
- docs/99-templates/* (şablonlar varsa)

## 3. Varsayılan cevap formatı

Tüm teknik görevlerde:

- Keşif Özeti
- Tasarım
- Uygulama Adımları (sadece: dosya yolu + yapılacak değişiklik)

Sadece doküman işlerinde:

- Örneklerden Öğrenilenler
- Doküman Taslağı
- Uygulama Adımları
