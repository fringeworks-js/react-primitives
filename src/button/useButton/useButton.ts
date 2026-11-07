import type { UseButtonProps, UseButtonResult } from './types';

/**
 * ボタンの振る舞いを扱うhook（ヘッドレス UI）
 *
 * 押すと、`value` をそのまま `onMainAction` に渡す（`value` を省略すると `undefined`）。状態は持たない。
 *
 * - 利用者の `onClick` を先に呼び、そこで `event.preventDefault()` されたら `onMainAction` は呼ばない
 * - `type` を省略すると `'button'`（フォームの中でも送信しない）
 *
 * @param props 値・通知・設定（ボタンのコンポーネントと同じもの）
 * @returns `<button>` に渡す props を作る関数
 */
export default function useButton<V = undefined>({
  value,
  onMainAction,
  disabled,
  type = 'button',
}: UseButtonProps<V>): UseButtonResult {
  return {
    getButtonProps: (handlers = {}) => ({
      type,
      disabled,
      onClick: (event) => {
        handlers.onClick?.(event);
        if (!event.defaultPrevented) {
          onMainAction?.(value as V);
        }
      },
    }),
  };
}
