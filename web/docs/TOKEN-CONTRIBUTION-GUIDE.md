# Token Katki Rehberi

Bu rehber, design token'larin nasil eklendigi, Figma ile nasil senkronize edildigi ve conflict durumlarinda nasil hareket edilecegini aciklar.

## Token Nasil Eklenir

### Code-First Akis (Gelistirici)

1. `src/tokens/color.ts` (veya ilgili token dosyasi) icine yeni token'i ekleyin
2. `npm run build:tokens` calistirarak CSS/JS ciktisini olusturun
3. `npm run tokens:diff` ile Figma tarafindaki mevcut degerlerle farki goruntuleyin
4. PR acin, review surecini tamamlayin ve merge edin
5. CI pipeline merge sonrasi otomatik olarak Figma variable'larini gunceller

### Figma-First Akis (Tasarimci)

1. Figma dosyasinda yeni bir variable olusturun veya mevcut bir variable'i guncelleyin
2. CI pipeline hafta ici her gun saat 09:00'da otomatik reverse-sync calistirir
3. Degisiklikler icin otomatik PR acilir
4. Developer ekip PR'i review eder ve merge sonrasi `theme.css` otomatik guncellenir

## Merge Stratejisi

Token conflict'leri asagidaki kurallara gore cozulur:

| Token Kategorisi         | Otorite       | Aciklama                              |
|--------------------------|---------------|---------------------------------------|
| Renk (color)             | Figma kazanir | Tasarim ekibi renk otoritesidir       |
| Tipografi (typography)   | Figma kazanir | Font secimi tasarim kararidir          |
| Bosluk (spacing)         | Code kazanir  | Layout muhendislik kararidir           |
| Hareket (motion)         | Code kazanir  | Animasyon performans muhendisligi      |
| Yukseklik (elevation)    | Code kazanir  | z-index yonetimi muhendislik kararidir |
| Her iki taraf degistiyse | CONFLICT      | PR review'da manual karar gerekir      |

## Conflict Cozumu

Iki tarafin da ayni token'i degistirdigi durumlarda:

1. `npm run tokens:diff` komutuyla diff raporunu olusturun
2. `reports/token-diff-report.html` dosyasini tarayicida acin
3. Kirmizi satirlar conflict'leri gosterir, yesil satirlar tek tarafli degisiklikleri gosterir
4. Ilgili tarafla (tasarimci veya gelistirici) iletisime gecin ve karari birlikte verin
5. Kazanan degeri ilgili token dosyasina manual olarak yazin
6. `npm run build:tokens` ile yeniden build alin

## Yerel Test

```bash
# Drift kontrolu — Figma ile code arasindaki farklari raporlar
npm run lint:token-drift

# Diff raporu — HTML formatta gorsel rapor olusturur
npm run tokens:diff

# Reverse sync (dry-run) — Figma'dan code'a sync simulasyonu
FIGMA_TOKEN=xxx FIGMA_FILE_ID=yyy npm run figma:reverse-sync:dry

# Gercek sync (dikkatli kullanin!)
FIGMA_TOKEN=xxx FIGMA_FILE_ID=yyy npm run figma:reverse-sync:write
```

## CI Pipeline

| Zamanlama        | Islem                              | Aciklama                                    |
|------------------|------------------------------------|---------------------------------------------|
| Hafta ici 09:00  | Figma -> Code otomatik sync        | Figma degisiklikleri code'a tasinir          |
| Hafta ici 14:00  | Drift check                        | Tutarsizlik varsa GitHub issue olusturulur   |
| PR merge         | `quality:full` pipeline            | Token validation dahil tam kalite kontrolu   |
| Her PR           | `lint:token-drift`                 | Token drift otomatik kontrol edilir          |

## Dosya Yapisi

```
packages/design-system/
  src/
    tokens/
      color.ts            # Renk token tanimlari
      typography.ts       # Tipografi token tanimlari
      spacing.ts          # Bosluk token tanimlari
      motion.ts           # Animasyon token tanimlari
      elevation.ts        # Yukseklik (shadow/z-index) token tanimlari
      index.ts            # Tum token'larin export noktasi
    theme/
      theme.css           # Build ciktisi — token'lardan uretilir
  style-dictionary.config.mjs  # Token build konfigurasyonu

scripts/
  figma-sync.mjs               # Figma'ya token push
  figma-sync-reverse.mjs       # Figma'dan token pull
  detect-token-drift.mjs       # Drift analizi
  tokens/
    build-tokens.mjs           # Token build pipeline

reports/
  token-diff-report.html       # Diff raporu ciktisi
```

## Yeni Token Eklerken Kontrol Listesi

- [ ] Token isimlendirmesi `kebab-case` formatinda mi?
- [ ] Token, ilgili kategori dosyasina (`color.ts`, `spacing.ts` vb.) eklendi mi?
- [ ] `npm run build:tokens` basariyla tamamlandi mi?
- [ ] `npm run lint:token-drift` sifir hata veriyor mu?
- [ ] Dark mode karsiligi tanimli mi? (`npm run dark-fallback-gate`)
- [ ] Token dokumantasyonu eklendi mi?
- [ ] PR acildi ve en az bir reviewer atandi mi?

## Sikca Sorulan Sorular

**S: Figma'da bir variable'i sildim, code tarafinda ne olur?**
Reverse-sync, silinen variable'lari `deprecated` olarak isaretler ama otomatik silmez. Gelistirici ekip deprecation policy'ye gore manual temizlik yapar.

**S: Ayni anda Figma ve code'da farkli degerler verdik, ne olur?**
CI pipeline conflict tespit eder ve PR'da uyari gosterir. Merge engellemez ama review sirasinda karar verilmesi gerekir. Otorite tablosuna bakin.

**S: Token build basarisiz olursa ne yapmaliyim?**
Oncelikle `npm run build:tokens` ciktisini kontrol edin. Genellikle syntax hatasi veya gecersiz token referansi neden olur. Hatayi duzelttikten sonra tekrar deneyin.
