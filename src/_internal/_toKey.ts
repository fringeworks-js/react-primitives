/**
 * 選択肢の値から React の key を作る
 *
 * 文字列と数値の値は、そのまま key にする（選択肢外の値が前に入っても、要素を作り直さない）。
 * それ以外の値は位置を使う。
 */
export default function toKey(value: unknown, index: number): string {
  return typeof value === 'string' || typeof value === 'number'
    ? `${typeof value}:${value}`
    : `index:${index}`;
}
