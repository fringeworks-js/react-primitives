import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import RadioGroup from './RadioGroup';

const options = [
  { value: 's', label: 'S' },
  { value: 'm', label: 'M' },
];

describe('RadioGroup', () => {
  it('div の入れ物に、react-primitives の Radio を並べる', () => {
    render(<RadioGroup options={options} aria-label="大きさ" />);
    const group = screen.getByRole('radiogroup', { name: '大きさ' });
    expect(group.tagName).toBe('DIV');
    expect(group.hasAttribute('class')).toBe(false);
    expect(screen.getByLabelText('S').parentElement?.tagName).toBe('LABEL');
  });

  it('押すと選んだ値を通知する', () => {
    const onValueChange = vi.fn();
    render(<RadioGroup options={options} onValueChange={onValueChange} />);
    fireEvent.click(screen.getByLabelText('M'));
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('m');
  });
});
