# STORY-0043 – MF UI Kit Model Unification (Docs Migration)

ID: STORY-0043-mf-uikit-model  
Epic: QLTY-MF-UIKIT  
Status: Planned  
Owner: @team/frontend  
Upstream: QLTY-MF-UIKIT-01, QLTY-MF-UIKIT-01-  
Downstream: AC-0043, TP-0043

-------------------------------------------------------------------------------
## 1. AMAÇ
-------------------------------------------------------------------------------

- Legacy QLTY-MF-UIKIT-01 “UI Kit Model Unification” içeriğini yeni
  doküman yapısına taşımak.  
- UI Kit tüketim modelini (package vs MF remote) tek resmi modele
  indirip governance seviyesinde netleştirmek.

-------------------------------------------------------------------------------
## 2. TANIM
-------------------------------------------------------------------------------

- Bir frontend geliştiricisi olarak, UI Kit bileşenlerinin her projede aynı modelden (paket veya remote) tüketilmesini istiyorum; böylece import karmaşası ve bundle şişmesi yaşamayayım.
- Platform ekibi olarak, seçilen UI Kit modelinin doküman ve MF config ile uyumlu olmasını istiyoruz; böylece yeni MFE’ler için onboarding kolay olsun.

-------------------------------------------------------------------------------
## 3. KAPSAM VE SINIRLAR
-------------------------------------------------------------------------------

Dahil:
- Tek resmi UI Kit modeli (paket/remote/hibrit) için governance tanımı.  
- Import örneklerinin ve MF config’in seçilen modele göre hizalanması.  
- ARCH/PROJECT-FLOW ve stil rehberlerindeki UI Kit bölümlerinin
  güncellenmesi.

Hariç:
- Yeni UI bileşeni geliştirmek.  
- Tema/token sisteminin ayrıntılı değişimi (mevcut theme sistemine
  referans verir; değişiklik ayrı story’lerde).

-------------------------------------------------------------------------------
## 4. ACCEPTANCE KRİTERLERİ
-------------------------------------------------------------------------------

- [ ] STORY-0043 / AC-0043 / TP-0043 zinciri, MF UI Kit modeline dair
  QLTY-MF-UIKIT-01 alias ID’si kapsamındaki kararları özetler.  
- [ ] PROJECT-FLOW tablosunda QLTY-MF-UIKIT-01 ve alias’ları bu Story
  satırıyla ilişkilidir.

-------------------------------------------------------------------------------
## 5. BAĞIMLILIKLAR
-------------------------------------------------------------------------------

- docs/00-handbook/STYLE-WEB-001.md  

-------------------------------------------------------------------------------
## 6. ÖZET
-------------------------------------------------------------------------------

- MF UI Kit tüketim modeli yeni doküman sisteminde bu Story zinciri
  üzerinden izlenebilir hale getirilmiştir.

-------------------------------------------------------------------------------
## 7. LİNKLER (İSTEĞE BAĞLI)
-------------------------------------------------------------------------------

- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0043-mf-uikit-model.md  
- Test Plan: `docs/03-delivery/TEST-PLANS/TP-0043-mf-uikit-model.md`  
