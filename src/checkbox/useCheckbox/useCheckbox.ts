import { useControllableState } from '@fringeworks/react-utils';
import { useLayoutEffect, useRef } from 'react';
import type { UseCheckboxProps, UseCheckboxResult } from './types';

/**
 * チェックボックスの振る舞いを扱うhook（ヘッドレス UI）
 *
 * HTML の `<input type="checkbox">` で値を扱う。値は値と操作の契約（`value`・`defaultValue`・`onValueChange`）に沿う。
 *
 * - 利用者の `onChange` を先に呼び、そこで `event.preventDefault()` されたら値を変えない
 * - `readOnly` のときは値を変えず、`aria-readonly` を付ける。`invalid` は `aria-invalid` で付ける
 * - `indeterminate` は HTML の属性が無いので、`getInputProps` が返す `ref` で DOM に設定する
 *
 * @param props 値・設定（チェックボックスのコンポーネントと同じもの）
 * @returns 値と、`<input>` に渡す props を作る関数
 */
export default function useCheckbox({
  value: valueProp,
  defaultValue,
  onValueChange,
  disabled,
  readOnly,
  required,
  invalid,
  indeterminate,
}: UseCheckboxProps): UseCheckboxResult {
  const [value, setValue] = useControllableState({
    value: valueProp,
    defaultValue: defaultValue ?? false,
    onValueChange,
  });

  // indeterminate は HTML の属性が無く、DOM のプロパティでだけ設定できる
  const inputRef = useRef<HTMLInputElement>(null);
  useLayoutEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate ?? false;
    }
  }, [indeterminate]);

  return {
    value,
    getInputProps: (handlers = {}) => ({
      type: 'checkbox',
      checked: value,
      disabled,
      required,
      'aria-readonly': readOnly || undefined,
      'aria-invalid': invalid || undefined,
      ref: inputRef,
      onChange: (event) => {
        handlers.onChange?.(event);
        if (!event.defaultPrevented && !readOnly) {
          setValue(event.currentTarget.checked);
        }
      },
    }),
  };
}
