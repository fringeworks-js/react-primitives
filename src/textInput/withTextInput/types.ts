import type {
  DisabledProps,
  InvalidProps,
  ReadOnlyProps,
  RequiredProps,
} from '@fringeworks/react-contract';
import type { ComponentPropsWithRef, ElementType } from 'react';
import type { PartOf, PrimaryPartProps } from '../../_internal/_parts';
import type { UseTextInputProps } from '../useTextInput';

/**
 * `TextInput` が受け付ける `type`（文字列を値にする種類だけ）
 */
export type TextInputType =
  'text' | 'search' | 'email' | 'url' | 'tel' | 'password';

/**
 * `withTextInput` に組み込む `<input>` の部品が受け取る props
 *
 * 部品が付ける `value`・`onChange`・`onBlur`・`onKeyDown`・`type`・`aria-invalid` と、利用者の props（`ref` を含む）。
 * 受け取った props は `<input>` に渡す。
 */
export type TextInputInputSlotProps = ComponentPropsWithRef<'input'>;

/**
 * `withTextInput` に組み込む部品
 *
 * 省略すると `<input>` で描く。組み込んだ部品の props は、作ったコンポーネントのプロパティの型になる。
 */
export type TextInputParts = {
  /**
   * 文字を入力する要素（主要素でルート）
   */
  Input?: ElementType;
};

/**
 * 部品の名前と、部品に渡す props の対応
 */
export type TextInputSlots = {
  Input: TextInputInputSlotProps;
};

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
 * `withTextInput` で作ったコンポーネント（`TextInput`）のプロパティ
 *
 * `value` は確定した文字列。`defaultValue` を省略すると `''`。その他の props は、組み込んだ部品（省略したら `<input>`）の props になる。
 *
 * @template P 組み込んだ部品
 */
export type TextInputProps<P extends TextInputParts = object> = OwnProps &
  PrimaryPartProps<PartOf<P, 'Input', 'input'>, keyof OwnProps>;
