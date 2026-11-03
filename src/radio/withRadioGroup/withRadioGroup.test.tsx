import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Radio from '../Radio';
import type { RadioSlotProps } from '../useRadioGroup';
import withRadioGroup from './withRadioGroup';

const RadioGroup = withRadioGroup({ Radio });

const options = [
  { value: 'a', label: 'りんご' },
  { value: 'b', label: 'みかん' },
];

describe('withRadioGroup', () => {
  it('radiogroup の中に、選択肢のラジオボタンを並べる', () => {
    render(<RadioGroup options={options} aria-label="果物" />);

    const group = screen.getByRole('radiogroup', { name: '果物' });
    const radios = screen.getAllByRole<HTMLInputElement>('radio');
    expect(radios).toHaveLength(2);
    expect(radios.every((radio) => group.contains(radio))).toBe(true);
    expect(radios[0]?.name).not.toBe('');
    expect(radios[1]?.name).toBe(radios[0]?.name);
  });

  it('押すと選んだ値を通知し、選んだラジオボタンだけがチェックされる', () => {
    const onValueChange = vi.fn();
    render(
      <RadioGroup
        options={options}
        defaultValue="a"
        onValueChange={onValueChange}
      />,
    );

    fireEvent.click(screen.getByLabelText('みかん'));

    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('b');
    expect(screen.getByLabelText<HTMLInputElement>('みかん').checked).toBe(
      true,
    );
    expect(screen.getByLabelText<HTMLInputElement>('りんご').checked).toBe(
      false,
    );
  });

  it('readOnly のときは押しても変わらない', () => {
    const onValueChange = vi.fn();
    render(
      <RadioGroup
        options={options}
        defaultValue="a"
        readOnly
        onValueChange={onValueChange}
      />,
    );

    fireEvent.click(screen.getByLabelText('みかん'));

    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByLabelText<HTMLInputElement>('りんご').checked).toBe(
      true,
    );
    expect(screen.getByRole('radiogroup').getAttribute('aria-readonly')).toBe(
      'true',
    );
  });

  it('その他の props は入れ物に渡す', () => {
    render(<RadioGroup options={options} className="group" />);

    expect(screen.getByRole('radiogroup').className).toBe('group');
  });

  it('自分の部品を組み込める', () => {
    function AppRadio({ value, onValueChange, children }: RadioSlotProps) {
      return (
        <button
          type="button"
          aria-pressed={value}
          onClick={() => onValueChange(true)}
        >
          {children}
        </button>
      );
    }
    const AppRadioGroup = withRadioGroup({ Radio: AppRadio });
    const onValueChange = vi.fn();
    render(<AppRadioGroup options={options} onValueChange={onValueChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'みかん' }));

    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('b');
    expect(AppRadioGroup.displayName).toBe('withRadioGroup(AppRadio)');
  });
});
