import type { DisplayOption } from '@fringeworks/react-contract';
import { mergePartProps } from '@fringeworks/react-parts-props';
import { getComponentName } from '@fringeworks/react-utils';
import type { ElementType, ReactElement, ReactNode } from 'react';
import type { CheckParts, ItemPartProps } from '../../_internal/_parts';
import resolveItemPartProps from '../../_internal/_resolveItemPartProps';
import toKey from '../../_internal/_toKey';
import DefaultCheckbox from '../Checkbox';
import useCheckboxGroup, {
  type UseCheckboxGroupProps,
} from '../useCheckboxGroup';
import type {
  CheckboxGroupParts,
  CheckboxGroupProps,
  CheckboxGroupSlots,
} from './types';

/**
 * 中で扱う、部品の型を広げた props（組み込んだ部品ごとの型は、作ったコンポーネントの型で決める）
 */
type LooseProps<V> = UseCheckboxGroupProps<V> &
  Record<string, unknown> & {
    showSelectAll?: boolean;
    selectAllLabel?: ReactNode;
    partsProps?: {
      checkbox?: ItemPartProps<Record<string, unknown>, DisplayOption<V>>;
      selectAll?: Record<string, unknown>;
    };
  };

/**
 * 組み込んだチェックボックスで描く、チェックボックスグループを作る HOC
 *
 * 入れ物（`Container`。省略すると `<div>`）に `role="group"` などを付け、その中に、すべて選ぶ（`showSelectAll` のとき。`SelectAll` で描く）と選択肢のチェックボックスを並べる。
 * その他の props は入れ物に渡す。
 *
 * - 組み込んだ部品の props が、ルート（`Container`）・`partsProps.checkbox`・`partsProps.selectAll` の型になる。
 *   チェックボックスの部品は `CheckboxSlotProps` を受け取れるもので、それ以外の props（デザインシステムの `size` など）を `partsProps` で渡す。
 *   部品に必須のプロパティがあれば、`partsProps` も必須になる
 * - 入れ物の部品は、受け取った props（`role`・`aria-*`・`children` など）を要素に渡す必要がある
 *
 * @param parts 組み込む部品
 * @returns チェックボックスグループのコンポーネント
 */
export default function withCheckboxGroup<
  P extends CheckboxGroupParts = object,
>(
  parts: P & CheckParts<P, CheckboxGroupSlots> = {} as P &
    CheckParts<P, CheckboxGroupSlots>,
) {
  // 組み込んだ部品ごとの props の型は CheckboxGroupProps で決めるので、中では型を広げて描く
  const Container: ElementType = parts.Container ?? 'div';
  const Checkbox: ElementType = parts.Checkbox ?? DefaultCheckbox;
  const SelectAll: ElementType = parts.SelectAll ?? Checkbox;

  function CheckboxGroup<V>(props: CheckboxGroupProps<V, P>): ReactElement {
    const {
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
      partsProps,
      ...rest
    } = props as unknown as LooseProps<V>;
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

    // 部品の口の props（契約）は partsProps で上書きさせない
    return (
      <Container {...mergePartProps(getContainerProps(), rest)}>
        {showSelectAll && (
          <SelectAll {...partsProps?.selectAll} {...getSelectAllProps()}>
            {selectAllLabel}
          </SelectAll>
        )}
        {displayOptions.map((option, index) => (
          <Checkbox
            key={toKey(option.value, index)}
            {...resolveItemPartProps(partsProps?.checkbox, option)}
            {...getCheckboxProps(option)}
          />
        ))}
      </Container>
    );
  }

  CheckboxGroup.displayName = `withCheckboxGroup(${getComponentName(Checkbox)})`;

  return CheckboxGroup;
}
