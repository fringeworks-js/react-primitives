import type { ComponentPropsWithRef } from 'react';
import type { DataAttributes } from '../_internal/_types';
import type { FieldValueContext, RecordField } from '../recordField';

/**
 * 表の行の id の型
 *
 * state-model の一覧と同じく、文字列と有限の数値を id として扱う。details のパスには `String()` で揃えて入れる。
 */
export type TableRowId = string | number;

/**
 * 列の文字寄せ（CSS の `text-align` の値）
 */
export type TableAlign = 'start' | 'center' | 'end';

/**
 * 列の見出し（`<th>`）に渡す props
 */
export type TableHeaderCellProps = Omit<
  ComponentPropsWithRef<'th'>,
  'children'
> &
  DataAttributes;

/**
 * セル（`<td>`）に渡す props
 */
export type TableCellElementProps = Omit<
  ComponentPropsWithRef<'td'>,
  'children'
> &
  DataAttributes;

/**
 * 表示する行（行の id・位置・元の行）
 *
 * @template R 行の型
 */
export type TableRow<R> = {
  /**
   * 行の id（文字列に揃えたもの）。React の key に使える
   */
  id: string;

  /**
   * `value` の中の位置
   */
  index: number;

  /**
   * 元の行
   */
  record: R;
};

/**
 * 行の props・描き方を決める関数（`partsProps.row`・`renderRow`）に渡す情報
 *
 * @template R 行の型
 */
export type TableRowContext<R> = {
  /**
   * 部品に渡した値から見た、行のパス（`[行の id]`）。セルの `path` と同じ考え方で、
   * state-model の変更の状態・検証の結果を読むのに使える（`status.dirty(path)`）
   */
  path: readonly [id: string];

  /**
   * `value` の中の位置
   */
  index: number;

  /**
   * 元の行
   */
  record: R;
};

/**
 * 列の見出しの props を決める関数（`partsProps.headerCell`）に渡す情報
 *
 * @template R 行の型
 */
export type TableHeaderCellContext<R> = {
  /**
   * 列のキー
   */
  key: keyof R & string;

  /**
   * `columns` の中の位置
   */
  index: number;
};

/**
 * セルの props を決める関数に渡す情報
 *
 * `renderValue` の2番目の引数と同じものに、セルの値を足したもの。
 *
 * @template R 行の型
 * @template V セルの値の型
 */
export type TableCellContext<
  R,
  V = R[keyof R & string],
> = FieldValueContext<R> & {
  /**
   * セルの値
   */
  value: V;
};

/**
 * 列に固有の設定
 *
 * @template R 行の型
 * @template V 列のセルの値の型
 */
export type TableColumnOptions<R, V = R[keyof R & string]> = {
  /**
   * セルの文字寄せ。省略すると決めない（CSS に任せる）
   */
  align?: TableAlign;

  /**
   * 見出しの文字寄せ。省略すると `align` と同じ
   */
  headerAlign?: TableAlign;

  /**
   * 列の見出し（`<th>`）に渡す props
   */
  headerProps?: TableHeaderCellProps;

  /**
   * 列のセル（`<td>`）に渡す props。関数なら、セルごとに値・パス・行から決める
   */
  cellProps?:
    | TableCellElementProps
    | ((context: TableCellContext<R, V>) => TableCellElementProps);
};

/**
 * 表の列
 *
 * 項目（`RecordField`）に、列に固有の設定（文字寄せ・見出しとセルの props）を足したもの。
 * 項目の配列を、そのまま `columns` に渡せる。
 * キーごとの union なので、`renderValue`・`cellProps` に渡す値の型が `key` で絞られる。
 *
 * @template R 行の型
 */
export type TableColumn<R> = {
  [K in keyof R & string]: RecordField<R> & { key: K } & TableColumnOptions<
      R,
      R[K]
    >;
}[keyof R & string];
