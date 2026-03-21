import React from 'react';
import { DataGridFilterChips } from '../DataGridFilterChips';

export const SingleFilter = () => (
  <DataGridFilterChips
    filters={[{ id: '1', field: 'status', label: 'Status', value: 'Active' }]}
    onRemove={(id) => console.log('remove', id)}
  />
);

export const MultipleFilters = () => (
  <DataGridFilterChips
    filters={[
      { id: '1', field: 'status', label: 'Status', value: 'Active' },
      { id: '2', field: 'role', label: 'Role', value: 'Admin' },
      { id: '3', field: 'dept', label: 'Department', value: 'Engineering' },
    ]}
    onRemove={(id) => console.log('remove', id)}
    onClearAll={() => console.log('clear all')}
  />
);

export default { title: 'X-Data-Grid/FilterChips', component: DataGridFilterChips };
