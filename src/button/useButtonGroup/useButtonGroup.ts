import { createDisplayOptions } from '@fringeworks/react-contract';
import type { UseButtonGroupProps, UseButtonGroupResult } from './types';

const EMPTY: readonly never[] = [];

/**
 * ボタングループの振る舞いを扱うhook（ヘッドレス UI）
 *
 * 選択肢からボタンを並べ、押されたボタンの選択肢の `value` を `onMainAction` に渡す。状態は持たない。
 * 何を描くかは利用者が決める。`get*Props` が返す props を、自分の部品に渡す。
 *
 * @param props 選択肢・通知・設定（ボタングループのコンポーネントと同じ props）
 * @returns 表示する選択肢と、props を作る関数
 */
export default function useButtonGroup<V>({
  options,
  onMainAction,
  disabled = false,
}: UseButtonGroupProps<V>): UseButtonGroupResult<V> {
  // 値を持たないので選択肢外の値は無い。label を埋めるためだけに使う
  const displayOptions = createDisplayOptions(options, EMPTY);

  return {
    displayOptions,
    getButtonProps: (option) => ({
      value: option.value,
      // 組み込んだボタンが何を渡しても、選択肢の値を渡す
      onMainAction: () => onMainAction?.(option.value),
      disabled: disabled || option.disabled === true,
      children: option.label,
    }),
    getContainerProps: () => ({
      role: 'group',
      'aria-disabled': disabled || undefined,
    }),
  };
}
