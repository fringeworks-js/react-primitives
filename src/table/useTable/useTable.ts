import { mergePartProps } from '@fringeworks/react-parts-props';
import {
  useControllableState,
  useStableCallback,
} from '@fringeworks/react-utils';
import { useId, useInsertionEffect, useMemo, useRef } from 'react';
import updateRowById from '../../_internal/_updateRowById';
import renderFieldValue from '../../recordField/renderFieldValue';
import type {
  TableAlign,
  TableCellElementProps,
  TableHeaderCellProps,
  TableRow,
  TableRowId,
} from '../types';
import type {
  DisplayTableColumn,
  TableCell,
  TableValueChangeDetails,
  UseTableProps,
  UseTableResult,
} from './types';

const EMPTY: readonly never[] = [];

const alignStyle = (align: TableAlign | undefined) =>
  align === undefined ? undefined : { textAlign: align };

/**
 * 表の振る舞いを扱うhook（ヘッドレス UI）
 *
 * 行の配列を値として持ち、列の定義から、列の見出し・行と、行のセルを作る関数を返す。
 * 何で描くか（`<table>`・`<div>` など）は利用者が決める。
 *
 * - 列の見出しに `useId` で id を付け（位置から作る）、セルの `renderValue` に `aria-labelledby` で渡す
 * - `renderValue` の2番目の引数に、セルのパス（`[行の id, キー]`）と行を渡す
 * - セルの `onValueChange` が呼ばれたら、id で行を探してそのキーを変えた配列を作り、
 *   `onValueChange(next, { type: 'update', path: [id, key] })` で知らせる。値が変わらなければ知らせない
 * - 同じイベントの中で複数のセルが確定しても、前の変更を引き継いで配列を作る
 * - 同じ id の行が複数あるときは、先にある行だけを変える（state-model の一覧と同じ）
 * - `getCells` は、列が変わらなければ同じ関数なので、行のコンポーネントを `memo` にできる
 *
 * @param props 行の配列・列・通知（表のコンポーネントと同じ props）
 * @returns 行の配列と、表示する列・行と、セルを作る関数
 */
export default function useTable<R extends { id: TableRowId }>({
  value: valueProp,
  defaultValue,
  onValueChange,
  columns,
}: UseTableProps<R>): UseTableResult<R> {
  // 中で書き換えないので、利用者の useState をそのまま渡せるよう、onValueChange は R[] で受け取る
  const [value, setValue] = useControllableState<
    R[],
    [TableValueChangeDetails]
  >({
    value: valueProp as R[] | undefined,
    defaultValue: (defaultValue ?? EMPTY) as R[],
    onValueChange,
  });

  // セルの onValueChange を変わらない関数にするため、最新の配列を ref で読む。
  // 同じイベントの中で続けて確定したときは、親が描き直す前なので、前の変更の結果（pending）を元にする。
  // 親が受け入れなかったときに残らないよう、pending はイベントの処理が終わったら（マイクロタスクで）捨てる
  const latestRef = useRef(value);
  const pendingRef = useRef<R[] | undefined>(undefined);
  useInsertionEffect(() => {
    latestRef.current = value;
  });

  const updateCell = useStableCallback(
    (id: string, key: keyof R & string, cellValue: unknown) => {
      const base = pendingRef.current ?? latestRef.current;
      const next = updateRowById(base, id, key, cellValue);
      if (!next) {
        return;
      }
      if (pendingRef.current === undefined) {
        queueMicrotask(() => {
          pendingRef.current = undefined;
        });
      }
      pendingRef.current = next;
      setValue(next, { type: 'update', path: [id, key] });
    },
  );

  const baseId = useId();
  const displayColumns = useMemo(
    (): DisplayTableColumn<R>[] =>
      columns.map((column, index) => {
        const labelId = `${baseId}-${index}`;
        return {
          ...column,
          labelId,
          thProps: mergePartProps<TableHeaderCellProps>(
            {
              id: labelId,
              scope: 'col',
              style: alignStyle(column.headerAlign ?? column.align),
            },
            column.headerProps,
          ),
        };
      }),
    [columns, baseId],
  );

  const getCells = useMemo(
    () =>
      (row: TableRow<R>): TableCell<R>[] =>
        displayColumns.map((column) => {
          const { key, labelId, cellProps } = column;
          const cellValue = row.record[key];
          const context = { path: [row.id, key] as const, record: row.record };
          const props = {
            value: cellValue,
            onValueChange: (next: R[typeof key]) =>
              updateCell(row.id, key, next),
            'aria-labelledby': labelId,
          };
          const userCellProps =
            typeof cellProps === 'function'
              ? cellProps({ ...context, value: cellValue })
              : cellProps;
          return {
            key,
            labelId,
            content: renderFieldValue(column, props, context),
            props,
            context,
            tdProps: mergePartProps<TableCellElementProps>(
              { style: alignStyle(column.align) },
              userCellProps,
            ),
          };
        }),
    [displayColumns, updateCell],
  );

  const rows = value.map((record, index): TableRow<R> => ({
    id: String(record.id),
    index,
    record,
  }));

  return { value, displayColumns, rows, getCells };
}
