import { getComponentName } from '@fringeworks/react-utils';
import type { ElementType, ReactElement, ReactNode } from 'react';
import type { CheckParts } from '../../_internal/_parts';
import useLabeledInputProps, {
  type LooseLabeledInputProps,
} from '../../_internal/_useLabeledInputProps';
import useRadio, { type UseRadioProps } from '../useRadio';
import type { RadioParts, RadioProps, RadioSlots } from './types';

/**
 * 中で扱う、部品の型を広げた props（組み込んだ部品ごとの型は、作ったコンポーネントの型で決める）
 */
type LooseProps = UseRadioProps &
  LooseLabeledInputProps & { children?: ReactNode };

/**
 * 組み込んだ部品で描く、ラジオボタン（グループに組み込む部品）を作る HOC
 *
 * `<label>`（`Label`）の中に `<input type="radio">`（`Input`）と `children` を置く。`Indicator` を組み込むと、`<input>` の直後に状態を表す印を描く（状態を props で渡す）。省略した部品は素の要素で描く（`Indicator` は描かない）。
 *
 * - 主要素は `<input>`。`className`・`style` は `<label>` に、それ以外の props（`ref` を含む）は `<input>` に渡す。
 *   `partsProps.label` は `<label>` に、`partsProps.input` は `<input>` に渡し、同じプロパティならトップレベルで受け取ったものより優先する
 * - 利用者の `onChange` を先に呼び、そこで `event.preventDefault()` されたら知らせない（`useRadio`）
 * - 組み込んだ部品の props が、トップレベル（`Input`）・`partsProps` の型になる。部品に必須のプロパティがあれば、`partsProps` も必須になる
 * - 部品は、受け取った props（`type`・`name`・`checked`・`onChange`・`children` など）を要素に渡す必要がある
 *
 * @param parts 組み込む部品
 * @returns ラジオボタンのコンポーネント
 */
export default function withRadio<P extends RadioParts = object>(
  parts: P & CheckParts<P, RadioSlots> = {} as P & CheckParts<P, RadioSlots>,
) {
  // 組み込んだ部品ごとの props の型は RadioProps で決めるので、中では型を広げて描く
  const Label: ElementType = parts.Label ?? 'label';
  const Input: ElementType = parts.Input ?? 'input';
  const Indicator: ElementType | undefined = parts.Indicator;

  function Radio(props: RadioProps<P>): ReactElement {
    const {
      value,
      onValueChange,
      name,
      disabled,
      readOnly,
      required,
      invalid,
      children,
      ...rest
    } = props as unknown as LooseProps;
    const { getInputProps } = useRadio({
      value,
      onValueChange,
      name,
      disabled,
      readOnly,
      required,
      invalid,
    });
    const { labelProps, inputProps } = useLabeledInputProps(
      rest,
      getInputProps,
    );

    return (
      <Label {...labelProps}>
        <Input {...inputProps} />
        {Indicator && (
          <Indicator
            {...rest.partsProps?.indicator}
            checked={value}
            disabled={disabled ?? false}
            readOnly={readOnly ?? false}
            invalid={invalid ?? false}
            aria-hidden
          />
        )}
        {children}
      </Label>
    );
  }

  const names = Object.values(parts as RadioParts).map((part) =>
    getComponentName(part as ElementType),
  );
  Radio.displayName = `withRadio(${names.join(', ')})`;

  return Radio;
}
