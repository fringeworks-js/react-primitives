import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import type { CheckboxInputSlotProps, CheckboxLabelSlotProps } from './types';
import withCheckbox from './withCheckbox';

describe('withCheckbox', () => {
  it('組み込んだ部品で <label>・<input> を描く。部品は受け取った props を要素に渡す', () => {
    const Label = (props: CheckboxLabelSlotProps) => (
      <label {...props} data-part="label" />
    );
    const Input = (props: CheckboxInputSlotProps) => (
      <input {...props} data-part="input" />
    );
    const Checkbox = withCheckbox({ Label, Input });
    const ref = createRef<HTMLInputElement>();
    const onValueChange = vi.fn();
    render(
      <Checkbox
        ref={ref}
        className="mine"
        indeterminate
        onValueChange={onValueChange}
        partsProps={{ label: { title: 'l' }, input: { title: 'i' } }}
      >
        りんご
      </Checkbox>,
    );

    const input = screen.getByRole('checkbox', { name: 'りんご' });
    expect([input.dataset.part, input.title]).toEqual(['input', 'i']);
    expect(ref.current).toBe(input);
    expect((input as HTMLInputElement).indeterminate).toBe(true);
    const label = input.parentElement!;
    expect([label.dataset.part, label.className, label.title]).toEqual([
      'label',
      'mine',
      'l',
    ]);

    fireEvent.click(input);
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith(true);
  });

  describe('組み込んだ部品の props の型', () => {
    function ToneLabel({
      tone,
      ...props
    }: CheckboxLabelSlotProps & { tone: 'plain' | 'strong' }) {
      return <label {...props} data-tone={tone} />;
    }
    function SizedInput({
      scale,
      ...props
    }: CheckboxInputSlotProps & { scale: 1 | 2 }) {
      return <input {...props} data-scale={scale} />;
    }
    const ToneCheckbox = withCheckbox({ Label: ToneLabel, Input: SizedInput });

    it('トップレベルは <input> の部品の props、partsProps.label は <label> の部品の props になる', () => {
      render(
        <ToneCheckbox scale={2} partsProps={{ label: { tone: 'strong' } }}>
          りんご
        </ToneCheckbox>,
      );

      const input = screen.getByRole('checkbox');
      expect(input.dataset.scale).toBe('2');
      expect(input.parentElement?.dataset.tone).toBe('strong');

      const missing = {
        // @ts-expect-error <input> の scale と、<label> の tone を渡す partsProps が無い
        element: <ToneCheckbox />,
      };
      expect(missing.element).toBeDefined();
    });
  });

  it('displayName に組み込んだ部品の名前を入れる', () => {
    function AppInput(props: CheckboxInputSlotProps) {
      return <input {...props} />;
    }

    expect(withCheckbox({ Input: AppInput }).displayName).toBe(
      'withCheckbox(AppInput)',
    );
  });
});
