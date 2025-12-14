# AG Grid Theming API'ye Geçiş Planı (v33+)

Bu doküman, AG Grid file theme CSS (ör. `ag-theme-alpine.css`) kullanımından Theming API'ye geçiş için adımları, kod örneklerini ve kontrollü yayılım planını içerir. Hedef: tek tema kaynağı, tutarlı görsel dil ve düşük uyarı/teknik borç.

## 1) Hedef Mimari
- Tek yöntem: Theming API (örn. `theme: 'quartz'`).
- UI Kit, tema değişkenlerini merkezi yönetir; MFE'ler yalnızca `themeClassName`/`theme` alır.
- File theme importları kaldırılır (uyarı: “Theming API and CSS File Themes together” ortadan kalkar).

## 2) Geçiş Adımları
1. File theme importlarını kaldırın
   - `ag-grid-community/styles/*` CSS importlarını temizleyin.
   - Reponun tamamında arayın: `ag-theme-*.css`, `ag-grid.css`.
2. Theming API'yi etkinleştirin
   - UI Kit `EntityGridTemplate`'te `theme: 'quartz'` (veya seçtiğiniz tema) verin.
   - Grid wrapper class: `ag-theme-quartz` korunabilir (yalnızca container sınıfı için), ancak file CSS olmadan.
3. Tasarım token eşlemesi
   - Ant Design ve kurum renkleri ile AG Grid varlıklarını eşleyin:
     ```css
     :root {
       /* Kurumsal renkleriniz */
       --color-primary: #0b5ed7;
       --color-bg: #ffffff;

       /* AG Grid Theming API değişkenleri */
       --ag-foreground-color: rgba(0,0,0,.85);
       --ag-background-color: var(--color-bg);
       --ag-header-background-color: #fafafa;
       --ag-header-foreground-color: rgba(0,0,0,.88);
       --ag-border-color: #d9d9d9;
       --ag-row-hover-color: #f5f5f5;
       --ag-selected-row-background-color: #e6f4ff;
       --ag-font-size: 14px;
       --ag-card-radius: 6px;
     }
     ```
   - UI Kit’e `grid-theme.css` ekleyip tüm MFE’lere yayımlayın.
4. Durumlar ve yoğunluk
   - Satır yüksekliği, kenarlık ve yoğunluk: `--ag-row-height`, `--ag-grid-size` vb.
   - Erişilebilirlik: kontrast ve `focus` durumlarını zorunlu kontrol edin.
5. Karanlık tema (opsiyonel)
   - `[data-theme='dark']` kökünde değişkenleri override edin; AntD ile uyumlu tutun.

## 3) Kod Örneği (UI Kit)
```tsx
// EntityGridTemplate.tsx
<AgGridReact
  rowModelType={isServer ? 'serverSide' : 'clientSide'}
  gridOptions={{ theme: 'quartz' }}
  className="ag-theme-quartz"
  ...
/>
```

## 4) Yayılım Planı
- Sprint 1: File theme temizliği (users, access, audit), `grid-theme.css` yayın.
- Sprint 2: Tüm MFE’ler için Theming API aktive, görsel regress testleri.
- Sprint 3: Karanlık tema ve yüksek kontrast varyantı (opsiyonel), A11Y denetimleri.

## 5) Doğrulama Checklist’i
- [ ] Konsol uyarısı yok: “Theming API and CSS File Themes both used”.
- [ ] AntD + AG Grid renkleri eşleşiyor.
- [ ] A11Y: kontrast ≥ WCAG AA, klavye odağı net.
- [ ] E2E: satır seçimi, filtre, column menu, pin/resize testleri geçer.
