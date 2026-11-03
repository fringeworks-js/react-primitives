import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Button from '../Button';
import type { ButtonSlotProps } from '../useButtonGroup';
import withButtonGroup from './withButtonGroup';

const ButtonGroup = withButtonGroup({ Button });

const options = [
  { value: 'copy', label: 'コピー' },
  { value: 'delete', label: '削除', disabled: true },
];

describe('withButtonGroup', () => {
  it('group の中に、選択肢のボタンを並べる', () => {
    render(<ButtonGroup options={options} aria-label="操作" />);

    const group = screen.getByRole('group', { name: '操作' });
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
    expect(buttons.every((button) => group.contains(button))).toBe(true);
    expect(buttons[1]).toHaveProperty('disabled', true);
  });

  it('Button をそのまま組み込み、押されたボタンの選択肢の値を onMainAction に渡す', () => {
    const onMainAction = vi.fn();
    render(<ButtonGroup options={options} onMainAction={onMainAction} />);

    fireEvent.click(screen.getByRole('button', { name: 'コピー' }));

    expect(onMainAction).toHaveBeenCalledExactlyOnceWith('copy');
  });

  it('単独の Button と同じハンドラーを使える', () => {
    const calls: string[] = [];
    const run = (value: string) => calls.push(value);
    render(
      <>
        <Button value="save" onMainAction={run}>
          保存
        </Button>
        <ButtonGroup options={options} onMainAction={run} />
      </>,
    );

    fireEvent.click(screen.getByRole('button', { name: '保存' }));
    fireEvent.click(screen.getByRole('button', { name: 'コピー' }));

    expect(calls).toEqual(['save', 'copy']);
  });

  it('その他の props は入れ物に渡し、自分の部品を組み込める', () => {
    function AppButton({ onMainAction, children }: ButtonSlotProps) {
      return (
        <a href="#" onClick={() => onMainAction(undefined)}>
          {children}
        </a>
      );
    }
    const AppButtonGroup = withButtonGroup({ Button: AppButton });
    const onMainAction = vi.fn();
    render(
      <AppButtonGroup
        options={options}
        onMainAction={onMainAction}
        className="group"
      />,
    );

    fireEvent.click(screen.getByText('コピー'));

    expect(screen.getByRole('group').className).toBe('group');
    expect(onMainAction).toHaveBeenCalledExactlyOnceWith('copy');
    expect(AppButtonGroup.displayName).toBe('withButtonGroup(AppButton)');
  });
});
