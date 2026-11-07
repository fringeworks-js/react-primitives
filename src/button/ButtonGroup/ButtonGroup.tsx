import withButtonGroup from '../withButtonGroup';

/**
 * 値と操作の契約（`options`・`onMainAction`）に沿ったボタングループ
 *
 * `withButtonGroup` で、入れ物を `<div>`、ボタンを react-primitives の `Button` で描くようにしたもの。
 * 見た目と並べ方は持たないので、`className`（`partsProps` を含む）で決める。
 */
const ButtonGroup = withButtonGroup();
ButtonGroup.displayName = 'ButtonGroup';

export default ButtonGroup;
