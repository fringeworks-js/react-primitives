import type {
  DisabledProps,
  MainActionProps,
} from '@fringeworks/react-contract';
import type { ButtonHTMLAttributes, MouseEventHandler } from 'react';

/**
 * `useButton` が受け取る props
 *
 * @template V `value` の型
 */
export type UseButtonProps<V = undefined> = DisabledProps &
  MainActionProps<V> & {
    /**
     * 押したときに `onMainAction` に渡す値。HTML の `<button>` の `value` には渡さない
     */
    value?: V;

    /**
     * `<button>` の `type`。省略すると `'button'`（フォームの中でも送信しない）
     */
    type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  };

/**
 * `<button>` に渡す props
 */
export type ButtonElementProps = {
  type: NonNullable<ButtonHTMLAttributes<HTMLButtonElement>['type']>;
  disabled?: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
};

export type UseButtonResult = {
  /**
   * `<button>` に渡す props を作る。利用者の `onClick` を渡すと、部品の処理の前に呼ぶ
   */
  getButtonProps: (handlers?: {
    onClick?: MouseEventHandler<HTMLButtonElement>;
  }) => ButtonElementProps;
};
