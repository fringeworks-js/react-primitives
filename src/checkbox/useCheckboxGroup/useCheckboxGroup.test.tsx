import type { Option } from '@fringeworks/react-contract';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { UseCheckboxGroupProps } from './types';
import useCheckboxGroup from './useCheckboxGroup';

const options: Option<string>[] = [
  { value: 'a', label: 'A' },
  { value: 'b', label: 'B' },
  { value: 'c', label: 'C', disabled: true },
];

const render = (props: Partial<UseCheckboxGroupProps<string>>) =>
  renderHook(
    (p: Partial<UseCheckboxGroupProps<string>>) =>
      useCheckboxGroup({ options, ...p }),
    { initialProps: props },
  );

describe('useCheckboxGroup', () => {
  describe('選ぶ・外す', () => {
    it('非制御: defaultValue を初期値にし、選んだ値を表示の順に並べて通知する', () => {
      const onValueChange = vi.fn();
      const { result } = render({ defaultValue: ['b'], onValueChange });

      act(() => {
        result.current.setChecked('a', true);
      });

      expect(onValueChange).toHaveBeenCalledExactlyOnceWith(['a', 'b']);
      expect(result.current.value).toEqual(['a', 'b']);
      expect(result.current.isChecked('a')).toBe(true);
    });

    it('どちらも渡さないと何も選んでいない', () => {
      const { result } = render({});

      expect(result.current.value).toEqual([]);
    });

    it('外すと値から取り除く', () => {
      const onValueChange = vi.fn();
      const { result } = render({ value: ['a', 'b'], onValueChange });

      act(() => {
        result.current.setChecked('a', false);
      });

      expect(onValueChange).toHaveBeenCalledExactlyOnceWith(['b']);
    });

    it('今の状態と同じなら通知しない', () => {
      const onValueChange = vi.fn();
      const { result } = render({ value: ['a'], onValueChange });

      act(() => {
        result.current.setChecked('a', true);
        result.current.setChecked('b', false);
      });

      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('disabled の選択肢・disabled・readOnly では変えない', () => {
      const onValueChange = vi.fn();
      const { result, rerender } = render({ onValueChange });

      act(() => {
        result.current.setChecked('c', true);
      });
      rerender({ onValueChange, disabled: true });
      act(() => {
        result.current.setChecked('a', true);
        result.current.setAllChecked(true);
      });
      rerender({ onValueChange, readOnly: true });
      act(() => {
        result.current.setChecked('a', true);
        result.current.setAllChecked(true);
      });

      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('label を省略した選択肢は String(value) を表示する', () => {
      const { result } = renderHook(() =>
        useCheckboxGroup({ options: [{ value: 1 }] }),
      );

      expect(result.current.displayOptions).toEqual([
        { value: 1, label: '1', unlisted: false },
      ]);
    });
  });

  describe('すべて選ぶ', () => {
    it('選べる選択肢の選ばれ方で状態を決める', () => {
      const { result, rerender } = render({ value: [] });
      expect(result.current.selectAllState).toBe('unchecked');

      rerender({ value: ['a'] });
      expect(result.current.selectAllState).toBe('indeterminate');

      // disabled の c は数えない
      rerender({ value: ['a', 'b'] });
      expect(result.current.selectAllState).toBe('checked');
    });

    it('選べる選択肢だけをまとめて選ぶ・外し、disabled の選択肢の状態は変えない', () => {
      const onValueChange = vi.fn();
      const { result, rerender } = render({ value: ['c'], onValueChange });

      act(() => {
        result.current.setAllChecked(true);
      });
      expect(onValueChange).toHaveBeenLastCalledWith(['a', 'b', 'c']);

      rerender({ value: ['a', 'b', 'c'], onValueChange });
      act(() => {
        result.current.setAllChecked(false);
      });
      expect(onValueChange).toHaveBeenLastCalledWith(['c']);
    });

    it('getSelectAllProps は不確定を indeterminate で渡し、選べる選択肢が無ければ disabled', () => {
      const { result } = render({ value: ['a'] });

      expect(result.current.getSelectAllProps()).toMatchObject({
        value: false,
        indeterminate: true,
        disabled: false,
      });

      const { result: noTarget } = renderHook(() =>
        useCheckboxGroup({ options: [{ value: 'x', disabled: true }] }),
      );
      expect(noTarget.current.getSelectAllProps().disabled).toBe(true);
    });
  });

  describe('選択肢外の値', () => {
    it("既定（'end'）では選択肢の後に表示し、選んだ値も表示の順に並べる", () => {
      const onValueChange = vi.fn();
      const { result } = render({ value: ['x', 'b'], onValueChange });

      expect(
        result.current.displayOptions.map((i) => [i.value, i.unlisted]),
      ).toEqual([
        ['a', false],
        ['b', false],
        ['c', false],
        ['x', true],
      ]);

      act(() => {
        result.current.setChecked('a', true);
      });
      expect(onValueChange).toHaveBeenCalledExactlyOnceWith(['a', 'b', 'x']);
    });

    it("'start' では選択肢の前に表示する", () => {
      const { result } = render({ value: ['x'], unlistedPlacement: 'start' });

      expect(result.current.displayOptions.map((i) => i.value)).toEqual([
        'x',
        'a',
        'b',
        'c',
      ]);
    });

    it("'hidden' では表示せず、値は末尾に残す", () => {
      const onValueChange = vi.fn();
      const { result } = render({
        value: ['x', 'b'],
        unlistedPlacement: 'hidden',
        onValueChange,
      });

      expect(result.current.displayOptions.map((i) => i.value)).toEqual([
        'a',
        'b',
        'c',
      ]);

      act(() => {
        result.current.setChecked('a', true);
      });
      expect(onValueChange).toHaveBeenCalledExactlyOnceWith(['a', 'b', 'x']);
    });

    it('既定では、チェックを外すと表示からも消える', () => {
      const { result } = render({ defaultValue: ['x'] });

      act(() => {
        result.current.setChecked('x', false);
      });

      expect(result.current.displayOptions.map((i) => i.value)).toEqual([
        'a',
        'b',
        'c',
      ]);
    });

    it('keepUnlisted では、チェックを外しても残り、選び直せる', () => {
      const { result } = render({ defaultValue: ['x'], keepUnlisted: true });

      act(() => {
        result.current.setChecked('x', false);
      });
      expect(result.current.displayOptions.map((i) => i.value)).toEqual([
        'a',
        'b',
        'c',
        'x',
      ]);

      act(() => {
        result.current.setChecked('x', true);
      });
      expect(result.current.value).toEqual(['x']);
    });

    it('keepUnlisted では、後から現れた値も現れた順に残す', () => {
      const { result, rerender } = render({ value: ['x'], keepUnlisted: true });

      rerender({ value: ['y'], keepUnlisted: true });

      expect(
        result.current.displayOptions
          .filter((i) => i.unlisted)
          .map((i) => i.value),
      ).toEqual(['x', 'y']);
    });

    it('後から options に入った値は、選択肢外として扱わない', () => {
      const { result, rerender } = renderHook(
        (p: { options: Option<string>[] }) =>
          useCheckboxGroup({ ...p, value: ['x'], keepUnlisted: true }),
        { initialProps: { options } },
      );

      rerender({ options: [...options, { value: 'x', label: 'X' }] });

      expect(result.current.displayOptions[3]).toEqual({
        value: 'x',
        label: 'X',
        unlisted: false,
      });
      expect(result.current.displayOptions).toHaveLength(4);
    });

    it('既定では、すべて選ぶ・すべて外すの対象に含めない', () => {
      const onValueChange = vi.fn();
      const { result } = render({ value: ['a', 'b', 'x'], onValueChange });

      expect(result.current.selectAllState).toBe('checked');

      act(() => {
        result.current.setAllChecked(false);
      });
      expect(onValueChange).toHaveBeenCalledExactlyOnceWith(['x']);
    });

    it('selectAllIncludesUnlisted では、すべて選ぶ・すべて外すの対象に含める', () => {
      const onValueChange = vi.fn();
      const { result, rerender } = render({
        value: ['a', 'b', 'x'],
        keepUnlisted: true,
        selectAllIncludesUnlisted: true,
        onValueChange,
      });

      act(() => {
        result.current.setAllChecked(false);
      });
      expect(onValueChange).toHaveBeenLastCalledWith([]);

      rerender({
        value: [],
        keepUnlisted: true,
        selectAllIncludesUnlisted: true,
        onValueChange,
      });
      act(() => {
        result.current.setAllChecked(true);
      });
      expect(onValueChange).toHaveBeenLastCalledWith(['a', 'b', 'x']);
    });
  });

  describe('props を作る関数', () => {
    it('getCheckboxProps は選択肢の状態と設定を渡す', () => {
      const { result } = render({
        value: ['a'],
        invalid: true,
        readOnly: true,
      });
      const [a, , c] = result.current.displayOptions;

      expect(result.current.getCheckboxProps(a!)).toMatchObject({
        value: true,
        disabled: undefined,
        readOnly: true,
        invalid: true,
        children: 'A',
      });
      expect(result.current.getCheckboxProps(c!)).toMatchObject({
        value: false,
        disabled: true,
      });
    });

    it('getCheckboxProps の onValueChange で選ぶ', () => {
      const onValueChange = vi.fn();
      const { result } = render({ onValueChange });

      act(() => {
        result.current
          .getCheckboxProps(result.current.displayOptions[1]!)
          .onValueChange(true);
      });

      expect(onValueChange).toHaveBeenCalledExactlyOnceWith(['b']);
    });

    it('getContainerProps は role と aria 属性を返す', () => {
      const { result, rerender } = render({});
      expect(result.current.getContainerProps()).toEqual({
        role: 'group',
        'aria-disabled': undefined,
        'aria-invalid': undefined,
      });

      rerender({ disabled: true, invalid: true });
      expect(result.current.getContainerProps()).toEqual({
        role: 'group',
        'aria-disabled': true,
        'aria-invalid': true,
      });
    });
  });
});
