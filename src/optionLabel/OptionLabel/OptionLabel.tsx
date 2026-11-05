import withOptionLabel from '../withOptionLabel';

/**
 * 選んだ値を、選択肢のラベルで表示する部品（単独の値）
 *
 * `withOptionLabel` で、`<span>` で描くようにしたもの。
 * `<span>` の中にラベルの文字を置く。その他の props は `<span>` に渡す。
 *
 * - 選択肢外の値は `String(value)` で表示する。`unlistedPlacement` が `'hidden'` なら表示しない（入力の部品で見えないのと同じ）
 * - 値が `null` のとき、または表示するものが無いときは `placeholder` を表示する
 * - 値は `Object.is` で比べる
 */
const OptionLabel = withOptionLabel();
OptionLabel.displayName = 'OptionLabel';

export default OptionLabel;
