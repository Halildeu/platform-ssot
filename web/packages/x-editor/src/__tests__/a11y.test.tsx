import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';

describe('Editor a11y', () => {
  it('SlashCommandMenu uses listbox role', async () => {
    const { SlashCommandMenu } = await import('../SlashCommandMenu');
    const { container } = render(
      <SlashCommandMenu
        commands={[{ id: 'h1', label: 'Heading 1', category: 'Basic', execute: () => {} }]}
        isOpen={true}
        position={{ top: 0, left: 0 }}
        selectedIndex={0}
        onSelect={() => {}}
        onClose={() => {}}
      />
    );
    expect(container.querySelector('[role="listbox"]')).toBeTruthy();
  });

  it('MentionList has accessible items', async () => {
    const { MentionList } = await import('../MentionList');
    const { container } = render(
      <MentionList
        items={[{ id: '1', label: 'User 1' }]}
        isOpen={true}
        position={{ top: 0, left: 0 }}
        selectedIndex={0}
        onSelect={() => {}}
        onClose={() => {}}
      />
    );
    expect(container.querySelector('[role="listbox"]')).toBeTruthy();
  });
});
