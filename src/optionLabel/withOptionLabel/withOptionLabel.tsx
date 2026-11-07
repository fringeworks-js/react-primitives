import { createSelectedOptions } from '@fringeworks/react-contract';
import { getComponentName } from '@fringeworks/react-utils';
import type { ElementType, ReactElement } from 'react';
import type { CheckParts } from '../../_internal/_parts';
import type {
  OptionLabelParts,
  OptionLabelProps,
  OptionLabelSlots,
} from './types';

/**
 * 組み込んだ部品で描く、選んだ値を選択肢のラベルで表示する部品（単独の値）を作る HOC
 *
 * 入れ物（`Container`。省略すると `<span>`）の中にラベルの文字を置く。その他の props は入れ物に渡す。
 *
 * - 選択肢外の値は `String(value)` で表示する。`unlistedPlacement` が `'hidden'` なら表示しない（入力の部品で見えないのと同じ）
 * - 値が `null` のとき、または表示するものが無いときは `placeholder` を表示する
 * - 値は `Object.is` で比べる
 * - 組み込んだ部品の props が、ルートの型になる。部品は、受け取った props（`children` など）を要素に渡す必要がある
 *
 * @param parts 組み込む部品
 * @returns 選んだ値のラベルを表示するコンポーネント
 */
export default function withOptionLabel<P extends OptionLabelParts = object>(
  parts: P & CheckParts<P, OptionLabelSlots> = {} as P &
    CheckParts<P, OptionLabelSlots>,
) {
  // 組み込んだ部品の props の型は OptionLabelProps で決めるので、中では型を広げて描く
  const Container: ElementType = parts.Container ?? 'span';

  function OptionLabel<V>(props: OptionLabelProps<V, P>): ReactElement {
    const { value, options, unlistedPlacement, placeholder, ...rest } =
      props as OptionLabelProps<V>;
    const [option] =
      value === null
        ? []
        : createSelectedOptions(options, [value], unlistedPlacement);

    return <Container {...rest}>{option?.label ?? placeholder}</Container>;
  }

  const names = Object.values(parts as OptionLabelParts).map((part) =>
    getComponentName(part as ElementType),
  );
  OptionLabel.displayName = `withOptionLabel(${names.join(', ')})`;

  return OptionLabel;
}
