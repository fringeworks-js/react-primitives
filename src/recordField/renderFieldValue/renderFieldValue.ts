import ensureString from '@fringeworks/utils/string/ensureString';
import type { ReactNode } from 'react';
import type { FieldValueContext, FieldValueProps, RecordField } from '../types';

/**
 * 項目の値を描く
 *
 * 項目の `renderValue` を呼ぶ。省略した項目は、値を文字にして返す（`null`・`undefined` は空）。
 *
 * @param field 項目
 * @param props `renderValue` に渡す props（`value` は `field.key` の値）
 * @param context `renderValue` に渡す、props と別の情報
 * @returns 描いたもの
 */
export default function renderFieldValue<T>(
  field: RecordField<T>,
  props: FieldValueProps<T[keyof T & string]>,
  context: FieldValueContext<T>,
): ReactNode {
  // union の要素ごとに引数の型が違うので、key と値の組を呼ぶ側に任せる
  const renderValue = field.renderValue as
    | ((
        props: FieldValueProps<T[keyof T & string]>,
        context: FieldValueContext<T>,
      ) => ReactNode)
    | undefined;
  return renderValue ? renderValue(props, context) : ensureString(props.value);
}
