import type { ReactElement } from 'react';
import type { ButtonProps } from './types';

/**
 * 値と操作の契約（`onMainAction`）に沿ったボタン
 *
 * 押すと、`value` をそのまま `onMainAction` に渡す（`value` を省略すると `undefined`）。
 * `onClick` を先に呼び、そこで `event.preventDefault()` されたら `onMainAction` は呼ばない。
 * `type` を省略すると `'button'`（フォームの中でも送信しない）。その他の props は `<button>` に渡す。
 */
export default function Button<V = undefined>({
  value,
  onMainAction,
  onClick,
  type = 'button',
  ...rest
}: ButtonProps<V>): ReactElement {
  return (
    <button
      {...rest}
      type={type}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          // value を省略したときは V が undefined になる
          onMainAction?.(value as V);
        }
      }}
    />
  );
}
