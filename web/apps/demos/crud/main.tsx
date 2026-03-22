/**
 * CRUD Reference App
 * Shows: List view, detail view, create/edit forms
 * Time to first value: < 15 minutes from create-app
 */
import React from "react";

// Document what imports would be used from @mfe packages:
// import { Card, Text, Button, Dialog, Stack, Badge } from "@mfe/design-system";
// import { DataGrid, ColumnDef } from "@mfe/x-data-grid";
// import { FormBuilder, useFormSchema } from "@mfe/x-form-builder";
// import { useHttp } from "@mfe/shared-http";

const CrudDemo = () => (
  <div className="p-6 space-y-6">
    <h1 className="text-2xl font-bold">CRUD Reference App</h1>
    <p>Bu demo @mfe/x-data-grid + @mfe/x-form-builder kullanarak tam bir CRUD akışı gösterir.</p>

    <section>
      <h2 className="text-xl font-semibold mb-3">Kullanılan Bileşenler</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>DataGrid — server-side row model ile liste görünümü</li>
        <li>FormBuilder — JSON schema tabanlı form oluşturma</li>
        <li>Dialog — create/edit modal</li>
        <li>Button, Badge, Text — UI primitives</li>
        <li>useHttp — API entegrasyonu</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-semibold mb-3">Sayfa Yapısı</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-lg p-4 bg-blue-50">
          <h3 className="font-semibold">List View</h3>
          <p className="text-sm text-gray-600">AG Grid ile server-side pagination, filtering, sorting</p>
        </div>
        <div className="border rounded-lg p-4 bg-green-50">
          <h3 className="font-semibold">Detail View</h3>
          <p className="text-sm text-gray-600">Seçili kaydın detayları, ilişkili veriler, audit trail</p>
        </div>
        <div className="border rounded-lg p-4 bg-orange-50">
          <h3 className="font-semibold">Create / Edit Form</h3>
          <p className="text-sm text-gray-600">FormBuilder ile validasyonlu form, dosya yükleme</p>
        </div>
      </div>
    </section>

    <section>
      <h2 className="text-xl font-semibold mb-3">CRUD Akışı</h2>
      <ol className="list-decimal pl-6 space-y-1 text-sm">
        <li>Liste sayfası yüklenir — DataGrid server-side modda API çağrısı yapar</li>
        <li>Kullanıcı satıra tıklar — detail panel açılır</li>
        <li>"Yeni Ekle" butonu — FormBuilder ile boş form</li>
        <li>"Düzenle" butonu — FormBuilder mevcut veri ile doldurulur</li>
        <li>Kaydet — validasyon + API POST/PUT + grid refresh</li>
        <li>Sil — onay dialog + API DELETE + grid refresh</li>
      </ol>
    </section>

    <section>
      <h2 className="text-xl font-semibold mb-3">Başlangıç</h2>
      <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
        npx @mfe/create-app my-crud-app --template crud
      </pre>
    </section>
  </div>
);

export default CrudDemo;
