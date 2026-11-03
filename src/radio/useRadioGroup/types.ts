import type {
  DisabledProps,
  DisplayOption,
  EditableValueProps,
  InvalidProps,
  KeepUnlistedProps,
  OptionsProps,
  ReadOnlyProps,
  RequiredProps,
  UnlistedPlacementProps,
} from '@fringeworks/react-contract';
import type { ReactNode } from 'react';

/**
 * `useRadioGroup` が受け取る props（ラジオグループのコンポーネントと同じもの）
 *
 * `value` は選んだ値で、何も選んでいないときは `null`。`defaultValue` を省略すると `null`。
 * ラジオボタンは選んだものを外せないので、`onValueChange` には選んだ値（`null` 以外）を渡す。
 * `disabled`・`readOnly`・`required`・`invalid` は、グループ全体に効く。
 */
export type UseRadioGroupProps<V> = OptionsProps<V> &
  EditableValueProps<V | null, V> &
  DisabledProps &
  ReadOnlyProps &
  RequiredProps &
  InvalidProps &
  UnlistedPlacementProps &
  KeepUnlistedProps;

/**
 * ラジオグループに組み込むラジオボタンが受け取る props
 */
export type RadioSlotProps = {
  /**
   * 選ばれているか
   */
  value: boolean;

  /**
   * 選んだときに呼ぶ関数
   */
  onValueChange: (value: boolean) => void;

  /**
   * グループの名前（HTML のラジオボタンに付けると、Tab キー・矢印キーでグループとして動く）
   */
  name: string;

  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  invalid?: boolean;

  /**
   * 選択肢の文字
   */
  children?: ReactNode;
};

/**
 * 外側の入れ物に付ける属性
 */
export type RadioGroupContainerProps = {
  role: 'radiogroup';
  'aria-disabled'?: boolean;
  'aria-readonly'?: boolean;
  'aria-required'?: boolean;
  'aria-invalid'?: boolean;
};

export type UseRadioGroupResult<V> = {
  /**
   * 今の選んだ値。何も選んでいないときは `null`
   */
  value: V | null;

  /**
   * 表示する選択肢（選択肢外の値を含む）
   */
  displayOptions: DisplayOption<V>[];

  /**
   * 値を選んでいるか
   */
  isChecked: (value: V) => boolean;

  /**
   * 値を選ぶ。`disabled`・`readOnly` のとき、`disabled` の選択肢では何もしない
   */
  check: (value: V) => void;

  /**
   * 選択肢のラジオボタンに渡す props を作る
   */
  getRadioProps: (option: DisplayOption<V>) => RadioSlotProps;

  /**
   * 外側の入れ物に付ける属性を作る
   */
  getContainerProps: () => RadioGroupContainerProps;
};
