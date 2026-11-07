import { getComponentName } from '@fringeworks/react-utils';
import type {
  ElementType,
  MouseEventHandler,
  ReactElement,
  ReactEventHandler,
  ReactNode,
} from 'react';
import type { CheckParts } from '../../_internal/_parts';
import useCollapsible, { type UseCollapsibleProps } from '../useCollapsible';
import type {
  CollapsibleParts,
  CollapsibleProps,
  CollapsibleSlots,
} from './types';

/**
 * 中で扱う、部品の型を広げた props（組み込んだ部品ごとの型は、作ったコンポーネントの型で決める）
 */
type LooseProps = UseCollapsibleProps &
  Record<string, unknown> & {
    summary?: ReactNode;
    children?: ReactNode;
    onToggle?: ReactEventHandler<HTMLDetailsElement>;
    partsProps?: {
      summary?: Record<string, unknown> & {
        onClick?: MouseEventHandler<HTMLElement>;
      };
      indicator?: Record<string, unknown>;
    };
  };

/**
 * 組み込んだ部品で描く、折りたためる部品を作る HOC
 *
 * `<details>`（`Details`）の中に、`summary` を入れた `<summary>`（`Summary`）と `children` を置く。`Indicator` を組み込むと、`<summary>` の中の見出しの前に開閉の印を描く（状態を props で渡す）。省略した部品は素の要素で描く（`Indicator` は描かない）。
 * その他の props は `<details>` に渡し、`<summary>` には `partsProps.summary` で渡す。
 *
 * - 組み込んだ部品の props が、ルート（`Details`）・`partsProps.summary` の型になる。部品に必須のプロパティがあれば、`partsProps` も必須になる
 * - 部品は、受け取った props（`open`・`onToggle`・`onClick`・`children` など）を `<details>`・`<summary>` に渡す必要がある
 *
 * @param parts 組み込む部品
 * @returns 折りたためる部品のコンポーネント
 */
export default function withCollapsible<P extends CollapsibleParts = object>(
  parts: P & CheckParts<P, CollapsibleSlots> = {} as P &
    CheckParts<P, CollapsibleSlots>,
) {
  // 組み込んだ部品ごとの props の型は CollapsibleProps で決めるので、中では型を広げて描く
  const Details: ElementType = parts.Details ?? 'details';
  const Summary: ElementType = parts.Summary ?? 'summary';
  const Indicator: ElementType | undefined = parts.Indicator;

  function Collapsible(props: CollapsibleProps<P>): ReactElement {
    const {
      open,
      defaultOpen,
      onOpenChange,
      disabled,
      summary,
      children,
      partsProps,
      onToggle,
      ...rest
    } = props as unknown as LooseProps;
    const {
      open: isOpen,
      getDetailsProps,
      getSummaryProps,
    } = useCollapsible({
      open,
      defaultOpen,
      onOpenChange,
      disabled,
    });

    const { onClick: summaryOnClick, ...summaryRest } =
      partsProps?.summary ?? {};

    return (
      <Details {...rest} {...getDetailsProps({ onToggle })}>
        <Summary
          {...summaryRest}
          {...getSummaryProps({ onClick: summaryOnClick })}
        >
          {Indicator && (
            <Indicator
              {...partsProps?.indicator}
              open={isOpen}
              disabled={disabled ?? false}
              aria-hidden
            />
          )}
          {summary}
        </Summary>
        {children}
      </Details>
    );
  }

  const names = Object.values(parts as CollapsibleParts).map((part) =>
    getComponentName(part as ElementType),
  );
  Collapsible.displayName = `withCollapsible(${names.join(', ')})`;

  return Collapsible;
}
