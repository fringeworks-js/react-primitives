import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Checkbox from '../Checkbox';
import type { CheckboxSlotProps } from '../useCheckboxGroup';
import withCheckboxGroup from './withCheckboxGroup';

const CheckboxGroup = withCheckboxGroup({ Checkbox });

const options = [
  { value: 'a', label: 'りんご' },
  { value: 'b', label: 'みかん' },
];

describe('withCheckboxGroup', () => {
  it('入れ物の中に選択肢のチェックボックスを並べる', () => {
    render(<CheckboxGroup options={options} aria-label="果物" />);

    const group = screen.getByRole('group', { name: '果物' });
    expect(group.hasAttribute('class')).toBe(false);
    expect(
      screen.getAllByRole('checkbox').map((c) => c.parentElement?.textContent),
    ).toEqual(['りんご', 'みかん']);
  });

  it('押すと選んだ値を通知する', () => {
    const onValueChange = vi.fn();
    render(<CheckboxGroup options={options} onValueChange={onValueChange} />);

    fireEvent.click(screen.getByLabelText('みかん'));

    expect(onValueChange).toHaveBeenCalledExactlyOnceWith(['b']);
    expect(screen.getByLabelText<HTMLInputElement>('みかん').checked).toBe(
      true,
    );
  });

  it('showSelectAll で、すべて選ぶを先頭に表示する', () => {
    const onValueChange = vi.fn();
    render(
      <CheckboxGroup
        options={options}
        defaultValue={['a']}
        onValueChange={onValueChange}
        showSelectAll
        selectAllLabel="すべて"
      />,
    );

    const selectAll = screen.getByLabelText<HTMLInputElement>('すべて');
    expect(screen.getAllByRole('checkbox')[0]).toBe(selectAll);
    expect(selectAll.indeterminate).toBe(true);

    fireEvent.click(selectAll);

    expect(onValueChange).toHaveBeenCalledExactlyOnceWith(['a', 'b']);
    expect(selectAll.checked).toBe(true);
    expect(selectAll.indeterminate).toBe(false);
  });

  it('selectAllLabel を省略すると、チェックボックスだけを表示する', () => {
    render(<CheckboxGroup options={options} showSelectAll />);

    const [selectAll] = screen.getAllByRole('checkbox');
    expect(selectAll?.parentElement?.textContent).toBe('');
  });

  it('既定では、すべて選ぶを表示しない', () => {
    render(<CheckboxGroup options={options} selectAllLabel="すべて" />);

    expect(screen.getAllByRole('checkbox')).toHaveLength(2);
  });

  it('組み込んだ部品で描き、displayName に部品の名前を含める', () => {
    function AppCheckbox({
      value,
      onValueChange,
      children,
    }: CheckboxSlotProps) {
      return (
        <button
          type="button"
          aria-pressed={value}
          onClick={() => onValueChange(!value)}
        >
          {children}
        </button>
      );
    }
    const AppCheckboxGroup = withCheckboxGroup({ Checkbox: AppCheckbox });
    const onValueChange = vi.fn();
    render(
      <AppCheckboxGroup options={options} onValueChange={onValueChange} />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'りんご' }));

    expect(onValueChange).toHaveBeenCalledExactlyOnceWith(['a']);
    expect(AppCheckboxGroup.displayName).toBe('withCheckboxGroup(AppCheckbox)');
  });

  it('SelectAll を渡すと、すべて選ぶだけをその部品で描く', () => {
    function SelectAllButton({
      value,
      onValueChange,
      children,
    }: CheckboxSlotProps) {
      return (
        <button type="button" onClick={() => onValueChange(!value)}>
          {children}
        </button>
      );
    }
    const AppCheckboxGroup = withCheckboxGroup({
      Checkbox,
      SelectAll: SelectAllButton,
    });
    const onValueChange = vi.fn();
    render(
      <AppCheckboxGroup
        options={options}
        onValueChange={onValueChange}
        showSelectAll
        selectAllLabel="すべて"
      />,
    );

    expect(screen.getAllByRole('checkbox')).toHaveLength(options.length);
    fireEvent.click(screen.getByRole('button', { name: 'すべて' }));

    expect(onValueChange).toHaveBeenCalledOnce();
  });

  it('値の型は options から推論する', () => {
    const onValueChange = vi.fn((_value: number[]) => {});
    render(
      <CheckboxGroup
        options={[{ value: 1 }, { value: 2 }]}
        onValueChange={onValueChange}
      />,
    );

    fireEvent.click(screen.getByLabelText('2'));

    expect(onValueChange).toHaveBeenCalledExactlyOnceWith([2]);
  });
});
