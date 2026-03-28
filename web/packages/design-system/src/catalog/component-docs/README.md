# Component Docs Source

Bu klasor, Design Lab icindeki her component/hook/function/const girdisinin ayri kaynak dosyada tutuldugu kanonik dokumantasyon katmanidir.

## Kural

- Her design library konusu ayri bir `entries/*.doc.ts` dosyasinda yasar.
- Toplu tuketim `index.ts` uzerinden yapilir.
- Yeni component eklendiginde veya mevcut component dokumantasyonu degistiginde ilgili tekil dosya guncellenir.

## Uretim

Ilk ayrisim mevcut manifest katmanindan uretilir:

- `web/packages/design-system/src/catalog/component-manifest.v1.json`

Jenerasyon komutu:

```bash
python3 scripts/generate_component_doc_modules.py
```

Bu sayede Design Lab toplu JSON'dan degil, component-bazli modullerden beslenir.
