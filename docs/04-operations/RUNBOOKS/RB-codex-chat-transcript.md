# RB-codex-chat-transcript – Codex Chat Transcript (Local-only)

ID: RB-codex-chat-transcript
Service: ops-local
Status: Draft
Owner: @team/platform

-------------------------------------------------------------------------------
1. AMAÇ
-------------------------------------------------------------------------------

Codex’in chat’te yazdığı tüm metni (Keşif/Tasarım/Uygulama adımları dahil) kopyalamadan
otomatik olarak yerel bir transcript dosyasında biriktirmek.

-------------------------------------------------------------------------------
2. NEREDE?
-------------------------------------------------------------------------------

- Transcript: `.autopilot-tmp/codex-chatlog/latest.md` (gitignored)

-------------------------------------------------------------------------------
3. KURAL
-------------------------------------------------------------------------------

Codex her yanıtının sonunda:
- yanıtın TAM METNİNİ
- zaman damgası ile
- `.autopilot-tmp/codex-chatlog/latest.md` dosyasına append eder.

-------------------------------------------------------------------------------
4. GİZLİLİK
-------------------------------------------------------------------------------

Bu dosya repoya girmez (gitignored).
Yine de token/secret içeren metinler yazdırılmamalıdır.

-------------------------------------------------------------------------------
X. VERBATIM FORMAT
-------------------------------------------------------------------------------

- Transcript’e yazılan ana blok birebir (verbatim) olmalıdır:
  - `--- ts_utc / branch / sha ---`
  - `BEGIN_CODEX_RESPONSE` / `END_CODEX_RESPONSE` marker’ları arasında
  - Codex yanıtı Undo/Review dahil aynen yer alır.
- Opsiyonel: RAW bloğundan sonra “Keşif Özeti / Tasarım / Uygulama Adımları” gibi yapısal özet eklenebilir; ancak RAW yerine geçmez.
