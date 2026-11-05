import { describe, expect, it, vi } from 'vitest';
import type { FieldValueProps, RecordField } from '../types';
import renderFieldValue from './renderFieldValue';

type Member = { id: string; name: string; age: number | null };

// 呼ぶ側（useTable など）と同じく、どの項目の値も入る型で作る
const createProps = (
  value: Member[keyof Member],
): FieldValueProps<Member[keyof Member]> => ({
  value,
  onValueChange: vi.fn(),
  'aria-labelledby': 'label',
});

describe('renderFieldValue', () => {
  const context = {
    path: ['name'],
    record: { id: '1', name: '山田', age: null } as Member,
  };

  it('renderValue を props と context で呼んだ結果を返す', () => {
    const renderValue = vi.fn(
      ({ value }: FieldValueProps<string>) => `[${value}]`,
    );
    const field: RecordField<Member> = {
      key: 'name',
      label: '名前',
      renderValue,
    };
    const props = createProps('山田');

    expect(renderFieldValue(field, props, context)).toBe('[山田]');
    expect(renderValue).toHaveBeenCalledExactlyOnceWith(props, context);
  });

  it('renderValue を省略すると、値を文字にする', () => {
    const field: RecordField<Member> = { key: 'age', label: '年齢' };

    expect(renderFieldValue(field, createProps(20), context)).toBe('20');
    expect(renderFieldValue(field, createProps(null), context)).toBe('');
    expect(
      renderFieldValue(field, createProps(undefined as any), context),
    ).toBe('');
  });
});
