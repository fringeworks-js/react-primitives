import type {
  OptionsProps,
  UnlistedPlacementProps,
  ValueProps,
} from '@fringeworks/react-contract';
import type { ComponentPropsWithRef, ReactNode } from 'react';

type OwnProps<V> = ValueProps<readonly V[]> &
  OptionsProps<V> &
  UnlistedPlacementProps & {
    /**
     * ラベルの間に置く内容。省略すると `', '`
     */
    separator?: ReactNode;

    /**
     * 値が空（空の配列）のときに表示する内容。省略すると何も表示しない
     */
    placeholder?: ReactNode;
  };

/**
 * `OptionLabels` のプロパティ
 *
 * CheckboxGroup などの複数の値を選ぶ部品と同じ `value`・`options`・`unlistedPlacement` を渡すと、同じものが見える。
 */
export type OptionLabelsProps<V> = OwnProps<V> &
  Omit<ComponentPropsWithRef<'span'>, keyof OwnProps<V> | 'children'>;
