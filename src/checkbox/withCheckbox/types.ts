import type {
  ComponentPropsWithRef,
  CSSProperties,
  ElementType,
  ReactNode,
} from 'react';
import type {
  PartOf,
  PartProps,
  PartsPropsProp,
  PrimaryPartProps,
} from '../../_internal/_parts';
import type { UseCheckboxProps } from '../useCheckbox';

/**
 * `withCheckbox` に組み込む `<label>` の部品が受け取る props
 *
 * `className`・`style`・`partsProps.label` と、`<input>` と文字（`children`）。受け取った props は `<label>` に渡す。
 */
export type CheckboxLabelSlotProps = ComponentPropsWithRef<'label'>;

/**
 * `withCheckbox` に組み込む `<input>` の部品が受け取る props
 *
 * 部品が付ける `type`・`checked`・`onChange`・`ref` などと、利用者の props。受け取った props は `<input>` に渡す
 * （`ref` を渡さないと、`indeterminate` を設定できない）。
 */
export type CheckboxInputSlotProps = ComponentPropsWithRef<'input'>;

/**
 * `withCheckbox` に組み込む部品
 *
 * どれも省略でき、省略すると素の要素で描く。組み込んだ部品の props は、作ったコンポーネントの
 * トップレベル（主要素の `Input`）と `partsProps.label`・`partsProps.input` の型になる。
 */
export type CheckboxParts = {
  /**
   * `<input>` と文字を包む `<label>`（ルート）
   */
  Label?: ElementType;

  /**
   * `<input type="checkbox">`（主要素）
   */
  Input?: ElementType;
};

/**
 * 部品の名前と、部品に渡す props の対応
 */
export type CheckboxSlots = {
  Label: CheckboxLabelSlotProps;
  Input: CheckboxInputSlotProps;
};

/**
 * 部品が決める `<input>` のプロパティ（利用者は渡せない）
 */
type ControlledInputKeys =
  | 'type'
  | 'value'
  | 'defaultValue'
  | 'checked'
  | 'defaultChecked'
  | 'disabled'
  | 'readOnly'
  | 'required'
  | 'children';

type OwnProps = UseCheckboxProps & {
  /**
   * `<input>` の後ろに置く文字
   */
  children?: ReactNode;
};

/**
 * `partsProps` で部品に渡す props
 *
 * @template P 組み込んだ部品
 */
export type CheckboxPartsProps<P = object> = {
  /**
   * `<label>`（ルート）の部品に渡す props
   */
  label: PartProps<PartOf<P, 'Label', 'label'>, 'children'>;

  /**
   * `<input>`（主要素）の部品に渡す props。トップレベルの props と同じ要素に渡すので、部品に必須のプロパティがあってもトップレベルで渡せば省略できる
   */
  input: Partial<PartProps<PartOf<P, 'Input', 'input'>, ControlledInputKeys>>;
};

/**
 * `withCheckbox` で作ったコンポーネント（`Checkbox`）のプロパティ
 *
 * 主要素は `<input>`。`className`・`style` は `<label>` に、それ以外の props（`ref` を含む）は `<input>` に渡すので、
 * トップレベルの残りの props は `<input>` の部品の props になる。`defaultValue` を省略すると、チェックしていない。
 *
 * @template P 組み込んだ部品
 */
export type CheckboxProps<P extends CheckboxParts = object> = OwnProps &
  PartsPropsProp<CheckboxPartsProps<P>> & {
    /**
     * `<label>` に付けるクラス
     */
    className?: string;

    /**
     * `<label>` に付けるスタイル
     */
    style?: CSSProperties;
  } & PrimaryPartProps<
    PartOf<P, 'Input', 'input'>,
    keyof OwnProps | ControlledInputKeys | 'className' | 'style'
  >;
