import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Accordion, createAccordionItemsFromSections, createAccordionPreset } from '../packages/design-system/src/components/Accordion';
import { Button } from '../packages/design-system/src/components/Button';
import { Text } from '../packages/design-system/src/components/Text';

const meta: Meta<typeof Accordion> = {
  title: 'UI Kit/Accordion',
  component: Accordion,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof Accordion>;

export const Overview: Story = {
  render: () => (
    <div className="min-h-screen bg-surface-canvas p-6 text-text-primary">
      <div className="mx-auto max-w-4xl rounded-[28px] border border-border-subtle bg-surface-default p-6 shadow-sm">
        <Accordion
          ariaLabel="Release readiness accordion"
          defaultValue={['overview']}
          items={[
            {
              value: 'overview',
              title: 'Overview',
              description: 'Release health, adoption ve rollout görünümü.',
              extra: <span className="text-xs font-semibold text-text-secondary">Ready</span>,
              content: (
                <Text variant="secondary">
                  Bu panel, sayfa içi yoğun bilgiyi disclosure akışı ile sadeleştirmek için kullanılır.
                </Text>
              ),
            },
            {
              value: 'audit',
              title: 'Audit trail',
              description: 'Onay ve mutation geçmişi.',
              content: (
                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" size="small">Export log</Button>
                  <Button size="small">Open approvals</Button>
                </div>
              ),
            },
            {
              value: 'policy',
              title: 'Policy checks',
              description: 'Gate ve standards lock özeti.',
              content: (
                <Text variant="secondary">
                  Policy sonuçları ve uyarılar bu panel altında gruplanabilir.
                </Text>
              ),
            },
          ]}
        />
      </div>
    </div>
  ),
};

export const NestedRecipes: Story = {
  render: () => {
    const recipeItems = createAccordionItemsFromSections([
      {
        key: 'security',
        title: 'Security',
        content: <Text variant="secondary">Kimlik, rol ve scope ayarlari tek disclosure grubu altında toplanır.</Text>,
        defaultExpanded: true,
        sections: [
          {
            key: 'scopes',
            title: 'Scopes',
            content: <Text variant="secondary">Scope matrisi, nested accordion olarak iç içe gösterilebilir.</Text>,
          },
          {
            key: 'sessions',
            title: 'Sessions',
            content: <Text variant="secondary">Session timeout ve revoke ayarları burada yer alır.</Text>,
          },
        ],
      },
      {
        key: 'audit',
        title: 'Audit retention',
        content: <Text variant="secondary">Retention ve export politikaları ayrı bir recipe paneli olarak gösterilir.</Text>,
      },
    ]);

    return (
      <div className="min-h-screen bg-surface-canvas p-6 text-text-primary">
        <div className="mx-auto max-w-4xl rounded-[28px] border border-border-subtle bg-surface-default p-6 shadow-sm">
          <Accordion
            ariaLabel="Nested settings accordion"
            items={recipeItems}
            {...createAccordionPreset('compact')}
          />
        </div>
      </div>
    );
  },
};
