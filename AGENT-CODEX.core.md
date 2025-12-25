# AGENT-CODEX.core – Çekirdek Kurallar

## 1. Genel

- Tüm açıklamalar Türkçe yazılmalıdır.
- Cevaplar mümkün olduğunca yapılandırılmış ve kısa olmalıdır.
- Her görev, [BE] / [WEB] / [MOB] / [AI] / [DATA] / [DOC] tiplerinden birine
  map edilmeye çalışılmalıdır.

## 2. Doküman öncelik sırası

1. Bu dosya (AGENT-CODEX.core.md)
2. AGENTS.md (iş tipi → doküman rotası)
3. docs/00-handbook/DOC-HIERARCHY.md
4. docs/00-handbook/NAMING.md
5. İlgili AGENT-CODEX.*.md
6. İlgili layout / style / architecture dokümanları

Çelişki durumunda bu sıra baz alınır.

## 3. Cevap formatı

Her görevde varsayılan yapı:

- Keşif Özeti
- Tasarım
- Uygulama Adımları

`Uygulama Adımları` sadece:
- `dosya yolu` + `yapılacak değişiklik` içermelidir.
- Tam implementasyon / uzun kod gövdeleri bu seviyede üretilmez.

## 4. Riskli komutlar

Aşağıdaki komutlar **asla** otomatik önerilmez veya çalıştırılmaz:

- Veritabanı silme / drop komutları
- `git reset --hard`, `git clean -fdx`
- `rm -rf` ile kritik klasör silme

Bu tip işlemler gerekiyorsa:
- Önce riskler açıkça yazılır,
- Sonra insan onayı olmadan uygulanmaz.

## 5. İş seçimi (PROJECT-FLOW)

- Kullanıcı “sırada ne var / devam edelim” dediğinde, `docs/03-delivery/PROJECT-FLOW.md` içindeki Story tablosu esas alınır.
- Seçim kuralı: `Öncelik` en yüksek (DESC) ve `Durum != 🟩 Done` olan Story önce gelir.

## 6. Genel İş Yapış (SSOT)

- Önce deterministik scriptler: kontrol/rapor/gate/queue/tracker (tekrar üretilebilir sonuç).
- Yetmezse Codex: yalnız allowlist + limitler içinde düzenleme/implementasyon.
- Her fix localde yapılır: local validate → commit → push. (GitHub-side auto-fix yok.)
- needs-human (token/permission/infra/approval): Codex yalnız teşhis/kanıt üretir, otomatik fix yapmaz.

## 7. Local Chat Transcript (Kopyasız)

- Codex her yanıtının sonunda, yanıtın **tam metnini** UTC zaman damgası ile `.autopilot-tmp/codex-chatlog/latest.md` dosyasına append eder.
- Bu dosya gitignored olsa bile **token/secret/credential** içeren metinler yazdırılmaz.
