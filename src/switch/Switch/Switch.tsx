import withSwitch from '../withSwitch';

/**
 * 値と操作の契約（`value`・`defaultValue`・`onValueChange`）に沿ったスイッチ
 *
 * `withSwitch` で、`<label>`・`<input>` を素の要素で描くようにしたもの。
 * `<label>` の中に `<input type="checkbox" role="switch">` と `children` を置く。見た目は持たない（素のチェックボックスに見える）。
 * 主要素は `<input>` で、`className`・`style` は `<label>` に、それ以外の props（`ref` を含む）は `<input>` に渡す。
 * `partsProps.label` は `<label>` に、`partsProps.input` は `<input>` に渡し、同じプロパティならトップレベルで受け取ったものより優先する。
 */
const Switch = withSwitch();
Switch.displayName = 'Switch';

export default Switch;
