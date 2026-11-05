import { fireEvent, render, screen, within } from '@testing-library/react';
import { createRef, useState } from 'react';
import { describe, expect, it } from 'vitest';
import TextInput from '../../textInput/TextInput';
import type { TableColumn } from '../types';
import Table from './Table';

type Member = { id: string; name: string; age: number };

const members: Member[] = [
  { id: '1', name: '山田', age: 20 },
  { id: '2', name: '佐藤', age: 30 },
];

const columns: TableColumn<Member>[] = [
  {
    key: 'name',
    label: '名前',
    renderValue: (props) => <TextInput {...props} />,
  },
  { key: 'age', label: '年齢' },
];

describe('Table', () => {
  it('列の見出しを th に、セルを td に描く', () => {
    render(<Table value={members} columns={columns} />);

    const headers = screen.getAllByRole('columnheader');
    expect(headers.map((th) => th.textContent)).toEqual(['名前', '年齢']);
    expect(headers[0]?.getAttribute('scope')).toBe('col');

    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(3);
    expect(
      within(rows[2]!)
        .getAllByRole('cell')
        .map((td) => td.textContent),
    ).toEqual(['', '30']);
  });

  it('セルの入力欄を列の見出しで名付ける', () => {
    render(<Table value={members} columns={columns} />);

    const inputs = screen.getAllByRole('textbox', { name: '名前' });
    expect(inputs.map((input) => (input as HTMLInputElement).value)).toEqual([
      '山田',
      '佐藤',
    ]);
  });

  it('useState とつなぐと、確定したセルの値が配列に入る', () => {
    function App() {
      const [value, setValue] = useState(members);
      return (
        <>
          <Table value={value} onValueChange={setValue} columns={columns} />
          <output>{value.map((member) => member.name).join(',')}</output>
        </>
      );
    }
    render(<App />);

    const input = screen.getAllByRole('textbox')[1]!;
    fireEvent.change(input, { target: { value: '鈴木' } });
    fireEvent.blur(input);

    expect(screen.getByRole('status').textContent).toBe('山田,鈴木');
  });

  it('その他の props と ref は table に渡す', () => {
    const ref = createRef<HTMLTableElement>();
    render(
      <Table
        ref={ref}
        value={members}
        columns={columns}
        className="mine"
        aria-label="メンバー"
      />,
    );

    const table = screen.getByRole('table', { name: 'メンバー' });
    expect(table.className).toBe('mine');
    expect(ref.current).toBe(table);
  });
});
