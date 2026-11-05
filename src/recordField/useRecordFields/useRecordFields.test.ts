import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { RecordField } from '../types';
import useRecordFields from './useRecordFields';

type Member = { id: string; name: string; age: number | null };

const fields: RecordField<Member>[] = [
  { key: 'name', label: '名前' },
  { key: 'age', label: '年齢' },
];

const member: Member = { id: '1', name: '山田', age: null };

describe('useRecordFields', () => {
  describe('展開', () => {
    it('項目ごとに、位置から作ったラベルの id と、描いたもの・props を作る', () => {
      const { result } = renderHook(() =>
        useRecordFields({ value: member, fields }),
      );

      const [name, age] = result.current.displayFields;
      expect(name).toMatchObject({
        key: 'name',
        label: '名前',
        content: '山田',
      });
      expect(age).toMatchObject({ key: 'age', content: '' });
      expect(name?.labelId).not.toBe(age?.labelId);
      expect(name?.props).toMatchObject({
        value: '山田',
        'aria-labelledby': name?.labelId,
      });
    });

    it('renderValue に props を渡し、結果を content にする', () => {
      const renderValue = vi.fn(({ value }: { value: string }) => `[${value}]`);
      const { result } = renderHook(() =>
        useRecordFields({
          value: member,
          fields: [{ key: 'name', label: '名前', renderValue }],
        }),
      );

      const [name] = result.current.displayFields;
      expect(name?.content).toBe('[山田]');
      expect(renderValue).toHaveBeenCalledWith(name?.props, name?.context);
      expect(name?.context).toEqual({ path: ['name'], record: member });
    });

    it('value・defaultValue を両方省略すると {}', () => {
      const { result } = renderHook(() => useRecordFields<Member>({ fields }));

      expect(result.current.value).toEqual({});
      expect(result.current.displayFields.map((f) => f.content)).toEqual([
        '',
        '',
      ]);
    });
  });

  describe('変更', () => {
    it('項目の値が確定したら、キーを変えたレコードと details で知らせる', () => {
      const onValueChange = vi.fn();
      const { result } = renderHook(() =>
        useRecordFields({ value: member, fields, onValueChange }),
      );

      act(() => {
        result.current.displayFields[1]?.props.onValueChange(20);
      });

      expect(onValueChange).toHaveBeenCalledExactlyOnceWith(
        { id: '1', name: '山田', age: 20 },
        { type: 'update', path: ['age'] },
      );
      expect(member.age).toBeNull();
    });

    it('値が変わらなければ知らせない', () => {
      const onValueChange = vi.fn();
      const { result } = renderHook(() =>
        useRecordFields({ value: member, fields, onValueChange }),
      );

      act(() => {
        result.current.displayFields[0]?.props.onValueChange('山田');
      });

      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('非制御なら、変えた値を持つ', () => {
      const { result } = renderHook(() =>
        useRecordFields({ defaultValue: member, fields }),
      );

      act(() => {
        result.current.displayFields[0]?.props.onValueChange('鈴木');
      });

      expect(result.current.value).toEqual({
        id: '1',
        name: '鈴木',
        age: null,
      });
      expect(result.current.displayFields[0]?.content).toBe('鈴木');
    });

    it('制御なら、親が value を変えるまで値を変えない', () => {
      const { result } = renderHook(() =>
        useRecordFields({ value: member, fields, onValueChange: vi.fn() }),
      );

      act(() => {
        result.current.displayFields[0]?.props.onValueChange('鈴木');
      });

      expect(result.current.value).toBe(member);
    });
  });
});
