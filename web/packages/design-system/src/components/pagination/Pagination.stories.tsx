import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Pagination } from './Pagination';

const meta: Meta<typeof Pagination> = {
  title: 'Components/Navigation/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    showTotal: { control: 'boolean' },
    pageSize: { control: 'number' },
    siblingCount: { control: 'number' },
  },
};
export default meta;
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    return (
      <Pagination
        total={100}
        current={page}
        pageSize={10}
        onChange={setPage}
      />
    );
  },
};

export const WithTotal: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    return (
      <Pagination
        total={247}
        current={page}
        pageSize={10}
        onChange={setPage}
        showTotal
      />
    );
  },
};

export const FewPages: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    return (
      <Pagination
        total={30}
        current={page}
        pageSize={10}
        onChange={setPage}
      />
    );
  },
};

export const ManyPages: Story = {
  render: () => {
    const [page, setPage] = useState(5);
    return (
      <Pagination
        total={500}
        current={page}
        pageSize={10}
        onChange={setPage}
      />
    );
  },
};

export const SmallSize: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    return (
      <Pagination
        total={100}
        current={page}
        pageSize={10}
        onChange={setPage}
        size="sm"
      />
    );
  },
};

export const CustomPageSize: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    return (
      <Pagination
        total={200}
        current={page}
        pageSize={25}
        onChange={setPage}
        showTotal
      />
    );
  },
};

export const AllSizes: Story = {
  render: () => {
    const [smPage, setSmPage] = useState(3);
    const [mdPage, setMdPage] = useState(3);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <div style={{ marginBottom: 8, fontSize: 12, fontWeight: 600 }}>Kucuk (sm)</div>
          <Pagination total={100} current={smPage} onChange={setSmPage} size="sm" />
        </div>
        <div>
          <div style={{ marginBottom: 8, fontSize: 12, fontWeight: 600 }}>Orta (md)</div>
          <Pagination total={100} current={mdPage} onChange={setMdPage} size="md" />
        </div>
      </div>
    );
  },
};
