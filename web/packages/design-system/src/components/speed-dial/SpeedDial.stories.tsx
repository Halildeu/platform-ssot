import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SpeedDial } from './SpeedDial';

const EditIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;
const ShareIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>;
const DeleteIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>;

const actions = [
  { icon: <EditIcon />, label: 'Duzenle', onClick: () => console.log('edit') },
  { icon: <ShareIcon />, label: 'Paylas', onClick: () => console.log('share') },
  { icon: <DeleteIcon />, label: 'Sil', onClick: () => console.log('delete') },
];

const meta: Meta<typeof SpeedDial> = {
  title: 'Components/Components/SpeedDial',
  component: SpeedDial,
  tags: ['autodocs'],
  argTypes: {
    direction: { control: 'select', options: ['up', 'down', 'left', 'right'] },
    triggerMode: { control: 'select', options: ['click', 'hover'] },
  },
  decorators: [(Story) => <div style={{ padding: '6rem', display: 'flex', justifyContent: 'center' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof SpeedDial>;

export const Default: Story = { args: { actions, direction: 'up' } };
export const Down: Story = { args: { actions, direction: 'down' } };
export const Left: Story = { args: { actions, direction: 'left' } };
export const Right: Story = { args: { actions, direction: 'right' } };
export const HoverTrigger: Story = { args: { actions, triggerMode: 'hover' } };

export const AllDirections: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-24" style={{ padding: '4rem' }}>
      <div className="flex justify-end items-end"><SpeedDial actions={actions} direction="up" /></div>
      <div className="flex justify-start items-start"><SpeedDial actions={actions} direction="down" /></div>
      <div className="flex justify-end items-start"><SpeedDial actions={actions} direction="left" /></div>
      <div className="flex justify-start items-end"><SpeedDial actions={actions} direction="right" /></div>
    </div>
  ),
};
