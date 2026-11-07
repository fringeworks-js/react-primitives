import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type {
  CollapsibleDetailsSlotProps,
  CollapsibleIndicatorSlotProps,
  CollapsibleSummarySlotProps,
} from './types';
import withCollapsible from './withCollapsible';

describe('withCollapsible', () => {
  it('組み込んだ部品で <details>・<summary> を描く。部品は受け取った props を要素に渡す', () => {
    const Details = (props: CollapsibleDetailsSlotProps) => (
      <details {...props} data-part="details" />
    );
    const Summary = (props: CollapsibleSummarySlotProps) => (
      <summary {...props} data-part="summary" />
    );
    const Collapsible = withCollapsible({ Details, Summary });
    const onOpenChange = vi.fn();
    const { container } = render(
      <Collapsible
        summary="詳細"
        onOpenChange={onOpenChange}
        className="mine"
        partsProps={{ summary: { className: 'head' } }}
      >
        中身
      </Collapsible>,
    );

    const details = container.querySelector('details')!;
    expect(details.dataset.part).toBe('details');
    expect(details.className).toBe('mine');
    const summary = screen.getByText('詳細');
    expect([summary.dataset.part, summary.className]).toEqual([
      'summary',
      'head',
    ]);

    fireEvent.click(summary);
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(true);
  });

  describe('組み込んだ部品の props の型', () => {
    // 必須のプロパティを持つ見出し（デザインシステムの部品を想定）
    function IconSummary({
      icon,
      children,
      ...props
    }: CollapsibleSummarySlotProps & { icon: 'plus' | 'chevron' }) {
      return (
        <summary {...props} data-icon={icon}>
          {children}
        </summary>
      );
    }
    const IconCollapsible = withCollapsible({ Summary: IconSummary });

    it('partsProps.summary は見出しの部品の props になり、必須のものがあれば partsProps も必須になる', () => {
      render(
        <IconCollapsible
          summary="詳細"
          partsProps={{ summary: { icon: 'plus' } }}
        >
          中身
        </IconCollapsible>,
      );
      expect(screen.getByText('詳細').dataset.icon).toBe('plus');

      const missing = {
        // @ts-expect-error 見出しの icon を渡す partsProps が無い
        element: <IconCollapsible summary="詳細" />,
      };
      expect(missing.element).toBeDefined();
    });
  });

  it('displayName に組み込んだ部品の名前を入れる', () => {
    function AppSummary(props: CollapsibleSummarySlotProps) {
      return <summary {...props} />;
    }

    expect(withCollapsible({ Summary: AppSummary }).displayName).toBe(
      'withCollapsible(AppSummary)',
    );
  });

  it('Indicator を組み込むと、<summary> の中の見出しの前に、開閉の状態を渡して描く', () => {
    const Indicator = (props: CollapsibleIndicatorSlotProps) => (
      <span
        data-testid="indicator"
        aria-hidden={props['aria-hidden']}
        data-open={props.open}
      />
    );
    const Collapsible = withCollapsible({ Indicator });
    render(<Collapsible summary="見出し">中身</Collapsible>);
    const indicator = screen.getByTestId('indicator');
    const summary = indicator.parentElement!;
    expect(summary.tagName).toBe('SUMMARY');
    expect(summary.firstChild).toBe(indicator);
    expect(indicator.dataset.open).toBe('false');
    fireEvent.click(summary);
    expect(screen.getByTestId('indicator').dataset.open).toBe('true');
  });
});
