import { getComponentName } from '@fringeworks/react-utils';
import type { ElementType, ReactElement, ReactNode } from 'react';
import type { CheckParts } from '../../_internal/_parts';
import useLabeledInputProps, {
  type LooseLabeledInputProps,
} from '../../_internal/_useLabeledInputProps';
import useCheckbox, { type UseCheckboxProps } from '../useCheckbox';
import type { CheckboxParts, CheckboxProps, CheckboxSlots } from './types';

/**
 * 中で扱う、部品の型を広げた props（組み込んだ部品ごとの型は、作ったコンポーネントの型で決める）
 */
type LooseProps = UseCheckboxProps &
  LooseLabeledInputProps & { children?: ReactNode };

/**
 * 組み込んだ部品で描く、値と操作の契約（`value`・`defaultValue`・`onValueChange`）に沿ったチェックボックスを作る HOC
 *
 * `<label>`（`Label`）の中に `<input type="checkbox">`（`Input`）と `children` を置く。省略した部品は素の要素で描く。
 *
 * - 主要素は `<input>`。`className`・`style` は `<label>` に、それ以外の props（`ref` を含む）は `<input>` に渡す。
 *   `partsProps.label` は `<label>` に、`partsProps.input` は `<input>` に渡し、同じプロパティならトップレベルで受け取ったものより優先する
 * - 利用者の `onChange` を先に呼び、そこで `event.preventDefault()` されたら値を変えない（`useCheckbox`）
 * - 組み込んだ部品の props が、トップレベル（`Input`）・`partsProps` の型になる。部品に必須のプロパティがあれば、`partsProps` も必須になる
 * - 部品は、受け取った props（`type`・`checked`・`onChange`・`ref`・`children` など）を要素に渡す必要がある
 *
 * @param parts 組み込む部品
 * @returns チェックボックスのコンポーネント
 */
export default function withCheckbox<P extends CheckboxParts = object>(
  parts: P & CheckParts<P, CheckboxSlots> = {} as P &
    CheckParts<P, CheckboxSlots>,
) {
  // 組み込んだ部品ごとの props の型は CheckboxProps で決めるので、中では型を広げて描く
  const Label: ElementType = parts.Label ?? 'label';
  const Input: ElementType = parts.Input ?? 'input';

  function Checkbox(props: CheckboxProps<P>): ReactElement {
    const {
      value,
      defaultValue,
      onValueChange,
      disabled,
      readOnly,
      required,
      invalid,
      indeterminate,
      children,
      ...rest
    } = props as unknown as LooseProps;
    const { getInputProps } = useCheckbox({
      value,
      defaultValue,
      onValueChange,
      disabled,
      readOnly,
      required,
      invalid,
      indeterminate,
    });
    const { labelProps, inputProps } = useLabeledInputProps(
      rest,
      getInputProps,
    );

    return (
      <Label {...labelProps}>
        <Input {...inputProps} />
        {children}
      </Label>
    );
  }

  const names = Object.values(parts as CheckboxParts).map((part) =>
    getComponentName(part as ElementType),
  );
  Checkbox.displayName = `withCheckbox(${names.join(', ')})`;

  return Checkbox;
}
