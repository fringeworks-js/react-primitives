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

  describe('props を渡す要素', () => {
    it('className・style は label に、それ以外（ref を含む）は input に渡す', () => {
      const ref = createRef<HTMLInputElement>();
      render(
        <Radio
          value={false}
          ref={ref}
          className="label"
          style={{ color: 'red' }}
          aria-describedby="note"
        />,
      );

      const input = getInput();
      expect(input.parentElement?.className).toBe('label');
      expect(input.parentElement?.style.color).toBe('red');
      expect(input.hasAttribute('class')).toBe(false);
      expect(input.getAttribute('aria-describedby')).toBe('note');
      expect(ref.current).toBe(input);
    });

    it('partsProps.label は label に、partsProps.input は input に渡す', () => {
      const rootRef = createRef<HTMLLabelElement>();
      const inputRef = createRef<HTMLInputElement>();
      render(
        <Radio
          value={false}
          partsProps={{
            label: { ref: rootRef, className: 'root' },
            input: { ref: inputRef, className: 'input' },
          }}
        />,
      );

      expect(getInput().className).toBe('input');
      expect(rootRef.current?.className).toBe('root');
      expect(inputRef.current).toBe(getInput());
    });

    it('onChange を先に呼び、preventDefault されたら通知しない', () => {
      const onValueChange = vi.fn();
      render(
        <Radio
          value={false}
          onChange={(event) => event.preventDefault()}
          onValueChange={onValueChange}
        />,
      );

      fireEvent.click(getInput());

      expect(onValueChange).not.toHaveBeenCalled();
    });
  });
});
