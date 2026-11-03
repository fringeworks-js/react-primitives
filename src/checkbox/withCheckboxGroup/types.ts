import type { ComponentPropsWithRef, ComponentType, ReactNode } from 'react';
import type {
  CheckboxSlotProps,
  UseCheckboxGroupProps,
} from '../useCheckboxGroup';

/**
 * `withCheckboxGroup` に組み込む部品
 */
export type CheckboxGroupParts = {
  /**
   * 選択肢を描くチェックボックス（`SelectAll` を省略したら、すべて選ぶも描く）
   */
  Checkbox: ComponentType<CheckboxSlotProps>;

  /**
   * すべて選ぶを描く部品。省略すると `Checkbox` で描く
   */
  SelectAll?: ComponentType<CheckboxSlotProps>;
};

export type CheckboxGroupProps<V> = UseCheckboxGroupProps<V> &
  Omit<
    ComponentPropsWithRef<'div'>,
    keyof UseCheckboxGroupProps<V> | 'children'
  > & {
    /**
     * すべて選ぶのチェックボックスを表示する
     */
    showSelectAll?: boolean;

    /**
     * すべて選ぶのチェックボックスの文字。省略するとチェックボックスだけを表示する
     */
    selectAllLabel?: ReactNode;
  };
