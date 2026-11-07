import type { DisplayOption } from '@fringeworks/react-contract';
import type { ComponentPropsWithRef, ElementType } from 'react';
import type {
  ItemPartProps,
  PartOf,
  PartProps,
  PartsPropsProp,
  PrimaryPartProps,
} from '../../_internal/_parts';
import type Radio from '../Radio';
import type { RadioSlotProps, UseRadioGroupProps } from '../useRadioGroup';

/**
 * ラジオグループに組み込む入れ物の部品が受け取る props
 *
 * `<div>` の props（`role`・`aria-*`・利用者の `className` などを合わせたもの）と、並べる部品（`children`）。
 * 受け取った props は要素に渡す（`role` などを渡さないと、支援技術から見えなくなる）。
 */
export type RadioGroupContainerSlotProps = ComponentPropsWithRef<'div'>;

/**
 * `withRadioGroup` に組み込む部品
 *
 * 組み込んだ部品の props は、作ったコンポーネントのルート（`Container`）と `partsProps.radio` の型になる。
 */
export type RadioGroupParts = {
  /**
   * 部品を並べる入れ物。省略すると `<div>`
   */
  Container?: ElementType;

  /**
   * 選択肢を描くラジオボタン。`RadioSlotProps` を受け取れるもの。省略すると、react-primitives の `Radio`
   */
  Radio?: ElementType;
};

/**
 * 部品の名前と、グループがその部品に渡す props の対応
 */
export type RadioGroupSlots = {
  Container: RadioGroupContainerSlotProps;
  Radio: RadioSlotProps;
};

/**
 * `partsProps` で部品に渡す props
 *
 * 組み込んだ部品の props から、グループが決める `RadioSlotProps` のプロパティを除いたもの。
 *
 * @template V 選択肢の値の型
 * @template P 組み込んだ部品
 */
export type RadioGroupPartsProps<V, P = object> = {
  /**
   * 選択肢のラジオボタンに渡す props。関数なら、選択肢ごとに決める
   */
  radio: ItemPartProps<
    PartProps<PartOf<P, 'Radio', typeof Radio>, keyof RadioSlotProps>,
    DisplayOption<V>
  >;
};

/**
 * `withRadioGroup` で作ったコンポーネントのプロパティ
 *
 * ルートの残りの props は入れ物の部品の props、`partsProps` はラジオボタンの部品の props になる。
 *
 * @template V 選択肢の値の型
 * @template P 組み込んだ部品
 */
export type RadioGroupProps<
  V,
  P extends RadioGroupParts = object,
> = UseRadioGroupProps<V> &
  PartsPropsProp<RadioGroupPartsProps<V, P>> &
  PrimaryPartProps<PartOf<P, 'Container', 'div'>, keyof UseRadioGroupProps<V>>;
