import {
  createSelectedOptions,
  type DisplayOption,
} from '@fringeworks/react-contract';
import { getComponentName } from '@fringeworks/react-utils';
import { Fragment, type ElementType, type ReactElement } from 'react';
import type { CheckParts, ItemPartProps } from '../../_internal/_parts';
import resolveItemPartProps from '../../_internal/_resolveItemPartProps';
import type {
  OptionLabelsParts,
  OptionLabelsProps,
  OptionLabelsSlots,
} from './types';

/**
 * 中で扱う、部品の型を広げた props（組み込んだ部品ごとの型は、作ったコンポーネントの型で決める）
 */
type LooseProps<V> = OptionLabelsProps<V> & {
  partsProps?: {
    label?: ItemPartProps<Record<string, unknown>, DisplayOption<V>>;
  };
};

/**
 * 組み込んだ部品で描く、選んだ値を選択肢のラベルで並べて表示する部品（複数の値）を作る HOC
 *
 * 入れ物（`Container`。省略すると `<span>`）の中に、ラベル1つずつを `Label`（省略すると `<span>`）で描き、`separator` でつないで置く。
 * その他の props は入れ物に、ラベルの props は `partsProps.label` で渡す。
 *
 * - ラベルは、入力の部品で表示する順（選択肢の順と、選択肢外の値の位置）に並べる
 * - 選択肢外の値は `String(value)` で表示する。`unlistedPlacement` が `'hidden'` なら表示しない（入力の部品で見えないのと同じ）
 * - 値が空の配列のとき、または表示するものが無いときは `placeholder` を表示する（`Label` では包まない）
 * - 値は `Object.is` で比べる
 * - 組み込んだ部品の props が、ルート（`Container`）・`partsProps.label` の型になる。部品に必須のプロパティがあれば、`partsProps` も必須になる
 * - 部品は、受け取った props（`children` など）を要素に渡す必要がある
 *
 * @param parts 組み込む部品
 * @returns 選んだ値のラベルを並べて表示するコンポーネント
 */
export default function withOptionLabels<P extends OptionLabelsParts = object>(
  parts: P & CheckParts<P, OptionLabelsSlots> = {} as P &
    CheckParts<P, OptionLabelsSlots>,
) {
  // 組み込んだ部品ごとの props の型は OptionLabelsProps で決めるので、中では型を広げて描く
  const Container: ElementType = parts.Container ?? 'span';
  const Label: ElementType = parts.Label ?? 'span';

  function OptionLabels<V>(props: OptionLabelsProps<V, P>): ReactElement {
    const {
      value,
      options,
      unlistedPlacement,
      separator = ', ',
      placeholder,
      partsProps,
      ...rest
    } = props as unknown as LooseProps<V>;
    const selected = createSelectedOptions(options, value, unlistedPlacement);

    return (
      <Container {...rest}>
        {selected.length === 0
          ? placeholder
          : selected.map((option, index) => (
              // 同じラベルが並ぶこともあるので、位置を key にする
              <Fragment key={index}>
                {index > 0 && separator}
                <Label {...resolveItemPartProps(partsProps?.label, option)}>
                  {option.label}
                </Label>
              </Fragment>
            ))}
      </Container>
    );
  }

  const names = Object.values(parts as OptionLabelsParts).map((part) =>
    getComponentName(part as ElementType),
  );
  OptionLabels.displayName = `withOptionLabels(${names.join(', ')})`;

  return OptionLabels;
}
