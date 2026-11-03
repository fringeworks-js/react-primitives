import type {
  OptionsProps,
  UnlistedPlacementProps,
  ValueProps,
} from '@fringeworks/react-contract';
import type { ComponentPropsWithRef, ReactNode } from 'react';

type OwnProps<V> = ValueProps<V | null> &
  OptionsProps<V> &
  UnlistedPlacementProps & {
    /**
     * 値が空（`null`）のときに表示する内容。省略すると何も表示しない
     */
    placeholder?: ReactNode;
  };

/**
 * `OptionLabel` のプロパティ
 *
 * RadioGroup などの単独の値を選ぶ部品と同じ `value`・`options`・`unlistedPlacement` を渡すと、同じものが見える。
 */
export type OptionLabelProps<V> = OwnProps<V> &
  Omit<ComponentPropsWithRef<'span'>, keyof OwnProps<V> | 'children'>;
