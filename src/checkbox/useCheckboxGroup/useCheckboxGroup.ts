import { useDisplayOptions } from '@fringeworks/react-contract';
import { useControllableState } from '@fringeworks/react-utils';
import includesValue from '../../_internal/_includesValue';
import type {
  SelectAllState,
  UseCheckboxGroupProps,
  UseCheckboxGroupResult,
} from './types';

const EMPTY: readonly never[] = [];

/**
 * チェックボックスグループの振る舞いを扱うhook（ヘッドレス UI）
 *
 * 選択肢からチェックボックスを並べ、選んだ値の配列を作る。すべて選ぶの状態を導き、すべて選ぶ・すべて外す。
 * 何を描くかは利用者が決める。`get*Props` が返す props を、自分の部品に渡す。
 *
 * - 選んだ値は、表示の順（選択肢の順と、選択肢外の値の位置）に並べる。表示していない選択肢外の値は末尾に残す
 * - 値は `Object.is` で比べる
 *
 * @param props 選択肢・値・設定（チェックボックスグループのコンポーネントと同じ props）
 * @returns 状態と、値を変える関数と、props を作る関数
 */
export default function useCheckboxGroup<V>({
  options,
  value: valueProp,
  defaultValue,
  onValueChange,
  disabled = false,
  readOnly = false,
  invalid = false,
  unlistedPlacement,
  keepUnlisted,
  selectAllIncludesUnlisted = false,
}: UseCheckboxGroupProps<V>): UseCheckboxGroupResult<V> {
  // 中で書き換えないので、利用者の useState をそのまま渡せるよう、onValueChange は V[] で受け取る
  const [value, setValue] = useControllableState<V[]>({
    value: valueProp as V[] | undefined,
    defaultValue: (defaultValue ?? EMPTY) as V[],
    onValueChange,
  });

  const { displayOptions, unlistedValues } = useDisplayOptions(options, value, {
    unlistedPlacement,
    keepUnlisted,
  });

  // 選んだ値を表示の順に並べる。表示していない値は、元の順のまま末尾に置く
  const sortByDisplayOptions = (selected: readonly V[]): V[] => {
    const shown = displayOptions.map((option) => option.value);
    return [
      ...shown.filter((v) => includesValue(selected, v)),
      ...selected.filter((v) => !includesValue(shown, v)),
    ];
  };

  const canChange = !disabled && !readOnly;

  const isChecked = (v: V) => includesValue(value, v);

  const setChecked = (v: V, checked: boolean) => {
    const option = displayOptions.find((o) => Object.is(o.value, v));
    if (!canChange || option?.disabled || isChecked(v) === checked) {
      return;
    }
    setValue(
      sortByDisplayOptions(
        checked ? [...value, v] : value.filter((x) => !Object.is(x, v)),
      ),
    );
  };

  const selectAllTargets = [
    ...displayOptions
      .filter((option) => !option.unlisted && !option.disabled)
      .map((option) => option.value),
    ...(selectAllIncludesUnlisted ? unlistedValues : []),
  ];
  const checkedTargetCount = selectAllTargets.filter(isChecked).length;
  const selectAllState: SelectAllState =
    checkedTargetCount === 0
      ? 'unchecked'
      : checkedTargetCount === selectAllTargets.length
        ? 'checked'
        : 'indeterminate';

  const setAllChecked = (checked: boolean) => {
    if (!canChange) {
      return;
    }
    const next = checked
      ? [...value, ...selectAllTargets.filter((v) => !isChecked(v))]
      : value.filter((v) => !includesValue(selectAllTargets, v));
    if (next.length !== value.length) {
      setValue(sortByDisplayOptions(next));
    }
  };

  return {
    value,
    displayOptions,
    isChecked,
    setChecked,
    selectAllState,
    setAllChecked,
    getCheckboxProps: (option) => ({
      value: isChecked(option.value),
      onValueChange: (checked) => setChecked(option.value, checked),
      disabled: disabled || option.disabled,
      readOnly,
      invalid,
      children: option.label,
    }),
    getSelectAllProps: () => ({
      value: selectAllState === 'checked',
      onValueChange: setAllChecked,
      disabled: disabled || selectAllTargets.length === 0,
      readOnly,
      invalid,
      indeterminate: selectAllState === 'indeterminate',
    }),
    getContainerProps: () => ({
      role: 'group',
      'aria-disabled': disabled || undefined,
      'aria-invalid': invalid || undefined,
    }),
  };
}
