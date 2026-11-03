import type { WithPartsProps } from '@fringeworks/react-parts-props';
import type { ComponentPropsWithRef, ReactNode } from 'react';
import type { UseCollapsibleProps } from '../useCollapsible';

type OwnProps = UseCollapsibleProps & {
  /**
   * 見出し（`<summary>` の中身）
   */
  summary?: ReactNode;

  /**
   * 開いたときに見える中身
   */
  children?: ReactNode;
};

/**
 * `Collapsible` のプロパティ
 *
 * `defaultOpen` を省略すると閉じている。
 */
export type CollapsibleProps = WithPartsProps<{
  summary: Omit<ComponentPropsWithRef<'summary'>, 'children'>;
}> &
  OwnProps &
  Omit<ComponentPropsWithRef<'details'>, keyof OwnProps>;
