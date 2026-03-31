import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { BottomNavigation } from './BottomNavigation';

const HomeIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>;
const SearchIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>;
const HeartIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>;
const UserIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;

const meta: Meta<typeof BottomNavigation> = {
  title: 'Components/Components/BottomNavigation',
  component: BottomNavigation,
  tags: ['autodocs'],
  argTypes: {
    showLabels: { control: 'boolean' },
    fixed: { control: 'boolean' },
  },
  decorators: [(Story) => <div style={{ position: 'relative', height: 80, border: '1px solid var(--border-subtle)', borderRadius: 12, overflow: 'hidden' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof BottomNavigation>;

export const Default: Story = {
  render: () => {
    const [val, setVal] = useState('home');
    return (
      <BottomNavigation value={val} onChange={setVal} fixed={false}>
        <BottomNavigation.Item value="home" icon={<HomeIcon />} label="Ana Sayfa" />
        <BottomNavigation.Item value="search" icon={<SearchIcon />} label="Ara" />
        <BottomNavigation.Item value="favorites" icon={<HeartIcon />} label="Favoriler" />
        <BottomNavigation.Item value="profile" icon={<UserIcon />} label="Profil" />
      </BottomNavigation>
    );
  },
};

export const WithBadges: Story = {
  render: () => {
    const [val, setVal] = useState('home');
    return (
      <BottomNavigation value={val} onChange={setVal} fixed={false}>
        <BottomNavigation.Item value="home" icon={<HomeIcon />} label="Ana Sayfa" />
        <BottomNavigation.Item value="search" icon={<SearchIcon />} label="Ara" badge={3} />
        <BottomNavigation.Item value="favorites" icon={<HeartIcon />} label="Favoriler" badge={12} />
        <BottomNavigation.Item value="profile" icon={<UserIcon />} label="Profil" />
      </BottomNavigation>
    );
  },
};

export const NoLabels: Story = {
  render: () => {
    const [val, setVal] = useState('home');
    return (
      <BottomNavigation value={val} onChange={setVal} showLabels={false} fixed={false}>
        <BottomNavigation.Item value="home" icon={<HomeIcon />} label="Ana Sayfa" />
        <BottomNavigation.Item value="search" icon={<SearchIcon />} label="Ara" />
        <BottomNavigation.Item value="favorites" icon={<HeartIcon />} label="Favoriler" />
        <BottomNavigation.Item value="profile" icon={<UserIcon />} label="Profil" />
      </BottomNavigation>
    );
  },
};
