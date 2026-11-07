import type { DisplayOption } from '@fringeworks/react-contract';
import { mergePartProps } from '@fringeworks/react-parts-props';
import { getComponentName } from '@fringeworks/react-utils';
import type { ElementType, ReactElement } from 'react';
import type { CheckParts, ItemPartProps } from '../../_internal/_parts';
import resolveItemPartProps from '../../_internal/_resolveItemPartProps';
import toKey from '../../_internal/_toKey';
import DefaultButton from '../Button';
import useButtonGroup, { type UseButtonGroupProps } from '../useButtonGroup';
import type {
  ButtonGroupParts,
  ButtonGroupProps,
  ButtonGroupSlots,
} from './types';

/**
 * 中で扱う、部品の型を広げた props（組み込んだ部品ごとの型は、作ったコンポーネントの型で決める）
 */
type LooseProps<V> = UseButtonGroupProps<V> &
  Record<string, unknown> & {
    partsProps?: {
      button?: ItemPartProps<Record<string, unknown>, DisplayOption<V>>;
    };
  };

/**
 * 組み込んだボタンで描く、ボタングループを作る HOC
 *
 * 入れ物（`Container`。省略すると `<div>`）に `role="group"` などを付け、その中に、選択肢のボタンを並べる。その他の props は入れ物に渡す。
 *
 * - 組み込んだ部品の props が、ルート（`Container`）・`partsProps.button` の型になる。
 *   ボタンの部品は `ButtonSlotProps` を受け取れるもので、それ以外の props を `partsProps.button` で渡す。
 *   部品に必須のプロパティがあれば、`partsProps` も必須になる
 * - 入れ物の部品は、受け取った props（`role`・`aria-*`・`children` など）を要素に渡す必要がある
 *
 * @param parts 組み込む部品
 * @returns ボタングループのコンポーネント
 */
export default function withButtonGroup<P extends ButtonGroupParts = object>(
  parts: P & CheckParts<P, ButtonGroupSlots> = {} as P &
    CheckParts<P, ButtonGroupSlots>,
) {
  // 組み込んだ部品ごとの props の型は ButtonGroupProps で決めるので、中では型を広げて描く
  const Container: ElementType = parts.Container ?? 'div';
  const Button: ElementType = parts.Button ?? DefaultButton;

  function ButtonGroup<V>(props: ButtonGroupProps<V, P>): ReactElement {
    const { options, onMainAction, disabled, partsProps, ...rest } =
      props as unknown as LooseProps<V>;
    const { displayOptions, getButtonProps, getContainerProps } =
      useButtonGroup({ options, onMainAction, disabled });

    // 部品の口の props（契約）は partsProps で上書きさせない
    return (
      <Container {...mergePartProps(getContainerProps(), rest)}>
        {displayOptions.map((option, index) => (
          <Button
            key={toKey(option.value, index)}
            {...resolveItemPartProps(partsProps?.button, option)}
            {...getButtonProps(option)}
          />
        ))}
      </Container>
    );
  }

  ButtonGroup.displayName = `withButtonGroup(${getComponentName(Button)})`;

  return ButtonGroup;
}
