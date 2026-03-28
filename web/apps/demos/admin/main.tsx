/**
 * Admin Reference App
 * Shows: Settings panels, user management, role-based access
 * Time to first value: < 15 minutes from create-app
 */
import React from "react";

// Document what imports would be used from @mfe packages:
// import { Card, Text, Button, Tabs, Switch, Avatar, Badge, Stack } from "@mfe/design-system";
// import { DataGrid } from "@mfe/x-data-grid";
// import { FormBuilder } from "@mfe/x-form-builder";
// import { usePermission, useAuth } from "@mfe/platform-capabilities";

const AdminDemo = () => (
  <div className="flex flex-col p-6 gap-6">
    <h1 className="text-2xl font-bold">Admin Reference App</h1>
    <p>Bu demo @mfe/design-system kullanarak bir admin paneli ve kullanıcı yönetimi gösterir.</p>

    <section>
      <h2 className="text-xl font-semibold mb-3">Kullanılan Bileşenler</h2>
      <ul className="flex flex-col list-disc pl-6 gap-1">
        <li>Tabs — settings kategorileri (Genel, Güvenlik, Bildirimler, Entegrasyonlar)</li>
        <li>Switch, FormBuilder — ayar formları</li>
        <li>DataGrid — kullanıcı listesi</li>
        <li>Avatar, Badge — kullanıcı profil kartları</li>
        <li>usePermission — RBAC kontrolleri</li>
      </ul>
    </section>

    <section>
      <h2 className="text-xl font-semibold mb-3">Sayfa Yapısı</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-lg p-4 bg-state-info-bg">
          <h3 className="font-semibold">Settings Panel</h3>
          <p className="text-sm text-text-secondary">Genel ayarlar, tema, dil, bildirim tercihleri</p>
        </div>
        <div className="border rounded-lg p-4 bg-state-success-bg">
          <h3 className="font-semibold">User Management</h3>
          <p className="text-sm text-text-secondary">Kullanıcı listesi, rol atama, davet gönderme</p>
        </div>
        <div className="border rounded-lg p-4 bg-state-danger-bg">
          <h3 className="font-semibold">Security</h3>
          <p className="text-sm text-text-secondary">SSO yapılandırma, audit log, oturum yönetimi</p>
        </div>
      </div>
    </section>

    <section>
      <h2 className="text-xl font-semibold mb-3">Yetki Modeli</h2>
      <div className="overflow-x-auto">
        <table className="text-sm border-collapse w-full">
          <thead>
            <tr className="bg-surface-muted">
              <th className="border p-2 text-left">Rol</th>
              <th className="border p-2 text-left">Ayarları Gör</th>
              <th className="border p-2 text-left">Ayarları Düzenle</th>
              <th className="border p-2 text-left">Kullanıcı Yönet</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="border p-2">Viewer</td><td className="border p-2">Evet</td><td className="border p-2">Hayır</td><td className="border p-2">Hayır</td></tr>
            <tr><td className="border p-2">Editor</td><td className="border p-2">Evet</td><td className="border p-2">Evet</td><td className="border p-2">Hayır</td></tr>
            <tr><td className="border p-2">Admin</td><td className="border p-2">Evet</td><td className="border p-2">Evet</td><td className="border p-2">Evet</td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <section>
      <h2 className="text-xl font-semibold mb-3">Başlangıç</h2>
      <pre className="bg-surface-inverse text-state-success-text p-4 rounded-lg text-sm overflow-x-auto">
        npx @mfe/create-app my-admin --template admin
      </pre>
    </section>
  </div>
);

export default AdminDemo;
