import type { DisplayOption } from '@fringeworks/react-contract';
import type { ComponentPropsWithRef, ElementType } from 'react';
import type {
  ItemPartProps,
  PartOf,
  PartProps,
  PartsPropsProp,
  PrimaryPartProps,
} from '../../_internal/_parts';
import type Button from '../Button';
import type { ButtonSlotProps, UseButtonGroupProps } from '../useButtonGroup';

/**
 * ボタングループに組み込む入れ物の部品が受け取る props
 *
 * `<div>` の props（`role`・`aria-*`・利用者の `className` などを合わせたもの）と、並べる部品（`children`）。
 * 受け取った props は要素に渡す（`role` などを渡さないと、支援技術から見えなくなる）。
 */
export type ButtonGroupContainerSlotProps = ComponentPropsWithRef<'div'>;

/**
 * `withButtonGroup` に組み込む部品
 *
 * 組み込んだ部品の props は、作ったコンポーネントのルート（`Container`）と `partsProps.button` の型になる。
 */
export type ButtonGroupParts = {
  /**
   * 部品を並べる入れ物。省略すると `<div>`
   */
  Container?: ElementType;

  /**
   * 選択肢を描くボタン。`ButtonSlotProps` を受け取れるもの。省略すると、react-primitives の `Button`
   */
  Button?: ElementType;
};

/**
 * 部品の名前と、グループがその部品に渡す props の対応
 */
export type ButtonGroupSlots = {
  Container: ButtonGroupContainerSlotProps;
  Button: ButtonSlotProps;
};

/**
 * `partsProps` で部品に渡す props
 *
 * 組み込んだ部品の props から、グループが決める `ButtonSlotProps` のプロパティを除いたもの。
 *
 * @template V 選択肢の値の型
 * @template P 組み込んだ部品
 */
export type ButtonGroupPartsProps<V, P = object> = {
  /**
   * 選択肢のボタンに渡す props。関数なら、選択肢ごとに決める
   */
  button: ItemPartProps<
    PartProps<PartOf<P, 'Button', typeof Button>, keyof ButtonSlotProps>,
    DisplayOption<V>
  >;
};

/**
 * `withButtonGroup` で作ったコンポーネントのプロパティ
 *
 * ルートの残りの props は入れ物の部品の props、`partsProps` はボタンの部品の props になる。
 *
 * @template V 選択肢の値の型
 * @template P 組み込んだ部品
 */
export type ButtonGroupProps<
  V,
  P extends ButtonGroupParts = object,
> = UseButtonGroupProps<V> &
  PartsPropsProp<ButtonGroupPartsProps<V, P>> &
  PrimaryPartProps<PartOf<P, 'Container', 'div'>, keyof UseButtonGroupProps<V>>;
