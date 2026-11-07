import withCheckboxGroup from '../withCheckboxGroup';

/**
 * 値と操作の契約（`value`・`defaultValue`・`onValueChange`、`options`）に沿ったチェックボックスグループ
 *
 * `withCheckboxGroup` で、入れ物を `<div>`、チェックボックスを react-primitives の `Checkbox` で描くようにしたもの。
 * 見た目と並べ方は持たないので、`className`（`partsProps` を含む）で決める。
 */
const CheckboxGroup = withCheckboxGroup();
CheckboxGroup.displayName = 'CheckboxGroup';

export default CheckboxGroup;
