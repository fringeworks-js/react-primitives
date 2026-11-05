import withRadio from '../withRadio';

/**
 * ラジオボタン（グループに組み込む最低限の部品）
 *
 * `withRadio` で、`<label>`・`<input>` を素の要素で描くようにしたもの。
 * `<label>` の中に `<input type="radio">` と `children` を置く。
 * 主要素は `<input>` で、`className`・`style` は `<label>` に、それ以外の props（`ref` を含む）は `<input>` に渡す。
 * `partsProps.label` は `<label>` に、`partsProps.input` は `<input>` に渡し、同じプロパティならトップレベルで受け取ったものより優先する。
 * 利用者の `onChange` を先に呼び、そこで `event.preventDefault()` されたら通知しない。
 * `readOnly`・`invalid` の ARIA の属性は、ラジオボタンには付けられないので、グループの入れ物に付ける（`useRadioGroup`）。
 */
const Radio = withRadio();
Radio.displayName = 'Radio';

export default Radio;
