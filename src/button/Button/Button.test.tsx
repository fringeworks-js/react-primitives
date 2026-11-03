import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import Button from './Button';

describe('Button', () => {
  it('押すと value を onMainAction に渡す', () => {
    const onMainAction = vi.fn();
    render(
      <Button value="save" onMainAction={onMainAction}>
        保存
      </Button>,
    );

    fireEvent.click(screen.getByRole('button', { name: '保存' }));

    expect(onMainAction).toHaveBeenCalledExactlyOnceWith('save');
  });

  it('value を省略すると undefined を渡す', () => {
    const onMainAction = vi.fn();
    render(<Button onMainAction={onMainAction}>保存</Button>);

    fireEvent.click(screen.getByRole('button'));

    expect(onMainAction).toHaveBeenCalledExactlyOnceWith(undefined);
  });

  it('onClick を先に呼び、preventDefault されたら onMainAction を呼ばない', () => {
    const calls: string[] = [];
    const { rerender } = render(
      <Button
        onClick={() => calls.push('click')}
        onMainAction={() => calls.push('main')}
      />,
    );

    fireEvent.click(screen.getByRole('button'));

    expect(calls).toEqual(['click', 'main']);

    calls.length = 0;
    rerender(
      <Button
        onClick={(event) => {
          calls.push('click');
          event.preventDefault();
        }}
        onMainAction={() => calls.push('main')}
      />,
    );

    fireEvent.click(screen.getByRole('button'));

    expect(calls).toEqual(['click']);
  });

  it("type を省略すると 'button'（フォームを送信しない）", () => {
    const onSubmit = vi.fn((event: { preventDefault: () => void }) =>
      event.preventDefault(),
    );
    const { rerender } = render(
      <form onSubmit={onSubmit}>
        <Button>押す</Button>
      </form>,
    );

    expect(screen.getByRole('button').getAttribute('type')).toBe('button');
    fireEvent.click(screen.getByRole('button'));
    expect(onSubmit).not.toHaveBeenCalled();

    rerender(
      <form onSubmit={onSubmit}>
        <Button type="submit">押す</Button>
      </form>,
    );

    fireEvent.click(screen.getByRole('button'));
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it('disabled なら押しても通知しない', () => {
    const onMainAction = vi.fn();
    render(<Button disabled onMainAction={onMainAction} />);

    fireEvent.click(screen.getByRole('button'));

    expect(onMainAction).not.toHaveBeenCalled();
  });

  it('value は HTML の属性に渡さず、その他の props と ref は button に渡す', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button value="save" className="mine" ref={ref} />);

    const button = screen.getByRole('button');
    expect(button.hasAttribute('value')).toBe(false);
    expect(button.className).toBe('mine');
    expect(ref.current).toBe(button);
  });
});
