import type {
  DisplayOption,
  OptionsProps,
  UnlistedPlacementProps,
  ValueProps,
} from '@fringeworks/react-contract';
import type { ComponentPropsWithRef, ElementType, ReactNode } from 'react';
import type {
  ItemPartProps,
  PartOf,
  PartProps,
  PartsPropsProp,
  PrimaryPartProps,
} from '../../_internal/_parts';

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
 * `withOptionLabels` に組み込む入れ物の部品が受け取る props
 *
 * 利用者の props と、並べるラベル（`children`）。受け取った props は要素に渡す。
 */
export type OptionLabelsContainerSlotProps = ComponentPropsWithRef<'span'>;

/**
 * `withOptionLabels` に組み込む、ラベル1つを描く部品が受け取る props
 *
 * `partsProps.label` で渡したものと、ラベルの文字（`children`）。受け取った props は要素に渡す。
 */
export type OptionLabelsLabelSlotProps = ComponentPropsWithRef<'span'>;

/**
 * `withOptionLabels` に組み込む部品
 *
 * どれも省略でき、省略すると `<span>` で描く。組み込んだ部品の props は、作ったコンポーネントの
 * ルート（`Container`）と `partsProps.label` の型になる。
 */
export type OptionLabelsParts = {
  /**
   * ラベルを並べる入れ物
   */
  Container?: ElementType;

  /**
   * ラベル1つ（チップのように見せる、など）
   */
  Label?: ElementType;
};

/**
 * 部品の名前と、部品に渡す props の対応
 */
export type OptionLabelsSlots = {
  Container: OptionLabelsContainerSlotProps;
  Label: OptionLabelsLabelSlotProps;
};

/**
 * `partsProps` で部品に渡す props
 *
 * @template V 選択肢の値の型
 * @template P 組み込んだ部品
 */
export type OptionLabelsPartsProps<V, P = object> = {
  /**
   * ラベル1つの部品に渡す props。関数なら、表示する選択肢ごとに決める（CheckboxGroup の `partsProps.checkbox` と同じ選択肢を受け取る）
   */
  label: ItemPartProps<
    PartProps<PartOf<P, 'Label', 'span'>, 'children'>,
    DisplayOption<V>
  >;
};

/**
 * `withOptionLabels` で作ったコンポーネント（`OptionLabels`）のプロパティ
 *
 * CheckboxGroup などの複数の値を選ぶ部品と同じ `value`・`options`・`unlistedPlacement` を渡すと、同じものが見える。
 * ルートの残りの props は入れ物の部品の props、`partsProps.label` はラベルの部品の props になる。
 *
 * @template V 選択肢の値の型
 * @template P 組み込んだ部品
 */
export type OptionLabelsProps<
  V,
  P extends OptionLabelsParts = object,
> = OwnProps<V> &
  PartsPropsProp<OptionLabelsPartsProps<V, P>> &
  PrimaryPartProps<PartOf<P, 'Container', 'span'>, keyof OwnProps<V>>;
