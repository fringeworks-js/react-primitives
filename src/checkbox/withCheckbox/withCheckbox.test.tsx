import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import type {
  CheckboxIndicatorSlotProps,
  CheckboxInputSlotProps,
  CheckboxLabelSlotProps,
} from './types';
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

  describe('Indicator', () => {
    const Indicator = ({
      checked,
      indeterminate,
      disabled,
      readOnly,
      invalid,
      title,
      ...rest
    }: CheckboxIndicatorSlotProps & { title?: string }) => (
      <span
        {...rest}
        data-testid="indicator"
        title={title}
        data-state={JSON.stringify({
          checked,
          indeterminate,
          disabled,
          readOnly,
          invalid,
        })}
      />
    );

    it('省略すると印を描かない', () => {
      const Checkbox = withCheckbox();
      render(<Checkbox>りんご</Checkbox>);
      expect(screen.getByRole('checkbox').nextSibling?.textContent).toBe(
        'りんご',
      );
    });

    it('<input> の直後に描き、状態と aria-hidden を渡す', () => {
      const Checkbox = withCheckbox({ Indicator });
      render(
        <Checkbox defaultValue indeterminate invalid>
          りんご
        </Checkbox>,
      );
      const indicator = screen.getByTestId('indicator');
      expect(screen.getByRole('checkbox').nextSibling).toBe(indicator);
      expect(indicator.getAttribute('aria-hidden')).toBe('true');
      expect(JSON.parse(indicator.dataset.state!)).toEqual({
        checked: true,
        indeterminate: true,
        disabled: false,
        readOnly: false,
        invalid: true,
      });
    });

    it('押すと、印に渡す checked も変わる', () => {
      const Checkbox = withCheckbox({ Indicator });
      render(<Checkbox>りんご</Checkbox>);
      fireEvent.click(screen.getByRole('checkbox'));
      expect(
        JSON.parse(screen.getByTestId('indicator').dataset.state!).checked,
      ).toBe(true);
    });

    it('partsProps.indicator を渡す。状態は上書きできない', () => {
      const Checkbox = withCheckbox({ Indicator });
      render(
        <Checkbox
          partsProps={{
            indicator: { title: 'mark', checked: true } as never,
          }}
        />,
      );
      const indicator = screen.getByTestId('indicator');
      expect(indicator.title).toBe('mark');
      expect(JSON.parse(indicator.dataset.state!).checked).toBe(false);
    });
  });
});
