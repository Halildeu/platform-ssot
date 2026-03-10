# CACHE-BOUNDARY-RULES (v1)

## Amac

Silinebilir/yeniden uretilebilir cache alanlari ile kalici/kanonik dosya alanlarini net ayirmak.

Kuralin kisa ozeti:

- `.cache/` silinebilir.
- Kanonik dokuman, policy, schema, registry, contract ve surekli kullanilan islevsel dosya yolu `.cache/` altinda yasayamaz.

## Zorunlu Kural

Asagidaki dosya siniflari `.cache/` veya benzeri gecici alanlarda tutulamaz:

- `docs/**` altindaki kanonik operasyon/mimari/delivery dokumanlari
- `policies/**`
- `schemas/**`
- `registry/**`
- `extensions/**/contract/**`
- `ci/**`
- surekli kullanilan operasyon scriptleri ve kalici kontrol dosyalari

Bu dosyalarin yeri silinebilir degil, kalici repo yolu olmalidir.

## `.cache/` Altinda Kalabilecekler

- `reports`
- `evidence`
- `audit` ciktilari
- `runtime guard` ciktilari
- `workspace` rebuildable indeksleri
- gecici session/state ciktilari

Kural:

- `.cache/` altindaki veri silindiginde sistem davranisini belirleyen kanonik kural/dokuman kaybolmamali.
- `.cache/` altindaki veri silindiginde yalniz turetilmis rapor/kanit/state kaybolabilir.

## Dogrulama

- `python3 ci/check_standards_lock.py`

## Fail-Closed Davranis

- Bir kanonik dosya yolu `.cache/` altina tasinmis veya oradan okunuyorsa durum `FAIL` kabul edilir.
- Gecici cikti yolunun kalici kaynak gibi kullanildigi supheli durumlarda da varsayilan karar `BLOCK + FIX` olur.
