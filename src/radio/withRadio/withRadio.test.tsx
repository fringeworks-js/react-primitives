import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { RadioInputSlotProps, RadioLabelSlotProps } from './types';
import withRadio from './withRadio';

describe('withRadio', () => {
  it('組み込んだ部品で <label>・<input> を描き、選ばれたら onValueChange(true) を呼ぶ', () => {
    const Label = (props: RadioLabelSlotProps) => (
      <label {...props} data-part="label" />
    );
    const Input = (props: RadioInputSlotProps) => (
      <input {...props} data-part="input" />
    );
    const Radio = withRadio({ Label, Input });
    const onValueChange = vi.fn();
    render(
      <Radio
        value={false}
        name="size"
        onValueChange={onValueChange}
        partsProps={{ label: { className: 'l' } }}
      >
        S
      </Radio>,
    );

    const input = screen.getByRole('radio', { name: 'S' });
    expect([input.dataset.part, input.getAttribute('name')]).toEqual([
      'input',
      'size',
    ]);
    expect(input.parentElement?.className).toBe('l');

    fireEvent.click(input);
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith(true);
  });

  it('displayName に組み込んだ部品の名前を入れる', () => {
    function AppLabel(props: RadioLabelSlotProps) {
      return <label {...props} />;
    }

    expect(withRadio({ Label: AppLabel }).displayName).toBe(
      'withRadio(AppLabel)',
    );
  });
});
