import type {
  ComponentPropsWithRef,
  ComponentType,
  ElementType,
  ReactNode,
} from 'react';
import type {
  PartOf,
  PartProps,
  PartsPropsProp,
  PrimaryPartProps,
} from '../../_internal/_parts';
import type { UseCollapsibleProps } from '../useCollapsible';

/**
 * 折りたためる部品に組み込む `<details>` の部品が受け取る props
 *
 * 利用者の props と、部品が付ける `open`・`onToggle`、`children`（`<summary>` と中身）。
 * 受け取った props は `<details>` に渡す（開閉は `<details>` の `open`・`toggle` で扱うので、`<details>` を描く）。
 */
export type CollapsibleDetailsSlotProps = ComponentPropsWithRef<'details'>;

/**
 * 折りたためる部品に組み込む `<summary>` の部品が受け取る props
 *
 * `partsProps.summary` で渡したものと、部品が付ける `onClick`・`aria-disabled`、`children`（見出し）。受け取った props は `<summary>` に渡す。
 */
export type CollapsibleSummarySlotProps = ComponentPropsWithRef<'summary'>;

/**
 * `withCollapsible` に組み込む印（`Indicator`）の部品が受け取る props
 *
 * 開閉の状態。印は飾りなので、`aria-hidden` を常に受け取る。受け取った状態で印を描く
 * （素の要素をそのまま組み込むと、状態が DOM の属性に落ちる）。
 */
export type CollapsibleIndicatorSlotProps = {
  /**
   * 開いているか
   */
  open: boolean;

  /**
   * 操作できないか
   */
  disabled: boolean;

  'aria-hidden': true;
};

/**
 * `withCollapsible` に組み込む部品
 *
 * どれも省略でき、省略すると素の要素で描く。組み込んだ部品の props は、作ったコンポーネントの
 * ルート（`Details`）と `partsProps.summary` の型になる。
 */
export type CollapsibleParts = {
  /**
   * `<details>` を描く部品
   */
  Details?: ElementType;

  /**
   * `<summary>` を描く部品
   */
  Summary?: ElementType;

  /**
   * `<summary>` の中の、見出しの前に描く開閉の印。省略すると描かない
   */
  Indicator?: ElementType;
};

/**
 * 部品の名前と、折りたためる部品がその部品に渡す props の対応
 */
export type CollapsibleSlots = {
  Details: CollapsibleDetailsSlotProps;
  Summary: CollapsibleSummarySlotProps;
  Indicator: CollapsibleIndicatorSlotProps;
};

type OwnProps = UseCollapsibleProps & {
  /**
   * 見出し（`<summary>` の中身）
   */
  summary?: ReactNode;

  /**
   * 開いたときに見える中身
   */
  children?: ReactNode;
};

/**
 * `partsProps` で部品に渡す props
 *
 * @template P 組み込んだ部品
 */
export type CollapsiblePartsProps<P = object> = {
  /**
   * `<summary>` の部品に渡す props
   */
  summary: PartProps<PartOf<P, 'Summary', 'summary'>, 'children'>;

  /**
   * 印（`Indicator`）の部品に渡す props。部品が決める状態（`CollapsibleIndicatorSlotProps`）は渡せない
   */
  indicator: PartProps<
    PartOf<P, 'Indicator', ComponentType<CollapsibleIndicatorSlotProps>>,
    keyof CollapsibleIndicatorSlotProps
  >;
};

/**
 * `withCollapsible` で作ったコンポーネント（`Collapsible`）のプロパティ
 *
 * `defaultOpen` を省略すると閉じている。ルートの残りの props は `<details>` の部品の props、
 * `partsProps.summary` は `<summary>` の部品の props になる。
 *
 * @template P 組み込んだ部品
 */
export type CollapsibleProps<P extends CollapsibleParts = object> = OwnProps &
  PartsPropsProp<CollapsiblePartsProps<P>> &
  PrimaryPartProps<PartOf<P, 'Details', 'details'>, keyof OwnProps>;
