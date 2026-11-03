import type {
  EditableValueProps,
  InputValueChangeProps,
} from '@fringeworks/react-contract';
import type {
  ChangeEventHandler,
  FocusEventHandler,
  KeyboardEventHandler,
} from 'react';

/**
 * `onValueChange` を呼ぶタイミング
 *
 * - `'commit'`: 入力を確定したとき（フォーカスが外れたとき、Enter を押したとき）
 * - `'input'`: 入力のたび
 */
export type ValueChangeTiming = 'commit' | 'input';

/**
 * `useTextInput` が受け取る props（テキストの入力のコンポーネントと同じもの）
 *
 * `value` は確定した文字列。`defaultValue` を省略すると `''`。
 */
export type UseTextInputProps = EditableValueProps<string> &
  InputValueChangeProps & {
    /**
     * `onValueChange` を呼ぶタイミング。省略すると `'commit'`
     */
    valueChangeTiming?: ValueChangeTiming;
  };

/**
 * `<input>` のイベントのハンドラー（利用者のものを、部品の処理の前に呼ぶ）
 */
export type TextInputHandlers = {
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
};

/**
 * `<input>` に渡す props
 */
export type TextInputElementProps = Required<TextInputHandlers> & {
  value: string;
};

export type UseTextInputResult = {
  /**
   * 確定した文字列
   */
  value: string;

  /**
   * 入力欄の文字列（入力中の下書き）
   */
  inputValue: string;

  /**
   * 入力欄の文字列を確定する
   */
  commit: () => void;

  /**
   * `<input>` に渡す props を作る。利用者のハンドラーを渡すと、部品の処理の前に呼ぶ
   */
  getInputProps: (handlers?: TextInputHandlers) => TextInputElementProps;
};
