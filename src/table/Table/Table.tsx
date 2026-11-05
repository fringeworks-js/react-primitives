import withTable from '../withTable';

/**
 * 値と操作の契約に沿った表
 *
 * `withTable` で、すべての要素を素の要素（`<table>`・`<tr>`・`<td>` など）で描くようにしたもの。
 * 要素を別の部品（デザインシステムの部品など）で描くときは `withTable` を使う。
 */
const Table = withTable();
Table.displayName = 'Table';

export default Table;
