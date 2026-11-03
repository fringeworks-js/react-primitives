import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { TextInput } from '../src';

const meta = {
  title: 'TextInput',
  component: TextInput,
  args: {
    placeholder: '名前',
    valueChangeTiming: 'commit',
    disabled: false,
    readOnly: false,
    required: false,
    invalid: false,
  },
  argTypes: {
    valueChangeTiming: {
      control: 'inline-radio',
      options: ['commit', 'input'],
    },
  },
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 確定した値と、入力中の文字列（`onInputValueChange`）を並べて見る。
 * フォーカスが外れたとき・Enter で確定し、IME の変換を決める Enter では確定しない。Esc で確定した値に戻る
 */
export const Controlled: Story = {
  render: function Render(args) {
    const [value, setValue] = useState('');
    const [text, setText] = useState('');
    return (
      <div style={{ display: 'grid', gap: 8, fontFamily: 'sans-serif' }}>
        <div>
          <TextInput
            {...args}
            value={value}
            onValueChange={setValue}
            onInputValueChange={setText}
          />
        </div>
        <span>value（確定）: {JSON.stringify(value)}</span>
        <span>onInputValueChange（入力中）: {JSON.stringify(text)}</span>
      </div>
    );
  },
};
