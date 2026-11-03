import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Checkbox, withCheckboxGroup, type CheckboxSlotProps } from '../src';

const CheckboxGroup = withCheckboxGroup({ Checkbox });

const OPTIONS = [
  { value: 'apple', label: 'りんご' },
  { value: 'orange', label: 'みかん' },
  { value: 'grape', label: 'ぶどう' },
  { value: 'peach', label: 'もも（disabled）', disabled: true },
];

// 見た目は持たないので、並べ方はストーリーの側で付ける
const COLUMN = { display: 'grid', gap: 4, justifyItems: 'start' } as const;

const meta = {
  title: 'withCheckboxGroup',
  component: CheckboxGroup<string>,
  args: {
    options: OPTIONS,
    defaultValue: ['apple'],
    disabled: false,
    readOnly: false,
    invalid: false,
    showSelectAll: false,
    selectAllLabel: 'すべて',
    unlistedPlacement: 'end',
    keepUnlisted: false,
    selectAllIncludesUnlisted: false,
    style: COLUMN,
  },
  argTypes: {
    unlistedPlacement: {
      control: 'inline-radio',
      options: ['hidden', 'start', 'end'],
    },
  },
} satisfies Meta<typeof CheckboxGroup<string>>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `withCheckboxGroup({ Checkbox })` で作ったもの（非制御）
 */
export const Default: Story = {};

/**
 * すべて選ぶ（disabled の選択肢は数えず、状態も変えない）
 */
export const SelectAll: Story = {
  args: { showSelectAll: true },
};

/**
 * 制御。選んだ値は表示の順に並ぶ
 */
export const Controlled: Story = {
  args: { showSelectAll: true },
  render: function Render(args) {
    const [value, setValue] = useState<string[]>([]);
    return (
      <div style={{ display: 'grid', gap: 8, fontFamily: 'sans-serif' }}>
        <CheckboxGroup
          {...args}
          defaultValue={undefined}
          value={value}
          onValueChange={setValue}
        />
        <span>value: {JSON.stringify(value)}</span>
      </div>
    );
  },
};

/**
 * 選択肢外の値（`value` に入っているが `options` に無い値）。
 * `unlistedPlacement`・`keepUnlisted`・`selectAllIncludesUnlisted` を切り替えて確かめる
 */
export const Unlisted: Story = {
  args: {
    defaultValue: ['apple', 'melon', 'lemon'],
    showSelectAll: true,
  },
  render: function Render(args) {
    const [value, setValue] = useState<string[]>(['apple', 'melon', 'lemon']);
    return (
      <div style={{ display: 'grid', gap: 8, fontFamily: 'sans-serif' }}>
        <CheckboxGroup
          {...args}
          defaultValue={undefined}
          value={value}
          onValueChange={setValue}
        />
        <span>value: {JSON.stringify(value)}</span>
      </div>
    );
  },
};

/**
 * 自分の部品を組み込む例（押すと切り替わるボタン）
 */
function ToggleButton({
  value,
  onValueChange,
  disabled,
  readOnly,
  indeterminate,
  children,
}: CheckboxSlotProps) {
  return (
    <button
      type="button"
      aria-pressed={indeterminate ? 'mixed' : value}
      disabled={disabled}
      onClick={() => {
        if (!readOnly) {
          onValueChange(!value);
        }
      }}
      style={{
        padding: '4px 12px',
        borderRadius: 16,
        border: '1px solid #888',
        background: value ? '#333' : indeterminate ? '#bbb' : '#fff',
        color: value ? '#fff' : '#333',
      }}
    >
      {children ?? 'すべて'}
    </button>
  );
}

const ToggleButtonGroup = withCheckboxGroup({ Checkbox: ToggleButton });

export const CustomPart: Story = {
  args: { showSelectAll: true },
  render: (args) => (
    <ToggleButtonGroup
      {...args}
      style={{ display: 'flex', gap: 8, fontFamily: 'sans-serif' }}
    />
  ),
};
