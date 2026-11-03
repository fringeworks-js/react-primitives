import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import OptionLabel from './OptionLabel';

const options = [
  { value: 's', label: 'S' },
  { value: 'm' },
  { value: '', label: '未選択' },
];

const textOf = (element: ReturnType<typeof render>['container']) =>
  element.firstElementChild?.textContent;

describe('OptionLabel', () => {
  it('選んだ値の選択肢のラベルを span に表示する', () => {
    const { container } = render(<OptionLabel options={options} value="s" />);

    expect(container.firstElementChild?.tagName).toBe('SPAN');
    expect(textOf(container)).toBe('S');
  });

  it('ラベルを省略した選択肢は String(value) を表示する', () => {
    const { container } = render(<OptionLabel options={options} value="m" />);

    expect(textOf(container)).toBe('m');
  });

  it('空文字も値の1つとして、選択肢のラベルを表示する', () => {
    const { container } = render(<OptionLabel options={options} value="" />);

    expect(textOf(container)).toBe('未選択');
  });

  it('null のときは placeholder を表示する。省略すると何も表示しない', () => {
    const { container, rerender } = render(
      <OptionLabel options={options} value={null} placeholder="[未選択]" />,
    );

    expect(textOf(container)).toBe('[未選択]');

    rerender(<OptionLabel options={options} value={null} />);

    expect(textOf(container)).toBe('');
  });

  it("選択肢外の値は String(value) を表示し、'hidden' なら placeholder を表示する", () => {
    const { container, rerender } = render(
      <OptionLabel options={options} value="xl" placeholder="-" />,
    );

    expect(textOf(container)).toBe('xl');

    rerender(
      <OptionLabel
        options={options}
        value="xl"
        unlistedPlacement="hidden"
        placeholder="-"
      />,
    );

    expect(textOf(container)).toBe('-');
  });

  it('その他の props は span に渡す', () => {
    const { container } = render(
      <OptionLabel options={options} value="s" className="label" />,
    );

    expect(container.firstElementChild?.className).toBe('label');
  });
});
