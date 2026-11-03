import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import useButtonGroup from './useButtonGroup';

const options = [
  { value: 'copy', label: 'コピー' },
  { value: 'paste' },
  { value: 'delete', label: '削除', disabled: true },
];

describe('useButtonGroup', () => {
  it('表示する選択肢は、label を省略したら String(value) を埋める', () => {
    const { result } = renderHook(() => useButtonGroup({ options }));

    expect(result.current.displayOptions.map((o) => o.label)).toEqual([
      'コピー',
      'paste',
      '削除',
    ]);
  });

  it('getButtonProps の onMainAction は、何を渡されても選択肢の値を通知する', () => {
    const onMainAction = vi.fn();
    const { result } = renderHook(() =>
      useButtonGroup({ options, onMainAction }),
    );

    const props = result.current.getButtonProps(
      result.current.displayOptions[0]!,
    );
    props.onMainAction('ignored');

    expect(props).toMatchObject({
      value: 'copy',
      disabled: false,
      children: 'コピー',
    });
    expect(onMainAction).toHaveBeenCalledExactlyOnceWith('copy');
  });

  it('disabled の選択肢とグループの disabled をボタンに渡す', () => {
    const { result, rerender } = renderHook(
      ({ disabled }: { disabled?: boolean }) =>
        useButtonGroup({ options, disabled }),
      { initialProps: {} },
    );
    const disabledOf = (index: number) =>
      result.current.getButtonProps(result.current.displayOptions[index]!)
        .disabled;

    expect([disabledOf(0), disabledOf(2)]).toEqual([false, true]);

    rerender({ disabled: true });

    expect(disabledOf(0)).toBe(true);
    expect(result.current.getContainerProps()).toEqual({
      role: 'group',
      'aria-disabled': true,
    });
  });
});
