import withCollapsible from '../withCollapsible';

/**
 * 値と操作の契約（`open`・`defaultOpen`・`onOpenChange`）に沿った、折りたためる部品
 *
 * `withCollapsible` で、`<details>`・`<summary>` を素の要素で描くようにしたもの。
 * `<details>` の中に、`summary` を入れた `<summary>` と `children` を置く。
 * その他の props は `<details>` に渡し、`<summary>` には `partsProps.summary` で渡す。
 */
const Collapsible = withCollapsible();
Collapsible.displayName = 'Collapsible';

export default Collapsible;
