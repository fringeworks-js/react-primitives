import { getComponentName } from '@fringeworks/react-utils';
import type { ElementType, ReactElement, ReactNode } from 'react';
import type { CheckParts } from '../../_internal/_parts';
import useLabeledInputProps, {
  type LooseLabeledInputProps,
} from '../../_internal/_useLabeledInputProps';
import useCheckbox, { type UseCheckboxProps } from '../../checkbox/useCheckbox';
import type { SwitchParts, SwitchProps, SwitchSlots } from './types';

/**
 * 中で扱う、部品の型を広げた props（組み込んだ部品ごとの型は、作ったコンポーネントの型で決める）
 */
type LooseProps = Omit<UseCheckboxProps, 'indeterminate'> &
  LooseLabeledInputProps & { children?: ReactNode };

/**
 * 組み込んだ部品で描く、値と操作の契約（`value`・`defaultValue`・`onValueChange`）に沿ったスイッチを作る HOC
 *
 * `<label>`（`Label`）の中に `<input type="checkbox" role="switch">`（`Input`）と `children` を置く。省略した部品は素の要素で描く。
 * 振る舞いはチェックボックスと同じ（`useCheckbox`）で、どちらとも言えない状態（`indeterminate`）は持たない。
 *
 * - 主要素は `<input>`。`className`・`style` は `<label>` に、それ以外の props（`ref` を含む）は `<input>` に渡す。
 *   `partsProps.label` は `<label>` に、`partsProps.input` は `<input>` に渡し、同じプロパティならトップレベルで受け取ったものより優先する
 * - 利用者の `onChange` を先に呼び、そこで `event.preventDefault()` されたら値を変えない
 * - 組み込んだ部品の props が、トップレベル（`Input`）・`partsProps` の型になる。部品に必須のプロパティがあれば、`partsProps` も必須になる
 * - 部品は、受け取った props（`type`・`role`・`checked`・`onChange`・`children` など）を要素に渡す必要がある
 * - 口の props が `CheckboxSlotProps` と合うので、`withCheckboxGroup` にも組み込める
 *
 * @param parts 組み込む部品
 * @returns スイッチのコンポーネント
 */
export default function withSwitch<P extends SwitchParts = object>(
  parts: P & CheckParts<P, SwitchSlots> = {} as P & CheckParts<P, SwitchSlots>,
) {
  // 組み込んだ部品ごとの props の型は SwitchProps で決めるので、中では型を広げて描く
  const Label: ElementType = parts.Label ?? 'label';
  const Input: ElementType = parts.Input ?? 'input';

  function Switch(props: SwitchProps<P>): ReactElement {
    const {
      value,
      defaultValue,
      onValueChange,
      disabled,
      readOnly,
      required,
      invalid,
      children,
      // グループのすべて選ぶに組み込まれたときに渡される。スイッチには無いので、要素に渡さない
      indeterminate: _indeterminate,
      ...rest
    } = props as unknown as LooseProps & { indeterminate?: boolean };
    const { getInputProps } = useCheckbox({
      value,
      defaultValue,
      onValueChange,
      disabled,
      readOnly,
      required,
      invalid,
    });
    const { labelProps, inputProps } = useLabeledInputProps(
      rest,
      (handlers) => ({ ...getInputProps(handlers), role: 'switch' }),
    );

    return (
      <Label {...labelProps}>
        <Input {...inputProps} />
        {children}
      </Label>
    );
  }

  const names = Object.values(parts as SwitchParts).map((part) =>
    getComponentName(part as ElementType),
  );
  Switch.displayName = `withSwitch(${names.join(', ')})`;

  return Switch;
}
