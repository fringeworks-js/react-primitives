import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import CheckboxGroup from './CheckboxGroup';

const options = [
  { value: 'a', label: 'りんご' },
  { value: 'b', label: 'みかん' },
];

describe('CheckboxGroup', () => {
  it('div の入れ物に、react-primitives の Checkbox を並べる', () => {
    render(<CheckboxGroup options={options} aria-label="果物" />);
    const group = screen.getByRole('group', { name: '果物' });
    expect(group.tagName).toBe('DIV');
    expect(group.hasAttribute('class')).toBe(false);
    const input = screen.getByLabelText('りんご');
    expect(input.parentElement?.tagName).toBe('LABEL');
    expect(screen.getAllByRole('checkbox')).toHaveLength(2);
  });

  it('選んだ値を通知する。すべて選ぶも Checkbox で描く', () => {
    const onValueChange = vi.fn();
    render(
      <CheckboxGroup
        options={options}
        onValueChange={onValueChange}
        showSelectAll
        selectAllLabel="すべて"
      />,
    );
    fireEvent.click(screen.getByLabelText('すべて'));
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith(['a', 'b']);
  });

  it('partsProps.checkbox で、Checkbox の partsProps も渡せる', () => {
    render(
      <CheckboxGroup
        options={options}
        partsProps={{ checkbox: { partsProps: { input: { name: 'fruit' } } } }}
      />,
    );
    for (const checkbox of screen.getAllByRole<HTMLInputElement>('checkbox')) {
      expect(checkbox.name).toBe('fruit');
    }
  });
});
