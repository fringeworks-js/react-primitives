import type { EditableValueProps } from '@fringeworks/react-contract';
import type { ReactNode } from 'react';
import type { FieldValueContext, FieldValueProps } from '../../recordField';
import type {
  TableCellElementProps,
  TableColumn,
  TableHeaderCellProps,
  TableRow,
  TableRowId,
} from '../types';

/**
 * 表の値が変わったときの付帯情報
 */
export type TableValueChangeDetails = {
  /**
   * 操作の種類。今はセルの値を変える `'update'` だけ
   */
  type: 'update';

  /**
   * 変わったセル（行の id を文字列にしたものと、列のキー）。state-model のパスと同じ形
   */
  path: readonly [id: string, key: string];
};

/**
 * `useTable` が受け取る props（表のコンポーネントと同じもの）
 *
 * `value` は行の配列。`defaultValue` を省略すると空の配列。
 *
 * @template R 行の型
 */
export type UseTableProps<R extends { id: TableRowId }> = Omit<
  EditableValueProps<readonly R[], R[]>,
  'onValueChange'
> & {
  /**
   * 列
   */
  columns: readonly TableColumn<R>[];

  /**
   * セルの値が確定したときに呼ぶ関数。変わった後の行の配列と、変わったセルを渡す
   */
  onValueChange?: (value: R[], details: TableValueChangeDetails) => void;
};

/**
 * 表示する列（列の見出しを描くためのもの）
 *
 * @template R 行の型
 */
export type DisplayTableColumn<R> = TableColumn<R> & {
  /**
   * 列の見出しの要素に付ける id
   */
  labelId: string;

  /**
   * 列の見出し（`<th>`）に渡す props。`id`・`scope`・文字寄せに、列の `headerProps` を重ねたもの
   */
  thProps: TableHeaderCellProps;
};

/**
 * 表示するセル
 *
 * @template R 行の型
 */
export type TableCell<R> = {
  /**
   * 列のキー
   */
  key: keyof R & string;

  /**
   * 列の見出しの要素の id（`props` の `aria-labelledby` と同じ）
   */
  labelId: string;

  /**
   * 列の `renderValue` で描いたもの（省略した列は、値を文字にしたもの）
   */
  content: ReactNode;

  /**
   * `renderValue` に渡した props。自分で描き直すときに使う
   */
  props: FieldValueProps<R[keyof R & string]>;

  /**
   * `renderValue` に2番目の引数で渡した情報（`path` は `[行の id, キー]`、`record` は行）
   */
  context: FieldValueContext<R>;

  /**
   * セル（`<td>`）に渡す props。文字寄せに、列の `cellProps` を重ねたもの
   */
  tdProps: TableCellElementProps;
};

export type UseTableResult<R> = {
  /**
   * 行の配列
   */
  value: readonly R[];

  /**
   * 表示する列（列の順）
   */
  displayColumns: DisplayTableColumn<R>[];

  /**
   * 表示する行（`value` の順）。セルは `getCells` で作る
   */
  rows: TableRow<R>[];

  /**
   * 行のセルを作る（列の順）。列が変わらなければ同じ関数なので、行のコンポーネントを `memo` にできる
   */
  getCells: (row: TableRow<R>) => TableCell<R>[];
};
