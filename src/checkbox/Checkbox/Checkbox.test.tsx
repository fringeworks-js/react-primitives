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

  it('その他の props は label に、partsProps.input は input に渡す', () => {
    const onChange = vi.fn();
    const inputRef = createRef<HTMLInputElement>();
    render(
      <Checkbox
        className="extra"
        data-testid="root"
        partsProps={{ input: { name: 'fruit', onChange, ref: inputRef } }}
      />,
    );

    const root = screen.getByTestId('root');
    expect(root.tagName).toBe('LABEL');
    expect(root.className).toBe('extra');
    expect(getInput().name).toBe('fruit');
    expect(inputRef.current).toBe(getInput());

    fireEvent.click(getInput());

    expect(onChange).toHaveBeenCalledOnce();
    expect(getInput().checked).toBe(true);
  });
});
