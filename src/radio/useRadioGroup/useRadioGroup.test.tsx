import type { Option } from '@fringeworks/react-contract';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { UseRadioGroupProps } from './types';
import useRadioGroup from './useRadioGroup';

const options: Option<string>[] = [
  { value: 'a', label: 'A' },
  { value: 'b', label: 'B' },
  { value: 'c', label: 'C', disabled: true },
];

const render = (props: Partial<UseRadioGroupProps<string>>) =>
  renderHook(
    (p: Partial<UseRadioGroupProps<string>>) =>
      useRadioGroup({ options, ...p }),
    { initialProps: props },
  );

describe('useRadioGroup', () => {
  describe('選ぶ', () => {
    it('非制御: defaultValue を初期値にし、選んだ値を通知する', () => {
      const onValueChange = vi.fn();
      const { result } = render({ defaultValue: 'a', onValueChange });

      expect(result.current.isChecked('a')).toBe(true);

      act(() => {
        result.current.check('b');
      });

      expect(onValueChange).toHaveBeenCalledExactlyOnceWith('b');
      expect(result.current.value).toBe('b');
      expect(result.current.isChecked('a')).toBe(false);
    });

    it('どちらも渡さないと null（何も選んでいない）', () => {
      const { result } = render({});

      expect(result.current.value).toBeNull();
      expect(result.current.isChecked('a')).toBe(false);
    });

    it('制御: value に null を渡すと、何も選んでいない', () => {
      const { result } = render({ value: null, defaultValue: 'a' });

      expect(result.current.value).toBeNull();
    });

    it('選んでいる値をもう一度選んでも通知しない', () => {
      const onValueChange = vi.fn();
      const { result } = render({ value: 'a', onValueChange });

      act(() => {
        result.current.check('a');
      });

      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('disabled の選択肢、disabled・readOnly のグループでは選ばない', () => {
      const onValueChange = vi.fn();
      const { result, rerender } = render({ onValueChange });

      act(() => {
        result.current.check('c');
      });
      rerender({ onValueChange, disabled: true });
      act(() => {
        result.current.check('a');
      });
      rerender({ onValueChange, readOnly: true });
      act(() => {
        result.current.check('a');
      });

      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  describe('選択肢外の値', () => {
    it('選んでいる選択肢外の値を末尾に出し、ほかを選ぶと消す', () => {
      const { result } = render({ defaultValue: 'x' });

      expect(result.current.displayOptions.map((o) => o.value)).toEqual([
        'a',
        'b',
        'c',
        'x',
      ]);
      expect(result.current.isChecked('x')).toBe(true);

      act(() => {
        result.current.check('a');
      });

      expect(result.current.displayOptions.map((o) => o.value)).toEqual([
        'a',
        'b',
        'c',
      ]);
    });

    it('keepUnlisted なら、ほかを選んでも残す', () => {
      const { result } = render({ defaultValue: 'x', keepUnlisted: true });

      act(() => {
        result.current.check('a');
      });

      expect(result.current.displayOptions.map((o) => o.value)).toContain('x');
    });

    it("unlistedPlacement が 'start' なら先頭に出す", () => {
      const { result } = render({ value: 'x', unlistedPlacement: 'start' });

      expect(result.current.displayOptions[0]?.value).toBe('x');
    });
  });

  describe('props を作る関数', () => {
    it('getRadioProps は、選ばれているか・共通の name・設定・文字を返す', () => {
      const { result } = render({ value: 'a', required: true, invalid: true });
      const [a, b, c] = result.current.displayOptions;

      const propsA = result.current.getRadioProps(a!);
      const propsB = result.current.getRadioProps(b!);
      const propsC = result.current.getRadioProps(c!);

      expect(propsA).toMatchObject({
        value: true,
        disabled: false,
        readOnly: false,
        required: true,
        invalid: true,
        children: 'A',
      });
      expect(propsB.value).toBe(false);
      expect(propsC.disabled).toBe(true);
      expect(propsA.name).not.toBe('');
      expect(propsB.name).toBe(propsA.name);
    });

    it('getRadioProps の onValueChange で、その選択肢を選ぶ', () => {
      const onValueChange = vi.fn();
      const { result } = render({ onValueChange });

      act(() => {
        result.current
          .getRadioProps(result.current.displayOptions[1]!)
          .onValueChange(true);
      });

      expect(onValueChange).toHaveBeenCalledExactlyOnceWith('b');
    });

    it('グループごとに別の name を作る', () => {
      const first = render({});
      const second = render({});

      const name = (r: typeof first) =>
        r.result.current.getRadioProps(r.result.current.displayOptions[0]!)
          .name;
      expect(name(first)).not.toBe(name(second));
    });

    it('getContainerProps は radiogroup と、設定に合わせた ARIA の属性を返す', () => {
      const { result, rerender } = render({});

      expect(result.current.getContainerProps()).toEqual({
        role: 'radiogroup',
        'aria-disabled': undefined,
        'aria-readonly': undefined,
        'aria-required': undefined,
        'aria-invalid': undefined,
      });

      rerender({
        disabled: true,
        readOnly: true,
        required: true,
        invalid: true,
      });

      expect(result.current.getContainerProps()).toEqual({
        role: 'radiogroup',
        'aria-disabled': true,
        'aria-readonly': true,
        'aria-required': true,
        'aria-invalid': true,
      });
    });
  });
});
