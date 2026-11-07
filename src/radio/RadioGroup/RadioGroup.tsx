import withRadioGroup from '../withRadioGroup';

/**
 * 値と操作の契約（`value`・`defaultValue`・`onValueChange`、`options`）に沿ったラジオグループ
 *
 * `withRadioGroup` で、入れ物を `<div>`、ラジオボタンを react-primitives の `Radio` で描くようにしたもの。
 * 見た目と並べ方は持たないので、`className`（`partsProps` を含む）で決める。
 */
const RadioGroup = withRadioGroup();
RadioGroup.displayName = 'RadioGroup';

export default RadioGroup;
