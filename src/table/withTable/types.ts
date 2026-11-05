import type { ComponentPropsWithRef, ElementType, ReactNode } from 'react';
import type {
  ItemPartProps,
  PartOf,
  PartProps,
  PartsPropsProp,
  PrimaryPartProps,
} from '../../_internal/_parts';
import type {
  TableCellContext,
  TableHeaderCellContext,
  TableRowContext,
  TableRowId,
} from '../types';
import type { UseTableProps } from '../useTable';

/**
 * 表に組み込む `<table>` の部品が受け取る props
 */
export type TableSlotProps = ComponentPropsWithRef<'table'>;

/**
 * 表に組み込む `<thead>`・`<tbody>` の部品が受け取る props
 */
export type TableSectionSlotProps = ComponentPropsWithRef<'tbody'>;

/**
 * 表に組み込む `<tr>`（見出しの行と、データの行）の部品が受け取る props
 */
export type TableRowSlotProps = ComponentPropsWithRef<'tr'>;

/**
 * 表に組み込む `<th>` の部品が受け取る props
 */
export type TableHeaderCellSlotProps = ComponentPropsWithRef<'th'>;

/**
 * 表に組み込む `<td>` の部品が受け取る props
 */
export type TableCellSlotProps = ComponentPropsWithRef<'td'>;

/**
 * `withTable` に組み込む部品
 *
 * どれも省略でき、省略すると素の要素で描く。部品は要素の props と `children` だけを受け取る
 * （行やセルのデータは渡さない。使う場所ごとの描き方は `partsProps`・`renderRow`・列の `cellProps` などで決める）。
 * 組み込んだ部品の props は、作ったコンポーネントのルート（`Table`）と `partsProps` の型になる。
 */
export type TableParts = {
  /**
   * `<table>` を描く部品
   */
  Table?: ElementType;

  /**
   * `<thead>` を描く部品
   */
  Head?: ElementType;

  /**
   * 見出しの `<tr>` を描く部品
   */
  HeaderRow?: ElementType;

  /**
   * 列の見出しの `<th>` を描く部品
   */
  HeaderCell?: ElementType;

  /**
   * `<tbody>` を描く部品
   */
  Body?: ElementType;

  /**
   * データの `<tr>` を描く部品
   */
  Row?: ElementType;

  /**
   * セルの `<td>` を描く部品
   */
  Cell?: ElementType;
};

/**
 * 部品の名前と、表がその部品に渡す props の対応
 */
export type TableSlots = {
  Table: TableSlotProps;
  Head: TableSectionSlotProps;
  HeaderRow: TableRowSlotProps;
  HeaderCell: TableHeaderCellSlotProps;
  Body: TableSectionSlotProps;
  Row: TableRowSlotProps;
  Cell: TableCellSlotProps;
};

type RowPartProps<P> = PartProps<PartOf<P, 'Row', 'tr'>, 'children'>;

/**
 * `partsProps` で部品に渡す props
 *
 * 見出しの列・行・セルの props は、値ならすべてに、関数なら列・行・セルごとに決める。
 * 列ごとの見出し・セルの props は、列の `headerProps`・`cellProps` でも渡せる（同じプロパティは列のものを優先する）。
 *
 * @template R 行の型
 * @template P 組み込んだ部品
 */
export type TablePartsProps<R, P = object> = {
  /**
   * `<thead>` の部品に渡す props
   */
  head: PartProps<PartOf<P, 'Head', 'thead'>, 'children'>;

  /**
   * 見出しの `<tr>` の部品に渡す props
   */
  headerRow: PartProps<PartOf<P, 'HeaderRow', 'tr'>, 'children'>;

  /**
   * 列の見出しの `<th>` の部品に渡す props
   */
  headerCell: ItemPartProps<
    PartProps<PartOf<P, 'HeaderCell', 'th'>, 'children'>,
    TableHeaderCellContext<R>
  >;

  /**
   * `<tbody>` の部品に渡す props
   */
  body: PartProps<PartOf<P, 'Body', 'tbody'>, 'children'>;

  /**
   * データの `<tr>` の部品に渡す props
   *
   * 関数は描くときに呼ぶので、中で hook を使えない。描くたびに新しい関数（や値のオブジェクト）を渡すと、すべての行を描き直す。
   */
  row: ItemPartProps<RowPartProps<P>, TableRowContext<R>>;

  /**
   * セルの `<td>` の部品に渡す props
   *
   * 描くたびに新しい関数（や値のオブジェクト）を渡すと、すべての行を描き直す。
   */
  cell: ItemPartProps<
    PartProps<PartOf<P, 'Cell', 'td'>, 'children'>,
    TableCellContext<R>
  >;
};

/**
 * `renderRow` に渡す props（`partsProps.row` で決めたものと、セル）
 *
 * @template P 組み込んだ部品
 */
export type TableRenderRowProps<P = object> = RowPartProps<P> & {
  /**
   * セル（`<td>`）
   */
  children: ReactNode;
};

type OwnProps<R extends { id: TableRowId }, P> = UseTableProps<R> & {
  /**
   * 行を描く関数。省略すると、組み込んだ `Row`（省略したら `<tr>`）で描く
   *
   * `props`（`partsProps.row` で決めたものと、セル）を `<tr>` に広げる。行の id などは2番目の引数で受け取る。
   * 普通の関数として呼ぶので、中で hook を使えない。使う場合はコンポーネントを返す。
   * 描くたびに新しい関数を渡すと、すべての行を描き直す。
   */
  renderRow?: (
    props: TableRenderRowProps<P>,
    context: TableRowContext<R>,
  ) => ReactNode;
};

/**
 * `withTable` で作ったコンポーネントのプロパティ
 *
 * `value` は行の配列。`defaultValue` を省略すると空の配列。
 * ルートの残りの props は `<table>` の部品の props、`partsProps` はそれぞれの部品の props になる。
 *
 * @template R 行の型
 * @template P 組み込んだ部品
 */
export type TableProps<
  R extends { id: TableRowId },
  P extends TableParts = object,
> = OwnProps<R, P> &
  PartsPropsProp<TablePartsProps<R, P>> &
  PrimaryPartProps<PartOf<P, 'Table', 'table'>, keyof OwnProps<R, P>>;
