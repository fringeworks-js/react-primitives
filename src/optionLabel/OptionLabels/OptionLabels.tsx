import withOptionLabels from '../withOptionLabels';

/**
 * 選んだ値を、選択肢のラベルで並べて表示する部品（複数の値）
 *
 * `withOptionLabels` で、`<span>` で描くようにしたもの。
 * `<span>` の中に、ラベル1つずつを `<span>` で描き、`separator` でつないで置く。その他の props は外側の `<span>` に、ラベルの props は `partsProps.label` で渡す。
 *
 * - ラベルは、入力の部品で表示する順（選択肢の順と、選択肢外の値の位置）に並べる
 * - 選択肢外の値は `String(value)` で表示する。`unlistedPlacement` が `'hidden'` なら表示しない（入力の部品で見えないのと同じ）
 * - 値が空の配列のとき、または表示するものが無いときは `placeholder` を表示する
 * - 値は `Object.is` で比べる
 */
const OptionLabels = withOptionLabels();
OptionLabels.displayName = 'OptionLabels';

export default OptionLabels;
