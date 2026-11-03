import type { ReactElement } from 'react';
import useTextInput from '../useTextInput';
import type { TextInputProps } from './types';

/**
 * 値と操作の契約に沿ったテキストの入力
 *
 * `<input>` を描き、`useTextInput` で入力中の文字列と確定を扱う。
 * `invalid` は `aria-invalid` で付ける。その他の props は `<input>` に渡す。
 */
export default function TextInput({
  value,
  defaultValue,
  onValueChange,
  onInputValueChange,
  valueChangeTiming,
  invalid,
  type = 'text',
  onChange,
  onBlur,
  onKeyDown,
  ...rest
}: TextInputProps): ReactElement {
  const { getInputProps } = useTextInput({
    value,
    defaultValue,
    onValueChange,
    onInputValueChange,
    valueChangeTiming,
  });

  return (
    <input
      {...rest}
      type={type}
      aria-invalid={invalid || undefined}
      {...getInputProps({ onChange, onBlur, onKeyDown })}
    />
  );
}
