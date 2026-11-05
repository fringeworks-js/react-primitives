import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type {
  OptionLabelsContainerSlotProps,
  OptionLabelsLabelSlotProps,
} from './types';
import withOptionLabels from './withOptionLabels';

const options = [
  { value: 'a', label: 'りんご' },
  { value: 'b', label: 'みかん' },
];

describe('withOptionLabels', () => {
  it('組み込んだ入れ物で描き、その他の props は入れ物に渡す', () => {
    const Container = (props: OptionLabelsContainerSlotProps) => (
      <strong {...props} />
    );
    const OptionLabels = withOptionLabels({ Container });
    const { container } = render(
      <OptionLabels value={['a', 'b']} options={options} className="mine" />,
    );

    const root = container.firstElementChild!;
    expect([root.tagName, root.className, root.textContent]).toEqual([
      'STRONG',
      'mine',
      'りんご, みかん',
    ]);
  });

  it('入れ物の部品の props がルートの型になる', () => {
    function Tone({
      tone,
      ...props
    }: OptionLabelsContainerSlotProps & { tone: 'plain' | 'muted' }) {
      return <span {...props} data-tone={tone} />;
    }
    const OptionLabels = withOptionLabels({ Container: Tone });
    const { container } = render(
      <OptionLabels value={['a', 'b']} options={options} tone="muted" />,
    );
    expect((container.firstElementChild as HTMLElement).dataset.tone).toBe(
      'muted',
    );

    const missing = {
      // @ts-expect-error 入れ物の tone が無い
      element: <OptionLabels value={['a', 'b']} options={options} />,
    };
    expect(missing.element).toBeDefined();
  });

  it('displayName に組み込んだ部品の名前を入れる', () => {
    function AppLabel(props: OptionLabelsContainerSlotProps) {
      return <span {...props} />;
    }

    expect(withOptionLabels({ Container: AppLabel }).displayName).toBe(
      'withOptionLabels(AppLabel)',
    );
  });

  it('ラベル1つずつを Label で描き、partsProps.label を値か関数（表示する選択肢ごと）で渡す', () => {
    const Chip = (props: OptionLabelsLabelSlotProps) => (
      <b {...props} data-part="chip" />
    );
    const OptionLabels = withOptionLabels({ Label: Chip });
    const { container } = render(
      <OptionLabels
        value={['b', 'x']}
        options={options}
        separator=" "
        partsProps={{
          label: (option) => ({
            className: option.unlisted ? 'unlisted' : `chip-${option.value}`,
          }),
        }}
      />,
    );

    const chips = [...container.querySelectorAll<HTMLElement>('b')];
    expect(
      chips.map((chip) => [
        chip.dataset.part,
        chip.className,
        chip.textContent,
      ]),
    ).toEqual([
      ['chip', 'chip-b', 'みかん'],
      ['chip', 'unlisted', 'x'],
    ]);
    expect(container.firstElementChild?.textContent).toBe('みかん x');
  });

  it('部品を省略すると、ラベルも <span> で描く。空のときの placeholder は包まない', () => {
    const OptionLabels = withOptionLabels();
    const { container, rerender } = render(
      <OptionLabels
        value={['a']}
        options={options}
        partsProps={{ label: { className: 'label' } }}
      />,
    );
    expect(container.querySelector('span > span')?.className).toBe('label');

    rerender(
      <OptionLabels value={[]} options={options} placeholder="未選択" />,
    );
    expect(container.firstElementChild?.innerHTML).toBe('未選択');
  });

  it('ラベルの部品に必須のプロパティがあれば、partsProps も必須になる', () => {
    function ToneChip({
      tone,
      ...props
    }: OptionLabelsLabelSlotProps & { tone: 'plain' | 'muted' }) {
      return <span {...props} data-tone={tone} />;
    }
    const OptionLabels = withOptionLabels({ Label: ToneChip });
    const { container } = render(
      <OptionLabels
        value={['a']}
        options={options}
        partsProps={{ label: { tone: 'muted' } }}
      />,
    );
    expect(
      container.querySelector<HTMLElement>('[data-tone]')?.dataset.tone,
    ).toBe('muted');

    const missing = {
      // @ts-expect-error ラベルの tone を渡す partsProps が無い
      element: <OptionLabels value={['a']} options={options} />,
    };
    expect(missing.element).toBeDefined();
  });
});
