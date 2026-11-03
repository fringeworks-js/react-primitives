import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button, withButtonGroup } from '../src';

const ButtonGroup = withButtonGroup({ Button });

const OPTIONS = [
  { value: 'copy', label: 'コピー' },
  { value: 'paste', label: '貼り付け' },
  { value: 'delete', label: '削除（disabled）', disabled: true },
];

const meta = {
  title: 'withButtonGroup',
  component: ButtonGroup<string>,
  args: {
    options: OPTIONS,
    disabled: false,
    // 見た目は持たないので、並べ方はストーリーの側で付ける
    style: { display: 'flex', gap: 8 },
  },
} satisfies Meta<typeof ButtonGroup<string>>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `withButtonGroup({ Button })` で作ったもの。react-primitives の `Button` をそのまま組み込める
 */
export const Default: Story = {};

/**
 * 単独の `Button` とボタングループで、同じハンドラーを使える（W-4 の M1）
 */
export const SharedHandler: Story = {
  render: function Render(args) {
    const [log, setLog] = useState<string[]>([]);
    const run = (value: string) => setLog((prev) => [...prev, value]);
    return (
      <div style={{ display: 'grid', gap: 8, fontFamily: 'sans-serif' }}>
        <div>
          <Button value="save" onMainAction={run}>
            保存
          </Button>
        </div>
        <ButtonGroup {...args} onMainAction={run} />
        <span>onMainAction: {JSON.stringify(log)}</span>
      </div>
    );
  },
};
