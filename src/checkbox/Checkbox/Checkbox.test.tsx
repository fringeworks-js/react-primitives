import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import Checkbox from './Checkbox';

const getInput = () => screen.getByRole<HTMLInputElement>('checkbox');

describe('Checkbox', () => {
  it('label の中に input と children を置く', () => {
    render(<Checkbox>りんご</Checkbox>);

    const input = getInput();
    expect(input.parentElement?.tagName).toBe('LABEL');
    expect(input.parentElement?.hasAttribute('class')).toBe(false);
    expect(screen.getByLabelText('りんご')).toBe(input);
  });

  it('非制御: defaultValue を初期値にし、押すと切り替わって通知する', () => {
    const onValueChange = vi.fn();
    render(<Checkbox defaultValue onValueChange={onValueChange} />);

    expect(getInput().checked).toBe(true);

    fireEvent.click(getInput());

    expect(getInput().checked).toBe(false);
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith(false);
  });

  it('非制御: どちらも渡さないとチェックしていない', () => {
    render(<Checkbox />);

    expect(getInput().checked).toBe(false);
  });

  it('制御: 押しても親が value を変えるまでは変わらない', () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <Checkbox value={false} onValueChange={onValueChange} />,
    );

    fireEvent.click(getInput());

    expect(onValueChange).toHaveBeenCalledExactlyOnceWith(true);
    expect(getInput().checked).toBe(false);

    rerender(<Checkbox value onValueChange={onValueChange} />);

    expect(getInput().checked).toBe(true);
  });

  it('readOnly: 押しても切り替わらず、通知しない', () => {
    const onValueChange = vi.fn();
    render(<Checkbox readOnly onValueChange={onValueChange} />);

    fireEvent.click(getInput());

    expect(getInput().checked).toBe(false);
    expect(onValueChange).not.toHaveBeenCalled();
    expect(getInput().getAttribute('aria-readonly')).toBe('true');
  });

  it('disabled・required・invalid を input に設定する', () => {
    render(<Checkbox disabled required invalid />);

    expect(getInput().disabled).toBe(true);
    expect(getInput().required).toBe(true);
    expect(getInput().getAttribute('aria-invalid')).toBe('true');
  });

  it('false の readOnly・invalid では aria 属性を付けない', () => {
    render(<Checkbox readOnly={false} invalid={false} />);

    expect(getInput().hasAttribute('aria-readonly')).toBe(false);
    expect(getInput().hasAttribute('aria-invalid')).toBe(false);
  });

  it('indeterminate を DOM のプロパティに反映し、value は変えない', () => {
    const { rerender } = render(<Checkbox value indeterminate />);

    expect(getInput().indeterminate).toBe(true);
    expect(getInput().checked).toBe(true);

    rerender(<Checkbox value />);

    expect(getInput().indeterminate).toBe(false);
  });

  describe('props を渡す要素', () => {
    it('className・style は label に、それ以外（ref を含む）は input に渡す', () => {
      const ref = createRef<HTMLInputElement>();
      render(
        <Checkbox
          ref={ref}
          className="extra"
          style={{ color: 'red' }}
          id="agree"
          name="agree"
          aria-describedby="note"
          data-testid="input"
        />,
      );

      const input = getInput();
      const label = input.parentElement!;
      expect(label.className).toBe('extra');
      expect(label.style.color).toBe('red');
      expect(input.hasAttribute('class')).toBe(false);
      expect(ref.current).toBe(input);
      expect(input.id).toBe('agree');
      expect(input.name).toBe('agree');
      expect(input.getAttribute('aria-describedby')).toBe('note');
      expect(screen.getByTestId('input')).toBe(input);
    });

    it('aria-labelledby で外の要素を名前にできる', () => {
      render(
        <>
          <span id="heading">同意</span>
          <Checkbox aria-labelledby="heading" />
        </>,
      );

      expect(screen.getByRole('checkbox', { name: '同意' })).toBe(getInput());
    });

    it('partsProps.label は label に、partsProps.input は input に渡し、ルートの props より優先する', () => {
      const rootRef = createRef<HTMLLabelElement>();
      const ref = createRef<HTMLInputElement>();
      const inputRef = createRef<HTMLInputElement>();
      render(
        <Checkbox
          ref={ref}
          className="a"
          name="top"
          partsProps={{
            label: { ref: rootRef, className: 'b' },
            input: { ref: inputRef, className: 'c', name: 'part' },
          }}
        />,
      );

      const root = getInput().parentElement!;
      expect(root.tagName).toBe('LABEL');
      expect(root.className).toBe('a b');
      expect(rootRef.current).toBe(root);
      expect(getInput().className).toBe('c');
      expect(getInput().name).toBe('part');
      expect(ref.current).toBe(getInput());
      expect(inputRef.current).toBe(getInput());
    });

    it('onChange を先に呼び、preventDefault されたら値を変えない', () => {
      const onValueChange = vi.fn();
      const onChange = vi.fn((event: { preventDefault: () => void }) =>
        event.preventDefault(),
      );
      render(<Checkbox onChange={onChange} onValueChange={onValueChange} />);

      fireEvent.click(getInput());

      expect(onChange).toHaveBeenCalledOnce();
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('ルートと partsProps.input の onChange を両方呼ぶ', () => {
      const onChange = vi.fn();
      const onPartChange = vi.fn();
      render(
        <Checkbox
          onChange={onChange}
          partsProps={{ input: { onChange: onPartChange } }}
        />,
      );

      fireEvent.click(getInput());

      expect(onChange).toHaveBeenCalledOnce();
      expect(onPartChange).toHaveBeenCalledOnce();
      expect(getInput().checked).toBe(true);
    });
  });
});
