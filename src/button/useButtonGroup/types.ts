import type {
  DisabledProps,
  DisplayOption,
  MainActionProps,
  OptionsProps,
} from '@fringeworks/react-contract';
import type { ReactNode } from 'react';

/**
 * `useButtonGroup` が受け取る props（ボタングループのコンポーネントと同じもの）
 *
 * `onMainAction` には、押されたボタンの選択肢の `value` を渡す。`disabled` は、すべてのボタンに効く。
 */
export type UseButtonGroupProps<V> = OptionsProps<V> &
  MainActionProps<V> &
  DisabledProps;

/**
 * ボタングループに組み込むボタンが受け取る props
 *
 * react-primitives の `Button` をそのまま組み込める形。
 */
export type ButtonSlotProps = {
  /**
   * 選択肢の値
   */
  value: unknown;

  /**
   * 押したときに呼ぶ関数（グループが、選択肢の値を `onMainAction` に渡す）
   */
  onMainAction: (value: unknown) => void;

  disabled?: boolean;

  /**
   * 選択肢の文字
   */
  children?: ReactNode;
};

/**
 * 外側の入れ物に付ける属性
 */
export type ButtonGroupContainerProps = {
  role: 'group';
  'aria-disabled'?: boolean;
};

export type UseButtonGroupResult<V> = {
  /**
   * 表示する選択肢（`label` を省略した選択肢は `String(value)`）
   */
  displayOptions: DisplayOption<V>[];

  /**
   * 選択肢のボタンに渡す props を作る
   */
  getButtonProps: (option: DisplayOption<V>) => ButtonSlotProps;

  /**
   * 外側の入れ物に付ける属性を作る
   */
  getContainerProps: () => ButtonGroupContainerProps;
};
