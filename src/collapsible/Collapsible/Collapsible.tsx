import type { ReactElement } from 'react';
import useCollapsible from '../useCollapsible';
import type { CollapsibleProps } from './types';

/**
 * 値と操作の契約（`open`・`defaultOpen`・`onOpenChange`）に沿った、折りたためる部品
 *
 * `<details>` の中に、`summary` を入れた `<summary>` と `children` を置く。
 * その他の props は `<details>` に渡し、`<summary>` には `partsProps.summary` で渡す。
 */
export default function Collapsible({
  open,
  defaultOpen,
  onOpenChange,
  disabled,
  summary,
  children,
  partsProps,
  onToggle,
  ...rest
}: CollapsibleProps): ReactElement {
  const { getDetailsProps, getSummaryProps } = useCollapsible({
    open,
    defaultOpen,
    onOpenChange,
    disabled,
  });

  const { onClick: summaryOnClick, ...summaryRest } = partsProps?.summary ?? {};

  return (
    <details {...rest} {...getDetailsProps({ onToggle })}>
      <summary
        {...summaryRest}
        {...getSummaryProps({ onClick: summaryOnClick })}
      >
        {summary}
      </summary>
      {children}
    </details>
  );
}
