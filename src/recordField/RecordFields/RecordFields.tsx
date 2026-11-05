import withRecordFields from '../withRecordFields';

/**
 * 値と操作の契約に沿った、レコードの項目を並べる部品
 *
 * `withRecordFields` で、すべての部品を `<div>` で描くようにしたもの。
 * 部品を別のもの（レイアウトの部品・デザインシステムの部品など）で描くときは `withRecordFields` を使う。
 */
const RecordFields = withRecordFields();
RecordFields.displayName = 'RecordFields';

export default RecordFields;
