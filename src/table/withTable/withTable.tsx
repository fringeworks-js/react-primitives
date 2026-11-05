import { mergePartProps } from '@fringeworks/react-parts-props';
import { getComponentName } from '@fringeworks/react-utils';
import {
  memo,
  type ElementType,
  type ReactElement,
  type ReactNode,
} from 'react';
import type { CheckParts, ItemPartProps } from '../../_internal/_parts';
import resolveItemPartProps from '../../_internal/_resolveItemPartProps';
import type {
  TableCellContext,
  TableHeaderCellContext,
  TableRow,
  TableRowContext,
  TableRowId,
} from '../types';
import useTable, { type TableCell, type UseTableProps } from '../useTable';
import type { TableParts, TableProps, TableSlots } from './types';

type AnyRecord = { id: TableRowId };

type LooseElementProps = Record<string, unknown>;

type LooseRenderRow = (
  props: LooseElementProps & { children: ReactNode },
  context: TableRowContext<AnyRecord>,
) => ReactNode;

/**
 * 中で扱う、部品の型を広げた props（組み込んだ部品ごとの型は、作ったコンポーネントの型で決める）
 */
type LooseProps = UseTableProps<AnyRecord> &
  LooseElementProps & {
    renderRow?: LooseRenderRow;
    partsProps?: {
      head?: LooseElementProps;
      headerRow?: LooseElementProps;
      headerCell?: ItemPartProps<
        LooseElementProps,
        TableHeaderCellContext<AnyRecord>
      >;
      body?: LooseElementProps;
      row?: ItemPartProps<LooseElementProps, TableRowContext<AnyRecord>>;
      cell?: ItemPartProps<LooseElementProps, TableCellContext<AnyRecord>>;
    };
  };

type RowViewProps = {
  id: string;
  index: number;
  record: AnyRecord;
  getCells: (row: TableRow<AnyRecord>) => TableCell<AnyRecord>[];
  rowProps: NonNullable<LooseProps['partsProps']>['row'];
  cellProps: NonNullable<LooseProps['partsProps']>['cell'];
  renderRow: LooseRenderRow | undefined;
};

/**
 * 組み込んだ部品で描く、表を作る HOC
 *
 * `useTable` で行の配列と列から見出し・行・セルを作り、`<table>`・`<thead>`・見出しの `<tr>`・`<th scope="col">`・
 * `<tbody>`・`<tr>`・`<td>` を、組み込んだ部品（省略したら素の要素）で描く。その他の props は `<table>` に渡す。
 *
 * - 部品は要素の props と `children` だけを受け取る。アプリで1回作り、使う場所ごとの描き方は
 *   `partsProps`・`renderRow`・列の `headerProps`・`cellProps` などで決める
 * - 組み込んだ部品の props が、ルート（`Table`）・`partsProps` の型になる。部品に必須のプロパティがあれば、`partsProps` も必須になる
 * - 見出し・セルは、`partsProps.headerCell`・`partsProps.cell` に列の `headerProps`・`cellProps` を重ねる（列のものを優先する）
 * - 行は `memo` のコンポーネントで描く。行のオブジェクト・列・`partsProps.row`・`partsProps.cell`・`renderRow` が変わらなければ、
 *   その行は描き直さない（state-model や `update` は、変わっていない行のオブジェクトをそのまま残す）
 *
 * @param parts 組み込む部品
 * @returns 表のコンポーネント
 */
export default function withTable<P extends TableParts = object>(
  parts: P & CheckParts<P, TableSlots> = {} as P & CheckParts<P, TableSlots>,
) {
  // 組み込んだ部品ごとの props の型は TableProps で決めるので、中では型を広げて描く
  const TableElement: ElementType = parts.Table ?? 'table';
  const Head: ElementType = parts.Head ?? 'thead';
  const HeaderRow: ElementType = parts.HeaderRow ?? 'tr';
  const HeaderCell: ElementType = parts.HeaderCell ?? 'th';
  const Body: ElementType = parts.Body ?? 'tbody';
  const Row: ElementType = parts.Row ?? 'tr';
  const Cell: ElementType = parts.Cell ?? 'td';

  const RowView = memo(function RowView({
    id,
    index,
    record,
    getCells,
    rowProps,
    cellProps,
    renderRow,
  }: RowViewProps) {
    // React Compiler（babel-plugin-react-compiler 1.0.0）が、下の map のコールバックをモジュールの最上位に移し、HOC の中の Cell を見失う。
    // 行は memo で描き直しを省いているので、この部品はコンパイラーの対象から外す
    'use no memo';
    const row = { id, index, record };
    const context = { path: [id] as const, index, record };
    const props = {
      ...resolveItemPartProps(rowProps, context),
      children: getCells(row).map((cell) => (
        <Cell
          key={cell.labelId}
          {...mergePartProps<LooseElementProps>(
            resolveItemPartProps(cellProps, {
              ...cell.context,
              value: cell.props.value,
            }),
            cell.tdProps,
          )}
        >
          {cell.content}
        </Cell>
      )),
    };
    return renderRow ? renderRow(props, context) : <Row {...props} />;
  });

  function Table<R extends { id: TableRowId }>(
    props: TableProps<R, P>,
  ): ReactElement {
    const {
      value,
      defaultValue,
      onValueChange,
      columns,
      renderRow,
      partsProps,
      ...rest
    } = props as unknown as LooseProps;
    const { displayColumns, rows, getCells } = useTable({
      value,
      defaultValue,
      onValueChange,
      columns,
    });

    return (
      <TableElement {...rest}>
        <Head {...partsProps?.head}>
          <HeaderRow {...partsProps?.headerRow}>
            {displayColumns.map((column, index) => (
              <HeaderCell
                key={column.labelId}
                {...mergePartProps<LooseElementProps>(
                  resolveItemPartProps(partsProps?.headerCell, {
                    key: column.key,
                    index,
                  }),
                  column.thProps,
                )}
              >
                {column.label}
              </HeaderCell>
            ))}
          </HeaderRow>
        </Head>
        <Body {...partsProps?.body}>
          {rows.map((row) => (
            <RowView
              key={row.id}
              id={row.id}
              index={row.index}
              record={row.record}
              getCells={getCells}
              rowProps={partsProps?.row}
              cellProps={partsProps?.cell}
              renderRow={renderRow}
            />
          ))}
        </Body>
      </TableElement>
    );
  }

  const names = Object.values(parts as TableParts).map((part) =>
    getComponentName(part as ElementType),
  );
  Table.displayName = `withTable(${names.join(', ')})`;

  return Table;
}
