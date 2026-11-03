import type {
  DisabledProps,
  DisplayOption,
  EditableValueProps,
  InvalidProps,
  KeepUnlistedProps,
  OptionsProps,
  ReadOnlyProps,
  SelectAllUnlistedProps,
  UnlistedPlacementProps,
} from '@fringeworks/react-contract';
import type { ReactNode } from 'react';

/**
 * `useCheckboxGroup` が受け取る props（チェックボックスグループのコンポーネントと同じもの）
 *
 * `value` は選んだ値。`defaultValue` を省略すると `[]`。
 * `onValueChange` には、表示の順に並べた新しい配列を渡す。
 * `disabled`・`readOnly`・`invalid` は、すべてのチェックボックスに効く。
 */
export type UseCheckboxGroupProps<V> = OptionsProps<V> &
  EditableValueProps<readonly V[], V[]> &
  DisabledProps &
  ReadOnlyProps &
  InvalidProps &
  UnlistedPlacementProps &
  KeepUnlistedProps &
  SelectAllUnlistedProps;

/**
 * すべて選ぶの状態
 */
export type SelectAllState = 'checked' | 'unchecked' | 'indeterminate';

/**
 * チェックボックスグループに組み込むチェックボックスが受け取る props
 */
export type CheckboxSlotProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  readOnly?: boolean;
  invalid?: boolean;

  /**
   * すべて選ぶのチェックボックスにだけ渡す
   */
  indeterminate?: boolean;

  /**
   * 選択肢の文字
   */
  children?: ReactNode;
};

/**
 * 外側の入れ物に付ける属性
 */
export type CheckboxGroupContainerProps = {
  role: 'group';
  'aria-disabled'?: boolean;
  'aria-invalid'?: boolean;
};

export type UseCheckboxGroupResult<V> = {
  /**
   * 今の選んだ値
   */
  value: readonly V[];

  /**
   * 表示する選択肢（選択肢外の値を含む）
   */
  displayOptions: DisplayOption<V>[];

  /**
   * 値を選んでいるか
   */
  isChecked: (value: V) => boolean;

  /**
   * 値を選ぶ・外す。`disabled`・`readOnly` のとき、`disabled` の選択肢では何もしない
   */
  setChecked: (value: V, checked: boolean) => void;

  /**
   * すべて選ぶの状態
   */
  selectAllState: SelectAllState;

  /**
   * すべて選ぶ・すべて外す。`disabled` の選択肢の状態は変えない
   */
  setAllChecked: (checked: boolean) => void;

  /**
   * 選択肢のチェックボックスに渡す props を作る
   */
  getCheckboxProps: (option: DisplayOption<V>) => CheckboxSlotProps;

  /**
   * すべて選ぶのチェックボックスに渡す props を作る（`children` は含まない）
   */
  getSelectAllProps: () => CheckboxSlotProps;

  /**
   * 外側の入れ物に付ける属性を作る
   */
  getContainerProps: () => CheckboxGroupContainerProps;
};
