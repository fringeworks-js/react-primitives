import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Checkbox, OptionLabels, withCheckboxGroup } from '../src';

const CheckboxGroup = withCheckboxGroup({ Checkbox });

const OPTIONS = [
  { value: 'apple', label: 'りんご' },
  { value: 'orange', label: 'みかん' },
  { value: 'grape', label: 'ぶどう' },
];

const meta = {
  title: 'OptionLabels',
  component: OptionLabels<string>,
  args: {
    options: OPTIONS,
    value: ['grape', 'apple'],
    unlistedPlacement: 'end',
    separator: '、',
    placeholder: '（なし）',
    style: { fontFamily: 'sans-serif' },
  },
  argTypes: {
    unlistedPlacement: {
      control: 'inline-radio',
      options: ['hidden', 'start', 'end'],
    },
  },
} satisfies Meta<typeof OptionLabels<string>>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 選んだ値のラベルを、選択肢の順に並べて表示する
 */
export const Default: Story = {};

/**
 * 入力の部品と同じ props を渡すと、同じものが見える（選択肢外の値の位置や、`'hidden'` で出さないことも同じ）
 */
export const WithInput: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<string[]>(['orange', 'melon']);
    const shared = {
      options: args.options,
      value,
      unlistedPlacement: args.unlistedPlacement,
    };
    return (
      <div style={{ display: 'grid', gap: 8, fontFamily: 'sans-serif' }}>
        <CheckboxGroup
          {...shared}
          onValueChange={setValue}
          style={{ display: 'grid', gap: 4, justifyItems: 'start' }}
        />
        <span>
          OptionLabels:{' '}
          <OptionLabels
            {...shared}
            separator={args.separator}
            placeholder={args.placeholder}
          />
        </span>
      </div>
    );
  },
};
