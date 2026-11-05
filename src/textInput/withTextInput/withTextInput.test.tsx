import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { TextInputInputSlotProps } from './types';
import withTextInput from './withTextInput';

describe('withTextInput', () => {
  it('組み込んだ部品で描き、確定した文字列を onValueChange に渡す', () => {
    function ToneInput({
      tone,
      ...props
    }: TextInputInputSlotProps & { tone: 'plain' | 'strong' }) {
      return <input {...props} data-tone={tone} />;
    }
    const TextInput = withTextInput({ Input: ToneInput });
    const onValueChange = vi.fn();
    render(
      <TextInput
        aria-label="名前"
        tone="strong"
        invalid
        onValueChange={onValueChange}
      />,
    );

    const input = screen.getByRole('textbox', { name: '名前' });
    expect([input.dataset.tone, input.getAttribute('aria-invalid')]).toEqual([
      'strong',
      'true',
    ]);
    fireEvent.change(input, { target: { value: '山田' } });
    fireEvent.blur(input);
    expect(onValueChange).toHaveBeenCalledWith('山田');
  });

  it('displayName に組み込んだ部品の名前を入れる', () => {
    function AppInput(props: TextInputInputSlotProps) {
      return <input {...props} />;
    }

    expect(withTextInput({ Input: AppInput }).displayName).toBe(
      'withTextInput(AppInput)',
    );
  });
});
