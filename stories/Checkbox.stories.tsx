import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Checkbox } from '../src';

const meta = {
  title: 'Checkbox',
  component: Checkbox,
  args: {
    children: 'りんご',
    disabled: false,
    readOnly: false,
    required: false,
    invalid: false,
    indeterminate: false,
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 非制御（`defaultValue`）。見た目は持たないので、ブラウザーの標準のチェックボックス
 */
export const Uncontrolled: Story = {
  args: { defaultValue: true },
};

/**
 * 制御（`value` と `onValueChange`）
 */
export const Controlled: Story = {
  render: function Render(args) {
    const [value, setValue] = useState(false);
    return (
      <div style={{ display: 'grid', gap: 8, fontFamily: 'sans-serif' }}>
        <Checkbox {...args} value={value} onValueChange={setValue} />
        <span>value: {String(value)}</span>
      </div>
    );
  },
};

/**
 * 状態の並び（不確定・disabled・readOnly・invalid）
 */
export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 8, fontFamily: 'sans-serif' }}>
      <Checkbox indeterminate>不確定（indeterminate）</Checkbox>
      <Checkbox disabled>disabled</Checkbox>
      <Checkbox defaultValue disabled>
        disabled（チェックあり）
      </Checkbox>
      <Checkbox defaultValue readOnly>
        readOnly（押しても変わらない）
      </Checkbox>
      <Checkbox invalid>invalid（aria-invalid が付く）</Checkbox>
    </div>
  ),
};
