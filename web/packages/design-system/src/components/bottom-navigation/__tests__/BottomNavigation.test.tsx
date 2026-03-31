// @vitest-environment jsdom
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import { BottomNavigation } from '../BottomNavigation';

afterEach(() => { cleanup(); });

const HomeIcon = () => <svg data-testid="home-icon"><rect /></svg>;
const SearchIcon = () => <svg data-testid="search-icon"><rect /></svg>;

describe('BottomNavigation — temel render', () => {
  it('navigation landmark render eder', () => {
    render(
      <BottomNavigation defaultValue="home" fixed={false}>
        <BottomNavigation.Item value="home" icon={<HomeIcon />} label="Home" />
      </BottomNavigation>
    );
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
  it('item label gosterir', () => {
    render(
      <BottomNavigation fixed={false}>
        <BottomNavigation.Item value="home" icon={<HomeIcon />} label="Ana Sayfa" />
      </BottomNavigation>
    );
    expect(screen.getByText('Ana Sayfa')).toBeInTheDocument();
  });
  it('tiklaninca onChange cagirir', () => {
    const onChange = vi.fn();
    render(
      <BottomNavigation onChange={onChange} fixed={false}>
        <BottomNavigation.Item value="home" icon={<HomeIcon />} label="Home" />
        <BottomNavigation.Item value="search" icon={<SearchIcon />} label="Search" />
      </BottomNavigation>
    );
    fireEvent.click(screen.getByText('Search'));
    expect(onChange).toHaveBeenCalledWith('search');
  });
  it('showLabels=false label gizler', () => {
    render(
      <BottomNavigation showLabels={false} fixed={false}>
        <BottomNavigation.Item value="home" icon={<HomeIcon />} label="Home" />
      </BottomNavigation>
    );
    expect(screen.queryByText('Home')).not.toBeInTheDocument();
  });
});

describe('BottomNavigation — badge', () => {
  it('badge gosterir', () => {
    render(
      <BottomNavigation fixed={false}>
        <BottomNavigation.Item value="search" icon={<SearchIcon />} label="Search" badge={5} />
      </BottomNavigation>
    );
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});
