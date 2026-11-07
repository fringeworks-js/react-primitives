import { getComponentName } from '@fringeworks/react-utils';
import type { ElementType, MouseEventHandler, ReactElement } from 'react';
import type { CheckParts } from '../../_internal/_parts';
import useButton, { type UseButtonProps } from '../useButton';
import type { ButtonParts, ButtonProps, ButtonSlots } from './types';

/**
 * 中で扱う、部品の型を広げた props（組み込んだ部品ごとの型は ButtonProps で決める）
 */
type LooseProps = UseButtonProps<unknown> &
  Record<string, unknown> & {
    onClick?: MouseEventHandler<HTMLButtonElement>;
  };

/**
 * 組み込んだ部品で描く、値と操作の契約（`onMainAction`）に沿ったボタンを作る HOC
 *
 * `useButton` で `type`・`disabled`・`onClick` を作り、部品（省略したら `<button>`）に渡す。押すと、`value` をそのまま
 * `onMainAction` に渡す（`value` を省略すると `undefined`）。
 *
 * - `onClick` を先に呼び、そこで `event.preventDefault()` されたら `onMainAction` は呼ばない
 * - `type` を省略すると `'button'`（フォームの中でも送信しない）。その他の props は部品に渡す
 * - 組み込んだ部品の props が、作ったコンポーネントのプロパティの型になる
 * - 部品は、受け取った props（`type`・`onClick`・`disabled`・`children` など）を要素に渡す必要がある
 *
 * @param parts 組み込む部品
 * @returns ボタンのコンポーネント
 */
export default function withButton<P extends ButtonParts = object>(
  parts: P & CheckParts<P, ButtonSlots> = {} as P & CheckParts<P, ButtonSlots>,
) {
  // 組み込んだ部品の props の型は ButtonProps で決めるので、中では型を広げて描く
  const Element: ElementType = parts.Button ?? 'button';

  function Button<V = undefined>(props: ButtonProps<V, P>): ReactElement {
    const { value, onMainAction, disabled, type, onClick, ...rest } =
      props as unknown as LooseProps;
    const { getButtonProps } = useButton({
      value,
      onMainAction,
      disabled,
      type,
    });

    return <Element {...rest} {...getButtonProps({ onClick })} />;
  }

  const names = Object.values(parts as ButtonParts).map((part) =>
    getComponentName(part as ElementType),
  );
  Button.displayName = `withButton(${names.join(', ')})`;

  return Button;
}
