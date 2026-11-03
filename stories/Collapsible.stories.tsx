import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Collapsible } from '../src';

const meta = {
  title: 'Collapsible',
  component: Collapsible,
  args: {
    summary: '詳しい条件',
    children: 'ここに、開いたときに見える中身を置きます。',
    disabled: false,
    style: { fontFamily: 'sans-serif' },
  },
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 非制御。見た目は持たないので、見出しの印はブラウザーの標準のまま
 */
export const Uncontrolled: Story = {};

/**
 * 制御。外のボタンからも開閉できる。ページ内検索で中の文字を探すと、ブラウザーが開き、`onOpenChange` も呼ばれる
 */
export const Controlled: Story = {
  render: function Render(args) {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ display: 'grid', gap: 8, fontFamily: 'sans-serif' }}>
        <div>
          <button type="button" onClick={() => setOpen(!open)}>
            外から{open ? '閉じる' : '開く'}
          </button>
        </div>
        <Collapsible {...args} open={open} onOpenChange={setOpen} />
        <span>open: {String(open)}</span>
      </div>
    );
  },
};
