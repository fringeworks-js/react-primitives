import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ButtonGroup from './ButtonGroup';

const options = [
  { value: 'copy', label: 'コピー' },
  { value: 'delete', label: '削除' },
];

describe('ButtonGroup', () => {
  it('div の入れ物に、react-primitives の Button を並べる', () => {
    render(<ButtonGroup options={options} aria-label="操作" />);
    const group = screen.getByRole('group', { name: '操作' });
    expect(group.tagName).toBe('DIV');
    expect(group.hasAttribute('class')).toBe(false);
    expect(
      screen.getByRole('button', { name: '削除' }).getAttribute('type'),
    ).toBe('button');
  });

  it('押されたボタンの値を通知する', () => {
    const onMainAction = vi.fn();
    render(<ButtonGroup options={options} onMainAction={onMainAction} />);
    fireEvent.click(screen.getByRole('button', { name: '削除' }));
    expect(onMainAction).toHaveBeenCalledExactlyOnceWith('delete');
  });
});
