import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ApprovalReview } from './ApprovalReview';
import type { ApprovalReviewProps } from './ApprovalReview';
import type { ApprovalCheckpointProps } from '../approval-checkpoint/ApprovalCheckpoint';
import type { CitationPanelItem } from '../citation-panel/CitationPanel';
import type { AIActionAuditTimelineItem } from '../ai-action-audit-timeline/AIActionAuditTimeline';

const meta: Meta<typeof ApprovalReview> = {
  title: 'Components/Patterns/ApprovalReview',
  component: ApprovalReview,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 960, maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof ApprovalReview>;

const ornekCheckpoint: ApprovalCheckpointProps = {
  title: 'Yillik Denetim Onay Sureci',
  summary: 'Finansal verilerin dogrulugu icin ic denetim kontrolu.',
  status: 'pending',
  checkpointLabel: 'Kontrol Noktasi #3',
  approverLabel: 'Ahmet Yilmaz, Denetim Muduru',
  dueLabel: 'Son tarih: 28 Subat 2024',
  steps: [
    { key: '1', label: 'Belge kontrolu', status: 'approved' },
    { key: '2', label: 'Finansal dogrulama', status: 'approved' },
    { key: '3', label: 'Risk degerlendirmesi', status: 'ready' },
    { key: '4', label: 'Yonetim onay', status: 'todo' },
  ],
  evidenceItems: [
    'Mali tablo analizi tamamlandi',
    'Ic kontrol raporu hazirlandi',
    'Uyum belgesi onaylandi',
  ],
  primaryActionLabel: 'Onayla',
  secondaryActionLabel: 'Reddet',
};

const ornekCitations: CitationPanelItem[] = [
  {
    id: 'c1',
    title: 'Finansal Denetim Yonetmeligi',
    excerpt:
      'Madde 12: Tum finansal islemlerin yillik periyotlarla bagimsiz denetimden gecirilmesi zorunludur.',
    source: 'Resmi Gazete, Sayi: 31234',
    locator: 'Madde 12, Paragraf 3',
    kind: 'policy',
  },
  {
    id: 'c2',
    title: 'ISO 27001 Uyum Raporu',
    excerpt:
      'Bilgi guvenligi yonetim sistemi gereksinimleri karsilanmis olup sertifikasyon sureci tamamlanmistir.',
    source: 'Ic Denetim Birimi',
    locator: 'Bolum 4.2',
    kind: 'doc',
  },
  {
    id: 'c3',
    title: 'Sistem Log Kayitlari',
    excerpt:
      'Son 90 gun icerisinde yetkisiz erisim girisimi tespit edilmemistir.',
    source: 'SIEM Sistemi',
    locator: '2024-01-15 / 2024-03-15',
    kind: 'log',
  },
];

const ornekAuditItems: AIActionAuditTimelineItem[] = [
  {
    id: 'a1',
    actor: 'ai',
    title: 'Otomatik belge taramasi tamamlandi',
    timestamp: '15.01.2024 10:30',
    summary: '42 belge taranarak uyum durumu analiz edildi.',
    status: 'executed',
  },
  {
    id: 'a2',
    actor: 'human',
    title: 'Manuel inceleme yapildi',
    timestamp: '16.01.2024 14:15',
    summary: 'Denetci tarafindan 5 belge detayli incelendi.',
    status: 'approved',
  },
  {
    id: 'a3',
    actor: 'ai',
    title: 'Risk skoru hesaplandi',
    timestamp: '17.01.2024 09:00',
    summary: 'Genel risk skoru: 2.4/10 (Dusuk Risk)',
    status: 'drafted',
  },
  {
    id: 'a4',
    actor: 'system',
    title: 'Onay bildirimi gonderildi',
    timestamp: '17.01.2024 09:05',
    summary: 'Yonetim ekibine e-posta bildirimi gonderildi.',
    status: 'executed',
  },
];

export const Default: Story = {
  args: {
    title: 'Denetim Inceleme Paneli',
    description:
      'Onay kontrol noktasi, kaynak kanit belgeleri ve denetim iz sureci tek inceleme yuzeyinde goruntulenir.',
    checkpoint: ornekCheckpoint,
    citations: ornekCitations,
    auditItems: ornekAuditItems,
  },
};

export const Approved: Story = {
  args: {
    title: 'Onaylanan Inceleme',
    description: 'Tum adimlar tamamlanmis ve onaylanmis surec.',
    checkpoint: {
      ...ornekCheckpoint,
      status: 'approved' as const,
      steps: ornekCheckpoint.steps?.map((s) => ({ ...s, status: 'approved' as const })),
    },
    citations: ornekCitations,
    auditItems: [
      ...ornekAuditItems,
      {
        id: 'a5',
        actor: 'human' as const,
        title: 'Nihai onay verildi',
        timestamp: '20.01.2024 16:45',
        summary: 'Denetim Muduru tarafindan surec onaylandi.',
        status: 'approved' as const,
      },
    ],
  },
};

export const Rejected: Story = {
  args: {
    title: 'Reddedilen Inceleme',
    description: 'Eksiklikler nedeniyle reddedilmis surec.',
    checkpoint: {
      ...ornekCheckpoint,
      status: 'rejected' as const,
      steps: [
        { key: '1', label: 'Belge kontrolu', status: 'approved' as const },
        { key: '2', label: 'Finansal dogrulama', status: 'blocked' as const },
        { key: '3', label: 'Risk degerlendirmesi', status: 'todo' as const },
        { key: '4', label: 'Yonetim onay', status: 'todo' as const },
      ],
    },
    citations: ornekCitations.slice(0, 2),
    auditItems: [
      ...ornekAuditItems.slice(0, 2),
      {
        id: 'a-rej',
        actor: 'human' as const,
        title: 'Basvuru reddedildi',
        timestamp: '18.01.2024 11:00',
        summary: 'Finansal tablolarda tutarsizlik tespit edildi.',
        status: 'rejected' as const,
      },
    ],
  },
};

export const MinimalData: Story = {
  args: {
    title: 'Basit Inceleme',
    checkpoint: {
      title: 'Hizli Onay',
      summary: 'Tek adimli onay sureci.',
      status: 'pending' as const,
      steps: [
        { key: '1', label: 'Yonetici onay', status: 'ready' as const },
      ],
      primaryActionLabel: 'Onayla',
    },
    citations: [
      {
        id: 'c-min',
        title: 'Basvuru Formu',
        excerpt: 'Standart basvuru formu doldurulmus ve imzalanmistir.',
        source: 'Basvuru Sistemi',
        kind: 'doc' as const,
      },
    ],
    auditItems: [
      {
        id: 'a-min',
        actor: 'system' as const,
        title: 'Basvuru olusturuldu',
        timestamp: '19.01.2024 08:00',
        status: 'executed' as const,
      },
    ],
  },
};

export const NoCitations: Story = {
  args: {
    title: 'Referanssiz Inceleme',
    checkpoint: ornekCheckpoint,
    citations: [],
    auditItems: ornekAuditItems,
  },
};

export const NoAuditTrail: Story = {
  args: {
    title: 'Iz Sureci Olmayan Inceleme',
    checkpoint: ornekCheckpoint,
    citations: ornekCitations,
    auditItems: [],
  },
};
