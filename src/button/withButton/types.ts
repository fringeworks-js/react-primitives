import type {
  DisabledProps,
  MainActionProps,
} from '@fringeworks/react-contract';
import type { ComponentPropsWithRef, ElementType, ReactNode } from 'react';
import type { PartOf, PrimaryPartProps } from '../../_internal/_parts';

/**
 * `withButton` に組み込む `<button>` の部品が受け取る props
 *
 * 部品が付ける `type`・`onClick` と、利用者の props（`ref`・`children` を含む）。受け取った props は要素に渡す。
 */
export type ButtonButtonSlotProps = ComponentPropsWithRef<'button'>;

/**
 * `withButton` に組み込む部品
 *
 * 省略すると `<button>` で描く。組み込んだ部品の props は、作ったコンポーネントのプロパティの型になる。
 */
export type ButtonParts = {
  /**
   * 押せる要素（主要素でルート）
   */
  Button?: ElementType;
};

/**
 * 部品の名前と、部品に渡す props の対応
 */
export type ButtonSlots = {
  Button: ButtonButtonSlotProps;
};

type OwnProps<V> = DisabledProps &
  MainActionProps<V> & {
    /**
     * 押したときに `onMainAction` に渡す値。HTML の `<button>` の `value` には渡さない
     */
    value?: V;
  };

/**
 * `withButton` で作ったコンポーネント（`Button`）のプロパティ
 *
 * その他の props は、組み込んだ部品（省略したら `<button>`）の props になる。
 *
 * @template V `value` の型。`value` を省略すると `undefined`
 * @template P 組み込んだ部品
 */
export type ButtonProps<
  V = undefined,
  P extends ButtonParts = object,
> = OwnProps<V> &
  PrimaryPartProps<PartOf<P, 'Button', 'button'>, keyof OwnProps<V>> & {
    /**
     * ボタンの中身
     */
    children?: ReactNode;
  };
