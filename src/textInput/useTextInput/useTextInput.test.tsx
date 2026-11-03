import { act, renderHook } from '@testing-library/react';
import type { ChangeEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';
import useTextInput from './useTextInput';

const changeEvent = (text: string) =>
  ({ currentTarget: { value: text } }) as ChangeEvent<HTMLInputElement>;

describe('useTextInput', () => {
  it('commit で入力欄の文字列を確定する', () => {
    const onValueChange = vi.fn();
    const { result } = renderHook(() => useTextInput({ onValueChange }));

    act(() => {
      result.current.getInputProps().onChange(changeEvent('abc'));
    });

    expect(result.current.inputValue).toBe('abc');
    expect(result.current.value).toBe('');

    act(() => {
      result.current.commit();
    });

    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('abc');
    expect(result.current.value).toBe('abc');
  });

  it('getInputProps は入力欄の文字列を value にする', () => {
    const { result } = renderHook(() => useTextInput({ defaultValue: 'x' }));

    expect(result.current.getInputProps().value).toBe('x');
  });
});
