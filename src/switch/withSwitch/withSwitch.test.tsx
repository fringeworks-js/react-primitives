import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import withCheckboxGroup from '../../checkbox/withCheckboxGroup';
import Switch from '../Switch';
import type { SwitchInputSlotProps, SwitchLabelSlotProps } from './types';
import withSwitch from './withSwitch';

describe('withSwitch', () => {
  it('role="switch" のチェックボックスを描き、切り替えると onValueChange を呼ぶ', () => {
    const onValueChange = vi.fn();
    render(<Switch onValueChange={onValueChange}>通知</Switch>);

    const input = screen.getByRole('switch', { name: '通知' });
    expect(input).toHaveProperty('checked', false);
    fireEvent.click(input);
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith(true);
    expect(input).toHaveProperty('checked', true);
  });

  it('className・style は label に、それ以外（ref を含む）は input に渡す', () => {
    const ref = createRef<HTMLInputElement>();
    const labelRef = createRef<HTMLLabelElement>();
    render(
      <Switch
        ref={ref}
        className="a"
        aria-describedby="help"
        partsProps={{ label: { ref: labelRef, className: 'b' } }}
      >
        通知
      </Switch>,
    );

    const input = screen.getByRole('switch');
    expect(ref.current).toBe(input);
    expect(input.getAttribute('aria-describedby')).toBe('help');
    expect(labelRef.current?.className).toBe('a b');
  });

  it('readOnly のときは切り替えない', () => {
    const onValueChange = vi.fn();
    render(<Switch readOnly onValueChange={onValueChange} />);

    fireEvent.click(screen.getByRole('switch'));
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole('switch').getAttribute('aria-readonly')).toBe(
      'true',
    );
  });

  it('組み込んだ部品で描き、主要素の部品に固有の props をトップレベルで渡す', () => {
    const Label = (props: SwitchLabelSlotProps) => (
      <label {...props} data-part="label" />
    );
    function ToneInput({
      tone,
      ...props
    }: SwitchInputSlotProps & { tone: 'plain' | 'strong' }) {
      return <input {...props} data-tone={tone} />;
    }
    const ToneSwitch = withSwitch({ Label, Input: ToneInput });
    render(<ToneSwitch tone="strong">通知</ToneSwitch>);

    const input = screen.getByRole('switch', { name: '通知' });
    expect(input.dataset.tone).toBe('strong');
    expect(input.parentElement?.dataset.part).toBe('label');

    // 主要素（<input>）の部品の props はトップレベルで受け取る。必須のものはトップレベルで渡す
    const missing = {
      // @ts-expect-error tone が無い
      element: <ToneSwitch />,
    };
    expect(missing.element).toBeDefined();
  });

  it('口の props と同じ名前のプロパティを別の型で持つ部品は組み込めない', () => {
    function SizedInput(
      props: Omit<SwitchInputSlotProps, 'size'> & { size: 'small' | 'large' },
    ) {
      return <input {...props} size={undefined} />;
    }

    // @ts-expect-error <input> の size（数）と合わない
    expect(withSwitch({ Input: SizedInput })).toBeDefined();
  });

  it('withCheckboxGroup に組み込める', () => {
    const SwitchGroup = withCheckboxGroup({ Checkbox: Switch });
    const onValueChange = vi.fn();
    render(
      <SwitchGroup
        options={[
          { value: 'mail', label: 'メール' },
          { value: 'push', label: 'プッシュ' },
        ]}
        onValueChange={onValueChange}
      />,
    );

    fireEvent.click(screen.getByRole('switch', { name: 'プッシュ' }));
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith(['push']);
  });

  it('すべて選ぶに組み込まれても、indeterminate を要素に渡さない', () => {
    const SwitchGroup = withCheckboxGroup({ Checkbox: Switch });
    render(
      <SwitchGroup
        options={[{ value: 'mail', label: 'メール' }]}
        showSelectAll
        selectAllLabel="すべて"
      />,
    );

    expect(
      screen
        .getByRole('switch', { name: 'すべて' })
        .hasAttribute('indeterminate'),
    ).toBe(false);
  });
});
