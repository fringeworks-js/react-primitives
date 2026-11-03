import type {
  DisabledProps,
  EditableValueProps,
  InvalidProps,
  ReadOnlyProps,
  RequiredProps,
} from '@fringeworks/react-contract';
import type { WithPartsProps } from '@fringeworks/react-parts-props';
import type { ComponentPropsWithRef, ReactNode } from 'react';

/**
 * `Checkbox` が自分で設定する `<input>` の属性
 */
type ControlledInputKeys =
  | 'type'
  | 'value'
  | 'defaultValue'
  | 'checked'
  | 'defaultChecked'
  | 'disabled'
  | 'readOnly'
  | 'required'
  | 'children';

/**
 * `Checkbox` のプロパティ
 *
 * `value` はチェックしているか。`defaultValue` を省略すると `false`。
 */
export type CheckboxProps = WithPartsProps<{
  input: Omit<ComponentPropsWithRef<'input'>, ControlledInputKeys>;
}> &
  Omit<
    ComponentPropsWithRef<'label'>,
    'children' | 'defaultValue' | 'defaultChecked'
  > &
  EditableValueProps<boolean> &
  DisabledProps &
  ReadOnlyProps &
  RequiredProps &
  InvalidProps & {
    /**
     * 不確定の表示にする。`value` は変えない
     */
    indeterminate?: boolean;

    /**
     * チェックボックスの横に表示する内容
     */
    children?: ReactNode;
  };
