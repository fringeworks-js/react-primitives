import type { ReactElement } from 'react';
import createSelectedLabels from '../../_internal/_createSelectedLabels';
import type { OptionLabelProps } from './types';

/**
 * 選んだ値を、選択肢のラベルで表示する部品（単独の値）
 *
 * `<span>` の中にラベルの文字を置く。その他の props は `<span>` に渡す。
 *
 * - 選択肢外の値は `String(value)` で表示する。`unlistedPlacement` が `'hidden'` なら表示しない（入力の部品で見えないのと同じ）
 * - 値が `null` のとき、または表示するものが無いときは `placeholder` を表示する
 * - 値は `Object.is` で比べる
 */
export default function OptionLabel<V>({
  value,
  options,
  unlistedPlacement,
  placeholder,
  ...rest
}: OptionLabelProps<V>): ReactElement {
  const [label] =
    value === null
      ? []
      : createSelectedLabels(options, [value], unlistedPlacement);

  return <span {...rest}>{label ?? placeholder}</span>;
}
