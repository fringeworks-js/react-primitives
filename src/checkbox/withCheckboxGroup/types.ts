import type { DisplayOption } from '@fringeworks/react-contract';
import type { ComponentPropsWithRef, ElementType, ReactNode } from 'react';
import type {
  ItemPartProps,
  PartOf,
  PartProps,
  PartsPropsProp,
  PrimaryPartProps,
} from '../../_internal/_parts';
import type Checkbox from '../Checkbox';
import type {
  CheckboxSlotProps,
  UseCheckboxGroupProps,
} from '../useCheckboxGroup';

/**
 * チェックボックスグループに組み込む入れ物の部品が受け取る props
 *
 * `<div>` の props（`role`・`aria-*`・利用者の `className` などを合わせたもの）と、並べる部品（`children`）。
 * 受け取った props は要素に渡す（`role` などを渡さないと、支援技術から見えなくなる）。
 */
export type CheckboxGroupContainerSlotProps = ComponentPropsWithRef<'div'>;

/**
 * `withCheckboxGroup` に組み込む部品
 *
 * 組み込んだ部品の props は、作ったコンポーネントのルート（`Container`）と
 * `partsProps.checkbox`・`partsProps.selectAll` の型になる。
 */
export type CheckboxGroupParts = {
  /**
   * 部品を並べる入れ物。省略すると `<div>`
   */
  Container?: ElementType;

  /**
   * 選択肢を描くチェックボックス（`SelectAll` を省略したら、すべて選ぶも描く）。`CheckboxSlotProps` を受け取れるもの。省略すると、react-primitives の `Checkbox`
   */
  Checkbox?: ElementType;

  /**
   * すべて選ぶを描く部品。省略すると `Checkbox` で描く。`CheckboxSlotProps` を受け取れるもの
   */
  SelectAll?: ElementType;
};

/**
 * 部品の名前と、グループがその部品に渡す props の対応
 */
export type CheckboxGroupSlots = {
  Container: CheckboxGroupContainerSlotProps;
  Checkbox: CheckboxSlotProps;
  SelectAll: CheckboxSlotProps;
};

type CheckboxPart<P> = PartOf<P, 'Checkbox', typeof Checkbox>;

type OwnProps<V> = UseCheckboxGroupProps<V> & {
  /**
   * すべて選ぶのチェックボックスを表示する
   */
  showSelectAll?: boolean;

  /**
   * すべて選ぶのチェックボックスの文字。省略するとチェックボックスだけを表示する
   */
  selectAllLabel?: ReactNode;
};

/**
 * `partsProps` で部品に渡す props
 *
 * 組み込んだ部品の props から、グループが決める `CheckboxSlotProps` のプロパティを除いたもの。
 *
 * @template V 選択肢の値の型
 * @template P 組み込んだ部品
 */
export type CheckboxGroupPartsProps<V, P = object> = {
  /**
   * 選択肢のチェックボックスに渡す props。関数なら、選択肢ごとに決める
   */
  checkbox: ItemPartProps<
    PartProps<CheckboxPart<P>, keyof CheckboxSlotProps>,
    DisplayOption<V>
  >;

  /**
   * すべて選ぶのチェックボックスに渡す props
   */
  selectAll: PartProps<
    PartOf<P, 'SelectAll', CheckboxPart<P>>,
    keyof CheckboxSlotProps
  >;
};

/**
 * `withCheckboxGroup` で作ったコンポーネントのプロパティ
 *
 * ルートの残りの props は入れ物の部品の props、`partsProps` はチェックボックスの部品の props になる。
 *
 * @template V 選択肢の値の型
 * @template P 組み込んだ部品
 */
export type CheckboxGroupProps<
  V,
  P extends CheckboxGroupParts = object,
> = OwnProps<V> &
  PartsPropsProp<CheckboxGroupPartsProps<V, P>> &
  PrimaryPartProps<PartOf<P, 'Container', 'div'>, keyof OwnProps<V>>;
