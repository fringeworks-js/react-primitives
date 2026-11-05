import withButton from '../withButton';

/**
 * 値と操作の契約（`onMainAction`）に沿ったボタン
 *
 * `withButton` で、`<button>` で描くようにしたもの。
 * 押すと、`value` をそのまま `onMainAction` に渡す（`value` を省略すると `undefined`）。
 * `onClick` を先に呼び、そこで `event.preventDefault()` されたら `onMainAction` は呼ばない。
 * `type` を省略すると `'button'`（フォームの中でも送信しない）。その他の props は `<button>` に渡す。
 */
const Button = withButton();
Button.displayName = 'Button';

export default Button;
