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

- Transcript dosyası: `.autopilot-tmp/codex-chatlog/latest.md` (gitignored).
- Codex her yanıtının sonunda, kullanıcıya gönderdiği yanıtın **tam metnini** (verbatim) transcript’e append eder.
  - Yeniden biçimlendirme, paraphrase, kısaltma yapılmaz.
  - “Undo/Review” benzeri bloklar dahil, kullanıcıya giden metin ne ise aynen yazılır.

**VERBATIM ZORUNLULUK (Kopyasız / Birebir)**

**TAMLIK KURALI (NO DROP)**
- Verbatim blok, kullanıcıya görünen yanıt metninin *tamamını* içerir: `Undo`, `Review`, dosya listeleri, diff özetleri, linkler, boş satırlar dahil.
- Hiçbir satır atlanmaz, yeniden sıralanmaz, yeniden biçimlendirilmez.
- Her yanıt için `BEGIN_CODEX_RESPONSE` / `END_CODEX_RESPONSE` marker’ları zorunludur (opsiyonel değildir).

- Transcript’e yazılan ana blok aşağıdaki formatta olmak zorundadır:
  - `--- ts_utc / branch / sha ---`
  - `BEGIN_CODEX_RESPONSE`
  - (yanıtın aynısı, satır satır)
  - `END_CODEX_RESPONSE`
- İstersen ayrıca *ikinci bir bölüm* olarak “Keşif Özeti / Tasarım / Uygulama Adımları” yapısal özet eklenebilir; ancak bu **RAW yerine geçmez**.

**Gizlilik**
- Bu dosya gitignored olsa bile **token/secret/credential** içeren metinler yazdırılmaz.
