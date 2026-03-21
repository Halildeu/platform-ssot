import type { TemplateFile } from '../types';
import {
  generatePackageJson,
  generateTsConfig,
  generateViteConfig,
  generateIndexHtml,
  generateMain,
  generateCss,
  generateAppLayout,
} from './shared';

/* ------------------------------------------------------------------ */
/*  CRUD template                                                      */
/* ------------------------------------------------------------------ */

export function generateCrudTemplate(name: string): TemplateFile[] {
  return [
    { path: 'package.json', content: generatePackageJson(name, 'crud') },
    { path: 'tsconfig.json', content: generateTsConfig() },
    { path: 'vite.config.ts', content: generateViteConfig() },
    { path: 'index.html', content: generateIndexHtml(name) },
    { path: 'src/main.tsx', content: generateMain() },
    { path: 'src/App.tsx', content: generateCrudApp() },
    { path: 'src/pages/ProductsPage.tsx', content: generateProductsPage() },
    { path: 'src/data/products.ts', content: generateProductData() },
    { path: 'src/layouts/AppLayout.tsx', content: generateAppLayout(name) },
    { path: 'src/index.css', content: generateCss() },
  ];
}

/* ------------------------------------------------------------------ */
/*  src/App.tsx                                                        */
/* ------------------------------------------------------------------ */

function generateCrudApp(): string {
  return `import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import ProductsPage from './pages/ProductsPage';

const linkStyle: React.CSSProperties = {
  textDecoration: 'none',
  fontSize: '0.875rem',
  fontWeight: 500,
  color: 'var(--color-text-secondary, #64748b)',
};

export default function App() {
  return (
    <Routes>
      <Route
        element={
          <AppLayout>
            <NavLink to="/" style={linkStyle}>
              Products
            </NavLink>
          </AppLayout>
        }
      >
        <Route index element={<ProductsPage />} />
      </Route>
    </Routes>
  );
}
`;
}

/* ------------------------------------------------------------------ */
/*  src/data/products.ts                                               */
/* ------------------------------------------------------------------ */

function generateProductData(): string {
  return `export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'draft' | 'archived';
}

export const sampleProducts: Product[] = [
  { id: '1', name: 'Widget Pro', sku: 'WP-001', category: 'Electronics', price: 49.99, stock: 142, status: 'active' },
  { id: '2', name: 'Gadget Ultra', sku: 'GU-002', category: 'Electronics', price: 89.99, stock: 56, status: 'active' },
  { id: '3', name: 'Basic Tee', sku: 'BT-010', category: 'Clothing', price: 19.99, stock: 320, status: 'active' },
  { id: '4', name: 'Premium Jacket', sku: 'PJ-011', category: 'Clothing', price: 129.99, stock: 0, status: 'draft' },
  { id: '5', name: 'Organic Coffee', sku: 'OC-050', category: 'Food', price: 14.99, stock: 89, status: 'active' },
  { id: '6', name: 'Notebook Set', sku: 'NS-100', category: 'Stationery', price: 9.99, stock: 210, status: 'active' },
  { id: '7', name: 'Desk Lamp', sku: 'DL-030', category: 'Home', price: 34.99, stock: 73, status: 'active' },
  { id: '8', name: 'Vintage Clock', sku: 'VC-031', category: 'Home', price: 59.99, stock: 12, status: 'archived' },
];
`;
}

/* ------------------------------------------------------------------ */
/*  src/pages/ProductsPage.tsx                                         */
/* ------------------------------------------------------------------ */

function generateProductsPage(): string {
  return `import React, { useState, useCallback } from 'react';
import { CrudPageTemplate } from '@mfe/blocks';
import type { DataListColumn, DetailViewSection, FormField } from '@mfe/blocks';
import { sampleProducts } from '../data/products';
import type { Product } from '../data/products';

/* ------------------------------------------------------------------ */
/*  Column definitions                                                 */
/* ------------------------------------------------------------------ */

const columns: DataListColumn<Product>[] = [
  { key: 'name', label: 'Name' },
  { key: 'sku', label: 'SKU' },
  { key: 'category', label: 'Category' },
  {
    key: 'price',
    label: 'Price',
    render: (value: number) => \`$\${value.toFixed(2)}\`,
  },
  {
    key: 'stock',
    label: 'Stock',
    render: (value: number) => (
      <span style={{ color: value === 0 ? 'var(--color-error, #dc2626)' : 'inherit' }}>
        {value}
      </span>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    render: (value: string) => (
      <span
        style={{
          padding: '0.125rem 0.5rem',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: 500,
          backgroundColor:
            value === 'active'
              ? 'var(--color-success-light, #dcfce7)'
              : value === 'draft'
                ? 'var(--color-warning-light, #fef3c7)'
                : 'var(--color-border, #e2e8f0)',
          color:
            value === 'active'
              ? 'var(--color-success, #16a34a)'
              : value === 'draft'
                ? 'var(--color-warning, #d97706)'
                : 'var(--color-text-secondary, #64748b)',
        }}
      >
        {value}
      </span>
    ),
  },
];

/* ------------------------------------------------------------------ */
/*  Detail sections                                                    */
/* ------------------------------------------------------------------ */

function getDetailSections(product: Product): DetailViewSection[] {
  return [
    {
      title: 'General',
      fields: [
        { label: 'Name', value: product.name },
        { label: 'SKU', value: product.sku },
        { label: 'Category', value: product.category },
        { label: 'Status', value: product.status },
      ],
    },
    {
      title: 'Inventory',
      fields: [
        { label: 'Price', value: \`$\${product.price.toFixed(2)}\` },
        { label: 'Stock', value: String(product.stock) },
      ],
    },
  ];
}

/* ------------------------------------------------------------------ */
/*  Form fields                                                        */
/* ------------------------------------------------------------------ */

const formFields: FormField[] = [
  { name: 'name', label: 'Product Name', type: 'text', required: true },
  { name: 'sku', label: 'SKU', type: 'text', required: true },
  { name: 'category', label: 'Category', type: 'text', required: true },
  { name: 'price', label: 'Price', type: 'number', required: true },
  { name: 'stock', label: 'Stock', type: 'number', required: true },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Draft', value: 'draft' },
      { label: 'Archived', value: 'archived' },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ProductsPage() {
  const [products, setProducts] = useState(sampleProducts);

  const handleSave = useCallback((values: Record<string, unknown>) => {
    const newProduct: Product = {
      id: String(Date.now()),
      name: String(values.name ?? ''),
      sku: String(values.sku ?? ''),
      category: String(values.category ?? ''),
      price: Number(values.price ?? 0),
      stock: Number(values.stock ?? 0),
      status: (values.status as Product['status']) ?? 'draft',
    };
    setProducts((prev) => [...prev, newProduct]);
  }, []);

  const handleDelete = useCallback((product: Product) => {
    setProducts((prev) => prev.filter((p) => p.id !== product.id));
  }, []);

  return (
    <CrudPageTemplate<Product>
      title="Products"
      items={products}
      columns={columns}
      searchKey="name"
      detailTitle={(p) => p.name}
      detailSections={getDetailSections}
      formFields={formFields}
      onSave={handleSave}
      onDelete={handleDelete}
    />
  );
}
`;
}
