import type {
  DisabledProps,
  EditableValueProps,
  InvalidProps,
  ReadOnlyProps,
  RequiredProps,
} from '@fringeworks/react-contract';
import type { ChangeEventHandler, RefObject } from 'react';

/**
 * `useCheckbox` が受け取る props
 *
 * `defaultValue` を省略すると、チェックしていない（`false`）。
 */
export type UseCheckboxProps = EditableValueProps<boolean> &
  DisabledProps &
  ReadOnlyProps &
  RequiredProps &
  InvalidProps & {
    /**
     * どちらとも言えない状態にする（`<input>` の `indeterminate`）。値は変えない
     */
    indeterminate?: boolean;
  };

/**
 * `<input>` に渡す props
 */
export type CheckboxInputProps = {
  type: 'checkbox';
  checked: boolean;
  disabled?: boolean;
  required?: boolean;
  'aria-readonly'?: boolean;
  'aria-invalid'?: boolean;

  /**
   * `indeterminate` を DOM に設定するための ref
   */
  ref: RefObject<HTMLInputElement | null>;
  onChange: ChangeEventHandler<HTMLInputElement>;
};

export type UseCheckboxResult = {
  /**
   * チェックしているか
   */
  value: boolean;

  /**
   * `<input>` に渡す props を作る。利用者の `onChange` を渡すと、部品の処理の前に呼ぶ
   */
  getInputProps: (handlers?: {
    onChange?: ChangeEventHandler<HTMLInputElement>;
  }) => CheckboxInputProps;
};
