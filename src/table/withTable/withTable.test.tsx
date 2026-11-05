import { fireEvent, render, screen, within } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import TextInput from '../../textInput/TextInput';
import type { TableColumn, TableRowContext } from '../types';
import type {
  TableCellSlotProps,
  TableRenderRowProps,
  TableRowSlotProps,
  TableSectionSlotProps,
  TableSlotProps,
} from './types';
import withTable from './withTable';

type Member = { id: string; name: string };

const members: Member[] = [
  { id: '1', name: '山田' },
  { id: '2', name: '佐藤' },
];

const columns: TableColumn<Member>[] = [
  {
    key: 'name',
    label: '名前',
    renderValue: (props) => <TextInput {...props} />,
  },
];

describe('withTable', () => {
  it('部品を省略すると、素の要素で描く', () => {
    const Table = withTable();
    const { container } = render(<Table value={members} columns={columns} />);

    expect(container.querySelector('table > thead > tr > th')).not.toBeNull();
    expect(container.querySelectorAll('table > tbody > tr > td')).toHaveLength(
      2,
    );
  });

  it('組み込んだ部品で要素を描く。部品は要素の props と children を受け取る', () => {
    const Body = (props: TableSectionSlotProps) => (
      <tbody {...props} data-part="body" />
    );
    const Row = (props: TableRowSlotProps) => <tr {...props} data-part="row" />;
    const Cell = (props: TableCellSlotProps) => (
      <td {...props} data-part="cell" />
    );
    const Table = withTable({ Body, Row, Cell });
    const { container } = render(
      <Table
        value={members}
        columns={columns}
        partsProps={{ row: ({ path }) => ({ className: `row-${path[0]}` }) }}
      />,
    );

    expect(container.querySelector('tbody')?.dataset.part).toBe('body');
    const rows = container.querySelectorAll<HTMLElement>('tbody > tr');
    expect([...rows].map((tr) => [tr.dataset.part, tr.className])).toEqual([
      ['row', 'row-1'],
      ['row', 'row-2'],
    ]);
    expect(rows[0]?.querySelector('td')?.dataset.part).toBe('cell');
    expect(
      within(rows[0]!).getByRole('textbox', { name: '名前' }),
    ).toBeDefined();
  });

  it('renderRow で行を描く。props と、行のパス・位置・行を受け取る', () => {
    const renderRow = vi.fn(
      (
        props: TableRenderRowProps,
        { path, index }: TableRowContext<Member>,
      ) => <tr {...props} data-path={path.join('/')} data-index={index} />,
    );
    const Table = withTable();
    const { container } = render(
      <Table
        value={members}
        columns={columns}
        partsProps={{ row: { className: 'r' } }}
        renderRow={renderRow}
      />,
    );

    const rows = container.querySelectorAll<HTMLElement>('tbody > tr');
    expect([...rows].map((tr) => tr.dataset.path)).toEqual(['1', '2']);
    expect(rows[1]?.dataset.index).toBe('1');
    expect(rows[1]?.className).toBe('r');
    expect(renderRow.mock.calls[1]?.[1].record).toBe(members[1]);
  });

  it('partsProps でそれぞれの部品に props を渡す。見出し・セルは列の props を重ねる', () => {
    const Table = withTable();
    const { container } = render(
      <Table
        value={members}
        columns={[
          {
            key: 'name',
            label: '名前',
            headerProps: { className: 'col-th' },
            cellProps: ({ value }) => ({ className: `col-${value}` }),
          },
          { key: 'id', label: 'ID' },
        ]}
        partsProps={{
          head: { className: 'head' },
          headerRow: { className: 'header-row' },
          headerCell: ({ key, index }) => ({
            className: `th-${key}-${index}`,
            title: key,
          }),
          body: { className: 'body' },
          cell: ({ path }) => ({ className: 'td', title: path.join('/') }),
        }}
      />,
    );

    expect(container.querySelector('thead')?.className).toBe('head');
    expect(container.querySelector('thead > tr')?.className).toBe('header-row');
    const ths = [...container.querySelectorAll('th')];
    expect(ths.map((th) => [th.className, th.title])).toEqual([
      ['th-name-0 col-th', 'name'],
      ['th-id-1', 'id'],
    ]);
    expect(ths[0]?.getAttribute('scope')).toBe('col');
    expect(container.querySelector('tbody')?.className).toBe('body');
    const tds = [
      ...container.querySelectorAll<HTMLElement>('tbody > tr:first-child > td'),
    ];
    expect(tds.map((td) => [td.className, td.title])).toEqual([
      ['td col-山田', '1/name'],
      ['td', '1/id'],
    ]);
  });

  it('値が変わった行だけを描き直す', () => {
    const renderedPaths = vi.fn();
    const renderRow = (
      props: TableRenderRowProps,
      { path }: TableRowContext<Member>,
    ) => {
      renderedPaths(path[0]);
      return <tr {...props} />;
    };
    const Table = withTable();
    function App() {
      const [value, setValue] = useState(members);
      return (
        <Table
          value={value}
          onValueChange={setValue}
          columns={columns}
          renderRow={renderRow}
        />
      );
    }
    render(<App />);
    renderedPaths.mockClear();

    const input = screen.getAllByRole('textbox')[1]!;
    fireEvent.change(input, { target: { value: '鈴木' } });
    fireEvent.blur(input);

    expect(renderedPaths.mock.calls).toEqual([['2']]);
    expect((input as HTMLInputElement).value).toBe('鈴木');
  });

  describe('組み込んだ部品の props の型', () => {
    // 必須のプロパティを持つ行（デザインシステムの部品を想定）
    function ToneRow({
      tone,
      ...props
    }: TableRowSlotProps & { tone: 'plain' | 'muted' }) {
      return <tr {...props} data-tone={tone} />;
    }
    function Frame({
      caption,
      children,
      ...props
    }: TableSlotProps & { caption?: string }) {
      return (
        <table {...props}>
          {caption && <caption>{caption}</caption>}
          {children}
        </table>
      );
    }
    const ToneTable = withTable({ Table: Frame, Row: ToneRow });

    it('ルートは <table> の部品の props、partsProps.row・renderRow は行の部品の props になる', () => {
      const { container } = render(
        <ToneTable
          value={members}
          columns={columns}
          caption="メンバー"
          partsProps={{
            row: ({ index }) => ({ tone: index === 0 ? 'plain' : 'muted' }),
          }}
          renderRow={(props) => <ToneRow {...props} />}
        />,
      );

      expect(container.querySelector('caption')?.textContent).toBe('メンバー');
      expect(
        [...container.querySelectorAll<HTMLElement>('tbody > tr')].map(
          (tr) => tr.dataset.tone,
        ),
      ).toEqual(['plain', 'muted']);
    });

    it('部品に必須のプロパティがあれば、型の上でも必須になる', () => {
      const missing = {
        // @ts-expect-error 行の tone を渡す partsProps が無い
        element: <ToneTable value={members} columns={columns} />,
      };
      const wrongRow: Parameters<typeof ToneTable>[0]['partsProps']['row'] = {
        // @ts-expect-error tone に無い値
        tone: 'loud',
      };

      expect(missing.element).toBeDefined();
      expect(wrongRow).toBeDefined();
    });
  });

  it('displayName に組み込んだ部品の名前を入れる', () => {
    function AppRow(props: TableRowSlotProps) {
      return <tr {...props} />;
    }

    expect(withTable({ Row: AppRow, Cell: 'td' }).displayName).toBe(
      'withTable(AppRow, td)',
    );
  });
});
