import { mergePartProps } from '@fringeworks/react-parts-props';
import { getComponentName } from '@fringeworks/react-utils';
import type { ElementType, ReactElement } from 'react';
import type { CheckParts, ItemPartProps } from '../../_internal/_parts';
import resolveItemPartProps from '../../_internal/_resolveItemPartProps';
import useRecordFields, { type UseRecordFieldsProps } from '../useRecordFields';
import type {
  RecordFieldContext,
  RecordFieldsParts,
  RecordFieldsProps,
  RecordFieldsSlots,
} from './types';

type LoosePartProps<T> = ItemPartProps<
  Record<string, unknown>,
  RecordFieldContext<T>
>;

/**
 * 中で扱う、部品の型を広げた props（組み込んだ部品ごとの型は、作ったコンポーネントの型で決める）
 */
type LooseProps<T extends object> = UseRecordFieldsProps<T> &
  Record<string, unknown> & {
    partsProps?: {
      field?: LoosePartProps<T>;
      label?: LoosePartProps<T>;
      value?: LoosePartProps<T>;
    };
  };

/**
 * 組み込んだ部品で描く、レコードの項目を並べる部品を作る HOC
 *
 * `useRecordFields` でラベルの id と値を描いたものを作り、入れ物（`Container`）の中に、
 * 項目ごとの `Field`（ラベルの `Label` と値の `Value`）を並べる。省略した部品は `<div>` で描く。送信（`<form>`）は持たない。
 *
 * - 入力が複数あるので、主要素はルート（入れ物）。その他の props は入れ物に渡す
 * - 項目・ラベル・値の props は `partsProps.field`・`partsProps.label`・`partsProps.value` で、値か関数（項目ごと）で渡す。
 *   ラベルには部品が `id` を付け、`partsProps.label` を重ねる
 * - 組み込んだ部品の props が、ルート・`partsProps` の型になる
 *   （レイアウトの部品を組み込めば、`direction`・`side` などを型付きで渡せる）。部品に必須のプロパティがあれば、`partsProps` も必須になる
 * - 部品は、受け取った props（ラベルの `id` など）を要素に渡す必要がある
 *
 * @param parts 組み込む部品
 * @returns 項目を並べる部品のコンポーネント
 */
export default function withRecordFields<P extends RecordFieldsParts = object>(
  parts: P & CheckParts<P, RecordFieldsSlots> = {} as P &
    CheckParts<P, RecordFieldsSlots>,
) {
  // 組み込んだ部品ごとの props の型は RecordFieldsProps で決めるので、中では型を広げて描く
  const Container: ElementType = parts.Container ?? 'div';
  const Field: ElementType = parts.Field ?? 'div';
  const Label: ElementType = parts.Label ?? 'div';
  const Value: ElementType = parts.Value ?? 'div';

  function RecordFields<T extends object>(
    props: RecordFieldsProps<T, P>,
  ): ReactElement {
    const { value, defaultValue, onValueChange, fields, partsProps, ...rest } =
      props as unknown as LooseProps<T>;
    const { displayFields } = useRecordFields({
      value,
      defaultValue,
      onValueChange,
      fields,
    });

    return (
      <Container {...rest}>
        {displayFields.map((field) => {
          const context = { ...field.context, key: field.key };
          return (
            <Field
              key={field.labelId}
              {...resolveItemPartProps(partsProps?.field, context)}
            >
              <Label
                {...mergePartProps<Record<string, unknown>>(
                  { id: field.labelId },
                  resolveItemPartProps(partsProps?.label, context),
                )}
              >
                {field.label}
              </Label>
              <Value {...resolveItemPartProps(partsProps?.value, context)}>
                {field.content}
              </Value>
            </Field>
          );
        })}
      </Container>
    );
  }

  const names = Object.values(parts as RecordFieldsParts).map((part) =>
    getComponentName(part as ElementType),
  );
  RecordFields.displayName = `withRecordFields(${names.join(', ')})`;

  return RecordFields;
}
