import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import {
  OptionLabel,
  Radio,
  withRadioGroup,
  type RadioSlotProps,
} from '../src';

const RadioGroup = withRadioGroup({ Radio });

const OPTIONS = [
  { value: 's', label: 'S' },
  { value: 'm', label: 'M' },
  { value: 'l', label: 'L' },
  { value: 'xl', label: 'XL（disabled）', disabled: true },
];

// 見た目は持たないので、並べ方はストーリーの側で付ける
const COLUMN = { display: 'grid', gap: 4, justifyItems: 'start' } as const;

const meta = {
  title: 'withRadioGroup',
  component: RadioGroup<string>,
  args: {
    options: OPTIONS,
    defaultValue: 'm',
    disabled: false,
    readOnly: false,
    required: false,
    invalid: false,
    unlistedPlacement: 'end',
    keepUnlisted: false,
    style: COLUMN,
  },
  argTypes: {
    unlistedPlacement: {
      control: 'inline-radio',
      options: ['hidden', 'start', 'end'],
    },
  },
} satisfies Meta<typeof RadioGroup<string>>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `withRadioGroup({ Radio })` で作ったもの（非制御）。Tab キーでグループに入り、矢印キーで選ぶ
 */
export const Default: Story = {};

/**
 * 制御。何も選んでいないときは `null`。表示の部品（`OptionLabel`）に同じ props を渡すと、同じものが見える
 */
export const Controlled: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<string | null>(null);
    return (
      <div style={{ display: 'grid', gap: 8, fontFamily: 'sans-serif' }}>
        <RadioGroup
          {...args}
          defaultValue={undefined}
          value={value}
          onValueChange={setValue}
        />
        <span>
          OptionLabel:{' '}
          <OptionLabel
            options={args.options}
            value={value}
            unlistedPlacement={args.unlistedPlacement}
            placeholder="（未選択）"
          />
        </span>
        <span>value: {JSON.stringify(value)}</span>
        <button
          type="button"
          style={{ justifySelf: 'start' }}
          onClick={() => setValue(null)}
        >
          未選択に戻す
        </button>
      </div>
    );
  },
};

/**
 * 選択肢外の値（`value` に入っているが `options` に無い値）。
 * `unlistedPlacement`・`keepUnlisted` を切り替えて確かめる
 */
export const Unlisted: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<string | null>('xxl');
    return (
      <div style={{ display: 'grid', gap: 8, fontFamily: 'sans-serif' }}>
        <RadioGroup
          {...args}
          defaultValue={undefined}
          value={value}
          onValueChange={setValue}
        />
        <span>
          OptionLabel:{' '}
          <OptionLabel
            options={args.options}
            value={value}
            unlistedPlacement={args.unlistedPlacement}
            placeholder="（表示するものが無い）"
          />
        </span>
        <span>value: {JSON.stringify(value)}</span>
      </div>
    );
  },
};

/**
 * 自分の部品を組み込む例（押して選ぶボタン）。HTML のラジオボタンではないので `name` を使わず、キーボードの動きは持たない
 */
function SegmentButton({
  value,
  onValueChange,
  disabled,
  children,
}: RadioSlotProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={value}
      disabled={disabled}
      onClick={() => onValueChange(true)}
      style={{
        padding: '4px 12px',
        border: '1px solid #888',
        background: value ? '#333' : '#fff',
        color: value ? '#fff' : '#333',
      }}
    >
      {children}
    </button>
  );
}

const SegmentGroup = withRadioGroup({ Radio: SegmentButton });

export const CustomPart: Story = {
  render: (args) => (
    <SegmentGroup
      {...args}
      style={{ display: 'flex', fontFamily: 'sans-serif' }}
    />
  ),
};
