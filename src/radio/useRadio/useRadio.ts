import type { UseRadioProps, UseRadioResult } from './types';

/**
 * ラジオボタンの振る舞いを扱うhook（ヘッドレス UI）
 *
 * HTML の `<input type="radio">` で、選ばれたことを `onValueChange(true)` で知らせる（制御だけ）。
 *
 * - 利用者の `onChange` を先に呼び、そこで `event.preventDefault()` されたら知らせない
 * - `readOnly` のときは知らせない。`readOnly`・`invalid` の ARIA の属性はラジオボタンには付けられないので、グループの入れ物に付ける（`useRadioGroup`）
 *
 * @param props 値・設定（ラジオボタンのコンポーネントと同じもの）
 * @returns `<input>` に渡す props を作る関数
 */
export default function useRadio({
  value,
  onValueChange,
  name,
  disabled,
  readOnly,
  required,
}: UseRadioProps): UseRadioResult {
  return {
    getInputProps: (handlers = {}) => ({
      type: 'radio',
      name,
      checked: value,
      disabled,
      required,
      onChange: (event) => {
        handlers.onChange?.(event);
        if (!event.defaultPrevented && !readOnly) {
          onValueChange?.(true);
        }
      },
    }),
  };
}
