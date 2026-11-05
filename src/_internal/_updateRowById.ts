import update from '@fringeworks/utils/object/update';

/**
 * 一覧の中で id が一致する行の1つのキーを変えた、新しい配列を作る
 *
 * id は `String()` で揃えて比べる（state-model の一覧と同じく、`3` と `'3'` を同じ行とみなす）。
 * 同じ id の行が複数あるときは、先にある行だけを変える。
 *
 * @param rows 一覧
 * @param id 変える行の id（文字列に揃えたもの）
 * @param key 変えるキー
 * @param value 新しい値
 * @returns 新しい配列。一致する行が無い、または値が変わらないときは undefined
 */
export default function updateRowById<R extends { id: string | number }>(
  rows: readonly R[],
  id: string,
  key: keyof R,
  value: unknown,
): R[] | undefined {
  const index = rows.findIndex((row) => String(row.id) === id);
  const row = rows[index];
  if (row === undefined) {
    return undefined;
  }
  const nextRow = update(row, { [key]: value } as Partial<R>);
  if (nextRow === row) {
    return undefined;
  }
  const next = [...rows];
  next[index] = nextRow;
  return next;
}
