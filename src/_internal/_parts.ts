import type { ComponentPropsWithRef, ElementType } from 'react';
import type { DataAttributes, DistributiveOmit } from './_types';

/**
 * HOC に組み込んだ部品の型。組み込んでいなければ既定の部品 `D`
 *
 * @template P HOC に渡した部品のオブジェクトの型
 * @template K 部品の名前
 * @template D 既定の部品
 */
export type PartOf<
  P,
  K extends string,
  D extends ElementType,
> = K extends keyof P ? (P[K] extends ElementType ? P[K] : D) : D;

/**
 * 部品が、HOC が渡す props（`S`）を受け取れるか
 *
 * 部品の props と `S` の両方にあるプロパティについて、`S` の値を部品が受け取れるかを見る。
 * 部品が持たないプロパティは見ない（`ComponentType<S>` に代入できるかと同じ考え方）。
 * 部品が `S` に無いプロパティを必須で持つのはかまわない（`partsProps` で渡す）。
 */
type AcceptsSlotProps<E extends ElementType, S> =
  Pick<S, keyof S & keyof ComponentPropsWithRef<E>> extends Pick<
    ComponentPropsWithRef<E>,
    keyof S & keyof ComponentPropsWithRef<E>
  >
    ? true
    : false;

/**
 * 組み込んだ部品が、HOC が渡す props を受け取れるかを調べる型
 *
 * HOC の引数の型に `P & CheckParts<P, Slots>` と書く。受け取れない部品は `ElementType<口の props>` を求めるので、
 * どの部品の、どの props が合わないかが型エラーに出る。
 *
 * @template P HOC に渡した部品のオブジェクトの型
 * @template Slots 部品の名前と、HOC がその部品に渡す props（口の props）の対応
 */
export type CheckParts<P, Slots> = {
  [K in keyof P]: K extends keyof Slots
    ? P[K] extends ElementType
      ? AcceptsSlotProps<P[K], Slots[K]> extends true
        ? unknown
        : ElementType<Slots[K]>
      : unknown
    : unknown;
};

/**
 * `partsProps` で部品に渡す props（部品の props から、HOC が決めるプロパティ `O` を除いたもの）
 *
 * 判別用のプロパティで形が変わる props（union）は、union のまま残す。
 *
 * @template E 部品
 * @template O HOC が決めるプロパティ（要素の部品は `children`、契約の部品は口の props のキー）
 */
export type PartProps<
  E extends ElementType,
  O extends PropertyKey,
> = DistributiveOmit<ComponentPropsWithRef<E>, O> & DataAttributes;

/**
 * 選択肢・行など、項目ごとに描く部品の props。値ならすべての項目に、関数なら項目ごとに決める
 *
 * @template T 部品の props
 * @template C 関数に渡す情報
 */
export type ItemPartProps<T, C> = T | ((context: C) => T);

type OptionalKeys<M> = {
  [K in keyof M]: Record<never, never> extends M[K] ? K : never;
}[keyof M];

type PartsPropsOf<M> = { [K in OptionalKeys<M>]?: M[K] } & {
  [K in Exclude<keyof M, OptionalKeys<M>>]: M[K];
};

/**
 * `partsProps` のプロパティ
 *
 * 部品ごとの props の型の対応（`M`）から作る。部品に必須のプロパティが残れば、その部品のキーも、`partsProps` も必須になる。
 *
 * @template M `partsProps` のキーと、そこで渡す props の型の対応
 */
export type PartsPropsProp<M> =
  Record<never, never> extends PartsPropsOf<M>
    ? {
        /**
         * 部品に渡す props（部品の名前を camelCase にしたキーで渡す）
         */
        partsProps?: PartsPropsOf<M>;
      }
    : {
        /**
         * 部品に渡す props（部品の名前を camelCase にしたキーで渡す）
         */
        partsProps: PartsPropsOf<M>;
      };

/**
 * 主要素の部品が受け取る、残りの props（主要素の部品の props から、HOC が受け取るプロパティ `O` と `children`・`partsProps` を除いたもの）
 *
 * 作ったコンポーネントのトップレベルの props の型。主要素は、多くの部品ではルート（入れ物・`<table>` など）、
 * Checkbox などでは `<input>`（guidelines/react-components.md の「props を渡す要素」）。
 *
 * @template E 主要素の部品
 * @template O HOC が受け取るプロパティ
 */
export type PrimaryPartProps<
  E extends ElementType,
  O extends PropertyKey,
> = DistributiveOmit<ComponentPropsWithRef<E>, O | 'children' | 'partsProps'>;
