import type {
  DisabledProps,
  InvalidProps,
  ReadOnlyProps,
  RequiredProps,
} from '@fringeworks/react-contract';
import type { ChangeEventHandler } from 'react';

/**
 * `useRadio` が受け取る props
 *
 * ラジオボタンは単独では使わず、グループ（`withRadioGroup`）に組み込むので、制御だけを受け付ける。
 */
export type UseRadioProps = DisabledProps &
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
  };

/**
 * `<input>` に渡す props
 */
export type RadioInputProps = {
  type: 'radio';
  name?: string;
  checked: boolean;
  disabled?: boolean;
  required?: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
};

export type UseRadioResult = {
  /**
   * `<input>` に渡す props を作る。利用者の `onChange` を渡すと、部品の処理の前に呼ぶ
   */
  getInputProps: (handlers?: {
    onChange?: ChangeEventHandler<HTMLInputElement>;
  }) => RadioInputProps;
};
