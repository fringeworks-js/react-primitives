import { useControllableState } from '@fringeworks/react-utils';
import type { UseCollapsibleProps, UseCollapsibleResult } from './types';

/**
 * 折りたためる部品の振る舞いを扱うhook（ヘッドレス UI）
 *
 * HTML の `<details>`・`<summary>` で開閉する。開閉の状態は値と操作の契約（`open`・`defaultOpen`・`onOpenChange`）に沿う。
 *
 * - `<summary>` を押すと、ブラウザーの開閉を止めて `onOpenChange` を呼ぶ。制御なら、親が `open` を変えたときだけ開閉する
 * - ブラウザーが自分で開閉したとき（ページ内検索で開く、など）も `onOpenChange` を呼ぶ。親が受け入れなければ元に戻す
 * - 利用者の `<summary>` の `onClick` で `event.preventDefault()` されたら、開閉しない
 * - `disabled` のときは開閉しない
 *
 * @param props 開閉の状態・設定（折りたためる部品のコンポーネントと同じ props）
 * @returns 開閉の状態と、`<details>`・`<summary>` に渡す props を作る関数
 */
export default function useCollapsible({
  open: openProp,
  defaultOpen,
  onOpenChange,
  disabled = false,
}: UseCollapsibleProps): UseCollapsibleResult {
  const [open, setOpenState] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen ?? false,
    onValueChange: onOpenChange,
  });

  const setOpen = (next: boolean) => {
    if (!disabled) {
      setOpenState(next);
    }
  };

  return {
    open,
    setOpen,
    getDetailsProps: (handlers = {}) => ({
      open,
      onToggle: (event) => {
        handlers.onToggle?.(event);
        // 部品が開閉したときは状態と同じなので何もしない。ブラウザーが自分で開閉したときだけ扱う
        const details = event.currentTarget;
        const nativeOpen = details.open;
        if (nativeOpen === open) {
          return;
        }
        // いったん状態に戻し、受け入れられたら React が open の属性を付け直す。
        // React は open の属性が前と同じなら DOM に触れないので、戻さないと、受け入れられなかったときに見た目がずれる
        details.open = open;
        setOpen(nativeOpen);
      },
    }),
    getSummaryProps: (handlers = {}) => ({
      onClick: (event) => {
        handlers.onClick?.(event);
        if (event.defaultPrevented) {
          return;
        }
        // ブラウザーの開閉は止め、状態から開閉する
        event.preventDefault();
        setOpen(!open);
      },
      'aria-disabled': disabled || undefined,
    }),
  };
}
