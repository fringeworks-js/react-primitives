import type {
  OptionsProps,
  UnlistedPlacementProps,
  ValueProps,
} from '@fringeworks/react-contract';
import type { ComponentPropsWithRef, ElementType, ReactNode } from 'react';
import type { PartOf, PrimaryPartProps } from '../../_internal/_parts';

type OwnProps<V> = ValueProps<V | null> &
  OptionsProps<V> &
  UnlistedPlacementProps & {
    /**
     * 値が空（`null`）のときに表示する内容。省略すると何も表示しない
     */
    placeholder?: ReactNode;
  };

/**
 * `withOptionLabel` に組み込む `<span>` の部品が受け取る props
 *
 * 利用者の props と、ラベルの文字（`children`）。受け取った props は要素に渡す。
 */
export type OptionLabelContainerSlotProps = ComponentPropsWithRef<'span'>;

/**
 * `withOptionLabel` に組み込む部品
 *
 * 省略すると `<span>` で描く。組み込んだ部品の props は、作ったコンポーネントのルートの型になる。
 */
export type OptionLabelParts = {
  /**
   * ラベルの文字を入れる要素
   */
  Container?: ElementType;
};

/**
 * 部品の名前と、部品に渡す props の対応
 */
export type OptionLabelSlots = {
  Container: OptionLabelContainerSlotProps;
};

/**
 * `withOptionLabel` で作ったコンポーネント（`OptionLabel`）のプロパティ
 *
 * RadioGroup などの単独の値を選ぶ部品と同じ `value`・`options`・`unlistedPlacement` を渡すと、同じものが見える。
 *
 * @template V 選択肢の値の型
 * @template P 組み込んだ部品
 */
export type OptionLabelProps<
  V,
  P extends OptionLabelParts = object,
> = OwnProps<V> &
  PrimaryPartProps<PartOf<P, 'Container', 'span'>, keyof OwnProps<V>>;
