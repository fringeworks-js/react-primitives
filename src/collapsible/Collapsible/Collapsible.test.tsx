import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import Collapsible from './Collapsible';

const getDetails = () =>
  document.querySelector('details') as HTMLDetailsElement;
const getSummary = () => screen.getByText('見出し');

/**
 * ブラウザーが自分で開閉したとき（ページ内検索で開く、など）を再現する
 */
const toggleByBrowser = (open: boolean) => {
  act(() => {
    getDetails().open = open;
    fireEvent(getDetails(), new Event('toggle'));
  });
};

describe('Collapsible', () => {
  it('details の中に、summary と children を置く', () => {
    render(<Collapsible summary="見出し">中身</Collapsible>);

    const details = getDetails();
    expect(getSummary().tagName).toBe('SUMMARY');
    expect(getSummary().parentElement).toBe(details);
    expect(details.textContent).toContain('中身');
    expect(details.open).toBe(false);
  });

  it('非制御: 見出しを押すと開閉し、通知する', () => {
    const onOpenChange = vi.fn();
    render(
      <Collapsible summary="見出し" onOpenChange={onOpenChange}>
        中身
      </Collapsible>,
    );

    fireEvent.click(getSummary());

    expect(getDetails().open).toBe(true);
    expect(onOpenChange).toHaveBeenLastCalledWith(true);

    fireEvent.click(getSummary());

    expect(getDetails().open).toBe(false);
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it('defaultOpen で開いた状態から始める', () => {
    render(<Collapsible summary="見出し" defaultOpen />);

    expect(getDetails().open).toBe(true);
  });

  it('制御: 押しても、親が open を変えるまでは開かない', () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <Collapsible summary="見出し" open={false} onOpenChange={onOpenChange} />,
    );

    fireEvent.click(getSummary());

    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(true);
    expect(getDetails().open).toBe(false);

    rerender(<Collapsible summary="見出し" open onOpenChange={onOpenChange} />);

    expect(getDetails().open).toBe(true);
  });

  it('ブラウザーが自分で開いたときも通知し、非制御なら開いたままにする', () => {
    const onOpenChange = vi.fn();
    render(<Collapsible summary="見出し" onOpenChange={onOpenChange} />);

    toggleByBrowser(true);

    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(true);
    expect(getDetails().open).toBe(true);
  });

  it('toggle が来ても、状態と同じなら通知しない（部品が開閉したとき）', () => {
    const onOpenChange = vi.fn();
    render(<Collapsible summary="見出し" onOpenChange={onOpenChange} />);

    toggleByBrowser(false);

    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('ブラウザーが自分で開いても、制御で親が受け入れなければ閉じたままにする', () => {
    const onOpenChange = vi.fn();
    render(
      <Collapsible summary="見出し" open={false} onOpenChange={onOpenChange} />,
    );

    toggleByBrowser(true);

    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(true);
    expect(getDetails().open).toBe(false);
  });

  it('disabled なら、押してもブラウザーが開いても開閉しない', () => {
    const onOpenChange = vi.fn();
    render(
      <Collapsible summary="見出し" disabled onOpenChange={onOpenChange} />,
    );

    fireEvent.click(getSummary());
    toggleByBrowser(true);

    expect(onOpenChange).not.toHaveBeenCalled();
    expect(getDetails().open).toBe(false);
    expect(getSummary().getAttribute('aria-disabled')).toBe('true');
  });

  it('summary の onClick を先に呼び、preventDefault されたら開閉しない', () => {
    const onOpenChange = vi.fn();
    render(
      <Collapsible
        summary="見出し"
        onOpenChange={onOpenChange}
        partsProps={{ summary: { onClick: (event) => event.preventDefault() } }}
      />,
    );

    fireEvent.click(getSummary());

    expect(onOpenChange).not.toHaveBeenCalled();
    expect(getDetails().open).toBe(false);
  });

  it('その他の props と ref は details に、partsProps.summary は summary に渡す', () => {
    const ref = createRef<HTMLDetailsElement>();
    const onToggle = vi.fn();
    render(
      <Collapsible
        summary="見出し"
        ref={ref}
        className="mine"
        onToggle={onToggle}
        partsProps={{ summary: { className: 'head' } }}
      />,
    );

    toggleByBrowser(true);

    expect(getDetails().className).toBe('mine');
    expect(getSummary().className).toBe('head');
    expect(ref.current).toBe(getDetails());
    expect(onToggle).toHaveBeenCalled();
  });
});
