import { renderHook } from '@testing-library/react';
import type { MouseEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';
import type { UseButtonProps } from './types';
import useButton from './useButton';

const render = <V>(props: UseButtonProps<V>) =>
  renderHook(() => useButton(props)).result.current;

const click = (defaultPrevented = false) =>
  ({ defaultPrevented }) as unknown as MouseEvent<HTMLButtonElement>;

describe('useButton', () => {
  it('押すと value を onMainAction に渡す', () => {
    const onMainAction = vi.fn();
    render({ value: 'save', onMainAction }).getButtonProps().onClick(click());
    expect(onMainAction).toHaveBeenCalledExactlyOnceWith('save');
  });

  it('type を省略すると button。指定すればそのまま', () => {
    expect(render({}).getButtonProps().type).toBe('button');
    expect(render({ type: 'submit' }).getButtonProps().type).toBe('submit');
  });

  it('disabled をそのまま渡す', () => {
    expect(render({ disabled: true }).getButtonProps().disabled).toBe(true);
  });

  it('利用者の onClick を先に呼び、preventDefault されたら onMainAction を呼ばない', () => {
    const calls: string[] = [];
    const props = render({
      onMainAction: () => calls.push('main'),
    }).getButtonProps({ onClick: () => calls.push('click') });

    props.onClick(click());
    expect(calls).toEqual(['click', 'main']);

    calls.length = 0;
    props.onClick(click(true));
    expect(calls).toEqual(['click']);
  });
});
