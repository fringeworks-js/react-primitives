import withCheckbox from '../withCheckbox';

/**
 * 値と操作の契約（`value`・`defaultValue`・`onValueChange`）に沿ったチェックボックス
 *
 * `withCheckbox` で、`<label>`・`<input>` を素の要素で描くようにしたもの。
 * `<label>` の中に `<input type="checkbox">` と `children` を置く。
 * 主要素は `<input>` で、`className`・`style` は `<label>` に、それ以外の props（`ref` を含む）は `<input>` に渡す。
 * `partsProps.label` は `<label>` に、`partsProps.input` は `<input>` に渡し、同じプロパティならトップレベルで受け取ったものより優先する。
 * 利用者の `onChange` を先に呼び、そこで `event.preventDefault()` されたら値を変えない。
 */
const Checkbox = withCheckbox();
Checkbox.displayName = 'Checkbox';

export default Checkbox;
