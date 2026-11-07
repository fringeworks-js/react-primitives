import type { DisplayOption } from '@fringeworks/react-contract';
import { mergePartProps } from '@fringeworks/react-parts-props';
import { getComponentName } from '@fringeworks/react-utils';
import type { ElementType, ReactElement } from 'react';
import type { CheckParts, ItemPartProps } from '../../_internal/_parts';
import resolveItemPartProps from '../../_internal/_resolveItemPartProps';
import toKey from '../../_internal/_toKey';
import DefaultRadio from '../Radio';
import useRadioGroup, { type UseRadioGroupProps } from '../useRadioGroup';
import type {
  RadioGroupParts,
  RadioGroupProps,
  RadioGroupSlots,
} from './types';

/**
 * 中で扱う、部品の型を広げた props（組み込んだ部品ごとの型は、作ったコンポーネントの型で決める）
 */
type LooseProps<V> = UseRadioGroupProps<V> &
  Record<string, unknown> & {
    partsProps?: {
      radio?: ItemPartProps<Record<string, unknown>, DisplayOption<V>>;
    };
  };

/**
 * 組み込んだラジオボタンで描く、ラジオグループを作る HOC
 *
 * 入れ物（`Container`。省略すると `<div>`）に `role="radiogroup"` などを付け、その中に、選択肢のラジオボタンを並べる。その他の props は入れ物に渡す。
 *
 * - 組み込んだ部品の props が、ルート（`Container`）・`partsProps.radio` の型になる。
 *   ラジオボタンの部品は `RadioSlotProps` を受け取れるもので、それ以外の props を `partsProps.radio` で渡す。
 *   部品に必須のプロパティがあれば、`partsProps` も必須になる
 * - 入れ物の部品は、受け取った props（`role`・`aria-*`・`children` など）を要素に渡す必要がある
 *
 * @param parts 組み込む部品
 * @returns ラジオグループのコンポーネント
 */
export default function withRadioGroup<P extends RadioGroupParts = object>(
  parts: P & CheckParts<P, RadioGroupSlots> = {} as P &
    CheckParts<P, RadioGroupSlots>,
) {
  // 組み込んだ部品ごとの props の型は RadioGroupProps で決めるので、中では型を広げて描く
  const Container: ElementType = parts.Container ?? 'div';
  const Radio: ElementType = parts.Radio ?? DefaultRadio;

  function RadioGroup<V>(props: RadioGroupProps<V, P>): ReactElement {
    const {
      options,
      value,
      defaultValue,
      onValueChange,
      disabled,
      readOnly,
      required,
      invalid,
      unlistedPlacement,
      keepUnlisted,
      partsProps,
      ...rest
    } = props as unknown as LooseProps<V>;
    const { displayOptions, getRadioProps, getContainerProps } = useRadioGroup({
      options,
      value,
      defaultValue,
      onValueChange,
      disabled,
      readOnly,
      required,
      invalid,
      unlistedPlacement,
      keepUnlisted,
    });

    // 部品の口の props（契約）は partsProps で上書きさせない
    return (
      <Container {...mergePartProps(getContainerProps(), rest)}>
        {displayOptions.map((option, index) => (
          <Radio
            key={toKey(option.value, index)}
            {...resolveItemPartProps(partsProps?.radio, option)}
            {...getRadioProps(option)}
          />
        ))}
      </Container>
    );
  }

  RadioGroup.displayName = `withRadioGroup(${getComponentName(Radio)})`;

  return RadioGroup;
}
