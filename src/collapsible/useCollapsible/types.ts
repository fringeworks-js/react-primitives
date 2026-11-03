import type { DisabledProps, OpenProps } from '@fringeworks/react-contract';
import type { MouseEventHandler, ReactEventHandler } from 'react';

/**
 * `useCollapsible` が受け取る props（折りたためる部品のコンポーネントと同じもの）
 *
 * `defaultOpen` を省略すると閉じている。
 */
export type UseCollapsibleProps = OpenProps & DisabledProps;

/**
 * `<details>` に渡す props
 */
export type CollapsibleDetailsProps = {
  open: boolean;
  onToggle: ReactEventHandler<HTMLDetailsElement>;
};

/**
 * `<summary>` に渡す props
 */
export type CollapsibleSummaryProps = {
  onClick: MouseEventHandler<HTMLElement>;
  'aria-disabled'?: boolean;
};

export type UseCollapsibleResult = {
  /**
   * 開いているか
   */
  open: boolean;

  /**
   * 開く・閉じる（`disabled` のときは何もしない）
   */
  setOpen: (open: boolean) => void;

  /**
   * `<details>` に渡す props を作る。利用者の `onToggle` を渡すと、部品の処理の前に呼ぶ
   */
  getDetailsProps: (handlers?: {
    onToggle?: ReactEventHandler<HTMLDetailsElement>;
  }) => CollapsibleDetailsProps;

  /**
   * `<summary>` に渡す props を作る。利用者の `onClick` を渡すと、部品の処理の前に呼ぶ
   */
  getSummaryProps: (handlers?: {
    onClick?: MouseEventHandler<HTMLElement>;
  }) => CollapsibleSummaryProps;
};
