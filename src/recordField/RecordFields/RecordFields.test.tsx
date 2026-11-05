import { fireEvent, render, screen } from '@testing-library/react';
import { createRef, useState } from 'react';
import { describe, expect, it } from 'vitest';
import Checkbox from '../../checkbox/Checkbox';
import TextInput from '../../textInput/TextInput';
import type { RecordField } from '../types';
import RecordFields from './RecordFields';

type Member = { id: string; name: string; active: boolean };

const member: Member = { id: '1', name: '山田', active: false };

const fields: RecordField<Member>[] = [
  { key: 'id', label: 'ID' },
  {
    key: 'name',
    label: '名前',
    renderValue: (props) => <TextInput {...props} />,
  },
  {
    key: 'active',
    label: '有効',
    renderValue: (props) => <Checkbox {...props} />,
  },
];

describe('RecordFields', () => {
  it('項目ごとにラベルと値を並べる', () => {
    const { container } = render(
      <RecordFields value={member} fields={fields} />,
    );

    const items = container.firstElementChild!.children;
    expect(items).toHaveLength(3);
    expect(items[0]?.children[0]?.textContent).toBe('ID');
    expect(items[0]?.children[1]?.textContent).toBe('1');
  });

  it('値の部品を、項目のラベルで名付ける', () => {
    render(<RecordFields value={member} fields={fields} />);

    expect(
      (screen.getByRole('textbox', { name: '名前' }) as HTMLInputElement).value,
    ).toBe('山田');
    expect(screen.getByRole('checkbox', { name: '有効' })).toBeDefined();
  });

  it('useState とつなぐと、確定した項目の値がレコードに入る', () => {
    function App() {
      const [value, setValue] = useState(member);
      return (
        <>
          <RecordFields
            value={value}
            onValueChange={setValue}
            fields={fields}
          />
          <output>{`${value.name},${value.active}`}</output>
        </>
      );
    }
    render(<App />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '鈴木' } });
    fireEvent.blur(input);
    fireEvent.click(screen.getByRole('checkbox'));

    expect(screen.getByRole('status').textContent).toBe('鈴木,true');
  });

  it('その他の props と ref は div に渡す', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <RecordFields
        ref={ref}
        value={member}
        fields={fields}
        role="group"
        aria-label="メンバー"
        className="mine"
      />,
    );

    const root = screen.getByRole('group', { name: 'メンバー' });
    expect(root.className).toBe('mine');
    expect(ref.current).toBe(root);
  });
});
