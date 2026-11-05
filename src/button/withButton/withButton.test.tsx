import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ButtonButtonSlotProps } from './types';
import withButton from './withButton';

describe('withButton', () => {
  it('組み込んだ部品で描き、押されたら value を onMainAction に渡す', () => {
    function ToneButton({
      tone,
      ...props
    }: ButtonButtonSlotProps & { tone: 'primary' | 'secondary' }) {
      return <button {...props} data-tone={tone} />;
    }
    const Button = withButton({ Button: ToneButton });
    const onMainAction = vi.fn();
    render(
      <Button value="save" tone="primary" onMainAction={onMainAction}>
        保存
      </Button>,
    );

    const button = screen.getByRole('button', { name: '保存' });
    expect([button.dataset.tone, button.getAttribute('type')]).toEqual([
      'primary',
      'button',
    ]);
    fireEvent.click(button);
    expect(onMainAction).toHaveBeenCalledExactlyOnceWith('save');

    const missing = {
      // @ts-expect-error 部品の tone が無い
      element: <Button>保存</Button>,
    };
    expect(missing.element).toBeDefined();
  });

  it('displayName に組み込んだ部品の名前を入れる', () => {
    function AppButton(props: ButtonButtonSlotProps) {
      return <button {...props} />;
    }

    expect(withButton({ Button: AppButton }).displayName).toBe(
      'withButton(AppButton)',
    );
  });
});
