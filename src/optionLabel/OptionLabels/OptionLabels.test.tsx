import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import OptionLabels from './OptionLabels';

const options = [
  { value: 'a', label: 'りんご' },
  { value: 'b', label: 'みかん' },
  { value: 'c', label: 'ぶどう' },
];

const textOf = (element: ReturnType<typeof render>['container']) =>
  element.firstElementChild?.textContent;

describe('OptionLabels', () => {
  it('選んだ値のラベルを、選択肢の順に並べて表示する', () => {
    const { container } = render(
      <OptionLabels options={options} value={['c', 'a']} />,
    );

    expect(container.firstElementChild?.tagName).toBe('SPAN');
    expect(textOf(container)).toBe('りんご, ぶどう');
  });

  it('separator でつなぐ', () => {
    const { container } = render(
      <OptionLabels options={options} value={['a', 'b']} separator="、" />,
    );

    expect(textOf(container)).toBe('りんご、みかん');
  });

  it('空の配列のときは placeholder を表示する', () => {
    const { container } = render(
      <OptionLabels options={options} value={[]} placeholder="なし" />,
    );

    expect(textOf(container)).toBe('なし');
  });

  it('選択肢外の値は unlistedPlacement の位置に表示する（入力の部品と同じ順）', () => {
    const { container, rerender } = render(
      <OptionLabels options={options} value={['x', 'b']} />,
    );

    expect(textOf(container)).toBe('みかん, x');

    rerender(
      <OptionLabels
        options={options}
        value={['x', 'b']}
        unlistedPlacement="start"
      />,
    );

    expect(textOf(container)).toBe('x, みかん');
  });

  it("'hidden' なら選択肢外の値を表示せず、表示するものが無ければ placeholder を表示する", () => {
    const { container, rerender } = render(
      <OptionLabels
        options={options}
        value={['x', 'b']}
        unlistedPlacement="hidden"
      />,
    );

    expect(textOf(container)).toBe('みかん');

    rerender(
      <OptionLabels
        options={options}
        value={['x']}
        unlistedPlacement="hidden"
        placeholder="なし"
      />,
    );

    expect(textOf(container)).toBe('なし');
  });
});
