import { useControllableState } from '@fringeworks/react-utils';
import { useState, type KeyboardEvent } from 'react';
import type { UseTextInputProps, UseTextInputResult } from './types';

/**
 * IME で変換している間のキー操作か
 *
 * 変換を決める Enter で確定しないようにする。古い Safari は `isComposing` を立てないので、`keyCode` の 229 も見る。
 */
function isComposing(event: KeyboardEvent<HTMLInputElement>): boolean {
  return event.nativeEvent.isComposing || event.keyCode === 229;
}

/**
 * テキストの入力の振る舞いを扱うhook（ヘッドレス UI）
 *
 * 入力中の文字列を下書きとして持ち、確定したときに `onValueChange` を呼ぶ（値と操作の契約の V-1a）。
 *
 * - 既定（`valueChangeTiming: 'commit'`）では、フォーカスが外れたとき・Enter を押したときに確定する。IME の変換中の Enter では確定しない
 * - Esc を押すと、下書きを確定した値に戻す
 * - 入力のたびに `onInputValueChange` を呼ぶ
 * - 親が `value` を変えたら、入力中でも下書きを置き換える。確定した文字列を親が受け入れなかったときも、親の値に戻す
 * - 利用者の `onKeyDown` で `event.preventDefault()` されたら、Enter・Esc の処理をしない
 *
 * @param props 値・通知・確定のタイミング（テキストの入力のコンポーネントと同じ props）
 * @returns 確定した文字列・下書きと、`<input>` に渡す props を作る関数
 */
export default function useTextInput({
  value: valueProp,
  defaultValue,
  onValueChange,
  onInputValueChange,
  valueChangeTiming = 'commit',
}: UseTextInputProps): UseTextInputResult {
  const [value, setValue] = useControllableState({
    value: valueProp,
    defaultValue: defaultValue ?? '',
    onValueChange,
  });

  const [inputValue, setInputValue] = useState(value);
  const [prevValue, setPrevValue] = useState(value);
  // 確定した後に、親が受け入れたかどうかにかかわらず、下書きを親の値に合わせる
  const [syncAfterCommit, setSyncAfterCommit] = useState(false);

  // レンダリング中に自分の状態を更新する（React の「前の props から状態を調整する」形）
  if (!Object.is(prevValue, value)) {
    setPrevValue(value);
    setInputValue(value);
  } else if (syncAfterCommit) {
    setSyncAfterCommit(false);
    if (!Object.is(inputValue, value)) {
      setInputValue(value);
    }
  }

  const commitText = (text: string) => {
    setValue(text);
    setSyncAfterCommit(true);
  };

  const changeInputValue = (text: string) => {
    setInputValue(text);
    onInputValueChange?.(text);
  };

  return {
    value,
    inputValue,
    commit: () => commitText(inputValue),
    getInputProps: (handlers = {}) => ({
      value: inputValue,
      onChange: (event) => {
        handlers.onChange?.(event);
        const text = event.currentTarget.value;
        changeInputValue(text);
        if (valueChangeTiming === 'input') {
          commitText(text);
        }
      },
      onBlur: (event) => {
        handlers.onBlur?.(event);
        commitText(inputValue);
      },
      onKeyDown: (event) => {
        handlers.onKeyDown?.(event);
        if (event.defaultPrevented || isComposing(event)) {
          return;
        }
        if (event.key === 'Enter') {
          commitText(inputValue);
        } else if (event.key === 'Escape' && !Object.is(inputValue, value)) {
          changeInputValue(value);
        }
      },
    }),
  };
}
