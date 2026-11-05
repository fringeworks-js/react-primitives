import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { TableColumn } from '../types';
import useTable from './useTable';

type Member = { id: string | number; name: string; age: number | null };

const columns: TableColumn<Member>[] = [
  { key: 'name', label: '名前' },
  { key: 'age', label: '年齢' },
];

const members: Member[] = [
  { id: '1', name: '山田', age: 20 },
  { id: 2, name: '佐藤', age: null },
];

describe('useTable', () => {
  describe('列', () => {
    it('列の見出しに位置から作った id を付け、th の props を作る', () => {
      const { result } = renderHook(() =>
        useTable({ value: members, columns }),
      );

      const [name, age] = result.current.displayColumns;
      expect(name).toMatchObject({ key: 'name', label: '名前' });
      expect(name?.labelId).not.toBe(age?.labelId);
      expect(name?.thProps).toEqual({
        id: name?.labelId,
        scope: 'col',
      });
    });

    it('見出しの文字寄せは headerAlign、省略すると align。headerProps を重ねる', () => {
      const { result } = renderHook(() =>
        useTable({
          value: members,
          columns: [
            { key: 'name', label: '名前', align: 'end' },
            {
              key: 'age',
              label: '年齢',
              align: 'end',
              headerAlign: 'center',
              headerProps: { className: 'h', style: { color: 'red' } },
            },
          ],
        }),
      );

      const [name, age] = result.current.displayColumns;
      expect(name?.thProps.style).toEqual({ textAlign: 'end' });
      expect(age?.thProps).toMatchObject({
        className: 'h',
        style: { textAlign: 'center', color: 'red' },
      });
    });

    it('列が変わらなければ、getCells は同じ関数', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useTable({ value, columns }),
        { initialProps: { value: members } },
      );
      const first = result.current.getCells;

      rerender({ value: [...members] });

      expect(result.current.getCells).toBe(first);
    });
  });

  describe('行とセル', () => {
    it('行は id を文字列に揃え、位置と元の行を持つ', () => {
      const { result } = renderHook(() =>
        useTable({ value: members, columns }),
      );

      expect(result.current.rows).toEqual([
        { id: '1', index: 0, record: members[0] },
        { id: '2', index: 1, record: members[1] },
      ]);
    });

    it('getCells は列の順にセルを作る。renderValue を省略した列は、値を文字にする', () => {
      const { result } = renderHook(() =>
        useTable({ value: members, columns }),
      );

      const { displayColumns, rows, getCells } = result.current;
      const cells = getCells(rows[1]!);
      expect(cells.map((c) => c.content)).toEqual(['佐藤', '']);
      expect(cells[1]).toMatchObject({
        key: 'age',
        labelId: displayColumns[1]?.labelId,
        props: {
          value: null,
          'aria-labelledby': displayColumns[1]?.labelId,
        },
        context: { path: ['2', 'age'], record: members[1] },
      });
    });

    it('renderValue に props と context を渡し、結果を content にする', () => {
      const renderValue = vi.fn(({ value }: { value: string }) => `[${value}]`);
      const { result } = renderHook(() =>
        useTable({
          value: members,
          columns: [{ key: 'name', label: '名前', renderValue }],
        }),
      );

      const [cell] = result.current.getCells(result.current.rows[0]!);
      expect(cell?.content).toBe('[山田]');
      expect(renderValue).toHaveBeenCalledWith(cell?.props, cell?.context);
    });

    it('cellProps は値か関数で受け取り、align の文字寄せに重ねる', () => {
      const { result } = renderHook(() =>
        useTable({
          value: members,
          columns: [
            { key: 'name', label: '名前', cellProps: { className: 'c' } },
            {
              key: 'age',
              label: '年齢',
              align: 'end',
              cellProps: ({ value, path }) => ({
                className: value === null ? 'empty' : `age-${path[0]}`,
              }),
            },
          ],
        }),
      );

      const { rows, getCells } = result.current;
      expect(getCells(rows[0]!).map((c) => c.tdProps)).toEqual([
        { className: 'c' },
        { className: 'age-1', style: { textAlign: 'end' } },
      ]);
      expect(getCells(rows[1]!)[1]?.tdProps.className).toBe('empty');
    });

    it('defaultValue を省略すると空の配列', () => {
      const { result } = renderHook(() => useTable<Member>({ columns }));

      expect(result.current.value).toEqual([]);
      expect(result.current.rows).toEqual([]);
    });
  });

  describe('変更', () => {
    const cellOf = (
      current: ReturnType<typeof useTable<Member>>,
      row: number,
      column: number,
    ) => current.getCells(current.rows[row]!)[column]!;

    it('セルの値が確定したら、行を差し替えた配列と details で知らせる', () => {
      const onValueChange = vi.fn();
      const { result } = renderHook(() =>
        useTable({ value: members, columns, onValueChange }),
      );

      act(() => {
        cellOf(result.current, 1, 0).props.onValueChange('鈴木');
      });

      expect(onValueChange).toHaveBeenCalledExactlyOnceWith(
        [members[0], { id: 2, name: '鈴木', age: null }],
        { type: 'update', path: ['2', 'name'] },
      );
      const [next] = onValueChange.mock.calls[0] as [Member[]];
      expect(next[0]).toBe(members[0]);
    });

    it('値が変わらなければ知らせない', () => {
      const onValueChange = vi.fn();
      const { result } = renderHook(() =>
        useTable({ value: members, columns, onValueChange }),
      );

      act(() => {
        cellOf(result.current, 0, 0).props.onValueChange('山田');
      });

      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('同じイベントの中で続けて確定したら、前の変更を引き継ぐ', () => {
      const onValueChange = vi.fn();
      const { result } = renderHook(() =>
        useTable({ value: members, columns, onValueChange }),
      );

      act(() => {
        cellOf(result.current, 0, 0).props.onValueChange('A');
        cellOf(result.current, 1, 0).props.onValueChange('B');
      });

      expect(onValueChange).toHaveBeenLastCalledWith(
        [
          { id: '1', name: 'A', age: 20 },
          { id: 2, name: 'B', age: null },
        ],
        { type: 'update', path: ['2', 'name'] },
      );
    });

    it('親が受け入れなかった変更は、次のイベントに引き継がない', async () => {
      const onValueChange = vi.fn();
      const { result } = renderHook(() =>
        useTable({ value: members, columns, onValueChange }),
      );

      act(() => {
        cellOf(result.current, 0, 0).props.onValueChange('A');
      });
      await Promise.resolve();
      act(() => {
        cellOf(result.current, 1, 0).props.onValueChange('B');
      });

      expect(onValueChange).toHaveBeenLastCalledWith(
        [members[0], { id: 2, name: 'B', age: null }],
        { type: 'update', path: ['2', 'name'] },
      );
    });

    it('非制御なら、変えた値を持つ', () => {
      const { result } = renderHook(() =>
        useTable({ defaultValue: members, columns }),
      );

      act(() => {
        cellOf(result.current, 0, 1).props.onValueChange(21);
      });

      expect(result.current.value[0]).toEqual({
        id: '1',
        name: '山田',
        age: 21,
      });
      expect(cellOf(result.current, 0, 1).content).toBe('21');
    });

    it('制御なら、親が value を変えるまで値を変えない', () => {
      const { result } = renderHook(() =>
        useTable({ value: members, columns, onValueChange: vi.fn() }),
      );

      act(() => {
        cellOf(result.current, 0, 1).props.onValueChange(21);
      });

      expect(result.current.value).toBe(members);
    });
  });
});
