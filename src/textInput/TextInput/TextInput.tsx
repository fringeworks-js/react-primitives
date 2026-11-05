import withTextInput from '../withTextInput';

/**
 * 値と操作の契約に沿ったテキストの入力
 *
 * `withTextInput` で、`<input>` で描くようにしたもの。
 * `useTextInput` で入力中の文字列と確定を扱う。`invalid` は `aria-invalid` で付ける。その他の props は `<input>` に渡す。
 */
const TextInput = withTextInput();
TextInput.displayName = 'TextInput';

export default TextInput;
