// @vitest-environment jsdom
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, expect, it } from 'vitest';
import { buildLinkInlineLivePreview, buildLinkInlineShowcaseSections } from './index';

const PreviewPanel = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  kind?: 'live' | 'reference' | 'recipe';
}) => (
  <section>
    <h3>{title}</h3>
    {children}
  </section>
);

describe('LinkInline showcase builders', () => {
  it('linkinline icin live preview ve section listesi uretir', () => {
    const sections = buildLinkInlineShowcaseSections('LinkInline', { PreviewPanel });

    expect(sections).not.toBeNull();
    expect(sections).toHaveLength(3);
    expect(sections?.map((section) => section.id)).toEqual([
      'linkinline-navigation-states',
      'linkinline-information-scent',
      'linkinline-access-safety',
    ]);

    render(
      <>
        {buildLinkInlineLivePreview('LinkInline', { PreviewPanel })}
        {sections?.[1]?.content}
      </>,
    );

    expect(screen.getAllByText('Navigation states').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Harici dokumantasyon').length).toBeGreaterThan(0);
    expect(screen.getByText('Kullanici verisi kilitli')).toBeInTheDocument();
  });

  it('farkli component icin null doner', () => {
    expect(buildLinkInlineLivePreview('Button', { PreviewPanel })).toBeNull();
    expect(buildLinkInlineShowcaseSections('Button', { PreviewPanel })).toBeNull();
  });
});
