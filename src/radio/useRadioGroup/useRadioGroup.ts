import { useDisplayOptions } from '@fringeworks/react-contract';
import { useControllableState } from '@fringeworks/react-utils';
import { useId } from 'react';
import type { UseRadioGroupProps, UseRadioGroupResult } from './types';

/**
 * ラジオグループの振る舞いを扱うhook（ヘッドレス UI）
 *
 * 選択肢からラジオボタンを並べ、選んだ1つの値を持つ。
 * 何を描くかは利用者が決める。`get*Props` が返す props を、自分の部品に渡す。
 *
 * - 何も選んでいないときの値は `null`。選んだものは外せない（HTML のラジオボタンと同じ）
 * - ラジオボタンには共通の `name` を渡す。HTML のラジオボタンなら、Tab キー・矢印キーの動きをブラウザーに任せられる
 * - 値は `Object.is` で比べる
 *
 * @param props 選択肢・値・設定（ラジオグループのコンポーネントと同じ props）
 * @returns 状態と、値を変える関数と、props を作る関数
 */
export default function useRadioGroup<V>({
  options,
  value: valueProp,
  defaultValue,
  onValueChange,
  disabled = false,
  readOnly = false,
  required = false,
  invalid = false,
  unlistedPlacement,
  keepUnlisted,
}: UseRadioGroupProps<V>): UseRadioGroupResult<V> {
  const [value, setValue] = useControllableState<V | null>({
    value: valueProp,
    defaultValue: defaultValue ?? null,
    // 中から null を通知することは無い
    onValueChange: onValueChange as ((value: V | null) => void) | undefined,
  });

  const { displayOptions } = useDisplayOptions(
    options,
    value === null ? [] : [value],
    { unlistedPlacement, keepUnlisted },
  );

  const name = useId();

  const isChecked = (v: V) => value !== null && Object.is(value, v);

  const check = (v: V) => {
    const option = displayOptions.find((o) => Object.is(o.value, v));
    if (disabled || readOnly || option?.disabled || isChecked(v)) {
      return;
    }
    setValue(v);
  };

  return {
    value,
    displayOptions,
    isChecked,
    check,
    getRadioProps: (option) => ({
      value: isChecked(option.value),
      onValueChange: () => check(option.value),
      name,
      disabled: disabled || option.disabled === true,
      readOnly,
      required,
      invalid,
      children: option.label,
    }),
    getContainerProps: () => ({
      role: 'radiogroup',
      'aria-disabled': disabled || undefined,
      'aria-readonly': readOnly || undefined,
      'aria-required': required || undefined,
      'aria-invalid': invalid || undefined,
    }),
  };
}
