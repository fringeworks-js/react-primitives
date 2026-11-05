import type { ItemPartProps } from './_parts';

/**
 * 部品に渡す props を、値か関数から作る
 *
 * @param partProps `partsProps` で渡したもの
 * @param context 関数に渡す情報
 * @returns 部品に渡す props。`partProps` を省略したら空のオブジェクト
 */
export default function resolveItemPartProps<C>(
  partProps: ItemPartProps<Record<string, unknown>, C> | undefined,
  context: C,
): Record<string, unknown> {
  return (
    (typeof partProps === 'function' ? partProps(context) : partProps) ?? {}
  );
}
