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

- Günlük transcript: `.autopilot-tmp/codex-chatlog/YYYYMMDD.md` (gitignored)
- Pointer: `.autopilot-tmp/codex-chatlog/latest.md` → bugünün dosyası

-------------------------------------------------------------------------------
3. KURAL
-------------------------------------------------------------------------------

Codex her yanıtının sonunda:
- yanıtın TAM METNİNİ
- zaman damgası ile
- `.autopilot-tmp/codex-chatlog/YYYYMMDD.md` dosyasına append eder (UTC).
- `latest.md` bugünün dosyasını gösterecek şekilde güncel tutulur (opsiyonel helper: `bash scripts/ops/codex_chatlog_set_latest.sh`).

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

-------------------------------------------------------------------------------
X. WORK LOG – UI MIRROR (ZORUNLU)
-------------------------------------------------------------------------------

- Transcript’te WORK LOG, UI’daki “Ran/Edited/Reviewed/Considering” listesini metin olarak yansıtır.
- Minimum beklenen:
  - Komut çalıştıysa: `Ran <cmd>`
  - Dosya değiştiyse: `Edited <file> +x -y`
- Opsiyonel: `WORK LOG – Summary` (kısa özet).
- Bu blok secrets içermez.

-------------------------------------------------------------------------------
X. LEGACY NOTU
-------------------------------------------------------------------------------

- Verbatim kuralı devreye girmeden önce `latest.md` içinde marker’sız eski format kayıtlar olabilir.
- Öneri: kural devreye alındığında `latest.md` arşivlenir ve temiz `latest.md` başlatılır (legacy ayrıştırma).

-------------------------------------------------------------------------------
X. GÜNLÜK ROTASYON (UTC)
-------------------------------------------------------------------------------

- Günlük transcript dosyası: `.autopilot-tmp/codex-chatlog/YYYYMMDD.md`
- `latest.md` bugünün dosyasını gösterir.
- Örnek:
  - Bugün: `.autopilot-tmp/codex-chatlog/20251225.md`
  - Hızlı bakış: `tail -n 200 .autopilot-tmp/codex-chatlog/latest.md`
