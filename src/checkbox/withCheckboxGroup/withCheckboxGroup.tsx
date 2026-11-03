import { mergePartProps } from '@fringeworks/react-parts-props';
import { getComponentName } from '@fringeworks/react-utils';
import type { ReactElement } from 'react';
import toKey from '../../_internal/_toKey';
import useCheckboxGroup from '../useCheckboxGroup';
import type { CheckboxGroupParts, CheckboxGroupProps } from './types';

/**
 * 組み込んだチェックボックスで描く、チェックボックスグループを作る HOC
 *
 * `<div role="group">` の中に、すべて選ぶ（`showSelectAll` のとき。`SelectAll` で描く）と選択肢のチェックボックスを並べる。
 * その他の props は `<div>` に渡す。
 *
 * @param parts 組み込む部品
 * @returns チェックボックスグループのコンポーネント
 */
export default function withCheckboxGroup({
  Checkbox,
  SelectAll = Checkbox,
}: CheckboxGroupParts) {
  function CheckboxGroup<V>({
    options,
    value,
    defaultValue,
    onValueChange,
    disabled,
    readOnly,
    invalid,
    unlistedPlacement,
    keepUnlisted,
    selectAllIncludesUnlisted,
    showSelectAll = false,
    selectAllLabel,
    ...rest
  }: CheckboxGroupProps<V>): ReactElement {
    const {
      displayOptions,
      getCheckboxProps,
      getSelectAllProps,
      getContainerProps,
    } = useCheckboxGroup({
      options,
      value,
      defaultValue,
      onValueChange,
      disabled,
      readOnly,
      invalid,
      unlistedPlacement,
      keepUnlisted,
      selectAllIncludesUnlisted,
    });

    return (
      <div {...mergePartProps(getContainerProps(), rest)}>
        {showSelectAll && (
          <SelectAll {...getSelectAllProps()}>{selectAllLabel}</SelectAll>
        )}
        {displayOptions.map((option, index) => (
          <Checkbox
            key={toKey(option.value, index)}
            {...getCheckboxProps(option)}
          />
        ))}
      </div>
    );
  }

  CheckboxGroup.displayName = `withCheckboxGroup(${getComponentName(Checkbox)})`;

  return CheckboxGroup;
}
