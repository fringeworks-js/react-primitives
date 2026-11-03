import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import useCollapsible from './useCollapsible';

describe('useCollapsible', () => {
  it('setOpen で開閉し、通知する', () => {
    const onOpenChange = vi.fn();
    const { result } = renderHook(() => useCollapsible({ onOpenChange }));

    act(() => {
      result.current.setOpen(true);
    });

    expect(result.current.open).toBe(true);
    expect(result.current.getDetailsProps().open).toBe(true);
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(true);
  });

  it('disabled なら setOpen で開閉しない', () => {
    const onOpenChange = vi.fn();
    const { result } = renderHook(() =>
      useCollapsible({ onOpenChange, disabled: true }),
    );

    act(() => {
      result.current.setOpen(true);
    });

    expect(result.current.open).toBe(false);
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(result.current.getSummaryProps()['aria-disabled']).toBe(true);
  });
});
