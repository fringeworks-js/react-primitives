import { getComponentName } from '@fringeworks/react-utils';
import type {
  ChangeEventHandler,
  ElementType,
  FocusEventHandler,
  KeyboardEventHandler,
  ReactElement,
} from 'react';
import type { CheckParts } from '../../_internal/_parts';
import useTextInput, { type UseTextInputProps } from '../useTextInput';
import type { TextInputParts, TextInputProps, TextInputSlots } from './types';

/**
 * 中で扱う、部品の型を広げた props（組み込んだ部品の型は、作ったコンポーネントの型で決める）
 */
type LooseProps = UseTextInputProps &
  Record<string, unknown> & {
    invalid?: boolean;
    type?: string;
    onChange?: ChangeEventHandler<HTMLInputElement>;
    onBlur?: FocusEventHandler<HTMLInputElement>;
    onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  };

/**
 * 組み込んだ部品で描く、値と操作の契約に沿ったテキストの入力を作る HOC
 *
 * `<input>`（`Input`）を描き、`useTextInput` で入力中の文字列と確定を扱う。
 *
 * - `invalid` は `aria-invalid` で付ける。その他の props は部品（省略したら `<input>`）に渡す
 * - 組み込んだ部品の props が、作ったコンポーネントのプロパティの型になる
 * - 部品は、受け取った props（`value`・`onChange`・`onBlur`・`onKeyDown`・`ref` など）を `<input>` に渡す必要がある
 *
 * @param parts 組み込む部品
 * @returns テキストの入力のコンポーネント
 */
export default function withTextInput<P extends TextInputParts = object>(
  parts: P & CheckParts<P, TextInputSlots> = {} as P &
    CheckParts<P, TextInputSlots>,
) {
  // 組み込んだ部品の props の型は TextInputProps で決めるので、中では型を広げて描く
  const Input: ElementType = parts.Input ?? 'input';

  function TextInput(props: TextInputProps<P>): ReactElement {
    const {
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
    } = props as unknown as LooseProps;
    const { getInputProps } = useTextInput({
      value,
      defaultValue,
      onValueChange,
      onInputValueChange,
      valueChangeTiming,
    });

    return (
      <Input
        {...rest}
        type={type}
        aria-invalid={invalid || undefined}
        {...getInputProps({ onChange, onBlur, onKeyDown })}
      />
    );
  }

  const names = Object.values(parts as TextInputParts).map((part) =>
    getComponentName(part as ElementType),
  );
  TextInput.displayName = `withTextInput(${names.join(', ')})`;

  return TextInput;
}
