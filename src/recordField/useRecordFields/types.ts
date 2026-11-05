import type { EditableValueProps } from '@fringeworks/react-contract';
import type { ReactNode } from 'react';
import type { FieldValueContext, FieldValueProps, RecordField } from '../types';

/**
 * レコードの値が変わったときの付帯情報
 */
export type RecordFieldsValueChangeDetails = {
  /**
   * 操作の種類。今は項目の値を変える `'update'` だけ
   */
  type: 'update';

  /**
   * 変わった項目のキー。state-model のパスと同じ形
   */
  path: readonly [key: string];
};

/**
 * `useRecordFields` が受け取る props（項目を並べるコンポーネントと同じもの）
 *
 * `value` はレコード。`value`・`defaultValue` を両方省略すると `{}`。
 *
 * @template T レコードの型
 */
export type UseRecordFieldsProps<T extends object> = Omit<
  EditableValueProps<T>,
  'onValueChange'
> & {
  /**
   * 項目
   */
  fields: readonly RecordField<T>[];

  /**
   * 項目の値が確定したときに呼ぶ関数。変わった後のレコードと、変わった項目を渡す
   */
  onValueChange?: (value: T, details: RecordFieldsValueChangeDetails) => void;
};

/**
 * 表示する項目
 *
 * @template T レコードの型
 */
export type DisplayRecordField<T> = RecordField<T> & {
  /**
   * 項目のラベルの要素に付ける id
   */
  labelId: string;

  /**
   * 項目の `renderValue` で描いたもの（省略した項目は、値を文字にしたもの）
   */
  content: ReactNode;

  /**
   * `renderValue` に渡した props。自分で描き直すときに使う
   */
  props: FieldValueProps<T[keyof T & string]>;

  /**
   * `renderValue` に2番目の引数で渡した情報（`path` は `[キー]`、`record` はレコード）
   */
  context: FieldValueContext<T>;
};

export type UseRecordFieldsResult<T> = {
  /**
   * レコード
   */
  value: T;

  /**
   * 表示する項目（項目の順）
   */
  displayFields: DisplayRecordField<T>[];
};
