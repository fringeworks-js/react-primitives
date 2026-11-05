import { describe, expect, it } from 'vitest';
import updateRowById from './_updateRowById';

type Member = { id: string | number; name: string };

describe('updateRowById', () => {
  const rows: readonly Member[] = [
    { id: '1', name: 'a' },
    { id: 2, name: 'b' },
  ];

  it('id が一致する行のキーを変えた、新しい配列を作る', () => {
    const next = updateRowById(rows, '1', 'name', 'x');

    expect(next).toEqual([
      { id: '1', name: 'x' },
      { id: 2, name: 'b' },
    ]);
    expect(next?.[1]).toBe(rows[1]);
    expect(rows[0]?.name).toBe('a');
  });

  it('数値の id も文字列に揃えて比べる', () => {
    expect(updateRowById(rows, '2', 'name', 'y')?.[1]).toEqual({
      id: 2,
      name: 'y',
    });
  });

  it('同じ id の行が複数あるときは、先にある行だけを変える', () => {
    const duplicated: readonly Member[] = [
      { id: '1', name: 'a' },
      { id: '1', name: 'b' },
    ];

    expect(updateRowById(duplicated, '1', 'name', 'x')).toEqual([
      { id: '1', name: 'x' },
      { id: '1', name: 'b' },
    ]);
  });

  it('一致する行が無い、または値が変わらないときは undefined', () => {
    expect(updateRowById(rows, '3', 'name', 'x')).toBeUndefined();
    expect(updateRowById(rows, '1', 'name', 'a')).toBeUndefined();
  });
});
