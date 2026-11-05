/**
 * `data-*` の属性
 *
 * JSX では `data-*` を書けるが、React の要素の props の型には含まれない。
 * `partsProps` のようにオブジェクトのリテラルで渡す props で受け付けるために足す。
 */
export type DataAttributes = {
  [key: `data-${string}`]: string | number | boolean | undefined;
};

/**
 * union の要素ごとに `Omit` する
 *
 * `Omit` は union を1つの型にまとめてしまい、判別用のプロパティ（`side` など）で絞り込めなくなるので、要素ごとに分ける。
 */
export type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, K>
  : never;
