import { Fragment, type ReactElement } from 'react';
import createSelectedLabels from '../../_internal/_createSelectedLabels';
import type { OptionLabelsProps } from './types';

/**
 * 選んだ値を、選択肢のラベルで並べて表示する部品（複数の値）
 *
 * `<span>` の中に、ラベルの文字を `separator` でつないで置く。その他の props は `<span>` に渡す。
 *
 * - ラベルは、入力の部品で表示する順（選択肢の順と、選択肢外の値の位置）に並べる
 * - 選択肢外の値は `String(value)` で表示する。`unlistedPlacement` が `'hidden'` なら表示しない（入力の部品で見えないのと同じ）
 * - 値が空の配列のとき、または表示するものが無いときは `placeholder` を表示する
 * - 値は `Object.is` で比べる
 */
export default function OptionLabels<V>({
  value,
  options,
  unlistedPlacement,
  separator = ', ',
  placeholder,
  ...rest
}: OptionLabelsProps<V>): ReactElement {
  const labels = createSelectedLabels(options, value, unlistedPlacement);

  return (
    <span {...rest}>
      {labels.length === 0
        ? placeholder
        : labels.map((label, index) => (
            // 同じラベルが並ぶこともあるので、位置を key にする
            <Fragment key={index}>
              {index > 0 && separator}
              {label}
            </Fragment>
          ))}
    </span>
  );
}
