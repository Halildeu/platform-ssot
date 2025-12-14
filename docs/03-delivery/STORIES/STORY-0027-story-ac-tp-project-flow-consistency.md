# STORY-0027 – STORY / AC / TP ↔ PROJECT-FLOW Consistency

ID: STORY-0027-story-ac-tp-project-flow-consistency  
Epic: QLTY-DOC-QA  
Status: Planned  
Owner: @team/platform-arch  
Upstream: DOCS-WORKFLOW, DOCS-PROJECT-LAYOUT, PROJECT-FLOW  
Downstream: AC-0027, TP-0027

## 1. AMAÇ

- PROJECT-FLOW içindeki her Story satırının, fiziksel STORY/AC/TP dokümanları
  ile bire bir hizalı olmasını sağlamak.  
- Bu ilişkiyi otomatik kontrol eden ve geliştirici + AI agent için
  “sonraki adımlar” listesi üreten küçük bir docflow helper (script) tanımlamak.

## 2. TANIM

- Platform/dokümantasyon ekibi olarak, PROJECT-FLOW’daki her Story’nin STORY/AC/TP dosyalarıyla tutarlı olmasını istiyoruz; böylece hem insanlar hem de Doc QA script’leri tek bir tablodan işin hangi aşamada olduğunu görebilsin.
- Bir ai agent olarak, PROJECT-FLOW ve STORY/AC/TP zinciri arasındaki bağlantıyı otomatik olarak okuyup “şu anda ne yapılmalı?” sorusuna yanıt verecek adım listeleri üretebileyim istiyorum.

## 3. KAPSAM VE SINIRLAR

Dahil:
- PROJECT-FLOW içindeki Story satırları ↔ STORY/AC/TP dosya seti arasındaki
  varlık ve ID uyumunun tanımlanması.  
- Bu uyumu kontrol eden basit bir script taslağı
  (ör. `scripts/check_story_links.py`).  
- Bir Story ID’si verildiğinde o Story için eksik dokümanları ve
  güncellenmesi gereken alanları özetleyen “sonraki adımlar” çıktısı
  veren helper’ın tasarlanması (ör. `docflow` benzeri bir arayüz).  

Hariç:
- Her Story için detaylı iş akışını tam otomatik hale getirmek
  (örn. sprint planlama, task breakdown).  
- İş mantığı veya teknik çözümün script’ler tarafından otomatik
  üretilmesi; odak yalnız doküman zinciri ve görünürlük.

## 4. ACCEPTANCE KRİTERLERİ

- [ ] PROJECT-FLOW’daki her Story ID için ilgili STORY dosyası
  (`docs/03-delivery/STORIES/STORY-XXXX-*.md`) bulunur veya eksikse
  raporlanır.  
- [ ] PROJECT-FLOW’daki Acceptance sütununda yer alan her AC-XXXX ID için
  fiziksel ACCEPTANCE dosyası vardır veya eksikse raporlanır.  
- [ ] Her STORY dosyasında, “LİNKLER” bölümünde en az ilgili Acceptance ve
  Test Plan dokümanlarına referans bulunur.  
- [ ] Basit bir komut (örn. `python scripts/check_story_links.py STORY-0007`)
  çalıştırıldığında, ilgili Story için “tamamlanmış / eksik dokümanlar” ve
  “sonraki adımlar” kısa, okunabilir bir özet olarak üretilir.

## 5. BAĞIMLILIKLAR

- DOCS-WORKFLOW (doküman türleri ve Discover→Operate akışı).  
- DOCS-PROJECT-LAYOUT (Story/Acceptance/Test Plan klasör yapısı).  
- NUMARALANDIRMA-STANDARDI (ID havuzları).  
- PROJECT-FLOW (Story durum tablosu).  
- STORY-0026 / AC-0026 / TP-0027 (Doc QA & Template Automation).

## 6. ÖZET

- Bu Story, PROJECT-FLOW ile STORY/AC/TP zinciri arasındaki ilişkiyi
  “tek kaynak” hale getirir.  
- Doc QA script’leri ve AI agent için hangi Story’de hangi dokümanların
  eksik olduğunu otomatik olarak görebilme imkanı sağlar.

## 7. LİNKLER (İSTEĞE BAĞLI)

- Story: docs/03-delivery/STORIES/STORY-0027-story-ac-tp-project-flow-consistency.md  
- Acceptance: docs/03-delivery/ACCEPTANCE/AC-0027-story-ac-tp-project-flow-consistency.md  
- Test Plan: `docs/03-delivery/TEST-PLANS/TP-0027-story-ac-tp-project-flow-consistency.md`  
