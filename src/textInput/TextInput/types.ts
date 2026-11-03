import type {
  DisabledProps,
  InvalidProps,
  ReadOnlyProps,
  RequiredProps,
} from '@fringeworks/react-contract';
import type { ComponentPropsWithRef } from 'react';
import type { UseTextInputProps } from '../useTextInput';

/**
 * `TextInput` が受け付ける `type`（文字列を値にする種類だけ）
 */
export type TextInputType =
  'text' | 'search' | 'email' | 'url' | 'tel' | 'password';

type OwnProps = UseTextInputProps &
  DisabledProps &
  ReadOnlyProps &
  RequiredProps &
  InvalidProps & {
    /**
     * HTML の `type`。省略すると `'text'`
     */
    type?: TextInputType;
  };

/**
 * `TextInput` のプロパティ
 *
 * `value` は確定した文字列。`defaultValue` を省略すると `''`。
 */
export type TextInputProps = OwnProps &
  Omit<ComponentPropsWithRef<'input'>, keyof OwnProps | 'children'>;
