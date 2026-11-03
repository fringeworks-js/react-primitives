import type { ComponentPropsWithRef, ComponentType } from 'react';
import type { ButtonSlotProps, UseButtonGroupProps } from '../useButtonGroup';

/**
 * `withButtonGroup` に組み込む部品
 */
export type ButtonGroupParts = {
  /**
   * 選択肢を描くボタン
   */
  Button: ComponentType<ButtonSlotProps>;
};

export type ButtonGroupProps<V> = UseButtonGroupProps<V> &
  Omit<ComponentPropsWithRef<'div'>, keyof UseButtonGroupProps<V> | 'children'>;
