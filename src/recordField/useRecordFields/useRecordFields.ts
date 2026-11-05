import { useControllableState } from '@fringeworks/react-utils';
import update from '@fringeworks/utils/object/update';
import { useId } from 'react';
import renderFieldValue from '../renderFieldValue';
import type {
  DisplayRecordField,
  RecordFieldsValueChangeDetails,
  UseRecordFieldsProps,
  UseRecordFieldsResult,
} from './types';

const EMPTY = {};

/**
 * レコードの項目を並べる部品の振る舞いを扱うhook（ヘッドレス UI）
 *
 * レコードを値として持ち、項目の定義から、項目ごとのラベルの id・描いたもの・`renderValue` に渡す props を作る。
 * 何で描くかは利用者が決める。
 *
 * - 項目のラベルに `useId` で id を付け（位置から作る）、`renderValue` に `aria-labelledby` で渡す
 * - `renderValue` の2番目の引数に、項目のパス（`[キー]`）とレコードを渡す
 * - 項目の `onValueChange` が呼ばれたら、そのキーを変えたレコードを作り、
 *   `onValueChange(next, { type: 'update', path: [key] })` で知らせる。値が変わらなければ知らせない
 *
 * @param props レコード・項目・通知（項目を並べるコンポーネントと同じ props）
 * @returns レコードと、表示する項目
 */
export default function useRecordFields<T extends object>({
  value: valueProp,
  defaultValue,
  onValueChange,
  fields,
}: UseRecordFieldsProps<T>): UseRecordFieldsResult<T> {
  const [value, setValue] = useControllableState<
    T,
    [RecordFieldsValueChangeDetails]
  >({
    value: valueProp,
    defaultValue: defaultValue ?? (EMPTY as T),
    onValueChange,
  });

  const baseId = useId();
  const displayFields: DisplayRecordField<T>[] = fields.map((field, index) => {
    const { key } = field;
    const labelId = `${baseId}-${index}`;
    const path = [key] as const;
    const props = {
      value: value[key],
      // 値が変わらなければ update は元のレコードを返し、useControllableState は知らせない
      onValueChange: (fieldValue: T[typeof key]) =>
        setValue(update(value, { [key]: fieldValue } as Partial<T>), {
          type: 'update',
          path,
        }),
      'aria-labelledby': labelId,
    };
    const context = { path, record: value };
    return {
      ...field,
      labelId,
      content: renderFieldValue(field, props, context),
      props,
      context,
    };
  });

  return { value, displayFields };
}
