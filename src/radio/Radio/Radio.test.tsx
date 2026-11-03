import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import Radio from './Radio';

const getInput = () => screen.getByRole<HTMLInputElement>('radio');

describe('Radio', () => {
  it('label の中に input と children を置く', () => {
    render(<Radio value={false}>りんご</Radio>);

    const input = getInput();
    expect(input.parentElement?.tagName).toBe('LABEL');
    expect(input.parentElement?.hasAttribute('class')).toBe(false);
    expect(screen.getByLabelText('りんご')).toBe(input);
  });

  it('value で選ばれているかを決め、押すと true を通知する', () => {
    const onValueChange = vi.fn();
    render(<Radio value={false} onValueChange={onValueChange} name="g" />);

    expect(getInput().checked).toBe(false);
    expect(getInput().name).toBe('g');

    fireEvent.click(getInput());

    expect(onValueChange).toHaveBeenCalledExactlyOnceWith(true);
    // 制御なので、親が value を変えるまでは変わらない
    expect(getInput().checked).toBe(false);
  });

  it('readOnly のときは押しても通知しない', () => {
    const onValueChange = vi.fn();
    render(<Radio value={false} readOnly onValueChange={onValueChange} />);

    fireEvent.click(getInput());

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('disabled・required を input に付ける。invalid は ARIA の属性を付けない', () => {
    render(<Radio value={false} disabled required invalid />);

    const input = getInput();
    expect(input.disabled).toBe(true);
    expect(input.required).toBe(true);
    expect(input.hasAttribute('aria-invalid')).toBe(false);
    expect(input.parentElement?.hasAttribute('invalid')).toBe(false);
  });

  it('その他の props は label に、partsProps.input は input に渡す', () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <Radio
        value={false}
        className="label"
        partsProps={{ input: { className: 'input', ref } }}
      />,
    );

    expect(getInput().className).toBe('input');
    expect(getInput().parentElement?.className).toBe('label');
    expect(ref.current).toBe(getInput());
  });
});
