import type { ComponentPropsWithRef, ComponentType } from 'react';
import type { RadioSlotProps, UseRadioGroupProps } from '../useRadioGroup';

/**
 * `withRadioGroup` に組み込む部品
 */
export type RadioGroupParts = {
  /**
   * 選択肢を描くラジオボタン
   */
  Radio: ComponentType<RadioSlotProps>;
};

export type RadioGroupProps<V> = UseRadioGroupProps<V> &
  Omit<ComponentPropsWithRef<'div'>, keyof UseRadioGroupProps<V> | 'children'>;
