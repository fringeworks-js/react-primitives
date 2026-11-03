import type {
  DisabledProps,
  InvalidProps,
  ReadOnlyProps,
  RequiredProps,
} from '@fringeworks/react-contract';
import type { WithPartsProps } from '@fringeworks/react-parts-props';
import type { ComponentPropsWithRef, ReactNode } from 'react';

/**
 * `Radio` が自分で設定する `<input>` の属性
 */
type ControlledInputKeys =
  | 'type'
  | 'name'
  | 'value'
  | 'defaultValue'
  | 'checked'
  | 'defaultChecked'
  | 'disabled'
  | 'readOnly'
  | 'required'
  | 'children';

/**
 * `Radio` のプロパティ
 *
 * ラジオボタンは単独では使わず、グループ（`withRadioGroup`）に組み込むので、制御だけを受け付ける。
 */
export type RadioProps = WithPartsProps<{
  input: Omit<ComponentPropsWithRef<'input'>, ControlledInputKeys>;
}> &
  Omit<
    ComponentPropsWithRef<'label'>,
    'children' | 'defaultValue' | 'defaultChecked'
  > &
  DisabledProps &
  ReadOnlyProps &
  RequiredProps &
  InvalidProps & {
    /**
     * 選ばれているか
     */
    value: boolean;

    /**
     * 選んだときに呼ぶ関数（ラジオボタンは外せないので、常に `true` を渡す）
     */
    onValueChange?: (value: boolean) => void;

    /**
     * グループの名前。同じ名前のラジオボタンが1つのグループとして、Tab キー・矢印キーで動く
     */
    name?: string;

    /**
     * ラジオボタンの横に表示する内容
     */
    children?: ReactNode;
  };
