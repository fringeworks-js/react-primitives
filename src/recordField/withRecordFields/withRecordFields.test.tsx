import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import TextInput from '../../textInput/TextInput';
import type { RecordField } from '../types';
import type {
  RecordFieldPartSlotProps,
  RecordFieldsContainerSlotProps,
} from './types';
import withRecordFields from './withRecordFields';

type Member = { id: string; name: string; email: string };

const member: Member = { id: '1', name: '山田', email: 'a@example.com' };

const fields: RecordField<Member>[] = [
  {
    key: 'name',
    label: '名前',
    renderValue: (props) => <TextInput {...props} />,
  },
  {
    key: 'email',
    label: 'メール',
    renderValue: (props) => <TextInput {...props} />,
  },
];

describe('withRecordFields', () => {
  it('部品を省略すると、すべて div で描く', () => {
    const RecordFields = withRecordFields();
    const { container } = render(
      <RecordFields value={member} fields={fields} />,
    );

    const items = container.querySelectorAll(':scope > div > div');
    expect(items).toHaveLength(2);
    expect(items[0]?.children[0]?.tagName).toBe('DIV');
    expect(items[0]?.children[0]?.textContent).toBe('名前');
  });

  it('組み込んだ部品で描き、ラベルの id で値の部品を名付ける', () => {
    const Container = (props: RecordFieldsContainerSlotProps) => (
      <section {...props} />
    );
    const Field = (props: RecordFieldPartSlotProps) => (
      <div {...props} data-part="field" />
    );
    const Label = (props: RecordFieldPartSlotProps) => (
      <span {...props} data-part="label" />
    );
    const Value = (props: RecordFieldPartSlotProps) => (
      <span {...props} data-part="value" />
    );
    const RecordFields = withRecordFields({ Container, Field, Label, Value });
    const { container } = render(
      <RecordFields value={member} fields={fields} className="mine" />,
    );

    const root = container.firstElementChild as HTMLElement;
    expect(root.tagName).toBe('SECTION');
    expect(root.className).toBe('mine');
    expect(
      [...root.querySelectorAll<HTMLElement>('[data-part]')].map(
        (el) => el.dataset.part,
      ),
    ).toEqual(['field', 'label', 'value', 'field', 'label', 'value']);
    expect(screen.getByRole('textbox', { name: 'メール' })).toBeDefined();
  });

  it('partsProps の field・label・value を値か関数で渡す。ラベルの id は残す', () => {
    const RecordFields = withRecordFields();
    const { container } = render(
      <RecordFields
        value={member}
        fields={fields}
        partsProps={{
          field: ({ key, path, record }) => ({
            className: `field-${key}-${path.join('.')}-${record.id}`,
          }),
          label: { className: 'label' },
          value: ({ key }) => (key === 'email' ? { title: 'mail' } : {}),
        }}
      />,
    );

    const items = [...container.querySelectorAll(':scope > div > div')];
    expect(items.map((item) => item.className)).toEqual([
      'field-name-name-1',
      'field-email-email-1',
    ]);
    const label = items[1]!.children[0]!;
    expect(label.className).toBe('label');
    expect(label.id).not.toBe('');
    expect(items[1]!.children[1]!.getAttribute('title')).toBe('mail');
    expect(items[0]!.children[1]!.hasAttribute('title')).toBe(false);
    expect(screen.getByRole('textbox', { name: 'メール' })).toBeDefined();
  });

  it('displayName に組み込んだ部品の名前を入れる', () => {
    function AppField(props: RecordFieldPartSlotProps) {
      return <div {...props} />;
    }

    expect(withRecordFields({ Field: AppField }).displayName).toBe(
      'withRecordFields(AppField)',
    );
  });

  describe('組み込んだ部品の props の型', () => {
    // 必須のプロパティを持つ入れ物（レイアウトの部品を想定）
    function Columns({
      count,
      ...props
    }: RecordFieldsContainerSlotProps & { count: number }) {
      return <div {...props} data-count={count} />;
    }
    // 判別用のプロパティで形が変わるラベル（affix の装飾を想定）
    type SideProps =
      | { side: 'top'; alignX?: 'left' | 'right' }
      | { side: 'left'; alignY?: 'top' | 'bottom' };
    function SideLabel(props: RecordFieldPartSlotProps & SideProps) {
      const { side, children, id } = props;
      return (
        <div id={id} data-side={side}>
          {children}
        </div>
      );
    }
    const LayoutFields = withRecordFields({
      Container: Columns,
      Label: SideLabel,
    });

    it('ルートは入れ物の props、partsProps.label はラベルの props になる', () => {
      const { container } = render(
        <LayoutFields
          value={member}
          fields={fields}
          count={2}
          partsProps={{
            label: ({ key }) =>
              key === 'name'
                ? { side: 'top', alignX: 'left' }
                : { side: 'left' },
          }}
        />,
      );

      const root = container.firstElementChild as HTMLElement;
      expect(root.dataset.count).toBe('2');
      expect(
        [...root.querySelectorAll<HTMLElement>('[data-side]')].map(
          (el) => el.dataset.side,
        ),
      ).toEqual(['top', 'left']);
      expect(screen.getByRole('textbox', { name: 'メール' })).toBeDefined();
    });

    it('部品に必須のプロパティがあれば、型の上でも必須になる', () => {
      const missing = {
        // @ts-expect-error 入れ物の count と、ラベルの partsProps が無い
        element: <LayoutFields value={member} fields={fields} />,
      };
      const wrongLabel: Parameters<
        typeof LayoutFields
      >[0]['partsProps']['label'] = {
        side: 'top',
        // @ts-expect-error side が 'top' のときは alignY を指定できない
        alignY: 'top',
      };

      expect(missing.element).toBeDefined();
      expect(wrongLabel).toBeDefined();
    });
  });
});
