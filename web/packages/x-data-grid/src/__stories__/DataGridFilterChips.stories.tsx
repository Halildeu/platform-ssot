import React from 'react';
import { DataGridFilterChips } from '../DataGridFilterChips';

export const SingleFilter = () => (
  <DataGridFilterChips
    filters={[{ key: '1', label: 'Status', value: 'Active', onRemove: () => console.log('remove 1') }]}
  />
);

export const MultipleFilters = () => (
  <DataGridFilterChips
    filters={[
      { key: '1', label: 'Status', value: 'Active', onRemove: () => console.log('remove 1') },
      { key: '2', label: 'Role', value: 'Admin', onRemove: () => console.log('remove 2') },
      { key: '3', label: 'Department', value: 'Engineering', onRemove: () => console.log('remove 3') },
    ]}
    onClearAll={() => console.log('clear all')}
  />
);

export default { title: 'X-Data-Grid/FilterChips', component: DataGridFilterChips };
