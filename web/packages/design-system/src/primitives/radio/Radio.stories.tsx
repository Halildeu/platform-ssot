import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Radio, RadioGroup } from './Radio';

const meta: Meta<typeof RadioGroup> = {
  title: 'Components/Primitives/Radio',
  component: RadioGroup,
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
  },
};
export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('yillik');
    return (
      <RadioGroup name="plan" value={value} onChange={setValue}>
        <Radio value="aylik" label="Aylik Plan" description="Her ay yenilenir" />
        <Radio value="yillik" label="Yillik Plan" description="%20 indirimli" />
        <Radio value="kurumsal" label="Kurumsal Plan" description="Ozel fiyatlandirma" />
      </RadioGroup>
    );
  },
};

export const Horizontal: Story = {
  render: () => {
    const [value, setValue] = useState('tr');
    return (
      <RadioGroup name="dil" value={value} onChange={setValue} direction="horizontal">
        <Radio value="tr" label="Turkce" />
        <Radio value="en" label="Ingilizce" />
        <Radio value="de" label="Almanca" />
      </RadioGroup>
    );
  },
};

export const WithDescriptions: Story = {
  render: () => {
    const [value, setValue] = useState('standart');
    return (
      <RadioGroup name="teslimat" value={value} onChange={setValue}>
        <Radio
          value="standart"
          label="Standart Teslimat"
          description="3-5 is gunu icinde teslim edilir"
        />
        <Radio
          value="hizli"
          label="Hizli Teslimat"
          description="1-2 is gunu icinde teslim edilir"
        />
        <Radio
          value="ayni_gun"
          label="Ayni Gun Teslimat"
          description="Saat 14:00'a kadar verilen siparisler"
        />
      </RadioGroup>
    );
  },
};

export const DisabledOption: Story = {
  render: () => {
    const [value, setValue] = useState('aktif');
    return (
      <RadioGroup name="durum" value={value} onChange={setValue}>
        <Radio value="aktif" label="Aktif" />
        <Radio value="pasif" label="Pasif" />
        <Radio value="arsiv" label="Arsivlendi" disabled />
      </RadioGroup>
    );
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div style={{ marginBottom: 8, fontSize: 12, fontWeight: 600 }}>Kucuk</div>
        <RadioGroup name="s-sm" value="a" direction="horizontal">
          <Radio value="a" label="Secenek A" size="sm" />
          <Radio value="b" label="Secenek B" size="sm" />
        </RadioGroup>
      </div>
      <div>
        <div style={{ marginBottom: 8, fontSize: 12, fontWeight: 600 }}>Orta</div>
        <RadioGroup name="s-md" value="a" direction="horizontal">
          <Radio value="a" label="Secenek A" size="md" />
          <Radio value="b" label="Secenek B" size="md" />
        </RadioGroup>
      </div>
      <div>
        <div style={{ marginBottom: 8, fontSize: 12, fontWeight: 600 }}>Buyuk</div>
        <RadioGroup name="s-lg" value="a" direction="horizontal">
          <Radio value="a" label="Secenek A" size="lg" />
          <Radio value="b" label="Secenek B" size="lg" />
        </RadioGroup>
      </div>
    </div>
  ),
};
