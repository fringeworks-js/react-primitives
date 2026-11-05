import type { ReactNode } from 'react';

/**
 * 項目の値を描く関数（`renderValue`）に渡す props
 *
 * 入力の部品にそのまま渡せる形（`<TextInput {...props} />`）。
 *
 * @template V 項目の値の型
 */
export type FieldValueProps<V> = {
  /**
   * 項目の値
   */
  value: V;

  /**
   * 項目の値が確定したときに呼ぶ関数。部品が全体の値を作り直して知らせる
   */
  onValueChange: (value: V) => void;

  /**
   * 項目のラベル（表では列の見出し）の要素の id
   */
  'aria-labelledby': string;
};

/**
 * 項目の値を描く関数（`renderValue`）に、props と別に渡す情報
 *
 * 部品に広げる props に入れると DOM の属性に落ちるので、2番目の引数で渡す。
 *
 * @template T レコード（表では行）の型
 */
export type FieldValueContext<T = unknown> = {
  /**
   * 部品に渡した値から見た、項目の値のパス（表は `[行の id, キー]`、項目を並べる部品は `[キー]`）。
   * details の `path` と同じ形で、state-model の検証の結果を読むのに使える（`validation.issues(path)`）
   */
  path: readonly string[];

  /**
   * 項目を含むレコード（表では行）。ほかの項目の値に応じて描き方を変えるときに使う
   */
  record: T;
};

type RecordFieldOf<T, K extends keyof T & string> = {
  /**
   * 値を読むキー
   */
  key: K;

  /**
   * 項目のラベル（表では列の見出し）
   */
  label: ReactNode;

  /**
   * 項目の値を描く関数。省略すると、値を文字にして表示する（`null`・`undefined` は空）
   *
   * hook の中で普通の関数として呼ぶので、中で hook を使えない。使う場合はコンポーネントを返す。
   */
  renderValue?: (
    props: FieldValueProps<T[K]>,
    context: FieldValueContext<T>,
  ) => ReactNode;
};

/**
 * レコードの項目
 *
 * キーごとの union なので、`renderValue` に渡す値の型が `key` で絞られる。
 *
 * @template T レコードの型
 */
export type RecordField<T> = {
  [K in keyof T & string]: RecordFieldOf<T, K>;
}[keyof T & string];
