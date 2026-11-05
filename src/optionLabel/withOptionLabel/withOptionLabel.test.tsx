import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { OptionLabelContainerSlotProps } from './types';
import withOptionLabel from './withOptionLabel';

const options = [
  { value: 'a', label: 'りんご' },
  { value: 'b', label: 'みかん' },
];

describe('withOptionLabel', () => {
  it('組み込んだ入れ物で描き、その他の props は入れ物に渡す', () => {
    const Container = (props: OptionLabelContainerSlotProps) => (
      <strong {...props} />
    );
    const OptionLabel = withOptionLabel({ Container });
    const { container } = render(
      <OptionLabel value={'a'} options={options} className="mine" />,
    );

    const root = container.firstElementChild!;
    expect([root.tagName, root.className, root.textContent]).toEqual([
      'STRONG',
      'mine',
      'りんご',
    ]);
  });

  it('入れ物の部品の props がルートの型になる', () => {
    function Tone({
      tone,
      ...props
    }: OptionLabelContainerSlotProps & { tone: 'plain' | 'muted' }) {
      return <span {...props} data-tone={tone} />;
    }
    const OptionLabel = withOptionLabel({ Container: Tone });
    const { container } = render(
      <OptionLabel value={'a'} options={options} tone="muted" />,
    );
    expect((container.firstElementChild as HTMLElement).dataset.tone).toBe(
      'muted',
    );

    const missing = {
      // @ts-expect-error 入れ物の tone が無い
      element: <OptionLabel value={'a'} options={options} />,
    };
    expect(missing.element).toBeDefined();
  });

  it('displayName に組み込んだ部品の名前を入れる', () => {
    function AppLabel(props: OptionLabelContainerSlotProps) {
      return <span {...props} />;
    }

    expect(withOptionLabel({ Container: AppLabel }).displayName).toBe(
      'withOptionLabel(AppLabel)',
    );
  });
});
