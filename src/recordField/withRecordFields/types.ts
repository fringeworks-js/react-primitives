import type { ComponentPropsWithRef, ElementType } from 'react';
import type {
  ItemPartProps,
  PartOf,
  PartProps,
  PartsPropsProp,
  PrimaryPartProps,
} from '../../_internal/_parts';
import type { FieldValueContext } from '../types';
import type { UseRecordFieldsProps } from '../useRecordFields';

/**
 * 項目を並べる部品に組み込む、入れ物の部品が受け取る props（既定の `<div>` の場合）
 *
 * 利用者の props（`className`・`role`・`aria-*` など）と、並べる項目（`children`）。受け取った props は要素に渡す。
 */
export type RecordFieldsContainerSlotProps = ComponentPropsWithRef<'div'>;

/**
 * 項目を並べる部品に組み込む、項目・ラベル・値の部品が受け取る props（既定の `<div>` の場合）
 *
 * `partsProps` で渡したものと、`children`（ラベルには部品が付ける `id` も）。
 * 受け取った props は要素に渡す（ラベルの `id` を渡さないと、値の部品の名前が付かない）。
 */
export type RecordFieldPartSlotProps = ComponentPropsWithRef<'div'>;

/**
 * `withRecordFields` に組み込む部品
 *
 * どれも省略でき、省略すると `<div>` で描く。組み込んだ部品の props は、作ったコンポーネントの
 * ルート（`Container`）と `partsProps.field`・`partsProps.label`・`partsProps.value` の型になる。
 */
export type RecordFieldsParts = {
  /**
   * 項目を並べる入れ物
   */
  Container?: ElementType;

  /**
   * 項目（ラベルと値を包む）
   */
  Field?: ElementType;

  /**
   * 項目のラベル
   */
  Label?: ElementType;

  /**
   * 項目の値（`renderValue` で描いたもの）を包む
   */
  Value?: ElementType;
};

/**
 * 部品の名前と、HOC がその部品に渡す props の対応
 */
export type RecordFieldsSlots = {
  Container: RecordFieldsContainerSlotProps;
  Field: RecordFieldPartSlotProps;
  Label: RecordFieldPartSlotProps;
  Value: RecordFieldPartSlotProps;
};

/**
 * 項目・ラベル・値の props を決める関数に渡す情報
 *
 * `renderValue` の2番目の引数と同じものに、項目のキーを足したもの。
 *
 * @template T レコードの型
 */
export type RecordFieldContext<T> = FieldValueContext<T> & {
  /**
   * 項目のキー
   */
  key: keyof T & string;
};

type ItemProps<T, P, K extends string> = ItemPartProps<
  PartProps<PartOf<P, K, 'div'>, 'children'>,
  RecordFieldContext<T>
>;

/**
 * `partsProps` で部品に渡す props。値ならすべての項目に、関数なら項目ごとに決める
 *
 * @template T レコードの型
 * @template P 組み込んだ部品
 */
export type RecordFieldsPartsProps<T, P = object> = {
  /**
   * 項目の部品に渡す props
   */
  field: ItemProps<T, P, 'Field'>;

  /**
   * ラベルの部品に渡す props（部品が付ける `id` に重ねる）
   */
  label: ItemProps<T, P, 'Label'>;

  /**
   * 値の部品に渡す props
   */
  value: ItemProps<T, P, 'Value'>;
};

/**
 * `withRecordFields` で作ったコンポーネントのプロパティ
 *
 * `value` はレコード。`value`・`defaultValue` を両方省略すると `{}`。
 * ルートの残りの props は入れ物の部品の props、`partsProps` は項目・ラベル・値の部品の props になる。
 *
 * @template T レコードの型
 * @template P 組み込んだ部品
 */
export type RecordFieldsProps<
  T extends object,
  P extends RecordFieldsParts = object,
> = UseRecordFieldsProps<T> &
  PartsPropsProp<RecordFieldsPartsProps<T, P>> &
  PrimaryPartProps<PartOf<P, 'Container', 'div'>, keyof UseRecordFieldsProps<T>>;
